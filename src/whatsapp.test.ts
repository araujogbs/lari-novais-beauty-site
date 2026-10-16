import { describe, expect, it } from 'vitest';
import { buildBrideMessage, buildContactMessage, whatsappUrl } from './whatsapp';

describe('whatsapp', () => {
  it('whatsappUrl codifica o texto e usa o número configurado', () => {
    expect(whatsappUrl('Olá & tchau')).toBe('https://wa.me/5511999999999?text=Ol%C3%A1%20%26%20tchau');
  });

  it('mensagem da noiva formata a data em dd/mm/aaaa', () => {
    const msg = buildBrideMessage({ nome: ' Ana ', data: '2027-05-20', local: 'SP', mensagem: 'Oi' });
    expect(msg).toContain('*Nome da noiva:* Ana\n');
    expect(msg).toContain('*Data do casamento:* 20/05/2027\n');
    expect(msg).toContain('*Mensagem:* Oi');
  });

  it('mensagem de contato inclui todos os campos', () => {
    const msg = buildContactMessage({ nome: 'Ana', email: 'a@b.com', assunto: 'Elogio', mensagem: 'Lindo' });
    expect(msg).toBe('Olá, vim pelo site.\n\n*Nome:* Ana\n*E-mail:* a@b.com\n*Assunto:* Elogio\n*Mensagem:* Lindo');
  });
});
