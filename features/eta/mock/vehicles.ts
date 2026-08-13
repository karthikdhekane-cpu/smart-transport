// Mock Bus Data for ETA feature
// Based on the GPS tracking vehicles mock

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
  status: string;
  currentSpeed: number;
  averageSpeed: number;
  batteryLevel: number;
  lastGPSUpdate: number;
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
];
