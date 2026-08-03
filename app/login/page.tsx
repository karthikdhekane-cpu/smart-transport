'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Role = 'student' | 'driver' | 'admin';
type Stage = 'select' | 'login';

const roleConfig = {
  student: {
    label: 'Student',
    sub: 'Track your bus, get ETA alerts',
    icon: '◎',
    color: '#00C853',
    glow: 'rgba(0,200,83,0.2)',
    border: 'rgba(0,200,83,0.25)',
    bg: 'rgba(0,200,83,0.06)',
    placeholder: '21CS001 or email',
    fieldLabel: 'Roll Number / Email',
    preview: [
      { label: 'BUS-01', value: '8 min', sub: 'ETA to your stop' },
      { label: 'Occupancy', value: '73%', sub: '38 / 52 seats' },
      { label: 'Safety', value: '94%', sub: 'Driver score' },
    ],
    previewTitle: 'Student Dashboard Preview',
    previewDesc: 'Live bus tracking, smart ETA, and safety alerts.',
  },
  driver: {
    label: 'Driver',
    sub: 'Manage trips, share GPS location',
    icon: '◈',
    color: '#FFD700',
    glow: 'rgba(255,215,0,0.15)',
    border: 'rgba(255,215,0,0.25)',
    bg: 'rgba(255,215,0,0.05)',
    placeholder: 'D001 or email',
    fieldLabel: 'Driver ID / Email',
    preview: [
      { label: 'Safety Score', value: '94%', sub: 'This week' },
      { label: 'Total Trips', value: '1,240', sub: 'All time' },
      { label: 'On-Time', value: '96%', sub: 'This month' },
    ],
    previewTitle: 'Driver Dashboard Preview',
    previewDesc: 'Trip control, GPS sharing, and safety analytics.',
  },
  admin: {
    label: 'Admin',
    sub: 'Monitor fleet, manage operations',
    icon: '◉',
    color: '#2196F3',
    glow: 'rgba(33,150,243,0.15)',
    border: 'rgba(33,150,243,0.25)',
    bg: 'rgba(33,150,243,0.05)',
    placeholder: 'admin@college.edu',
    fieldLabel: 'Admin Email',
    preview: [
      { label: 'Active Buses', value: '9/12', sub: 'Live now' },
      { label: 'Students', value: '480', sub: 'Tracked today' },
      { label: 'Alerts', value: '3', sub: 'Needs attention' },
    ],
    previewTitle: 'Admin Command Center',
    previewDesc: 'Fleet monitoring, analytics, and emergency alerts.',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('select');
  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const cfg = roleConfig[role];

  const handleRoleSelect = (r: Role) => {
    setRole(r);
    setStage('login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setSuccess(true);
    await new Promise(r => setTimeout(r, 600));
    router.push(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] overflow-hidden relative">

      {/* Ambient background */}
      <div className="absolute inset-0 map-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{background:'radial-gradient(circle, rgba(0,200,83,0.06) 0%, transparent 70%)'}} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{background:'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%)'}} />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00C853] to-[#009624] flex items-center justify-center text-sm font-black text-black">C</div>
          <span className="font-bold gradient-text">CampBus – A Smart App</span>
        </Link>
        <Link href="/" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">← Back</Link>
      </nav>

      {/* STAGE 1 - ROLE SELECTION */}
      {stage === 'select' && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-16">
          <div className="text-center mb-14 animate-slide-up">
            <div className="inline-flex items-center gap-2 glass-green rounded-full px-4 py-2 text-xs font-medium text-[#00C853] mb-5 tracking-wider uppercase">
              Secure Access Portal
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-4">
              Who are you?
            </h1>
            <p className="text-gray-500 text-base max-w-sm mx-auto">
              Select your role to access your personalized dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 w-full max-w-4xl">
            {(Object.entries(roleConfig) as [Role, typeof roleConfig.student][]).map(([key, cfg], i) => (
              <button
                key={key}
                onClick={() => handleRoleSelect(key)}
                className={`role-card glass rounded-3xl p-8 text-left border animate-scale-in delay-${(i+1)*100}`}
                style={{borderColor: cfg.border, background: cfg.bg}}
              >
                {/* Top glow */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{background:`linear-gradient(90deg, transparent, ${cfg.color}50, transparent)`}} />

                <div className="text-4xl font-black mb-5" style={{color: cfg.color}}>{cfg.icon}</div>
                <h3 className="text-xl font-black text-white mb-2">{cfg.label}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{cfg.sub}</p>

                {/* Mini preview stats */}
                <div className="space-y-2">
                  {cfg.preview.slice(0,2).map(p => (
                    <div key={p.label} className="flex justify-between items-center py-1.5 border-b border-white/5">
                      <span className="text-xs text-gray-600">{p.label}</span>
                      <span className="text-xs font-bold" style={{color: cfg.color}}>{p.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold" style={{color: cfg.color}}>
                  Enter as {cfg.label}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </button>
            ))}
          </div>

          <p className="text-gray-700 text-xs mt-10">
            Demo: use any credentials to sign in
          </p>
        </div>
      )}

      {/* STAGE 2 - LOGIN FORM */}
      {stage === 'login' && (
        <div className="min-h-screen grid lg:grid-cols-2">

          {/* Left — Preview panel */}
          <div className="hidden lg:flex flex-col justify-center px-16 relative overflow-hidden"
            style={{background:`radial-gradient(ellipse 80% 60% at 30% 50%, ${cfg.glow} 0%, transparent 70%)`}}>

            {/* Animated route lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 500 700" preserveAspectRatio="none">
              <path d="M 0 500 Q 150 350 250 250 Q 350 150 500 80"
                stroke={cfg.color} strokeWidth="1.5" fill="none" strokeDasharray="10 6" className="route-line"/>
              <path d="M 0 600 Q 120 450 230 330 Q 340 210 500 160"
                stroke={cfg.color} strokeWidth="1" fill="none" strokeDasharray="8 6" className="route-line" style={{animationDelay:'0.5s'}}/>
              {/* GPS pings */}
              <circle cx="250" cy="250" r="6" fill={cfg.color} className="bus-pulse"/>
              <circle cx="250" cy="250" r="14" fill="none" stroke={cfg.color} strokeWidth="1.5" opacity="0.4" className="pulse-ring"/>
              <circle cx="250" cy="250" r="24" fill="none" stroke={cfg.color} strokeWidth="1" opacity="0.2" className="pulse-ring" style={{animationDelay:'0.6s'}}/>
            </svg>

            <div className="relative z-10 animate-slide-left">
              <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{color: cfg.color}}>
                {cfg.label} Portal
              </div>
              <h2 className="text-4xl font-black text-white mb-4 leading-tight">{cfg.previewTitle}</h2>
              <p className="text-gray-500 text-base mb-10 leading-relaxed">{cfg.previewDesc}</p>

              {/* Preview stats */}
              <div className="space-y-3">
                {cfg.preview.map(p => (
                  <div key={p.label} className="glass rounded-2xl p-4 flex items-center justify-between"
                    style={{borderColor: cfg.border}}>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">{p.label}</div>
                      <div className="text-xs text-gray-600">{p.sub}</div>
                    </div>
                    <div className="text-2xl font-black" style={{color: cfg.color}}>{p.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Login form */}
          <div className="flex flex-col items-center justify-center px-6 lg:px-16 py-20 relative">
            {/* Back to role select */}
            <button
              onClick={() => setStage('select')}
              className="absolute top-8 left-6 lg:left-16 text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2">
              ← Change role
            </button>

            <div className="w-full max-w-sm animate-slide-up">
              {/* Role badge */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-black"
                  style={{background: cfg.bg, border:`1px solid ${cfg.border}`, color: cfg.color}}>
                  {cfg.icon}
                </div>
                <div>
                  <div className="text-xs text-gray-500 tracking-wider uppercase">Signing in as</div>
                  <div className="font-bold text-white">{cfg.label}</div>
                </div>
              </div>

              <h1 className="text-3xl font-black text-white mb-2">Welcome back.</h1>
              <p className="text-gray-500 text-sm mb-8">Enter your credentials to continue.</p>

              {success ? (
                <div className="text-center py-8 animate-scale-in">
                  <div className="text-5xl mb-4" style={{color: cfg.color}}>✓</div>
                  <p className="text-white font-semibold">Authenticated</p>
                  <p className="text-gray-500 text-sm mt-1">Redirecting to dashboard...</p>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email field */}
                  <div>
                    <label className="text-xs text-gray-500 mb-2 block tracking-wide uppercase">{cfg.fieldLabel}</label>
                    <input
                      type="text"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={cfg.placeholder}
                      className="input-premium w-full px-4 py-3.5 text-sm"
                      required
                    />
                  </div>

                  {/* Password field */}
                  <div>
                    <label className="text-xs text-gray-500 mb-2 block tracking-wide uppercase">Password</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-premium w-full px-4 py-3.5 text-sm pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-xs">
                        {showPass ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 mt-2 relative overflow-hidden"
                    style={{
                      background: loading ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`,
                      color: loading ? '#666' : '#000',
                      boxShadow: loading ? 'none' : `0 8px 32px ${cfg.glow}`,
                    }}>
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <span className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin"/>
                        Authenticating...
                      </span>
                    ) : `Sign in as ${cfg.label} →`}
                  </button>
                </form>
              )}

              {/* Demo hint */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-xs text-gray-600 text-center mb-3 tracking-wide">Demo — use any password</p>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(roleConfig) as [Role, typeof roleConfig.student][]).map(([key, c]) => (
                    <button
                      key={key}
                      onClick={() => { setRole(key); setEmail(key === 'student' ? '21CS001' : key === 'driver' ? 'D001' : 'admin'); }}
                      className="glass rounded-xl p-2.5 text-center text-xs transition-all hover:scale-105"
                      style={{borderColor: key === role ? c.border : 'transparent'}}>
                      <div className="font-semibold" style={{color: c.color}}>{c.label}</div>
                      <div className="text-gray-600 mt-0.5">{key === 'student' ? '21CS001' : key === 'driver' ? 'D001' : 'admin'}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
