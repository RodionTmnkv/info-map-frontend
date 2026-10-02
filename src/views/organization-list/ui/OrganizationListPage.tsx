'use client';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { RotateCcw } from 'lucide-react';
import { OrganizationTable } from '@/widgets/organization-table';
import { OrganizationFilters } from '@/widgets/organization-filters';
import { Button } from '@/shared/ui/button';
import { mockDb } from '@/shared/lib/mock-db';
import { organizationKeys } from '@/entities/organization';

function ResetMockButton() {
    const qc = useQueryClient();

    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
                mockDb.reset();
                qc.invalidateQueries({ queryKey: organizationKeys.all });
            }}
        >
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Сбросить демо-данные
        </Button>
    );
}

export function OrganizationListPage() {
    return (
        <div className="container mx-auto flex min-h-screen flex-col space-y-6 py-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Организации</h1>
                    <p className="text-sm text-muted-foreground">
                        Справочник организаций города
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/map">На карте</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/organizations/create">Создать организацию</Link>
                    </Button>
                </div>
            </div>

            <OrganizationFilters />
            <OrganizationTable />

            <div className="mt-auto flex justify-center pt-8">
                <ResetMockButton />
            </div>
        </div>
    );
}