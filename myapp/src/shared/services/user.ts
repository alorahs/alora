import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';
import type {
  User,
  UserSummary,
  UserDetails,
  PaymentMethod,
  UserPreferences,
  PaginatedResponse,
  FileResource,
  Favorite,
  Notification,
} from './types';

export interface UpdateUserPayload extends Partial<User> {
  _id?: never;
  role?: never;
  password?: never;
  email?: never;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateSettingsPayload {
  settings: Record<string, unknown>;
}

export interface ToggleTwoFactorPayload {
  enabled: boolean;
}

export interface UpdateUserDetailsPayload extends Partial<UserDetails> {}

export interface AddPaymentMethodPayload extends PaymentMethod {}

export interface UpdatePaymentMethodPayload extends PaymentMethod {}

export interface UpdatePreferencesPayload {
  preferences: UserPreferences;
}

export interface UserSettingsResponse {
  settings: Record<string, unknown>;
}

export interface UserDetailsResponse {
  message?: string;
  userDetails: UserDetails;
}

export interface PaymentMethodsResponse {
  message?: string;
  paymentMethods: PaymentMethod[];
}

export interface FileListResponse extends PaginatedResponse<FileResource> {}

class UserService {
  async getProfile(): Promise<User> {
    return apiService.get<User>(API_ENDPOINTS.USER.BASE);
  }

  async updateProfile(payload: UpdateUserPayload): Promise<{ message: string; user: User }> {
    return apiService.put(API_ENDPOINTS.USER.BASE, payload);
  }

  async getUserById(userId: string): Promise<User> {
    return apiService.get<User>(API_ENDPOINTS.USER.BY_ID(userId));
  }

  async updateUserById(userId: string, payload: UpdateUserPayload): Promise<{ message: string; user: UserSummary }> {
    return apiService.put(API_ENDPOINTS.USER.BY_ID(userId), payload);
  }

  async deleteUserById(userId: string): Promise<{ message: string }> {
    return apiService.delete(API_ENDPOINTS.USER.BY_ID(userId));
  }

  async getSettings(): Promise<UserSettingsResponse> {
    return apiService.get<UserSettingsResponse>(API_ENDPOINTS.USER.SETTINGS);
  }

  async updateSettings(payload: UpdateSettingsPayload): Promise<UserSettingsResponse & { message: string }> {
    return apiService.put(API_ENDPOINTS.USER.SETTINGS, payload);
  }

  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    return apiService.put(API_ENDPOINTS.USER.CHANGE_PASSWORD, payload);
  }

  async toggleTwoFactor(payload: ToggleTwoFactorPayload): Promise<{ message: string; twoFactorEnabled?: boolean }> {
    return apiService.put(API_ENDPOINTS.USER.TOGGLE_2FA, payload);
  }

  async deleteAccount(): Promise<{ message: string }> {
    return apiService.delete(API_ENDPOINTS.USER.DELETE_ACCOUNT);
  }

  async getUserDetails(): Promise<UserDetails> {
    return apiService.get<UserDetails>(API_ENDPOINTS.USER_DETAILS.BASE);
  }

  async createUserDetails(payload: UpdateUserDetailsPayload): Promise<UserDetailsResponse> {
    return apiService.post<UserDetailsResponse>(API_ENDPOINTS.USER_DETAILS.BASE, payload);
  }

  async updateUserDetails(payload: UpdateUserDetailsPayload): Promise<UserDetailsResponse> {
    return apiService.put<UserDetailsResponse>(API_ENDPOINTS.USER_DETAILS.BASE, payload);
  }

  async addPaymentMethod(payload: AddPaymentMethodPayload): Promise<PaymentMethodsResponse> {
    return apiService.post<PaymentMethodsResponse>(API_ENDPOINTS.USER_DETAILS.PAYMENT_METHODS, payload);
  }

  async updatePaymentMethod(methodId: string, payload: UpdatePaymentMethodPayload): Promise<PaymentMethodsResponse> {
    return apiService.put<PaymentMethodsResponse>(API_ENDPOINTS.USER_DETAILS.PAYMENT_METHOD(methodId), payload);
  }

  async deletePaymentMethod(methodId: string): Promise<PaymentMethodsResponse> {
    return apiService.delete<PaymentMethodsResponse>(API_ENDPOINTS.USER_DETAILS.PAYMENT_METHOD(methodId));
  }

  async getAnalytics(): Promise<{ analytics: Record<string, unknown> }> {
    return apiService.get(API_ENDPOINTS.USER_DETAILS.ANALYTICS);
  }

  async updatePreferences(payload: UpdatePreferencesPayload): Promise<{ message: string; preferences: UserPreferences }> {
    return apiService.put(API_ENDPOINTS.USER_DETAILS.PREFERENCES, payload);
  }

  async getFavorites(): Promise<Favorite[]> {
    return apiService.get(API_ENDPOINTS.FAVORITES.BASE);
  }

  async addFavorite(professionalId: string): Promise<{ message: string; favorite: Favorite }> {
    return apiService.post(API_ENDPOINTS.FAVORITES.BASE, { professionalId });
  }

  async removeFavorite(professionalId: string): Promise<{ message: string }> {
    return apiService.delete(API_ENDPOINTS.FAVORITES.BY_PROFESSIONAL(professionalId));
  }

  async listFiles(userId: string, searchParams?: URLSearchParams | Record<string, string | number | boolean>): Promise<FileListResponse> {
    const query = this.buildQuery(searchParams);
    return apiService.get<FileListResponse>(`${API_ENDPOINTS.FILES.BY_USER(userId)}${query}`);
  }

  async uploadFile(formData: FormData): Promise<{ message: string; file: FileResource }> {
    return apiService.upload(API_ENDPOINTS.FILES.BASE, formData);
  }

  async updateFileMetadata(fileId: string, payload: Partial<FileResource>): Promise<{ message: string; file: FileResource }> {
    return apiService.patch(API_ENDPOINTS.FILES.BY_ID(fileId), payload);
  }

  async deleteFile(fileId: string): Promise<{ message: string }> {
    return apiService.delete(API_ENDPOINTS.FILES.BY_ID(fileId));
  }

  async getNotifications(): Promise<Notification[]> {
    return apiService.get(API_ENDPOINTS.NOTIFICATIONS.BASE);
  }

  async markNotificationRead(notificationId: string): Promise<{ message: string; notification: Notification }> {
    return apiService.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId));
  }

  async markAllNotificationsRead(): Promise<{ message: string }> {
    return apiService.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  }

  private buildQuery(params?: URLSearchParams | Record<string, string | number | boolean>): string {
    if (!params) return '';

    if (params instanceof URLSearchParams) {
      const queryString = params.toString();
      return queryString ? `?${queryString}` : '';
    }

    const entries = Object.entries(params).flatMap(([key, value]) => {
      if (value === undefined || value === null) return [];
      return [[key, String(value)]];
    });

    if (entries.length === 0) return '';

    const searchParams = new URLSearchParams(entries as [string, string][]);
    return `?${searchParams.toString()}`;
  }
}

export const userService = new UserService();
