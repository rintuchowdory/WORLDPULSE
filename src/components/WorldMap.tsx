import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { WorldEvent, EventType } from '@/types';
import { EVENT_TYPES } from '@/data/eventConfig';

// Import the worker URL so Vite bundles it with correct MIME type
// in production. Using ?worker&url gives us a resolved URL string.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

maplibregl.setWorkerUrl(workerUrl);

interface WorldMapProps {
  events: WorldEvent[];
  activeTypes: Set<EventType>;
  selectedEventId: string | null;
  onSelectEvent: (event: WorldEvent) => void;
  timeFilter: number;
}

const MAP_STYLE = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#0a0e1a' },
    },
    {
      id: 'osm-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

function createMarkerElement(event: WorldEvent, isSelected: boolean): HTMLDivElement {
  const el = document.createElement('div');
  const def = EVENT_TYPES[event.type];

  el.className = 'wp-map-marker';
  el.style.cssText = `
    width: ${isSelected ? '32' : '20'}px;
    height: ${isSelected ? '32' : '20'}px;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  `;

  const severityOpacity = {
    critical: 1,
    high: 0.9,
    medium: 0.75,
    low: 0.55,
    info: 0.45,
  };

  el.innerHTML = `
    <div style="
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: ${def.color};
      box-shadow: 0 0 ${isSelected ? '20' : '12'}px ${def.color}, 0 0 ${isSelected ? '40' : '24'}px ${def.color}88;
      opacity: ${severityOpacity[event.severity] ?? 0.6};
      border: ${isSelected ? '3' : '2'}px solid rgba(255,255,255,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: wp-pulse 2s ease-in-out infinite;
    ">
      ${isSelected ? `<span style="color:white;font-size:14px;font-weight:700;">!</span>` : ''}
    </div>
  `;

  return el;
}

export function WorldMap({ events, activeTypes, selectedEventId, onSelectEvent, timeFilter }: WorldMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  // Initialize map once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE as maplibregl.StyleSpecification,
      center: [10, 25],
      zoom: 1.8,
      maxZoom: 12,
      minZoom: 1,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showZoom: true, showCompass: false }), 'bottom-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

    map.on('load', () => {
      // Add a subtle graticule via background
      map.setPaintProperty('background', 'background-color', '#0a0e1a');
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when events or filters change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    const now = Date.now();
    const cutoff = now - timeFilter * 60 * 1000;

    events.forEach((event) => {
      if (!activeTypes.has(event.type)) return;
      if (timeFilter > 0 && new Date(event.occurred_at).getTime() < cutoff) return;

      const isSelected = event.id === selectedEventId;
      const el = createMarkerElement(event, isSelected);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectEvent(event);
        map.flyTo({
          center: [event.longitude, event.latitude],
          zoom: Math.max(map.getZoom(), 3.5),
          duration: 800,
        });
      });

      const marker = new maplibregl.Marker(el)
        .setLngLat([event.longitude, event.latitude])
        .addTo(map);

      markersRef.current.set(event.id, marker);
    });
  }, [events, activeTypes, selectedEventId, onSelectEvent, timeFilter]);

  // Fly to selected event
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedEventId) return;
    const event = events.find((e) => e.id === selectedEventId);
    if (event) {
      map.flyTo({
        center: [event.longitude, event.latitude],
        zoom: Math.max(map.getZoom(), 3.5),
        duration: 800,
      });
    }
  }, [selectedEventId, events]);

  return <div ref={mapContainer} className="absolute inset-0 w-full h-full" />;
}
