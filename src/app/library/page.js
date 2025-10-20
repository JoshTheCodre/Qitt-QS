'use client'

import { useState, useEffect } from 'react'
import { withAuth } from '@/components/hoc/withAuth'
import { Sidebar } from '@/components/Sidebar'
import { SimpleHeader } from '@/components/SimpleHeader'
import { Button } from '@/components/ui/button'
import { MotivationBanner } from '@/components/MotivationBanner'
import { ContentCard } from '@/components/ContentCard'
import SavedMaterialCard from '@/components/SavedMaterialCard'
import { useLibraryStore } from '@/store/libraryStore'
import { useAuthStore } from '@/store/authStore'

function LibraryPage() {
  const [activeTab, setActiveTab] = useState('My Library')
  const user = useAuthStore(state => state.user)
  
  const {
    savedMaterials,
    userUploads,
    loading,
    fetchSavedMaterials,
    fetchUserUploads,
    removeFromSaved,
    getUploadStats
  } = useLibraryStore()

  useEffect(() => {
    if (user?.uid) {
      fetchSavedMaterials(user.uid)
      fetchUserUploads(user.uid)
    }
  }, [user?.uid, fetchSavedMaterials, fetchUserUploads])

  const handleRemoveMaterial = async (materialId) => {
    if (user?.uid) {
      await removeFromSaved(user.uid, materialId)
    }
  }

  const stats = getUploadStats()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-72 w-full pt-4 pb-24 lg:pb-4 lg:pt-4 lg:px-8 overflow-x-hidden">
        <SimpleHeader 
          title="Library" 
          description="Access your saved materials and uploads" 
        />

        <div className="px-4 lg:px-0 max-w-7xl">
          {/* Tabs */}
          <div className="mb-6">
            <div className="flex gap-2 border-b border-gray-200">
              {['My Library', 'My Uploads'].map((tab) => (
                <Button 
                  key={tab}
                  variant="ghost"
                  className={activeTab === tab ? 'border-b-2 border-brand rounded-none text-sm' : 'rounded-none text-sm'}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'My Library' && (
            <div className="space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-3 p-3 bg-white border border-[#e6e6e6] rounded-lg">
                      <div className="w-20 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : savedMaterials.length > 0 ? (
                savedMaterials.map((material) => (
                  <SavedMaterialCard
                    key={material.id}
                    material={material}
                    onRemove={handleRemoveMaterial}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No saved materials yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'My Uploads' && (
            <div className="space-y-6">
              <MotivationBanner 
                totalUploads={stats.totalUploads}
                totalLikes={stats.totalLikes}
              />

              {loading ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-12 h-12 border-4 border-[#0a32f8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Loading uploads...</p>
                </div>
              ) : userUploads.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {userUploads.map((item) => (
                    <ContentCard 
                      key={item.id} 
                      title={item.courseCode || item.title || 'Untitled'}
                      description={item.description}
                      date={new Date(item.metadata?.uploadedAt || item.createdAt?.toDate()).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                      likes={item.likes || 0}
                      status={item.isApproved ? 'Approved' : 'Pending'}
                      isFeatured={item.likes >= 100}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No uploads yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default withAuth(LibraryPage)
