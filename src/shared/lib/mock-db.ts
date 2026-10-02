import { MOCK_ORGANIZATIONS } from '@/shared/config/mock-data';
import type {
    Organization,
    OrganizationFormPayload,
} from '@/entities/organization';

const STORAGE_KEY = 'info-map:mock-db:v1';

interface MockDBState {
    /** Организации, созданные на фронте (отрицательные id). */
    created: Array<Organization & { building_id: number }>;
    /** Патчи, накладываемые на реальные организации с бэкенда. */
    overrides: Record<number, Partial<Organization> & { building_id?: number }>;
}

let state: MockDBState = {
    created: MOCK_ORGANIZATIONS.map((o) => ({
        id: o.id,
        name: o.name,
        phones: o.phones,
        activities: o.activities.map((id) => ({
            id,
            name: lookupActivityName(id),
            parent_id: null,
        })),
        building_id: o.building_id,
    })),
    overrides: {},
};

let initialized = false;

// Локальный импорт, чтобы избежать циклических зависимостей
import { MOCK_ACTIVITIES } from '@/shared/config/mock-data';

function lookupActivityName(id: number): string {
    return MOCK_ACTIVITIES.find((a) => a.id === id)?.name ?? `#${id}`;
}

function ensureInit(): void {
    if (initialized) return;
    if (typeof window === 'undefined') return;
    initialized = true;

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as MockDBState;
            state = {
                created: parsed.created ?? [],
                overrides: parsed.overrides ?? {},
            };
        }
    } catch {
        // ignore corrupt storage
    }
}

function persist(): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // ignore quota errors
    }
}

function nextNegativeId(): number {
    const ids = state.created.map((o) => o.id);
    const min = ids.length > 0 ? Math.min(...ids) : 0;
    return min - 1;
}

export const mockDb = {
    getCreated(): Array<Organization & { building_id: number }> {
        ensureInit();
        return state.created;
    },

    getOverrides(): Record<number, Partial<Organization> & { building_id?: number }> {
        ensureInit();
        return state.overrides;
    },

    getOverride(id: number) {
        ensureInit();
        return state.overrides[id];
    },

    getById(id: number): (Organization & { building_id: number }) | undefined {
        ensureInit();
        return state.created.find((o) => o.id === id);
    },

    create(payload: OrganizationFormPayload): Organization & { building_id: number } {
        ensureInit();

        const activities = payload.activities.map((id) => ({
            id,
            name: lookupActivityName(id),
            parent_id: MOCK_ACTIVITIES.find((a) => a.id === id)?.parent_id ?? null,
        }));

        const org: Organization & { building_id: number } = {
            id: nextNegativeId(),
            name: payload.name,
            phones: payload.phones,
            activities,
            building_id: payload.building_id,
        };

        state.created = [...state.created, org];
        persist();
        return org;
    },

    update(
        id: number,
        payload: OrganizationFormPayload,
    ): Organization & { building_id: number } {
        ensureInit();

        const activities = payload.activities.map((aid) => ({
            id: aid,
            name: lookupActivityName(aid),
            parent_id: MOCK_ACTIVITIES.find((a) => a.id === aid)?.parent_id ?? null,
        }));

        // Обновление мок-организации
        const existingIdx = state.created.findIndex((o) => o.id === id);
        if (existingIdx >= 0) {
            const updated: Organization & { building_id: number } = {
                ...state.created[existingIdx],
                name: payload.name,
                phones: payload.phones,
                activities,
                building_id: payload.building_id,
            };
            state.created = state.created.map((o, i) => (i === existingIdx ? updated : o));
            persist();
            return updated;
        }

        // Override реальной организации
        const patch = {
            name: payload.name,
            phones: payload.phones,
            activities,
            building_id: payload.building_id,
        };
        state.overrides[id] = { ...(state.overrides[id] ?? {}), ...patch };
        persist();

        return {
            id,
            ...patch,
        };
    },

    reset(): void {
        state = {
            created: MOCK_ORGANIZATIONS.map((o) => ({
                id: o.id,
                name: o.name,
                phones: o.phones,
                activities: o.activities.map((aid) => ({
                    id: aid,
                    name: lookupActivityName(aid),
                    parent_id: null,
                })),
                building_id: o.building_id,
            })),
            overrides: {},
        };
        persist();
    },
};