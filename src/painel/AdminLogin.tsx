import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { login } from './adminApi';

interface Props {
  /** `remember`: a Lari pediu para continuar conectada neste aparelho. */
  onLoggedIn: (token: string, remember: boolean) => void;
}

export function AdminLogin({ onLoggedIn }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Informe usuário e senha.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      onLoggedIn(await login(username.trim(), password), remember);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
      setBusy(false);
    }
  };

  return (
    <form className="pn-login" onSubmit={(e) => void submit(e)}>
      <h2>Painel Ateliê</h2>
      <p>Área restrita da Lari.</p>
      <label>
        Usuário
        <input
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </label>
      <label>
        Senha
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </label>
      <label className="pn-remember">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => {
            setRemember(e.target.checked);
          }}
        />
        Manter conectada neste aparelho
      </label>
      <p className="pn-hint">Desmarque se este não for o seu celular ou computador.</p>
      {error && (
        <p className="pn-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="pn-btn pn-btn--primary" disabled={busy}>
        {busy ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
