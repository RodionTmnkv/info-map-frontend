import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { Building } from '../model/types';

export interface SearchAreaParams {
    lat?: number;
    lng?: number;
    radius?: number;
    lat_min?: number;
    lat_max?: number;
    lng_min?: number;
    lng_max?: number;
}

export interface BuildingWithOrgs extends Building {
    organizations?: Array<{
        id: number;
        name: string;
        phones: Array<{ phone_number: string }>;
        activities: Array<{ id: number; name: string }>;
        building?: Building;
    }>;
}

interface SearchAreaResponse {
    buildings: Building[];
    organizations: BuildingWithOrgs['organizations'];
}

export const buildingApi = {
    /**
     * Все здания. Без параметров бэкенд отдаёт всё, что есть.
     *
     * ⚠️ С параметрами radius/bbox эндпоинт возвращает 404 из-за
     * некорректных координат в сид-данных бэкенда (Москва и Северный
     * Ледовитый океан вместо Ростова). Когда сиды починят — можно
     * вернуть фильтр по радиусу.
     */
    getAll: async (): Promise<BuildingWithOrgs[]> => {
        const { data } = await apiClient.get<SearchAreaResponse>(
            ENDPOINTS.buildingsSearchArea,
        );
        return data.buildings ?? [];
    },

    searchArea: async (params: SearchAreaParams): Promise<BuildingWithOrgs[]> => {
        const { data } = await apiClient.get<SearchAreaResponse>(
            ENDPOINTS.buildingsSearchArea,
            { params },
        );
        return data.buildings ?? [];
    },
};