import { useQuery } from '@tanstack/react-query';
import { MOCK_ACTIVITIES } from '@/shared/config/mock-data';

export const activityKeys = {
  all: ['activities'] as const,
};

export function useActivities() {
  return useQuery({
    queryKey: activityKeys.all,
    queryFn: async () => MOCK_ACTIVITIES,
    staleTime: Infinity,
  });
}