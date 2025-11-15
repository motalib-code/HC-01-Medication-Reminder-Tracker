# SwasthSetu Testing Guide

## 🧪 Complete Testing Checklist

This guide helps you test all features of the SwasthSetu platform to ensure everything works correctly.

## Prerequisites

- Backend server running on `http://localhost:5000`
- Frontend app running on `http://localhost:5173`
- Firebase Firestore configured
- OpenAI API key configured
- Twilio credentials configured (optional for voice features)

## 1. Authentication Testing

### Register New User
- [ ] Navigate to `/register`
- [ ] Fill in all required fields:
  - Name
  - Email
  - Password
  - Phone number
  - Date of birth
  - Select role (Patient/Caregiver)
  - Select language (English/Hindi)
- [ ] Click "Register"
- [ ] Verify redirect to dashboard
- [ ] Check if token is stored in localStorage

### Login
- [ ] Navigate to `/login`
- [ ] Enter registered email and password
- [ ] Click "Login"
- [ ] Verify redirect to dashboard
- [ ] Check if user data is loaded

### Logout
- [ ] Click logout button
- [ ] Verify redirect to login page
- [ ] Check if token is removed from localStorage

### Protected Routes
- [ ] Try accessing `/dashboard` without login
- [ ] Verify redirect to `/login`
- [ ] Login and verify access to protected routes

## 2. Medication Management Testing

### Add Medication
- [ ] Navigate to `/medications`
- [ ] Click "Add Medication"
- [ ] Fill in medication details:
  - Name (e.g., "Aspirin")
  - Dosage (e.g., "100mg")
  - Frequency (e.g., "Twice daily")
  - Times (e.g., "08:00, 20:00")
  - Start date
  - Instructions (optional)
- [ ] Click "Save"
- [ ] Verify medication appears in list

### View Medications
- [ ] Check if all medications are displayed
- [ ] Verify medication details are correct
- [ ] Check if times are displayed as chips

### Edit Medication
- [ ] Click "Edit" on a medication
- [ ] Modify details
- [ ] Click "Update"
- [ ] Verify changes are saved

### Delete Medication
- [ ] Click "Delete" on a medication
- [ ] Confirm deletion
- [ ] Verify medication is removed from list

### Mark Medication as Taken
- [ ] Click "Mark as Taken" button
- [ ] Verify success notification
- [ ] Check if log is created

### View Upcoming Reminders
- [ ] Navigate to dashboard
- [ ] Check "Upcoming Medications" section
- [ ] Verify correct medications and times are shown

## 3. AI Chatbot Testing

### Basic Chat
- [ ] Navigate to `/ai-chat`
- [ ] Type a health question in English
- [ ] Click "Send"
- [ ] Verify AI response is received
- [ ] Check if message appears in chat history

### Language Switching
- [ ] Switch language to Hindi
- [ ] Type a question in Hindi
- [ ] Verify AI responds in Hindi
- [ ] Switch back to English

### Quick Actions

#### Simplify Medical Terms
- [ ] Click "Simplify Medical Terms" button
- [ ] Verify pre-filled message
- [ ] Send message
- [ ] Check if AI simplifies medical jargon

#### Check Drug Interactions
- [ ] Click "Check Drug Interactions" button
- [ ] Verify AI checks your medications
- [ ] Review interaction warnings
- [ ] Check severity levels (minor/moderate/major)

#### Analyze Prescription
- [ ] Click "Analyze Prescription" button
- [ ] Provide prescription text
- [ ] Verify AI extracts:
  - Medication names
  - Dosages
  - Frequency
  - Instructions
  - Side effects

#### Get Health Advice
- [ ] Click "Get Health Advice" button
- [ ] Describe symptoms
- [ ] Verify AI provides advice
- [ ] Check if AI recommends consulting a doctor

### Conversation History
- [ ] Send multiple messages
- [ ] Verify all messages are displayed
- [ ] Check timestamps
- [ ] Verify scroll to bottom works

## 4. Appointment Testing

### Book Appointment
- [ ] Navigate to `/appointments`
- [ ] Click "Book Appointment"
- [ ] Fill in details:
  - Type (Telemedicine/In-Person/Follow-up)
  - Date and time (future date)
  - Duration (15/30/45/60 minutes)
  - Notes (optional)
