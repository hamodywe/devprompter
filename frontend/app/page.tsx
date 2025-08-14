'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Brain, Zap, Shield, ArrowRight, 
  Code2, Cpu, Layers, GitBranch, Terminal,
  CheckCircle, Star, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { AIToggle } from '@/components/ui/AIToggle';
import { QualityScore } from '@/components/ui/QualityScore';
import { AIProviderSelector } from '@/components/ui/AIProviderSelector';
import { StreamingResponse } from '@/components/ui/StreamingResponse';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import ProjectTypeSelector from '@/components/ProjectTypeSelector';
import ProjectDescriptionForm from '@/components/ProjectDescriptionForm';
import QuestionnaireForm from '@/components/QuestionnaireForm';
import PromptPreview from '@/components/PromptPreview';
import { ProjectType } from '@/lib/types';
import { projectsApi, aiApi } from '@/lib/api';
import toast from 'react-hot-toast';

type AppStep = 'landing' | 'select' | 'description' | 'questions' | 'preview' | 'execute';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType | null>(null);
  const [projectDescription, setProjectDescription] = useState<{
    title: string;
    overview: string;
    targetAudience: string;
    businessGoals: string[];
    successMetrics: string;
    constraints: string;
  }>({
    title: '',
    overview: '',
    targetAudience: '',
    businessGoals: [],
    successMetrics: '',
    constraints: '',
  });
  const [generatedPrompt, setGeneratedPrompt] = useState<string | object>('');
  const [projectId, setProjectId] = useState<string>('');
  const [promptMetadata, setPromptMetadata] = useState<any>(null);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string>('openai');
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  // Fetch available AI providers on mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/ai/providers');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.data) {
          setAvailableProviders(data.data);
          // Set first available provider as default
          if (data.data.length > 0 && !data.data.includes(selectedProvider)) {
            setSelectedProvider(data.data[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch AI providers:', error);
        // Silently fail - the UI already handles the no providers case
      }
    };

    // Add a small delay to ensure backend is ready
    const timer = setTimeout(() => {
      fetchProviders();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleProjectTypeSelect = (projectType: ProjectType) => {
    setSelectedProjectType(projectType);
    setProjectDescription(prev => ({
      ...prev,
      title: `${projectType.name} Project`
    }));
    setCurrentStep('description');
  };

  const handleProjectDescriptionSubmit = (description: typeof projectDescription) => {
    setProjectDescription(description);
    setCurrentStep('questions');
  };

  const handleAnswersSubmit = async (answers: Record<string, any>) => {
    if (!selectedProjectType) return;

    try {
      toast.loading('Generating your prompt...', { id: 'generate' });
      
      // Combine project description with answers
      const enrichedAnswers = {
        ...answers,
        projectName: projectDescription.title,
        projectOverview: projectDescription.overview,
        targetAudience: projectDescription.targetAudience,
        businessGoals: projectDescription.businessGoals,
        successMetrics: projectDescription.successMetrics,
        constraints: projectDescription.constraints,
      };

      const response = await projectsApi.generate(
        selectedProjectType.id, 
        enrichedAnswers,
        { format: 'multi-stage' }, // Use new multi-stage format
        aiEnabled
      );
      
      setGeneratedPrompt(response.data.prompt);
      setProjectId(response.data.projectId);
      setPromptMetadata(response.data.metadata);
      
      if (response.data.qualityScore) {
        setQualityScore(response.data.qualityScore.overall);
      }
      
      toast.success('Prompt generated successfully!', { id: 'generate' });
      setCurrentStep('preview');
    } catch (error) {
      console.error('Failed to generate prompt:', error);
      toast.error('Failed to generate prompt. Please try again.', { id: 'generate' });
    }
  };

  const handleExecutePrompt = async () => {
    if (!generatedPrompt) return;
    
    setCurrentStep('execute');
    setIsStreaming(true);
    setStreamingContent('');
    
    try {
      // Convert prompt to string if it's an object
      const promptText = typeof generatedPrompt === 'string' 
        ? generatedPrompt 
        : JSON.stringify(generatedPrompt, null, 2);
        
      await aiApi.stream(
        promptText,
        selectedProvider,
        { temperature: 0.7, maxTokens: 2000 },
        (chunk) => {
          setStreamingContent(prev => prev + chunk);
        }
      );
    } catch (error) {
      console.error('Streaming error:', error);
      toast.error('Failed to execute prompt');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'description') {
      setCurrentStep('select');
    } else if (currentStep === 'questions') {
      setCurrentStep('description');
    } else if (currentStep === 'preview') {
      setCurrentStep('questions');
    } else if (currentStep === 'execute') {
      setCurrentStep('preview');
    } else if (currentStep === 'select') {
      setCurrentStep('landing');
    }
  };

  const handleNewPrompt = () => {
    setCurrentStep('landing');
    setSelectedProjectType(null);
    setGeneratedPrompt('');
    setProjectId('');
    setPromptMetadata(null);
    setQualityScore(null);
    setStreamingContent('');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-300">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 dark:opacity-100 opacity-30 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 dark:opacity-20 opacity-10" />
      </div>

      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-background-glass)] backdrop-blur-lg sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('landing')}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 blur-lg opacity-50" />
                <Sparkles className="relative h-8 w-8 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold">
                <span className="text-gradient">DevPrompter</span>
              </h1>
              <span className="hidden md:inline-block px-2 py-1 text-xs font-medium bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full dark:opacity-100 opacity-80">
                AI-Powered
              </span>
            </button>
            
            <div className="flex items-center gap-4">
              <ThemeToggle size="md" />
              <AIToggle enabled={aiEnabled} onToggle={setAiEnabled} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {currentStep === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              {/* Hero Section */}
              <div className="text-center mb-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="inline-block mb-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 blur-2xl opacity-30 animate-pulse" />
                    <Brain className="relative w-20 h-20 text-purple-400" />
                  </div>
                </motion.div>
                
                <h2 className="text-6xl font-bold mb-6">
                  <span className="text-gradient">AI-Optimized</span>{' '}
                  <span className="text-white">Prompt Engineering</span>
                </h2>
                <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto mb-8">
                  Generate sophisticated prompts using multiple AI providers. Our platform leverages 
                  GPT-4, Claude, and other models to create, optimize, and execute perfect prompts 
                  for your development projects.
                </p>
                
                <div className="flex justify-center gap-4 mb-12">
                  <Button
                    size="lg"
                    variant="ai"
                    onClick={() => setCurrentStep('select')}
                    icon={<Sparkles className="w-5 h-5" />}
                  >
                    Start Generating
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => {
                      const element = document.getElementById('features');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Learn More
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient">85%+</div>
                    <div className="text-sm text-[var(--color-text-muted)]">Quality Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient-purple">4 AI</div>
                    <div className="text-sm text-[var(--color-text-muted)]">Providers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient-blue">&lt; 2min</div>
                    <div className="text-sm text-[var(--color-text-muted)]">Generation Time</div>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <Card variant="ai" hover>
                  <CardHeader>
                    <Brain className="w-10 h-10 text-purple-400 mb-3" />
                    <CardTitle>Multi-AI Optimization</CardTitle>
                    <CardDescription>
                      Leverages OpenAI, Anthropic, Google, and Groq for superior results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-[var(--color-text-tertiary)]">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        GPT-4 for reasoning
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Claude for accuracy
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Real-time optimization
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="gradient" hover>
                  <CardHeader>
                    <Zap className="w-10 h-10 text-yellow-400 mb-3" />
                    <CardTitle>Quality Scoring</CardTitle>
                    <CardDescription>
                      AI validates and scores every prompt for maximum effectiveness
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-[var(--color-text-tertiary)]">
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        Clarity analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        Completeness check
                      </li>
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        Best practices validation
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="glass" hover>
                  <CardHeader>
                    <Shield className="w-10 h-10 text-emerald-400 mb-3" />
                    <CardTitle>Direct Execution</CardTitle>
                    <CardDescription>
                      Execute prompts directly with streaming responses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-[var(--color-text-tertiary)]">
                      <li className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        Real-time streaming
                      </li>
                      <li className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-cyan-400" />
                        Provider failover
                      </li>
                      <li className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        Cost optimization
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* How It Works */}
              <div className="text-center mb-16">
                <h3 className="text-3xl font-bold text-white mb-12">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                  {[
                    { icon: Code2, title: 'Select Project', desc: 'Choose your project type' },
                    { icon: Cpu, title: 'Answer Questions', desc: 'Provide project details' },
                    { icon: Sparkles, title: 'AI Enhancement', desc: 'Multiple AIs optimize' },
                    { icon: Zap, title: 'Execute', desc: 'Stream results directly' },
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      <div className="glass rounded-xl p-6">
                        <step.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                        <h4 className="font-semibold text-[var(--color-text-secondary)] mb-2">{step.title}</h4>
                        <p className="text-sm text-[var(--color-text-muted)]">{step.desc}</p>
                      </div>
                      {index < 3 && (
                        <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-[var(--color-text-muted)] opacity-50" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Select Your Project Type
                  </h2>
                  <p className="text-[var(--color-text-secondary)]">
                    Choose the type of application you want to build
                  </p>
                </div>
                <ProjectTypeSelector onSelect={handleProjectTypeSelect} />
                <div className="mt-8 text-center">
                  <Button variant="ghost" onClick={handleBack}>
                    Back to Home
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'description' && selectedProjectType && (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ProjectDescriptionForm
                projectType={selectedProjectType}
                initialData={projectDescription}
                onSubmit={handleProjectDescriptionSubmit}
                onBack={handleBack}
              />
            </motion.div>
          )}

          {currentStep === 'questions' && selectedProjectType && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <QuestionnaireForm
                projectType={selectedProjectType}
                onSubmit={handleAnswersSubmit}
                onBack={handleBack}
              />
            </motion.div>
          )}

          {currentStep === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <PromptPreview
                    prompt={generatedPrompt}
                    projectId={projectId}
                    metadata={promptMetadata}
                    onBack={handleBack}
                    onNew={handleNewPrompt}
                  />
                </div>
                <div className="space-y-6">
                  {qualityScore && (
                    <Card variant="ai">
                      <CardHeader>
                        <CardTitle>AI Quality Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <QualityScore 
                          score={qualityScore}
                          dimensions={promptMetadata?.qualityDimensions}
                          feedback={promptMetadata?.improvements}
                        />
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card variant="gradient">
                    <CardHeader>
                      <CardTitle>Execute with AI</CardTitle>
                      <CardDescription>
                        {availableProviders.length > 0 
                          ? 'Select a provider to execute your prompt'
                          : 'No AI providers configured'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {availableProviders.length > 0 ? (
                        <>
                          <AIProviderSelector
                            selectedProvider={selectedProvider}
                            onSelect={setSelectedProvider}
                          />
                          <Button
                            className="w-full mt-4"
                            variant="ai"
                            onClick={handleExecutePrompt}
                            icon={<Zap className="w-4 h-4" />}
                          >
                            Execute Prompt
                          </Button>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <Shield className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                          <p className="text-sm text-gray-400 mb-3">
                            No AI providers are configured in the backend.
                          </p>
                          <p className="text-xs text-gray-500">
                            Please add API keys to the backend/.env file
                            <br />
                            See backend/AI_SETUP.md for instructions
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'execute' && (
            <motion.div
              key="execute"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">AI Execution Results</h2>
                <p className="text-[var(--color-text-secondary)]">
                  Generated using {selectedProvider === 'openai' ? 'OpenAI GPT-4' : 
                  selectedProvider === 'anthropic' ? 'Anthropic Claude' : selectedProvider}
                </p>
              </div>
              
              <StreamingResponse
                content={streamingContent}
                isStreaming={isStreaming}
                language="typescript"
              />
              
              <div className="mt-8 flex gap-4">
                <Button variant="secondary" onClick={handleBack}>
                  Back to Prompt
                </Button>
                <Button variant="primary" onClick={handleNewPrompt}>
                  Generate New Prompt
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-background-glass)] backdrop-blur-lg mt-24 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <span className="font-semibold text-[var(--color-text)]">DevPrompter</span>
              <span className="text-xs text-[var(--color-text-muted)]">AI-Powered Development</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
              <span>Powered by GPT-4, Claude 3, Gemini & Groq</span>
              <span>© 2024</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}