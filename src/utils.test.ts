import { afterEach, describe, expect, it, vi } from 'vitest';
import { brl, digits, fmtDateBR, isValidPhone, maskCep, maskPhone, todayISO } from './utils';

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
    // número colado com o 55 do país
    ['5511912345678', '(11) 91234-5678'],
    ['+55 11 91234-5678', '(11) 91234-5678'],
    ['551133334444', '(11) 3333-4444'],
    // DDD 55 de verdade (RS) continua valendo
    ['55991234567', '(55) 99123-4567'],
  ])('%s -> %s', (input, expected) => {
    expect(maskPhone(input)).toBe(expected);
  });
});

describe('isValidPhone', () => {
  it.each([
    ['(11) 91234-5678', true],
    ['(11) 3333-4444', true],
    ['(55) 99123-4567', true],
    ['+55 11 91234-5678', true],
    // 55 digitado no lugar do DDD: 11 dígitos, mas o 3º não é 9
    ['(55) 11959-6457', false],
    ['(11) 1234-5678', false],
    ['(01) 91234-5678', false],
    ['(11) 9123-4567', false],
    ['1191', false],
    ['', false],
  ])('%s -> %s', (input, expected) => {
    expect(isValidPhone(input)).toBe(expected);
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
