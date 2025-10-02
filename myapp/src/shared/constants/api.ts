/**
 * API Configuration and Endpoints
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://192.168.29.162:5000/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/_/users/verify-email",
    ME: "/auth/me",
  },
  
  // User Management
  USER: {
    PROFILE: "/user",
    BY_ID: (id: string) => `/user/${id}`,
    REVIEWS: (id: string) => `/user/${id}/reviews`,
    PUBLIC_PROFESSIONALS: "/_/users",
  },
  
  // Booking System
  BOOKING: {
    BASE: "/booking",
    BY_ID: (id: string) => `/booking/${id}`,
    STATUS: (id: string) => `/booking/${id}/status`,
    RATING: (id: string) => `/booking/${id}/rating`,
    BY_PROFESSIONAL: (professionalId: string) => `/booking/professional/${professionalId}`,
  },
  
  // Services
  SERVICES: {
    BASE: "/services",
    BY_ID: (id: string) => `/services/${id}`,
    BULK: "/services/bulk",
  },
  
  // Favorites
  FAVORITES: {
    BASE: "/favorite",
    BY_PROFESSIONAL: (professionalId: string) => `/favorite/${professionalId}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    BASE: "/notification",
    MARK_READ: (id: string) => `/notification/${id}/read`,
    MARK_ALL_READ: "/notification/read-all",
  },
  
  // Public Endpoints
  PUBLIC: {
    FAQS: "/_/faqs",
    FEEDBACK: "/_/feedback",
    CONTACT: "/_/reachus",
  },
  
  // Admin
  ADMIN: {
    USERS: "/user",
    FAQS: "/faq",
    FEEDBACK: "/feedback",
    CONTACT: "/reachus",
    REVIEWS: "/review",
    BOOKINGS: "/booking",
  },
  
  // File Management
  FILES: {
    UPLOAD: "/files",
    BY_ID: (id: string) => `/files/${id}`,
  },
} as const;

export default API_ENDPOINTS;