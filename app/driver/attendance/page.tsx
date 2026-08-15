'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAttendance } from '@/features/attendance/hooks/useAttendance';
import { mockAttendanceRecords } from '@/features/attendance/mock/data';

const navItems = [
  { href:'/driver',          icon:'🏠', label:'Dashboard' },
  { href:'/driver/trip',     icon:'🚌', label:'Trip Control' },
  { href:'/driver/analytics',icon:'📊', label:'My Analytics' },
  { href:'/driver/safety',   icon:'🛡️', label:'Safety Score' },
  { href:'/driver/trip-history', icon:'📅', label:'Trip History' },
  { href:'/driver/attendance', icon:'📋', label:'Attendance' },
];

export default function AttendancePage() {
  const { records, recordsByBus, scanQR, scanRFID } = useAttendance();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'picked_up' | 'dropped_off'>('all');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isRFIDModalOpen, setIsRFIDModalOpen] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(search.toLowerCase()) ||
                          record.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleQRScan = () => {
    // Demo QR data: ATTENDANCE:S001:stop-a1
    const demoQR = 'ATTENDANCE:S001:stop-a1';
    const result = scanQR(demoQR);
    setScanResult(result);
    setTimeout(() => setScanResult(null), 3000);
  };

  const handleRFIDScan = () => {
    // Demo RFID data: RFID:21CS002
    const demoRFID = 'RFID:21CS002';
    const result = scanRFID(demoRFID);
    setScanResult(result);
    setTimeout(() => setScanResult(null), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'picked_up': return 'bg-[#2196F3]/20 text-[#2196F3]';
      case 'dropped_off': return 'bg-[#00C853]/20 text-[#00C853]';
      default: return 'bg-white/10 text-gray-400';
    }
  };

  return (
    <DashboardLayout role="driver" navItems={navItems} userName="Rajesh Kumar">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black">Attendance Records 📋</h1>
            <p className="text-gray-400 text-sm mt-1">Student attendance tracking</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleQRScan}
              className="bg-[#00C853] hover:bg-[#009624] text-black font-bold px-4 py-2 rounded-xl text-sm transition-all"
            >
              📱 QR Scan (Demo)
            </button>
            <button
              onClick={handleRFIDScan}
              className="bg-[#FFD700] hover:bg-[#FFC107] text-black font-bold px-4 py-2 rounded-xl text-sm transition-all"
            >
              📡 RFID Scan (Simulated)
            </button>
          </div>
        </div>

        {/* Scan result message */}
        {scanResult && (
          <div className={`p-4 rounded-xl text-sm font-semibold ${scanResult.success ? 'glass-green text-[#00C853]' : 'glass-red text-[#FF5722]'}`}>
            {scanResult.message}
          </div>
        )}

        {/* Search and filter */}
        <div className="flex flex-wrap gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students..."
            className="flex-1 min-w-[200px] glass rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-sm"
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="glass rounded-xl px-4 py-3 text-white focus:outline-none text-sm"
          >
            <option value="all">All Status</option>
            <option value="picked_up">Picked Up</option>
            <option value="dropped_off">Dropped Off</option>
          </select>
        </div>

        {/* Attendance list */}
        <div className="glass rounded-2xl p-6">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-400">No attendance records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs text-gray-500 border-b border-white/10">
                  <tr>
                    <th className="py-3 px-2">Student</th>
                    <th className="py-3 px-2">Roll No</th>
                    <th className="py-3 px-2">Bus</th>
                    <th className="py-3 px-2">Stop</th>
                    <th className="py-3 px-2">Time</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Method</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-2">
                        <div className="font-semibold text-white">{record.studentName}</div>
                        <div className="text-xs text-gray-500">{record.studentId}</div>
                      </td>
                      <td className="py-3 px-2 text-gray-400">{record.rollNo}</td>
                      <td className="py-3 px-2 text-gray-400">{record.busId}</td>
                      <td className="py-3 px-2 text-gray-400">{record.stopName}</td>
                      <td className="py-3 px-2 text-gray-400">
                        {new Date(record.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.status)}`}>
                          {record.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-xs text-gray-500 uppercase">{record.scannedBy}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
