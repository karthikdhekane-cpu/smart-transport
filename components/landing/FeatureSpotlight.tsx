'use client';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface FeatureSpotlightProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  index: number;
  variant?: 'left' | 'right' | 'center';
}

export default function FeatureSpotlight({
  title,
  description,
  icon,
  color,
  index,
  variant = 'center',
}: FeatureSpotlightProps) {
  const isLeft = variant === 'left';
  const isRight = variant === 'right';

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      className={clsx(
        'relative flex items-center gap-8 lg:gap-12 p-8 lg:p-12 rounded-3xl',
        'glass hover:shadow-deep transition-all duration-500 hover-card',
        isLeft ? 'flex-col lg:flex-row' : isRight ? 'flex-col lg:flex-row-reverse' : 'flex-col'
      )}
    >
      {/* Decorative blob */}
      <div
        className="absolute rounded-full blur-3xl pointer-events-none opacity-40"
        style={{
          width: '180px',
          height: '180px',
          background: `${color}20`,
          top: isLeft ? '-40px' : isRight ? '-40px' : '50%',
          left: isLeft ? '50%' : isRight ? '50%' : '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 + 0.15, duration: 0.5 }}
        className="relative z-10 flex-shrink-0"
      >
        <div
          className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center shadow-neon"
          style={{ background: `${color}10`, border: `1px solid ${color}20`, color }}
        >
          <div className="text-2xl lg:text-3xl">{icon}</div>
        </div>
        {/* Pulse ring */}
        <div
          className="absolute inset-0 rounded-2xl border"
          style={{
            borderColor: `${color}40`,
            animation: 'pulseRing 3s cubic-bezier(0.215,0.61,0.355,1) infinite',
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex-1 space-y-4">
        <motion.div
          initial={{ opacity: 0, x: isLeft ? 32 : isRight ? -32 : 0 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 + 0.2, duration: 0.5 }}
        >
          <h3
            className="text-2xl lg:text-3xl font-black tracking-tight text-[#0f172a]"
            style={{ fontSize: 'clamp(24px,4vw,40px)' }}
          >
            {title}
          </h3>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 + 0.25, duration: 0.5 }}
          className="text-[16px] lg:text-[18px] text-[#64748b] leading-relaxed max-w-xl"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}
