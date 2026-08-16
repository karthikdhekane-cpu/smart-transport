// Driver Behaviour Score Service
// Calculates and manages driver behaviour scores based on various factors

import { BehaviourEvent, DriverBehaviourScore } from '../types/index';
import { mockDrivers, mockBuses } from '@/lib/mockData';

// Scoring configuration
const SCORE_WEIGHTS = {
  overspeed: 15, // Points deducted per overspeed event
  harshBraking: 10,
  harshAcceleration: 8,
  routeDeviation: 20,
  unauthorizedStop: 15,
  safetyViolation: 25,
};

const SCORE_THRESHOLDS = {
  excellent: 90,
  good: 75,
  needsImprovement: 60,
};

class DriverBehaviourScoreService {
  private behaviourScores: Map<string, DriverBehaviourScore> = new Map();
  private behaviourEvents: Map<string, BehaviourEvent[]> = new Map();

  constructor() {
    this.initializeBehaviourScores();
  }

  private initializeBehaviourScores() {
    // Initialize behaviour scores for each driver
    mockDrivers.forEach((driver, index) => {
      const score = this.calculateInitialScore(index);
      const behaviourScore: DriverBehaviourScore = {
        driverId: driver.id,
        driverName: driver.name,
        busId: driver.busId || `BUS-0${index + 1}`,
        overallScore: score,
        category: this.getScoreCategory(score),
        trend: 'stable',
        factors: {
          overspeed: { score: 100, events: 0, points: 0 },
          harshBraking: { score: 100, events: 0, points: 0 },
          harshAcceleration: { score: 100, events: 0, points: 0 },
          routeCompliance: { score: 100, events: 0, points: 0 },
          safety: { score: 100, events: 0, points: 0 },
        },
        recentEvents: [],
        positiveBehaviours: this.generatePositiveBehaviours(index),
        negativeBehaviours: this.generateNegativeBehaviours(index),
        lastUpdated: Date.now(),
      };

      this.behaviourScores.set(driver.id, behaviourScore);
      this.behaviourEvents.set(driver.id, []);
    });
  }

  private calculateInitialScore(index: number): number {
    // Deterministic initial score based on driver index
    const baseScores = [94, 88, 97, 91]; // From mock data safety scores
    return baseScores[index % baseScores.length] || 90;
  }

  private getScoreCategory(score: number): 'excellent' | 'good' | 'needs_improvement' | 'attention_required' {
    if (score >= SCORE_THRESHOLDS.excellent) return 'excellent';
    if (score >= SCORE_THRESHOLDS.good) return 'good';
    if (score >= SCORE_THRESHOLDS.needsImprovement) return 'needs_improvement';
    return 'attention_required';
  }

  private generatePositiveBehaviours(index: number): string[] {
    const positives = [
      'Consistent route adherence',
      'Smooth braking patterns',
      'Good speed compliance',
      'Punctual trip completion',
      'Excellent attendance',
      'Safe driving practices',
      'Good vehicle maintenance',
      'Effective communication',
    ];
    
    // Return 3-5 positive behaviours based on index
    const count = 3 + (index % 3);
    return positives.slice(index, index + count);
  }

  private generateNegativeBehaviours(index: number): string[] {
    const negatives: string[] = [];
    
    // Only generate negative behaviours for certain drivers
    if (index === 1) {
      negatives.push('Occasional overspeeding');
      negatives.push('Late arrivals');
    }
    
    if (index === 3) {
      negatives.push('Route deviations');
      negatives.push('Harsh braking');
    }
    
    return negatives;
  }

  // Record a behaviour event
  recordBehaviourEvent(event: Omit<BehaviourEvent, 'id' | 'timestamp' | 'pointsDeducted'>): BehaviourEvent {
    const behaviourEvent: BehaviourEvent = {
      ...event,
      id: `behaviour-${event.driverId}-${Date.now()}`,
      timestamp: Date.now(),
      pointsDeducted: SCORE_WEIGHTS[event.type] || 10,
    };

    // Store event
    const events = this.behaviourEvents.get(event.driverId) || [];
    events.push(behaviourEvent);
    this.behaviourEvents.set(event.driverId, events);

    // Update behaviour score
    this.updateBehaviourScore(event.driverId, behaviourEvent);

    return behaviourEvent;
  }

