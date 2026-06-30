import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trash2 } from 'lucide-react';

/**
 * High-fidelity Lottie-style Animations utilizing CSS keyframes, SVG paths, and Framer Motion.
 */

interface LottieTrashConfettiProps {
  isDeleting: boolean;
  onComplete?: () => void;
}

export function LottieTrashConfetti({ isDeleting, onComplete }: LottieTrashConfettiProps) {
  React.useEffect(() => {
    if (isDeleting && onComplete) {
      const timer = setTimeout(onComplete, 1600);
      return () => clearTimeout(timer);
    }
  }, [isDeleting, onComplete]);

  return (
    <div id="lottie-trash-container" className="relative w-36 h-36 flex items-center justify-center mx-auto my-3 overflow-visible">
      {/* Background glowing rings */}
      <div className="absolute inset-0 bg-rose-50 rounded-full scale-90 blur-xl opacity-60 animate-pulse" />
      
      {/* Interactive Floating Confetti Particles (only burst active when deleting) */}
      {isDeleting && (
        <div className="absolute inset-0 pointer-events-none z-15">
          {[...Array(16)].map((_, i) => {
            const angle = (i * 360) / 16;
            const distance = 40 + Math.random() * 45;
            const size = 4 + Math.random() * 6;
            const colors = ['#f43f5e', '#ec4899', '#f59e0b', '#3b82f6', '#10b981'];
            const randomColor = colors[i % colors.length];

            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((angle * Math.PI) / 180) * distance,
                  y: Math.sin((angle * Math.PI) / 180) * distance,
                  scale: [0, 1.2, 0.6, 0],
                  opacity: [1, 1, 0.8, 0],
                  rotate: [0, 180 + Math.random() * 180],
                }}
                transition={{
                  duration: 1.2,
                  ease: 'easeOut',
                  delay: Math.random() * 0.15,
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: randomColor,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Main Trash Container */}
      <motion.div
        animate={isDeleting ? {
          rotate: [0, -12, 12, -8, 8, 0],
          scale: [1, 0.9, 1.1, 0.95, 1],
        } : {}}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="w-20 h-20 bg-rose-500 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20 relative z-10 border border-white/20"
      >
        {/* Deleting Energy Lines */}
        {isDeleting && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeDasharray="15 150"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            />
          </svg>
        )}

        <Trash2 className={`w-10 h-10 ${isDeleting ? 'text-white' : 'text-white/90'} stroke-[2.25]`} />
      </motion.div>
    </div>
  );
}

interface ScanningRadarProps {
  currentPeriod?: string;
  nextPrediction?: string;
  predictionsHistory?: any[];
}

export function ScanningRadar({ 
  currentPeriod = '--', 
  nextPrediction = 'BIG', 
  predictionsHistory = [] 
}: ScanningRadarProps) {
  const [liveTime, setLiveTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const hoursStr = String(hours).padStart(2, '0');
      setLiveTime(`${hoursStr}:${minutes}:${seconds} ${ampm}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="photo-perfect-dashboard" className="relative w-full rounded-[24px] bg-[#f5f8f7] p-2 shadow-lg border border-gray-100 flex flex-col gap-2 overflow-hidden">
      {/* Dynamic Fluid Backdrop Radial Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.08, 0.92, 1],
          x: [0, 8, -8, 0],
          y: [0, -6, 6, 0]
        }}
        transition={{ 
          duration: 14, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-10 left-10 w-44 h-44 rounded-full bg-red-500/5 blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 0.92, 1.08, 1],
          x: [0, -12, 12, 0],
          y: [0, 8, -8, 0]
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-10 right-10 w-52 h-52 rounded-full bg-red-400/5 blur-3xl pointer-events-none"
      />

      {/* Top curved/slanted header */}
      <div className="relative h-[46px] w-full bg-[#e31e24] rounded-t-[20px] overflow-hidden flex items-center">
        {/* Ambient Fluid Liquid Waves (Double overlapping flowing layers) */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <svg className="absolute bottom-0 w-[200%] h-full text-white fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <motion.path
              d="M0,60 C150,100 350,20 500,60 C650,100 850,20 1000,60 C1150,100 1300,20 1450,60 L1450,120 L0,120 Z"
              animate={{ x: [0, -600] }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            />
          </svg>
          <svg className="absolute bottom-0 w-[200%] h-full text-red-300 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ bottom: '-2px' }}>
            <motion.path
              d="M0,50 C180,20 320,80 500,50 C680,20 820,80 1000,50 C1180,20 1320,80 1500,50 L1500,120 L0,120 Z"
              animate={{ x: [-600, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
            />
          </svg>
        </div>
        
        {/* Left white area with slanted edge and dots */}
        <div 
          className="absolute left-0 top-0 h-full bg-white flex items-center pl-4 pr-10 z-10 shadow-[3px_0_12px_rgba(0,0,0,0.08)]" 
          style={{ 
            width: '48%', 
            clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
            backgroundImage: 'radial-gradient(#00000012 1.2px, transparent 1.2px)',
            backgroundSize: '7px 7px'
          }}
        >
          {/* 3D Octagonal badge inside white area - slow float + shine animation */}
          <motion.div 
            animate={{ 
              y: [0, -1.5, 1.5, 0],
              rotate: [0, 0.5, -0.5, 0]
            }}
            whileHover={{ scale: 1.1 }}
            transition={{ 
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.2 }
            }}
            className="relative w-10.5 h-10.5 flex items-center justify-center filter drop-shadow-[0_2.5px_4.5px_rgba(227,30,36,0.22)] translate-x-3.5 cursor-pointer"
          >
            {/* Outer Red border Octagon */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-[#e31e24] to-[#be1319]" 
              style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
            />
            {/* White separator octagon */}
            <div 
              className="absolute inset-[1.5px] bg-white" 
              style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
            />
            {/* Inner Red Core */}
            <div 
              className="absolute inset-[3.2px] bg-gradient-to-b from-[#e31e24] to-[#a20d12] flex items-center justify-center shadow-inner" 
              style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
            >
              <span className="relative z-10 text-white font-black text-[13px] tracking-tighter uppercase select-none drop-shadow-sm">
                {nextPrediction && nextPrediction !== 'Calculating...' ? nextPrediction : 'BIG'}
              </span>
            </div>
            {/* Glossy Shimmer sweep overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 z-20 pointer-events-none"
              style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
              animate={{ 
                x: ['-100%', '100%'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: 3.5,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>

        {/* Right side for Period & Calendar */}
        <div className="absolute right-0 top-0 bottom-0 left-[48%] flex items-center justify-end px-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Period text & number */}
            <div className="flex flex-col text-right">
              <span className="text-[6.5px] font-extrabold text-white/80 tracking-widest uppercase mb-0.5">PERIOD</span>
              <motion.span 
                key={currentPeriod}
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-[8.5px] min-[375px]:text-[9px] sm:text-[9.5px] font-black text-white tracking-wider select-all font-mono leading-none"
              >
                {currentPeriod}
              </motion.span>
            </div>

            {/* Vertical separator line */}
            <div className="w-[1px] h-5 bg-white/20" />

            {/* Calendar icon container - white container with red icon with tactile hover/tap animations */}
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 6 }}
              whileTap={{ scale: 0.95 }}
              className="w-7 h-7 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#e31e24]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="3" />
                <path d="M16 2v4M8 2v4M3 10h18" />
                <circle cx="8" cy="14" r="1" fill="currentColor" />
                <circle cx="12" cy="14" r="1" fill="currentColor" />
                <circle cx="16" cy="14" r="1" fill="currentColor" />
                <circle cx="8" cy="18" r="1" fill="currentColor" />
                <circle cx="12" cy="18" r="1" fill="currentColor" />
                <circle cx="16" cy="18" r="1" fill="currentColor" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Grid of Columns */}
      <div className="grid grid-cols-5 gap-2 p-0.5 bg-transparent">
        {/* Column 1: Octagon Prediction Number Card with elegant hover lift and dynamic feedback */}
        <motion.div 
          whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(227,30,36,0.08), 0 8px 10px -6px rgba(227,30,36,0.08)" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="col-span-2 bg-white rounded-2xl border border-gray-100 p-2 shadow-sm flex flex-col items-center justify-center min-h-[142px] relative overflow-hidden group cursor-pointer"
        >
          {/* Subtle decoration lines */}
          <div className="absolute inset-1.5 border border-dashed border-red-500/10 rounded-xl pointer-events-none" />
          
          {/* Fluid liquid wave at bottom of prediction card */}
          <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden pointer-events-none opacity-[0.07]">
            <svg className="absolute bottom-0 w-[200%] h-full text-[#e31e24] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <motion.path
                d="M0,60 C150,100 350,20 500,60 C650,100 850,20 1000,60 C1150,100 1300,20 1450,60 L1450,120 L0,120 Z"
                animate={{ x: [0, -600] }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              />
            </svg>
            <svg className="absolute bottom-0 w-[200%] h-full text-[#be1319] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ bottom: '-2px' }}>
              <motion.path
                d="M0,50 C180,20 320,80 500,50 C680,20 820,80 1000,50 C1180,20 1320,80 1500,50 L1500,120 L0,120 Z"
                animate={{ x: [-600, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              />
            </svg>
          </div>

          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Red target bracket rings */}
            <div className="absolute inset-0 border-2 border-transparent border-t-red-500 border-b-red-500 rounded-full animate-spin pointer-events-none" style={{ animationDuration: '6s' }} />
            <div className="absolute inset-1.5 border border-transparent border-l-red-400 border-r-red-400 rounded-full animate-spin pointer-events-none" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
            
            {/* Red 3D Octagon containing prediction number - breathing scale & bounce on hover */}
            <motion.div 
              animate={{ scale: [1, 1.03, 0.97, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.08 }}
              className="absolute inset-3 bg-gradient-to-b from-[#e31e24] to-[#a20d12] flex items-center justify-center shadow-lg shadow-red-500/30 border border-white/10" 
              style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
            >
              {/* Animated high-gloss shimmer sweep */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
              />

              <motion.span 
                key={predictionsHistory[0]?.predictedNumbers?.[1] ?? 0}
                initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-white font-black text-3xl select-none leading-none drop-shadow-md"
              >
                {predictionsHistory[0]?.predictedNumbers?.[1] ?? 0}
              </motion.span>
            </motion.div>
          </div>
        </motion.div>

        {/* Column 2: Stacked Time + Category Cards */}
        <div className="col-span-3 flex flex-col gap-2">
          {/* Time Card with hover visual expansion */}
          <motion.div 
            whileHover={{ y: -2, boxShadow: "0 8px 20px -6px rgba(0,0,0,0.05)" }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm flex items-center justify-between relative overflow-hidden h-[67px] cursor-pointer group"
          >
            {/* Fluid liquid wave in background */}
            <div className="absolute bottom-0 left-0 right-0 h-5 overflow-hidden pointer-events-none opacity-[0.04]">
              <svg className="absolute bottom-0 w-[200%] h-full text-[#e31e24] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <motion.path
                  d="M0,50 C180,20 320,80 500,50 C680,20 820,80 1000,50 C1180,20 1320,80 1500,50 L1500,120 L0,120 Z"
                  animate={{ x: [0, -600] }}
                  transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
                />
              </svg>
            </div>
            <div className="flex items-center gap-1.5 relative z-10">
              {/* Red outline clock icon - smooth continuous hands spinning */}
              <div className="w-8 h-8 rounded-full border border-red-500/20 bg-red-50 flex items-center justify-center relative shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-red-500 rounded-full scale-90 animate-ping opacity-10" />
                <svg className="w-4 h-4 text-[#e31e24] relative" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  {/* Minute Hand */}
                  <motion.line 
                    x1="12" y1="12" x2="12" y2="7" 
                    style={{ originX: "12px", originY: "12px" }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                  />
                  {/* Hour Hand */}
                  <motion.line 
                    x1="12" y1="12" x2="15" y2="14" 
                    style={{ originX: "12px", originY: "12px" }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[7.5px] font-extrabold text-gray-400 tracking-wider uppercase leading-none mb-0.5">TIME</span>
                <span className="text-[9.5px] min-[375px]:text-[10px] font-black text-gray-800 tracking-tight font-mono whitespace-nowrap">
                  {liveTime}
                </span>
              </div>
            </div>
            {/* Three red dots */}
            <div className="flex gap-[1.5px] absolute top-1.5 right-2 z-10">
              <div className="w-1 h-1 rounded-full bg-[#e31e24]" />
              <div className="w-1 h-1 rounded-full bg-[#e31e24]" />
              <div className="w-1 h-1 rounded-full bg-[#e31e24]" />
            </div>
          </motion.div>

          {/* Category Card with hover animation */}
          <motion.div 
            whileHover={{ y: -2, boxShadow: "0 8px 20px -6px rgba(0,0,0,0.05)" }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm flex items-center justify-between relative overflow-hidden h-[67px] cursor-pointer group"
          >
            {/* Fluid liquid wave in background */}
            <div className="absolute bottom-0 left-0 right-0 h-5 overflow-hidden pointer-events-none opacity-[0.04]">
              <svg className="absolute bottom-0 w-[200%] h-full text-[#e31e24] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <motion.path
                  d="M0,60 C150,100 350,20 500,60 C650,100 850,20 1000,60 C1150,100 1300,20 1450,60 L1450,120 L0,120 Z"
                  animate={{ x: [-600, 0] }}
                  transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
                />
              </svg>
            </div>
            <div className="flex items-center gap-1.5 relative z-10">
              {/* Red Ribbon bookmark icon with float animation */}
              <motion.div 
                animate={{ y: [0, -1.5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="w-8 h-8 rounded-full border border-red-500/20 bg-red-50 flex items-center justify-center shrink-0"
              >
                <svg className="w-4 h-4 text-[#e31e24] fill-[#e31e24]" viewBox="0 0 24 24">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-[7.5px] font-extrabold text-gray-400 tracking-wider uppercase leading-none mb-1">CATEGORY</span>
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-gradient-to-r from-[#e31e24] to-[#be1319] text-white font-extrabold text-[8.5px] px-3.5 py-0.5 rounded-full shadow-sm shadow-red-500/20 select-none text-center"
                >
                  S1
                </motion.div>
              </div>
            </div>
            {/* Three red dots */}
            <div className="flex gap-[1.5px] absolute top-1.5 right-2 z-10">
              <div className="w-1 h-1 rounded-full bg-[#e31e24]" />
              <div className="w-1 h-1 rounded-full bg-[#e31e24]" />
              <div className="w-1 h-1 rounded-full bg-[#e31e24]" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom pure red footer strip with dynamic continuous highlight sweep */}
      <div className="relative bg-[#e31e24] h-8 rounded-b-[20px] px-2 flex items-center justify-between text-[6px] min-[375px]:text-[6.5px] font-black uppercase tracking-wider overflow-x-auto scrollbar-none select-none gap-2">
        {/* Continuous luxury diagonal shimmer beam */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent pointer-events-none"
          animate={{ x: ['-100%', '150%'] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 1, ease: "linear" }}
        />

        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1 min-w-fit shrink-0 text-white cursor-pointer relative z-10">
          <svg className="w-2.5 h-2.5 text-white fill-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>SECURE</span>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1 min-w-fit shrink-0 text-white cursor-pointer relative z-10">
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>PRIVATE</span>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1 min-w-fit shrink-0 text-white cursor-pointer relative z-10">
          <svg className="w-2.5 h-2.5 text-white fill-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
          <span>EDUCATIONAL</span>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1 min-w-fit shrink-0 text-white/90 cursor-pointer relative z-10">
          <svg className="w-2.5 h-2.5 text-white/90 fill-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span>LEGAL</span>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1 min-w-fit shrink-0 text-white/80 cursor-pointer relative z-10">
          <svg className="w-2.5 h-2.5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="whitespace-nowrap">PROTECTED ENVIRONMENT</span>
        </motion.div>
      </div>
    </div>
  );
}

export function GlowingEngine() {
  return (
    <div id="lottie-engine-core" className="relative w-14 h-14 flex items-center justify-center overflow-visible">
      {/* Animated glow halo */}
      <motion.div 
        animate={{ scale: [0.95, 1.12, 0.95], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-red-500/25 rounded-full blur-md"
      />
      
      {/* Outer Orbit Tracking Ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0.5 rounded-full border border-dashed border-red-500/40"
      />

      {/* Inner Reverse Spinning Ring */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-2.5 rounded-full border-[1.5px] border-solid border-white/80 border-t-red-600 border-b-red-400"
      />

      {/* Core Dot with Pulse */}
      <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/50 relative z-10 border border-white">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      </div>
    </div>
  );
}
