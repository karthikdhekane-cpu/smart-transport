// Attendance Repository - Manages attendance data

import { BaseRepository } from './BaseRepository';
import { Attendance } from '../types';

export class AttendanceRepository extends BaseRepository<Attendance> {
  constructor() { super('attendance'); }
  async getForBus(busId: string): Promise<Attendance[]> {
    const records = await this.getAll();
    return records.filter(a => a.busId === busId);
  }
  async getForStudent(studentId: string): Promise<Attendance[]> {
    const records = await this.getAll();
    return records.filter(a => a.studentId === studentId);
  }
  async getForTrip(tripId: string): Promise<Attendance[]> {
    const records = await this.getAll();
    return records.filter(a => a.tripId === tripId);
  }
  async checkDuplicateScan(scanId: string): Promise<boolean> {
    const records = await this.getAll();
    return records.some(a => a.scanId === scanId);
  }
}
