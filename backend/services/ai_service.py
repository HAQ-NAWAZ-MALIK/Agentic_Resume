 """
AI service for resume tailoring.
"""

import os
import tempfile
from flask import current_app

from backend.utils.errors import AIServiceError

def generate_tailored_resume(resume_content, job_posting_url, job_description=None, github_url=None, personal_writeup=None):
    """
    Generate a tailored resume and interview materials using the CrewAI multi-agent system.
    
    Args:
        resume_content (str): The original resume content in Markdown format
        job_posting_url (str): URL to the job posting
        job_description (str, optional): Job description if URL is not available
        github_url (str, optional): URL to the candidate's GitHub profile
        personal_writeup (str, optional): Additional context about the candidate
        
    Returns:
        tuple: (tailored_resume_content, interview_materials)
    """
    try:
        # Import the AI components
        from ai.crew import create_job_application_crew
        
        # Create temporary files for the original resume
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as resume_file:
            resume_file.write(resume_content)
            resume_path = resume_file.name
        
        # Prepare inputs for the AI crew
        inputs = {
            'job_posting_url': job_posting_url,
            'github_url': github_url or '',
            'personal_writeup': personal_writeup or ''
        }
        
        # If job description is provided but no URL, create a temporary file
        if not job_posting_url and job_description:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as job_desc_file:
                job_desc_file.write(job_description)
                inputs['job_posting_url'] = f"file://{job_desc_file.name}"
        
        # Create and run the crew
        crew = create_job_application_crew(resume_path)
        result = crew.kickoff(inputs=inputs)
        
        # Read the output files
        tailored_resume_path = os.path.join(os.path.dirname(resume_path), 'tailored_resume.md')
        interview_materials_path = os.path.join(os.path.dirname(resume_path), 'interview_materials.md')
        
        with open(tailored_resume_path, 'r') as f:
            tailored_resume_content = f.read()
        
        with open(interview_materials_path, 'r') as f:
            interview_materials_content = f.read()
        
        # Clean up temporary files
        os.unlink(resume_path)
        if not job_posting_url and job_description:
            os.unlink(inputs['job_posting_url'].replace('file://', ''))
        os.unlink(tailored_resume_path)
        os.unlink(interview_materials_path)
        
        return tailored_resume_content, interview_materials_content
        
    except Exception as e:
        raise AIServiceError(f"Error generating tailored resume: {str(e)}")