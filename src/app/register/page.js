"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Building2, Layers, Phone, User, Chrome, Lock, Eye, EyeOff } from "lucide-react"
import AuthLayout from "@/components/authLayout"
import { useAuthStore } from "@/store/authStore"
import toast, { Toaster } from "react-hot-toast"
import { withPublic } from "@/components/hoc/withAuth"
import { universities, departments, levels } from "@/lib/data"
import Departments from "@/lib/data"

function SignUpPage() {
    const router = useRouter()
    const { signUpWithGoogle } = useAuthStore()
    const [agreed, setAgreed] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({ fullName: '', university: '', department: '', level: '', phone: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (error) setError('')
    }

    const handleGoogleSignUp = async (e) => {
        e.preventDefault()
        
        if (Object.values(formData).some(val => !val)) {
            toast.error('Please fill in all fields')
            setError('Please fill in all fields')
            return
        }
        if (!agreed) {
            toast.error('Please agree to the Terms & Conditions')
            setError('Please agree to the Terms & Conditions')
            return
        }

        setError('')
        setLoading(true)

        const loadingToast = toast.loading('Creating your account...')

        try {
            // Import Firebase methods
            const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth')
            const { auth, db } = await import('@/lib/firebase')
            const { doc, getDoc, setDoc } = await import('firebase/firestore')
            
            // Sign in with Google
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user
            
            // Check if user already exists
            const userDocRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userDocRef)
            
            if (userDoc.exists()) {
                toast.dismiss(loadingToast)
                toast.error('This account is already registered. Redirecting to login...')
                setError('This account is already registered')
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
                return
            }
            
            // Create new user document with form data
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                ...formData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            
            toast.dismiss(loadingToast)
            toast.success('Registration successful! Redirecting to login...')
            
            // Sign out the user after registration
            await auth.signOut()
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                router.push('/login')
            }, 2000)
            
        } catch (err) {
            toast.dismiss(loadingToast)
            console.error('Registration error:', err)
            
            if (err.code === 'auth/popup-closed-by-user') {
                toast.error('Sign-up cancelled. Please try again.')
                setError('Sign-up cancelled')
            } else if (err.code === 'auth/popup-blocked') {
                toast.error('Popup blocked. Please allow popups and try again.')
                setError('Popup blocked')
            } else {
                toast.error(err.message || 'Registration failed. Please try again.')
                setError('Registration failed. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout>
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#fff',
                        color: '#1a1a40',
                        fontFamily: 'Atyp Display, sans-serif',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }} 
            />
            <div className="flex items-center justify-center min-h-full bg-white p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Started Now</h2>
                        <p className="text-gray-600">Create your account to continue</p>
                    </div>

                    <form className="space-y-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900">
                                Full Name <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Dominic Mattew"
                                    value={formData.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                    disabled={loading}
                                    className="pl-10 h-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                        </div>

                        {/* University */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900">
                                University <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.university} onValueChange={(val) => handleChange('university', val)} disabled={loading}>
                                <SelectTrigger className="h-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-600 [&>span]:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-gray-300" />
                                        <SelectValue placeholder="Select Your University" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {universities.map((uni) => (
                                        <SelectItem key={uni.value} value={uni.value}>
                                            {uni.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Faculty and Department */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900">
                                Department <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.department} onValueChange={(val) => handleChange('department', val)} disabled={loading}>
                                <SelectTrigger className="h-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-600 [&>span]:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-gray-300" />
                                        <SelectValue placeholder="Select Your Department" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {Object.entries(Departments.Faculties).map(([faculty, depts]) => (
                                        <div key={faculty}>
                                            <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 bg-gray-50">
                                                {faculty}
                                            </div>
                                            {depts.map((dept) => (
                                                <SelectItem key={dept} value={dept}>
                                                    {dept}
                                                </SelectItem>
                                            ))}
                                        </div>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Level and Phone Number in one row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-900">
                                    Level <span className="text-red-500">*</span>
                                </Label>
                                <Select value={formData.level} onValueChange={(val) => handleChange('level', val)} disabled={loading}>
                                    <SelectTrigger className="h-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-600 [&>span]:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-gray-300" />
                                            <SelectValue placeholder="Level" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {levels.map((level) => (
                                            <SelectItem key={level.value} value={level.value}>
                                                {level.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-900">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Phone"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        disabled={loading}
                                        className="pl-10 h-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    disabled={loading}
                                    className="pl-10 pr-12 h-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-8">
                            <Checkbox
                                checked={agreed}
                                onCheckedChange={setAgreed}
                                className="border-2 border-blue-600 data-[state=checked]:bg-blue-600"
                            />
                            <Label className="text-sm text-gray-700 cursor-pointer">
                                I agree to <a href="#" className="text-blue-600 hover:underline">Term & Condition</a>
                            </Label>
                        </div>

                        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                        <Button
                            onClick={handleGoogleSignUp}
                            disabled={loading || !agreed}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : (
                                <>
                                    <Chrome className="w-5 h-5 mr-2" />
                                    Register with Google
                                </>
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-600">
                            Already have an account? <a href="/login" className="text-blue-600 font-semibold hover:underline">Login</a>
                        </p>
                    </form>
                </div>
            </div>
        </AuthLayout>
    )
}

export default withPublic(SignUpPage)
