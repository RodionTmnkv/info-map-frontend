import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { Activity } from '../model/types';

export const activityApi = {
  getAll: async () => {
    const { data } = await apiClient.get<Activity[]>(ENDPOINTS.activities);
    return data;
  },
};