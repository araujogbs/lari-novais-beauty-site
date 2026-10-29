import { StarDivider } from './StarCorners';

export function Footer() {
  return (
    <>
      <footer>
        <StarDivider />
        <div className="logo">
          Lari Novais <span>Beauty</span>
        </div>
        <p>© 2026 Lari Novais Beauty. Todos os direitos reservados.</p>
        <p className="footer-credit">
          Desenvolvido por{' '}
          <a href="https://www.linkedin.com/in/gabriel-ara%C3%BAjo-a5a439277/" target="_blank" rel="noopener">
            Gabriel Araújo
          </a>
        </p>
      </footer>
    </>
  );
}
