'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { busApi, driverApi, routeApi } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

const navItems = [
  { href:'/driver',          icon:'🏠', label:'Dashboard' },
  { href:'/driver/trip',     icon:'🚌', label:'Trip Control' },
  { href:'/driver/analytics',icon:'📊', label:'My Analytics' },
  { href:'/driver/safety',   icon:'🛡️', label:'Safety Score' },
];

export default function DriverSafetyPage() {
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
  
  const driverName = myBus ? (myBus.number || 'Bus ' + (myBus.id || '')) : 'Driver';
  const routeName = myRoute?.name || 'Route N/A';

  return (
    <DashboardLayout role="driver" navItems={navItems} userName={driverName}>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {loading && !myBus && !error && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700] mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading driver profile...</p>
          </div>
        )}

        <div>
          <h1 className="text-2xl font-black">Safety Score 🛡️</h1>
          <p className="text-gray-400 text-sm mt-1">Your driving safety performance</p>
          {!myBus && <p className="text-xs text-gray-500 mt-1">Bus assignment not available</p>}
          {myBus && <p className="text-xs text-gray-400 mt-1">{driverName} · {routeName}</p>}
        </div>

        {/* Safety Score (N/A - no real backend) */}
        <div className="glass rounded-3xl p-8 text-center">
          <p className="text-gray-400 mb-2">Overall Safety Score</p>
          <div className="text-8xl font-black text-[#FFD700]">N/A</div>
          <p className="text-sm text-gray-500 mt-2">Safety tracking not connected yet</p>
        </div>

        {/* Real-time safety alerts - Not available */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6 text-center">
            <h3 className="font-bold mb-4">Route Deviation Detection</h3>
            <p className="text-xs text-gray-500">Route deviation tracking not available</p>
            <p className="text-[10px] text-gray-600 mt-1">Requires driver state service</p>
          </div>

          <div className="glass rounded-2xl p-6 text-center">
            <h3 className="font-bold mb-4">Unauthorized Stop Detection</h3>
            <p className="text-xs text-gray-500">Unauthorized stop tracking not available</p>
            <p className="text-[10px] text-gray-600 mt-1">Requires driver state service</p>
          </div>

          <div className="glass rounded-2xl p-6 text-center">
            <h3 className="font-bold mb-4">Geofencing Alerts</h3>
            <p className="text-xs text-gray-500">Geofencing alerts not available</p>
            <p className="text-[10px] text-gray-600 mt-1">Requires geofencing service</p>
          </div>
        </div>

        {/* Score Breakdown (N/A) */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Score Breakdown</h3>
          <p className="text-sm text-gray-500 mb-4">Driver behavior metrics not connected yet</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label:'Speed Compliance', value:'N/A' },
              { label:'Route Compliance', value:'N/A' },
              { label:'Stop Compliance', value:'N/A' },
              { label:'Alert Frequency', value:'N/A' },
              { label:'Braking Score', value:'N/A' },
              { label:'Turn Score', value:'N/A' },
            ].map(m => (
              <div key={m.label} className="glass rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-1">{m.label}</div>
                <div className="text-xl font-bold text-gray-500">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">🛡️ Safety Badges</h3>
          <p className="text-xs text-gray-500 mb-4">Badges awarded for safe driving behavior</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon:'🥇', label:'Safe Driver', earned:false },
              { icon:'⚡', label:'Speed Master', earned:false },
              { icon:'🛑', label:'Smooth Braker', earned:false },
              { icon:'🌟', label:'Zero Incidents', earned:false },
              { icon:'🏆', label:'Top Driver', earned:false },
              { icon:'💎', label:'Diamond Class', earned:false },
            ].map(b => (
              <div key={b.label} className={`glass rounded-xl p-3 text-center ${b.earned ? '' : 'opacity-40'}`}>
                <div className="text-2xl mb-1">{b.icon}</div>
                <div className="text-[10px] text-gray-300">{b.label}</div>
                {b.earned && <div className="text-[8px] text-[#00C853]">Earned</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
