import { AboutHome } from './components/AboutHome';
import { AboutMe } from './components/AboutMe';
import { Brides } from './components/Brides';
import { CelestialSprites } from './components/CelestialSprites';
import { Contact } from './components/Contact';
import { Courses } from './components/Courses';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { Networks } from './components/Networks';
import { Portfolio } from './components/Portfolio';
import { ServicesHome } from './components/ServicesHome';
import { SocialNetworksHome } from './components/SocialNetworksHome';
import { SocialService } from './components/SocialService';
import { Team } from './components/Team';
import { Testimonials } from './components/Testimonials';
import { SparkleTrail, StarrySky } from './components/SkyEffects';
import { lazy, Suspense } from 'react';
import { useHash } from './hooks/useHash';
import { useReveal } from './hooks/useReveal';
import { useTheme } from './hooks/useTheme';

// Painel da Lari: carregado só quando aberto, para não pesar no site
const AdminPanel = lazy(() => import('./painel/AdminPanel'));

const PAINEL_HASH = '#painel';

export function App() {
  const hash = useHash();
  const isPainel = hash === PAINEL_HASH;
  useReveal(isPainel);
  const [theme, toggleTheme] = useTheme(!isPainel);

  if (isPainel) {
    return (
      <Suspense fallback={<p className="pn-loading">Carregando painel…</p>}>
        <AdminPanel />
      </Suspense>
    );
  }

  return (
    <div className="site">
      {theme === 'dark' && <StarrySky />}
      <SparkleTrail />
      <CelestialSprites />
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <Portfolio />
      <AboutHome />
      <ServicesHome />
      <SocialNetworksHome />
      <Testimonials />
      <AboutMe />
      <Brides />
      <SocialService />
      <Courses />
      <Team />
      <Networks />
      <Contact />
      <Footer />
    </div>
  );
}
