"""
Custom error classes for the application.
"""

class ApplicationError(Exception):
    """Base class for application errors."""
    
    def __init__(self, message, code=None, payload=None):
        self.message = message
        self.code = code
        self.payload = payload
        super().__init__(self.message)
    
    def to_dict(self):
        """Convert error to dictionary for API responses."""
        result = {'message': self.message}
        if self.code:
            result['code'] = self.code
        if self.payload:
            result.update(self.payload)
        return result

class ValidationError(ApplicationError):
    """Error raised when validation fails."""
    
    def __init__(self, message, payload=None):
        super().__init__(message, 'validation_error', payload)

class AuthError(ApplicationError):
    """Error raised when authentication fails."""
    
    def __init__(self, message, payload=None):
        super().__init__(message, 'auth_error', payload)

class NotFoundError(ApplicationError):
    """Error raised when a resource is not found."""
    
    def __init__(self, message, payload=None):
        super().__init__(message, 'not_found', payload)

class AIServiceError(ApplicationError):
    """Error raised when the AI service fails."""
    
    def __init__(self, message, payload=None):
        super().__init__(message, 'ai_service_error', payload)