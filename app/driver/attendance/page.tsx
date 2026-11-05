'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/auth-context';
import { busApi, tripApi, studentApi } from '@/lib/api-client';
import { useAttendance } from '@/features/attendance/hooks/useAttendance';
import { AttendanceRecord } from '@/features/attendance/types';

const navItems = [
  { href:'/driver',          icon:'🏠', label:'Dashboard' },
  { href:'/driver/trip',     icon:'🚌', label:'Trip Control' },
  { href:'/driver/analytics',icon:'📊', label:'My Analytics' },
  { href:'/driver/safety',   icon:'🛡️', label:'Safety Score' },
  { href:'/driver/trip-history', icon:'📅', label:'Trip History' },
  { href:'/driver/attendance', icon:'📋', label:'Attendance' },
];

export default function AttendancePage() {
  const { records, recordsByTrip, createRecord, refresh, isLoading } = useAttendance();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'picked_up' | 'dropped_off'>('all');
  const [myBus, setMyBus] = useState<any>(null);
  const [myTrip, setMyTrip] = useState<any>(null);
  const [driverName, setDriverName] = useState('Driver');
  const [error, setError] = useState<string | null>(null);
  const [manualScanResult, setManualScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);
  const { currentUser } = useAuth();
  
  // Load driver info and attendance
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get driver profile
        const driverRes = await fetch('/api/drivers/me', {
          headers: { 'Authorization': `Bearer ${currentUser ? await currentUser.getIdToken() : ''}` },
        });
        if (driverRes.ok) {
          const data = await driverRes.json();
          if (data.driver?.name) {
            setDriverName(data.driver.name);
          }
          if (data.driver?.busId) {
            const busRes = await busApi.getById(data.driver.busId);
            if (busRes.bus) {
              setMyBus(busRes.bus);
            }
          }
        }
        
        // Get active trip
        if (currentUser?.uid) {
          const tripsRes = await fetch(`/api/trips?driverId=${currentUser.uid}`, {
            headers: { 'Authorization': `Bearer ${currentUser ? await currentUser.getIdToken() : ''}` },
          });
          
          if (tripsRes.ok) {
            const tripsData = await tripsRes.json();
            const activeTrip = tripsData.trips?.find((t: any) => t.status === 'active');
            if (activeTrip) {
              setMyTrip(activeTrip);
            }
          }
        }
        
        // Load students for this bus
        if (myBus?.id) {
          const studentsRes = await fetch(`/api/students`, {
            headers: { 'Authorization': `Bearer ${currentUser ? await currentUser.getIdToken() : ''}` },
          });
          if (studentsRes.ok) {
            const studentsData = await studentsRes.json();
            setAvailableStudents(studentsData.students?.filter((s: any) => s.busId === myBus.id) || []);
          }
        }
      } catch (err: any) {
        console.error('Failed to load attendance data:', err);
        setError(err.message || 'Failed to load attendance data');
      }
    };
    loadData();
  }, [currentUser]);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(search.toLowerCase()) ||
                          record.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleManualAttendance = async (studentId: string, status: 'picked_up' | 'dropped_off') => {
    if (!myTrip) {
      setManualScanResult({ success: false, message: 'No active trip found' });
      setTimeout(() => setManualScanResult(null), 3000);
      return;
    }
    
    try {
      const scanId = `MANUAL-${studentId}-${myTrip.id}-${Date.now()}`;
      const result = await createRecord({
        studentId,
        status,
        method: 'manual',
        scanId,
      });
      
      if (result.success) {
        setManualScanResult({ success: true, message: 'Attendance recorded successfully' });
        await refresh();
      } else {
        setManualScanResult({ success: false, message: result.error || 'Failed to record attendance' });
      }
    } catch (err: any) {
      setManualScanResult({ success: false, message: err.message || 'Failed to record attendance' });
    }
    
    setTimeout(() => setManualScanResult(null), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'picked_up': return 'bg-[#2196F3]/20 text-[#2196F3]';
      case 'dropped_off': return 'bg-[#00C853]/20 text-[#00C853]';
      default: return 'bg-white/10 text-gray-400';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'qr': return 'text-[#2196F3]';
      case 'rfid': return 'text-[#FFD700]';
      case 'manual': return 'text-[#FF5722]';
      default: return 'text-gray-400';
    }
  };

  return (
    <DashboardLayout role="driver" navItems={navItems} userName={driverName}>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {myBus && <p className="text-xs text-gray-500">{driverName} · Bus {myBus.number}</p>}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black">Attendance Records 📋</h1>
            <p className="text-gray-400 text-sm mt-1">Student attendance tracking</p>
            {myTrip ? (
              <p className="text-xs text-[#00C853] mt-1">Active trip: {myTrip.id} · {myTrip.status}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">No active trip - attendance recording unavailable</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              disabled
              className="bg-[#00C853]/20 hover:bg-[#00C853]/30 text-gray-400 font-bold px-4 py-2 rounded-xl text-sm transition-all cursor-not-allowed"
              title="QR scanning requires attendance backend"
            >
              📱 QR Scan
            </button>
            <button
              disabled
              className="bg-[#FFD700]/20 hover:bg-[#FFD700]/30 text-gray-400 font-bold px-4 py-2 rounded-xl text-sm transition-all cursor-not-allowed"
              title="RFID scanning requires attendance backend"
            >
              📡 RFID Scan
            </button>
          </div>
        </div>

        {/* Scan result message */}
        {manualScanResult && (
          <div className={`p-4 rounded-xl text-sm font-semibold ${manualScanResult.success ? 'glass-green text-[#00C853]' : 'glass-red text-[#FF5722]'}`}>
            {manualScanResult.message}
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
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700] mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading attendance records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-400">No attendance records found</p>
              {!myTrip && <p className="text-xs text-gray-500 mt-2">Start a trip to begin attendance tracking</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs text-gray-500 border-b border-white/10">
                  <tr>
                    <th className="py-3 px-2">Student</th>
                    <th className="py-3 px-2">Roll No</th>
                    <th className="py-3 px-2">Bus</th>
                    <th className="py-3 px-2">Trip</th>
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
                      <td className="py-3 px-2 text-gray-400">{record.tripId}</td>
                      <td className="py-3 px-2 text-gray-400">{record.stopName}</td>
                      <td className="py-3 px-2 text-gray-400">
                        {new Date(record.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.status)}`}>
                          {record.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs font-semibold ${getMethodColor(record.scannedBy)}`}>
                          {record.scannedBy.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Manual attendance test */}
        {myTrip && availableStudents.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Manual Attendance Test</h3>
            <p className="text-xs text-gray-500 mb-3">
              Create attendance records for real students in Firestore
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableStudents.map((student) => (
                <div key={student.id} className="glass rounded-xl p-3 hover:bg-white/10 transition-colors">
                  <div className="text-sm font-semibold text-white">{student.name} ({student.rollNo})</div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleManualAttendance(student.id, 'picked_up')}
                      className="flex-1 bg-[#00C853]/20 hover:bg-[#00C853]/30 text-[#00C853] font-bold px-3 py-2 rounded-lg text-xs transition-colors"
                    >
                      Pick Up
                    </button>
                    <button
                      onClick={() => handleManualAttendance(student.id, 'dropped_off')}
                      className="flex-1 bg-[#FF5722]/20 hover:bg-[#FF5722]/30 text-[#FF5722] font-bold px-3 py-2 rounded-lg text-xs transition-colors"
                    >
                      Drop Off
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
