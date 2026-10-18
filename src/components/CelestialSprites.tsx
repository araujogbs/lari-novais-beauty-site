import type { CSSProperties, ReactElement } from 'react';

type Kind = 'sun' | 'moon' | 'constellation';

interface Sprite {
  kind: Kind;
  top: string;
  side: 'left' | 'right';
  size: number;
  /** Quanto da peça sai da tela, de 0 (inteira visível) a 1 (toda fora). */
  bleed: number;
  flip?: boolean;
}

const RAY_COUNT = 24;
const SPARKLE = 'M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6Z';

/** Sol de tarô: coroa de raios alternados, anéis e pontos de luz. */
function SunMandala(): ReactElement {
  const rays = Array.from({ length: RAY_COUNT }, (_, i) => i * (360 / RAY_COUNT));
  const dots = Array.from({ length: 48 }, (_, i) => i * (360 / 48));
  return (
    <svg viewBox="-100 -100 200 200" fill="none" stroke="currentColor" strokeWidth="0.5">
      <circle r="97" strokeDasharray="0.5 3" />
      <circle r="62" />
      <circle r="56" strokeDasharray="2 2" />
      <circle r="34" />
      <circle r="28" />
      {rays.map((deg, i) => (
        <path
          key={deg}
          transform={`rotate(${deg})`}
          d={i % 2 === 0 ? 'M0 -64 Q5 -78 0 -92 Q-5 -78 0 -64Z' : 'M0 -64 L0 -80'}
        />
      ))}
      {dots.map((deg) => (
        <circle key={deg} r="0.7" cx="0" cy="-97" fill="currentColor" stroke="none" transform={`rotate(${deg})`} />
      ))}
      <path d={SPARKLE} fill="currentColor" stroke="none" transform="scale(2.2)" />
    </svg>
  );
}

/** Lua de tarô: crescente dentro de órbitas, com estrelas. */
function MoonOrbit(): ReactElement {
  const stars: [number, number, number][] = [
    [-62, -48, 0.9],
    [58, -60, 0.6],
    [70, 34, 0.8],
    [-70, 52, 0.55],
    [8, 78, 0.7],
    [-18, -82, 0.5],
  ];
  return (
    <svg viewBox="-100 -100 200 200" fill="none" stroke="currentColor" strokeWidth="0.5">
      <circle r="96" />
      <circle r="90" strokeDasharray="0.5 3.5" />
      <circle r="72" strokeDasharray="6 3" />
      <path d="M31 -39.2 A50 50 0 1 0 31 39.2 A42 42 0 1 1 31 -39.2Z" transform="rotate(-25) scale(1.1)" />
      <path d="M26 -30 A38 38 0 1 0 26 30 A31 31 0 1 1 26 -30Z" transform="rotate(-25) scale(1.1)" opacity="0.6" />
      {stars.map(([x, y, k]) => (
        <path
          key={`${x}${y}`}
          d={SPARKLE}
          fill="currentColor"
          stroke="none"
          transform={`translate(${x} ${y}) scale(${k})`}
        />
      ))}
    </svg>
  );
}

/** Pequena constelação ligando estrelas com linhas finas. */
function Constellation(): ReactElement {
  const pts: [number, number][] = [
    [10, 70],
    [30, 45],
    [52, 56],
    [70, 24],
    [92, 38],
  ];
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.4">
      <polyline points={pts.map((p) => p.join(',')).join(' ')} strokeDasharray="1.5 2" />
      {pts.map(([x, y], i) => (
        <path
          key={`${x}${y}`}
          d={SPARKLE}
          fill="currentColor"
          stroke="none"
          transform={`translate(${x} ${y}) scale(${i % 2 === 0 ? 0.7 : 0.45})`}
        />
      ))}
    </svg>
  );
}

/** Fases da lua em linha fina, usada como assinatura no hero. */
export function MoonPhases(): ReactElement {
  const full = 'M0 -12 A12 12 0 1 1 0 12 A12 12 0 1 1 0 -12Z';
  const phases: { d?: string; fill: boolean }[] = [
    { fill: false },
    { d: 'M0 -12 A12 12 0 0 1 0 12 A6 12 0 0 0 0 -12Z', fill: true },
    { d: 'M0 -12 A12 12 0 0 1 0 12Z', fill: true },
    { d: 'M0 -12 A12 12 0 0 1 0 12 A6 12 0 0 1 0 -12Z', fill: true },
    { d: full, fill: true },
    { d: 'M0 -12 A12 12 0 0 0 0 12 A6 12 0 0 0 0 -12Z', fill: true },
    { d: 'M0 -12 A12 12 0 0 0 0 12Z', fill: true },
    { d: 'M0 -12 A12 12 0 0 0 0 12 A6 12 0 0 1 0 -12Z', fill: true },
    { fill: false },
  ];
  return (
    <svg
      className="moon-phases"
      viewBox="0 0 270 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      aria-hidden="true"
    >
      {phases.map((p, i) => (
        <g key={i} transform={`translate(${15 + i * 30} 15)`}>
          <circle r="12" />
          {p.fill && <path d={p.d} fill="currentColor" stroke="none" />}
        </g>
      ))}
    </svg>
  );
}

const PATTERN: readonly { kind: Kind; size: number; bleed: number }[] = [
  { kind: 'sun', size: 400, bleed: 0.5 },
  { kind: 'constellation', size: 190, bleed: 0.06 },
  { kind: 'moon', size: 360, bleed: 0.15 },
  { kind: 'constellation', size: 170, bleed: 0.06 },
  { kind: 'moon', size: 420, bleed: 0.2 },
  { kind: 'sun', size: 340, bleed: 0.5 },
];

const COUNT = 30;

/** Distribui as peças pelos cantos da página, alternando esquerda e direita. */
const SPRITES: readonly Sprite[] = Array.from({ length: COUNT }, (_, i) => {
  const base = PATTERN[i % PATTERN.length] ?? { kind: 'sun' as const, size: 380, bleed: 0.5 };
  return {
    ...base,
    top: `${1 + i * (95 / COUNT)}%`,
    side: i % 2 === 0 ? 'right' : 'left',
    flip: i % 4 === 1,
  };
});

const ART: Record<Kind, () => ReactElement> = { sun: SunMandala, moon: MoonOrbit, constellation: Constellation };

/** Sóis, luas e constelações de inspiração mística ao fundo do site, bem sutis. */
export function CelestialSprites() {
  return (
    <div className="celestial" aria-hidden="true">
      {SPRITES.map((s, i) => {
        const Art = ART[s.kind];
        const style: CSSProperties = {
          top: s.top,
          [s.side]: -s.size * s.bleed,
          width: s.size,
          height: s.size,
          animationDelay: `${-i * 7}s`,
        };
        return (
          <span
            key={i}
            className={`celestial-sprite celestial-${s.kind}${s.flip ? ' celestial-flip' : ''}`}
            style={style}
          >
            <Art />
          </span>
        );
      })}
    </div>
  );
}
