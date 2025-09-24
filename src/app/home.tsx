'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const boldAccent = '#F50057';
  const [showFirstText, setShowFirstText] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirstText((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <section className="relative flex items-center min-h-screen px-4 sm:px-10 lg:px-20">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-right sm:bg-center"
          style={{
            backgroundImage: 'url(/landingBg.jpeg)',
            backgroundPosition: '80% center', // shift slightly right on mobile
          }}
        ></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl text-left sm:ml-6 md:ml-12 lg:ml-16">
          {/* Eyebrow/badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: boldAccent }}></span>
            <span className="text-xs sm:text-sm text-gray-200">A voice for women with PCOS</span>
          </div>

          <h1 className="mt-4 text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Your{' '}
            <span
              style={{
                background: boldAccent,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Story
            </span>{' '}
            Matters
            <span
              style={{
                display: 'inline-block',
                width: '0.25em',
                height: '0.25em',
                backgroundColor: boldAccent,
                borderRadius: '50%',
                marginLeft: '0.15em',
              }}
            ></span>
          </h1>

          <h2 className="mt-6 text-base sm:text-lg md:text-xl text-gray-200 font-light max-w-xl">
            Join the movement. Share your experience with PCOS and help us demand better healthcare for women in India.
          </h2>

          {/* CTA Button */}
          <div className="mt-10">
            <Link href="/form">
              <button
                className="relative font-semibold py-4 px-8 sm:px-10 md:px-12 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center overflow-hidden"
                style={{
                  background: `linear-gradient(90deg, ${boldAccent}, #ff6b8a)`,
                  color: 'white',
                  minHeight: '60px',
                  width: '100%',
                  maxWidth: '320px',
                }}
              >
                {/* Animated Text */}
                <span
                  className={`absolute transition-opacity duration-500 ${showFirstText ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                  Share Your Story
                </span>
                <span
                  className={`absolute text-gray-200 transition-opacity duration-500 ${!showFirstText ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                  Click here to fill the survey
                </span>
                {/* Shine effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animation: 'shine 2s infinite' }} />
              </button>
            </Link>
            <Link href="/blog">
              <button className="relative font-semibold py-4 mt-2 px-8 sm:px-10 md:px-12 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center overflow-hidden"
                style={{
                  background: `linear-gradient(90deg, ${boldAccent}, #ff6b8a)`,
                  color: 'white',
                  minHeight: '60px',
                  width: '100%',
                  maxWidth: '320px',
                }}>Watch other stories</button>
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          60% { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
    </main>
  );
}
