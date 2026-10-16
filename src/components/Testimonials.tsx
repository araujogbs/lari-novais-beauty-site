import { ReviewsCarousel } from './ReviewsCarousel';

export function Testimonials() {
  return (
    <>
      <section id="depoimentos" className="section-rose">
        <div className="container section-center">
          <div className="section-label">Depoimentos</div>
          <h2 className="section-title">O que elas dizem?</h2>
          <p className="reviews-badge">
            <span className="g">
              <span style={{ color: '#4285F4' }}>G</span>
              <span style={{ color: '#EA4335' }}>o</span>
              <span style={{ color: '#FBBC05' }}>o</span>
              <span style={{ color: '#4285F4' }}>g</span>
              <span style={{ color: '#34A853' }}>l</span>
              <span style={{ color: '#EA4335' }}>e</span>
            </span>{' '}
            ★ 5,0 · avaliações de clientes
          </p>
          <ReviewsCarousel variant="google" />
        </div>
      </section>
    </>
  );
}
