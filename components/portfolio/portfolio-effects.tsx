'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function PortfolioEffects() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.to('.light-leak-a', { xPercent: 12, yPercent: 15, rotation: 9, duration: 19, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.optical-flare-a', { x: 36, y: -18, scale: 1.08, opacity: 0.7, duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.optical-flare-b', { x: -28, y: 22, scale: 0.92, opacity: 0.35, duration: 17, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.light-leak-b', { xPercent: -14, yPercent: -12, duration: 24, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      }, ref);
      const pause = () => ctx.getTweens().forEach((t: gsap.core.Tween) => document.hidden ? t.pause() : t.resume());
      document.addEventListener('visibilitychange', pause);
      return () => { document.removeEventListener('visibilitychange', pause); ctx.revert(); };
    });
    const interactive = gsap.matchMedia();
    interactive.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      let frame = 0; let target: HTMLElement | null = null; let px = 0, py = 0;
      const move = (e: PointerEvent) => {
        target = (e.target as HTMLElement).closest('main .glass, main .glass-hover, nav button, .hero-actions a, footer a'); px=e.clientX; py=e.clientY;
        if(frame) return;
        frame=requestAnimationFrame(() => { frame=0; if(!target) return; const r=target.getBoundingClientRect(); target.style.setProperty('--glow-x', `${px-r.left}px`); target.style.setProperty('--glow-y', `${py-r.top}px`); });
      };
      document.addEventListener('pointermove', move, {passive:true});
      return () => { document.removeEventListener('pointermove', move); cancelAnimationFrame(frame); };
    });
    return () => { mm.revert(); interactive.revert(); };
  }, []);
  return <div className="portfolio-light-leaks" ref={ref} aria-hidden="true"><div className="light-leak-a"/><div className="light-leak-b"/><div className="optical-flare optical-flare-a"><i/><b/><span/></div><div className="optical-flare optical-flare-b"><i/><b/><span/></div></div>;
}
