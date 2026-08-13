// Mock Bus Data
import { Driver, VehicleStatus } from '../types/index';

// Realistic bus data for college fleet
// Note: Bus type is defined locally for this file since we're not importing from types
export interface MockBus {
  id: string;
  number: string;
  routeId: string;
  routeName: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  occupancy: number;
  status: VehicleStatus;
  currentSpeed: number;
  averageSpeed: number;
  batteryLevel: number;
  lastGPSUpdate: number;
  lat?: number;
  lng?: number;
  gpsSignal: 'strong' | 'weak' | 'lost';
  safetyScore: number;
  color: string;
}

export const mockBuses: MockBus[] = [
  {
    id: 'BUS-01',
    number: 'TN 38 AB 1234',
    routeId: 'route-a',
    routeName: 'Route A — Gandhipuram Loop',
    driverId: 'D001',
    driverName: 'Rajesh Kumar',
    driverPhone: '+91 98765 43210',
    capacity: 52,
    occupancy: 38,
    status: 'moving',
    currentSpeed: 42,
    averageSpeed: 38.5,
    batteryLevel: 87,
    lastGPSUpdate: Date.now(),
    gpsSignal: 'strong',
    safetyScore: 94,
    color: '#00C853',
  },
  {
    id: 'BUS-02',
    number: 'TN 38 CD 5678',
    routeId: 'route-b',
    routeName: 'Route B — RS Puram Express',
    driverId: 'D002',
    driverName: 'Murugan S',
    driverPhone: '+91 98765 43211',
    capacity: 52,
    occupancy: 45,
    status: 'moving',
    currentSpeed: 35,
    averageSpeed: 41.2,
    batteryLevel: 92,
    lastGPSUpdate: Date.now(),
    gpsSignal: 'strong',
    safetyScore: 88,
    color: '#FFD700',
  },
  {
    id: 'BUS-03',
    number: 'TN 38 EF 9012',
    routeId: 'route-c',
    routeName: 'Route C — Peelamedu Circuit',
    driverId: 'D003',
    driverName: 'Suresh P',
    driverPhone: '+91 98765 43212',
    capacity: 52,
    occupancy: 20,
    status: 'boarding',
    currentSpeed: 0,
    averageSpeed: 35.8,
    batteryLevel: 78,
    lastGPSUpdate: Date.now(),
    gpsSignal: 'strong',
    safetyScore: 97,
    color: '#2196F3',
  },
  {
    id: 'BUS-04',
    number: 'TN 38 GH 3456',
    routeId: 'route-d',
    routeName: 'Route D — Singanallur Terminal',
    driverId: 'D004',
    driverName: 'Anand R',
    driverPhone: '+91 98765 43213',
    capacity: 52,
    occupancy: 50,
    status: 'moving',
    currentSpeed: 55,
    averageSpeed: 48.3,
    batteryLevel: 95,
    lastGPSUpdate: Date.now(),
    gpsSignal: 'strong',
    safetyScore: 91,
    color: '#FF5722',
  },
  {
    id: 'BUS-05',
    number: 'TN 38 HI 7890',
    routeId: 'route-a',
    routeName: 'Route A — Gandhipuram Loop',
    driverId: 'D005',
    driverName: 'Vikram Patel',
    driverPhone: '+91 98765 43214',
    capacity: 52,
    occupancy: 12,
    status: 'waiting',
    currentSpeed: 0,
    averageSpeed: 40.1,
    batteryLevel: 82,
    lastGPSUpdate: Date.now(),
    gpsSignal: 'strong',
    safetyScore: 89,
    color: '#00C853',
  },
  {
    id: 'BUS-06',
    number: 'TN 38 JK 2345',
    routeId: 'route-b',
    routeName: 'Route B — RS Puram Express',
    driverId: 'D006',
    driverName: 'Lakshmi Narayan',
    driverPhone: '+91 98765 43215',
    capacity: 52,
    occupancy: 48,
    status: 'delayed',
    currentSpeed: 28,
    averageSpeed: 32.6,
    batteryLevel: 71,
    lastGPSUpdate: Date.now(),
    gpsSignal: 'weak',
    safetyScore: 85,
    color: '#FFD700',
  },
];

