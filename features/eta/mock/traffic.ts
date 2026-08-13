// Mock Traffic Configuration
import { TrafficLevel, TrafficLevelConfig } from '../types/index';

export const TRAFFIC_LEVELS: Record<TrafficLevel, TrafficLevelConfig> = {
  'very-low': {
    name: 'Very Low',
    speedMultiplier: 1.15,
    delayMinutes: 0,
    color: 'text-green-600',
    icon: '🟢',
  },
  'low': {
    name: 'Low',
    speedMultiplier: 1.10,
    delayMinutes: 1,
    color: 'text-green-600',
    icon: '🟢',
  },
  'medium': {
    name: 'Medium',
    speedMultiplier: 1.0,
    delayMinutes: 3,
    color: 'text-yellow-600',
    icon: '🟡',
  },
  'high': {
    name: 'High',
    speedMultiplier: 0.85,
    delayMinutes: 6,
    color: 'text-orange-600',
    icon: '🟠',
  },
  'heavy': {
    name: 'Heavy',
    speedMultiplier: 0.70,
    delayMinutes: 10,
    color: 'text-red-600',
    icon: '🔴',
  },
};

// Traffic probability weights (for weighted random selection)
const TRAFFIC_WEIGHTS = [0.1, 0.25, 0.35, 0.2, 0.1]; // very-low, low, medium, high, heavy

// Get weighted random traffic level
export function getRandomTrafficLevel(): TrafficLevel {
  const random = Math.random();
  let cumulative = 0;
  const levels: TrafficLevel[] = ['very-low', 'low', 'medium', 'high', 'heavy'];
  
  for (let i = 0; i < levels.length; i++) {
    cumulative += TRAFFIC_WEIGHTS[i];
    if (random <= cumulative) {
      return levels[i];
    }
  }
  
  return 'medium'; // Default
}

// Simulate traffic changes with cooldown period
export function simulateTrafficChange(
  currentLevel: TrafficLevel,
  lastChanged: number,
  minCooldown: number = 20000 // Minimum 20 seconds between changes
): TrafficLevel {
  const now = Date.now();
  const timeSinceChange = now - lastChanged;
  
  // Only change traffic after cooldown period
  if (timeSinceChange >= minCooldown) {
    // 30% chance of traffic change after cooldown
    if (Math.random() < 0.3) {
      return getRandomTrafficLevel();
    }
  }
  
  return currentLevel;
}

// Smoothly interpolate between traffic levels (for animations)
export function getTrafficInterpolation(
  currentLevel: TrafficLevel,
  targetLevel: TrafficLevel,
  progress: number
): TrafficLevelConfig {
  const currentConfig = TRAFFIC_LEVELS[currentLevel];
  const targetConfig = TRAFFIC_LEVELS[targetLevel];
  
  // Simple interpolation - could be improved with easing functions
  const interpolatedSpeed = 
    currentConfig.speedMultiplier + (targetConfig.speedMultiplier - currentConfig.speedMultiplier) * progress;
  
  const interpolatedDelay = 
    currentConfig.delayMinutes + (targetConfig.delayMinutes - currentConfig.delayMinutes) * progress;
  
  return {
    name: progress < 0.5 ? currentConfig.name : targetConfig.name,
    speedMultiplier: interpolatedSpeed,
    delayMinutes: Math.round(interpolatedDelay),
    color: progress < 0.5 ? currentConfig.color : targetConfig.color,
    icon: progress < 0.5 ? currentConfig.icon : targetConfig.icon,
  };
}
