# SwasthSetu - Rural Healthcare Bridge Platform 🏥

<div align="center">

![SwasthSetu Logo](https://img.shields.io/badge/SwasthSetu-Healthcare-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A comprehensive medication reminder and healthcare management platform designed for rural communities, elderly patients, caregivers, and healthcare providers.**

[Features](#-features) • [Tech Stack](#-technology-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

SwasthSetu bridges the healthcare gap in rural India by providing an accessible, multilingual platform that helps elderly patients manage medications, connects them with caregivers, and provides AI-powered health assistance.

### Why SwasthSetu?

- **Reduces missed doses** - Automated reminders ensure timely medication intake
- **Empowers families** - Caregivers can monitor loved ones remotely
- **Breaks language barriers** - Full support for English and Hindi
- **Improves healthcare access** - Telemedicine and AI chat reduce travel needs
- **Saves lives** - Emergency SOS system and quick access to health services

## ✨ Features

### For Patients
- 💊 **Medication Management** - Track medications with automated reminders
- 🤖 **AI Health Assistant** - Get instant health advice in English or Hindi
- 📅 **Appointment Booking** - Schedule telemedicine or in-person visits
- 🆘 **Emergency SOS** - One-tap emergency alerts to contacts
- 📱 **Voice Reminders** - Automated phone call reminders via Twilio
- 📋 **Health Records** - Secure digital health record storage

### For Caregivers
- 👥 **Patient Monitoring** - Track multiple patients' medication adherence
- 📊 **Activity Dashboard** - View real-time medication logs and alerts
- 🔔 **Instant Alerts** - Get notified when patients miss medications
- 📈 **Adherence Reports** - Monitor long-term medication compliance

### AI-Powered Features
- 🧠 **Medical Jargon Simplification** - Understand complex medical terms
- ⚠️ **Drug Interaction Checker** - Identify potential medication conflicts
- 📄 **Prescription Analysis** - Extract structured data from prescriptions
- 💬 **Conversational AI** - Natural language health queries in English/Hindi

### Technical Features
- 🔒 **Secure Authentication** - JWT-based auth with role-based access
- 🌐 **Real-time Updates** - Socket.IO for instant notifications
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🌍 **Multi-language** - English and Hindi support
- ⚡ **Fast & Reliable** - Optimized performance with error handling

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | UI framework with type safety |
| Redux Toolkit | State management |
| Tailwind CSS | Utility-first styling |
| Material-UI | Component library |
| Socket.IO Client | Real-time communication |
| Axios | HTTP client |
| React Router | Navigation |
| React Toastify | Notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | Server framework |
| TypeScript | Type-safe backend code |
| Firebase Firestore | NoSQL database |
| Firebase Admin | Authentication & database |
| JWT | Token-based authentication |
| OpenAI GPT-4 | AI chatbot |
| Twilio | Voice reminders & SMS |
| Socket.IO | Real-time events |
| Node-Cron | Scheduled tasks |

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Build Tool**: Vite (Frontend), TypeScript Compiler (Backend)
- **Code Quality**: ESLint, Prettier
- **Deployment**: Vercel (Frontend), Heroku/Render (Backend)

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/swasthsetu.git
   cd swasthsetu
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   **Backend** (`backend/.env`):
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your credentials
   ```

   **Frontend** (`frontend/.env`):
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your API URL
   ```

4. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start:
   - Backend API on `http://localhost:5000`
   - Frontend app on `http://localhost:5173`

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📚 Documentation

- **[Complete Setup Guide](./SETUP_GUIDE.md)** - Detailed installation and configuration
- **[API Documentation](./docs/API.md)** - All API endpoints and usage
- **[User Guide](./docs/USER_GUIDE.md)** - How to use the platform
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions

## 🏗️ Project Structure

```
swasthsetu/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Entry point
│   ├── .env.example        # Environment template
│   └── package.json
│
├── frontend/               # React TypeScript app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── hooks/         # Custom hooks
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── .env.example       # Environment template
│   └── package.json
│
├── docs/                  # Documentation
├── SETUP_GUIDE.md        # Setup instructions
├── README.md             # This file
└── package.json          # Root package.json
```

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Medications
- `GET /api/medications` - Get all medications
- `POST /api/medications` - Create medication
- `POST /api/medications/:id/log` - Log medication taken

### AI Features
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/drug-interactions` - Check drug interactions
- `POST /api/ai/analyze-prescription` - Analyze prescription

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Book appointment

### Emergency
- `POST /api/emergency/alert` - Send SOS alert

[View complete API documentation →](./docs/API.md)

## 🎯 User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| **Patient** | Elderly patients managing medications | Basic features |
| **Caregiver** | Family members monitoring patients | Patient monitoring |
| **Doctor** | Healthcare providers | Medical records access |
| **Health Worker** | Community health workers | Patient management |
| **Admin** | System administrators | Full access |

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
- Check if port 5000 is available
- Verify Firebase credentials in `.env`
- Ensure all dependencies are installed

**Frontend can't connect to API**
- Verify `VITE_API_URL` in frontend `.env`
- Check if backend is running
- Check browser console for CORS errors

**AI chatbot not working**
- Verify OpenAI API key is valid
- Check if you have API credits
- Review backend logs for errors

[View complete troubleshooting guide →](./SETUP_GUIDE.md#-troubleshooting)

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Heroku/Render)
```bash
cd backend
npm run build
# Deploy to Heroku or Render
```

[View detailed deployment guide →](./docs/DEPLOYMENT.md)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built with ❤️ by the SwasthSetu Team for rural healthcare in India.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Twilio for voice communication
- Firebase for backend infrastructure
- All contributors and supporters

## 📞 Support

- 📧 Email: support@swasthsetu.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/swasthsetu/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/swasthsetu/discussions)

---

<div align="center">

**Made with ❤️ for a healthier India**

[⬆ Back to Top](#swasthsetu---rural-healthcare-bridge-platform-)

</div>
