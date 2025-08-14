import OpenAI from 'openai';
import { 
  AIProvider, 
  AICompletionOptions, 
  AIResponse, 
  AIStreamResponse,
  PromptQualityScore 
} from '../interfaces/AIProvider';

export class OpenAIProvider extends AIProvider {
  private client: OpenAI;

  constructor(apiKey: string, model: string = 'gpt-4-turbo-preview') {
    super('openai', apiKey, model);
    this.client = new OpenAI({ apiKey });
  }

  async complete(options: AICompletionOptions): Promise<AIResponse> {
    try {
      const messages = options.messages || [
        { role: 'user' as const, content: options.prompt || '' }
      ];

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7,
        stop: options.stopSequences,
      });

      return {
        content: completion.choices[0]?.message?.content || '',
        usage: completion.usage ? {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens,
        } : undefined,
        model: completion.model,
        provider: this.name,
      };
    } catch (error) {
      console.error('OpenAI completion error:', error);
      throw new Error(`OpenAI completion failed: ${error}`);
    }
  }

  async stream(options: AICompletionOptions): Promise<AIStreamResponse> {
    try {
      const messages = options.messages || [
        { role: 'user' as const, content: options.prompt || '' }
      ];

      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7,
        stream: true,
      });

      async function* streamGenerator() {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            yield content;
          }
        }
      }

      return {
        stream: streamGenerator(),
        provider: this.name,
      };
    } catch (error) {
      console.error('OpenAI stream error:', error);
      throw new Error(`OpenAI stream failed: ${error}`);
    }
  }

  async scorePromptQuality(prompt: string, context?: any): Promise<PromptQualityScore> {
    const scoringPrompt = `
Analyze the following prompt for an AI coding assistant and provide a quality score.

Prompt to analyze:
"""
${prompt}
"""

Evaluate the prompt on these criteria (0-100 each):
1. Clarity: Is the prompt clear and unambiguous?
2. Completeness: Does it include all necessary information?
3. Technical Accuracy: Are technical requirements correctly specified?
4. Best Practices: Does it encourage good coding practices?

Provide your response in this JSON format:
{
  "overall": <0-100>,
  "clarity": <0-100>,
  "completeness": <0-100>,
  "technicalAccuracy": <0-100>,
  "bestPractices": <0-100>,
  "feedback": ["<specific improvement suggestion 1>", "<suggestion 2>", ...]
}`;

    const response = await this.complete({
      messages: [
        { role: 'system', content: 'You are an expert at evaluating prompts for AI coding assistants.' },
        { role: 'user', content: scoringPrompt }
      ],
      temperature: 0.3,
    });

    try {
      const score = JSON.parse(response.content);
      return score;
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        overall: 75,
        clarity: 75,
        completeness: 75,
        technicalAccuracy: 75,
        bestPractices: 75,
        feedback: ['Unable to parse quality score'],
      };
    }
  }

  async enhancePrompt(basePrompt: string, context?: any): Promise<string> {
    const enhancementPrompt = `
You are an expert at creating prompts for AI coding assistants. Enhance the following prompt to make it more effective.

Original prompt:
"""
${basePrompt}
"""

${context ? `Context: ${JSON.stringify(context)}` : ''}

Enhance this prompt by:
1. Adding clarity and specificity
2. Including relevant best practices
3. Specifying expected output format
4. Adding appropriate constraints and requirements
5. Ensuring technical accuracy

Return ONLY the enhanced prompt, nothing else.`;

    const response = await this.complete({
      messages: [
        { role: 'system', content: 'You are an expert prompt engineer specializing in software development prompts.' },
        { role: 'user', content: enhancementPrompt }
      ],
      temperature: 0.7,
      maxTokens: 4000,
    });

    return response.content;
  }

  estimateCost(tokens: number): number {
    // GPT-4 Turbo pricing (approximate)
    const costPer1000Tokens = this.model.includes('gpt-4') ? 0.03 : 0.002;
    return (tokens / 1000) * costPer1000Tokens;
  }
}