import { describe, expect, it } from 'vitest';
import { moonInfo, moonLitPath } from './moon';

describe('moonInfo', () => {
  it('reconhece luas conhecidas', () => {
    // Lua nova em 10/10/2026 e lua cheia em 26/10/2026 (aprox. 04:12 UTC)
    expect(moonInfo(new Date('2026-10-10T16:00:00Z')).name).toBe('Lua nova');
    const full = moonInfo(new Date('2026-10-26T04:12:00Z'));
    expect(full.name).toBe('Lua cheia');
    expect(full.state).toBe('cheia');
    expect(moonInfo(new Date('2026-10-18T16:00:00Z')).state).toBe('em quarto crescente');
    expect(full.illumination).toBeGreaterThan(0.98);
  });

  it('fica entre 0 e 1 também antes da data de referência', () => {
    const old = moonInfo(new Date('1990-05-01T00:00:00Z'));
    expect(old.phase).toBeGreaterThanOrEqual(0);
    expect(old.phase).toBeLessThan(1);
  });
});

describe('moonLitPath', () => {
  it('não desenha nada na lua nova e desenha o disco na cheia', () => {
    expect(moonLitPath(0, 10)).toBe('');
    expect(moonLitPath(0.5, 10)).toContain('A10.00 10');
  });
});
