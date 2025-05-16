# Sanjeevani 2.0 - Healthcare Platform

**Current Status: Full Stack Application**

This project includes both a frontend React application and a backend FastAPI server. The frontend can run in demo mode with mock data or connect to the real backend API.

Sanjeevani 2.0 is a comprehensive healthcare platform built with modern, free, open-source technologies. It provides a seamless experience for patients, doctors, and hospitals with features like appointment booking, emergency services, health monitoring, and multilingual support.

![Sanjeevani 2.0 Logo](sanjeevani-frontend/public/assets/logo.png)

## 🌟 Features

- **Multilingual Support**: Available in English, Hindi, Kannada, Telugu, Tamil, and Malayalam
- **Interactive 3D Health Visualizations**: View 3D models of heart, lungs, and brain with real-time animations
- **Real-time Notifications**: Get instant updates for appointments, medication reminders, and messages
- **Voice Commands**: Navigate and interact with the app using natural language voice commands
- **Appointment Booking**: Intuitive multi-step process for booking appointments with doctors
- **Emergency Services**: One-tap emergency button with location tracking and ambulance dispatch
- **Health Monitoring**: Track and visualize health metrics like blood pressure, heart rate, and more
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

## 🛠️ Technology Stack

### Frontend
- **React.js**: Core framework for building the UI
- **Chakra UI**: Component library for responsive design
- **Chart.js**: Interactive health data visualization
- **Three.js**: 3D health model visualization
- **i18next**: Multilingual support
- **Socket.io-client**: Real-time notifications
- **Web Speech API**: Voice command functionality
- **Framer Motion**: Smooth animations and transitions

### Backend
- **FastAPI**: High-performance Python framework
- **MongoDB**: NoSQL database for flexible data storage
- **Socket.io**: Real-time server-side communication
- **Firebase Admin SDK**: Authentication and security
- **Twilio API**: SMS notifications and alerts
- **Google Maps API**: Location services and geocoding

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm (v6+)
- Python (v3.9+)
- MongoDB (optional, can run in mock data mode)

### Installation

#### Option 1: Using Docker (Recommended)
```bash
# Start the full stack using Docker Compose
docker-compose up -d

# Access the frontend at http://localhost:3000
# Access the backend at http://localhost:8000
# Access the API documentation at http://localhost:8000/docs
# Access MongoDB Express at http://localhost:8081
```

#### Option 2: Using the Startup Scripts
```bash
# Start the full stack (frontend and backend)
powershell -ExecutionPolicy Bypass -File start-sanjeevani.ps1

# Or start the backend only
powershell -ExecutionPolicy Bypass -File start-backend.ps1

# Or start the frontend only
powershell -ExecutionPolicy Bypass -File start-frontend.ps1
```

#### Option 3: Manual Setup

1. **Backend Setup**
```bash
# Navigate to backend directory
cd sanjeevani-backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. **Frontend Setup**
```bash
# Navigate to frontend directory
cd sanjeevani-frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Deployment Options

We've provided scripts to help you deploy the application:

1. **Docker Deployment (Recommended)**
```bash
# Deploy the full stack
docker-compose up -d
```

2. **Netlify Deployment (Frontend Only)**
```bash
# Run the deployment script
powershell -ExecutionPolicy Bypass -File deploy-to-netlify.ps1

# Then drag and drop the generated zip file to Netlify Drop
# https://app.netlify.com/drop
```

For more detailed deployment instructions, see [QUICK-DEPLOY.md](QUICK-DEPLOY.md) or the comprehensive [DEPLOYMENT.md](DEPLOYMENT.md).

## 📦 Deployment

### Current Deployment Status

The application is currently configured for frontend-only deployment with a demo mode that simulates backend functionality. This allows you to showcase the UI and features without setting up a backend server.

### Automated Deployment Scripts

We've provided two deployment scripts:

1. **deploy-to-netlify.ps1**: Creates a deployment package and provides instructions for deploying to Netlify using drag-and-drop.

