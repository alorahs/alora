/**
 * Application Constants
 */

export const APP_CONFIG = {
  NAME: "Alora",
  DESCRIPTION: "Your Home Service Partner",
  VERSION: "1.0.0",
} as const;

export const USER_ROLES = {
  CUSTOMER: "customer",
  PROFESSIONAL: "professional", 
  ADMIN: "admin",
} as const;

export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in_progress", 
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const SERVICE_CATEGORIES = {
  PLUMBING: "plumbing",
  ELECTRICAL: "electrical",
  CLEANING: "cleaning", 
  CARPENTRY: "carpentry",
  PAINTING: "painting",
  AC_REPAIR: "ac_repair",
  APPLIANCE_REPAIR: "appliance_repair",
  OTHER: "other",
} as const;

export const NOTIFICATION_TYPES = {
  BOOKING_CREATED: "booking_created",
  BOOKING_CONFIRMED: "booking_confirmed", 
  BOOKING_COMPLETED: "booking_completed",
  REVIEW_RECEIVED: "review_received",
  SYSTEM: "system",
} as const;

export const PRICE_RANGES = [
  { min: 0, max: 500, label: "Under ₹500" },
  { min: 500, max: 1000, label: "₹500 - ₹1,000" },
  { min: 1000, max: 2000, label: "₹1,000 - ₹2,000" },
  { min: 2000, max: 5000, label: "₹2,000 - ₹5,000" },
  { min: 5000, max: Infinity, label: "Above ₹5,000" },
] as const;

export const RATING_OPTIONS = [
  { value: 4, label: "4+ Stars" },
  { value: 3, label: "3+ Stars" },
  { value: 2, label: "2+ Stars" },
  { value: 1, label: "1+ Stars" },
] as const;

export const STORAGE_KEYS = {
  USER_DATA: "alora_user_data",
  THEME: "alora_theme",
  LOCATION: "alora_user_location",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/signup",
  PROFILE: "/profile",
  PROFESSIONALS: "/professionals",
  BOOKINGS: "/bookings",
  FAVORITES: "/favorites",
  ADMIN: "/admin",
  SETTINGS: "/settings",
} as const;