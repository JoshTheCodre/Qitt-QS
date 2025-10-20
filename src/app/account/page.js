'use client'

import { withAuth } from '@/components/hoc/withAuth'
import { Sidebar } from '@/components/Sidebar'
import { SimpleHeader } from '@/components/SimpleHeader'
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, LogOut, Settings, Crown, TrendingUp, Eye, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/authStore'
import { useLibraryStore } from '@/store/libraryStore'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { getLabelByValue, departments, levels } from '@/lib/data'
import { useEffect } from 'react'

function AccountPage() {
  const router = useRouter()
  const { user, userData, logout } = useAuthStore()
  const { userUploads, fetchUserUploads } = useLibraryStore()

  // Fetch user uploads to check crown eligibility
  useEffect(() => {
    if (user?.uid) {
      fetchUserUploads(user.uid)
    }
  }, [user?.uid, fetchUserUploads])

  // Show crown if user has uploaded more than 10 documents
  const showCrown = userUploads.length > 10

  const handleLogout = async () => {
    const loadingToast = toast.loading('Logging out...')
    
    try {
      const result = await logout()
      toast.dismiss(loadingToast)
      
      if (result.success) {
        toast.success('Logged out successfully!')
        router.push('/login')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Logout failed. Please try again.')
    }
  }

  const initials = userData?.fullName
    ? userData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'US'

  const departmentLabel = userData?.department 
    ? getLabelByValue(departments, userData.department)
    : 'Not specified'

  const levelLabel = userData?.level 
    ? getLabelByValue(levels, userData.level)
    : 'Not specified'

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-72 w-full pt-4 pb-24 lg:pb-4 lg:pt-4 lg:px-8 overflow-x-hidden">
        <SimpleHeader 
          title="Account" 
          description="Manage your profile and settings" 
        />

        <div className="px-4 lg:px-0 max-w-2xl mx-auto">

          {/* Profile Card */}
          <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.photoURL || "/professional-student.jpg"} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                {showCrown && (
                  <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full flex items-center p-2 justify-center shadow-md">
                    <Crown size={14} className="text-yellow-900" />
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {userData?.fullName || user?.displayName || 'User'}
              </h3>
              {showCrown && (
                <p className="text-sm text-muted-foreground mb-4">Active Contributor</p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="flex justify-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-[#0A32F8]/10 to-[#0A32F8]/5 rounded-full px-4 py-2 border border-[#0A32F8]/20 flex items-center gap-2 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-[#0A32F8]/20 flex items-center justify-center">
                  <Eye className="h-3 w-3 text-[#0A32F8]" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-[#0A32F8] leading-none">250</p>
                  <p className="text-[10px] text-muted-foreground">Views Left</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-white rounded-full px-4 py-2 border border-red-200 flex items-center gap-2 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-3 w-3 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-red-600 leading-none">0</p>
                  <p className="text-[10px] text-muted-foreground">Strikes</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2.5">
              <div className="flex items-center gap-2.5 p-2 bg-white rounded-md shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#0A32F8]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-[#0A32F8]" />
                </div>
                <span className="text-sm text-foreground font-medium truncate">{user?.email || 'Not provided'}</span>
              </div>
              
              <div className="flex items-center gap-2.5 p-2 bg-white rounded-md shadow-sm">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm text-foreground font-medium">{departmentLabel}</span>
              </div>
              
              <div className="flex items-center gap-2.5 p-2 bg-white rounded-md shadow-sm">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm text-foreground font-medium">{levelLabel}</span>
              </div>
              
              <div className="flex items-center gap-2.5 p-2 bg-white rounded-md shadow-sm">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm text-foreground font-medium">{userData?.university || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Settings Options */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
              <TrendingUp className="h-5 w-5 text-[#0A32F8]" />
              <span className="text-foreground font-medium">Become a Seller</span>
            </button>
          </div>

          {/* Logout Button */}
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full text-red-600 border-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </main>
    </div>
  )
}

export default withAuth(AccountPage)
