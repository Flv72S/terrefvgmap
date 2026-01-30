
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { Farm, Category } from '../types';

// Funzione per generare l'icona "classica" a forma di goccia
const createFarmIcon = (category: string, isSelected: boolean) => {
  let emoji = '🌿';
  
  // Assegna icone specifiche per categoria (gestendo anche stringhe dinamiche)
  if (category.toLowerCase().includes('agriturismo')) emoji = '🛌';
  else if (category.toLowerCase().includes('agricampeggio')) emoji = '⛺';
  else if (category.toLowerCase().includes('vino') || category.toLowerCase().includes('birra') || category.toLowerCase().includes('agricola')) emoji = '🍇';

  const color = isSelected ? '#43362d' : '#605045';
  const size = isSelected ? 48 : 40;

  // SVG di un puntatore classico a goccia
  return L.divIcon({
    className: 'custom-farm-icon',
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
        <svg viewBox="0 0 384 512" style="width: 100%; height: 100%; fill: ${color}; stroke: white; stroke-width: 20px; transition: all 0.3s ease;">
          <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
        </svg>
        <div style="position: absolute; top: 22%; font-size: ${size * 0.45}px; pointer-events: none;">
          ${emoji}
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
};

interface MapControllerProps {
  center: [number, number];
  zoom: number;
}

const MapController: React.FC<MapControllerProps> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

interface FarmMapProps {
  farms: Farm[];
  selectedFarmId: string | null;
  onSelectFarm: (farm: Farm) => void;
  mapCenter: [number, number];
  zoom: number;
  darkMode?: boolean;
}

const FarmMap: React.FC<FarmMapProps> = ({ farms, selectedFarmId, onSelectFarm, mapCenter, zoom, darkMode }) => {
  const tileUrl = darkMode 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="w-full h-full relative transition-all duration-500">
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url={tileUrl}
        />
        <ZoomControl position="bottomright" />
        <MapController center={mapCenter} zoom={zoom} />
        
        {farms.map((farm) => (
          <Marker 
            key={farm.id} 
            position={[farm.lat, farm.lng]} 
            icon={createFarmIcon(farm.category, selectedFarmId === farm.id)}
            eventHandlers={{
              click: () => onSelectFarm(farm),
            }}
          />
        ))}
      </MapContainer>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-[#1a1614]/90 backdrop-blur-md px-8 py-3 rounded-full shadow-2xl border border-gray-100 dark:border-white/10 z-[1000] hidden md:block transition-all hover:scale-105">
        <p className="text-[10px] font-black text-[#43362d] dark:text-gray-200 uppercase tracking-[0.2em]">Scegli la tua prossima tappa d'eccellenza</p>
      </div>
    </div>
  );
};

export default FarmMap;
