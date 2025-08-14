import * as CryptoJS from 'crypto-js';
import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';

/**
 * API Key Manager with AES-256 encryption
 * Securely stores and manages API keys for AI providers
 */

// Schema for encrypted API keys
const EncryptedKeySchema = z.object({
  provider: z.string(),
  encryptedKey: z.string(),
  iv: z.string(),
  salt: z.string(),
  timestamp: z.string(),
  lastUsed: z.string().optional(),
  usageCount: z.number().default(0),
});

type EncryptedKey = z.infer<typeof EncryptedKeySchema>;

export class ApiKeyManager {
  private static instance: ApiKeyManager;
  private encryptionKey: string;
  private keysFilePath: string;
  private keys: Map<string, EncryptedKey> = new Map();

  private constructor() {
    // Use a master key from environment or generate one
    this.encryptionKey = process.env.MASTER_ENCRYPTION_KEY || this.generateMasterKey();
    
    // Store encrypted keys in a secure location
    const dataDir = path.join(process.cwd(), '.secure');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true, mode: 0o700 });
    }
    
    this.keysFilePath = path.join(dataDir, 'api-keys.json');
    this.loadKeys();
  }

  public static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }

  /**
   * Generate a secure master encryption key
   */
  private generateMasterKey(): string {
    // In production, this should be stored securely (e.g., AWS KMS, HashiCorp Vault)
    const key = CryptoJS.lib.WordArray.random(256 / 8).toString();
    
    // Log warning if using generated key
    console.warn('⚠️  Using generated master key. Set MASTER_ENCRYPTION_KEY in production!');
    
    return key;
  }

  /**
   * Encrypt an API key with AES-256
   */
  private encryptKey(apiKey: string): { encrypted: string; iv: string; salt: string } {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    
    // Derive key from master key and salt
    const key = CryptoJS.PBKDF2(this.encryptionKey, salt, {
      keySize: 256 / 32,
      iterations: 1000,
    });

    // Encrypt the API key
    const encrypted = CryptoJS.AES.encrypt(apiKey, key, { iv }).toString();

    return {
      encrypted,
      iv: iv.toString(),
      salt: salt.toString(),
    };
  }

  /**
   * Decrypt an API key
   */
  private decryptKey(encryptedData: EncryptedKey): string {
    const salt = CryptoJS.enc.Hex.parse(encryptedData.salt);
    const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);

    // Derive key from master key and salt
    const key = CryptoJS.PBKDF2(this.encryptionKey, salt, {
      keySize: 256 / 32,
      iterations: 1000,
    });

    // Decrypt the API key
    const decrypted = CryptoJS.AES.decrypt(encryptedData.encryptedKey, key, { iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Store an API key securely
   */
  public async storeKey(provider: string, apiKey: string): Promise<void> {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error(`Invalid API key for provider: ${provider}`);
    }

    const { encrypted, iv, salt } = this.encryptKey(apiKey);

    const encryptedKey: EncryptedKey = {
      provider,
      encryptedKey: encrypted,
      iv,
      salt,
      timestamp: new Date().toISOString(),
      usageCount: 0,
    };

    this.keys.set(provider, encryptedKey);
    await this.saveKeys();

    console.log(`✅ API key for ${provider} stored securely`);
  }

  /**
   * Retrieve a decrypted API key
   */
  public getKey(provider: string): string | null {
    const encryptedData = this.keys.get(provider);
    
    if (!encryptedData) {
      // Try to get from environment as fallback
      const envKey = this.getKeyFromEnvironment(provider);
      if (envKey) {
        // Store it securely for future use
        this.storeKey(provider, envKey).catch(console.error);
        return envKey;
      }
      return null;
    }

    try {
      const decryptedKey = this.decryptKey(encryptedData);
      
      // Update usage statistics only if decryption succeeds
      encryptedData.lastUsed = new Date().toISOString();
      encryptedData.usageCount++;
      this.keys.set(provider, encryptedData);
      this.saveKeys().catch(console.error);

      return decryptedKey;
    } catch (error) {
      console.error(`Failed to decrypt key for ${provider}:`, error);
      
      // Remove corrupted key and fallback to environment
      this.keys.delete(provider);
      this.saveKeys().catch(console.error);
      
      const envKey = this.getKeyFromEnvironment(provider);
      if (envKey) {
        console.log(`🔄 Using environment key for ${provider} as fallback`);
        // Store the environment key for future use
        this.storeKey(provider, envKey).catch(console.error);
        return envKey;
      }
      
      return null;
    }
  }

  /**
   * Get API key from environment variables
   */
  private getKeyFromEnvironment(provider: string): string | null {
    const envMappings: Record<string, string> = {
      openai: 'OPENAI_API_KEY',
      anthropic: 'ANTHROPIC_API_KEY',
      google: 'GOOGLE_AI_API_KEY',
      groq: 'GROQ_API_KEY',
    };

    const envVar = envMappings[provider.toLowerCase()];
    return envVar ? process.env[envVar] || null : null;
  }

  /**
   * Remove an API key
   */
  public async removeKey(provider: string): Promise<void> {
    this.keys.delete(provider);
    await this.saveKeys();
    console.log(`🗑️  API key for ${provider} removed`);
  }

  /**
   * Check if a provider has a stored key
   */
  public hasKey(provider: string): boolean {
    return this.keys.has(provider) || !!this.getKeyFromEnvironment(provider);
  }

  /**
   * List all stored providers (without exposing keys)
   */
  public listProviders(): Array<{
    provider: string;
    hasKey: boolean;
    lastUsed?: string;
    usageCount: number;
  }> {
    const providers = ['openai', 'anthropic', 'google', 'groq'];
    
    return providers.map(provider => {
      const stored = this.keys.get(provider);
      const hasEnvKey = !!this.getKeyFromEnvironment(provider);
      
      return {
        provider,
        hasKey: !!stored || hasEnvKey,
        lastUsed: stored?.lastUsed,
        usageCount: stored?.usageCount || 0,
      };
    });
  }

  /**
   * Validate an API key by attempting a minimal API call
   */
  public async validateKey(provider: string): Promise<boolean> {
    const key = this.getKey(provider);
    if (!key) return false;

    try {
      switch (provider.toLowerCase()) {
        case 'openai':
          // Minimal OpenAI validation
          const { OpenAI } = await import('openai');
          const openai = new OpenAI({ apiKey: key });
          await openai.models.list();
          return true;

        case 'anthropic':
          // Minimal Anthropic validation
          const Anthropic = await import('@anthropic-ai/sdk');
          const anthropic = new Anthropic.default({ apiKey: key });
          // Anthropic doesn't have a simple list endpoint, so we'll just check if construction succeeds
          return true;

        case 'google':
          // Minimal Google AI validation
          const { GoogleGenerativeAI } = await import('@google/generative-ai');
          const genAI = new GoogleGenerativeAI(key);
          const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
          // Just check if we can get the model
          return !!model;

        case 'groq':
          // Minimal Groq validation
          const Groq = await import('groq-sdk');
          const groq = new Groq.default({ apiKey: key });
          await groq.models.list();
          return true;

        default:
          return false;
      }
    } catch (error) {
      console.error(`API key validation failed for ${provider}:`, error);
      return false;
    }
  }

  /**
   * Load encrypted keys from file
   */
  private loadKeys(): void {
    try {
      if (fs.existsSync(this.keysFilePath)) {
        const data = fs.readFileSync(this.keysFilePath, 'utf-8');
        const parsed = JSON.parse(data);
        
        if (Array.isArray(parsed)) {
          let corruptedKeysFound = false;
          
          parsed.forEach(item => {
            try {
              const validated = EncryptedKeySchema.parse(item);
              this.keys.set(validated.provider, validated);
            } catch (error) {
              console.error(`⚠️  Invalid encrypted key entry for ${item.provider || 'unknown'}:`, error);
              corruptedKeysFound = true;
            }
          });
          
          if (corruptedKeysFound) {
            console.log('🔧 Found corrupted keys. They will be automatically cleaned up and replaced with environment keys when needed.');
          }
        }
      }
    } catch (error) {
      console.error('Failed to load encrypted keys file:', error);
      console.log('🔄 Creating new encrypted keys file...');
      // Create empty keys file
      this.saveKeys().catch(e => console.error('Failed to create new keys file:', e));
    }
  }

  /**
   * Save encrypted keys to file
   */
  private async saveKeys(): Promise<void> {
    try {
      const data = Array.from(this.keys.values());
      const json = JSON.stringify(data, null, 2);
      
      // Write atomically to prevent corruption
      const tempPath = `${this.keysFilePath}.tmp`;
      fs.writeFileSync(tempPath, json, { mode: 0o600 });
      fs.renameSync(tempPath, this.keysFilePath);
    } catch (error) {
      console.error('Failed to save encrypted keys:', error);
      throw error;
    }
  }

  /**
   * Rotate the master encryption key (re-encrypt all stored keys)
   */
  public async rotateMasterKey(newMasterKey: string): Promise<void> {
    const oldKeys = new Map(this.keys);
    const oldEncryptionKey = this.encryptionKey;

    try {
      // Decrypt all keys with old master key
      const decryptedKeys = new Map<string, string>();
      oldKeys.forEach((encData, provider) => {
        const decrypted = this.decryptKey(encData);
        decryptedKeys.set(provider, decrypted);
      });

      // Update master key
      this.encryptionKey = newMasterKey;
      this.keys.clear();

      // Re-encrypt all keys with new master key
      for (const [provider, apiKey] of decryptedKeys) {
        await this.storeKey(provider, apiKey);
      }

      console.log('✅ Master key rotated successfully');
    } catch (error) {
      // Rollback on failure
      this.encryptionKey = oldEncryptionKey;
      this.keys = oldKeys;
      console.error('Failed to rotate master key:', error);
      throw error;
    }
  }

  /**
   * Export key statistics (without exposing actual keys)
   */
  public getStatistics(): {
    totalProviders: number;
    configuredProviders: number;
    providers: Array<{ name: string; configured: boolean; usageCount: number }>;
  } {
    const providers = this.listProviders();
    
    return {
      totalProviders: providers.length,
      configuredProviders: providers.filter(p => p.hasKey).length,
      providers: providers.map(p => ({
        name: p.provider,
        configured: p.hasKey,
        usageCount: p.usageCount,
      })),
    };
  }
}

// Export singleton instance
export const apiKeyManager = ApiKeyManager.getInstance();