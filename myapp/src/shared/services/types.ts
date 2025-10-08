import type { User as DetailedUser } from '@/interfaces/user';

export type User = DetailedUser;

export interface UserSummary {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  authMethod?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  [key: string]: unknown;
}

export interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  category?: string;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface ProfessionalPortfolioImage {
  _id: string;
  filename: string;
  url?: string;
  mimetype?: string;
  size?: number;
  [key: string]: unknown;
}

export interface ProfessionalPortfolioItem {
  _id: string;
  title?: string;
  description?: string;
  images?: ProfessionalPortfolioImage[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface ProfessionalProfile {
  _id: string;
  user: string | UserSummary | User;
  category?: string;
  isVerified?: boolean;
  averageRating?: number;
  totalReviews?: number;
  portfolioItems?: ProfessionalPortfolioItem[];
  servicesOffered?: ServiceItem[] | string[];
  workGallery?: ProfessionalPortfolioImage[] | string[];
  verificationRequestedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export interface BookingAddress extends Address {
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Booking {
  _id: string;
  user: string | UserSummary | User;
  professional: string | UserSummary | User;
  service: string;
  date: string;
  time: string;
  address: BookingAddress;
  notes?: string;
  status: BookingStatus;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface PaymentMethod {
  _id?: string;
  type: 'credit-card' | 'debit-card' | 'paypal' | 'bank-account' | 'upi';
  provider?: string;
  lastFourDigits?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
  billingAddress?: Address & {
    zip?: string;
  };
  [key: string]: unknown;
}

export interface UserPreferences {
  communication?: {
    preferredMethod?: 'email' | 'sms' | 'push' | 'whatsapp';
    preferredLanguage?: 'en' | 'es' | 'fr' | 'de' | 'hi';
  };
  privacy?: {
    profileVisibility?: 'public' | 'private' | 'professional-only';
    showEmail?: boolean;
    showPhone?: boolean;
  };
  [key: string]: unknown;
}

export interface UserDetails {
  _id: string;
  user: string | UserSummary;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  identification?: Record<string, unknown>;
  paymentMethods?: PaymentMethod[];
  preferences?: UserPreferences;
  analytics?: {
    totalLogins?: number;
    totalBookings?: number;
    totalReviews?: number;
    totalSpent?: number;
  };
  referralCode?: string;
  referredBy?: string;
  loyaltyPoints?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface Favorite {
  _id: string;
  user: string | UserSummary;
  professional: string | ProfessionalProfile;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface Review {
  _id: string;
  reviewer: string | UserSummary;
  reviewee: string | UserSummary;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'booking'
  | 'review'
  | 'payment'
  | 'message'
  | 'alert';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  _id: string;
  user: string | UserSummary;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  read: boolean;
  archived?: boolean;
  url?: string;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface FeedbackItem {
  _id: string;
  rating: number;
  subject?: string;
  message?: string;
  name?: string;
  email?: string;
  user?: string | UserSummary;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface ReachUsMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface AboutUsContent {
  _id: string;
  title: string;
  description: string;
  ourMission: string;
  ourVision: string;
  ourValues: string[];
  teamMembers: Array<{
    name: string;
    position: string;
    bio: string;
    imageUrl?: string;
    socialLinks?: Record<string, string>;
  }>;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks?: Record<string, string>;
  statistics?: {
    happyClients?: number;
    projectsCompleted?: number;
    yearsExperience?: number;
    [key: string]: number | undefined;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface FileResource {
  _id: string;
  filename: string;
  originalName?: string;
  mimetype?: string;
  size?: number;
  url?: string;
  owner?: string | UserSummary;
  category?: string;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  files?: T[];
  data?: T[];
  pagination?: PaginationMeta;
  total?: number;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface AdminStats {
  totalUsers: number;
  activeProfessionals: number;
  totalBookings: number;
  pendingBookings: number;
  [key: string]: number;
}
