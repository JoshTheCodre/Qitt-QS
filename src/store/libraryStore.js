import { create } from 'zustand'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore'
import { getCachedLibraryData, setCachedLibraryData, getCachedValue, setCachedValue, clearLibraryCache } from '@/lib/utils'

const useLibraryStore = create((set, get) => ({
  // State
  savedMaterials: [],
  userUploads: [],
  loading: false,
  error: null,
  dailyUploadLimit: 10,
  uploadsToday: 0,

  // Fetch saved materials (My Library)
  fetchSavedMaterials: async (userId) => {
    if (!userId) return

    // Load from cache first to avoid flicker
    const cachedMaterials = getCachedLibraryData(userId, 'SAVED_MATERIALS')
    if (cachedMaterials) {
      set({ savedMaterials: cachedMaterials, loading: false })
    } else {
      set({ loading: true, error: null })
    }
    
    try {
      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const savedMaterialIds = userDoc.data().savedMaterials || []
        
        if (savedMaterialIds.length > 0) {
          // Fetch full material details
          const materialsPromises = savedMaterialIds.map(materialId => 
            getDoc(doc(db, 'materials', materialId))
          )
          
          const materialDocs = await Promise.all(materialsPromises)
          const materials = materialDocs
            .filter(doc => doc.exists())
            .map(doc => ({ id: doc.id, ...doc.data() }))
          
          // Update cache
          setCachedLibraryData(userId, 'SAVED_MATERIALS', materials)
          set({ savedMaterials: materials, loading: false })
        } else {
          setCachedLibraryData(userId, 'SAVED_MATERIALS', [])
          set({ savedMaterials: [], loading: false })
        }
      } else {
        setCachedLibraryData(userId, 'SAVED_MATERIALS', [])
        set({ savedMaterials: [], loading: false })
      }
    } catch (error) {
      console.error('Error fetching saved materials:', error)
      set({ error: error.message, loading: false })
    }
  },

  // Fetch user uploads (My Uploads)
  fetchUserUploads: async (userId) => {
    if (!userId) return

    // Load from cache first to avoid flicker
    const cachedUploads = getCachedLibraryData(userId, 'USER_UPLOADS')
    const cachedLimit = getCachedValue(userId, 'DAILY_LIMIT')
    const cachedToday = getCachedValue(userId, 'UPLOADS_TODAY')
    
    if (cachedUploads) {
      set({ 
        userUploads: cachedUploads,
        dailyUploadLimit: cachedLimit || 10,
        uploadsToday: cachedToday || 0,
        loading: false 
      })
    } else {
      set({ loading: true, error: null })
    }
    
    try {
      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const uploadIds = userData.uploads || []
        const dailyLimit = userData.dailyUploadLimit || 10
        
        if (uploadIds.length > 0) {
          // Fetch full material details
          const materialsPromises = uploadIds.map(materialId => 
            getDoc(doc(db, 'materials', materialId))
          )
          
          const materialDocs = await Promise.all(materialsPromises)
          const materials = materialDocs
            .filter(doc => doc.exists())
            .map(doc => ({ id: doc.id, ...doc.data() }))
          
          // Calculate uploads today
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const todayUploads = materials.filter(m => {
            const uploadDate = m.metadata?.uploadedAt ? new Date(m.metadata.uploadedAt) : new Date(0)
            uploadDate.setHours(0, 0, 0, 0)
            return uploadDate.getTime() === today.getTime()
          }).length
          
          // Update cache
          setCachedLibraryData(userId, 'USER_UPLOADS', materials)
          setCachedValue(userId, 'DAILY_LIMIT', dailyLimit)
          setCachedValue(userId, 'UPLOADS_TODAY', todayUploads)
          
          set({ 
            userUploads: materials,
            dailyUploadLimit: dailyLimit,
            uploadsToday: todayUploads,
            loading: false 
          })
        } else {
          setCachedLibraryData(userId, 'USER_UPLOADS', [])
          setCachedValue(userId, 'DAILY_LIMIT', dailyLimit)
          setCachedValue(userId, 'UPLOADS_TODAY', 0)
          
          set({ 
            userUploads: [],
            dailyUploadLimit: dailyLimit,
            uploadsToday: 0,
            loading: false 
          })
        }
      } else {
        setCachedLibraryData(userId, 'USER_UPLOADS', [])
        setCachedValue(userId, 'DAILY_LIMIT', 10)
        setCachedValue(userId, 'UPLOADS_TODAY', 0)
        
        set({ 
          userUploads: [],
          dailyUploadLimit: 10,
          uploadsToday: 0,
          loading: false 
        })
      }
    } catch (error) {
      console.error('Error fetching user uploads:', error)
      set({ error: error.message, loading: false })
    }
  },

  // Add material to saved (My Library)
  addToSaved: async (userId, materialId) => {
    try {
      const userDocRef = doc(db, 'users', userId)
      
      await updateDoc(userDocRef, {
        savedMaterials: arrayUnion(materialId)
      })
      
      // Refresh saved materials (will update cache automatically)
      await get().fetchSavedMaterials(userId)
      
      return { success: true }
    } catch (error) {
      console.error('Error adding to saved:', error)
      set({ error: error.message })
      return { success: false, error: error.message }
    }
  },

  // Remove material from saved (My Library)
  removeFromSaved: async (userId, materialId) => {
    try {
      const userDocRef = doc(db, 'users', userId)
      
      await updateDoc(userDocRef, {
        savedMaterials: arrayRemove(materialId)
      })
      
      // Update local state immediately for better UX
      set(state => ({
        savedMaterials: state.savedMaterials.filter(m => m.id !== materialId)
      }))
      
      // Update cache
      const updatedMaterials = get().savedMaterials
      setCachedLibraryData(userId, 'SAVED_MATERIALS', updatedMaterials)
      
      return { success: true }
    } catch (error) {
      console.error('Error removing from saved:', error)
      set({ error: error.message })
      return { success: false, error: error.message }
    }
  },

  // Get upload stats
  getUploadStats: () => {
    const { userUploads } = get()
    const totalUploads = userUploads.length
    const totalLikes = userUploads.reduce((sum, material) => sum + (material.likes || 0), 0)
    const approvedCount = userUploads.filter(m => m.isApproved === true).length
    const pendingCount = userUploads.filter(m => m.isApproved !== true).length
    
    return {
      totalUploads,
      totalLikes,
      pendingCount,
      approvedCount
    }
  },

  // Check if user can upload today
  canUploadToday: () => {
    const { uploadsToday, dailyUploadLimit } = get()
    return uploadsToday < dailyUploadLimit
  },

  // Get remaining uploads for today
  getRemainingUploads: () => {
    const { uploadsToday, dailyUploadLimit } = get()
    return Math.max(0, dailyUploadLimit - uploadsToday)
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => {
    const userId = get().userId // Assuming you track userId in store
    if (userId) {
      clearLibraryCache(userId)
    }
    set({
      savedMaterials: [],
      userUploads: [],
      loading: false,
      error: null,
      dailyUploadLimit: 10,
      uploadsToday: 0
    })
  }
}))

export { useLibraryStore }