- [ ] Click "Book Appointment"
- [ ] Verify success notification
- [ ] Check if appointment appears in list

### View Appointments
- [ ] Check if all appointments are displayed
- [ ] Verify appointment details are correct
- [ ] Check status badges (scheduled/completed/cancelled)

### Edit Appointment
- [ ] Click "Edit" on a scheduled appointment
- [ ] Modify details
- [ ] Click "Update Appointment"
- [ ] Verify changes are saved

### Cancel Appointment
- [ ] Click "Cancel" on a scheduled appointment
- [ ] Confirm cancellation
- [ ] Verify status changes to "cancelled"
- [ ] Check if notification is created

### Empty State
- [ ] Delete all appointments
- [ ] Verify empty state message is shown
- [ ] Check if "Book Your First Appointment" button works

## 5. Emergency Contacts Testing

### Add Emergency Contact
- [ ] Navigate to `/emergency`
- [ ] Click "Add Contact"
- [ ] Fill in details:
  - Name
  - Phone number
  - Relationship
- [ ] Click "Save"
- [ ] Verify contact appears in list

### Edit Emergency Contact
- [ ] Click "Edit" on a contact
- [ ] Modify details
- [ ] Click "Save"
- [ ] Verify changes are saved

### Delete Emergency Contact
- [ ] Click "Delete" on a contact
- [ ] Confirm deletion
- [ ] Verify contact is removed

### Send SOS Alert
- [ ] Click "Send SOS Alert" button
- [ ] Confirm alert
- [ ] Verify success notification
- [ ] Check if alert is sent to all contacts

### Emergency Services
- [ ] Verify emergency service numbers are displayed:
  - Ambulance: 108
  - Police: 100
  - Fire: 101

## 6. Health Records Testing

### Add Health Record
- [ ] Navigate to `/health-records`
- [ ] Click "Add Record"
- [ ] Fill in details:
  - Title
  - Type (Medical/Prescription/Test/Vaccination/Allergy)
  - Date
  - Description
- [ ] Click "Save"
- [ ] Verify record appears in list

### View Health Records
- [ ] Check if all records are displayed
- [ ] Verify record details are correct
- [ ] Check if dates are formatted correctly

### Edit Health Record
- [ ] Click "View" on a record
- [ ] Modify details
- [ ] Click "Save"
- [ ] Verify changes are saved

### Delete Health Record
- [ ] Click "Delete" on a record
- [ ] Confirm deletion
- [ ] Verify record is removed

## 7. Caregiver Dashboard Testing

### Link Patient
- [ ] Login as caregiver
- [ ] Navigate to `/caregiver`
- [ ] Click "Add Patient"
- [ ] Enter patient email
- [ ] Select relationship
- [ ] Click "Add Patient"
- [ ] Verify patient is linked

### View Patient List
- [ ] Check if all linked patients are displayed
- [ ] Verify patient names and relationships

### View Patient Logs
- [ ] Click on a patient
- [ ] Verify medication logs are displayed
- [ ] Check log statuses (taken/missed/pending)
- [ ] Verify timestamps are correct

### Monitor Adherence
- [ ] Check adherence statistics
- [ ] Verify percentage calculations
- [ ] Review missed medication alerts

## 8. Dashboard Testing

### Stats Cards
- [ ] Verify medication count is correct
- [ ] Check appointment count
- [ ] Verify AI Assistant status

### Upcoming Medications
- [ ] Check if upcoming medications are displayed
- [ ] Verify times are correct
- [ ] Test "Mark as taken" button

### Upcoming Appointments
- [ ] Check if upcoming appointments are displayed
- [ ] Verify dates and times
- [ ] Check status badges

### Error Handling
- [ ] Disconnect internet
- [ ] Verify network error message
- [ ] Reconnect and verify data loads

## 9. Profile Testing

### View Profile
- [ ] Navigate to `/profile`
- [ ] Verify all user details are displayed
- [ ] Check if language preference is shown

### Update Profile
- [ ] Click "Edit Profile"
- [ ] Modify details
- [ ] Click "Save"
- [ ] Verify changes are saved
- [ ] Check if success notification appears

