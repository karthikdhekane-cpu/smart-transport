// Student Repository - Manages student data

import { BaseRepository } from './BaseRepository';
import { Student } from '../types';

export class StudentRepository extends BaseRepository<Student> {
  constructor() { super('students'); }
  async getByBus(busId: string): Promise<Student[]> {
    const students = await this.getAll();
    return students.filter(s => s.busId === busId);
  }
}
