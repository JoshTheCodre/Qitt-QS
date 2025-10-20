"use client"

import { Home, Search, BookOpen, User, Upload, UploadCloud, Menu, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import toast from "react-hot-toast"

export function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const { logout } = useAuthStore()
    const [isOpen, setIsOpen] = useState(false)

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

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 flex-col z-40 bg-white">
                {/* Logo */}
                <div className="px-6 py-6 flex items-center gap-2">
                    <Image
                        src="/qitt-icon.png"
                        alt="Qitt Logo"
                        width={42}
                        height={42}
                        className="w-24 object-contain"
                    />
                    {/* <span className="text-xl font-bold">Qitt</span> */}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1">
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            pathname === '/dashboard' 
                                ? 'bg-brand/10 text-brand font-medium' 
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                    >
                        <Home className="h-5 w-5" />
                        Home
                    </Link>
                    <Link
                        href="/explore"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            pathname === '/explore' 
                                ? 'bg-brand/10 text-brand font-medium' 
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                    >
                        <Search className="h-5 w-5" />
                        Explore
                    </Link>
                    <Link
                        href="/library"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            pathname === '/library' 
                                ? 'bg-brand/10 text-brand font-medium' 
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                    >
                        <BookOpen className="h-5 w-5" />
                        Library
                    </Link>
                    <Link
                        href="/account"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            pathname === '/account' 
                                ? 'bg-brand/10 text-brand font-medium' 
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                    >
                        <User className="h-5 w-5" />
                        Account
                    </Link>

                    {/* Upload Button */}
                    <div className="w-full rounded bg-gray-100  border my-2 border-gray-200"></div>
                    <Link href="/upload">
                        <Button className="w-full justify-start h-14 hover:bg-blue-500 text-md gap-3 text-gray-900 bg-white">
                            <div className="w-8 h-8 bg-brand text-brand-foreground rounded-full flex items-center p-1 justify-center">
                                <Upload className="h-5 w-5" />
                            </div>
                            Upload
                        </Button>
                    </Link>
                </nav>



                {/* Log Out */}
                <div className="px-4 py-4 border-t border-sidebar-border">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 transition-colors w-full"
                    >
                        <LogOut className="h-5 w-5" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border z-40">
                <div className="flex items-end justify-around px-2 py-2 relative">
                    <Link
                        href="/dashboard"
                        className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                            pathname === '/dashboard' ? 'text-brand' : 'text-muted-foreground'
                        }`}
                    >
                        <Home className="h-5 w-5" />
                        <span className={`text-xs ${pathname === '/dashboard' ? 'font-medium' : ''}`}>Home</span>
                    </Link>
                    <Link
                        href="/explore"
                        className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                            pathname === '/explore' ? 'text-brand' : 'text-muted-foreground'
                        }`}
                    >
                        <Search className="h-5 w-5" />
                        <span className={`text-xs ${pathname === '/explore' ? 'font-medium' : ''}`}>Explore</span>
                    </Link>
                    
                    {/* Upload Button - Elevated in middle */}
                    <Link
                        href="/upload"
                        className="flex flex-col items-center relative -top-4"
                    >
                        <div className="bg-brand rounded-full p-3 shadow-lg">
                            <UploadCloud className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-brand mt-0.5">Upload</span>
                    </Link>
                    
                    <Link
                        href="/library"
                        className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                            pathname === '/library' ? 'text-brand' : 'text-muted-foreground'
                        }`}
                    >
                        <BookOpen className="h-5 w-5" />
                        <span className={`text-xs ${pathname === '/library' ? 'font-medium' : ''}`}>Library</span>
                    </Link>
                    <Link
                        href="/account"
                        className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                            pathname === '/account' ? 'text-brand' : 'text-muted-foreground'
                        }`}
                    >
                        <User className="h-5 w-5" />
                        <span className={`text-xs ${pathname === '/account' ? 'font-medium' : ''}`}>Account</span>
                    </Link>
                </div>
            </nav>
        </>
    )
}
