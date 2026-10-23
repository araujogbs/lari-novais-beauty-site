/* Token do painel. "Manter conectada" (padrão) guarda no localStorage, para a Lari não digitar a senha a cada abertura
   do painel no celular; sem isso fica no sessionStorage e some ao fechar a aba. Nos dois casos vale até o `exp` do JWT. */
const KEY = 'lnb-painel-token';

/** Segundos até o `exp` do JWT, ou null se o token não puder ser lido. */
function secondsLeft(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: unknown };
    return typeof json.exp === 'number' ? json.exp - Date.now() / 1000 : null;
  } catch {
    return null;
  }
}

function readFrom(storage: Storage): string | null {
  const token = storage.getItem(KEY);
  if (!token) return null;
  const left = secondsLeft(token);
  if (left !== null && left <= 0) {
    storage.removeItem(KEY);
    return null;
  }
  return token;
}

/** Token salvo e ainda válido; tokens vencidos são descartados. */
export function loadToken(): string | null {
  try {
    return readFrom(localStorage) ?? readFrom(sessionStorage);
  } catch {
    return null;
  }
}

/** `remember`: manter neste aparelho depois de fechar o painel (localStorage); senão, só até fechar a aba. */
export function saveToken(token: string, remember = false): void {
  try {
    clearToken();
    (remember ? localStorage : sessionStorage).setItem(KEY, token);
  } catch {
    /* sem storage (aba anônima restrita): o login vale só enquanto a página estiver aberta */
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
  } catch {
    /* nada a limpar */
  }
}
