# Backend API Requirements for Blog Categories

## Overview
The frontend application now fetches blog categories from the backend API using the existing axios setup and API_ENDPOINT configuration. This document outlines the required API endpoints and data structures.

## Base URL
The API uses the existing `API_ENDPOINT` from `src/utils/constants.js`:
```
http://127.0.0.1:3000/api/
```
(Configurable via the constants file)

## API Endpoints

### 1. Get All Blog Categories
**Endpoint:** `GET /api/blog/categories`

**Response Format:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "All Blog",
        "slug": "all-blog",
        "description": "All blog posts",
        "is_active": 1,
        "created_at": "2025-07-21T13:48:08.000Z",
        "updated_at": "2025-07-21T13:48:08.000Z"
      },
      {
        "id": 2,
        "name": "How to connect Analog Gear?",
        "slug": "how-to-connect-analog-gear",
        "description": "Tips and guides for connecting analog gear",
        "is_active": 1,
        "created_at": "2025-07-21T13:48:08.000Z",
        "updated_at": "2025-07-21T13:48:08.000Z"
      },
      {
        "id": 3,
        "name": "How to Export Stems?",
        "slug": "how-to-export-stems",
        "description": "Tutorials on exporting stems",
        "is_active": 1,
        "created_at": "2025-07-21T13:48:08.000Z",
        "updated_at": "2025-07-21T13:48:08.000Z"
      }
    ]
  }
}
```

### 2. Create Blog Category
**Endpoint:** `POST /api/blog/categories`

**Request Body:**
```json
{
  "name": "New Category",
  "slug": "new-category",
  "description": "Category description",
  "is_active": 1
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "id": 11,
    "name": "New Category",
    "slug": "new-category",
    "description": "Category description",
    "is_active": 1,
    "created_at": "2025-07-21T13:48:08.000Z",
    "updated_at": "2025-07-21T13:48:08.000Z"
  }
}
```

### 3. Update Blog Category
**Endpoint:** `PUT /api/blog/categories/:id`

**Request Body:**
```json
{
  "name": "Updated Category",
  "slug": "updated-category",
  "description": "Updated description",
  "is_active": 1
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Category",
    "slug": "updated-category",
    "description": "Updated description",
    "is_active": 1,
    "created_at": "2025-07-21T13:48:08.000Z",
    "updated_at": "2025-07-21T13:48:08.000Z"
  }
}
```

### 4. Delete Blog Category
**Endpoint:** `DELETE /api/blog/categories/:id`

**Response Format:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

## Database Schema

### Blog Categories Table
```sql
CREATE TABLE blog_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes
- `400` - Bad Request (invalid data)
- `404` - Category not found
- `409` - Category already exists (for creation)
- `500` - Internal server error

## Frontend Integration

### Existing Configuration
The frontend uses the existing API configuration from `src/utils/constants.js`:
```javascript
export const API_ENDPOINT = "http://127.0.0.1:3000/api/";
```

### Response Processing
The frontend automatically:
- Extracts categories from `response.data.data.categories`
- Filters out inactive categories (`is_active !== 0`)
- Converts numeric IDs to strings for consistency
- Adds "All Posts" option at the beginning
- Maps blog posts to appropriate categories

### Fallback Behavior
If the API is unavailable, the frontend will fall back to default categories:
- All Posts
- Mixing
- Mastering
- Equipment
- Technology
- Studio Setup
- Tips & Tricks

## Testing

### Test Data
You can use the mock data from `src/mocks/blogCategories.json` to test the frontend integration.

### API Testing
Test the endpoints using tools like Postman or curl:

```bash
# Get all categories
curl http://127.0.0.1:3000/api/blog/categories

# Create a category
curl -X POST http://127.0.0.1:3000/api/blog/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Category", "slug": "test-category", "description": "Test description", "is_active": 1}'
```

## Implementation Notes

1. **CORS**: Ensure your backend allows CORS requests from the frontend domain
2. **Authentication**: Add authentication headers if required (using existing auth pattern)
3. **Rate Limiting**: Implement appropriate rate limiting
4. **Validation**: Validate category names, slugs, and descriptions
5. **Slug Generation**: Auto-generate slugs from category names if not provided
6. **Active Status**: Only categories with `is_active: 1` are displayed
7. **Numeric IDs**: Backend uses numeric IDs, frontend converts to strings for consistency

## Frontend Features

The updated frontend includes:
- ✅ Dynamic category loading from backend using existing axios setup
- ✅ Loading states with skeleton components
- ✅ Error handling with retry functionality
- ✅ Fallback to default categories if API fails
- ✅ Category filtering for blog posts
- ✅ Responsive design for all screen sizes
- ✅ Uses existing API_ENDPOINT configuration
- ✅ Handles nested response structure (`data.categories`)
- ✅ Filters inactive categories automatically
- ✅ Maps blog posts to appropriate categories based on content 