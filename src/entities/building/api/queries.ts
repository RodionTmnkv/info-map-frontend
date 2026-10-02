import { useQuery } from '@tanstack/react-query';
import { buildingApi, type SearchAreaParams } from './building.api';

export const buildingKeys = {
    all: ['buildings'] as const,
    searchArea: (p: SearchAreaParams) =>
        [...buildingKeys.all, 'search-area', p] as const,
};

export function useBuildings() {
    return useQuery({
        queryKey: buildingKeys.all,
        queryFn: buildingApi.getAll,
        staleTime: 5 * 60_000,
    });
}

export function useBuildingsInArea(params: SearchAreaParams) {
    return useQuery({
        queryKey: buildingKeys.searchArea(params),
        queryFn: () => buildingApi.searchArea(params),
        staleTime: 60_000,
    });
}