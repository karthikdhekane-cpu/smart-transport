// useGPS Hook - Custom React hook for GPS tracking
// Manages GPS state, subscriptions, and updates

import { useState, useEffect, useCallback, useRef } from 'react';
import { gpsService } from '../services/GPSService';
import { GPSPosition, Bus } from '../types/index';

interface UseGPSReturn {
  buses: Bus[];
  positions: Record<string, GPSPosition>;
  history: Record<string, GPSPosition[]>;
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
  simulationSpeed: number;
  
  // Actions
  startSimulation: () => void;
  stopSimulation: () => void;
  restartSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  getBusPosition: (busId: string) => GPSPosition | null;
  getBusHistory: (busId: string) => GPSPosition[];
  refreshBuses: () => void;
}

interface GPSState {
  buses: Bus[];
  positions: Record<string, GPSPosition>;
  history: Record<string, GPSPosition[]>;
}

const INITIAL_STATE: GPSState = {
  buses: [],
  positions: {},
  history: {},
};

export function useGPS(): UseGPSReturn {
  const [state, setState] = useState<GPSState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simulationSpeed, setSimulationSpeedState] = useState(1);
  
  const unsubscribeRefs = useRef<Map<string, () => void>>(new Map());

  // Load buses initially
  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      setIsLoading(true);
      const buses = await gpsService.getAllBuses();
      
      const positions: Record<string, GPSPosition> = {};
      const history: Record<string, GPSPosition[]> = {};
      
      buses.forEach(bus => {
        const position = gpsService.getBusPosition(bus.id);
        if (position) {
          positions[bus.id] = position;
        }
        history[bus.id] = gpsService.getBusHistory(bus.id);
      });
      
      setState(prev => ({
        ...prev,
        buses,
        positions,
        history,
      }));
      setError(null);
      return buses;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load GPS data');
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to position updates
  useEffect(() => {
    const subscriptions: Map<string, () => void> = new Map();
    
    state.buses.forEach(bus => {
      const unsubscribe = gpsService.subscribeToUpdates(bus.id, (position) => {
        setState(prev => ({
          ...prev,
          positions: {
            ...prev.positions,
            [bus.id]: position,
          },
          history: {
            ...prev.history,
            [bus.id]: [
              ...prev.history[bus.id]?.slice(-99) || [],
              position,
            ],
          },
        }));
      });
      
      subscriptions.set(bus.id, unsubscribe);
    });
    
    unsubscribeRefs.current = subscriptions;
    
    return () => {
      subscriptions.forEach(unsubscribe => unsubscribe());
    };
  }, [state.buses]);

  // Start simulation on mount
  useEffect(() => {
    gpsService.startSimulation();
    return () => {
      gpsService.stopSimulation();
    };
  }, []);

  // Actions
  const startSimulation = useCallback(() => {
    gpsService.startSimulation();
    setIsPlaying(true);
  }, []);

  const stopSimulation = useCallback(() => {
    gpsService.stopSimulation();
    setIsPlaying(false);
  }, []);

  const restartSimulation = useCallback(() => {
    gpsService.restartSimulation();
    setIsPlaying(true);
  }, []);

  const setSimulationSpeed = useCallback((speed: number) => {
    setSimulationSpeedState(speed);
    gpsService.setSimulationSpeed(speed);
  }, []);

  const getBusPosition = useCallback((busId: string) => {
    return gpsService.getBusPosition(busId);
  }, []);

  const getBusHistory = useCallback((busId: string) => {
    return gpsService.getBusHistory(busId);
  }, []);

  const refreshBuses = useCallback(() => {
    loadBuses();
  }, []);

  return {
    buses: state.buses,
    positions: state.positions,
    history: state.history,
    isLoading,
    error,
    isPlaying,
    simulationSpeed,
    
    startSimulation,
    stopSimulation,
    restartSimulation,
    setSimulationSpeed,
    getBusPosition,
    getBusHistory,
    refreshBuses,
  };
}

export default useGPS;
