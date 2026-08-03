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

const mockItems = [
  { id:1, item:'Blue Backpack', bus:'BUS-01', date:'May 12', status:'found', reporter:'Priya S', desc:'Blue Nike backpack with laptop inside' },
  { id:2, item:'Water Bottle', bus:'BUS-02', date:'May 11', status:'reported', reporter:'Arjun N', desc:'Red Hydro Flask, 32oz' },
  { id:3, item:'Umbrella', bus:'BUS-01', date:'May 10', status:'returned', reporter:'Kavya R', desc:'Black folding umbrella' },
];

const statusConfig: Record<string,{color:string,label:string}> = {
  reported: { color:'text-[#FFD700]', label:'Reported' },
  found:    { color:'text-[#00C853]', label:'Found' },
  returned: { color:'text-gray-400',  label:'Returned' },
};

export default function LostFoundPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ item:'', bus:'BUS-01', desc:'' });
  const [items, setItems] = useState(mockItems);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setItems(prev => [{
      id: prev.length+1,
      item: form.item,
      bus: form.bus,
      date: 'Today',
      status: 'reported',
      reporter: 'Priya S',
      desc: form.desc,
    }, ...prev]);
    setSubmitted(true);
    setShowForm(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <DashboardLayout role="student" navItems={navItems} userName="Priya Sharma">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Lost & Found 📦</h1>
            <p className="text-gray-400 text-sm mt-1">Report or track lost items on college buses</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#00C853] hover:bg-[#009624] text-black font-bold px-5 py-2.5 rounded-xl transition-all text-sm"
          >
            + Report Item
          </button>
        </div>

        {submitted && (
          <div className="glass-green rounded-xl p-4 flex items-center gap-3 notif-slide">
            <span className="text-2xl">✅</span>
            <p className="text-[#00C853] font-semibold">Item reported successfully! Admin and driver have been notified.</p>
          </div>
        )}

        {/* Report form */}
        {showForm && (
          <div className="glass rounded-2xl p-6 animate-slide-up">
            <h3 className="font-bold mb-4">Report Lost Item</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Item Name</label>
                <input
                  value={form.item}
                  onChange={e => setForm(p=>({...p,item:e.target.value}))}
                  placeholder="e.g. Blue Backpack"
                  className="w-full glass rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Bus</label>
                <select
                  value={form.bus}
                  onChange={e => setForm(p=>({...p,bus:e.target.value}))}
                  className="w-full glass rounded-xl px-4 py-3 text-white bg-transparent focus:outline-none text-sm"
                >
                  {['BUS-01','BUS-02','BUS-03','BUS-04'].map(b => <option key={b} value={b} className="bg-[#111]">{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Description</label>
                <textarea
                  value={form.desc}
                  onChange={e => setForm(p=>({...p,desc:e.target.value}))}
                  placeholder="Describe the item..."
                  rows={3}
                  className="w-full glass rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-[#00C853] text-black font-bold py-3 rounded-xl text-sm">Submit Report</button>
                <button type="button" onClick={() => setShowForm(false)} className="glass text-gray-400 px-6 py-3 rounded-xl text-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Items list */}
        <div className="space-y-3">
          {items.map(item => {
            const s = statusConfig[item.status];
            return (
              <div key={item.id} className="glass rounded-2xl p-5 hover-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-2xl">📦</div>
                    <div>
                      <h4 className="font-bold text-white">{item.item}</h4>
                      <p className="text-gray-400 text-sm mt-0.5">{item.desc}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>🚌 {item.bus}</span>
                        <span>📅 {item.date}</span>
                        <span>👤 {item.reporter}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full glass ${s.color}`}>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
