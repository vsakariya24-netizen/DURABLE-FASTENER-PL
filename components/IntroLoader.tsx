import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- 1. UTILITY ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- 2. SVG ICONS (The Screws) ---
const CustomSharpScrew1 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5 5L19 5L14 10H10L5 5Z" />
    <path d="M10.5 10H13.5L12 24L10.5 10Z" />
    <path d="M10 12L14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 14L10 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 18L14 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 20L11 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CustomDrywallScrew = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6 4H18V6C18 6 16 8 16 9H8C8 8 6 6 6 6V4Z" />
    <path d="M11 9L13 9L12 23L11 9Z" /> 
    <path d="M10 11L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 14L14 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 17L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M11 20L13 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CustomSharpScrew = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5 5L19 5L14 10H10L5 5Z" />
    <path d="M10.5 10H13.5L12 24L10.5 10Z" />
    <path d="M10 12L14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 14L10 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 18L14 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 20L11 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// --- 3. MAIN LOADER COMPONENT ---
const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  // Stages: flying -> converge -> explode -> logo -> finish
  const [stage, setStage] = useState<'flying' | 'converge' | 'explode' | 'logo' | 'finish'>('flying');
  
  // Generate random particles (screws)
  const particles = useMemo(() => {
    const types = ['hex', 'drywall', 'sharp'] as const;
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 120 - 60, // Spread across screen width
      y: Math.random() * 120 - 60, // Spread across screen height
      scale: Math.random() * 0.5 + 0.8,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.2, // Very short random delay for speed
      type: types[Math.floor(Math.random() * types.length)],
      // Mix of Yellow (Brand) and Dark Gray (Industrial)
      color: Math.random() > 0.6 ? 'text-yellow-500' : 'text-neutral-700'
    }));
  }, []);

  useEffect(() => {
    // --- TIMING SEQUENCE (Optimized for Speed) ---
    
    // 1. Screws fly in immediately. At 1.0s, they suck into the center.
    const t1 = setTimeout(() => setStage('converge'), 1000);
    
    // 2. At 1.4s, the "Explosion" flash happens.
    const t2 = setTimeout(() => setStage('explode'), 1400);
    
    // 3. At 1.5s, the Logo appears.
    const t3 = setTimeout(() => setStage('logo'), 1500);
    
    // 4. At 2.8s, the loader exits to reveal the website.
    const t4 = setTimeout(() => {
        setStage('finish');
        // Give the exit animation a moment before unmounting
        setTimeout(onComplete, 800); 
    }, 2800);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  // Helper to render the correct SVG icon based on type
  const renderIcon = (type: string, className: string) => {
    switch (type) {
        case 'sharp': return <CustomSharpScrew1 className={className} />;
        case 'drywall': return <CustomDrywallScrew className={className} />;
        default: return <CustomSharpScrew className={className} />;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] overflow-hidden"
      // Exit animation: Slide up like a shutter
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-black to-black opacity-80" />

      {/* PARTICLE ANIMATION LAYER */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {stage !== 'logo' && stage !== 'finish' && particles.map((p) => (
            <motion.div
                key={p.id}
                className={`absolute ${p.color} will-change-transform`}
                initial={{ x: `${p.x}vw`, y: `${p.y}vh`, scale: 0, opacity: 0, rotate: p.rotation }}
                animate={
                    stage === 'flying' 
                    // Phase 1: Fly In (Fast)
                    ? { 
                        scale: [0, p.scale, p.scale * 1.1], 
                        opacity: [0, 1, 1], 
                        rotate: p.rotation + 360, 
                        transition: { duration: 1.2, ease: "easeOut", delay: p.delay } 
                      }
                    : stage === 'converge'
                    // Phase 2: Suck In (Snap)
                    ? { 
                        x: 0, y: 0, scale: 0.1, opacity: 0, rotate: p.rotation + 720, 
                        transition: { duration: 0.35, ease: "backIn" } 
                      }
                    : {}
                }
            >
                {renderIcon(p.type, "w-12 h-12 md:w-16 md:h-16")}
            </motion.div>
        ))}
      </div>

      {/* EXPLOSION FLASH LAYER */}
      <AnimatePresence>
        {stage === 'explode' && (
            <motion.div 
                className="absolute inset-0 bg-yellow-500 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }} // Quick flash
            />
        )}
      </AnimatePresence>

      {/* LOGO REVEAL LAYER */}
      {(stage === 'logo' || stage === 'finish') && (
        <motion.div 
            className="relative z-40 flex flex-col items-center"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
            {/* Glowing Aura behind logo */}
            <motion.div 
                className="absolute inset-0 bg-yellow-500 blur-[100px] opacity-20 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.1, 0.2] }}
                transition={{ repeat: Infinity, duration: 2 }}
            />
            
            {/* LOGO IMAGE - Ensure this path is correct in your public folder */}
            <img 
                src="/durablefastener.png" 
                alt="Durable Logo" 
                className="w-48 h-48 md:w-80 md:h-80 object-contain relative z-50 drop-shadow-2xl" 
            />
            
            {/* TEXT REVEAL */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-center"
            >
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">
                    Durable <span className="text-yellow-500">Fasteners</span>
                </h1>
                <p className="text-xs md:text-sm text-white/50 tracking-[0.5em] mt-2 uppercase font-mono">
                    Engineered for Perfection
                </p>
            </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default IntroLoader;