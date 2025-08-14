import { PrismaClient, Question, QuestionType } from '@prisma/client';
import { z } from 'zod';

interface QuestionWithLogic extends Question {
  conditionalLogic?: any;
  validationRules?: any;
  options?: any;
}

interface Answer {
  questionId: string;
  value: any;
}

export class QuestionEngine {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Get all questions for a specific project type
   */
  async getQuestionsForProjectType(projectTypeId: string): Promise<QuestionWithLogic[]> {
    const questions = await this.prisma.question.findMany({
      where: {
        projectTypeId,
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });

    return questions as QuestionWithLogic[];
  }

  /**
   * Get questions based on conditional logic and previous answers
   */
  async getConditionalQuestions(
    projectTypeId: string,
    answers: Record<string, any>
  ): Promise<QuestionWithLogic[]> {
    const allQuestions = await this.getQuestionsForProjectType(projectTypeId);
    
    return allQuestions.filter((question) => {
      if (!question.conditionalLogic) return true;
      
      return this.evaluateConditionalLogic(question.conditionalLogic, answers);
    });
  }

  /**
   * Evaluate conditional logic for a question
   */
  private evaluateConditionalLogic(logic: any, answers: Record<string, any>): boolean {
    if (!logic) return true;

    const { type, conditions } = logic;

    if (type === 'AND') {
      return conditions.every((condition: any) => 
        this.evaluateCondition(condition, answers)
      );
    } else if (type === 'OR') {
      return conditions.some((condition: any) => 
        this.evaluateCondition(condition, answers)
      );
    }

    return this.evaluateCondition(logic, answers);
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(condition: any, answers: Record<string, any>): boolean {
    const { questionId, operator, value } = condition;
    const answerValue = answers[questionId];

    if (answerValue === undefined) return false;

    switch (operator) {
      case 'equals':
        return answerValue === value;
      case 'not_equals':
        return answerValue !== value;
      case 'contains':
        return Array.isArray(answerValue) 
          ? answerValue.includes(value)
          : String(answerValue).includes(value);
      case 'greater_than':
        return Number(answerValue) > Number(value);
      case 'less_than':
        return Number(answerValue) < Number(value);
      case 'in':
        return value.includes(answerValue);
      case 'not_in':
        return !value.includes(answerValue);
      default:
        return false;
    }
  }

  /**
   * Validate an answer based on question rules
   */
  async validateAnswer(questionId: string, answer: any): Promise<{ valid: boolean; errors: string[] }> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    }) as QuestionWithLogic;

    if (!question) {
      return { valid: false, errors: ['Question not found'] };
    }

    const errors: string[] = [];

    // Check required
    if (question.isRequired && (answer === null || answer === undefined || answer === '')) {
      errors.push('This field is required');
    }

    // Type-specific validation
    switch (question.questionType) {
      case QuestionType.EMAIL:
        if (answer && !z.string().email().safeParse(answer).success) {
          errors.push('Invalid email address');
        }
        break;

      case QuestionType.URL:
        if (answer && !z.string().url().safeParse(answer).success) {
          errors.push('Invalid URL');
        }
        break;

      case QuestionType.NUMBER:
        if (answer !== null && answer !== undefined) {
          const num = Number(answer);
          if (isNaN(num)) {
            errors.push('Must be a valid number');
          } else if (question.validationRules) {
            const { min, max } = question.validationRules;
            if (min !== undefined && num < min) {
              errors.push(`Must be at least ${min}`);
            }
            if (max !== undefined && num > max) {
              errors.push(`Must be at most ${max}`);
            }
          }
        }
        break;

      case QuestionType.TEXT:
      case QuestionType.TEXTAREA:
        if (answer && question.validationRules) {
          const { minLength, maxLength, pattern } = question.validationRules;
          const str = String(answer);
          
          if (minLength && str.length < minLength) {
            errors.push(`Must be at least ${minLength} characters`);
          }
          if (maxLength && str.length > maxLength) {
            errors.push(`Must be at most ${maxLength} characters`);
          }
          if (pattern) {
            const regex = new RegExp(pattern);
            if (!regex.test(str)) {
              errors.push('Invalid format');
            }
          }
        }
        break;

      case QuestionType.SELECT:
        if (answer && question.options) {
          const validOptions = question.options.map((opt: any) => opt.value);
          if (!validOptions.includes(answer)) {
            errors.push('Invalid selection');
          }
        }
        break;

      case QuestionType.MULTISELECT:
        if (answer && question.options) {
          const validOptions = question.options.map((opt: any) => opt.value);
          if (!Array.isArray(answer)) {
            errors.push('Must be an array');
          } else {
            const invalidSelections = answer.filter(val => !validOptions.includes(val));
            if (invalidSelections.length > 0) {
              errors.push('Invalid selections');
            }
          }
        }
        break;

      case QuestionType.TECH_STACK:
        if (answer && !Array.isArray(answer)) {
          errors.push('Tech stack must be an array');
        }
        break;
    }

    // Custom validation rules
    if (question.validationRules?.custom) {
      try {
        const customValidation = new Function('value', 'answers', question.validationRules.custom);
        const result = customValidation(answer, {});
        if (result !== true) {
          errors.push(typeof result === 'string' ? result : 'Validation failed');
        }
      } catch (e) {
        console.error('Custom validation error:', e);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get next question based on current answers
   */
  async getNextQuestion(
    projectTypeId: string,
    answeredQuestionIds: string[],
    answers: Record<string, any>
  ): Promise<QuestionWithLogic | null> {
    const questions = await this.getConditionalQuestions(projectTypeId, answers);
    
    const unansweredQuestion = questions.find(
      q => !answeredQuestionIds.includes(q.id)
    );

    return unansweredQuestion || null;
  }

  /**
   * Calculate completion percentage
   */
  async calculateCompletion(
    projectTypeId: string,
    answers: Record<string, any>
  ): Promise<number> {
    const questions = await this.getConditionalQuestions(projectTypeId, answers);
    const requiredQuestions = questions.filter(q => q.isRequired);
    
    if (requiredQuestions.length === 0) return 100;

    const answeredRequired = requiredQuestions.filter(
      q => answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== ''
    );

    return Math.round((answeredRequired.length / requiredQuestions.length) * 100);
  }

  /**
   * Get question categories for a project type
   */
  async getQuestionCategories(projectTypeId: string): Promise<string[]> {
    const questions = await this.getQuestionsForProjectType(projectTypeId);
    const categories = new Set(questions.map(q => q.category).filter(Boolean));
    return Array.from(categories) as string[];
  }
}