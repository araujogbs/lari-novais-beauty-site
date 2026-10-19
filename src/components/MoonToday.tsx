import { moonInfo, moonLitPath } from '../lib/moon';

const PHASES = Array.from({ length: 8 }, (_, k) => k / 8);

/** A lua de hoje, calculada de verdade e desenhada como se vê do Brasil (hemisfério sul). */
export function MoonToday() {
  const moon = moonInfo();
  const today = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    timeZone: 'America/Sao_Paulo',
  });

  return (
    <div className="moon-today">
      <div className="moon-phases" aria-hidden="true">
        {PHASES.map((p, k) => (
          <svg key={p} viewBox="-14 -14 28 28" className={k === moon.index ? 'now' : undefined}>
            <circle r="12" fill="none" stroke="currentColor" strokeWidth="0.9" />
            <path d={moonLitPath(p, 12)} fill="currentColor" transform="scale(-1 1)" />
          </svg>
        ))}
      </div>
      <p className="moon-caption">
        Hoje, {today}, a lua está <strong>{moon.state}</strong>, {Math.round(moon.illumination * 100)}% iluminada
      </p>
    </div>
  );
}
