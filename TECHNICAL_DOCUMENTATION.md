# AgenticResume Technical Documentation

This documentation provides detailed information about the AgenticResume system architecture, components, and deployment instructions.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Component Interactions](#component-interactions)
3. [AI System Architecture](#ai-system-architecture)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Deployment Guide](#deployment-guide)
7. [Environment Variables](#environment-variables)
8. [Development Setup](#development-setup)

## System Architecture

AgenticResume uses a three-tier architecture:

1. **Frontend**: React application with Tailwind CSS for UI
2. **Backend**: Flask RESTful API with SQLAlchemy ORM
3. **AI Component**: CrewAI-based multi-agent system for resume tailoring

### High-Level Architecture Diagram

```
┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
│                 │           │                 │           │                 │
│    Frontend     │◄─────────►│     Backend     │◄─────────►│   AI Component  │
│    (React)      │   REST    │     (Flask)     │  Python   │    (CrewAI)     │
│                 │    API    │                 │  Module   │                 │
└─────────────────┘           └─────────────────┘           └─────────────────┘
                                      │
                                      │
                                      ▼
                              ┌─────────────────┐
                              │                 │
                              │    Database     │
                              │  (PostgreSQL)   │
                              │                 │
                              └─────────────────┘
```

## Component Interactions

### Frontend-to-Backend Communication

The frontend communicates with the backend through RESTful API calls. All requests are authenticated using JWT tokens. Communication is secured with HTTPS.

### Backend-to-AI Component Communication

The backend interacts with the AI component through direct Python module imports. The AI component is integrated into the backend application, with the `ai_service.py` module serving as an interface between the Flask routes and the CrewAI system.

## AI System Architecture

The AI component uses CrewAI to orchestrate a team of specialized agents that work together to tailor resumes. The system consists of four agents:

1. **Researcher Agent**: Analyzes job postings to extract key requirements and qualifications
2. **Profiler Agent**: Analyzes the candidate's resume and profile information
3. **Resume Strategist Agent**: Tailors the resume to match the job requirements
4. **Interview Preparer Agent**: Creates interview preparation materials

### AI Agent Workflow

```
┌─────────────────┐  Job      ┌─────────────────┐
│                 │  Details  │                 │
│   Researcher    │──────────►│    Profiler     │
│     Agent       │           │     Agent       │
│                 │           │                 │
└─────────────────┘           └─────────────────┘
       │                              │
       │                              │
       │                              │
       │                              ▼
       │                      ┌─────────────────┐
       │                      │                 │
       └─────────────────────►│Resume Strategist│
                              │     Agent       │
                              │                 │
                              └─────────────────┘
                                      │
                                      │
                                      ▼
                              ┌─────────────────┐
                              │                 │
                              │   Interview     │
                              │    Preparer     │
                              │                 │
                              └─────────────────┘
```

## Database Schema

The system uses a PostgreSQL database with the following tables:

### Users Table

| Column Name      | Type          | Description                      |
|------------------|---------------|----------------------------------|
| id               | Integer (PK)  | Primary key                      |
| email            | String        | User's email (unique)            |
| password_hash    | String        | Hashed password                  |
| first_name       | String        | User's first name                |
| last_name        | String        | User's last name                 |
| created_at       | DateTime      | Account creation timestamp       |
| updated_at       | DateTime      | Last update timestamp            |
| github_url       | String        | User's GitHub URL (optional)     |
| linkedin_url     | String        | User's LinkedIn URL (optional)   |
| personal_website | String        | User's website URL (optional)    |

### Resumes Table

| Column Name      | Type          | Description                      |
|------------------|---------------|----------------------------------|
| id               | Integer (PK)  | Primary key                      |
| user_id          | Integer (FK)  | Foreign key to Users table       |
| title            | String        | Resume title                     |
| content          | Text          | Resume content (Markdown)        |
| is_default       | Boolean       | Whether this is the default resume |
| created_at       | DateTime      | Creation timestamp               |
| updated_at       | DateTime      | Last update timestamp            |

### Job Applications Table

| Column Name      | Type          | Description                      |
|------------------|---------------|----------------------------------|
| id               | Integer (PK)  | Primary key                      |
| user_id          | Integer (FK)  | Foreign key to Users table       |
| resume_id        | Integer (FK)  | Foreign key to Resumes table     |
| company_name     | String        | Company name                     |
| job_title        | String        | Job title                        |
| job_description  | Text          | Job description                  |
| job_posting_url  | String        | URL to job posting               |
| status           | String        | Application status               |
| notes            | Text          | User notes                       |
| applied_date     | DateTime      | Date applied                     |
| created_at       | DateTime      | Creation timestamp               |
| updated_at       | DateTime      | Last update timestamp            |

### Tailored Resumes Table

| Column Name      | Type          | Description                      |
|------------------|---------------|----------------------------------|
| id               | Integer (PK)  | Primary key                      |
| original_resume_id | Integer (FK) | Foreign key to Resumes table    |
| job_application_id | Integer (FK) | Foreign key to JobApplications table |
| content          | Text          | Tailored resume content (Markdown) |
| interview_materials | Text       | Interview preparation materials   |
| created_at       | DateTime      | Creation timestamp               |

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and get access token
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/me` - Update user info
- `PUT /api/auth/change-password` - Change password

### Resume Endpoints

- `GET /api/resumes` - Get all resumes for current user
- `GET /api/resumes/:id` - Get a specific resume
- `POST /api/resumes` - Create a new resume
- `PUT /api/resumes/:id` - Update a resume
- `DELETE /api/resumes/:id` - Delete a resume
- `GET /api/resumes/:id/html` - Get HTML version of resume
- `GET /api/resumes/default` - Get default resume

### Job Application Endpoints

- `GET /api/jobs` - Get all job applications
- `GET /api/jobs/:id` - Get a specific job application
- `POST /api/jobs` - Create a new job application
- `PUT /api/jobs/:id` - Update a job application
- `DELETE /api/jobs/:id` - Delete a job application
- `POST /api/jobs/:id/tailor` - Generate tailored resume
- `GET /api/jobs/:id/tailored` - Get tailored resume
- `GET /api/jobs/stats` - Get job application statistics

## Deployment Guide

### Prerequisites

- Docker and Docker Compose
- Valid OpenAI API key
- Valid Serper API key (for web search)
- Domain name (optional, for production)

### Deployment Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/agentic-resume.git
   cd agentic-resume
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file and add your API keys and configuration:
   ```
   # Flask application settings
   FLASK_APP=backend/app.py
   FLASK_ENV=production

   # Database connection
   DB_USER=postgres
   DB_PASSWORD=your_secure_password
   DB_NAME=agentic_resume
   DATABASE_URI=postgresql://postgres:your_secure_password@postgres:5432/agentic_resume

   # JWT authentication
   JWT_SECRET_KEY=your_super_secret_jwt_key
   JWT_ACCESS_TOKEN_EXPIRES=3600
   JWT_REFRESH_TOKEN_EXPIRES=604800

   # AI API keys
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL_NAME=gpt-4-turbo
   SERPER_API_KEY=your_serper_api_key

   # Frontend settings
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

5. Initialize the database (first time only):
   ```bash
   docker-compose exec backend flask db init
   docker-compose exec backend flask db migrate -m "Initial migration"
   docker-compose exec backend flask db upgrade
   ```

6. Access the application:
   - Frontend: http://localhost:3000
   - API: http://localhost:5000

### Production Deployment

For production deployment, consider:

1. Using a reverse proxy like Nginx or Traefik
2. Setting up SSL certificates
3. Implementing additional security measures
4. Using a managed database service

## Environment Variables

### Backend Environment Variables

| Variable                  | Description                         | Default Value |
|---------------------------|-------------------------------------|---------------|
| FLASK_APP                 | Path to Flask application           | backend/app.py |
| FLASK_ENV                 | Flask environment (dev/prod/test)   | development   |
| DATABASE_URI              | PostgreSQL connection URI           | postgresql://postgres:postgres@postgres:5432/agentic_resume |
| JWT_SECRET_KEY            | Secret key for JWT tokens           | dev-key-change-in-production |
| JWT_ACCESS_TOKEN_EXPIRES  | Access token expiry in seconds      | 3600 (1 hour) |
| JWT_REFRESH_TOKEN_EXPIRES | Refresh token expiry in seconds     | 604800 (7 days) |
| OPENAI_API_KEY            | OpenAI API key                      | None          |
| OPENAI_MODEL_NAME         | OpenAI model to use                 | gpt-4-turbo   |
| SERPER_API_KEY            | Serper API key for web search       | None          |

### Frontend Environment Variables

| Variable           | Description                     | Default Value |
|--------------------|---------------------------------|---------------|
| REACT_APP_API_URL  | URL of the backend API          | http://localhost:5000 |

## Development Setup

### Backend Development

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   export FLASK_APP=backend/app.py
   export FLASK_ENV=development
   export DATABASE_URI=postgresql://postgres:postgres@localhost:5432/agentic_resume
   export OPENAI_API_KEY=your_openai_api_key
   export SERPER_API_KEY=your_serper_api_key
   ```

4. Start a PostgreSQL instance:
   ```bash
   docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=agentic_resume postgres:15-alpine
   ```

5. Run database migrations:
   ```bash
   flask db upgrade
   ```

6. Run the Flask application:
   ```bash
   flask run
   ```

### Frontend Development

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Access the application at http://localhost:3000