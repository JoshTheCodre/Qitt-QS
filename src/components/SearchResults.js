import { BookOpen, FileText, Hash, Crown, Search as SearchIcon } from "lucide-react"
import Image from "next/image"
import { useSearchStore } from "@/store/searchStore"
import { useRouter } from "next/navigation"

const formatColors = {
  PDF: { border: "#ff1500", bg: "#ff1500" },
  DOCX: { border: "#2b579a", bg: "#2b579a" },
  EXCEL: { border: "#217346", bg: "#217346" },
  PPT: { border: "#d24726", bg: "#d24726" },
}

export default function SearchResults() {
  const router = useRouter()
  const { searchResults, loading, error, searchQuery } = useSearchStore()

  const handleMaterialClick = (materialId) => {
    router.push(`/material/${materialId}`)
  }

  // Get file format from metadata
  const getFormat = (material) => {
    if (material?.metadata?.fileType) {
      const type = material.metadata.fileType.toLowerCase()
      if (type.includes('pdf')) return 'PDF'
      if (type.includes('word') || type.includes('docx')) return 'DOCX'
      if (type.includes('excel') || type.includes('sheet')) return 'EXCEL'
      if (type.includes('powerpoint') || type.includes('ppt')) return 'PPT'
    }
    return 'PDF'
  }

  if (loading) {
    return (
      <div className="mt-3 space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-3 p-3 bg-white border border-[#e6e6e6] rounded-lg">
              <div className="w-20 h-24 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-3 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-600 font-medium">Error loading materials</p>
        <p className="text-sm text-red-500 mt-1">{error}</p>
      </div>
    )
  }

  // Show empty state only when no search has been performed
  if (!searchQuery || searchQuery.trim() === '') {
    return (
      <div className="mt-8 p-12 text-center">
        <div className="max-w-md mx-auto">
          <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Start Exploring</h3>
          <p className="text-gray-600">
            Search for course codes, topics, or keywords to discover study materials
          </p>
        </div>
      </div>
    )
  }

  // Show no results when search has been performed but nothing found
  if (searchResults.length === 0) {
    return (
      <div className="mt-3 p-8 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">No materials found for "{searchQuery}"</p>
        <p className="text-sm text-gray-500 mt-1">Try a different search term or check your spelling</p>
      </div>
    )
  }

  return (
    <div className="mt-3 space-y-2.5">
      {searchResults.map((result) => {
        const format = getFormat(result)
        const colors = formatColors[format] || formatColors.PDF
        const isPremium = result?.price > 0 || result?.isPremium
        const isApproved = result?.isApproved === true
        
        return (
          <div
            key={result.id}
            onClick={() => handleMaterialClick(result.id)}
            className="flex gap-3 p-3 bg-white border border-[#e6e6e6] rounded-lg hover:shadow-md transition-shadow cursor-pointer relative"
          >
            {/* Approval Status Badge */}
            {!isApproved && (
              <div className="absolute top-2 right-2 z-10">
                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-semibold">
                  Pending Review
                </span>
              </div>
            )}

            <div className="flex-shrink-0 relative">
              <div 
                className="w-20 h-24 border-2 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative"
                style={{ borderColor: colors.border }}
              >
                <div 
                  className="absolute top-1 left-1 text-white px-1.5 py-0.5 rounded text-[10px] font-bold z-10"
                  style={{ backgroundColor: colors.bg }}
                >
                  {format}
                </div>
                <Image
                  src="/TB.jpeg"
                  alt={result.courseCode || result.title || 'Material'}
                  width={80}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-evenly min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-[#000000] mb-0.5 leading-tight truncate">
                    {result.courseCode || result.title || 'Untitled'}
                  </h2>
                  <p className="text-xs text-[#6b7588] line-clamp-2">{result.description || 'No description'}</p>
                </div>
                {isPremium && (
                  <Crown className="w-5 h-5 text-[#fbc205] flex-shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-3 text-[#6b7588] flex-wrap">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{result.type || 'Document'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{result.likes || 0} Likes</span>
                </div>
                {result.courseCode && (
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{result.courseCode}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
