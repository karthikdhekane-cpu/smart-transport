// Student Travel History Service
// Manages student travel history and trip records

import { StudentTrip } from '../types/index';
import { mockStudents, mockBuses, mockRoutes, mockDrivers } from '@/lib/mockData';

class StudentTravelHistoryService {
  private travelHistory: Map<string, StudentTrip[]> = new Map();

  constructor() {
    this.initializeTravelHistory();
  }

  private initializeTravelHistory() {
    // Initialize deterministic travel history for each student
    mockStudents.forEach((student, studentIndex) => {
      const trips: StudentTrip[] = [];
      const bus = mockBuses.find(b => b.id === student.busId);
      const driver = mockDrivers.find(d => d.busId === student.busId);
      const route = Object.values(mockRoutes).find(r => r.busId === student.busId);
      
      // Generate travel history for last 30 days
      for (let day = 0; day < 30; day++) {
        const date = new Date();
        date.setDate(date.getDate() - day);
        const dateStr = date.toISOString().split('T')[0];
        
        // Skip weekends (Saturday = 6, Sunday = 0)
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        // Generate trip data
        const pickupHour = 7 + Math.floor(Math.random() * 2); // 7-8 AM
        const pickupTime = new Date(date);
        pickupTime.setHours(pickupHour, 30 + Math.floor(Math.random() * 30), 0);
        
        const dropoffTime = new Date(pickupTime);
        dropoffTime.setMinutes(dropoffTime.getMinutes() + 30 + Math.floor(Math.random() * 20));
        
        const tripDuration = (dropoffTime.getTime() - pickupTime.getTime()) / (1000 * 60); // minutes
        
        // Random attendance status
        const attendanceStatuses: Array<'present' | 'absent' | 'late'> = ['present', 'present', 'present', 'late', 'absent'];
        const attendanceStatus = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)];
        
        // Trip status based on attendance
        const tripStatus = attendanceStatus === 'absent' ? 'cancelled' : 'completed';
        
        // Delay information
        const delayMinutes = attendanceStatus === 'late' ? 5 + Math.floor(Math.random() * 15) : 0;
        
        const trip: StudentTrip = {
          id: `trip-${student.id}-${dateStr}`,
          studentId: student.id,
          studentName: student.name,
          routeId: route?.id || 'unknown',
          routeName: route?.name || bus?.route || 'Unknown Route',
          busId: student.busId,
          busNumber: bus?.number || student.busId,
          driverId: driver?.id || '',
          driverName: driver?.name || bus?.driver || 'Unknown',
          pickupPoint: student.stop,
          dropoffPoint: route?.stops[route.stops.length - 1]?.name || 'College',
          pickupTime: pickupTime.getTime(),
          dropoffTime: dropoffTime.getTime(),
          tripDuration,
          attendanceStatus,
          tripStatus,
          delayMinutes: delayMinutes > 0 ? delayMinutes : undefined,
          distance: 15 + Math.floor(Math.random() * 10), // 15-25 km
          date: dateStr,
        };
        
        trips.push(trip);
      }
      
      this.travelHistory.set(student.id, trips);
    });
  }

  // Get travel history for a specific student
  getStudentTravelHistory(studentId: string): StudentTrip[] {
    return this.travelHistory.get(studentId) || [];
  }

  // Get recent trips for a student
  getRecentTrips(studentId: string, limit: number = 10): StudentTrip[] {
    const history = this.travelHistory.get(studentId) || [];
    return history.slice(0, limit);
  }

  // Get travel history for a date range
  getTravelHistoryByDateRange(studentId: string, startDate: Date, endDate: Date): StudentTrip[] {
    const history = this.travelHistory.get(studentId) || [];
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    return history.filter(trip => {
      const tripTime = trip.pickupTime;
      return tripTime >= start && tripTime <= end;
    });
  }

  // Get travel history by route
  getTravelHistoryByRoute(studentId: string, routeId: string): StudentTrip[] {
    const history = this.travelHistory.get(studentId) || [];
    return history.filter(trip => trip.routeId === routeId);
  }

  // Get travel statistics for a student
  getStudentTravelStats(studentId: string) {
    const history = this.travelHistory.get(studentId) || [];
    
    const totalTrips = history.length;
    const presentTrips = history.filter(t => t.attendanceStatus === 'present').length;
    const lateTrips = history.filter(t => t.attendanceStatus === 'late').length;
    const absentTrips = history.filter(t => t.attendanceStatus === 'absent').length;
    const delayedTrips = history.filter(t => t.delayMinutes && t.delayMinutes > 0).length;
    
    const totalDistance = history.reduce((sum, t) => sum + t.distance, 0);
    const totalDuration = history.reduce((sum, t) => sum + t.tripDuration, 0);
    const avgDuration = totalDuration / totalTrips;
    
    const attendanceRate = totalTrips > 0 ? (presentTrips / totalTrips) * 100 : 0;
    const onTimeRate = totalTrips > 0 ? ((presentTrips + lateTrips) / totalTrips) * 100 : 0;
    
    return {
      totalTrips,
      presentTrips,
      lateTrips,
      absentTrips,
      delayedTrips,
      attendanceRate,
      onTimeRate,
      totalDistance,
      avgDuration,
    };
  }

  // Get trip detail by ID
  getTripById(tripId: string): StudentTrip | null {
    const histories = Array.from(this.travelHistory.values());
    for (const history of histories) {
      const trip = history.find((t: StudentTrip) => t.id === tripId);
      if (trip) return trip;
    }
    return null;
  }
}

export const studentTravelHistoryService = new StudentTravelHistoryService();
