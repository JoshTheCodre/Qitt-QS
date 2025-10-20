import { FaWhatsapp, FaUser } from "react-icons/fa"
import { Share2 } from "lucide-react"
import Link from "next/link"
import { quickActions as defaultQuickActions } from "@/lib/data"

const iconMap = {
  FaWhatsapp,
  FaUser,
  Share2,
}

const colorClasses = {
  'bg-green-50': 'bg-green-50',
  'bg-green-300': 'bg-green-200',
  'text-green-700': 'text-green-600',
  'bg-blue-50': 'bg-blue-50',
  'bg-blue-300': 'bg-blue-200',
  'text-blue-700': 'text-blue-600',
  'bg-yellow-50': 'bg-yellow-50',
  'bg-yellow-300': 'bg-yellow-200',
  'text-yellow-700': 'text-yellow-600',
}

export function QuickActions({ actions = defaultQuickActions, title = "Quick Actions" }) {
  return (
    <section className="mb-6 md:mb-8 px-4 lg:px-0">
      <h2 className="font-medium text-lg mb-2 md:mb-0 lg:px-0" style={{ fontSize: '17px', fontWeight: 500, color: '#505763ff' }}>{title}</h2>
      {/* Mobile: Horizontal scroll */}
      <div className="lg:hidden flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide">
        {actions.map((action) => {
          const Icon = iconMap[action.icon]
          const cardBg = colorClasses[action.cardBgColor] || action.cardBgColor
          const iconBg = colorClasses[action.iconBgColor] || action.iconBgColor
          const iconColor = colorClasses[action.iconColor] || action.iconColor
          
          return (
            <Link 
              key={action.id} 
              href={action.link}
              target={action.link.startsWith('http') ? '_blank' : '_self'}
              rel={action.link.startsWith('http') ? 'noopener noreferrer' : ''}
              className="snap-start"
            >
              <div className={`rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer min-w-[280px] ${cardBg}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-0.5">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      {/* Desktop: Grid */}
      <div className="hidden lg:grid grid-cols-3 gap-4 mt-3">
        {actions.map((action) => {
          const Icon = iconMap[action.icon]
          const cardBg = colorClasses[action.cardBgColor] || action.cardBgColor
          const iconBg = colorClasses[action.iconBgColor] || action.iconBgColor
          const iconColor = colorClasses[action.iconColor] || action.iconColor
          
          return (
            <Link 
              key={action.id} 
              href={action.link}
              target={action.link.startsWith('http') ? '_blank' : '_self'}
              rel={action.link.startsWith('http') ? 'noopener noreferrer' : ''}
            >
              <div className={`rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer ${cardBg}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
