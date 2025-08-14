import { Router } from 'express';
import { prisma } from '../db';
import { QuestionEngine } from '../services/QuestionEngine';

const router = Router();
const questionEngine = new QuestionEngine(prisma);

// Validate answer for a question
router.post('/:id/validate', async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const validation = await questionEngine.validateAnswer(id, answer);

    res.json({
      success: true,
      data: validation,
    });
  } catch (error) {
    console.error('Error validating answer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate answer',
    });
  }
});

// Get conditional questions based on answers
router.post('/conditional', async (req, res) => {
  try {
    const { projectTypeId, answers } = req.body;

    if (!projectTypeId || !answers) {
      return res.status(400).json({
        success: false,
        error: 'projectTypeId and answers are required',
      });
    }

    const questions = await questionEngine.getConditionalQuestions(projectTypeId, answers);

    res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error('Error fetching conditional questions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conditional questions',
    });
  }
});

// Get next question
router.post('/next', async (req, res) => {
  try {
    const { projectTypeId, answeredQuestionIds, answers } = req.body;

    if (!projectTypeId) {
      return res.status(400).json({
        success: false,
        error: 'projectTypeId is required',
      });
    }

    const nextQuestion = await questionEngine.getNextQuestion(
      projectTypeId,
      answeredQuestionIds || [],
      answers || {}
    );

    res.json({
      success: true,
      data: nextQuestion,
    });
  } catch (error) {
    console.error('Error fetching next question:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch next question',
    });
  }
});

// Calculate completion percentage
router.post('/completion', async (req, res) => {
  try {
    const { projectTypeId, answers } = req.body;

    if (!projectTypeId) {
      return res.status(400).json({
        success: false,
        error: 'projectTypeId is required',
      });
    }

    const completion = await questionEngine.calculateCompletion(
      projectTypeId,
      answers || {}
    );

    res.json({
      success: true,
      data: { completion },
    });
  } catch (error) {
    console.error('Error calculating completion:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate completion',
    });
  }
});

export default router;