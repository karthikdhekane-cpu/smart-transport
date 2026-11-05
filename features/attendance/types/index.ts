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
  driverId?: string;
  routeId?: string;
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
  // Records - Async for Firestore support
  getAllAttendanceRecords(): Promise<AttendanceRecord[]>;
  getAttendanceByBus(busId: string): Promise<AttendanceRecord[]>;
  getAttendanceByStudent(studentId: string): Promise<AttendanceRecord[]>;
  getAttendanceByTrip(tripId: string): Promise<AttendanceRecord[]>;
  
  // Create records - Async for Firestore support
  createAttendanceRecord(record: Omit<AttendanceRecord, 'id' | 'timestamp'>): Promise<string>;
  
  // Duplicate prevention
  checkDuplicateScan(scanId: string): boolean;
  
  // QR Attendance - Async for Firestore support
  processQRScan(data: string): Promise<{ success: boolean; message: string; recordId?: string }>;
  
  // RFID Attendance - Async for Firestore support
  processRFIDScan(tagId: string): Promise<{ success: boolean; message: string; recordId?: string }>;
  
  // Mock data
  getMockAttendanceRecords(): AttendanceRecord[];
}
