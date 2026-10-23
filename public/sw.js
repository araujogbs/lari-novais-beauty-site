/* Service worker do Painel Ateliê: só recebe os avisos de pedido novo (Web Push) e abre o painel ao tocar neles.
   Não guarda nada em cache. No iPhone o aviso exige o painel na Tela de Início (iOS 16.4+) e que TODO push mostre
   uma notificação, senão o iOS cancela a assinatura. */

self.addEventListener('install', () => {
  void self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(data.title || 'Novo pedido de agendamento', {
        body: data.body || '',
        icon: '/painel-icon-192.png',
        badge: '/painel-icon-192.png',
        tag: data.tag,
        data: { url: data.url || '/#painel' },
      }),
      // Painel já aberto: a página recarrega a lista de pedidos na hora
      self.clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then((windows) => windows.forEach((w) => w.postMessage({ type: 'new-booking' }))),
    ]),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || '/#painel', self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (windows) => {
      const open = windows.find((w) => 'focus' in w);
      if (!open) return self.clients.openWindow(url);
      const focused = await open.focus();
      if (focused && 'navigate' in focused && !focused.url.includes('#painel')) await focused.navigate(url);
      return focused;
    }),
  );
});
