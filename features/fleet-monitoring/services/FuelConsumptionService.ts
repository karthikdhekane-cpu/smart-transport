// Fuel Consumption Service
// Handles fuel consumption tracking, efficiency calculations, and cost estimation

import { FuelConsumption, FuelAnalytics, FuelComparison } from '../types/index';
import { mockBuses } from '@/lib/mockData';

const FUEL_PRICE_PER_LITER = 95; // INR per liter (configurable)

class FuelConsumptionService {
  private fuelData: Map<string, FuelConsumption[]> = new Map();
  private fuelAnalytics: Map<string, FuelAnalytics> = new Map();

  constructor() {
    this.initializeFuelData();
  }

  private initializeFuelData() {
    // Initialize deterministic fuel consumption data for each bus
    mockBuses.forEach((bus, index) => {
      const now = Date.now();
      const dailyData: FuelConsumption[] = [];
      const weeklyData: FuelConsumption[] = [];
      const monthlyData: FuelConsumption[] = [];

      // Generate daily data for last 7 days
      for (let day = 0; day < 7; day++) {
        const dayTimestamp = now - (day * 24 * 60 * 60 * 1000);
        const distance = 80 + (index * 10) + Math.floor(Math.random() * 20); // 80-120 km
        const efficiency = 8 + (index * 0.5) + Math.random(); // 8-10 km/l
        const fuelConsumed = distance / efficiency;
        
        const consumption: FuelConsumption = {
          busId: bus.id,
          driverId: `D${bus.id.split('-')[1]}`,
          routeId: `route-${String.fromCharCode(65 + index)}`,
          timestamp: dayTimestamp,
          distance,
          fuelConsumed,
          fuelEfficiency: efficiency,
          estimatedCost: fuelConsumed * FUEL_PRICE_PER_LITER,
        };
        
        dailyData.push(consumption);
        weeklyData.push(consumption);
        monthlyData.push(consumption);
      }

      // Generate additional data for weekly/monthly
      for (let week = 1; week < 4; week++) {
        const weekTimestamp = now - (week * 7 * 24 * 60 * 60 * 1000);
        const distance = 80 + (index * 10) + Math.floor(Math.random() * 20);
        const efficiency = 8 + (index * 0.5) + Math.random();
        const fuelConsumed = distance / efficiency;
        
        const consumption: FuelConsumption = {
          busId: bus.id,
          driverId: `D${bus.id.split('-')[1]}`,
          routeId: `route-${String.fromCharCode(65 + index)}`,
          timestamp: weekTimestamp,
          distance,
          fuelConsumed,
          fuelEfficiency: efficiency,
          estimatedCost: fuelConsumed * FUEL_PRICE_PER_LITER,
        };
        
        weeklyData.push(consumption);
        monthlyData.push(consumption);
      }

      // Calculate totals
      const totalDistance = dailyData.reduce((sum, d) => sum + d.distance, 0);
      const totalFuel = dailyData.reduce((sum, d) => sum + d.fuelConsumed, 0);
      const avgEfficiency = totalDistance / totalFuel;

      const analytics: FuelAnalytics = {
        busId: bus.id,
        totalDistance,
        totalFuelConsumed: totalFuel,
        averageEfficiency: avgEfficiency,
        estimatedTotalCost: totalFuel * FUEL_PRICE_PER_LITER,
        dailyConsumption: dailyData,
        weeklyConsumption: weeklyData,
        monthlyConsumption: monthlyData,
        abnormalConsumption: this.detectAbnormalConsumption(dailyData, avgEfficiency),
      };

      this.fuelData.set(bus.id, dailyData);
      this.fuelAnalytics.set(bus.id, analytics);
    });
  }

  private detectAbnormalConsumption(data: FuelConsumption[], avgEfficiency: number): FuelConsumption[] {
    // Detect consumption that deviates significantly from average
    const threshold = avgEfficiency * 0.7; // 30% deviation threshold
    return data.filter(d => d.fuelEfficiency < threshold);
  }

  // Get fuel analytics for a specific bus
  getFuelAnalytics(busId: string): FuelAnalytics | null {
    return this.fuelAnalytics.get(busId) || null;
  }

  // Get fuel consumption for a time period
  getFuelConsumptionByPeriod(busId: string, period: 'daily' | 'weekly' | 'monthly'): FuelConsumption[] {
    const analytics = this.fuelAnalytics.get(busId);
    if (!analytics) return [];

    switch (period) {
      case 'daily':
        return analytics.dailyConsumption;
      case 'weekly':
        return analytics.weeklyConsumption;
      case 'monthly':
        return analytics.monthlyConsumption;
      default:
        return analytics.dailyConsumption;
    }
  }

