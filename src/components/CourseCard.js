import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Crown } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getThumbnailUrl } from "@/lib/utils"

// Helper function to format time ago
function getTimeAgo(timestamp) {
  const now = Date.now()
  const diff = now - timestamp
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}min${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours}hr${hours > 1 ? 's' : ''} ago`
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  }
  const months = Math.floor(days / 30)
  return `${months} month${months > 1 ? 's' : ''} ago`
}

// Continue Reading Card Component
export function ContinueReadingCard({
    id,
    code,
    title,
    subtitle,
    timestamp,
    material,
}) {
    const router = useRouter()

    const handleClick = () => {
        if (id) {
            router.push(`/material/${id}`)
        }
    }

    const timeAgo = timestamp ? getTimeAgo(timestamp) : 'Recently'
    const thumbnailUrl = getThumbnailUrl(material)

    return (
        <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
            <div className="flex gap-3">
                {/* Thumbnail Image */}
                <div className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                        src={thumbnailUrl}
                        alt={title || 'Document'}
                        fill
                        className="object-cover"
                        onError={(e) => {
                            e.target.src = '/TB.jpeg'
                        }}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between mb-1">
                            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100">
                                {code}
                            </span>
                        </div>
                        <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1">{title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
                    </div>
                    
                    <div className="mt-2">
                        <div className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                            {timeAgo}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

// Suggested Materials Card Component
export function SuggestedMaterialCard({
    id,
    code,
    title,
    subtitle,
    isPremium = false,
    fileType,
    material,
}) {
    const router = useRouter()

    const handleClick = () => {
        if (id) {
            router.push(`/material/${id}`)
        }
    }

    const thumbnailUrl = getThumbnailUrl(material)

    return (
        <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
            <div className="flex gap-3">
                {/* Thumbnail Image */}
                <div className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                        src={thumbnailUrl}
                        alt={title || 'Document'}
                        fill
                        className="object-cover"
                        onError={(e) => {
                            e.target.src = '/TB.jpeg'
                        }}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between mb-1">
                            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                                {code}
                            </span>
                            <div className="flex items-center gap-1 text-red-500">
                                <Heart className="h-4 w-4 fill-red-500" />
                                <span className="text-xs font-medium">{material?.likes || 0}</span>
                            </div>
                        </div>
                        <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1">{title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                        {isPremium && (
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-100 flex items-center gap-1 px-1.5 py-0">
                                <Crown size={10} />
                                <span className="text-[10px]">Premium</span>
                            </Badge>
                        )}
                        <Badge variant="outline" className="text-muted-foreground text-xs px-1.5 py-0">
                            {fileType}
                        </Badge>
                    </div>
                </div>
            </div>
        </Card>
    )
}

// Backward compatibility - keeping CourseCard as alias
export const CourseCard = ContinueReadingCard
