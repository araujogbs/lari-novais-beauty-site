import { useSyncExternalStore } from 'react';

const noop = (): (() => void) => () => undefined;

/**
 * `false` no HTML pré-renderizado e no primeiro render da hidratação; `true` logo depois.
 * Para o que depende do aparelho (tema, data de hoje) não divergir do HTML do build.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
