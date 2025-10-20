"use client"

import { Bell, Crown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/authStore"
import { useLibraryStore } from "@/store/libraryStore"
import { getLabelByValue, departments, levels } from "@/lib/data"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function Header() {
  const { user, userData } = useAuthStore()
  const { userUploads, fetchUserUploads } = useLibraryStore()
  const router = useRouter()

  // Fetch user uploads to check crown eligibility
  useEffect(() => {
    if (user?.uid) {
      fetchUserUploads(user.uid)
    }
  }, [user?.uid, fetchUserUploads])

  // Show crown if user has uploaded more than 10 documents
  const showCrown = userUploads.length > 10

  // Get user's first name or fallback
  const firstName = userData?.fullName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Student'
  
  // Get initials for avatar fallback
  const initials = userData?.fullName
    ? userData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'US'

  // Get department label
  const departmentLabel = userData?.department 
    ? getLabelByValue(departments, userData.department)
    : 'Student'

  // Get level label
  const levelLabel = userData?.level 
    ? getLabelByValue(levels, userData.level)
    : ''

  return (
    <header className="flex items-center justify-between mb-4 md:mb-4 px-4 lg:px-0">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Hello {firstName}</h1>
        {/* Mobile: Show department and level */}
        <p className="md:hidden text-muted-foreground text-xs mt-1">
          {departmentLabel}{levelLabel ? ` • ${levelLabel}` : ''}
        </p>
        {/* Desktop: Show ready to study message */}
        <p className="hidden md:block text-muted-foreground text-base mt-1">Ready to study smarter today?</p>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>
        {/* Desktop user info */}
        <div 
          onClick={() => router.push('/account')}
          className="hidden md:flex items-center gap-3 bg-accent/50 rounded-full pr-4 pl-1 py-2 cursor-pointer hover:bg-accent transition-colors"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL || "/professional-student.jpg"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <div className="font-semibold">{userData?.fullName || user?.displayName || 'User'}</div>
            <div className="text-muted-foreground text-xs">
              {departmentLabel}{levelLabel ? ` • ${levelLabel}` : ''}
            </div>
          </div>
          {showCrown && (
            <div className="bg-yellow-400 rounded-full flex items-center p-1.5 justify-center">
              <Crown size={12} className="text-yellow-900" />
            </div>
          )}
        </div>
        {/* Mobile avatar with badge */}
        <div 
          onClick={() => router.push('/account')}
          className="md:hidden relative cursor-pointer"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.photoURL || "/professional-student.jpg"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {showCrown && (
            <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full flex items-center p-1 justify-center">
              <Crown size={8} className="text-yellow-900" />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
