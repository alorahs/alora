import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { GeocodingResponse } from '@/interfaces/geoloaction';

export interface GeocodeQuery {
  address: string;
}

class NavigationService {
  async geocode(query: GeocodeQuery): Promise<GeocodingResponse[]> {
    return apiService.get(`${API_ENDPOINTS.NAVIGATION.GEOCODE}?address=${encodeURIComponent(query.address)}`);
  }
}

export const navigationService = new NavigationService();
