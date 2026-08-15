// Attendance Service - Business logic for attendance tracking

import { AttendanceRepository } from '../repositories/AttendanceRepository';
import { Attendance } from '../types';

export class AttendanceService {
  private repository = new AttendanceRepository();

  async getAllRecords(): Promise<Attendance[]> {
    return this.repository.getAll();
  }

  async getForBus(busId: string): Promise<Attendance[]> {
    return this.repository.getForBus(busId);
  }

  async getForStudent(studentId: string): Promise<Attendance[]> {
    return this.repository.getForStudent(studentId);
  }

  async getForTrip(tripId: string): Promise<Attendance[]> {
    return this.repository.getForTrip(tripId);
  }

  async createRecord(record: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const isDuplicate = await this.repository.checkDuplicateScan(record.scanId);
    if (isDuplicate) {
      throw new Error('Duplicate attendance scan detected');
    }
    const attendance = await this.repository.create(record);
    return attendance.id;
  }

  async checkDuplicateScan(scanId: string): Promise<boolean> {
    return this.repository.checkDuplicateScan(scanId);
  }
}
