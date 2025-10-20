import { create } from 'zustand'
import { db, storage } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { generateAndUploadPdfThumbnail } from '@/lib/utils'

const useUploadStore = create((set, get) => ({
  uploadData: {
    courseCode: '',
    type: '',
    description: '',
    tags: [],
    department: '',
    faculty: '',
    level: '',
    price: 0,
  },
  file: null,
  uploadProgress: 0,
  isUploading: false,
  uploadError: null,

  updateField: (field, value) => set((state) => ({
    uploadData: { ...state.uploadData, [field]: value }
  })),

  addTag: (tag) => set((state) => {
    if (!state.uploadData.tags.includes(tag)) {
      return {
        uploadData: {
          ...state.uploadData,
          tags: [...state.uploadData.tags, tag]
        }
      }
    }
    return state
  }),

  removeTag: (tag) => set((state) => ({
    uploadData: {
      ...state.uploadData,
      tags: state.uploadData.tags.filter(t => t !== tag)
    }
  })),

  setTags: (tags) => set((state) => ({
    uploadData: { ...state.uploadData, tags }
  })),

  setFile: (file) => set({ 
    file, 
    uploadError: null 
  }),

  uploadToFirebase: async (userId) => {
    const { file, uploadData } = get()
    
    if (!storage) {
      const msg = 'Firebase Storage is not configured'
      set({ uploadError: msg })
      return { success: false, error: msg }
    }
    
    if (!file) {
      const msg = 'No file selected'
      set({ uploadError: msg })
      return { success: false, error: msg }
    }

    if (!userId) {
      const msg = 'User not authenticated'
      set({ uploadError: msg })
      return { success: false, error: msg }
    }

    // Check daily upload limit
    try {
      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const dailyLimit = userData.dailyUploadLimit || 10
        const uploads = userData.uploads || []
        
        // Calculate uploads today
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const uploadsToday = uploads.filter(materialId => {
          // We'll need to check the material's upload date
          return true // Simplified for now, will check in materials collection if needed
        }).length

        if (uploadsToday >= dailyLimit) {
          const msg = `Daily upload limit reached (${dailyLimit}). Try again tomorrow.`
          set({ uploadError: msg })
          return { success: false, error: msg }
        }
      }
    } catch (error) {
      console.error('Error checking daily limit:', error)
    }

    set({ isUploading: true, uploadError: null, uploadProgress: 0 })

    try {
      // Sanitize filename
      const ext = file.name.includes('.') ? file.name.split('.').pop() : ''
      const base = file.name.replace(/\.[^/.]+$/, '').replace(/[^\w\- ]+/g, '_').slice(0, 80)
      const niceName = ext ? `${base}.${ext}` : base || `file_${Date.now()}`

      // Create storage path with university name
      const universityName = uploadData.faculty || 'general'
      const sanitizedUniversity = universityName.toLowerCase().replace(/[^\w\- ]+/g, '_')
      const storagePath = `materials/${sanitizedUniversity}/${Date.now()}_${niceName}`

      // Upload file to Storage
      const fileRef = ref(storage, storagePath)
      const metadata = {
        contentType: file.type || (ext ? `application/${ext}` : undefined),
        customMetadata: {
          courseCode: uploadData.courseCode || '',
          department: uploadData.department || '',
          level: uploadData.level || '',
          uploadedBy: userId,
        },
      }

      const uploadTask = uploadBytesResumable(fileRef, file, metadata)

      const fileUrl = await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            set({ uploadProgress: progress })
          },
          reject,
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
              resolve(downloadUrl)
            } catch (error) {
              reject(error)
            }
          }
        )
      })

      // Create Firestore document
      const materialData = {
        courseCode: uploadData.courseCode,
        type: uploadData.type,
        description: uploadData.description,
        tags: uploadData.tags,
        department: uploadData.department,
        faculty: uploadData.faculty || '',
        level: uploadData.level,
        fileUrl,
        filePath: storagePath,
        thumbnailUrl: '', // Will be updated after thumbnail generation
        uploadedBy: userId,
        likes: 0,
        price: uploadData.price || 0,
        isApproved: false,
        metadata: {
          fileName: niceName,
          fileSize: file.size,
          fileType: file.type || (ext ? `application/${ext}` : 'unknown'),
          uploadedAt: new Date().toISOString(),
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(collection(db, 'materials'), materialData)

      // Generate and upload thumbnail for PDF files
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        try {
          const thumbnailResult = await generateAndUploadPdfThumbnail(file, docRef.id)
          
          if (thumbnailResult.success && thumbnailResult.thumbnailUrl) {
            // Update the material document with thumbnail URL
            await updateDoc(doc(db, 'materials', docRef.id), {
              thumbnailUrl: thumbnailResult.thumbnailUrl
            })
          }
        } catch (thumbnailError) {
          console.error('Error generating thumbnail:', thumbnailError)
          // Continue anyway - thumbnail is optional
        }
      }

      // Add material ID to user's uploads array
      try {
        const userDocRef = doc(db, 'users', userId)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const currentUploads = userDoc.data().uploads || []
          await updateDoc(userDocRef, {
            uploads: [...currentUploads, docRef.id]
          })
        } else {
          await setDoc(userDocRef, {
            uploads: [docRef.id],
            savedMaterials: [],
            dailyUploadLimit: 10,
            createdAt: serverTimestamp()
          })
        }
      } catch (userError) {
        console.error('Error updating user uploads:', userError)
      }

      set({ isUploading: false, uploadProgress: 100 })
      return { success: true, documentId: docRef.id, fileUrl }

    } catch (error) {
      let errorMessage = error?.message || 'Upload failed.'
      
      if (error?.code === 'storage/unauthorized') {
        errorMessage = 'Storage access denied. Check Firebase Storage rules.'
      } else if (error?.code === 'storage/canceled') {
        errorMessage = 'Upload was cancelled.'
      } else if (error?.code === 'storage/unknown') {
        errorMessage = 'Unknown error. Check Firebase Storage configuration.'
      }
      
      set({ 
        isUploading: false, 
        uploadError: errorMessage,
        uploadProgress: 0
      })
      return { success: false, error: errorMessage }
    }
  },

  resetAll: () => set({
    uploadData: {
      courseCode: '',
      type: '',
      description: '',
      tags: [],
      department: '',
      faculty: '',
      level: '',
      price: 0,
    },
    file: null,
    uploadProgress: 0,
    isUploading: false,
    uploadError: null
  })
}))

export { useUploadStore }
