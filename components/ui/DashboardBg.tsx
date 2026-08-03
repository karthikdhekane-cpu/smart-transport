'use client';
import { useEffect, useRef } from 'react';

interface BusStrip {
  x: number;
  y: number;
  speed: number;
  color: string;
  w: number;
  h: number;
  alpha: number;
  trailX: number[];
}

export default function DashboardBg() {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.scale(DPR, DPR);
    };
    resize();
    window.addEventListener('resize', resize);

    /* horizontal bus strips at different Y positions */
    const strips: BusStrip[] = [
      { x: -200, y: H * 0.18, speed: 0.28, color: '#059669', w: 90, h: 18, alpha: 0.12, trailX: [] },
      { x: W * 0.4, y: H * 0.42, speed: 0.18, color: '#d97706', w: 70, h: 14, alpha: 0.08, trailX: [] },
      { x: W * 0.7, y: H * 0.68, speed: 0.22, color: '#3b82f6', w: 80, h: 16, alpha: 0.09, trailX: [] },
      { x: -100, y: H * 0.82, speed: 0.15, color: '#059669', w: 60, h: 12, alpha: 0.07, trailX: [] },
    ];

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      strips.forEach(s => {
        s.x += s.speed;
        if (s.x > W + s.w + 100) s.x = -s.w - 100;

        /* trail */
        s.trailX.push(s.x);
        if (s.trailX.length > 30) s.trailX.shift();

        if (s.trailX.length > 2) {
          const tg = ctx.createLinearGradient(s.trailX[0], s.y, s.x, s.y);
          tg.addColorStop(0, 'transparent');
          tg.addColorStop(1, s.color + '40');
          ctx.beginPath();
          ctx.moveTo(s.trailX[0], s.y);
          s.trailX.forEach(tx => ctx.lineTo(tx, s.y));
          ctx.strokeStyle = tg;
          ctx.lineWidth = s.h * 0.4;
          ctx.globalAlpha = s.alpha * 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        /* bus body */
        ctx.save();
        ctx.globalAlpha = s.alpha * 0.6;
        const r = s.h * 0.2;
        const bx = s.x - s.w / 2, by = s.y - s.h / 2;
        ctx.beginPath();
        ctx.moveTo(bx + r, by);
        ctx.lineTo(bx + s.w - r, by);
        ctx.quadraticCurveTo(bx + s.w, by, bx + s.w, by + r);
        ctx.lineTo(bx + s.w, by + s.h - r);
        ctx.quadraticCurveTo(bx + s.w, by + s.h, bx + s.w - r, by + s.h);
        ctx.lineTo(bx + r, by + s.h);
        ctx.quadraticCurveTo(bx, by + s.h, bx, by + s.h - r);
        ctx.lineTo(bx, by + r);
        ctx.quadraticCurveTo(bx, by, bx + r, by);
        ctx.closePath();
        const bg = ctx.createLinearGradient(bx, by, bx, by + s.h);
        bg.addColorStop(0, 'rgba(28,30,34,0.9)');
        bg.addColorStop(1, 'rgba(14,16,18,0.95)');
        ctx.fillStyle = bg;
        ctx.fill();

        /* accent stripe */
        ctx.beginPath();
        ctx.rect(bx, by, s.w, s.h * 0.22);
        const sg = ctx.createLinearGradient(bx, by, bx + s.w, by);
        sg.addColorStop(0, s.color + '00');
        sg.addColorStop(0.4, s.color + 'aa');
        sg.addColorStop(0.6, s.color + 'aa');
        sg.addColorStop(1, s.color + '00');
        ctx.fillStyle = sg;
        ctx.fill();

        /* headlight */
        const hlg = ctx.createRadialGradient(bx + s.w, s.y, 0, bx + s.w, s.y, s.h * 0.7);
        hlg.addColorStop(0, s.color + 'cc');
        hlg.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(bx + s.w, s.y, s.h * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = hlg;
        ctx.fill();

        ctx.restore();
      });

      /* subtle horizontal route lines */
      if (frame % 2 === 0) {
        strips.forEach(s => {
          ctx.beginPath();
          ctx.moveTo(0, s.y);
          ctx.lineTo(W, s.y);
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = 0.03;
          ctx.setLineDash([16, 12]);
          ctx.lineDashOffset = -(frame * s.speed * 0.5);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
        });
      }

      raf.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1, zIndex: 0, willChange: 'transform' }}
    />
  );
}
