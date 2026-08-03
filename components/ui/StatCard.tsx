'use client';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import clsx from 'clsx';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: React.ReactNode;
  color?: 'green' | 'gold' | 'blue' | 'red';
  decimals?: number;
}

const colorMap = {
  green: 'text-primary neon-text',
  gold: 'text-gold gold-text',
  blue: 'text-blue-400',
  red: 'text-red-400',
};

const bgMap = {
  green: 'glass-green',
  gold: 'glass-gold',
  blue: 'bg-blue-500/10 border border-blue-500/20',
  red: 'bg-red-500/10 border border-red-500/20',
};

export default function StatCard({ label, value, suffix = '', prefix = '', icon, color = 'green', decimals = 0 }: StatCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
  );

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: 'easeOut' });
    return controls.stop;
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={clsx('rounded-2xl p-5 flex items-center gap-4', bgMap[color])}
    >
      <div className={clsx('text-3xl', colorMap[color])}>{icon}</div>
      <div>
        <div className={clsx('text-2xl font-bold', colorMap[color])}>
          {prefix}
          <motion.span>{rounded}</motion.span>
          {suffix}
        </div>
        <div className="text-sm text-gray-400 mt-0.5">{label}</div>
      </div>
    </motion.div>
  );
}
