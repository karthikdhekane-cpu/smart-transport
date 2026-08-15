// Backend Types for CampBus

export type UserRole = 'student' | 'parent' | 'driver' | 'admin';

export interface BaseEntity {
  id: string;
  createdAt: number;
  updatedAt: number;
}

export interface User extends BaseEntity {
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
}

export interface Student extends BaseEntity {
  userId: string;
  rollNo: string;
  name: string;
  busId: string;
}

export interface Parent extends BaseEntity {
  userId: string;
  name: string;
  phone: string;
  studentIds: string[];
}

export interface Driver extends BaseEntity {
  userId: string;
  licenseNumber: string;
  safetyScore: number;
  totalTrips: number;
  busId?: string;
}

export interface Bus extends BaseEntity {
  number: string;
  routeId: string;
  capacity: number;
  occupancy: number;
  status: 'idle' | 'moving' | 'completed';
}

export interface Route extends BaseEntity {
  name: string;
  color: string;
  stops: RouteStop[];
  busId?: string;
}

export interface RouteStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  scheduledTime: string;
  order: number;
}

export interface Trip extends BaseEntity {
  busId: string;
  driverId: string;
  routeId: string;
  startTime?: number;
  endTime?: number;
  status: 'pending' | 'active' | 'completed';
  studentCount: number;
}

export interface Attendance extends BaseEntity {
  studentId: string;
  busId: string;
  tripId: string;
  status: 'picked_up' | 'dropped_off';
  scannedBy: 'qr' | 'rfid' | 'manual';
  scanId: string;
}

export interface Notification extends BaseEntity {
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
}

export interface Alert extends BaseEntity {
  userId: string;
  busId: string;
  type: 'geofence' | 'deviation' | 'unauthorized_stop';
  title: string;
  message: string;
  resolved: boolean;
  severity?: 'info' | 'warning' | 'critical';
  location?: { lat: number; lng: number };
}

export interface GPSLocation extends BaseEntity {
  busId: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: number;
}

export interface DriverStatus {
  driverId: string;
  status: 'driving' | 'idle' | 'break';
  availability: 'available' | 'unavailable';
  lastUpdate?: number;
}

export interface IRepository<T extends BaseEntity> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export interface RealtimeUpdate<T> {
  type: 'created' | 'updated' | 'deleted';
  data: T;
  timestamp: number;
}
