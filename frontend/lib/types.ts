export enum QuestionType {
  TEXT = 'TEXT',
  LONGTEXT = 'LONGTEXT',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  URL = 'URL',
  EMAIL = 'EMAIL',
  RANGE = 'RANGE',
  FILE = 'FILE',
  JSON = 'JSON',
  TECH_STACK = 'TECH_STACK',
  FILE_UPLOAD = 'FILE_UPLOAD',
  PHASE_SELECTOR = 'PHASE_SELECTOR',
}

export interface ProjectType {
  id: string;
  name: string;
  category: string;
  description: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    questions: number;
    projects: number;
  };
}

export interface Question {
  id: string;
  projectTypeId: string;
  questionText: string;
  questionType: QuestionType;
  category?: string;
  phase?: string;           // Question phase (foundation, technical, architecture, etc.)
  phaseOrder?: number;      // Order within the phase
  helpText?: string;
  placeholder?: string;
  options?: Array<string | { value: string; label: string }>;
  validationRules?: any;
  conditionalLogic?: any;
  orderIndex: number;
  isRequired: boolean;
  affectsPromptSection?: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  projectTypeId?: string;
  templateStructure: any;
  variables: any;
  sections: any;
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId?: string;
  projectTypeId: string;
  templateId?: string;
  projectName: string;
  description?: string;
  answers: Record<string, any>;
  generatedPrompt: string;
  promptVersion: string;
  metadata?: any;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  projectType?: ProjectType;
  template?: Template;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Enhanced project description interface
export interface ProjectDescription {
  title: string;
  overview: string;
  targetAudience?: string;
  businessGoals?: string[];
  successMetrics?: string;
  constraints?: string;
}

// Enhanced project interface with project description support
export interface EnhancedProject {
  id?: string;
  projectTypeId: string;
  projectName: string;
  description?: string;
  
  // Enhanced project description fields
  projectOverview?: string;
  targetAudience?: string;
  businessGoals?: string[];
  successMetrics?: string;
  constraints?: string;
  
  answers: Record<string, any>;
  generatedPrompt?: string;
  metadata?: any;
  rating?: number;
  feedback?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Question phases for better organization
export interface QuestionPhase {
  name: string;
  displayName: string;
  description: string;
  questions: Question[];
  order: number;
}

// Enhanced questionnaire flow
export interface QuestionnaireFlow {
  projectType: ProjectType;
  phases: QuestionPhase[];
  currentPhase: number;
  currentQuestion: number;
  totalQuestions: number;
  completedQuestions: number;
  answers: Record<string, any>;
}