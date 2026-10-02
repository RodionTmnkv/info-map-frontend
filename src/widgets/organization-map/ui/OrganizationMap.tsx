'use client';

import dynamic from 'next/dynamic';
import { useBuildings } from '@/entities/building/api/queries';

const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false }
);

export function OrganizationMap() {
  const { data: buildings = [] } = useBuildings();

  return (
    <MapContainer
      center={[47.2357, 39.7015]} // Ростов-на-Дону
      zoom={12}
      className="h-[500px] w-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {buildings.map((b) => (
        <Marker key={b.id} position={[b.latitude, b.longitude]}>
          <Popup>
            <div className="space-y-1">
              <strong>{b.address}</strong>
              {/* Здесь можно загрузить организации для здания */}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}