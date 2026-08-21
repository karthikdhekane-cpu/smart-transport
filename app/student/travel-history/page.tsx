'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { studentTravelHistoryService } from '@/features/fleet-monitoring';
import { mockStudents, mockRoutes } from '@/lib/mockData';
import { StudentTrip } from '@/features/fleet-monitoring/types/index';
import PageHeader from '@/components/ui/PageHeader';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import Table from '@/components/ui/Table';

const navItems = [
  { href:'/student',          icon:'🏠', label:'Dashboard' },
  { href:'/student/tracking', icon:'📍', label:'Live Tracking' },
  { href:'/student/eta',      icon:'⏱️', label:'ETA' },
  { href:'/student/travel-history', icon:'🗺️', label:'Travel History' },
  { href:'/student/safety',   icon:'🛡️', label:'Safety' },
  { href:'/student/notifications', icon:'🔔', label:'Notifications' },
];

export default function StudentTravelHistoryPage() {
  const [selectedStudent, setSelectedStudent] = useState<string>('S001');
  const [travelHistory, setTravelHistory] = useState<StudentTrip[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedTrip, setSelectedTrip] = useState<StudentTrip | null>(null);
  const [travelStats, setTravelStats] = useState<any>(null);

  useEffect(() => {
    // Load travel history
    const history = studentTravelHistoryService.getStudentTravelHistory(selectedStudent);
    setTravelHistory(history);
    
    // Load travel stats
    const stats = studentTravelHistoryService.getStudentTravelStats(selectedStudent);
    setTravelStats(stats);
  }, [selectedStudent]);

  // Filter travel history
  const filteredHistory = travelHistory.filter(trip => {
    if (selectedRoute !== 'all' && trip.routeId !== selectedRoute) return false;
    if (selectedDate !== 'all' && trip.date !== selectedDate) return false;
    return true;
  });

  const recentTrips = studentTravelHistoryService.getRecentTrips(selectedStudent, 5);
  const student = mockStudents.find(s => s.id === selectedStudent);

  const getAttendanceStatus = (status: string): 'healthy' | 'warning' | 'critical' => {
    switch (status) {
      case 'present': return 'healthy';
      case 'late': return 'warning';
      case 'absent': return 'critical';
      default: return 'healthy';
    }
  };

  return (
    <DashboardLayout role="student" navItems={navItems} userName={student?.name || 'Student'}>
      <div className="space-y-6">
        <PageHeader eyebrow="Travel records" title="Travel History" description="View your past trips and travel records with attendance and timing details." />

        {/* Travel Stats */}
        {travelStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Total Trips" value={travelStats.totalTrips} detail="All time" icon="🗺️" tone="green" />
            <MetricCard label="Attendance Rate" value={`${travelStats.attendanceRate.toFixed(1)}%`} detail="Present vs absent" icon="✅" tone="green" />
            <MetricCard label="On-Time Rate" value={`${travelStats.onTimeRate.toFixed(1)}%`} detail="Punctuality" icon="⏱️" tone="amber" />
            <MetricCard label="Total Distance" value={`${travelStats.totalDistance.toFixed(0)} km`} detail="Distance traveled" icon="📏" tone="green" />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-slate-500 mb-1 block">Route</label>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white"
            >
              <option value="all">All Routes</option>
              {Object.values(mockRoutes).map(route => (
                <option key={route.id} value={route.id}>{route.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-slate-500 mb-1 block">Date</label>
            <input
              type="date"
              value={selectedDate === 'all' ? '' : selectedDate}
              onChange={(e) => setSelectedDate(e.target.value || 'all')}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white"
            />
          </div>
        </div>

        {/* Recent Trips */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Trips</h3>
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <div 
                key={trip.id} 
                className="flex items-center justify-between border border-slate-100 rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setSelectedTrip(trip)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <StatusBadge status={getAttendanceStatus(trip.attendanceStatus)} size="sm">
                      {trip.attendanceStatus.toUpperCase()}
                    </StatusBadge>
                    <span className="font-medium text-slate-900">{trip.routeName}</span>
                    <span className="text-slate-500 text-sm">{trip.date}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>🚌 {trip.busNumber}</span>
                    <span>👨‍✈️ {trip.driverName}</span>
                    <span>📍 {trip.pickupPoint}</span>
                    {trip.delayMinutes && (
                      <span className="text-amber-600">⏱️ +{trip.delayMinutes} min</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">
                    {new Date(trip.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs text-slate-500">{trip.tripDuration.toFixed(0)} min</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Travel History */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Complete Travel History</h3>
          <Table
            columns={[
              { key: 'date', header: 'Date', render: (trip) => trip.date },
              { key: 'route', header: 'Route', render: (trip) => trip.routeName },
              { key: 'bus', header: 'Bus', render: (trip) => trip.busNumber },
              { key: 'driver', header: 'Driver', render: (trip) => trip.driverName },
              { key: 'pickup', header: 'Pickup', render: (trip) => trip.pickupPoint },
              { key: 'dropoff', header: 'Drop-off', render: (trip) => trip.dropoffPoint },
              { key: 'time', header: 'Time', render: (trip) => new Date(trip.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
              { key: 'duration', header: 'Duration', render: (trip) => `${trip.tripDuration.toFixed(0)} min` },
              { key: 'status', header: 'Status', render: (trip) => (
                <StatusBadge status={getAttendanceStatus(trip.attendanceStatus)} size="sm">
                  {trip.attendanceStatus.toUpperCase()}
                </StatusBadge>
              )},
            ]}
            data={filteredHistory}
          />
        </div>

        {/* Trip Detail Modal */}
        {selectedTrip && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900">Trip Details</h3>
                <button 
                  onClick={() => setSelectedTrip(null)}
                  className="text-slate-400 hover:text-slate-900 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-100 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Date</div>
                    <div className="font-medium text-slate-900">{selectedTrip.date}</div>
                  </div>
                  <div className="border border-slate-100 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Status</div>
                    <StatusBadge status={getAttendanceStatus(selectedTrip.attendanceStatus)} size="sm">
                      {selectedTrip.attendanceStatus.toUpperCase()}
                    </StatusBadge>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Route</div>
                  <div className="font-medium text-slate-900">{selectedTrip.routeName}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-100 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Bus</div>
                    <div className="font-medium text-slate-900">{selectedTrip.busNumber}</div>
                  </div>
                  <div className="border border-slate-100 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Driver</div>
                    <div className="font-medium text-slate-900">{selectedTrip.driverName}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-100 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Pickup Point</div>
                    <div className="font-medium text-slate-900">{selectedTrip.pickupPoint}</div>
                  </div>
                  <div className="border border-slate-100 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Drop-off Point</div>
                    <div className="font-medium text-slate-900">{selectedTrip.dropoffPoint}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-100 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Pickup Time</div>
                    <div className="font-medium text-slate-900">{new Date(selectedTrip.pickupTime).toLocaleTimeString()}</div>
                  </div>
                  <div className="border border-slate-100 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Drop-off Time</div>
                    <div className="font-medium text-slate-900">{new Date(selectedTrip.dropoffTime).toLocaleTimeString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-100 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Duration</div>
                    <div className="font-medium text-slate-900">{selectedTrip.tripDuration.toFixed(0)} minutes</div>
                  </div>
                  <div className="border border-slate-100 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Distance</div>
                    <div className="font-medium text-slate-900">{selectedTrip.distance} km</div>
                  </div>
                </div>

                {selectedTrip.delayMinutes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="text-xs text-amber-700 mb-1">Delay Information</div>
                    <div className="font-medium text-amber-700">+{selectedTrip.delayMinutes} minutes</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
