// Load environment variables at the very top
import dotenv from 'dotenv';
dotenv.config();

import { apiKeyManager } from '../services/security/ApiKeyManager';

export interface AIProviderConfig {
  apiKey: string;
  baseURL?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIProviders {
  openai: AIProviderConfig;
  anthropic: AIProviderConfig;
  google: AIProviderConfig;
  groq: AIProviderConfig;
}

// Dynamically get config with secure API key management
export const getAIConfig = (): AIProviders => {
  return {
    openai: {
      apiKey: apiKeyManager.getKey('openai') || process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      maxTokens: 4000,
      temperature: 0.7,
    },
    anthropic: {
      apiKey: apiKeyManager.getKey('anthropic') || process.env.ANTHROPIC_API_KEY || '',
      model: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
      maxTokens: 4000,
      temperature: 0.7,
    },
    google: {
      apiKey: apiKeyManager.getKey('google') || process.env.GOOGLE_AI_API_KEY || '',
      model: process.env.GOOGLE_MODEL || 'gemini-pro',
      maxTokens: 4000,
      temperature: 0.7,
    },
    groq: {
      apiKey: apiKeyManager.getKey('groq') || process.env.GROQ_API_KEY || '',
      model: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
      maxTokens: 1000,
      temperature: 0.7,
    },
  };
};

// Export static config for backward compatibility
export const aiConfig: AIProviders = getAIConfig();

export const isProviderConfigured = (provider: keyof AIProviders): boolean => {
  return apiKeyManager.hasKey(provider) || !!process.env[`${provider.toUpperCase()}_API_KEY`];
};

export const getConfiguredProviders = (): (keyof AIProviders)[] => {
  const providers: (keyof AIProviders)[] = ['openai', 'anthropic', 'google', 'groq'];
  return providers.filter(isProviderConfigured);
};

export default aiConfig;