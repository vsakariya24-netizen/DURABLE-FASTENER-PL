import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  ArrowRight, ShieldCheck, Layers, Globe, ArrowUpRight, Users, Briefcase 
} from 'lucide-react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  AnimatePresence, 
  useMotionValue,
  useMotionTemplate,
  useInView
} from 'framer-motion';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const { Link } = ReactRouterDOM;

// --- 1. UTILITIES ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- 2. REUSABLE ANIMATION COMPONENTS ---

interface SectionRevealProps {
  children: React.ReactNode;
  delay?: number;
}

const SectionReveal: React.FC<SectionRevealProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

interface ScrollWordProps {
  children: React.ReactNode;
  progress: any;
  range: [number, number];
  className?: string;
}

const ScrollWord: React.FC<ScrollWordProps> = ({ 
  children, 
  progress, 
  range, 
  className 
}) => {
  const opacity = useTransform(progress, range, [0.15, 1]); 
  return (
    <motion.span style={{ opacity }} className={`inline-block mr-[0.25em] ${className}`}>
      {children}
    </motion.span>
  );
};

// --- NEW ANIMATED ICONS (UPDATED TO YELLOW THEME) ---

const AnimatedCultureIcon = () => {
  return (
    <div className="relative w-24 h-24 mb-6">
      {/* Central Node */}
      <motion.div 
        className="absolute inset-0 m-auto w-4 h-4 bg-white rounded-full z-10"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Orbiting Nodes */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 border border-white/30 rounded-full"
          initial={{ rotate: i * 60 }}
          animate={{ rotate: 360 + (i * 60) }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
        >
          {/* Changed shadow to Yellow */}
          <div className="w-3 h-3 bg-yellow-500 rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
        </motion.div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
         <Users className="w-8 h-8 text-white/50" />
      </div>
    </div>
  );
};

const AnimatedCareerIcon = () => {
  return (
    <div className="relative w-24 h-24 mb-6 flex items-end justify-center pb-2 gap-2">
      {/* Steps rising up */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-4 bg-white/20"
          initial={{ height: 10 }}
          whileInView={{ height: 20 + (i * 15) }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          {/* Changed bar color to Yellow */}
          <motion.div 
            className="w-full h-full bg-yellow-500 origin-bottom"
            initial={{ scaleY: 0 }}
            whileHover={{ scaleY: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      ))}
      {/* The Arrow - Changed to Yellow */}
      <motion.div
        className="absolute top-2 right-2 text-yellow-500"
        animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowUpRight size={32} />
      </motion.div>
    </div>
  );
};

// --- 3. BENTO COMPONENTS ---

const Counter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    let startTime: number;
    const endValue = value;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      if (ref.current) {
        ref.current.innerText = Math.floor(ease * endValue).toLocaleString();
      }
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return <span ref={ref}>0</span>;
};

function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        // Darker border and bg for industrial feel
        "group relative border border-neutral-800 bg-neutral-900/50 overflow-hidden rounded-[2rem]", 
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(234, 179, 8, 0.15), // Changed to Yellow RGBA
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

// --- 4. ICONS & LOADER ---
// (SVG Icons remain same, just logic wrapped)
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

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState<'flying' | 'converge' | 'explode' | 'logo' | 'finish'>('flying');
  
  const particles = useMemo(() => {
    const types = ['hex', 'drywall', 'sharp'] as const;
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      x: Math.random() * 120 - 60,
      y: Math.random() * 120 - 60,
      scale: Math.random() * 0.5 + 0.7,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.5,
      type: types[Math.floor(Math.random() * types.length)],
      // Changed to Yellow and Grey
      color: Math.random() > 0.7 ? 'text-yellow-500' : 'text-neutral-600'
    }));
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setStage('converge'), 2500);
    const t2 = setTimeout(() => setStage('explode'), 3200);
    const t3 = setTimeout(() => setStage('logo'), 3400);
    const t4 = setTimeout(() => {
        setStage('finish');
        setTimeout(onComplete, 1000);
    }, 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

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
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-black to-black opacity-50" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {stage !== 'logo' && stage !== 'finish' && particles.map((p) => (
            <motion.div
                key={p.id}
                className={`absolute ${p.color} will-change-transform`}
                initial={{ x: `${p.x}vw`, y: `${p.y}vh`, scale: 0, opacity: 0, rotate: p.rotation }}
                animate={
                    stage === 'flying' 
                    ? { scale: [0, p.scale, p.scale * 1.1], opacity: [0, 1, 1], rotate: p.rotation + 360, transition: { duration: 3, ease: "easeOut", delay: p.delay } }
                    : stage === 'converge'
                    ? { x: 0, y: 0, scale: 0.1, opacity: 0, rotate: p.rotation + 720, transition: { duration: 0.6, ease: "backIn" } }
                    : {}
                }
            >
                {renderIcon(p.type, "w-12 h-12 md:w-16 md:h-16")}
            </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {stage === 'explode' && (
            <motion.div 
                className="absolute inset-0 bg-yellow-500 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            />
        )}
      </AnimatePresence>

      {(stage === 'logo' || stage === 'finish') && (
        <motion.div 
            className="relative z-40 flex flex-col items-center"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
            <motion.div 
                className="absolute inset-0 bg-yellow-500 blur-[100px] opacity-20 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.1, 0.2] }}
                transition={{ repeat: Infinity, duration: 2 }}
            />
            <img src="/durablefastener.png" alt="Durable Logo" className="w-48 h-48 md:w-80 md:h-80 object-contain relative z-50 drop-shadow-2xl" />
            
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
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

// --- 5. INTERACTION COMPONENTS ---

const MagneticButton = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.3);
    y.set(middleY * 0.3);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const RevealText = ({ text, className }: { text: string, className?: string }) => {
  return (
    <div className="overflow-hidden">
      <motion.span
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        className={`block ${className || ""}`} 
      >
        {text}
      </motion.span>
    </div>
  );
};

// --- 6. MANIFESTO ANIMATION COMPONENT (Dark Mode Variant) ---
const AnimatedManifesto = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.8", "end 0.5"]
  });

  const words = [
    { text: "We" }, { text: "do" }, { text: "not" }, { text: "just" }, { text: "manufacture" },
    { text: "screws." }, { text: "We" }, 
    // Highlighting in Yellow now
    { text: "forge", className: "text-yellow-500" }, 
    { text: "the", className: "text-yellow-500" }, 
    { text: "backbone", className: "text-yellow-500" }, 
    { text: "of" }, { text: "industry." }, { text: "Every" }, { text: "thread" }, 
    { text: "is" }, { text: "a" }, { text: "promise" }, { text: "of" }, 
    { text: "safety,", className: "font-serif italic font-normal text-white/70" }, 
    { text: "durability,", className: "font-serif italic font-normal text-white/70" }, 
    { text: "and" }, { text: "extreme" }, 
    { text: "precision.", className: "font-serif italic font-normal text-white/70" }
  ];

  return (
    // Changed bg to Neutral-900 for Dark Theme consistency
    <section ref={targetRef} className="py-40 bg-neutral-900 text-white rounded-[3rem] md:rounded-[5rem] relative z-30 min-h-[80vh] flex items-center justify-center border border-white/5">
      <div className="container mx-auto px-6">
        <span className="text-yellow-500 font-black tracking-widest uppercase block mb-12 text-center text-sm">Company Manifesto</span>
        <p className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] max-w-5xl mx-auto text-center flex flex-wrap justify-center gap-y-2">
           {words.map((word, i) => {
             const start = i / words.length;
             const end = start + (1 / words.length);
             return (
               <ScrollWord key={i} progress={scrollYProgress} range={[start, end]} className={word.className}>
                 {word.text}
               </ScrollWord>
             )
           })}
        </p>
      </div>
    </section>
  );
};

