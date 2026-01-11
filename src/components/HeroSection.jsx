import React, { useState, useRef } from 'react';
import { Calculator, Keyboard, Calendar, DollarSign, Palette, FileText, Terminal } from 'lucide-react';

const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  // Generate floating particles with lazy initialization
  const [particles] = useState(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }))
  );

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const floatingIcons = [
    { Icon: Calculator, color: 'text-indigo-500', position: 'top-8 left-8', size: 'w-16 h-16 md:w-24 md:h-24', rotate: '-rotate-12', delay: '0s' },
    { Icon: Keyboard, color: 'text-purple-500', position: 'bottom-8 right-16', size: 'w-20 h-20 md:w-32 md:h-32', rotate: 'rotate-12', delay: '0.5s' },
    { Icon: Calendar, color: 'text-pink-500', position: 'top-16 right-8', size: 'w-12 h-12 md:w-16 md:h-16', rotate: 'rotate-6', delay: '1s' },
    { Icon: DollarSign, color: 'text-emerald-500', position: 'bottom-16 left-24', size: 'w-14 h-14 md:w-20 md:h-20', rotate: '-rotate-6', delay: '1.5s' },
    { Icon: Palette, color: 'text-orange-500', position: 'top-1/3 left-4', size: 'w-10 h-10 md:w-14 md:h-14', rotate: 'rotate-12', delay: '2s' },
    { Icon: FileText, color: 'text-blue-500', position: 'top-1/4 right-1/4', size: 'w-10 h-10 md:w-12 md:h-12', rotate: '-rotate-6', delay: '2.5s' },
    { Icon: Terminal, color: 'text-green-500', position: 'bottom-1/3 right-8', size: 'w-12 h-12 md:w-16 md:h-16', rotate: 'rotate-3', delay: '3s' },
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden rounded-3xl mb-16 group"
    >
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x rounded-3xl" />
      
      {/* Inner Content Container */}
      <div className="relative m-[2px] bg-white dark:bg-slate-900 rounded-[22px] px-6 md:px-12 py-16 md:py-24 overflow-hidden">
        
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div 
            className="absolute w-[500px] h-[500px] rounded-full blur-3xl animate-blob"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              top: '10%',
              left: '10%',
              animationDelay: '0s',
            }}
          />
          <div 
            className="absolute w-[400px] h-[400px] rounded-full blur-3xl animate-blob"
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              top: '50%',
              right: '10%',
              animationDelay: '2s',
            }}
          />
          <div 
            className="absolute w-[350px] h-[350px] rounded-full blur-3xl animate-blob"
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              bottom: '10%',
              left: '30%',
              animationDelay: '4s',
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-linear-to-r from-indigo-400 to-purple-400 opacity-40 dark:opacity-60 animate-float"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>
        
        {/* Animated Background Icons (Parallax) */}
        <div 
          className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out"
          style={{ transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)` }}
        >
          {/* eslint-disable-next-line no-unused-vars */}
          {floatingIcons.map(({ Icon, color, position, size, rotate, delay }, index) => (
            <Icon 
              key={index}
              className={`absolute ${position} ${color} ${size} ${rotate} opacity-5 dark:opacity-15 animate-float-subtle`}
              style={{ animationDelay: delay }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-sm font-semibold border border-indigo-200 dark:border-indigo-700/50 shadow-md">
            <span>Boost your productivity</span>
          </div>
          
          {/* Main Title with Animated Gradient */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
            <span className="inline-block text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 animate-gradient-x bg-size-[200%_auto] drop-shadow-2xl">
              Fun For All
            </span>
          </h1>
          
          {/* Subtitle with better typography */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light max-w-3xl mx-auto leading-relaxed px-4">
            A collection of <span className="font-semibold text-indigo-600 dark:text-indigo-400">powerful tools</span> to boost your 
            <span className="font-semibold text-purple-600 dark:text-purple-400"> productivity</span> and 
            <span className="font-semibold text-pink-600 dark:text-pink-400"> skills</span>.
          </p>

          {/* Stats or Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 pt-4">
            {['7+ Tools', 'Free Forever', 'No Sign-up'].map((label, index) => (
              <div 
                key={index}
                className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mouse Spotlight effect (Overlay) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle 500px at ${50 + mousePos.x * 100}% ${50 + mousePos.y * 100}%, rgba(124, 58, 237, 0.08), transparent)`
          }}
        />

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default HeroSection;
