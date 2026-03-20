import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth'
import { auth } from './firebase'

export const authHelpers = {
  // Sign up new user
  async signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return { user: userCredential.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  },

  // Sign in existing user
  async login(email, password) {
    try {
      await setPersistence(auth, browserSessionPersistence)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { user: userCredential.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  },

  // Sign out user
  async logout() {
    try {
      await signOut(auth)
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback)
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser
  },

  // Get user ID token
  async getIdToken() {
    const user = auth.currentUser
    if (user) {
      return await user.getIdToken()
    }
    return null
  },
}
