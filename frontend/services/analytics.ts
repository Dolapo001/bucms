import apiClient from './api-client';
import { AnalyticsStats } from '@/types';

export const analyticsService = {
  async getStats(): Promise<AnalyticsStats> {
    const response = await apiClient.get<AnalyticsStats>('/analytics/');
    return response.data;
  },

  async getRecentActivities(): Promise<AnalyticsStats['recent_activities']> {
    const response = await apiClient.get<AnalyticsStats>('/analytics/');
    return response.data?.recent_activities || [];
  }
};
export default analyticsService;
