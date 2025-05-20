 """
Authentication routes for user registration, login, and token refresh.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required, 
    get_jwt_identity, get_jwt
)

from backend.app import db
from backend.models.user import User
from backend.utils.errors import ValidationError, AuthError
from backend.utils.validators import validate_email, validate_password

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'password', 'first_name', 'last_name']
    for field in required_fields:
        if field not in data:
            raise ValidationError(f"{field} is required")
    
    # Validate email format
    email = data['email'].lower()
    if not validate_email(email):
        raise ValidationError("Invalid email format")
    
    # Check if email already exists
    if User.query.filter_by(email=email).first():
        raise ValidationError("Email already registered")
    
    # Validate password
    password = data['password']
    if not validate_password(password):
        raise ValidationError(
            "Password must be at least 8 characters and include uppercase, "
            "lowercase, and a number"
        )
    
    # Create new user
    user = User(
        email=email,
        password=password,
        first_name=data['first_name'],
        last_name=data['last_name'],
        github_url=data.get('github_url'),
        linkedin_url=data.get('linkedin_url'),
        personal_website=data.get('personal_website')
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Create tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user and return tokens."""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'password']
    for field in required_fields:
        if field not in data:
            raise ValidationError(f"{field} is required")
    
    # Get user by email
    user = User.query.filter_by(email=data['email'].lower()).first()
    if not user or not user.check_password(data['password']):
        raise AuthError("Invalid email or password")
    
    # Create tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        raise AuthError("User not found")
    
    # Create new access token
    access_token = create_access_token(identity=current_user_id)
    
    return jsonify({
        'message': 'Token refreshed',
        'access_token': access_token
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    """Get current user information."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        raise AuthError("User not found")
    
    return jsonify({
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_me():
    """Update current user information."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        raise AuthError("User not found")
    
    data = request.get_json()
    allowed_fields = ['first_name', 'last_name', 'github_url', 'linkedin_url', 'personal_website']
    
    for field in allowed_fields:
        if field in data:
            setattr(user, field, data[field])
    
    db.session.commit()
    
    return jsonify({
        'message': 'User updated successfully',
        'user': user.to_dict()
    }), 200

@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    """Change user password."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        raise AuthError("User not found")
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['current_password', 'new_password']
    for field in required_fields:
        if field not in data:
            raise ValidationError(f"{field} is required")
    
    # Check current password
    if not user.check_password(data['current_password']):
        raise AuthError("Current password is incorrect")
    
    # Validate new password
    if not validate_password(data['new_password']):
        raise ValidationError(
            "Password must be at least 8 characters and include uppercase, "
            "lowercase, and a number"
        )
    
    # Update password
    user.set_password(data['new_password'])
    db.session.commit()
    
    return jsonify({
        'message': 'Password changed successfully'
    }), 200