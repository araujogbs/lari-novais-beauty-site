/* Painel Ateliê no site: a mesma gestão do app, aberta pelo endereço /#painel.
   Carregado sob demanda, então quem só visita o site não baixa este código. */
import { useEffect, useState } from 'react';
import { API_URL } from '../config';
import { AdminDashboard } from './AdminDashboard';
import { AdminLogin } from './AdminLogin';
import { clearToken, loadToken, saveToken } from './session';
import './painel.css';

export default function AdminPanel() {
  const [token, setToken] = useState<string | null>(loadToken);
  const [expired, setExpired] = useState(false);

  // Página fora de buscadores e com título próprio enquanto o painel estiver aberto
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Painel Ateliê · Lari Novais Beauty';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  const logout = (): void => {
    clearToken();
    setToken(null);
  };

  return (
    <div className="pn">
      <header className="pn-top">
        <div className="pn-brand">
          Lari Novais <span>Beauty</span> <small>Painel Ateliê</small>
        </div>
        <nav className="pn-top-actions">
          <a className="pn-btn" href="#home">
            Ver o site
          </a>
          {token && (
            <button type="button" className="pn-btn" onClick={logout}>
              Sair
            </button>
          )}
        </nav>
      </header>

      <main className="pn-main">
        {!API_URL ? (
          <p className="pn-error">A URL da API (VITE_AGENDAMENTO_API) não está configurada.</p>
        ) : token ? (
          <AdminDashboard
            token={token}
            onExpired={() => {
              clearToken();
              setToken(null);
              setExpired(true);
            }}
          />
        ) : (
          <>
            {expired && <p className="pn-notice pn-notice--warn">Sua sessão expirou. Entre de novo.</p>}
            <AdminLogin
              onLoggedIn={(t) => {
                saveToken(t);
                setExpired(false);
                setToken(t);
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}
