import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { ProfessionalProfile, ProfessionalPortfolioItem } from './types';

export interface CreateProfessionalPayload extends Partial<ProfessionalProfile> {}
export interface UpdateProfessionalPayload extends Partial<ProfessionalProfile> {}

export interface PortfolioResponse {
  message?: string;
  portfolioItems: ProfessionalPortfolioItem[];
}

class ProfessionalService {
  async list(): Promise<ProfessionalProfile[]> {
    return apiService.get(API_ENDPOINTS.PROFESSIONALS.BASE);
  }

  async getById(id: string): Promise<ProfessionalProfile> {
    return apiService.get(API_ENDPOINTS.PROFESSIONALS.BY_ID(id));
  }

  async getByCategory(category: string): Promise<ProfessionalProfile[]> {
    return apiService.get(API_ENDPOINTS.PROFESSIONALS.BY_CATEGORY(category));
  }

  async create(payload: CreateProfessionalPayload): Promise<{ message: string; professional: ProfessionalProfile }> {
    return apiService.post(API_ENDPOINTS.PROFESSIONALS.BASE, payload);
  }

  async update(id: string, payload: UpdateProfessionalPayload): Promise<{ message: string; professional: ProfessionalProfile }> {
    return apiService.put(API_ENDPOINTS.PROFESSIONALS.BY_ID(id), payload);
  }

  async requestVerification(id: string): Promise<{ message: string }> {
    return apiService.post(API_ENDPOINTS.PROFESSIONALS.REQUEST_VERIFICATION(id));
  }

  async verify(id: string): Promise<{ message: string; professional: ProfessionalProfile }> {
    return apiService.put(API_ENDPOINTS.PROFESSIONALS.VERIFY(id));
  }

  async getPortfolio(id: string): Promise<ProfessionalPortfolioItem[]> {
    return apiService.get(API_ENDPOINTS.PROFESSIONALS.PORTFOLIO(id));
  }

  async addPortfolioItem(id: string, payload: ProfessionalPortfolioItem): Promise<PortfolioResponse> {
    return apiService.post(API_ENDPOINTS.PROFESSIONALS.PORTFOLIO(id), payload);
  }

  async updatePortfolioItem(id: string, itemId: string, payload: ProfessionalPortfolioItem): Promise<PortfolioResponse> {
    return apiService.put(API_ENDPOINTS.PROFESSIONALS.PORTFOLIO_ITEM(id, itemId), payload);
  }

  async deletePortfolioItem(id: string, itemId: string): Promise<PortfolioResponse> {
    return apiService.delete(API_ENDPOINTS.PROFESSIONALS.PORTFOLIO_ITEM(id, itemId));
  }
}

export const professionalService = new ProfessionalService();
