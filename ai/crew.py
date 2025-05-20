 """
Main crew configuration for the resume tailoring system.
"""

import os
from crewai import Agent, Task, Crew
from crewai_tools import FileReadTool, ScrapeWebsiteTool, MDXSearchTool, SerperDevTool

def create_job_application_crew(resume_path):
    """
    Create the job application crew with all agents and tasks.
    
    Args:
        resume_path (str): Path to the original resume file
        
    Returns:
        Crew: The configured CrewAI crew
    """
    # Set up environment variables
    os.environ["OPENAI_API_KEY"] = os.environ.get("OPENAI_API_KEY")
    os.environ["OPENAI_MODEL_NAME"] = os.environ.get("OPENAI_MODEL_NAME", "gpt-4-turbo")
    os.environ["SERPER_API_KEY"] = os.environ.get("SERPER_API_KEY")
    
    # Set up tools
    search_tool = SerperDevTool()
    scrape_tool = ScrapeWebsiteTool()
    read_resume = FileReadTool(file_path=resume_path)
    semantic_search_resume = MDXSearchTool(mdx=resume_path)
    
    # Create agents
    researcher = create_researcher_agent(scrape_tool, search_tool)
    profiler = create_profiler_agent(scrape_tool, search_tool, read_resume, semantic_search_resume)
    resume_strategist = create_resume_strategist_agent(scrape_tool, search_tool, read_resume, semantic_search_resume)
    interview_preparer = create_interview_preparer_agent(scrape_tool, search_tool, read_resume, semantic_search_resume)
    
    # Create tasks
    research_task = create_research_task(researcher)
    profile_task = create_profile_task(profiler)
    resume_strategy_task = create_resume_strategy_task(resume_strategist, research_task, profile_task)
    interview_preparation_task = create_interview_preparation_task(interview_preparer, research_task, profile_task, resume_strategy_task)
    
    # Create and return the crew
    job_application_crew = Crew(
        agents=[researcher, profiler, resume_strategist, interview_preparer],
        tasks=[research_task, profile_task, resume_strategy_task, interview_preparation_task],
        verbose=True
    )
    
    return job_application_crew

def create_researcher_agent(scrape_tool, search_tool):
    """Create the Tech Job Researcher agent."""
    return Agent(
        role="Tech Job Researcher",
        goal="Make sure to do amazing analysis on job posting to help job applicants",
        tools=[scrape_tool, search_tool],
        verbose=True,
        backstory=(
            "As a Job Researcher, your prowess in navigating and extracting critical "
            "information from job postings is unmatched. Your skills help pinpoint the necessary "
            "qualifications and skills sought by employers, forming the foundation for "
            "effective application tailoring."
        )
    )

def create_profiler_agent(scrape_tool, search_tool, read_resume, semantic_search_resume):
    """Create the Personal Profiler agent."""
    return Agent(
        role="Personal Profiler for Engineers",
        goal="Do incredible research on job applicants to help them stand out in the job market",
        tools=[scrape_tool, search_tool, read_resume, semantic_search_resume],
        verbose=True,
        backstory=(
            "Equipped with analytical prowess, you dissect and synthesize information "
            "from diverse sources to craft comprehensive personal and professional profiles, "
            "laying the groundwork for personalized resume enhancements."
        )
    )

def create_resume_strategist_agent(scrape_tool, search_tool, read_resume, semantic_search_resume):
    """Create the Resume Strategist agent."""
    return Agent(
        role="Resume Strategist for Engineers",
        goal="Find all the best ways to make a resume stand out in the job market.",
        tools=[scrape_tool, search_tool, read_resume, semantic_search_resume],
        verbose=True,
        backstory=(
            "With a strategic mind and an eye for detail, you excel at refining resumes to highlight "
            "the most relevant skills and experiences, ensuring they resonate perfectly with "
            "the job's requirements."
        )
    )

def create_interview_preparer_agent(scrape_tool, search_tool, read_resume, semantic_search_resume):
    """Create the Interview Preparer agent."""
    return Agent(
        role="Engineering Interview Preparer",
        goal="Create interview questions and talking points based on the resume and job requirements",
        tools=[scrape_tool, search_tool, read_resume, semantic_search_resume],
        verbose=True,
        backstory=(
            "Your role is crucial in anticipating the dynamics of interviews. With your ability "
            "to formulate key questions and talking points, you prepare candidates for success, "
            "ensuring they can confidently address all aspects of the job they are applying for."
        )
    )

def create_research_task(researcher):
    """Create the job research task."""
    return Task(
        description=(
            "Analyze the job posting URL provided ({job_posting_url}) "
            "to extract key skills, experiences, and qualifications "
            "required. Use the tools to gather content and identify "
            "and categorize the requirements."
        ),
        expected_output=(
            "A structured list of job requirements, including necessary "
            "skills, qualifications, and experiences."
        ),
        agent=researcher,
        async_execution=True
    )

def create_profile_task(profiler):
    """Create the profile task."""
    return Task(
        description=(
            "Compile a detailed personal and professional profile "
            "using the GitHub ({github_url}) URLs, and personal write-up "
            "({personal_writeup}). Utilize tools to extract and "
            "synthesize information from these sources."
        ),
        expected_output=(
            "A comprehensive profile document that includes skills, "
            "project experiences, contributions, interests, and "
            "communication style."
        ),
        agent=profiler,
        async_execution=True
    )

def create_resume_strategy_task(resume_strategist, research_task, profile_task):
    """Create the resume tailoring task."""
    return Task(
        description=(
            "Using the profile and job requirements obtained from "
            "previous tasks, tailor the resume to highlight the most "
            "relevant areas. Employ tools to adjust and enhance the "
            "resume content. Make sure this is the best resume even but "
            "don't make up any information. Update every section, "
            "including the initial summary, work experience, skills, "
            "and education. All to better reflect the candidates "
            "abilities and how it matches the job posting."
        ),
        expected_output=(
            "An updated resume that effectively highlights the candidate's "
            "qualifications and experiences relevant to the job."
        ),
        output_file="tailored_resume.md",
        context=[research_task, profile_task],
        agent=resume_strategist
    )

def create_interview_preparation_task(interview_preparer, research_task, profile_task, resume_strategy_task):
    """Create the interview preparation task."""
    return Task(
        description=(
            "Create a set of potential interview questions and talking "
            "points based on the tailored resume and job requirements. "
            "Utilize tools to generate relevant questions and discussion "
            "points. Make sure to use these question and talking points to "
            "help the candidate highlight the main points of the resume "
            "and how it matches the job posting."
        ),
        expected_output=(
            "A document containing key questions and talking points "
            "that the candidate should prepare for the initial interview."
        ),
        output_file="interview_materials.md",
        context=[research_task, profile_task, resume_strategy_task],
        agent=interview_preparer
    )