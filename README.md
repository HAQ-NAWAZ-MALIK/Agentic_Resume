# AgenticResume

AgenticResume is an advanced web application that leverages AI agents to automatically tailor resumes for specific job postings. The system analyzes job descriptions, profiles candidates, tailors resumes, and generates interview preparation materials through a multi-agent AI system powered by CrewAI.

## Features

- **User Authentication and Management**: Secure login and registration system
- **Resume Creation and Management**: Create and edit resumes with Markdown support
- **Job Application Tracking**: Track application status and progress
- **AI-Powered Resume Tailoring**: Automatically tailor resumes to match job requirements
- **Interview Preparation**: Generate talking points and practice questions
- **Export Functionality**: Export resumes and materials in various formats

## Technology Stack

- **Backend**: Flask, SQLAlchemy, JWT Authentication
- **AI Component**: CrewAI, OpenAI API integration
- **Frontend**: React, Tailwind CSS
- **Database**: PostgreSQL
- **Deployment**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- Docker and Docker Compose
- OpenAI API key
- Serper API key (for web search)

### Installation

1. Clone the repository:
```bash
https://github.com/HAQ-NAWAZ-MALIK/Agentic_Resume.git
cd agentic-resume
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file with your API keys and configuration
```

3. Start the application with Docker:
```bash
docker-compose up -d
```

4. Access the application:
```
Frontend: http://localhost:3000
Backend API: http://localhost:5000
```

### Manual Setup (Without Docker)

#### Backend

1. Install Python dependencies:
```bash
cd agentic-resume
pip install -r requirements.txt
```

2. Run the Flask application:
```bash
cd backend
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

## Usage

1. **Register and Login**: Create an account or login to access the dashboard
2. **Create a Resume**: Add your resume in Markdown format
3. **Track Job Applications**: Add job postings you're interested in
4. **Tailor Your Resume**: Select a job posting and let AI agents tailor your resume
5. **Prepare for Interviews**: Generate interview materials based on your resume and the job

## Architecture

AgenticResume uses a multi-agent AI system powered by CrewAI to analyze job postings and tailor resumes. The system consists of four specialized agents:

1. **Researcher Agent**: Analyzes job postings to extract key requirements
2. **Profiler Agent**: Builds comprehensive candidate profiles
3. **Resume Strategist Agent**: Tailors resumes to match job requirements
4. **Interview Preparer Agent**: Creates interview questions and talking points

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [CrewAI](https://github.com/joaomdmoura/crewAI)
- [OpenAI](https://openai.com/)
- [Flask](https://flask.palletsprojects.com/)
- [React](https://reactjs.org/)
