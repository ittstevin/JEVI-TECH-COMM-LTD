# JTC Internet Service Provider

A modern web application for JTC Internet, built with React, Vite, and Firebase.

## Features

- User authentication with Firebase Auth
- Dashboard for customers and admins
- Plan management
- Payment tracking
- Support ticket system
- Real-time data with Firestore

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **State Management**: Zustand
- **Routing**: React Router

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Firebase Setup

The app uses Firebase for authentication and data storage. Make sure your Firebase project is configured as per `FIREBASE_SETUP.md`.

## Admin Access

Use the admin credentials created by `create-admin.js` to access admin features.
