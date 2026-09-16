'use client';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export function RevealText({ children, className = '', delay = 0 }: { children: string; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 22 });
  const sy = useSpring(y, { stiffness: 140, damping: 22 });
  return <motion.span className={`reveal-text ${className}`} aria-label={children}
    style={reduced ? undefined : { x: sx, y: sy }}
    onPointerMove={e => { if (reduced || e.pointerType !== 'mouse') return; const r=e.currentTarget.getBoundingClientRect(); x.set(((e.clientX-r.left)/r.width-.5)*5); y.set(((e.clientY-r.top)/r.height-.5)*4); }}
    onPointerLeave={() => { x.set(0); y.set(0); }}
    initial="rest" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
    {children.split(/(\s+)/).map((word, i) => /^\s+$/.test(word) ? word : <motion.span aria-hidden="true" key={i} className="reveal-word"
      variants={{ rest: { opacity: reduced ? 1 : 0, y: reduced ? 0 : '0.65em', rotateX: reduced ? 0 : -14 }, shown: { opacity: 1, y: 0, rotateX: 0 } }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 16, mass: .7, delay: delay + Math.min(i * .025, .48) }}>{word}</motion.span>)}
  </motion.span>;
}
