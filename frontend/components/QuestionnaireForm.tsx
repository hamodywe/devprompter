'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, QuestionType, ProjectType, ValidationResult } from '@/lib/types';
import { questionsApi, projectTypesApi } from '@/lib/api';
import { 
  ChevronLeft, ChevronRight, Loader2, Info, CheckCircle, 
  AlertCircle, Sparkles, HelpCircle, Hash, Type, List,
  ToggleLeft, Calendar, Link, Mail, Globe, Clock, Layers
} from 'lucide-react';
import * as Progress from '@radix-ui/react-progress';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Select from '@radix-ui/react-select';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import toast from 'react-hot-toast';

interface QuestionnaireFormProps {
  projectType: ProjectType;
  onSubmit: (answers: Record<string, any>) => void;
  onBack: () => void;
}

// Icon mapping for question types
const questionIcons: Record<QuestionType, React.ReactNode> = {
  TEXT: <Type className="w-5 h-5" />,
  LONGTEXT: <Type className="w-5 h-5" />,
  SELECT: <List className="w-5 h-5" />,
  MULTISELECT: <List className="w-5 h-5" />,
  NUMBER: <Hash className="w-5 h-5" />,
  BOOLEAN: <ToggleLeft className="w-5 h-5" />,
  DATE: <Calendar className="w-5 h-5" />,
  URL: <Link className="w-5 h-5" />,
  EMAIL: <Mail className="w-5 h-5" />,
  RANGE: <Hash className="w-5 h-5" />,
  FILE: <Globe className="w-5 h-5" />,
  JSON: <Globe className="w-5 h-5" />,
};

