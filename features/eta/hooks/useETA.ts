// useETA Hook - Custom React hook for Dynamic ETA
// Provides ETA state, updates, and actions for ETA feature

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { etaService } from '../services/ETAService';
import { BusETAState } from '../types';

interface UseETAReturn {
  busStates: BusETAState[];
  currentBusState: BusETAState | undefined;
  isLoading: boolean;
  isPlaying: boolean;
  simulationSpeed: number;
  
  // Actions
  startSimulation: () => void;
  stopSimulation: () => void;
  restartSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  getBusETA: (busId: string) => BusETAState | undefined;
  refreshBuses: () => void;
}

interface ETAState {
  busStates: BusETAState[];
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: ETAState = {
  busStates: [],
  isLoading: true,
  error: null,
};

export function useETA(busId?: string): UseETAReturn {
  const [state, setState] = useState<ETAState>(INITIAL_STATE);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simulationSpeed, setSimulationSpeedState] = useState(1);
  const mountedRef = useRef(true);
  
  // Load buses initially
  useEffect(() => {
    mountedRef.current = true;
    loadBuses();
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadBuses = useCallback(() => {
    if (!mountedRef.current) return;
    
    // Skip loading on server-side
    if (typeof window === 'undefined') {
      setState(prev => ({
        ...prev,
        busStates: [],
        isLoading: false,
      }));
      return;
    }
    
    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
      }));
      
      const busStates = etaService.getAllBusStates();
      
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          busStates,
          isLoading: false,
        }));
      }
    } catch (err) {
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Failed to load ETA data',
          isLoading: false,
        }));
      }
    }
  }, []);

  // Start/stop simulation on mount/unmount
  useEffect(() => {
    etaService.startSimulation();
    setIsPlaying(true);
    
    return () => {
      etaService.stopSimulation();
      setIsPlaying(false);
    };
  }, []);

  // Actions
  const startSimulation = useCallback(() => {
    etaService.startSimulation();
    setIsPlaying(true);
  }, []);

  const stopSimulation = useCallback(() => {
    etaService.stopSimulation();
    setIsPlaying(false);
  }, []);

  const restartSimulation = useCallback(() => {
    etaService.stopSimulation();
    etaService.startSimulation();
    setIsPlaying(true);
  }, []);

  const setSimulationSpeed = useCallback((speed: number) => {
    setSimulationSpeedState(speed);
    // Simulation speed is currently fixed in the simulator
  }, []);

  const getBusETA = useCallback((bid: string) => {
    return etaService.getBusETA(bid);
  }, []);

  const refreshBuses = useCallback(() => {
    loadBuses();
  }, [loadBuses]);

  // Get current bus state if busId is provided - memoized to prevent unnecessary recalculations
  const currentBusState = useMemo(() => {
    if (!busId) return undefined;
    return etaService.getBusETA(busId);
  }, [busId]);

  return {
    busStates: state.busStates,
    currentBusState,
    isLoading: state.isLoading,
    isPlaying,
    simulationSpeed,
    
    startSimulation,
    stopSimulation,
    restartSimulation,
    setSimulationSpeed,
    getBusETA,
    refreshBuses,
  };
}

export default useETA;
