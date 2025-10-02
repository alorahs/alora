import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone: string;
  fullName: string;
  role?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  profilePicture?: string;
  isActive: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken?: string;
}

/**
 * Authentication Service
 */
class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  /**
   * Register user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
  }

  /**
   * Logout user
   */
  async logout(): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT);
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<{ user: User }> {
    return apiService.get<{ user: User }>(API_ENDPOINTS.AUTH.ME);
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ accessToken: string }> {
    return apiService.post<{ accessToken: string }>(API_ENDPOINTS.AUTH.REFRESH);
  }

  /**
   * Send forgot password email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
  }

  /**
   * Reset password
   */
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, password }
    );
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      { token }
    );
  }
}

export const authService = new AuthService();