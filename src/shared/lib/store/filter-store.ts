import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FilterState {
    search: string;
    buildingId: number | null;
    activityId: number | null;
    page: number;
    setSearch: (v: string) => void;
    setBuildingId: (v: number | null) => void;
    setActivityId: (v: number | null) => void;
    setPage: (v: number) => void;
    reset: () => void;
}

const initialState = {
    search: '',
    buildingId: null,
    activityId: null,
    page: 1,
};

export const useFilterStore = create<FilterState>()(
    devtools(
        (set) => ({
            ...initialState,
            setSearch: (search) => set({ search, page: 1 }),
            setBuildingId: (buildingId) => set({ buildingId, page: 1 }),
            setActivityId: (activityId) => set({ activityId, page: 1 }),
            setPage: (page) => set({ page }),
            reset: () => set(initialState),
        }),
        { name: 'filter-store' },
    ),
);