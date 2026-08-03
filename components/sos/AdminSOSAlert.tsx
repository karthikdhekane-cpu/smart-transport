'use client';
import { useState, useEffect } from 'react';

interface EmergencyEvent {
  id: string;
  student: string;
  busId: string;
  location: string;
  time: string;
  status: 'active' | 'responding' | 'resolved';
  elapsed: number;
}

const MOCK_EVENTS: EmergencyEvent[] = [
  {
    id: 'SOS-001',
    student: 'Priya Sharma',
    busId: 'BUS-01',
    location: 'Town Hall Stop, Coimbatore',
    time: new Date().toLocaleTimeString(),
    status: 'active',
    elapsed: 0,
  },
];

export default function AdminSOSAlert() {
  const [events, setEvents] = useState<EmergencyEvent[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { setEvents(MOCK_EVENTS); setShowPanel(true); }, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    const t = setInterval(() => {
      setEvents(prev => prev.map(e =>
        e.status === 'resolved' ? e : {
          ...e,
          elapsed: e.elapsed + 1,
          status: e.elapsed > 30 ? 'responding' : e.status,
        }
      ));
    }, 1000);
    return () => clearInterval(t);
  }, [events.length]);

  const handleResolve = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'resolved' } : e));
    // Auto-dismiss resolved card after 4s
    setTimeout(() => setDismissed(p => [...p, id]), 4000);
  };

  const active = events.filter(e => !dismissed.includes(e.id));
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  if (!showPanel || active.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 space-y-3">
      {active.map(ev => (
        <div
          key={ev.id}
          className="rounded-2xl overflow-hidden transition-all duration-500"
          style={{
            background: ev.status === 'resolved'
              ? 'linear-gradient(135deg,#021a0e,#030f07)'
              : 'linear-gradient(135deg,#1a0505,#0f0000)',
            border: ev.status === 'resolved'
              ? '1px solid rgba(5,150,105,0.4)'
              : '1px solid rgba(239,68,68,0.4)',
            boxShadow: ev.status === 'resolved'
              ? '0 8px 40px rgba(5,150,105,0.25)'
              : '0 8px 40px rgba(239,68,68,0.35)',
            animation: 'adminSOSSlide 0.4s cubic-bezier(0.22,1,0.36,1) both',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b"
            style={{
              background: ev.status === 'resolved'
                ? 'rgba(5,150,105,0.15)'
                : 'rgba(239,68,68,0.15)',
              borderColor: ev.status === 'resolved'
                ? 'rgba(5,150,105,0.25)'
                : 'rgba(239,68,68,0.25)',
            }}
          >
            <div className="relative flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black ${
                ev.status === 'resolved' ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {ev.status === 'resolved' ? '✓' : 'SOS'}
              </div>
              {ev.status !== 'resolved' && (
                <div className="absolute inset-0 rounded-full bg-red-500/40 animate-ping" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-bold">
                {ev.status === 'resolved' ? 'Emergency Resolved' : 'Emergency Alert'}
              </div>
              <div className="text-[10px]" style={{color: ev.status === 'resolved' ? 'rgba(134,239,172,0.6)' : 'rgba(252,165,165,0.6)'}}>
                {ev.id} · {ev.time}
              </div>
            </div>
            {ev.status !== 'resolved' && (
              <div className="text-red-300 text-xs font-mono font-bold bg-red-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
                {fmt(ev.elapsed)}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="px-4 py-3 space-y-1.5">
            {[
              { label: 'Student',  value: ev.student },
              { label: 'Bus',      value: ev.busId },
              { label: 'Location', value: ev.location },
            ].map(i => (
              <div key={i.label} className="flex items-center gap-2 text-xs">
                <span className="text-white/35 w-14 flex-shrink-0">{i.label}</span>
                <span className="text-white font-semibold truncate">{i.value}</span>
              </div>
            ))}
          </div>

          {/* Status pill */}
          <div className="px-4 pb-3">
            <div className={`rounded-lg px-3 py-2 text-xs font-semibold text-center ${
              ev.status === 'resolved'
                ? 'bg-green-500/15 text-green-300 border border-green-500/25'
                : ev.status === 'responding'
                ? 'bg-blue-500/15 text-blue-300 border border-blue-500/25'
                : 'bg-red-500/15 text-red-300 border border-red-500/25'
            }`}>
              {ev.status === 'resolved'
                ? '✅ Emergency resolved — All contacts notified'
                : ev.status === 'responding'
                ? '🚑 Response team dispatched'
                : '🚨 Awaiting response…'}
            </div>
          </div>

          {/* Actions */}
          {ev.status !== 'resolved' && (
            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => setEvents(prev => prev.map(e => e.id === ev.id ? {...e, status:'responding'} : e))}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-all"
              >
                Respond
              </button>
              <button
                onClick={() => handleResolve(ev.id)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold border text-white/70 hover:text-white transition-all"
                style={{background:'rgba(255,255,255,0.06)', borderColor:'rgba(255,255,255,0.12)'}}
              >
                Mark Resolved
              </button>
            </div>
          )}
        </div>
      ))}

      <style>{`
        @keyframes adminSOSSlide {
          from { opacity: 0; transform: translateX(100%) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
