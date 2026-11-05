'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { tripApi } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

export const dynamic = 'force-dynamic';

const navItems = [
  { href:'/driver',          icon:'🏠', label:'Dashboard' },
  { href:'/driver/trip',     icon:'🚌', label:'Trip Control' },
  { href:'/driver/analytics',icon:'📊', label:'My Analytics' },
  { href:'/driver/safety',   icon:'🛡️', label:'Safety Score' },
  { href:'/driver/trip-history', icon:'📅', label:'Trip History' },
  { href:'/driver/attendance', icon:'📋', label:'Attendance' },
];

export default function TripHistoryPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [driver, setDriver] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get driver profile to get driver name
        const driverRes = await fetch('/api/drivers/me', {
          headers: {
            'Authorization': `Bearer ${currentUser?.uid ? await currentUser.getIdToken() : ''}`,
          },
        });
        if (driverRes.ok) {
          const data = await driverRes.json();
          setDriver(data.driver);
        }
        
        // Get trips for this driver
        const data = await tripApi.getAll(undefined, currentUser?.uid);
        setTrips(data.trips || []);
      } catch (error: any) {
        console.error('Failed to load trip history:', error);
        setError(error.message || 'Failed to load data');
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentUser]);

  const filteredTrips = trips.filter((trip: any) => {
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const driverName = driver?.name || (currentUser?.displayName || currentUser?.email || 'Driver').split('@')[0];

  return (
    <DashboardLayout role="driver" navItems={navItems} userName={driverName}>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00C853] mx-auto mb-4"></div>
              <p className="text-gray-400">Loading trips...</p>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📅</div>
              <p className="text-gray-400">No trips found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTrips.map((trip: any) => (
                <div key={trip.id} className="flex items-center gap-4 p-4 glass rounded-xl hover-card">
                  <div className="w-12 h-12 rounded-xl bg-[#00C853]/20 flex items-center justify-center text-2xl">
                    🚌
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-white">Trip Route</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(trip.status)}`}>
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs text-gray-400">
                      <div>
                        <span className="block text-gray-600">Date</span>
                        {formatDate(trip.createdAt)}
                      </div>
                      <div>
                        <span className="block text-gray-600">Time</span>
                        {trip.startTime ? formatTime(trip.startTime) : 'N/A'} - {trip.endTime ? formatTime(trip.endTime) : 'Ongoing'}
                      </div>
                      <div>
                        <span className="block text-gray-600">Bus</span>
                        {trip.busId}
                      </div>
                      <div>
                        <span className="block text-gray-600">Students</span>
                        {trip.studentCount ?? '—'}
                      </div>
                    </div>
                  </div>
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
              { label: 'Total Students Picked Up', value: trips.reduce((acc, t: any) => acc + (t.studentCount || 0), 0) },
              { label: 'Total Students Dropped Off', value: trips.filter((t: any) => t.status === 'completed').reduce((acc, t: any) => acc + (t.studentCount || 0), 0) },
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
