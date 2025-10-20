"use client"

import { useEffect, useState } from "react"
import { SuggestedMaterialCard } from "./CourseCard"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Sparkles } from "lucide-react"

export function SuggestedMaterials({ 
  title = "Suggested Materials",
  maxItems = 3,
}) {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSuggestedMaterials = async () => {
      try {
        setLoading(true)
        // Fetch most liked/approved materials
        const materialsRef = collection(db, 'materials')
        const q = query(
          materialsRef,
          orderBy('likes', 'desc'),
          limit(maxItems)
        )
        
        const snapshot = await getDocs(q)
        const fetchedMaterials = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setMaterials(fetchedMaterials)
      } catch (error) {
        console.error('Error fetching suggested materials:', error)
        setMaterials([])
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestedMaterials()
  }, [maxItems])

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

  if (!materials || materials.length === 0) {
    return (
      <section className="mb-6 md:mb-8 px-4 lg:px-0">
        <h2 className="font-medium mb-3 md:mb-4" style={{ fontSize: '16px', fontWeight: 500, color: '#6B7588' }}>{title}</h2>
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
          <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-gray-500">
            No materials available yet
          </p>
        </div>
      </section>
    )
  }

  const displayedMaterials = materials.slice(0, maxItems)

  return (
    <section className="mb-6 md:mb-8 px-4 lg:px-0">
      <h2 className="font-medium mb-3 md:mb-4 lg:px-0" style={{ fontSize: '16px', fontWeight: 500, color: '#6B7588' }}>{title}</h2>
      {/* Horizontal row layout */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {displayedMaterials.map((material) => (
          <div key={material.id} className="flex-shrink-0 w-2/3 sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)]">
            <SuggestedMaterialCard
              key={material.id}
              code={material.courseCode || material.code}
              title={material.title || material.description}
              subtitle={material.department || material.subtitle}
              isPremium={material.price > 0 || material.isPremium}
              fileType={material.metadata?.fileType || material.fileType || 'PDF'}
              material={material}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