// Mock drivers data
export const mockDrivers: Driver[] = [
  {
    id: 'D001',
    name: 'Rajesh Kumar',
    license: 'TN-38-2019-0012345',
    experience: '8 years',
    safetyScore: 94,
    totalTrips: 1240,
    phone: '+91 98765 43210',
    busId: 'BUS-01',
  },
  {
    id: 'D002',
    name: 'Murugan S',
    license: 'TN-38-2017-0054321',
    experience: '11 years',
    safetyScore: 88,
    totalTrips: 1890,
    phone: '+91 98765 43211',
    busId: 'BUS-02',
  },
  {
    id: 'D003',
    name: 'Suresh P',
    license: 'TN-38-2020-0098765',
    experience: '6 years',
    safetyScore: 97,
    totalTrips: 980,
    phone: '+91 98765 43212',
    busId: 'BUS-03',
  },
  {
    id: 'D004',
    name: 'Anand R',
    license: 'TN-38-2016-0011223',
    experience: '12 years',
    safetyScore: 91,
    totalTrips: 2100,
    phone: '+91 98765 43213',
    busId: 'BUS-04',
  },
  {
    id: 'D005',
    name: 'Vikram Patel',
    license: 'TN-38-2021-0078901',
    experience: '5 years',
    safetyScore: 89,
    totalTrips: 850,
    phone: '+91 98765 43214',
    busId: 'BUS-05',
  },
  {
    id: 'D006',
    name: 'Lakshmi Narayan',
    license: 'TN-38-2018-0023456',
    experience: '9 years',
    safetyScore: 85,
    totalTrips: 1520,
    phone: '+91 98765 43215',
    busId: 'BUS-06',
  },
];

// Fleet summary
export const fleetSummary = {
  totalBuses: 12,
  activeBuses: 6,
  offlineBuses: 2,
  delayedBuses: 1,
  averageFleetSpeed: 38.5,
  totalStudentsTracked: 480,
  onTimeRate: 94.2,
  safetyScore: 92.5,
  tripsToday: 24,
};

// Get bus by ID (Bus type is imported from types)
export const getBusById = (busId: string): typeof mockBuses[0] | undefined => 
  mockBuses.find(b => b.id === busId);

// Get buses by route ID
export const getBusesByRoute = (routeId: string): MockBus[] => 
  mockBuses.filter(b => b.routeId === routeId);

// Get driver by ID (Driver type is imported from types)
export const getDriverById = (driverId: string): typeof mockDrivers[0] | undefined => 
  mockDrivers.find(d => d.id === driverId);

// Get driver by bus ID
export const getDriverByBusId = (busId: string): typeof mockDrivers[0] | undefined => {
  const bus = mockBuses.find(b => b.id === busId);
  return bus ? getDriverById(bus.driverId) : undefined;
};

// Get fleet status
export const getFleetStatus = () => ({
  totalBuses: mockBuses.length,
  activeBuses: mockBuses.filter(b => b.status === 'moving' || b.status === 'boarding').length,
  offlineBuses: mockBuses.filter(b => b.status === 'offline' || b.gpsSignal === 'lost').length,
  delayedBuses: mockBuses.filter(b => b.status === 'delayed' || b.status === 'traffic').length,
  averageFleetSpeed: Math.round(
    mockBuses.reduce((sum, b) => sum + b.currentSpeed, 0) / mockBuses.length
  ),
});

// Generate mock bus positions for simulation
export const generateMockPositions = (
  routeId: string,
  points: number = 50
): { lat: number; lng: number; timestamp: number; speed?: number }[] => {
  // This would be implemented in the actual service
  return [];
};
