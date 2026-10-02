'use client';

import { useRouter } from 'next/navigation';
import { useOrganizations } from '@/entities/organization';
import { useFilterStore } from '@/shared/lib/store/filter-store';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { OrganizationTableSkeleton } from './OrganizationTableSkeleton';

const PAGE_SIZE = 10;

export function OrganizationTable() {
  const router = useRouter();
  const { search, buildingId, activityId, page, setPage } = useFilterStore();

  const { data, isLoading, isError, error } = useOrganizations({
    name: search || undefined,
    building_id: buildingId ?? undefined,
    activity_id: activityId ?? undefined,
    skip: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
  });

  if (isLoading) return <OrganizationTableSkeleton />;

  if (isError) {
    return (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Ошибка загрузки: {error instanceof Error ? error.message : 'неизвестно'}
        </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
        <div className="rounded-md border py-12 text-center text-muted-foreground">
          Ничего не найдено
        </div>
    );
  }

  return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Телефоны</TableHead>
                <TableHead>Виды деятельности</TableHead>
                <TableHead className="w-[140px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((org) => (
                  <TableRow
                      key={org.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/organizations/${org.id}`)}
                  >
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {org.phones.length > 0
                          ? org.phones.map((p) => p.phone_number).join(', ')
                          : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {org.activities.slice(0, 3).map((a) => (
                            <Badge key={a.id} variant="secondary">
                              {a.name}
                            </Badge>
                        ))}
                        {org.activities.length > 3 && (
                            <Badge variant="outline">
                              +{org.activities.length - 3}
                            </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/organizations/${org.id}/edit`);
                          }}
                      >
                        Редактировать
                      </Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Всего: {data.total} · Стр. {data.page} из {data.page_count}
        </span>
          <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
            >
              Назад
            </Button>
            <Button
                variant="outline"
                size="sm"
                disabled={page >= data.page_count}
                onClick={() => setPage(page + 1)}
            >
              Вперёд
            </Button>
          </div>
        </div>
      </div>
  );
}