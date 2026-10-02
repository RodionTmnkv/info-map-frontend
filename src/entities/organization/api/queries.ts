import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  organizationApi,
  type OrganizationFilters,
} from './organization.api';
import type { OrganizationFormPayload } from '../model/types';

export const organizationKeys = {
  all: ['organizations'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  list: (filters: OrganizationFilters) =>
      [...organizationKeys.lists(), filters] as const,
  details: () => [...organizationKeys.all, 'detail'] as const,
  detail: (id: number) => [...organizationKeys.details(), id] as const,
};

export function useOrganizations(filters: OrganizationFilters = {}) {
  return useQuery({
    queryKey: organizationKeys.list(filters),
    queryFn: () => organizationApi.getAll(filters),
    placeholderData: (prev) => prev,
  });
}

export function useOrganization(id: number) {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: () => organizationApi.getById(id),
    enabled: Number.isFinite(id) && id !== 0,
  });
}

export function useCreateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OrganizationFormPayload) =>
        organizationApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
}

export function useUpdateOrganization(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OrganizationFormPayload) =>
        organizationApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: organizationKeys.detail(id) });
      qc.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
}