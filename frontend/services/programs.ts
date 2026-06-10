import apiClient from './api-client';
import { Program } from '@/types';

export const programService = {
  async getPrograms(params?: Record<string, any>): Promise<{ results: Program[]; count: number }> {
    const response = await apiClient.get<any>('/programs/', { params });
    if (response.data && Array.isArray(response.data.results)) {
      return response.data;
    }
    return { results: Array.isArray(response.data) ? response.data : [], count: response.data?.length || 0 };
  },

  async getProgramById(id: number): Promise<Program> {
    const response = await apiClient.get<Program>(`/programs/${id}/`);
    return response.data;
  },

  async createProgram(data: FormData): Promise<Program> {
    const response = await apiClient.post<Program>('/programs/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateProgram(id: number, data: FormData): Promise<Program> {
    const response = await apiClient.patch<Program>(`/programs/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteProgram(id: number): Promise<void> {
    await apiClient.delete(`/programs/${id}/`);
  }
};
export default programService;
