'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectType } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  FileText, Users, Target, TrendingUp, 
  AlertTriangle, Plus, X, ArrowRight, ArrowLeft
} from 'lucide-react';

interface ProjectDescriptionFormProps {
  projectType: ProjectType;
  initialData?: {
    title: string;
    overview: string;
    targetAudience: string;
    businessGoals: string[];
    successMetrics: string;
    constraints: string;
  };
  onSubmit: (data: {
    title: string;
    overview: string;
    targetAudience: string;
    businessGoals: string[];
    successMetrics: string;
    constraints: string;
  }) => void;
  onBack: () => void;
}

export default function ProjectDescriptionForm({ 
  projectType, 
  initialData, 
  onSubmit, 
  onBack 
}: ProjectDescriptionFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || `${projectType.name} Project`,
    overview: initialData?.overview || '',
    targetAudience: initialData?.targetAudience || '',
    businessGoals: initialData?.businessGoals || [''],
    successMetrics: initialData?.successMetrics || '',
    constraints: initialData?.constraints || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBusinessGoalChange = (index: number, value: string) => {
    const newGoals = [...formData.businessGoals];
    newGoals[index] = value;
    setFormData(prev => ({ ...prev, businessGoals: newGoals }));
  };

  const addBusinessGoal = () => {
    setFormData(prev => ({ 
      ...prev, 
      businessGoals: [...prev.businessGoals, ''] 
    }));
  };

  const removeBusinessGoal = (index: number) => {
    if (formData.businessGoals.length > 1) {
      const newGoals = formData.businessGoals.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, businessGoals: newGoals }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }

    if (!formData.overview.trim()) {
      newErrors.overview = 'Project overview is required';
    } else if (formData.overview.trim().length < 50) {
      newErrors.overview = 'Project overview should be at least 50 characters';
    }

    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'Target audience is required';
    }

    const validGoals = formData.businessGoals.filter(goal => goal.trim());
    if (validGoals.length === 0) {
      newErrors.businessGoals = 'At least one business goal is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Filter out empty business goals
      const cleanedData = {
        ...formData,
        businessGoals: formData.businessGoals.filter(goal => goal.trim())
      };
      onSubmit(cleanedData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Describe Your Project
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Provide key details about your <span className="text-purple-400 font-semibold">{projectType.name}</span> project
          </p>
          <p className="text-gray-500 mt-2">
            This information will help generate more targeted and relevant prompts for your specific needs.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="gradient" className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-2xl">
                <FileText className="w-6 h-6" />
                Project Details
              </CardTitle>
              <CardDescription className="text-gray-400">
                Tell us about your project vision and requirements
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Project Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="e.g., E-commerce Platform for Handmade Crafts"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                )}
              </div>

              {/* Project Overview */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Overview *
                </label>
                <textarea
                  value={formData.overview}
                  onChange={(e) => handleInputChange('overview', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                    errors.overview ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Describe what your project does, its main purpose, and key functionality. Be specific about the problem it solves and how it provides value."
                />
                <div className="flex justify-between mt-1">
                  {errors.overview ? (
                    <p className="text-sm text-red-400">{errors.overview}</p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {formData.overview.length}/500 characters (minimum 50)
                    </p>
                  )}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Target Audience *
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.targetAudience ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="e.g., Small business owners, Craft enthusiasts, Online shoppers aged 25-45"
                />
                {errors.targetAudience && (
                  <p className="mt-1 text-sm text-red-400">{errors.targetAudience}</p>
                )}
              </div>

              {/* Business Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Business Goals *
                </label>
                <div className="space-y-3">
                  {formData.businessGoals.map((goal, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={goal}
                        onChange={(e) => handleBusinessGoalChange(index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={`Business goal ${index + 1} (e.g., Increase online sales by 40%)`}
                      />
                      {formData.businessGoals.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBusinessGoal(index)}
                          className="px-3 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBusinessGoal}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Goal
                  </button>
                </div>
                {errors.businessGoals && (
                  <p className="mt-1 text-sm text-red-400">{errors.businessGoals}</p>
                )}
              </div>

              {/* Success Metrics */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Success Metrics
                </label>
                <input
                  type="text"
                  value={formData.successMetrics}
                  onChange={(e) => handleInputChange('successMetrics', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., 10,000 monthly active users, $50K monthly revenue, 95% uptime"
                />
                <p className="mt-1 text-sm text-gray-500">
                  How will you measure the success of this project?
                </p>
              </div>

              {/* Constraints */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Constraints & Limitations
                </label>
                <textarea
                  value={formData.constraints}
                  onChange={(e) => handleInputChange('constraints', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="e.g., Limited budget of $5K, Must launch within 3 months, Team of 2 developers, Must support mobile devices"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Any budget, time, technical, or resource constraints we should know about?
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between mt-8"
        >
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project Selection
          </Button>
          
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2"
          >
            Continue to Questions
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

