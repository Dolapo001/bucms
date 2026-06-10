import apiClient from './api-client';
import { User } from '@/types';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/users/me/');
    return response.data;
  },

  async updateProfile(data: Partial<User> | FormData): Promise<User> {
    const headers = data instanceof FormData 
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' };
      
    const response = await apiClient.patch<User>('/users/me/', data, { headers });
    return response.data;
  },

  async uploadProfilePicture(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('profile_picture', file);
    return this.updateProfile(formData);
  },

  // Admin CMS features
  async getAllUsers(params?: Record<string, any>): Promise<{ results: User[]; count: number }> {
    const response = await apiClient.get<any>('/users/', { params });
    if (response.data && Array.isArray(response.data.results)) {
      return response.data;
    }
    return { 
      results: Array.isArray(response.data) ? response.data : [], 
      count: response.data?.length || 0 
    };
  },

  async createUser(data: Record<string, any>): Promise<User> {
    const response = await apiClient.post<User>('/users/', data);
    return response.data;
  },

  async updateUserRole(id: string | number, role: 'MEMBER' | 'ADMIN'): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}/`, { role });
    return response.data;
  },

  async deleteUser(id: string | number): Promise<void> {
    await apiClient.delete(`/users/${id}/`);
  }
};
export default userService;
