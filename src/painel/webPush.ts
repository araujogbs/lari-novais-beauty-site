/* Aviso de pedido novo no navegador (Web Push). No iPhone só funciona com o painel na Tela de Início (iOS 16.4+). */
import * as adminApi from './adminApi';

export type PushSupport = 'ready' | 'needs-install' | 'unsupported';

/** Estado do aviso neste aparelho: ligado, desligado ou bloqueado nos ajustes do navegador. */
export type PushState = 'on' | 'off' | 'blocked';

// iPadOS no modo "site para computador" se apresenta como Mac, mas é o único Mac com tela de toque
const isIos = (): boolean =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1);

const isInstalled = (): boolean =>
  (navigator as Navigator & { standalone?: boolean }).standalone === true ||
  window.matchMedia('(display-mode: standalone)').matches;

/** O navegador consegue receber avisos? No Safari do iPhone, fora da Tela de Início, a API de push nem existe. */
export function pushSupport(): PushSupport {
  const capable = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  if (capable) return 'ready';
  return isIos() && !isInstalled() ? 'needs-install' : 'unsupported';
}

async function registration(): Promise<ServiceWorkerRegistration> {
  await navigator.serviceWorker.register('/sw.js');
  return navigator.serviceWorker.ready;
}

/** Chave pública do VAPID (base64 URL) como bytes, o formato que o navegador pede. */
function keyBytes(base64Url: string): Uint8Array<ArrayBuffer> {
  const base64 = (base64Url + '='.repeat((4 - (base64Url.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export async function pushState(): Promise<PushState> {
  if (Notification.permission === 'denied') return 'blocked';
  const reg = await navigator.serviceWorker.getRegistration('/');
  return (await reg?.pushManager.getSubscription()) ? 'on' : 'off';
}

/** Pede permissão, assina o push neste aparelho e cadastra na API. Chamar direto de um toque (o iPhone exige). */
export async function enablePush(token: string): Promise<void> {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('As notificações foram bloqueadas. Ative nos ajustes do iPhone.');

  const { publicKey } = await adminApi.getWebPushKey();
  const reg = await registration();
  const subscription =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(publicKey) }));

  const { endpoint, keys } = subscription.toJSON();
  if (!endpoint || !keys?.p256dh || !keys.auth) throw new Error('Este navegador não devolveu os dados do aviso.');
  await adminApi.subscribeWebPush(token, { endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } });
}

/** Desliga o aviso neste aparelho e tira da API. */
export async function disablePush(token: string): Promise<void> {
  const reg = await navigator.serviceWorker.getRegistration('/');
  const subscription = await reg?.pushManager.getSubscription();
  if (!subscription) return;
  await adminApi.unsubscribeWebPush(token, subscription.endpoint);
  await subscription.unsubscribe();
}
