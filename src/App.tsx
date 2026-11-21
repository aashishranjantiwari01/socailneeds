import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import TrustSection from './components/TrustSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: '#030712' }}>

      {/* ── Global fixed background ── */}
      <div className="site-bg" aria-hidden="true">
        {/* Slow drifting orbs at different Y positions */}
        <div
          className="site-orb"
          style={{
            width: 700, height: 700,
            top: '8%', left: '50%', transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(29,78,216,0.18) 0%, transparent 70%)',
            animationDuration: '18s',
          }}
        />
        <div
          className="site-orb"
          style={{
            width: 500, height: 500,
            top: '35%', left: '-5%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)',
            animationDuration: '22s',
            animationDelay: '-6s',
          }}
        />
        <div
          className="site-orb"
          style={{
            width: 450, height: 450,
            top: '40%', right: '-5%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.11) 0%, transparent 70%)',
            animationDuration: '26s',
            animationDelay: '-12s',
          }}
        />
        <div
          className="site-orb"
          style={{
            width: 600, height: 600,
            top: '65%', left: '50%', transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)',
            animationDuration: '20s',
            animationDelay: '-4s',
          }}
        />
        <div
          className="site-orb"
          style={{
            width: 380, height: 380,
            bottom: '5%', left: '15%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)',
            animationDuration: '30s',
            animationDelay: '-15s',
          }}
        />

        {/* Subtle dot-grid overlay across entire page */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage:
              'radial-gradient(rgba(59,130,246,0.09) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 100%)',
          }}
        />

        {/* Top vignette to blend with Hero aurora */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '50vh',
            background: 'linear-gradient(to bottom, #030712 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── All sections sit above the fixed bg ── */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Services />
        <TrustSection />
        <Contact />
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  );
}

export default App;
