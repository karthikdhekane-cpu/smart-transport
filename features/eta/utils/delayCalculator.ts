// Delay Calculator - Calculate and track delays

import { DelayReason, DelayState, TrafficLevel } from '../types';

// Delay reasons mapping
const DELAY_REASONS: Record<DelayReason, string> = {
  traffic: 'Traffic congestion',
  'road-work': 'Road work ahead',
  signal: 'Signal delay',
  'student-boarding': 'Student boarding',
  rain: 'Weather conditions',
  accident: 'Accident reported',
  none: '',
};

/**
 * Create a new delay state
 */
export function createDelayState(
  minutes: number,
  reason: DelayReason = 'none',
  startTime?: number
): DelayState {
  return {
    active: minutes > 0,
    minutes,
    reason,
    startTime: startTime || Date.now(),
    expectedEnd: startTime ? startTime + minutes * 60 * 1000 : undefined,
  };
}

/**
 * Update delay state based on traffic level
 */
export function updateDelayWithTraffic(
  currentDelay: DelayState,
  trafficLevel: TrafficLevel,
  trafficDelayMinutes: number
): DelayState {
  const newDelay = Math.max(currentDelay.minutes, trafficDelayMinutes);
  
  // Map heavy traffic to regular traffic for delay reason
  const delayReason: DelayReason = newDelay > 0 
    ? 'traffic'
    : 'none';
  
  return createDelayState(newDelay, delayReason);
}

/**
 * Calculate delay based on speed reduction
 * @param expectedSpeed - Expected speed in km/h
 * @param actualSpeed - Actual speed in km/h
 * @param remainingDistance - Remaining distance in meters
 * @returns Delay in minutes
 */
export function calculateDelayFromSpeed(
  expectedSpeed: number,
  actualSpeed: number,
  remainingDistance: number
): number {
  if (actualSpeed <= 0 || expectedSpeed <= 0) return 0;

  const expectedTimeMinutes = (remainingDistance / 1000) / expectedSpeed * 60;
  const actualTimeMinutes = (remainingDistance / 1000) / actualSpeed * 60;
  
  return Math.max(0, Math.round(actualTimeMinutes - expectedTimeMinutes));
}

/**
 * Calculate delay based on traffic multiplier
 * @param trafficMultiplier - Traffic impact multiplier
 * @param baseETA - Base ETA in seconds
 * @returns Delay in minutes
 */
export function calculateDelayFromTraffic(trafficMultiplier: number, baseETA: number): number {
  if (trafficMultiplier >= 1) return 0;
  
  const delaySeconds = baseETA * (1 - trafficMultiplier);
  return Math.round(delaySeconds / 60);
}

/**
 * Calculate boarding delay
 * @param passengersBoarding - Number of passengers boarding
 * @param dwellTimePerPassenger - Average dwell time per passenger in seconds
 * @returns Boarding delay in minutes
 */
export function calculateBoardingDelay(passengersBoarding: number, dwellTimePerPassenger: number = 1.5): number {
  const delaySeconds = passengersBoarding * dwellTimePerPassenger;
  return Math.round(delaySeconds / 60);
}

/**
 * Get delay color based on severity
 */
export function getDelayColor(minutes: number): string {
  if (minutes >= 15) return 'text-red-500';
  if (minutes >= 10) return 'text-[#FF5722]';
  if (minutes >= 5) return 'text-[#FF9800]';
  if (minutes > 0) return 'text-[#FFD700]';
  return 'text-[#00C853]';
}

/**
 * Get delay background color
 */
export function getDelayBgColor(minutes: number): string {
  if (minutes >= 15) return 'bg-red-500/20';
  if (minutes >= 10) return 'bg-[#FF5722]/20';
  if (minutes >= 5) return 'bg-[#FF9800]/20';
  if (minutes > 0) return 'bg-[#FFD700]/20';
  return 'bg-[#00C853]/20';
}

/**
 * Get delay reason text
 */
export function getDelayReasonText(reason: DelayReason): string {
  return DELAY_REASONS[reason] || '';
}

/**
 * Calculate expected delay end time
 */
export function calculateDelayEndTime(minutes: number): number {
  return Date.now() + minutes * 60 * 1000;
}

/**
 * Check if delay has expired
 */
export function isDelayExpired(delayState: DelayState): boolean {
  if (!delayState.expectedEnd) return false;
  return Date.now() > delayState.expectedEnd;
}

/**
 * Update delay expiration
 */
export function updateDelayExpiration(delayState: DelayState): DelayState {
  if (!delayState.startTime || delayState.minutes <= 0) return delayState;
  
  return {
    ...delayState,
    expectedEnd: delayState.startTime + delayState.minutes * 60 * 1000,
  };
}

/**
 * Calculate cumulative delay from multiple sources
 */
export function calculateTotalDelay(delays: number[]): number {
  if (delays.length === 0) return 0;
  
  // Sum all delays (they're additive)
  return Math.round(delays.reduce((sum, delay) => sum + delay, 0));
}

/**
 * Get delay severity level
 */
export function getDelaySeverity(minutes: number): 'none' | 'minor' | 'moderate' | 'severe' | 'critical' {
  if (minutes <= 0) return 'none';
  if (minutes < 5) return 'minor';
  if (minutes < 10) return 'moderate';
  if (minutes < 15) return 'severe';
  return 'critical';
}

/**
 * Format delay for display
 */
export function formatDelay(minutes: number): string {
  if (minutes <= 0) return 'On Time';
  if (minutes < 60) return `${minutes} min delay`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m delay` : `${hours}h delay`;
}
