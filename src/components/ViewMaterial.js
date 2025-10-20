'use client';

import { useEffect, useState } from "react";
import { ChevronLeft, Share2, Heart, FileText, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLibraryStore } from "@/store/libraryStore";
import { useAuthStore } from "@/store/authStore";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ViewMaterial({ material }) {
  const router = useRouter()
  const { user } = useAuthStore()
  const { savedMaterials, addToSaved, removeFromSaved } = useLibraryStore()
  
  const [likes, setLikes] = useState(material?.likes || 0)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savingInProgress, setSavingInProgress] = useState(false)
  
  const fileUrl = material?.fileUrl || null
  const [frameLoaded, setFrameLoaded] = useState(false)
  const [frameError, setFrameError] = useState(false)

  // Check if material is already saved
  useEffect(() => {
    if (material?.id && savedMaterials) {
      const isSaved = savedMaterials.some(m => m.id === material.id)
      setSaved(isSaved)
    }
  }, [material?.id, savedMaterials])

  // Initialize likes from material
  useEffect(() => {
    if (material?.likes !== undefined) {
      setLikes(material.likes)
    }
  }, [material?.likes])

  // Save to recent materials (Continue Reading)
  useEffect(() => {
    if (material?.id && user?.uid) {
      const saveToRecent = () => {
        try {
          const storageKey = `recentMaterials_${user.uid}`
          const stored = localStorage.getItem(storageKey)
          let recentMaterials = stored ? JSON.parse(stored) : []
          
          // Remove if already exists
          recentMaterials = recentMaterials.filter(m => m.id !== material.id)
          
          // Add to front with timestamp
          recentMaterials.unshift({
            id: material.id,
            courseCode: material.courseCode,
            title: material.title,
            description: material.description,
            department: material.department,
            timestamp: Date.now()
          })
          
          // Keep only last 10
          recentMaterials = recentMaterials.slice(0, 10)
          
          localStorage.setItem(storageKey, JSON.stringify(recentMaterials))
        } catch (error) {
          console.error('Error saving to recent materials:', error)
        }
      }
      
      saveToRecent()
    }
  }, [material?.id, user?.uid, material?.courseCode, material?.title, material?.description, material?.department])

  useEffect(() => {
    setFrameLoaded(false)
    setFrameError(false)
  }, [fileUrl])

  const handleLike = async () => {
    if (!material?.id || !user?.uid) return

    try {
      const materialRef = doc(db, 'materials', material.id)
      
      if (liked) {
        // Unlike
        await updateDoc(materialRef, {
          likes: increment(-1)
        })
        setLikes(prev => Math.max(0, prev - 1))
        setLiked(false)
      } else {
        // Like
        await updateDoc(materialRef, {
          likes: increment(1)
        })
        setLikes(prev => prev + 1)
        setLiked(true)
      }
    } catch (error) {
      console.error('Error updating likes:', error)
      // Revert on error
      setLiked(!liked)
    }
  }

  const handleSave = async () => {
    if (!material?.id || !user?.uid || savingInProgress) return

    setSavingInProgress(true)
    try {
      if (saved) {
        // Remove from saved
        const result = await removeFromSaved(user.uid, material.id)
        if (result.success) {
          setSaved(false)
        }
      } else {
        // Add to saved
        const result = await addToSaved(user.uid, material.id)
        if (result.success) {
          setSaved(true)
        }
      }
    } catch (error) {
      console.error('Error toggling save:', error)
    } finally {
      setSavingInProgress(false)
    }
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: material?.courseCode || 'Study Material',
        text: material?.description || '',
        url: window.location.href,
      })
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-white flex justify-center">
      {/* Container with 3/5 width on desktop */}
      <div className="w-full lg:w-3/5 flex flex-col bg-white">
        {/* Cute White Header */}
        <div className="bg-white px-3 sm:px-4 py-3 sm:py-4 flex-shrink-0 border-b-2 border-gray-200">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Back button + Title & Info */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button 
                onClick={() => router.back()}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition text-gray-700 flex-shrink-0"
                title="Go back"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate mb-1">
                  {material?.courseCode || 'Study Material'}
                </h1>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
                  {material?.type && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>{material.type}</span>
                    </span>
                  )}
                  {material?.type && material?.department && <span className="text-gray-400">•</span>}
                  {material?.department && (
                    <span className="truncate">{material.department}</span>
                  )}
                  {material?.metadata?.uploadedAt && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{formatDate(material.metadata.uploadedAt)}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right: Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleSave}
                disabled={savingInProgress}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium ${
                  saved
                    ? 'bg-[#0a32f8] text-white hover:bg-[#0829d1]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${savingInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={saved ? "Remove from library" : "Save to library"}
              >
                <Heart className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
                <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
              </button>
              <button
                onClick={handleLike}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium ${
                  liked
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Like this material"
              >
                <span className="text-base">👍</span>
                <span>{likes}</span>
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 sm:p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden bg-white">
          {!fileUrl ? (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Document Available</h3>
                <p className="text-gray-600">The document file is not available for viewing.</p>
              </div>
            </div>
          ) : (
            <div className="relative h-full">
              {!frameLoaded && !frameError && (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                  <div className="w-16 h-16 border-4 border-[#0a32f8] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {frameError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-white">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-bold text-red-600 mb-2">Error Loading PDF</h3>
                  <p className="text-sm text-red-500 mb-4">The document could not be embedded. You can try opening it in a new tab.</p>
                  <button
                    onClick={() => fileUrl && window.open(fileUrl, '_blank')}
                    className="px-4 py-2 bg-[#0a32f8] text-white rounded-lg hover:bg-[#0829d1] transition"
                  >
                    Open PDF in New Tab
                  </button>
                </div>
              ) : (
                <iframe
                  key={fileUrl}
                  src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                  className="w-full h-full border-0"
                  title="Material PDF"
                  onLoad={() => setFrameLoaded(true)}
                  onError={() => setFrameError(true)}
                  allowFullScreen
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
