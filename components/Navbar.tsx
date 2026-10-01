'use client';

import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${scrolled ? 'bg-cream/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
    >
      <div className="font-display font-black text-xl tracking-[0.2em] text-bamboo-dark">
        ITZ FIZZ
      </div>
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
        <a href="#experience" className="hover:text-gold transition-colors">Experience</a>
        <a href="#story" className="hover:text-gold transition-colors">Story</a>
        <a href="#contact" className="hover:text-gold transition-colors">Contact</a>
      </div>
      <button className="bg-bamboo-dark text-cream px-5 py-2 rounded-full text-sm font-medium tracking-wide hover:scale-105 transition-transform duration-300">
        Enter the Fizz
      </button>
    </nav>
  );
}
