# AgenticResume

![AgenticResume Logo](https://via.placeholder.com/1200x600/4338ca/FFFFFF?text=AgenticResume)

AgenticResume is an advanced web application that leverages AI agents to automatically tailor resumes for specific job postings. The system analyzes job descriptions, profiles candidates, tailors resumes, and generates interview preparation materials through a multi-agent AI system powered by CrewAI.

## 🌟 Features

- **User Authentication and Management**: Secure login and registration system
- **Resume Creation and Management**: Create and edit resumes with Markdown support
- **Job Application Tracking**: Track application status and progress
- **AI-Powered Resume Tailoring**: Automatically tailor resumes to match job requirements
- **Interview Preparation**: Generate talking points and practice questions
- **Export Functionality**: Export resumes and materials in various formats

## 🚀 Demo

![AgenticResume Demo](https://via.placeholder.com/800x450/4338ca/FFFFFF?text=Demo+Screenshot)

## 🛠️ Technology Stack

- **Backend**: Flask, SQLAlchemy, JWT Authentication
- **AI Component**: CrewAI, OpenAI API integration
- **Frontend**: React, Tailwind CSS
- **Database**: PostgreSQL
- **Deployment**: Docker, Docker Compose

## 🧠 AI-Powered Resume Tailoring

AgenticResume uses a multi-agent AI system built with CrewAI to:

1. **Analyze Job Postings**: Extract key requirements, skills, and qualifications
2. **Profile Candidates**: Understand your experience and strengths
3. **Tailor Resumes**: Highlight relevant skills and experience for specific job postings
4. **Prepare for Interviews**: Generate questions and talking points based on your resume and the job

## 📋 Getting Started

### Prerequisites

- Docker and Docker Compose
- OpenAI API key
- Serper API key (for web search)

### Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agentic-resume.git
cd agentic-resume
```

2. Create a `.env` file with your API keys:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Start the application:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Manual Setup (Without Docker)

#### Backend

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
export FLASK_APP=backend/app.py
export FLASK_ENV=development
export DATABASE_URI=postgresql://user:password@localhost:5432/agentic_resume
export OPENAI_API_KEY=your_openai_api_key
export SERPER_API_KEY=your_serper_api_key
```

3. Run database migrations:
```bash
flask db upgrade
```

4. Start the Flask application:
```bash
flask run
```

#### Frontend

1. Install Node.js dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## 📖 Documentation

- [Technical Documentation](TECHNICAL_DOCUMENTATION.md): Detailed technical information
- [Contributing Guide](CONTRIBUTING.md): Guidelines for contributing to the project
- [Architecture Overview](ARCHITECTURE.md): System architecture and component interactions

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [CrewAI](https://github.com/joaomdmoura/crewAI) for the multi-agent framework
- [OpenAI](https://openai.com/) for the language model API
- [Flask](https://flask.palletsprojects.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend library
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Contact

For questions or support, please open an issue or contact the maintainers.