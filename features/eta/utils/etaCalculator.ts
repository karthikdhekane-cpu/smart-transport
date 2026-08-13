// ETA Calculator - Core calculation engine for Dynamic ETA system

import { ETACalculationInputs, ComputedETA, DelayReason } from '../types';

// Constants
const BASE_SPEED_KMH = 40;

/**
 * Calculate base ETA without traffic or delays
 * @param remainingDistance - Remaining distance in meters
 * @param currentSpeed - Current bus speed in km/h
 * @returns ETA in seconds
 */
export function calculateBaseETA(remainingDistance: number, currentSpeed: number): number {
  if (currentSpeed <= 0) return 999; // Bus stopped
  
  // Convert speed to m/s and calculate time
  const speedMs = currentSpeed / 3.6; // km/h to m/s
  return Math.round(remainingDistance / speedMs);
}

/**
 * Calculate traffic-adjusted speed
 * @param currentSpeed - Base speed in km/h
 * @param trafficMultiplier - Traffic impact multiplier
 * @returns Effective speed in km/h
 */
export function calculateEffectiveSpeed(currentSpeed: number, trafficMultiplier: number): number {
  const effectiveSpeed = currentSpeed * trafficMultiplier;
  return Math.max(5, Math.min(60, effectiveSpeed)); // Clamp between 5-60 km/h
}

/**
 * Apply traffic delay to ETA
 * @param baseETA - Base ETA in seconds
 * @param delayMinutes - Delay in minutes
 * @returns ETA with traffic delay in seconds
 */
export function applyTrafficDelay(baseETA: number, delayMinutes: number): number {
  return baseETA + (delayMinutes * 60);
}

/**
 * Calculate delay reason based on conditions
 */
export function determineDelayReason(
  trafficMultiplier: number,
  currentSpeed: number,
  averageRouteSpeed: number
): DelayReason {
  if (trafficMultiplier < 0.8) return 'traffic';
  if (trafficMultiplier < 0.95) return 'traffic';
  if (currentSpeed < averageRouteSpeed * 0.7) return 'road-work';
  if (currentSpeed < averageRouteSpeed * 0.85) return 'signal';
  return 'none';
}

/**
 * Main ETA calculation function
 */
export function calculateETA(inputs: ETACalculationInputs): ComputedETA {
  const {
    remainingDistance,
    currentSpeed,
    averageRouteSpeed,
    trafficMultiplier,
    roadDelayMinutes,
    boardingDelayMinutes,
    signalDelayMinutes,
    busStatus,
  } = inputs;

  // Calculate base ETA
  const baseETA = calculateBaseETA(remainingDistance, currentSpeed);

  // Calculate effective speed with traffic
  const effectiveSpeed = calculateEffectiveSpeed(currentSpeed, trafficMultiplier);

  // Calculate traffic delay
  const totalDelayMinutes = roadDelayMinutes + boardingDelayMinutes + signalDelayMinutes;
  
  // Calculate final ETA
  const finalETA = applyTrafficDelay(baseETA, totalDelayMinutes);

  // Determine delay reason
  const delayReason = determineDelayReason(trafficMultiplier, currentSpeed, averageRouteSpeed);

  // Calculate delay minutes (actual delay vs scheduled)
  const scheduledETA = calculateBaseETA(remainingDistance, averageRouteSpeed);
  const actualDelayMinutes = Math.max(0, Math.round((finalETA - scheduledETA) / 60));

  return {
    seconds: Math.round(finalETA),
    text: formatETA(Math.round(finalETA)),
    delayMinutes: actualDelayMinutes,
    delayReason,
  };
}

/**
 * Format ETA for display
 */
export function formatETA(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

/**
 * Calculate predicted arrival time
 */
export function calculatePredictedArrival(etaSeconds: number): Date {
  return new Date(Date.now() + etaSeconds * 1000);
}

/**
 * Calculate delay percentage
 */
export function calculateDelayPercentage(baseETA: number, actualETA: number): number {
  if (baseETA <= 0) return 0;
  return Math.round(((actualETA - baseETA) / baseETA) * 100);
}

/**
 * Calculate trip completion percentage
 */
export function calculateTripProgress(distanceRemaining: number, totalDistance: number): number {
  if (totalDistance <= 0) return 0;
  const completedDistance = totalDistance - distanceRemaining;
  return Math.min(100, Math.max(0, (completedDistance / totalDistance) * 100));
}

/**
 * Calculate ETA to reach next stop
 */
export function calculateETAToStop(
  remainingDistance: number,
  currentSpeed: number,
  trafficMultiplier: number,
  delayMinutes: number
): number {
  if (currentSpeed < 1) return 999; // Bus stopped
  
  const effectiveSpeed = currentSpeed * trafficMultiplier;
  const travelTimeMinutes = (remainingDistance / 1000) / effectiveSpeed * 60;
  
  return Math.max(1, Math.round(travelTimeMinutes + delayMinutes));
}
