/** Estrelinhas de quatro pontas nos cantos de uma moldura celeste (`.frame`). Puramente decorativas. */
export function StarCorners() {
  return (
    <>
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
        <svg key={pos} className={`frame-star frame-star--${pos}`} viewBox="-10 -10 20 20" aria-hidden="true">
          <path d="M0-10 2-2 10 0 2 2 0 10-2 2-10 0-2-2z" />
        </svg>
      ))}
    </>
  );
}

/** Ornamento do título: traço, estrela e traço. */
export function StarDivider() {
  return (
    <span className="star-divider" aria-hidden="true">
      <svg viewBox="-10 -10 20 20">
        <path d="M0-10 2-2 10 0 2 2 0 10-2 2-10 0-2-2z" />
      </svg>
    </span>
  );
}
