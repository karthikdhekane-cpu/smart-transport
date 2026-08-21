// Fleet Monitoring Types
// Speed Monitoring, Vehicle Health, Fuel Consumption, Driver Behaviour

// === Speed Monitoring ===

export interface SpeedEvent {
  id: string;
  busId: string;
  driverId: string;
  routeId?: string;
  timestamp: number;
  speed: number;
  speedLimit: number;
  severity: 'normal' | 'warning' | 'overspeed';
  duration: number; // seconds
  location: { lat: number; lng: number };
}

export interface SpeedHistory {
  busId: string;
  driverId: string;
  events: SpeedEvent[];
  maxSpeed: number;
  avgSpeed: number;
  overspeedCount: number;
  totalOverspeedDuration: number;
}

export interface SpeedMonitoringData {
  currentSpeed: number;
  speedLimit: number;
  status: 'normal' | 'warning' | 'overspeed';
  overspeedEvents: SpeedEvent[];
  maxRecordedSpeed: number;
  averageSpeed: number;
  overspeedCount: number;
}

// === Vehicle Health ===

export type HealthStatus = 'healthy' | 'attention_required' | 'maintenance_due' | 'critical';

export interface VehicleHealth {
  busId: string;
  overallStatus: HealthStatus;
  engine: {
    status: HealthStatus;
    temperature: number;
    oilLevel: number;
    lastService: number;
    nextService: number;
  };
  battery: {
    status: HealthStatus;
    level: number;
    voltage: number;
    lastReplacement: number;
  };
  tires: {
    status: HealthStatus;
    pressure: number;
    treadDepth: number;
    lastRotation: number;
  };
  brakes: {
    status: HealthStatus;
    padWear: number;
    fluidLevel: number;
    lastInspection: number;
  };
  lastInspection: number;
  nextInspection: number;
  mileage: number;
  criticalWarnings: string[];
}

export interface FleetHealthSummary {
  totalVehicles: number;
  healthy: number;
  attentionRequired: number;
  maintenanceDue: number;
  critical: number;
  vehicles: VehicleHealth[];
}

// === Fuel Consumption ===

export interface FuelConsumption {
  busId: string;
  driverId: string;
  routeId?: string;
  timestamp: number;
  distance: number; // km
  fuelConsumed: number; // liters
  fuelEfficiency: number; // km/l
  estimatedCost: number;
}

export interface FuelAnalytics {
  busId: string;
  totalDistance: number;
  totalFuelConsumed: number;
  averageEfficiency: number;
  estimatedTotalCost: number;
  dailyConsumption: FuelConsumption[];
  weeklyConsumption: FuelConsumption[];
  monthlyConsumption: FuelConsumption[];
  abnormalConsumption: FuelConsumption[];
}

export interface FuelComparison {
  busId: string;
  busNumber: string;
  efficiency: number;
  distance: number;
  fuelConsumed: number;
  rank: number;
}

// === Driver Behaviour Score ===

export interface BehaviourEvent {
  id: string;
  driverId: string;
  busId: string;
  type: 'overspeed' | 'harshBraking' | 'harshAcceleration' | 'routeDeviation' | 'unauthorizedStop' | 'safetyViolation';
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
  location?: { lat: number; lng: number };
  routeId?: string;
  description: string;
  pointsDeducted: number;
}

export interface DriverBehaviourScore {
  driverId: string;
  driverName: string;
  busId: string;
  overallScore: number;
  category: 'excellent' | 'good' | 'needs_improvement' | 'attention_required';
  trend: 'improving' | 'stable' | 'declining';
  factors: {
    overspeed: { score: number; events: number; points: number };
    harshBraking: { score: number; events: number; points: number };
    harshAcceleration: { score: number; events: number; points: number };
    routeCompliance: { score: number; events: number; points: number };
    safety: { score: number; events: number; points: number };
  };
  recentEvents: BehaviourEvent[];
  positiveBehaviours: string[];
  negativeBehaviours: string[];
  lastUpdated: number;
}

// === Fleet Performance Reports ===

export interface FleetPerformanceSummary {
  totalVehicles: number;
  activeToday: number;
  averageUtilization: number;
  totalDistance: number;
  totalTrips: number;
  completedTrips: number;
  delayedTrips: number;
  averageDelay: number;
  averageSpeed: number;
  overspeedEvents: number;
  maintenanceIssues: number;
  totalFuelConsumed: number;
  averageFuelEfficiency: number;
}

export interface VehiclePerformance {
  busId: string;
  busNumber: string;
  driverId: string;
  driverName: string;
  distance: number;
  trips: number;
  utilization: number;
  averageSpeed: number;
  overspeedEvents: number;
  fuelEfficiency: number;
  healthStatus: HealthStatus;
  maintenanceIssues: number;
}

export interface DriverPerformance {
  driverId: string;
  driverName: string;
  busId: string;
  busNumber: string;
  trips: number;
  behaviourScore: number;
  safetyEvents: number;
  routeDeviations: number;
  attendanceRate: number;
  averageSpeed: number;
  fuelEfficiency: number;
}

export interface RoutePerformance {
  routeId: string;
  routeName: string;
  trips: number;
  averageETAAccuracy: number;
  delays: number;
  averageDelay: number;
  routeDeviations: number;
  averageTravelTime: number;
  averageSpeed: number;
}

// === Student Travel History ===

export interface StudentTrip {
  id: string;
  studentId: string;
  studentName: string;
  routeId: string;
  routeName: string;
  busId: string;
  busNumber: string;
  driverId: string;
  driverName: string;
  pickupPoint: string;
  dropoffPoint: string;
  pickupTime: number;
  dropoffTime: number;
  tripDuration: number;
  attendanceStatus: 'present' | 'absent' | 'late';
  tripStatus: 'completed' | 'cancelled' | 'delayed';
  delayMinutes?: number;
  distance: number;
  date: string;
}
