'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockAlerts } from '@/lib/mockData';
import AdminSOSAlert from '@/components/sos/AdminSOSAlert';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
];

const allAlerts = [
  ...mockAlerts,
  { id:'A005', type:'geofence', message:'BUS-02 exited designated route boundary near RS Puram', time:'25 min ago', severity:'warning' },
  { id:'A006', type:'speed',    message:'BUS-04 exceeded speed limit (72 km/h) on Avinashi Road', time:'32 min ago', severity:'warning' },
  { id:'A007', type:'idle',     message:'BUS-03 idle for 15+ minutes at Peelamedu Junction', time:'45 min ago', severity:'info' },
  { id:'A008', type:'accident', message:'Sudden stop detected on BUS-01 — checking driver status', time:'1h ago', severity:'critical' },
];

const severityConfig: Record<string,{bg:string,color:string,icon:string}> = {
  critical: { bg:'glass-red',  color:'text-red-400',    icon:'🚨' },
  warning:  { bg:'glass-gold', color:'text-[#FFD700]',  icon:'⚠️' },
  info:     { bg:'glass',      color:'text-[#00C853]',  icon:'ℹ️' },
};

export default function AlertsPage() {
  const [filter, setFilter] = useState('all');
  const [alerts, setAlerts] = useState(allAlerts);

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);
  const counts = {
    critical: alerts.filter(a=>a.severity==='critical').length,
    warning:  alerts.filter(a=>a.severity==='warning').length,
    info:     alerts.filter(a=>a.severity==='info').length,
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <AdminSOSAlert />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Emergency Alerts 🚨</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time safety and operational alerts</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { l:'Critical', v:counts.critical, c:'red' },
            { l:'Warnings', v:counts.warning, c:'gold' },
            { l:'Info', v:counts.info, c:'green' },
          ].map(s => (
            <div key={s.l} className={`${s.c==='red'?'glass-red':s.c==='gold'?'glass-gold':'glass-green'} rounded-2xl p-4 text-center`}>
              <div className={`text-3xl font-black ${s.c==='red'?'text-red-400':s.c==='gold'?'gold-text':'neon-text'}`}>{s.v}</div>
              <div className="text-xs text-gray-400">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all','critical','warning','info'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${filter===f?'bg-[#00C853] text-black':'glass text-gray-400 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Alert list */}
        <div className="space-y-3">
          {filtered.map(a => {
            const c = severityConfig[a.severity];
            return (
              <div key={a.id} className={`${c.bg} rounded-2xl p-5 hover-card`}>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold uppercase ${c.color}`}>{a.severity}</span>
                      <span className="text-xs text-gray-500 glass px-2 py-0.5 rounded-full capitalize">{a.type}</span>
                    </div>
                    <p className="text-white text-sm">{a.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{a.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="glass text-gray-400 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all">Resolve</button>
                    <button className="glass text-gray-400 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all">Details</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
