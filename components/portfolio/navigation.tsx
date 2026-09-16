'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

function MagneticLink({ label, href, onClick }: { label: string; href: string; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 15, stiffness: 200 });
  const springY = useSpring(y, { damping: 15, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.2);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={reduced ? {} : { x: springX, y: springY }}
      onClick={onClick}
      className="group relative rounded-full px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-white"
    >
      {label}
      <span className="absolute inset-0 -z-10 scale-90 rounded-full bg-white/5 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
    </motion.button>
  );
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      return;
    }
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <>
      <motion.nav
        style={{ x: '-50%' }}
        initial={reduced ? { opacity: 0 } : { y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={reduced ? { duration: 0.3 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-500 ${
          scrolled ? 'w-[calc(100%-2rem)] max-w-2xl' : 'w-[calc(100%-2rem)] max-w-3xl'
        }`}
      >
        <div
          className={`glass-nav flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
            scrolled ? 'py-2.5 shadow-lg shadow-violet-600/5' : ''
          }`}
        >
          <button
            onClick={() => handleNav('#home')}
            className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white"
          >
            <img src="/brand/avatar.png" alt="Me_4qan" width="28" height="28" className="h-7 w-7 brand-avatar rounded-full object-cover" />
            <span className="hidden sm:inline">Me_4qan</span>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <MagneticLink
                key={link.href}
                label={link.label}
                href={link.href}
                onClick={() => handleNav(link.href)}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNav('#contact')}
              className="hidden rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-600/40 hover:brightness-110 md:block"
            >
              Let&apos;s Talk
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glass-strong absolute right-0 top-0 flex h-full w-72 flex-col gap-2 p-6 pt-20"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-white"
              >
                <X className="h-5 w-5" />
              </button>
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="rounded-xl px-4 py-3 text-left text-lg font-medium text-white transition-colors hover:bg-white/5"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNav('#contact')}
                className="mt-4 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-3 text-center text-sm font-medium text-white"
              >
                Let&apos;s Talk
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
