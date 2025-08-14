export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionOptions {
  messages?: AIMessage[];
  prompt?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  stopSequences?: string[];
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
  provider: string;
}

export interface AIStreamResponse {
  stream: AsyncIterable<string>;
  provider: string;
}

export interface PromptQualityScore {
  overall: number; // 0-100
  clarity: number;
  completeness: number;
  technicalAccuracy: number;
  bestPractices: number;
  feedback: string[];
}

export abstract class AIProvider {
  protected name: string;
  protected apiKey: string;
  protected model: string;

  constructor(name: string, apiKey: string, model: string) {
    this.name = name;
    this.apiKey = apiKey;
    this.model = model;
  }

  abstract complete(options: AICompletionOptions): Promise<AIResponse>;
  abstract stream(options: AICompletionOptions): Promise<AIStreamResponse>;
  abstract scorePromptQuality(prompt: string, context?: any): Promise<PromptQualityScore>;
  abstract enhancePrompt(basePrompt: string, context?: any): Promise<string>;
  
  getName(): string {
    return this.name;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  estimateCost(tokens: number): number {
    // Override in specific providers
    return 0;
  }
}