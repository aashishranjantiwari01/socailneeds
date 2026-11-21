import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ShinyButton } from './ui/shiny-button';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#trust' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll(); // run on mount
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        /* ── Always has its own distinct dark glass bar — never transparent ── */
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Separator line at the very bottom of navbar */}
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? 'bg-[#07091280] backdrop-blur-2xl border-b border-white/10 shadow-xl shadow-black/40'
              : 'bg-[#070912cc] backdrop-blur-xl border-b border-white/[0.06]'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">

            {/* Logo */}
            <a
              href="#"
              className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent shrink-0"
            >
              Socialneed
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-300 font-medium hover:bg-white/10 hover:border-white/25 hover:text-white transition-all duration-200 backdrop-blur-sm"
                >
                  {l.label}
                </a>
              ))}

              {/* Primary CTA — ShinyButton */}
              <ShinyButton as="a" href="#contact" className="ml-2 !py-[0.5rem] !px-5 !text-sm !rounded-lg">
                Get in Touch
              </ShinyButton>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-all"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#070912f5] backdrop-blur-2xl flex flex-col items-center justify-center gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-10 py-3.5 rounded-xl border border-white/10 bg-white/5 text-xl text-white font-semibold w-56 text-center hover:bg-white/10 transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <ShinyButton
              as="a"
              href="#contact"
              className="mt-2 w-56 !text-xl !py-3.5 !rounded-xl"
              onClick={() => setMobileOpen(false)}
            >
              Get in Touch
            </ShinyButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
