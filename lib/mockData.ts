// Mock GPS coordinates for college area (Coimbatore, TN)
export const COLLEGE_CENTER = { lat: 11.0168, lng: 76.9558 };

export const mockBuses = [
  {
    id: 'BUS-01',
    number: 'TN 38 AB 1234',
    route: 'Route A — Gandhipuram',
    driver: 'Rajesh Kumar',
    driverPhone: '+91 98765 43210',
    capacity: 52,
    occupancy: 38,
    status: 'moving' as const,
    speed: 42,
    lat: 11.0168,
    lng: 76.9558,
    eta: '8 min',
    nextStop: 'Main Gate',
    safetyScore: 94,
    color: '#00C853',
  },
  {
    id: 'BUS-02',
    number: 'TN 38 CD 5678',
    route: 'Route B — RS Puram',
    driver: 'Murugan S',
    driverPhone: '+91 98765 43211',
    capacity: 52,
    occupancy: 45,
    status: 'moving' as const,
    speed: 35,
    lat: 11.0248,
    lng: 76.9658,
    eta: '14 min',
    nextStop: 'Stop 3',
    safetyScore: 88,
    color: '#FFD700',
  },
  {
    id: 'BUS-03',
    number: 'TN 38 EF 9012',
    route: 'Route C — Peelamedu',
    driver: 'Suresh P',
    driverPhone: '+91 98765 43212',
    capacity: 52,
    occupancy: 20,
    status: 'stopped' as const,
    speed: 0,
    lat: 11.0098,
    lng: 76.9458,
    eta: '22 min',
    nextStop: 'Stop 2',
    safetyScore: 97,
    color: '#2196F3',
  },
  {
    id: 'BUS-04',
    number: 'TN 38 GH 3456',
    route: 'Route D — Singanallur',
    driver: 'Anand R',
    driverPhone: '+91 98765 43213',
    capacity: 52,
    occupancy: 50,
    status: 'moving' as const,
    speed: 55,
    lat: 11.0318,
    lng: 76.9758,
    eta: '5 min',
    nextStop: 'College Gate',
    safetyScore: 91,
    color: '#FF5722',
  },
];

export const mockRoutes = [
  {
    id: 'route-a',
    name: 'Route A — Gandhipuram',
    stops: [
      { name: 'Gandhipuram Bus Stand', lat: 11.0168, lng: 76.9558, time: '7:30 AM' },
      { name: 'Town Hall', lat: 11.0198, lng: 76.9588, time: '7:38 AM' },
      { name: 'Peelamedu Junction', lat: 11.0228, lng: 76.9618, time: '7:48 AM' },
      { name: 'Avinashi Road', lat: 11.0258, lng: 76.9648, time: '7:55 AM' },
      { name: 'College Main Gate', lat: 11.0288, lng: 76.9678, time: '8:05 AM' },
    ],
    color: '#00C853',
    busId: 'BUS-01',
  },
  {
    id: 'route-b',
    name: 'Route B — RS Puram',
    stops: [
      { name: 'RS Puram', lat: 11.0068, lng: 76.9458, time: '7:25 AM' },
      { name: 'Race Course', lat: 11.0098, lng: 76.9488, time: '7:35 AM' },
      { name: 'Coimbatore Junction', lat: 11.0128, lng: 76.9518, time: '7:45 AM' },
      { name: 'College Main Gate', lat: 11.0288, lng: 76.9678, time: '8:10 AM' },
    ],
    color: '#FFD700',
    busId: 'BUS-02',
  },
];

export const mockStudents = [
  { id: 'S001', name: 'Priya Sharma', rollNo: '21CS001', busId: 'BUS-01', stop: 'Town Hall', phone: '+91 99887 76655' },
  { id: 'S002', name: 'Arjun Nair', rollNo: '21CS002', busId: 'BUS-01', stop: 'Gandhipuram Bus Stand', phone: '+91 99887 76656' },
  { id: 'S003', name: 'Kavya Reddy', rollNo: '21CS003', busId: 'BUS-02', stop: 'RS Puram', phone: '+91 99887 76657' },
  { id: 'S004', name: 'Rahul Mehta', rollNo: '21CS004', busId: 'BUS-02', stop: 'Race Course', phone: '+91 99887 76658' },
  { id: 'S005', name: 'Sneha Iyer', rollNo: '21CS005', busId: 'BUS-03', stop: 'Peelamedu Junction', phone: '+91 99887 76659' },
];

export const mockDrivers = [
  { id: 'D001', name: 'Rajesh Kumar', busId: 'BUS-01', license: 'TN-38-2019-0012345', experience: '8 years', safetyScore: 94, trips: 1240, phone: '+91 98765 43210' },
  { id: 'D002', name: 'Murugan S', busId: 'BUS-02', license: 'TN-38-2017-0054321', experience: '11 years', safetyScore: 88, trips: 1890, phone: '+91 98765 43211' },
  { id: 'D003', name: 'Suresh P', busId: 'BUS-03', license: 'TN-38-2020-0098765', experience: '6 years', safetyScore: 97, trips: 980, phone: '+91 98765 43212' },
  { id: 'D004', name: 'Anand R', busId: 'BUS-04', license: 'TN-38-2016-0011223', experience: '12 years', safetyScore: 91, trips: 2100, phone: '+91 98765 43213' },
];

export const mockAlerts = [
  { id: 'A001', type: 'delay', message: 'BUS-02 delayed by 8 minutes due to traffic', time: '2 min ago', severity: 'warning' },
  { id: 'A002', type: 'arrival', message: 'BUS-01 arriving at Main Gate in 8 minutes', time: '5 min ago', severity: 'info' },
  { id: 'A003', type: 'sos', message: 'SOS triggered on BUS-04 — Driver Anand R', time: '12 min ago', severity: 'critical' },
  { id: 'A004', type: 'deviation', message: 'BUS-03 route deviation detected near Peelamedu', time: '18 min ago', severity: 'warning' },
];

export const mockStats = {
  totalBuses: 12,
  activeBuses: 9,
  totalStudents: 480,
  onTimeRate: 94.2,
  avgETA: 8.4,
  safetyScore: 92.5,
  totalTripsToday: 24,
  alertsToday: 3,
};

export const mockWeeklyData = [
  { day: 'Mon', onTime: 96, delayed: 4, trips: 24 },
  { day: 'Tue', onTime: 92, delayed: 8, trips: 24 },
  { day: 'Wed', onTime: 98, delayed: 2, trips: 24 },
  { day: 'Thu', onTime: 88, delayed: 12, trips: 22 },
  { day: 'Fri', onTime: 94, delayed: 6, trips: 24 },
  { day: 'Sat', onTime: 100, delayed: 0, trips: 12 },
];

export const mockOccupancyData = [
  { time: '7:00', BUS01: 10, BUS02: 5, BUS03: 8, BUS04: 15 },
  { time: '7:30', BUS01: 28, BUS02: 22, BUS03: 18, BUS04: 35 },
  { time: '8:00', BUS01: 45, BUS02: 48, BUS03: 30, BUS04: 50 },
  { time: '8:30', BUS01: 38, BUS02: 40, BUS03: 20, BUS04: 45 },
  { time: '9:00', BUS01: 12, BUS02: 15, BUS03: 8, BUS04: 20 },
];

// Simulate GPS movement
export function simulateGPSMovement(bus: typeof mockBuses[0], tick: number) {
  const speed = 0.0002;
  return {
    ...bus,
    lat: bus.lat + Math.sin(tick * 0.1) * speed,
    lng: bus.lng + Math.cos(tick * 0.1) * speed,
  };
}
