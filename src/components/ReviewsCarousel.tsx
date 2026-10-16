import { useRef } from 'react';
import { REVIEWS } from '../data/reviews';

interface Props {
  /** `google` mostra o selo de avaliação do Google; `home` mostra "Cliente". */
  variant: 'home' | 'google';
}

const CARD_GAP_PX = 24;

export function ReviewsCarousel({ variant }: Props) {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1): void => {
    const el = track.current;
    const first = el?.firstElementChild;
    if (!el || !(first instanceof HTMLElement)) return;
    el.scrollBy({ left: dir * (first.offsetWidth + CARD_GAP_PX), behavior: 'smooth' });
  };

  return (
    <div className="reviews-wrap reveal">
      <div className="reviews-track" ref={track}>
        {REVIEWS.map((r) => (
          <article className="review-card" key={r.name}>
            <div className="review-head">
              <div className="review-avatar">{r.name.charAt(0)}</div>
              <div>
                <div className="review-name">{r.name}</div>
                <div className="review-src">
                  {variant === 'google' ? (
                    <>
                      <b>Google</b> &middot; Avaliação
                    </>
                  ) : (
                    'Cliente'
                  )}
                </div>
              </div>
            </div>
            <div className="review-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            <p className="review-text">{r.text}</p>
          </article>
        ))}
      </div>
      <div className="reviews-nav">
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => {
            scroll(-1);
          }}
        >
          &#8249;
        </button>
        <button
          type="button"
          aria-label="Próximo"
          onClick={() => {
            scroll(1);
          }}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}
