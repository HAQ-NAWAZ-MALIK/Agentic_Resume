 """
User model for authentication and user management.
"""

from datetime import datetime
from flask import current_app
from werkzeug.security import generate_password_hash, check_password_hash

from backend.app import db

class User(db.Model):
    """User model for authentication and profile information."""
    
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    github_url = db.Column(db.String(255))
    linkedin_url = db.Column(db.String(255))
    personal_website = db.Column(db.String(255))
    
    # Relationships
    resumes = db.relationship('Resume', backref='user', lazy=True, cascade='all, delete-orphan')
    job_applications = db.relationship('JobApplication', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, email, password, first_name, last_name, **kwargs):
        """Initialize user with email and password."""
        self.email = email.lower()
        self.set_password(password)
        self.first_name = first_name
        self.last_name = last_name
        for key, value in kwargs.items():
            setattr(self, key, value)
    
    def set_password(self, password):
        """Set password hash from plain text password."""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if password matches stored hash."""
        return check_password_hash(self.password_hash, password)
    
    @property
    def full_name(self):
        """Return user's full name."""
        return f"{self.first_name} {self.last_name}"
    
    def to_dict(self):
        """Convert user to dictionary for API responses."""
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'github_url': self.github_url,
            'linkedin_url': self.linkedin_url,
            'personal_website': self.personal_website,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        """String representation of the User."""
        return f"<User {self.email}>"