import Hero from '../components/Hero';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <main className="w-full relative">
      <Navbar />
      <Hero />
      <section className="w-full h-screen bg-midnight relative flex items-center justify-center overflow-hidden">
        {/* Parallax background watermark */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <h2 className="font-display text-[15vw] text-white-silk whitespace-nowrap tracking-widest">
            ITZ FIZZ
          </h2>
        </div>
        <div className="relative z-10 text-center max-w-4xl px-6">
          <h2 className="text-4xl md:text-6xl font-display text-white-silk mb-8">
            The Fizz Experience
          </h2>
          <p className="text-lg md:text-2xl text-cream/80 font-light leading-relaxed">
            Welcome to the new era of animated landing pages. The tuxedo panda awaits.
          </p>
        </div>
      </section>
    </main>
  );
}
