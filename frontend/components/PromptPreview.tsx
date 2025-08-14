'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Copy, Download, Check, ChevronLeft, Star, FileText, 
  Code2, Layers, Sparkles, Zap, Info, MessageSquare,
  Clock, Hash, FolderTree, CheckCircle
} from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { projectsApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import toast from 'react-hot-toast';

interface PromptPreviewProps {
  prompt: string | object;
  projectId?: string;
  metadata?: any;
  onBack: () => void;
  onNew: () => void;
}

interface MultiStageCardProps {
  stage: {
    stage: number;
    title: string;
    prompt: string;
    estimatedTime: string;
    description?: string;
  };
  index: number;
}

// Component for individual stage cards
function MultiStageCard({ stage, index }: MultiStageCardProps) {
  const [copied, setCopied] = useState(false);

  const copyStagePrompt = async () => {
    try {
      await navigator.clipboard.writeText(stage.prompt);
      setCopied(true);
      toast.success(`Stage ${stage.stage} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy prompt');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Card variant="gradient" hover className="relative overflow-hidden">
        {/* Stage number indicator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
        
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold text-lg">
                {stage.stage}
              </div>
              <div>
                <CardTitle className="text-xl text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all">
                  {stage.title}
                </CardTitle>
                <CardDescription className="mt-1 text-gray-400">
                  Est. Time: {stage.estimatedTime}
                  {stage.description && ` • ${stage.description}`}
                </CardDescription>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={copyStagePrompt}
              icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
            <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono leading-relaxed max-h-96 overflow-y-auto">
              {stage.prompt}
            </pre>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Stage {stage.stage} of multi-step process</span>
            <span>{stage.prompt.length} characters</span>
          </div>
        </CardContent>

        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br from-purple-500 to-cyan-500"
        />
      </Card>
    </motion.div>
  );
}

export default function PromptPreview({ 
  prompt, 
  projectId,
  metadata,
  onBack, 
  onNew 
}: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState('formatted');

  // Helper function to get prompt as string
  const getPromptAsString = (): string => {
    if (typeof prompt === 'string') {
      return prompt;
    }
    return JSON.stringify(prompt, null, 2);
  };

  // Helper function to check if it's multi-stage
  const isMultiStage = (): boolean => {
    return typeof prompt === 'object' && prompt !== null && 'stages' in prompt;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getPromptAsString());
      setCopied(true);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy prompt');
    }
  };

  const downloadPrompt = (format: 'txt' | 'md' | 'json') => {
    let content = getPromptAsString();
    let mimeType = 'text/plain';
    let filename = `prompt-${Date.now()}.${format}`;

    if (format === 'json') {
      content = JSON.stringify({ prompt: getPromptAsString(), metadata }, null, 2);
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded as ${filename}`);
  };

  const submitFeedback = async () => {
    if (!projectId || (!rating && !feedback)) return;

    try {
      setSubmittingFeedback(true);
      await projectsApi.updateFeedback(projectId, rating, feedback);
      toast.success('Thank you for your feedback!');
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      toast.error('Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const sections = getPromptAsString().split('\n\n').map((section, idx) => {
    const lines = section.split('\n');
    const title = lines[0];
    const content = lines.slice(1).join('\n');
    
    // Detect section type based on title
    let icon = <FileText className="w-4 h-4" />;
    let color = 'text-gray-400';
    
    if (title.includes('Project') || title.includes('##')) {
      icon = <FolderTree className="w-4 h-4" />;
      color = 'text-purple-400';
    } else if (title.includes('Best Practices') || title.includes('Follow')) {
      icon = <CheckCircle className="w-4 h-4" />;
      color = 'text-emerald-400';
    } else if (title.includes('Expected') || title.includes('Output')) {
      icon = <Sparkles className="w-4 h-4" />;
      color = 'text-cyan-400';
    }
    
    return { title, content, icon, color, id: `section-${idx}` };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          icon={<ChevronLeft className="w-4 h-4" />}
          className="mb-4"
        >
          Back to Questions
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-4xl font-bold text-white mb-3">
              Your <span className="text-gradient">AI-Optimized</span> Prompt
            </h2>
            <p className="text-gray-400 text-lg">
              {isMultiStage() 
                ? 'Execute each stage in sequence for best results. Copy individual prompts to your AI assistant.'
                : 'Copy this prompt and paste it into your AI coding assistant (Claude, GPT-4, etc.)'
              }
            </p>
          </div>
          
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="hidden lg:block"
          >
            <Sparkles className="w-12 h-12 text-purple-400" />
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button
          variant="ai"
          onClick={copyToClipboard}
          icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          size="lg"
        >
          {copied ? 'Copied!' : isMultiStage() ? 'Copy All Stages' : 'Copy to Clipboard'}
        </Button>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => downloadPrompt('txt')}
            icon={<Download className="w-4 h-4" />}
          >
            Download .txt
          </Button>

          <Button
            variant="secondary"
            onClick={() => downloadPrompt('md')}
            icon={<Download className="w-4 h-4" />}
          >
            Download .md
          </Button>

          <Button
            variant="secondary"
            onClick={() => downloadPrompt('json')}
            icon={<Download className="w-4 h-4" />}
          >
            Download .json
          </Button>
        </div>
      </div>

      {/* Prompt Display */}
      <Card variant="gradient" className="mb-8 overflow-hidden">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <Tabs.List className="flex">
              <Tabs.Trigger
                value="formatted"
                className="flex-1 px-6 py-4 text-sm font-medium transition-all relative group data-[state=active]:text-purple-400"
              >
                <div className="flex items-center justify-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Formatted View
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={false}
                  animate={{ opacity: activeTab === 'formatted' ? 1 : 0 }}
                />
              </Tabs.Trigger>
              
              <Tabs.Trigger
                value="raw"
                className="flex-1 px-6 py-4 text-sm font-medium transition-all relative group data-[state=active]:text-purple-400"
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Raw Text
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={false}
                  animate={{ opacity: activeTab === 'raw' ? 1 : 0 }}
                />
              </Tabs.Trigger>
              
              <Tabs.Trigger
                value="sections"
                className="flex-1 px-6 py-4 text-sm font-medium transition-all relative group data-[state=active]:text-purple-400"
              >
                <div className="flex items-center justify-center gap-2">
                  <Layers className="w-4 h-4" />
                  {isMultiStage() ? 'Stages' : 'By Sections'}
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={false}
                  animate={{ opacity: activeTab === 'sections' ? 1 : 0 }}
                />
              </Tabs.Trigger>
            </Tabs.List>
          </div>

          <AnimatePresence mode="wait">
            <Tabs.Content value="formatted" className="p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-950 rounded-b-xl"
              >
                {isMultiStage() ? (
                  // Show formatted multi-stage view
                  <div className="p-6 space-y-6">
                    {(prompt as any).stages?.map((stage: any, index: number) => (
                      <motion.div
                        key={`formatted-stage-${stage.stage}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-800 rounded-lg overflow-hidden"
                      >
                        <div className="bg-gray-900/50 px-4 py-2 border-b border-gray-800">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm font-medium rounded-full">
                              Stage {stage.stage}
                            </span>
                            <span className="text-white font-medium">{stage.title}</span>
                            <span className="text-gray-500 text-sm ml-auto">{stage.estimatedTime}</span>
                          </div>
                        </div>
                        <SyntaxHighlighter
                          language="markdown"
                          style={atomDark}
                          customStyle={{
                            margin: 0,
                            padding: '1.5rem',
                            fontSize: '0.875rem',
                            lineHeight: '1.6',
                            background: 'transparent',
                            fontFamily: 'var(--font-jetbrains)',
                          }}
                          showLineNumbers
                        >
                          {stage.prompt}
                        </SyntaxHighlighter>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // Show regular formatted view
                  <SyntaxHighlighter
                    language="markdown"
                    style={atomDark}
                    customStyle={{
                      margin: 0,
                      padding: '2rem',
                      fontSize: '0.875rem',
                      lineHeight: '1.7',
                      background: 'transparent',
                      fontFamily: 'var(--font-jetbrains)',
                    }}
                    showLineNumbers
                  >
                    {getPromptAsString()}
                  </SyntaxHighlighter>
                )}
              </motion.div>
            </Tabs.Content>

            <Tabs.Content value="raw" className="p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6"
              >
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono leading-relaxed">
                  {getPromptAsString()}
                </pre>
              </motion.div>
            </Tabs.Content>

            <Tabs.Content value="sections" className="p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {isMultiStage() ? (
                  <>
                    {/* Multi-stage instructions */}
                    <motion.div
                      key="multi-stage-instructions"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6"
                    >
                      <Card variant="ai" className="border-purple-500/20">
                        <CardContent className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                              <Info className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white mb-1">Multi-Stage Prompt Process</h4>
                              <p className="text-sm text-gray-400">
                                Execute each stage in order. Copy and paste each prompt individually to your AI assistant.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Display multi-stage prompts - each stage in separate card with copy button */}
                    {(prompt as any).stages?.map((stage: any, index: number) => (
                      <MultiStageCard
                        key={`multi-stage-card-${stage.stage}-${index}`}
                        stage={stage}
                        index={index}
                      />
                    ))}
                  </>
                ) : (
                  // Display regular sections
                  sections.map((section, index) => (
                    <motion.div
                      key={`section-${section.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card variant="glass" hover>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gray-800/50 ${section.color}`}>
                              {section.icon}
                            </div>
                            <CardTitle className="text-lg text-white">
                              {section.title}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="whitespace-pre-wrap text-sm text-gray-400 font-mono leading-relaxed">
                            {section.content}
                          </pre>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </Tabs.Content>
          </AnimatePresence>
        </Tabs.Root>
      </Card>

      {/* Metadata */}
      {metadata && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass" className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-400" />
                <CardTitle>Prompt Analytics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm">Total Length</span>
                  </div>
                  <p className="text-2xl font-bold text-gradient">
                    {metadata.totalLength || getPromptAsString().length}
                  </p>
                  <p className="text-xs text-gray-500">characters</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Layers className="w-4 h-4" />
                    <span className="text-sm">Sections</span>
                  </div>
                  <p className="text-2xl font-bold text-gradient-purple">
                    {metadata.sectionsCount || sections.length}
                  </p>
                  <p className="text-xs text-gray-500">organized parts</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FolderTree className="w-4 h-4" />
                    <span className="text-sm">Project Type</span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {metadata.projectType || 'Custom'}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Generated</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {new Date(metadata.timestamp || Date.now()).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Feedback Section */}
      {projectId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="ai" className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <CardTitle>How was your experience?</CardTitle>
              </div>
              <CardDescription>
                Your feedback helps us improve prompt generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Star Rating */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-gray-400">Rate this prompt:</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      onClick={() => setRating(star)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 transition-transform"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-glow'
                            : 'text-gray-600 hover:text-gray-400'
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                {rating > 0 && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-yellow-400 font-medium"
                  >
                    {rating === 5 ? 'Excellent!' : 
                     rating === 4 ? 'Great!' : 
                     rating === 3 ? 'Good' : 
                     rating === 2 ? 'Fair' : 'Poor'}
                  </motion.span>
                )}
              </div>

              {/* Feedback Text */}
              <div className="space-y-4">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Any additional feedback? (optional)"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical transition-all"
                  rows={3}
                />

                <Button
                  variant="primary"
                  onClick={submitFeedback}
                  disabled={submittingFeedback || (!rating && !feedback)}
                  loading={submittingFeedback}
                  icon={<Zap className="w-4 h-4" />}
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center gap-4"
      >
        <Button
          size="lg"
          variant="ai"
          onClick={onNew}
          icon={<Sparkles className="w-5 h-5" />}
        >
          Generate Another Prompt
        </Button>
      </motion.div>
    </motion.div>
  );
}