 """
Routes for job application management.
"""

from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import bleach

from backend.app import db
from backend.models.user import User
from backend.models.resume import Resume, TailoredResume
from backend.models.job_application import JobApplication, JobStatus
from backend.services.ai_service import generate_tailored_resume
from backend.utils.errors import ValidationError, NotFoundError

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route('/', methods=['GET'])
@jwt_required()
def get_job_applications():
    """Get all job applications for the current user."""
    current_user_id = get_jwt_identity()
    
    # Get filter parameters
    status = request.args.get('status')
    company = request.args.get('company')
    sort_by = request.args.get('sort_by', 'updated_at')
    sort_dir = request.args.get('sort_dir', 'desc')
    
    # Base query
    query = JobApplication.query.filter_by(user_id=current_user_id)
    
    # Apply filters
    if status:
        query = query.filter_by(status=status)
    if company:
        query = query.filter(JobApplication.company_name.ilike(f'%{company}%'))
    
    # Apply sorting
    if sort_dir == 'desc':
        query = query.order_by(getattr(JobApplication, sort_by).desc())
    else:
        query = query.order_by(getattr(JobApplication, sort_by))
    
    # Execute query
    job_applications = query.all()
    
    return jsonify({
        'job_applications': [job.to_dict() for job in job_applications]
    }), 200

@jobs_bp.route('/<int:job_id>', methods=['GET'])
@jwt_required()
def get_job_application(job_id):
    """Get a specific job application."""
    current_user_id = get_jwt_identity()
    job = JobApplication.query.filter_by(id=job_id, user_id=current_user_id).first()
    
    if not job:
        raise NotFoundError(f"Job application with ID {job_id} not found")
    
    # Get tailored resume if available
    tailored_resume = TailoredResume.query.filter_by(job_application_id=job_id).first()
    
    response = {
        'job_application': job.to_dict(),
    }
    
    if tailored_resume:
        response['tailored_resume'] = tailored_resume.to_dict()
    
    return jsonify(response), 200

