import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { Review } from './types';

export interface CreateReviewPayload {
  professionalId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload extends Partial<CreateReviewPayload> {}

class ReviewService {
  async create(payload: CreateReviewPayload): Promise<{ message: string; review: Review }> {
    return apiService.post(API_ENDPOINTS.REVIEWS.BASE, payload);
  }

  async listByProfessional(professionalId: string): Promise<Review[]> {
    return apiService.get(API_ENDPOINTS.REVIEWS.BY_PROFESSIONAL(professionalId));
  }

  async update(reviewId: string, payload: UpdateReviewPayload): Promise<{ message: string; review: Review }> {
    return apiService.put(API_ENDPOINTS.REVIEWS.BY_ID(reviewId), payload);
  }

  async remove(reviewId: string): Promise<{ message: string }> {
    return apiService.delete(API_ENDPOINTS.REVIEWS.BY_ID(reviewId));
  }
}

export const reviewService = new ReviewService();