  private updateBehaviourScore(driverId: string, event: BehaviourEvent) {
    const score = this.behaviourScores.get(driverId);
    if (!score) return;

    // Deduct points based on event type
    score.overallScore = Math.max(0, score.overallScore - event.pointsDeducted);
    score.category = this.getScoreCategory(score.overallScore);
    score.lastUpdated = Date.now();

    // Update specific factor
    switch (event.type) {
      case 'overspeed':
        score.factors.overspeed.events++;
        score.factors.overspeed.points += event.pointsDeducted;
        score.factors.overspeed.score = Math.max(0, 100 - score.factors.overspeed.points);
        break;
      case 'harshBraking':
        score.factors.harshBraking.events++;
        score.factors.harshBraking.points += event.pointsDeducted;
        score.factors.harshBraking.score = Math.max(0, 100 - score.factors.harshBraking.points);
        break;
      case 'harshAcceleration':
        score.factors.harshAcceleration.events++;
        score.factors.harshAcceleration.points += event.pointsDeducted;
        score.factors.harshAcceleration.score = Math.max(0, 100 - score.factors.harshAcceleration.points);
        break;
      case 'routeDeviation':
        score.factors.routeCompliance.events++;
        score.factors.routeCompliance.points += event.pointsDeducted;
        score.factors.routeCompliance.score = Math.max(0, 100 - score.factors.routeCompliance.points);
        break;
      case 'unauthorizedStop':
        score.factors.safety.events++;
        score.factors.safety.points += event.pointsDeducted;
        score.factors.safety.score = Math.max(0, 100 - score.factors.safety.points);
        break;
      case 'safetyViolation':
        score.factors.safety.events++;
        score.factors.safety.points += event.pointsDeducted;
        score.factors.safety.score = Math.max(0, 100 - score.factors.safety.points);
        break;
    }

    // Update recent events (keep last 10)
    score.recentEvents = [event, ...score.recentEvents].slice(0, 10);

    // Update negative behaviours if needed
    if (event.pointsDeducted > 15 && !score.negativeBehaviours.includes(event.description)) {
      score.negativeBehaviours.push(event.description);
    }

    this.behaviourScores.set(driverId, score);
  }

  // Get behaviour score for a driver
  getBehaviourScore(driverId: string): DriverBehaviourScore | null {
    return this.behaviourScores.get(driverId) || null;
  }

  // Get all behaviour scores
  getAllBehaviourScores(): DriverBehaviourScore[] {
    return Array.from(this.behaviourScores.values());
  }

  // Get driver ranking
  getDriverRanking(): Array<{ driverId: string; driverName: string; score: number; rank: number }> {
    const scores = Array.from(this.behaviourScores.values())
      .map(s => ({
        driverId: s.driverId,
        driverName: s.driverName,
        score: s.overallScore,
        rank: 0,
      }))
      .sort((a, b) => b.score - a.score);

    scores.forEach((s, index) => {
      s.rank = index + 1;
    });

    return scores;
  }

  // Get behaviour events for a driver
  getBehaviourEvents(driverId: string): BehaviourEvent[] {
    return this.behaviourEvents.get(driverId) || [];
  }

  // Get recent behaviour events for all drivers
  getRecentBehaviourEvents(limit: number = 20): BehaviourEvent[] {
    const allEvents: BehaviourEvent[] = [];
    this.behaviourEvents.forEach(events => {
      allEvents.push(...events);
    });
    return allEvents.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  }

  // Get drivers requiring attention
  getDriversRequiringAttention(): DriverBehaviourScore[] {
    return Array.from(this.behaviourScores.values()).filter(
      s => s.category === 'needs_improvement' || s.category === 'attention_required'
    );
  }

  // Get top performing drivers
  getTopPerformers(limit: number = 5): DriverBehaviourScore[] {
    return Array.from(this.behaviourScores.values())
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, limit);
  }

  // Calculate score trend (comparing with previous period)
  calculateTrend(driverId: string): 'improving' | 'stable' | 'declining' {
    const score = this.behaviourScores.get(driverId);
    if (!score) return 'stable';

    const events = this.behaviourEvents.get(driverId) || [];
    const recentEvents = events.filter(e => Date.now() - e.timestamp < 7 * 24 * 60 * 60 * 1000); // Last 7 days
    
    if (recentEvents.length === 0) return 'stable';
    
    const recentPoints = recentEvents.reduce((sum, e) => sum + e.pointsDeducted, 0);
    
    if (recentPoints < 20) return 'improving';
    if (recentPoints > 50) return 'declining';
    return 'stable';
  }

  // Reset score (for testing or manual adjustment)
  resetScore(driverId: string, newScore: number = 100): boolean {
    const score = this.behaviourScores.get(driverId);
    if (!score) return false;

    score.overallScore = newScore;
    score.category = this.getScoreCategory(newScore);
    score.factors = {
      overspeed: { score: 100, events: 0, points: 0 },
      harshBraking: { score: 100, events: 0, points: 0 },
      harshAcceleration: { score: 100, events: 0, points: 0 },
      routeCompliance: { score: 100, events: 0, points: 0 },
      safety: { score: 100, events: 0, points: 0 },
    };
    score.recentEvents = [];
    score.negativeBehaviours = [];
    score.lastUpdated = Date.now();

    this.behaviourScores.set(driverId, score);
    return true;
  }
}

export const driverBehaviourScoreService = new DriverBehaviourScoreService();
