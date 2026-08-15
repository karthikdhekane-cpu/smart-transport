// useAttendance Hook - Custom React hook for attendance management
// Provides attendance records and QR/RFID scanning

import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../services/AttendanceService';
import { AttendanceRecord, AttendanceType } from '../types/index';

export interface UseAttendanceReturn {
  // Records
  records: AttendanceRecord[];
  recordsByBus: (busId: string) => AttendanceRecord[];
  recordsByStudent: (studentId: string) => AttendanceRecord[];
  
  // Actions
  scanQR: (data: string) => { success: boolean; message: string };
  scanRFID: (tagId: string) => { success: boolean; message: string };
  
  // Loading state
  isLoading: boolean;
}

export function useAttendance(): UseAttendanceReturn {
  const [records, setRecords] = useState<AttendanceRecord[]>(() => attendanceService.getAllAttendanceRecords());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setRecords(attendanceService.getAllAttendanceRecords());
    setIsLoading(false);
  }, []);

  const recordsByBus = useCallback((busId: string) => {
    return attendanceService.getAttendanceByBus(busId);
  }, []);

  const recordsByStudent = useCallback((studentId: string) => {
    return attendanceService.getAttendanceByStudent(studentId);
  }, []);

  const scanQR = useCallback((data: string) => {
    const result = attendanceService.processQRScan(data);
    setRecords(attendanceService.getAllAttendanceRecords());
    return result;
  }, []);

  const scanRFID = useCallback((tagId: string) => {
    const result = attendanceService.processRFIDScan(tagId);
    setRecords(attendanceService.getAllAttendanceRecords());
    return result;
  }, []);

  return {
    records,
    recordsByBus,
    recordsByStudent,
    scanQR,
    scanRFID,
    isLoading,
  };
}
