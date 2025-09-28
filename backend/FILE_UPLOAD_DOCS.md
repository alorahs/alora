# File Upload API Documentation

## Overview
This documentation explains how to use the file upload functionality in the backend API. The implementation supports both traditional multipart form uploads and direct binary blob uploads, with file metadata stored in MongoDB.

## Dependencies
- multer: For handling multipart/form-data
- uuid: For generating unique filenames
- fs: For file system operations

## API Endpoints

### Upload a File (Multipart Form Data)
**POST** `/api/file`

Uploads a file using traditional multipart form data and stores its metadata in the database.

**Request:**
- Content-Type: multipart/form-data
- Form fields:
  - `file` (required): The file to upload
  - `category` (optional): File category (profile_picture, work_gallery, document, other)
  - `description` (optional): Description of the file
  - `isPublic` (optional): Whether the file is publicly accessible (true/false)

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "_id": "507f1f77bcf86cd799439011",
    "originalName": "example.jpg",
    "filename": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8-1623456789-123456789.jpg",
    "path": "uploads/a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8-1623456789-123456789.jpg",
    "mimetype": "image/jpeg",
    "size": 123456,
    "owner": "507f191e810c19729de860ea",
    "category": "profile_picture",
    "description": "Profile picture",
    "isPublic": false,
    "createdAt": "2023-06-12T10:26:29.000Z",
    "updatedAt": "2023-06-12T10:26:29.000Z",
    "url": "/uploads/a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8-1623456789-123456789.jpg"
  }
}
```

### Upload a File (Binary Blob Data)
**POST** `/api/file/blob`

Uploads a file using binary blob data sent in the request body.

**Request:**
- Content-Type: The MIME type of the file being uploaded
- Headers:
  - `x-original-name` (optional): Original filename
  - `x-category` (optional): File category (profile_picture, work_gallery, document, other)
  - `x-description` (optional): Description of the file
  - `x-is-public` (optional): Whether the file is publicly accessible (true/false)
- Query Parameters (alternative to headers):
  - `category` (optional): File category
  - `description` (optional): Description of the file
  - `isPublic` (optional): Whether the file is publicly accessible (true/false)
- Body: Raw binary data of the file

**Response:**
```json
{
  "message": "File uploaded successfully from blob",
  "file": {
    "_id": "507f1f77bcf86cd799439011",
    "originalName": "example.jpg",
    "filename": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8-1623456789-123456789.jpg",
    "path": "uploads/a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8-1623456789-123456789.jpg",
    "mimetype": "image/jpeg",
    "size": 123456,
    "owner": "507f191e810c19729de860ea",
    "category": "profile_picture",
    "description": "Profile picture",
    "isPublic": false,
    "createdAt": "2023-06-12T10:26:29.000Z",
    "updatedAt": "2023-06-12T10:26:29.000Z",
    "url": "/uploads/a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8-1623456789-123456789.jpg"
  }
}
```

### Get All Files (Admin Only)
**GET** `/api/file`

Retrieves all files in the system. Only accessible by admin users.

### Get User's Files
**GET** `/api/file/my-files`

Retrieves all files owned by the authenticated user.

### Get Specific File
**GET** `/api/file/:id`

Retrieves information about a specific file. Only accessible by the owner or admin users.

### Update File
**PUT** `/api/file/:id`

Updates metadata for a specific file. Only accessible by the owner or admin users.

### Delete File
**DELETE** `/api/file/:id`

Deletes a specific file from both the database and filesystem. Only accessible by the owner or admin users.

### Download File
**GET** `/api/file/download/:id`

Downloads the actual file content. Accessible for public files or by the owner/admin users.

## File Storage
- Files are stored in the `uploads/` directory
- Filenames are generated using UUID to prevent conflicts
- Metadata is stored in MongoDB for efficient querying

## Security
- File type validation to prevent malicious uploads
- Access control based on ownership and user roles
- File size limits to prevent resource exhaustion
- Public/private access control for files

## Supported File Types
- Images: JPEG, PNG, GIF, WEBP
- Documents: PDF, TXT, DOC, DOCX, XLS, XLSX

## File Size Limit
Maximum file size: 5MB

## Error Handling
- Invalid file types will be rejected
- Files exceeding size limits will be rejected
- Unauthorized access attempts will return 403 Forbidden
- Missing files will return 404 Not Found

## Usage Examples

### Uploading a file with multipart form data:
```bash
curl -X POST http://localhost:5000/api/file \
  -H "Cookie: accessToken=YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/your/file.jpg" \
  -F "category=profile_picture" \
  -F "description=My profile picture" \
  -F "isPublic=false"
```

### Uploading a file with binary blob data:
```bash
curl -X POST http://localhost:5000/api/file/blob \
  -H "Cookie: accessToken=YOUR_ACCESS_TOKEN" \
  -H "Content-Type: image/jpeg" \
  -H "x-original-name: profile.jpg" \
  -H "x-category: profile_picture" \
  -H "x-description: My profile picture" \
  -H "x-is-public: false" \
  --data-binary "@/path/to/your/file.jpg"
```