'use client';

import { useState, useEffect, useCallback } from 'react';
import { DriverBehaviourResult } from '../types/index';
import { driverBehaviourService } from '../services/DriverBehaviourService';

export function useDriverBehaviour(driverId?: string) {
  const [results, setResults] = useState<DriverBehaviourResult[]>([]);
  const [fleetAverage, setFleetAverage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setFleetAverage(driverBehaviourService.getFleetAverageSafetyScore());
      if (driverId) {
        const result = await driverBehaviourService.analyzeDriver(driverId);
        setResults(result ? [result] : []);
      } else {
        const all = await driverBehaviourService.analyzeAllDrivers();
        setResults(all);
      }
    } finally {
      setIsLoading(false);
    }
  }, [driverId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { results, fleetAverage, isLoading, refresh };
}
