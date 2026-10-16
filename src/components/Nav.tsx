import { useState } from 'react';
import { NAV_LINKS } from '../data/nav';
import { useScrolled } from '../hooks/useScrolled';

export function Nav() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();

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
    </nav>
  );
}
