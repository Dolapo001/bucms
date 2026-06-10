import apiClient from './api-client';
import { Notification } from '@/types';

// Helper to map backend notifications to frontend expected structures
const mapNotification = (n: any): Notification => {
  const msg = n.message || '';
  return {
    id: n.id,
    title: msg.includes(':') ? msg.split(':')[0] : 'Chapel Alert',
    message: msg,
    read: !!n.is_read,
    created_at: n.created_at || new Date().toISOString()
  };
};

export const notificationService = {
  async getNotifications(params?: Record<string, any>): Promise<{ results: Notification[]; count: number }> {
    const response = await apiClient.get<any>('/notifications/', { params });
    
    const rawResults = response.data && Array.isArray(response.data.results)
      ? response.data.results
      : (Array.isArray(response.data) ? response.data : []);
      
    const mapped = rawResults.map(mapNotification);
    
    return {
      results: mapped,
      count: response.data?.count || mapped.length
    };
  },

  async markAsRead(id: string | number): Promise<Notification> {
    const response = await apiClient.post<any>(`/notifications/${id}/mark-read/`);
    const data = response.data?.notification || response.data;
    return mapNotification(data);
  },

  async markAllAsRead(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/notifications/mark-all-read/');
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<{ unread_count: number }>('/notifications/unread-count/');
    return response.data?.unread_count || 0;
  },

  async deleteNotification(id: string | number): Promise<void> {
    // Graceful no-op locally since notification logs are kept for accountability
    return Promise.resolve();
  }
};
export default notificationService;
