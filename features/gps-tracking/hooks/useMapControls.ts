// useMapControls Hook - Custom React hook for map view controls

import { useState, useCallback } from 'react';
import { gpsService } from '../services/GPSService';
import { MapViewState } from '../types';

interface UseMapControlsReturn {
  mapState: MapViewState;
  
  // Actions
  toggleFollowBus: () => void;
  toggleShowRoute: () => void;
  toggleShowStops: () => void;
  toggleShowHistory: () => void;
  toggleSatelliteMode: () => void;
  setFollowBus: (follow: boolean) => void;
  setShowRoute: (show: boolean) => void;
  setShowStops: (show: boolean) => void;
  setShowHistory: (show: boolean) => void;
  setSatelliteMode: (mode: boolean) => void;
  updateMapViewState: (state: Partial<MapViewState>) => void;
}

export function useMapControls(): UseMapControlsReturn {
  const [mapState, setMapState] = useState<MapViewState>({
    center: { lat: 11.0168, lng: 76.9558 },
    zoom: 14,
    bearing: 0,
    pitch: 0,
    followsBus: true,
    showRoute: true,
    showStops: true,
    showHistory: false,
    satelliteMode: false,
  });

  const updateMapViewState = useCallback((newState: Partial<MapViewState>) => {
    setMapState(prev => ({ ...prev, ...newState }));
    gpsService.setMapViewState(newState);
  }, []);

  const toggleFollowBus = useCallback(() => {
    const newState = !mapState.followsBus;
    updateMapViewState({ followsBus: newState });
  }, [mapState.followsBus, updateMapViewState]);

  const toggleShowRoute = useCallback(() => {
    const newState = !mapState.showRoute;
    updateMapViewState({ showRoute: newState });
  }, [mapState.showRoute, updateMapViewState]);

  const toggleShowStops = useCallback(() => {
    const newState = !mapState.showStops;
    updateMapViewState({ showStops: newState });
  }, [mapState.showStops, updateMapViewState]);

  const toggleShowHistory = useCallback(() => {
    const newState = !mapState.showHistory;
    updateMapViewState({ showHistory: newState });
  }, [mapState.showHistory, updateMapViewState]);

  const toggleSatelliteMode = useCallback(() => {
    const newState = !mapState.satelliteMode;
    updateMapViewState({ satelliteMode: newState });
  }, [mapState.satelliteMode, updateMapViewState]);

  return {
    mapState,
    
    toggleFollowBus,
    toggleShowRoute,
    toggleShowStops,
    toggleShowHistory,
    toggleSatelliteMode,
    
    setFollowBus: (follow: boolean) => updateMapViewState({ followsBus: follow }),
    setShowRoute: (show: boolean) => updateMapViewState({ showRoute: show }),
    setShowStops: (show: boolean) => updateMapViewState({ showStops: show }),
    setShowHistory: (show: boolean) => updateMapViewState({ showHistory: show }),
    setSatelliteMode: (mode: boolean) => updateMapViewState({ satelliteMode: mode }),
    
    updateMapViewState,
  };
}

export default useMapControls;
