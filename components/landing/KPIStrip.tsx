'use client';
import { motion } from 'framer-motion';

interface StatItem {
  value: string;
  label: string;
  color?: 'green' | 'gold';
}

const colorMap = {
  green: 'neon-text',
  gold: 'gold-text',
};

export default function KPIStrip() {
  const stats: StatItem[] = [
    { value: '480+', label: 'Students Tracked' },
    { value: '12', label: 'Active Buses' },
    { value: '94.2%', label: 'On-Time Rate' },
    { value: '99.8%', label: 'System Uptime' },
    { value: '< 1s', label: 'GPS Refresh' },
    { value: '24/7', label: 'Monitoring' },
  ];

  return (
    <div className="border-y border-[#e2e8f0] bg-white py-6 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-4 items-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="flex flex-col items-center md:items-start"
            >
              <span className={`text-[20px] md:text-[24px] font-black ${colorMap[stat.color || 'green']} mb-0.5`}>
                {stat.value}
              </span>
              <span className="text-[13px] md:text-[14px] text-[#64748b] font-medium text-center md:text-left">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
