// Assignment Service - Business logic for atomic assignment operations

import { BusRepository } from '../repositories/BusRepository';
import { DriverRepository } from '../repositories/DriverRepository';
import { RouteRepository } from '../repositories/RouteRepository';
import { Bus, Driver, Route } from '../types';

export class AssignmentService {
  private busRepository = new BusRepository();
  private driverRepository = new DriverRepository();
  private routeRepository = new RouteRepository();

  // Assign driver to bus atomically
  async assignDriverToBus(driverId: string, busId: string): Promise<boolean> {
    return this.busRepository.assignDriverToBus(busId, driverId);
  }

  // Clear driver assignment from bus
  async clearDriverAssignment(busId: string): Promise<boolean> {
    return this.busRepository.assignDriverToBus(busId, null);
  }

  // Assign bus to route atomically
  async assignBusToRoute(busId: string, routeId: string): Promise<boolean> {
    return this.routeRepository.assignBus(routeId, busId);
  }

  // Clear bus assignment from route
  async clearBusAssignment(busId: string): Promise<boolean> {
    return this.routeRepository.assignBus(busId, null);
  }

  // Assign route to bus atomically (alias for assignBusToRoute)
  async assignRouteToBus(routeId: string, busId: string): Promise<boolean> {
    return this.routeRepository.assignBus(routeId, busId);
  }

  // Get all assignments for a bus
  async getBusAssignments(busId: string): Promise<{
    bus: Bus | null;
    driver: Driver | null;
    route: Route | null;
  }> {
    const bus = await this.busRepository.getById(busId);
    let driver: Driver | null = null;
    let route: Route | null = null;

    // Find driver by busId (since Driver has busId, not Bus has driverId)
    const drivers = await this.driverRepository.getAll();
    driver = drivers.find(d => d.busId === busId) || null;

    if (bus?.routeId) {
      route = await this.routeRepository.getById(bus.routeId);
    }

    return { bus, driver, route };
  }

  // Get all assignments for a driver
  async getDriverAssignments(driverId: string): Promise<{
    driver: Driver | null;
    bus: Bus | null;
  }> {
    const driver = await this.driverRepository.getById(driverId);
    let bus: Bus | null = null;

    if (driver?.busId) {
      bus = await this.busRepository.getById(driver.busId);
    }

    return { driver, bus };
  }

  // Get all assignments for a route
  async getRouteAssignments(routeId: string): Promise<{
    route: Route | null;
    bus: Bus | null;
  }> {
    const route = await this.routeRepository.getById(routeId);
    let bus: Bus | null = null;

    if (route?.busId) {
      bus = await this.busRepository.getById(route.busId);
    }

    return { route, bus };
  }
}
