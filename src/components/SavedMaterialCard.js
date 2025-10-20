import { BookOpen, FileText, Hash, Crown, Minus } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { getThumbnailUrl } from "@/lib/utils"

const formatColors = {
  PDF: { border: "#ff1500", bg: "#ff1500" },
  DOCX: { border: "#2b579a", bg: "#2b579a" },
  EXCEL: { border: "#217346", bg: "#217346" },
}

export default function SavedMaterialCard({ material, onRemove }) {
  const router = useRouter()
  const [isRemoving, setIsRemoving] = useState(false)
  
  // Get file format from metadata or fileType
  const getFormat = () => {
    if (material.metadata?.fileType) {
      const type = material.metadata.fileType.toLowerCase()
      if (type.includes('pdf')) return 'PDF'
      if (type.includes('word') || type.includes('docx')) return 'DOCX'
      if (type.includes('excel') || type.includes('sheet')) return 'EXCEL'
    }
    return 'PDF' // default
  }
  
  const format = getFormat()
  const colors = formatColors[format]
  const thumbnailUrl = getThumbnailUrl(material)

  const handleRemove = () => {
    setIsRemoving(true)
    // Call the onRemove callback after a short delay for animation
    setTimeout(() => {
      onRemove(material.id)
    }, 200)
  }

  const handleCardClick = () => {
    if (material?.id) {
      router.push(`/material/${material.id}`)
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className={`flex gap-3 p-3 bg-white border border-[#e6e6e6] rounded-lg hover:shadow-md transition-all cursor-pointer ${
        isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex-shrink-0 relative">
        <div
          className="w-20 h-24 border-2 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative"
          style={{ borderColor: colors?.border || '#ff1500' }}
        >
          <div
            className="absolute top-1 left-1 text-white px-1.5 py-0.5 rounded text-[10px] font-bold z-10"
            style={{ backgroundColor: colors?.bg || '#ff1500' }}
          >
            {format}
          </div>
          <Image
            src={thumbnailUrl}
            alt={material.courseCode || material.title || 'Material'}
            fill
            className="object-cover"
            onError={(e) => {
              e.target.src = '/TB.jpeg'
            }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-evenly">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-[#000000] mb-0.5 leading-tight">
              {material.courseCode || material.title || 'Untitled'}
            </h2>
            <p className="text-xs text-[#6b7588] line-clamp-2">{material.description}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {(material.price > 0 || material.isPremium) && <Crown className="w-5 h-5 text-[#fbc205]" />}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleRemove()
              }}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors active:scale-95"
              aria-label="Remove from saved"
              title="Remove from saved"
            >
              <Minus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[#6b7588]">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{material.type || 'Document'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{material.pages || '—'} Pgs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{material.courseCode || material.code || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
