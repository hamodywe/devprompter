import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// Get all project types
router.get('/', async (req, res) => {
  try {
    const projectTypes = await prisma.projectType.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            questions: true,
            projects: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: projectTypes,
    });
  } catch (error) {
    console.error('Error fetching project types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project types',
    });
  }
});

// Get single project type with questions
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const projectType = await prisma.projectType.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
        templates: {
          where: { isActive: true },
        },
      },
    });

    if (!projectType) {
      return res.status(404).json({
        success: false,
        error: 'Project type not found',
      });
    }

    res.json({
      success: true,
      data: projectType,
    });
  } catch (error) {
    console.error('Error fetching project type:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project type',
    });
  }
});

// Get questions for a project type
router.get('/:id/questions', async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.query;
    
    const where: any = { projectTypeId: id };
    if (category) {
      where.category = category as string;
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy: { orderIndex: 'asc' },
    });

    res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch questions',
    });
  }
});

export default router;