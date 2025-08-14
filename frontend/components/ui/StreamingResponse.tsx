'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Download, Loader2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface StreamingResponseProps {
  content: string;
  isStreaming: boolean;
  language?: string;
  className?: string;
  onCopy?: () => void;
  onDownload?: () => void;
}

export function StreamingResponse({
  content,
  isStreaming,
  language = 'typescript',
  className,
  onCopy,
  onDownload,
}: StreamingResponseProps) {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && isStreaming) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content, isStreaming]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Copied to clipboard!');
      if (onCopy) onCopy();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-code-${Date.now()}.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded successfully!');
    if (onDownload) onDownload();
  };

  return (
    <div className={cn('relative group', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <h3 className="text-sm font-medium text-gray-400">Generated Code</h3>
          <AnimatePresence>
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="flex items-center space-x-2"
              >
                <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                <span className="text-xs text-purple-400">Streaming...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            disabled={!content || isStreaming}
            icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            disabled={!content || isStreaming}
            icon={<Download className="w-4 h-4" />}
          >
            Download
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div
        ref={contentRef}
        className="relative rounded-xl border border-gray-800 bg-gray-950 overflow-hidden"
      >
        {/* Streaming indicator line */}
        <AnimatePresence>
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-pulse"
            />
          )}
        </AnimatePresence>

        {/* Code Display */}
        <div className="max-h-[600px] overflow-auto custom-scrollbar">
          {content ? (
            <SyntaxHighlighter
              language={language}
              style={oneDark}
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                background: 'transparent',
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }}
              codeTagProps={{
                style: {
                  fontFamily: 'var(--font-jetbrains)',
                },
              }}
            >
              {content}
            </SyntaxHighlighter>
          ) : (
            <div className="p-8 text-center text-gray-600">
              <div className="space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-sm">Waiting for AI response...</p>
              </div>
            </div>
          )}
        </div>

        {/* Streaming cursor */}
        <AnimatePresence>
          {isStreaming && content && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute bottom-4 right-4 w-2 h-5 bg-purple-500"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Stream progress indicator */}
      {content && (
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>{content.length} characters</span>
          <span>{content.split('\n').length} lines</span>
        </div>
      )}
    </div>
  );
}