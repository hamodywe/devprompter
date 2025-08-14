import Groq from 'groq-sdk';
import { 
  AIProvider, 
  AICompletionOptions, 
  AIResponse, 
  AIStreamResponse,
  PromptQualityScore 
} from '../interfaces/AIProvider';

export class GroqProvider extends AIProvider {
  private client: Groq;

  constructor(apiKey: string, modelName: string = 'mixtral-8x7b-32768') {
    super('groq', apiKey, modelName);
    this.client = new Groq({ apiKey });
  }

  async complete(options: AICompletionOptions): Promise<AIResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: options.prompt,
          },
        ],
        model: this.model,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
        top_p: options.topP || 1,
        stream: false,
      });

      const choice = completion.choices[0];
      if (!choice || !choice.message) {
        throw new Error('No response from Groq');
      }

      return {
        content: choice.message.content || '',
        finishReason: choice.finish_reason || 'stop',
        tokens: {
          prompt: completion.usage?.prompt_tokens || 0,
          completion: completion.usage?.completion_tokens || 0,
          total: completion.usage?.total_tokens || 0
        },
        model: this.model,
        provider: 'groq'
      };
    } catch (error) {
      console.error('Groq completion error:', error);
      throw new Error(`Groq completion failed: ${error.message}`);
    }
  }

  async stream(options: AICompletionOptions): Promise<AIStreamResponse> {
    try {
      const stream = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: options.prompt,
          },
        ],
        model: this.model,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
        top_p: options.topP || 1,
        stream: true,
      });

      return {
        stream,
        model: this.model,
        provider: 'groq'
      };
    } catch (error) {
      console.error('Groq streaming error:', error);
      throw new Error(`Groq streaming failed: ${error.message}`);
    }
  }

  async scorePromptQuality(prompt: string, context?: any): Promise<PromptQualityScore> {
    try {
      const scoringPrompt = `
Rate this prompt on multiple quality dimensions (0-100 scale):

PROMPT TO ANALYZE:
${prompt}

CONTEXT: ${JSON.stringify(context || {})}

Evaluate:
1. Clarity: How clear and unambiguous are the instructions?
2. Completeness: Does it cover all necessary requirements?
3. Technical Accuracy: Are technical aspects correct?
4. Best Practices: Does it follow industry standards?

Response format (JSON only):
{
  "overall": 85,
  "clarity": 90,
  "completeness": 80,
  "technicalAccuracy": 85,
  "bestPractices": 85,
  "feedback": ["Clear instructions", "Missing error handling details"]
}
`;

      const result = await this.complete({
        prompt: scoringPrompt,
        temperature: 0.1,
        maxTokens: 400
      });

      try {
        // Extract JSON from response
        const jsonMatch = result.content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          overall: Math.min(100, Math.max(0, parsed.overall || 70)),
          clarity: Math.min(100, Math.max(0, parsed.clarity || 70)),
          completeness: Math.min(100, Math.max(0, parsed.completeness || 70)),
          technicalAccuracy: Math.min(100, Math.max(0, parsed.technicalAccuracy || 70)),
          bestPractices: Math.min(100, Math.max(0, parsed.bestPractices || 70)),
          feedback: Array.isArray(parsed.feedback) ? parsed.feedback : ['Groq AI quality analysis']
        };
      } catch (parseError) {
        console.warn('Failed to parse Groq quality score, using defaults');
        return {
          overall: 75,
          clarity: 75,
          completeness: 75,
          technicalAccuracy: 75,
          bestPractices: 75,
          feedback: ['Groq AI analysis (fast inference)']
        };
      }
    } catch (error) {
      console.error('Groq quality scoring error:', error);
      throw new Error(`Groq quality scoring failed: ${error.message}`);
    }
  }

  async enhancePrompt(basePrompt: string, context?: any): Promise<string> {
    try {
      const enhancementPrompt = `
As an expert prompt engineer, enhance this prompt for maximum effectiveness:

ORIGINAL:
${basePrompt}

CONTEXT: ${JSON.stringify(context || {})}

RULES:
- Keep original intent
- Add structure and clarity
- Include best practices
- Make actionable
- Add constraints

ENHANCED PROMPT (respond with enhanced prompt only):
`;

      const result = await this.complete({
        prompt: enhancementPrompt,
        temperature: 0.2,
        maxTokens: 2500
      });

      return result.content.trim();
    } catch (error) {
      console.error('Groq prompt enhancement error:', error);
      // Return original prompt if enhancement fails
      return basePrompt;
    }
  }

  estimateCost(tokens: number): number {
    // Groq pricing is typically very low or free for many models
    // Mixtral-8x7B is often free or very cheap
    // Conservative estimate: $0.00001 per token
    return tokens * 0.00001;
  }
}

