# Alora Backend API Documentation

## Overview

The Alora backend is a Node.js/Express application with MongoDB database integration. It provides a comprehensive API for a service marketplace platform that connects customers with professionals.

## Authentication & Authorization

### Authentication Methods
1. **Password-based authentication** - Traditional username/email/password login
2. **OTP-only authentication** - Phone/email based one-time password authentication
3. **JWT tokens** - Access and refresh tokens for session management
4. **API Key** - Required for all API requests

### Access Control
- **Public endpoints**: No authentication required
- **Authenticated endpoints**: Require valid JWT access token
- **Admin endpoints**: Require admin role in JWT token
- **API Key**: Required for all endpoints

### API Key Requirements
All API endpoints require a valid API key in one of these locations:
- Header: `x-api-key`, `x-apikey`, `api-key`, `apikey`, or `apiKey`
- Query parameter: `apiKey` or `api_key`

Valid API key: `a587e4d8bb883a03b5ea14411c4e1e1d94589702`

## Base URL
```
http://localhost:5000/api
```

## Models

### User Model
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String,
  authMethod: String, // 'password' or 'otp-only'
  role: String, // 'customer', 'professional', or 'admin'
  phone: String,
  fullName: String,
  profilePicture: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    lon: Number,
    lat: Number
  },
  bio: String,
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  isActive: Boolean,
  emailVerified: Boolean,
  phoneVerified: Boolean,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verifyEmailToken: String,
  verifyEmailExpires: Date,
  verifyPhoneToken: String,
  verifyPhoneExpires: Date,
  deletionRequestedAt: Date,
  lastLogin: Date,
  twoFactorEnabled: Boolean,
  twoFactorSecret: String,
  userDetails: ObjectId, // Reference to UserDetails
  professionalProfile: ObjectId, // Reference to Professional
  notifications: [ObjectId], // References to Notification
  bookings: [ObjectId], // References to Booking
  favorites: [ObjectId], // References to Favorite
  reviewsGiven: [ObjectId], // References to Review
  feedbacks: [ObjectId], // References to Feedback
  reachUsMessages: [ObjectId], // References to ReachUs
  settings: {
    emailNotifications: Boolean,
    pushNotifications: Boolean,
    smsNotifications: Boolean,
    marketingEmails: Boolean,
    bookingReminders: Boolean,
    reviewNotifications: Boolean,
    profileVisibility: String, // 'public', 'private', 'professional-only'
    showEmail: Boolean,
    showPhone: Boolean,
    allowDirectMessages: Boolean,
    theme: String, // 'light', 'dark', 'system'
    language: String, // 'en', 'es', 'fr', 'de', 'hi'
    timezone: String,
    twoFactorEnabled: Boolean,
    sessionTimeout: Number // in minutes
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Professional Model
```javascript
{
  _id: ObjectId,
  user: ObjectId, // Reference to User
  category: String, // 'plumbing', 'electrical', 'cleaning', 'carpentry', 'painting', 'other'
  subCategories: [String],
  bio: String,
  skills: [String],
  workGallery: [ObjectId], // References to File
  hourlyRate: Number,
  availability: [{
    day: String, // 'Monday', 'Tuesday', etc.
    timeSlots: [{
      start: String, // Time format HH:MM
      end: String // Time format HH:MM
    }]
  }],
  certifications: [{
    name: String,
    issuingOrganization: String,
    issueDate: Date,
    expirationDate: Date,
    certificateUrl: String
  }],
  experience: {
    years: Number,
    description: String
  },
  isVerified: Boolean,
  verificationRequestedAt: Date,
  verificationRequestedBy: ObjectId, // Reference to User
  ratings: [Number],
  averageRating: Number,
  totalReviews: Number,
  reviews: [ObjectId], // References to Review
  servicesOffered: [ObjectId], // References to Service
  portfolioItems: [{
    title: String,
    description: String,
    images: [ObjectId], // References to File
    completionDate: Date
  }],
  responseTime: Number, // in hours
  cancellationPolicy: String, // 'flexible', 'moderate', 'strict'
  languages: [String], // 'en', 'es', 'fr', 'de', 'hi'
  createdAt: Date,
  updatedAt: Date
}
```

### Service Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  subCategory: String,
  icon: String,
  color: String,
  isActive: Boolean,
  estimatedDuration: Number, // in minutes
  basePrice: Number,
  tags: [String],
  createdBy: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  _id: ObjectId,
  user: ObjectId, // Reference to User (customer)
  professional: ObjectId, // Reference to User (professional)
  professionalProfile: ObjectId, // Reference to Professional
  service: ObjectId, // Reference to Service
  serviceName: String,
  date: Date,
  time: String, // Time format HH:MM
  duration: Number, // in minutes
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  notes: String,
  status: String, // 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'rejected', 'rescheduled'
  cancellationReason: String,
  hourlyRate: Number,
  totalPrice: Number,
  paymentStatus: String, // 'pending', 'completed', 'failed', 'refunded'
  paymentMethod: String, // 'credit-card', 'debit-card', 'paypal', 'bank-transfer', 'cash', 'upi'
  transactionId: String,
  rating: Number, // 1-5
  review: ObjectId, // Reference to Review
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model
```javascript
{
  _id: ObjectId,
  reviewer: ObjectId, // Reference to User
  reviewee: ObjectId, // Reference to User (professional)
  rating: Number, // 0-5
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  _id: ObjectId,
  user: ObjectId, // Reference to User
  title: String,
  message: String,
  type: String, // 'info', 'success', 'warning', 'error'
  read: Boolean,
  readAt: Date,
  archived: Boolean,
  archivedAt: Date,
  url: String,
  actionUrl: String,
  actionText: String,
  relatedEntity: {
    type: String,
    id: ObjectId
  },
  metadata: Object,
  channels: [String], // 'in-app', 'email', 'sms'
  priority: String, // 'low', 'medium', 'high'
  scheduledFor: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### FAQ Model
```javascript
{
  _id: ObjectId,
  question: String,
  answer: String,
  category: String,
  isActive: Boolean,
  createdBy: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### Feedback Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  subject: String,
  message: String,
  rating: Number, // 1-5
  createdAt: Date,
  updatedAt: Date
}
```

### ReachUs Model (Contact Messages)
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication Routes (`/auth`)

#### Register User
- **Method**: POST
- **Endpoint**: `/auth/register`
- **Authentication**: None
- **API Key**: Required
- **Request Body**:
```json
{
  "fullName": "string",
  "username": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "authMethod": "string", // Optional: 'password' or 'otp-only'
  "role": "string" // Optional: 'customer', 'professional', 'admin'
}
```
- **Success Response**: 201 Created
```json
{
  "msg": "Registration successful",
  "user": {
    "id": "ObjectId",
    "username": "string",
    "email": "string",
    "role": "string",
    "fullName": "string",
    "phone": "string",
    "authMethod": "string"
  }
}
```
- **Error Responses**:
  - 400 Bad Request: Validation errors or user already exists
  - 500 Internal Server Error: Server error

#### Login (Password-based)
- **Method**: POST
- **Endpoint**: `/auth/login`
- **Authentication**: None
- **API Key**: Required
- **Request Body**:
```json
{
  "identifier": "string", // email, username, or phone
  "password": "string"
}
```
- **Success Response**: 200 OK
```json
{
  "msg": "Login successful",
  "user": {
    "id": "ObjectId",
    "username": "string",
    "email": "string",
    "role": "string",
    "fullName": "string",
    "phone": "string",
    "authMethod": "string"
  }
}
```
- **Error Responses**:
  - 400 Bad Request: Validation errors or invalid credentials
  - 500 Internal Server Error: Server error

#### Request OTP for Login
- **Method**: POST
- **Endpoint**: `/auth/request-otp`
- **Authentication**: None
- **API Key**: Required
- **Request Body**:
```json
{
  "identifier": "string" // email, username, or phone
}
```
- **Success Response**: 200 OK
```json
{
  "msg": "OTP sent successfully",
  "method": "string" // 'email' or 'sms'
}
```
- **Error Responses**:
  - 400 Bad Request: Validation errors or user not found
  - 500 Internal Server Error: Server error

#### Verify OTP for Login
- **Method**: POST
- **Endpoint**: `/auth/verify-otp`
- **Authentication**: None
- **API Key**: Required
- **Request Body**:
```json
{
  "identifier": "string", // email, username, or phone
  "otp": "string" // 6-digit OTP
}
```
- **Success Response**: 200 OK
```json
{
  "msg": "Login successful",
  "user": {
    "id": "ObjectId",
    "username": "string",
    "email": "string",
    "role": "string",
    "fullName": "string",
    "phone": "string",
    "authMethod": "string"
  }
}
```
- **Error Responses**:
  - 400 Bad Request: Validation errors, invalid/expired OTP, or maximum attempts exceeded
  - 500 Internal Server Error: Server error

#### Logout
- **Method**: POST
- **Endpoint**: `/auth/logout`
- **Authentication**: None
- **API Key**: Required
- **Request Body**:
```json
{
  "refreshToken": "string" // Optional if not in cookies
}
```
- **Success Response**: 200 OK
```json
{
  "msg": "Logged out successfully"
}
```
- **Error Responses**:
  - 400 Bad Request: No refresh token provided
  - 500 Internal Server Error: Server error

#### Refresh Token
- **Method**: POST
- **Endpoint**: `/auth/refresh`
- **Authentication**: None
- **API Key**: Required
- **Request Body**:
```json
{
  "refreshToken": "string" // Optional if in cookies
}
```
- **Success Response**: 200 OK
```json
{
  "msg": "Access token refreshed"
}
```
- **Error Responses**:
  - 400 Bad Request: No refresh token provided
  - 401 Unauthorized: Invalid or expired refresh token
  - 500 Internal Server Error: Server error

#### Get Current User
- **Method**: GET
- **Endpoint**: `/auth/me`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "user": {
    // Full user object without sensitive fields
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 500 Internal Server Error: Server error

### User Routes (`/user`)

#### Get All Users (Admin Only)
- **Method**: GET
- **Endpoint**: `/user`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Success Response**: 200 OK
```json
[
  {
    // User objects without sensitive fields
  }
]
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 500 Internal Server Error: Server error

#### Get User by ID
- **Method**: GET
- **Endpoint**: `/user/:id`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  // User object without sensitive fields
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 404 Not Found: User not found
  - 500 Internal Server Error: Server error

#### Update User Profile
- **Method**: PUT
- **Endpoint**: `/user`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Request Body**:
```json
{
  // Fields to update (sensitive fields will be ignored)
}
```
- **Success Response**: 200 OK
```json
{
  "message": "User updated successfully",
  "user": {
    // Updated user object
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 404 Not Found: User not found
  - 500 Internal Server Error: Server error

#### Update User by ID (Admin Only)
- **Method**: PUT
- **Endpoint**: `/user/:id`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Request Body**:
```json
{
  // Fields to update
}
```
- **Success Response**: 200 OK
```json
{
  "message": "User updated successfully",
  "user": {
    // Updated user object
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 404 Not Found: User not found
  - 500 Internal Server Error: Server error

#### Delete User (Admin Only)
- **Method**: DELETE
- **Endpoint**: `/user/:id`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "User deleted successfully"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 404 Not Found: User not found
  - 500 Internal Server Error: Server error

#### Get User Reviews
- **Method**: GET
- **Endpoint**: `/user/:id/reviews`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
[
  {
    // Review objects with populated reviewer and reviewee
  }
]
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 500 Internal Server Error: Server error

#### Get User Settings
- **Method**: GET
- **Endpoint**: `/user/settings`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "settings": {
    // User settings object with defaults
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 404 Not Found: User not found
  - 500 Internal Server Error: Server error

#### Update User Settings
- **Method**: PUT
- **Endpoint**: `/user/settings`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Request Body**:
```json
{
  "settings": {
    // Settings object to update
  }
}
```
- **Success Response**: 200 OK
```json
{
  "message": "Settings updated successfully",
  "settings": {
    // Updated settings object
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 404 Not Found: User not found
  - 500 Internal Server Error: Server error

#### Change Password
- **Method**: PUT
- **Endpoint**: `/user/change-password`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Request Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```
- **Success Response**: 200 OK
```json
{
  "message": "Password changed successfully"
}
```
- **Error Responses**:
  - 400 Bad Request: Validation errors or incorrect current password
  - 401 Unauthorized: Invalid or missing access token
  - 404 Not Found: User not found
  - 500 Internal Server Error: Server error

#### Toggle Two-Factor Authentication
- **Method**: PUT
- **Endpoint**: `/user/toggle-2fa`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Request Body**:
```json
{
  "enabled": "boolean"
}
```
- **Success Response**: 200 OK
```json
{
  "message": "Two-factor authentication enabled/disabled successfully",
  "twoFactorEnabled": "boolean"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 404 Not Found: User not found
  - 500 Internal Server Error: Server error

#### Delete Account
- **Method**: DELETE
- **Endpoint**: `/user/delete-account`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "Account deletion requested. Your account will be deleted in 30 days. Contact support to cancel this request."
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 404 Not Found: User not found
  - 500 Internal Server Error: Server error

### Professional Routes (`/professionals`)

#### Get All Professionals
- **Method**: GET
- **Endpoint**: `/professionals`
- **Authentication**: None
- **API Key**: Required
- **Success Response**: 200 OK
```json
[
  {
    // Professional objects with populated user and services
  }
]
```
- **Error Responses**:
  - 500 Internal Server Error: Server error

#### Get Professional by ID
- **Method**: GET
- **Endpoint**: `/professionals/:id`
- **Authentication**: None
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  // Professional object with populated user and services
}
```
- **Error Responses**:
  - 404 Not Found: Professional not found
  - 500 Internal Server Error: Server error

#### Get Professionals by Category
- **Method**: GET
- **Endpoint**: `/professionals/category/:category`
- **Authentication**: None
- **API Key**: Required
- **Success Response**: 200 OK
```json
[
  {
    // Professional objects with populated user and services
  }
]
```
- **Error Responses**:
  - 500 Internal Server Error: Server error

#### Create Professional Profile
- **Method**: POST
- **Endpoint**: `/professionals`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Request Body**:
```json
{
  // Professional profile fields
}
```
- **Success Response**: 201 Created
```json
{
  "message": "Professional profile created successfully",
  "professional": {
    // Created professional object
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User doesn't have professional role
  - 400 Bad Request: Profile already exists
  - 500 Internal Server Error: Server error

#### Update Professional Profile
- **Method**: PUT
- **Endpoint**: `/professionals/:id`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Request Body**:
```json
{
  // Fields to update
}
```
- **Success Response**: 200 OK
```json
{
  "message": "Professional profile updated successfully",
  "professional": {
    // Updated professional object
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not owner or admin
  - 404 Not Found: Professional profile not found
  - 500 Internal Server Error: Server error

#### Request Profile Verification
- **Method**: POST
- **Endpoint**: `/professionals/:id/request-verification`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "Verification request submitted successfully"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not owner
  - 404 Not Found: Professional profile not found
  - 500 Internal Server Error: Server error

#### Verify Professional Profile (Admin Only)
- **Method**: PUT
- **Endpoint**: `/professionals/:id/verify`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "Professional profile verified successfully",
  "professional": {
    // Verified professional object
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 404 Not Found: Professional profile not found
  - 500 Internal Server Error: Server error

#### Get Professional Portfolio
- **Method**: GET
- **Endpoint**: `/professionals/:id/portfolio`
- **Authentication**: None
- **API Key**: Required
- **Success Response**: 200 OK
```json
[
  {
    // Portfolio items with populated images
  }
]
```
- **Error Responses**:
  - 404 Not Found: Professional not found
  - 500 Internal Server Error: Server error

#### Add Portfolio Item
- **Method**: POST
- **Endpoint**: `/professionals/:id/portfolio`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Request Body**:
```json
{
  // Portfolio item fields
}
```
- **Success Response**: 201 Created
```json
{
  "message": "Portfolio item added successfully",
  "portfolioItems": [
    // Updated portfolio items array
  ]
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not owner
  - 404 Not Found: Professional profile not found
  - 500 Internal Server Error: Server error

#### Update Portfolio Item
- **Method**: PUT
- **Endpoint**: `/professionals/:id/portfolio/:itemId`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Request Body**:
```json
{
  // Fields to update
}
```
- **Success Response**: 200 OK
```json
{
  "message": "Portfolio item updated successfully",
  "portfolioItems": [
    // Updated portfolio items array
  ]
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not owner
  - 404 Not Found: Professional profile or portfolio item not found
  - 500 Internal Server Error: Server error

#### Delete Portfolio Item
- **Method**: DELETE
- **Endpoint**: `/professionals/:id/portfolio/:itemId`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "Portfolio item deleted successfully",
  "portfolioItems": [
    // Updated portfolio items array
  ]
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not owner
  - 404 Not Found: Professional profile or portfolio item not found
  - 500 Internal Server Error: Server error

### Service Routes (`/services`)

#### Get All Services
- **Method**: GET
- **Endpoint**: `/services`
- **Authentication**: None
- **API Key**: Required
- **Success Response**: 200 OK
```json
[
  {
    // Service objects
  }
]
```
- **Error Responses**:
  - 500 Internal Server Error: Server error

#### Create Service (Admin Only)
- **Method**: POST
- **Endpoint**: `/services`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Request Body**:
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "icon": "string",
  "color": "string" // Optional, defaults to 'blue'
}
```
- **Success Response**: 201 Created
```json
{
  // Created service object
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 400 Bad Request: Missing required fields
  - 500 Internal Server Error: Server error

#### Create Services in Bulk (Admin Only)
- **Method**: POST
- **Endpoint**: `/services/bulk`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Request Body**:
```json
[
  {
    // Service objects
  }
]
```
- **Success Response**: 201 Created
```json
[
  {
    // Created service objects
  }
]
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 400 Bad Request: Invalid service data
  - 500 Internal Server Error: Server error

#### Update Service (Admin Only)
- **Method**: PUT
- **Endpoint**: `/services/:id`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Request Body**:
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "icon": "string",
  "color": "string"
}
```
- **Success Response**: 200 OK
```json
{
  // Updated service object
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 404 Not Found: Service not found
  - 500 Internal Server Error: Server error

#### Delete Service (Admin Only)
- **Method**: DELETE
- **Endpoint**: `/services/:id`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "Service deleted successfully"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 404 Not Found: Service not found
  - 500 Internal Server Error: Server error

### Booking Routes (`/booking`)

#### Create Booking
- **Method**: POST
- **Endpoint**: `/booking`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Request Body**:
```json
{
  "professionalId": "ObjectId",
  "service": "string",
  "date": "ISO date string",
  "time": "string",
  "address": {
    // Address object
  },
  "notes": "string" // Optional
}
```
- **Success Response**: 201 Created
```json
{
  "message": "Booking created successfully",
  "booking": {
    // Created booking object with populated user and professional
  }
}
```
- **Error Responses**:
  - 400 Bad Request: Validation errors or invalid professional
  - 401 Unauthorized: Invalid or missing access token
  - 500 Internal Server Error: Server error

#### Get All Bookings for User
- **Method**: GET
- **Endpoint**: `/booking`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
[
  {
    // Booking objects with populated professional
  }
]
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 500 Internal Server Error: Server error

#### Get Booking by ID
- **Method**: GET
- **Endpoint**: `/booking/:id`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  // Booking object with populated user and professional
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User not authorized to view this booking
  - 404 Not Found: Booking not found
  - 500 Internal Server Error: Server error

#### Update Booking Status
- **Method**: PUT
- **Endpoint**: `/booking/:id/status`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Request Body**:
```json
{
  "status": "string" // 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'
}
```
- **Success Response**: 200 OK
```json
{
  "message": "Booking status updated",
  "booking": {
    // Updated booking object with populated user and professional
  }
}
```
- **Error Responses**:
  - 400 Bad Request: Validation errors or invalid status
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User not authorized to update this booking
  - 404 Not Found: Booking not found
  - 500 Internal Server Error: Server error

#### Add Rating to Booking
- **Method**: PUT
- **Endpoint**: `/booking/:id/rating`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Request Body**:
```json
{
  "rating": "number", // 1-5
  "review": "string" // Optional
}
```
- **Success Response**: 200 OK
```json
{
  "message": "Rating added successfully",
  "booking": {
    // Updated booking object
  }
}
```
- **Error Responses**:
  - 400 Bad Request: Validation errors or booking not completed
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User not authorized to rate this booking
  - 404 Not Found: Booking not found
  - 500 Internal Server Error: Server error

#### Get Bookings for Professional
- **Method**: GET
- **Endpoint**: `/booking/professional/:professionalId`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
[
  {
    // Booking objects with populated user
  }
]
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User not authorized to view these bookings
  - 500 Internal Server Error: Server error

#### Delete Booking (Admin Only)
- **Method**: DELETE
- **Endpoint**: `/booking/:id`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "Booking deleted successfully"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 404 Not Found: Booking not found
  - 500 Internal Server Error: Server error

### Review Routes (`/review`)

#### Create Review
- **Method**: POST
- **Endpoint**: `/review`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Request Body**:
```json
{
  "reviewer": "ObjectId",
  "reviewee": "ObjectId",
  "rating": "number", // 0-5
  "comment": "string" // Optional
}
```
- **Success Response**: 201 Created
```json
{
  "message": "Review created successfully",
  "review": {
    // Created review object with populated reviewer and reviewee
  }
}
```
- **Error Responses**:
  - 400 Bad Request: Validation errors or user trying to review themselves
  - 401 Unauthorized: Invalid or missing access token
  - 500 Internal Server Error: Server error

#### Get All Reviews
- **Method**: GET
- **Endpoint**: `/review`
- **Authentication**: None
- **API Key**: Required
- **Query Parameters**:
  - professionalId: Filter reviews for a specific professional
- **Success Response**: 200 OK
```json
[
  {
    // Review objects with populated reviewer and reviewee
  }
]
```
- **Error Responses**:
  - 500 Internal Server Error: Server error

#### Get Review by ID
- **Method**: GET
- **Endpoint**: `/review/:id`
- **Authentication**: None
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  // Review object with populated reviewer and reviewee
}
```
- **Error Responses**:
  - 404 Not Found: Review not found
  - 500 Internal Server Error: Server error

#### Update Review
- **Method**: PUT
- **Endpoint**: `/review/:id`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Request Body**:
```json
{
  "rating": "number", // 0-5 (optional)
  "comment": "string" // Optional
}
```
- **Success Response**: 200 OK
```json
{
  "message": "Review updated successfully",
  "review": {
    // Updated review object with populated reviewer and reviewee
  }
}
```
- **Error Responses**:
  - 400 Bad Request: Invalid rating
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User not authorized to update this review
  - 404 Not Found: Review not found
  - 500 Internal Server Error: Server error

#### Delete Review
- **Method**: DELETE
- **Endpoint**: `/review/:id`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "Review deleted successfully"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User not authorized to delete this review
  - 404 Not Found: Review not found
  - 500 Internal Server Error: Server error

### Notification Routes (`/notification`)

#### Get Notifications for User
- **Method**: GET
- **Endpoint**: `/notification`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Query Parameters**:
  - page: Page number (default: 1)
  - limit: Items per page (default: 20)
  - read: Filter by read status (true/false)
  - archived: Filter by archived status (true/false)
- **Success Response**: 200 OK
```json
{
  "notifications": [
    {
      // Notification objects
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "pages": "number"
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 500 Internal Server Error: Server error

#### Get Unread Notifications Count
- **Method**: GET
- **Endpoint**: `/notification/unread-count`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "count": "number"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 500 Internal Server Error: Server error

#### Mark Notification as Read
- **Method**: PUT
- **Endpoint**: `/notification/:id/read`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "Notification marked as read",
  "notification": {
    // Updated notification object
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 404 Not Found: Notification not found
  - 500 Internal Server Error: Server error

#### Mark Notification as Archived
- **Method**: PUT
- **Endpoint**: `/notification/:id/archive`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "Notification archived successfully",
  "notification": {
    // Updated notification object
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 404 Not Found: Notification not found
  - 500 Internal Server Error: Server error

#### Mark All Notifications as Read
- **Method**: PUT
- **Endpoint**: `/notification/read-all`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "All notifications marked as read"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 500 Internal Server Error: Server error

#### Archive All Read Notifications
- **Method**: PUT
- **Endpoint**: `/notification/archive-all-read`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "All read notifications archived"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 500 Internal Server Error: Server error

#### Delete Notification
- **Method**: DELETE
- **Endpoint**: `/notification/:id`
- **Authentication**: Required (Access Token)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "Notification deleted successfully"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 404 Not Found: Notification not found
  - 500 Internal Server Error: Server error

### Admin Routes (`/admin`)

#### Get Admin Dashboard Statistics
- **Method**: GET
- **Endpoint**: `/admin/stats`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "stats": {
    "users": {
      "total": "number",
      "professionals": "number",
      "customers": "number",
      "admins": "number"
    },
    "services": {
      "total": "number"
    },
    "bookings": {
      "total": "number",
      "pending": "number",
      "confirmed": "number",
      "completed": "number",
      "cancelled": "number"
    },
    "content": {
      "faqs": "number",
      "feedback": "number",
      "reviews": "number",
      "messages": "number"
    },
    "ratings": {
      "avgFeedback": "number",
      "avgReview": "number",
      "avgBooking": "number",
      "totalBookingRatings": "number",
      "bookingDistribution": {
        "1": "number",
        "2": "number",
        "3": "number",
        "4": "number",
        "5": "number"
      }
    }
  },
  "recentActivity": {
    "bookings": [
      // Recent booking objects
    ],
    "users": [
      // Recent user objects
    ]
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 500 Internal Server Error: Server error

#### Get All Users with Pagination
- **Method**: GET
- **Endpoint**: `/admin/users`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Query Parameters**:
  - page: Page number (default: 1)
  - limit: Items per page (default: 10)
  - role: Filter by role
  - isActive: Filter by active status (true/false)
  - search: Search by fullName, email, or username
- **Success Response**: 200 OK
```json
{
  "users": [
    {
      // User objects without sensitive fields
    }
  ],
  "totalPages": "number",
  "currentPage": "number",
  "total": "number"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 500 Internal Server Error: Server error

#### Delete User (Enhanced)
- **Method**: DELETE
- **Endpoint**: `/admin/users/:id`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "User and related data deleted successfully"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin or trying to delete own account
  - 404 Not Found: User not found
  - 500 Internal Server Error: Server error

#### Bulk Update Users
- **Method**: PATCH
- **Endpoint**: `/admin/users/bulk`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Request Body**:
```json
{
  "userIds": ["ObjectId"],
  "updates": {
    // Fields to update
  }
}
```
- **Success Response**: 200 OK
```json
{
  "message": "Users updated successfully",
  "modifiedCount": "number"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 400 Bad Request: Invalid user IDs array
  - 500 Internal Server Error: Server error

#### Get All Feedback with Pagination
- **Method**: GET
- **Endpoint**: `/admin/feedback`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Query Parameters**:
  - page: Page number (default: 1)
  - limit: Items per page (default: 10)
  - rating: Filter by rating
  - sortBy: Field to sort by (default: 'createdAt')
  - sortOrder: Sort order ('asc' or 'desc', default: 'desc')
- **Success Response**: 200 OK
```json
{
  "feedback": [
    {
      // Feedback objects
    }
  ],
  "totalPages": "number",
  "currentPage": "number",
  "total": "number"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 500 Internal Server Error: Server error

#### Update Feedback
- **Method**: PUT
- **Endpoint**: `/admin/feedback/:id`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Request Body**:
```json
{
  "rating": "number",
  "subject": "string",
  "message": "string"
}
```
- **Success Response**: 200 OK
```json
{
  "message": "Feedback updated successfully",
  "feedback": {
    // Updated feedback object
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 404 Not Found: Feedback not found
  - 500 Internal Server Error: Server error

#### Delete Feedback
- **Method**: DELETE
- **Endpoint**: `/admin/feedback/:id`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "Feedback deleted successfully"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 404 Not Found: Feedback not found
  - 500 Internal Server Error: Server error

#### Get All Reviews with Pagination
- **Method**: GET
- **Endpoint**: `/admin/reviews`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Query Parameters**:
  - page: Page number (default: 1)
  - limit: Items per page (default: 10)
  - rating: Filter by rating
  - sortBy: Field to sort by (default: 'createdAt')
  - sortOrder: Sort order ('asc' or 'desc', default: 'desc')
- **Success Response**: 200 OK
```json
{
  "reviews": [
    {
      // Review objects with populated reviewer and reviewee
    }
  ],
  "totalPages": "number",
  "currentPage": "number",
  "total": "number"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 500 Internal Server Error: Server error

#### Update Review
- **Method**: PUT
- **Endpoint**: `/admin/reviews/:id`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Request Body**:
```json
{
  "rating": "number",
  "comment": "string"
}
```
- **Success Response**: 200 OK
```json
{
  "message": "Review updated successfully",
  "review": {
    // Updated review object with populated reviewer and reviewee
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 404 Not Found: Review not found
  - 500 Internal Server Error: Server error

#### Delete Review
- **Method**: DELETE
- **Endpoint**: `/admin/reviews/:id`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "Review deleted successfully"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 404 Not Found: Review not found
  - 500 Internal Server Error: Server error

#### Get All Bookings with Enhanced Filtering
- **Method**: GET
- **Endpoint**: `/admin/bookings`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Query Parameters**:
  - page: Page number (default: 1)
  - limit: Items per page (default: 10)
  - status: Filter by status
  - dateFrom: Filter by date from
  - dateTo: Filter by date to
  - service: Filter by service name
  - hasRating: Filter by rating presence ('true' or 'false')
  - sortBy: Field to sort by (default: 'createdAt')
  - sortOrder: Sort order ('asc' or 'desc', default: 'desc')
- **Success Response**: 200 OK
```json
{
  "bookings": [
    {
      // Booking objects with populated user and professional
    }
  ],
  "totalPages": "number",
  "currentPage": "number",
  "total": "number"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 500 Internal Server Error: Server error

#### Get Booking Ratings Statistics
- **Method**: GET
- **Endpoint**: `/admin/bookings/ratings`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "statistics": {
    "average": "number",
    "total": "number",
    "distribution": {
      "1": "number",
      "2": "number",
      "3": "number",
      "4": "number",
      "5": "number"
    }
  },
  "bookings": [
    {
      // Booking objects with ratings, populated user and professional
    }
  ]
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 500 Internal Server Error: Server error

#### Update Booking Status (Admin)
- **Method**: PATCH
- **Endpoint**: `/admin/bookings/:id/status`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Request Body**:
```json
{
  "status": "string" // 'pending', 'confirmed', 'completed', 'cancelled'
}
```
- **Success Response**: 200 OK
```json
{
  "message": "Booking status updated",
  "booking": {
    // Updated booking object with populated user and professional
  }
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 400 Bad Request: Invalid status
  - 404 Not Found: Booking not found
  - 500 Internal Server Error: Server error

#### Delete Booking
- **Method**: DELETE
- **Endpoint**: `/admin/bookings/:id`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "Booking deleted successfully"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 404 Not Found: Booking not found
  - 500 Internal Server Error: Server error

#### Get System Health
- **Method**: GET
- **Endpoint**: `/admin/system/health`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "status": "healthy",
  "database": "connected",
  "counts": {
    "users": "number",
    "services": "number",
    "bookings": "number"
  },
  "timestamp": "ISO date string"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 500 Internal Server Error: Server error

#### Get All Contact Messages with Pagination
- **Method**: GET
- **Endpoint**: `/admin/messages`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Query Parameters**:
  - page: Page number (default: 1)
  - limit: Items per page (default: 10)
  - search: Search by fullName, email, subject, or message
  - sortBy: Field to sort by (default: 'createdAt')
  - sortOrder: Sort order ('asc' or 'desc', default: 'desc')
- **Success Response**: 200 OK
```json
{
  "messages": [
    {
      // ReachUs objects
    }
  ],
  "totalPages": "number",
  "currentPage": "number",
  "total": "number"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 500 Internal Server Error: Server error

#### Delete Message
- **Method**: DELETE
- **Endpoint**: `/admin/messages/:id`
- **Authentication**: Required (Access Token, Admin Role)
- **API Key**: Required
- **Success Response**: 200 OK
```json
{
  "message": "Message deleted successfully"
}
```
- **Error Responses**:
  - 401 Unauthorized: Invalid or missing access token
  - 403 Forbidden: User is not admin
  - 404 Not Found: Message not found
  - 500 Internal Server Error: Server error

### FAQ Routes (`/faq`)
(Note: Implementation details not fully analyzed, but likely includes CRUD operations for FAQ content)

### Feedback Routes (`/feedback`)
(Note: Implementation details not fully analyzed, but likely includes CRUD operations for user feedback)

### Reach Us Routes (`/reachus`)
(Note: Implementation details not fully analyzed, but likely includes operations for contact form submissions)

## Error Status Codes

### 2xx Success
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **204 No Content**: Request successful, no content to return

### 4xx Client Errors
- **400 Bad Request**: Invalid request data or validation errors
- **401 Unauthorized**: Missing or invalid authentication credentials
- **403 Forbidden**: Access denied, insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (e.g., user already exists)

### 5xx Server Errors
- **500 Internal Server Error**: Unexpected server error
- **503 Service Unavailable**: Service temporarily unavailable

## Common Error Response Format

```json
{
  "errors": [
    {
      "msg": "Error message"
    }
  ]
}
```

or

```json
{
  "message": "Error message"
}
```

or

```json
{
  "error": "Error message"
}
```

This comprehensive documentation covers all the major aspects of your backend API, including authentication methods, models, endpoints with their request/response formats, and error handling patterns. The API uses a combination of JWT tokens for user authentication and API keys for application-level access control.