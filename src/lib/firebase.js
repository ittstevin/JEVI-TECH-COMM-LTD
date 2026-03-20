import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrO5AQ6UrLSjd-jp1VET_CWOcvrRYmbm0",
  authDomain: "sky-dot.firebaseapp.com",
  projectId: "sky-dot",
  storageBucket: "sky-dot.firebasestorage.app",
  messagingSenderId: "245249338263",
  appId: "1:245249338263:web:8b202f1a925f465414b2d2"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app)

export default app
