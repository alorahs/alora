/**
 * API Configuration and Endpoints
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://192.168.29.162:5000/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REQUEST_OTP: "/auth/request-otp",
    VERIFY_OTP: "/auth/verify-otp",
    VERIFY_EMAIL: "/_/users/verify-email",
  },

  PUBLIC: {
    PROFESSIONALS: "/_/users",
    PROFESSIONAL_BY_ID: (id: string) => `/_/users/${id}`,
    FAQS: "/_/faqs",
    FEEDBACK: "/_/feedback",
    CONTACT: "/_/reachus",
  },

  USER: {
    BASE: "/user",
    BY_ID: (id: string) => `/user/${id}`,
    REVIEWS: (id: string) => `/user/${id}/reviews`,
    SETTINGS: "/user/settings",
    CHANGE_PASSWORD: "/user/change-password",
    TOGGLE_2FA: "/user/toggle-2fa",
    DELETE_ACCOUNT: "/user/delete-account",
  },

  USER_DETAILS: {
    BASE: "/user-details",
    PAYMENT_METHODS: "/user-details/payment-methods",
    PAYMENT_METHOD: (id: string) => `/user-details/payment-methods/${id}`,
    ANALYTICS: "/user-details/analytics",
    PREFERENCES: "/user-details/preferences",
  },

  SERVICES: {
    BASE: "/services",
    BY_ID: (id: string) => `/services/${id}`,
    BULK: "/services/bulk",
  },

  PROFESSIONALS: {
    BASE: "/professionals",
    BY_ID: (id: string) => `/professionals/${id}`,
    BY_CATEGORY: (category: string) => `/professionals/category/${category}`,
    REQUEST_VERIFICATION: (id: string) => `/professionals/${id}/request-verification`,
    VERIFY: (id: string) => `/professionals/${id}/verify`,
    PORTFOLIO: (id: string) => `/professionals/${id}/portfolio`,
    PORTFOLIO_ITEM: (id: string, itemId: string) => `/professionals/${id}/portfolio/${itemId}`,
  },

  BOOKINGS: {
    BASE: "/booking",
    BY_ID: (id: string) => `/booking/${id}`,
    STATUS: (id: string) => `/booking/${id}/status`,
    RATING: (id: string) => `/booking/${id}/rating`,
    BY_PROFESSIONAL: (professionalId: string) => `/booking/professional/${professionalId}`,
  },

  FAVORITES: {
    BASE: "/favorite",
    BY_PROFESSIONAL: (professionalId: string) => `/favorite/${professionalId}`,
  },

  REVIEWS: {
    BASE: "/review",
    BY_ID: (id: string) => `/review/${id}`,
    BY_PROFESSIONAL: (professionalId: string) => `/review/professional/${professionalId}`,
  },

  NOTIFICATIONS: {
    BASE: "/notification",
    MARK_READ: (id: string) => `/notification/${id}/read`,
    MARK_ALL_READ: "/notification/read-all",
  },

  FAQ: {
    BASE: "/faq",
    BY_ID: (id: string) => `/faq/${id}`,
  },

  FEEDBACK: {
    BASE: "/feedback",
    BY_ID: (id: string) => `/feedback/${id}`,
    ADMIN: "/feedback/admin",
  },

  REACH_US: {
    BASE: "/reachus",
    BY_ID: (id: string) => `/reachus/${id}`,
  },

  ABOUT_US: {
    BASE: "/aboutus",
  },

  ADMIN: {
    STATS: "/admin/stats",
    USERS: "/admin/users",
    USER_ROLE: (id: string) => `/admin/users/${id}/role`,
    USER: (id: string) => `/admin/users/${id}`,
    BOOKINGS: "/admin/bookings",
    BOOKING: (id: string) => `/admin/bookings/${id}`,
    SERVICES: "/admin/services",
    SERVICE: (id: string) => `/admin/services/${id}`,
    CATEGORIES: "/admin/categories",
    CATEGORY: (id: string) => `/admin/categories/${id}`,
  },

  FILES: {
    BASE: "/files",
    BY_ID: (id: string) => `/files/${id}`,
    PUBLIC_BY_ID: (id: string) => `/files/public/${id}`,
    BY_USER: (userId: string) => `/files/user/${userId}`,
  },

  NAVIGATION: {
    GEOCODE: "/geocode",
  },

  SOCKET_TEST: {
    BROADCAST: "/socket-test/broadcast",
    SEND: (userId: string) => `/socket-test/send/${userId}`,
    STATS: "/socket-test/stats",
  },
} as const;

export default API_ENDPOINTS;