const matches = (query: string): boolean => typeof window.matchMedia === 'function' && window.matchMedia(query).matches;

/** Quem pediu menos movimento nas configurações do aparelho não vê animações. */
export const prefersReducedMotion = (): boolean => matches('(prefers-reduced-motion: reduce)');

/** Mouse ou trackpad (efeitos de cursor ficam só no computador). */
export const hasFinePointer = (): boolean => matches('(pointer: fine)');

export const prefersDark = (): boolean => matches('(prefers-color-scheme: dark)');

/** Chuva de estrelinhas a partir de um ponto da tela (desenhada pelo SparkleTrail). */
export const SPARKLE_BURST_EVENT = 'ln:sparkle-burst';

export function sparkleBurst(x: number, y: number): void {
  window.dispatchEvent(new CustomEvent(SPARKLE_BURST_EVENT, { detail: { x, y } }));
}

/** Estrela de quatro pontas usada nos sprites, nas constelações e na chuva de estrelinhas. */
export const SPARKLE_PATH = 'M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6Z';
