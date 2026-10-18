import { afterEach, describe, expect, it, vi } from 'vitest';
import { brl, digits, fmtDateBR, maskCep, maskPhone, todayISO } from './utils';

describe('todayISO', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    ['2026-10-18T01:30:00Z', '2026-10-17'], // 22h30 de 17/10 em Brasília (em UTC já é dia 18)
    ['2026-10-18T03:00:00Z', '2026-10-18'], // meia-noite em Brasília
    ['2026-10-18T15:00:00Z', '2026-10-18'],
  ])('%s -> %s', (now, expected) => {
    vi.useFakeTimers({ now: new Date(now) });
    expect(todayISO()).toBe(expected);
  });
});

describe('maskPhone', () => {
  it.each([
    ['', ''],
    ['1', '(1'],
    ['11912', '(11) 912'],
    ['1191234', '(11) 9123-4'],
    ['11912345678', '(11) 91234-5678'],
    ['1133334444', '(11) 3333-4444'],
    ['119123456789999', '(11) 91234-5678'],
  ])('%s -> %s', (input, expected) => {
    expect(maskPhone(input)).toBe(expected);
  });
});

describe('maskCep', () => {
  it('formata com hífen e limita a 8 dígitos', () => {
    expect(maskCep('01310')).toBe('01310');
    expect(maskCep('01310100')).toBe('01310-100');
    expect(maskCep('013101009999')).toBe('01310-100');
  });
});

describe('helpers', () => {
  it('digits remove tudo que não é número', () => {
    expect(digits('(11) 91234-5678')).toBe('11912345678');
    expect(digits(null)).toBe('');
  });
  it('fmtDateBR converte ISO para dd/mm/aaaa', () => {
    expect(fmtDateBR('2026-10-15')).toBe('15/10/2026');
    expect(fmtDateBR('')).toBe('');
  });
  it('brl formata em reais', () => {
    expect(brl(290)).toMatch(/^R\$\s290,00$/);
    expect(brl(undefined)).toMatch(/^R\$\s0,00$/);
  });
});
