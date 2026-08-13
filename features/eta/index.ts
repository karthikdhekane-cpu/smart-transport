// ETA Feature Exports

// Types
export * from './types/index';

// Mock
export * from './mock/traffic';
export * from './mock/routes';
export * from './mock/vehicles';

// Utils
export {
  calculateETA,
  formatETA,
  calculatePredictedArrival,
  calculateDelayPercentage,
  calculateTripProgress,
  calculateETAToStop,
  calculateBaseETA,
  calculateEffectiveSpeed,
  applyTrafficDelay,
  determineDelayReason,
} from './utils/etaCalculator';

export {
  calculateSpeed,
  calculateAverageSpeed,
  calculateWeightedAverageSpeed,
  smoothSpeed,
  calculateSpeedVariance,
  getSpeedCategory,
  formatSpeed,
  getSpeedColor,
} from './utils/speedCalculator';

export {
  calculateCumulativeDistances,
  calculateTotalDistance,
  calculateRemainingDistance,
  distanceToStop,
  findNearestStop,
  calculateRouteProgress,
  formatDistance,
  getDistanceColor,
  distanceToStopFromPosition,
} from './utils/distanceCalculator';

export {
  createDelayState,
  updateDelayWithTraffic,
  calculateDelayFromSpeed,
  calculateDelayFromTraffic,
  calculateBoardingDelay,
  getDelayColor,
  getDelayBgColor,
  getDelayReasonText,
  calculateDelayEndTime,
  isDelayExpired,
  updateDelayExpiration,
  calculateTotalDelay,
  getDelaySeverity,
  formatDelay,
} from './utils/delayCalculator';

// Services
export * from './services/ETASimulator';
export * from './services/ETAService';

// Hooks
export * from './hooks/useETA';

// Components
export { default as ETACard } from './components/ETACard';
export { default as ETAChip } from './components/ETAChip';
export { default as DelayIndicator } from './components/DelayIndicator';
export { default as ArrivalCountdown } from './components/ArrivalCountdown';
export { default as TrafficBadge } from './components/TrafficBadge';
export { default as StatusBadge } from './components/StatusBadge';
