'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { activityLogService } from '@/features/activity-log';
import { mockDrivers } from '@/lib/mockData';

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
];

const severityConfig: Record<string,{bg:string,color:string,icon:string}> = {
  info:     { bg:'bg-blue-500/10',  color:'text-blue-400',    icon:'ℹ️' },
  warning:  { bg:'bg-amber-500/10', color:'text-amber-400',   icon:'⚠️' },
  error:    { bg:'bg-red-500/10',   color:'text-red-400',     icon:'❌' },
  success:  { bg:'bg-green-500/10', color:'text-green-400',   icon:'✅' },
  critical: { bg:'bg-red-600/20',   color:'text-red-500',     icon:'🚨' },
};

const actionLabels: Record<string, string> = {
  user_created: 'User Created',
  user_updated: 'User Updated',
  user_deleted: 'User Deleted',
  bus_created: 'Bus Created',
  bus_updated: 'Bus Updated',
  bus_deleted: 'Bus Deleted',
  driver_assigned: 'Driver Assigned',
  bus_assigned: 'Bus Assigned',
  route_changed: 'Route Changed',
  maintenance_updated: 'Maintenance Updated',
  broadcast_sent: 'Broadcast Sent',
  sos_triggered: 'SOS Triggered',
  sos_acknowledged: 'SOS Acknowledged',
  sos_resolved: 'SOS Resolved',
  attendance_changed: 'Attendance Changed',
  configuration_changed: 'Configuration Changed',
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState(activityLogService.getAllLogs());
  const [severityFilter, setSeverityFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [actorFilter, setActorFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(activityLogService.getAllLogs());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const summary = activityLogService.getSummary();

  const filteredLogs = logs.filter(log => {
    if (severityFilter !== 'all' && log.severity !== severityFilter) return false;
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (actorFilter !== 'all' && log.actorRole !== actorFilter) return false;
    if (searchTerm && !log.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (startDate && log.timestamp < new Date(startDate).getTime()) return false;
    if (endDate && log.timestamp > new Date(endDate).getTime() + 86400000) return false;
    return true;
  });

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear logs older than 30 days?')) {
      activityLogService.clearLogs(30);
      setLogs(activityLogService.getAllLogs());
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black">Activity Logs 📋</h1>
            <p className="text-gray-400 text-sm mt-1">Track all system actions and changes</p>
          </div>
          <button
            onClick={handleClearLogs}
            className="glass text-gray-400 hover:text-red-400 px-4 py-2.5 rounded-xl text-sm transition-all"
          >
            Clear Old Logs
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { l:'Total', v:summary.total, c:'blue' },
            { l:'Today', v:summary.todayCount, c:'green' },
            { l:'Critical', v:summary.bySeverity.critical, c:'red' },
            { l:'Warnings', v:summary.bySeverity.warning, c:'amber' },
            { l:'Info', v:summary.bySeverity.info, c:'blue' },
          ].map(s => (
            <div key={s.l} className={`${s.c==='blue'?'glass-blue':s.c==='green'?'glass-green':s.c==='red'?'glass-red':'glass-amber'} rounded-2xl p-4 text-center`}>
              <div className={`text-3xl font-black ${s.c==='blue'?'text-blue-400':s.c==='green'?'neon-text':s.c==='red'?'text-red-400':'text-amber-400'}`}>
                {s.v}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-4">
            <h3 className="font-bold text-white mb-3">By Action Type</h3>
            <div className="space-y-2">
              {Object.entries(summary.byAction)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([action, count]) => (
                  <div key={action} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{actionLabels[action] || action}</span>
                    <span className="text-white font-semibold">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <h3 className="font-bold text-white mb-3">By Actor Role</h3>
            <div className="space-y-2">
              {Object.entries(summary.byActorRole).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-gray-400">{role}</span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <h3 className="font-bold text-white mb-3">This Week: {summary.thisWeekCount} events</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Critical</span>
                <span className="text-red-400 font-semibold">{summary.bySeverity.critical}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Warnings</span>
                <span className="text-amber-400 font-semibold">{summary.bySeverity.warning}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Success</span>
                <span className="text-green-400 font-semibold">{summary.bySeverity.success}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Info</span>
                <span className="text-blue-400 font-semibold">{summary.bySeverity.info}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full glass rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="glass rounded-xl px-3 py-2 text-white focus:outline-none text-sm"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
              </select>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="glass rounded-xl px-3 py-2 text-white focus:outline-none text-sm"
              >
                <option value="all">All Actions</option>
                {Object.entries(actionLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <select
                value={actorFilter}
                onChange={(e) => setActorFilter(e.target.value)}
                className="glass rounded-xl px-3 py-2 text-white focus:outline-none text-sm"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="driver">Driver</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="glass rounded-xl px-3 py-2 text-white focus:outline-none text-sm"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="glass rounded-xl px-3 py-2 text-white focus:outline-none text-sm"
              placeholder="End Date"
            />
            <button
              onClick={() => {
                setSeverityFilter('all');
                setActionFilter('all');
                setActorFilter('all');
                setSearchTerm('');
                setStartDate('');
                setEndDate('');
              }}
              className="glass text-gray-400 hover:text-white px-4 py-2 rounded-xl text-sm transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Logs List */}
        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-gray-400">
              No activity logs found matching your criteria
            </div>
          ) : (
            filteredLogs.map(log => {
              const severity = severityConfig[log.severity];
              return (
                <div key={log.id} className={`glass rounded-2xl p-5 hover-card ${log.severity === 'critical' || log.severity === 'error' ? 'border-l-4' : ''}`} style={log.severity === 'critical' || log.severity === 'error' ? { borderLeftColor: severity.color.replace('text-', 'bg-').replace('400', '500') } : {}}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${severity.bg} flex items-center justify-center text-lg`}>
                      {severity.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${severity.bg} ${severity.color}`}>
                            {log.severity}
                          </span>
                          <span className="text-xs text-gray-400">{formatTimestamp(log.timestamp)}</span>
                        </div>
                        <div className="text-xs text-gray-500">ID: {log.id.substring(0, 8)}</div>
                      </div>
                      <div className="text-white font-medium mb-2">{severity.icon} {actionLabels[log.action] || log.action}</div>
                      <div className="text-gray-300 text-sm mb-3">{log.description}</div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <span className="text-white">👤 {log.actorName}</span>
                          <span className="text-gray-600">({log.actorRole})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-white">📦 {log.entity}</span>
                          {log.entityId && <span className="text-gray-600">#{log.entityId.substring(0, 8)}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
