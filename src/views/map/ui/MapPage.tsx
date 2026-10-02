'use client';

import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBuildings } from '@/entities/building';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';

const MapView = dynamic(
    () => import('./MapView').then((m) => m.MapView),
    {
        ssr: false,
        loading: () => <Skeleton className="h-[600px] w-full" />,
    },
);

export function MapPage() {
    const router = useRouter();
    const { data: buildings, isLoading } = useBuildings();

    return (
        <div className="container mx-auto space-y-6 py-8">
            <Button variant="ghost" onClick={() => router.push('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> К списку
            </Button>

            <div>
                <h1 className="text-3xl font-bold">Карта зданий</h1>
                <p className="text-sm text-muted-foreground">
                    Найдено зданий: {buildings?.length ?? 0}
                </p>
            </div>

            {isLoading ? (
                <Skeleton className="h-[600px] w-full" />
            ) : (
                <MapView buildings={buildings ?? []} />
            )}
        </div>
    );
}