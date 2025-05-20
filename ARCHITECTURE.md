# AgenticResume Project File Structure and Architecture

This document provides an overview of the AgenticResume project architecture, explaining how different files and components work together.

## Repository Structure

The repository is organized into three main components:

1. **Backend**: Flask API + database models (`/backend`)
2. **AI Component**: CrewAI multi-agent system (`/ai`)
3. **Frontend**: React application with Tailwind CSS (`/frontend`)

## Configuration Files

- `docker-compose.yml`: Multi-container Docker configuration
- `Dockerfile`: Main application container setup
- `requirements.txt`: Python dependencies
- `.env.example`: Template for environment variables

## Backend Architecture

The backend follows a modular structure with clear separation of concerns:

```
backend/
├── app.py                    # Main Flask application entry point
├── config.py                 # Configuration settings
├── models/                   # Database models
│   ├── user.py               # User authentication model
│   ├── resume.py             # Resume and tailored resume models
│   └── job_application.py    # Job application tracking model
├── routes/                   # API routes
│   ├── auth.py               # Authentication endpoints
│   ├── resumes.py            # Resume management endpoints
│   └── job_applications.py   # Job application endpoints
├── services/                 # Business logic services
│   ├── auth_service.py       # Authentication service
│   └── ai_service.py         # Integration with AI component
└── utils/                    # Utility functions
    ├── errors.py             # Error handling classes
    └── validators.py         # Input validation functions
```

### Key Features

- **JWT Authentication**: Secure user authentication with access and refresh tokens
- **SQLAlchemy ORM**: Object-relational mapping for database operations
- **RESTful API Design**: Clear and consistent API endpoints
- **Error Handling**: Standardized error responses
- **Input Validation**: Request validation and sanitization

### Database Models

The application uses SQLAlchemy models to interact with the PostgreSQL database:

1. **User Model** (`models/user.py`): Handles user accounts and authentication
2. **Resume Model** (`models/resume.py`): Stores resume data in Markdown format
3. **Job Application Model** (`models/job_application.py`): Tracks job applications
4. **Tailored Resume Model** (`models/resume.py`): Stores AI-generated tailored resumes

### API Routes

Routes are organized by resource type:

1. **Auth Routes** (`routes/auth.py`): User registration, login, token refresh
2. **Resume Routes** (`routes/resumes.py`): CRUD operations for resumes
3. **Job Application Routes** (`routes/job_applications.py`): Job application management and resume tailoring

## AI Component Architecture

The AI component uses CrewAI to orchestrate multiple specialized agents:

```
ai/
├── crew.py                   # Main crew configuration
├── agents/                   # Agent definitions
│   ├── researcher.py         # Job research agent
│   ├── profiler.py           # Candidate profiling agent
│   ├── resume_strategist.py  # Resume tailoring agent
│   └── interview_preparer.py # Interview preparation agent
├── tasks/                    # Task definitions
│   ├── research_task.py      # Job research task
│   ├── profile_task.py       # Profiling task
│   ├── resume_task.py        # Resume tailoring task
│   └── interview_task.py     # Interview preparation task
└── tools/                    # Tool configurations
    ├── search_tools.py       # Web search tools
    ├── scrape_tools.py       # Web scraping tools
    └── file_tools.py         # File handling tools
```

### Agent System Flow

The AI component follows this workflow:

1. **Researcher Agent**: Analyzes job posting to extract requirements
2. **Profiler Agent**: Creates a comprehensive candidate profile
3. **Resume Strategist Agent**: Tailors the resume to match job requirements
4. **Interview Preparer Agent**: Creates interview preparation materials

### Integration with Backend

The AI component is integrated with the backend through the `services/ai_service.py` module, which:

1. Receives job and resume data from API routes
2. Creates temporary files for processing
3. Initializes and runs the AI crew
4. Returns the tailored resume and interview materials

## Frontend Architecture

The frontend is a React application with Tailwind CSS for styling:

```
frontend/
├── public/                   # Static assets
├── src/                      # React source code
│   ├── components/           # Reusable components
│   │   ├── layout/           # Layout components
│   │   ├── ui/               # UI components
│   │   └── forms/            # Form components
│   ├── context/              # React contexts
│   │   ├── AuthContext.js    # Authentication context
│   │   └── ResumeContext.js  # Resume management context
│   ├── pages/                # Page components
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── resumes/          # Resume management pages
│   │   └── jobs/             # Job application pages
│   ├── services/             # API services
│   │   ├── api.js            # API client
│   │   ├── auth.js           # Authentication service
│   │   ├── resumes.js        # Resume service
│   │   └── jobs.js           # Job application service
│   └── utils/                # Utility functions
├── package.json              # NPM configuration
└── tailwind.config.js        # Tailwind CSS configuration
```

### Key Features

- **React Router**: Page routing and navigation
- **Context API**: State management for authentication and data
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: API client for backend communication
- **Formik & Yup**: Form handling and validation
- **Markdown Rendering**: Resume display and editing

### Major Components

1. **Authentication**: Login, registration, and token management
2. **Resume Management**: Create, edit, and view resumes
3. **Job Application Tracking**: Track job applications and statuses
4. **Resume Tailoring**: Interface for AI-powered resume tailoring

### Data Flow

1. User interacts with frontend components
2. API services make requests to the backend
3. Backend processes requests and communicates with the database
4. For tailoring, backend uses the AI component
5. Results are returned to the frontend and displayed to the user

## Component Communication

### Frontend to Backend

- Uses Axios for HTTP requests to the REST API
- JWT tokens for authentication
- JSON for data exchange

### Backend to AI Component

- Direct Python module imports
- File-based data exchange for large content
- In-memory data passing for smaller operations

### Backend to Database

- SQLAlchemy ORM for database operations
- PostgreSQL for data storage

## Deployment Architecture

The application is containerized using Docker:

1. **Frontend Container**: Nginx serving the React application
2. **Backend Container**: Flask application with the AI component
3. **Database Container**: PostgreSQL database

Docker Compose orchestrates these containers, managing networking and environment variables.

## Key Workflows

### Resume Tailoring Workflow

1. User selects a job and resume to tailor
2. Frontend sends request to `/api/jobs/:id/tailor` endpoint
3. Backend verifies the request and retrieves the necessary data
4. `ai_service.py` initializes the AI crew with the job and resume data
5. The AI crew processes the data through the multi-agent system
6. Results are saved to the database and returned to the frontend
7. Frontend displays the tailored resume and interview materials

### User Authentication Workflow

1. User enters credentials on the login page
2. Frontend sends request to `/api/auth/login` endpoint
3. Backend verifies credentials and generates JWT tokens
4. Tokens are stored in local storage on the client
5. Subsequent requests include the token in the Authorization header
6. Tokens are refreshed automatically when expired

## Development Workflow

1. Local development uses separate processes for frontend and backend
2. Docker Compose for integrated testing and production deployment
3. Database migrations for schema changes
4. Testing endpoints with API client (e.g., Postman or Insomnia)

This architectural overview should help developers understand how the different components of the AgenticResume system work together.