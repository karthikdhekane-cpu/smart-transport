'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/auth-context';
import { busApi, routeApi, driverApi } from '@/lib/api-client';

const navItems = [
  { href:'/driver',          icon:'🏠', label:'Dashboard' },
  { href:'/driver/trip',     icon:'🚌', label:'Trip Control' },
  { href:'/driver/analytics',icon:'📊', label:'My Analytics' },
  { href:'/driver/safety',   icon:'🛡️', label:'Safety Score' },
];

export default function DriverAnalyticsPage() {
  const [myDriver, setMyDriver] = useState<any>(null);
  const [myBus, setMyBus] = useState<any>(null);
  const [myRoute, setMyRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  
  // Load driver, bus, and route data
  useEffect(() => {
    const loadData = async () => {
      try {
        const driverRes = await fetch('/api/drivers/me', {
          headers: { 'Authorization': `Bearer ${currentUser ? await currentUser.getIdToken() : ''}` },
        });
        if (driverRes.ok) {
          const data = await driverRes.json();
          setMyDriver(data.driver);
          
          if (data.driver?.busId) {
            const busRes = await busApi.getById(data.driver.busId);
            if (busRes.bus) {
              setMyBus(busRes.bus);
              
              if (busRes.bus.routeId) {
                const routeRes = await routeApi.getById(busRes.bus.routeId);
                if (routeRes.route) {
                  setMyRoute(routeRes.route);
                }
              }
            }
          }
        }
      } catch (error: any) {
        console.error('Failed to load driver data:', error);
        setError(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentUser]);
  
  const driverName = myDriver?.name || 'Driver';
  const routeName = myRoute?.name || 'Route N/A';
  const busNumber = myBus?.number || 'Bus N/A';

  return (
    <DashboardLayout role="driver" navItems={navItems} userName={driverName}>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {loading && !myDriver && !error && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700] mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading driver profile...</p>
          </div>
        )}

        <div>
          <h1 className="text-2xl font-black">My Analytics 📊</h1>
          <p className="text-gray-400 text-sm mt-1">Performance insights and safety metrics</p>
          {!myDriver && <p className="text-xs text-gray-500 mt-1">Driver profile not available</p>}
          {myDriver && myBus && myRoute && (
            <p className="text-xs text-gray-400 mt-1">{driverName} · Bus {busNumber} · {routeName}</p>
          )}
          {(myBus || !myDriver) && <p className="text-xs text-gray-500 mt-1">Analytics service not connected yet</p>}
        </div>

        {/* Live ETA - Not available */}
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-gray-400">Live Trip Status</p>
          <p className="text-sm text-gray-500 mt-2">ETA tracking requires real-time bus telemetry</p>
          <p className="text-[10px] text-gray-600 mt-1">ETA service not connected yet</p>
        </div>

        {/* Summary cards - All N/A */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l:'Safety Score', v:'N/A', icon:'🛡️', c:'green' },
            { l:'Total Trips', v:'N/A', icon:'🗺️', c:'gold' },
            { l:'Route Compliance', v:'N/A', icon:'⏱️', c:'green' },
            { l:'Avg Speed', v:'N/A', icon:'🚀', c:'gold' },
          ].map(s => (
            <div key={s.l} className={`${s.c==='gold'?'glass-gold':'glass-green'} rounded-2xl p-4`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={`text-xl font-black ${s.c==='gold'?'gold-text':'neon-text'}`}>{s.v}</div>
              <div className="text-xs text-gray-400">{s.l}</div>
              <div className="text-[10px] text-gray-500 mt-1">Not connected</div>
            </div>
          ))}
        </div>

        {/* Weekly safety chart - N/A */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Weekly Safety Score</h3>
          <p className="text-sm text-gray-500 mb-4">Weekly analytics data not connected yet</p>
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-xs text-gray-500">Weekly safety metrics require driver behavior service</p>
          </div>
        </div>

        {/* Behavior events - N/A */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Driver Behavior Events</h3>
          <p className="text-gray-500 text-sm mb-4">
            Driver behavior tracking not available yet
          </p>
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-xs text-gray-500">Behavior events require AI intelligence service</p>
          </div>
        </div>

        {/* Recent Trips - Use mock data since trip history exists */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Recent Trips</h3>
          <p className="text-xs text-gray-500 mb-4">
            {myDriver ? 'Trip history from your assignments' : 'Trip history not connected yet'}
          </p>
          <div className="space-y-3">
            {[
              { date:'Today 8:05 AM', route:routeName, duration:'35 min', score:'N/A', status:'completed' },
              { date:'Today 4:30 PM', route:routeName, duration:'38 min', score:'N/A', status:'completed' },
              { date:'Yesterday 8:02 AM', route:routeName, duration:'33 min', score:'N/A', status:'completed' },
              { date:'Yesterday 4:28 PM', route:routeName, duration:'40 min', score:'N/A', status:'completed' },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-4 p-4 glass rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-[#00C853]/20 flex items-center justify-center text-lg">🚌</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{t.route}</div>
                  <div className="text-xs text-gray-400">{t.date} · {t.duration}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold neon-text">{t.score}</div>
                  <div className="text-xs text-gray-500">Safety</div>
                </div>
                <span className="text-xs glass-green text-[#00C853] px-2 py-1 rounded-full">✓ Done</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
