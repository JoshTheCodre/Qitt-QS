'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { withAuth } from '@/components/hoc/withAuth'
import ViewMaterial from '@/components/ViewMaterial'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

function ViewMaterialPage() {
  const params = useParams()
  const [material, setMaterial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!params.id) return

      try {
        setLoading(true)
        const materialDoc = await getDoc(doc(db, 'materials', params.id))
        
        if (materialDoc.exists()) {
          setMaterial({ id: materialDoc.id, ...materialDoc.data() })
        } else {
          setError('Material not found')
        }
      } catch (err) {
        console.error('Error fetching material:', err)
        setError('Failed to load material')
      } finally {
        setLoading(false)
      }
    }

    fetchMaterial()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0a32f8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading material...</p>
        </div>
      </div>
    )
  }

  if (error || !material) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Material Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The material you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-[#0a32f8] text-white rounded-full font-medium hover:bg-[#0829d1] transition"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return <ViewMaterial material={material} />
}

export default withAuth(ViewMaterialPage)
