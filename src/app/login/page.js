'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthLayout from '@/components/authLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, Lock, Eye, EyeOff, Chrome } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast, { Toaster } from 'react-hot-toast'
import { withPublic } from '@/components/hoc/withAuth'

function LoginPage() {
    const router = useRouter()
    const { loginWithEmailPassword, loginWithGoogle } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
        if (error) setError('')
    }

    const handleEmailLogin = async (e) => {
        e.preventDefault()
        
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields')
            setError('Please fill in all fields')
            return
        }
        
        setError('')
        setLoading(true)
        
        const loadingToast = toast.loading('Signing in...')
        
        try {
            const result = await loginWithEmailPassword(formData.email, formData.password)
            toast.dismiss(loadingToast)
            
            if (result.success) {
                toast.success('Login successful!')
                router.push('/dashboard')
            } else {
                toast.error(result.error)
                setError(result.error)
            }
        } catch (err) {
            toast.dismiss(loadingToast)
            toast.error('Authentication failed. Please try again.')
            setError('Authentication failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setError('')
        setLoading(true)
        
        const loadingToast = toast.loading('Signing in with Google...')
        
        try {
            const result = await loginWithGoogle()
            toast.dismiss(loadingToast)
            
            if (result.success) {
                toast.success('Login successful!')
                router.push('/dashboard')
            } else {
                toast.error(result.error)
                setError(result.error)
            }
        } catch (err) {
            toast.dismiss(loadingToast)
            
            if (err.code === 'auth/popup-closed-by-user') {
                toast.error('Sign-in cancelled')
                setError('Sign-in cancelled')
            } else if (err.code === 'auth/popup-blocked') {
                toast.error('Popup blocked. Please allow popups and try again.')
                setError('Popup blocked')
            } else {
                toast.error('Google login failed. Please try again.')
                setError('Google login failed. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const InputField = ({ id, type, icon: Icon, placeholder, showToggle }) => (
        <div className="mb-5">
            <Label htmlFor={id} className="mb-2 block text-[14px] font-medium text-black">
                {id.charAt(0).toUpperCase() + id.slice(1)}
            </Label>
            <div className="relative">
                <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
                <Input
                    id={id}
                    type={showToggle && showPassword ? "text" : type}
                    placeholder={placeholder}
                    value={formData[id]}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-[52px] rounded-lg border-gray-300 bg-white pl-12 pr-12 text-black placeholder:text-[#899cc9]"
                />
                {showToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-[#425583]"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                )}
            </div>
        </div>
    )

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
            <div className="flex w-full min-h-full items-center justify-center px-8 py-12">
                <div className="w-full max-w-[440px]">
                    <div className="mb-8">
                        <h2 className="mb-2 text-[40px] font-bold text-black">Welcome Back</h2>
                        <p className="text-[16px] text-gray-500">Sign in to your account</p>
                    </div>

                    <InputField id="email" type="email" icon={Mail} placeholder="domat@example.com" />
                    <InputField id="password" type="password" icon={Lock} placeholder="Enter your password" showToggle />

                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                checked={rememberMe}
                                onCheckedChange={setRememberMe}
                                className="border-[#4045ef] data-[state=checked]:bg-[#4045ef]"
                            />
                            <Label className="cursor-pointer text-[14px] font-medium text-[#2e3139]">
                                Remember me
                            </Label>
                        </div>
                        <a href="#" className="text-[14px] font-medium text-[#4045ef] hover:underline">
                            Forgot Password
                        </a>
                    </div>

                    {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                    <Button 
                        onClick={handleEmailLogin}
                        disabled={loading || !formData.email || !formData.password}
                        className="mb-4 h-[52px] w-full rounded-full bg-[#4045ef] text-[16px] font-semibold text-white hover:bg-[#3339d6] disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </Button>

                    <div className="mb-4 flex items-center">
                        <div className="h-px flex-1 bg-[#d3e0fe]" />
                        <span className="px-4 text-[14px] text-[#899cc9]">or</span>
                        <div className="h-px flex-1 bg-[#d3e0fe]" />
                    </div>

                    <Button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        variant="outline"
                        className="mb-6 h-[52px] w-full rounded-full border-[#4045ef] text-[16px] font-medium text-[#4045ef] hover:bg-[#f5f5f5] disabled:opacity-50"
                    >
                        <Chrome className="mr-2 h-5 w-5" />
                        Sign in with Google
                    </Button>

                    <p className="text-center text-[14px] text-[#899cc9]">
                        Don&apos;t have an account? <a href="/register" className="font-medium text-[#4045ef] hover:underline">Sign up</a>
                    </p>
                </div>
            </div>
        </AuthLayout>
    )
}

export default withPublic(LoginPage)
