import React, { useState, useEffect } from "react";
import Button from "../components/common/Button";
import { FaDumbbell, FaHeart, FaUsers, FaTrophy, FaRunning, FaStopwatch, FaBolt } from "react-icons/fa";
import heroImage from "../assets/img/hero.jpg";
import AnimatedCounter from "../components/common/AnimatedCounter";

const DigitalScore = ({ icon, value, label, color, delay }) => (
  <div className="flex flex-col items-center justify-center px-4">
    <div className={`flex items-center justify-center text-3xl font-digital text-${color}-400 drop-shadow-lg mb-1`}>
      {React.createElement(icon, { className: `mr-2 text-${color}-400` })}
      <AnimatedCounter value={value} suffix="+" delay={delay} />
    </div>
    <span className="text-xs uppercase tracking-widest text-gray-300 font-semibold">{label}</span>
  </div>
);

const LiveNowTicker = () => (
  <div className="flex items-center justify-center gap-2 mb-4">
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
    </span>
    <span className="text-red-400 font-bold text-sm uppercase tracking-widest">Live Now: 3 people are working out!</span>
  </div>
);

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      {/* Hero Background Image with Subtle Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          transform: `translateY(${scrollY * 0.6}px) scale(${1 + scrollY * 0.0001})`
        }}
      />
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black/80 via-black/60 to-black/80 z-0" />

      {/* Live Now Ticker */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
        <LiveNowTicker />
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between px-8 md:px-16 lg:px-32 py-8 gap-8 lg:gap-0">
        
        {/* Left Content */}
        <div className="relative z-10 flex flex-col justify-center lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white mb-4 leading-tight tracking-tight">
            BUILD YOUR
            <span className="block bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              LEGACY
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 leading-relaxed font-medium max-w-xl mx-auto">
            Forge your body into a weapon. Transform weakness into strength with our battle-tested facilities and warrior trainers. Your transformation starts NOW.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
            <Button 
              title="Start Your Journey" 
              link="/signup"
              className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-2 border-red-400/50 hover:border-red-300 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg focus:ring-4 focus:ring-red-500/40 tracking-wide"
              aria-label="Start Your Journey"
            />
            <Button 
              title="Book a Class"
              link="/plans"
              className="group bg-black/40 backdrop-blur-xl border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-2 justify-center"
            >
              <FaRunning className="text-lg text-red-400 animate-bounce" />
            </Button>
          </div>
         
        </div>
        {/* Right Content - Digital Scoreboard */}
        <div className="w-full max-w-2xl mx-auto relative">
  {/* Glassy, angled scoreboard bar */}
  <div className="relative flex flex-row items-center justify-around py-8 px-6 bg-black/60 backdrop-blur-2xl border border-red-500 shadow-[0_0_32px_4px_rgba(239,68,68,0.4)] rounded-2xl" style={{
    clipPath: 'polygon(6% 0, 94% 0, 100% 20%, 100% 80%, 94% 100%, 6% 100%, 0 80%, 0 20%)',
    fontFamily: 'Orbitron, sans-serif',
    boxShadow: '0 0 32px 4px rgba(239,68,68,0.4), 0 2px 24px 0 rgba(0,0,0,0.7)'
  }}>
    {/* Animated scanline */}
    <div className="absolute left-0 top-0 w-full h-full pointer-events-none overflow-hidden z-10">
      <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-transparent via-red-400/60 to-transparent animate-scanline" />
    </div>
    {/* Stat: Calories Burned */}
    <div className="flex flex-col items-center gap-2 z-20">
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-black/70 border-2 border-red-500 shadow-[0_0_16px_2px_rgba(239,68,68,0.5)] mb-2">
        <FaBolt className="text-2xl text-red-400 drop-shadow-lg" />
      </div>
      <span className="text-3xl font-bold text-red-400 tracking-widest" style={{ fontFamily: 'Orbitron, sans-serif' }}>1.2K+</span>
      <span className="text-xs text-gray-200 uppercase tracking-widest">Calories</span>
    </div>
    {/* Stat: Active Members */}
    <div className="flex flex-col items-center gap-2 z-20">
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-black/70 border-2 border-red-500 shadow-[0_0_16px_2px_rgba(239,68,68,0.5)] mb-2">
        <FaUsers className="text-2xl text-red-400 drop-shadow-lg" />
      </div>
      <span className="text-3xl font-bold text-red-400 tracking-widest" style={{ fontFamily: 'Orbitron, sans-serif' }}>50+</span>
      <span className="text-xs text-gray-200 uppercase tracking-widest">Members</span>
    </div>
    {/* Stat: Classes Today */}
    <div className="flex flex-col items-center gap-2 z-20">
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-black/70 border-2 border-red-500 shadow-[0_0_16px_2px_rgba(239,68,68,0.5)] mb-2">
        <FaStopwatch className="text-2xl text-red-400 drop-shadow-lg" />
      </div>
      <span className="text-3xl font-bold text-red-400 tracking-widest" style={{ fontFamily: 'Orbitron, sans-serif' }}>5+</span>
      <span className="text-xs text-gray-200 uppercase tracking-widest">Classes</span>
    </div>
  </div>
  {/* Scanline animation keyframes */}
  <style>{`
    @keyframes scanline {
      0% { top: -10%; opacity: 0.1; }
      40% { opacity: 0.5; }
      50% { top: 100%; opacity: 0.2; }
      100% { top: 100%; opacity: 0; }
    }
    .animate-scanline {
      animation: scanline 2.5s linear infinite;
    }
  `}</style>
</div>
      </div>
 
        <svg viewBox="0 0 1920 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24 md:h-32 lg:h-40">
          <path d="M0 60 Q480 120 960 60 T1920 60 V120 H0 V60Z" fill="url(#wave-gradient)"/>
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
   
      {/* Featured In / Achievements Bar */}
      <div className="relative z-30 w-full flex flex-col items-center justify-center mt-4 mb-2">
        <div className="flex flex-row items-center gap-6 bg-black/40 px-6 py-3 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl">
          <span className="uppercase text-xs font-bold tracking-widest text-gray-300 mr-2">Featured In</span>
          <FaDumbbell className="text-red-500 text-xl" title="Strength" />
          <FaHeart className="text-red-400 text-xl" title="Wellness" />
          <FaTrophy className="text-yellow-400 text-xl" title="Awards" />
          <FaUsers className="text-blue-400 text-xl" title="Community" />
        </div>
      </div>
    </div>
  );
};

export default Home;