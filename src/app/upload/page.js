'use client'

import { useEffect } from 'react'
import { withAuth } from '@/components/hoc/withAuth'
import { Sidebar } from '@/components/Sidebar'
import { SimpleHeader } from '@/components/SimpleHeader'
import { FileUploadForm } from '@/components/FileUploadForm'
import { useLibraryStore } from '@/store/libraryStore'
import { useAuthStore } from '@/store/authStore'
import { AlertCircle } from 'lucide-react'

function UploadPage() {
  const { user } = useAuthStore()
  const { canUploadToday, getRemainingUploads, fetchUserUploads, uploadsToday, dailyUploadLimit } = useLibraryStore()

  useEffect(() => {
    if (user?.uid) {
      fetchUserUploads(user.uid)
    }
  }, [user?.uid, fetchUserUploads])

  const remainingUploads = getRemainingUploads()
  const canUpload = canUploadToday()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-72 w-full pt-4 pb-24 lg:pb-4 lg:pt-4 lg:px-8 overflow-x-hidden">
        <SimpleHeader 
          title="Upload" 
          description="Share your study materials with the community" 
        />
        
        <div className="px-4 lg:px-0">
          {/* Daily Upload Limit Banner */}
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border-2 ${
            canUpload 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${
                canUpload ? 'text-blue-600' : 'text-red-600'
              }`} />
              <div>
                <h3 className={`text-sm sm:text-base font-semibold ${
                  canUpload ? 'text-blue-900' : 'text-red-900'
                }`}>
                  Daily Upload Limit
                </h3>
                <p className={`text-xs sm:text-sm mt-1 ${
                  canUpload ? 'text-blue-700' : 'text-red-700'
                }`}>
                  {canUpload 
                    ? `You have ${remainingUploads} upload${remainingUploads !== 1 ? 's' : ''} remaining today (${uploadsToday}/${dailyUploadLimit} used)`
                    : `You&apos;ve reached your daily upload limit of ${dailyUploadLimit}. Please try again tomorrow.`
                  }
                </p>
              </div>
            </div>
          </div>

          {canUpload ? (
            <FileUploadForm />
          ) : (
            <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-6xl mb-4">📤</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Limit Reached</h3>
              <p className="text-gray-600">
                You&apos;ve uploaded {dailyUploadLimit} materials today. Come back tomorrow to share more!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default withAuth(UploadPage)
