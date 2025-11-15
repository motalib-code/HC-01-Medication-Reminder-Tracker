# SwasthSetu Quick Reference Guide

## 🚀 Quick Commands

### Development

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev

# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && npm run dev

# Build for production
npm run build
```

### Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Check TypeScript errors
cd backend && npm run build
cd frontend && npm run build
```

## 📡 API Endpoints Quick Reference

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/verify` | Verify token |
| POST | `/auth/logout` | Logout user |

### Medications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/medications` | Get all medications |
| POST | `/medications` | Create medication |
| GET | `/medications/:id` | Get medication by ID |
| PUT | `/medications/:id` | Update medication |
| DELETE | `/medications/:id` | Delete medication |
| POST | `/medications/:id/log` | Log medication taken |
| GET | `/medications/upcoming` | Get upcoming reminders |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/appointments` | Get all appointments |
| POST | `/appointments` | Create appointment |
| GET | `/appointments/:id` | Get appointment by ID |
| PUT | `/appointments/:id` | Update appointment |
| DELETE | `/appointments/:id` | Cancel appointment |

### AI Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/chat` | Chat with AI |
| POST | `/ai/simplify` | Simplify medical jargon |
| POST | `/ai/drug-interactions` | Check drug interactions |
| POST | `/ai/analyze-prescription` | Analyze prescription |
| POST | `/ai/health-advice` | Get health advice |
| GET | `/ai/conversations` | Get conversation history |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | Get user profile |
| PUT | `/users/profile` | Update profile |
| GET | `/users/emergency-contacts` | Get emergency contacts |
| POST | `/users/emergency-contacts` | Add emergency contact |
| PUT | `/users/emergency-contacts/:id` | Update contact |
| DELETE | `/users/emergency-contacts/:id` | Delete contact |
| GET | `/users/health-records` | Get health records |
| POST | `/users/health-records` | Add health record |
| PUT | `/users/health-records/:id` | Update record |
| DELETE | `/users/health-records/:id` | Delete record |

### Caregiver
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/caregivers/patients` | Link patient |
| GET | `/caregivers/patients` | Get linked patients |
| GET | `/caregivers/patients/:id/logs` | Get patient logs |
| GET | `/caregivers/patients/:id/dashboard` | Get patient dashboard |

### Emergency
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/emergency/alert` | Send emergency alert |

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-phone-number
OPENAI_API_KEY=your-openai-key
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_NODE_ENV=development
```

## 🗄️ Database Collections

### Firestore Collections
- `users` - User profiles
- `medications` - Medication information
- `medicationLogs` - Medication adherence logs
- `appointments` - Appointment bookings
- `aiConversations` - AI chat history
- `emergencyContacts` - Emergency contacts
- `healthRecords` - Health records
- `notifications` - User notifications
- `caregiverLinks` - Caregiver-patient links
- `familyLinks` - Family member links
- `voiceReminders` - Voice reminder logs

## 👥 User Roles

| Role | Value | Description |
|------|-------|-------------|
| Patient | `patient` | Elderly patients |
| Caregiver | `caregiver` | Family members |
| Doctor | `doctor` | Healthcare providers |
| Health Worker | `health_worker` | Community health workers |
| Admin | `admin` | System administrators |

## 🌐 Frontend Routes

| Route | Component | Protected | Description |
|-------|-----------|-----------|-------------|
| `/` | Dashboard | Yes | Main dashboard |
| `/login` | Login | No | Login page |
| `/register` | Register | No | Registration page |
| `/dashboard` | Dashboard | Yes | User dashboard |
| `/medications` | Medications | Yes | Medication management |
| `/ai-chat` | AIChat | Yes | AI chatbot |
| `/appointments` | Appointments | Yes | Appointment booking |
| `/emergency` | EmergencyContacts | Yes | Emergency contacts |
| `/health-records` | HealthRecords | Yes | Health records |
| `/profile` | Profile | Yes | User profile |
| `/caregiver` | CaregiverDashboard | Yes | Caregiver dashboard |

## 🔧 Common Issues & Solutions

### Backend won't start
```bash
# Check if port is in use
lsof -ti:5000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :5000   # Windows

# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend won't start
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json .vite
npm install
npm run dev
```

### Database connection issues
```bash
# Check Firebase credentials
# Verify .env file exists
# Check Firebase console for project status
```

### API 404 errors
```bash
# Verify backend is running
curl http://localhost:5000/health

# Check CORS settings
# Verify API_URL in frontend .env
```

## 📦 Package Versions

### Backend
- Node.js: 18+
- Express: 4.18+
- Firebase Admin: 12.0+
- OpenAI: 4.24+
- Twilio: 4.20+
- Socket.IO: 4.6+

### Frontend
- React: 18.2+
- TypeScript: 5.3+
- Vite: 5.0+
- Redux Toolkit: 2.0+
- Material-UI: 5.15+
- Tailwind CSS: 3.4+

## 🐛 Debugging

### Backend Logs
```bash
# View logs
cd backend
npm run dev

# Check specific endpoint
curl -X GET http://localhost:5000/api/medications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Frontend Debugging
```javascript
// Check Redux state
console.log(store.getState())

// Check API calls
// Open browser DevTools > Network tab

// Check errors
// Open browser DevTools > Console tab
```

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend generates JWT token
3. Token stored in localStorage
4. Token sent in Authorization header
5. Backend verifies token
6. Access granted/denied

### Token Format
```
Authorization: Bearer <jwt_token>
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

## 🎨 Color Palette

```css
/* Primary Colors */
--primary-blue: #2196f3
--primary-green: #4caf50
--primary-red: #f44336

/* Status Colors */
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--info: #3b82f6

/* Neutral Colors */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-900: #111827
```

## 🚀 Deployment URLs

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Production
- Frontend: https://your-frontend-domain.com
- Backend: https://your-backend-domain.com

## 📞 Support

- Documentation: See SETUP_GUIDE.md
- Testing: See TESTING_GUIDE.md
- Deployment: See DEPLOYMENT_CHECKLIST.md
- Issues: GitHub Issues

---

**Last Updated**: 2024

**Version**: 1.0.0
