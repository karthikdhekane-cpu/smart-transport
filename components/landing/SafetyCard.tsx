'use client';
import { motion } from 'framer-motion';

interface SafetyCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}

export default function SafetyCard({
  title,
  description,
  icon,
  color,
  index,
}: SafetyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative overflow-hidden glass rounded-2xl p-6 lg:p-8 hover:shadow-deep transition-all duration-500 hover-card"
    >
      {/* Hover background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `${color}08` }}
      />

      <div className="flex items-start gap-4 relative z-10">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.1, duration: 0.4 }}
          className="flex-shrink-0"
        >
          <div
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center"
            style={{ background: `${color}10`, border: `1px solid ${color}20`, color }}
          >
            <span className="text-xl lg:text-2xl">{icon}</span>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <motion.h4
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.15, duration: 0.4 }}
            className="text-[16px] lg:text-[18px] font-semibold text-[#0f172a]"
            style={{ color }}
          >
            {title}
          </motion.h4>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
            className="text-[14px] lg:text-[15px] text-[#64748b] leading-relaxed"
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
