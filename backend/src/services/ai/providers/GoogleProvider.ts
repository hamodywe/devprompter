import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  AIProvider, 
  AICompletionOptions, 
  AIResponse, 
  AIStreamResponse,
  PromptQualityScore 
} from '../interfaces/AIProvider';

export class GoogleProvider extends AIProvider {
  private client: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string, modelName: string = 'gemini-pro') {
    super('google', apiKey, modelName);
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = this.client.getGenerativeModel({ model: modelName });
  }

  async complete(options: AICompletionOptions): Promise<AIResponse> {
    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: options.prompt }] }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          topP: options.topP || 0.8,
          topK: options.topK || 40,
          maxOutputTokens: options.maxTokens || 2048,
        },
      });

      const response = await result.response;
      const text = response.text();

      return {
        content: text,
        finishReason: 'stop',
        tokens: {
          prompt: this.estimateTokens(options.prompt),
          completion: this.estimateTokens(text),
          total: this.estimateTokens(options.prompt) + this.estimateTokens(text)
        },
        model: this.model,
        provider: 'google'
      };
    } catch (error) {
      console.error('Google AI completion error:', error);
      throw new Error(`Google AI completion failed: ${error.message}`);
    }
  }

  async stream(options: AICompletionOptions): Promise<AIStreamResponse> {
    try {
      const result = await this.model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: options.prompt }] }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          topP: options.topP || 0.8,
          topK: options.topK || 40,
          maxOutputTokens: options.maxTokens || 2048,
        },
      });

      return {
        stream: result.stream,
        model: this.model,
        provider: 'google'
      };
    } catch (error) {
      console.error('Google AI streaming error:', error);
      throw new Error(`Google AI streaming failed: ${error.message}`);
    }
  }

  async scorePromptQuality(prompt: string, context?: any): Promise<PromptQualityScore> {
    try {
      const scoringPrompt = `
Analyze this prompt and score it on multiple dimensions (0-100):

PROMPT TO ANALYZE:
${prompt}

CONTEXT: ${JSON.stringify(context || {})}

Rate the prompt on:
1. Clarity (how clear and unambiguous)
2. Completeness (covers all necessary aspects)
3. Technical Accuracy (technically sound requirements)
4. Best Practices (follows industry standards)

Respond in JSON format:
{
  "overall": number,
  "clarity": number,
  "completeness": number,
  "technicalAccuracy": number,
  "bestPractices": number,
  "feedback": ["specific feedback point 1", "point 2"]
}
`;

      const result = await this.complete({
        prompt: scoringPrompt,
        temperature: 0.1,
        maxTokens: 500
      });

      try {
        const parsed = JSON.parse(result.content);
        return {
          overall: parsed.overall || 70,
          clarity: parsed.clarity || 70,
          completeness: parsed.completeness || 70,
          technicalAccuracy: parsed.technicalAccuracy || 70,
          bestPractices: parsed.bestPractices || 70,
          feedback: parsed.feedback || ['Google AI quality analysis']
        };
      } catch (parseError) {
        console.warn('Failed to parse Google quality score, using defaults');
        return {
          overall: 75,
          clarity: 75,
          completeness: 75,
          technicalAccuracy: 75,
          bestPractices: 75,
          feedback: ['Google AI analysis (parsing failed)']
        };
      }
    } catch (error) {
      console.error('Google quality scoring error:', error);
      throw new Error(`Google quality scoring failed: ${error.message}`);
    }
  }

  async enhancePrompt(basePrompt: string, context?: any): Promise<string> {
    try {
      const enhancementPrompt = `
You are an expert prompt engineer. Enhance this prompt to be more effective, clear, and comprehensive.

ORIGINAL PROMPT:
${basePrompt}

CONTEXT: ${JSON.stringify(context || {})}

ENHANCEMENT RULES:
1. Maintain the original intent and requirements
2. Add clarity and structure where needed
3. Include relevant best practices for the project type
4. Ensure technical accuracy
5. Make instructions more actionable
6. Add appropriate constraints and guidelines

RESPOND WITH ONLY THE ENHANCED PROMPT (no explanations):
`;

      const result = await this.complete({
        prompt: enhancementPrompt,
        temperature: 0.3,
        maxTokens: 3000
      });

      return result.content.trim();
    } catch (error) {
      console.error('Google prompt enhancement error:', error);
      // Return original prompt if enhancement fails
      return basePrompt;
    }
  }

  estimateCost(tokens: number): number {
    // Google Gemini Pro pricing (as of 2024)
    // $0.00025 per 1K characters for input
    // $0.0005 per 1K characters for output
    // Rough estimation: 1 token ≈ 4 characters
    const characters = tokens * 4;
    const inputCost = (characters / 1000) * 0.00025;
    const outputCost = (characters / 1000) * 0.0005;
    return inputCost + outputCost;
  }

  private estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English
    return Math.ceil(text.length / 4);
  }
}

