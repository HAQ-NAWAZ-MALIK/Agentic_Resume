 """
Resume model for storing user resume data.
"""

from datetime import datetime
import os
import uuid

from backend.app import db

def generate_resume_filename(instance, filename):
    """Generate unique filename for resume files."""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('resumes', filename)

class Resume(db.Model):
    """Resume model for storing resume data."""
    
    __tablename__ = 'resumes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)  # Markdown content
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    job_applications = db.relationship('JobApplication', backref='resume', lazy=True)
    tailored_versions = db.relationship('TailoredResume', backref='original_resume', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, user_id, title, content, is_default=False):
        """Initialize resume with user_id, title, and content."""
        self.user_id = user_id
        self.title = title
        self.content = content
        self.is_default = is_default
        
        # If this is the default resume, update any other defaults
        if is_default:
            existing_defaults = Resume.query.filter_by(user_id=user_id, is_default=True).all()
            for resume in existing_defaults:
                resume.is_default = False
    
    def to_dict(self):
        """Convert resume to dictionary for API responses."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'content': self.content,
            'is_default': self.is_default,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        """String representation of the Resume."""
        return f"<Resume {self.title}>"

class TailoredResume(db.Model):
    """TailoredResume model for storing AI-tailored versions of resumes."""
    
    __tablename__ = 'tailored_resumes'
    
    id = db.Column(db.Integer, primary_key=True)
    original_resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=False)
    job_application_id = db.Column(db.Integer, db.ForeignKey('job_applications.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)  # Markdown content
    interview_materials = db.Column(db.Text)  # Markdown content for interview preparation
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert tailored resume to dictionary for API responses."""
        return {
            'id': self.id,
            'original_resume_id': self.original_resume_id,
            'job_application_id': self.job_application_id,
            'content': self.content,
            'interview_materials': self.interview_materials,
            'created_at': self.created_at.isoformat()
        }
    
    def __repr__(self):
        """String representation of the TailoredResume."""
        return f"<TailoredResume for {self.job_application_id}>"