'use client';
import { RevealText } from './reveal-text';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './hero.css';

const parts = ['ring', 'top', 'right', 'bottom', 'left', 'center'];
export function Hero({ heroTitle, heroSubtitle }: { heroTitle: string; heroSubtitle: string }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add({ mobile: '(max-width: 767px)', desktop: '(min-width: 768px)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
      if (!context.conditions?.motion) return;
      const mobile = context.conditions.mobile;
      const spread = mobile ? 28 : 52;
      let cleanup = () => {};
      const scope = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: {
          trigger: root.current, start: 'top top', end: () => `+=${window.innerHeight * (mobile ? 2.2 : 3.2)}`,
          pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: self => root.current?.style.setProperty('--progress', String(self.progress)),
        }});
        tl.to('.hero-intro', { y: -35, autoAlpha: 0, duration: 0.8 }, 0.15)
          .to('.logo-stage', { scale: mobile ? 1.08 : 1.18, rotationY: -12, rotationX: 7, duration: 1.2 }, 0)
          .to('.logo-ring', { rotation: -18, z: -70, scale: 1.07, duration: 1.4 }, 0.2)
          .to('.logo-top', { y: -spread, rotation: -9, z: 70, scale: 1.05, duration: 1.1 }, 0.4)
          .to('.logo-right', { x: spread, rotation: 12, z: 100, scale: 1.08, duration: 1.1 }, 0.55)
          .to('.logo-bottom', { y: spread, rotation: 8, z: 45, scale: 1.04, duration: 1.1 }, 0.7)
          .to('.logo-left', { x: -spread, rotation: -12, z: 85, scale: 1.06, duration: 1.1 }, 0.85)
          .to('.hero-bloom', { opacity: 0.65, scale: 1.2, duration: 1.3 }, 0.3)
          .fromTo('.hero-chapter', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 1)
          .to('.logo-part', { x: 0, y: 0, z: 0, rotation: 0, scale: 1, duration: 1.3, stagger: 0.065 }, 2.05)
          .to('.logo-stage', { rotationY: 8, rotationX: -5, scale: 1, duration: 1.5 }, 2.05)
          .to('.hero-chapter', { autoAlpha: 0, y: -20, duration: 0.5 }, 3.05)
          .to('.logo-stage', { xPercent: mobile ? 0 : 36, yPercent: mobile ? -28 : 0, scale: mobile ? 0.60 : 0.72, rotationY: -10, duration: 1.2 }, 3.4)
          .fromTo('.hero-outro', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 3.65)
          .to('.hero-bloom', { opacity: 0.18, duration: 1 }, 3.5);
        const pointer = root.current!;
        const tilt = pointer.querySelector('.logo-pointer');
        const rx = gsap.quickTo(tilt, 'rotationY', { duration: 0.8 });
        const ry = gsap.quickTo(tilt, 'rotationX', { duration: 0.8 });
        const move = (e: PointerEvent) => { if(e.pointerType !== 'mouse' || mobile) return; const b = pointer.getBoundingClientRect(); rx(((e.clientX-b.left) / b.width - 0.5) * 8); ry(-((e.clientY-b.top) / b.height - 0.5) * 6); };
        const leave = () => { rx(0); ry(0); };
        pointer.addEventListener('pointermove', move); pointer.addEventListener('pointerleave', leave);
        cleanup = () => { pointer.removeEventListener('pointermove', move); pointer.removeEventListener('pointerleave', leave); };
      }, root);
      return () => { cleanup(); scope.revert(); };
    });
    return () => mm.revert();
  }, []);
  return <section id="home" className="glass-hero" ref={root}>
    <div className="hero-lines" aria-hidden="true" /><div className="hero-bloom" aria-hidden="true" />
    <div className="hero-intro"><p className="hero-eyebrow">ME_4QAN / MOTION DESIGNER</p><h1><RevealText>{heroTitle}</RevealText></h1></div>
    <div className="logo-stage" role="img" aria-label="Purple glass logo: circular ring and four leaves"><div className="logo-pointer">{parts.map(part => <img key={part} className={`logo-part logo-${part}`} src={`/logo/${part}.png`} alt="" width="1254" height="1254" draggable={false} />)}</div></div>
    <div className="hero-chapter" aria-hidden="true"><span>01 / FORM IN MOTION</span><p>Every detail.<br /><em>Alive.</em></p></div>
    <div className="hero-outro"><p className="hero-eyebrow">DESIGNED TO MOVE YOU</p><h2>Ideas become<br /><em>experiences.</em></h2><p>{heroSubtitle}</p><div className="hero-actions"><a href="#work">Explore selected work ↗</a><a href="#contact">Let’s work together</a></div></div>
    <div className="hero-bottom"><span>SAAS · TECHNOLOGY · 3D</span><a href="#work">SCROLL TO EXPLORE ↓</a><span className="hero-rail" aria-hidden="true"><i /></span></div>
  </section>;
}
