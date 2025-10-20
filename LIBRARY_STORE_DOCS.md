# Library Store Documentation

## Overview
Centralized state management for user's saved materials and uploads using Zustand.

## User Document Structure (Firestore)

```javascript
{
  uid: "user123",
  email: "user@example.com",
  displayName: "John Doe",
  
  // Single uploads object containing both pending and approved
  uploads: {
    pending: [
      {
        materialId: "mat123",
        uploadedAt: "2025-10-19T10:30:00.000Z",
        courseCode: "CSC 301",
        status: "pending"
      }
    ],
    approved: [
      {
        materialId: "mat456",
        uploadedAt: "2025-10-15T14:20:00.000Z",
        courseCode: "CSC 205",
        status: "approved"
      }
    ]
  },
  
  // Array of material IDs saved by user
  savedMaterials: ["mat789", "mat101"],
  
  dailyUploadLimit: 10,
  createdAt: "2025-10-01T...",
  updatedAt: "2025-10-19T..."
}
```

## Library Store (libraryStore.js)

### State
- `savedMaterials`: Array of full material objects from My Library
- `userUploads`: Object with `pending` and `approved` arrays
- `loading`: Loading state
- `error`: Error message

### Actions

#### fetchSavedMaterials(userId)
Fetches all materials saved by the user from their `savedMaterials` array.

#### fetchUserUploads(userId)
Fetches all user uploads (both pending and approved) with full material details.

#### addToSaved(userId, materialId)
Adds a material to user's saved materials.

#### removeFromSaved(userId, materialId)
Removes a material from user's saved materials.

#### getUploadStats()
Returns statistics about user uploads:
```javascript
{
  totalUploads: 15,
  totalLikes: 1448,
  pendingCount: 3,
  approvedCount: 12
}
```

## Upload Store Updates (uploadStore.js)

### Changes
- Now uses `uploads.pending` array instead of `pendingUploads`
- Daily limit check counts both pending and approved uploads
- Creates new user documents with proper structure

### Upload Flow
1. User uploads file → Stored in Firebase Storage
2. Material document created in `materials` collection
3. Reference added to `users/{uid}/uploads.pending[]`
4. Admin approves → Move from `pending` to `approved` array

## Component Integration

### Library Page (library/page.js)
```javascript
const {
  savedMaterials,
  userUploads,
  loading,
  fetchSavedMaterials,
  fetchUserUploads,
  removeFromSaved,
  getUploadStats
} = useLibraryStore()

// Fetch data on mount
useEffect(() => {
  if (user?.uid) {
    fetchSavedMaterials(user.uid)
    fetchUserUploads(user.uid)
  }
}, [user?.uid])

// Get stats for banner
const stats = getUploadStats()
```

### My Library Tab
- Displays `savedMaterials` from library store
- Uses `SavedMaterialCard` component
- Remove button calls `removeFromSaved()`

### My Uploads Tab
- Displays combined pending and approved uploads
- Shows `MotivationBanner` with dynamic stats
- Uses `ContentCard` component for each upload

## Migration Notes

### From Old Structure
```javascript
// OLD
{
  pendingUploads: [...],
  approvedUploads: [...]  // if existed
}

// NEW
{
  uploads: {
    pending: [...],
    approved: [...]
  }
}
```

### Key Benefits
1. Single source of truth for all uploads
2. Easier to query and manage upload status
3. Consistent structure across the app
4. Better TypeScript/type safety
5. Simplified state management

## Usage Examples

### Add to Saved
```javascript
import { useLibraryStore } from '@/store/libraryStore'
import { useAuthStore } from '@/store/authStore'

const handleSave = async (materialId) => {
  const user = useAuthStore.getState().user
  const { addToSaved } = useLibraryStore.getState()
  
  await addToSaved(user.uid, materialId)
}
```

### Remove from Saved
```javascript
const handleRemove = async (materialId) => {
  const user = useAuthStore.getState().user
  const { removeFromSaved } = useLibraryStore.getState()
  
  await removeFromSaved(user.uid, materialId)
}
```

### Get Upload Stats
```javascript
const stats = useLibraryStore(state => state.getUploadStats())
console.log(stats.totalUploads) // 15
console.log(stats.totalLikes)   // 1448
```

## Future Enhancements
- Add pagination for large lists
- Implement search/filter functionality
- Add sorting options (date, likes, status)
- Cache frequently accessed data
- Add offline support with persistence
