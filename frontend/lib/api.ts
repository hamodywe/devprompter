import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth (future use)
api.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API methods
export const projectTypesApi = {
  getAll: () => api.get('/project-types'),
  getById: (id: string) => api.get(`/project-types/${id}`),
  getQuestions: (id: string, category?: string) => 
    api.get(`/project-types/${id}/questions`, { params: { category } }),
};

export const questionsApi = {
  validate: (id: string, answer: any) => 
    api.post(`/questions/${id}/validate`, { answer }),
  getConditional: (projectTypeId: string, answers: Record<string, any>) =>
    api.post('/questions/conditional', { projectTypeId, answers }),
  getNext: (projectTypeId: string, answeredQuestionIds: string[], answers: Record<string, any>) =>
    api.post('/questions/next', { projectTypeId, answeredQuestionIds, answers }),
  getCompletion: (projectTypeId: string, answers: Record<string, any>) =>
    api.post('/questions/completion', { projectTypeId, answers }),
};

export const projectsApi = {
  generate: (typeId: string, answers: Record<string, any>, options?: any, useAI?: boolean) =>
    api.post(`/projects/${typeId}/generate`, { answers, options, useAI }),
  getAll: (params?: { userId?: string; projectTypeId?: string; limit?: number; offset?: number }) =>
    api.get('/projects', { params }),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  updateFeedback: (id: string, rating: number, feedback: string) =>
    api.patch(`/projects/${id}/feedback`, { rating, feedback }),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const templatesApi = {
  getAll: (projectTypeId?: string, isActive?: boolean) =>
    api.get('/templates', { params: { projectTypeId, isActive } }),
  getById: (id: string) => api.get(`/templates/${id}`),
  create: (data: any) => api.post('/templates', data),
  update: (id: string, data: any) => api.put(`/templates/${id}`, data),
  delete: (id: string) => api.delete(`/templates/${id}`),
};

// New AI-related API endpoints
export const aiApi = {
  // Enhance a prompt using AI
  enhance: (prompt: string, context?: any, targetQuality?: number) =>
    api.post('/ai/enhance', { prompt, context, targetQuality }),
  
  // Score prompt quality
  score: (prompt: string, context?: any) =>
    api.post('/ai/score', { prompt, context }),
  
  // Execute prompt with AI provider
  execute: (prompt: string, provider?: string, options?: any) =>
    api.post('/ai/execute', { prompt, provider, options }),
  
  // Stream prompt execution
  stream: async (prompt: string, provider?: string, options?: any, onChunk?: (chunk: string) => void) => {
    const response = await fetch(`${API_BASE_URL}/ai/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, provider, options }),
    });

    if (!response.ok) {
      throw new Error('Stream request failed');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    let result = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      result += chunk;
      if (onChunk) onChunk(chunk);
    }

    return result;
  },

  // Get available providers
  getProviders: () => api.get('/ai/providers'),
  
  // Estimate cost
  estimateCost: (prompt: string, provider?: string) =>
    api.post('/ai/estimate-cost', { prompt, provider }),
};

// API key management endpoints
export const keysApi = {
  // Get status of all providers
  getStatus: () => api.get('/keys/status'),
  
  // Store an API key securely
  store: (provider: string, apiKey: string) =>
    api.post('/keys/store', { provider, apiKey }),
  
  // Validate an API key
  validate: (provider: string) =>
    api.post('/keys/validate', { provider }),
  
  // Remove an API key
  remove: (provider: string) =>
    api.delete(`/keys/${provider}`),
  
  // Validate all configured providers
  validateAll: () => api.get('/keys/validate-all'),
};

export default api;