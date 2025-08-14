import { aiOrchestrator, EnhancedPrompt } from './ai/AIOrchestrationService';
import { PromptQualityScore } from './ai/interfaces/AIProvider';
import { prisma } from '../db';

export interface EnhancementContext {
  projectType: string;
  technologies: string[];
  targetAudience?: string;
  constraints?: string[];
  bestPractices?: string[];
  securityRequirements?: string[];
  performanceTargets?: any;
}

export interface EnhancementResult {
  originalPrompt: string;
  enhancedPrompt: string;
  qualityScore: PromptQualityScore;
  improvements: string[];
  metadata: {
    enhancementTime: number;
    providersUsed: string[];
    costEstimate: number;
  };
}

export class PromptEnhancementEngine {
  /**
   * Analyze context from user answers
   */
  private async analyzeContext(answers: Record<string, any>): Promise<EnhancementContext> {
    const context: EnhancementContext = {
      projectType: answers.projectType || 'general',
      technologies: [],
      constraints: [],
      bestPractices: [],
      securityRequirements: [],
    };

    // Extract technologies
    if (answers.framework) context.technologies.push(answers.framework);
    if (answers.database) context.technologies.push(answers.database);
    if (answers.additionalTech) context.technologies.push(...answers.additionalTech);

    // Extract constraints
    if (answers.timeline) context.constraints.push(`Timeline: ${answers.timeline}`);
    if (answers.budget) context.constraints.push(`Budget: ${answers.budget}`);
    if (answers.performanceTarget) context.constraints.push(`Performance: ${answers.performanceTarget}`);

    // Extract security requirements
    if (answers.authentication) context.securityRequirements.push(`Auth: ${answers.authentication}`);
    if (answers.compliance) context.securityRequirements.push(`Compliance: ${answers.compliance}`);

    // Add project-specific best practices
    if (answers.projectType === 'REST API') {
      context.bestPractices.push(
        'Follow RESTful conventions',
        'Implement proper error handling',
        'Use pagination for list endpoints',
        'Include request/response validation'
      );
    } else if (answers.projectType === 'E-commerce Website') {
      context.bestPractices.push(
        'Implement secure payment processing',
        'Follow PCI DSS compliance',
        'Optimize for mobile devices',
        'Implement proper SEO structure'
      );
    }

    return context;
  }

  /**
   * Inject best practices into the prompt
   */
  private injectBestPractices(prompt: string, context: EnhancementContext): string {
    let enhancedPrompt = prompt;

    // Add best practices section if not present
    if (!prompt.includes('Best Practices')) {
      const bestPracticesSection = `
## Best Practices to Follow
${context.bestPractices.map(bp => `- ${bp}`).join('\n')}
${context.securityRequirements.length > 0 ? '\n## Security Requirements\n' + context.securityRequirements.map(sr => `- ${sr}`).join('\n') : ''}
`;
      enhancedPrompt += bestPracticesSection;
    }

    return enhancedPrompt;
  }

  /**
   * Optimize prompt for specific AI provider
   */
  private optimizeForTarget(prompt: string, targetAI: string): string {
    let optimized = prompt;

    switch (targetAI) {
      case 'claude':
        // Claude prefers structured, clear instructions
        optimized = `<task>
${prompt}
</task>

Please provide a comprehensive solution following all requirements above.`;
        break;

      case 'gpt-4':
        // GPT-4 works well with role-based prompts
        optimized = `You are an expert software architect and developer. 

${prompt}

Provide a detailed, production-ready implementation.`;
        break;

      default:
        // Generic optimization
        optimized = prompt;
    }

    return optimized;
  }

  /**
   * Main enhancement method
   */
  async enhance(
    basePrompt: string,
    answers: Record<string, any>,
    targetQuality: number = 85
  ): Promise<EnhancementResult> {
    const startTime = Date.now();
    
    // Stage 1: Analyze context
    const context = await this.analyzeContext(answers);
    
    // Stage 2: Inject best practices
    let enhancedPrompt = this.injectBestPractices(basePrompt, context);
    
    // Stage 3: AI-powered enhancement (with fallback)
    let aiEnhancement: EnhancedPrompt;
    try {
      aiEnhancement = await aiOrchestrator.optimizePrompt(
        enhancedPrompt,
        context,
        targetQuality
      );
      enhancedPrompt = aiEnhancement.enhanced;
    } catch (error) {
      console.warn('AI enhancement skipped:', error);
      // Create a default enhancement result
      aiEnhancement = {
        original: basePrompt,
        enhanced: enhancedPrompt,
        quality: {
          overall: 70,
          clarity: 70,
          completeness: 70,
          technicalAccuracy: 70,
          bestPractices: 70,
          feedback: ['AI enhancement not available'],
        },
        provider: 'none',
      };
    }
    
    // Stage 4: Optimize for target AI (if specified)
    if (answers.targetAI) {
      enhancedPrompt = this.optimizeForTarget(enhancedPrompt, answers.targetAI);
    }
    
    // Stage 5: Final quality validation (with fallback)
    let finalScore: PromptQualityScore;
    try {
      finalScore = await aiOrchestrator.scorePromptQuality(enhancedPrompt, context);
    } catch (error) {
      console.warn('Quality scoring skipped:', error);
      finalScore = aiEnhancement.quality;
    }
    
    // Calculate improvements
    const improvements = this.identifyImprovements(basePrompt, enhancedPrompt, finalScore);
    
    // Estimate cost
    const costEstimate = aiOrchestrator.estimateCost(enhancedPrompt);
    
    return {
      originalPrompt: basePrompt,
      enhancedPrompt,
      qualityScore: finalScore,
      improvements,
      metadata: {
        enhancementTime: Date.now() - startTime,
        providersUsed: aiOrchestrator.getAvailableProviders(),
        costEstimate,
      },
    };
  }

