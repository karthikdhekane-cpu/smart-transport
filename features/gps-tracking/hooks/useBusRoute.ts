// useBusRoute Hook - Custom React hook for bus route data

import { useState, useEffect, useCallback } from 'react';
import { gpsService } from '../services/GPSService';
import { BusRoute, BusStop } from '../types';

interface useBusRouteReturn {
  route: BusRoute | null;
  stops: BusStop[];
  currentStopIndex: number;
  nextStop: BusStop | null;
  previousStop: BusStop | null;
  totalDistance: number;
  estimatedDuration: number;
  isLoading: boolean;
  refreshRoute: () => void;
}

export function useBusRoute(busId: string): useBusRouteReturn {
  const [route, setRoute] = useState<BusRoute | null>(null);
  const [stops, setStops] = useState<BusStop[]>([]);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadRoute = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get bus info
      const bus = await gpsService.getBusInfo(busId);
      if (!bus) {
        setStops([]);
        setRoute(null);
        setIsLoading(false);
        return;
      }

      // Get route info
      const busRoute = await gpsService.getRouteInfo(bus.routeId);
      if (!busRoute) {
        setStops([]);
        setRoute(null);
        setIsLoading(false);
        return;
      }

      setRoute(busRoute);
      setStops(busRoute.stops);
      
      // Calculate current stop index (simplified - would need GPS position in real implementation)
      // For now, assume we're at a random stop based on bus status
      const currentStopIndex = Math.floor(Math.random() * (busRoute.stops.length - 1));
      setCurrentStopIndex(currentStopIndex);
      
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  }, [busId]);

  useEffect(() => {
    loadRoute();
  }, [busId, loadRoute]);

  const refreshRoute = useCallback(() => {
    loadRoute();
  }, [loadRoute]);

  const currentStop = stops[currentStopIndex] || null;
  const nextStop = stops[currentStopIndex + 1] || null;
  const previousStop = currentStopIndex > 0 ? stops[currentStopIndex - 1] : null;

  return {
    route,
    stops,
    currentStopIndex,
    nextStop,
    previousStop,
    totalDistance: route?.totalDistance || 0,
    estimatedDuration: route?.estimatedDuration || 0,
    isLoading,
    refreshRoute,
  };
}

export default useBusRoute;
