import { useEffect, useRef } from 'react';
import { prefersReducedMotion, SPARKLE_BURST_EVENT, SPARKLE_PATH } from '../lib/motion';

/** Ajusta o canvas ao tamanho da janela, com nitidez em telas de alta densidade. */
function fitCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  gold: boolean;
}

/** Céu estrelado do modo noturno: estrelas brancas e douradas cintilando ao fundo. */
export function StarrySky() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const still = prefersReducedMotion();
    let stars: Star[] = [];
    let raf = 0;

    const seed = (): void => {
      fitCanvas(canvas, ctx);
      const count = Math.round((window.innerWidth * window.innerHeight) / 7000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.2 + 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.9 + 0.3,
        gold: Math.random() < 0.18,
      }));
    };
    const draw = (t: number): void => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const s of stars) {
        const a = still ? 0.7 : 0.35 + 0.65 * Math.abs(Math.sin(s.phase + t * 0.001 * s.speed));
        ctx.fillStyle = s.gold ? `rgba(240, 212, 160, ${a})` : `rgba(255, 255, 255, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    const loop = (t: number): void => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const onResize = (): void => {
      seed();
      if (still) draw(0);
    };

    seed();
    if (still) draw(0);
    else raf = requestAnimationFrame(loop);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className="starry-sky" aria-hidden="true" />;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  rot: number;
  gold: boolean;
}

/**
 * Chuva de estrelinhas disparada por `sparkleBurst` (ex.: ao concluir um agendamento).
 */
export function SparkleTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || prefersReducedMotion()) return;
    const star = new Path2D(SPARKLE_PATH);
    let parts: Particle[] = [];
    let raf = 0;
    fitCanvas(canvas, ctx);

    const night = (): boolean => document.documentElement.dataset.theme === 'dark';
    const tick = (): void => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      parts = parts.filter((p) => p.life > 0);
      for (const p of parts) {
        p.life--;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.98;
        p.rot += 0.05;
        const a = p.life / p.max;
        const s = p.size * a + 0.15;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(s, s);
        ctx.fillStyle = p.gold
          ? `rgba(214, 176, 108, ${a})`
          : night()
            ? `rgba(240, 212, 160, ${a})`
            : `rgba(194, 83, 122, ${a})`;
        ctx.fill(star);
        ctx.restore();
      }
      raf = parts.length ? requestAnimationFrame(tick) : 0;
    };
    const spawn = (x: number, y: number, n: number, speed: number, life: number): void => {
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const v = Math.random() * speed;
        parts.push({
          x,
          y,
          vx: Math.cos(ang) * v,
          vy: Math.sin(ang) * v - (speed > 3 ? 2 : 0.3),
          life,
          max: life,
          size: Math.random() * 0.7 + 0.35,
          rot: Math.random() * Math.PI * 2,
          gold: Math.random() < 0.5,
        });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onBurst = (e: Event): void => {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      spawn(x, y, 70, 6, 80);
      setTimeout(() => {
        spawn(x, y - 20, 40, 4.5, 70);
      }, 180);
    };
    const onResize = (): void => {
      fitCanvas(canvas, ctx);
    };

    window.addEventListener(SPARKLE_BURST_EVENT, onBurst);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(SPARKLE_BURST_EVENT, onBurst);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className="sparkle-trail" aria-hidden="true" />;
}
