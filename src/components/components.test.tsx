import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HERO_IMAGES, HERO_INTERVAL_MS } from '../data/hero';
import { REVIEWS } from '../data/reviews';
import { ContactForm } from './ContactForm';
import { HeroCarousel } from './HeroCarousel';
import { Nav } from './Nav';
import { ReviewsCarousel } from './ReviewsCarousel';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Nav', () => {
  it('alterna o menu mobile', async () => {
    render(<Nav theme="light" onToggleTheme={() => undefined} />);
    const toggle = screen.getByRole('button', { name: 'Abrir menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('navMenu')).toHaveClass('active');
  });

  it('troca entre modo dia e noturno', async () => {
    const onToggle = vi.fn();
    const { rerender } = render(<Nav theme="light" onToggleTheme={onToggle} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ativar modo noturno' }));
    expect(onToggle).toHaveBeenCalledTimes(1);
    rerender(<Nav theme="dark" onToggleTheme={onToggle} />);
    expect(screen.getByRole('button', { name: 'Ativar modo dia' })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('HeroCarousel', () => {
  it('avança sozinho e permite escolher a foto pelos pontos', () => {
    vi.useFakeTimers();
    const { container } = render(<HeroCarousel />);
    const active = (): number =>
      [...container.querySelectorAll('.carousel-img')].findIndex((i) => i.classList.contains('active'));

    expect(active()).toBe(0);
    act(() => {
      vi.advanceTimersByTime(HERO_INTERVAL_MS);
    });
    expect(active()).toBe(1);

    const last = HERO_IMAGES.length;
    act(() => {
      screen.getByRole('button', { name: `Foto ${last} de ${last}` }).click();
    });
    expect(active()).toBe(last - 1);

    act(() => {
      vi.advanceTimersByTime(HERO_INTERVAL_MS);
    });
    expect(active()).toBe(0); // volta ao início
  });
});

describe('ReviewsCarousel', () => {
  it('renderiza todas as avaliações com o rótulo da variante', () => {
    const { rerender } = render(<ReviewsCarousel variant="home" />);
    expect(screen.getAllByRole('article')).toHaveLength(REVIEWS.length);
    expect(screen.getAllByText('Cliente')).toHaveLength(REVIEWS.length);
    rerender(<ReviewsCarousel variant="google" />);
    expect(screen.getAllByText('Google')).toHaveLength(REVIEWS.length);
  });
});

describe('ContactForm', () => {
  it('abre o WhatsApp com a mensagem preenchida', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText('Seu Nome'), 'Ana');
    await userEvent.selectOptions(screen.getByLabelText('Assunto'), 'Parceria');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar por WhatsApp' }));

    expect(open).toHaveBeenCalledTimes(1);
    const url = String(open.mock.calls[0]?.[0]);
    expect(url.startsWith('https://wa.me/5511999999999?text=')).toBe(true);
    expect(decodeURIComponent(url)).toContain('*Assunto:* Parceria');
  });
});
