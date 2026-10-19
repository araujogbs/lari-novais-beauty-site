import { useState } from 'react';
import { NAV_LINKS } from '../data/nav';
import { useScrolled } from '../hooks/useScrolled';
import type { Theme } from '../hooks/useTheme';

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Nav({ theme, onToggleTheme }: Props) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const night = theme === 'dark';

  return (
    <nav className={scrolled ? 'nav-scrolled' : undefined}>
      <div className="logo">
        Lari Novais <span>Beauty</span>
      </div>
      <ul id="navMenu" className={open ? 'active' : undefined}>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      <div className="nav-actions">
        <button
          type="button"
          className="theme-toggle"
          aria-label={night ? 'Ativar modo dia' : 'Ativar modo noturno'}
          aria-pressed={night}
          title={night ? 'Modo dia' : 'Modo noturno'}
          onClick={onToggleTheme}
        >
          {night ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <circle cx="12" cy="12" r="4.2" />
              <path
                d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1Z" strokeLinejoin="round" />
              <path d="m17 3.5.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5Z" fill="currentColor" stroke="none" />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="hamburger"
          aria-label="Abrir menu"
          aria-expanded={open}
          aria-controls="navMenu"
          onClick={() => {
            setOpen((o) => !o);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
