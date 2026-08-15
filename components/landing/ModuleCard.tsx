'use client';
import { motion } from 'framer-motion';

interface ModuleCardProps {
  number: string;
  title: string;
  description: string;
  items: string[];
  color: string;
  index: number;
}

export default function ModuleCard({
  number,
  title,
  description,
  items,
  color,
  index,
}: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="relative group"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}0a, transparent 70%)`,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}45, transparent)`,
        }}
      />

      {/* Card */}
      <div className="relative z-10 glass rounded-3xl p-8 lg:p-10 hover:shadow-deep transition-all duration-500 hover-card border border-[#e2e8f0]">
        {/* Big number */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.15, duration: 0.5 }}
        >
          <div
            className="text-[90px] lg:text-[110px] font-black leading-none mb-6 opacity-5"
            style={{ color }}
          >
            {number}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
          className="text-2xl lg:text-3xl font-bold mb-4"
          style={{ color }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.25, duration: 0.5 }}
          className="text-[15px] lg:text-[16px] text-[#64748b] leading-relaxed mb-8"
        >
          {description}
        </motion.p>

        {/* Features */}
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
          className="space-y-3"
        >
          {items.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.35 + i * 0.05, duration: 0.4 }}
              className="flex items-center gap-3 text-[14px] lg:text-[15px] text-[#475569]"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}
