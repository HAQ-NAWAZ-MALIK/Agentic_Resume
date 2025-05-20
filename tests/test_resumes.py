import pytest
from backend.models.resume import Resume

def test_resumes_crud(client, auth_headers, test_user):
    """Test CRUD operations for resumes."""
    # Create a resume
    response = client.post('/api/resumes', json={
        'title': 'Software Engineer Resume',
        'content': '# Software Engineer Resume\n\nThis is a test resume for a software engineer.',
        'is_default': True
    }, headers=auth_headers)
    
    assert response.status_code == 201
    assert 'resume' in response.json
    assert response.json['resume']['title'] == 'Software Engineer Resume'
    assert response.json['resume']['is_default'] is True
    
    resume_id = response.json['resume']['id']
    
    # Create another resume
    response = client.post('/api/resumes', json={
        'title': 'Data Scientist Resume',
        'content': '# Data Scientist Resume\n\nThis is a test resume for a data scientist.',
        'is_default': False
    }, headers=auth_headers)
    
    assert response.status_code == 201
    assert 'resume' in response.json
    assert response.json['resume']['title'] == 'Data Scientist Resume'
    assert response.json['resume']['is_default'] is False
    
    second_resume_id = response.json['resume']['id']
    
    # Get all resumes
    response = client.get('/api/resumes', headers=auth_headers)
    
    assert response.status_code == 200
    assert 'resumes' in response.json
    assert len(response.json['resumes']) == 2
    
    # Get a specific resume
    response = client.get(f'/api/resumes/{resume_id}', headers=auth_headers)
    
    assert response.status_code == 200
    assert 'resume' in response.json
    assert response.json['resume']['id'] == resume_id
    assert response.json['resume']['title'] == 'Software Engineer Resume'
    
    # Update a resume
    response = client.put(f'/api/resumes/{resume_id}', json={
        'title': 'Updated Software Engineer Resume',
        'content': '# Updated Software Engineer Resume\n\nThis is an updated test resume.'
    }, headers=auth_headers)
    
    assert response.status_code == 200
    assert 'resume' in response.json
    assert response.json['resume']['title'] == 'Updated Software Engineer Resume'
    
    # Set the second resume as default
    response = client.put(f'/api/resumes/{second_resume_id}', json={
        'is_default': True
    }, headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['resume']['is_default'] is True
    
    # Check that the first resume is no longer default
    response = client.get(f'/api/resumes/{resume_id}', headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['resume']['is_default'] is False
    
    # Get the default resume
    response = client.get('/api/resumes/default', headers=auth_headers)
    
    assert response.status_code == 200
    assert 'resume' in response.json
    assert response.json['resume']['id'] == second_resume_id
    assert response.json['resume']['is_default'] is True
    
    # Get HTML version of a resume
    response = client.get(f'/api/resumes/{resume_id}/html', headers=auth_headers)
    
    assert response.status_code == 200
    assert 'html' in response.json
    assert '<h1>Updated Software Engineer Resume</h1>' in response.json['html']
    
    # Delete a resume
    response = client.delete(f'/api/resumes/{resume_id}', headers=auth_headers)
    
    assert response.status_code == 200
    
    # Verify the resume was deleted
    response = client.get(f'/api/resumes/{resume_id}', headers=auth_headers)
    
    assert response.status_code == 404
    
    # Check that only one resume remains
    response = client.get('/api/resumes', headers=auth_headers)
    
    assert response.status_code == 200
    assert len(response.json['resumes']) == 1

def test_resume_model(app, test_user):
    """Test the Resume model."""
    with app.app_context():
        # Create a resume
        resume = Resume(
            user_id=test_user.id,
            title='Test Resume',
            content='# Test Resume\n\nThis is a test resume.',
            is_default=True
        )
        
        # Test to_dict method
        resume_dict = resume.to_dict()
        assert resume_dict['user_id'] == test_user.id
        assert resume_dict['title'] == 'Test Resume'
        assert resume_dict['content'] == '# Test Resume\n\nThis is a test resume.'
        assert resume_dict['is_default'] is True
        
        # Test string representation
        assert str(resume) == '<Resume Test Resume>'

def test_resume_authorization(client, auth_headers, test_resume):
    """Test that users can only access their own resumes."""
    # Create a second user
    response = client.post('/api/auth/register', json={
        'email': 'second@example.com',
        'password': 'Password123',
        'first_name': 'Second',
        'last_name': 'User'
    })
    
    second_user_headers = {
        'Authorization': f'Bearer {response.json["access_token"]}'
    }
    
    # Try to access the first user's resume with the second user
    response = client.get(f'/api/resumes/{test_resume.id}', headers=second_user_headers)
    
    assert response.status_code == 404  # Should return not found instead of unauthorized
    
    # Try to update the first user's resume with the second user
    response = client.put(f'/api/resumes/{test_resume.id}', json={
        'title': 'Hacked Resume'
    }, headers=second_user_headers)
    
    assert response.status_code == 404
    
    # Try to delete the first user's resume with the second user
    response = client.delete(f'/api/resumes/{test_resume.id}', headers=second_user_headers)
    
    assert response.status_code == 404
    
    # Verify the resume wasn't changed
    response = client.get(f'/api/resumes/{test_resume.id}', headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['resume']['title'] == 'Test Resume'