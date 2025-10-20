# PDF Thumbnail Generation System

## Overview
The application automatically generates and stores thumbnail images from PDF files during the upload process. These thumbnails are displayed across the application in material cards, providing a visual preview of documents.

## How It Works

### 1. Thumbnail Generation (`utils.js`)
Located in `src/lib/utils.js`, the system includes several utility functions:

#### `generatePdfThumbnail(file)`
- Extracts the first page of a PDF file
- Renders it to a canvas at 1.5x scale
- Converts to JPEG format (85% quality)
- Returns a blob ready for upload

#### `uploadThumbnail(thumbnailBlob, materialId)`
- Uploads the thumbnail blob to Firebase Storage
- Stores in `thumbnails/{materialId}.jpg` path
- Returns the public download URL

#### `generateAndUploadPdfThumbnail(file, materialId)`
- Combines both operations above
- Handles errors gracefully
- Returns `{ success: boolean, thumbnailUrl: string | null }`

#### `getThumbnailUrl(material)`
- Returns the material's thumbnail URL if available
- Falls back to `/default-document.png` if no thumbnail exists

### 2. Upload Integration (`uploadStore.js`)
During file upload:
1. PDF file is uploaded to Firebase Storage
2. Material document is created in Firestore
3. If file is a PDF, thumbnail generation is triggered
4. Thumbnail is uploaded to Storage
5. Material document is updated with `thumbnailUrl`

**Note:** Thumbnail generation is non-blocking. If it fails, the upload still succeeds.

### 3. Display Components

#### CourseCard Components
- `ContinueReadingCard`: Shows thumbnails for recently viewed materials
- `SuggestedMaterialCard`: Shows thumbnails for suggested materials
- Both use `getThumbnailUrl()` for thumbnail with fallback

#### SavedMaterialCard
- Displays thumbnails in the library view
- Shows file type badge overlay
- Uses `getThumbnailUrl()` for thumbnail with fallback

### 4. Fallback Image
Location: `/public/default-document.png`

A generic document icon displayed when:
- No thumbnail was generated
- Thumbnail generation failed
- Material is not a PDF
- Thumbnail URL is invalid

## Technical Details

### Dependencies
- `pdfjs-dist`: PDF rendering library (already installed)
- Worker URL: Uses CDN for PDF.js worker

### Storage Structure
```
materials/
  └── {university}/
      └── {timestamp}_{filename}.pdf

thumbnails/
  └── {materialId}.jpg
```

### Material Object Schema
```javascript
{
  fileUrl: "https://...",           // PDF file URL
  thumbnailUrl: "https://...",      // Thumbnail URL (optional)
  metadata: {
    fileName: "document.pdf",
    fileSize: 123456,
    fileType: "application/pdf",
    uploadedAt: "2025-01-01T00:00:00.000Z"
  }
}
```

## Usage Examples

### Displaying a Material Card
```javascript
import { getThumbnailUrl } from '@/lib/utils'
import Image from 'next/image'

function MaterialCard({ material }) {
  const thumbnailUrl = getThumbnailUrl(material)
  
  return (
    <Image
      src={thumbnailUrl}
      alt={material.title}
      fill
      className="object-cover"
      onError={(e) => {
        e.target.src = '/default-document.png'
      }}
    />
  )
}
```

### Manual Thumbnail Generation
```javascript
import { generateAndUploadPdfThumbnail } from '@/lib/utils'

async function uploadWithThumbnail(pdfFile, materialId) {
  const result = await generateAndUploadPdfThumbnail(pdfFile, materialId)
  
  if (result.success) {
    console.log('Thumbnail URL:', result.thumbnailUrl)
  } else {
    console.log('Thumbnail generation failed, using fallback')
  }
}
```

## Performance Considerations

1. **Canvas Rendering**: Done client-side to avoid server overhead
2. **Image Quality**: 85% JPEG quality balances size vs clarity
3. **Scale Factor**: 1.5x provides good detail without excessive file size
4. **Async Processing**: Thumbnail generation doesn't block upload completion
5. **Caching**: Browser caches thumbnails from Firebase Storage CDN

## Error Handling

All thumbnail operations include try-catch blocks:
- Generation failures don't prevent upload completion
- Missing thumbnails automatically fall back to default image
- Console logs provide debugging information

## Future Enhancements

Potential improvements:
- Support for other document types (DOCX, PPTX, etc.)
- Multiple thumbnail sizes for different display contexts
- Background processing for large PDFs
- Thumbnail regeneration for existing materials
