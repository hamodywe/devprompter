import { Router } from 'express';
import { aiOrchestrator } from '../services/ai/AIOrchestrationService';
import { cachingService } from '../services/CachingService';
import { costManagementService } from '../services/CostManagementService';

const router = Router();

// Get system status and health
router.get('/status', async (req, res) => {
  try {
    const systemStatus = aiOrchestrator.getSystemStatus();
    
    res.json({
      success: true,
      data: {
        ...systemStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0'
      }
    });
  } catch (error) {
    console.error('Error getting system status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get system status'
    });
  }
});

// Get cache statistics
router.get('/cache/stats', async (req, res) => {
  try {
    const stats = cachingService.getStats();
    const popular = cachingService.getPopularEntries(10);
    
    res.json({
      success: true,
      data: {
        stats,
        popularEntries: popular,
        recommendations: [
          stats.hitRate > 40 ? '✅ Good cache performance' : '⚠️ Consider cache warming',
          stats.totalEntries > 1000 ? '⚠️ Consider cache cleanup' : '✅ Cache size optimal',
          '💡 Cache warming improves response times'
        ]
      }
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cache statistics'
    });
  }
});

// Clear cache (admin operation)
router.delete('/cache', async (req, res) => {
  try {
    cachingService.clear();
    
    res.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache'
    });
  }
});

// Get cost analytics
router.get('/costs/summary', async (req, res) => {
  try {
    const { period = 'month', userId } = req.query;
    
    const summary = await costManagementService.getCostSummary(
      period as 'day' | 'month',
      userId as string
    );
    
    const limits = await costManagementService.checkLimits(userId as string);
    
    res.json({
      success: true,
      data: {
        summary,
        limits,
        recommendations: costManagementService.getCostOptimizationRecommendations()
      }
    });
  } catch (error) {
    console.error('Error getting cost summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cost summary'
    });
  }
});

// Get provider recommendations for optimization
router.post('/recommendations', async (req, res) => {
  try {
    const { operation, requirements = {} } = req.body;
    
    if (!operation) {
      return res.status(400).json({
        success: false,
        error: 'Operation type is required'
      });
    }
    
    const recommendedProvider = costManagementService.selectOptimalProvider(
      operation,
      requirements
    );
    
    const estimatedCost = costManagementService.estimatePromptCost(
      req.body.prompt || 'sample prompt',
      recommendedProvider,
      operation
    );
    
    res.json({
      success: true,
      data: {
        recommendedProvider,
        estimatedCost,
        reasoning: {
          speedPriority: requirements.speedPriority || false,
          costPriority: requirements.costPriority || false,
          qualityPriority: requirements.qualityPriority || false
        },
        alternatives: ['openai', 'anthropic', 'google', 'groq']
          .filter(p => p !== recommendedProvider)
          .map(provider => ({
            provider,
            estimatedCost: costManagementService.estimatePromptCost(
              req.body.prompt || 'sample prompt',
              provider,
              operation
            )
          }))
      }
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      ai: aiOrchestrator.getSystemStatus().status,
      cache: 'operational',
      cost_tracking: 'operational'
    }
  });
});

export default router;

