import { Heart } from "lucide-react"

export function ContentCard({ title, description, date, likes, status, isFeatured }) {
  const statusColor = status === "Approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
  const statusIcon = status === "Approved" ? "✓" : "⚠"

  return (
    <div className="bg-white rounded-xl p-5 md:p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-3 md:gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg border-2 border-red-500 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-bold text-red-500 mb-1">PDF</div>
              <div className="text-[10px] md:text-xs text-gray-400">Document</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1 md:mb-2">
              <h3 className="text-base md:text-lg font-bold text-gray-900 flex-1 line-clamp-2">{title}</h3>
              {isFeatured && <span className="text-lg md:text-xl flex-shrink-0">👑</span>}
            </div>
            <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3 line-clamp-2">{description}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
              <span className="whitespace-nowrap">{date}</span>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 md:w-4 md:h-4 fill-red-500 text-red-500" />
                <span>{likes}</span>
              </div>
            </div>
            <div className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium flex items-center gap-1 ${statusColor} whitespace-nowrap`}>
              <span>{statusIcon}</span>
              {status}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