## 10. Notifications Testing

### Real-time Notifications
- [ ] Perform an action (e.g., book appointment)
- [ ] Verify notification appears
- [ ] Check notification content
- [ ] Verify auto-dismiss after 3 seconds

### Notification Types
- [ ] Test success notifications (green)
- [ ] Test error notifications (red)
- [ ] Test info notifications (blue)
- [ ] Test warning notifications (yellow)

## 11. Mobile Responsiveness Testing

### Test on Different Screen Sizes
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Check UI Elements
- [ ] Navigation menu (hamburger on mobile)
- [ ] Forms (proper input sizing)
- [ ] Cards (stack on mobile)
- [ ] Buttons (touch-friendly size)
- [ ] Tables (horizontal scroll if needed)

## 12. Error Handling Testing

### 404 Errors
- [ ] Navigate to non-existent route (e.g., `/invalid`)
- [ ] Verify 404 page is displayed
- [ ] Check if "Go Home" button works

### API Errors
- [ ] Stop backend server
- [ ] Try to fetch data
- [ ] Verify network error message
- [ ] Restart server and verify recovery

### Validation Errors
- [ ] Submit forms with empty fields
- [ ] Verify validation messages
- [ ] Submit invalid email format
- [ ] Check if errors are displayed

### Authentication Errors
- [ ] Login with wrong credentials
- [ ] Verify error message
- [ ] Try accessing protected route with expired token
- [ ] Verify redirect to login

## 13. Performance Testing

### Load Time
- [ ] Measure initial page load time (should be < 3s)
- [ ] Check API response times (should be < 500ms)
- [ ] Verify smooth scrolling
- [ ] Check for memory leaks

### Concurrent Users
- [ ] Open multiple browser tabs
- [ ] Login with different users
- [ ] Perform actions simultaneously
- [ ] Verify no conflicts

## 14. Security Testing

### Authentication
- [ ] Verify JWT token is required for protected routes
- [ ] Check if token expires correctly
- [ ] Test logout clears token

### Authorization
- [ ] Try accessing caregiver routes as patient
- [ ] Verify 403 Forbidden error
- [ ] Check role-based access control

### Input Sanitization
- [ ] Try SQL injection in forms
- [ ] Test XSS attacks
- [ ] Verify inputs are sanitized

## 15. Integration Testing

### End-to-End User Flow
1. [ ] Register new patient account
2. [ ] Add medications
3. [ ] Set up reminders
4. [ ] Add emergency contacts
5. [ ] Book appointment
6. [ ] Chat with AI
7. [ ] Add health record
8. [ ] Mark medication as taken
9. [ ] View dashboard
10. [ ] Logout

### Caregiver Flow
1. [ ] Register caregiver account
2. [ ] Link patient
3. [ ] View patient dashboard
4. [ ] Monitor medication logs
5. [ ] Receive alerts
6. [ ] Logout

## Test Results Template

```
Test Date: ___________
Tester: ___________
Environment: Development / Staging / Production

| Feature | Status | Notes |
|---------|--------|-------|
| Authentication | ✅ / ❌ | |
| Medications | ✅ / ❌ | |
| AI Chatbot | ✅ / ❌ | |
| Appointments | ✅ / ❌ | |
| Emergency | ✅ / ❌ | |
| Health Records | ✅ / ❌ | |
| Caregiver | ✅ / ❌ | |
| Dashboard | ✅ / ❌ | |
| Mobile | ✅ / ❌ | |
| Performance | ✅ / ❌ | |

Overall Status: ✅ Pass / ❌ Fail

Issues Found:
1. 
2. 
3. 
```

## Automated Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Bug Reporting

When you find a bug, report it with:
1. **Title**: Brief description
2. **Steps to Reproduce**: Detailed steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Environment**: Browser, OS, device
7. **Console Errors**: Any error messages

## Success Criteria

All tests should pass with:
- ✅ No critical bugs
- ✅ All features working as expected
- ✅ Good performance (< 3s load time)
- ✅ Mobile responsive
- ✅ Proper error handling
- ✅ Security measures in place

---

**Happy Testing! 🧪**
