// Firebase API Helper - Replaces Express API calls
import { authHelpers } from './authHelpers'
import { firestoreHelpers } from './firestoreHelpers'
import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const firebaseAPI = {
  // Authentication
  auth: {
    async login({ email, password }) {
      const { user, error } = await authHelpers.login(email, password)
      if (error) throw new Error(error)
      return { user, token: await authHelpers.getIdToken() }
    },

    async signup({ email, password, name, phone, address }) {
      const { user, error } = await authHelpers.signup(email, password)
      if (error) throw new Error(error)

      // Create user profile in Firestore
      await firestoreHelpers.setDocument('users', user.uid, {
        email,
        name,
        phone: phone || '',
        address: address || '',
        role: 'CUSTOMER',
        verified: false,
        createdAt: new Date(),
      })

      return { user, token: await authHelpers.getIdToken() }
    },

    async logout() {
      const { error } = await authHelpers.logout()
      if (error) throw new Error(error)
    },

    async getCurrentUser() {
      const user = authHelpers.getCurrentUser()
      if (!user) return null

      const { data } = await firestoreHelpers.getDocument('users', user.uid)
      return data
    },
  },

  // Users
  users: {
    async getProfile(userId) {
      const { data, error } = await firestoreHelpers.getDocument('users', userId)
      if (error) throw new Error(error)
      return data
    },

    async updateProfile(userId, updateData) {
      const { error } = await firestoreHelpers.updateDocument('users', userId, updateData)
      if (error) throw new Error(error)
    },

    async getAllUsers() {
      const { data, error } = await firestoreHelpers.getCollection('users')
      if (error) throw new Error(error)
      return data
    },
  },

  // Plans
  plans: {
    async getAll() {
      const { data, error } = await firestoreHelpers.getCollection('plans')
      if (error) throw new Error(error)
      return data
    },

    async getById(planId) {
      const { data, error } = await firestoreHelpers.getDocument('plans', planId)
      if (error) throw new Error(error)
      return data
    },

    async create(planData) {
      const { id, error } = await firestoreHelpers.createDocument('plans', planData)
      if (error) throw new Error(error)
      return id
    },

    async update(planId, updateData) {
      const { error } = await firestoreHelpers.updateDocument('plans', planId, updateData)
      if (error) throw new Error(error)
    },

    async delete(planId) {
      const { error } = await firestoreHelpers.deleteDocument('plans', planId)
      if (error) throw new Error(error)
    },
  },

  // Subscriptions
  subscriptions: {
    async create(subscriptionData) {
      const { id, error } = await firestoreHelpers.createDocument('subscriptions', subscriptionData)
      if (error) throw new Error(error)
      return id
    },

    async getByUserId(userId) {
      const { data, error } = await firestoreHelpers.queryCollection('subscriptions', [
        { field: 'userId', operator: '==', value: userId },
      ])
      if (error) throw new Error(error)
      return data
    },

    async update(subscriptionId, updateData) {
      const { error } = await firestoreHelpers.updateDocument('subscriptions', subscriptionId, updateData)
      if (error) throw new Error(error)
    },

    async cancel(subscriptionId) {
      const { error } = await firestoreHelpers.updateDocument('subscriptions', subscriptionId, {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      })
      if (error) throw new Error(error)
    },
  },

  // Messages
  messages: {
    async create(messageData) {
      const { id, error } = await firestoreHelpers.createDocument('messages', messageData)
      if (error) throw new Error(error)
      return id
    },

    async getAll() {
      const { data, error } = await firestoreHelpers.getCollection('messages')
      if (error) throw new Error(error)
      return data
    },

    async getById(messageId) {
      const { data, error } = await firestoreHelpers.getDocument('messages', messageId)
      if (error) throw new Error(error)
      return data
    },

    async markAsRead(messageId) {
      const { error } = await firestoreHelpers.updateDocument('messages', messageId, {
        status: 'READ',
      })
      if (error) throw new Error(error)
    },

    async delete(messageId) {
      const { error } = await firestoreHelpers.deleteDocument('messages', messageId)
      if (error) throw new Error(error)
    },
  },

  // Testimonials
  testimonials: {
    async create(testimonialData) {
      const { id, error } = await firestoreHelpers.createDocument('testimonials', testimonialData)
      if (error) throw new Error(error)
      return id
    },

    async getApproved() {
      const { data, error } = await firestoreHelpers.queryCollection('testimonials', [
        { field: 'approved', operator: '==', value: true },
      ])
      if (error) throw new Error(error)
      return data
    },

    async getAll() {
      const { data, error } = await firestoreHelpers.getCollection('testimonials')
      if (error) throw new Error(error)
      return data
    },

    async approve(testimonialId) {
      const { error } = await firestoreHelpers.updateDocument('testimonials', testimonialId, {
        approved: true,
      })
      if (error) throw new Error(error)
    },

    async reject(testimonialId) {
      const { error } = await firestoreHelpers.deleteDocument('testimonials', testimonialId)
      if (error) throw new Error(error)
    },
  },

  // Storage (File uploads)
  storage: {
    async uploadFile(file, path) {
      try {
        const storageRef = ref(storage, path)
        const snapshot = await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(snapshot.ref)
        return downloadURL
      } catch (error) {
        throw new Error(error.message)
      }
    },
  },
}
