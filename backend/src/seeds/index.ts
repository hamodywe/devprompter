import { PrismaClient, QuestionType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * Enhanced Project Types with Clear Categories
 * Organized for better user experience and logical grouping
 */
async function seedProjectTypes() {
  const projectTypes = [
    // === BACKEND DEVELOPMENT ===
    {
      id: uuidv4(),
      name: 'REST API',
      category: 'Backend',
      description: 'RESTful API with complete CRUD operations, authentication, rate limiting, and comprehensive documentation',
      icon: '🔌',
      order: 1,
    },
    {
      id: uuidv4(),
      name: 'GraphQL API',
      category: 'Backend',
      description: 'GraphQL API with subscriptions, resolvers, schema design, and real-time capabilities',
      icon: '🔗',
      order: 2,
    },
    {
      id: uuidv4(),
      name: 'Microservices Architecture',
      category: 'Backend',
      description: 'Distributed microservices system with API gateway, service discovery, and inter-service communication',
      icon: '🏗️',
      order: 3,
    },
    {
      id: uuidv4(),
      name: 'Database Design & API',
      category: 'Backend',
      description: 'Database-first API design with advanced queries, indexing, and data modeling',
      icon: '💾',
      order: 4,
    },

    // === FRONTEND DEVELOPMENT ===
    {
      id: uuidv4(),
      name: 'React SPA',
      category: 'Frontend',
      description: 'Single Page Application with React, advanced routing, state management, and modern UI patterns',
      icon: '⚛️',
      order: 5,
    },
    {
      id: uuidv4(),
      name: 'Vue.js Application',
      category: 'Frontend',
      description: 'Vue.js application with Composition API, routing, state management, and component architecture',
      icon: '💚',
      order: 6,
    },
    {
      id: uuidv4(),
      name: 'Admin Dashboard',
      category: 'Frontend',
      description: 'Comprehensive admin dashboard with advanced data visualization, real-time updates, and complex interactions',
      icon: '📊',
      order: 7,
    },
    {
      id: uuidv4(),
      name: 'Progressive Web App',
      category: 'Frontend',
      description: 'PWA with offline-first architecture, push notifications, service workers, and native app experience',
      icon: '📲',
      order: 8,
    },
    {
      id: uuidv4(),
      name: 'Landing Page',
      category: 'Frontend',
      description: 'High-converting landing page with A/B testing, analytics integration, and conversion optimization',
      icon: '🚀',
      order: 9,
    },
    {
      id: uuidv4(),
      name: 'Portfolio Website',
      category: 'Frontend',
      description: 'Professional portfolio with dynamic content, project showcases, and personal branding',
      icon: '🎨',
      order: 10,
    },

    // === FULLSTACK DEVELOPMENT ===
    {
      id: uuidv4(),
      name: 'E-commerce Platform',
      category: 'Fullstack',
      description: 'Complete e-commerce solution with product management, payment processing, inventory, and analytics',
      icon: '🛒',
      order: 11,
    },
    {
      id: uuidv4(),
      name: 'SaaS Application',
      category: 'Fullstack',
      description: 'Multi-tenant SaaS platform with subscription billing, user management, and scalable architecture',
      icon: '☁️',
      order: 12,
    },
    {
      id: uuidv4(),
      name: 'Blog Platform',
      category: 'Fullstack',
      description: 'Content management system with author dashboard, SEO optimization, and community features',
      icon: '📝',
      order: 13,
    },
    {
      id: uuidv4(),
      name: 'Real-time Chat Application',
      category: 'Fullstack',
      description: 'Real-time messaging platform with WebSocket integration, file sharing, and multimedia support',
      icon: '💬',
      order: 14,
    },
    {
      id: uuidv4(),
      name: 'Social Media Platform',
      category: 'Fullstack',
      description: 'Social networking platform with user profiles, content sharing, real-time interactions, and feeds',
      icon: '📱',
      order: 15,
    },

    // === MOBILE DEVELOPMENT ===
    {
      id: uuidv4(),
      name: 'Native Mobile App',
      category: 'Mobile',
      description: 'Native mobile application for iOS and Android with platform-specific features and optimizations',
      icon: '📱',
      order: 16,
    },
    {
      id: uuidv4(),
      name: 'Cross-Platform App',
      category: 'Mobile',
      description: 'Cross-platform mobile app using React Native, Flutter, or Xamarin with shared codebase',
      icon: '📲',
      order: 17,
    },

    // === AI & MACHINE LEARNING ===
    {
      id: uuidv4(),
      name: 'AI-Powered Application',
      category: 'AI/ML',
      description: 'Application integrating AI/ML capabilities like NLP, computer vision, or predictive analytics',
      icon: '🤖',
      order: 18,
    },
    {
      id: uuidv4(),
      name: 'Chatbot System',
      category: 'AI/ML',
      description: 'Intelligent chatbot with NLP processing, conversation management, and multi-platform integration',
      icon: '💭',
      order: 19,
    },
    {
      id: uuidv4(),
      name: 'Data Processing Pipeline',
      category: 'AI/ML',
      description: 'ETL pipeline for data processing, transformation, analysis, and machine learning workflows',
      icon: '⚙️',
      order: 20,
    },

    // === DEVELOPER TOOLS & AUTOMATION ===
    {
      id: uuidv4(),
      name: 'CLI Tool',
      category: 'DevTools',
      description: 'Command-line interface tool for automation, development workflows, and productivity enhancement',
      icon: '🔧',
      order: 21,
    },
    {
      id: uuidv4(),
      name: 'VS Code Extension',
      category: 'DevTools',
      description: 'Visual Studio Code extension with custom functionality, language support, or workflow enhancement',
      icon: '⚡',
      order: 22,
    },
    {
      id: uuidv4(),
      name: 'Chrome Extension',
      category: 'DevTools',
      description: 'Browser extension with content scripts, background services, and web page interaction',
      icon: '🌐',
      order: 23,
    },

    // === GAMING & ENTERTAINMENT ===
    {
      id: uuidv4(),
      name: 'Web Game',
      category: 'Gaming',
      description: 'Browser-based game with interactive gameplay, scoring system, and multiplayer capabilities',
      icon: '🎮',
      order: 24,
    },
    {
      id: uuidv4(),
      name: 'Discord Bot',
      category: 'Gaming',
      description: 'Discord bot with custom commands, server management, game integration, and community features',
      icon: '🤖',
      order: 25,
    },
  ];

  for (const projectType of projectTypes) {
    await prisma.projectType.upsert({
      where: { name: projectType.name },
      update: projectType,
      create: projectType,
    });

    console.log(`✅ Created project type: ${projectType.name}`);
  }

  return projectTypes;
}

/**
 * Enhanced Question System with Logical Phases
 * Each project type now has comprehensive, well-structured questions
 */
async function seedQuestions(projectTypes: any[]) {
  // === REST API QUESTIONS ===
  const restApiType = projectTypes.find(pt => pt.name === 'REST API');
  if (restApiType) {
    const restApiQuestions = [
      // PHASE 1: PROJECT FOUNDATION
      {
        projectTypeId: restApiType.id,
        questionText: 'What is the primary purpose and business value of your API?',
        questionType: QuestionType.TEXTAREA,
        category: 'Foundation',
        phase: 'foundation',
        phaseOrder: 1,
        helpText: 'Describe the core problem your API solves, who will use it, and what business value it provides',
        placeholder: 'e.g., Customer management API for our e-commerce platform to handle user profiles, orders, and preferences...',
        orderIndex: 1,
        isRequired: true,
        affectsPromptSection: 'projectOverview',
        weight: 2.0,
      },
      {
        projectTypeId: restApiType.id,
        questionText: 'Who are the primary consumers of this API?',
        questionType: QuestionType.MULTISELECT,
        category: 'Foundation',
        phase: 'foundation',
        phaseOrder: 2,
        helpText: 'Select all types of consumers that will use your API',
        options: [
          { value: 'web-app', label: 'Web Application Frontend' },
          { value: 'mobile-app', label: 'Mobile Applications' },
          { value: 'third-party', label: 'Third-party Developers' },
          { value: 'internal-services', label: 'Internal Microservices' },
          { value: 'public-api', label: 'Public API Consumers' },
          { value: 'partner-integrations', label: 'Partner Integrations' },
        ],
        orderIndex: 2,
        isRequired: true,
        affectsPromptSection: 'requirements',
        weight: 1.5,
      },
      {
        projectTypeId: restApiType.id,
        questionText: 'What is the expected scale and performance requirement?',
        questionType: QuestionType.SELECT,
        category: 'Foundation',
        phase: 'foundation',
        phaseOrder: 3,
        helpText: 'Choose the scale that best matches your expected usage',
        options: [
          { value: 'prototype', label: 'Prototype/MVP (< 100 requests/day)' },
          { value: 'small', label: 'Small Scale (100-10K requests/day)' },
          { value: 'medium', label: 'Medium Scale (10K-1M requests/day)' },
          { value: 'large', label: 'Large Scale (1M-100M requests/day)' },
          { value: 'enterprise', label: 'Enterprise Scale (100M+ requests/day)' },
        ],
        orderIndex: 3,
        isRequired: true,
        affectsPromptSection: 'requirements',
        weight: 1.8,
      },

      // PHASE 2: TECHNICAL ARCHITECTURE
      {
        projectTypeId: restApiType.id,
        questionText: 'Which programming language and framework do you prefer?',
        questionType: QuestionType.SELECT,
        category: 'Technical',
        phase: 'architecture',
        phaseOrder: 1,
        helpText: 'Choose based on your team expertise and project requirements',
        options: [
          { value: 'node-express', label: 'Node.js + Express (Fast, JavaScript ecosystem)' },
          { value: 'node-fastify', label: 'Node.js + Fastify (High performance, modern)' },
          { value: 'python-fastapi', label: 'Python + FastAPI (Modern, automatic docs)' },
          { value: 'python-django', label: 'Python + Django REST (Mature, feature-rich)' },
          { value: 'python-flask', label: 'Python + Flask (Lightweight, flexible)' },
          { value: 'dotnet', label: '.NET Core (Enterprise, high performance)' },
          { value: 'java-spring', label: 'Java + Spring Boot (Enterprise, robust)' },
          { value: 'go-gin', label: 'Go + Gin (Ultra-fast, efficient)' },
          { value: 'rust-actix', label: 'Rust + Actix (Memory-safe, performance)' },
        ],
        orderIndex: 4,
        isRequired: true,
        affectsPromptSection: 'techStack',
        weight: 2.0,
      },
      {
        projectTypeId: restApiType.id,
        questionText: 'Which database system best fits your needs?',
        questionType: QuestionType.SELECT,
        category: 'Technical',
        phase: 'architecture',
        phaseOrder: 2,
        helpText: 'Consider your data structure, scalability needs, and team expertise',
        options: [
          { value: 'postgresql', label: 'PostgreSQL (Relational, JSON support, advanced features)' },
          { value: 'mysql', label: 'MySQL (Relational, widely supported, mature)' },
          { value: 'mongodb', label: 'MongoDB (Document-based, flexible schema)' },
          { value: 'sqlite', label: 'SQLite (Lightweight, embedded, good for prototypes)' },
          { value: 'redis', label: 'Redis (In-memory, caching, real-time features)' },
          { value: 'elasticsearch', label: 'Elasticsearch (Search-oriented, analytics)' },
          { value: 'dynamodb', label: 'DynamoDB (NoSQL, serverless, AWS)' },
        ],
        orderIndex: 5,
        isRequired: true,
        affectsPromptSection: 'techStack',
        weight: 1.8,
      },
      {
        projectTypeId: restApiType.id,
        questionText: 'What authentication method do you need?',
        questionType: QuestionType.SELECT,
        category: 'Security',
        options: [
          { value: 'jwt', label: 'JWT (JSON Web Tokens)' },
          { value: 'oauth2', label: 'OAuth 2.0' },
          { value: 'api-key', label: 'API Keys' },
          { value: 'basic', label: 'Basic Auth' },
          { value: 'none', label: 'No authentication' },
        ],
        orderIndex: 4,
        isRequired: true,
        affectsPromptSection: 'techStack',
      },
      {
        projectTypeId: restApiType.id,
        questionText: 'Do you need API versioning?',
        questionType: QuestionType.BOOLEAN,
        category: 'Features',
        orderIndex: 5,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: restApiType.id,
        questionText: 'Do you need rate limiting?',
        questionType: QuestionType.BOOLEAN,
        category: 'Features',
        orderIndex: 6,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: restApiType.id,
        questionText: 'What documentation format do you prefer?',
        questionType: QuestionType.SELECT,
        category: 'Documentation',
        options: [
          { value: 'swagger', label: 'Swagger/OpenAPI' },
          { value: 'postman', label: 'Postman Collection' },
          { value: 'redoc', label: 'ReDoc' },
          { value: 'none', label: 'No documentation' },
        ],
        orderIndex: 7,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: restApiType.id,
        questionText: 'Expected number of API endpoints?',
        questionType: QuestionType.NUMBER,
        category: 'Scope',
        validationRules: { min: 1, max: 1000 },
        orderIndex: 8,
        isRequired: false,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: restApiType.id,
        questionText: 'Do you need real-time features (WebSockets)?',
        questionType: QuestionType.BOOLEAN,
        category: 'Features',
        orderIndex: 9,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: restApiType.id,
        questionText: 'Deployment target?',
        questionType: QuestionType.SELECT,
        category: 'Deployment',
        options: [
          { value: 'aws', label: 'AWS' },
          { value: 'gcp', label: 'Google Cloud' },
          { value: 'azure', label: 'Azure' },
          { value: 'heroku', label: 'Heroku' },
          { value: 'vercel', label: 'Vercel' },
          { value: 'docker', label: 'Docker' },
          { value: 'vps', label: 'VPS (Self-hosted)' },
        ],
        orderIndex: 10,
        isRequired: false,
        affectsPromptSection: 'deployment',
      },
    ];

    for (const question of restApiQuestions) {
      await prisma.question.create({
        data: {
          id: uuidv4(),
          ...question,
        },
      });
    }
    console.log(`✅ Created ${restApiQuestions.length} questions for REST API`);
  }

  // E-commerce Questions
  const ecommerceType = projectTypes.find(pt => pt.name === 'E-commerce Website');
  if (ecommerceType) {
    const ecommerceQuestions = [
      {
        projectTypeId: ecommerceType.id,
        questionText: 'What type of products will you sell?',
        questionType: QuestionType.SELECT,
        category: 'Business',
        options: [
          { value: 'physical', label: 'Physical Products' },
          { value: 'digital', label: 'Digital Products' },
          { value: 'both', label: 'Both Physical and Digital' },
          { value: 'services', label: 'Services' },
        ],
        orderIndex: 1,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: ecommerceType.id,
        questionText: 'Expected number of products?',
        questionType: QuestionType.SELECT,
        category: 'Scale',
        options: [
          { value: 'small', label: '< 100 products' },
          { value: 'medium', label: '100-1000 products' },
          { value: 'large', label: '1000-10000 products' },
          { value: 'enterprise', label: '> 10000 products' },
        ],
        orderIndex: 2,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: ecommerceType.id,
        questionText: 'Which payment providers do you need?',
        questionType: QuestionType.MULTISELECT,
        category: 'Payments',
        options: [
          { value: 'stripe', label: 'Stripe' },
          { value: 'paypal', label: 'PayPal' },
          { value: 'square', label: 'Square' },
          { value: 'razorpay', label: 'Razorpay' },
          { value: 'crypto', label: 'Cryptocurrency' },
        ],
        orderIndex: 3,
        isRequired: true,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: ecommerceType.id,
        questionText: 'Do you need inventory management?',
        questionType: QuestionType.BOOLEAN,
        category: 'Features',
        orderIndex: 4,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: ecommerceType.id,
        questionText: 'Do you need multi-vendor support (marketplace)?',
        questionType: QuestionType.BOOLEAN,
        category: 'Features',
        orderIndex: 5,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: ecommerceType.id,
        questionText: 'Do you need international shipping?',
        questionType: QuestionType.BOOLEAN,
        category: 'Features',
        orderIndex: 6,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: ecommerceType.id,
        questionText: 'Frontend framework preference?',
        questionType: QuestionType.SELECT,
        category: 'Technical',
        options: [
          { value: 'nextjs', label: 'Next.js' },
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue.js' },
          { value: 'angular', label: 'Angular' },
          { value: 'wordpress', label: 'WordPress + WooCommerce' },
          { value: 'shopify', label: 'Shopify' },
        ],
        orderIndex: 7,
        isRequired: true,
        affectsPromptSection: 'techStack',
      },
      {
        projectTypeId: ecommerceType.id,
        questionText: 'Do you need a mobile app?',
        questionType: QuestionType.BOOLEAN,
        category: 'Platform',
        orderIndex: 8,
        isRequired: false,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: ecommerceType.id,
        questionText: 'SEO importance level?',
        questionType: QuestionType.SELECT,
        category: 'Marketing',
        options: [
          { value: 'critical', label: 'Critical - Main traffic source' },
          { value: 'important', label: 'Important - Significant traffic' },
          { value: 'moderate', label: 'Moderate - Some organic traffic' },
          { value: 'low', label: 'Low - Not a priority' },
        ],
        orderIndex: 9,
        isRequired: false,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: ecommerceType.id,
        questionText: 'Admin panel features needed?',
        questionType: QuestionType.MULTISELECT,
        category: 'Admin',
        options: [
          { value: 'analytics', label: 'Sales Analytics' },
          { value: 'inventory', label: 'Inventory Management' },
          { value: 'customers', label: 'Customer Management' },
          { value: 'marketing', label: 'Marketing Tools' },
          { value: 'reports', label: 'Reports & Exports' },
        ],
        orderIndex: 10,
        isRequired: false,
        affectsPromptSection: 'features',
      },
    ];

    for (const question of ecommerceQuestions) {
      await prisma.question.create({
        data: {
          id: uuidv4(),
          ...question,
        },
      });
    }
    console.log(`✅ Created ${ecommerceQuestions.length} questions for E-commerce Website`);
  }

  // Mobile App Questions
  const mobileAppType = projectTypes.find(pt => pt.name === 'Mobile App');
  if (mobileAppType) {
    const mobileAppQuestions = [
      {
        projectTypeId: mobileAppType.id,
        questionText: 'Which platform(s) will you target?',
        questionType: QuestionType.MULTISELECT,
        category: 'Platform',
        options: [
          { value: 'ios', label: 'iOS' },
          { value: 'android', label: 'Android' },
          { value: 'web', label: 'Web (PWA)' },
        ],
        orderIndex: 1,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: mobileAppType.id,
        questionText: 'Which development framework do you prefer?',
        questionType: QuestionType.SELECT,
        category: 'Technical',
        options: [
          { value: 'react-native', label: 'React Native' },
          { value: 'flutter', label: 'Flutter' },
          { value: 'ionic', label: 'Ionic' },
          { value: 'native-ios', label: 'Native iOS (Swift)' },
          { value: 'native-android', label: 'Native Android (Kotlin)' },
          { value: 'xamarin', label: 'Xamarin' },
        ],
        orderIndex: 2,
        isRequired: true,
        affectsPromptSection: 'techStack',
      },
      {
        projectTypeId: mobileAppType.id,
        questionText: 'What is the main purpose of your app?',
        questionType: QuestionType.TEXTAREA,
        category: 'General',
        helpText: 'Describe the core functionality and target audience',
        orderIndex: 3,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: mobileAppType.id,
        questionText: 'Do you need offline functionality?',
        questionType: QuestionType.BOOLEAN,
        category: 'Features',
        orderIndex: 4,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: mobileAppType.id,
        questionText: 'Do you need push notifications?',
        questionType: QuestionType.BOOLEAN,
        category: 'Features',
        orderIndex: 5,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: mobileAppType.id,
        questionText: 'Which authentication methods do you need?',
        questionType: QuestionType.MULTISELECT,
        category: 'Security',
        options: [
          { value: 'email', label: 'Email/Password' },
          { value: 'social', label: 'Social Login (Google, Facebook, etc.)' },
          { value: 'biometric', label: 'Biometric (Face ID, Fingerprint)' },
          { value: 'phone', label: 'Phone Number' },
          { value: 'none', label: 'No authentication' },
        ],
        orderIndex: 6,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: mobileAppType.id,
        questionText: 'Do you need in-app purchases?',
        questionType: QuestionType.BOOLEAN,
        category: 'Monetization',
        orderIndex: 7,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: mobileAppType.id,
        questionText: 'Which device features will you use?',
        questionType: QuestionType.MULTISELECT,
        category: 'Features',
        options: [
          { value: 'camera', label: 'Camera' },
          { value: 'gps', label: 'GPS/Location' },
          { value: 'bluetooth', label: 'Bluetooth' },
          { value: 'accelerometer', label: 'Accelerometer/Gyroscope' },
          { value: 'contacts', label: 'Contacts' },
          { value: 'calendar', label: 'Calendar' },
        ],
        orderIndex: 8,
        isRequired: false,
        affectsPromptSection: 'features',
      },
    ];

    for (const question of mobileAppQuestions) {
      await prisma.question.create({
        data: {
          id: uuidv4(),
          ...question,
        },
      });
    }
    console.log(`✅ Created ${mobileAppQuestions.length} questions for Mobile App`);
  }

  // SaaS Application Questions
  const saasType = projectTypes.find(pt => pt.name === 'SaaS Application');
  if (saasType) {
    const saasQuestions = [
      {
        projectTypeId: saasType.id,
        questionText: 'What is your SaaS business model?',
        questionType: QuestionType.SELECT,
        category: 'Business',
        options: [
          { value: 'b2b', label: 'B2B (Business to Business)' },
          { value: 'b2c', label: 'B2C (Business to Consumer)' },
          { value: 'b2b2c', label: 'B2B2C (Business to Business to Consumer)' },
        ],
        orderIndex: 1,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: saasType.id,
        questionText: 'Which subscription billing provider?',
        questionType: QuestionType.SELECT,
        category: 'Payments',
        options: [
          { value: 'stripe', label: 'Stripe Billing' },
          { value: 'paddle', label: 'Paddle' },
          { value: 'chargebee', label: 'Chargebee' },
          { value: 'recurly', label: 'Recurly' },
          { value: 'custom', label: 'Custom Billing' },
        ],
        orderIndex: 2,
        isRequired: true,
        affectsPromptSection: 'techStack',
      },
      {
        projectTypeId: saasType.id,
        questionText: 'Do you need multi-tenancy?',
        questionType: QuestionType.SELECT,
        category: 'Architecture',
        options: [
          { value: 'single-db', label: 'Single Database (Shared Schema)' },
          { value: 'multi-db', label: 'Database per Tenant' },
          { value: 'hybrid', label: 'Hybrid Approach' },
          { value: 'none', label: 'Single Tenant' },
        ],
        orderIndex: 3,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: saasType.id,
        questionText: 'Pricing tiers structure?',
        questionType: QuestionType.SELECT,
        category: 'Business',
        options: [
          { value: 'freemium', label: 'Freemium (Free + Paid Tiers)' },
          { value: 'trial', label: 'Free Trial + Paid' },
          { value: 'paid-only', label: 'Paid Only' },
          { value: 'usage-based', label: 'Usage-Based Pricing' },
        ],
        orderIndex: 4,
        isRequired: true,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: saasType.id,
        questionText: 'Do you need team/organization management?',
        questionType: QuestionType.BOOLEAN,
        category: 'Features',
        orderIndex: 5,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: saasType.id,
        questionText: 'Which integrations do you need?',
        questionType: QuestionType.MULTISELECT,
        category: 'Integrations',
        options: [
          { value: 'slack', label: 'Slack' },
          { value: 'google', label: 'Google Workspace' },
          { value: 'microsoft', label: 'Microsoft 365' },
          { value: 'zapier', label: 'Zapier' },
          { value: 'webhook', label: 'Webhooks' },
          { value: 'api', label: 'Public API' },
        ],
        orderIndex: 6,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: saasType.id,
        questionText: 'Compliance requirements?',
        questionType: QuestionType.MULTISELECT,
        category: 'Security',
        options: [
          { value: 'gdpr', label: 'GDPR' },
          { value: 'soc2', label: 'SOC 2' },
          { value: 'hipaa', label: 'HIPAA' },
          { value: 'pci', label: 'PCI DSS' },
          { value: 'iso27001', label: 'ISO 27001' },
        ],
        orderIndex: 7,
        isRequired: false,
        affectsPromptSection: 'requirements',
      },
    ];

    for (const question of saasQuestions) {
      await prisma.question.create({
        data: {
          id: uuidv4(),
          ...question,
        },
      });
    }
    console.log(`✅ Created ${saasQuestions.length} questions for SaaS Application`);
  }

  // CLI Tool Questions
  const cliToolType = projectTypes.find(pt => pt.name === 'CLI Tool');
  if (cliToolType) {
    const cliToolQuestions = [
      {
        projectTypeId: cliToolType.id,
        questionText: 'What is the primary purpose of your CLI tool?',
        questionType: QuestionType.TEXTAREA,
        category: 'General',
        helpText: 'Describe what tasks it will automate or problems it will solve',
        orderIndex: 1,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: cliToolType.id,
        questionText: 'Which programming language?',
        questionType: QuestionType.SELECT,
        category: 'Technical',
        options: [
          { value: 'node', label: 'Node.js/JavaScript' },
          { value: 'python', label: 'Python' },
          { value: 'go', label: 'Go' },
          { value: 'rust', label: 'Rust' },
          { value: 'bash', label: 'Bash/Shell' },
          { value: 'ruby', label: 'Ruby' },
        ],
        orderIndex: 2,
        isRequired: true,
        affectsPromptSection: 'techStack',
      },
      {
        projectTypeId: cliToolType.id,
        questionText: 'Do you need interactive prompts?',
        questionType: QuestionType.BOOLEAN,
        category: 'Features',
        orderIndex: 3,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: cliToolType.id,
        questionText: 'Do you need configuration file support?',
        questionType: QuestionType.BOOLEAN,
        category: 'Features',
        orderIndex: 4,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: cliToolType.id,
        questionText: 'Output format support?',
        questionType: QuestionType.MULTISELECT,
        category: 'Features',
        options: [
          { value: 'json', label: 'JSON' },
          { value: 'yaml', label: 'YAML' },
          { value: 'table', label: 'Table' },
          { value: 'csv', label: 'CSV' },
          { value: 'plain', label: 'Plain Text' },
        ],
        orderIndex: 5,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: cliToolType.id,
        questionText: 'Distribution method?',
        questionType: QuestionType.MULTISELECT,
        category: 'Deployment',
        options: [
          { value: 'npm', label: 'NPM' },
          { value: 'pip', label: 'PyPI' },
          { value: 'homebrew', label: 'Homebrew' },
          { value: 'github', label: 'GitHub Releases' },
          { value: 'docker', label: 'Docker' },
        ],
        orderIndex: 6,
        isRequired: false,
        affectsPromptSection: 'deployment',
      },
    ];

    for (const question of cliToolQuestions) {
      await prisma.question.create({
        data: {
          id: uuidv4(),
          ...question,
        },
      });
    }
    console.log(`✅ Created ${cliToolQuestions.length} questions for CLI Tool`);
  }

  // Chrome Extension Questions
  const chromeExtType = projectTypes.find(pt => pt.name === 'Chrome Extension');
  if (chromeExtType) {
    const chromeExtQuestions = [
      {
        projectTypeId: chromeExtType.id,
        questionText: 'What type of extension are you building?',
        questionType: QuestionType.SELECT,
        category: 'Type',
        options: [
          { value: 'content', label: 'Content Script (Modifies web pages)' },
          { value: 'popup', label: 'Browser Action (Popup extension)' },
          { value: 'devtools', label: 'Developer Tools Extension' },
          { value: 'theme', label: 'Theme Extension' },
          { value: 'mixed', label: 'Mixed Type' },
        ],
        orderIndex: 1,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: chromeExtType.id,
        questionText: 'Which browsers will you support?',
        questionType: QuestionType.MULTISELECT,
        category: 'Platform',
        options: [
          { value: 'chrome', label: 'Chrome' },
          { value: 'firefox', label: 'Firefox' },
          { value: 'edge', label: 'Microsoft Edge' },
          { value: 'safari', label: 'Safari' },
          { value: 'opera', label: 'Opera' },
        ],
        orderIndex: 2,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: chromeExtType.id,
        questionText: 'Which permissions do you need?',
        questionType: QuestionType.MULTISELECT,
        category: 'Permissions',
        options: [
          { value: 'tabs', label: 'Tabs' },
          { value: 'storage', label: 'Storage' },
          { value: 'cookies', label: 'Cookies' },
          { value: 'history', label: 'History' },
          { value: 'bookmarks', label: 'Bookmarks' },
          { value: 'notifications', label: 'Notifications' },
          { value: 'webRequest', label: 'Web Requests' },
        ],
        orderIndex: 3,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: chromeExtType.id,
        questionText: 'Do you need a backend service?',
        questionType: QuestionType.BOOLEAN,
        category: 'Architecture',
        orderIndex: 4,
        isRequired: false,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: chromeExtType.id,
        questionText: 'Do you need user authentication?',
        questionType: QuestionType.BOOLEAN,
        category: 'Features',
        orderIndex: 5,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: chromeExtType.id,
        questionText: 'UI framework preference?',
        questionType: QuestionType.SELECT,
        category: 'Technical',
        options: [
          { value: 'vanilla', label: 'Vanilla JavaScript' },
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue.js' },
          { value: 'svelte', label: 'Svelte' },
        ],
        orderIndex: 6,
        isRequired: false,
        affectsPromptSection: 'techStack',
      },
    ];

    for (const question of chromeExtQuestions) {
      await prisma.question.create({
        data: {
          id: uuidv4(),
          ...question,
        },
      });
    }
    console.log(`✅ Created ${chromeExtQuestions.length} questions for Chrome Extension`);
  }

  // Discord Bot Questions
  const discordBotType = projectTypes.find(pt => pt.name === 'Discord Bot');
  if (discordBotType) {
    const discordBotQuestions = [
      {
        projectTypeId: discordBotType.id,
        questionText: 'What is the main purpose of your bot?',
        questionType: QuestionType.TEXTAREA,
        category: 'General',
        helpText: 'Describe the bot functionality and features',
        orderIndex: 1,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: discordBotType.id,
        questionText: 'Which programming language?',
        questionType: QuestionType.SELECT,
        category: 'Technical',
        options: [
          { value: 'javascript', label: 'JavaScript (Discord.js)' },
          { value: 'python', label: 'Python (discord.py)' },
          { value: 'java', label: 'Java (JDA)' },
          { value: 'csharp', label: 'C# (Discord.NET)' },
          { value: 'rust', label: 'Rust (Serenity)' },
        ],
        orderIndex: 2,
        isRequired: true,
        affectsPromptSection: 'techStack',
      },
      {
        projectTypeId: discordBotType.id,
        questionText: 'Which command types will you use?',
        questionType: QuestionType.MULTISELECT,
        category: 'Features',
        options: [
          { value: 'slash', label: 'Slash Commands' },
          { value: 'prefix', label: 'Prefix Commands' },
          { value: 'context', label: 'Context Menu Commands' },
          { value: 'buttons', label: 'Button Interactions' },
          { value: 'modals', label: 'Modal Forms' },
        ],
        orderIndex: 3,
        isRequired: true,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: discordBotType.id,
        questionText: 'Do you need a database?',
        questionType: QuestionType.SELECT,
        category: 'Data',
        options: [
          { value: 'none', label: 'No database' },
          { value: 'sqlite', label: 'SQLite' },
          { value: 'postgresql', label: 'PostgreSQL' },
          { value: 'mongodb', label: 'MongoDB' },
          { value: 'redis', label: 'Redis' },
        ],
        orderIndex: 4,
        isRequired: false,
        affectsPromptSection: 'techStack',
      },
      {
        projectTypeId: discordBotType.id,
        questionText: 'Which features do you need?',
        questionType: QuestionType.MULTISELECT,
        category: 'Features',
        options: [
          { value: 'moderation', label: 'Moderation Tools' },
          { value: 'music', label: 'Music Player' },
          { value: 'leveling', label: 'Leveling System' },
          { value: 'economy', label: 'Economy System' },
          { value: 'tickets', label: 'Ticket System' },
          { value: 'logging', label: 'Server Logging' },
          { value: 'automod', label: 'Auto-moderation' },
        ],
        orderIndex: 5,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: discordBotType.id,
        questionText: 'Hosting preference?',
        questionType: QuestionType.SELECT,
        category: 'Deployment',
        options: [
          { value: 'vps', label: 'VPS (Self-hosted)' },
          { value: 'heroku', label: 'Heroku' },
          { value: 'railway', label: 'Railway' },
          { value: 'replit', label: 'Replit' },
          { value: 'local', label: 'Local Machine' },
        ],
        orderIndex: 6,
        isRequired: false,
        affectsPromptSection: 'deployment',
      },
    ];

    for (const question of discordBotQuestions) {
      await prisma.question.create({
        data: {
          id: uuidv4(),
          ...question,
        },
      });
    }
    console.log(`✅ Created ${discordBotQuestions.length} questions for Discord Bot`);
  }

  // GraphQL API Questions
  const graphqlApiType = projectTypes.find(pt => pt.name === 'GraphQL API');
  if (graphqlApiType) {
    const graphqlApiQuestions = [
      {
        projectTypeId: graphqlApiType.id,
        questionText: 'What is the primary purpose of your GraphQL API?',
        questionType: QuestionType.TEXTAREA,
        category: 'General',
        helpText: 'Describe what your API will serve and its main functionality',
        orderIndex: 1,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: graphqlApiType.id,
        questionText: 'Which server framework do you prefer?',
        questionType: QuestionType.SELECT,
        category: 'Technical',
        options: [
          { value: 'apollo-server', label: 'Apollo Server (Node.js)' },
          { value: 'graphql-yoga', label: 'GraphQL Yoga' },
          { value: 'express-graphql', label: 'Express GraphQL' },
          { value: 'mercurius', label: 'Mercurius (Fastify)' },
          { value: 'graphene', label: 'Graphene (Python)' },
          { value: 'absinthe', label: 'Absinthe (Elixir)' },
        ],
        orderIndex: 2,
        isRequired: true,
        affectsPromptSection: 'techStack',
      },
      {
        projectTypeId: graphqlApiType.id,
        questionText: 'Do you need real-time subscriptions?',
        questionType: QuestionType.BOOLEAN,
        category: 'Features',
        orderIndex: 3,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: graphqlApiType.id,
        questionText: 'Do you need file upload support?',
        questionType: QuestionType.BOOLEAN,
        category: 'Features',
        orderIndex: 4,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: graphqlApiType.id,
        questionText: 'Which features do you need?',
        questionType: QuestionType.MULTISELECT,
        category: 'Features',
        options: [
          { value: 'dataloader', label: 'DataLoader (N+1 prevention)' },
          { value: 'federation', label: 'Federation Support' },
          { value: 'caching', label: 'Query Caching' },
          { value: 'depth-limiting', label: 'Query Depth Limiting' },
          { value: 'rate-limiting', label: 'Rate Limiting' },
          { value: 'tracing', label: 'Performance Tracing' },
        ],
        orderIndex: 5,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: graphqlApiType.id,
        questionText: 'Authentication strategy?',
        questionType: QuestionType.SELECT,
        category: 'Security',
        options: [
          { value: 'jwt', label: 'JWT Tokens' },
          { value: 'session', label: 'Session-based' },
          { value: 'api-key', label: 'API Keys' },
          { value: 'oauth', label: 'OAuth 2.0' },
          { value: 'none', label: 'No authentication' },
        ],
        orderIndex: 6,
        isRequired: false,
        affectsPromptSection: 'features',
      },
    ];

    for (const question of graphqlApiQuestions) {
      await prisma.question.create({
        data: {
          id: uuidv4(),
          ...question,
        },
      });
    }
    console.log(`✅ Created ${graphqlApiQuestions.length} questions for GraphQL API`);
  }

  // Progressive Web App Questions
  const pwaType = projectTypes.find(pt => pt.name === 'Progressive Web App');
  if (pwaType) {
    const pwaQuestions = [
      {
        projectTypeId: pwaType.id,
        questionText: 'What is the main purpose of your PWA?',
        questionType: QuestionType.TEXTAREA,
        category: 'General',
        helpText: 'Describe the app functionality and target users',
        orderIndex: 1,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: pwaType.id,
        questionText: 'Which framework do you prefer?',
        questionType: QuestionType.SELECT,
        category: 'Technical',
        options: [
          { value: 'nextjs', label: 'Next.js' },
          { value: 'react', label: 'Create React App' },
          { value: 'vue', label: 'Vue + Vite' },
          { value: 'angular', label: 'Angular' },
          { value: 'svelte', label: 'SvelteKit' },
        ],
        orderIndex: 2,
        isRequired: true,
        affectsPromptSection: 'techStack',
      },
      {
        projectTypeId: pwaType.id,
        questionText: 'Which PWA features do you need?',
        questionType: QuestionType.MULTISELECT,
        category: 'Features',
        options: [
          { value: 'offline', label: 'Offline Functionality' },
          { value: 'push', label: 'Push Notifications' },
          { value: 'background-sync', label: 'Background Sync' },
          { value: 'install', label: 'App Install Prompt' },
          { value: 'share', label: 'Web Share API' },
          { value: 'camera', label: 'Camera Access' },
        ],
        orderIndex: 3,
        isRequired: true,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: pwaType.id,
        questionText: 'Caching strategy?',
        questionType: QuestionType.SELECT,
        category: 'Performance',
        options: [
          { value: 'cache-first', label: 'Cache First' },
          { value: 'network-first', label: 'Network First' },
          { value: 'stale-while-revalidate', label: 'Stale While Revalidate' },
          { value: 'network-only', label: 'Network Only' },
        ],
        orderIndex: 4,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: pwaType.id,
        questionText: 'Do you need data persistence?',
        questionType: QuestionType.SELECT,
        category: 'Data',
        options: [
          { value: 'none', label: 'No persistence' },
          { value: 'localstorage', label: 'LocalStorage' },
          { value: 'indexeddb', label: 'IndexedDB' },
          { value: 'websql', label: 'WebSQL' },
        ],
        orderIndex: 5,
        isRequired: false,
        affectsPromptSection: 'techStack',
      },
    ];

    for (const question of pwaQuestions) {
      await prisma.question.create({
        data: {
          id: uuidv4(),
          ...question,
        },
      });
    }
    console.log(`✅ Created ${pwaQuestions.length} questions for Progressive Web App`);
  }

  // Real-time Chat App Questions
  const chatAppType = projectTypes.find(pt => pt.name === 'Real-time Chat App');
  if (chatAppType) {
    const chatAppQuestions = [
      {
        projectTypeId: chatAppType.id,
        questionText: 'Type of chat application?',
        questionType: QuestionType.SELECT,
        category: 'Type',
        options: [
          { value: 'one-to-one', label: 'One-to-One Chat' },
          { value: 'group', label: 'Group Chat' },
          { value: 'both', label: 'Both One-to-One and Group' },
          { value: 'channels', label: 'Channel-based (like Slack)' },
        ],
        orderIndex: 1,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: chatAppType.id,
        questionText: 'Real-time technology preference?',
        questionType: QuestionType.SELECT,
        category: 'Technical',
        options: [
          { value: 'socket.io', label: 'Socket.io' },
          { value: 'websockets', label: 'Native WebSockets' },
          { value: 'pusher', label: 'Pusher' },
          { value: 'ably', label: 'Ably' },
          { value: 'firebase', label: 'Firebase Realtime' },
        ],
        orderIndex: 2,
        isRequired: true,
        affectsPromptSection: 'techStack',
      },
      {
        projectTypeId: chatAppType.id,
        questionText: 'Which features do you need?',
        questionType: QuestionType.MULTISELECT,
        category: 'Features',
        options: [
          { value: 'typing', label: 'Typing Indicators' },
          { value: 'read-receipts', label: 'Read Receipts' },
          { value: 'presence', label: 'Online/Offline Status' },
          { value: 'file-sharing', label: 'File Sharing' },
          { value: 'voice', label: 'Voice Messages' },
          { value: 'video-call', label: 'Video Calling' },
          { value: 'reactions', label: 'Message Reactions' },
          { value: 'threads', label: 'Message Threads' },
        ],
        orderIndex: 3,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: chatAppType.id,
        questionText: 'Do you need message history?',
        questionType: QuestionType.BOOLEAN,
        category: 'Data',
        orderIndex: 4,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: chatAppType.id,
        questionText: 'Do you need end-to-end encryption?',
        questionType: QuestionType.BOOLEAN,
        category: 'Security',
        orderIndex: 5,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: chatAppType.id,
        questionText: 'Expected concurrent users?',
        questionType: QuestionType.SELECT,
        category: 'Scale',
        options: [
          { value: 'small', label: '< 100 users' },
          { value: 'medium', label: '100-1000 users' },
          { value: 'large', label: '1000-10000 users' },
          { value: 'enterprise', label: '> 10000 users' },
        ],
        orderIndex: 6,
        isRequired: false,
        affectsPromptSection: 'requirements',
      },
    ];

    for (const question of chatAppQuestions) {
      await prisma.question.create({
        data: {
          id: uuidv4(),
          ...question,
        },
      });
    }
    console.log(`✅ Created ${chatAppQuestions.length} questions for Real-time Chat App`);
  }

  // Landing Page Questions
  const landingPageType = projectTypes.find(pt => pt.name === 'Landing Page');
  if (landingPageType) {
    const landingPageQuestions = [
      {
        projectTypeId: landingPageType.id,
        questionText: 'What is the primary goal of your landing page?',
        questionType: QuestionType.SELECT,
        category: 'Purpose',
        options: [
          { value: 'product', label: 'Product Launch' },
          { value: 'saas', label: 'SaaS Sign-ups' },
          { value: 'lead-gen', label: 'Lead Generation' },
          { value: 'event', label: 'Event Registration' },
          { value: 'app-download', label: 'App Downloads' },
          { value: 'waitlist', label: 'Waitlist Sign-ups' },
        ],
        orderIndex: 1,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: landingPageType.id,
        questionText: 'Framework preference?',
        questionType: QuestionType.SELECT,
        category: 'Technical',
        options: [
          { value: 'nextjs', label: 'Next.js' },
          { value: 'gatsby', label: 'Gatsby' },
          { value: 'astro', label: 'Astro' },
          { value: 'html-css', label: 'Plain HTML/CSS' },
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue.js' },
        ],
        orderIndex: 2,
        isRequired: true,
        affectsPromptSection: 'techStack',
      },
      {
        projectTypeId: landingPageType.id,
        questionText: 'Which sections do you need?',
        questionType: QuestionType.MULTISELECT,
        category: 'Content',
        options: [
          { value: 'hero', label: 'Hero Section' },
          { value: 'features', label: 'Features' },
          { value: 'pricing', label: 'Pricing Tables' },
          { value: 'testimonials', label: 'Testimonials' },
          { value: 'faq', label: 'FAQ' },
          { value: 'team', label: 'Team Members' },
          { value: 'contact', label: 'Contact Form' },
          { value: 'newsletter', label: 'Newsletter Signup' },
        ],
        orderIndex: 3,
        isRequired: true,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: landingPageType.id,
        questionText: 'Do you need animations?',
        questionType: QuestionType.SELECT,
        category: 'Design',
        options: [
          { value: 'none', label: 'No animations' },
          { value: 'simple', label: 'Simple transitions' },
          { value: 'moderate', label: 'Scroll animations' },
          { value: 'advanced', label: 'Complex animations' },
        ],
        orderIndex: 4,
        isRequired: false,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: landingPageType.id,
        questionText: 'SEO optimization level?',
        questionType: QuestionType.SELECT,
        category: 'Marketing',
        options: [
          { value: 'basic', label: 'Basic SEO' },
          { value: 'standard', label: 'Standard SEO' },
          { value: 'advanced', label: 'Advanced SEO' },
          { value: 'enterprise', label: 'Enterprise SEO' },
        ],
        orderIndex: 5,
        isRequired: false,
        affectsPromptSection: 'requirements',
      },
    ];

    for (const question of landingPageQuestions) {
      await prisma.question.create({
        data: {
          id: uuidv4(),
          ...question,
        },
      });
    }
    console.log(`✅ Created ${landingPageQuestions.length} questions for Landing Page`);
  }

  // Portfolio Website Questions
  const portfolioType = projectTypes.find(pt => pt.name === 'Portfolio Website');
  if (portfolioType) {
    const portfolioQuestions = [
      {
        projectTypeId: portfolioType.id,
        questionText: 'What type of portfolio?',
        questionType: QuestionType.SELECT,
        category: 'Type',
        options: [
          { value: 'developer', label: 'Developer/Engineer' },
          { value: 'designer', label: 'Designer' },
          { value: 'photographer', label: 'Photographer' },
          { value: 'artist', label: 'Artist' },
          { value: 'writer', label: 'Writer/Journalist' },
          { value: 'agency', label: 'Agency/Studio' },
        ],
        orderIndex: 1,
        isRequired: true,
        affectsPromptSection: 'requirements',
      },
      {
        projectTypeId: portfolioType.id,
        questionText: 'Framework preference?',
        questionType: QuestionType.SELECT,
        category: 'Technical',
        options: [
          { value: 'nextjs', label: 'Next.js' },
          { value: 'gatsby', label: 'Gatsby' },
          { value: 'astro', label: 'Astro' },
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue.js' },
          { value: 'html-css', label: 'Plain HTML/CSS' },
        ],
        orderIndex: 2,
        isRequired: true,
        affectsPromptSection: 'techStack',
      },
      {
        projectTypeId: portfolioType.id,
        questionText: 'Which sections do you need?',
        questionType: QuestionType.MULTISELECT,
        category: 'Content',
        options: [
          { value: 'about', label: 'About Me' },
          { value: 'projects', label: 'Projects/Work' },
          { value: 'skills', label: 'Skills' },
          { value: 'experience', label: 'Experience/Resume' },
          { value: 'blog', label: 'Blog' },
          { value: 'contact', label: 'Contact Form' },
          { value: 'testimonials', label: 'Testimonials' },
          { value: 'services', label: 'Services' },
        ],
        orderIndex: 3,
        isRequired: true,
        affectsPromptSection: 'features',
      },
      {
        projectTypeId: portfolioType.id,
        questionText: 'Do you need a CMS for content?',
        questionType: QuestionType.SELECT,
        category: 'Content',
        options: [
          { value: 'none', label: 'No CMS (hardcoded)' },
          { value: 'markdown', label: 'Markdown files' },
          { value: 'contentful', label: 'Contentful' },
          { value: 'sanity', label: 'Sanity' },
          { value: 'strapi', label: 'Strapi' },
        ],
        orderIndex: 4,
        isRequired: false,
        affectsPromptSection: 'techStack',
      },
      {
        projectTypeId: portfolioType.id,
        questionText: 'Design style preference?',
        questionType: QuestionType.SELECT,
        category: 'Design',
        options: [
          { value: 'minimal', label: 'Minimal' },
          { value: 'modern', label: 'Modern' },
          { value: 'creative', label: 'Creative/Artistic' },
          { value: 'professional', label: 'Professional' },
          { value: 'dark', label: 'Dark Theme' },
        ],
        orderIndex: 5,
        isRequired: false,
        affectsPromptSection: 'requirements',
      },
    ];

    for (const question of portfolioQuestions) {
      await prisma.question.create({
        data: {
          id: uuidv4(),
          ...question,
        },
      });
    }
    console.log(`✅ Created ${portfolioQuestions.length} questions for Portfolio Website`);
  }
}

async function seedTemplates(projectTypes: any[]) {
  // Create base templates for each project type
  for (const projectType of projectTypes) {
    const template = {
      id: uuidv4(),
      name: `${projectType.name} Base Template`,
      description: `Standard template for ${projectType.name} projects`,
      projectTypeId: projectType.id,
      templateStructure: {
        opening: 'I need you to create a comprehensive implementation plan for {{projectName}}, which is a {{projectType}} with the following specifications:',
        sections: [
          'projectType',
          'requirements',
          'techStack',
          'features',
          'constraints',
          'bestPractices',
          'outputFormat',
        ],
      },
      variables: {
        projectName: 'Project name from answers',
        projectType: 'Project type name',
        requirements: 'Extracted from answers',
        techStack: 'Technical stack from answers',
        features: 'Features list from answers',
      },
      sections: {
        projectType: {
          template: '## Project Type\n{{projectType}}\n{{description}}',
          order: 1,
        },
        requirements: {
          template: '## Core Requirements\n{{requirements}}',
          order: 2,
        },
        techStack: {
          template: '## Technical Stack\n{{techStack}}',
          order: 3,
        },
        features: {
          template: '## Core Features\n{{features}}',
          order: 4,
        },
        constraints: {
          template: '## Constraints & Requirements\n{{constraints}}',
          order: 5,
        },
        bestPractices: {
          template: '## Best Practices to Follow\n{{bestPractices}}',
          order: 6,
        },
        outputFormat: {
          template: '## Expected Output\nPlease provide:\n{{outputRequirements}}\n\nFocus on production-ready code with proper error handling, logging, and monitoring capabilities.',
          order: 7,
        },
      },
    };

    await prisma.template.create({
      data: template,
    });

    // Update project type with base template
    await prisma.projectType.update({
      where: { id: projectType.id },
      data: { baseTemplateId: template.id },
    });

    console.log(`✅ Created template for ${projectType.name}`);
  }
}

async function main() {
  console.log('🌱 Starting seed process...');
  
  try {
    // Seed project types
    const projectTypes = await seedProjectTypes();
    
    // Seed questions
    await seedQuestions(projectTypes);
    
    // Seed templates
    await seedTemplates(projectTypes);
    
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});