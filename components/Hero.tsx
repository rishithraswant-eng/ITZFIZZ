'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PandaGrid, { PANELS_CONFIG } from './PandaGrid';
import TransformCanvas from './TransformCanvas';
import StatsBar from './StatsBar';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    let videoDuration = 0;

    // We will use requestAnimationFrame to smooth out video scrubbing
    // instead of letting GSAP directly set currentTime which can jump.
    let targetTime = 0;
    let isScrubbing = false;

    const smoothScrub = () => {
      if (!video) return;
      // Lerp for butter-smooth scrubbing
      const diff = targetTime - video.currentTime;
      // Standard smooth dampening without artificial stepping
      if (Math.abs(diff) > 0.001) {
        video.currentTime += diff * 0.1;
      }
      if (isScrubbing) {
        requestAnimationFrame(smoothScrub);
      }
    };

    const init = () => {
      videoDuration = video.duration || 10;
      isScrubbing = true;
      requestAnimationFrame(smoothScrub);

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Create the master timeline linked to scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=400%', // longer scroll distance for smoother experience
            pin: true,
            scrub: 1, // Let GSAP scrub the timeline smoothly
            onUpdate: (self) => setProgress(self.progress)
          }
        });

        // 1. Scrub the video time via our targetTime variable
        tl.to({ t: 0 }, {
          t: videoDuration,
          duration: 1,
          ease: 'none',
          onUpdate: function () {
            targetTime = this.targets()[0].t;
          }
        }, 0);

        // 20-40%: Grid lines widen slightly (DO NOT ANIMATE GAP, it causes layout reflows! Animate scale instead)
        tl.to('.grid-container', { scale: 1.05, duration: 0.2, ease: 'power1.inOut' }, 0.2);
        tl.to('.headline-side', { opacity: 0, duration: 0.2, ease: 'power1.inOut' }, 0.2);

        // Use predefined rotations instead of random to avoid recalculations
        PANELS_CONFIG.forEach((panel, i) => {
          tl.to(`.side-panel-${panel.id}`, { rotation: (i % 2 === 0 ? 1.5 : -1.5), duration: 0.2, ease: 'power1.inOut' }, 0.2);
        });

        // 40-55%: Fly out 8 panels, center scales up
        PANELS_CONFIG.forEach(panel => {
          tl.to(`.side-panel-${panel.id}`, {
            xPercent: panel.flyDir.x,
            yPercent: panel.flyDir.y,
            opacity: 0,
            duration: 0.15,
            ease: 'power2.inOut'
          }, 0.4);
        });

        // Scale center panel to cover the screen (GPU accelerated!)
        tl.to('.panda-panel-center', {
          scale: 4,
          opacity: 0,
          duration: 0.15,
          ease: 'power2.inOut'
        }, 0.4);

        // 55-60%: Background dims to midnight briefly
        tl.to(bgRef.current, { backgroundColor: '#0D0A1A', duration: 0.05, ease: 'none' }, 0.55);

        // 60-80%: Transformation & Shimmer
        tl.call(() => {
          document.querySelectorAll('.letter-F, .letter-I, .letter-Z').forEach(el => el.classList.add('shimmer'));
        }, [], 0.6);
        tl.call(() => {
          document.querySelectorAll('.letter-F, .letter-I, .letter-Z').forEach(el => el.classList.remove('shimmer'));
        }, [], 0.8);

        // 80-95%: Grid re-assembles
        PANELS_CONFIG.forEach(panel => {
          tl.to(`.side-panel-${panel.id}`, {
            xPercent: 0,
            yPercent: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.15,
            ease: 'power2.out'
          }, 0.8);
        });

        tl.to('.panda-panel-center', {
          scale: 1,
          opacity: 1,
          duration: 0.15,
          ease: 'power2.out'
        }, 0.8);

        tl.to('.grid-container', { scale: 1, duration: 0.15, ease: 'power2.out' }, 0.8);
        tl.to('.headline-side', { opacity: 1, duration: 0.15, ease: 'power2.out' }, 0.8);
        tl.to(bgRef.current, { backgroundColor: '#F5EDD8', duration: 0.15, ease: 'none' }, 0.8);
      });
    };

    if (video.readyState >= 1) {
      init();
    } else {
      video.addEventListener('loadedmetadata', init);
    }

    return () => {
      isScrubbing = false;
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 w-full h-full bg-cream z-0 transition-colors duration-300" />

      {/* 
        The video is placed absolute at z-10.
        The PandaGrid sits above it at z-20.
        When center scales up, it reveals this video completely or clips.
        Wait, if we use video as the main background and the grid center panel is transparent, 
        the video will always be seen through the center panel. 
      */}
      <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center">
        <video
          ref={videoRef}
          src="/panda-video.mp4"
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover transform translate-z-0"
        />
      </div>

      <PandaGrid />
      <TransformCanvas progress={progress} />
      <StatsBar progress={progress} />

      {/* Custom Cursor Glow (Desktop only) */}
      <CursorGlow />
    </section>
  );
}

function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Only apply on desktop
    if (window.innerWidth < 1024) return;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!active) setActive(true);
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed pointer-events-none z-[100] w-6 h-6 rounded-full bg-gold/40 blur-[4px] mix-blend-screen transition-transform duration-75"
      style={{
        left: pos.x - 12,
        top: pos.y - 12,
        boxShadow: '0 0 20px 8px rgba(212, 168, 83, 0.3)'
      }}
    />
  );
}
