// Mock Attendance Data

import { AttendanceRecord, AttendanceStatus, AttendanceType } from '../types/index';

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'ATT-001',
    studentId: 'S001',
    studentName: 'Priya Sharma',
    rollNo: '21CS001',
    busId: 'BUS-01',
    tripId: 'TRIP-001',
    stopId: 'stop-a1',
    stopName: 'Gandhipuram Bus Stand',
    timestamp: Date.now() - 7200000, // 2 hours ago
    status: 'picked_up',
    scannedBy: 'rfid',
    scanId: 'RFID-S001-001',
  },
  {
    id: 'ATT-002',
    studentId: 'S002',
    studentName: 'Arjun Nair',
    rollNo: '21CS002',
    busId: 'BUS-01',
    tripId: 'TRIP-001',
    stopId: 'stop-a2',
    stopName: 'Town Hall',
    timestamp: Date.now() - 7000000,
    status: 'picked_up',
    scannedBy: 'rfid',
    scanId: 'RFID-S002-001',
  },
  {
    id: 'ATT-003',
    studentId: 'S001',
    studentName: 'Priya Sharma',
    rollNo: '21CS001',
    busId: 'BUS-01',
    tripId: 'TRIP-001',
    stopId: 'stop-a5',
    stopName: 'College Main Gate',
    timestamp: Date.now() - 3600000, // 1 hour ago
    status: 'dropped_off',
    scannedBy: 'qr',
    scanId: 'QR-S001-001',
  },
  {
    id: 'ATT-004',
    studentId: 'S003',
    studentName: 'Kavya Reddy',
    rollNo: '21CS003',
    busId: 'BUS-02',
    tripId: 'TRIP-002',
    stopId: 'stop-b1',
    stopName: 'RS Puram',
    timestamp: Date.now() - 5400000,
    status: 'picked_up',
    scannedBy: 'manual',
    scanId: 'MANUAL-S003-001',
  },
  {
    id: 'ATT-005',
    studentId: 'S004',
    studentName: 'Rahul Mehta',
    rollNo: '21CS004',
    busId: 'BUS-02',
    tripId: 'TRIP-002',
    stopId: 'stop-b3',
    stopName: 'College Main Gate',
    timestamp: Date.now() - 1800000,
    status: 'dropped_off',
    scannedBy: 'rfid',
    scanId: 'RFID-S004-001',
  },
  {
    id: 'ATT-006',
    studentId: 'S005',
    studentName: 'Sneha Iyer',
    rollNo: '21CS005',
    busId: 'BUS-03',
    tripId: 'TRIP-003',
    stopId: 'stop-c2',
    stopName: 'Peelamedu Junction',
    timestamp: Date.now() - 4200000,
    status: 'picked_up',
    scannedBy: 'qr',
    scanId: 'QR-S005-001',
  },
];

// Helper function to generate unique scan IDs
export const generateScanId = (studentId: string, type: AttendanceType, stopId?: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const stopSuffix = stopId ? `-${stopId}` : '';
  return `${type.toUpperCase()}-${studentId}-${timestamp}${stopSuffix}`;
};

// Helper to simulate student data
export const getStudentByRollNo = (rollNo: string) => {
  const students: Record<string, { id: string; name: string; rollNo: string; busId: string; stop: string }> = {
    '21CS001': { id: 'S001', name: 'Priya Sharma', rollNo: '21CS001', busId: 'BUS-01', stop: 'Town Hall' },
    '21CS002': { id: 'S002', name: 'Arjun Nair', rollNo: '21CS002', busId: 'BUS-01', stop: 'Gandhipuram Bus Stand' },
    '21CS003': { id: 'S003', name: 'Kavya Reddy', rollNo: '21CS003', busId: 'BUS-02', stop: 'RS Puram' },
    '21CS004': { id: 'S004', name: 'Rahul Mehta', rollNo: '21CS004', busId: 'BUS-02', stop: 'Race Course' },
    '21CS005': { id: 'S005', name: 'Sneha Iyer', rollNo: '21CS005', busId: 'BUS-03', stop: 'Peelamedu Junction' },
  };
  return students[rollNo];
};
