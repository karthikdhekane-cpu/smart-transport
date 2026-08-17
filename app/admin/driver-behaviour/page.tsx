'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { driverBehaviourScoreService } from '@/features/fleet-monitoring';
import { mockDrivers } from '@/lib/mockData';
import { DriverBehaviourScore, BehaviourEvent } from '@/features/fleet-monitoring/types/index';
import PageHeader from '@/components/ui/PageHeader';
import MetricCard from '@/components/ui/MetricCard';

const navItems = [
  { href:'/admin',           icon:'🏠', label:'Dashboard' },
  { href:'/admin/fleet',     icon:'🚌', label:'Fleet Monitor' },
  { href:'/admin/analytics', icon:'📊', label:'Analytics' },
  { href:'/admin/drivers',   icon:'👨‍✈️', label:'Drivers' },
  { href:'/admin/students',  icon:'🎓', label:'Students' },
  { href:'/admin/alerts',    icon:'🚨', label:'Alerts' },
  { href:'/admin/routes',    icon:'🗺️', label:'Routes' },
  { href:'/admin/driver-behaviour', icon:'🛡️', label:'Driver Behaviour' },
];

export default function DriverBehaviourPage() {
  const [selectedDriver, setSelectedDriver] = useState<string>('D001');
  const [behaviourScore, setBehaviourScore] = useState<DriverBehaviourScore | null>(null);
  const [driverRanking, setDriverRanking] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<BehaviourEvent[]>([]);

  useEffect(() => {
    // Load initial data
    const score = driverBehaviourScoreService.getBehaviourScore(selectedDriver);
    setBehaviourScore(score);
    
    const ranking = driverBehaviourScoreService.getDriverRanking();
    setDriverRanking(ranking);
    
    const events = driverBehaviourScoreService.getRecentBehaviourEvents(10);
    setRecentEvents(events);
  }, [selectedDriver]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#00C853]';
    if (score >= 75) return 'text-[#FFD700]';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'excellent': return 'bg-[#00C853]/20 text-[#00C853]';
      case 'good': return 'bg-[#FFD700]/20 text-[#FFD700]';
      case 'needs_improvement': return 'bg-orange-400/20 text-orange-400';
      case 'attention_required': return 'bg-red-400/20 text-red-400';
      default: return 'bg-gray-400/20 text-gray-400';
    }
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} userName="Admin">
      <div className="space-y-6">
        <PageHeader eyebrow="Driver performance" title="Driver Behaviour Score" description="Safety performance and behaviour analytics across the fleet." />

        {/* Driver Selection */}
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-gray-400 mb-1 block">Select Driver</label>
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
          >
            {mockDrivers.map(driver => (
              <option key={driver.id} value={driver.id}>{driver.name} - {driver.busId}</option>
            ))}
          </select>
        </div>

        {/* Driver Score Card */}
        {behaviourScore && (
          <div className="glass rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Score Display */}
              <div className="flex-1 text-center">
                <div className={`text-6xl font-black mb-2 ${getScoreColor(behaviourScore.overallScore)}`}>
                  {behaviourScore.overallScore}
                </div>
                <div className="text-sm text-gray-400 mb-2">Overall Score</div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(behaviourScore.category)}`}>
                  {behaviourScore.category.replace('_', ' ').toUpperCase()}
                </span>
                <div className="mt-4 text-xs text-gray-400">
                  Trend: {behaviourScore.trend === 'improving' ? '📈 Improving' : behaviourScore.trend === 'declining' ? '📉 Declining' : '➡️ Stable'}
                </div>
              </div>

              {/* Factor Breakdown */}
              <div className="flex-1 space-y-3">
                <h3 className="font-bold text-sm">Score Breakdown</h3>
                {Object.entries(behaviourScore.factors).map(([key, factor]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className={getScoreColor(factor.score)}>{factor.score}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          factor.score >= 90 ? 'bg-[#00C853]' :
                          factor.score >= 75 ? 'bg-[#FFD700]' :
                          factor.score >= 60 ? 'bg-orange-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                    {factor.events > 0 && (
                      <div className="text-xs text-red-400">{factor.events} events (-{factor.points} pts)</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Positive/Negative Behaviours */}
            <div className="grid lg:grid-cols-2 gap-4 mt-6">
              <div>
                <h4 className="font-bold text-sm mb-2 text-[#00C853]">✓ Positive Behaviours</h4>
                <div className="space-y-1">
                  {behaviourScore.positiveBehaviours.map((behaviour, index) => (
                    <div key={index} className="text-xs text-gray-300">• {behaviour}</div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2 text-red-400">✗ Areas for Improvement</h4>
                <div className="space-y-1">
                  {behaviourScore.negativeBehaviours.length > 0 ? (
                    behaviourScore.negativeBehaviours.map((behaviour, index) => (
                      <div key={index} className="text-xs text-gray-300">• {behaviour}</div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400">No recent issues</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Driver Ranking */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Driver Ranking</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="pb-3">Rank</th>
                  <th className="pb-3">Driver</th>
                  <th className="pb-3">Bus</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Category</th>
                </tr>
              </thead>
              <tbody>
                {driverRanking.map((driver, index) => (
                  <tr 
                    key={driver.driverId} 
                    className={`border-b border-white/5 ${driver.driverId === selectedDriver ? 'bg-white/5' : ''}`}
                  >
                    <td className="py-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-[#FFD700] text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-600 text-black' :
                        'bg-gray-700 text-white'
                      }`}>
                        {driver.rank}
                      </span>
                    </td>
                    <td className="py-3 font-semibold">{driver.driverName}</td>
                    <td className="py-3 text-gray-400">{mockDrivers.find(d => d.id === driver.driverId)?.busId}</td>
                    <td className="py-3">
                      <span className={`font-bold ${getScoreColor(driver.score)}`}>{driver.score}</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(
                        driver.score >= 90 ? 'excellent' :
                        driver.score >= 75 ? 'good' :
                        driver.score >= 60 ? 'needs_improvement' : 'attention_required'
                      )}`}>
                        {driver.score >= 90 ? 'Excellent' :
                         driver.score >= 75 ? 'Good' :
                         driver.score >= 60 ? 'Needs Improvement' : 'Attention Required'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Events */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Recent Behaviour Events</h3>
          {recentEvents.length > 0 ? (
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        event.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                        event.severity === 'medium' ? 'bg-[#FFD700]/20 text-[#FFD700]' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {event.type.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-semibold">{mockDrivers.find(d => d.id === event.driverId)?.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{event.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 font-bold">-{event.pointsDeducted} pts</div>
                    <div className="text-xs text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">No recent behaviour events</div>
          )}
        </div>

        {/* Drivers Requiring Attention */}
        <div className="glass-red rounded-2xl p-6">
          <h3 className="font-bold mb-4 text-red-400">⚠️ Drivers Requiring Attention</h3>
          {(() => {
            const attentionDrivers = driverBehaviourScoreService.getDriversRequiringAttention();
            return attentionDrivers.length > 0 ? (
              <div className="space-y-3">
                {attentionDrivers.map((driver) => (
                  <div key={driver.driverId} className="flex items-center justify-between bg-red-500/10 rounded-lg p-3">
                    <div>
                      <div className="font-semibold">{driver.driverName}</div>
                      <div className="text-xs text-gray-400">{driver.busId}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-bold">{driver.overallScore}</div>
                      <div className="text-xs text-gray-400">{driver.category.replace('_', ' ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-4">All drivers performing well</div>
            );
          })()}
        </div>
      </div>
    </DashboardLayout>
  );
}
