# AI Providers Setup Instructions

## Issue Identified
The AI providers are not loading because the API keys in your `.env` file are empty. You need to add actual API key values for at least one AI provider.

## Quick Fix

1. **Edit your `.env` file** in the backend directory
2. **Add your API keys** for at least one provider:

```bash
# Example - Add your actual API keys here:
OPENAI_API_KEY=sk-your-actual-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-key-here
GOOGLE_AI_API_KEY=your-actual-google-ai-key-here
GROQ_API_KEY=gsk_your-actual-groq-key-here
```

## Getting API Keys

### OpenAI (GPT-4)
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to `.env`: `OPENAI_API_KEY=sk-...`

### Anthropic (Claude)
1. Go to https://console.anthropic.com/
2. Navigate to API Keys section
3. Create a new API key
4. Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-...`

### Google AI (Gemini)
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add to `.env`: `GOOGLE_AI_API_KEY=...`

### Groq
1. Go to https://console.groq.com/keys
2. Create a new API key
3. Add to `.env`: `GROQ_API_KEY=gsk_...`

## After Adding Keys

1. **Restart the backend server**:
```bash
cd backend
npm run dev
```

2. **Verify providers are loaded** - You should see:
```
✅ OpenAI provider initialized
✅ Anthropic provider initialized
✅ 2 AI provider(s) initialized successfully
```

3. **Test in the frontend**:
- The AI Provider selector should show available providers
- You should be able to execute prompts with AI

## Notes

- You only need **at least one** API key configured for the system to work
- The system will automatically use available providers
- OpenAI and Anthropic are recommended for best results
- All API keys are encrypted when stored by the application

## Security

- Never commit your `.env` file with real API keys
- Use `.env.example` as a template
- Keep your API keys secure and rotate them regularly