  // Get fleet fuel summary
  getFleetFuelSummary() {
    const allAnalytics = Array.from(this.fuelAnalytics.values());
    
    const totalDistance = allAnalytics.reduce((sum, a) => sum + a.totalDistance, 0);
    const totalFuel = allAnalytics.reduce((sum, a) => sum + a.totalFuelConsumed, 0);
    const totalCost = allAnalytics.reduce((sum, a) => sum + a.estimatedTotalCost, 0);
    const avgEfficiency = totalDistance / totalFuel;

    return {
      totalDistance,
      totalFuelConsumed: totalFuel,
      averageEfficiency: avgEfficiency,
      estimatedTotalCost: totalCost,
      vehicleCount: allAnalytics.length,
    };
  }

  // Get fuel comparison across fleet
  getFuelComparison(): FuelComparison[] {
    const comparisons: FuelComparison[] = [];
    
    this.fuelAnalytics.forEach((analytics, busId) => {
      const bus = mockBuses.find(b => b.id === busId);
      comparisons.push({
        busId,
        busNumber: bus?.number || busId,
        efficiency: analytics.averageEfficiency,
        distance: analytics.totalDistance,
        fuelConsumed: analytics.totalFuelConsumed,
        rank: 0, // Will be calculated after sorting
      });
    });

    // Sort by efficiency (descending) and assign ranks
    comparisons.sort((a, b) => b.efficiency - a.efficiency);
    comparisons.forEach((comp, index) => {
      comp.rank = index + 1;
    });

    return comparisons;
  }

  // Get highest consumption vehicles
  getHighestConsumptionVehicles(limit: number = 5): FuelComparison[] {
    const comparison = this.getFuelComparison();
    // Sort by fuel consumed (descending)
    return comparison
      .sort((a, b) => b.fuelConsumed - a.fuelConsumed)
      .slice(0, limit);
  }

  // Get lowest efficiency vehicles
  getLowestEfficiencyVehicles(limit: number = 5): FuelComparison[] {
    const comparison = this.getFuelComparison();
    // Already sorted by efficiency descending, so take from end
    return comparison.slice(-limit).reverse();
  }

  // Record fuel consumption (for real-time updates)
  recordFuelConsumption(
    busId: string,
    distance: number,
    fuelConsumed: number,
    routeId?: string
  ): FuelConsumption {
    const bus = mockBuses.find(b => b.id === busId);
    const efficiency = distance / fuelConsumed;

    const consumption: FuelConsumption = {
      busId,
      driverId: `D${busId.split('-')[1]}`,
      routeId,
      timestamp: Date.now(),
      distance,
      fuelConsumed,
      fuelEfficiency: efficiency,
      estimatedCost: fuelConsumed * FUEL_PRICE_PER_LITER,
    };

    // Update stored data
    const existingData = this.fuelData.get(busId) || [];
    existingData.push(consumption);
    this.fuelData.set(busId, existingData);

    // Update analytics
    const analytics = this.fuelAnalytics.get(busId);
    if (analytics) {
      analytics.totalDistance += distance;
      analytics.totalFuelConsumed += fuelConsumed;
      analytics.averageEfficiency = analytics.totalDistance / analytics.totalFuelConsumed;
      analytics.estimatedTotalCost = analytics.totalFuelConsumed * FUEL_PRICE_PER_LITER;
      analytics.dailyConsumption.push(consumption);
      this.fuelAnalytics.set(busId, analytics);
    }

    return consumption;
  }

  // Get fuel consumption by route
  getFuelConsumptionByRoute(routeId: string): FuelConsumption[] {
    const allConsumption: FuelConsumption[] = [];
    this.fuelData.forEach(data => {
      data.forEach(consumption => {
        if (consumption.routeId === routeId) {
          allConsumption.push(consumption);
        }
      });
    });
    return allConsumption.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get fuel consumption by driver
  getFuelConsumptionByDriver(driverId: string): FuelConsumption[] {
    const allConsumption: FuelConsumption[] = [];
    this.fuelData.forEach(data => {
      data.forEach(consumption => {
        if (consumption.driverId === driverId) {
          allConsumption.push(consumption);
        }
      });
    });
    return allConsumption.sort((a, b) => b.timestamp - a.timestamp);
  }
}

export const fuelConsumptionService = new FuelConsumptionService();
