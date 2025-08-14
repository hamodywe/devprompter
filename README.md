# DevPromptor 🚀

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/AI-OpenAI%20%26%20Anthropic-orange?style=for-the-badge" alt="AI Providers" />
</div>

<div align="center">
  <h3>🎯 Intelligent Prompt Generation for Development Projects</h3>
  <p>Transform your project ideas into optimized AI prompts with context-aware questions and tailored outputs</p>
</div>

---

## ✨ Features

### 🧠 **Smart Question Generation**
- **Context-Aware**: Dynamically generates questions based on project type
- **Conditional Logic**: Questions adapt based on previous answers
- **12 Question Types**: TEXT, SELECT, MULTISELECT, BOOLEAN, EMAIL, URL, NUMBER, TECH_STACK, and more
- **Validation System**: Built-in answer validation with custom rules

### 🎨 **Intelligent Prompt Creation**
- **Template-Based**: Professional prompt templates based on best practices
- **Reference Quality**: Uses production prompts from Cursor, Windsurf, Devin AI, and more
- **Multiple Formats**: Detailed, concise, or step-by-step output formats
- **Context-Rich**: Includes project specifications, requirements, constraints, and best practices

### 📊 **5 MVP Project Types**
- **REST API**: Complete API with authentication, documentation, and best practices
- **React SPA**: Single Page Application with routing and state management
- **E-commerce Website**: Full e-commerce platform with payment integration
- **Blog Platform**: Content management system with SEO optimization
- **Admin Dashboard**: Data visualization with charts and real-time updates

### 📤 **Export Options**
- **Multiple Formats**: Export as Markdown, JSON, or Plain Text
- **Copy to Clipboard**: One-click copying for quick sharing
- **Download Files**: Save prompts for future reference
- **Syntax Highlighting**: Beautiful code preview with multiple viewing modes

### 🚀 **Modern Tech Stack**
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL with comprehensive schema
- **UI Components**: Radix UI with custom styling
- **Validation**: Zod for robust data validation

## 🛠️ Installation

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL database

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/hamodyweb/devpromptor.git
cd devpromptor
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your PostgreSQL connection string
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
```
Frontend: http://localhost:3000
Backend API: http://localhost:3001
```

## 📖 Usage

1. **Select Project Type**: Choose from 5 available project types
2. **Answer Questions**: Fill out the intelligent questionnaire
3. **Generate Prompt**: Get your optimized prompt
4. **Copy & Use**: Copy the prompt and paste it into your AI coding assistant (Claude, GPT-4, etc.)
5. **Export Results**: Download as .txt, .md, or .json
6. **Provide Feedback**: Rate and comment on generated prompts

## 🏗️ Architecture

```mermaid
graph TD
    A[User] -->|Visits| B[DevPrompter Web App]
    B -->|Selects Project Type| C[Questionnaire Form]
    C -->|Answers Questions| D[Question Engine]
    D -->|Validates & Processes| E[Prompt Builder]
    E -->|Uses Templates| F[Generated Prompt]
    F -->|Export Options| G[Download/Copy<br/>MD/JSON/TXT]
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/devprompter?schema=public
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📚 API Documentation

### Project Types
```http
GET /api/project-types
GET /api/project-types/:id
GET /api/project-types/:id/questions
```

### Generate Prompt
```http
POST /api/projects/:typeId/generate
Content-Type: application/json

{
  "answers": {
    "projectName": "My API",
    "framework": "node-express",
    "database": "postgresql",
    ...
  },
  "options": {
    "format": "detailed" // or "concise" or "step-by-step"
  }
}
```

### Questions
```http
POST /api/questions/:id/validate
POST /api/questions/conditional
POST /api/questions/completion
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hamody Web**
- GitHub: [@hamodyweb](https://github.com/hamodyweb)

**Ali Fawzi**
- GitHub: [@Ali-Fawzi](https://github.com/Ali-Fawzi)

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Anthropic for Claude API
- Next.js team for the amazing framework
- All contributors and users

---

<div align="center">
  <p>Project Owner & Lead Developer ❤️ by <a href="https://github.com/hamodyweb">Hamody Web</a></p>
  <p>Idea Collaborator & Developer   ❤️ by <a href="https://github.com/Ali-Fawzi">Ali Fawzi</a></p>

  <p>⭐ Star this repo if you find it helpful!</p>
</div> 
