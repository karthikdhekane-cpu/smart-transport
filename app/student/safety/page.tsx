'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SOSButton from '@/components/sos/SOSButton';

const navItems = [
  { href:'/student',               icon:'🏠', label:'Dashboard' },
  { href:'/student/tracking',      icon:'🗺️', label:'Live Tracking' },
  { href:'/student/eta',           icon:'⏱️', label:'ETA & Alarm' },
  { href:'/student/notifications', icon:'🔔', label:'Notifications' },
  { href:'/student/lost-found',    icon:'📦', label:'Lost & Found' },
  { href:'/student/safety',        icon:'🛡️', label:'Safety' },
];

export default function SafetyPage() {
  const [womenSafetyMode, setWomenSafetyMode] = useState(false);

  const safetyEvents = [
    { time:'08:12 AM', event:'Bus departed safely from Gandhipuram', type:'ok' },
    { time:'08:24 AM', event:'Speed within safe limits (42 km/h)', type:'ok' },
    { time:'08:31 AM', event:'Reached Town Hall stop on time', type:'ok' },
    { time:'08:45 AM', event:'Minor delay detected — traffic signal', type:'warn' },
  ];

  return (
    <DashboardLayout role="student" navItems={navItems} userName="Priya Sharma">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-[#0f172a]">Safety Center 🛡️</h1>
          <p className="text-[#64748b] text-sm mt-1">Your safety is our top priority</p>
        </div>

        {/* Women Safety Mode banner */}
        {womenSafetyMode && (
          <div className="rounded-2xl p-4 flex items-center gap-4 border border-red-300/50 notif-slide"
            style={{background:'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(239,68,68,0.04))'}}>
            <div className="relative">
              <span className="text-2xl">👩‍🦺</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping" />
            </div>
            <div className="flex-1">
              <p className="text-red-600 font-bold text-sm">Women Safety Mode Active</p>
              <p className="text-red-500/70 text-xs mt-0.5">Enhanced monitoring enabled — unusual stops will trigger auto-alert</p>
            </div>
            <button onClick={() => setWomenSafetyMode(false)} className="text-red-400 hover:text-red-600 text-lg transition-colors">×</button>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* SOS Emergency */}
          <div className={`glass rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-500 ${
            womenSafetyMode ? 'border-red-300/40 shadow-[0_0_30px_rgba(239,68,68,0.12)]' : ''
          }`}>
            <h3 className="font-bold text-[#0f172a] mb-1 text-lg">
              {womenSafetyMode ? '👩‍🦺 Women Safety SOS' : '🚨 Emergency SOS'}
            </h3>
            <p className="text-[#64748b] text-sm mb-6">
              {womenSafetyMode
                ? 'Hold 3 seconds — triggers emergency alert with location sharing'
                : 'Hold for 3 seconds to trigger emergency alert'}
            </p>

            <SOSButton
              userName="Priya Sharma"
              busId="BUS-01"
              location="Town Hall Stop, Coimbatore"
              size="lg"
            />

            <p className="text-[#94a3b8] text-xs mt-5">
              Notifies: Driver · Admin · Emergency contacts · Police
            </p>

            {womenSafetyMode && (
              <div className="mt-4 w-full rounded-xl p-3 text-xs text-red-600 font-semibold text-center border border-red-200"
                style={{background:'rgba(239,68,68,0.06)'}}>
                🔴 Enhanced protection active — location shared with emergency contacts
              </div>
            )}
          </div>

          {/* Women Safety Mode */}
          <div className={`rounded-2xl p-8 transition-all duration-500 ${
            womenSafetyMode
              ? 'border border-red-300/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
              : 'glass'
          }`} style={womenSafetyMode ? {background:'linear-gradient(135deg,rgba(239,68,68,0.06),rgba(239,68,68,0.02))'} : {}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0f172a] text-lg">👩‍🦺 Women Safety Mode</h3>
              <button
                onClick={() => setWomenSafetyMode(!womenSafetyMode)}
                className={`w-14 h-7 rounded-full transition-all duration-300 relative ${womenSafetyMode ? 'bg-red-500' : 'bg-[#e2e8f0]'}`}
              >
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${womenSafetyMode ? 'left-8' : 'left-1'}`}/>
              </button>
            </div>
            <p className="text-[#64748b] text-sm mb-5">Enhanced safety monitoring for night travel and unusual stops.</p>
            <div className="space-y-2.5">
              {[
                'Unusual night stop detection',
                'Auto-alert if bus stops >10 min',
                'Emergency contact notification',
                'Live location sharing',
                'Panic button activation',
              ].map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    womenSafetyMode ? 'bg-red-500 text-white' : 'bg-[#e2e8f0] text-[#94a3b8]'
                  }`}>
                    {womenSafetyMode ? '✓' : '○'}
                  </span>
                  <span className={womenSafetyMode ? 'text-[#0f172a] font-medium' : 'text-[#64748b]'}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Safety timeline */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-[#0f172a] mb-4">📋 Today's Safety Log</h3>
          <div className="space-y-3">
            {safetyEvents.map((e, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-[#e2e8f0] bg-white/60">
                <span className={`text-lg ${e.type==='ok' ? 'text-[#059669]' : 'text-[#d97706]'}`}>
                  {e.type==='ok' ? '✅' : '⚠️'}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-[#0f172a] font-medium">{e.event}</p>
                  <p className="text-xs text-[#94a3b8]">{e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency contacts */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-[#0f172a] mb-4">📞 Emergency Contacts</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name:'College Security', phone:'0422-123456', icon:'🏫' },
              { name:'Transport Office', phone:'0422-234567', icon:'🚌' },
              { name:'Police Control',   phone:'100',         icon:'👮' },
            ].map(c => (
              <div key={c.name} className="rounded-xl p-4 flex items-center gap-3 border border-[#e2e8f0] bg-white/60 hover-card">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-[#0f172a]">{c.name}</div>
                  <div className="text-xs text-[#059669] font-medium">{c.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
