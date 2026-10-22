/* Códigos secretos dos agendamentos feitos neste aparelho (ou abertos pelo link do WhatsApp).
   Quem tem o código vê, paga o sinal e cancela o agendamento; saber só o telefone não dá acesso a nada. */
const KEY = 'lari.agendamentos';
const MAX_TOKENS = 20;

export function getTokens(): string[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((t): t is string => typeof t === 'string') : [];
  } catch {
    return [];
  }
}

/** Guarda o código (o mais novo primeiro, sem repetir). Se o navegador bloquear o armazenamento, só não lembra. */
export function addToken(token: string): void {
  try {
    const next = [token, ...getTokens().filter((t) => t !== token)].slice(0, MAX_TOKENS);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* armazenamento indisponível (janela anônima, por exemplo) */
  }
}

/** Código do link enviado por WhatsApp: "https://site/#ag=12.abc..." (o que vem depois do # nunca chega ao servidor). */
export function tokenFromHash(hash: string): string | null {
  const m = /^#ag=([\w.-]{3,80})$/.exec(hash);
  return m?.[1] ?? null;
}
