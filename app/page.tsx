import Link from 'next/link';
import HeroCanvas from '@/components/hero/HeroCanvas';

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

      {/* METRICS BAR */}
      <div className="border-y border-[#e2e8f0] py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-3">
          {[{v:'480+',l:'Students Tracked'},{v:'12',l:'Active Buses'},{v:'94.2%',l:'On-Time Rate'},{v:'99.8%',l:'System Uptime'},{v:'< 1s',l:'GPS Refresh'},{v:'24/7',l:'Monitoring'}].map(s => (
            <div key={s.l} className="flex items-center gap-2.5">
              <span className="text-[15px] font-bold neon-text">{s.v}</span>
              <span className="text-[12px] text-[#94a3b8] font-medium">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="py-40 px-8 lg:px-16 relative">
        <div className="orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#059669]/5" />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="mb-20">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#059669]/60 mb-4">Platform Capabilities</p>
            <h2 className="font-black tracking-tight leading-[1.08] max-w-2xl" style={{fontSize:'clamp(2.2rem,4.5vw,3.8rem)'}}>
              Everything a modern campus<br />transport system needs.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {icon:'◎',title:'Real-Time GPS Tracking',desc:'Live bus positions updated every second with route visualization and animated markers across all active routes.',accent:'#059669'},
              {icon:'◈',title:'AI ETA Prediction',desc:'Machine learning model analyzes traffic patterns, historical data, and real-time speed for accurate arrival predictions.',accent:'#d97706'},
              {icon:'◉',title:'Driver Behavior Analytics',desc:'Detect harsh braking, over-speeding, and rash turns. Generate weekly safety scores and performance rankings.',accent:'#059669'},
              {icon:'◐',title:'Geofencing & Alerts',desc:'Intelligent boundary detection for route deviations, unauthorized stops, and instant administrator notifications.',accent:'#d97706'},
              {icon:'◑',title:'Women Safety Mode',desc:'Night-stop detection, emergency contact triggers, and SOS with dedicated safety monitoring protocols.',accent:'#059669'},
              {icon:'◒',title:'Smart Notifications',desc:'Contextual push alerts for arrivals, delays, route changes, and emergency events delivered in real-time.',accent:'#d97706'},
              {icon:'◓',title:'Fleet Analytics Dashboard',desc:'Enterprise-grade dashboards with heatmaps, delay patterns, occupancy trends, and live KPI monitoring.',accent:'#059669'},
              {icon:'◔',title:'Accident Detection',desc:'Sudden stop and speed-drop detection triggers automatic SOS alerts and administrator emergency notifications.',accent:'#d97706'},
              {icon:'◕',title:'Lost & Found System',desc:'Full lifecycle item tracking — report, acknowledge, moderate, and return with complete status history.',accent:'#059669'},
            ].map(f => (
              <div key={f.title} className="feature-card glass rounded-2xl p-7 border border-[#e2e8f0] group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{background:`${f.accent}10`,border:`1px solid ${f.accent}1a`,color:f.accent}}>
                  {f.icon}
                </div>
                <h3 className="text-[15px] font-semibold mb-3 text-[#0f172a] tracking-tight">{f.title}</h3>
                <p className="text-[13px] text-[#64748b] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="py-40 px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-20">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#059669]/60 mb-4">System Architecture</p>
            <h2 className="font-black tracking-tight leading-[1.08] max-w-xl" style={{fontSize:'clamp(2.2rem,4.5vw,3.8rem)'}}>
              3 intelligent<br />core modules.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {[
              {num:'01',title:'Real-Time Tracking',color:'#059669',
                desc:'Live GPS with sub-second updates, route visualization, and animated bus movement across all active routes.',
                items:['Live GPS tracking','Route polyline visualization','Bus movement simulation','Traffic overlay','Stop progress tracking']},
              {num:'02',title:'ETA & Notifications',color:'#d97706',
                desc:'AI-enhanced prediction engine with traffic awareness, historical analysis, and smart wake-up alarms.',
                items:['AI-enhanced ETA engine','Traffic-aware prediction','Historical analysis','Smart wake-up alarm','WhatsApp/SMS fallback']},
              {num:'03',title:'Safety & Monitoring',color:'#3b82f6',
                desc:'Comprehensive safety suite with driver behavior analytics, geofencing, and women safety mode.',
                items:['Driver behavior analytics','SOS emergency system','Geofencing alerts','Women safety mode','Accident detection']},
            ].map(m => (
              <div key={m.num} className="glass rounded-2xl p-9 hover-card relative overflow-hidden group">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{background:`radial-gradient(circle at 50% 0%,${m.color}09,transparent 70%)`}} />
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{background:`linear-gradient(90deg,transparent,${m.color}45,transparent)`}} />
                <div className="relative z-10">
                  <div className="text-[80px] font-black leading-none mb-5" style={{color:m.color,opacity:.08}}>{m.num}</div>
                  <h3 className="text-[19px] font-bold mb-3" style={{color:m.color}}>{m.title}</h3>
                  <p className="text-[13px] text-[#94a3b8] mb-7 leading-relaxed">{m.desc}</p>
                  <ul className="space-y-3">
                    {m.items.map(item => (
                      <li key={item} className="flex items-center gap-3 text-[13px] text-[#64748b]">
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{background:m.color}}/>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section id="safety" className="py-40 px-8 lg:px-16 relative overflow-hidden">
        <div className="orb top-1/2 right-0 w-[500px] h-[500px] bg-[#d97706]/5" />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-7">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#059669]/60 mb-4">Safety First</p>
                <h2 className="font-black tracking-tight leading-[1.08]" style={{fontSize:'clamp(2.2rem,4vw,3.4rem)'}}>
                  Intelligent safety<br />for every journey.
                </h2>
              </div>
              <p className="text-[15px] text-[#64748b] leading-relaxed max-w-md">
                From real-time driver behavior monitoring to women safety mode and accident detection — every trip is protected by AI.
              </p>
              <div className="space-y-3">
                {[
                  {icon:'◎',title:'Driver Safety Score',desc:'Real-time scoring based on speed, braking, and turn behavior'},
                  {icon:'◈',title:'Geofence Monitoring',desc:'Instant alerts when buses deviate from approved route boundaries'},
                  {icon:'◉',title:'SOS Emergency System',desc:'One-tap emergency alert to admin, driver, and emergency services'},
                  {icon:'◐',title:'Women Safety Mode',desc:'Night-stop detection with automatic emergency contact triggers'},
                ].map(f => (
                  <div key={f.title} className="flex items-start gap-4 p-4 glass rounded-xl hover-card">
                    <span className="text-[#059669] text-base mt-0.5 flex-shrink-0">{f.icon}</span>
                    <div>
                      <div className="text-[13px] font-semibold text-[#0f172a] mb-0.5">{f.title}</div>
                      <div className="text-[12px] text-[#94a3b8]">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety dashboard */}
            <div className="relative">
              <div className="absolute -inset-6 bg-[#d97706]/5 blur-3xl rounded-full" />
              <div className="relative glass rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-[#0f172a]">Safety Overview</span>
                  <span className="glass-g text-[#059669] text-[10px] px-2.5 py-1 rounded-lg font-semibold">Live</span>
                </div>

                {/* Score ring */}
                <div className="flex items-center gap-6 p-4 glass rounded-xl">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"/>
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#059669" strokeWidth="6"
                        strokeDasharray={`${2*Math.PI*32*0.942} ${2*Math.PI*32}`} strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[15px] font-black neon-text">94%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#0f172a] mb-1">Fleet Safety Score</div>
                    <div className="text-[12px] text-[#94a3b8]">Based on 1,240 trips this month</div>
                    <div className="flex gap-2 mt-2.5">
                      <span className="glass-g text-[#059669] text-[10px] px-2 py-0.5 rounded-lg font-medium">Excellent</span>
                      <span className="glass text-[#94a3b8] text-[10px] px-2 py-0.5 rounded-lg">Top 5%</span>
                    </div>
                  </div>
                </div>

                {/* Driver rankings */}
                <div className="space-y-2">
                  {[{name:'Suresh P',score:97,bus:'BUS-03'},{name:'Rajesh Kumar',score:94,bus:'BUS-01'},{name:'Anand R',score:91,bus:'BUS-04'},{name:'Murugan S',score:88,bus:'BUS-02'}].map((d,i) => (
                    <div key={d.name} className="flex items-center gap-3 p-3 glass rounded-xl">
                      <div className="w-6 h-6 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[11px] font-bold text-[#059669]">{i+1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium text-[#0f172a] truncate">{d.name}</div>
                        <div className="text-[10px] text-[#94a3b8]">{d.bus}</div>
                      </div>
                      <div className="text-[13px] font-bold neon-text">{d.score}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANALYTICS */}
      <section id="analytics" className="py-40 px-8 lg:px-16 relative">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-20">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#059669]/60 mb-4">Platform Intelligence</p>
            <h2 className="font-black tracking-tight leading-[1.08] max-w-xl" style={{fontSize:'clamp(2.2rem,4.5vw,3.8rem)'}}>
              Data-driven transport<br />insights.
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[{v:'480+',l:'Students Tracked',sub:'Across 4 routes',c:'green'},{v:'12',l:'Active Buses',sub:'Real-time GPS',c:'gold'},{v:'94.2%',l:'On-Time Rate',sub:'This semester',c:'green'},{v:'99.8%',l:'System Uptime',sub:'Last 30 days',c:'gold'}].map(s => (
              <div key={s.l} className={`${s.c==='gold'?'glass-gold':'glass-g'} rounded-2xl p-6 hover-card`}>
                <div className={`font-black mb-1.5 ${s.c==='gold'?'gold-text':'neon-text'}`} style={{fontSize:'clamp(1.8rem,3.5vw,2.6rem)'}}>{s.v}</div>
                <div className="text-[13px] font-semibold text-[#0f172a] mb-0.5">{s.l}</div>
                <div className="text-[11px] text-[#94a3b8]">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-8 lg:p-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-[17px] font-semibold text-[#0f172a]">Weekly On-Time Performance</h3>
                <p className="text-[12px] text-[#94a3b8] mt-1">Fleet-wide punctuality across all routes</p>
              </div>
              <span className="glass-g text-[#059669] text-[11px] px-3 py-1.5 rounded-lg font-medium">This Week</span>
            </div>
            <div className="flex items-end gap-4 lg:gap-6 h-44">
              {[{d:'Mon',v:96},{d:'Tue',v:92},{d:'Wed',v:98},{d:'Thu',v:88},{d:'Fri',v:94},{d:'Sat',v:100}].map(b => (
                <div key={b.d} className="flex-1 flex flex-col items-center gap-2.5 group cursor-default">
                  <span className="text-[11px] text-[#059669] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{b.v}%</span>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-[#059669] to-[#34d399] transition-all duration-500 group-hover:opacity-80"
                    style={{height:`${(b.v/100)*148}px`}}/>
                  <span className="text-[11px] text-[#94a3b8] font-medium">{b.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARDS */}
      <section id="dashboards" className="py-40 px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-20">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#059669]/60 mb-4">Access Portals</p>
            <h2 className="font-black tracking-tight leading-[1.08] max-w-xl" style={{fontSize:'clamp(2.2rem,4.5vw,3.8rem)'}}>
              Tailored for<br />every role.
            </h2>
            <p className="text-[15px] text-[#64748b] mt-4 max-w-md leading-relaxed">
              Dedicated experiences for students, drivers, administrators, and parents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {title:'Student Portal',label:'Students',href:'/student',color:'#059669',
                desc:'Track your bus live, get smart ETA alerts, and stay safe with one-tap SOS.',
                features:['Live bus tracking','Smart ETA alarm','Push notifications','SOS button','Lost & Found']},
              {title:'Driver Portal',label:'Drivers',href:'/driver',color:'#d97706',
                desc:'Manage trips, share GPS location, and monitor your safety score in real-time.',
                features:['Trip management','GPS sharing','Safety score','SOS emergency','Route status']},
              {title:'Admin Panel',label:'Administrators',href:'/admin',color:'#3b82f6',
                desc:'Command the entire fleet with live maps, analytics heatmaps, and emergency alerts.',
                features:['Fleet monitoring','Analytics & heatmaps','Driver rankings','Emergency alerts','Manage routes']},
              {title:'Parent Portal',label:'Parents',href:'/parent',color:'#9C27B0',
                desc:'Track your child, receive notifications, and monitor safety in real-time.',
                features:['Child tracking','Live notifications','ETA alerts','Safety monitoring','Route status']},
            ].map(d => (
              <Link key={d.title} href={d.href} className="portal-card glass rounded-2xl p-8 block group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px" style={{background:`linear-gradient(90deg,transparent,${d.color}45,transparent)`}} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{background:`radial-gradient(circle at 50% 0%,${d.color}08,transparent 65%)`}} />
                <div className="relative z-10">
                  <div className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-5" style={{color:d.color}}>{d.label}</div>
                  <h3 className="text-[21px] font-bold mb-3 text-[#0f172a]">{d.title}</h3>
                  <p className="text-[13px] text-[#64748b] mb-7 leading-relaxed">{d.desc}</p>
                  <ul className="space-y-2.5 mb-8">
                    {d.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#64748b]">
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{background:d.color}}/>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-[13px] font-medium group-hover:gap-3 transition-all duration-250" style={{color:d.color}}>
                    Open Portal <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass rounded-2xl p-14 lg:p-20 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(5,150,105,0.055) 0%,transparent 70%)'}} />
            <div className="absolute top-0 left-0 right-0 h-px neon-divider" />
            <div className="relative z-10">
              <h2 className="font-black tracking-tight mb-5" style={{fontSize:'clamp(2rem,4vw,3.2rem)'}}>
                The future of campus<br /><span className="gradient-text">transport is here.</span>
              </h2>
              <p className="text-[15px] text-[#64748b] max-w-md mx-auto mb-10 leading-relaxed">
                Join hundreds of students already using CampBus for smarter, safer, and more reliable college transport.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/student" className="btn-primary px-8 py-3.5 text-[14px] font-semibold text-white">Student Portal →</Link>
                <Link href="/driver" className="btn-glass px-8 py-3.5 text-[14px]">Driver Portal</Link>
                <Link href="/admin" className="btn-outline-green px-8 py-3.5 text-[14px]">Admin Panel</Link>
                <Link href="/parent" className="btn-outline-purple px-8 py-3.5 text-[14px]">Parent Portal</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-bg pt-14 pb-10 px-8 lg:px-16">
        <div className="neon-divider mb-12 max-w-[1400px] mx-auto" />
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#059669] to-[#009624] flex items-center justify-center text-sm font-black text-black">C</div>
              <div>
                <div className="font-semibold text-[#0f172a] text-[14px]">CampBus – A Smart App</div>
                <div className="text-[11px] text-[#94a3b8]">Smart Transport Platform</div>
              </div>
            </Link>

            <div className="flex flex-wrap justify-center gap-7">
              {[{l:'Student',h:'/student'},{l:'Driver',h:'/driver'},{l:'Admin',h:'/admin'},{l:'Parent',h:'/parent'},{l:'Features',h:'#features'},{l:'Safety',h:'#safety'}].map(l => (
                <Link key={l.l} href={l.h} className="text-[13px] text-[#94a3b8] hover:text-white/80 transition-colors duration-150 font-medium">{l.l}</Link>
              ))}
            </div>

            <div className="flex items-center gap-2 glass-g rounded-lg px-4 py-2 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              <span className="text-[#059669] font-medium">All Systems Operational</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-7 border-t border-[#e2e8f0]">
            <p className="text-[11px] text-[#94a3b8]">© 2025 CampBus – A Smart App</p>
            <p className="text-[11px] text-[#94a3b8]">Department of Computer Science & Engineering</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
