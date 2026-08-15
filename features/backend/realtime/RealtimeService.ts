// Realtime Service - Manages realtime synchronization

type UpdateHandler<T> = (data: T) => void;
type UnsubscribeFn = () => void;

export class RealtimeService {
  private subscriptions: Map<string, UpdateHandler<any>[]> = new Map();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    console.log('Realtime service initialized');
  }

  subscribe<T>(topic: string, handler: UpdateHandler<T>): UnsubscribeFn {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, []);
    }
    const handlers = this.subscriptions.get(topic)!;
    handlers.push(handler);
    return () => {
      const index = handlers.indexOf(handler);
      if (index > -1) handlers.splice(index, 1);
    };
  }

  publish<T>(topic: string, data: T): void {
    const handlers = this.subscriptions.get(topic) || [];
    handlers.forEach(handler => handler(data));
  }

  // GPS location updates
  async subscribeToGPS(busId: string, handler: (location: { lat: number; lng: number; speed: number }) => void): Promise<UnsubscribeFn> {
    return this.subscribe(`gps:${busId}`, handler);
  }

  // Driver status updates
  async subscribeToDriverStatus(driverId: string, handler: (status: { status: 'driving' | 'idle' | 'break'; availability: 'available' | 'unavailable' }) => void): Promise<UnsubscribeFn> {
    return this.subscribe(`driver:${driverId}`, handler);
  }

  // Driver availability updates
  async subscribeToDriverAvailability(driverId: string, handler: (availability: 'available' | 'unavailable') => void): Promise<UnsubscribeFn> {
    return this.subscribe(`driver-availability:${driverId}`, handler);
  }

  // Trip state updates
  async subscribeToTripState(busId: string, handler: (status: 'pending' | 'active' | 'completed') => void): Promise<UnsubscribeFn> {
    return this.subscribe(`trip:${busId}`, handler);
  }

  // Notification updates
  async subscribeToNotifications(userId: string, handler: () => void): Promise<UnsubscribeFn> {
    return this.subscribe(`notifications:${userId}`, handler);
  }

  // Alert updates
  async subscribeToAlerts(busId: string, handler: () => void): Promise<UnsubscribeFn> {
    return this.subscribe(`alerts:${busId}`, handler);
  }

  cleanup(): void {
    this.subscriptions.clear();
    this.initialized = false;
  }
}

export const realtimeService = new RealtimeService();
