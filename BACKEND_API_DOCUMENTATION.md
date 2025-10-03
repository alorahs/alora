# Alora Backend API Documentation

> **Generated on:** October 3, 2025  
> **Project:** Alora Service Marketplace Platform  
> **Backend Framework:** Express.js with MongoDB  

## Table of Contents
- [Overview](#overview)
- [Base Configuration](#base-configuration)
- [Authentication & Authorization](#authentication--authorization)
- [API Endpoints](#api-endpoints)
- [Real-time Features](#real-time-features)
- [Security Features](#security-features)
- [Usage Summary](#usage-summary)

## Overview

The Alora backend provides a comprehensive REST API for a service marketplace platform connecting customers with service professionals. The API supports user management, service bookings, reviews, favorites, notifications, and administrative functions.

**Base URL:** `/api`

## Base Configuration

### Server Details
- **Port:** 5000 (default) or from environment
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with refresh tokens
- **File Storage:** MongoDB GridFS (via File model)
- **Real-time:** Socket.IO for notifications

### Middleware Stack
- **CORS:** Configured for multiple origins
- **Security:** Helmet for security headers
- **Logging:** Morgan for request logging
- **Parsing:** Express JSON parser
- **Cookies:** Cookie-parser for token management

## Authentication & Authorization

### Roles
- **Customer:** Can book services, write reviews, manage favorites
- **Professional:** Can receive bookings, manage availability
- **Admin:** Full system access, user management, content management

### Token System
- **Access Token:** 1 hour expiry, stored in HTTP-only cookie
- **Refresh Token:** 7 days expiry, stored in database and cookie
- **Email Verification Token:** 15 minutes expiry

## API Endpoints

### 🔐 Authentication APIs (`/api/auth`)
**Access Level:** Public/Authenticated

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| POST | `/auth/register` | Public | User registration | `{fullName, username, email, phone, password, role}` | `{msg: "User registered successfully"}` |
| POST | `/auth/login` | Public | User login | `{email/username/phone, password}` | `{msg: "Login successful", user: {...}}` |
| POST | `/auth/logout` | Public | User logout | - | `{msg: "Logged out successfully"}` |
| POST | `/auth/refresh` | Cookie | Refresh access token | - | `{msg: "Access token refreshed"}` |
| GET | `/auth/me` | Authenticated | Get current user | - | `{user: {...}}` |

**Used by:** 
- Frontend authentication components
- User registration/login forms
- Token management systems

---

### 👤 User Management APIs (`/api/user`)
**Access Level:** Authenticated/Admin

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| GET | `/user` | Admin | Get all users | - | `[{user}, ...]` |
| GET | `/user/:id` | Authenticated | Get specific user | - | `{user}` |
| PUT | `/user` | Authenticated | Update own profile | `{fullName, phone, ...}` | `{message, user}` |
| PUT | `/user/:id` | Admin | Update any user | `{...updates}` | `{message, user}` |
| DELETE | `/user/:id` | Admin | Delete user | - | `{message}` |
| GET | `/user/:id/reviews` | Authenticated | Get user reviews | - | `[{review}, ...]` |
| GET | `/user/settings` | Authenticated | Get user settings | - | `{settings}` |
| PUT | `/user/settings` | Authenticated | Update user settings | `{settings}` | `{message, settings}` |

**Used by:**
- User profile pages
- Settings pages
- Admin user management dashboard
- Profile editing forms

---

### 🛠️ Service Management APIs (`/api/services`)
**Access Level:** Public (read), Admin (write)

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| GET | `/services` | Public | Get all services | - | `[{service}, ...]` |
| POST | `/services` | Admin | Create new service | `{title, description, category, icon, color}` | `{service}` |
| POST | `/services/bulk` | Admin | Create multiple services | `[{service}, ...]` | `[{service}, ...]` |
| PUT | `/services/:id` | Admin | Update service | `{title, description, ...}` | `{service}` |
| DELETE | `/services/:id` | Admin | Delete service | - | `{message}` |

**Used by:**
- Home page service listings
- Service category pages
- Admin service management
- Service search functionality

---

### 📅 Booking APIs (`/api/booking`)
**Access Level:** Authenticated

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| POST | `/booking` | Authenticated | Create new booking | `{professionalId, service, date, time, address, notes}` | `{message, booking}` |
| GET | `/booking` | Authenticated | Get user's bookings | - | `[{booking}, ...]` |
| GET | `/booking/:id` | Authenticated | Get specific booking | - | `{booking}` |
| PUT | `/booking/:id/status` | Authenticated | Update booking status | `{status}` | `{message, booking}` |
| PUT | `/booking/:id/rating` | Authenticated | Rate completed booking | `{rating, review}` | `{message, booking}` |

**Booking Statuses:** `pending`, `confirmed`, `completed`, `cancelled`, `rejected`

**Used by:**
- Customer booking forms
- Professional booking management
- Booking history pages
- Status update interfaces

---

### ⭐ Review APIs (`/api/review`)
**Access Level:** Public (read), Authenticated (write)

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| POST | `/review` | Authenticated | Create review | `{reviewer, reviewee, rating, comment}` | `{message, review}` |
| GET | `/review` | Public | Get all reviews | Query: `?professionalId=xxx` | `[{review}, ...]` |
| GET | `/review/:id` | Public | Get specific review | - | `{review}` |
| PUT | `/review/:id` | Admin/Owner | Update review | `{rating, comment}` | `{message, review}` |
| DELETE | `/review/:id` | Admin/Owner | Delete review | - | `{message}` |

**Used by:**
- Professional profile pages
- Review submission forms
- Review management interfaces
- Rating displays

---

### ❤️ Favorites APIs (`/api/favorite`)
**Access Level:** Authenticated

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| POST | `/favorite` | Authenticated | Add to favorites | `{professionalId}` | `{message, favorite}` |
| GET | `/favorite` | Authenticated | Get user favorites | - | `[{favorite}, ...]` |
| DELETE | `/favorite/:professionalId` | Authenticated | Remove from favorites | - | `{message}` |
| GET | `/favorite/:professionalId` | Authenticated | Check favorite status | - | `{isFavorited}` |

**Used by:**
- Favorite buttons on professional profiles
- Favorites page
- Wishlist management
- UI state management

---

### 🔔 Notification APIs (`/api/notification`)
**Access Level:** Authenticated

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| GET | `/notification` | Authenticated | Get user notifications | - | `[{notification}, ...]` |
| PUT | `/notification/:id/read` | Authenticated | Mark notification as read | - | `{message, notification}` |
| PUT | `/notification/read-all` | Authenticated | Mark all as read | - | `{message}` |

**Notification Types:** `info`, `success`, `warning`, `error`

**Used by:**
- Notification center
- Real-time notification displays
- Notification management interfaces

---

### ❓ FAQ APIs (`/api/faq`)
**Access Level:** Public (read), Admin (write)

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| GET | `/faq` | Public | Get all FAQs | - | `[{faq}, ...]` |
| GET | `/faq/:id` | Public | Get specific FAQ | - | `{faq}` |
| POST | `/faq` | Admin | Create FAQ | `{type, question, answer}` | `{message, faq}` |
| PUT | `/faq/:id` | Admin | Update FAQ | `{type, question, answer}` | `{message, faq}` |
| DELETE | `/faq/:id` | Admin | Delete FAQ | - | `{message}` |

**Used by:**
- FAQ pages
- Help sections
- Admin content management
- Support interfaces

---

### 💬 Feedback APIs (`/api/feedback`)
**Access Level:** Public (submit), Admin (manage)

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| POST | `/feedback` | Public | Submit feedback | `{rating, subject, message, name, email}` | `{message, feedback}` |
| GET | `/feedback` | Admin | Get all feedback | - | `[{feedback}, ...]` |
| GET | `/feedback/:id` | Admin | Get specific feedback | - | `{feedback}` |
| PUT | `/feedback/:id` | Admin | Update feedback | `{rating, subject, message}` | `{message, feedback}` |
| DELETE | `/feedback/:id` | Admin | Delete feedback | - | `{message}` |

**Rating Range:** 1-5 stars

**Used by:**
- Feedback forms
- Customer satisfaction surveys
- Admin feedback management
- Quality assurance processes

---

### 📞 Contact/Reach Us APIs (`/api/reachus`)
**Access Level:** Public (submit), Admin (manage)

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| POST | `/reachus` | Public | Submit contact form | `{fullName, email, subject, message}` | `{message}` |
| GET | `/reachus` | Admin | Get all messages | - | `[{message}, ...]` |
| GET | `/reachus/:id` | Admin | Get specific message | - | `{message}` |
| PUT | `/reachus/:id` | Admin | Update message | `{fullName, email, subject, message}` | `{message, data}` |
| DELETE | `/reachus/:id` | Admin | Delete message | - | `{message}` |

**Used by:**
- Contact forms
- Customer support
- Admin message management
- Communication tracking

---

### 🏢 About Us APIs (`/api/aboutus`)
**Access Level:** Public (read), Admin (write)

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| GET | `/aboutus` | Public | Get about us info | - | `{aboutUs}` |
| POST | `/aboutus` | Admin | Create about us | `{title, description, ...}` | `{aboutUs}` |
| PUT | `/aboutus/:id` | Admin | Update about us | `{...updates}` | `{aboutUs}` |
| POST | `/aboutus/initialize` | Admin | Initialize default content | - | `{aboutUs}` |

**Fields:** `title`, `description`, `ourMission`, `ourVision`, `ourValues`, `teamMembers`, `contactEmail`, `contactPhone`, `address`, `socialLinks`

**Used by:**
- About us pages
- Company information displays
- Admin content management
- SEO content

---

### 📁 File Management APIs (`/api/files`)
**Access Level:** Public

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| GET | `/files/:id` | Public | Get/view file | - | File stream |
| POST | `/files` | Public | Upload file | FormData with file | `{message, file}` |
| PUT | `/files/:id` | Public | Update file | FormData with file | `{message, file}` |
| DELETE | `/files/:id` | Public | Delete file | - | `{message, file}` |

**Supported Formats:** Images, documents, PDFs
**Storage:** MongoDB GridFS equivalent

**Used by:**
- Profile picture uploads
- Service image management
- Document attachments
- Media galleries

---

### 🗺️ Navigation/Geocoding APIs (`/api/geocode`)
**Access Level:** Public

| Method | Endpoint | Access | Description | Query Params | Response |
|--------|----------|--------|-------------|-------------|----------|
| GET | `/geocode/reverse` | Public | Get address from coordinates | `lat`, `lon` | `{address data}` |
| GET | `/geocode/forward` | Public | Get coordinates from address | `address` | `{lat, lon}` |

**Provider:** OpenStreetMap Nominatim API

**Used by:**
- Location detection
- Address autocomplete
- Map integration
- Service area calculation

---

### 🔑 Token Management APIs (`/api/refresh-token`)
**Access Level:** Authenticated/Admin

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| GET | `/refresh-token` | Admin | Get all refresh tokens | - | `[{token}, ...]` |
| GET | `/refresh-token/:id` | Admin | Get specific token | - | `{token}` |
| DELETE | `/refresh-token/:id` | Authenticated | Revoke refresh token | - | `{message}` |

**Used by:**
- Security management
- Session monitoring
- Token revocation
- Admin security oversight

---

### 👥 Admin APIs (`/api/admin`)
**Access Level:** Admin only

| Method | Endpoint | Access | Description | Response |
|--------|----------|--------|-------------|----------|
| GET | `/admin/stats` | Admin | Dashboard statistics | `{stats, recentActivity}` |
| GET | `/admin/users` | Admin | Users with pagination | `{users, pagination}` |

**Statistics Include:**
- User counts by role
- Booking statistics
- Rating averages
- Content counts
- Recent activities

**Used by:**
- Admin dashboard
- Analytics displays
- Management interfaces
- System monitoring

---

### 🔗 Shared/Public APIs (`/api/_`)
**Access Level:** Public (limited data)

| Method | Endpoint | Access | Description | Response |
|--------|----------|--------|-------------|----------|
| GET | `/api/_/users` | Public | Get professionals (limited) | `[{professional}, ...]` |
| GET | `/api/_/users/:id` | Public | Get professional details | `{professional}` |
| POST | `/api/_/users/verify-email` | Public | Email verification | `{msg}` |

**Note:** These endpoints provide limited user information for public consumption (no contact details, private info)

**Used by:**
- Public professional listings
- Professional profile pages
- Email verification process
- SEO-friendly pages

---

### 🏠 Root APIs

| Method | Endpoint | Access | Description | Response |
|--------|----------|--------|-------------|----------|
| GET | `/` | Public | API status check | `{message, status, version, author}` |
| GET | `/health` | Public | Health check with DB status | `{status, dbStatus}` |

**Used by:**
- Health monitoring
- Load balancer checks
- API status verification
- Development testing

## Real-time Features

### WebSocket Events (Socket.IO)
- **Connection Management:** User session tracking
- **Live Notifications:** Real-time notification delivery
- **Booking Updates:** Live booking status changes
- **System Alerts:** Admin announcements

### Notification System
- **Trigger Events:** Booking status changes, new reviews, system updates
- **Delivery Methods:** WebSocket, database storage
- **Types:** Info, success, warning, error
- **User Preferences:** Configurable notification settings

## Security Features

### Authentication
- **JWT Tokens:** Access and refresh token system
- **Cookie Security:** HTTP-only, secure, SameSite cookies
- **Token Rotation:** Automatic refresh token rotation
- **Session Management:** Database-stored refresh tokens

### Authorization
- **Role-Based Access:** Customer, Professional, Admin roles
- **Resource Protection:** Owner-based access control
- **Admin Privileges:** Full system access for admin role
- **API Rate Limiting:** (Recommended for production)

### Data Protection
- **Password Hashing:** bcrypt with salt rounds
- **Email Verification:** JWT-based email verification
- **CORS Configuration:** Configured allowed origins
- **Security Headers:** Helmet.js security middleware

## Usage Summary

### Frontend Integration Points

#### **Authentication Components**
```javascript
// Login/Register forms
POST /api/auth/login
POST /api/auth/register
GET /api/auth/me
POST /api/auth/logout
```

#### **User Dashboard Components**
```javascript
// Profile management
GET /api/user/:id
PUT /api/user
GET /api/user/settings
PUT /api/user/settings
```

#### **Booking System Components**
```javascript
// Booking management
POST /api/booking
GET /api/booking
PUT /api/booking/:id/status
PUT /api/booking/:id/rating
```

#### **Service Discovery Components**
```javascript
// Service listings
GET /api/services
GET /api/_/users (professionals)
GET /api/review?professionalId=xxx
```

#### **Admin Panel Components**
```javascript
// Admin management
GET /api/admin/stats
GET /api/user (all users)
POST /api/services
GET /api/feedback
```

### Mobile App Integration
- **REST API:** Full mobile support via HTTP requests
- **Real-time:** WebSocket support for live features
- **File Upload:** Multipart form data support
- **Offline Support:** Designed for offline-first mobile apps

### Third-party Integration
- **Email Service:** Integrated via email utilities
- **Maps Integration:** Geocoding API for location services
- **Payment Gateway:** Ready for payment system integration
- **Push Notifications:** Backend ready for push notification services

## Error Handling

### Standard Error Responses
```json
{
  "error": "Error message",
  "errors": [{"msg": "Validation error"}],
  "message": "Human readable message"
}
```

### HTTP Status Codes
- **200:** Success
- **201:** Created
- **400:** Bad Request / Validation Error
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Not Found
- **500:** Internal Server Error

## Development Notes

### Environment Variables Required
```
JWT_SECRET
REFRESH_TOKEN_SECRET
EMAIL_VERIFICATION_TOKEN_SECRET
MONGODB_URI
CLIENT_URL
NODE_ENV
PORT
```

### Database Models
- User, Service, Booking, Review, Favorite
- Notification, FAQ, Feedback, ReachUs
- RefreshToken, File, AboutUs

### Recommended Improvements
1. **API Rate Limiting:** Implement rate limiting for production
2. **Caching:** Redis caching for frequently accessed data
3. **Logging:** Structured logging with Winston
4. **Monitoring:** API monitoring and alerting
5. **Documentation:** OpenAPI/Swagger documentation
6. **Testing:** Comprehensive API testing suite

---

**Last Updated:** October 3, 2025  
**API Version:** 1.0.0  
**Documentation Generated by:** Automated Analysis Tool