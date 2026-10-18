/* Token do painel. Fica no sessionStorage: some ao fechar a aba e não é compartilhado com outras abas. */
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

/** Token salvo e ainda válido; tokens vencidos são descartados. */
export function loadToken(): string | null {
  try {
    const token = sessionStorage.getItem(KEY);
    if (!token) return null;
    const left = secondsLeft(token);
    if (left !== null && left <= 0) {
      sessionStorage.removeItem(KEY);
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function saveToken(token: string): void {
  try {
    sessionStorage.setItem(KEY, token);
  } catch {
    /* sem storage (aba anônima restrita): o login vale só enquanto a página estiver aberta */
  }
}

export function clearToken(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* nada a limpar */
  }
}
