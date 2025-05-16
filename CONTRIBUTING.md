# Contributing to Sanjeevani 2.0

Thank you for considering contributing to Sanjeevani 2.0! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:

1. A clear, descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment information (browser, OS, etc.)

### Suggesting Features

If you have an idea for a new feature, please create an issue with the following information:

1. A clear, descriptive title
2. A detailed description of the feature
3. Why this feature would be useful
4. Any implementation ideas you have

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js (v16+)
- npm (v6+)
- Python (v3.9+)
- MongoDB (optional, can run in mock data mode)

### Frontend Setup

```bash
# Navigate to frontend directory
cd sanjeevani-frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Backend Setup

```bash
# Navigate to backend directory
cd sanjeevani-backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows
source venv/bin/activate  # On Unix/macOS

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Using Docker

```bash
# Start the full stack using Docker Compose
docker-compose up -d
```

## Testing

### Frontend Tests

```bash
cd sanjeevani-frontend
npm test
```

### Backend Tests

```bash
cd sanjeevani-backend
pytest
```

## Code Style

### Frontend

- Follow the ESLint configuration
- Use functional components with hooks
- Use TypeScript for new components

### Backend

- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions and classes

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
