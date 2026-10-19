import { useEffect, useId, useRef } from 'react';
import { CONSTELLATIONS, type ConstellationId } from '../data/constellations';
import { prefersReducedMotion, SPARKLE_PATH } from '../lib/motion';

/** Quanto da constelação está desenhada (0 a 1) conforme ela sobe pela tela. */
function scrollProgress(el: Element): number {
  const r = el.getBoundingClientRect();
  const p = (window.innerHeight - r.top) / (window.innerHeight * 0.6 + r.height * 0.5);
  return Math.min(1, Math.max(0, p));
}

interface Props {
  id: ConstellationId;
  /** Canto da seção onde ela fica; as seções alternam direita e esquerda. */
  side: 'left' | 'right';
}

/**
 * Constelação que se desenha com a rolagem: as linhas ligam as estrelas uma a uma.
 * O botão de estrela conta a história dela (ao passar o mouse, focar ou tocar).
 */
export function Constellation({ id, side }: Props) {
  const data = CONSTELLATIONS[id];
  const tipId = useId();
  const figure = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = figure.current;
    if (!el) return;
    const lines = [...el.querySelectorAll<SVGLineElement>('.cst-line')];
    const stars = [...el.querySelectorAll<SVGGElement>('.cst-star')];
    const total = data.lines.length;
    // Cada estrela acende quando a primeira linha que chega nela começa a ser traçada.
    const starAt = data.stars.map((_, i) => {
      const k = data.lines.findIndex(([a, b]) => a === i || b === i);
      return k < 0 ? 1 : k / total;
    });

    const paint = (p: number): void => {
      lines.forEach((line, k) => {
        line.style.strokeDashoffset = String(1 - Math.min(1, Math.max(0, p * total - k)));
      });
      stars.forEach((star, i) => {
        star.classList.toggle('on', p > 0 && p >= (starAt[i] ?? 1) - 0.001);
      });
      el.classList.toggle('cst-done', p >= 1);
    };

    if (prefersReducedMotion()) {
      paint(1);
      return;
    }
    let raf = 0;
    const onScroll = (): void => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        paint(scrollProgress(el));
      });
    };
    paint(scrollProgress(el));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [data]);

  return (
    <figure className={`constellation constellation--${side}`} ref={figure}>
      <svg viewBox="0 0 400 240" role="img" aria-label={`Constelação ${data.name}`}>
        {data.lines.map(([a, b]) => {
          const s1 = data.stars[a];
          const s2 = data.stars[b];
          if (!s1 || !s2) return null;
          return <line key={`${a}-${b}`} className="cst-line" x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} pathLength={1} />;
        })}
        {data.stars.map((s) => (
          <g key={`${s.x},${s.y}`} transform={`translate(${s.x} ${s.y})`}>
            <g className="cst-star">
              <path d={SPARKLE_PATH} transform={`scale(${s.size})`} />
            </g>
            {s.label && (
              <text className="cst-label" y={22} textAnchor="middle">
                {s.label}
              </text>
            )}
          </g>
        ))}
      </svg>
      <figcaption>
        <span className="cst-name">{data.name}</span>
        <span className="cst-nick">{data.nickname}</span>
        <button
          type="button"
          className="cst-info"
          aria-label={`Sobre a constelação ${data.name}`}
          aria-describedby={tipId}
        >
          <svg viewBox="-8 -8 16 16" aria-hidden="true">
            <path d={SPARKLE_PATH} />
          </svg>
          <span className="cst-tip" role="tooltip" id={tipId}>
            {data.about}
          </span>
        </button>
      </figcaption>
    </figure>
  );
}
