// Example: Using Dynamic Components
// This file demonstrates how to use the dynamic QuickActions, ContinueReading, and SuggestedMaterials components

import { QuickActions } from "@/components/QuickActions"
import { ContinueReading } from "@/components/ContinueReading"
import { SuggestedMaterials } from "@/components/SuggestedMaterials"

// ===== EXAMPLE 1: Using Default Data =====
export function DashboardWithDefaults() {
  return (
    <div>
      {/* Uses default data from data.js */}
      <QuickActions />
      <ContinueReading />
      <SuggestedMaterials />
    </div>
  )
}

// ===== EXAMPLE 2: Using Custom Data =====
export function DashboardWithCustomData() {
  // Custom quick actions
  const customActions = [
    {
      id: 'help',
      icon: 'MessageCircle',
      title: 'Get Help',
      description: 'Chat with our support team',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      link: '/help',
    },
    {
      id: 'upgrade',
      icon: 'User',
      title: 'Go Premium',
      description: 'Unlock all features',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      link: '/premium',
    },
  ]

  // Custom continue reading data (e.g., from API)
  const myCourses = [
    {
      id: '1',
      code: 'MTH 301',
      title: 'Advanced Calculus',
      subtitle: 'Integration Techniques',
      progress: 85,
      progressColor: 'bg-purple-600',
      lastRead: '5 mins ago',
    },
  ]

  // Custom suggested materials (e.g., based on user's department)
  const recommendations = [
    {
      id: '1',
      code: 'CSC 401',
      title: 'Machine Learning',
      subtitle: 'Neural Networks Fundamentals',
      isPremium: true,
      fileType: 'PDF',
    },
    {
      id: '2',
      code: 'CSC 402',
      title: 'Cloud Computing',
      subtitle: 'AWS and Azure Basics',
      isPremium: false,
      fileType: 'DOCX',
    },
  ]

  return (
    <div>
      <QuickActions actions={customActions} title="My Actions" />
      <ContinueReading courses={myCourses} title="Keep Learning" />
      <SuggestedMaterials 
        materials={recommendations} 
        title="Recommended for You" 
        maxItems={4} 
      />
    </div>
  )
}

// ===== EXAMPLE 3: Fetching Data from API =====
export function DashboardWithAPI() {
  const [continueReading, setContinueReading] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user's in-progress courses
        const readingRes = await fetch('/api/courses/in-progress')
        const readingData = await readingRes.json()
        setContinueReading(readingData)

        // Fetch personalized suggestions
        const suggestionsRes = await fetch('/api/courses/suggestions')
        const suggestionsData = await suggestionsRes.json()
        setSuggestions(suggestionsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <QuickActions />
      <ContinueReading 
        courses={continueReading}
        emptyMessage="Start reading a course to see it here!"
      />
      <SuggestedMaterials 
        materials={suggestions}
        emptyMessage="No suggestions available right now."
      />
    </div>
  )
}

// ===== EXAMPLE 4: With Custom Props =====
export function CustomDashboard() {
  return (
    <div>
      {/* Custom title for Quick Actions */}
      <QuickActions title="Things You Can Do" />

      {/* Show only 3 suggested materials */}
      <SuggestedMaterials maxItems={3} />

      {/* Custom empty message */}
      <ContinueReading 
        courses={[]} 
        emptyMessage="Your reading list is empty. Browse the library!"
      />
    </div>
  )
}

// ===== DATA STRUCTURE REFERENCE =====

/*
Quick Actions Item Structure:
{
  id: string,              // Unique identifier
  icon: string,            // Icon name: 'MessageCircle', 'User', 'Share2'
  title: string,           // Action title
  description: string,     // Action description
  bgColor: string,         // Tailwind class: 'bg-green-100'
  iconColor: string,       // Tailwind class: 'text-green-600'
  link?: string,           // Optional: Next.js route
  action?: () => void,     // Optional: Custom function to execute
}

Continue Reading Course Structure:
{
  id: string,              // Unique identifier
  code: string,            // Course code: 'CSC 301'
  title: string,           // Course title
  subtitle: string,        // Course subtitle/description
  progress: number,        // Progress percentage: 0-100
  progressColor: string,   // Tailwind class: 'bg-blue-600'
  lastRead: string,        // Time since last read: '12mins ago'
}

Suggested Materials Structure:
{
  id: string,              // Unique identifier
  code: string,            // Course code: 'CSC 301'
  title: string,           // Material title
  subtitle: string,        // Material description
  isPremium: boolean,      // Premium status
  fileType: string,        // File type: 'PDF', 'DOCX', etc.
}
*/
