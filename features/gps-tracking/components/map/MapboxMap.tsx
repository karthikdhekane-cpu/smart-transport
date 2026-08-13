'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GPSPosition, BusRoute, BusStop } from '../../types';
import { calculateBearing, calculateDistance, formatDistance } from '../../utils/math';

// Mapbox token - using a placeholder for demo
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1Ijoic21hcnQtdHJhbnNwb3J0IiwiYSI6ImNreHZ0Y2F6ZjA4eW0yc28yd2JhN2R6Y2gifQ.dummy';

mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapboxMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  followBus: boolean;
  showRoute: boolean;
  showStops: boolean;
  showHistory: boolean;
  satelliteMode: boolean;
  currentBusId?: string;
  currentBusColor?: string;
  currentBusPosition?: GPSPosition;
  busPositions: Record<string, GPSPosition>;
  buses: any[];
  route?: BusRoute;
  busHistory: Record<string, GPSPosition[]>;
  onBusClick?: (busId: string) => void;
}

export default function MapboxMap({
  center,
  zoom = 14,
  followBus,
  showRoute,
  showStops,
  showHistory,
  satelliteMode,
  currentBusId,
  currentBusColor,
  currentBusPosition,
  busPositions,
  buses,
  route,
  busHistory,
  onBusClick,
}: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: satelliteMode ? 'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/streets-v12',
      center: [center.lng, center.lat],
      zoom: zoom,
      attributionControl: true,
    });
    
    map.on('load', () => {
      setMapLoaded(true);
      
      // Add route layer if available
      if (showRoute && route && route.stops.length > 1) {
        // Create route coordinates
        const routeCoordinates = route.stops.map(stop => [stop.lng, stop.lat]);
        
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: routeCoordinates,
            },
          },
        });
        
        // Route line
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': route.color || '#00C853',
            'line-width': 4,
            'line-opacity': 0.7,
          },
        });
        
        // Route dashes (remaining route)
        map.addLayer({
          id: 'route-dashes',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#d1d5db',
            'line-width': 3,
            'line-dasharray': [4, 2],
            'line-opacity': 0.5,
          },
        });
      }
      
      // Add bus stop markers
      if (showStops && route) {
        route.stops.forEach((stop, index) => {
          const marker = new mapboxgl.Marker({
            color: index < route.stops.length - 1 ? (route.color || '#00C853') : '#d1d5db',
            scale: 0.8,
          })
            .setLngLat([stop.lng, stop.lat])
            .addTo(map);
          
          // Add popup for stops
          const popup = new mapboxgl.Popup({ offset: 25 }).setText(stop.name);
          marker.setPopup(popup);
        });
      }
    });
    
    // Handle user interaction - stop following if user pans
    map.on('dragstart', () => {
      // Follow mode is disabled when user interacts
    });
    
    mapRef.current = map;
    
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom, satelliteMode, showRoute, showStops, route]);
  
  // Update map when options change
  useEffect(() => {
    if (!mapRef.current) return;
    
    if (satelliteMode) {
      mapRef.current.setStyle('mapbox://styles/mapbox/satellite-v9');
    } else {
      mapRef.current.setStyle('mapbox://styles/mapbox/streets-v12');
    }
    
    if (showRoute && route) {
      // Update route visibility
    }
  }, [satelliteMode, showRoute, route]);
  
  // Update map center when followBus changes
  useEffect(() => {
    if (!mapRef.current || !followBus || !currentBusPosition) return;
    
    mapRef.current.flyTo({
      center: [currentBusPosition.lng, currentBusPosition.lat],
      zoom: zoom,
      essential: true,
      duration: 1000,
    });
  }, [followBus, currentBusPosition, zoom]);
  
  // Add/update bus markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    
    // Remove existing bus markers
    const existingMarkers = document.querySelectorAll('.bus-marker');
    existingMarkers.forEach(el => el.remove());
    
    // Add new markers
    Object.entries(busPositions).forEach(([busId, position]) => {
      const bus = buses.find((b: any) => b.id === busId);
      if (!bus) return;
      
      const isCurrent = busId === currentBusId;
      
      // Create bus marker element
      const el = document.createElement('div');
      el.className = 'bus-marker cursor-pointer hover:scale-110 transition-transform';
      
      // Marker content
      const heading = position.heading || 0;
      el.innerHTML = `
        <div style="transform: translate(-50%, -50%) rotate(${heading}deg); position: relative;">
          <div style="
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: ${bus.color};
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            animation: bounce 2s ease-in-out infinite;
          ">
            🚌
          </div>
          ${isCurrent ? '<div style="position: absolute; top: -10px; right: -10px; width: 12px; height: 12px; background: #FFD700; border-radius: 50%; border: 2px solid white;"></div>' : ''}
        </div>
      `;
      
      const marker = new (mapboxgl as any).Marker({ element: el, anchor: 'center' })
        .setLngLat([position.lng, position.lat])
        .addTo(mapRef.current);
      
      // Add click handler
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onBusClick) onBusClick(busId);
      });
      
      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'translate(-50%, -50%) rotate(' + heading + 'deg) scale(1.2)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(-50%, -50%) rotate(' + heading + 'deg)';
      });
      
      // Add popup with bus info
      const popupContent = `
        <div style="font-family: Arial, sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: ${bus.color}; font-size: 16px;">${bus.number}</h3>
          <p style="margin: 0 0 4px 0; color: #333;">${bus.driverName}</p>
          <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">${bus.status.toUpperCase()}</p>
          <p style="margin: 0; color: #333; font-size: 14px;">${formatDistance(position.speed ? position.speed * 1000 / 3600 : 0)}h ago</p>
        </div>
      `;
      const popup = new (mapboxgl as any).Popup({ offset: 25 }).setHTML(popupContent);
      (marker as any).setPopup(popup);
    });
  }, [busPositions, buses, currentBusId, onBusClick, mapLoaded]);
  
  return (
    <div ref={mapContainerRef} className="w-full h-full rounded-xl overflow-hidden" />
  );
}
