'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { StreamingResponse } from '@/components/ui/StreamingResponse';
import { Button } from '@/components/ui/Button';
import { aiApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function GeneratingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('openai');
  const [executionStarted, setExecutionStarted] = useState(false);

  const projectId = searchParams.get('project');
  const provider = searchParams.get('provider');

  useEffect(() => {
    // Get project data from sessionStorage
    const savedProject = sessionStorage.getItem('generatedProject');
    const savedProvider = sessionStorage.getItem('selectedProvider');
    
    if (savedProject) {
      setProjectData(JSON.parse(savedProject));
    }
    
    if (savedProvider) {
      setSelectedProvider(savedProvider);
    } else if (provider) {
      setSelectedProvider(provider);
    }

    if (!savedProject && !projectId) {
      toast.error('No project found. Please start again.');
      router.push('/project-types');
      return;
    }

    // Auto-start execution
    if (savedProject && !executionStarted) {
      startExecution(JSON.parse(savedProject), savedProvider || provider || 'openai');
    }
  }, [projectId, provider, router, executionStarted]);

  const startExecution = async (data: any, providerName: string) => {
    if (!data.prompt) return;
    
    setExecutionStarted(true);
    setIsStreaming(true);
    setStreamingContent('');
    
    try {
      // Convert prompt to string if it's an object
      const promptText = typeof data.prompt === 'string' 
        ? data.prompt 
        : JSON.stringify(data.prompt, null, 2);
        
      await aiApi.stream(
        promptText,
        providerName,
        { temperature: 0.7, maxTokens: 2000 },
        (chunk) => {
          setStreamingContent(prev => prev + chunk);
        }
      );

      // Store the result for future reference
      const resultData = {
        projectId: data.projectId,
        provider: providerName,
        content: streamingContent,
        timestamp: new Date().toISOString(),
        prompt: data.prompt,
        metadata: data.metadata
      };

      sessionStorage.setItem('lastResult', JSON.stringify(resultData));
      
    } catch (error) {
      console.error('Streaming error:', error);
      toast.error('Failed to execute prompt');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleBack = () => {
    if (projectData) {
      router.push(`/project/new/preview?project=${projectData.projectId}`);
    } else {
      router.push('/project-types');
    }
  };

  const handleNewPrompt = () => {
    // Clear session data
    sessionStorage.removeItem('projectDescription');
    sessionStorage.removeItem('generatedProject');
    sessionStorage.removeItem('selectedProvider');
    router.push('/');
  };

  const handleSaveResult = () => {
    const resultData = {
      projectId: projectData?.projectId || 'unknown',
      provider: selectedProvider,
      content: streamingContent,
      timestamp: new Date().toISOString(),
      prompt: projectData?.prompt,
      metadata: projectData?.metadata
    };

    // Save to localStorage for persistence
    const savedResults = JSON.parse(localStorage.getItem('savedResults') || '[]');
    savedResults.unshift(resultData);
    // Keep only last 10 results
    if (savedResults.length > 10) {
      savedResults.splice(10);
    }
    localStorage.setItem('savedResults', JSON.stringify(savedResults));
    
    toast.success('Result saved successfully!');
  };

  if (!projectData && !projectId) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">No Project Found</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          Please generate a prompt first.
        </p>
        <button
          onClick={() => router.push('/project-types')}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Start New Project
        </button>
      </div>
    );
  }

  const providerName = selectedProvider === 'openai' ? 'OpenAI GPT-4' : 
                     selectedProvider === 'anthropic' ? 'Anthropic Claude' : selectedProvider;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">AI Execution Results</h2>
        <p className="text-[var(--color-text-secondary)]">
          Generated using {providerName}
        </p>
      </div>
      
      <StreamingResponse
        content={streamingContent}
        isStreaming={isStreaming}
        language="typescript"
      />
      
      <div className="mt-8 flex gap-4 flex-wrap">
        <Button variant="secondary" onClick={handleBack}>
          Back to Preview
        </Button>
        <Button variant="primary" onClick={handleNewPrompt}>
          Generate New Prompt
        </Button>
        {streamingContent && !isStreaming && (
          <Button variant="success" onClick={handleSaveResult}>
            Save Result
          </Button>
        )}
      </div>
    </motion.div>
  );
}
