import apiClient from './api-client';
import { Announcement } from '@/types';

export const announcementService = {
  async getAnnouncements(params?: Record<string, any>): Promise<{ results: Announcement[]; count: number }> {
    // Falls back to direct array response if pagination metadata is not present
    const response = await apiClient.get<any>('/announcements/', { params });
    if (response.data && Array.isArray(response.data.results)) {
      return response.data;
    }
    return { results: Array.isArray(response.data) ? response.data : [], count: response.data?.length || 0 };
  },

  async getAnnouncementById(id: number): Promise<Announcement> {
    const response = await apiClient.get<Announcement>(`/announcements/${id}/`);
    return response.data;
  },

  async createAnnouncement(data: FormData): Promise<Announcement> {
    const response = await apiClient.post<Announcement>('/announcements/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateAnnouncement(id: number, data: FormData): Promise<Announcement> {
    const response = await apiClient.patch<Announcement>(`/announcements/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteAnnouncement(id: number): Promise<void> {
    await apiClient.delete(`/announcements/${id}/`);
  }
};
export default announcementService;
