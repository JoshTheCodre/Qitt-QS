"use client"

import { Search, ArrowLeftRight, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"
import { useSearchStore } from "@/store/searchStore"

export default function ExploreSearch() {
  const [mode, setMode] = useState("suggested")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [inputValue, setInputValue] = useState("")
  
  const { 
    searchMaterials, 
    recentSearches, 
    loadRecentSearches,
    searchQuery,
    suggestions,
    fetchSuggestions
  } = useSearchStore()

  useEffect(() => {
    loadRecentSearches()
    fetchSuggestions()
  }, [loadRecentSearches, fetchSuggestions])

  // Use suggestions from store, fallback to defaults if empty
  const defaultSuggestions = [
    "CSC 301", "MAT 137", "PHY 151", "ECO 101", "CSC 209"
  ]
  const suggestedItems = suggestions.length > 0 ? suggestions : defaultSuggestions

  const items = mode === "suggested" ? suggestedItems : recentSearches

  const handleSearch = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      searchMaterials(inputValue.trim())
    }
  }

  const handleQuickSearch = (item) => {
    setInputValue(item)
    searchMaterials(item)
  }

  useEffect(() => {
    if (searchQuery && searchQuery !== inputValue) {
      setInputValue(searchQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  return (
    <div className="max-w-4xl mx-auto px-2 lg:px-0 bg-blue-4000">
      <div className="border-2 border-[#0a32f8] rounded-[24px] p-4 bg-[#ffffff] shadow-sm">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-3 mb-6">
          <Search className="w-6 h-6 text-[#6b7588]" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search any document..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 text-base text-[#6b7588] placeholder:text-[#6b7588] bg-transparent border-none outline-none"
          />
        </form>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-lg leading-none">{mode === "suggested" ? "🔥" : "🕒"}</span>
            <p className="text-[#6b7588] text-sm font-medium">{mode === "suggested" ? "suggested" : "recent"}</p>
            <button
              onClick={() => setMode(mode === "suggested" ? "recent" : "suggested")}
              className="text-[#6b7588] hover:text-[#0a32f8] transition-all duration-200 hover:scale-110 active:scale-95 p-1 rounded-md hover:bg-[#f4f4f4]"
              aria-label="Switch between suggested and recent"
            >
              <ArrowLeftRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[#6b7588] hover:text-[#0a32f8] transition-all duration-200 hover:scale-110 active:scale-95 p-1 rounded-md hover:bg-[#f4f4f4]"
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
            ) : (
              <ChevronUp className="w-4 h-4" strokeWidth={2.5} />
            )}
          </button>
        </div>

        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isCollapsed ? "0px" : "200px",
            opacity: isCollapsed ? 0 : 1,
          }}
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {items.length > 0 ? (
              items.map((item, index) => (
                <button
                  key={`${mode}-${index}`}
                  onClick={() => handleQuickSearch(item)}
                  className="px-3 py-1.5 bg-[#f4f4f4] text-[#64748b] rounded-full text-xs font-semibold hover:bg-[#0a32f8]/10 hover:text-[#0a32f8] hover:border-[#0a32f8]/20 transition-all duration-200 whitespace-nowrap flex-shrink-0 hover:shadow-sm active:scale-95 border border-transparent"
                >
                  {item}
                </button>
              ))
            ) : (
              <p className="text-sm text-[#6b7588]">
                {mode === "recent" ? "No recent searches yet" : "Loading suggestions..."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