// --- 7. MAIN COMPONENT ---
const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, -150]);
  const rotate = useTransform(smoothProgress, [0, 0.2], [0, 5]);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading]);

  return (
    <>
      <Helmet>
        <title>Durable Fasteners | Extreme Engineering</title>
      </Helmet>

      <AnimatePresence mode="wait">
        {isLoading && <IntroLoader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <main ref={containerRef} className="bg-[#050505] text-white selection:bg-yellow-500 selection:text-black overflow-hidden">
        
        {/* HERO SECTION */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <motion.div style={{ y: heroY, scale: 1.1, rotate }} className="absolute inset-0 z-0 will-change-transform">
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[#050505] z-10" />
            <img src = "/alscrew.jpg" className="w-full h-full object-cover grayscale-[0.8] contrast-125" alt="Hero Background" />
          </motion.div>

          <div className="container relative z-20 px-6 mt-20">
            <div className="flex flex-col items-center text-center">
              {!isLoading && (
                <>
                  <SectionReveal>
                    {/* Updated to Yellow Border/Text */}
                    <div className="px-4 py-1 border border-yellow-500/30 rounded-full bg-yellow-500/10 backdrop-blur-md mb-8 inline-block">
                        <span className="text-yellow-400 text-xs font-black tracking-[0.3em] uppercase">ISO 9001:2015 Global Standard</span>
                    </div>
                  </SectionReveal>

                  <h1 className="text-[7vw] lg:text-[6vw] font-black leading-[0.9] tracking-tighter mb-12 max-w-7xl mx-auto">
                    <RevealText text="WHERE DESIRE" />
                    <RevealText text="MEETS" />
                    {/* Updated to Yellow Gradient */}
                    <RevealText 
                      text="VALUE" 
                      className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 pb-2" 
                    />
                  </h1>

                  <SectionReveal delay={0.4}>
                    <div className="flex flex-wrap justify-center gap-8 mt-10">
                        <MagneticButton>
                        {/* Changed to Yellow Button with Black Text */}
                        <Link to="/products" className="group relative px-12 py-6 bg-yellow-500 rounded-full overflow-hidden flex items-center gap-3 shadow-[0_0_40px_-10px_rgba(234,179,8,0.5)]">
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 font-black text-black uppercase tracking-tighter transition-colors">Explore Ecosystem</span>
                            <ArrowUpRight className="relative z-10 text-black transition-colors" size={20} />
                        </Link>
                        </MagneticButton>
                    </div>
                  </SectionReveal>
                </>
              )}
            </div>
          </div>
        </section>

        {/* --- BENTO STATS SECTION --- */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto">
              {/* Optional Header */}
              <SectionReveal>
                <div className="mb-12">
                   <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                       Engineering <span className="text-yellow-500">Excellence</span>
                   </h2>
                   <p className="text-neutral-400">Durable Fasteners Pvt Ltd by the numbers.</p>
                </div>
              </SectionReveal>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[400px]">
                
                {/* --- Card 1: Global Dealers --- */}
                <div className="md:col-span-8 h-full">
                  <SectionReveal delay={0.1}>
                  <SpotlightCard className="h-full bg-neutral-900/80 backdrop-blur-md">
                    <div className="p-12 h-full flex flex-col justify-between relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                          <Globe className="w-8 h-8 text-yellow-500" />
                        </div>
                        <ArrowUpRight className="w-6 h-6 text-neutral-600 group-hover:text-yellow-400 transition-colors" />
                      </div>

                      <div className="mt-8">
                        <h3 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
                          <Counter value={350} />+
                        </h3>
                        <p className="text-lg text-yellow-200/80 mt-2 font-bold tracking-widest uppercase">
                          GLOBAL STRATEGIC DEALERS
                        </p>
                        <p className="text-neutral-500 text-sm mt-4 max-w-md leading-relaxed">
                          Supplying precision fasteners to major industrial hubs across Europe, Asia, and the Americas.
                        </p>
                      </div>

                      {/* Map stroke changed to Yellow */}
                      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                          <svg width="400" height="200" viewBox="0 0 200 100" className="fill-yellow-500">
                            <path d="M20,50 Q50,20 80,50 T140,50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                            <circle cx="20" cy="50" r="3" />
                            <circle cx="80" cy="50" r="3" />
                            <circle cx="140" cy="50" r="3" />
                          </svg>
                      </div>
                    </div>
                  </SpotlightCard>
                  </SectionReveal>
                </div>

                {/* Right Column Container */}
                <div className="md:col-span-4 flex flex-col gap-6 h-full">
                  
                  {/* --- Card 2: Experience (Brand Highlight) --- */}
                  <SectionReveal delay={0.2}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    // Changed gradient to Yellow-Gold
                    className="flex-1 rounded-[2rem] bg-gradient-to-br from-yellow-500 to-yellow-600 p-8 shadow-lg shadow-yellow-900/20 relative overflow-hidden border border-yellow-400 h-[190px] flex flex-col justify-center"
                  >
                    <div className="absolute top-0 right-0 p-32 bg-white opacity-20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                    
                    <div className="relative z-10">
                      <ShieldCheck className="w-8 h-8 text-black mb-4" />
                      <h3 className="text-5xl font-bold text-black">
                        <Counter value={13} />+
                      </h3>
                      <p className="text-black/70 font-black text-xs mt-1 uppercase tracking-wider">
                        Years of Manufacturing Mastery
                      </p>
                    </div>
                  </motion.div>
                  </SectionReveal>

                  {/* --- Card 3: SKU --- */}
                  <SectionReveal delay={0.3}>
                  <SpotlightCard className="flex-1 h-[190px]">
                    <div className="p-8 h-full flex flex-col justify-center">
                      <Layers className="w-8 h-8 text-neutral-400 mb-4 group-hover:text-yellow-400 transition-colors" />
                      <h3 className="text-5xl font-bold text-white">
                        <Counter value={120} />+
                      </h3>
                      <p className="text-neutral-400 font-bold text-xs mt-1 uppercase tracking-wider group-hover:text-white transition-colors">
                        SKU High Tensile Products
                      </p>
                    </div>
                  </SpotlightCard>
                  </SectionReveal>

                </div>
              </div>
            </div>
        </section>

        {/* ANIMATED MANIFESTO (Dark) */}
        <AnimatedManifesto />

        {/* PRODUCT SHOWCASE */}
        <section className="py-40">
          <div className="container mx-auto px-6 mb-20 flex justify-between items-end">
             <SectionReveal>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter">THE CORE<br/>PORTFOLIO</h2>
             </SectionReveal>
             {/* Yellow Link */}
             <Link to="/products" className="hidden md:flex items-center gap-4 text-yellow-500 font-bold group">
                 BROWSE ALL CATEGORIES <div className="w-12 h-12 rounded-full border border-yellow-500 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-black transition-all"><ArrowRight size={20}/></div>
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
              {[
                  { title: "Industrial", img: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80", delay: 0 },
                  { title: "Automotive", img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80", delay: 0.1 },
                  { title: "Furniture", img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80", delay: 0.2 },
                  { title: "OEM/Custom", img: "https://images.unsplash.com/photo-1565439396655-0dc065c717b0?auto=format&fit=crop&w=600&q=80", delay: 0.3 }
              ].map((cat, i) => (
                  <SectionReveal key={i} delay={cat.delay}>
                    <motion.div 
                        whileHover={{ scale: 0.98 }}
                        className="relative h-[600px] rounded-[2rem] overflow-hidden group cursor-pointer"
                    >
                        <img 
                            src={cat.img} 
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 will-change-transform" 
                            alt={cat.title} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute bottom-10 left-10">
                            <h3 className="text-4xl font-black mb-2">{cat.title}</h3>
                            <p className="text-white/60 uppercase tracking-widest text-xs">Explore Division</p>
                        </div>
                        {/* Changed View button to Yellow */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="w-24 h-24 bg-yellow-500 text-black rounded-full flex items-center justify-center font-black text-xs rotate-12 shadow-2xl">VIEW</div>
                        </div>
                    </motion.div>
                  </SectionReveal>
              ))}
          </div>
        </section>

        {/* INFRASTRUCTURE */}
        <section className="py-40 relative">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <SectionReveal>
                <div className="order-2 lg:order-1 relative rounded-[3rem] overflow-hidden border border-white/10 group">
                    <img 
                        src="https://images.unsplash.com/photo-1565439396655-0dc065c717b0?auto=format&fit=crop&w=800&q=80" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0" 
                        loading="lazy"
                        alt="Factory"
                    />
                    <div className="absolute top-10 left-10 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold tracking-widest uppercase shadow-black drop-shadow-md">Live Plant Data</span>
                    </div>
                </div>
              </SectionReveal>
              
              <div className="order-1 lg:order-2">
                 <SectionReveal delay={0.2}>
                    <span className="text-yellow-500 font-bold tracking-[0.4em] uppercase text-sm block mb-6">01 // Infrastructure</span>
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">THE RAJKOT<br/>GIGA-FACILITY</h2>
                    <p className="text-xl text-white/50 mb-12 leading-relaxed">7,000+ sq. ft. of pure engineering power. Real-time quality monitoring and automated thread precision.</p>
                    <div className="grid grid-cols-2 gap-8">
                        {['Heading', 'Rolling', 'Sorting', 'Quality'].map(item => (
                            <div key={item} className="flex items-center gap-4 border-l-2 border-yellow-600 pl-4">
                                <span className="text-2xl font-bold">{item}</span>
                            </div>
                        ))}
                    </div>
                 </SectionReveal>
              </div>
          </div>
        </section>

        {/* CULTURE & CAREERS SECTION */}
       <section className="py-20 bg-[#050505]">
          <SectionReveal>
            <div className="flex flex-col md:flex-row h-[70vh] border-y border-white/10">
                
                {/* --- LEFT SIDE: CULTURE --- */}
                <Link to="/life-at-durable" className="flex-1 relative group overflow-hidden border-r border-white/10 bg-[#0a0a0a]">
                    
                    {/* 1. IMAGE: Always visible (Grayscale) -> Color on Hover */}
                    <div className="absolute inset-0 overflow-hidden">
                        <img 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                            className="w-full h-full object-cover opacity-50 grayscale contrast-125 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110"
                            alt="Team Culture"
                        />
                    </div>

                    {/* 2. CREATIVITY: Animated Scanline (Tech Feel) */}
                    <motion.div 
                        className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-yellow-500/10 to-transparent z-10 opacity-20 pointer-events-none"
                        animate={{ top: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* 3. OVERLAYS: Grid & Gradient for text readability */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

                    {/* 4. CONTENT */}
                    <div className="relative z-20 h-full flex flex-col items-center justify-center p-10 text-center">
                        <div className="scale-100 transition-transform duration-500 group-hover:-translate-y-4">
                             <AnimatedCultureIcon />
                        </div>

                        <h3 className="text-5xl font-black mt-4 text-white tracking-tighter group-hover:text-yellow-400 transition-colors drop-shadow-2xl">
                            CULTURE
                        </h3>
                        <p className="mt-2 text-white/60 uppercase tracking-[0.3em] text-[10px] group-hover:text-white transition-colors font-mono">
                            Life at Durable
                        </p>

                        {/* Animated Reveal Button */}
                        <div className="absolute bottom-20 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <span className="px-6 py-2 bg-yellow-500 text-black font-bold text-xs uppercase tracking-widest rounded-full">
                                View Gallery
                            </span>
                        </div>
                    </div>
                </Link>

                {/* --- RIGHT SIDE: CAREERS --- */}
                <Link to="/career" className="flex-1 relative group overflow-hidden bg-[#0a0a0a]">
                    
                    {/* 1. IMAGE: Always visible (Grayscale) -> Color on Hover */}
                    <div className="absolute inset-0 overflow-hidden">
                        <img 
                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
                            className="w-full h-full object-cover opacity-50 grayscale contrast-125 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110"
                            alt="Engineering Career"
                        />
                    </div>

                     {/* 2. CREATIVITY: Animated Scanline (Tech Feel) */}
                     <motion.div 
                        className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-yellow-500/10 to-transparent z-10 opacity-20 pointer-events-none"
                        animate={{ top: ['-100%', '100%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                    />

                    {/* 3. OVERLAYS */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

                    {/* 4. CONTENT */}
                    <div className="relative z-20 h-full flex flex-col items-center justify-center p-10 text-center">
                         <div className="scale-100 transition-transform duration-500 group-hover:-translate-y-4">
                             <AnimatedCareerIcon />
                        </div>

                        <h3 className="text-5xl font-black mt-4 text-white tracking-tighter group-hover:text-yellow-400 transition-colors drop-shadow-2xl">
                            CAREERS
                        </h3>
                        <p className="mt-2 text-white/60 uppercase tracking-[0.3em] text-[10px] group-hover:text-white transition-colors font-mono">
                            Join the Mission
                        </p>
                        
                        {/* Animated Reveal Button */}
                        <div className="absolute bottom-20 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <span className="px-6 py-2 bg-yellow-500 text-black font-bold text-xs uppercase tracking-widest rounded-full">
                                Open Positions
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
          </SectionReveal>
        </section>

        {/* CTA (Yellow Brand Background) */}
        <section className="py-40 bg-yellow-500 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
             <motion.div 
              animate={{ x: ["0%", "-50%"] }} 
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="flex whitespace-nowrap will-change-transform"
             >
                 <span className="text-[20vh] font-black mr-20 text-black">DURABLE FASTENERS • </span>
                 <span className="text-[20vh] font-black mr-20 text-black">DURABLE FASTENERS • </span>
                 <span className="text-[20vh] font-black mr-20 text-black">DURABLE FASTENERS • </span>
             </motion.div>
          </div>
          
          <div className="relative z-10 container mx-auto px-6">
              <SectionReveal>
                <h2 className="text-7xl md:text-[10vw] font-black tracking-tighter mb-12 text-black">LET'S BUILD<br/>TOGETHER</h2>
                <div className="flex flex-col md:flex-row justify-center gap-6">
                    <Link to="/contact" className="px-16 py-8 bg-black text-white rounded-full font-black text-xl hover:scale-105 transition-transform active:scale-95 shadow-2xl">START A PROJECT</Link>
                    <Link to="/about" className="px-16 py-8 border-4 border-black text-black rounded-full font-black text-xl hover:bg-black hover:text-white transition-all">OUR STORY</Link>
                </div>
              </SectionReveal>
          </div>
        </section>

      </main>
    </>
  );
};

export default Home;     