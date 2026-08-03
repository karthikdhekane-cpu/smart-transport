'use client';
import { useEffect, useRef } from 'react';

/* ─ types ─ */
interface Vec2 { x: number; y: number }
interface BusObj {
  t: number;
  speed: number;
  lane: number;
  color: string;
  glowColor: string;
  trailPts: Vec2[];
  pulsePhase: number;
  depth: number;       // 0 = far, 1 = near
  blurAlpha: number;
  width: number;
  height: number;
}
interface Particle { x:number; y:number; vx:number; vy:number; life:number; maxLife:number; r:number; color:string }
interface Ring { x:number; y:number; r:number; maxR:number; a:number; color:string }
interface LightStreak { x:number; y:number; len:number; speed:number; alpha:number; color:string; vy:number }

/* ─ bezier lanes (normalized 0-1) ─ */
const LANES = [
  { p0:[0,0.68], c1:[0.25,0.50], c2:[0.55,0.32], p1:[1,0.14], color:'#059669', glow:'rgba(5,150,105,' },
  { p0:[0,0.80], c1:[0.22,0.62], c2:[0.52,0.44], p1:[1,0.26], color:'#d97706', glow:'rgba(217,119,6,' },
  { p0:[0,0.90], c1:[0.28,0.72], c2:[0.58,0.54], p1:[1,0.38], color:'#3b82f6', glow:'rgba(59,130,246,' },
  { p0:[0.05,1], c1:[0.32,0.78], c2:[0.62,0.60], p1:[1,0.50], color:'#059669', glow:'rgba(5,150,105,' },
];

function bezier(lane: typeof LANES[0], t: number, W: number, H: number): Vec2 {
  const mt = 1 - t;
  return {
    x: (mt*mt*mt*lane.p0[0] + 3*mt*mt*t*lane.c1[0] + 3*mt*t*t*lane.c2[0] + t*t*t*lane.p1[0]) * W,
    y: (mt*mt*mt*lane.p0[1] + 3*mt*mt*t*lane.c1[1] + 3*mt*t*t*lane.c2[1] + t*t*t*lane.p1[1]) * H,
  };
}

