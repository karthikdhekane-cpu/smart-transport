// Attendance Types

// === Attendance Status ===
export type AttendanceStatus = 'picked_up' | 'dropped_off' | 'present' | 'absent';

// === Attendance Type ===
export type AttendanceType = 'qr' | 'rfid' | 'manual';

// === Attendance Record ===
export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo?: string;
  busId: string;
  tripId?: string;
  stopId?: string;
  stopName?: string;
  timestamp: number;
  status: AttendanceStatus;
  scannedBy: AttendanceType;
  scanId: string; // Unique identifier to prevent duplicates
}

// === Scanned Data ===
export interface ScannedData {
  id: string;
  type: AttendanceType;
  payload: string; // Raw scanned data
  timestamp: number;
}

// === Attendance Service Interface ===
export interface IAttendanceService {
  // Records
  getAllAttendanceRecords(): AttendanceRecord[];
  getAttendanceByBus(busId: string): AttendanceRecord[];
  getAttendanceByStudent(studentId: string): AttendanceRecord[];
  getAttendanceByTrip(tripId: string): AttendanceRecord[];
  
  // Create records
  createAttendanceRecord(record: Omit<AttendanceRecord, 'id' | 'timestamp'>): string;
  
  // Duplicate prevention
  checkDuplicateScan(scanId: string): boolean;
  
  // QR Attendance
  processQRScan(data: string): { success: boolean; message: string; recordId?: string };
  
  // RFID Attendance
  processRFIDScan(tagId: string): { success: boolean; message: string; recordId?: string };
  
  // Mock data
  getMockAttendanceRecords(): AttendanceRecord[];
}
