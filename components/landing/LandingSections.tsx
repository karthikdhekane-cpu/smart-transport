'use client';
import { motion } from 'framer-motion';
import KPIStrip from './KPIStrip';
import FeatureSpotlight from './FeatureSpotlight';
import ModuleCard from './ModuleCard';
import SafetyCard from './SafetyCard';

export default function LandingSections() {
  // Core features data
  const features = [
    {
      title: 'Real-Time GPS Tracking',
      description: 'Live bus positions updated every second with route visualization and animated markers across all active routes.',
      icon: '◎',
      color: '#059669',
      variant: 'center',
    },
    {
      title: 'AI ETA Prediction',
      description: 'Machine learning model analyzes traffic patterns, historical data, and real-time speed for accurate arrival predictions.',
      icon: '◈',
      color: '#d97706',
      variant: 'right',
    },
    {
      title: 'Driver Behavior Analytics',
      description: 'Detect harsh braking, over-speeding, and rash turns. Generate weekly safety scores and performance rankings.',
      icon: '◉',
      color: '#059669',
      variant: 'left',
    },
    {
      title: 'Geofencing & Alerts',
      description: 'Intelligent boundary detection for route deviations, unauthorized stops, and instant administrator notifications.',
      icon: '◐',
      color: '#d97706',
      variant: 'center',
    },
    {
      title: 'Women Safety Mode',
      description: 'Night-stop detection, emergency contact triggers, and SOS with dedicated safety monitoring protocols.',
      icon: '◑',
      color: '#059669',
      variant: 'right',
    },
  ];

  // Modules data
  const modules = [
    {
      number: '01',
      title: 'Real-Time Tracking',
      color: '#059669',
      description: 'Live GPS with sub-second updates, route visualization, and animated bus movement across all active routes.',
      items: ['Live GPS tracking', 'Route polyline visualization', 'Bus movement simulation', 'Traffic overlay', 'Stop progress tracking'],
    },
    {
      number: '02',
      title: 'ETA & Notifications',
      color: '#d97706',
      description: 'AI-enhanced prediction engine with traffic awareness, historical analysis, and smart wake-up alarms.',
      items: ['AI-enhanced ETA engine', 'Traffic-aware prediction', 'Historical analysis', 'Smart wake-up alarm', 'WhatsApp/SMS fallback'],
    },
    {
      number: '03',
      title: 'Safety & Monitoring',
      color: '#3b82f6',
      description: 'Comprehensive safety suite with driver behavior analytics, geofencing, and women safety mode.',
      items: ['Driver behavior analytics', 'SOS emergency system', 'Geofencing alerts', 'Women safety mode', 'Accident detection'],
    },
  ];

  // Safety features
  const safetyFeatures = [
    {
      title: 'Driver Safety Score',
      description: 'Real-time scoring based on speed, braking, and turn behavior',
      icon: '◎',
      color: '#059669',
    },
    {
      title: 'Geofence Monitoring',
      description: 'Instant alerts when buses deviate from approved route boundaries',
      icon: '◈',
      color: '#d97706',
    },
    {
      title: 'SOS Emergency System',
      description: 'One-tap emergency alert to admin, driver, and emergency services',
      icon: '◉',
      color: '#ef4444',
    },
    {
      title: 'Women Safety Mode',
      description: 'Night-stop detection with automatic emergency contact triggers',
      icon: '◐',
      color: '#059669',
    },
  ];

  return (
    <>
      {/* Enhanced Metrics Bar */}
      <KPIStrip />

      {/* FEATURES SECTION - Premium spotlight layout */}
      <section id="features" className="py-20 lg:py-32 px-6 lg:px-16 bg-[#f8fafc] relative overflow-hidden">
        {/* Ambient background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px]"
          style={{ background: 'radial-gradient(circle, #05966908, transparent 70%)' }}
        />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 lg:mb-24"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              whileInView={{ opacity: 1, letterSpacing: '0.2em' }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-[11px] lg:text-[13px] font-semibold tracking-[0.25em] uppercase text-[#059669]/60 mb-4"
            >
              Platform Capabilities
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="font-black tracking-tight leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}
            >
              Everything a modern campus<br />
              transport system needs.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[16px] lg:text-[18px] text-[#64748b] max-w-2xl mx-auto"
            >
              From real-time tracking to AI-powered predictions, CampBus delivers
              comprehensive transport intelligence for educational institutions.
            </motion.p>
          </motion.div>

          {/* Feature Spotlights with alternating layout */}
          <div className="space-y-8 lg:space-y-12">
            {features.map((feature, i) => (
              <FeatureSpotlight
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                color={feature.color}
                index={i}
                variant={feature.variant as any}
              />
            ))}
          </div>
        </div>
      </section>

      {/* MODULES SECTION - Elegant 3-column with visual flow */}
      <section id="modules" className="py-20 lg:py-32 px-6 lg:px-16 bg-[#f1f5f9] relative overflow-hidden">
        {/* Route line background */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
          style={{ opacity: 0.05 }}
        >
          <path
            d="M 100 500 Q 400 300 700 500 T 1300 300"
            fill="none"
            stroke="#059669"
            strokeWidth="2"
            strokeDasharray="20 15"
          />
        </svg>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 lg:mb-24"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              whileInView={{ opacity: 1, letterSpacing: '0.2em' }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-[11px] lg:text-[13px] font-semibold tracking-[0.25em] uppercase text-[#059669]/60 mb-4"
            >
              System Architecture
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="font-black tracking-tight leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}
            >
              3 intelligent<br />
              core modules.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[16px] lg:text-[18px] text-[#64748b] max-w-2xl mx-auto"
            >
              Our intelligent system is built on three foundational pillars
              that work together seamlessly.
            </motion.p>
          </motion.div>

          {/* 3-Column Module Cards */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {modules.map((module, i) => (
              <ModuleCard
                key={module.number}
                number={module.number}
                title={module.title}
                description={module.description}
                items={module.items}
                color={module.color}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY SECTION - Premium dashboard visual */}
      <section id="safety" className="py-20 lg:py-32 px-6 lg:px-16 bg-[#f8fafc] relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-1/2 right-0 w-[600px] h-[600px]"
          style={{ background: 'radial-gradient(circle, #d977060a, transparent 70%)' }}
        />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.2em' }}
                whileInView={{ opacity: 1, letterSpacing: '0.2em' }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-[11px] lg:text-[13px] font-semibold tracking-[0.25em] uppercase text-[#059669]/60 mb-4"
              >
                Safety First
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="font-black tracking-tight leading-[1.05] mb-6"
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)' }}
              >
                Intelligent safety<br />
                for every journey.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-[16px] lg:text-[18px] text-[#64748b] leading-relaxed mb-8 max-w-xl"
              >
                From real-time driver behavior monitoring to women safety mode and
                accident detection — every trip is protected by AI-powered intelligence.
              </motion.p>

              {/* Safety feature cards */}
              <div className="space-y-4">
                {safetyFeatures.map((feature, i) => (
                  <SafetyCard
                    key={feature.title}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    color={feature.color}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>

            {/* Right: Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Decorative blobs */}
              <div
                className="absolute -inset-8 bg-[#d97706]/10 blur-3xl rounded-full"
              />

              {/* Main Dashboard Card */}
              <div className="relative glass rounded-3xl p-6 lg:p-8 space-y-6 shadow-deep border border-[#e2e8f0]">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#0f172a]">Safety Overview</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"
                    />
                    <span className="text-[12px] font-semibold text-[#059669]">LIVE</span>
                  </div>
                </div>

                {/* Safety Score */}
                <div className="flex flex-col lg:flex-row gap-6 p-6 glass-g rounded-2xl">
                  {/* Circular Score */}
                  <div className="flex-shrink-0 relative w-24 h-24 lg:w-28 lg:h-28">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="6"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="6"
                        strokeDasharray={`${2 * Math.PI * 42 * 0.942} ${2 * Math.PI * 42}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl lg:text-4xl font-black neon-text">94%</span>
                      <span className="text-[10px] text-[#94a3b8] mt-1">Fleet Score</span>
                    </div>
                  </div>

                  {/* Score Details */}
                  <div className="flex-1 space-y-3">
                    <div className="text-[15px] lg:text-[16px] font-semibold text-[#0f172a]">
                      Fleet Safety Score
                    </div>
                    <div className="text-[13px] lg:text-[14px] text-[#64748b]">
                      Based on 1,240 trips this month
                    </div>
                    <div className="flex gap-2">
                      <span
                        className="px-3 py-1 rounded-lg text-[12px] font-semibold"
                        style={{ background: '#05966910', color: '#059669' }}
                      >
                        Excellent
                      </span>
                      <span
                        className="px-3 py-1 rounded-lg text-[12px]"
                        style={{ background: '#f1f5f9', color: '#64748b' }}
                      >
                        Top 5%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Driver Rankings */}
                <div className="space-y-3">
                  <div className="text-[12px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                    Driver Safety Rankings
                  </div>

                  <div className="space-y-3">
                    {[{ name: 'Suresh P', score: 97, bus: 'BUS-03' }, { name: 'Rajesh Kumar', score: 94, bus: 'BUS-01' }, { name: 'Anand R', score: 91, bus: 'BUS-04' }, { name: 'Murugan S', score: 88, bus: 'BUS-02' }].map((driver, i) => (
                      <motion.div
                        key={driver.name}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                        className="flex items-center gap-4 p-3 glass rounded-xl"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ background: '#05966910', color: '#059669' }}
                        >
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="text-[13px] lg:text-[14px] font-medium text-[#0f172a] truncate">
                            {driver.name}
                          </div>
                          <div className="text-[11px] lg:text-[12px] text-[#94a3b8] truncate">
                            {driver.bus}
                          </div>
                        </div>
                        <span
                          className="text-[14px] lg:text-[16px] font-black flex-shrink-0"
                          style={{ color: driver.score >= 95 ? '#059669' : driver.score >= 90 ? '#d97706' : '#3b82f6' }}
                        >
                          {driver.score}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ANALYTICS SECTION - Living transport intelligence */}
      <section id="analytics" className="py-20 lg:py-32 px-6 lg:px-16 bg-[#f1f5f9] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 lg:mb-20"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              whileInView={{ opacity: 1, letterSpacing: '0.2em' }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-[11px] lg:text-[13px] font-semibold tracking-[0.25em] uppercase text-[#059669]/60 mb-4"
            >
              Platform Intelligence
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="font-black tracking-tight leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}
            >
              Data-driven transport<br />
              insights.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[16px] lg:text-[18px] text-[#64748b] max-w-2xl mx-auto"
            >
              Real-time analytics and predictive insights for smarter transportation decisions.
            </motion.p>
          </motion.div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
            {[
              { value: '480+', label: 'Students', sub: 'Across 4 routes' },
              { value: '12', label: 'Active Buses', sub: 'Real-time GPS' },
              { value: '94.2%', label: 'On-Time', sub: 'This semester' },
              { value: '99.8%', label: 'Uptime', sub: 'Last 30 days' },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-g glass-gold rounded-2xl p-6 lg:p-8 hover:shadow-deep transition-all duration-500 hover-card"
              >
                <div
                  className="text-2xl lg:text-3xl font-black mb-2"
                  style={{ color: i % 2 === 0 ? '#059669' : '#d97706' }}
                >
                  {metric.value}
                </div>
                <div className="text-[15px] lg:text-[16px] font-semibold text-[#0f172a] mb-1">
                  {metric.label}
                </div>
                <div className="text-[12px] lg:text-[13px] text-[#64748b]">
                  {metric.sub}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Analytics Chart */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glass rounded-3xl p-6 lg:p-10"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl lg:text-2xl font-semibold text-[#0f172a] mb-2">
                  Weekly On-Time Performance
                </h3>
                <p className="text-[14px] lg:text-[15px] text-[#64748b]">
                  Fleet-wide punctuality across all routes
                </p>
              </div>
              <span
                className="px-4 py-2 rounded-lg text-[12px] lg:text-[13px] font-semibold"
                style={{ background: '#05966910', color: '#059669' }}
              >
                This Week
              </span>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end gap-3 lg:gap-5 h-48 lg:h-56">
              {[
                { day: 'Mon', value: 96 },
                { day: 'Tue', value: 92 },
                { day: 'Wed', value: 98 },
                { day: 'Thu', value: 88 },
                { day: 'Fri', value: 94 },
                { day: 'Sat', value: 100 },
              ].map((bar, i) => (
                <motion.div
                  key={bar.day}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(bar.value / 100) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                  className="flex-1 flex flex-col items-center gap-3 group relative"
                >
                  {/* Tooltip */}
                  <div
                    className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1.5 rounded-lg text-[12px] font-bold"
                    style={{ background: '#0f172a', color: 'white' }}
                  >
                    {bar.value}%
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full lg:w-10 rounded-t-lg"
                    style={{
                      background: `linear-gradient(to top, #059669, #34d399)`,
                      height: `${(bar.value / 100) * 100}%`,
                    }}
                  />

                  <span className="text-[12px] lg:text-[13px] text-[#64748b] font-medium">
                    {bar.day}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}