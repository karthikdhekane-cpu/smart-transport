// Attendance Service - Centralized attendance tracking
// Uses the /api/attendance endpoint for all persistence (Firestore-backed)

import { IAttendanceService, AttendanceRecord, AttendanceStatus, AttendanceType } from '../types/index';

class AttendanceService implements IAttendanceService {
  private async getApiUrl(): Promise<string> {
    // Use relative URL to avoid CORS issues
    if (typeof window !== 'undefined') {
      return '/api/attendance';
    }
    return '';
  }

  // === Record Methods ===

  async getAllAttendanceRecords(): Promise<AttendanceRecord[]> {
    try {
      const response = await fetch(await this.getApiUrl(), {
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('idToken') || '' : ''}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Map Firestore attendance to AttendanceRecord format
        return (data.attendance || []).map((r: any) => ({
          id: r.id,
          studentId: r.studentId,
          studentName: r.studentName || '',
          rollNo: r.rollNo,
          busId: r.busId,
          tripId: r.tripId,
          driverId: r.driverId,
          routeId: r.routeId,
          stopId: r.stopId,
          stopName: r.stopName,
          timestamp: r.timestamp,
          status: r.status,
          scannedBy: r.scannedBy,
          scanId: r.scanId,
        }));
      }
      
      // If no active trip, return empty array
      if (response.status === 200) {
        const data = await response.json();
        if (data.hasActiveTrip === false) {
          return [];
        }
      }
      
      console.error('Failed to get attendance records:', response.statusText);
      return [];
    } catch (error: any) {
      console.error('Error fetching attendance records:', error);
      return [];
    }
  }

  async getAttendanceByBus(busId: string): Promise<AttendanceRecord[]> {
    const all = await this.getAllAttendanceRecords();
    return all.filter(r => r.busId === busId);
  }

  async getAttendanceByStudent(studentId: string): Promise<AttendanceRecord[]> {
    const all = await this.getAllAttendanceRecords();
    return all.filter(r => r.studentId === studentId);
  }

  async getAttendanceByTrip(tripId: string): Promise<AttendanceRecord[]> {
    const all = await this.getAllAttendanceRecords();
    return all.filter(r => r.tripId === tripId);
  }

  async createAttendanceRecord(record: Omit<AttendanceRecord, 'id' | 'timestamp'>): Promise<string> {
    try {
      const response = await fetch(await this.getApiUrl(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('idToken') || '' : ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: record.studentId,
          status: record.status,
          method: record.scannedBy,
          scanId: record.scanId,
          stopId: record.stopId,
          stopName: record.stopName,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.attendance.id;
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create attendance record');
    } catch (error: any) {
      console.error('Error creating attendance record:', error);
      throw error;
    }
  }

  checkDuplicateScan(scanId: string): boolean {
    // This check happens server-side in the API
    // For local UI feedback, we return false (let server handle it)
    return false;
  }

  // === QR Attendance Methods ===

  async processQRScan(data: string): Promise<{ success: boolean; message: string; recordId?: string }> {
    try {
      // Parse QR data - format: "ATTENDANCE:{studentId}:{stopId}"
      const parts = data.split(':');
      
      if (parts.length !== 3 || parts[0] !== 'ATTENDANCE') {
        return { success: false, message: 'Invalid QR format' };
      }

      const [, studentId, stopId] = parts;
      
      // Generate unique scan ID
      const scanId = `QR-${studentId}-${stopId}-${Date.now()}`;
      
      // Create attendance record
      const recordId = await this.createAttendanceRecord({
        studentId,
        studentName: '', // Will be populated from Firestore
        rollNo: '',
        busId: '',
        status: 'present',
        scannedBy: 'qr',
        scanId,
        stopId,
        stopName: '',
      });

      return { success: true, message: 'Attendance marked successfully', recordId };
    } catch (e: any) {
      return { success: false, message: e.message || 'Error processing QR scan' };
    }
  }

  // === RFID Attendance Methods ===

  async processRFIDScan(tagId: string): Promise<{ success: boolean; message: string; recordId?: string }> {
    try {
      // Parse RFID data - format: "RFID:{studentRollNo}"
      const parts = tagId.split(':');
      
      if (parts.length !== 2 || parts[0] !== 'RFID') {
        return { success: false, message: 'Invalid RFID format' };
      }

      const [, rollNo] = parts;
      
      // Generate unique scan ID
      const scanId = `RFID-${rollNo}-${Date.now()}`;
      
      // Create attendance record
      const recordId = await this.createAttendanceRecord({
        studentId: '', // Will be populated from Firestore
        studentName: '',
        rollNo,
        busId: '',
        status: 'present',
        scannedBy: 'rfid',
        scanId,
        stopId: '',
        stopName: '',
      });

      return { success: true, message: 'Attendance marked successfully', recordId };
    } catch (e: any) {
      return { success: false, message: e.message || 'Error processing RFID scan' };
    }
  }

  // === Mock Data Helpers (legacy - should not be used) ===

  getMockAttendanceRecords(): AttendanceRecord[] {
    return [];
  }

  // Cleanup
  cleanup(): void {
    // No-op - server-side only
  }
}

// Export singleton instance
let attendanceServiceInstance: AttendanceService | null = null;

export const attendanceService = (() => {
  if (!attendanceServiceInstance) {
    attendanceServiceInstance = new AttendanceService();
  }
  return attendanceServiceInstance;
})();
