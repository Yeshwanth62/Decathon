# Sanjeevani 2.0 - Healthcare Platform

[![Frontend CI/CD](https://github.com/yourusername/sanjeevani/actions/workflows/frontend-deploy.yml/badge.svg)](https://github.com/yourusername/sanjeevani/actions/workflows/frontend-deploy.yml)
[![Backend CI/CD](https://github.com/yourusername/sanjeevani/actions/workflows/backend-deploy.yml/badge.svg)](https://github.com/yourusername/sanjeevani/actions/workflows/backend-deploy.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-netlify-site-id/deploy-status)](https://app.netlify.com/sites/your-netlify-site-name/deploys)

Sanjeevani 2.0 is a comprehensive healthcare platform with multilingual support, voice commands, emergency features, and a futuristic UI/UX with seamless user experience across patient and hospital interfaces.

## Features

- **Multilingual Support**: Available in English, Hindi, Kannada, Telugu, Tamil, and Malayalam
- **Voice Commands**: Navigate and interact with the app using voice commands
- **Emergency Services**: One-tap emergency button with location tracking
- **3D Health Visualizations**: Interactive 3D models of heart, lungs, and brain
- **Appointment Booking**: Book appointments with doctors and hospitals
- **Real-time Notifications**: Get real-time updates on appointments and health metrics
- **Health Monitoring**: Track vital signs and health metrics
- **Secure Authentication**: JWT-based authentication with Firebase

## Tech Stack

### Frontend
- React.js with Chakra UI
- Three.js for 3D visualizations
- i18next for multilingual support
- Socket.io for real-time features
- Firebase for authentication and storage
- Sentry for error tracking
- Google Analytics for user behavior tracking

### Backend
- FastAPI (Python)
- MongoDB for database
- Socket.io for real-time communication
- Firebase Admin SDK for authentication
- Twilio for SMS notifications
- Sentry for error tracking

### DevOps
- GitHub Actions for CI/CD
- Docker for containerization
- Netlify for frontend hosting
- Render for backend hosting
- MongoDB Atlas for database hosting

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.9 or higher
- MongoDB
- Docker and Docker Compose (optional)

### Installation

#### Using Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/sanjeevani-2.0.git
cd sanjeevani-2.0

# Start the application using Docker Compose
docker-compose up
```

#### Manual Installation

1. **Frontend**
```bash
# Navigate to frontend directory
cd sanjeevani-frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Start development server
npm start
```

2. **Backend**
```bash
# Navigate to backend directory
cd sanjeevani-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example)
cp .env.example .env

# Start development server
uvicorn app.main:app --reload
```

## Deployment

The application is configured for automated deployment using GitHub Actions:

- **Frontend**: Automatically deployed to Netlify when changes are pushed to the main branch
- **Backend**: Automatically deployed to Render when changes are pushed to the main branch

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Documentation

- [API Documentation](https://api.sanjeevani-health.com/docs)
- [Deployment Guide](DEPLOYMENT.md)
- [Monitoring Guide](MONITORING.md)
- [Security Guide](SECURITY.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Chakra UI](https://chakra-ui.com/)
- [Three.js](https://threejs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [MongoDB](https://www.mongodb.com/)
- [Firebase](https://firebase.google.com/)
- [Netlify](https://www.netlify.com/)
- [Render](https://render.com/)
