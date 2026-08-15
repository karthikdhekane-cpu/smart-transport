// Attendance Service - Centralized attendance tracking
// Handles QR and RFID attendance scanning with duplicate prevention

import { IAttendanceService, AttendanceRecord, AttendanceStatus, AttendanceType } from '../types/index';
import { mockAttendanceRecords, generateScanId, getStudentByRollNo } from '../mock/data';

// Storage key
const STORAGE_KEYS = {
  ATTENDANCE_RECORDS: 'campbus_attendance_records',
};

// In-memory storage
let attendanceRecords: AttendanceRecord[] = [];

// Browser environment check
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Load from localStorage on init - browser only
function loadFromStorage() {
  if (!isBrowser) return;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS);
    if (stored) {
      attendanceRecords = JSON.parse(stored);
    }
  } catch (e) {
    // Silent fail for SSR - use initial data
  }

  // Initialize with mock data if empty
  if (attendanceRecords.length === 0) {
    attendanceRecords = [...mockAttendanceRecords];
  }
}

function saveToStorage() {
  if (!isBrowser) return;

  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify(attendanceRecords));
  } catch (e) {
    // Silent fail for SSR
  }
}

class AttendanceService implements IAttendanceService {
  constructor() {
    loadFromStorage();
  }

  // === Record Methods ===

  getAllAttendanceRecords(): AttendanceRecord[] {
    return [...attendanceRecords].sort((a, b) => b.timestamp - a.timestamp);
  }

  getAttendanceByBus(busId: string): AttendanceRecord[] {
    return this.getAllAttendanceRecords().filter(r => r.busId === busId);
  }

  getAttendanceByStudent(studentId: string): AttendanceRecord[] {
    return this.getAllAttendanceRecords().filter(r => r.studentId === studentId);
  }

  getAttendanceByTrip(tripId: string): AttendanceRecord[] {
    return this.getAllAttendanceRecords().filter(r => r.tripId === tripId);
  }

  createAttendanceRecord(record: Omit<AttendanceRecord, 'id' | 'timestamp'>): string {
    const id = `ATT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newRecord: AttendanceRecord = {
      ...record,
      id,
      timestamp: Date.now(),
    };

    attendanceRecords.push(newRecord);
    saveToStorage();
    return id;
  }

  checkDuplicateScan(scanId: string): boolean {
    return attendanceRecords.some(r => r.scanId === scanId);
  }

  // === QR Attendance Methods ===

  processQRScan(data: string): { success: boolean; message: string; recordId?: string } {
    try {
      // Parse QR data - format: "ATTENDANCE:{studentId}:{stopId}"
      const parts = data.split(':');
      
      if (parts.length !== 3 || parts[0] !== 'ATTENDANCE') {
        return { success: false, message: 'Invalid QR format' };
      }

      const [, studentId, stopId] = parts;
      
      // Get student data
      const student = getStudentByRollNo(studentId);
      if (!student) {
        return { success: false, message: 'Student not found' };
      }

      // Generate unique scan ID
      const scanId = generateScanId(student.id, 'qr', stopId);
      
      // Check for duplicate
      if (this.checkDuplicateScan(scanId)) {
        return { success: false, message: 'Attendance already recorded for this stop' };
      }

      // Create attendance record
      const recordId = this.createAttendanceRecord({
        studentId: student.id,
        studentName: student.name,
        rollNo: student.rollNo,
        busId: student.busId,
        stopId,
        stopName: student.stop,
        status: 'present',
        scannedBy: 'qr',
        scanId,
      });

      return { success: true, message: 'Attendance marked successfully', recordId };
    } catch (e) {
      return { success: false, message: 'Error processing QR scan' };
    }
  }

  // === RFID Attendance Methods ===

  processRFIDScan(tagId: string): { success: boolean; message: string; recordId?: string } {
    try {
      // Parse RFID data - format: "RFID:{studentRollNo}"
      const parts = tagId.split(':');
      
      if (parts.length !== 2 || parts[0] !== 'RFID') {
        return { success: false, message: 'Invalid RFID format' };
      }

      const [, rollNo] = parts;
      
      // Get student data
      const student = getStudentByRollNo(rollNo);
      if (!student) {
        return { success: false, message: 'Student not found' };
      }

      // Generate unique scan ID
      const scanId = generateScanId(student.id, 'rfid');
      
      // Check for duplicate
      if (this.checkDuplicateScan(scanId)) {
        return { success: false, message: 'Attendance already recorded' };
      }

      // Create attendance record
      const recordId = this.createAttendanceRecord({
        studentId: student.id,
        studentName: student.name,
        rollNo: student.rollNo,
        busId: student.busId,
        status: 'present',
        scannedBy: 'rfid',
        scanId,
      });

      return { success: true, message: 'Attendance marked successfully', recordId };
    } catch (e) {
      return { success: false, message: 'Error processing RFID scan' };
    }
  }

  // === Mock Data Helpers ===

  getMockAttendanceRecords(): AttendanceRecord[] {
    return [...mockAttendanceRecords];
  }

  // Cleanup
  cleanup(): void {
    attendanceRecords = [];
  }
}

// Export singleton instance - lazy initialization to avoid SSR issues
let attendanceServiceInstance: AttendanceService | null = null;

export const attendanceService = (() => {
  if (!attendanceServiceInstance) {
    attendanceServiceInstance = new AttendanceService();
  }
  return attendanceServiceInstance;
})();
