import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdminPanel from './AdminPanel';
import type { AdminAppointment } from './types';

vi.mock('../config', () => ({ API_URL: 'http://api.test/api', WHATSAPP: '5511914834786' }));

type Input = string | URL | Request;
const urlOf = (input: Input): string =>
  typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// JWT com exp bem no futuro (o painel descarta tokens vencidos)
const TOKEN = `x.${btoa(JSON.stringify({ exp: 4102444800 }))}.y`;

const PENDING: AdminAppointment = {
  id: 7,
  clientName: 'Maria Souza',
  clientPhone: '(11) 91234-5678',
  clientAddress: 'Rua A, 10',
  description: 'Make leve',
  people: 1,
  startTime: '2030-01-10T12:00:00Z',
  endTime: '2030-01-10T13:00:00Z',
  status: 'Pending',
  serviceItem: { id: 1, name: 'Maquiagem', durationMinutes: 60, price: 350 },
};

function mockApi(override?: (url: string, init?: RequestInit) => Response | undefined) {
  let pending = [PENDING];
  const fetchMock = vi.fn((input: Input, init?: RequestInit) => {
    const url = urlOf(input);
    const custom = override?.(url, init);
    if (custom) return Promise.resolve(custom);
    if (url.endsWith('/auth/login')) return Promise.resolve(json({ token: TOKEN }));
    if (url.endsWith('/appointments/pending')) return Promise.resolve(json(pending));
    if (url.includes('/appointments?date=')) return Promise.resolve(json([]));
    if (url.endsWith('/approve') || url.endsWith('/reject')) {
      pending = [];
      return Promise.resolve(json({}));
    }
    return Promise.resolve(json(null, 404));
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

async function logIn(user: ReturnType<typeof userEvent.setup>): Promise<void> {
  await user.type(screen.getByLabelText('Usuário'), 'lari');
  await user.type(screen.getByLabelText('Senha'), 'segredo');
  await user.click(screen.getByRole('button', { name: 'Entrar' }));
}

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Painel Ateliê', () => {
  it('entra, lista o pedido em análise e aprova com o token', async () => {
    const fetchMock = mockApi();
    const user = userEvent.setup();
    render(<AdminPanel />);
    await logIn(user);

    const pendentes = screen.getByRole('region', { name: /Pedidos em análise/ });
    expect(await within(pendentes).findByText('Maria Souza')).toBeInTheDocument();
    expect(within(pendentes).getByText('Em análise')).toBeInTheDocument();

    await user.click(within(pendentes).getByRole('button', { name: 'Aprovar' }));
    expect(await screen.findByText(/Agendamento confirmado/)).toBeInTheDocument();
    expect(await within(pendentes).findByText('Nenhum pedido aguardando análise.')).toBeInTheDocument();

    const call = fetchMock.mock.calls.find(([u]) => urlOf(u).endsWith('/7/approve'));
    expect(new Headers(call?.[1]?.headers).get('Authorization')).toBe(`Bearer ${TOKEN}`);
    expect(sessionStorage.length).toBe(1);
  });

  it('recusa com motivo', async () => {
    const fetchMock = mockApi();
    const user = userEvent.setup();
    render(<AdminPanel />);
    await logIn(user);

    await user.click(await screen.findByRole('button', { name: 'Recusar' }));
    await user.type(screen.getByLabelText(/Motivo/), 'Já tenho evento');
    await user.click(screen.getByRole('button', { name: 'Confirmar recusa' }));

    await waitFor(() => {
      const call = fetchMock.mock.calls.find(([u]) => urlOf(u).endsWith('/7/reject'));
      expect(call?.[1]?.body).toBe(JSON.stringify({ reason: 'Já tenho evento' }));
    });
    expect(await screen.findByText(/Pedido recusado/)).toBeInTheDocument();
  });

  it('mostra erro de login', async () => {
    mockApi((url) => (url.endsWith('/auth/login') ? json({ message: 'x' }, 401) : undefined));
    const user = userEvent.setup();
    render(<AdminPanel />);
    await logIn(user);
    expect(await screen.findByRole('alert')).toHaveTextContent('Usuário ou senha incorretos.');
  });

  it('volta para o login quando a sessão expira', async () => {
    mockApi((url) => (url.includes('/appointments') ? json(null, 401) : undefined));
    const user = userEvent.setup();
    render(<AdminPanel />);
    await logIn(user);
    expect(await screen.findByText('Sua sessão expirou. Entre de novo.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    expect(sessionStorage.length).toBe(0);
  });
});
