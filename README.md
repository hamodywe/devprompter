# DevPrompter 🚀

<div align="center">
  <img src="./docs/images/logo.png" alt="DevPrompter Logo" width="120" height="120">
  
  <h3>🎯 AI-Powered Prompt Engineering Platform</h3>
  <p><strong>Transform your project ideas into optimized AI prompts with intelligent question generation and multi-AI enhancement</strong></p>

  <img src="https://gcdnb.pbrd.co/images/gXDEjjyneffL.png" alt="DevPrompter - AI-Powered Prompt Engineering Platform" width="800">

  <p>
    <a href="https://github.com/hamodywe/devprompter/stargazers">
      <img src="https://img.shields.io/github/stars/hamodywe/devprompter?style=for-the-badge&logo=github&color=yellow" alt="GitHub Stars">
    </a>
    <a href="https://github.com/hamodywe/devprompter/network/members">
      <img src="https://img.shields.io/github/forks/hamodywe/devprompter?style=for-the-badge&logo=github&color=blue" alt="GitHub Forks">
    </a>
    <a href="https://github.com/hamodywe/devprompter/issues">
      <img src="https://img.shields.io/github/issues/hamodywe/devprompter?style=for-the-badge&logo=github&color=red" alt="GitHub Issues">
    </a>
    <a href="https://github.com/hamodywe/devprompter/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/hamodywe/devprompter?style=for-the-badge&color=green" alt="License">
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/React-19.1-blue?style=for-the-badge&logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge&logo=node.js" alt="Node.js">
    <img src="https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/AI-OpenAI%20%26%20Anthropic-orange?style=for-the-badge" alt="AI Providers">
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#demo">Demo</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#documentation">Documentation</a> •
    <a href="#contributing">Contributing</a>
  </p>
  
  <p>
    <strong>🌐 Web Platform Coming Soon!</strong> | 
    <strong>💰 Save 40% on AI Tokens</strong> | 
    <strong>⚡ 10x Faster Development</strong>
  </p>
</div>

---

## 🌟 What is DevPrompter?

DevPrompter is a **sophisticated AI-powered platform** that revolutionizes how developers create prompts for AI coding assistants. Instead of writing prompts manually, DevPrompter uses intelligent questionnaires and multi-AI enhancement to generate **production-ready, optimized prompts** that deliver superior results while **saving you tokens and costs**.

### 🎯 Core Innovation
- **Multi-AI Enhancement Pipeline**: Uses multiple AI providers (OpenAI, Anthropic) to create prompts superior to manual writing
- **Context-Aware Intelligence**: Analyzes your project requirements and generates tailored questions
- **Production-Ready Output**: Generates prompts that work immediately with any AI coding assistant
- **Token & Cost Optimization**: Smart prompts reduce AI agent token usage and development costs
- **Time-Saving**: Get optimized project setup in minutes instead of hours

---

## ✨ Features

### 🧠 **Intelligent Question Engine**
- **Dynamic Question Generation**: AI generates contextual questions based on your project type
- **Conditional Logic**: Questions adapt based on previous answers for maximum relevance
- **12+ Question Types**: TEXT, SELECT, MULTISELECT, BOOLEAN, EMAIL, URL, NUMBER, TECH_STACK, and more
- **Smart Validation**: Built-in validation with custom rules and real-time feedback

### 🎨 **AI-Enhanced Prompt Creation**
- **Multi-AI Optimization**: Uses OpenAI GPT-4 and Anthropic Claude for prompt enhancement
- **Quality Scoring**: AI validates prompt quality with scores for clarity, completeness, and technical accuracy
- **Template-Based**: Professional templates based on production prompts from Cursor, Windsurf, Devin AI
- **Multiple Formats**: Detailed, concise, step-by-step, or multi-stage execution formats

### 📊 **15 Project Types Supported**
- **Web Development**: REST API, React SPA, E-commerce Website, Blog Platform, Landing Page
- **Applications**: SaaS Application, Mobile App, Progressive Web App, Admin Dashboard
- **Tools & Extensions**: CLI Tool, Chrome Extension, Discord Bot
- **Portfolio & Content**: Portfolio Website, Real-time Chat App
- **APIs**: GraphQL API, and more

### 🚀 **Advanced AI Integration**
- **Real-time Streaming**: Live AI response streaming with progress indicators
- **Provider Failover**: Automatic switching between AI providers for reliability
- **Cost Optimization**: Intelligent provider selection to minimize API costs and token usage
- **Secure API Management**: AES-256 encrypted API key storage
- **Token Efficiency**: Optimized prompts reduce AI agent costs by up to 40%

