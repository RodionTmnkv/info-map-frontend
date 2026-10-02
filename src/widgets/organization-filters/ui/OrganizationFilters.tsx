'use client';

import { useFilterStore } from '@/shared/lib/store/filter-store';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { BuildingSelect } from '@/features/organization-filter';
import { ActivityTreeSelect } from '@/features/activity-select';

export function OrganizationFilters() {
    const {
        search,
        setSearch,
        buildingId,
        setBuildingId,
        activityId,
        setActivityId,
        reset,
    } = useFilterStore();

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <Input
                    placeholder="Поиск по названию..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-72"
                />

                <BuildingSelect value={buildingId} onChange={setBuildingId} allowAll />

                <Button variant="outline" onClick={reset}>
                    Сбросить
                </Button>
            </div>

            <details className="rounded-md border p-3">
                <summary className="cursor-pointer text-sm font-medium">
                    Фильтр по виду деятельности
                </summary>
                <div className="pt-3">
                    <ActivityTreeSelect
                        value={activityId}
                        onChange={(v) => setActivityId(v as number | null)}
                    />
                </div>
            </details>
        </div>
    );
}