  /**
   * Identify improvements made to the prompt
   */
  private identifyImprovements(
    original: string,
    enhanced: string,
    score: PromptQualityScore
  ): string[] {
    const improvements: string[] = [];

    // Check length improvement
    if (enhanced.length > original.length * 1.2) {
      improvements.push('Added more detail and context');
    }

    // Check for new sections
    const sections = ['Requirements', 'Best Practices', 'Constraints', 'Security', 'Performance'];
    for (const section of sections) {
      if (!original.includes(section) && enhanced.includes(section)) {
        improvements.push(`Added ${section} section`);
      }
    }

    // Add feedback from quality score
    if (score.feedback && score.feedback.length > 0) {
      improvements.push(...score.feedback.slice(0, 3));
    }

    // Score-based improvements
    if (score.clarity > 80) improvements.push('Improved clarity and specificity');
    if (score.completeness > 80) improvements.push('Ensured comprehensive coverage');
    if (score.technicalAccuracy > 80) improvements.push('Enhanced technical accuracy');
    if (score.bestPractices > 80) improvements.push('Incorporated industry best practices');

    return improvements;
  }

  /**
   * Generate smart follow-up questions based on current answers
   */
  async generateFollowUpQuestions(
    answers: Record<string, any>,
    currentQuestions: any[]
  ): Promise<any[]> {
    // Check if AI providers are available
    const providers = aiOrchestrator.getAvailableProviders();
    if (providers.length === 0) {
      console.warn('No AI providers configured. Returning default follow-up questions.');
      // Return some generic follow-up questions as fallback
      return [
        {
          questionText: "What are the performance requirements for this project?",
          questionType: "TEXT",
          helpText: "Specify any performance targets or constraints"
        },
        {
          questionText: "Are there any specific security requirements?",
          questionType: "TEXT",
          helpText: "List any security considerations or compliance needs"
        },
        {
          questionText: "What is the expected timeline for this project?",
          questionType: "TEXT",
          helpText: "Provide the project timeline or deadline"
        }
      ];
    }

    const prompt = `Based on these project requirements:
${JSON.stringify(answers, null, 2)}

And these questions already asked:
${currentQuestions.map(q => q.questionText).join('\n')}

Generate 3-5 follow-up questions that would help create a better prompt for this project.
Focus on missing information, clarifications needed, and important details not yet covered.

Return as JSON array: [{"questionText": "...", "questionType": "TEXT|SELECT|BOOLEAN", "helpText": "..."}]`;

    try {
      const response = await aiOrchestrator.executePrompt(prompt);
      const questions = JSON.parse(response.content);
      return questions;
    } catch (error) {
      console.error('Failed to generate follow-up questions:', error);
      // Return default questions as fallback
      return [
        {
          questionText: "What are the performance requirements for this project?",
          questionType: "TEXT",
          helpText: "Specify any performance targets or constraints"
        },
        {
          questionText: "Are there any specific security requirements?",
          questionType: "TEXT",
          helpText: "List any security considerations or compliance needs"
        },
        {
          questionText: "What is the expected timeline for this project?",
          questionType: "TEXT",
          helpText: "Provide the project timeline or deadline"
        }
      ];
    }
  }

  /**
   * Validate prompt quality and suggest improvements
   */
  async validateQuality(prompt: string, context?: any): Promise<{
    isValid: boolean;
    score: PromptQualityScore;
    suggestions: string[];
  }> {
    const score = await aiOrchestrator.scorePromptQuality(prompt, context);
    
    const suggestions: string[] = [];
    const threshold = 75;

    if (score.clarity < threshold) {
      suggestions.push('Improve clarity by being more specific about requirements');
    }
    if (score.completeness < threshold) {
      suggestions.push('Add missing information about architecture, testing, or deployment');
    }
    if (score.technicalAccuracy < threshold) {
      suggestions.push('Review technical specifications for accuracy');
    }
    if (score.bestPractices < threshold) {
      suggestions.push('Include more industry best practices and standards');
    }

    return {
      isValid: score.overall >= threshold,
      score,
      suggestions: [...suggestions, ...(score.feedback || [])],
    };
  }
}

// Singleton instance
export const promptEnhancementEngine = new PromptEnhancementEngine();