### 📤 **Export & Integration**
- **Multiple Formats**: Export as Markdown, JSON, or Plain Text
- **One-Click Copy**: Instant clipboard copying for quick sharing
- **Download Options**: Save prompts for future reference
- **Syntax Highlighting**: Beautiful code preview with multiple viewing modes

---

## 🎬 Demo

> **🌐 Live Website**: Coming Soon! We're launching a full web application with enhanced features.
> 
> **🚀 What's Coming**: Advanced AI integrations, team collaboration, custom templates, and more!

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL 15+
- (Optional) AI API Keys for enhanced features

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/hamodywe/devprompter.git
cd devprompter
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database and API keys
npx prisma migrate dev
npm run db:seed
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Environment Variables

**Backend (.env)**
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/devprompter

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# AI Providers (Optional - for enhanced features)
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
ENCRYPTION_KEY=your_32_character_encryption_key
```

---

## 📖 Usage

### Basic Workflow

1. **🎯 Select Project Type**
   - Choose from 15 available project types
   - Each type has tailored questions and optimizations

2. **📝 Answer Questions**
   - Fill out the intelligent questionnaire
   - Questions adapt based on your previous answers
   - Real-time validation ensures quality input

3. **🤖 AI Enhancement**
   - Multiple AI providers optimize your prompt
   - Quality scoring ensures 85%+ effectiveness
   - Real-time streaming shows the enhancement process

4. **📤 Export & Use**
   - Copy the optimized prompt
   - Paste into your AI coding assistant (Claude, GPT-4, Cursor, etc.)
   - Download in multiple formats (.txt, .md, .json)
   - **Save up to 40% on AI tokens** with our optimized prompts

### 💰 Why DevPrompter Saves You Money

- **🎯 Optimized Prompts**: Our AI-enhanced prompts are 40% more efficient than manual prompts
- **📉 Reduced Token Usage**: Smart prompt structure reduces unnecessary AI agent processing
- **⚡ Faster Results**: Get working code faster, reducing development iterations
- **🔄 Reusable Templates**: Build once, use many times for similar projects
- **📊 Cost Tracking**: Monitor your AI usage and optimize for better results

### Advanced Features

- **Multi-Stage Prompts**: For complex projects, get 10 sequential prompts
- **AI Provider Selection**: Choose your preferred AI for enhancement
- **Custom Templates**: Create and save your own prompt templates
- **Project History**: Save and revisit your generated prompts

---

## 🏗️ Architecture

```mermaid
graph TB
    A[User Input] --> B[Question Engine]
    B --> C[AI Context Analysis]
    C --> D[Multi-AI Enhancement]
    D --> E[Quality Validation]
    E --> F[Template Assembly]
    F --> G[Final Prompt Generation]
    
    H[OpenAI GPT-4] --> D
    I[Anthropic Claude] --> D
    J[Template Library] --> F
    K[Best Practices DB] --> F
    
    style A fill:#e3f2fd
    style G fill:#e8f5e8
    style D fill:#fff3e0
```

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL with comprehensive schema
- **AI Integration**: OpenAI GPT-4, Anthropic Claude (more coming)
- **UI Components**: Radix UI with custom styling
- **Validation**: Zod for robust data validation

---

## 📚 Documentation

### API Documentation

#### Project Types
```http
GET /api/project-types
GET /api/project-types/:id
GET /api/project-types/:id/questions
```

#### Generate Prompt
```http
POST /api/projects/:typeId/generate
Content-Type: application/json

