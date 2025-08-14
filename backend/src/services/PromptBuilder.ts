import { PrismaClient, Template, ProjectType } from '@prisma/client';

interface PromptSection {
  name: string;
  content: string;
  order: number;
}

interface BuilderOptions {
  format?: 'detailed' | 'concise' | 'step-by-step' | 'multi-stage';
  includeBestPractices?: boolean;
  includeConstraints?: boolean;
  includeExamples?: boolean;
}

interface PromptStage {
  stage: number;
  title: string;
  description: string;
  prompt: string;
  dependencies?: number[];
  estimatedTime?: string;
}

interface MultiStagePromptResult {
  overview: string;
  stages: PromptStage[];
  totalStages: number;
  estimatedTotalTime: string;
}

export class PromptBuilder {
  private prisma: PrismaClient;
  private template: any;
  private answers: Record<string, any>;
  private projectType: ProjectType | null = null;
  private sections: PromptSection[] = [];

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Initialize the builder with a template and answers
   */
  async initialize(
    templateId: string,
    projectTypeId: string,
    answers: Record<string, any>
  ): Promise<void> {
    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new Error('Template not found');
    }

    this.template = template;
    this.answers = answers;

    this.projectType = await this.prisma.projectType.findUnique({
      where: { id: projectTypeId },
    });
  }

  /**
   * Build the complete prompt with enhanced structure
   * Creates well-organized, AI-optimized prompts ready for execution
   */
  async buildPrompt(options: BuilderOptions = {}): Promise<string | MultiStagePromptResult> {
    const {
      format = 'detailed',
      includeBestPractices = true,
      includeConstraints = true,
      includeExamples = false,
    } = options;

    // If multi-stage format is requested, generate stage-based prompts
    if (format === 'multi-stage') {
      return this.buildMultiStagePrompts(options);
    }

    // Clear existing sections
    this.sections = [];

    // Build sections in logical order for AI consumption
    this.buildPromptHeader();
    this.buildProjectOverviewSection();
    this.buildStrategicContextSection();
    this.buildTechnicalArchitectureSection();
    this.buildSecurityRequirementsSection();
    this.buildFunctionalRequirementsSection();
    this.buildPerformanceRequirementsSection();
    
    if (includeConstraints) {
      this.buildConstraintsSection();
    }
    
    if (includeBestPractices) {
      this.buildBestPracticesSection();
    }
    
    this.buildQualityAssuranceSection();
    this.buildDeploymentStrategySection();
    this.buildMonitoringSection();
    
    if (includeExamples) {
      this.buildExamplesSection();
    }
    
    this.buildExecutionInstructionsSection(format);
    this.buildOutputSpecificationSection();
    this.buildValidationCriteriaSection();

    // Combine sections with proper formatting
    return this.combineSections();
  }

  /**
   * Build multi-stage prompt chain for step-by-step development
   */
  private buildMultiStagePrompts(options: BuilderOptions): MultiStagePromptResult {
    const projectType = this.projectType?.name || 'application';
    const projectName = this.answers.projectName || 'the application';
    
    const stages: PromptStage[] = [
      this.buildStage1_ProjectAnalysis(),
      this.buildStage2_TechStackRecommendation(),
      this.buildStage3_ProjectStructure(),
      this.buildStage4_DatabaseDesign(),
      this.buildStage5_CoreImplementation(),
      this.buildStage6_APIDocumentation(),
      this.buildStage7_SecurityImplementation(),
      this.buildStage8_TestingStrategy(),
      this.buildStage9_DeploymentSetup(),
      this.buildStage10_OptimizationAndMonitoring()
    ];

    const overview = `# 🚀 Multi-Stage Development Plan: ${projectName}

## 📋 Overview
This development plan breaks down the creation of your **${projectType}** into **${stages.length} independent stages**. Each stage produces specific deliverables and can be executed separately with any AI coding assistant.

## 🎯 Execution Instructions
1. **Copy each prompt individually** and paste into your AI coding assistant
2. **Complete each stage in order** - some stages depend on previous outputs
3. **Review and validate** each stage's output before proceeding
4. **Customize as needed** - modify prompts based on your specific requirements

---`;

    return {
      overview,
      stages,
      totalStages: stages.length,
      estimatedTotalTime: '4-8 hours'
    };
  }

  /**
   * Build prompt header with clear instructions for AI
   */
  private buildPromptHeader(): void {
    const projectName = this.answers.projectName || this.answers.title || 'the application';
    const projectType = this.projectType?.name || 'application';
    
    const header = `# 🎯 ${projectType} Development Project: ${projectName}

## 📋 Executive Summary
You are an expert software architect and senior developer. Your task is to create a comprehensive, production-ready implementation plan for a ${projectType.toLowerCase()} project. 

The generated output should be:
- **Immediately executable** by any AI coding assistant
- **Well-structured** with clear phases and deliverables  
- **Production-ready** with proper architecture, security, and best practices
- **Comprehensive** covering all aspects from setup to deployment

---`;
    
    this.sections.push({
      name: 'header',
      content: header,
      order: 1,
    });
  }

  /**
   * Build project overview section with strategic context
   */
  private buildProjectOverviewSection(): void {
    const overview = this.answers.projectOverview || this.answers.description || '';
    const targetAudience = this.answers.targetAudience || '';
    const businessGoals = this.answers.businessGoals || [];
    
    let content = `## 📖 Project Overview\n\n`;
    
    if (overview) {
      content += `**Project Description:**\n${overview}\n\n`;
    }
    
    if (targetAudience) {
      content += `**Target Audience:** ${targetAudience}\n\n`;
    }
    
    if (businessGoals && businessGoals.length > 0) {
      content += `**Business Objectives:**\n${businessGoals.map((goal: string) => `- ${goal}`).join('\n')}\n\n`;
    }

    if (this.answers.successMetrics) {
      content += `**Success Metrics:** ${this.answers.successMetrics}\n\n`;
    }

    this.sections.push({
      name: 'projectOverview',
      content,
      order: 2,
    });
  }

  /**
   * Build strategic context section
   */
  private buildStrategicContextSection(): void {
    const consumers = this.answers.apiConsumers || this.answers.targetUsers || [];
    const scale = this.answers.expectedScale || this.answers.expectedUsers || '';
    
    let content = `## 🎯 Strategic Context\n\n`;
    
    if (consumers && consumers.length > 0) {
      content += `**Primary Users/Consumers:**\n${consumers.map((consumer: string) => `- ${consumer}`).join('\n')}\n\n`;
    }
    
    if (scale) {
      content += `**Expected Scale:** ${scale}\n\n`;
    }

    if (this.answers.constraints) {
      content += `**Project Constraints:** ${this.answers.constraints}\n\n`;
    }

    this.sections.push({
      name: 'strategicContext',
      content,
      order: 3,
    });
  }

  /**
   * Build the project type section
   */
  private buildProjectTypeSection(): void {
    if (!this.projectType) return;

    const section = `## Project Type
${this.projectType.name}${this.projectType.description ? '\n' + this.projectType.description : ''}`;

    this.sections.push({
      name: 'projectType',
      content: section,
      order: 2,
    });
  }

  /**
   * Build the requirements section
   */
  private buildRequirementsSection(): void {
    const requirements: string[] = [];

    // Process answers to extract requirements
    if (this.answers.primaryPurpose) {
      requirements.push(`Primary Purpose: ${this.answers.primaryPurpose}`);
    }

    if (this.answers.targetAudience) {
      requirements.push(`Target Audience: ${this.answers.targetAudience}`);
    }

    if (this.answers.expectedUsers) {
      requirements.push(`Expected User Load: ${this.answers.expectedUsers} concurrent users`);
    }

    if (this.answers.dataVolume) {
      requirements.push(`Data Volume: ${this.answers.dataVolume}`);
    }

    if (requirements.length > 0) {
      const section = `## Core Requirements
${requirements.map(r => `- ${r}`).join('\n')}`;

      this.sections.push({
        name: 'requirements',
        content: section,
        order: 3,
      });
    }
  }

  /**
   * Build technical architecture section with detailed specifications
   */
  private buildTechnicalArchitectureSection(): void {
    let content = `## 🏗️ Technical Architecture\n\n`;

    // Core Technology Stack
    content += `### Core Technology Stack\n`;
    
    if (this.answers.framework) {
      content += `- **Framework:** ${this.answers.framework}\n`;
    }

    if (this.answers.database) {
      content += `- **Database:** ${this.answers.database}\n`;
    }

    if (this.answers.authentication) {
      content += `- **Authentication:** ${this.answers.authentication}\n`;
    }

    if (this.answers.styling) {
      content += `- **Styling:** ${this.answers.styling}\n`;
    }

    if (this.answers.additionalTech && Array.isArray(this.answers.additionalTech)) {
      content += `- **Additional Technologies:** ${this.answers.additionalTech.join(', ')}\n`;
    }

    content += `\n`;

    // Architecture Patterns
    if (this.answers.architecturePattern) {
      content += `### Architecture Pattern\n- ${this.answers.architecturePattern}\n\n`;
    }

    // API Design
    if (this.answers.apiVersioning) {
      content += `### API Design\n- **Versioning Strategy:** ${this.answers.apiVersioning}\n`;
    }

    if (this.answers.documentation) {
      content += `- **Documentation:** ${this.answers.documentation}\n`;
    }

    content += `\n`;

    this.sections.push({
      name: 'technicalArchitecture',
      content,
      order: 4,
    });
  }

  /**
   * Build security requirements section
   */
  private buildSecurityRequirementsSection(): void {
    let content = `## 🔒 Security Requirements\n\n`;

    if (this.answers.authentication) {
      content += `### Authentication & Authorization\n- **Method:** ${this.answers.authentication}\n\n`;
    }

    if (this.answers.securityFeatures && Array.isArray(this.answers.securityFeatures)) {
      content += `### Security Measures\n`;
      this.answers.securityFeatures.forEach((feature: string) => {
        content += `- ${feature}\n`;
      });
      content += `\n`;
    }

    // Security compliance
    if (this.answers.compliance) {
      content += `### Compliance Requirements\n- ${this.answers.compliance}\n\n`;
    }

    this.sections.push({
      name: 'securityRequirements',
      content,
      order: 5,
    });
  }

  /**
   * Build functional requirements section
   */
  private buildFunctionalRequirementsSection(): void {
    let content = `## ⚙️ Functional Requirements\n\n`;

    // Core features
    if (this.answers.coreFeatures && Array.isArray(this.answers.coreFeatures)) {
      content += `### Core Features\n`;
      this.answers.coreFeatures.forEach((feature: string, index: number) => {
        content += `${index + 1}. ${feature}\n`;
      });
      content += `\n`;
    }

    // Additional features based on project type
    if (this.projectType?.name === 'E-commerce Platform') {
      if (this.answers.paymentProviders) {
        content += `### E-commerce Specific\n- **Payment Providers:** ${this.answers.paymentProviders}\n`;
      }
      if (this.answers.inventoryManagement === true) {
        content += `- **Inventory Management:** Required\n`;
      }
      if (this.answers.multiVendor === true) {
        content += `- **Multi-vendor Support:** Required\n`;
      }
      content += `\n`;
    }

    if (this.projectType?.name === 'REST API') {
      if (this.answers.apiVersioning) {
        content += `### API Specific\n- **Versioning:** ${this.answers.apiVersioning}\n`;
      }
      if (this.answers.rateLimiting) {
        content += `- **Rate Limiting:** Required\n`;
      }
      content += `\n`;
    }

    this.sections.push({
      name: 'functionalRequirements',
      content,
      order: 6,
    });
  }

  /**
   * Build performance requirements section
   */
  private buildPerformanceRequirementsSection(): void {
    let content = `## 🚀 Performance Requirements\n\n`;

    if (this.answers.expectedScale) {
      content += `- **Expected Scale:** ${this.answers.expectedScale}\n`;
    }

    if (this.answers.performanceTarget) {
      content += `- **Performance Target:** ${this.answers.performanceTarget}\n`;
    }

    if (this.answers.responseTime) {
      content += `- **Response Time:** ${this.answers.responseTime}\n`;
    }

    if (this.answers.concurrentUsers) {
      content += `- **Concurrent Users:** ${this.answers.concurrentUsers}\n`;
    }

    content += `\n`;

    this.sections.push({
      name: 'performanceRequirements',
      content,
      order: 7,
    });
  }

  /**
   * Build the features section
   */
  private buildFeaturesSection(): void {
    const features: string[] = [];

    // Core features
    if (this.answers.coreFeatures && Array.isArray(this.answers.coreFeatures)) {
      features.push(...this.answers.coreFeatures);
    }

    // Additional features based on project type
    if (this.projectType?.name === 'E-commerce Website') {
      if (this.answers.paymentProviders) {
        features.push(`Payment processing with ${this.answers.paymentProviders}`);
      }
      if (this.answers.inventoryManagement === true) {
        features.push('Inventory management system');
      }
      if (this.answers.multiVendor === true) {
        features.push('Multi-vendor marketplace support');
      }
    }

    if (this.projectType?.name === 'REST API') {
      if (this.answers.apiVersioning === true) {
        features.push('API versioning');
      }
      if (this.answers.rateLimiting === true) {
        features.push('Rate limiting');
      }
      if (this.answers.documentation) {
        features.push(`API documentation (${this.answers.documentation})`);
      }
    }

    if (features.length > 0) {
      const section = `## Core Features
${features.map((f, i) => `${i + 1}. ${f}`).join('\n')}`;

      this.sections.push({
        name: 'features',
        content: section,
        order: 5,
      });
    }
  }

  /**
   * Build the constraints section
   */
  private buildConstraintsSection(): void {
    const constraints: string[] = [];

    // Performance constraints
    if (this.answers.performanceTarget) {
      constraints.push(`Performance: ${this.answers.performanceTarget}`);
    }

    // Security constraints
    if (this.answers.securityRequirements) {
      constraints.push(`Security: ${this.answers.securityRequirements}`);
    }

    // Compliance
    if (this.answers.compliance) {
      constraints.push(`Compliance: ${this.answers.compliance}`);
    }

    // Budget
    if (this.answers.budget) {
      constraints.push(`Budget: ${this.answers.budget}`);
    }

    // Timeline
    if (this.answers.timeline) {
      constraints.push(`Timeline: ${this.answers.timeline}`);
    }

    // Platform constraints
    if (this.answers.platformConstraints) {
      constraints.push(`Platform: ${this.answers.platformConstraints}`);
    }

    if (constraints.length > 0) {
      const section = `## Constraints & Requirements
${constraints.map(c => `- ${c}`).join('\n')}`;

      this.sections.push({
        name: 'constraints',
        content: section,
        order: 6,
      });
    }
  }

  /**
   * Build the best practices section
   */
  private buildBestPracticesSection(): void {
    const practices: string[] = [];

    // Based on project type
    if (this.projectType?.name === 'REST API') {
      practices.push('Follow RESTful conventions');
      practices.push('Implement proper error handling with standardized error responses');
      practices.push('Use pagination for list endpoints');
      practices.push('Include request/response validation');
    }

    if (this.projectType?.name === 'E-commerce Website') {
      practices.push('Implement secure payment processing');
      practices.push('Follow PCI DSS compliance guidelines');
      practices.push('Optimize for mobile devices');
      practices.push('Implement proper SEO structure');
    }

    // General best practices
    practices.push('Write clean, maintainable code with proper documentation');
    practices.push('Implement comprehensive error handling and logging');
    practices.push('Follow security best practices (input validation, authentication, authorization)');
    practices.push('Include unit and integration tests');

    if (practices.length > 0) {
      const section = `## Best Practices to Follow
${practices.map(p => `- ${p}`).join('\n')}`;

      this.sections.push({
        name: 'bestPractices',
        content: section,
        order: 7,
      });
    }
  }

  /**
   * Build examples section
   */
  private buildExamplesSection(): void {
    const examples: string[] = [];

    // Add relevant examples based on project type
    if (this.projectType?.name === 'REST API') {
      examples.push('Example endpoint: GET /api/v1/users');
      examples.push('Example response: { "data": [...], "pagination": {...} }');
    }

    if (examples.length > 0) {
      const section = `## Examples
${examples.join('\n')}`;

      this.sections.push({
        name: 'examples',
        content: section,
        order: 8,
      });
    }
  }

  /**
   * Build quality assurance section
   */
  private buildQualityAssuranceSection(): void {
    let content = `## ✅ Quality Assurance\n\n`;

    content += `### Testing Strategy\n`;
    content += `- **Unit Tests:** Comprehensive test coverage for core functionality\n`;
    content += `- **Integration Tests:** End-to-end testing of API endpoints\n`;
    content += `- **Performance Tests:** Load testing and benchmarking\n`;
    content += `- **Security Tests:** Vulnerability scanning and penetration testing\n\n`;

    content += `### Code Quality Standards\n`;
    content += `- **Code Reviews:** Mandatory peer review process\n`;
    content += `- **Linting:** Automated code style enforcement\n`;
    content += `- **Documentation:** Comprehensive inline and API documentation\n`;
    content += `- **Error Handling:** Proper exception handling and logging\n\n`;

    this.sections.push({
      name: 'qualityAssurance',
      content,
      order: 8,
    });
  }

  /**
   * Build deployment strategy section
   */
  private buildDeploymentStrategySection(): void {
    let content = `## 🚀 Deployment Strategy\n\n`;

    if (this.answers.deployment) {
      content += `### Target Platform\n- **Platform:** ${this.answers.deployment}\n\n`;
    }

    content += `### Deployment Requirements\n`;
    content += `- **Environment Configuration:** Development, staging, and production environments\n`;
    content += `- **CI/CD Pipeline:** Automated build, test, and deployment pipeline\n`;
    content += `- **Infrastructure as Code:** Version-controlled infrastructure setup\n`;
    content += `- **Monitoring:** Application and infrastructure monitoring\n\n`;

    if (this.answers.containerization) {
      content += `### Containerization\n- **Approach:** ${this.answers.containerization}\n\n`;
    }

    this.sections.push({
      name: 'deploymentStrategy',
      content,
      order: 9,
    });
  }

  /**
   * Build monitoring section
   */
  private buildMonitoringSection(): void {
    let content = `## 📊 Monitoring & Observability\n\n`;

    if (this.answers.monitoring && Array.isArray(this.answers.monitoring)) {
      content += `### Required Monitoring Features\n`;
      this.answers.monitoring.forEach((feature: string) => {
        content += `- ${feature}\n`;
      });
      content += `\n`;
    } else {
      content += `### Standard Monitoring Features\n`;
      content += `- **Application Metrics:** Performance, errors, and usage statistics\n`;
      content += `- **Infrastructure Metrics:** Server health, resource utilization\n`;
      content += `- **Logging:** Structured logging with log aggregation\n`;
      content += `- **Alerting:** Automated alerts for critical issues\n\n`;
    }

    this.sections.push({
      name: 'monitoring',
      content,
      order: 10,
    });
  }

  /**
   * Build execution instructions section
   */
  private buildExecutionInstructionsSection(format: string): void {
    let content = `## 🎯 Implementation Instructions\n\n`;

    content += `### Development Approach\n`;
    content += `You are instructed to create a **${format}** implementation that includes:\n\n`;

    switch (format) {
      case 'detailed':
        content += `1. **Complete Project Structure** - Full directory structure with all necessary files\n`;
        content += `2. **Step-by-Step Implementation** - Detailed implementation guide with code examples\n`;
        content += `3. **Database Design** - Complete schema with relationships and indexes\n`;
        content += `4. **API Documentation** - Comprehensive endpoint documentation\n`;
        content += `5. **Security Implementation** - Detailed security measures and configurations\n`;
        content += `6. **Testing Strategy** - Complete test suites and testing guidelines\n`;
        content += `7. **Deployment Guide** - Production deployment instructions\n`;
        content += `8. **Performance Optimization** - Performance tuning recommendations\n\n`;
        break;

      case 'concise':
        content += `1. **Project Structure** - Essential files and directories\n`;
        content += `2. **Core Implementation** - Key components and functionality\n`;
        content += `3. **Basic Setup** - Quick start guide\n`;
        content += `4. **Deployment Basics** - Simple deployment instructions\n\n`;
        break;

      case 'step-by-step':
        content += `### Implementation Phases\n`;
        content += `**Phase 1:** Project setup and environment configuration\n`;
        content += `**Phase 2:** Database design and implementation\n`;
        content += `**Phase 3:** Core functionality development\n`;
        content += `**Phase 4:** API/Interface implementation\n`;
        content += `**Phase 5:** Testing and validation\n`;
        content += `**Phase 6:** Deployment and monitoring setup\n\n`;
        break;
    }

    this.sections.push({
      name: 'executionInstructions',
      content,
      order: 11,
    });
  }

  /**
   * Build output specification section
   */
  private buildOutputSpecificationSection(): void {
    const content = `## 📝 Required Deliverables

### Code Structure
- **Clean Architecture:** Well-organized, maintainable code structure
- **Production-Ready:** Error handling, logging, and monitoring included
- **Best Practices:** Industry-standard patterns and conventions
- **Documentation:** Comprehensive README and inline documentation

### Implementation Details
- **Immediate Execution:** All code should be ready to run without modifications
- **Environment Setup:** Clear instructions for development environment
- **Dependencies:** Complete dependency management and installation guide
- **Configuration:** Environment-specific configuration management

### Quality Standards
- **Security:** Implementation of all specified security measures
- **Performance:** Optimized for specified performance requirements
- **Scalability:** Architecture designed for expected scale
- **Maintainability:** Clean, well-documented, and testable code

---`;

    this.sections.push({
      name: 'outputSpecification',
      content,
      order: 12,
    });
  }

  /**
   * Build validation criteria section
   */
  private buildValidationCriteriaSection(): void {
    const content = `## ✨ Success Criteria

The implementation will be considered successful when it meets these criteria:

### Functional Validation
- ✅ All specified features are implemented and working
- ✅ API endpoints respond correctly with proper error handling
- ✅ Security measures are properly implemented and tested
- ✅ Performance requirements are met under load testing

### Code Quality Validation
- ✅ Code follows clean architecture principles
- ✅ Comprehensive test coverage (>80%)
- ✅ Documentation is complete and accurate
- ✅ No security vulnerabilities detected

### Deployment Validation
- ✅ Application deploys successfully to target environment
- ✅ All dependencies are properly configured
- ✅ Monitoring and logging are operational
- ✅ Backup and recovery procedures are documented

**Remember:** Generate production-ready code that can be immediately executed by any AI coding assistant or developer. Focus on clarity, completeness, and professional implementation standards.`;

    this.sections.push({
      name: 'validationCriteria',
      content,
      order: 13,
    });
  }

  /**
   * Build the closing section
   */
  private buildClosingSection(): void {
    const closing = `
Please ensure all code follows industry best practices, is well-commented, and includes proper error handling. 
The implementation should be scalable, maintainable, and secure.`;

    this.sections.push({
      name: 'closing',
      content: closing,
      order: 10,
    });
  }

  /**
   * Combine all sections into final prompt with enhanced formatting
   */
  private combineSections(): string {
    // Sort sections by order
    const sortedSections = this.sections.sort((a, b) => a.order - b.order);
    
    // Combine with proper spacing and enhanced formatting
    const prompt = sortedSections.map(s => s.content).join('\n\n');
    
    // Add final formatting touches
    return prompt + '\n\n---\n\n**🚀 Ready to begin implementation!**';
  }

  /**
   * Add custom section
   */
  addCustomSection(name: string, content: string, order: number): void {
    this.sections.push({
      name,
      content,
      order,
    });
  }

  /**
   * Replace variables in template
   */
  private replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value));
    });
    
    return result;
  }

  /**
   * Get prompt preview
   */
  getPreview(maxLength: number = 500): string {
    const fullPrompt = this.combineSections();
    if (fullPrompt.length <= maxLength) {
      return fullPrompt;
    }
    return fullPrompt.substring(0, maxLength) + '...';
  }

  /**
   * Get prompt metadata
   */
  getMetadata(): Record<string, any> {
    return {
      sectionsCount: this.sections.length,
      totalLength: this.combineSections().length,
      projectType: this.projectType?.name,
      timestamp: new Date().toISOString(),
    };
  }

  // ===== MULTI-STAGE PROMPT BUILDERS =====

  private buildStage1_ProjectAnalysis(): PromptStage {
    const projectType = this.projectType?.name || '{project_type}';
    const projectDescription = this.answers.projectOverview || '{project_description}';
    
    return {
      stage: 1,
      title: 'Project Analysis & Requirements',
      description: 'Analyze project requirements and define scope',
      estimatedTime: '15-20 minutes',
      prompt: `# 📋 Stage 1: Project Analysis & Requirements

You are a senior software architect. Analyze this project and provide a comprehensive requirements analysis.

## Project Details
- **Type**: ${projectType}
- **Description**: ${projectDescription}
- **Target Audience**: ${this.answers.targetAudience || 'General users'}
- **Expected Scale**: ${this.answers.expectedScale || 'Medium scale'}

## Your Task
Provide a detailed analysis including:

### 1. Functional Requirements
- List all core features and functionalities
- Define user stories and use cases
- Identify key workflows and processes

### 2. Non-Functional Requirements
- Performance requirements and benchmarks
- Security and compliance needs
- Scalability and reliability expectations

### 3. Technical Constraints
- Platform and compatibility requirements
- Integration requirements
- Resource limitations

### 4. Success Criteria
- Define measurable success metrics
- Identify key performance indicators (KPIs)
- Set quality and acceptance criteria

**Output Format**: Structured document with clear sections and bullet points.`
    };
  }

  private buildStage2_TechStackRecommendation(): PromptStage {
    const framework = this.answers.framework || 'Auto-select best option';
    const database = this.answers.database || 'Auto-select best option';
    
    return {
      stage: 2,
      title: 'Technology Stack Recommendation',
      description: 'Select optimal technologies and tools',
      estimatedTime: '10-15 minutes',
      dependencies: [1],
      prompt: `# 🛠️ Stage 2: Technology Stack Recommendation

Based on the requirements from Stage 1, recommend the optimal technology stack.

## Current Preferences
- **Framework Preference**: ${framework}
- **Database Preference**: ${database}
- **Authentication**: ${this.answers.authentication || 'To be determined'}

## Your Task
Provide detailed recommendations for:

### 1. Core Technologies
- **Backend Framework**: With justification
- **Frontend Framework**: With reasoning
- **Database**: Primary and caching solutions
- **Programming Language**: Version and ecosystem

### 2. Development Tools
- **IDE/Editor**: Recommended setup
- **Version Control**: Branching strategy
- **Package Management**: Dependencies handling
- **Build Tools**: Compilation and bundling

### 3. Architecture Decisions
- **Application Architecture**: Monolith vs Microservices
- **API Design**: REST, GraphQL, or hybrid
- **State Management**: Client and server state
- **Deployment Strategy**: Cloud, containerization

### 4. Justification Matrix
Create a table comparing alternatives and explaining choices.

**Output Format**: Detailed recommendations with pros/cons and implementation notes.`
    };
  }

  private buildStage3_ProjectStructure(): PromptStage {
    return {
      stage: 3,
      title: 'Project Structure & Architecture',
      description: 'Create complete project structure and folder organization',
      estimatedTime: '20-25 minutes',
      dependencies: [2],
      prompt: `# 🏗️ Stage 3: Project Structure & Architecture

Create a comprehensive project structure based on the tech stack from Stage 2.

## Your Task
Generate the complete project structure including:

### 1. Directory Structure
\`\`\`
project-root/
├── src/
├── tests/
├── docs/
└── config/
\`\`\`

### 2. File Organization
- **Source Code**: Logical component organization
- **Configuration**: Environment and build configs
- **Documentation**: README, API docs, contributing guides
- **Testing**: Unit, integration, and e2e test structure

### 3. Architecture Diagrams
- High-level system architecture
- Data flow diagrams  
- Component relationships
- Database schema overview

### 4. Coding Standards
- File naming conventions
- Code organization principles
- Import/export patterns
- Documentation standards

### 5. Development Setup
- Environment variables template
- Local development configuration
- IDE/editor recommendations
- Required tools and extensions

**Output Format**: 
1. Complete directory tree
2. Key file templates with initial content
3. Architecture diagrams (text-based)
4. Setup instructions`
    };
  }

  private buildStage4_DatabaseDesign(): PromptStage {
    return {
      stage: 4,
      title: 'Database Design & Schema',
      description: 'Design database schema and data models',
      estimatedTime: '25-30 minutes',
      dependencies: [3],
      prompt: `# 💾 Stage 4: Database Design & Schema

Design the complete database schema based on the requirements and architecture.

## Your Task
Create comprehensive database design including:

### 1. Entity Relationship Diagram (ERD)
- All entities and their relationships
- Primary and foreign keys
- Cardinality and constraints

### 2. Table Schemas
- Detailed table structures
- Column definitions with types
- Indexes and constraints
- Triggers and stored procedures (if needed)

### 3. Data Models
- Entity classes/interfaces
- Validation rules
- Business logic constraints
- Data transformation patterns

### 4. Migration Strategy
- Initial schema creation
- Version control for schema changes
- Data seeding and fixtures
- Backup and recovery procedures

### 5. Performance Optimization
- Index optimization strategy
- Query performance considerations
- Caching strategy
- Connection pooling setup

### 6. Example Queries
- Common CRUD operations
- Complex business queries
- Reporting and analytics queries
- Performance-critical operations

**Output Format**:
1. SQL schema creation scripts
2. Entity relationship diagrams
3. Sample data and seed scripts
4. Migration files
5. Performance optimization notes`
    };
  }

  private buildStage5_CoreImplementation(): PromptStage {
    return {
      stage: 5,
      title: 'Core Implementation',
      description: 'Implement core application logic and features',
      estimatedTime: '45-60 minutes',
      dependencies: [4],
      prompt: `# ⚙️ Stage 5: Core Implementation

Implement the core application logic based on previous stages.

## Your Task
Build the fundamental application components:

### 1. Core Business Logic
- Main application classes/modules
- Business rule implementations
- Data processing logic
- Core algorithms and calculations

### 2. API Layer (if applicable)
- Route definitions and handlers
- Request/response models
- Middleware implementation
- Error handling and validation

### 3. Data Access Layer
- Repository/DAO patterns
- Database connection setup
- CRUD operations
- Query builders and ORM setup

### 4. Service Layer
- Business service classes
- External API integrations
- Background job processing
- Event handling and notifications

### 5. Authentication & Authorization
- User authentication flow
- Permission and role management
- Session handling
- Security middleware

### 6. Core Features Implementation
Based on requirements from Stage 1, implement:
- Primary user workflows
- Key business processes
- Data validation and processing
- Integration points

**Output Format**:
1. Complete source code for core modules
2. Configuration files
3. Error handling implementation
4. Logging and monitoring setup
5. Unit tests for core functionality`
    };
  }

  private buildStage6_APIDocumentation(): PromptStage {
    return {
      stage: 6,
      title: 'API Documentation & Testing',
      description: 'Create comprehensive API documentation and testing suite',
      estimatedTime: '20-25 minutes',
      dependencies: [5],
      prompt: `# 📚 Stage 6: API Documentation & Testing

Create comprehensive API documentation and testing framework.

## Your Task
Develop complete API documentation and testing:

### 1. API Documentation
- **OpenAPI/Swagger Specification**: Complete API schema
- **Endpoint Documentation**: All routes with examples
- **Authentication Guide**: How to authenticate and authorize
- **Error Handling**: Error codes and response formats

### 2. Interactive Documentation
- Swagger UI or similar tool setup
- Postman collection export
- API testing playground
- Code examples in multiple languages

### 3. Testing Suite
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Complete user workflow testing
- **Performance Tests**: Load and stress testing

### 4. Testing Tools Setup
- Testing framework configuration
- Mock data and fixtures
- Test database setup
- Continuous integration setup

### 5. Quality Assurance
- Code coverage requirements
- Linting and formatting rules
- Security vulnerability scanning
- Performance monitoring setup

### 6. Development Workflow
- Local testing procedures
- CI/CD pipeline configuration
- Code review checklist
- Deployment testing strategy

**Output Format**:
1. OpenAPI specification file
2. Complete test suite
3. Documentation website/files
4. Testing scripts and configurations
5. CI/CD pipeline configuration`
    };
  }

  private buildStage7_SecurityImplementation(): PromptStage {
    return {
      stage: 7,
      title: 'Security Implementation',
      description: 'Implement security measures and compliance requirements',
      estimatedTime: '30-35 minutes',
      dependencies: [5],
      prompt: `# 🔒 Stage 7: Security Implementation

Implement comprehensive security measures and compliance requirements.

## Your Task
Build robust security framework:

### 1. Authentication Security
- Secure password handling (hashing, salt)
- JWT token management and refresh
- Multi-factor authentication (if required)
- Session security and timeout

### 2. Authorization Framework
- Role-based access control (RBAC)
- Permission management system
- Resource-level authorization
- API endpoint protection

### 3. Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection measures
- CSRF token implementation

### 4. Communication Security
- HTTPS/TLS configuration
- API rate limiting
- CORS policy setup
- Security headers implementation

### 5. Infrastructure Security
- Environment variable security
- Secret management
- Database security configuration
- File upload security

### 6. Monitoring & Compliance
- Security event logging
- Audit trail implementation
- Compliance reporting (if required)
- Security testing procedures

**Output Format**:
1. Security middleware and utilities
2. Authentication/authorization modules
3. Security configuration files
4. Security testing procedures
5. Compliance documentation`
    };
  }

  private buildStage8_TestingStrategy(): PromptStage {
    return {
      stage: 8,
      title: 'Comprehensive Testing Strategy',
      description: 'Implement complete testing framework and quality assurance',
      estimatedTime: '25-30 minutes',
      dependencies: [6, 7],
      prompt: `# 🧪 Stage 8: Comprehensive Testing Strategy

Implement a complete testing framework for quality assurance.

## Your Task
Create comprehensive testing strategy:

### 1. Testing Framework Setup
- Unit testing framework configuration
- Integration testing setup
- E2E testing framework
- Performance testing tools

### 2. Test Categories
- **Unit Tests**: Component-level testing
- **Integration Tests**: Module interaction testing
- **API Tests**: Endpoint functionality testing
- **UI Tests**: User interface testing (if applicable)

### 3. Test Data Management
- Test database setup and seeding
- Mock data generation
- Test fixtures and factories
- Data cleanup procedures

### 4. Automated Testing
- Continuous integration setup
- Automated test execution
- Test result reporting
- Coverage reporting

### 5. Quality Metrics
- Code coverage thresholds
- Performance benchmarks
- Security test requirements
- Accessibility testing (if applicable)

### 6. Testing Procedures
- Testing checklist for developers
- Bug reporting and tracking
- Regression testing strategy
- User acceptance testing guidelines

**Output Format**:
1. Complete test suite with high coverage
2. Testing configuration files
3. CI/CD integration for testing
4. Testing documentation and procedures
5. Quality metrics dashboard setup`
    };
  }

  private buildStage9_DeploymentSetup(): PromptStage {
    return {
      stage: 9,
      title: 'Deployment & Infrastructure',
      description: 'Setup deployment pipeline and infrastructure configuration',
      estimatedTime: '35-40 minutes',
      dependencies: [8],
      prompt: `# 🚀 Stage 9: Deployment & Infrastructure

Setup complete deployment pipeline and infrastructure configuration.

## Your Task
Create production-ready deployment setup:

### 1. Infrastructure Configuration
- Cloud platform setup (AWS/Azure/GCP)
- Container configuration (Docker)
- Orchestration setup (Kubernetes/Docker Compose)
- Load balancer and reverse proxy setup

### 2. CI/CD Pipeline
- Build automation
- Automated testing integration
- Deployment automation
- Rollback procedures

### 3. Environment Management
- Development environment setup
- Staging environment configuration
- Production environment setup
- Environment variable management

### 4. Database Deployment
- Database migration automation
- Backup and recovery procedures
- Connection pooling setup
- Database monitoring

### 5. Monitoring & Logging
- Application monitoring setup
- Log aggregation and analysis
- Performance monitoring
- Error tracking and alerting

### 6. Security & Compliance
- SSL/TLS certificate setup
- Security group configuration
- Backup encryption
- Compliance monitoring

**Output Format**:
1. Infrastructure as Code files
2. CI/CD pipeline configuration
3. Docker/container setup
4. Deployment scripts and documentation
5. Monitoring and logging configuration`
    };
  }

  private buildStage10_OptimizationAndMonitoring(): PromptStage {
    return {
      stage: 10,
      title: 'Optimization & Monitoring',
      description: 'Implement performance optimization and comprehensive monitoring',
      estimatedTime: '20-25 minutes',
      dependencies: [9],
      prompt: `# ⚡ Stage 10: Optimization & Monitoring

Implement performance optimization and comprehensive monitoring solution.

## Your Task
Setup optimization and monitoring framework:

### 1. Performance Optimization
- Code optimization and profiling
- Database query optimization
- Caching strategy implementation
- Asset optimization and CDN setup

### 2. Monitoring Dashboard
- Application performance metrics
- Business metrics and KPIs
- System health monitoring
- User experience monitoring

### 3. Alerting System
- Performance degradation alerts
- Error rate monitoring
- Resource utilization alerts
- Business metric thresholds

### 4. Analytics Implementation
- User behavior tracking
- Application usage analytics
- Performance analytics
- Business intelligence setup

### 5. Maintenance Procedures
- Regular maintenance schedules
- Performance review procedures
- Capacity planning guidelines
- Disaster recovery testing

### 6. Documentation & Handover
- Operations manual
- Troubleshooting guides
- Performance tuning documentation
- Monitoring playbooks

**Output Format**:
1. Performance optimization implementation
2. Monitoring dashboard configuration
3. Alerting rules and procedures
4. Analytics tracking setup
5. Operations documentation and procedures

---

## 🎉 Project Completion
Congratulations! You have successfully completed all stages of your ${this.projectType?.name || 'application'} development. Your application is now ready for production use with comprehensive monitoring and optimization in place.`
    };
  }
}