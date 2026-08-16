'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { studentTravelHistoryService } from '@/features/fleet-monitoring';
import { mockStudents, mockRoutes } from '@/lib/mockData';
import { StudentTrip } from '@/features/fleet-monitoring/types/index';

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

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-[#00C853]';
      case 'late': return 'text-[#FFD700]';
      case 'absent': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getAttendanceBadge = (status: string) => {
    switch (status) {
      case 'present': return 'bg-[#00C853]/20 text-[#00C853]';
      case 'late': return 'bg-[#FFD700]/20 text-[#FFD700]';
      case 'absent': return 'bg-red-400/20 text-red-400';
      default: return 'bg-gray-400/20 text-gray-400';
    }
  };

  return (
    <DashboardLayout role="student" navItems={navItems} userName={student?.name || 'Student'}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Travel History 🗺️</h1>
          <p className="text-gray-400 text-sm mt-1">View your past trips and travel records</p>
        </div>

        {/* Travel Stats */}
        {travelStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-green rounded-2xl p-5 hover-card">
              <div className="text-3xl mb-2">🗺️</div>
              <div className="text-2xl font-black neon-text">{travelStats.totalTrips}</div>
              <div className="text-xs text-gray-400">Total Trips</div>
            </div>
            <div className="glass-green rounded-2xl p-5 hover-card">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-black text-[#00C853]">{travelStats.attendanceRate.toFixed(1)}%</div>
              <div className="text-xs text-gray-400">Attendance Rate</div>
            </div>
            <div className="glass-gold rounded-2xl p-5 hover-card">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-black gold-text">{travelStats.onTimeRate.toFixed(1)}%</div>
              <div className="text-xs text-gray-400">On-Time Rate</div>
            </div>
            <div className="glass-green rounded-2xl p-5 hover-card">
              <div className="text-3xl mb-2">📏</div>
              <div className="text-2xl font-black neon-text">{travelStats.totalDistance.toFixed(0)} km</div>
              <div className="text-xs text-gray-400">Total Distance</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-400 mb-1 block">Route</label>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Routes</option>
              {Object.values(mockRoutes).map(route => (
                <option key={route.id} value={route.id}>{route.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-gray-400 mb-1 block">Date</label>
            <input
              type="date"
              value={selectedDate === 'all' ? '' : selectedDate}
              onChange={(e) => setSelectedDate(e.target.value || 'all')}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
        </div>

        {/* Recent Trips */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Recent Trips</h3>
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <div 
                key={trip.id} 
                className="flex items-center justify-between bg-white/5 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setSelectedTrip(trip)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getAttendanceBadge(trip.attendanceStatus)}`}>
                      {trip.attendanceStatus.toUpperCase()}
                    </span>
                    <span className="font-semibold">{trip.routeName}</span>
                    <span className="text-gray-400 text-sm">{trip.date}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>🚌 {trip.busNumber}</span>
                    <span>👨‍✈️ {trip.driverName}</span>
                    <span>📍 {trip.pickupPoint}</span>
                    {trip.delayMinutes && (
                      <span className="text-[#FFD700]">⏱️ +{trip.delayMinutes} min</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {new Date(trip.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs text-gray-400">{trip.tripDuration.toFixed(0)} min</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Travel History */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Complete Travel History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Route</th>
                  <th className="pb-3">Bus</th>
                  <th className="pb-3">Driver</th>
                  <th className="pb-3">Pickup</th>
                  <th className="pb-3">Drop-off</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((trip) => (
                  <tr 
                    key={trip.id} 
                    className="border-b border-white/5 cursor-pointer hover:bg-white/5"
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <td className="py-3">{trip.date}</td>
                    <td className="py-3">{trip.routeName}</td>
                    <td className="py-3">{trip.busNumber}</td>
                    <td className="py-3">{trip.driverName}</td>
                    <td className="py-3">{trip.pickupPoint}</td>
                    <td className="py-3">{trip.dropoffPoint}</td>
                    <td className="py-3">{new Date(trip.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-3">{trip.tripDuration.toFixed(0)} min</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getAttendanceBadge(trip.attendanceStatus)}`}>
                        {trip.attendanceStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trip Detail Modal */}
        {selectedTrip && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Trip Details</h3>
                <button 
                  onClick={() => setSelectedTrip(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Date</div>
                    <div className="font-semibold">{selectedTrip.date}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Status</div>
                    <div className={`font-semibold ${getAttendanceColor(selectedTrip.attendanceStatus)}`}>
                      {selectedTrip.attendanceStatus.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Route</div>
                  <div className="font-semibold">{selectedTrip.routeName}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Bus</div>
                    <div className="font-semibold">{selectedTrip.busNumber}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Driver</div>
                    <div className="font-semibold">{selectedTrip.driverName}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Pickup Point</div>
                    <div className="font-semibold">{selectedTrip.pickupPoint}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Drop-off Point</div>
                    <div className="font-semibold">{selectedTrip.dropoffPoint}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Pickup Time</div>
                    <div className="font-semibold">{new Date(selectedTrip.pickupTime).toLocaleTimeString()}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Drop-off Time</div>
                    <div className="font-semibold">{new Date(selectedTrip.dropoffTime).toLocaleTimeString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Duration</div>
                    <div className="font-semibold">{selectedTrip.tripDuration.toFixed(0)} minutes</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400">Distance</div>
                    <div className="font-semibold">{selectedTrip.distance} km</div>
                  </div>
                </div>

                {selectedTrip.delayMinutes && (
                  <div className="bg-[#FFD700]/10 rounded-lg p-3">
                    <div className="text-xs text-[#FFD700] mb-1">Delay Information</div>
                    <div className="font-semibold text-[#FFD700]">+{selectedTrip.delayMinutes} minutes</div>
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
