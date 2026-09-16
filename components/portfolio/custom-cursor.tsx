'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// Keep the native pointer. This layer supplies only a soft ambient light.
export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const glowX = useSpring(x, { damping: 30, stiffness: 150, mass: 0.8 });
  const glowY = useSpring(y, { damping: 30, stiffness: 150, mass: 0.8 });

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    const move = (e: PointerEvent) => {
      if (reduced || !media.matches || e.pointerType !== 'mouse') { setVisible(false); return; }
      x.set(e.clientX); y.set(e.clientY);
      setVisible(!(e.target as HTMLElement).closest('input, textarea, select, video, [data-cursor="hidden"]'));
    };
    const hide = () => setVisible(false);
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
    };
  }, [x, y, reduced]);

  if (reduced || !visible) return null;
  return <motion.div aria-hidden="true" data-pointer-glow="true"
    className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
    style={{ x: glowX, y: glowY }}>
    <div style={{ width: 260, height: 260, transform: 'translate(-50%, -50%)',
      background: 'radial-gradient(circle, rgba(124, 58, 237, 0.045), transparent 70%)' }} />
  </motion.div>;
}
