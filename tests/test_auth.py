import pytest
from backend.models.user import User

def test_user_model(app):
    """Test the User model."""
    with app.app_context():
        # Create a user
        user = User(
            email='newuser@example.com',
            password='SecurePassword123',
            first_name='New',
            last_name='User',
            github_url='https://github.com/newuser',
            linkedin_url='https://linkedin.com/in/newuser'
        )
        
        # Test password hashing
        assert user.password_hash is not None
        assert user.password_hash != 'SecurePassword123'
        assert user.check_password('SecurePassword123') is True
        assert user.check_password('WrongPassword') is False
        
        # Test full name property
        assert user.full_name == 'New User'
        
        # Test to_dict method
        user_dict = user.to_dict()
        assert user_dict['email'] == 'newuser@example.com'
        assert user_dict['first_name'] == 'New'
        assert user_dict['last_name'] == 'User'
        assert user_dict['full_name'] == 'New User'
        assert user_dict['github_url'] == 'https://github.com/newuser'
        assert user_dict['linkedin_url'] == 'https://linkedin.com/in/newuser'
        assert 'password_hash' not in user_dict

def test_auth_register(client):
    """Test user registration endpoint."""
    # Register a new user
    response = client.post('/api/auth/register', json={
        'email': 'register@example.com',
        'password': 'RegPassword123',
        'first_name': 'Register',
        'last_name': 'Test'
    })
    
    assert response.status_code == 201
    assert 'access_token' in response.json
    assert 'refresh_token' in response.json
    assert response.json['user']['email'] == 'register@example.com'
    
    # Try to register the same user again (should fail)
    response = client.post('/api/auth/register', json={
        'email': 'register@example.com',
        'password': 'RegPassword123',
        'first_name': 'Register',
        'last_name': 'Test'
    })
    
    assert response.status_code == 400
    assert 'message' in response.json
    assert 'Email already registered' in response.json['message']

def test_auth_login(client, test_user):
    """Test user login endpoint."""
    # Login with correct credentials
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'Password123'
    })
    
    assert response.status_code == 200
    assert 'access_token' in response.json
    assert 'refresh_token' in response.json
    assert response.json['user']['email'] == 'test@example.com'
    
    # Login with incorrect password
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'WrongPassword'
    })
    
    assert response.status_code == 401
    assert 'message' in response.json
    assert 'Invalid email or password' in response.json['message']
    
    # Login with non-existent user
    response = client.post('/api/auth/login', json={
        'email': 'nonexistent@example.com',
        'password': 'Password123'
    })
    
    assert response.status_code == 401
    assert 'message' in response.json
    assert 'Invalid email or password' in response.json['message']

def test_auth_me(client, auth_headers):
    """Test getting current user info endpoint."""
    # Get user info with valid token
    response = client.get('/api/auth/me', headers=auth_headers)
    
    assert response.status_code == 200
    assert 'user' in response.json
    assert response.json['user']['email'] == 'test@example.com'
    
    # Get user info with invalid token
    response = client.get('/api/auth/me', headers={
        'Authorization': 'Bearer invalid_token'
    })
    
    assert response.status_code == 401

def test_auth_update_me(client, auth_headers):
    """Test updating current user info endpoint."""
    # Update user info
    response = client.put('/api/auth/me', json={
        'first_name': 'Updated',
        'last_name': 'User',
        'github_url': 'https://github.com/updateduser'
    }, headers=auth_headers)
    
    assert response.status_code == 200
    assert 'user' in response.json
    assert response.json['user']['first_name'] == 'Updated'
    assert response.json['user']['last_name'] == 'User'
    assert response.json['user']['github_url'] == 'https://github.com/updateduser'
    
    # Verify the update worked by fetching user info
    response = client.get('/api/auth/me', headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['user']['first_name'] == 'Updated'
    assert response.json['user']['last_name'] == 'User'
    assert response.json['user']['github_url'] == 'https://github.com/updateduser'

def test_auth_change_password(client, auth_headers):
    """Test changing password endpoint."""
    # Change password
    response = client.put('/api/auth/change-password', json={
        'current_password': 'Password123',
        'new_password': 'NewPassword123'
    }, headers=auth_headers)
    
    assert response.status_code == 200
    assert 'message' in response.json
    assert 'Password changed successfully' in response.json['message']
    
    # Try to login with old password (should fail)
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'Password123'
    })
    
    assert response.status_code == 401
    
    # Login with new password
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'NewPassword123'
    })
    
    assert response.status_code == 200
    assert 'access_token' in response.json