'use client';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { BuildingWithOrgs } from '@/entities/building';

interface Props {
    buildings: BuildingWithOrgs[];
}

const ROSTOV_CENTER: [number, number] = [47.2357, 39.7015];

export function MapView({ buildings }: Props) {
    return (
        <MapContainer
            center={ROSTOV_CENTER}
            zoom={12}
            className="h-[600px] w-full rounded-lg border"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {buildings.map((b) => (
                <Marker key={b.id} position={[b.latitude, b.longitude]}>
                    <Popup>
                        <div className="space-y-1 text-sm">
                            <strong>{b.address}</strong>
                            {b.organizations && b.organizations.length > 0 && (
                                <ul className="list-inside list-disc">
                                    {b.organizations.map((o) => (
                                        <li key={o.id}>{o.name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}