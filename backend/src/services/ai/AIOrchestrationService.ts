import { OpenAIProvider } from './providers/OpenAIProvider';
import { AnthropicProvider } from './providers/AnthropicProvider';
import { GoogleProvider } from './providers/GoogleProvider';
import { GroqProvider } from './providers/GroqProvider';
import { 
  AIProvider, 
  AICompletionOptions, 
  AIResponse,
  AIStreamResponse,
  PromptQualityScore 
} from './interfaces/AIProvider';
import { getAIConfig, getConfiguredProviders } from '../../config/ai.config';
import { cachingService } from '../CachingService';
import { costManagementService } from '../CostManagementService';

export interface EnhancedPrompt {
  original: string;
  enhanced: string;
  quality: PromptQualityScore;
  provider: string;
  metadata?: any;
}

export interface AITask {
  type: 'completion' | 'enhancement' | 'scoring' | 'streaming';
  priority: 'low' | 'medium' | 'high';
  costSensitive: boolean;
  qualityRequired: number; // 0-100
  data: any;
}

export class AIOrchestrationService {
  private providers: Map<string, AIProvider>;
  private primaryProvider: AIProvider | null = null;
  private fallbackProviders: AIProvider[] = [];

  constructor() {
    this.providers = new Map();
    this.initializeProviders();
  }

  private initializeProviders() {
    // Get fresh config with secure API keys
    const config = getAIConfig();
    
    // Initialize OpenAI
    if (config.openai.apiKey) {
      const openai = new OpenAIProvider(config.openai.apiKey, config.openai.model);
      this.providers.set('openai', openai);
      this.primaryProvider = openai;
      console.log('✅ OpenAI provider initialized');
    }

    // Initialize Anthropic
    if (config.anthropic.apiKey) {
      const anthropic = new AnthropicProvider(config.anthropic.apiKey, config.anthropic.model);
      this.providers.set('anthropic', anthropic);
      if (!this.primaryProvider) {
        this.primaryProvider = anthropic;
      } else {
        this.fallbackProviders.push(anthropic);
      }
      console.log('✅ Anthropic provider initialized');
    }

    // Initialize Google
    if (config.google.apiKey) {
      const google = new GoogleProvider(config.google.apiKey, config.google.model);
      this.providers.set('google', google);
      if (!this.primaryProvider) {
        this.primaryProvider = google;
      } else {
        this.fallbackProviders.push(google);
      }
      console.log('✅ Google provider initialized');
    }

    // Initialize Groq
    if (config.groq.apiKey) {
      const groq = new GroqProvider(config.groq.apiKey, config.groq.model);
      this.providers.set('groq', groq);
      if (!this.primaryProvider) {
        this.primaryProvider = groq;
      } else {
        this.fallbackProviders.push(groq);
      }
      console.log('✅ Groq provider initialized');
    }
    
    // Log warning if no providers are configured
    if (this.providers.size === 0) {
      console.warn('⚠️  No AI providers configured. Please set API keys in .env file.');
      console.warn('   Available providers: OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_AI_API_KEY, GROQ_API_KEY');
      console.warn('   See backend/AI_SETUP.md for setup instructions');
    } else {
      console.log(`✅ ${this.providers.size} AI provider(s) initialized successfully`);
    }
  }

  /**
   * Select the optimal provider based on task requirements
   */
  private selectOptimalProvider(task: AITask): AIProvider {
    // If cost sensitive, prefer cheaper providers
    if (task.costSensitive) {
      // TODO: Implement cost-based selection
    }

    // If high quality required, prefer better providers
    if (task.qualityRequired > 85) {
      // Prefer OpenAI or Anthropic for high quality
      if (this.providers.has('anthropic')) {
        return this.providers.get('anthropic')!;
      }
      if (this.providers.has('openai')) {
        return this.providers.get('openai')!;
      }
    }

    // Default to primary provider
    if (this.primaryProvider) {
      return this.primaryProvider;
    }

    throw new Error('No AI providers configured');
  }

