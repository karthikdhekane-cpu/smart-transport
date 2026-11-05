// useAttendance Hook - Custom React hook for attendance management
// Provides attendance records and QR/RFID scanning

import { useState, useEffect, useCallback } from 'react';
import { getAttendanceRecords, createAttendanceRecord } from '../services/attendanceApi';
import { AttendanceRecord } from '../types/index';

export interface UseAttendanceReturn {
  // Records
  records: AttendanceRecord[];
  recordsByBus: (busId: string) => AttendanceRecord[];
  recordsByStudent: (studentId: string) => AttendanceRecord[];
  recordsByTrip: (tripId: string) => AttendanceRecord[];
  
  // Actions
  createRecord: (data: {
    studentId: string;
    status: 'picked_up' | 'dropped_off';
    method: 'qr' | 'rfid' | 'manual';
    scanId: string;
    stopId?: string;
    stopName?: string;
  }) => Promise<{ success: boolean; attendance?: any; error?: string }>;
  
  // Loading state
  isLoading: boolean;
  
  // Refresh
  refresh: () => Promise<void>;
}

export function useAttendance(): UseAttendanceReturn {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const recordsData = await getAttendanceRecords();
        setRecords(recordsData);
      } catch (e) {
        console.error('Failed to load attendance records:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const recordsByBus = useCallback((busId: string) => {
    return records.filter(r => r.busId === busId);
  }, [records]);

  const recordsByStudent = useCallback((studentId: string) => {
    return records.filter(r => r.studentId === studentId);
  }, [records]);

  const recordsByTrip = useCallback((tripId: string) => {
    return records.filter(r => r.tripId === tripId);
  }, [records]);

  const createRecord = useCallback(async (data: {
    studentId: string;
    status: 'picked_up' | 'dropped_off';
    method: 'qr' | 'rfid' | 'manual';
    scanId: string;
    stopId?: string;
    stopName?: string;
  }) => {
    const result = await createAttendanceRecord(data);
    if (result.success) {
      setRecords(prev => [...prev, result.attendance]);
    }
    return result;
  }, []);

  const refresh = useCallback(async () => {
    const updatedRecords = await getAttendanceRecords();
    setRecords(updatedRecords);
  }, []);

  return {
    records,
    recordsByBus,
    recordsByStudent,
    recordsByTrip,
    createRecord,
    isLoading,
    refresh,
  };
}
