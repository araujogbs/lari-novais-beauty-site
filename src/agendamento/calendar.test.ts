import { describe, expect, it } from 'vitest';
import { addMonths, addMonthsToDate, availabilityLevel, googleCalendarUrl, icsContent, monthGrid } from './calendar';

const EVENT = { title: 'Maquiagem', details: 'Pedido em análise', date: '2026-11-07', start: '15:00', end: '16:30' };

describe('calendário', () => {
  it('monta o mês começando na segunda-feira', () => {
    // 1º de novembro de 2026 é um domingo: 6 casas vazias antes
    const nov = monthGrid('2026-11');
    expect(nov.blanks).toBe(6);
    expect(nov.days).toHaveLength(30);
    expect(nov.days[0]).toBe('2026-11-01');
    expect(monthGrid('2028-02').days).toHaveLength(29);
  });

  it('avança e volta meses atravessando o ano', () => {
    expect(addMonths('2026-12', 1)).toBe('2027-01');
    expect(addMonths('2027-01', -1)).toBe('2026-12');
  });

  it('calcula o último dia da agenda aberta (3 meses)', () => {
    expect(addMonthsToDate('2026-10-19', 3)).toBe('2027-01-19');
    // 30 de novembro + 3 meses: fevereiro não tem dia 30
    expect(addMonthsToDate('2026-11-30', 3)).toBe('2027-02-28');
  });

  it('classifica a disponibilidade do dia', () => {
    expect(availabilityLevel(0)).toBe('lotado');
    expect(availabilityLevel(2)).toBe('poucos');
    expect(availabilityLevel(10)).toBe('livre');
  });

  it('gera os links para salvar na agenda', () => {
    const url = new URL(googleCalendarUrl(EVENT));
    expect(url.searchParams.get('dates')).toBe('20261107T150000/20261107T163000');
    expect(url.searchParams.get('ctz')).toBe('America/Sao_Paulo');

    const ics = icsContent(EVENT);
    expect(ics).toContain('DTSTART:20261107T180000Z'); // 15h em Brasília = 18h UTC
    expect(ics).toContain('DTEND:20261107T193000Z');
  });
});