@jobs_bp.route('/', methods=['POST'])
@jwt_required()
def create_job_application():
    """Create a new job application."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['company_name', 'job_title']
    for field in required_fields:
        if field not in data:
            raise ValidationError(f"{field} is required")
    
    # Sanitize description if provided
    if 'job_description' in data and data['job_description']:
        data['job_description'] = bleach.clean(
            data['job_description'],
            tags=['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr'],
            attributes={'a': ['href', 'title', 'target']},
            strip=True
        )
    
    # Get resume if resume_id provided
    resume_id = data.get('resume_id')
    if resume_id:
        resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
        if not resume:
            raise NotFoundError(f"Resume with ID {resume_id} not found")
    
    # Set applied date if status is 'applied'
    applied_date = None
    if data.get('status') == JobStatus.APPLIED.value:
        applied_date = datetime.utcnow()
    
    # Create job application
    job = JobApplication(
        user_id=current_user_id,
        company_name=data['company_name'],
        job_title=data['job_title'],
        job_description=data.get('job_description'),
        job_posting_url=data.get('job_posting_url'),
        status=data.get('status', JobStatus.SAVED.value),
        notes=data.get('notes'),
        resume_id=resume_id,
        applied_date=applied_date
    )
    
    db.session.add(job)
    db.session.commit()
    
    return jsonify({
        'message': 'Job application created successfully',
        'job_application': job.to_dict()
    }), 201

@jobs_bp.route('/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job_application(job_id):
    """Update a specific job application."""
    current_user_id = get_jwt_identity()
    job = JobApplication.query.filter_by(id=job_id, user_id=current_user_id).first()
    
    if not job:
        raise NotFoundError(f"Job application with ID {job_id} not found")
    
    data = request.get_json()
    
    # Update fields
    if 'company_name' in data:
        job.company_name = data['company_name']
    
    if 'job_title' in data:
        job.job_title = data['job_title']
    
    if 'job_description' in data:
        # Sanitize description
        job.job_description = bleach.clean(
            data['job_description'],
            tags=['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr'],
            attributes={'a': ['href', 'title', 'target']},
            strip=True
        ) if data['job_description'] else None
    
    if 'job_posting_url' in data:
        job.job_posting_url = data['job_posting_url']
    
    if 'notes' in data:
        job.notes = data['notes']
    
    if 'resume_id' in data:
        # Validate resume exists and belongs to user
        if data['resume_id']:
            resume = Resume.query.filter_by(id=data['resume_id'], user_id=current_user_id).first()
            if not resume:
                raise NotFoundError(f"Resume with ID {data['resume_id']} not found")
        job.resume_id = data['resume_id']
    
    if 'status' in data:
        # Update status and set applied_date if newly applied
        if data['status'] == JobStatus.APPLIED.value and job.status != JobStatus.APPLIED.value:
            job.applied_date = datetime.utcnow()
        job.status = data['status']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Job application updated successfully',
        'job_application': job.to_dict()
    }), 200

@jobs_bp.route('/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job_application(job_id):
    """Delete a specific job application."""
    current_user_id = get_jwt_identity()
    job = JobApplication.query.filter_by(id=job_id, user_id=current_user_id).first()
    
    if not job:
        raise NotFoundError(f"Job application with ID {job_id} not found")
    
    db.session.delete(job)
    db.session.commit()
    
    return jsonify({
        'message': 'Job application deleted successfully'
    }), 200

@jobs_bp.route('/<int:job_id>/tailor', methods=['POST'])
@jwt_required()
def tailor_resume(job_id):
    """Generate a tailored resume for a job application."""
    current_user_id = get_jwt_identity()
    job = JobApplication.query.filter_by(id=job_id, user_id=current_user_id).first()
    
    if not job:
        raise NotFoundError(f"Job application with ID {job_id} not found")
    
    data = request.get_json()
    
    # Get resume to tailor
    resume_id = data.get('resume_id') or job.resume_id
    if not resume_id:
        raise ValidationError("Resume ID is required")
    
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
    if not resume:
        raise NotFoundError(f"Resume with ID {resume_id} not found")
    
    # Get user profile for AI processing
    user = User.query.get(current_user_id)
    
    # Get additional context if provided
    personal_writeup = data.get('personal_writeup', '')
    github_url = data.get('github_url') or user.github_url
    
    # Call AI service to generate tailored resume
    tailored_content, interview_materials = generate_tailored_resume(
        resume_content=resume.content,
        job_posting_url=job.job_posting_url,
        job_description=job.job_description,
        github_url=github_url,
        personal_writeup=personal_writeup
    )
    
    # Save tailored resume
    existing_tailored = TailoredResume.query.filter_by(job_application_id=job_id).first()
    
    if existing_tailored:
        # Update existing tailored resume
        existing_tailored.content = tailored_content
        existing_tailored.interview_materials = interview_materials
        tailored_resume = existing_tailored
    else:
        # Create new tailored resume
        tailored_resume = TailoredResume(
            original_resume_id=resume_id,
            job_application_id=job_id,
            content=tailored_content,
            interview_materials=interview_materials
        )
        db.session.add(tailored_resume)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Resume tailored successfully',
        'tailored_resume': tailored_resume.to_dict()
    }), 200

@jobs_bp.route('/<int:job_id>/tailored', methods=['GET'])
@jwt_required()
def get_tailored_resume(job_id):
    """Get the tailored resume for a job application."""
    current_user_id = get_jwt_identity()
    job = JobApplication.query.filter_by(id=job_id, user_id=current_user_id).first()
    
    if not job:
        raise NotFoundError(f"Job application with ID {job_id} not found")
    
    tailored_resume = TailoredResume.query.filter_by(job_application_id=job_id).first()
    
    if not tailored_resume:
        raise NotFoundError(f"No tailored resume found for job application with ID {job_id}")
    
    return jsonify({
        'tailored_resume': tailored_resume.to_dict()
    }), 200

@jobs_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_job_stats():
    """Get job application statistics for the current user."""
    current_user_id = get_jwt_identity()
    
    # Count jobs by status
    status_counts = {}
    for status in JobStatus:
        count = JobApplication.query.filter_by(
            user_id=current_user_id, status=status.value
        ).count()
        status_counts[status.value] = count
    
    # Total applications
    total_count = JobApplication.query.filter_by(user_id=current_user_id).count()
    
    # Recent applications (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_count = JobApplication.query.filter(
        JobApplication.user_id == current_user_id,
        JobApplication.created_at >= thirty_days_ago
    ).count()
    
    return jsonify({
        'status_counts': status_counts,
        'total_count': total_count,
        'recent_count': recent_count
    }), 200