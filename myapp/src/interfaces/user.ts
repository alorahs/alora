export interface User {
  _id: string
  fullName: string
  email: string
  username: string
  phone: string
  role: string
  password?: string
  isActive: boolean
  ratings?: number[];
  availability?: { day: string; timeSlots: string[] }[];
  workGallery?: string[];
  profilePicture?: string
  bio?: string
  skills?: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt: string
  updatedAt: string
  category?: string
  reviews?: { userId: string; comment: string; rating: number; date: string }[];
  hourlyRate?: number
  verified: string
}