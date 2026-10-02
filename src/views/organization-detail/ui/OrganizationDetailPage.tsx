'use client';

import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Building2,
    Pencil,
    Phone,
    Tag,
} from 'lucide-react';
import { useOrganization } from '@/entities/organization';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function OrganizationDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const id = Number(params.id);
    const { data: org, isLoading, isError } = useOrganization(id);

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-3xl space-y-4 py-8">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        );
    }

    if (isError || !org) {
        return (
            <div className="container mx-auto max-w-3xl py-8">
                <p className="text-destructive">Организация не найдена</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/')}>
                    К списку
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-3xl space-y-6 py-8">
            <Button variant="ghost" onClick={() => router.push('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> К списку
            </Button>

            <div className="flex flex-wrap items-start justify-between gap-4">
                <h1 className="text-3xl font-bold">{org.name}</h1>
                <Button onClick={() => router.push(`/organizations/${org.id}/edit`)}>
                    <Pencil className="mr-2 h-4 w-4" /> Редактировать
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" /> Телефоны
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {org.phones.length > 0 ? (
                        <ul className="space-y-1">
                            {org.phones.map((p, i) => (
                                <li key={i} className="text-muted-foreground">
                                    {p.phone_number}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground">Не указаны</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" /> Здание
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    <p className="font-medium">{org.building.address}</p>
                    <p className="text-sm text-muted-foreground">
                        Координаты: {org.building.latitude}, {org.building.longitude}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" /> Виды деятельности
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {org.activities.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {org.activities.map((a) => (
                                <Badge key={a.id} variant="secondary">
                                    {a.name}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Не указаны</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}