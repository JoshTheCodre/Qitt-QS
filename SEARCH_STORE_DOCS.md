# Search Store Documentation

## Overview
Comprehensive full-text search functionality for materials using Zustand state management.

## Search Store (searchStore.js)

### State
```javascript
{
  searchQuery: '',          // Current search query
  searchResults: [],        // Array of search results
  recentSearches: [],       // Recent search history (max 10)
  loading: false,           // Loading state
  error: null,              // Error message
  filters: {
    type: null,             // Filter by material type
    department: null,       // Filter by department
    level: null,            // Filter by level
    isPremium: null         // Filter by premium status
  }
}
```

### Actions

#### searchMaterials(searchTerm)
Full-text search across multiple fields:
- **Course Code** (highest priority)
- **Tags** (high priority)
- **Description** (medium priority)
- **Type, Department, Faculty** (low priority)

```javascript
// Usage
const { searchMaterials } = useSearchStore()
searchMaterials('CSC 301')
```

**Relevance Scoring:**
- Exact course code match: +100 points
- Partial course code match: +50 points
- Exact tag match: +30 points
- Partial tag match: +15 points
- Description match: +10 points
- Type/Department match: +5 points
- Popular content bonus (>50 likes): +5 points

#### advancedSearch(criteria)
Search with multiple criteria:
```javascript
advancedSearch({
  courseCode: 'CSC 301',
  department: 'Computer Science',
  level: '300',
  type: 'Lecture Notes',
  searchText: 'algorithms'
})
```

#### searchByTag(tag)
Search materials by specific tag:
```javascript
searchByTag('algorithms')
```

#### getTrendingMaterials()
Get popular materials sorted by likes:
```javascript
getTrendingMaterials() // Returns top 20 materials
```

#### setFilter(filterKey, value)
Apply individual filter:
```javascript
setFilter('type', 'Lecture Notes')
setFilter('isPremium', false)
```

#### clearFilters()
Reset all filters:
```javascript
clearFilters()
```

### Recent Searches

Recent searches are automatically:
- Saved to localStorage
- Limited to 10 items
- Added when search is performed
- Deduplicated (no repeats)

```javascript
// Load recent searches
loadRecentSearches()

// Clear recent searches
clearRecentSearches()
```

## Integration Examples

### Explore Search Component
```javascript
import { useSearchStore } from '@/store/searchStore'

function ExploreSearch() {
  const { searchMaterials, recentSearches, loadRecentSearches } = useSearchStore()
  
  useEffect(() => {
    loadRecentSearches()
  }, [])
  
  const handleSearch = (query) => {
    searchMaterials(query)
  }
}
```

### Search Results Component
```javascript
import { useSearchStore } from '@/store/searchStore'

function SearchResults() {
  const { searchResults, loading, error, getTrendingMaterials } = useSearchStore()
  
  useEffect(() => {
    if (searchResults.length === 0) {
      getTrendingMaterials()
    }
  }, [])
  
  return (
    <div>
      {loading && <LoadingState />}
      {error && <ErrorState error={error} />}
      {searchResults.map(result => <MaterialCard key={result.id} {...result} />)}
    </div>
  )
}
```

### View Material Page
```javascript
const router = useRouter()

const handleMaterialClick = (materialId) => {
  router.push(`/material/${materialId}`)
}
```

## Pending Uploads Integration

### PendingUploads Component
Now integrated with `libraryStore` for consistent workflow:

```javascript
import { useLibraryStore } from '@/store/libraryStore'

function PendingUploads() {
  const { userUploads, fetchUserUploads } = useLibraryStore()
  
  useEffect(() => {
    if (user?.uid) {
      fetchUserUploads(user.uid)
    }
  }, [user?.uid])
  
  // Access pending and approved uploads
  const pending = userUploads.pending || []
  const approved = userUploads.approved || []
}
```

**Features:**
- Displays pending and approved uploads
- Shows status badges (Pending/Approved)
- Click approved items to view
- Navigate to library for full list
- Shows upload button if no uploads

## Search Workflow

### 1. User Types Query
```
User Input → setSearchQuery() → searchMaterials()
```

### 2. Search Execution
```
Query → Firestore (isApproved === true) → Full-text Filter → Apply Filters → Score by Relevance → Sort → Display
```

### 3. Results Display
```
SearchResults Component → Click Material → Navigate to /material/[id]
```

### 4. View Material
```
ViewMaterial Component → Display Material Details → Like/Save/Download Actions
```

## Firestore Queries

### Base Query (All Searches)
```javascript
query(
  collection(db, 'materials'),
  where('isApproved', '==', true),
  limit(50)
)
```

### Tag Search
```javascript
query(
  collection(db, 'materials'),
  where('isApproved', '==', true),
  where('tags', 'array-contains', tag)
)
```

### Trending Materials
```javascript
query(
  collection(db, 'materials'),
  where('isApproved', '==', true),
  orderBy('likes', 'desc'),
  limit(20)
)
```

## Performance Considerations

1. **Limit Results**: Maximum 50 results per search
2. **Client-Side Filtering**: Full-text search done client-side for flexibility
3. **Caching**: Recent searches cached in localStorage
4. **Lazy Loading**: Trending materials loaded only when needed
5. **Relevance Scoring**: Smart ranking for better user experience

## Future Enhancements

- [ ] Add debouncing for search input
- [ ] Implement search suggestions/autocomplete
- [ ] Add pagination for large result sets
- [ ] Cache search results
- [ ] Add search analytics
- [ ] Implement faceted search
- [ ] Add fuzzy matching for typos
- [ ] Search history sync across devices
- [ ] Advanced filters UI
- [ ] Save search filters as presets

## Usage Tips

### Best Practices
1. Load recent searches on component mount
2. Clear results when leaving search page
3. Show loading states for better UX
4. Handle errors gracefully
5. Use relevance scoring for better results

### Common Patterns
```javascript
// Search with loading state
const handleSearch = async (query) => {
  setLoading(true)
  await searchMaterials(query)
  setLoading(false)
}

// Quick search from suggestions
const handleQuickSearch = (item) => {
  setInputValue(item)
  searchMaterials(item)
}

// Navigate to material
const viewMaterial = (id) => {
  router.push(`/material/${id}`)
}
```
