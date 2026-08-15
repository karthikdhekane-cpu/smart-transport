'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { geofenceService } from '@/features/geofencing/services/GeofenceService';
import { driverStateService } from '@/features/driver-state/services/DriverStateService';
import { useDriverBehaviour } from '@/features/ai-intelligence';

const navItems = [
  { href:'/driver',          icon:'🏠', label:'Dashboard' },
  { href:'/driver/trip',     icon:'🚌', label:'Trip Control' },
  { href:'/driver/analytics',icon:'📊', label:'My Analytics' },
  { href:'/driver/safety',   icon:'🛡️', label:'Safety Score' },
];

const mockRouteDeviation = {
  busId: 'BUS-03',
  deviationDistance: 250,
  isDeviated: true,
  lastReportedAt: Date.now() - 1800000,
};

const mockUnauthorizedStop = {
  busId: 'BUS-02',
  location: { lat: 11.0120, lng: 76.9500 },
  stopDuration: 45,
  detectedAt: Date.now() - 900000,
};

export default function DriverSafetyPage() {
  const { results, isLoading: behaviourLoading } = useDriverBehaviour('D001');
  const behaviour = results[0];
  const score = behaviour?.metrics.safetyScore ?? 94;
  const metrics = behaviour ? [
    { label:'Speed Compliance', value: behaviour.metrics.speedCompliance, icon:'🚀' },
    { label:'Route Compliance', value: behaviour.metrics.routeCompliance, icon:'🗺️' },
    { label:'Stop Compliance', value: behaviour.metrics.stopCompliance, icon:'🛑' },
    { label:'Alert Frequency', value: behaviour.metrics.alertFrequency, icon:'🚨' },
    { label:'Overall Rating', value: score, icon:'🛡️' },
  ] : [
    { label:'Speed Compliance', value:97, icon:'🚀' },
    { label:'Route Compliance', value:100, icon:'🗺️' },
    { label:'Stop Compliance', value:100, icon:'🛑' },
    { label:'Alert Frequency', value:92, icon:'🚨' },
    { label:'Overall Rating', value: score, icon:'🛡️' },
  ];
  const ratingLabel = behaviour?.metrics.overallRating.replace('_', ' ') ?? 'excellent';

  // Geofencing alerts
  const [geofenceAlerts, setGeofenceAlerts] = useState(geofenceService.getGeofenceAlerts());
  const [unreadAlerts, setUnreadAlerts] = useState(geofenceService.getUnreadGeofenceAlerts());

  useEffect(() => {
    const alerts = geofenceService.getGeofenceAlerts();
    setGeofenceAlerts(alerts);
    setUnreadAlerts(geofenceService.getUnreadGeofenceAlerts());
  }, []);

  // Route deviation state (driver's bus: BUS-01)
  const [deviation, setDeviation] = useState(driverStateService.getRouteDeviation('BUS-01'));

  // Unauthorized stop state (driver's bus: BUS-01)
  const [unauthorizedStop, setUnauthorizedStop] = useState(driverStateService.getUnauthorizedStop('BUS-01'));

  return (
    <DashboardLayout role="driver" navItems={navItems} userName="Rajesh Kumar">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Safety Score 🛡️</h1>
          <p className="text-gray-400 text-sm mt-1">Your driving safety performance</p>
        </div>

        {/* Big score */}
        <div className="glass-green rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 shimmer"/>
          <div className="relative z-10">
            <p className="text-gray-400 mb-2">Overall Safety Score</p>
            <div className="text-9xl font-black neon-text">{score}</div>
            <div className="text-2xl text-gray-300">/ 100</div>
            <div className="mt-4 inline-flex items-center gap-2 glass-green rounded-full px-4 py-2 text-sm">
              <span>🏆</span>
              <span className="text-[#00C853] font-semibold capitalize">{ratingLabel} Driver</span>
            </div>
            {behaviour?.reasons[0] && (
              <p className="text-xs text-gray-400 mt-3">{behaviour.reasons[0]}</p>
            )}
          </div>
        </div>

        {/* Real-time safety alerts */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Route Deviation */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Route Deviation Detection</h3>
            {deviation && deviation.isDeviated ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 glass-red rounded-xl">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="text-[#FF5722] font-bold">Route Deviation Detected</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Bus deviated {deviation.deviationDistance}m from route
                    </p>
                    <p className="text-xs text-gray-500">
                      Last reported: {new Date(deviation.lastReportedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    driverStateService.clearDeviation('BUS-01');
                    setDeviation(driverStateService.getRouteDeviation('BUS-01'));
                  }}
                  className="w-full border border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722] hover:text-white py-2 rounded-xl text-xs transition-all"
                >
                  Acknowledge
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-3xl mb-2 text-[#00C853]">✅</div>
                <p className="text-[#00C853] font-semibold">No route deviation</p>
                <p className="text-xs text-gray-500 mt-1">Bus is on scheduled route</p>
              </div>
            )}
          </div>

          {/* Unauthorized Stop */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Unauthorized Stop Detection</h3>
            {unauthorizedStop && !unauthorizedStop.resolvedAt ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 glass-red rounded-xl">
                  <span className="text-2xl">🛑</span>
                  <div>
                    <p className="text-[#FF5722] font-bold">Unauthorized Stop Detected</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Bus stopped for {unauthorizedStop.stopDuration}s at ({unauthorizedStop.location.lat.toFixed(4)}, {unauthorizedStop.location.lng.toFixed(4)})
                    </p>
                    <p className="text-xs text-gray-500">
                      Detected: {new Date(unauthorizedStop.detectedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    driverStateService.clearUnauthorizedStop('BUS-01');
                    setUnauthorizedStop(driverStateService.getUnauthorizedStop('BUS-01'));
                  }}
                  className="w-full border border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722] hover:text-white py-2 rounded-xl text-xs transition-all"
                >
                  Acknowledge
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-3xl mb-2 text-[#00C853]">✅</div>
                <p className="text-[#00C853] font-semibold">No unauthorized stops</p>
                <p className="text-xs text-gray-500 mt-1">All stops are authorized</p>
              </div>
            )}
          </div>

          {/* Geofencing Alerts */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Geofencing Alerts</h3>
              <span className="text-xs bg-[#FF5722]/20 text-[#FF5722] px-2 py-1 rounded-full">
                {unreadAlerts.length} Unread
              </span>
            </div>
            {geofenceAlerts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-2 text-[#00C853]">✅</div>
                <p className="text-[#00C853] font-semibold">No geofence alerts</p>
              </div>
            ) : (
              <div className="space-y-2">
                {geofenceAlerts.slice(0, 3).map(alert => (
                  <div key={alert.id} className={`p-3 rounded-xl text-sm ${alert.read ? 'glass' : 'glass-red'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{alert.alertType === 'geofence_entry' ? '🚪' : '🚪'}</span>
                      <p className="font-semibold text-white">{alert.geofenceName}</p>
                      <span className="text-xs text-gray-500 ml-auto">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-gray-400">{alert.busId}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Metric breakdown */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Score Breakdown</h3>
          {behaviourLoading && <p className="text-xs text-gray-500 mb-3">Computing from live service data…</p>}
          {behaviour?.dataSources && (
            <p className="text-[10px] text-gray-500 mb-3">
              Braking/turn metrics unavailable (no IMU sensor). Speed: {behaviour.dataSources.speed}, deviations: {behaviour.dataSources.deviations}.
            </p>
          )}
          <div className="space-y-4">
            {metrics.map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <span>{m.icon}</span>
                    <span className="text-gray-300">{m.label}</span>
                  </div>
                  <span className="text-sm font-bold neon-text">{m.value}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00C853] to-[#5efc82] transition-all duration-1000"
                    style={{width:`${m.value}%`}}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">🏅 Safety Badges</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon:'🥇', label:'Safe Driver', earned:true },
              { icon:'⚡', label:'Speed Master', earned:true },
              { icon:'🛑', label:'Smooth Braker', earned:true },
              { icon:'🌟', label:'Zero Incidents', earned:false },
              { icon:'🏆', label:'Top Driver', earned:false },
              { icon:'💎', label:'Diamond Class', earned:false },
            ].map(b => (
              <div key={b.label} className={`glass rounded-xl p-4 text-center ${b.earned ? '' : 'opacity-30'}`}>
                <div className="text-3xl mb-2">{b.icon}</div>
                <div className="text-xs text-gray-300">{b.label}</div>
                {b.earned && <div className="text-[10px] text-[#00C853] mt-1">Earned</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
