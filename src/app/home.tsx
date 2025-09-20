'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const boldAccent = '#F50057'; // A vibrant, unmissable pink
  const [showFirstText, setShowFirstText] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirstText(prev => !prev);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const styles = `
    .card-hover-effect {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .card-hover-effect:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .button-text-animation span {
      transition: opacity 0.5s ease-in-out;
      position: absolute;
      width: 100%;
      left: 0;
      text-align: center;
    }
  `;

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <style>{styles}</style>
      
      {/* Hero Section with Background Image */}
      <section 
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: 'url(/landingBg.jpeg)', 
          backgroundSize: 'contain', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for readability */}
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-left ml-4 sm:ml-8 lg:ml-16">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-4">
            Your <span style={{
              background: `${boldAccent}`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              padding: 5,
            }}>Story </span> Matters
            <span style={{
              color: `${boldAccent}`
            }}>.</span>
          </h1> 
          {/* <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-4">
            Your <span style={{
              background: `linear-gradient(to right,#80ccff, ${boldAccent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              padding: 5,
            }}>Story </span> Matters
            <span style={{
              color: `${boldAccent}`
            }}>.</span>
          </h1>  */}
          <h2 className="mt-4 text-xl sm:text-1xl text-gray-200 font-light max-w-xl">
            Join the movement. Share your experience with PCOS and help us demand better healthcare for women in India.
          </h2>
          <div className="mt-10">
            <Link href="https://form.typeform.com/to/GQEOLs8X">
              <button 
                className="font-bold py-4 px-10 sm:px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg relative"
                style={{ backgroundColor: boldAccent, color: 'white', minHeight: '60px', width:'40%' }}
              >
                <div className="button-text-animation flex items-center justify-center">
                  <span style={{ opacity: showFirstText ? 1 : 0 }}>Share Your Story</span>
                  <span style={{color: `#d0d0d0`, opacity: !showFirstText ? 1 : 0 }}>Click here to fill up survey</span>
                </div>
              </button>
            </Link>
              {/* <h6 className="faded-text mt-2 mx-10 text-left text-xs">Click to fill up the above link</h6> */}
          </div>
          {/* <div className="mt-10">
            <Link href="https://form.typeform.com/to/GQEOLs8X">
              <button 
                className="font-bold py-4 px-10 sm:px-12 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg relative"
                style={{ backgroundColor: boldAccent, color: 'white', minHeight: '60px' }}
              >
                <div className="button-text-animation">
                  <span style={{ opacity: showFirstText ? 1 : 0 }}>Share Your Story</span>
                  <span style={{ opacity: !showFirstText ? 1 : 0 }}>Click here to fill up survey</span>
                </div>
              </button>
            </Link>
              <h6 className="faded-text mt-2 mx-10 text-left text-xs">Click to fill up the above link</h6>
          </div> */}
        </div>
      </section>

      {/* Statistics Section - BOLD NUMBERS */}
      <section className="py-20 sm:py-24 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl sm:text-5xl font-bold text-center mb-16 tracking-tight">THE SILENT EPIDEMIC</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div className="text-center p-6 bg-gray-800 rounded-lg card-hover-effect">
              <span className="text-7xl sm:text-8xl font-black block" style={{ color: boldAccent }}>1/5</span>
              <p className="mt-4 text-lg text-gray-400">Indian women has PCOS. Most don&apos;t know it.</p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-lg card-hover-effect">
              <span className="text-7xl sm:text-8xl font-black block" style={{ color: boldAccent }}>70%</span>
              <p className="mt-4 text-lg text-gray-400">Go undiagnosed, unheard, and untreated.</p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-lg card-hover-effect">
              <span className="text-7xl sm:text-8xl font-black block" style={{ color: boldAccent }}>22.5%</span>
              <p className="mt-4 text-lg text-gray-400">Is the reality. Your story can change that.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Your Story Matters - IMPACTFUL */}
      <section className="py-20 sm:py-24 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl sm:text-5xl font-bold text-center mb-16 tracking-tight">WHY YOUR STORY CAN CHANGE THE FUTURE</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[ 
              { title: 'BREAK THE SILENCE', text: 'Your experience is a lifeline for someone else.' },
              { title: 'DEMAND BETTER CARE', text: 'Help us identify where the system is failing.' },
              { title: 'BUILD A SISTERHOOD', text: 'Connect with women who understand the fight.' },
              { title: 'FUEL THE RESEARCH', text: 'Your data is crucial for a cure.' },
              { title: 'SPARK A MOVEMENT', text: "Be the voice that inspires action." },
              { title: 'CREATE REAL CHANGE', text: 'Turn your struggle into a legacy of hope.' },
            ].map(item => (
              <div key={item.title} className="p-8 border-2 rounded-lg card-hover-effect" style={{ borderColor: '#333' }}>
                <h4 className="text-xl font-bold mb-3" style={{ color: boldAccent }}>{item.title}</h4>
                <p className="text-gray-300 text-lg">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - FINAL & URGENT */}
      <section className="py-24 sm:py-32 text-center bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight">Your story has the power to change everything.</h3>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            It takes 10 minutes. It could help millions. All responses are confidential and secure.
          </p>
          <div className="mt-12">
            <Link href="/form">
              <button 
                className="font-bold py-5 px-16 sm:px-20 text-2xl rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                style={{ backgroundColor: boldAccent, color: 'white' }}
              >
                I&apos;M READY
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-500 text-sm">This is more than a survey. It&apos;s a movement.</p>
          <p className="text-xs text-gray-600 mt-4">
            All data is anonymized and used for research and advocacy to improve women&apos;s healthcare in India.
          </p>
        </div>
      </footer>
    </main>
  );
}