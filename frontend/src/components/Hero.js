import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'react-feather';

const FloatingIcon = ({ type }) => {
    let icon;
    switch (type) {
        case 'triangle':
            icon = <path d="M5 0L10 8H0L5 0Z" fill="white" />;
            break;
        case 'circle-dot':
            icon = <>
                <circle cx="5" cy="5" r="5" stroke="white" strokeWidth="0.5" fill="none" />
                <circle cx="5" cy="5" r="2" fill="white" />
            </>;
            break;
        case 'circle':
             icon = <circle cx="5" cy="5" r="4.5" stroke="white" strokeWidth="0.5" fill="none" />;
             break;
        default:
            icon = null;
    }
    return <svg className="w-2.5 h-2.5 mb-1" viewBox="0 0 10 10">{icon}</svg>;
}


const FloatingElement = ({ name, value, iconType }) => (
  <div className="text-left flex flex-col items-center">
    <FloatingIcon type={iconType} />
    <p className="text-sm font-semibold">{name}</p>
    <p className="text-gray-400 text-xs">{value}</p>
  </div>
);


const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-item', {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5, // Delay to start after navbar
      });
    }, heroRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative w-[95%] max-w-7xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 md:p-8">
        <div className="relative text-white text-center py-10 md:py-20 px-4 flex justify-center items-center min-h-[500px]">
        
        <div className="relative z-10 max-w-4xl">
            <div className="hero-item inline-block mb-4">
            <span className="text-sm bg-black/30 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
                AI-Powered Presentations ✨
            </span>
            </div>
            <h1 className="hero-item text-4xl md:text-6xl font-bold leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Create Stunning Presentations in Seconds
            </h1>
            <p className="hero-item text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Let our AI design and write your slides, so you can focus on delivering your message.
            </p>

            <div className="hero-item flex justify-center items-center space-x-4">
            <button className="bg-white text-black font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors">
                <span>Get Started for Free</span>
                <ArrowRight className="w-5 h-5" />
            </button>
            <button className="p-px font-semibold rounded-lg bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 hover:shadow-lg transition-shadow">
                <span className="block bg-gray-900/80 backdrop-blur-sm text-white py-3 px-6 rounded-lg">Watch Demo</span>
            </button>
            </div>
        </div>

        {/* Floating UI elements - hidden on smaller screens */}
        <div className="absolute top-1/4 left-24 hidden lg:block"><FloatingElement name="AI Content" value="From a prompt" iconType="triangle" /></div>
        <div className="absolute top-2/3 left-16 hidden lg:block"><FloatingElement name="Custom Templates" value="Professional look" iconType="circle-dot"/></div>
        
        <div className="absolute top-1/4 right-24 hidden lg:block"><FloatingElement name="Smart Layouts" value="Auto-arranges" iconType="triangle"/></div>
        <div className="absolute top-2/3 right-16 hidden lg:block"><FloatingElement name="Icon Library" value="Millions of assets" iconType="circle"/></div>

        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-xs text-gray-400 font-semibold">
                v1.0
            </div>
            <span className="text-gray-400">Scroll down</span>
        </div>

        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 text-sm text-gray-400">
            <p>SlideWise AI</p>
        </div>
        </div>
    </section>
  );
};

export default Hero;
