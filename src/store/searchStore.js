import { create } from 'zustand'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'

const useSearchStore = create((set, get) => ({
  // State
  searchQuery: '',
  searchResults: [],
  recentSearches: [],
  suggestions: [],
  loading: false,
  error: null,
  filters: {
    type: null,
    department: null,
    level: null,
    isPremium: null,
  },

  // Set search query
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Fetch search suggestions (up to 5)
  fetchSuggestions: async () => {
    try {
      const q = query(
        collection(db, 'materials'),
        orderBy('likes', 'desc'),
        limit(5)
      )

      const snapshot = await getDocs(q)
      const suggestions = snapshot.docs.map(doc => ({
        id: doc.id,
        courseCode: doc.data().courseCode,
        type: doc.data().type,
      }))

      // Extract unique course codes
      const uniqueSuggestions = [...new Set(suggestions.map(s => s.courseCode))].slice(0, 5)
      
      set({ suggestions: uniqueSuggestions })
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      // Fallback to default suggestions
      set({ 
        suggestions: ["CSC 301", "MAT 137", "PHY 151", "ECO 101", "CSC 209"]
      })
    }
  },

  // Set filters
  setFilter: (filterKey, value) => set((state) => ({
    filters: { ...state.filters, [filterKey]: value }
  })),

  // Clear filters
  clearFilters: () => set({
    filters: {
      type: null,
      department: null,
      level: null,
      isPremium: null,
    }
  }),

  // Full-text search function
  searchMaterials: async (searchTerm) => {
    const { filters } = get()
    
    if (!searchTerm || searchTerm.trim().length === 0) {
      set({ searchResults: [], error: null })
      return
    }

    set({ loading: true, error: null, searchQuery: searchTerm })

    try {
      // Normalize search term
      const normalizedSearch = searchTerm.toLowerCase().trim()
      
      // Build base query - fetch all materials (approved and unapproved)
      let baseQuery = query(
        collection(db, 'materials'),
        limit(100)
      )

      // Fetch materials
      const snapshot = await getDocs(baseQuery)
      let materials = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Full-text search filter
      materials = materials.filter(material => {
        const searchableFields = [
          material.courseCode?.toLowerCase() || '',
          material.description?.toLowerCase() || '',
          material.department?.toLowerCase() || '',
          material.faculty?.toLowerCase() || '',
          material.type?.toLowerCase() || '',
          ...(material.tags?.map(tag => tag.toLowerCase()) || [])
        ].join(' ')

        return searchableFields.includes(normalizedSearch)
      })

      // Apply additional filters
      if (filters.type) {
        materials = materials.filter(m => m.type === filters.type)
      }
      if (filters.department) {
        materials = materials.filter(m => m.department === filters.department)
      }
      if (filters.level) {
        materials = materials.filter(m => m.level === filters.level)
      }
      if (filters.isPremium !== null) {
        materials = materials.filter(m => {
          const isPremium = m.price > 0 || m.isPremium
          return filters.isPremium ? isPremium : !isPremium
        })
      }

      // Sort by relevance (simple scoring based on matches)
      materials.sort((a, b) => {
        const aScore = calculateRelevanceScore(a, normalizedSearch)
        const bScore = calculateRelevanceScore(b, normalizedSearch)
        return bScore - aScore
      })

      set({ 
        searchResults: materials,
        loading: false 
      })

      // Add to recent searches
      get().addRecentSearch(searchTerm)

    } catch (error) {
      console.error('Search error:', error)
      set({ 
        error: error.message,
        loading: false,
        searchResults: []
      })
    }
  },

  // Advanced search with multiple criteria
  advancedSearch: async (criteria) => {
    set({ loading: true, error: null })

    try {
      let q = query(
        collection(db, 'materials')
      )

      // Add filters based on criteria
      if (criteria.courseCode) {
        q = query(q, where('courseCode', '==', criteria.courseCode.toUpperCase()))
      }
      if (criteria.department) {
        q = query(q, where('department', '==', criteria.department))
      }
      if (criteria.level) {
        q = query(q, where('level', '==', criteria.level))
      }
      if (criteria.type) {
        q = query(q, where('type', '==', criteria.type))
      }

      const snapshot = await getDocs(q)
      const materials = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Apply text search if provided
      let results = materials
      if (criteria.searchText) {
        const normalizedSearch = criteria.searchText.toLowerCase().trim()
        results = materials.filter(material => {
          const searchableFields = [
            material.courseCode?.toLowerCase() || '',
            material.description?.toLowerCase() || '',
            ...(material.tags?.map(tag => tag.toLowerCase()) || [])
          ].join(' ')
          return searchableFields.includes(normalizedSearch)
        })
      }

      set({ 
        searchResults: results,
        loading: false 
      })

    } catch (error) {
      console.error('Advanced search error:', error)
      set({ 
        error: error.message,
        loading: false,
        searchResults: []
      })
    }
  },

  // Search by tag
  searchByTag: async (tag) => {
    set({ loading: true, error: null })

    try {
      const q = query(
        collection(db, 'materials'),
        where('tags', 'array-contains', tag)
      )

      const snapshot = await getDocs(q)
      const materials = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      set({ 
        searchResults: materials,
        loading: false,
        searchQuery: `#${tag}`
      })

      get().addRecentSearch(`#${tag}`)

    } catch (error) {
      console.error('Tag search error:', error)
      set({ 
        error: error.message,
        loading: false,
        searchResults: []
      })
    }
  },

  // Get popular/trending materials
  getTrendingMaterials: async () => {
    set({ loading: true, error: null })

    try {
      const q = query(
        collection(db, 'materials'),
        orderBy('likes', 'desc'),
        limit(20)
      )

      const snapshot = await getDocs(q)
      const materials = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      set({ 
        searchResults: materials,
        loading: false 
      })

    } catch (error) {
      console.error('Trending materials error:', error)
      set({ 
        error: error.message,
        loading: false 
      })
    }
  },

  // Add to recent searches
  addRecentSearch: (searchTerm) => {
    const { recentSearches } = get()
    const trimmed = searchTerm.trim()
    
    if (!trimmed) return

    // Remove duplicate if exists and add to front
    const updated = [
      trimmed,
      ...recentSearches.filter(s => s !== trimmed)
    ].slice(0, 10) // Keep only last 10 searches

    set({ recentSearches: updated })
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    }
  },

  // Load recent searches from localStorage
  loadRecentSearches: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recentSearches')
      if (stored) {
        try {
          set({ recentSearches: JSON.parse(stored) })
        } catch (e) {
          console.error('Error loading recent searches:', e)
        }
      }
    }
  },

  // Clear recent searches
  clearRecentSearches: () => {
    set({ recentSearches: [] })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches')
    }
  },

  // Clear search results
  clearSearchResults: () => set({ 
    searchResults: [], 
    searchQuery: '',
    error: null 
  }),

  // Clear error
  clearError: () => set({ error: null })
}))

// Helper function to calculate relevance score
function calculateRelevanceScore(material, searchTerm) {
  let score = 0

  // Exact match in course code (highest priority)
  if (material.courseCode?.toLowerCase() === searchTerm) {
    score += 100
  } else if (material.courseCode?.toLowerCase().includes(searchTerm)) {
    score += 50
  }

  // Match in tags
  if (material.tags?.some(tag => tag.toLowerCase() === searchTerm)) {
    score += 30
  } else if (material.tags?.some(tag => tag.toLowerCase().includes(searchTerm))) {
    score += 15
  }

  // Match in description
  if (material.description?.toLowerCase().includes(searchTerm)) {
    score += 10
  }

  // Match in type or department
  if (material.type?.toLowerCase().includes(searchTerm)) {
    score += 5
  }
  if (material.department?.toLowerCase().includes(searchTerm)) {
    score += 5
  }

  // Bonus for popular materials
  if (material.likes > 50) {
    score += 5
  }

  return score
}

export { useSearchStore }
