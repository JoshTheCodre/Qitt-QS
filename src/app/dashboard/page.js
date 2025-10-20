'use client'

import { withAuth } from '@/components/hoc/withAuth'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { HeroBanner } from '@/components/HeroBanner'
import { QuickActions } from '@/components/QuickActions'
import { ContinueReading } from '@/components/ContinueReading'
import { SuggestedMaterials } from '@/components/SuggestedMaterials'

function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar / Bottom Nav */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 w-full pt-4 pb-24 lg:pb-8 lg:pt-4 lg:px-8 overflow-x-hidden">
        {/* Header */}
        <Header />

        {/* Hero Banner */}
        <HeroBanner />

        {/* Quick Actions */}
        <QuickActions />
        
        {/* Continue Reading */}
        <ContinueReading />

        {/* Suggested Materials */}
        <SuggestedMaterials />
      </main>
    </div>
  )
}

export default withAuth(DashboardPage)
