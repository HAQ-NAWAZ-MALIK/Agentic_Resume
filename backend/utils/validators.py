 """
Validation functions for the application.
"""

import re

def validate_email(email):
    """Validate email format."""
    # Basic email regex pattern
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_password(password):
    """Validate password strength."""
    # Password must be at least 8 characters and include uppercase, lowercase, and a number
    if len(password) < 8:
        return False
    
    # Check for uppercase
    if not any(c.isupper() for c in password):
        return False
    
    # Check for lowercase
    if not any(c.islower() for c in password):
        return False
    
    # Check for number
    if not any(c.isdigit() for c in password):
        return False
    
    return True

def validate_url(url):
    """Validate URL format."""
    # Basic URL regex pattern
    pattern = r'^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\/[a-zA-Z0-9_\-\.~:/?#[\]@!$&\'()*+,;=]*)?$'
    return bool(re.match(pattern, url))

def sanitize_markdown(markdown_text):
    """Remove potentially harmful content from markdown."""
    # Remove script tags
    markdown_text = re.sub(r'<script.*?>.*?</script>', '', markdown_text, flags=re.DOTALL)
    
    # Remove iframe tags
    markdown_text = re.sub(r'<iframe.*?>.*?</iframe>', '', markdown_text, flags=re.DOTALL)
    
    # Remove other potentially harmful tags
    markdown_text = re.sub(r'<(object|embed|base|link|meta|frame|form|input|button|textarea).*?>', '', markdown_text, flags=re.DOTALL)
    
    return markdown_text