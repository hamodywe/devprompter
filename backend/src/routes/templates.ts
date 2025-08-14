import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// Get all templates
router.get('/', async (req, res) => {
  try {
    const { projectTypeId, isActive = true } = req.query;
    
    const where: any = {};
    if (projectTypeId) where.projectTypeId = projectTypeId as string;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const templates = await prisma.template.findMany({
      where,
      include: {
        projectType: true,
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch templates',
    });
  }
});

// Get single template
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        projectType: true,
        projects: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
      });
    }

    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch template',
    });
  }
});

// Create template
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      projectTypeId,
      templateStructure,
      variables,
      sections,
    } = req.body;

    if (!name || !templateStructure) {
      return res.status(400).json({
        success: false,
        error: 'Name and templateStructure are required',
      });
    }

    const template = await prisma.template.create({
      data: {
        name,
        description,
        projectTypeId,
        templateStructure,
        variables: variables || {},
        sections: sections || {},
      },
    });

    res.status(201).json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create template',
    });
  }
});

// Update template
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      templateStructure,
      variables,
      sections,
      isActive,
    } = req.body;

    const template = await prisma.template.update({
      where: { id },
      data: {
        name,
        description,
        templateStructure,
        variables,
        sections,
        isActive,
      },
    });

    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update template',
    });
  }
});

// Delete template
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if template is in use
    const projectCount = await prisma.project.count({
      where: { templateId: id },
    });

    if (projectCount > 0) {
      // Soft delete by deactivating
      await prisma.template.update({
        where: { id },
        data: { isActive: false },
      });

      res.json({
        success: true,
        message: 'Template deactivated (in use by projects)',
      });
    } else {
      // Hard delete if not in use
      await prisma.template.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Template deleted successfully',
      });
    }
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete template',
    });
  }
});

export default router;