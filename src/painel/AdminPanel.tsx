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

    // Para o iPhone instalar o painel na Tela de Início (e só então liberar o aviso de pedido novo): manifesto, nome
    // e ícone próprios. Só enquanto o painel está aberto, para não mudar o resto do site.
    const added: HTMLElement[] = [];
    const add = (tag: 'link' | 'meta', attrs: Record<string, string>): void => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
      added.push(el);
    };
    add('link', { rel: 'manifest', href: '/manifest.webmanifest' });
    add('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' });
    add('meta', { name: 'mobile-web-app-capable', content: 'yes' });
    add('meta', { name: 'apple-mobile-web-app-title', content: 'Painel Lari' });
    const touchIcon = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
    const previousIcon = touchIcon?.getAttribute('href');
    touchIcon?.setAttribute('href', '/painel-icon-180.png');

    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
      robots.remove();
      added.forEach((el) => {
        el.remove();
      });
      if (previousIcon) touchIcon?.setAttribute('href', previousIcon);
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
              onLoggedIn={(t, remember) => {
                saveToken(t, remember);
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
