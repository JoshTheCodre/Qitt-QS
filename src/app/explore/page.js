'use client'

import { withAuth } from '@/components/hoc/withAuth'
import { Sidebar } from '@/components/Sidebar'
import { SimpleHeader } from '@/components/SimpleHeader'
import ExploreSearch from '@/components/ExploreSearch'
import SearchResults from '@/components/SearchResults'

function ExplorePage() {
  return (
    <div className="flex min-h-screen bg-background ">
      <Sidebar />

      <main className="flex-1 lg:ml-72 w-full pt-4 pb-24 lg:pb-4 lg:pt-4 lg:px-8 overflow-x-hidden">
        <SimpleHeader 
          title="Explore" 
          description="Discover study materials across all departments and levels" 
        />
        
        <ExploreSearch />
        <SearchResults />
      </main>
    </div>
  )
}

export default withAuth(ExplorePage)
