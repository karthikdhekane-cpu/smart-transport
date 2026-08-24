'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
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
  { href:'/admin/activity-logs', icon:'📋', label:'Activity Logs' },
  { href:'/admin/broadcast', icon:'📢', label:'Broadcast' },
];

const broadcastTypes = [
  { id: 'emergency', label: 'Emergency', icon: '🚨', color: 'border-red-500' },
  { id: 'safety', label: 'Safety Alert', icon: '🛡️', color: 'border-blue-500' },
  { id: 'weather', label: 'Weather', icon: '☁️', color: 'border-purple-500' },
  { id: 'traffic', label: 'Traffic Update', icon: '路况', color: 'border-orange-500' },
  { id: 'general', label: 'General', icon: 'ℹ️', color: 'border-green-500' },
];

export default function BroadcastPage() {
  const [broadcastType, setBroadcastType] = useState('emergency');
  const [selectedBusIds, setSelectedBusIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [broadcastHistory, setBroadcastHistory] = useState<Array<{id: string, type: string, message: string, recipients: string[], sentAt: number, status: string}>>([
    { id: 'b1', type: 'emergency', message: 'SOS triggered on BUS-04', recipients: ['BUS-01', 'BUS-04'], sentAt: Date.now() - 3600000, status: 'delivered' },
    { id: 'b2', type: 'safety', message: 'Drive safely during rainy weather', recipients: ['BUS-01', 'BUS-02', 'BUS-03'], sentAt: Date.now() - 7200000, status: 'delivered' },
  ]);

  const toggleBusSelection = (busId: string) => {
    if (selectedBusIds.includes(busId)) {
      setSelectedBusIds(prev => prev.filter(id => id !== busId));
    } else {
      setSelectedBusIds(prev => [...prev, busId]);
    }
  };

  const toggleAllBuses = () => {
    if (selectedBusIds.length === mockBuses.length) {
      setSelectedBusIds([]);
    } else {
      setSelectedBusIds(mockBuses.map(b => b.id));
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || selectedBusIds.length === 0) return;

    const newBroadcast = {
      id: `b${Date.now()}`,
      type: broadcastType,
      message: message.trim(),
      recipients: selectedBusIds,
      sentAt: Date.now(),
      status: 'sent' as const,
    };

    setBroadcastHistory(prev => [newBroadcast, ...prev]);
    setShowPreview(false);
    setMessage('');
    setSelectedBusIds([]);
  };

  const getTypeConfig = (type: string) => broadcastTypes.find(t => t.id === type) || broadcastTypes[0];

  const activeBuses = mockBuses.filter(b => b.status === 'moving');

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Emergency Broadcast 📢</h1>
          <p className="text-gray-400 text-sm mt-1">Send messages to buses and drivers</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Broadcast Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Create Broadcast</h3>
              
              <form onSubmit={handleBroadcast} className="space-y-4">
                {/* Type Selection */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Broadcast Type</label>
                  <div className="grid grid-cols-5 gap-2">
                    {broadcastTypes.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setBroadcastType(t.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                          broadcastType === t.id
                            ? `${t.color} bg-white/5 border-2`
                            : 'glass hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="text-2xl mb-1">{t.icon}</span>
                        <span className="text-[10px] text-white">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bus Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-400">Recipients</label>
                    <button
                      type="button"
                      onClick={toggleAllBuses}
                      className="text-xs text-[#00C853] hover:text-green-400 transition-colors"
                    >
                      {selectedBusIds.length === mockBuses.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                    {mockBuses.map(bus => {
                      const isSelected = selectedBusIds.includes(bus.id);
                      return (
                        <button
                          key={bus.id}
                          type="button"
                          onClick={() => toggleBusSelection(bus.id)}
                          className={`flex items-center gap-2 p-2 rounded-xl text-sm transition-all ${
                            isSelected ? 'bg-[#00C853]/20 border-2 border-[#00C853]' : 'glass hover:bg-white/5'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${bus.status === 'moving' ? 'bg-green-500' : 'bg-gray-500'}`} />
                          <span className="text-white truncate">{bus.number}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {selectedBusIds.length} of {mockBuses.length} buses selected
                  </div>
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your broadcast message..."
                    rows={4}
                    className="w-full glass rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-sm resize-none"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{message.length} characters</span>
                  </div>
                </div>

                {/* Preview & Send */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    disabled={!message.trim() || selectedBusIds.length === 0}
                    className="flex-1 glass text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all"
                  >
                    Preview
                  </button>
                  <button
                    type="submit"
                    disabled={!message.trim() || selectedBusIds.length === 0}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      !message.trim() || selectedBusIds.length === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : 'bg-[#00C853] hover:bg-[#009624] text-black'
                    }`}
                  >
                    Send Broadcast
                  </button>
                </div>
              </form>
            </div>

            {/* Broadcast History */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Broadcast History</h3>
              <div className="space-y-3">
                {broadcastHistory.map(b => {
                  const typeConfig = getTypeConfig(b.type);
                  return (
                    <div key={b.id} className="glass rounded-xl p-4 hover-card">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${typeConfig.color}/10 flex items-center justify-center text-lg`}>
                            {typeConfig.icon}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{b.message}</div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                              <span>{b.recipients.length} buses</span>
                              <span>•</span>
                              <span>{new Date(b.sentAt).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500">{b.id}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {b.recipients.slice(0, 5).map(busId => {
                          const bus = mockBuses.find(b => b.id === busId);
                          return (
                            <span key={busId} className="text-[10px] bg-white/5 px-2 py-1 rounded-full">
                              {bus?.number || busId}
                            </span>
                          );
                        })}
                        {b.recipients.length > 5 && (
                          <span className="text-[10px] text-gray-500 px-2 py-1">
                            +{b.recipients.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {broadcastHistory.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-4">No broadcasts sent yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Active Buses Info */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4">
              <h3 className="font-bold text-white mb-4">Active Buses</h3>
              <div className="text-3xl font-black neon-text mb-1">{activeBuses.length}</div>
              <div className="text-sm text-gray-400">buses currently moving</div>
              <div className="mt-4 p-3 glass rounded-xl">
                <div className="text-xs text-gray-400 mb-2">Broadcast Coverage</div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00C853] rounded-full" 
                    style={{width: `${(activeBuses.length / mockBuses.length) * 100}%`}}
                  />
                </div>
                <div className="text-xs text-right text-gray-500 mt-1">
                  {(activeBuses.length / mockBuses.length * 100).toFixed(0)}% coverage
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <h3 className="font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full glass text-gray-400 hover:text-[#00C853] py-2 rounded-xl text-sm transition-all">
                  Send Safety Alert to All
                </button>
                <button className="w-full glass text-gray-400 hover:text-red-400 py-2 rounded-xl text-sm transition-all">
                  Emergency Broadcast
                </button>
                <button className="w-full glass text-gray-400 hover:text-blue-400 py-2 rounded-xl text-sm transition-all">
                  Weather Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-bold text-white text-lg mb-4">Broadcast Preview</h3>
            <div className="mb-4 p-4 glass rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                {getTypeConfig(broadcastType).icon}
                <span className="text-xs text-gray-400 uppercase">{getTypeConfig(broadcastType).label}</span>
              </div>
              <div className="text-white text-lg mb-2">📢 {message}</div>
              <div className="text-xs text-gray-500">
                To: {selectedBusIds.length} bus(es) • {selectedBusIds.join(', ')}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 glass text-gray-400 hover:text-white py-2 rounded-xl text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleBroadcast}
                className="flex-1 bg-[#00C853] hover:bg-[#009624] text-black py-2 rounded-xl text-sm font-semibold transition-all"
              >
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
