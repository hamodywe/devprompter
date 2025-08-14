'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectType } from '@/lib/types';
import { projectTypesApi } from '@/lib/api';
import { 
  ChevronRight, Loader2, Code2, Layout, ShoppingCart, 
  FileText, LayoutDashboard, Sparkles, Server, Globe,
  Database, Smartphone, Bot, Wrench, Gamepad2, ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface ProjectTypeSelectorProps {
  onSelect: (projectType: ProjectType) => void;
}

// Enhanced category configuration
interface CategoryConfig {
  name: string;
  displayName: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  count?: number;
}

const categoryConfigs: Record<string, CategoryConfig> = {
  'Backend': {
    name: 'Backend',
    displayName: 'Backend Development',
    description: 'APIs, databases, and server-side applications',
    icon: <Server className="w-8 h-8" />,
    gradient: 'from-blue-500 to-indigo-600',
  },
  'Frontend': {
    name: 'Frontend',
    displayName: 'Frontend Development', 
    description: 'User interfaces, web apps, and client-side applications',
    icon: <Layout className="w-8 h-8" />,
    gradient: 'from-purple-500 to-pink-600',
  },
  'Fullstack': {
    name: 'Fullstack',
    displayName: 'Fullstack Development',
    description: 'Complete applications with both frontend and backend',
    icon: <Code2 className="w-8 h-8" />,
    gradient: 'from-emerald-500 to-cyan-600',
  },
  'Mobile': {
    name: 'Mobile',
    displayName: 'Mobile Development',
    description: 'Native and cross-platform mobile applications',
    icon: <Smartphone className="w-8 h-8" />,
    gradient: 'from-orange-500 to-red-600',
  },
  'AI/ML': {
    name: 'AI/ML',
    displayName: 'AI & Machine Learning',
    description: 'AI-powered applications and data processing',
    icon: <Bot className="w-8 h-8" />,
    gradient: 'from-green-500 to-teal-600',
  },
  'DevTools': {
    name: 'DevTools',
    displayName: 'Developer Tools',
    description: 'CLI tools, extensions, and automation',
    icon: <Wrench className="w-8 h-8" />,
    gradient: 'from-yellow-500 to-orange-600',
  },
  'Gaming': {
    name: 'Gaming',
    displayName: 'Gaming & Entertainment',
    description: 'Games, bots, and entertainment applications',
    icon: <Gamepad2 className="w-8 h-8" />,
    gradient: 'from-pink-500 to-rose-600',
  },
};

// Project type icon mapping
const projectIconMap: Record<string, React.ReactNode> = {
  'REST API': <Server className="w-6 h-6" />,
  'GraphQL API': <Database className="w-6 h-6" />,
  'React SPA': <Layout className="w-6 h-6" />,
  'E-commerce Platform': <ShoppingCart className="w-6 h-6" />,
  'Blog Platform': <FileText className="w-6 h-6" />,
  'Admin Dashboard': <LayoutDashboard className="w-6 h-6" />,
  'default': <Code2 className="w-6 h-6" />
};

export default function ProjectTypeSelector({ onSelect }: ProjectTypeSelectorProps) {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectTypes();
  }, []);

  const fetchProjectTypes = async () => {
    try {
      setLoading(true);
      const response = await projectTypesApi.getAll();
      setProjectTypes(response.data || []);
    } catch (err) {
      setError('Failed to load project types');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Group project types by category
  const groupedProjectTypes = projectTypes.reduce((acc, projectType) => {
    const category = projectType.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(projectType);
    return acc;
  }, {} as Record<string, ProjectType[]>);

  // Get available categories with counts
  const availableCategories = Object.keys(groupedProjectTypes).map(category => ({
    ...categoryConfigs[category] || {
      name: category,
      displayName: category,
      description: `${category} projects`,
      icon: <Code2 className="w-8 h-8" />,
      gradient: 'from-gray-500 to-gray-600',
    },
    count: groupedProjectTypes[category].length,
  }));

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
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
        <p className="mt-4 text-gray-400">Loading project types...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={fetchProjectTypes}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {!selectedCategory ? (
          <>
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Project Category
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Select a category to see relevant project types
            </p>
            <p className="text-gray-500 max-w-3xl mx-auto mt-2">
              We've organized our project types into clear categories to help you find exactly what you need.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={handleBackToCategories}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Categories
              </button>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {categoryConfigs[selectedCategory]?.displayName || selectedCategory}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              {categoryConfigs[selectedCategory]?.description || 'Choose your project type'}
            </p>
          </>
        )}
      </motion.div>

      {!selectedCategory ? (
        // Show categories
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {availableCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onHoverStart={() => setHoveredId(category.name)}
                onHoverEnd={() => setHoveredId(null)}
              >
                <Card
                  variant="gradient"
                  hover
                  onClick={() => handleCategorySelect(category.name)}
                  className="relative cursor-pointer h-full overflow-hidden group min-h-[200px]"
                >
                  {/* Gradient overlay */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity ${category.gradient}`}
                  />
                  
                  {/* Top gradient line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient}`} />

                  <CardHeader className="relative z-10 flex flex-col items-center text-center">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${category.gradient} shadow-lg`}>
                      {category.icon}
                    </div>
                    <CardTitle className="mt-4 text-xl text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                      {category.displayName}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative z-10 text-center">
                    <CardDescription className="text-gray-400 mb-4">
                      {category.description}
                    </CardDescription>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <span>{category.count} project{category.count !== 1 ? 's' : ''}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        // Show projects in selected category
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {groupedProjectTypes[selectedCategory]?.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredId(type.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              <Card
                variant="gradient"
                hover
                onClick={() => onSelect(type)}
                className="relative cursor-pointer h-full overflow-hidden group"
              >
                {/* Gradient overlay on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity ${
                    categoryConfigs[selectedCategory]?.gradient || 'from-gray-500 to-gray-600'
                  }`}
                />
                
                {/* Top gradient line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                  categoryConfigs[selectedCategory]?.gradient || 'from-gray-500 to-gray-600'
                }`} />

                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${
                      categoryConfigs[selectedCategory]?.gradient || 'from-gray-500 to-gray-600'
                    } bg-opacity-20`}>
                      <div className="text-white">
                        {projectIconMap[type.name] || projectIconMap.default}
                      </div>
                    </div>
                    <motion.div
                      animate={{ x: hoveredId === type.id ? 5 : 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </motion.div>
                  </div>
                  
                  <CardTitle className="text-xl text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                    {type.name}
                  </CardTitle>
                  
                  <CardDescription className="mt-2 text-gray-400 line-clamp-2">
                    {type.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                      categoryConfigs[type.category]?.gradient || 'from-gray-500 to-gray-600'
                    } text-white`}>
                      {type.category}
                    </span>
                    {type._count && (
                      <span className="text-gray-500">
                        {type._count.questions} questions
                      </span>
                    )}
                  </div>
                </CardContent>

                {/* Hover effect border glow */}
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background: hoveredId === type.id 
                      ? `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(139, 92, 246, 0.1), transparent 40%)`
                      : 'none'
                  }}
                />
              </Card>
            </motion.div>
            ))}
        </AnimatePresence>
      </div>
      )}
    </div>
  );
}