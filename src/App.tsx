/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { RefreshCw, Sparkles } from 'lucide-react';

export default function App() {
  const [seed, setSeed] = useState(15);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mouse tracking for 3D tilt and lighting
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth springs for the motion values
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map smoothed mouse positions to rotation angles
  const rotateX = useTransform(smoothY, [0, 1], [15, -15]);
  const rotateY = useTransform(smoothX, [0, 1], [-15, 15]);

  // Map smoothed mouse positions to highlight coordinates
  const highlightX = useTransform(smoothX, [0, 1], [50, 450]);
  const highlightY = useTransform(smoothY, [0, 1], [50, 550]);
  
  // Shadow movement
  const shadowX = useTransform(smoothX, [0, 1], [20, -20]);
  const shadowY = useTransform(smoothY, [0, 1], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const generateNewPattern = () => {
    setIsGenerating(true);
    // Generate a new random seed for the SVG turbulence filter
    setSeed(Math.floor(Math.random() * 10000));
    setTimeout(() => setIsGenerating(false), 400);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 font-sans text-zinc-200 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="max-w-2xl w-full flex flex-col items-center relative z-10"
      >
        {/* 3D Container */}
        <div 
          className="w-full max-w-md aspect-[5/6] relative mb-12 cursor-crosshair"
          style={{ perspective: 1200 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div 
            className="w-full h-full relative"
            style={{ 
              rotateX, 
              rotateY,
              transformStyle: "preserve-3d"
            }}
          >
            {/* Dynamic Drop Shadow */}
            <motion.div 
              className="absolute inset-0 bg-black/80 blur-2xl rounded-[40%]"
              style={{
                x: shadowX,
                y: shadowY,
                scale: 0.85,
                translateZ: -50
              }}
            />

            <svg viewBox="0 0 500 600" className="w-full h-full absolute inset-0" style={{ transform: 'translateZ(0)' }}>
              <defs>
                {/* Procedural Wavy Filter for Malachite Bands */}
                <filter id="malachite-waves" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                  {/* Increased octaves for finer detail, dynamic seed */}
                  <feTurbulence type="fractalNoise" baseFrequency="0.015 0.035" numOctaves="6" seed={seed} result="noise" />
                  {/* Increased contrast for sharper banding */}
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3.5 -1" in="noise" result="enhancedNoise" />
                  {/* Increased scale for more dramatic waves */}
                  <feDisplacementMap in="SourceGraphic" in2="enhancedNoise" scale="55" xChannelSelector="R" yChannelSelector="G" />
                </filter>

                {/* Concentric Banding Gradients */}
                <radialGradient id="malachite-center1" cx="35%" cy="65%" r="12%" spreadMethod="reflect">
                  <stop offset="0%" stopColor="#02170c" />
                  <stop offset="12%" stopColor="#0a3d24" />
                  <stop offset="25%" stopColor="#187a43" />
                  <stop offset="38%" stopColor="#2bc26b" />
                  <stop offset="50%" stopColor="#125c31" />
                  <stop offset="65%" stopColor="#052414" />
                  <stop offset="80%" stopColor="#34d176" />
                  <stop offset="90%" stopColor="#187a43" />
                  <stop offset="100%" stopColor="#02170c" />
                </radialGradient>

                <radialGradient id="malachite-center2" cx="75%" cy="35%" r="16%" spreadMethod="reflect">
                  <stop offset="0%" stopColor="#0a3d24" />
                  <stop offset="15%" stopColor="#187a43" />
                  <stop offset="30%" stopColor="#34d176" />
                  <stop offset="45%" stopColor="#125c31" />
                  <stop offset="60%" stopColor="#02170c" />
                  <stop offset="75%" stopColor="#2bc26b" />
                  <stop offset="100%" stopColor="#0a3d24" />
                </radialGradient>

                <radialGradient id="malachite-center3" cx="50%" cy="10%" r="10%" spreadMethod="reflect">
                  <stop offset="0%" stopColor="#34d176" />
                  <stop offset="20%" stopColor="#187a43" />
                  <stop offset="40%" stopColor="#0a3d24" />
                  <stop offset="60%" stopColor="#02170c" />
                  <stop offset="80%" stopColor="#125c31" />
                  <stop offset="100%" stopColor="#2bc26b" />
                </radialGradient>

                {/* Stone Shape Clip Path */}
                <clipPath id="stone-clip">
                  <path d="M 250,40 C 390,40 470,140 460,310 C 450,490 340,560 240,560 C 110,560 40,460 40,300 C 40,110 110,40 250,40 Z" />
                </clipPath>

                {/* 3D Gloss and Lighting */}
                <linearGradient id="gloss" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                  <stop offset="20%" stopColor="white" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="white" stopOpacity="0" />
                  <stop offset="80%" stopColor="black" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="black" stopOpacity="0.9" />
                </linearGradient>

                {/* Gold Setting/Rim */}
                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#BF953F" />
                  <stop offset="25%" stopColor="#FCF6BA" />
                  <stop offset="50%" stopColor="#B38728" />
                  <stop offset="75%" stopColor="#FBF5B7" />
                  <stop offset="100%" stopColor="#AA771C" />
                </linearGradient>
              </defs>

              {/* Stone Base & Procedural Pattern */}
              <g clipPath="url(#stone-clip)">
                <g filter="url(#malachite-waves)">
                  <rect x="-100" y="-100" width="700" height="800" fill="url(#malachite-center1)" />
                  <circle cx="375" cy="210" r="400" fill="url(#malachite-center2)" style={{ mixBlendMode: 'overlay' }} opacity="0.85" />
                  <circle cx="250" cy="60" r="300" fill="url(#malachite-center3)" style={{ mixBlendMode: 'multiply' }} opacity="0.6" />
                </g>
                
                {/* 3D Shading / Gloss Overlays */}
                <rect x="0" y="0" width="500" height="600" fill="url(#gloss)" style={{ mixBlendMode: 'overlay' }} />
                <rect x="0" y="0" width="500" height="600" fill="url(#gloss)" opacity="0.6" />

                {/* Dynamic Specular Highlight (Moves with Mouse) */}
                <motion.circle 
                  cx={highlightX} 
                  cy={highlightY} 
                  r="140" 
                  fill="white" 
                  opacity="0.45" 
                  filter="blur(25px)" 
                  style={{ mixBlendMode: 'screen' }}
                />
              </g>

              {/* Gold Rim */}
              <path 
                d="M 250,40 C 390,40 470,140 460,310 C 450,490 340,560 240,560 C 110,560 40,460 40,300 C 40,110 110,40 250,40 Z" 
                fill="none" 
                stroke="url(#gold)" 
                strokeWidth="6" 
              />
              
              {/* Inner Rim Shadow for depth */}
              <path 
                d="M 250,40 C 390,40 470,140 460,310 C 450,490 340,560 240,560 C 110,560 40,460 40,300 C 40,110 110,40 250,40 Z" 
                fill="none" 
                stroke="black" 
                strokeWidth="3"
                opacity="0.3"
                transform="scale(0.98) translate(5, 6)"
              />
            </svg>
          </motion.div>
        </div>

        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-light tracking-widest uppercase text-emerald-400 flex items-center justify-center gap-3">
              <Sparkles className="w-6 h-6 text-emerald-500/50" />
              Malachite
              <Sparkles className="w-6 h-6 text-emerald-500/50" />
            </h1>
            <p className="text-zinc-400 max-w-md mx-auto leading-relaxed font-light">
              Interactive procedural SVG rendering. Hover over the stone to explore its 3D lighting and depth.
            </p>
          </div>

          <button
            onClick={generateNewPattern}
            disabled={isGenerating}
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-900/50 text-zinc-300 rounded-full transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/0 via-emerald-900/10 to-emerald-900/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin text-emerald-500' : 'group-hover:text-emerald-400 transition-colors'}`} />
            <span className="text-sm font-medium tracking-wide uppercase">
              {isGenerating ? 'Crystallizing...' : 'Generate New Pattern'}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
