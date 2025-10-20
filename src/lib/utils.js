import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Default fallback image for documents
export const DEFAULT_DOCUMENT_THUMBNAIL = '/TB.jpeg'

// Generate thumbnail from PDF file
export async function generatePdfThumbnail(file) {
  if (typeof window === 'undefined') return null
  
  try {
    // Dynamically import pdfjs-dist to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist')
    
    // Set worker path
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    
    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer()
    
    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    // Get first page
    const page = await pdf.getPage(1)
    
    // Set canvas dimensions for thumbnail (adjust scale for quality vs file size)
    const scale = 1.5
    const viewport = page.getViewport({ scale })
    
    // Create canvas
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = viewport.width
    canvas.height = viewport.height
    
    // Render PDF page to canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise
    
    // Convert canvas to blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.85)
    })
    
    return blob
  } catch (error) {
    console.error('Error generating PDF thumbnail:', error)
    return null
  }
}

// Upload thumbnail to Firebase Storage
export async function uploadThumbnail(thumbnailBlob, materialId) {
  if (!thumbnailBlob) return null
  
  try {
    const thumbnailRef = ref(storage, `thumbnails/${materialId}.jpg`)
    await uploadBytes(thumbnailRef, thumbnailBlob)
    const thumbnailUrl = await getDownloadURL(thumbnailRef)
    return thumbnailUrl
  } catch (error) {
    console.error('Error uploading thumbnail:', error)
    return null
  }
}

// Generate and upload PDF thumbnail (combines both functions)
export async function generateAndUploadPdfThumbnail(file, materialId) {
  try {
    // Generate thumbnail from PDF
    const thumbnailBlob = await generatePdfThumbnail(file)
    
    if (!thumbnailBlob) {
      return { success: false, thumbnailUrl: null }
    }
    
    // Upload thumbnail to Firebase
    const thumbnailUrl = await uploadThumbnail(thumbnailBlob, materialId)
    
    if (!thumbnailUrl) {
      return { success: false, thumbnailUrl: null }
    }
    
    return { success: true, thumbnailUrl }
  } catch (error) {
    console.error('Error in thumbnail generation pipeline:', error)
    return { success: false, thumbnailUrl: null }
  }
}

// Get thumbnail URL with fallback
export function getThumbnailUrl(material) {
  return material?.thumbnailUrl || DEFAULT_DOCUMENT_THUMBNAIL
}

// Local Storage utilities for library data caching
const STORAGE_KEYS = {
  SAVED_MATERIALS: 'qitt_saved_materials_',
  USER_UPLOADS: 'qitt_user_uploads_',
  UPLOADS_TODAY: 'qitt_uploads_today_',
  DAILY_LIMIT: 'qitt_daily_limit_',
}

// Get cached library data from localStorage
export function getCachedLibraryData(userId, dataType) {
  if (typeof window === 'undefined' || !userId) return null
  
  try {
    const key = STORAGE_KEYS[dataType] + userId
    const cached = localStorage.getItem(key)
    
    if (!cached) return null
    
    const parsed = JSON.parse(cached)
    
    // Check if cache is still valid (less than 5 minutes old)
    const cacheAge = Date.now() - parsed.timestamp
    const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
    
    if (cacheAge > CACHE_DURATION) {
      localStorage.removeItem(key)
      return null
    }
    
    return parsed.data
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

// Save library data to localStorage
export function setCachedLibraryData(userId, dataType, data) {
  if (typeof window === 'undefined' || !userId) return
  
  try {
    const key = STORAGE_KEYS[dataType] + userId
    const cacheObject = {
      data,
      timestamp: Date.now()
    }
    
    localStorage.setItem(key, JSON.stringify(cacheObject))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

// Clear specific user's library cache
export function clearLibraryCache(userId) {
  if (typeof window === 'undefined' || !userId) return
  
  try {
    Object.values(STORAGE_KEYS).forEach(keyPrefix => {
      localStorage.removeItem(keyPrefix + userId)
    })
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

// Save simple value to localStorage
export function setCachedValue(userId, key, value) {
  if (typeof window === 'undefined' || !userId) return
  
  try {
    localStorage.setItem(key + userId, JSON.stringify(value))
  } catch (error) {
    console.error('Error writing value to localStorage:', error)
  }
}

// Get simple value from localStorage
export function getCachedValue(userId, key) {
  if (typeof window === 'undefined' || !userId) return null
  
  try {
    const cached = localStorage.getItem(key + userId)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.error('Error reading value from localStorage:', error)
    return null
  }
}