{
  "answers": {
    "projectName": "My API",
    "framework": "node-express",
    "database": "postgresql"
  },
  "options": {
    "format": "detailed",
    "aiProvider": "openai"
  }
}
```

#### AI Enhancement
```http
POST /api/ai/enhance
POST /api/ai/score-quality
POST /api/ai/stream-generation
```

### Configuration Guide

<details>
<summary>🔧 Advanced Configuration</summary>

#### AI Providers Setup
1. **OpenAI**: Get API key from [OpenAI Platform](https://platform.openai.com/)
2. **Anthropic**: Get API key from [Anthropic Console](https://console.anthropic.com/)
3. **Add to .env**: Set `OPENAI_API_KEY` and `ANTHROPIC_API_KEY`

#### Database Setup
1. **PostgreSQL**: Install and create database
2. **Prisma**: Run migrations with `npx prisma migrate dev`
3. **Seed Data**: Run `npm run db:seed` for project types

#### Production Deployment
- **Frontend**: Deploy to Vercel/Netlify
- **Backend**: Deploy to Railway/Heroku
- **Database**: Use PostgreSQL on AWS RDS/Supabase

</details>

---

## 🧪 Development

### Project Structure
```
devprompter/
├── frontend/              # Next.js React application
│   ├── app/              # App router pages
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utilities and API client
│   └── public/           # Static assets
├── backend/              # Node.js API server
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── db.ts         # Database connection
│   └── prisma/           # Database schema and migrations
└── docs/                 # Documentation and images
```

### Contributing Workflow

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the coding standards
4. **Add tests**: Ensure good test coverage
5. **Commit changes**: Use conventional commits
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open Pull Request**: Describe your changes

### Development Commands

```bash
# Start development servers
npm run dev              # Both frontend and backend
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only

# Database operations
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed with sample data
npm run db:reset         # Reset database

# Testing
npm run test             # Run all tests
npm run test:frontend    # Frontend tests only
npm run test:backend     # Backend tests only

# Build
npm run build            # Build for production
npm run start            # Start production server
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### How to Contribute

- 🐛 **Bug Reports**: [Open an issue](https://github.com/hamodywe/devprompter/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Open an issue](https://github.com/hamodywe/devprompter/issues/new?template=feature_request.md)
- 📝 **Documentation**: Help improve our docs
- 🔧 **Code**: Submit pull requests

### Contributors

<div align="center">
  <a href="https://github.com/hamodywe/devprompter/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=hamodywe/devprompter" />
  </a>
</div>

---

## 📈 Roadmap

### 🎯 Current (v1.0)
- [x] 15 project types with intelligent questions
- [x] Multi-AI enhancement pipeline
- [x] Real-time streaming and quality scoring
- [x] Multi-stage prompt generation
- [x] Beautiful, responsive UI

### 🚀 Next (v1.1) - Coming Soon
- [ ] **More AI Providers**: Google Gemini, Groq, and Claude Sonnet integration
- [ ] **Custom Template Creation**: Build and share your own prompt templates
- [ ] **Team Collaboration**: Share projects and templates with your team
- [ ] **Advanced Analytics**: Token usage tracking and cost optimization insights
- [ ] **🌐 Web Platform Launch**: Full-featured web application with enhanced UI

### 🌟 Future (v2.0) - Vision
- [ ] **Machine Learning Optimization**: AI learns from successful prompts to improve automatically
- [ ] **Community Marketplace**: Share and discover templates from the developer community
- [ ] **Enterprise Features**: SSO, advanced permissions, and team management
- [ ] **API Ecosystem**: Third-party integrations and developer marketplace

---

## 📊 Stats

<div align="center">
  <img src="https://repobeats.axiom.co/api/embed/YOUR_REPO_ID_HERE.svg" alt="Repobeats analytics" />
</div>

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for GPT-4 API
- [Anthropic](https://anthropic.com/) for Claude API  
- [Next.js Team](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for hosting and deployment
- All contributors and users who make this project better

---

## 👨‍💻 Authors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/hamodywe">
        <img src="https://github.com/hamodywe.png" width="100px;" alt="Hamody Web"/>
        <br />
        <sub><b>Hamody Web</b></sub>
      </a>
      <br />
      <sub>Project Owner & Lead Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/Ali-Fawzi">
        <img src="https://github.com/Ali-Fawzi.png" width="100px;" alt="Ali Fawzi"/>
        <br />
        <sub><b>Ali Fawzi</b></sub>
      </a>
      <br />
      <sub>Idea Collaborator & Developer</sub>
    </td>
  </tr>
</table>

---

<div align="center">
  <h3>⭐ Star this repo if DevPrompter helps you build better AI prompts!</h3>
  <p>
    <a href="https://github.com/hamodywe/devprompter/stargazers">
      <img src="https://img.shields.io/github/stars/hamodywe/devprompter?style=social" alt="GitHub stars">
    </a>
    <a href="https://twitter.com/intent/tweet?text=Check%20out%20DevPrompter%20-%20AI-powered%20prompt%20engineering%20platform!&url=https://github.com/hamodywe/devprompter">
      <img src="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fhamodywe%2Fdevprompter" alt="Tweet">
    </a>
  </p>
  
  <p><strong>Made with ❤️ for the developer community</strong></p>
</div>
