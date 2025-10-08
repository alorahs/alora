import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';
import type {
  AdminStats,
  Booking,
  ServiceItem,
  User,
} from './types';

export interface UpdateUserRolePayload {
  role: string;
}

export interface AdminBookingUpdatePayload extends Partial<Booking> {}

export interface AdminServicePayload extends Partial<ServiceItem> {}

export interface CategoryPayload {
  name: string;
  description?: string;
}

class AdminService {
  async getStats(): Promise<AdminStats> {
    return apiService.get(API_ENDPOINTS.ADMIN.STATS);
  }

  async listUsers(): Promise<User[]> {
    return apiService.get(API_ENDPOINTS.ADMIN.USERS);
  }

  async updateUserRole(userId: string, payload: UpdateUserRolePayload): Promise<{ message: string; user: User }> {
    return apiService.put(API_ENDPOINTS.ADMIN.USER_ROLE(userId), payload);
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    return apiService.delete(API_ENDPOINTS.ADMIN.USER(userId));
  }

  async listBookings(): Promise<Booking[]> {
    return apiService.get(API_ENDPOINTS.ADMIN.BOOKINGS);
  }

  async updateBooking(bookingId: string, payload: AdminBookingUpdatePayload): Promise<{ message: string; booking: Booking }> {
    return apiService.put(API_ENDPOINTS.ADMIN.BOOKING(bookingId), payload);
  }

  async deleteBooking(bookingId: string): Promise<{ message: string }> {
    return apiService.delete(API_ENDPOINTS.ADMIN.BOOKING(bookingId));
  }

  async listServices(): Promise<ServiceItem[]> {
    return apiService.get(API_ENDPOINTS.ADMIN.SERVICES);
  }

  async createService(payload: AdminServicePayload): Promise<ServiceItem> {
    return apiService.post(API_ENDPOINTS.ADMIN.SERVICES, payload);
  }

  async updateService(serviceId: string, payload: AdminServicePayload): Promise<ServiceItem> {
    return apiService.put(API_ENDPOINTS.ADMIN.SERVICE(serviceId), payload);
  }

  async deleteService(serviceId: string): Promise<{ message: string }> {
    return apiService.delete(API_ENDPOINTS.ADMIN.SERVICE(serviceId));
  }

  async listCategories(): Promise<CategoryPayload[]> {
    return apiService.get(API_ENDPOINTS.ADMIN.CATEGORIES);
  }

  async createCategory(payload: CategoryPayload): Promise<CategoryPayload> {
    return apiService.post(API_ENDPOINTS.ADMIN.CATEGORIES, payload);
  }

  async updateCategory(categoryId: string, payload: CategoryPayload): Promise<CategoryPayload> {
    return apiService.put(API_ENDPOINTS.ADMIN.CATEGORY(categoryId), payload);
  }

  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    return apiService.delete(API_ENDPOINTS.ADMIN.CATEGORY(categoryId));
  }
}

export const adminService = new AdminService();
