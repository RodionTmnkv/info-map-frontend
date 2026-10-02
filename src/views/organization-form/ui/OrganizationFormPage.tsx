'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useOrganization } from '@/entities/organization';
import { OrganizationForm } from '@/features/organization-form';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';

interface Props {
    mode: 'create' | 'edit';
}

export function OrganizationFormPage({ mode }: Props) {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const organizationId = mode === 'edit' ? Number(params.id) : undefined;

    const { data: org, isLoading } = useOrganization(organizationId ?? 0);

    return (
        <div className="container mx-auto max-w-3xl space-y-6 py-8">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Назад
            </Button>

            <h1 className="text-3xl font-bold">
                {mode === 'create' ? 'Создание организации' : 'Редактирование организации'}
            </h1>

            {mode === 'edit' && isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            ) : (
                <OrganizationForm
                    organization={mode === 'edit' ? org : undefined}
                    organizationId={organizationId}
                />
            )}
        </div>
    );
}