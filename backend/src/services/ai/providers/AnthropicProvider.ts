import Anthropic from '@anthropic-ai/sdk';
import { 
  AIProvider, 
  AICompletionOptions, 
  AIResponse, 
  AIStreamResponse,
  PromptQualityScore 
} from '../interfaces/AIProvider';

export class AnthropicProvider extends AIProvider {
  private client: Anthropic;

  constructor(apiKey: string, model: string = 'claude-3-opus-20240229') {
    super('anthropic', apiKey, model);
    this.client = new Anthropic({ apiKey });
  }

  async complete(options: AICompletionOptions): Promise<AIResponse> {
    try {
      let prompt = '';
      
      if (options.messages) {
        // Convert messages to Claude format
        const systemMessage = options.messages.find(m => m.role === 'system');
        const userMessages = options.messages.filter(m => m.role !== 'system');
        
        if (systemMessage) {
          prompt = `System: ${systemMessage.content}\n\n`;
        }
        
        prompt += userMessages.map(m => 
          m.role === 'user' ? `Human: ${m.content}` : `Assistant: ${m.content}`
        ).join('\n\n');
        prompt += '\n\nAssistant:';
      } else {
        prompt = `Human: ${options.prompt}\n\nAssistant:`;
      }

      const completion = await this.client.messages.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7,
        stop_sequences: options.stopSequences,
      });

      const content = completion.content[0]?.type === 'text' 
        ? completion.content[0].text 
        : '';

      return {
        content,
        usage: completion.usage ? {
          promptTokens: completion.usage.input_tokens,
          completionTokens: completion.usage.output_tokens,
          totalTokens: completion.usage.input_tokens + completion.usage.output_tokens,
        } : undefined,
        model: completion.model,
        provider: this.name,
      };
    } catch (error) {
      console.error('Anthropic completion error:', error);
      throw new Error(`Anthropic completion failed: ${error}`);
    }
  }

  async stream(options: AICompletionOptions): Promise<AIStreamResponse> {
    try {
      let prompt = '';
      
      if (options.messages) {
        const systemMessage = options.messages.find(m => m.role === 'system');
        const userMessages = options.messages.filter(m => m.role !== 'system');
        
        if (systemMessage) {
          prompt = `System: ${systemMessage.content}\n\n`;
        }
        
        prompt += userMessages.map(m => 
          m.role === 'user' ? `Human: ${m.content}` : `Assistant: ${m.content}`
        ).join('\n\n');
        prompt += '\n\nAssistant:';
      } else {
        prompt = `Human: ${options.prompt}\n\nAssistant:`;
      }

      const stream = await this.client.messages.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7,
        stream: true,
      });

      async function* streamGenerator() {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            yield chunk.delta.text;
          }
        }
      }

      return {
        stream: streamGenerator(),
        provider: this.name,
      };
    } catch (error) {
      console.error('Anthropic stream error:', error);
      throw new Error(`Anthropic stream failed: ${error}`);
    }
  }

  async scorePromptQuality(prompt: string, context?: any): Promise<PromptQualityScore> {
    const scoringPrompt = `
Please analyze this prompt for an AI coding assistant and provide a detailed quality assessment.

Prompt to analyze:
"""
${prompt}
"""

Evaluate the prompt on these criteria (0-100 each):
1. Clarity: Is the prompt clear, specific, and unambiguous?
2. Completeness: Does it include all necessary information and context?
3. Technical Accuracy: Are technical requirements and terminology correct?
4. Best Practices: Does it encourage secure, maintainable, and efficient code?

Provide your response in JSON format:
{
  "overall": <weighted average 0-100>,
  "clarity": <0-100>,
  "completeness": <0-100>,
  "technicalAccuracy": <0-100>,
  "bestPractices": <0-100>,
  "feedback": ["<specific actionable improvement>", ...]
}`;

    const response = await this.complete({
      prompt: scoringPrompt,
      temperature: 0.3,
    });

    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const score = JSON.parse(jsonMatch[0]);
        return score;
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      return {
        overall: 75,
        clarity: 75,
        completeness: 75,
        technicalAccuracy: 75,
        bestPractices: 75,
        feedback: ['Unable to parse quality score from Claude'],
      };
    }
  }

  async enhancePrompt(basePrompt: string, context?: any): Promise<string> {
    const enhancementPrompt = `
You are Claude, an expert at creating highly effective prompts for AI coding assistants.

I need you to enhance this prompt to make it exceptional:

"""
${basePrompt}
"""

${context ? `Additional context: ${JSON.stringify(context)}` : ''}

Please enhance this prompt by:
1. Adding precise technical specifications
2. Clarifying ambiguous requirements
3. Including relevant constraints and edge cases
4. Specifying the expected output format and structure
5. Adding security and performance considerations
6. Ensuring it follows best practices for the technology stack

Return ONLY the enhanced prompt text, without any explanation or commentary.`;

    const response = await this.complete({
      prompt: enhancementPrompt,
      temperature: 0.7,
      maxTokens: 4000,
    });

    return response.content;
  }

  estimateCost(tokens: number): number {
    // Claude 3 Opus pricing (approximate)
    const costPer1000Tokens = 0.015;
    return (tokens / 1000) * costPer1000Tokens;
  }
}