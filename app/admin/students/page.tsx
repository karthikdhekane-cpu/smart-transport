'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockStudents } from '@/lib/mockData';

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
  const filtered = mockStudents.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Student Management 🎓</h1>
            <p className="text-gray-400 text-sm mt-1">480 registered students</p>
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
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
