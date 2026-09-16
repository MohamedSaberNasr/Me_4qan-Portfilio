'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// One custom pointer on desktop; native cursor remains for forms and reduced motion.
export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const glowX = useSpring(x, { damping: 28, stiffness: 500, mass: 0.4 });
  const glowY = useSpring(y, { damping: 28, stiffness: 500, mass: 0.4 });

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    const move = (e: PointerEvent) => {
      if (reduced || !media.matches || e.pointerType !== 'mouse') { hide(); return; }
      x.set(e.clientX); y.set(e.clientY);
      const show = !(e.target as HTMLElement).closest('input, textarea, select, video, [data-cursor="hidden"]');
      document.body.classList.toggle('custom-cursor-active', show);
      setVisible(show);
    };
    const hide = () => { setVisible(false); document.body.classList.remove('custom-cursor-active'); };
    document.body.classList.remove('custom-cursor-active');
    if (reduced) return;
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', hide);
    document.addEventListener('pointerleave', hide);
    media.addEventListener('change', hide);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', hide);
      document.removeEventListener('pointerleave', hide);
      media.removeEventListener('change', hide);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [x, y, reduced]);

  if (reduced || !visible) return null;
  return <motion.div aria-hidden="true" data-pointer-glow="true"
    className="pointer-events-none fixed left-0 top-0 z-[100] hidden lg:block"
    style={{ x: glowX, y: glowY }}>
    <div className="glowing-cursor" />
  </motion.div>;
}
