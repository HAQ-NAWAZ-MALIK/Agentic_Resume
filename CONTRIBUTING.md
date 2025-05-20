# AgenticResume Contribution Guide

Thank you for considering contributing to AgenticResume! This document provides guidelines for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How to Contribute](#how-to-contribute)
4. [Development Process](#development-process)
5. [Pull Request Process](#pull-request-process)
6. [Coding Standards](#coding-standards)
7. [Testing](#testing)

## Code of Conduct

By participating in this project, you agree to abide by the Code of Conduct:

- Be respectful of others
- Be constructive in feedback
- Focus on collaboration
- Value diversity of perspectives

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/agentic-resume.git`
3. Set up the development environment (see [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md))
4. Create a branch for your work: `git checkout -b feature/your-feature-name`

## How to Contribute

You can contribute to AgenticResume in several ways:

- Implement new features
- Fix bugs
- Improve documentation
- Enhance UI/UX
- Write tests
- Report issues or suggest improvements

When contributing code, please take a look at existing issues or create new ones before starting work.

## Development Process

1. Pick an issue to work on or create a new one
2. Discuss the implementation approach if necessary
3. Fork and clone the repository
4. Set up your development environment
5. Create a feature branch
6. Write code and tests
7. Submit a pull request

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update any relevant documentation
3. Include appropriate tests for your changes
4. Make sure all tests pass
5. Submit a pull request with a clear description of the changes
6. Address any feedback from code reviewers

## Coding Standards

### Backend (Python)

- Follow PEP 8 style guide
- Use docstrings for functions, classes, and modules
- Maintain test coverage for new code
- Use consistent error handling patterns
- Format code with Black

Example:

```python
def some_function(param1, param2):
    """
    Function description here.
    
    Args:
        param1: Description of param1
        param2: Description of param2
        
    Returns:
        Description of return value
    """
    # Implementation
    return result
```

### Frontend (JavaScript/React)

- Use modern ES6+ syntax
- Follow functional component patterns with hooks
- Use descriptive variable and function names
- Keep components focused and reusable
- Follow the existing project structure

Example:

```jsx
import React, { useState, useEffect } from 'react';

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    // Side effect logic
  }, [dependencies]);
  
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};

export default MyComponent;
```

## Testing

### Backend Tests

- Write unit tests for models, services, and API endpoints
- Use pytest for testing
- Maintain high test coverage for core functionality

To run backend tests:

```bash
cd backend
pytest
```

### Frontend Tests

- Write unit tests for components and utilities
- Use React Testing Library for component tests
- Test critical user flows

To run frontend tests:

```bash
cd frontend
npm test
```

## Documentation

When adding new features or making significant changes, please update the documentation accordingly. This includes:

- Code comments and docstrings
- README updates if applicable
- Technical documentation for complex features
- User guides if necessary

Thank you for contributing to AgenticResume!