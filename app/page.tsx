import Link from 'next/link';
import HeroCanvas from '@/components/hero/HeroCanvas';
import LandingSections from '@/components/landing/LandingSections';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] overflow-x-hidden">

      {/* NAVBAR */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-6 navbar-animate" data-navbar>
        <nav className="navbar-float w-full max-w-6xl px-6 h-[52px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#059669] to-[#009624] flex items-center justify-center text-xs font-black text-black">C</div>
            <span className="text-[14px] font-semibold text-[#0f172a] tracking-tight">CampBus – A Smart App</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {[['Features','#features'],['Modules','#modules'],['Safety','#safety'],['Dashboards','#dashboards']].map(([l,h]) => (
              <a key={l} href={h} className="text-[13px] text-[#475569] hover:text-[#0f172a] transition-colors duration-150 font-medium">{l}</a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login" className="text-[13px] text-[#475569] hover:text-[#0f172a] transition-colors font-medium px-3 py-1.5 hidden sm:block">Sign in</Link>
            <Link href="/login" className="btn-primary text-[13px] px-4 py-2 text-white font-semibold">Get Started</Link>
          </div>
        </nav>
      </div>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden hero-bg pt-24">
        <HeroCanvas />

        {/* Subtle perspective grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.18]" style={{
          backgroundImage: 'linear-gradient(rgba(5,150,105,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(5,150,105,0.06) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
          transform: 'perspective(700px) rotateX(22deg)',
          transformOrigin: '50% 100%',
        }} />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 120% 100% at 50% 50%,transparent 15%,rgba(5,5,7,0.72) 100%)'}} />

        {/* Ambient glow */}
        <div className="orb top-0 left-1/3 w-[700px] h-[500px] bg-[#059669]/5 animate-glow-pulse" />
        <div className="orb bottom-0 right-1/4 w-[500px] h-[400px] bg-[#d97706]/5 animate-glow-pulse delay-700" />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 lg:px-16 py-16">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-24 items-center min-h-[calc(100vh-160px)]">

            {/* LEFT */}
            <div className="space-y-9 lg:py-12">
              <div className="hero-badge">
                <h1 className="font-black leading-[1.02] tracking-[-0.04em]" style={{fontSize:'clamp(3.2rem,7vw,5.8rem)'}}>
                  <span className="gradient-text-white hero-headline block">Smart College</span>
                  <span className="gradient-text hero-headline-2 block">Transport</span>
                  <span className="gradient-text-white hero-headline-3 block">System.</span>
                </h1>
              </div>

              <p className="text-[16px] text-[#475569] max-w-[420px] leading-[1.85] animate-slide-up delay-100 font-light">
                Real-time bus tracking, ETA monitoring, safety analytics,
                and smart transport management for modern educational institutions.
              </p>

              <div className="flex flex-wrap gap-3 animate-slide-up delay-200">
                <Link href="/login" className="btn-primary px-7 py-3.5 text-[14px] font-semibold text-white">
                  Get Started
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <a href="#features" className="btn-glass px-7 py-3.5 text-[14px]">Explore Features</a>
              </div>

              {/* Metrics */}
              <div className="flex gap-10 pt-2 animate-slide-up delay-300">
                {[{v:'480+',l:'Students'},{v:'12',l:'Buses'},{v:'94.2%',l:'On-Time'},{v:'24/7',l:'Monitoring'}].map(s => (
                  <div key={s.l}>
                    <div className="text-[24px] font-black neon-text leading-none">{s.v}</div>
                    <div className="text-[11px] text-[#94a3b8] mt-1.5 tracking-[0.1em] uppercase font-medium">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Enterprise dashboard */}
            <div className="relative animate-slide-right delay-150 lg:py-8">
              <div className="absolute -inset-8 bg-[#059669]/6 blur-3xl rounded-full" />

              {/* Main dashboard card */}
              <div className="relative glass rounded-2xl overflow-hidden shadow-deep border border-[#e2e8f0]">
                {/* Dashboard header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e2e8f0] bg-[#f1f5f9]">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-[11px] text-[#94a3b8] font-medium">Fleet Operations Center</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                    <span className="text-[10px] text-[#059669] font-semibold tracking-wider">LIVE</span>
                  </div>
                </div>

                {/* Dashboard body */}
                <div className="p-5 space-y-4">
                  {/* Top KPI row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      {l:'Active Buses',v:'9/12',c:'#059669'},
                      {l:'On-Time Rate',v:'94.2%',c:'#059669'},
                      {l:'Avg ETA',v:'8.4 min',c:'#d97706'},
                      {l:'Safety Score',v:'94%',c:'#059669'},
                    ].map(k => (
                      <div key={k.l} className="glass rounded-xl p-3">
                        <div className="text-[10px] text-[#94a3b8] mb-1.5 font-medium">{k.l}</div>
                        <div className="text-[16px] font-black" style={{color:k.c}}>{k.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Map + fleet list */}
                  <div className="grid grid-cols-[1.4fr_1fr] gap-3">
                    {/* Map */}
                    <div className="map-mock map-grid rounded-xl overflow-hidden" style={{height:'220px'}}>
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 220" preserveAspectRatio="none">
                        <defs>
                          <filter id="g1"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                        </defs>
                        <path d="M 20 200 Q 80 150 130 100 Q 180 55 260 30" stroke="#059669" strokeWidth="1.5" fill="none" strokeDasharray="8 4" className="route-line" opacity="0.6" filter="url(#g1)"/>
                        <path d="M 10 215 Q 70 165 120 120 Q 175 75 265 55" stroke="#d97706" strokeWidth="1.2" fill="none" strokeDasharray="6 4" className="route-line" opacity="0.4"/>
                        <path d="M 40 218 Q 100 175 150 130 Q 200 90 260 80" stroke="#3b82f6" strokeWidth="1.2" fill="none" strokeDasharray="6 4" className="route-line" opacity="0.3"/>
                        <circle cx="130" cy="100" r="6" fill="#059669" className="bus-pulse" filter="url(#g1)"/>
                        <circle cx="130" cy="100" r="13" fill="none" stroke="#059669" strokeWidth="1.2" opacity="0.28" className="pulse-ring"/>
                        <circle cx="185" cy="80" r="5" fill="#d97706" className="bus-pulse" style={{animationDelay:'0.8s'}}/>
                        <circle cx="185" cy="80" r="11" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.25" className="pulse-ring" style={{animationDelay:'0.8s'}}/>
                        <circle cx="95" cy="145" r="4.5" fill="#3b82f6" className="bus-pulse" style={{animationDelay:'1.3s'}}/>
                        {[[260,30],[180,55],[130,100],[80,150],[20,200]].map(([x,y],i) => (
                          <circle key={i} cx={x} cy={y} r="3" fill="white" opacity="0.35"/>
                        ))}
                      </svg>
                      <div className="absolute top-2.5 left-2.5 glass-dark rounded-lg px-2.5 py-1 text-[10px] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"/>
                        <span className="text-[#059669] font-semibold">3 Active</span>
                      </div>
                    </div>

                    {/* Fleet list */}
                    <div className="space-y-2">
                      {[
                        {id:'BUS-01',route:'Gandhipuram',eta:'8 min',occ:73,status:'moving',c:'#059669'},
                        {id:'BUS-02',route:'RS Puram',eta:'14 min',occ:87,status:'moving',c:'#d97706'},
                        {id:'BUS-03',route:'Peelamedu',eta:'22 min',occ:38,status:'stopped',c:'#3b82f6'},
                        {id:'BUS-04',route:'Singanallur',eta:'5 min',occ:96,status:'moving',c:'#059669'},
                      ].map(b => (
                        <div key={b.id} className="glass rounded-xl p-2.5">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full" style={{background:b.c}}/>
                              <span className="text-[11px] font-semibold text-[#0f172a]">{b.id}</span>
                            </div>
                            <span className="text-[10px] font-bold" style={{color:b.c}}>{b.eta}</span>
                          </div>
                          <div className="text-[10px] text-[#94a3b8] mb-1.5">{b.route}</div>
                          <div className="h-1 bg-[#f1f5f9] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{width:`${b.occ}%`,background:b.c,opacity:0.7}}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom analytics row */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Mini chart */}
                    <div className="glass rounded-xl p-3 col-span-2">
                      <div className="text-[10px] text-[#94a3b8] mb-2.5 font-medium">On-Time Performance — This Week</div>
                      <div className="flex items-end gap-1.5 h-10">
                        {[96,92,98,88,94,100].map((v,i) => (
                          <div key={i} className="flex-1 rounded-t" style={{height:`${(v/100)*40}px`,background:`rgba(5,150,105,${0.4+v*0.004})`}}/>
                        ))}
                      </div>
                    </div>
                    {/* ETA accuracy */}
                    <div className="glass rounded-xl p-3">
                      <div className="text-[10px] text-[#94a3b8] mb-1.5 font-medium">ETA Accuracy</div>
                      <div className="text-[22px] font-black neon-text">94%</div>
                      <div className="text-[10px] text-[#94a3b8] mt-0.5">AI-powered</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating side cards */}
              <div className="absolute -left-14 top-[30%] glass-g rounded-xl p-4 animate-float border border-[#059669]/20 hidden xl:block">
                <div className="text-[10px] text-[#94a3b8] font-medium mb-1">Safety Score</div>
                <div className="text-[20px] font-black neon-text">94.2%</div>
                <div className="text-[10px] text-[#94a3b8] mt-0.5">Fleet avg</div>
              </div>

              <div className="absolute -right-12 bottom-[25%] glass-gold rounded-xl p-4 animate-float-b border border-[#d97706]/20 hidden xl:block">
                <div className="text-[10px] text-[#94a3b8] font-medium mb-1">AI ETA</div>
                <div className="text-[20px] font-black gold-text">8 min</div>
                <div className="text-[10px] text-[#94a3b8] mt-0.5">94% accurate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-1000">
          <div className="w-px h-8 bg-gradient-to-b from-[#059669]/35 to-transparent" />
        </div>
      </section>

      {/* METRICS BAR & ALL LOWER SECTIONS - Redesigned */}
      <LandingSections />
    </div>
  );
}
