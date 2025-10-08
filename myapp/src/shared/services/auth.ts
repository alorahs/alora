import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { UserSummary } from './types';

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone: string;
  fullName: string;
  role?: string;
  authMethod?: 'password' | 'otp-only';
}

export interface AuthResponse {
  msg?: string;
  message?: string;
  user: UserSummary;
  accessToken?: string;
}

export interface ForgotPasswordResponse {
  msg?: string;
  message?: string;
}

export interface ResetPasswordResponse {
  msg?: string;
  message?: string;
}

export interface VerifyEmailResponse {
  msg?: string;
  message?: string;
}

export interface OtpRequestPayload {
  identifier: string;
}

export interface VerifyOtpPayload extends OtpRequestPayload {
  otp: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  async requestOtp(payload: OtpRequestPayload): Promise<{ msg?: string; method?: string }> {
  return apiService.post(API_ENDPOINTS.AUTH.REQUEST_OTP, payload);
  }

  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, payload);
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
  }

  async logout(): Promise<{ message?: string; msg?: string }> {
    return apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async getCurrentUser(): Promise<{ user: UserSummary }> {
    return apiService.get<{ user: UserSummary }>(API_ENDPOINTS.AUTH.ME);
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    return apiService.post(API_ENDPOINTS.AUTH.REFRESH);
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  async resetPassword(token: string, password: string): Promise<ResetPasswordResponse> {
    return apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    return apiService.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  }
}

export const authService = new AuthService();