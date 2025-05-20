 """
Authentication service functions.
"""

from flask_jwt_extended import create_access_token, create_refresh_token
from backend.models.user import User

def authenticate_user(email, password):
    """Authenticate user with email and password."""
    user = User.query.filter_by(email=email.lower()).first()
    
    if not user or not user.check_password(password):
        return None
    
    return user

def generate_tokens(user_id):
    """Generate access and refresh tokens for a user."""
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)
    
    return access_token, refresh_token