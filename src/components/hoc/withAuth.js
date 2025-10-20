'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

/**
 * Higher-Order Component (HOC) to protect routes that require authentication
 * Redirects to /login if user is not authenticated
 */
export function withAuth(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter()
    const { user, loading, initAuth } = useAuthStore()

    useEffect(() => {
      const unsubscribe = initAuth()
      return () => unsubscribe()
    }, [initAuth])

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login')
      }
    }, [user, loading, router])

    // Don't render anything while checking authentication
    if (loading || !user) {
      return null
    }

    // User is authenticated, render the protected component
    return <Component {...props} />
  }
}

/**
 * Higher-Order Component (HOC) for public routes (login, register)
 * Redirects to /dashboard if user is already authenticated
 */
export function withPublic(Component) {
  return function PublicRoute(props) {
    const router = useRouter()
    const { user, loading, initAuth } = useAuthStore()

    useEffect(() => {
      const unsubscribe = initAuth()
      return () => unsubscribe()
    }, [initAuth])

    useEffect(() => {
      if (!loading && user) {
        router.push('/dashboard')
      }
    }, [user, loading, router])

    // Don't render anything while checking authentication
    if (loading || user) {
      return null
    }

    // User is not authenticated, render the public component
    return <Component {...props} />
  }
}
