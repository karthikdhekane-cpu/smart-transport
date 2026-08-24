'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { maintenanceService } from '@/features/maintenance';
import { mockBuses } from '@/lib/mockData';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
  { href:'/admin/maintenance', icon:'🔧', label:'Maintenance' },
];

const statusConfig: Record<string,{bg:string,color:string,label:string}> = {
  scheduled:    { bg:'bg-blue-500/10',   color:'text-blue-400',   label:'Scheduled' },
  in_progress:  { bg:'bg-amber-500/10',  color:'text-amber-400',  label:'In Progress' },
  completed:    { bg:'bg-green-500/10',  color:'text-green-400',  label:'Completed' },
  overdue:      { bg:'bg-red-500/10',    color:'text-red-400',    label:'Overdue' },
};

const priorityConfig: Record<string,{bg:string,color:string}> = {
  low:    { bg:'bg-blue-500/10', color:'text-blue-400' },
  medium: { bg:'bg-amber-500/10', color:'text-amber-400' },
  high:   { bg:'bg-orange-500/10', color:'text-orange-400' },
  critical: { bg:'bg-red-500/10', color:'text-red-400' },
};

export default function MaintenancePage() {
  const [records, setRecords] = useState(maintenanceService.getAllMaintenance());
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setRecords(maintenanceService.getAllMaintenance());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const summary = maintenanceService.getSummary();
  
  const filteredRecords = records.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (typeFilter !== 'all' && r.maintenanceType !== typeFilter) return false;
    return true;
  });

  const handleStatusChange = (id: string, status: import('@/features/maintenance').MaintenanceStatus) => {
    const updated = maintenanceService.updateStatus(id, status);
    if (updated) {
      setRecords(maintenanceService.getAllMaintenance());
    }
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black">Maintenance Schedule 🔧</h1>
            <p className="text-gray-400 text-sm mt-1">Bus maintenance tracking and scheduling</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#00C853] hover:bg-[#009624] text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
          >
            + Schedule Maintenance
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { l:'Total', v:summary.total, c:'blue' },
            { l:'Scheduled', v:summary.scheduled, c:'blue' },
            { l:'In Progress', v:summary.inProgress, c:'amber' },
            { l:'Completed', v:summary.completed, c:'green' },
            { l:'Overdue', v:summary.overdue, c:'red' },
          ].map(s => (
            <div key={s.l} className={`${s.c==='blue'?'glass-blue':s.c==='amber'?'glass-amber':s.c==='green'?'glass-green':'glass-red'} rounded-2xl p-4 text-center`}>
              <div className={`text-3xl font-black ${s.c==='blue'?'text-blue-400':s.c==='amber'?'text-amber-400':s.c==='green'?'neon-text':'text-red-400'}`}>
                {s.v}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['all','scheduled','in_progress','completed','overdue'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                filter===f ? 'bg-[#00C853] text-black' : 'glass text-gray-400 hover:text-white'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
          <div className="h-6 w-px bg-gray-700 mx-2 my-auto" />
          {['all','routine','repair','inspection','emergency'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all capitalize ${
                typeFilter===t ? 'bg-[#00C853] text-black' : 'glass text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Maintenance Records */}
        <div className="space-y-3">
          {filteredRecords.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-gray-400">
              No maintenance records found
            </div>
          ) : (
            filteredRecords.map(record => (
              <div key={record.id} className="glass rounded-2xl p-5 hover-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#00C853]/20 flex items-center justify-center text-2xl">🔧</div>
                    <div>
                      <div className="font-bold text-white">{record.busNumber}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{record.maintenanceType} maintenance</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${priorityConfig[record.priority].bg} ${priorityConfig[record.priority].color}`}>
                      {record.priority.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="glass rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-400">Scheduled</div>
                    <div className="text-sm font-bold text-white">{record.scheduledDate}</div>
                  </div>
                  <div className="glass rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-400">Status</div>
                    <div className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${statusConfig[record.status].bg} ${statusConfig[record.status].color}`}>
                      {statusConfig[record.status].label}
                    </div>
                  </div>
                  <div className="glass rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-400">Technician</div>
                    <div className="text-sm font-bold text-white">{record.technician || 'TBD'}</div>
                  </div>
                  <div className="glass rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-400">Cost</div>
                    <div className="text-sm font-bold neon-text">₹{record.cost?.toLocaleString() || '—'}</div>
                  </div>
                </div>

                {record.notes && (
                  <div className="mt-3 p-3 glass rounded-xl">
                    <div className="text-xs text-gray-400 mb-1">Notes</div>
                    <div className="text-sm text-gray-300">{record.notes}</div>
                  </div>
                )}

                <div className="mt-4 flex gap-2 flex-wrap">
                  {record.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusChange(record.id, 'completed')}
                      className="flex-1 bg-[#00C853] hover:bg-[#009624] text-black py-2 rounded-xl text-xs font-semibold transition-all"
                    >
                      Mark Complete
                    </button>
                  )}
                  <button className="flex-1 glass text-gray-400 hover:text-white py-2 rounded-xl text-xs font-semibold transition-all">
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upcoming Maintenance */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">Upcoming Maintenance</h3>
          <div className="space-y-3">
            {maintenanceService.getUpcomingMaintenance().slice(0, 3).map(record => (
              <div key={record.id} className="flex items-center gap-4 p-3 glass rounded-xl">
                <div className="text-2xl">🔧</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{record.busNumber}</div>
                  <div className="text-xs text-gray-400">{record.maintenanceType} • {record.scheduledDate}</div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${priorityConfig[record.priority].bg} ${priorityConfig[record.priority].color}`}>
                  {record.priority}
                </div>
              </div>
            ))}
            {maintenanceService.getUpcomingMaintenance().length === 0 && (
              <div className="text-center text-gray-400 text-sm py-4">No upcoming maintenance scheduled</div>
            )}
          </div>
        </div>
      </div>

      {/* Create Maintenance Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-bold text-white text-lg mb-4">Schedule Maintenance</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                
                maintenanceService.createMaintenance({
                  busId: formData.get('busId') as string,
                  busNumber: formData.get('busNumber') as string,
                  maintenanceType: formData.get('maintenanceType') as import('@/features/maintenance').MaintenanceType,
                  priority: formData.get('priority') as import('@/features/maintenance').Priority,
                  scheduledDate: formData.get('scheduledDate') as string,
                  status: 'scheduled',
                  notes: formData.get('notes') as string,
                  cost: formData.get('cost') ? parseInt(formData.get('cost') as string) : undefined,
                  technician: formData.get('technician') as string,
                  completedBy: undefined,
                });
                
                setShowCreateModal(false);
                setRecords(maintenanceService.getAllMaintenance());
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Bus Number</label>
                  <select
                    name="busId"
                    required
                    onChange={(e) => {
                      const bus = mockBuses.find(b => b.id === e.target.value);
                      if (bus && e.currentTarget.name === 'busId') {
                        const form = e.currentTarget.form as HTMLFormElement;
                        (form?.elements.namedItem('busNumber') as HTMLInputElement).value = bus.number;
                      }
                    }}
                    className="w-full glass rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm"
                  >
                    <option value="">Select Bus</option>
                    {mockBuses.map(b => (
                      <option key={b.id} value={b.id}>{b.number} ({b.id})</option>
                    ))}
                  </select>
                </div>
                <input
                  name="busNumber"
                  placeholder="Bus Number"
                  required
                  readOnly
                  className="w-full glass rounded-xl px-4 py-2.5 text-white/70 focus:outline-none text-sm"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Maintenance Type</label>
                    <select
                      name="maintenanceType"
                      required
                      className="w-full glass rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm"
                    >
                      <option value="">Select Type</option>
                      <option value="routine">Routine</option>
                      <option value="repair">Repair</option>
                      <option value="inspection">Inspection</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Priority</label>
                    <select
                      name="priority"
                      required
                      className="w-full glass rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm"
                    >
                      <option value="">Select Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    name="scheduledDate"
                    required
                    className="w-full glass rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Technician</label>
                  <input
                    type="text"
                    name="technician"
                    placeholder="Technician Name"
                    className="w-full glass rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    name="cost"
                    placeholder="Estimated Cost"
                    className="w-full glass rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Maintenance notes..."
                    className="w-full glass rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 glass text-gray-400 hover:text-white py-2 rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#00C853] hover:bg-[#009624] text-black py-2 rounded-xl text-sm font-semibold transition-all"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
