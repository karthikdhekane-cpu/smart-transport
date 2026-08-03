'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const navItems = [
  { href:'/student',          icon:'🏠', label:'Dashboard' },
  { href:'/student/tracking', icon:'🗺️', label:'Live Tracking' },
  { href:'/student/eta',      icon:'⏱️', label:'ETA & Alarm' },
  { href:'/student/notifications', icon:'🔔', label:'Notifications' },
  { href:'/student/lost-found',    icon:'📦', label:'Lost & Found' },
  { href:'/student/safety',        icon:'🛡️', label:'Safety' },
];

const allNotifs = [
  { id:1, type:'arrival', title:'Bus Arriving Soon', msg:'BUS-01 is 5 minutes away from Town Hall', time:'2 min ago', read:false, channel:'push' },
  { id:2, type:'delay',   title:'Delay Alert', msg:'BUS-01 delayed by 8 minutes due to traffic near Peelamedu', time:'15 min ago', read:false, channel:'push' },
  { id:3, type:'route',   title:'Route Change', msg:'BUS-01 taking alternate route via Avinashi Road today', time:'1h ago', read:true, channel:'sms' },
  { id:4, type:'sos',     title:'Emergency Alert', msg:'SOS triggered on BUS-04 — authorities notified', time:'2h ago', read:true, channel:'whatsapp' },
  { id:5, type:'info',    title:'Schedule Update', msg:'Tomorrow\'s morning trip starts 10 minutes early', time:'3h ago', read:true, channel:'push' },
  { id:6, type:'arrival', title:'Bus Departed', msg:'BUS-01 has departed from Gandhipuram Bus Stand', time:'4h ago', read:true, channel:'push' },
];

const typeConfig: Record<string,{icon:string,color:string,bg:string}> = {
  arrival: { icon:'🚌', color:'text-[#00C853]', bg:'glass-green' },
  delay:   { icon:'⚠️', color:'text-[#FFD700]', bg:'glass-gold' },
  route:   { icon:'🗺️', color:'text-blue-400',  bg:'bg-blue-500/10 border border-blue-500/20' },
  sos:     { icon:'🚨', color:'text-red-400',   bg:'glass-red' },
  info:    { icon:'ℹ️', color:'text-gray-300',  bg:'glass' },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(allNotifs);
  const [filter, setFilter] = useState('all');

  const markAllRead = () => setNotifs(n => n.map(x => ({...x, read:true})));
  const filtered = filter === 'all' ? notifs : filter === 'unread' ? notifs.filter(n=>!n.read) : notifs.filter(n=>n.type===filter);
  const unreadCount = notifs.filter(n=>!n.read).length;

  return (
    <DashboardLayout role="student" navItems={navItems} userName="Priya Sharma">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Notifications 🔔</h1>
            <p className="text-gray-400 text-sm mt-1">{unreadCount} unread notifications</p>
          </div>
          <button onClick={markAllRead} className="glass text-sm text-gray-400 hover:text-white px-4 py-2 rounded-xl transition-all">
            Mark all read
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {['all','unread','arrival','delay','sos','info'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${filter===f ? 'bg-[#00C853] text-black' : 'glass text-gray-400 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="space-y-3">
          {filtered.map(n => {
            const c = typeConfig[n.type] || typeConfig.info;
            return (
              <div key={n.id} className={`${c.bg} rounded-2xl p-4 flex items-start gap-4 ${!n.read ? 'notif-slide' : 'opacity-70'} hover-card`}>
                <span className="text-2xl mt-0.5">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-bold ${c.color}`}>{n.title}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-[#00C853]"/>}
                  </div>
                  <p className="text-gray-300 text-sm">{n.msg}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500">{n.time}</span>
                    <span className="text-xs glass px-2 py-0.5 rounded-full text-gray-400">
                      {n.channel === 'push' ? '📱 Push' : n.channel === 'sms' ? '💬 SMS' : '💚 WhatsApp'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setNotifs(prev => prev.map(x => x.id===n.id ? {...x,read:true} : x))}
                  className="text-gray-600 hover:text-white transition-colors text-lg"
                >
                  ×
                </button>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">🔕</div>
              <p>No notifications in this category</p>
            </div>
          )}
        </div>

        {/* Notification settings */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">⚙️ Notification Preferences</h3>
          <div className="space-y-3">
            {[
              { label:'Bus arriving (5 min)', enabled:true },
              { label:'Delay alerts', enabled:true },
              { label:'Route changes', enabled:true },
              { label:'Emergency alerts', enabled:true },
              { label:'WhatsApp fallback', enabled:false },
              { label:'SMS fallback', enabled:false },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-gray-300">{s.label}</span>
                <div className={`w-10 h-5 rounded-full transition-all cursor-pointer ${s.enabled ? 'bg-[#00C853]' : 'bg-white/10'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white m-0.5 transition-all ${s.enabled ? 'translate-x-5' : 'translate-x-0'}`}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
