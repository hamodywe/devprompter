import { Router } from 'express';
import { prisma } from '../db';
import { PromptBuilder } from '../services/PromptBuilder';
import { promptEnhancementEngine } from '../services/PromptEnhancementEngine';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Generate prompt for a project
router.post('/:typeId/generate', async (req, res) => {
  try {
    const { typeId } = req.params;
    const { answers, options = {}, useAI = false } = req.body;

    if (!answers) {
      return res.status(400).json({
        success: false,
        error: 'Answers are required',
      });
    }

    // Get project type
    const projectType = await prisma.projectType.findUnique({
      where: { id: typeId },
      include: {
        baseTemplate: true,
      },
    });

    if (!projectType) {
      return res.status(404).json({
        success: false,
        error: 'Project type not found',
      });
    }

    // Get or create template
    let template = projectType.baseTemplate;
    if (!template) {
      // Create a default template if none exists
      template = await prisma.template.create({
        data: {
          id: uuidv4(),
          name: `Default ${projectType.name} Template`,
          projectTypeId: typeId,
          templateStructure: {},
          variables: {},
          sections: {},
        },
      });
    }

    // Build the prompt
    const promptBuilder = new PromptBuilder(prisma);
    await promptBuilder.initialize(template.id, typeId, answers);
    let promptResult = await promptBuilder.buildPrompt(options);
    let isMultiStage = typeof promptResult === 'object' && 'stages' in promptResult;
    let generatedPrompt = isMultiStage ? JSON.stringify(promptResult, null, 2) : promptResult as string;
    let metadata = {
      ...promptBuilder.getMetadata(),
      isMultiStage,
      ...(isMultiStage && {
        totalStages: (promptResult as any).totalStages,
        estimatedTime: (promptResult as any).estimatedTotalTime,
      })
    };
    let qualityScore = null;
    let enhancements = null;

    // Enhance with AI if requested (only for single-stage prompts)
    if (useAI && !isMultiStage) {
      try {
        const enhancementResult = await promptEnhancementEngine.enhance(
          generatedPrompt,
          { ...answers, projectType: projectType.name },
          options.targetQuality || 85
        );
        
        generatedPrompt = enhancementResult.enhancedPrompt;
        qualityScore = enhancementResult.qualityScore;
        enhancements = enhancementResult.improvements;
        metadata = {
          ...metadata,
          ...enhancementResult.metadata,
          aiEnhanced: true,
        };
      } catch (error) {
        console.error('AI enhancement failed, using base prompt:', error);
        // Fall back to non-AI prompt
        metadata.aiEnhancementError = true;
      }
    }

    // Save the project
    const project = await prisma.project.create({
      data: {
        projectName: answers.projectName || `${projectType.name} Project`,
        projectTypeId: typeId,
        templateId: template.id,
        answers,
        generatedPrompt,
        metadata,
      },
    });

    res.json({
      success: true,
      data: {
        projectId: project.id,
        prompt: isMultiStage ? promptResult : generatedPrompt,
        metadata,
        qualityScore,
        enhancements,
        sections: metadata,
        isMultiStage,
      },
    });
  } catch (error) {
    console.error('Error generating prompt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate prompt',
    });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { userId, projectTypeId, limit = 10, offset = 0 } = req.query;
    
    const where: any = {};
    if (userId) where.userId = userId as string;
    if (projectTypeId) where.projectTypeId = projectTypeId as string;

    const projects = await prisma.project.findMany({
      where,
      take: Number(limit),
      skip: Number(offset),
      orderBy: { createdAt: 'desc' },
      include: {
        projectType: true,
        template: true,
      },
    });

    const total = await prisma.project.count({ where });

    res.json({
      success: true,
      data: {
        projects,
        total,
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
    });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        projectType: {
          include: {
            questions: true,
          },
        },
        template: true,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
    });
  }
});

// Save project
router.post('/', async (req, res) => {
  try {
    const { 
      projectName,
      projectTypeId,
      templateId,
      answers,
      generatedPrompt,
      userId,
      description,
    } = req.body;

    if (!projectTypeId || !answers || !generatedPrompt) {
      return res.status(400).json({
        success: false,
        error: 'projectTypeId, answers, and generatedPrompt are required',
      });
    }

    const project = await prisma.project.create({
      data: {
        projectName: projectName || 'Untitled Project',
        description,
        projectTypeId,
        templateId,
        answers,
        generatedPrompt,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save project',
    });
  }
});

// Update project feedback
router.patch('/:id/feedback', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        rating,
        feedback,
      },
    });

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error updating project feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project feedback',
    });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project',
    });
  }
});

export default router;