import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { Booking, BookingStatus } from './types';

export interface CreateBookingPayload {
  professionalId: string;
  service: string;
  date: string;
  time: string;
  address: Record<string, unknown>;
  notes?: string;
}

export interface UpdateBookingStatusPayload {
  status: BookingStatus;
}

export interface UpdateBookingRatingPayload {
  rating: number;
  review?: string;
}

class BookingService {
  async create(payload: CreateBookingPayload): Promise<{ message: string; booking: Booking }> {
    return apiService.post(API_ENDPOINTS.BOOKINGS.BASE, payload);
  }

  async list(): Promise<Booking[]> {
    return apiService.get(API_ENDPOINTS.BOOKINGS.BASE);
  }

  async getById(id: string): Promise<Booking> {
    return apiService.get(API_ENDPOINTS.BOOKINGS.BY_ID(id));
  }

  async updateStatus(id: string, payload: UpdateBookingStatusPayload): Promise<{ message: string; booking: Booking }> {
    return apiService.put(API_ENDPOINTS.BOOKINGS.STATUS(id), payload);
  }

  async addRating(id: string, payload: UpdateBookingRatingPayload): Promise<{ message: string; booking: Booking }> {
    return apiService.put(API_ENDPOINTS.BOOKINGS.RATING(id), payload);
  }

  async listForProfessional(id: string): Promise<Booking[]> {
    return apiService.get(API_ENDPOINTS.BOOKINGS.BY_PROFESSIONAL(id));
  }

  async remove(id: string): Promise<{ message: string }> {
    return apiService.delete(API_ENDPOINTS.BOOKINGS.BY_ID(id));
  }
}

export const bookingService = new BookingService();