  /**
   * Route a task to the optimal provider
   */
  async route(task: AITask): Promise<any> {
    const provider = this.selectOptimalProvider(task);
    
    try {
      switch (task.type) {
        case 'completion':
          return await provider.complete(task.data);
        case 'enhancement':
          return await provider.enhancePrompt(task.data.prompt, task.data.context);
        case 'scoring':
          return await provider.scorePromptQuality(task.data.prompt, task.data.context);
        case 'streaming':
          return await provider.stream(task.data);
        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }
    } catch (error) {
      // Try fallback providers
      for (const fallback of this.fallbackProviders) {
        try {
          switch (task.type) {
            case 'completion':
              return await fallback.complete(task.data);
            case 'enhancement':
              return await fallback.enhancePrompt(task.data.prompt, task.data.context);
            case 'scoring':
              return await fallback.scorePromptQuality(task.data.prompt, task.data.context);
            case 'streaming':
              return await fallback.stream(task.data);
          }
        } catch (fallbackError) {
          console.error(`Fallback provider ${fallback.getName()} failed:`, fallbackError);
        }
      }
      throw error;
    }
  }

  /**
   * Multi-stage prompt optimization using multiple providers with caching
   */
  async optimizePrompt(
    basePrompt: string, 
    context: any,
    targetQuality: number = 85
  ): Promise<EnhancedPrompt> {
    // Check cache first
    const cacheKey = { basePrompt, context, targetQuality };
    const cached = cachingService.get<EnhancedPrompt>('enhancement', cacheKey);
    if (cached) {
      return cached;
    }
    let currentPrompt = basePrompt;
    let bestPrompt = basePrompt;
    let bestScore: PromptQualityScore = {
      overall: 0,
      clarity: 0,
      completeness: 0,
      technicalAccuracy: 0,
      bestPractices: 0,
      feedback: [],
    };
    let lastProvider = '';

    // Stage 1: Enhance with primary provider
    if (this.primaryProvider) {
      try {
        currentPrompt = await this.primaryProvider.enhancePrompt(basePrompt, context);
        const score = await this.primaryProvider.scorePromptQuality(currentPrompt, context);
        
        if (score.overall > bestScore.overall) {
          bestPrompt = currentPrompt;
          bestScore = score;
          lastProvider = this.primaryProvider.getName();
        }

        // If quality target met, cache and return
        if (score.overall >= targetQuality) {
          const result = {
            original: basePrompt,
            enhanced: bestPrompt,
            quality: bestScore,
            provider: lastProvider,
          };
          
          // Cache the result
          cachingService.set('enhancement', cacheKey, result);
          
          // Log cost
          await costManagementService.logUsage({
            provider: lastProvider,
            operation: 'enhancement',
            tokensUsed: this.estimateTokens(basePrompt),
            estimatedCost: costManagementService.estimatePromptCost(basePrompt, lastProvider, 'enhancement')
          });
          
          return result;
        }
      } catch (error) {
        console.error('Primary provider enhancement failed:', error);
      }
    }

    // Stage 2: Try to improve with fallback providers
    for (const provider of this.fallbackProviders) {
      try {
        const enhanced = await provider.enhancePrompt(currentPrompt, context);
        const score = await provider.scorePromptQuality(enhanced, context);
        
        if (score.overall > bestScore.overall) {
          bestPrompt = enhanced;
          bestScore = score;
          lastProvider = provider.getName();
          currentPrompt = enhanced;
        }

        // If quality target met, return
        if (score.overall >= targetQuality) {
          break;
        }
      } catch (error) {
        console.error(`Provider ${provider.getName()} enhancement failed:`, error);
      }
    }

    return {
      original: basePrompt,
      enhanced: bestPrompt,
      quality: bestScore,
      provider: lastProvider,
      metadata: {
        providersUsed: [this.primaryProvider?.getName(), ...this.fallbackProviders.map(p => p.getName())].filter(Boolean),
        iterations: this.fallbackProviders.length + 1,
      }
    };
  }

