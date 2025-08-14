import { Router } from 'express';
import { apiKeyManager } from '../services/security/ApiKeyManager';
import { z } from 'zod';

const router = Router();

// Schema for API key management
const StoreKeySchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'google', 'groq']),
  apiKey: z.string().min(1),
});

const ValidateKeySchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'google', 'groq']),
});

/**
 * Get API key status for all providers
 * GET /api/keys/status
 */
router.get('/status', async (req, res) => {
  try {
    const status = apiKeyManager.listProviders();
    const statistics = apiKeyManager.getStatistics();

    res.json({
      success: true,
      data: {
        providers: status,
        statistics,
      },
    });
  } catch (error) {
    console.error('Error getting API key status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get API key status',
    });
  }
});

/**
 * Store an API key securely
 * POST /api/keys/store
 */
router.post('/store', async (req, res) => {
  try {
    const validated = StoreKeySchema.parse(req.body);
    
    // Store the API key securely
    await apiKeyManager.storeKey(validated.provider, validated.apiKey);
    
    // Validate the key
    const isValid = await apiKeyManager.validateKey(validated.provider);
    
    res.json({
      success: true,
      data: {
        provider: validated.provider,
        stored: true,
        valid: isValid,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }
    
    console.error('Error storing API key:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to store API key',
    });
  }
});

/**
 * Validate an API key
 * POST /api/keys/validate
 */
router.post('/validate', async (req, res) => {
  try {
    const validated = ValidateKeySchema.parse(req.body);
    
    const isValid = await apiKeyManager.validateKey(validated.provider);
    
    res.json({
      success: true,
      data: {
        provider: validated.provider,
        valid: isValid,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }
    
    console.error('Error validating API key:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate API key',
    });
  }
});

/**
 * Remove an API key
 * DELETE /api/keys/:provider
 */
router.delete('/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    
    if (!['openai', 'anthropic', 'google', 'groq'].includes(provider)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid provider',
      });
    }
    
    await apiKeyManager.removeKey(provider);
    
    res.json({
      success: true,
      message: `API key for ${provider} removed successfully`,
    });
  } catch (error) {
    console.error('Error removing API key:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove API key',
    });
  }
});

/**
 * Rotate master encryption key
 * POST /api/keys/rotate-master
 * 
 * This should be protected by authentication in production
 */
router.post('/rotate-master', async (req, res) => {
  try {
    const { newMasterKey } = req.body;
    
    if (!newMasterKey || newMasterKey.length < 32) {
      return res.status(400).json({
        success: false,
        error: 'New master key must be at least 32 characters',
      });
    }
    
    await apiKeyManager.rotateMasterKey(newMasterKey);
    
    res.json({
      success: true,
      message: 'Master key rotated successfully',
    });
  } catch (error) {
    console.error('Error rotating master key:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to rotate master key',
    });
  }
});

/**
 * Batch validate all configured providers
 * GET /api/keys/validate-all
 */
router.get('/validate-all', async (req, res) => {
  try {
    const providers = ['openai', 'anthropic', 'google', 'groq'];
    const validations = await Promise.all(
      providers.map(async (provider) => {
        const hasKey = apiKeyManager.hasKey(provider);
        const isValid = hasKey ? await apiKeyManager.validateKey(provider) : false;
        
        return {
          provider,
          hasKey,
          valid: isValid,
        };
      })
    );
    
    res.json({
      success: true,
      data: {
        validations,
        summary: {
          total: validations.length,
          configured: validations.filter(v => v.hasKey).length,
          valid: validations.filter(v => v.valid).length,
        },
      },
    });
  } catch (error) {
    console.error('Error validating all API keys:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate API keys',
    });
  }
});

export default router;