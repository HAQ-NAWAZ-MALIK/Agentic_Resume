 """
JobApplication model for tracking job applications.
"""

from datetime import datetime
from enum import Enum

from backend.app import db

class JobStatus(Enum):
    """Enum for job application status."""
    SAVED = 'saved'
    APPLIED = 'applied'
    INTERVIEWING = 'interviewing'
    OFFERED = 'offered'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'
    DECLINED = 'declined'

class JobApplication(db.Model):
    """JobApplication model for tracking job applications."""
    
    __tablename__ = 'job_applications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=True)
    company_name = db.Column(db.String(255), nullable=False)
    job_title = db.Column(db.String(255), nullable=False)
    job_description = db.Column(db.Text, nullable=True)
    job_posting_url = db.Column(db.String(512), nullable=True)
    status = db.Column(db.String(50), default=JobStatus.SAVED.value)
    notes = db.Column(db.Text, nullable=True)
    applied_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tailored_resumes = db.relationship('TailoredResume', backref='job_application', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, user_id, company_name, job_title, **kwargs):
        """Initialize job application with user_id, company_name, and job_title."""
        self.user_id = user_id
        self.company_name = company_name
        self.job_title = job_title
        for key, value in kwargs.items():
            setattr(self, key, value)
    
    def update_status(self, status):
        """Update job application status and related fields."""
        if status == JobStatus.APPLIED.value and not self.applied_date:
            self.applied_date = datetime.utcnow()
        self.status = status
    
    def to_dict(self):
        """Convert job application to dictionary for API responses."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'resume_id': self.resume_id,
            'company_name': self.company_name,
            'job_title': self.job_title,
            'job_description': self.job_description,
            'job_posting_url': self.job_posting_url,
            'status': self.status,
            'notes': self.notes,
            'applied_date': self.applied_date.isoformat() if self.applied_date else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'has_tailored_resume': len(self.tailored_resumes) > 0
        }
    
    def __repr__(self):
        """String representation of the JobApplication."""
        return f"<JobApplication {self.job_title} at {self.company_name}>"