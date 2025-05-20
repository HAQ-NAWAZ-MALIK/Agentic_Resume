 """
Routes for resume management.
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import bleach
import markdown

from backend.app import db
from backend.models.user import User
from backend.models.resume import Resume
from backend.utils.errors import ValidationError, NotFoundError

resumes_bp = Blueprint('resumes', __name__)

@resumes_bp.route('/', methods=['GET'])
@jwt_required()
def get_resumes():
    """Get all resumes for the current user."""
    current_user_id = get_jwt_identity()
    resumes = Resume.query.filter_by(user_id=current_user_id).all()
    
    return jsonify({
        'resumes': [resume.to_dict() for resume in resumes]
    }), 200

@resumes_bp.route('/<int:resume_id>', methods=['GET'])
@jwt_required()
def get_resume(resume_id):
    """Get a specific resume."""
    current_user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
    
    if not resume:
        raise NotFoundError(f"Resume with ID {resume_id} not found")
    
    return jsonify({
        'resume': resume.to_dict()
    }), 200

@resumes_bp.route('/', methods=['POST'])
@jwt_required()
def create_resume():
    """Create a new resume."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['title', 'content']
    for field in required_fields:
        if field not in data:
            raise ValidationError(f"{field} is required")
    
    # Sanitize content
    content = bleach.clean(
        data['content'],
        tags=['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr'],
        attributes={'a': ['href', 'title', 'target']},
        strip=True
    )
    
    # Check if this is the first resume (make it default)
    is_default = Resume.query.filter_by(user_id=current_user_id).count() == 0
    
    # Create resume
    resume = Resume(
        user_id=current_user_id,
        title=data['title'],
        content=content,
        is_default=data.get('is_default', is_default)
    )
    
    db.session.add(resume)
    db.session.commit()
    
    return jsonify({
        'message': 'Resume created successfully',
        'resume': resume.to_dict()
    }), 201

@resumes_bp.route('/<int:resume_id>', methods=['PUT'])
@jwt_required()
def update_resume(resume_id):
    """Update a specific resume."""
    current_user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
    
    if not resume:
        raise NotFoundError(f"Resume with ID {resume_id} not found")
    
    data = request.get_json()
    
    # Update fields
    if 'title' in data:
        resume.title = data['title']
    
    if 'content' in data:
        # Sanitize content
        content = bleach.clean(
            data['content'],
            tags=['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr'],
            attributes={'a': ['href', 'title', 'target']},
            strip=True
        )
        resume.content = content
    
    if 'is_default' in data and data['is_default']:
        # Update other resumes
        other_defaults = Resume.query.filter_by(user_id=current_user_id, is_default=True).all()
        for other in other_defaults:
            other.is_default = False
        resume.is_default = True
    
    db.session.commit()
    
    return jsonify({
        'message': 'Resume updated successfully',
        'resume': resume.to_dict()
    }), 200

@resumes_bp.route('/<int:resume_id>', methods=['DELETE'])
@jwt_required()
def delete_resume(resume_id):
    """Delete a specific resume."""
    current_user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
    
    if not resume:
        raise NotFoundError(f"Resume with ID {resume_id} not found")
    
    # If deleting the default resume, make another one default if available
    if resume.is_default:
        next_resume = Resume.query.filter_by(user_id=current_user_id).filter(Resume.id != resume_id).first()
        if next_resume:
            next_resume.is_default = True
    
    db.session.delete(resume)
    db.session.commit()
    
    return jsonify({
        'message': 'Resume deleted successfully'
    }), 200

@resumes_bp.route('/<int:resume_id>/html', methods=['GET'])
@jwt_required()
def get_resume_html(resume_id):
    """Get resume content converted to HTML."""
    current_user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
    
    if not resume:
        raise NotFoundError(f"Resume with ID {resume_id} not found")
    
    # Convert markdown to HTML
    html_content = markdown.markdown(resume.content)
    
    return jsonify({
        'html': html_content
    }), 200

@resumes_bp.route('/default', methods=['GET'])
@jwt_required()
def get_default_resume():
    """Get the default resume for the current user."""
    current_user_id = get_jwt_identity()
    resume = Resume.query.filter_by(user_id=current_user_id, is_default=True).first()
    
    if not resume:
        # Try to get any resume if no default is set
        resume = Resume.query.filter_by(user_id=current_user_id).first()
        
        if not resume:
            return jsonify({
                'message': 'No resumes found'
            }), 404
    
    return jsonify({
        'resume': resume.to_dict()
    }), 200