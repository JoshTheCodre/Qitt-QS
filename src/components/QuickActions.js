import { useState, useEffect } from "react"
import { FaWhatsapp, FaUser } from "react-icons/fa"
import { Share2, Download } from "lucide-react"
import Link from "next/link"
import { quickActions as defaultQuickActions } from "@/lib/data"
import { getRandomWhatsappNumber, canInstallPWA, installPWA, initPWA } from "@/lib/pwa"

// Card component
function ActionCard({ action, onAction, className = '' }) {
  const Icon = iconMap[action.icon]
  const cardBg = colorClasses[action.cardBgColor] || action.cardBgColor
  const iconBg = colorClasses[action.iconBgColor] || action.iconBgColor
  const iconColor = colorClasses[action.iconColor] || action.iconColor

  // For special actions like 'whatsapp', 'install', or 'profile'
  if (action.link === 'whatsapp' || action.link === 'install' || action.link === 'profile') {
    return (
      <div 
        onClick={() => onAction(action)}
        className={`cursor-pointer ${className}`}
      >
        <div className={`rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow ${cardBg}`}>
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
      </div>
    )
  }

  // Regular link actions
  return (
    <Link 
      href={action.link}
      target={action.link.startsWith('http') ? '_blank' : '_self'}
      rel={action.link.startsWith('http') ? 'noopener noreferrer' : ''}
      className={className}
    >
      <div className={`rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer ${cardBg}`}>
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
}

const iconMap = {
  FaWhatsapp,
  FaUser,
  Share2,
  Download,
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
  const [showInstall, setShowInstall] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [currentActions, setCurrentActions] = useState(actions)

  useEffect(() => {
    // Initialize PWA listener
    initPWA()
    
    // Set random WhatsApp number
    setWhatsappNumber(getRandomWhatsappNumber())
    
    // Check if PWA can be installed
    const checkInstallable = () => {
      const installable = canInstallPWA()
      setShowInstall(installable)
      
      // If installable, add the install card to actions
      if (installable) {
        const installAction = {
          id: 'install',
          icon: 'Download',
          title: 'Install Qitt',
          description: 'Install app for offline access',
          cardBgColor: 'bg-purple-50',
          iconBgColor: 'bg-purple-300',
          iconColor: 'text-purple-700',
          link: 'install',
        }
        
        setCurrentActions([installAction, ...actions])
      }
    }
    
    checkInstallable()
  }, [actions])

  const handleAction = async (action) => {
    if (action.link === 'whatsapp') {
      window.open(`https://wa.me/${whatsappNumber}`, '_blank')
      return
    }
    
    if (action.link === 'install') {
      try {
        await installPWA()
        setShowInstall(false)
        setCurrentActions(actions.filter(a => a.id !== 'install')) // Remove install card after installation
      } catch (error) {
        console.error('Failed to install PWA:', error)
      }
      return
    }

    if (action.link === 'profile') {
      // Profile card is now non-interactive
      return
    }
  }

  // Mobile view (horizontal scroll)
  const renderMobileView = () => (
    <div className="lg:hidden flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide">
      {currentActions.map((action) => (
        <ActionCard
          key={action.id}
          action={action}
          onAction={handleAction}
          className="snap-start min-w-[280px]"
        />
      ))}
    </div>
  )

  // Desktop view (grid)
  const renderDesktopView = () => (
    <div className="hidden lg:grid grid-cols-3 gap-4 mt-3">
      {currentActions.map((action) => (
        <ActionCard
          key={action.id}
          action={action}
          onAction={handleAction}
        />
      ))}
    </div>
  )

  return (
    <section className="mb-6 md:mb-8 px-4 lg:px-0">
      <h2 className="font-medium text-lg mb-2 md:mb-0 lg:px-0" style={{ fontSize: '17px', fontWeight: 500, color: '#505763ff' }}>
        {title}
      </h2>
      {renderMobileView()}
      {renderDesktopView()}
    </section>
  )
}