  /**
   * Score prompt quality using multiple providers and average
   */
  async scorePromptQuality(prompt: string, context?: any): Promise<PromptQualityScore> {
    const scores: PromptQualityScore[] = [];

    // Get scores from all available providers
    for (const [name, provider] of this.providers) {
      try {
        const score = await provider.scorePromptQuality(prompt, context);
        scores.push(score);
      } catch (error) {
        console.error(`Provider ${name} scoring failed:`, error);
      }
    }

    if (scores.length === 0) {
      // Return a default score when no providers are available
      console.warn('No AI providers available for scoring. Using default scores.');
      return {
        overall: 70,
        clarity: 70,
        completeness: 70,
        technicalAccuracy: 70,
        bestPractices: 70,
        feedback: ['AI providers not configured. Unable to provide detailed scoring.'],
      };
    }

    // Average the scores
    const avgScore: PromptQualityScore = {
      overall: scores.reduce((sum, s) => sum + s.overall, 0) / scores.length,
      clarity: scores.reduce((sum, s) => sum + s.clarity, 0) / scores.length,
      completeness: scores.reduce((sum, s) => sum + s.completeness, 0) / scores.length,
      technicalAccuracy: scores.reduce((sum, s) => sum + s.technicalAccuracy, 0) / scores.length,
      bestPractices: scores.reduce((sum, s) => sum + s.bestPractices, 0) / scores.length,
      feedback: scores.flatMap(s => s.feedback),
    };

    return avgScore;
  }

  /**
   * Execute prompt and get results
   */
  async executePrompt(
    prompt: string,
    provider?: string,
    options?: AICompletionOptions
  ): Promise<AIResponse> {
    const selectedProvider = provider && this.providers.has(provider) 
      ? this.providers.get(provider)!
      : this.primaryProvider;

    if (!selectedProvider) {
      console.error('No AI provider available. Please configure at least one provider in .env file.');
      throw new Error('No AI provider available. Please configure API keys in .env file.');
    }

    return await selectedProvider.complete({
      prompt,
      ...options,
    });
  }

  /**
   * Stream prompt execution results
   */
  async streamPromptExecution(
    prompt: string,
    provider?: string,
    options?: AICompletionOptions
  ): Promise<AIStreamResponse> {
    const selectedProvider = provider && this.providers.has(provider) 
      ? this.providers.get(provider)!
      : this.primaryProvider;

    if (!selectedProvider) {
      console.error('No AI provider available. Please configure at least one provider in .env file.');
      throw new Error('No AI provider available. Please configure API keys in .env file.');
    }

    return await selectedProvider.stream({
      prompt,
      ...options,
    });
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Estimate cost for a prompt
   */
  estimateCost(prompt: string, provider?: string): number {
    const selectedProvider = provider && this.providers.has(provider) 
      ? this.providers.get(provider)!
      : this.primaryProvider;

    if (!selectedProvider) {
      return 0;
    }

    // Rough estimate: 1 token ≈ 4 characters
    const estimatedTokens = Math.ceil(prompt.length / 4);
    return selectedProvider.estimateCost(estimatedTokens);
  }

  /**
   * Estimate tokens for cost calculation
   */
  private estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English
    return Math.ceil(text.length / 4);
  }

  /**
   * Get provider failover with automatic switching
   */
  async executeWithFailover<T>(
    operation: (provider: AIProvider) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    const providers = [this.primaryProvider, ...this.fallbackProviders].filter(Boolean);
    
    for (let i = 0; i < Math.min(maxRetries, providers.length); i++) {
      try {
        const provider = providers[i];
        if (!provider) continue;
        
        console.log(`🔄 Attempting with ${provider.getName()} (attempt ${i + 1})`);
        const result = await operation(provider);
        
        if (i > 0) {
          console.log(`✅ Failover successful with ${provider.getName()}`);
        }
        
        return result;
      } catch (error) {
        console.error(`❌ Provider ${providers[i]?.getName()} failed:`, error);
        if (i === providers.length - 1) {
          throw new Error(`All providers failed. Last error: ${error.message}`);
        }
      }
    }
    
    throw new Error('No providers available for failover');
  }

  /**
   * Get system status and metrics
   */
  getSystemStatus() {
    const cacheStats = cachingService.getStats();
    const configuredProviders = getConfiguredProviders();
    
    return {
      providers: {
        total: this.providers.size,
        configured: configuredProviders,
        primary: this.primaryProvider?.getName() || 'none',
        fallbacks: this.fallbackProviders.map(p => p.getName())
      },
      cache: cacheStats,
      status: this.providers.size > 0 ? 'operational' : 'no_providers',
      recommendations: costManagementService.getCostOptimizationRecommendations()
    };
  }
}

// Singleton instance
export const aiOrchestrator = new AIOrchestrationService();