'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { busApi } from '@/lib/api-client';
import { driverApi } from '@/lib/api-client';
import { routeApi } from '@/lib/api-client';
import { tripApi } from '@/lib/api-client';
import AdminSOSAlert from '@/components/sos/AdminSOSAlert';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
  { href:'/admin/maintenance', icon:'🔧', label:'Maintenance' },
  { href:'/admin/activity-logs', icon:'📋', label:'Activity Logs' },
  { href:'/admin/broadcast', icon:'📢', label:'Broadcast' },
  { href:'/admin/occupancy', icon:'👥', label:'Occupancy' },
  { href:'/admin/trips',     icon:'📅', label:'Trips' },
];

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-500/20 text-blue-400',
  active: 'bg-amber-500/20 text-amber-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [form, setForm] = useState({
    busId: '',
    driverId: '',
    routeId: '',
    status: 'scheduled',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tripsRes, busesRes, driversRes, routesRes] = await Promise.all([
          tripApi.getAll(),
          busApi.getAll(),
          driverApi.getAll(),
          routeApi.getAll(),
        ]);
        setTrips(tripsRes.trips || []);
        setBuses(busesRes.buses || []);
        setDrivers(driversRes.drivers || []);
        setRoutes(routesRes.routes || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.userId === driverId);
    return driver?.name || driverId;
  };

  const getBusNumber = (busId: string) => {
    const bus = buses.find(b => b.id === busId);
    return bus?.number || busId;
  };

  const getRouteName = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    return route?.name || routeId;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.busId) newErrors.busId = 'Select a bus';
    if (!form.driverId) newErrors.driverId = 'Select a driver';
    if (!form.routeId) newErrors.routeId = 'Select a route';
    
    // Check if bus and driver are assigned to each other
    const bus = buses.find(b => b.id === form.busId);
    const driver = drivers.find(d => d.userId === form.driverId);
    if (bus && driver && bus.id !== driver.busId) {
      newErrors.driverId = `Driver is not assigned to bus ${getBusNumber(form.busId)}`;
    }

    // Check for active trip conflict
    const activeTrip = trips.find(t => t.busId === form.busId && t.status === 'active');
    if (activeTrip && form.status === 'active') {
      newErrors.status = 'Bus already has an active trip';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTrip = async () => {
    if (!validateForm()) return;

    try {
      const tripData: any = {
        busId: form.busId,
        driverId: form.driverId,
        routeId: form.routeId,
        status: form.status,
      };
      if (form.status === 'active') {
        tripData.startTime = Date.now();
      }
      const data = await tripApi.create(tripData);
      setTrips(prev => [...prev, data.trip]);
      setShowCreateModal(false);
      setForm({ busId: '', driverId: '', routeId: '', status: 'scheduled' });
      setErrors({});
    } catch (error: any) {
      console.error('Failed to create trip:', error);
      alert(error.message || 'Failed to create trip');
    }
  };

  const handleUpdateTrip = async (tripId: string, updates: any) => {
    try {
      const data = await tripApi.update(tripId, updates);
      setTrips(prev => prev.map(t => t.id === tripId ? data.trip : t));
      if (selectedTrip && selectedTrip.id === tripId) {
        setSelectedTrip(data.trip);
      }
    } catch (error: any) {
      console.error('Failed to update trip:', error);
      alert(error.message || 'Failed to update trip');
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await tripApi.delete(tripId);
      setTrips(prev => prev.filter(t => t.id !== tripId));
      if (selectedTrip && selectedTrip.id === tripId) {
        setSelectedTrip(null);
      }
    } catch (error: any) {
      console.error('Failed to delete trip:', error);
      alert(error.message || 'Failed to delete trip');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <AdminSOSAlert />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Trip Management 📅</h1>
            <p className="text-gray-400 text-sm mt-1">Manage scheduled trips and driver assignments</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#00C853] hover:bg-[#009624] text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
          >
            + Schedule Trip
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { l:'Scheduled', v:trips.filter(t => t.status === 'scheduled').length, c:'blue' },
            { l:'Active', v:trips.filter(t => t.status === 'active').length, c:'amber' },
            { l:'Completed', v:trips.filter(t => t.status === 'completed').length, c:'green' },
            { l:'Cancelled', v:trips.filter(t => t.status === 'cancelled').length, c:'red' },
          ].map(s => (
            <div key={s.l} className={`${s.c==='blue'?'glass-blue':s.c==='amber'?'glass-amber':s.c==='green'?'glass-green':'glass-red'} rounded-2xl p-4 text-center`}>
              <div className={`text-3xl font-black ${s.c==='blue'?'text-blue-400':s.c==='amber'?'text-amber-400':s.c==='green'?'neon-text':'text-red-400'}`}>
                {s.v}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Trips List */}
        <div className="glass rounded-2xl p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00C853] mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading trips...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📅</div>
              <p className="text-gray-400">No trips scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trips.map(trip => (
                <div key={trip.id} className={`glass rounded-xl p-4 hover-card ${selectedTrip?.id === trip.id ? 'border border-[#00C853]' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#00C853]/20 flex items-center justify-center text-2xl">
                        🚌
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-white">{getRouteName(trip.routeId)}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[trip.status] || 'bg-gray-500/20 text-gray-400'}`}>
                            {trip.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs text-gray-400">
                          <div>
                            <span className="block text-gray-600">Bus</span>
                            <span className="text-white font-medium">{getBusNumber(trip.busId)}</span>
                          </div>
                          <div>
                            <span className="block text-gray-600">Driver</span>
                            <span className="text-white font-medium">{getDriverName(trip.driverId)}</span>
                          </div>
                          <div>
                            <span className="block text-gray-600">Time</span>
                            <span className="text-white">{trip.startTime ? formatTime(trip.startTime) : 'Not started'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedTrip(trip)}
                        className="glass text-gray-400 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all"
                      >
                        Details
                      </button>
                      {trip.status !== 'completed' && trip.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateTrip(trip.id, { status: 'cancelled' })}
                          className="glass-red text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Trip Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg glass rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white">Schedule New Trip 🚌</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Bus Selection */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Bus</label>
                  <select
                    value={form.busId}
                    onChange={e => {
                      setForm(prev => ({ ...prev, busId: e.target.value }));
                      if (errors.busId) setErrors(prev => ({ ...prev, busId: '' }));
                    }}
                    className="w-full glass rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm"
                  >
                    <option value="">Select Bus</option>
                    {buses.map(bus => (
                      <option key={bus.id} value={bus.id}>{bus.number} ({bus.id})</option>
                    ))}
                  </select>
                  {errors.busId && <p className="text-red-400 text-xs mt-1">{errors.busId}</p>}
                </div>

                {/* Driver Selection */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Driver</label>
                  <select
                    value={form.driverId}
                    onChange={e => {
                      setForm(prev => ({ ...prev, driverId: e.target.value }));
                      if (errors.driverId) setErrors(prev => ({ ...prev, driverId: '' }));
                    }}
                    className="w-full glass rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm"
                  >
                    <option value="">Select Driver</option>
                    {drivers.map(driver => (
                      <option key={driver.userId} value={driver.userId}>{driver.name}</option>
                    ))}
                  </select>
                  {errors.driverId && <p className="text-red-400 text-xs mt-1">{errors.driverId}</p>}
                </div>

                {/* Route Selection */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Route</label>
                  <select
                    value={form.routeId}
                    onChange={e => {
                      setForm(prev => ({ ...prev, routeId: e.target.value }));
                      if (errors.routeId) setErrors(prev => ({ ...prev, routeId: '' }));
                    }}
                    className="w-full glass rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm"
                  >
                    <option value="">Select Route</option>
                    {routes.map(route => (
                      <option key={route.id} value={route.id}>{route.name}</option>
                    ))}
                  </select>
                  {errors.routeId && <p className="text-red-400 text-xs mt-1">{errors.routeId}</p>}
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Initial Status</label>
                  <select
                    value={form.status}
                    onChange={e => {
                      setForm(prev => ({ ...prev, status: e.target.value }));
                      if (errors.status) setErrors(prev => ({ ...prev, status: '' }));
                    }}
                    className="w-full glass rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active (Start Immediately)</option>
                  </select>
                  {errors.status && <p className="text-red-400 text-xs mt-1">{errors.status}</p>}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 glass text-gray-400 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTrip}
                  disabled={!form.busId || !form.driverId || !form.routeId}
                  className="flex-1 bg-[#00C853] hover:bg-[#009624] text-black px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Trip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trip Details Modal */}
        {selectedTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg glass rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white">Trip Details</h2>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-1">Bus</div>
                    <div className="text-white font-semibold">{getBusNumber(selectedTrip.busId)}</div>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-1">Driver</div>
                    <div className="text-white font-semibold">{getDriverName(selectedTrip.driverId)}</div>
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-1">Route</div>
                  <div className="text-white font-semibold">{getRouteName(selectedTrip.routeId)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-1">Start Time</div>
                    <div className="text-white font-semibold">{selectedTrip.startTime ? formatTime(selectedTrip.startTime) : 'N/A'}</div>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-1">End Time</div>
                    <div className="text-white font-semibold">{selectedTrip.endTime ? formatTime(selectedTrip.endTime) : 'N/A'}</div>
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-1">Status</div>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${statusColors[selectedTrip.status] || 'bg-gray-500/20 text-gray-400'}`}>
                    {selectedTrip.status}
                  </div>
                </div>
                {selectedTrip.studentCount !== undefined && (
                  <div className="glass rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-1">Students</div>
                    <div className="text-white font-semibold">{selectedTrip.studentCount}</div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="flex-1 glass text-gray-400 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                >
                  Close
                </button>
                {selectedTrip.status === 'active' && (
                  <button
                    onClick={() => {
                      handleUpdateTrip(selectedTrip.id, { status: 'completed' });
                      setSelectedTrip(null);
                    }}
                    className="flex-1 bg-[#00C853] hover:bg-[#009624] text-black px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                  >
                    Complete Trip
                  </button>
                )}
                {selectedTrip.status !== 'completed' && selectedTrip.status !== 'cancelled' && (
                  <button
                    onClick={() => {
                      handleDeleteTrip(selectedTrip.id);
                      setSelectedTrip(null);
                    }}
                    className="flex-1 glass-red text-red-400 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
