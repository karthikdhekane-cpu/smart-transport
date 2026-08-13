// useBusETA Hook - Custom React hook for calculating and tracking ETA

import { useState, useEffect, useCallback, useMemo } from 'react';
import { gpsService } from '../services/GPSService';
import { GPSPosition } from '../types';

interface useBusETAReturn {
  etaSeconds: number;
  etaText: string;
  estimatedArrival: Date | null;
  timeRemaining: number;
  isEstimating: boolean;
  refreshETA: () => void;
}

export function useBusETA(busId: string): useBusETAReturn {
  const [etaData, setEtaData] = useState({
    etaSeconds: 0,
    etaText: 'N/A',
    estimatedArrival: null as Date | null,
    timeRemaining: 0,
  });
  const [isEstimating, setIsEstimating] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(0);

  const calculateETA = useCallback(async () => {
    try {
      setIsEstimating(true);
      const { etaSeconds, etaText } = gpsService.calculateETA(busId);
      const estimatedArrival = etaSeconds > 0 
        ? new Date(Date.now() + etaSeconds * 1000)
        : null;
      
      setEtaData({
        etaSeconds,
        etaText,
        estimatedArrival,
        timeRemaining: etaSeconds,
      });
      setLastUpdate(Date.now());
      setIsEstimating(false);
    } catch (err) {
      setIsEstimating(false);
    }
  }, [busId]);

  // Calculate initial ETA
  useEffect(() => {
    calculateETA();
  }, [busId, calculateETA]);

  // Refresh ETA periodically
  useEffect(() => {
    const interval = setInterval(() => {
      calculateETA();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [busId, calculateETA]);

  // Refresh if significantly old
  useEffect(() => {
    const shouldRefresh = Date.now() - lastUpdate > 60000; // 1 minute
    if (shouldRefresh) {
      calculateETA();
    }
  }, [lastUpdate, calculateETA]);

  const refreshETA = useCallback(() => {
    calculateETA();
  }, [calculateETA]);

  return {
    ...etaData,
    isEstimating,
    refreshETA,
  };
}

export default useBusETA;
