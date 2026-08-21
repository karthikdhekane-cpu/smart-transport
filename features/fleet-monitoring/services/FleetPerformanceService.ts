// Fleet Performance Service
// Aggregates and calculates fleet performance metrics for reports

import { FleetPerformanceSummary, VehiclePerformance, DriverPerformance, RoutePerformance } from '../types/index';
import { mockBuses, mockDrivers, mockRoutes } from '@/lib/mockData';
import { speedMonitoringService, vehicleHealthService, driverBehaviourScoreService, fuelConsumptionService } from '../index';

class FleetPerformanceService {
  // Get fleet performance summary
  getFleetPerformanceSummary(): FleetPerformanceSummary {
    const totalVehicles = mockBuses.length;
    const activeToday = mockBuses.filter(b => b.status === 'moving').length;
    const averageUtilization = mockBuses.reduce((sum, b) => sum + (b.occupancy / b.capacity), 0) / mockBuses.length * 100;
    
    // Calculate totals from existing services
    const fuelSummary = fuelConsumptionService.getFleetFuelSummary();
    const speedSummary = speedMonitoringService.getFleetSpeedSummary();
    const healthSummary = vehicleHealthService.getFleetHealthSummary();
    
    // Simulate trip data
    const totalTrips = mockBuses.length * 6; // 6 trips per bus per day
    const completedTrips = Math.floor(totalTrips * 0.92);
    const delayedTrips = totalTrips - completedTrips;
    const averageDelay = 8.5; // minutes
    
    return {
      totalVehicles,
      activeToday,
      averageUtilization,
      totalDistance: fuelSummary.totalDistance,
      totalTrips,
      completedTrips,
      delayedTrips,
      averageDelay,
      averageSpeed: speedSummary.averageSpeed,
      overspeedEvents: speedSummary.overspeedCount,
      maintenanceIssues: healthSummary.attentionRequired + healthSummary.maintenanceDue + healthSummary.critical,
      totalFuelConsumed: fuelSummary.totalFuelConsumed,
      averageFuelEfficiency: fuelSummary.averageEfficiency,
    };
  }

  // Get vehicle performance data
  getVehiclePerformance(): VehiclePerformance[] {
    return mockBuses.map(bus => {
      const speedData = speedMonitoringService.getSpeedMonitoringData(bus.id);
      const health = vehicleHealthService.getVehicleHealth(bus.id);
      const fuelData = fuelConsumptionService.getFuelAnalytics(bus.id);
      const driver = mockDrivers.find(d => d.busId === bus.id);
      
      return {
        busId: bus.id,
        busNumber: bus.number,
        driverId: driver?.id || '',
        driverName: driver?.name || bus.driver,
        distance: fuelData?.totalDistance || 0,
        trips: 6, // Simulated trips per day
        utilization: (bus.occupancy / bus.capacity) * 100,
        averageSpeed: speedData?.averageSpeed || bus.speed,
        overspeedEvents: speedData?.overspeedCount || 0,
        fuelEfficiency: fuelData?.averageEfficiency || 8.5,
        healthStatus: health?.overallStatus || 'healthy',
        maintenanceIssues: health?.criticalWarnings.length || 0,
      };
    });
  }

  // Get driver performance data
  getDriverPerformance(): DriverPerformance[] {
    return mockDrivers.map(driver => {
      const behaviourScore = driverBehaviourScoreService.getBehaviourScore(driver.id);
      const bus = mockBuses.find(b => b.id === driver.busId);
      const fuelData = bus ? fuelConsumptionService.getFuelAnalytics(bus.id) : null;
      
      return {
        driverId: driver.id,
        driverName: driver.name,
        busId: driver.busId || '',
        busNumber: bus?.number || '',
        trips: driver.trips || 1240,
        behaviourScore: behaviourScore?.overallScore || driver.safetyScore,
        safetyEvents: behaviourScore?.factors.safety.events || 0,
        routeDeviations: behaviourScore?.factors.routeCompliance.events || 0,
        attendanceRate: 95, // Simulated attendance rate
        averageSpeed: bus?.speed || 42,
        fuelEfficiency: fuelData?.averageEfficiency || 8.5,
      };
    });
  }

  // Get route performance data
  getRoutePerformance(): RoutePerformance[] {
    return Object.values(mockRoutes).map(route => {
      const busesOnRoute = mockBuses.filter(b => b.route === route.name);
      const routeAvgSpeed = busesOnRoute.reduce((sum, b) => sum + b.speed, 0) / busesOnRoute.length || 0;
      
      return {
        routeId: route.id,
        routeName: route.name,
        trips: busesOnRoute.length * 6,
        averageETAAccuracy: 92, // Simulated accuracy percentage
        delays: Math.floor(busesOnRoute.length * 0.5),
        averageDelay: 7.2,
        routeDeviations: Math.floor(busesOnRoute.length * 0.3),
        averageTravelTime: 45, // minutes
        averageSpeed: routeAvgSpeed,
      };
    });
  }
}

export const fleetPerformanceService = new FleetPerformanceService();
