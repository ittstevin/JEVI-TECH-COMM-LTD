# Firebase Migration Guide

## Overview
This project is migrating from Express.js + Prisma + SQLite to Firebase using:
- **Firebase Authentication** for user management
- **Firestore** for database
- **Cloud Storage** for file uploads
- **Cloud Functions** for serverless business logic

## Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create Project"
3. Enter project name: `sky-dot-networks` or similar
4. Select your region and create the project

### 2. Get Firebase Credentials
1. In Firebase Console, click the settings icon → Project Settings
2. Go to "Service Accounts" tab
3. Click "Generate New Private Key" → Download JSON file
4. Copy the configuration details

### 3. Add Environment Variables
1. Create `.env` file in project root (copy from `.env.example`)
2. Add your Firebase config:
```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

### 4. Enable Firebase Services
In Firebase Console:
- ✅ Enable **Authentication** → Sign-in method: Email/Password
- ✅ Enable **Firestore Database** → Start in Test mode (for development)
- ✅ Enable **Storage** → Set rules for uploads

### 4.1 Firebase Firestore Rules (for local/dev)
Set these rules in Firebase Console > Firestore > Rules:
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4.2 Admin-level write permissions (only for admin users)
Use these once admin identity exists:
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }

    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }
  }
}
```

### 5. Firestore Collections Structure

Replace your old database with these collections:

#### Users
```json
{
  "uid": "auto-generated",
  "email": "user@example.com",
  "name": "Full Name",
  "role": "CUSTOMER" | "ADMIN",
  "phone": "+1234567890",
  "address": "123 Main St",
  "verified": true,
  "subscriptionId": "reference to Subscriptions",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Plans
```json
{
  "name": "Basic",
  "speed": 10,
  "price": 1500,
  "description": "Ideal for browsing",
  "features": ["Unlimited data", "Standard support"],
  "createdAt": "timestamp"
}
```

#### Subscriptions
```json
{
  "userId": "reference to Users",
  "planId": "reference to Plans",
  "status": "ACTIVE" | "INACTIVE" | "EXPIRED",
  "startDate": "timestamp",
  "renewalDate": "timestamp",
  "createdAt": "timestamp"
}
```

#### Messages
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "subject": "Subject",
  "message": "Message content",
  "status": "UNREAD" | "READ",
  "createdAt": "timestamp"
}
```

#### Testimonials
```json
{
  "userId": "reference to Users",
  "content": "Great service!",
  "rating": 5,
  "approved": true,
  "createdAt": "timestamp"
}
```

### 6. Update Authentication Pages

#### LoginPage.jsx Migration
```javascript
import { authHelpers } from '../lib/authHelpers'

const handleSubmit = async (e) => {
  e.preventDefault()
  const { user, error } = await authHelpers.login(form.email, form.password)
  if (error) {
    setStatus({ type: 'error', message: error })
  } else {
    // Redirect to dashboard
  }
}
```

#### SignupPage.jsx Migration
```javascript
const handleSignup = async (userData) => {
  const { user, error } = await authHelpers.signup(userData.email, userData.password)
  if (!error && user) {
    await firestoreHelpers.createDocument('users', {
      uid: user.uid,
      email: user.email,
      name: userData.name,
      role: 'CUSTOMER',
      verified: false,
    })
  }
}
```

### 7. Migrate Backend Business Logic

Old Express routes → Firebase Cloud Functions:
- `POST /api/auth/login` → Firebase Auth SDK
- `POST /api/auth/signup` → Firebase Auth SDK + Firestore
- `GET /api/users/:id` → firestoreHelpers.getDocument('users', id)
- `POST /api/plans` → firestoreHelpers.createDocument('plans', data)
- etc.

### 8. Deploy to Firebase

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

## Key Files Created
- `src/lib/firebase.js` - Firebase initialization
- `src/lib/authHelpers.js` - Authentication functions
- `src/lib/firestoreHelpers.js` - Database operations

## Testing Checklist
- [ ] Users can sign up with email/password
- [ ] Users can log in
- [ ] User data saved to Firestore
- [ ] Plans display from Firestore
- [ ] Messages saved from contact form
- [ ] Testimonials approved by admin
- [ ] Subscriptions created/managed
- [ ] Admin dashboard works

## Next Steps
1. Update LoginPage to use authHelpers
2. Update SignupPage to use authHelpers + firestoreHelpers
3. Migrate all API calls to use firestoreHelpers
4. Create Cloud Functions for complex logic
5. Update Admin Dashboard to query Firestore
6. Deploy to Firebase Hosting
