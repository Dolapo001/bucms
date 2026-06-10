import apiClient from './api-client';
import { Sermon } from '@/types';

export const sermonService = {
  async getSermons(params?: Record<string, any>): Promise<{ results: Sermon[]; count: number }> {
    const response = await apiClient.get<any>('/sermons/', { params });
    if (response.data && Array.isArray(response.data.results)) {
      return response.data;
    }
    return { results: Array.isArray(response.data) ? response.data : [], count: response.data?.length || 0 };
  },

  async getSermonById(id: number): Promise<Sermon> {
    const response = await apiClient.get<Sermon>(`/sermons/${id}/`);
    return response.data;
  },

  async createSermon(data: FormData): Promise<Sermon> {
    const response = await apiClient.post<Sermon>('/sermons/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateSermon(id: number, data: FormData): Promise<Sermon> {
    const response = await apiClient.patch<Sermon>(`/sermons/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteSermon(id: number): Promise<void> {
    await apiClient.delete(`/sermons/${id}/`);
  },

  async incrementViews(id: number): Promise<void> {
    await apiClient.post(`/sermons/${id}/view/`);
  }
};
export default sermonService;
