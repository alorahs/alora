import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { Favorite } from './types';

class FavoriteService {
  async list(): Promise<Favorite[]> {
    return apiService.get(API_ENDPOINTS.FAVORITES.BASE);
  }

  async add(professionalId: string): Promise<{ message: string; favorite: Favorite }> {
    return apiService.post(API_ENDPOINTS.FAVORITES.BASE, { professionalId });
  }

  async remove(professionalId: string): Promise<{ message: string }> {
    return apiService.delete(API_ENDPOINTS.FAVORITES.BY_PROFESSIONAL(professionalId));
  }
}

export const favoriteService = new FavoriteService();
