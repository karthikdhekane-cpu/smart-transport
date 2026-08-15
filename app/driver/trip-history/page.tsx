'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockAttendanceRecords } from '@/features/attendance/mock/data';
import { mockBuses } from '@/lib/mockData';

const navItems = [
  { href:'/driver',          icon:'🏠', label:'Dashboard' },
  { href:'/driver/trip',     icon:'🚌', label:'Trip Control' },
  { href:'/driver/analytics',icon:'📊', label:'My Analytics' },
  { href:'/driver/safety',   icon:'🛡️', label:'Safety Score' },
  { href:'/driver/trip-history', icon:'📅', label:'Trip History' },
  { href:'/driver/attendance', icon:'📋', label:'Attendance' },
];

const mockTrips = [
  { id: 'TRIP-001', date: 'Today', startTime: '8:05 AM', endTime: '8:40 AM', route: 'Route A — Gandhipuram', status: 'completed', busId: 'BUS-01', students: 38 },
  { id: 'TRIP-002', date: 'Today', startTime: '4:30 PM', endTime: '5:05 PM', route: 'Route A — Gandhipuram', status: 'completed', busId: 'BUS-01', students: 40 },
  { id: 'TRIP-003', date: 'Yesterday', startTime: '8:02 AM', endTime: '8:35 AM', route: 'Route A — Gandhipuram', status: 'completed', busId: 'BUS-01', students: 42 },
  { id: 'TRIP-004', date: 'Yesterday', startTime: '4:28 PM', endTime: '5:02 PM', route: 'Route A — Gandhipuram', status: 'completed', busId: 'BUS-01', students: 35 },
  { id: 'TRIP-005', date: 'Aug 14', startTime: '8:08 AM', endTime: '8:45 AM', route: 'Route A — Gandhipuram', status: 'completed', busId: 'BUS-01', students: 39 },
];

export default function TripHistoryPage() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');

  const filteredTrips = mockTrips.filter(trip => {
    if (filter === 'all') return true;
    if (filter === 'completed') return trip.status === 'completed';
    if (filter === 'active') return trip.status === 'active';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#00C853]/20 text-[#00C853]';
      case 'active': return 'bg-[#FFD700]/20 text-[#FFD700]';
      case 'cancelled': return 'bg-[#FF5722]/20 text-[#FF5722]';
      default: return 'bg-white/10 text-gray-400';
    }
  };

  return (
    <DashboardLayout role="driver" navItems={navItems} userName="Rajesh Kumar">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black">Trip History 📅</h1>
            <p className="text-gray-400 text-sm mt-1">Your complete trip history record</p>
          </div>
          <div className="flex gap-2">
            {(['all', 'completed', 'active'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === f
                    ? 'bg-[#00C853] text-black'
                    : 'glass text-gray-400 hover:bg-white/5'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Trip list */}
        <div className="glass rounded-2xl p-6">
          {filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📅</div>
              <p className="text-gray-400">No trips found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTrips.map((trip) => (
                <div key={trip.id} className="flex items-center gap-4 p-4 glass rounded-xl hover-card">
                  <div className="w-12 h-12 rounded-xl bg-[#00C853]/20 flex items-center justify-center text-2xl">
                    🚌
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-white">{trip.route}</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(trip.status)}`}>
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs text-gray-400">
                      <div>
                        <span className="block text-gray-600">Date</span>
                        {trip.date}
                      </div>
                      <div>
                        <span className="block text-gray-600">Time</span>
                        {trip.startTime} - {trip.endTime}
                      </div>
                      <div>
                        <span className="block text-gray-600">Bus</span>
                        {trip.busId}
                      </div>
                      <div>
                        <span className="block text-gray-600">Students</span>
                        {trip.students}
                      </div>
                    </div>
                  </div>
                  <button className="glass text-gray-400 hover:text-white py-2 px-4 rounded-xl text-xs transition-all">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attendance summary */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">Attendance Summary (Last 5 Trips)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Students Picked Up', value: mockAttendanceRecords.filter(r => r.status === 'picked_up').length },
              { label: 'Total Students Dropped Off', value: mockAttendanceRecords.filter(r => r.status === 'dropped_off').length },
              { label: 'Attendance Rate', value: '98%' },
              { label: 'Attendance Issues', value: '0' },
            ].map(s => (
              <div key={s.label} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-black neon-text mb-1">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
