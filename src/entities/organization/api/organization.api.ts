import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import { mockDb } from '@/shared/lib/mock-db';
import { MOCK_ACTIVITIES } from '@/shared/config/mock-data';
import { buildingApi } from '@/entities/building';
import type {
  Organization,
  OrganizationDetail,
  OrganizationFormPayload,
  PaginatedResponse,
} from '../model/types';

export interface OrganizationFilters {
  name?: string;
  building_id?: number;
  activity_id?: number;
  skip?: number;
  limit?: number;
}

/** Расширенный тип: реальные организации могут нести мок-поле building_id. */
type OrganizationWithBuildingId = Organization & { building_id?: number };

const PAGE_SIZE_FETCH_ALL = 1000;

function applyOverride(
    org: OrganizationWithBuildingId,
): OrganizationWithBuildingId {
  const override = mockDb.getOverride(org.id);
  return override ? { ...org, ...override } : org;
}

function matchFilters(
    org: OrganizationWithBuildingId,
    filters: OrganizationFilters,
): boolean {
  if (filters.name) {
    const q = filters.name.trim().toLowerCase();
    if (!org.name.toLowerCase().includes(q)) return false;
  }

  if (filters.building_id != null) {
    const bId =
        (org as OrganizationWithBuildingId).building_id ??
        (org as unknown as { building?: { id: number } }).building?.id;
    if (bId !== filters.building_id) return false;
  }

  if (filters.activity_id != null) {
    const ids = org.activities?.map((a) => a.id) ?? [];
    // учитываем вложенность: организация подходит, если её активность
    // совпадает с выбранной ИЛИ является её потомком
    const descendants = collectActivityDescendants(filters.activity_id);
    const target = new Set<number>([filters.activity_id, ...descendants]);
    if (!ids.some((id) => target.has(id))) return false;
  }

  return true;
}

function collectActivityDescendants(rootId: number): number[] {
  const result: number[] = [];
  const stack = [rootId];
  while (stack.length > 0) {
    const current = stack.pop()!;
    MOCK_ACTIVITIES.filter((a) => a.parent_id === current).forEach((child) => {
      result.push(child.id);
      stack.push(child.id);
    });
  }
  return result;
}

export const organizationApi = {
  /**
   * Гибридный список: реальные + мок-организации, с фильтрацией
   * и клиентской пагинацией на фронте.
   */
  getAll: async (
      filters: OrganizationFilters = {},
  ): Promise<PaginatedResponse<Organization>> => {
    const skip = filters.skip ?? 0;
    const limit = filters.limit ?? 10;

    // Реальные данные тянем одной большой портянкой
    let realItems: OrganizationWithBuildingId[] = [];
    try {
      const { data } = await apiClient.get<PaginatedResponse<Organization>>(
          ENDPOINTS.organizations,
          { params: { skip: 0, limit: PAGE_SIZE_FETCH_ALL } },
      );
      realItems = data.items;
    } catch {
      realItems = [];
    }

    realItems = realItems.map(applyOverride);
    const mockItems = mockDb.getCreated();

    const combined: OrganizationWithBuildingId[] = [...mockItems, ...realItems];
    const filtered = combined.filter((org) => matchFilters(org, filters));

    const total = filtered.length;
    const page_count = Math.max(1, Math.ceil(total / limit));
    const page = Math.floor(skip / limit) + 1;
    const items = filtered.slice(skip, skip + limit);

    return {
      items,
      total,
      page,
      page_size: limit,
      page_count,
    };
  },

  /**
   * Детали. Если id отрицательный — мок. Иначе реальный + override.
   */
  getById: async (id: number): Promise<OrganizationDetail> => {
    if (id < 0) {
      const mock = mockDb.getById(id);
      if (!mock) throw new Error('Мок-организация не найдена');

      const building = await buildingApiStub(mock.building_id);
      return {
        id: mock.id,
        name: mock.name,
        phones: mock.phones,
        activities: mock.activities,
        building,
      };
    }

    const { data } = await apiClient.get<OrganizationDetail>(
        ENDPOINTS.organization(id),
    );

    const override = mockDb.getOverride(id);
    if (!override) return data;

    // Мерджим override поверх реальных данных
    return {
      ...data,
      name: override.name ?? data.name,
      phones: override.phones ?? data.phones,
      activities: override.activities ?? data.activities,
      building: override.building_id
          ? await buildingApiStub(override.building_id)
          : data.building,
    };
  },

  /**
   * Создание — только мок (бэкенд POST /organizations отсутствует).
   */
  create: async (payload: OrganizationFormPayload): Promise<Organization> => {
    return mockDb.create(payload);
  },

  /**
   * Обновление — мок-override (бэкенд PATCH отсутствует).
   */
  update: async (
      id: number,
      payload: OrganizationFormPayload,
  ): Promise<Organization> => {
    return mockDb.update(id, payload);
  },

  // Оставляем для совместимости с прежним интерфейсом
  searchByName: async (name: string) => {
    const res = await organizationApi.getAll({ name, limit: 1000 });
    return res.items as OrganizationDetail[];
  },

  getByBuilding: async (buildingId: number) => {
    const res = await organizationApi.getAll({
      building_id: buildingId,
      limit: 1000,
    });
    return { building_id: buildingId, organizations: res.items };
  },

  getByActivityId: async (activityId: number) => {
    const res = await organizationApi.getAll({
      activity_id: activityId,
      limit: 1000,
    });
    return { activity_id: activityId, organizations: res.items };
  },
};

/**
 * Заглушка, чтобы получить здание по id.
 * Реальный эндпоинт /buildings/{id} отсутствует, поэтому берём из area-поиска.
 */
async function buildingApiStub(buildingId: number) {
  const buildings = await buildingApi.getAll();
  const found = buildings.find((b) => b.id === buildingId);
  if (found) return found;
  return {
    id: buildingId,
    address: `Здание #${buildingId}`,
    latitude: 0,
    longitude: 0,
  };
}