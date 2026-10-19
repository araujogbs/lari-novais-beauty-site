/** Mês sinódico (de uma lua nova à seguinte), em dias. */
const SYNODIC_DAYS = 29.530588853;
/** Lua nova de referência: 6 de janeiro de 2000, 18:14 UTC. */
const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

export const MOON_PHASE_NAMES: readonly string[] = [
  'Lua nova',
  'Lua crescente',
  'Quarto crescente',
  'Crescente gibosa',
  'Lua cheia',
  'Minguante gibosa',
  'Quarto minguante',
  'Lua minguante',
];

/** A mesma fase para completar "a lua está…". */
export const MOON_PHASE_STATES: readonly string[] = [
  'nova',
  'crescente',
  'em quarto crescente',
  'crescente gibosa',
  'cheia',
  'minguante gibosa',
  'em quarto minguante',
  'minguante',
];

export interface MoonInfo {
  /** Posição no ciclo: 0 = nova, 0,5 = cheia, perto de 1 = nova de novo. */
  phase: number;
  /** Fração iluminada do disco, de 0 a 1. */
  illumination: number;
  /** Índice em MOON_PHASE_NAMES. */
  index: number;
  name: string;
  /** Ex.: "em quarto crescente", para "a lua está em quarto crescente". */
  state: string;
}

export function moonInfo(date: Date = new Date()): MoonInfo {
  const days = (date.getTime() - REF_NEW_MOON) / 86_400_000;
  const phase = (((days % SYNODIC_DAYS) + SYNODIC_DAYS) % SYNODIC_DAYS) / SYNODIC_DAYS;
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const index = Math.floor(phase * 8 + 0.5) % 8;
  return {
    phase,
    illumination,
    index,
    name: MOON_PHASE_NAMES[index] ?? 'Lua',
    state: MOON_PHASE_STATES[index] ?? '',
  };
}

/**
 * Caminho SVG da parte iluminada da lua (centro 0,0 e raio r), como se vê do hemisfério norte:
 * a crescente acende pela direita. No Brasil se vê espelhado; quem desenha aplica `scale(-1 1)`.
 */
export function moonLitPath(phase: number, r: number): string {
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  if (illumination < 0.01) return '';
  const rx = (r * Math.abs(Math.cos(2 * Math.PI * phase))).toFixed(2);
  const waxing = phase < 0.5;
  const outer = `M0 ${-r} A${r} ${r} 0 0 ${waxing ? 1 : 0} 0 ${r}`;
  // O terminador é meia elipse: curva para o lado aceso na crescente e na minguante, para o outro nas gibosas.
  const sweep = waxing ? (phase < 0.25 ? 0 : 1) : phase < 0.75 ? 0 : 1;
  return `${outer} A${rx} ${r} 0 0 ${sweep} 0 ${-r}Z`;
}