/* ─ draw a realistic bus silhouette ─ */
function drawBus(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, color: string, alpha: number, blur: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  if (blur > 0) { ctx.filter = `blur(${blur}px)`; }

  const x = cx - w / 2;
  const y = cy - h / 2;
  const r = h * 0.18; // corner radius

  // Body
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();

  // Body gradient
  const bodyGrad = ctx.createLinearGradient(x, y, x, y + h);
  bodyGrad.addColorStop(0, 'rgba(30,32,36,0.92)');
  bodyGrad.addColorStop(0.5, 'rgba(18,20,24,0.95)');
  bodyGrad.addColorStop(1, 'rgba(10,12,14,0.98)');
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Accent stripe along top
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h * 0.22);
  ctx.lineTo(x, y + h * 0.22);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  const stripeGrad = ctx.createLinearGradient(x, y, x + w, y);
  stripeGrad.addColorStop(0, color + '00');
  stripeGrad.addColorStop(0.3, color + 'cc');
  stripeGrad.addColorStop(0.7, color + 'cc');
  stripeGrad.addColorStop(1, color + '00');
  ctx.fillStyle = stripeGrad;
  ctx.fill();

  // Windows row
  const winCount = Math.max(2, Math.floor(w / (h * 0.55)));
  const winW = (w * 0.62) / winCount;
  const winH = h * 0.28;
  const winY = y + h * 0.28;
  const winStartX = x + w * 0.12;
  for (let i = 0; i < winCount; i++) {
    const wx = winStartX + i * (winW + winW * 0.25);
    const wr = winH * 0.2;
    ctx.beginPath();
    ctx.moveTo(wx + wr, winY);
    ctx.lineTo(wx + winW - wr, winY);
    ctx.quadraticCurveTo(wx + winW, winY, wx + winW, winY + wr);
    ctx.lineTo(wx + winW, winY + winH - wr);
    ctx.quadraticCurveTo(wx + winW, winY + winH, wx + winW - wr, winY + winH);
    ctx.lineTo(wx + wr, winY + winH);
    ctx.quadraticCurveTo(wx, winY + winH, wx, winY + winH - wr);
    ctx.lineTo(wx, winY + wr);
    ctx.quadraticCurveTo(wx, winY, wx + wr, winY);
    ctx.closePath();
    const winGrad = ctx.createLinearGradient(wx, winY, wx, winY + winH);
    winGrad.addColorStop(0, 'rgba(120,180,255,0.18)');
    winGrad.addColorStop(1, 'rgba(60,100,180,0.08)');
    ctx.fillStyle = winGrad;
    ctx.fill();
    ctx.strokeStyle = color + '40';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Headlight (right side = front)
  const hlY = cy + h * 0.05;
  const hlX = x + w - h * 0.08;
  const hlGrad = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, h * 0.18);
  hlGrad.addColorStop(0, color + 'ff');
  hlGrad.addColorStop(0.4, color + '80');
  hlGrad.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(hlX, hlY, h * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = hlGrad;
  ctx.fill();

  // Taillight (left side)
  const tlX = x + h * 0.08;
  ctx.beginPath();
  ctx.arc(tlX, hlY, h * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(239,68,68,0.5)';
  ctx.fill();

  // Undercarriage glow
  const ugGrad = ctx.createLinearGradient(x, y + h, x + w, y + h);
  ugGrad.addColorStop(0, 'transparent');
  ugGrad.addColorStop(0.5, color + '30');
  ugGrad.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.ellipse(cx, y + h + 2, w * 0.45, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fillStyle = ugGrad;
  ctx.fill();

  // Outer glow halo
  const haloGrad = ctx.createRadialGradient(cx, cy, w * 0.3, cx, cy, w * 0.75);
  haloGrad.addColorStop(0, color + '00');
  haloGrad.addColorStop(0.6, color + '08');
  haloGrad.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.ellipse(cx, cy, w * 0.75, h * 0.9, 0, 0, Math.PI * 2);
  ctx.fillStyle = haloGrad;
  ctx.fill();

  ctx.filter = 'none';
  ctx.restore();
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const mouse = useRef<Vec2>({ x: 0.5, y: 0.5 });
  const scroll = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    let W = 0, H = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.scale(DPR, DPR);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      mouse.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    const onScroll = () => { scroll.current = window.scrollY; };
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ─ init buses ─ */
    const buses: BusObj[] = LANES.map((lane, i) => {
      const depth = 0.3 + (i / LANES.length) * 0.7;
      const scale = 0.5 + depth * 0.5;
      return {
        t: i * 0.25,
        speed: (0.00035 + Math.random() * 0.00025) * (1 + depth * 0.4),
        lane: i,
        color: lane.color,
        glowColor: lane.glow,
        trailPts: [],
        pulsePhase: Math.random() * Math.PI * 2,
        depth,
        blurAlpha: 0,
        width: (80 + depth * 60) * scale,
        height: (22 + depth * 14) * scale,
      };
    });

    /* ─ particles ─ */
    const particles: Particle[] = [];
    const spawnParticle = () => {
      if (particles.length > 80) return;
      const li = Math.floor(Math.random() * LANES.length);
      const t = Math.random();
      const pos = bezier(LANES[li], t, W, H);
      particles.push({
        x: pos.x + (Math.random() - 0.5) * 30,
        y: pos.y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.4,
        life: 0, maxLife: 80 + Math.random() * 100,
        r: 0.8 + Math.random() * 1.4,
        color: LANES[li].color,
      });
    };

    /* ─ GPS rings ─ */
    const rings: Ring[] = [];
    const spawnRing = () => {
      const li = Math.floor(Math.random() * LANES.length);
      const bus = buses[li];
      const pos = bezier(LANES[li], Math.max(0, Math.min(1, bus.t)), W, H);
      rings.push({ x: pos.x, y: pos.y, r: 0, maxR: 30 + Math.random() * 25, a: 1, color: LANES[li].color });
    };

    /* ─ light streaks ─ */
    const streaks: LightStreak[] = [];
    const spawnStreak = () => {
      if (streaks.length > 12) return;
      streaks.push({
        x: Math.random() * W,
        y: H * (0.1 + Math.random() * 0.8),
        len: 40 + Math.random() * 80,
        speed: 1.5 + Math.random() * 2.5,
        alpha: 0,
        color: Math.random() > 0.5 ? '#00C853' : '#E8B84B',
        vy: (Math.random() - 0.5) * 0.3,
      });
    };

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      const mx = mouse.current.x, my = mouse.current.y;
      const scrollFactor = 1 + scroll.current * 0.0003;
      const px = (mx - 0.5) * 16, py = (my - 0.5) * 8;

      /* spawn */
      if (frame % 5 === 0) spawnParticle();
      if (frame % 70 === 0) spawnRing();
      if (frame % 45 === 0) spawnStreak();

      /* ── LAYER 1: perspective road grid ── */
      ctx.save();
      ctx.translate(px * 0.2, py * 0.2);
      const vp = { x: W * (0.5 + (mx - 0.5) * 0.06), y: H * 0.28 };
      for (let i = 0; i <= 14; i++) {
        const xn = (i / 14) * W;
        ctx.beginPath();
        ctx.moveTo(xn, H);
        ctx.lineTo(vp.x + (xn - vp.x) * 0.08, vp.y);
        ctx.strokeStyle = 'rgba(0,200,83,0.04)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      for (let j = 0; j <= 10; j++) {
        const t = j / 10;
        const y = vp.y + (H - vp.y) * t;
        const xl = vp.x - vp.x * (1 - t * 0.92);
        const xr = vp.x + (W - vp.x) * (1 - t * 0.92);
        ctx.beginPath();
        ctx.moveTo(xl, y); ctx.lineTo(xr, y);
        ctx.strokeStyle = `rgba(0,200,83,${0.02 + t * 0.04})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      ctx.restore();

      /* ── LAYER 2: route bezier paths ── */
      ctx.save();
      ctx.translate(px * 0.12, py * 0.12);
      LANES.forEach((lane, li) => {
        const depth = buses[li].depth;
        ctx.beginPath();
        ctx.moveTo(lane.p0[0] * W, lane.p0[1] * H);
        ctx.bezierCurveTo(
          lane.c1[0] * W, lane.c1[1] * H,
          lane.c2[0] * W, lane.c2[1] * H,
          lane.p1[0] * W, lane.p1[1] * H
        );
        ctx.strokeStyle = lane.color;
        ctx.lineWidth = 0.8 + depth * 0.6;
        ctx.globalAlpha = 0.07 + depth * 0.05;
        ctx.setLineDash([12, 8]);
        ctx.lineDashOffset = -(frame * 0.4 * buses[li].speed * 800);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      });
      ctx.restore();

      /* ── LAYER 3: GPS rings ── */
      rings.forEach((ring, i) => {
        ring.r += 0.7;
        ring.a = Math.max(0, 1 - ring.r / ring.maxR);
        ctx.beginPath();
        ctx.arc(ring.x + px * 0.15, ring.y + py * 0.15, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = ring.a * 0.55;
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (ring.r >= ring.maxR) rings.splice(i, 1);
      });

      /* ── LAYER 4: light streaks ── */
      streaks.forEach((s, i) => {
        s.x += s.speed;
        s.y += s.vy;
        s.alpha = s.x < W * 0.1 ? s.x / (W * 0.1) : s.x > W * 0.9 ? (W - s.x) / (W * 0.1) : 0.6;
        const grad = ctx.createLinearGradient(s.x - s.len, s.y, s.x, s.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, s.color + '55');
        ctx.beginPath();
        ctx.moveTo(s.x - s.len, s.y);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = s.alpha * 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (s.x > W + s.len) streaks.splice(i, 1);
      });

      /* ── LAYER 5: particles ── */
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life++;
        const a = Math.sin((p.life / p.maxLife) * Math.PI) * 0.55;
        ctx.beginPath();
        ctx.arc(p.x + px * 0.08, p.y + py * 0.08, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = a;
        ctx.fill();
        ctx.globalAlpha = 1;
        if (p.life >= p.maxLife) particles.splice(i, 1);
      });

      /* ── LAYER 6: buses (sorted by depth, far first) ── */
      const sorted = [...buses].sort((a, b) => a.depth - b.depth);
      sorted.forEach(bus => {
        const laneData = LANES[bus.lane];
        bus.t += bus.speed * scrollFactor;
        if (bus.t > 1.06) bus.t = -0.06;

        const t = Math.max(0, Math.min(1, bus.t));
        const pos = bezier(laneData, t, W, H);
        const bx = pos.x + px * (0.1 + bus.depth * 0.15);
        const by = pos.y + py * (0.1 + bus.depth * 0.15);

        /* trail */
        bus.trailPts.push({ x: bx, y: by });
        if (bus.trailPts.length > 40) bus.trailPts.shift();

        if (bus.trailPts.length > 3) {
          const tg = ctx.createLinearGradient(
            bus.trailPts[0].x, bus.trailPts[0].y, bx, by
          );
          tg.addColorStop(0, 'transparent');
          tg.addColorStop(1, bus.color + '55');
          ctx.beginPath();
          ctx.moveTo(bus.trailPts[0].x, bus.trailPts[0].y);
          bus.trailPts.forEach(pt => ctx.lineTo(pt.x, pt.y));
          ctx.strokeStyle = tg;
          ctx.lineWidth = 1.5 + bus.depth;
          ctx.globalAlpha = 0.45 + bus.depth * 0.2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        /* motion blur ghost */
        if (bus.trailPts.length > 8) {
          const ghost = bus.trailPts[bus.trailPts.length - 8];
          drawBus(ctx, ghost.x, ghost.y, bus.width * 1.05, bus.height, bus.color, 0.06, 3);
        }

        /* main bus */
        const pulse = Math.sin(Date.now() * 0.0015 + bus.pulsePhase) * 0.5 + 0.5;
        const baseAlpha = 0.55 + bus.depth * 0.35;
        drawBus(ctx, bx, by, bus.width, bus.height, bus.color, baseAlpha, 0);

        /* headlight beam */
        const beamLen = bus.width * (0.8 + pulse * 0.3);
        const beamGrad = ctx.createLinearGradient(bx + bus.width * 0.5, by, bx + bus.width * 0.5 + beamLen, by);
        beamGrad.addColorStop(0, bus.color + '30');
        beamGrad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.moveTo(bx + bus.width * 0.5, by - bus.height * 0.15);
        ctx.lineTo(bx + bus.width * 0.5 + beamLen, by - bus.height * 0.4);
        ctx.lineTo(bx + bus.width * 0.5 + beamLen, by + bus.height * 0.4);
        ctx.lineTo(bx + bus.width * 0.5, by + bus.height * 0.15);
        ctx.closePath();
        ctx.fillStyle = beamGrad;
        ctx.globalAlpha = 0.25 + pulse * 0.1;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.72, willChange: 'transform' }}
    />
  );
}
