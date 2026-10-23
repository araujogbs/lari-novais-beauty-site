import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PushToggle } from './PushToggle';

vi.mock('../config', () => ({ API_URL: 'http://api.test/api', WHATSAPP: '5511914834786' }));

const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1';
// Chave pública VAPID de verdade (65 bytes em base64 URL), para o aplicativo decodificar
const PUBLIC_KEY = 'BFVHwzXQtUnIVK7yNrIYTgzZZCqSgXmogUS2Win0dOHkhLrprzvmjRgAqZyVEna3gvcFcbalDbvwZfVZvxEvx9Y';

type Input = string | URL | Request;
const urlOf = (input: Input): string =>
  typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** Simula o que o Safari/Chrome oferecem quando há suporte a push. */
function stubPushSupport() {
  const subscription = {
    endpoint: 'https://web.push.apple.com/abc',
    toJSON: () => ({ endpoint: 'https://web.push.apple.com/abc', keys: { p256dh: 'P256', auth: 'AUTH' } }),
    unsubscribe: vi.fn(() => Promise.resolve(true)),
  };
  let current: typeof subscription | null = null;
  const pushManager = {
    getSubscription: vi.fn(() => Promise.resolve(current)),
    subscribe: vi.fn(() => Promise.resolve((current = subscription))),
  };
  const reg = { pushManager };
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: {
      register: vi.fn(() => Promise.resolve(reg)),
      ready: Promise.resolve(reg),
      getRegistration: vi.fn(() => Promise.resolve(reg)),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  });
  vi.stubGlobal('PushManager', vi.fn());
  vi.stubGlobal('Notification', {
    permission: 'default',
    requestPermission: vi.fn(() => Promise.resolve('granted')),
  });
  const fetchMock = vi.fn<(input: Input, init?: RequestInit) => Promise<Response>>((input) => {
    const url = urlOf(input);
    if (url.endsWith('/push/web/public-key')) return Promise.resolve(json({ publicKey: PUBLIC_KEY }));
    return Promise.resolve(new Response(null, { status: 204 }));
  });
  vi.stubGlobal('fetch', fetchMock);
  return { pushManager, subscription, fetchMock };
}

afterEach(() => {
  Reflect.deleteProperty(navigator, 'serviceWorker');
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('PushToggle', () => {
  it('no iPhone fora da Tela de Início, explica como instalar o painel', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(IPHONE_UA);
    vi.stubGlobal('matchMedia', () => ({ matches: false })); // o jsdom não tem matchMedia
    render(<PushToggle token="t" onExpired={vi.fn()} />);

    const box = screen.getByRole('region', { name: 'Avisos de pedido novo' });
    expect(within(box).getByText(/Adicionar à Tela de Início/)).toBeInTheDocument();
    expect(within(box).queryByRole('button')).not.toBeInTheDocument();
  });

  it('em navegador sem suporte a push, não mostra nada', () => {
    const { container } = render(<PushToggle token="t" onExpired={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('ativa: pede permissão, assina com a chave do servidor e cadastra na API com o token', async () => {
    const { pushManager, fetchMock } = stubPushSupport();
    const user = userEvent.setup();
    render(<PushToggle token="TOKEN" onExpired={vi.fn()} />);

    await user.click(await screen.findByRole('button', { name: 'Ativar avisos' }));
    expect(await screen.findByText(/Avisos ativados neste aparelho/)).toBeInTheDocument();

    expect(pushManager.subscribe).toHaveBeenCalledOnce();
    const subscribe = fetchMock.mock.calls.find(([u]) => urlOf(u).endsWith('/push/web/subscribe'));
    expect(JSON.parse(subscribe?.[1]?.body as string)).toEqual({
      endpoint: 'https://web.push.apple.com/abc',
      keys: { p256dh: 'P256', auth: 'AUTH' },
    });
    expect(new Headers(subscribe?.[1]?.headers).get('Authorization')).toBe('Bearer TOKEN');
  });

  it('desativa: tira o cadastro da API e cancela a assinatura do navegador', async () => {
    const { pushManager, subscription, fetchMock } = stubPushSupport();
    await pushManager.subscribe(); // já estava ativado
    const user = userEvent.setup();
    render(<PushToggle token="TOKEN" onExpired={vi.fn()} />);

    await user.click(await screen.findByRole('button', { name: 'Desativar avisos' }));
    expect(await screen.findByRole('button', { name: 'Ativar avisos' })).toBeInTheDocument();

    const unsubscribe = fetchMock.mock.calls.find(([u]) => urlOf(u).endsWith('/push/web/unsubscribe'));
    expect(JSON.parse(unsubscribe?.[1]?.body as string)).toEqual({ endpoint: 'https://web.push.apple.com/abc' });
    expect(subscription.unsubscribe).toHaveBeenCalledOnce();
  });

  it('se a permissão for negada, mostra o motivo e não cadastra nada', async () => {
    const { fetchMock } = stubPushSupport();
    vi.stubGlobal('Notification', {
      permission: 'default',
      requestPermission: vi.fn(() => Promise.resolve('denied')),
    });
    const user = userEvent.setup();
    render(<PushToggle token="TOKEN" onExpired={vi.fn()} />);

    await user.click(await screen.findByRole('button', { name: 'Ativar avisos' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('bloqueadas');
    expect(fetchMock.mock.calls.some(([u]) => urlOf(u).endsWith('/push/web/subscribe'))).toBe(false);
  });
});
