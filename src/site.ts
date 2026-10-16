import { WHATSAPP } from './config';
import { esc } from './utils';

/* ---------- animação de entrada ---------- */
export function initReveal(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    },
    { threshold: 0.1 },
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* ---------- menu mobile ---------- */
export function initNav(): void {
  const menu = document.getElementById('navMenu');
  document.querySelector('[data-nav-toggle]')?.addEventListener('click', () => menu?.classList.toggle('active'));
}

/* ---------- carrossel do hero ---------- */
export function initHeroCarousel(): void {
  const slides = document.querySelectorAll<HTMLElement>('.carousel-img');
  const dots = document.querySelectorAll<HTMLElement>('.dot');
  if (!slides.length) return;
  let current = 0;

  const goTo = (n: number): void => {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
  };

  dots.forEach((d) => d.addEventListener('click', () => goTo(Number(d.dataset.slide))));
  setInterval(() => goTo(current + 1), 4000);
}

/* ---------- formulários -> WhatsApp ---------- */
function openWA(text: string): void {
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');
}

function val(id: string): string {
  const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
  return (el?.value || '').trim();
}

const fmtDate = (iso: string): string => (iso ? iso.split('-').reverse().join('/') : '');

function sendNoiva(): void {
  openWA(
    'Olá, Lari! Vim pelo site e quero falar sobre a beleza do meu casamento.\n\n' +
      `*Nome da noiva:* ${val('noivaNome')}\n` +
      `*Data do casamento:* ${fmtDate(val('noivaData'))}\n` +
      `*Local do evento:* ${val('noivaLocal')}\n` +
      `*Mensagem:* ${val('noivaMsg')}`,
  );
}

function sendContato(): void {
  openWA(
    'Olá, vim pelo site.\n\n' +
      `*Nome:* ${val('contatoNome')}\n` +
      `*E-mail:* ${val('contatoEmail')}\n` +
      `*Assunto:* ${val('contatoAssunto')}\n` +
      `*Mensagem:* ${val('contatoMsg')}`,
  );
}

export function initForms(): void {
  document.querySelector('[data-action="send-noiva"]')?.addEventListener('click', sendNoiva);
  document.querySelector('[data-action="send-contato"]')?.addEventListener('click', sendContato);
}

/* ---------- depoimentos (Home) e avaliações estilo Google (Social) ---------- */
type Review = readonly [name: string, text: string];

const REVIEWS: readonly Review[] = [
  [
    'Patrícia Panosso',
    'Eu amei demais o trabalho da Lari! Ficou impecável e super durável! Tava um mega calor no meu ensaio pré-wedding e absolutamente nada saiu do lugar, nem o cabelo e nem a maquiagem! ❤️ Além disso, ela é super atenciosa, ouviu exatamente a maquiagem que eu queria e o resultado ficou super natural e lindo! 🥰 Amei e super recomendo!',
  ],
  [
    'Ariany Romanha',
    'Eu amei o atendimento da Lari. Uma profissional incrível, atenciosa em cada detalhe, tirou todas as minhas dúvidas desde o começo, no atendimento me senti super confortável. A maquiagem e o penteado durou o evento inteiro… que trabalho espetacular! Com toda certeza voltarei novamente e recomendo super!',
  ],
  [
    'Renata Massara',
    'A Larissa é uma ótima profissional, pontual, rápida pra fazer o cabelo e maquiagem, que duraram além da festa. Eu sempre tive muita alergia de maquiagem, o que fazia com que a sombra sempre saísse dos olhos mas a dela além de não ter dado nenhuma alergia, ficou impecável até a hora de remover. Vou chamá-la de novo com certeza!',
  ],
  [
    'Lais Silva',
    'Profissional incrível, depois que conheci o trabalho da Lari, não abro mão dela! Maquiagem e cabelos que duram até o fim, intactos. A Lari entende exatamente o que queremos, confio de olhos fechados!',
  ],
  [
    'Marina Cavalcanti',
    'Fiz cabelo e maquiagem social para um casamento que fui madrinha. A produção durou todo o evento (mais de 12 horas e foi difícil tirar) e ficou impecável! Recomendo fortemente!!',
  ],
  [
    'Fernanda Sousa',
    'Lari opera milagres e me deixou maravilhosaaaaa! O casamento era de manhã, make e cabelo duraram até a noite! Recomendo muitíssimo ❤️',
  ],
  [
    'Clarina Torres',
    'Além da Larissa esbanjar simpatia, seu trabalho é impecável. Fiz maquiagem e cabelo para um casamento, durou a noite toda. Super recomendo.',
  ],
];

function renderReviews(id: string, google: boolean): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = REVIEWS.map(
    ([name, text]) =>
      '<article class="review-card">' +
      `<div class="review-head"><div class="review-avatar">${esc(name.charAt(0))}</div>` +
      `<div><div class="review-name">${esc(name)}</div>` +
      `<div class="review-src">${google ? '<b>Google</b> &middot; Avaliação' : 'Cliente'}</div></div></div>` +
      '<div class="review-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>' +
      `<p class="review-text">${esc(text)}</p></article>`,
  ).join('');
}

export function initReviews(): void {
  renderReviews('homeReviews', false);
  renderReviews('googleReviews', true);

  document.querySelectorAll<HTMLElement>('[data-reviews]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const el = document.getElementById(btn.dataset.reviews ?? '');
      const first = el?.firstElementChild as HTMLElement | null;
      if (!el || !first) return;
      el.scrollBy({ left: Number(btn.dataset.dir) * (first.offsetWidth + 24), behavior: 'smooth' });
    });
  });
}
