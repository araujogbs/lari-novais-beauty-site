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
import { useReveal } from './hooks/useReveal';

export function App() {
  useReveal();

  return (
    <div className="site">
      <CelestialSprites />
      <Nav />
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
