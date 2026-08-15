// useDriverState Hook - Custom React hook for driver state management
// Provides driver status, availability, and session state

import { useState, useEffect, useCallback } from 'react';
import { driverStateService } from '../services/DriverStateService';
import { DriverStatus, DriverAvailability, DriverSession } from '../types/index';

export interface UseDriverStateReturn {
  // Driver Status
  status: DriverStatus;
  setStatus: (status: DriverStatus) => void;
  
  // Driver Availability
  availability: DriverAvailability;
  setAvailability: (availability: DriverAvailability) => void;
  
  // Session
  session: DriverSession | null;
  startSession: (busId?: string) => void;
  endSession: () => void;
  
  // Loading state
  isLoading: boolean;
}

export function useDriverState(driverId: string): UseDriverStateReturn {
  const [status, setStatus] = useState<DriverStatus>(driverStateService.getDriverStatus(driverId));
  const [availability, setAvailability] = useState<DriverAvailability>(driverStateService.getDriverAvailability(driverId));
  const [session, setSession] = useState<DriverSession | null>(driverStateService.getCurrentSession(driverId));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set initial values
    setStatus(driverStateService.getDriverStatus(driverId));
    setAvailability(driverStateService.getDriverAvailability(driverId));
    setSession(driverStateService.getCurrentSession(driverId));
    setIsLoading(false);
  }, [driverId]);

  const setStatusHandler = useCallback((newStatus: DriverStatus) => {
    const success = driverStateService.setDriverStatus(driverId, newStatus);
    if (success) {
      setStatus(newStatus);
    }
  }, [driverId]);

  const setAvailabilityHandler = useCallback((newAvailability: DriverAvailability) => {
    const success = driverStateService.setDriverAvailability(driverId, newAvailability);
    if (success) {
      setAvailability(newAvailability);
    }
  }, [driverId]);

  const startSessionHandler = useCallback((busId?: string) => {
    const success = driverStateService.startSession(driverId, busId);
    if (success) {
      setSession(driverStateService.getCurrentSession(driverId));
    }
  }, [driverId]);

  const endSessionHandler = useCallback(() => {
    const success = driverStateService.endSession(driverId);
    if (success) {
      setSession(driverStateService.getCurrentSession(driverId));
    }
  }, [driverId]);

  return {
    status,
    setStatus: setStatusHandler,
    availability,
    setAvailability: setAvailabilityHandler,
    session,
    startSession: startSessionHandler,
    endSession: endSessionHandler,
    isLoading,
  };
}
