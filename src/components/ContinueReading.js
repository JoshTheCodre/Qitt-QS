"use client"

import { useEffect, useState } from "react"
import { ContinueReadingCard } from "./CourseCard"
import { useAuthStore } from "@/store/authStore"
import { BookOpen, Trash2 } from "lucide-react"

export function ContinueReading({ 
  title = "Continue Reading"
}) {
  const { user } = useAuthStore()
  const [recentMaterials, setRecentMaterials] = useState([])
  const [loading, setLoading] = useState(true)

  const loadRecentMaterials = () => {
    try {
      setLoading(true)
      const storageKey = user?.uid ? `recentMaterials_${user.uid}` : 'recentMaterials'
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const materials = JSON.parse(stored)
        // Show only the 3 most recent
        setRecentMaterials(materials.slice(0, 3))
      } else {
        setRecentMaterials([])
      }
    } catch (error) {
      console.error('Error loading recent materials:', error)
      setRecentMaterials([])
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    try {
      const storageKey = user?.uid ? `recentMaterials_${user.uid}` : 'recentMaterials'
      localStorage.removeItem(storageKey)
      setRecentMaterials([])
    } catch (error) {
      console.error('Error clearing history:', error)
    }
  }

  useEffect(() => {
    loadRecentMaterials()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid])

  if (loading) {
    return (
      <section className="mb-6 md:mb-8 px-4 lg:px-0">
        <h2 className="font-medium mb-3 md:mb-4" style={{ fontSize: '16px', fontWeight: 500, color: '#6B7588' }}>{title}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!recentMaterials || recentMaterials.length === 0) {
    return (
      <section className="mb-6 md:mb-8 px-4 lg:px-0">
        <h2 className="font-medium mb-3 md:mb-4" style={{ fontSize: '16px', fontWeight: 500, color: '#6B7588' }}>{title}</h2>
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-gray-500">
            No recent reads yet
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-6 md:mb-8 px-4 lg:px-0">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className="font-medium" style={{ fontSize: '16px', fontWeight: 500, color: '#6B7588' }}>{title}</h2>
        {recentMaterials.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>
      {/* Horizontal row layout */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {recentMaterials.map((material) => (
          <div key={material.id} className="flex-shrink-0 w-4/5 lg:w-2/3  sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)]">
            <ContinueReadingCard
              id={material.id}
              code={material.courseCode || material.code}
              title={material.title || material.description}
              subtitle={material.department || material.subtitle}
              timestamp={material.timestamp}
              material={material}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
