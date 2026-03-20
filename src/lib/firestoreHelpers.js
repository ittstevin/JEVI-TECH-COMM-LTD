import {
  collection,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore'
import { firestore } from './firebase'

export const firestoreHelpers = {
  // Create a new document
  async createDocument(collectionName, data) {
    try {
      const docRef = await addDoc(collection(firestore, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return { id: docRef.id, error: null }
    } catch (error) {
      return { id: null, error: error.message }
    }
  },

  // Get a specific document
  async getDocument(collectionName, docId) {
    try {
      const docRef = doc(firestore, collectionName, docId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() }, error: null }
      }
      return { data: null, error: 'Document not found' }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Get all documents in a collection
  async getCollection(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(firestore, collectionName))
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      return { data: docs, error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Query documents with conditions
  async queryCollection(collectionName, conditions) {
    try {
      const constraints = conditions.map((cond) => where(cond.field, cond.operator, cond.value))
      const q = query(collection(firestore, collectionName), ...constraints)
      const querySnapshot = await getDocs(q)
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      return { data: docs, error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Update a document
  async updateDocument(collectionName, docId, data) {
    try {
      const docRef = doc(firestore, collectionName, docId)
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      })
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Delete a document
  async deleteDocument(collectionName, docId) {
    try {
      await deleteDoc(doc(firestore, collectionName, docId))
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Set a document (create or overwrite)
  async setDocument(collectionName, docId, data) {
    try {
      const docRef = doc(firestore, collectionName, docId)
      await setDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      })
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },
}
