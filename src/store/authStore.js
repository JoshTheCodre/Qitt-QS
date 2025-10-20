import { create } from 'zustand'
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

// Error message helper
const getErrorMessage = (error) => {
  const errors = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
    'auth/popup-blocked': 'Popup was blocked. Please allow popups and try again.'
  }
  return errors[error.code] || error.message || 'An error occurred. Please try again.'
}

// Helper to create user document
const createUserDoc = async (user, additionalData = {}) => {
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    ...additionalData,
    dailyUploadLimit: 10,
    uploads: {
      pending: [],
      approved: []
    },
    savedMaterials: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

export const useAuthStore = create((set) => ({
  user: null,
  userData: null,
  loading: true,
  error: null,
  
  // Initialize auth listener
  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          set({
            user: firebaseUser,
            userData: userDoc.exists() ? userDoc.data() : null,
            loading: false,
          })
        } catch (error) {
          console.error('Error fetching user data:', error)
          set({ user: firebaseUser, userData: null, loading: false })
        }
      } else {
        set({ user: null, userData: null, loading: false })
      }
    })
    return unsubscribe
  },
  
  // Email/Password Login
  loginWithEmailPassword: async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user }
    } catch (error) {
      console.error('Login error:', error)
      const errorMsg = getErrorMessage(error)
      set({ error: errorMsg })
      return { success: false, error: errorMsg }
    }
  },
  
  // Email/Password Sign Up
  signUpWithEmailPassword: async (email, password, userData) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await createUserDoc(user, userData)
      return { success: true, user }
    } catch (error) {
      console.error('Sign up error:', error)
      const errorMsg = getErrorMessage(error)
      set({ error: errorMsg })
      return { success: false, error: errorMsg }
    }
  },
  
  // Google Login
  loginWithGoogle: async () => {
    try {
      const { user } = await signInWithPopup(auth, new GoogleAuthProvider())
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) await createUserDoc(user)
      return { success: true, user }
    } catch (error) {
      console.error('Google login error:', error)
      const errorMsg = getErrorMessage(error)
      set({ error: errorMsg })
      return { success: false, error: errorMsg }
    }
  },
  
  // Google Sign Up with form data
  signUpWithGoogle: async (formData) => {
    try {
      const { user } = await signInWithPopup(auth, new GoogleAuthProvider())
      await createUserDoc(user, formData)
      return { success: true, user }
    } catch (error) {
      console.error('Google sign up error:', error)
      const errorMsg = getErrorMessage(error)
      set({ error: errorMsg })
      return { success: false, error: errorMsg }
    }
  },
  
  // Logout
  logout: async () => {
    try {
      await firebaseSignOut(auth)
      set({ user: null, userData: null, error: null })
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      const errorMsg = getErrorMessage(error)
      set({ error: errorMsg })
      return { success: false, error: errorMsg }
    }
  },
  
  // Clear error
  clearError: () => set({ error: null }),
}))
