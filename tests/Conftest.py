import pytest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import tempfile
import os
from backend.app import create_app, db
from backend.config import TestingConfig
from backend.models.user import User
from backend.models.resume import Resume, TailoredResume
from backend.models.job_application import JobApplication

@pytest.fixture
def app():
    """Create and configure a Flask app for testing."""
    # Create a temporary file to use as a database
    db_fd, db_path = tempfile.mkstemp()
    
    app = create_app('test')
    
    # Create the database and tables
    with app.app_context():
        db.create_all()
    
    yield app
    
    # Clean up
    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """A test CLI runner for the app."""
    return app.test_cli_runner()

@pytest.fixture
def auth_headers(app, client):
    """Create a user and get auth headers for testing protected routes."""
    with app.app_context():
        # Create a test user
        user = User(
            email='test@example.com',
            password='Password123',
            first_name='Test',
            last_name='User'
        )
        db.session.add(user)
        db.session.commit()
        
        # Log in to get a token
        response = client.post('/api/auth/login', json={
            'email': 'test@example.com',
            'password': 'Password123'
        })
        
        token = response.json['access_token']
        
        # Return headers with Authorization
        return {'Authorization': f'Bearer {token}'}

@pytest.fixture
def test_user(app):
    """Create and return a test user."""
    with app.app_context():
        user = User.query.filter_by(email='test@example.com').first()
        if not user:
            user = User(
                email='test@example.com',
                password='Password123',
                first_name='Test',
                last_name='User'
            )
            db.session.add(user)
            db.session.commit()
        return user

@pytest.fixture
def test_resume(app, test_user):
    """Create and return a test resume."""
    with app.app_context():
        resume = Resume.query.filter_by(user_id=test_user.id).first()
        if not resume:
            resume = Resume(
                user_id=test_user.id,
                title='Test Resume',
                content='# Test Resume\n\nThis is a test resume.',
                is_default=True
            )
            db.session.add(resume)
            db.session.commit()
        return resume

@pytest.fixture
def test_job(app, test_user, test_resume):
    """Create and return a test job application."""
    with app.app_context():
        job = JobApplication.query.filter_by(user_id=test_user.id).first()
        if not job:
            job = JobApplication(
                user_id=test_user.id,
                resume_id=test_resume.id,
                company_name='Test Company',
                job_title='Test Position',
                job_description='This is a test job description.',
                job_posting_url='https://example.com/job',
                status='saved'
            )
            db.session.add(job)
            db.session.commit()
        return job