2. **deploy-to-docker.ps1**: Builds and runs a Docker container with the application, configured with NGINX for optimal performance.

### Manual Deployment

You can also manually deploy the application:

```bash
# Navigate to frontend directory
cd sanjeevani-frontend

# Build the project
npm run build

# The build folder can be deployed to any static hosting service
```

For detailed deployment instructions, see [QUICK-DEPLOY.md](QUICK-DEPLOY.md) or the comprehensive [DEPLOYMENT.md](DEPLOYMENT.md).

## 🧪 Testing

### Frontend Tests
```bash
cd sanjeevani-frontend
npm test
```

The frontend includes tests for components and utilities. In the current demo mode, you can run these tests to verify that the UI components are working correctly.

## 📝 Environment Variables

### Frontend Environment Variables
The application uses the following environment variables:

- `REACT_APP_API_URL`: Backend API URL (not required in demo mode)
- `REACT_APP_ENABLE_VOICE_COMMANDS`: Enable/disable voice commands
- `REACT_APP_ENABLE_3D_MODELS`: Enable/disable 3D models
- `REACT_APP_ENABLE_EMERGENCY`: Enable/disable emergency features

In demo mode, these variables are set with default values that allow the application to run without a backend server.

## 📁 Project Structure

```
sanjeevani-project/
├── sanjeevani-frontend/       # React frontend
│   ├── public/                # Static files
│   │   ├── locales/           # Translation files
│   │   ├── images/            # SVG images for health visualizations
│   │   └── assets/            # Images and other assets
│   ├── src/                   # Source code
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── utils/             # Utility functions
│   │   │   ├── api.js         # API service with mock implementation
│   │   │   ├── auth.js        # Authentication service
│   │   │   ├── mockApi.js     # Mock API for demo mode
│   │   │   └── helper.js      # Helper functions
│   │   ├── context/           # React context providers
│   │   ├── theme/             # UI theme configuration
│   │   ├── i18n/              # Internationalization setup
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   ├── .env                   # Environment variables
│   ├── .env.production        # Production environment variables
│   ├── package.json           # Dependencies and scripts
│   ├── netlify.toml           # Netlify configuration
│   └── Dockerfile             # Docker configuration
├── sanjeevani-backend/        # FastAPI backend
│   ├── app/                   # Source code
│   │   ├── api/               # API endpoints
│   │   ├── core/              # Core functionality
│   │   ├── db/                # Database connection
│   │   ├── models/            # Data models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   ├── mock_data/         # Mock data for development
│   │   └── main.py            # Entry point
│   ├── tests/                 # Test files
│   ├── .env                   # Environment variables
│   ├── requirements.txt       # Dependencies
│   └── Dockerfile             # Docker configuration
├── docker-compose.yml         # Docker Compose configuration
├── start-sanjeevani.ps1       # Full stack startup script
├── start-backend.ps1          # Backend startup script
├── start-frontend.ps1         # Frontend startup script
├── deploy-to-netlify.ps1      # Netlify deployment script
├── deploy-to-docker.ps1       # Docker deployment script
├── QUICK-DEPLOY.md            # Quick deployment guide
├── DEPLOYMENT.md              # Comprehensive deployment guide
└── README.md                  # Project documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- [Your Name](https://github.com/yourusername) - Project Lead
- [Team Member 1](https://github.com/teammember1) - Frontend Developer
- [Team Member 2](https://github.com/teammember2) - Backend Developer
- [Team Member 3](https://github.com/teammember3) - UI/UX Designer

## 🙏 Acknowledgements

- [React.js](https://reactjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Chakra UI](https://chakra-ui.com/)
- [Three.js](https://threejs.org/)
- [Socket.io](https://socket.io/)
- [MongoDB](https://www.mongodb.com/)
- [Firebase](https://firebase.google.com/)
- [Twilio](https://www.twilio.com/)
- [Google Maps](https://developers.google.com/maps)