// AI Transportation Intelligence Feature
// Route optimization and driver behaviour analysis with pluggable AI providers

export * from './types/index';
export { createAIProvider, getAIConfig } from './providers/createProvider';
export { deterministicProvider } from './providers/DeterministicProvider';
export { routeOptimizationService } from './services/RouteOptimizationService';
export { driverBehaviourService } from './services/DriverBehaviourService';
export { useRouteOptimization } from './hooks/useRouteOptimization';
export { useDriverBehaviour } from './hooks/useDriverBehaviour';
