import type { Activity } from '@/entities/activity';
import type { Building } from '@/entities/building';

export interface OrganizationPhone {
  phone_number: string;
}

export interface Organization {
  id: number;
  name: string;
  phones: OrganizationPhone[];
  activities: Activity[];
  /** Приходит только у мок-организаций и у деталей. */
  building_id?: number;
}

export interface OrganizationDetail extends Organization {
  building: Building;
}

export interface OrganizationFormPayload {
  name: string;
  phones: OrganizationPhone[];
  building_id: number;
  activities: number[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  page_count: number;
}