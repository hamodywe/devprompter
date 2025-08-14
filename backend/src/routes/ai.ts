import { Router } from 'express';
import { aiOrchestrator } from '../services/ai/AIOrchestrationService';
import { promptEnhancementEngine } from '../services/PromptEnhancementEngine';
import { prisma } from '../db';

const router = Router();

// Enhance a prompt using AI
router.post('/enhance', async (req, res) => {
  try {
    const { prompt, answers, targetQuality = 85 } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
      });
    }

    const result = await promptEnhancementEngine.enhance(
      prompt,
      answers || {},
      targetQuality
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Prompt enhancement error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to enhance prompt',
    });
  }
});

// Score prompt quality
router.post('/score', async (req, res) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
      });
    }

    const score = await aiOrchestrator.scorePromptQuality(prompt, context);

    res.json({
      success: true,
      data: score,
    });
  } catch (error) {
    console.error('Prompt scoring error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to score prompt',
    });
  }
});

// Execute prompt with AI
router.post('/execute', async (req, res) => {
  try {
    const { prompt, provider, options } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
      });
    }

    const result = await aiOrchestrator.executePrompt(prompt, provider, options);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Prompt execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute prompt',
    });
  }
});

// Stream prompt execution
router.post('/stream', async (req, res) => {
  try {
    const { prompt, provider, options } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
      });
    }

    // Check if providers are available before setting up SSE
    const providers = aiOrchestrator.getAvailableProviders();
    if (providers.length === 0) {
      return res.status(503).json({
        success: false,
        error: 'No AI providers configured. Please set API keys in .env file.',
      });
    }

    // Set up SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    try {
      const streamResponse = await aiOrchestrator.streamPromptExecution(prompt, provider, options);

      // Stream the response
      for await (const chunk of streamResponse.stream) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }

      res.write('data: [DONE]\n\n');
    } catch (streamError) {
      console.error('Stream execution error:', streamError);
      res.write(`data: ${JSON.stringify({ error: streamError.message || 'Failed to stream prompt' })}\n\n`);
    }
    
    res.end();
  } catch (error) {
    console.error('Stream setup error:', error);
    
    // If headers not sent yet, send proper error response
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to initialize stream',
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || 'Failed to stream prompt' })}\n\n`);
      res.end();
    }
  }
});

// Generate follow-up questions
router.post('/generate-questions', async (req, res) => {
  try {
    const { answers, currentQuestions = [] } = req.body;

    const questions = await promptEnhancementEngine.generateFollowUpQuestions(
      answers || {},
      currentQuestions
    );

    res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error('Question generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate questions',
    });
  }
});

// Validate prompt quality
router.post('/validate', async (req, res) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
      });
    }

    const validation = await promptEnhancementEngine.validateQuality(prompt, context);

    res.json({
      success: true,
      data: validation,
    });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate prompt',
    });
  }
});

// Get available AI providers
router.get('/providers', (req, res) => {
  try {
    const providers = aiOrchestrator.getAvailableProviders();

    res.json({
      success: true,
      data: providers,
    });
  } catch (error) {
    console.error('Provider list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get providers',
    });
  }
});

// Estimate cost for prompt
router.post('/estimate-cost', (req, res) => {
  try {
    const { prompt, provider } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
      });
    }

    const cost = aiOrchestrator.estimateCost(prompt, provider);

    res.json({
      success: true,
      data: { estimatedCost: cost },
    });
  } catch (error) {
    console.error('Cost estimation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to estimate cost',
    });
  }
});

export default router;