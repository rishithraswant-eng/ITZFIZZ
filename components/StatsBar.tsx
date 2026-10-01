'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const stats = [
  { value: 98, suffix: '%', label: 'Customer Delight', delay: 0 },
  { value: 10, suffix: 'M+', label: 'Moments Created', delay: 0.12 },
  { value: 4.9, suffix: '★', label: 'Average Rating', delay: 0.24 },
  { value: 100, suffix: '∞', label: 'Fizz Factor', delay: 0.36 }, // using 100 as proxy for infinity if needed, but text is fine
];

export default function StatsBar({ progress }: { progress: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (progress > 0.8 && !animatedRef.current) {
      animatedRef.current = true;
      const ctx = gsap.context(() => {
        gsap.to(containerRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
        });

        // Animate numbers
        const numbers = containerRef.current?.querySelectorAll('.stat-number');
        const labels = containerRef.current?.querySelectorAll('.stat-label');

        if (numbers && labels) {
          numbers.forEach((el, index) => {
            const targetVal = parseFloat(el.getAttribute('data-val') || '0');
            const suffix = el.getAttribute('data-suffix') || '';
            const isInfinity = el.getAttribute('data-infinity') === 'true';

            if (isInfinity) {
              gsap.fromTo(el, { opacity: 0 }, {
                opacity: 1,
                duration: 1.2,
                delay: stats[index].delay,
                ease: 'power2.out'
              });
            } else {
              gsap.to(el, {
                innerText: targetVal,
                duration: 1.2,
                delay: stats[index].delay,
                snap: { innerText: targetVal % 1 === 0 ? 1 : 0.1 },
                ease: 'power2.out',
                onUpdate: function () {
                  el.innerHTML = `${this.targets()[0].innerText}${suffix}`;
                }
              });
            }
          });

          gsap.fromTo(labels,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.6,
              stagger: 0.12,
              delay: 0.15,
              ease: 'power2.out'
            }
          );
        }
      });
      return () => ctx.revert();
    } else if (progress < 0.7 && animatedRef.current) {
      // Reset
      animatedRef.current = false;
      gsap.to(containerRef.current, { y: 40, opacity: 0, duration: 0.4 });
    }
  }, [progress]);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-12 left-0 w-full z-40 opacity-0 translate-y-[40px] px-6"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-end gap-6 md:gap-12 bg-warm-black/60 backdrop-blur-md p-6 md:p-8 rounded-xl border border-gold/20 shadow-2xl">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center sm:items-start flex-1 min-w-[120px]">
            <div
              className="stat-number font-display text-4xl md:text-5xl lg:text-6xl font-black text-gold mb-2"
              data-val={stat.value}
              data-suffix={stat.suffix}
              data-infinity={stat.label === 'Fizz Factor' ? 'true' : 'false'}
            >
              {stat.label === 'Fizz Factor' ? '∞' : '0'}
            </div>
            <div className="stat-label font-body text-cream text-xs md:text-sm tracking-widest uppercase opacity-0 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
