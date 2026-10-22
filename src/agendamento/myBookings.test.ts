import { afterEach, describe, expect, it } from 'vitest';
import { addToken, getTokens, tokenFromHash } from './myBookings';

afterEach(() => {
  localStorage.clear();
});

describe('myBookings', () => {
  it('guarda o código mais novo primeiro, sem repetir, até 20', () => {
    addToken('1.a');
    addToken('2.b');
    addToken('1.a');
    expect(getTokens()).toEqual(['1.a', '2.b']);
    for (let i = 3; i < 30; i++) addToken(`${i}.x`);
    expect(getTokens()).toHaveLength(20);
  });

  it('ignora armazenamento corrompido', () => {
    localStorage.setItem('lari.agendamentos', '{nao-e-lista');
    expect(getTokens()).toEqual([]);
  });

  it('lê o código só de um link no formato #ag=código', () => {
    expect(tokenFromHash('#ag=12.AbC_-9')).toBe('12.AbC_-9');
    expect(tokenFromHash('#agendar')).toBeNull();
    expect(tokenFromHash('#ag=<script>')).toBeNull();
    expect(tokenFromHash('')).toBeNull();
  });
});
