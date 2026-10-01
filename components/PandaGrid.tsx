'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const PANELS_CONFIG = [
  { id: 'tl', gridPos: 'col-start-1 row-start-1', flyDir: { x: -200, y: -200 } },
  { id: 'tc', gridPos: 'col-start-2 row-start-1', flyDir: { x: 0,    y: -300 } },
  { id: 'tr', gridPos: 'col-start-3 row-start-1', flyDir: { x: 200,  y: -200 } },
  { id: 'ml', gridPos: 'col-start-1 row-start-2', flyDir: { x: -300, y: 0    } },
  { id: 'mr', gridPos: 'col-start-3 row-start-2', flyDir: { x: 300,  y: 0    } },
  { id: 'bl', gridPos: 'col-start-1 row-start-3', flyDir: { x: -200, y: 200  } },
  { id: 'bc', gridPos: 'col-start-2 row-start-3', flyDir: { x: 0,    y: 300  } },
  { id: 'br', gridPos: 'col-start-3 row-start-3', flyDir: { x: 200,  y: 200  } },
];

export default function PandaGrid() {
  const headlineRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initial entrance animation
    const ctx = gsap.context(() => {
      // Stagger center and then panels
      gsap.from('.panda-panel-center', {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: 'power3.out',
      });
      
      gsap.from('.panda-panel-side', {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.2
      });
      
      // Headline split letter animation
      if (headlineRef.current) {
        const letters = headlineRef.current.querySelectorAll('.headline-letter');
        gsap.from(letters, {
          opacity: 0,
          y: 30,
          rotateX: -60,
          stagger: 0.04,
          duration: 0.6,
          ease: 'back.out(1.7)',
          delay: 0.4
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const Headline = ({ isCenter = false }) => (
    <div className={`absolute bottom-4 left-0 w-full text-center flex justify-center z-10 ${isCenter ? '' : 'headline-side'}`}>
      <div 
        ref={isCenter ? headlineRef : null}
        className="font-display font-black text-white-silk tracking-[0.35em] whitespace-nowrap px-4 w-full"
        style={{ fontSize: isCenter ? 'clamp(1rem, 3vw, 2.5rem)' : 'clamp(0.5rem, 1vw, 1rem)' }}
      >
        {'WELCOME ITZ FIZZ'.split('').map((char, i) => (
          <span key={i} className={`headline-letter ${char === ' ' ? 'mx-2' : ''} ${isCenter && char !== ' ' ? 'letter-' + char : ''}`}>
            {char}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-20 overflow-hidden">
      <div className="w-[95vw] h-[90vh] md:w-[90vw] md:h-[85vh] grid grid-cols-[1fr_2fr_1fr] grid-rows-[1fr_2fr_1fr] gap-[6px] grid-container will-change-transform">
        
        {/* Center Panel - Transparent to reveal the main scrubbing video behind it */}
        <div className="panda-panel panda-panel-center col-start-2 row-start-2 relative rounded-[4px] overflow-hidden border-[2px] border-[rgba(44,24,16,0.5)] bg-transparent">
          <Headline isCenter={true} />
        </div>

        {/* Side Panels */}
        {PANELS_CONFIG.map((panel) => (
          <div 
            key={panel.id} 
            className={`panda-panel panda-panel-side ${panel.gridPos} relative rounded-[4px] overflow-hidden border-[2px] border-[rgba(44,24,16,0.3)] bg-bamboo-dark/80 backdrop-blur-[2px] shadow-lg side-panel-${panel.id} will-change-transform`}
          >
             <Headline isCenter={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
