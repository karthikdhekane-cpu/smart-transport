'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockStudents } from '@/lib/mockData';
import { studentApi } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
];

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState(mockStudents);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await studentApi.getAll();
        if (response.students) {
          setStudents(response.students);
        }
      } catch (error) {
        console.error('Failed to load students:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadStudents();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Student Management 🎓</h1>
            <p className="text-gray-400 text-sm mt-1">
              {loading ? 'Loading students...' : `${students.length} registered students`}
            </p>
          </div>
          <button className="bg-[#00C853] hover:bg-[#009624] text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
            + Add Student
          </button>
        </div>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or roll number..."
          className="w-full glass rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-sm"
        />

        <div className="glass rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading students...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Student','Roll No','Bus','Stop','Phone','Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#00C853]/20 flex items-center justify-center text-sm font-bold text-[#00C853]">
                          {s.name.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{s.rollNo}</td>
                    <td className="px-4 py-3">
                      <span className="glass-green text-[#00C853] text-xs px-2 py-1 rounded-full">{s.busId}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{s.stop}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{s.phone}</td>
                    <td className="px-4 py-3">
                      <button className="glass text-gray-400 hover:text-white px-3 py-1 rounded-lg text-xs transition-all">Edit</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
