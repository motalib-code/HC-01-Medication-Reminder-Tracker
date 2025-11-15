# SwasthSetu - Complete Setup Guide

## 🚀 Quick Start

This guide will help you set up the complete SwasthSetu platform with all features working properly.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase Account** (for Firestore database)
- **Twilio Account** (for voice reminders)
- **OpenAI API Key** (for AI chatbot)
- **Google Cloud Account** (optional, for Speech-to-Text)

## 📁 Project Structure

```
swasthsetu/
├── backend/              # Node.js Express API
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Custom middleware
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utility functions
│   ├── .env.example     # Environment variables template
│   └── package.json
├── frontend/            # React TypeScript app
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── store/       # Redux store
│   │   └── hooks/       # Custom hooks
│   ├── .env.example     # Environment variables template
│   └── package.json
└── README.md
```

## 🔧 Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Twilio Configuration (for voice reminders)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# OpenAI Configuration (for AI chatbot)
OPENAI_API_KEY=sk-your-openai-api-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 3: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Firestore Database**
4. Go to Project Settings → Service Accounts
5. Click "Generate New Private Key"
6. Copy the credentials to your `.env` file

### Step 4: Twilio Setup (Optional but Recommended)

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a phone number with voice capabilities
4. Add credentials to `.env` file

### Step 5: OpenAI Setup

1. Sign up at [OpenAI](https://platform.openai.com/)
2. Generate an API key
3. Add to `.env` file

### Step 6: Start Backend Server

```bash
npm run dev
```

The backend will start on `http://localhost:5000`

## 🎨 Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Socket.IO Configuration
VITE_SOCKET_URL=http://localhost:5000

# Environment
VITE_NODE_ENV=development
```

### Step 3: Start Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🗄️ Database Collections

The following Firestore collections will be automatically created:

- **users** - User profiles and authentication data
- **medications** - Medication information
- **medicationLogs** - Medication adherence logs
- **appointments** - Appointment bookings
- **aiConversations** - AI chat history
- **emergencyContacts** - Emergency contact information
- **healthRecords** - Health records and documents
- **notifications** - User notifications
- **caregiverLinks** - Caregiver-patient relationships
- **familyLinks** - Family member connections
- **voiceReminders** - Voice reminder logs

## 🧪 Testing the Application

### 1. Register a New User

1. Navigate to `http://localhost:5173/register`
2. Fill in the registration form
3. Select user role (Patient, Caregiver, etc.)
4. Choose preferred language (English/Hindi)

### 2. Test Core Features

#### Medications
- Add a new medication with dosage and schedule
- Set reminder times
- Mark medications as taken
- View medication history

#### AI Chatbot
- Navigate to AI Chat page
- Ask health-related questions in English or Hindi
- Test quick actions:
  - Simplify medical terms
  - Check drug interactions
  - Analyze prescriptions
  - Get health advice

#### Appointments
- Book a new appointment (telemedicine/in-person)
- View upcoming appointments
- Cancel or reschedule appointments

#### Emergency Contacts
- Add emergency contacts
- Send SOS alerts
- View emergency service numbers

#### Health Records
- Add health records (prescriptions, test results, etc.)
- View and manage records
- Categorize by type

#### Caregiver Dashboard (for caregivers)
- Link patients by email
- Monitor medication adherence
- View patient activity logs
- Receive alerts for missed medications

## 🔐 User Roles

The platform supports multiple user roles:

1. **PATIENT** - Elderly patients managing their medications
2. **CAREGIVER** - Family members monitoring patients
3. **DOCTOR** - Healthcare providers
4. **HEALTH_WORKER** - Community health workers
5. **ADMIN** - System administrators

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/logout` - Logout user

### Medications
- `GET /api/medications` - Get all medications
- `POST /api/medications` - Create medication
- `PUT /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication
- `POST /api/medications/:id/log` - Log medication taken
- `GET /api/medications/upcoming` - Get upcoming reminders

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### AI Features
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/simplify` - Simplify medical jargon
- `POST /api/ai/drug-interactions` - Check drug interactions
- `POST /api/ai/analyze-prescription` - Analyze prescription
- `POST /api/ai/health-advice` - Get health advice
- `GET /api/ai/conversations` - Get conversation history

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/emergency-contacts` - Get emergency contacts
- `POST /api/users/emergency-contacts` - Add emergency contact
- `PUT /api/users/emergency-contacts/:id` - Update contact
- `DELETE /api/users/emergency-contacts/:id` - Delete contact
- `GET /api/users/health-records` - Get health records
- `POST /api/users/health-records` - Add health record

### Caregiver Features
- `POST /api/caregivers/patients` - Link patient
- `GET /api/caregivers/patients` - Get linked patients
- `GET /api/caregivers/patients/:id/logs` - Get patient logs
- `GET /api/caregivers/patients/:id/dashboard` - Get patient dashboard

### Emergency
- `POST /api/emergency/alert` - Send emergency alert

### Voice Reminders
- `POST /api/voice/schedule` - Schedule voice reminder
- `POST /api/voice/webhook` - Twilio webhook handler

## 🐛 Troubleshooting

### Backend Issues

**Error: Firebase initialization failed**
- Check your Firebase credentials in `.env`
- Ensure the private key is properly formatted with `\n` for newlines
- Verify Firestore is enabled in Firebase Console

**Error: Port 5000 already in use**
- Change the PORT in `.env` to another port (e.g., 5001)
- Kill the process using port 5000: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)

**Error: OpenAI API key invalid**
- Verify your API key is correct
- Check if you have credits in your OpenAI account
- Ensure the key has proper permissions

### Frontend Issues

**Error: Network error - please check your connection**
- Ensure backend server is running
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS settings in backend

**Error: 404 Not Found**
- All API endpoints are properly configured
- Check browser console for specific endpoint errors
- Verify authentication token is valid

**Error: Cannot read property of undefined**
- Check Redux store initialization
- Verify API responses match expected format
- Check browser console for detailed error

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop (1920x1080 and above)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667 and above)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet.js security headers
- Input validation and sanitization
- Role-based access control

## 🚀 Deployment

### Backend Deployment (Heroku/Render)

1. Create account on Heroku or Render
2. Create new app
3. Connect GitHub repository
4. Add environment variables
5. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Create account on Vercel or Netlify
2. Import GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables
6. Deploy

## 📊 Features Checklist

✅ User Authentication (Login/Register)
✅ Medication Management
✅ Medication Reminders
✅ AI Health Assistant (English & Hindi)
✅ Drug Interaction Checker
✅ Prescription Analysis
✅ Appointment Booking
✅ Emergency Contacts
✅ SOS Alert System
✅ Health Records Management
✅ Caregiver Dashboard
✅ Family Access
✅ Real-time Notifications (Socket.IO)
✅ Voice Reminders (Twilio)
✅ Multi-language Support
✅ Mobile Responsive Design
✅ Error Handling & 404 Pages
✅ Proper API Error Messages
✅ Loading States
✅ Toast Notifications

## 🎯 Next Steps

1. **Test all features** thoroughly
2. **Add more languages** (regional Indian languages)
3. **Implement OCR** for prescription scanning
4. **Add telemedicine** video calling
5. **Integrate pharmacy** services
6. **Add wearable device** sync
7. **Implement blockchain** for medicine verification
8. **Add analytics dashboard** for health trends

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Check browser console for errors
- Verify all environment variables are set correctly

## 📄 License

MIT License - feel free to use this project for your needs.

---

**Built with ❤️ for rural healthcare in India**
