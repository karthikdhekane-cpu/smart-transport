// AI Transportation Intelligence Types
// Clean abstraction for route optimization and driver behaviour analysis

export type AIProviderType = 'deterministic' | 'openai' | 'anthropic' | 'custom';

export type RecommendationPriority = 'low' | 'medium' | 'high' | 'critical';

export type BehaviourRating = 'excellent' | 'good' | 'fair' | 'needs_improvement' | 'critical';

// === AI Provider Configuration ===

export interface AIIntelligenceConfig {
  provider: AIProviderType;
  apiKey?: string;
  endpoint?: string;
  model?: string;
}

// === Route Optimization ===

export interface RouteStopContext {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order: number;
  dwellTime: number;
  isCompleted: boolean;
  studentCount?: number;
}

export interface RouteOptimizationContext {
  routeId: string;
  routeName: string;
  busId: string;
  driverId?: string;
  totalDistance: number;
  estimatedDuration: number;
  stopCount: number;
  progressPercentage: number;
  remainingStops: RouteStopContext[];
  currentSpeed: number;
  trafficLevel: string;
  trafficMultiplier: number;
  delayMinutes: number;
  delayReason: string;
  occupancy: number;
  capacity: number;
  isDeviated: boolean;
  deviationDistance?: number;
}

export interface RouteOptimizationRecommendation {
  id: string;
  routeId: string;
  busId: string;
  recommendedRouteName: string;
  recommendedStopOrder: string[];
  reason: string;
  reasons: string[];
  estimatedTimeImprovementSeconds: number;
  estimatedTimeImprovementText: string;
  affectedStops: string[];
  confidence: number;
  priority: RecommendationPriority;
  provider: AIProviderType;
  generatedAt: number;
}

export interface RouteEfficiencyScore {
  routeId: string;
  routeName: string;
  busId: string;
  score: number;
  trips: number;
  delays: number;
  factors: string[];
}

// === Driver Behaviour ===

export interface DriverBehaviourEvent {
  type: 'overspeed' | 'idle' | 'route_deviation' | 'unauthorized_stop' | 'geofence_violation' | 'alert';
  label: string;
  count: number;
  severity: 'info' | 'warning' | 'critical';
  source: 'live' | 'recorded';
  description?: string;
}

export interface DriverBehaviourMetrics {
  safetyScore: number;
  speedCompliance: number;
  routeCompliance: number;
  stopCompliance: number;
  alertFrequency: number;
  overallRating: BehaviourRating;
}

export interface DriverBehaviourContext {
  driverId: string;
  driverName: string;
  busId: string;
  currentSpeed: number;
  averageSpeed: number;
  totalTrips: number;
  drivingTimeMinutes: number;
  idleTimeMinutes: number;
  deviation?: { isDeviated: boolean; distance: number };
  unauthorizedStop?: { duration: number; resolved: boolean };
  alertCount: number;
  geofenceAlertCount: number;
}

export interface DriverBehaviourResult {
  driverId: string;
  driverName: string;
  busId: string;
  metrics: DriverBehaviourMetrics;
  events: DriverBehaviourEvent[];
  reasons: string[];
  recommendations: string[];
  provider: AIProviderType;
  analyzedAt: number;
  /** Metrics derived from simulated/inferred data vs live service data */
  dataSources: {
    speed: 'live' | 'recorded';
    deviations: 'live' | 'recorded';
    braking: 'unavailable';
    turns: 'unavailable';
  };
}

// === Service Interfaces ===

export interface IRouteOptimizationService {
  getRecommendationsForBus(busId: string): Promise<RouteOptimizationRecommendation | null>;
  getAllRecommendations(): Promise<RouteOptimizationRecommendation[]>;
  getRouteEfficiencyScores(): RouteEfficiencyScore[];
  buildContext(busId: string): RouteOptimizationContext | null;
}

export interface IDriverBehaviourService {
  analyzeDriver(driverId: string): Promise<DriverBehaviourResult | null>;
  analyzeAllDrivers(): Promise<DriverBehaviourResult[]>;
  getFleetAverageSafetyScore(): number;
}

export interface IAIIntelligenceProvider {
  readonly name: AIProviderType;
  optimizeRoute(context: RouteOptimizationContext): Promise<RouteOptimizationRecommendation>;
  analyzeDriverBehaviour(context: DriverBehaviourContext): Promise<DriverBehaviourResult>;
}