export default function QuestionnaireForm({ 
  projectType, 
  onSubmit, 
  onBack 
}: QuestionnaireFormProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [completion, setCompletion] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formDefaults, setFormDefaults] = useState<Record<string, any>>({});
  
  const { control, handleSubmit, watch, setValue, getValues, reset, formState: { errors } } = useForm({
    defaultValues: formDefaults,
  });

  const answers = watch();
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    updateCompletion();
  }, [answers, questions]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await projectTypesApi.getQuestions(projectType.id);
      const conditionalResponse = await questionsApi.getConditional(
        projectType.id,
        {}
      );
      
      // Combine questions and remove duplicates based on question ID
      const questionMap = new Map<string, Question>();
      const seenIds = new Set<string>();
      
      // Add base questions first
      (response.data || []).forEach((q: Question) => {
        if (q && q.id && !seenIds.has(q.id)) {
          questionMap.set(q.id, q);
          seenIds.add(q.id);
        }
      });
      
      // Add conditional questions, but don't override existing ones
      (conditionalResponse.data || []).forEach((q: Question) => {
        if (q && q.id && !seenIds.has(q.id)) {
          questionMap.set(q.id, q);
          seenIds.add(q.id);
        }
      });
      
      const allQuestions = Array.from(questionMap.values()).filter(q => q && q.id);
      
      // Debug logging to check for issues
      console.log('Fetched questions:', {
        baseQuestions: response.data?.length || 0,
        conditionalQuestions: conditionalResponse.data?.length || 0,
        uniqueQuestions: allQuestions.length,
        questionIds: allQuestions.map(q => q.id)
      });
      
      setQuestions(allQuestions);
      
      // Initialize default values for all questions
      const defaults: Record<string, any> = {};
      allQuestions.forEach(question => {
        switch (question.questionType) {
          case 'MULTISELECT':
            defaults[question.id] = [];
            break;
          case 'BOOLEAN':
            defaults[question.id] = null;
            break;
          case 'NUMBER':
          case 'RANGE':
            defaults[question.id] = '';
            break;
          default:
            defaults[question.id] = '';
        }
      });
      
      setFormDefaults(defaults);
      reset(defaults); // Reset form with new default values
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const updateCompletion = async () => {
    try {
      const response = await questionsApi.getCompletion(projectType.id, answers);
      setCompletion(response.data?.percentage || 0);
    } catch (error) {
      console.error('Failed to update completion:', error);
    }
  };

  const validateCurrentAnswer = async () => {
    if (!currentQuestion) return true;
    
    const answer = answers[currentQuestion.id];
    
    // Check if required field is filled
    if (currentQuestion.isRequired && !answer) {
      setValidationErrors(['This field is required']);
      return false;
    }

    try {
      setValidating(true);
      const response = await questionsApi.validate(currentQuestion.id, answer);
      
      if (response.data?.valid) {
        setValidationErrors([]);
        return true;
      } else {
        setValidationErrors(response.data?.errors || ['Invalid answer']);
        return false;
      }
    } catch (error) {
      console.error('Validation error:', error);
      return true; // Allow to proceed on validation error
    } finally {
      setValidating(false);
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentAnswer();
    if (!isValid) {
      toast.error('Please fix the errors before proceeding');
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setValidationErrors([]);
    } else {
      // Last question, submit the form
      handleFormSubmit(answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setValidationErrors([]);
    }
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      
      // Validate all required fields
      const missingRequired = questions
        .filter(q => q.isRequired && !data[q.id])
        .map(q => q.questionText);
      
      if (missingRequired.length > 0) {
        toast.error('Please answer all required questions');
        return;
      }

      await onSubmit(data);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit answers');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestionInput = (question: Question) => {
    switch (question.questionType) {
      case 'TEXT':
      case 'EMAIL':
      case 'URL':
        return (
          <Controller
            name={question.id}
            control={control}
            rules={{ required: question.isRequired }}
            render={({ field }) => (
              <input
                {...field}
                value={field.value || ''}
                type={question.questionType === 'EMAIL' ? 'email' : 
                      question.questionType === 'URL' ? 'url' : 'text'}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder={question.placeholder || `Enter your ${question.questionType.toLowerCase()}`}
              />
            )}
          />
        );

      case 'LONGTEXT':
        return (
          <Controller
            name={question.id}
            control={control}
            rules={{ required: question.isRequired }}
            render={({ field }) => (
              <textarea
                {...field}
                value={field.value || ''}
                rows={5}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder={question.placeholder || 'Enter detailed description...'}
              />
            )}
          />
        );

      case 'SELECT':
        return (
          <Controller
            name={question.id}
            control={control}
            rules={{ required: question.isRequired }}
            render={({ field }) => (
              <select
                {...field}
                value={field.value || ''}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select an option...</option>
                {question.options?.map((option: any, index: number) => {
                  const value = typeof option === 'string' ? option : option.value;
                  const label = typeof option === 'string' ? option : option.label;
                  // Always use index in key to ensure uniqueness even with empty or duplicate values
                  const keyValue = `${question.id}-option-${index}-${value || 'empty'}`;
                  return (
                    <option key={keyValue} value={value}>
                      {label}
                    </option>
                  );
                })}
              </select>
            )}
          />
        );

      case 'MULTISELECT':
        return (
          <Controller
            name={question.id}
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                {question.options?.map((option: any, index: number) => {
                  const value = typeof option === 'string' ? option : option.value;
                  const label = typeof option === 'string' ? option : option.label;
                  // Always use index in key to ensure uniqueness even with empty or duplicate values
                  const keyValue = `${question.id}-checkbox-${index}-${value || 'empty'}`;
                  return (
                    <label key={keyValue} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        value={value}
                        checked={(field.value || []).includes(value)}
                        onChange={(e) => {
                          const currentValue = field.value || [];
                          if (e.target.checked) {
                            field.onChange([...currentValue, value]);
                          } else {
                            field.onChange(currentValue.filter((v: string) => v !== value));
                          }
                        }}
                        className="w-5 h-5 bg-gray-800 border-gray-600 rounded focus:ring-2 focus:ring-purple-500 text-purple-500"
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          />
        );

      case 'BOOLEAN':
        return (
          <Controller
            name={question.id}
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => field.onChange(true)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    field.value === true 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange(false)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    field.value === false 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  No
                </button>
              </div>
            )}
          />
        );

      case 'NUMBER':
      case 'RANGE':
        return (
          <Controller
            name={question.id}
            control={control}
            rules={{ required: question.isRequired }}
            render={({ field }) => (
              <input
                {...field}
                value={field.value || ''}
                type="number"
                min={question.validation?.min}
                max={question.validation?.max}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder={question.placeholder || 'Enter a number...'}
              />
            )}
          />
        );

      default:
        return (
          <Controller
            name={question.id}
            control={control}
            rules={{ required: question.isRequired }}
            render={({ field }) => (
              <input
                {...field}
                value={field.value || ''}
                type="text"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder={question.placeholder || 'Enter your answer...'}
              />
            )}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-12 w-12 text-purple-500" />
        </motion.div>
        <p className="mt-4 text-gray-400">Loading questions...</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No questions available</p>
        <Button variant="secondary" onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      {/* Ultra Enhanced Progress Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-cyan-600/10 rounded-2xl blur-xl" />
          
          <Card variant="glass" className="relative p-6 backdrop-blur-xl border-gray-800/50">
            <div className="space-y-5">
              {/* Header Section with Stats */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {/* Animated Icon */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-purple-500/30 blur-xl" />
                    <div className="relative p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                      <Layers className="w-6 h-6 text-purple-400" />
                    </div>
                  </motion.div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">
                        Question {currentQuestionIndex + 1}
                      </h3>
                      <span className="text-sm text-gray-500">of {questions.length}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span className="text-gray-400">
                          {currentQuestionIndex} completed
                        </span>
                      </div>
                      <span className="text-gray-600">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span className="text-gray-400">
                          ~{Math.max(1, Math.round((questions.length - currentQuestionIndex) * 0.5))} min left
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Animated Percentage Display */}
                <div className="text-right">
                  <div className="relative">
                    {/* Glow effect for high completion */}
                    {completion >= 75 && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 blur-2xl opacity-50"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity
                        }}
                      />
                    )}
                    <motion.div 
                      key={completion}
                      initial={{ scale: 0.8, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <p className="text-3xl font-bold leading-none">
                        <span className={`${
                          completion === 100 ? 'text-gradient animate-pulse' :
                          completion >= 80 ? 'text-gradient' : 
                          completion >= 50 ? 'text-gradient-purple' : 
                          'text-gradient-blue'
                        }`}>
                          {Math.round(completion)}%
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {completion === 100 ? 'Complete! 🎉' : 
                         completion >= 75 ? 'Almost there!' :
                         completion >= 50 ? 'Halfway done' :
                         'Getting started'}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Multi-Layer Progress Bar */}
              <div className="relative">
                {/* Background track with gradient */}
                <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-full overflow-hidden relative">
                  {/* Secondary progress (answered but not current) */}
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-purple-600/20 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(currentQuestionIndex / questions.length) * 100}%` 
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Primary progress bar */}
                  <motion.div
                    className="h-full relative overflow-hidden rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${completion}%` }}
                    transition={{ 
                      duration: 0.6, 
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  >
                    {/* Multi-color gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
                    
                    {/* Animated particles */}
                    <div className="absolute inset-0 overflow-hidden">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute h-full w-1 bg-white/30"
                          animate={{ 
                            x: [-10, 300],
                            opacity: [0, 1, 0]
                          }}
                          transition={{ 
                            duration: 3,
                            delay: i * 1,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                      animate={{ x: [-200, 400] }}
                      transition={{ 
                        duration: 2.5, 
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Edge glow */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/20 to-transparent" />
                  </motion.div>
                  
                  {/* Milestone markers */}
                  <div className="absolute inset-0 flex items-center">
                    {[25, 50, 75].map((milestone) => (
                      <motion.div
                        key={milestone}
                        className="absolute flex flex-col items-center"
                        style={{ left: `${milestone}%` }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ 
                          opacity: completion >= milestone ? 1 : 0.3,
                          y: 0,
                          scale: completion >= milestone ? 1 : 0.8
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={`w-0.5 h-full ${
                          completion >= milestone ? 'bg-white/50' : 'bg-gray-600'
                        }`} />
                        {completion >= milestone && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-glow"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Percentage labels for milestones */}
                <div className="absolute -bottom-5 inset-x-0 flex items-center">
                  {[0, 25, 50, 75, 100].map((milestone) => (
                    <span
                      key={milestone}
                      className={`text-[10px] transition-all ${
                        completion >= milestone 
                          ? 'text-purple-400 font-medium' 
                          : 'text-gray-600'
                      }`}
                      style={{ 
                        position: 'absolute',
                        left: `${milestone}%`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      {milestone}%
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Question Navigator */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Quick Navigation</span>
                  <span className="text-xs text-gray-600">Click to jump to answered questions</span>
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {questions.map((question, index) => {
                    // Skip if question is null or undefined
                    if (!question || !question.id) return null;
                    
                    const isAnswered = !!answers[question.id];
                    const isCurrent = index === currentQuestionIndex;
                    const isPast = index < currentQuestionIndex;
                    const canNavigate = isPast || isCurrent;
                    
                    return (
                      <motion.button
                        key={`nav-${question.id}-${index}`}
                        onClick={() => {
                          if (canNavigate) {
                            setCurrentQuestionIndex(index);
                            setValidationErrors([]);
                          }
                        }}
                        className={`
                          relative flex-shrink-0 transition-all
                          ${isCurrent ? 'w-12 h-3' : 'w-8 h-3'}
                          rounded-full overflow-hidden
                          ${canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'}
                          group
                        `}
                        whileHover={canNavigate ? { scale: 1.1, y: -2 } : {}}
                        whileTap={canNavigate ? { scale: 0.95 } : {}}
                        disabled={!canNavigate}
                      >
                        {/* Background */}
                        <div className={`
                          absolute inset-0 transition-all
                          ${isCurrent 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                            : isPast
                            ? 'bg-purple-500 group-hover:bg-purple-400'
                            : isAnswered
                            ? 'bg-purple-500/30'
                            : 'bg-gray-700 group-hover:bg-gray-600'
                          }
                        `} />
                        
                        {/* Pulse effect for current */}
                        {isCurrent && (
                          <motion.div
                            className="absolute inset-0 bg-white/30"
                            animate={{ opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                        
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            Q{index + 1}
                            {isCurrent && ' (Current)'}
                            {isAnswered && !isCurrent && ' ✓'}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Category Progress (if questions have categories) */}
              {currentQuestion?.category && (
                <div className="pt-2 border-t border-gray-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Current Section</span>
                    <span className="text-purple-400 font-medium">{currentQuestion.category}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Question Card */}
      {currentQuestion && (
        <Card variant="gradient" className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                  {questionIcons[currentQuestion.questionType] || <HelpCircle className="w-5 h-5" />}
                </div>
                <span className="px-3 py-1 bg-blue-500/20 rounded-full text-xs font-medium text-blue-400">
                  {currentQuestion.category || 'General'}
                </span>
              </div>
              {currentQuestion.isRequired && (
                <span className="text-red-400 text-sm font-medium">* Required</span>
              )}
            </div>
            
            <CardTitle className="text-2xl text-white mb-2">
              {currentQuestion.questionText}
              {currentQuestion.isRequired && <span className="text-red-400 ml-1">*</span>}
            </CardTitle>
            
            {currentQuestion.helpText && (
            <CardDescription className="flex items-start space-x-2 text-gray-400 mt-3">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{currentQuestion.helpText}</span>
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {currentQuestion && currentQuestion.id && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderQuestionInput(currentQuestion)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Validation Errors */}
          <AnimatePresence>
            {validationErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                {validationErrors.map((error, index) => (
                  <div key={`error-${index}-${error}`} className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={currentQuestionIndex === 0 ? onBack : handlePrevious}
          icon={<ChevronLeft className="w-4 h-4" />}
        >
          {currentQuestionIndex === 0 ? 'Back to Selection' : 'Previous'}
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Step {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>

        <Button
          variant="ai"
          onClick={handleNext}
          loading={validating || isSubmitting}
          icon={currentQuestionIndex === questions.length - 1 ? 
            <CheckCircle className="w-4 h-4" /> : 
            <ChevronRight className="w-4 h-4" />
          }
        >
          {currentQuestionIndex === questions.length - 1 ? 'Generate Prompt' : 'Next'}
        </Button>
      </div>
    </motion.div>
  );
}