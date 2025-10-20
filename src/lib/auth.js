import { auth, db } from './firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

// Helper to create user document in Firestore
const createUserDoc = async (user, additionalData = {}) => {
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    ...additionalData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

// Error handler wrapper
const handleAuth = async (authFunction) => {
  try {
    return await authFunction()
  } catch (error) {
    console.error('Auth error:', error)
    return { user: null, error: getErrorMessage(error) }
  }
}

export const loginWithEmailPassword = async (email, password) => 
  handleAuth(async () => {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    return { user, error: null }
  })

export const signUpWithEmailPassword = async (email, password, userData) => 
  handleAuth(async () => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await createUserDoc(user, userData)
    return { user, error: null }
  })

export const loginWithGoogle = async () => 
  handleAuth(async () => {
    const { user } = await signInWithPopup(auth, new GoogleAuthProvider())
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (!userDoc.exists()) await createUserDoc(user)
    return { user, error: null }
  })

export const signUpWithGoogle = async (formData) => 
  handleAuth(async () => {
    const { user } = await signInWithPopup(auth, new GoogleAuthProvider())
    await createUserDoc(user, formData)
    return { user, error: null }
  })

export const logout = () => 
  handleAuth(async () => {
    await firebaseSignOut(auth)
    return { error: null }
  })

export const getUserData = async (uid) => 
  handleAuth(async () => {
    const userDoc = await getDoc(doc(db, 'users', uid))
    return userDoc.exists() 
      ? { data: userDoc.data(), error: null }
      : { data: null, error: 'User data not found' }
  })

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
