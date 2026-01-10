import React, { useEffect, useRef, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '../lib/supabase';
import { 
  ArrowRight, ShieldCheck, Layers, Globe, ArrowUpRight, Users, 
  Hammer, ScanLine, Thermometer, FileCheck
} from 'lucide-react';
import { 
  motion, useScroll, useTransform, useSpring, AnimatePresence, 
  useMotionValue, useMotionTemplate, useInView 
} from 'framer-motion';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const { Link } = ReactRouterDOM;

// --- UTILITIES & COMPONENTS ---
function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

interface SectionRevealProps { children: React.ReactNode; delay?: number; }
const SectionReveal: React.FC<SectionRevealProps> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay: delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const RevealText = ({ text, className }: { text: string, className?: string }) => (
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

// --- SCROLL WORD COMPONENT (FIXED) ---
// We use React.FC to explicitly tell TypeScript this component accepts 'key'
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
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <motion.span 
      style={{ opacity }} 
      className={`inline-block mr-[0.25em] ${className || ""}`}
    >
      {children}
    </motion.span>
  );
};

// --- ANIMATED ICONS ---
const AnimatedCultureIcon = () => (
    <div className="relative w-24 h-24 mb-6">
      <motion.div className="absolute inset-0 m-auto w-4 h-4 bg-white rounded-full z-10" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="absolute inset-0 border border-white/30 rounded-full" initial={{ rotate: i * 60 }} animate={{ rotate: 360 + (i * 60) }} transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}>
          <div className="w-3 h-3 bg-yellow-500 rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
        </motion.div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center"><Users className="w-8 h-8 text-white/50" /></div>
    </div>
);

const AnimatedCareerIcon = () => (
    <div className="relative w-24 h-24 mb-6 flex items-end justify-center pb-2 gap-2">
      {[0, 1, 2, 3].map((i) => (
        <motion.div key={i} className="w-4 bg-white/20" initial={{ height: 10 }} whileInView={{ height: 20 + (i * 15) }} transition={{ duration: 0.5, delay: i * 0.1 }}>
          <motion.div className="w-full h-full bg-yellow-500 origin-bottom" initial={{ scaleY: 0 }} whileHover={{ scaleY: 1 }} transition={{ duration: 0.3 }} />
        </motion.div>
      ))}
      <motion.div className="absolute top-2 right-2 text-yellow-500" animate={{ x: [0, 5, 0], y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}><ArrowUpRight size={32} /></motion.div>
    </div>
);

function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <div className={cn("group relative border border-neutral-800 bg-neutral-900/50 overflow-hidden rounded-[2rem]", className)} onMouseMove={handleMouseMove}>
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background: useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(234, 179, 8, 0.15), transparent 80%)` }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

const Counter = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      ref.current!.innerText = Math.floor(ease * end).toLocaleString();
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value]);
  return <span ref={ref}>0</span>;
};

// --- INTERACTION COMPONENTS ---
const MagneticButton = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * 0.3);
    y.set((clientY - (top + height / 2)) * 0.3);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={reset} style={{ x, y }} transition={{ type: "spring", stiffness: 150, damping: 15 }} className={className}>
      {children}
    </motion.div>
  );
};

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [exit, setExit] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => { setExit(true); setTimeout(onComplete, 1000); }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return (
    <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]" animate={exit ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 1 }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-black to-black opacity-50" />
      <motion.div className="relative z-40 flex flex-col items-center" initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }} animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
        <motion.div className="absolute inset-0 bg-yellow-500 blur-[100px] opacity-20 rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }} transition={{ repeat: Infinity, duration: 3 }} />
        <img src="/durablefastener.png" alt="Durable Logo" className="w-48 h-48 md:w-80 md:h-80 object-contain relative z-50 drop-shadow-2xl" />
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="mt-8 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">Durable <span className="text-yellow-500">Fastener</span></h1>
            <p className="text-xs md:text-sm text-white/50 tracking-[0.5em] mt-2 uppercase font-mono">Engineered for Perfection</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// --- ANIMATED MANIFESTO ---
const AnimatedManifesto = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.8", "end 0.5"]
  });

  const words = [
    { text: "We" }, { text: "do" }, { text: "not" }, { text: "just" }, { text: "manufacture" },
    { text: "screws." }, { text: "We" }, 
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
    <section ref={targetRef} className="py-40 bg-neutral-900 text-white rounded-[3rem] md:rounded-[5rem] relative z-30 min-h-[80vh] flex items-center justify-center border border-white/5">
      <div className="container mx-auto px-6">
        <span className="text-yellow-500 font-black tracking-widest uppercase block mb-12 text-center text-sm">Company Manifesto</span>
        <p className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] max-w-5xl mx-auto text-center flex flex-wrap justify-center gap-y-2">
           {words.map((word, i) => {
              const start = i / words.length;
              const end = start + (1 / words.length);
              return (
                <ScrollWord 
                  key={i} 
                  progress={scrollYProgress} 
                  range={[start, end]} 
                  className={word.className}
                >
                  {word.text}
                </ScrollWord>
              );
            })}
        </p>
      </div>
    </section>
  );
};

// --- MAIN HOME COMPONENT ---
const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, -150]);
  const rotate = useTransform(smoothProgress, [0, 0.2], [0, 5]);

  // --- DYNAMIC DATA STATE ---
  const [heroImages, setHeroImages] = useState<string[]>(["/allscrewtemplate123.jpg"]);
  const [heroText, setHeroText] = useState({ line1: "WHERE DESIRE", line2: "MEETS", line3: "VALUE" });
  const [stats, setStats] = useState({ dealers: 350, years: 13, products: 120 });
  const [categoryImages, setCategoryImages] = useState({ 
    industrial: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80",
    automotive: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80",
    fittings: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80",
    oem: "https://images.unsplash.com/photo-1565439396655-0dc065c717b0?auto=format&fit=crop&w=600&q=80"
  });
  
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // 1. Fetch Content from Supabase (site_content)
  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*').single();
      if (data) {
        // Hero
        if (data.hero_images && Array.isArray(data.hero_images) && data.hero_images.length > 0) {
          setHeroImages(data.hero_images);
        } else if (data.hero_bg) {
           setHeroImages([data.hero_bg]); // Fallback to old single image
        }
        
        setHeroText({
          line1: data.hero_title_1 || "WHERE DESIRE",
          line2: data.hero_title_2 || "MEETS",
          line3: data.hero_title_3 || "VALUE"
        });

        // Stats
        setStats({
            dealers: data.stat_dealers || 350,
            years: data.stat_years || 13,
            products: data.stat_products || 120
        });

        // Categories
       // Categories
        setCategoryImages({
            industrial: data.cat_fasteners || categoryImages.industrial,
            fittings: data.cat_fittings || categoryImages.fittings,
            automotive: data.cat_automotive || categoryImages.automotive,
            oem: data.cat_oem || categoryImages.oem // <--- THIS CONNECTS IT TO ADMIN
        });
      }
      setTimeout(() => setIsLoading(false), 1500);
    };
    fetchContent();
  }, []);

  // 2. Auto Scroll Logic
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroImages]);

  // 3. Scroll Lock
  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "auto";
  }, [isLoading]);

  return (
    <>
      <Helmet><title>Durable Fasteners | Extreme Engineering</title></Helmet>

      <AnimatePresence mode="wait">
        {isLoading && <IntroLoader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <main ref={containerRef} className="bg-[#050505] text-white selection:bg-yellow-500 selection:text-black overflow-hidden">
        
        {/* === HERO SECTION (Dynamic) === */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <motion.div style={{ y: heroY, scale: 1.1, rotate }} className="absolute inset-0 z-0 will-change-transform h-full w-full">
            <AnimatePresence mode="popLayout">
                <motion.img 
                    key={currentHeroIndex}
                    src={heroImages[currentHeroIndex]} 
                    initial={{ opacity: 0, y: 50, scale: 1.1 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} 
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] contrast-125" 
                    alt="Hero Background" 
                />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#050505] z-10" />
          </motion.div>

          <div className="container relative z-20 px-4 md:px-6 mt-0">
            <div className="flex flex-col items-center text-center justify-center h-full pt-20 md:pt-0">
              {!isLoading && (
                <>
                  <SectionReveal>
                    <div className="px-3 py-1.5 md:px-4 md:py-1 border border-yellow-500/30 rounded-full bg-yellow-500/10 backdrop-blur-md mb-6 md:mb-8 inline-block">
                        <span className="text-yellow-400 text-[10px] md:text-xs font-black tracking-[0.2em] md:tracking-[0.3em] uppercase">ISO 9001:2015 Global Standard</span>
                    </div>
                  </SectionReveal>

                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6vw] font-black leading-[0.9] tracking-tighter mb-8 md:mb-12 max-w-7xl mx-auto flex flex-col items-center">
                    <RevealText text={heroText.line1} />
                    <RevealText text={heroText.line2} />
                    <RevealText text={heroText.line3} className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 pb-2 md:pb-4" />
                  </h1>

                  <SectionReveal delay={0.4}>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-6 md:mt-10 pb-10 md:pb-0">
                        <MagneticButton>
                            <Link to="/products" className="group relative px-8 py-4 md:px-12 md:py-6 bg-yellow-500 rounded-full overflow-hidden flex items-center gap-3 shadow-[0_0_40px_-10px_rgba(234,179,8,0.5)] transition-transform hover:scale-105 active:scale-95">
                                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                <span className="relative z-10 font-black text-sm md:text-base text-black uppercase tracking-tighter transition-colors">Explore Ecosystem</span>
                                <ArrowUpRight className="relative z-10 text-black transition-colors w-4 h-4 md:w-5 md:h-5" />
                            </Link>
                        </MagneticButton>
                    </div>
                  </SectionReveal>
                </>
              )}
            </div>
          </div>
        </section>

        {/* === BENTO STATS (Dynamic) === */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
           <div className="max-w-7xl mx-auto">
              <SectionReveal>
                <div className="mb-12">
                   <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Engineering <span className="text-yellow-500">Excellence</span></h2>
                   <p className="text-neutral-400">Durable Fasteners Pvt Ltd by the numbers.</p>
                </div>
              </SectionReveal>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[400px]">
                 <div className="md:col-span-8 h-full">
                    <SectionReveal delay={0.1}>
                       <SpotlightCard className="h-full bg-neutral-900/80 backdrop-blur-md">
                          <div className="p-12 h-full flex flex-col justify-between relative z-10">
                             <div className="flex justify-between items-start">
                                <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20"><Globe className="w-8 h-8 text-yellow-500" /></div>
                                <ArrowUpRight className="w-6 h-6 text-neutral-600" />
                             </div>
                             <div className="mt-8">
                                <h3 className="text-6xl md:text-8xl font-black text-white tracking-tighter"><Counter value={stats.dealers} />+</h3>
                                <p className="text-lg text-yellow-200/80 mt-2 font-bold tracking-widest uppercase">GLOBAL STRATEGIC DEALERS</p>
                             </div>
                             
                             <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                                <svg width="400" height="200" viewBox="0 0 200 100" className="fill-yellow-500">
                                   <path d="M20,50 Q50,20 80,50 T140,50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                                   <circle cx="20" cy="50" r="3" /><circle cx="80" cy="50" r="3" /><circle cx="140" cy="50" r="3" />
                                </svg>
                             </div>
                          </div>
                       </SpotlightCard>
                    </SectionReveal>
                 </div>
                 <div className="md:col-span-4 flex flex-col gap-6 h-full">
                    <SectionReveal delay={0.2}>
                       <motion.div whileHover={{ scale: 1.02 }} className="flex-1 rounded-[2rem] bg-gradient-to-br from-yellow-500 to-yellow-600 p-8 shadow-lg relative overflow-hidden border border-yellow-400 h-[190px] flex flex-col justify-center">
                          <div className="absolute top-0 right-0 p-32 bg-white opacity-20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                          <div className="relative z-10">
                             <ShieldCheck className="w-8 h-8 text-black mb-4" />
                             <h3 className="text-5xl font-bold text-black"><Counter value={stats.years} />+</h3>
                             <p className="text-black/70 font-black text-xs mt-1 uppercase tracking-wider">Years Mastery</p>
                          </div>
                       </motion.div>
                    </SectionReveal>
                    <SectionReveal delay={0.3}>
                       <SpotlightCard className="flex-1 h-[190px]">
                          <div className="p-8 h-full flex flex-col justify-center">
                             <Layers className="w-8 h-8 text-neutral-400 mb-4 group-hover:text-yellow-400 transition-colors" />
                             <h3 className="text-5xl font-bold text-white"><Counter value={stats.products} />+</h3>
                             <p className="text-neutral-400 font-bold text-xs mt-1 uppercase tracking-wider group-hover:text-white transition-colors">SKU High Tensile</p>
                          </div>
                       </SpotlightCard>
                    </SectionReveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ANIMATED MANIFESTO */}
        <AnimatedManifesto />

        {/* PRODUCT SHOWCASE */}
        <section className="py-40">
  <div className="container mx-auto px-6 mb-20 flex justify-between items-end">
    <SectionReveal>
      <h2 className="text-6xl md:text-8xl font-black tracking-tighter">THE CORE<br/>PORTFOLIO</h2>
    </SectionReveal>
    <Link to="/products" className="hidden md:flex items-center gap-4 text-yellow-500 font-bold group">
      BROWSE ALL CATEGORIES <div className="w-12 h-12 rounded-full border border-yellow-500 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-black transition-all"><ArrowRight size={20}/></div>
    </Link>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
    {[
      // 1. I added a 'link' property to each item here
      { title: "Industrial", img: categoryImages.industrial, delay: 0, link: "/products?category=industrial" },
      { title: "Automotive", img: categoryImages.automotive, delay: 0.1, link: "/products?category=automotive" },
      { title: "Fittings", img: categoryImages.fittings, delay: 0.2, link: "/products?category=fittings" },
      { title: "OEM/Custom", img: categoryImages.oem, delay: 0.3, link: "/products?category=oem" }
    ].map((cat, i) => (
      <SectionReveal key={i} delay={cat.delay}>
        {/* 2. Wrapped the motion.div inside a Link component */}
        <Link to={cat.link} className="block h-full">
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
                
                <div className="absolute bottom-10 left-10 z-20">
                    <h3 className="text-4xl font-black mb-2">{cat.title}</h3>
                    <p className="text-white/60 uppercase tracking-widest text-xs">Explore Division</p>
                </div>

                {/* The VIEW button (Only visible on hover due to opacity-0 group-hover:opacity-100) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30">
                    <div className="w-24 h-24 bg-yellow-500 text-black rounded-full flex items-center justify-center font-black text-xs rotate-12 shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                        VIEW
                    </div>
                </div>
            </motion.div>
        </Link>
      </SectionReveal>
    ))}
  </div>
</section>

        {/* INFRASTRUCTURE */}
        {/* MANUFACTURING PROCESS: "THE JOURNEY" */}
        <section className="py-24 md:py-32 relative bg-[#050505] overflow-hidden border-y border-neutral-900">
          
          {/* Background Gradient Mesh */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-500/5 blur-[150px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
              
              {/* Header */}
              <SectionReveal>
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                   <div className="max-w-2xl">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="h-px w-12 bg-yellow-500"></span>
                        <span className="text-yellow-500 font-mono text-xs uppercase tracking-widest">Manufacturing DNA</span>
                      </div>
                      <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.95]">
                        FROM WIRE TO <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-700">MASTERPIECE.</span>
                      </h2>
                   </div>
                   <p className="text-neutral-400 max-w-md text-sm leading-relaxed mb-2">
                      Buyers don't just buy a product; they buy a process. Here is how we transform premium grade steel into industrial-grade reliability.
                   </p>
                </div>
              </SectionReveal>

              {/* PROCESS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[
                    {
                       step: "01",
                       title: "Material Sourcing",
                       desc: "We only procure high-grade C1022 Carbon Steel & Stainless Steel from certified mills. Every batch undergoes spectroscopic analysis.",
                       icon: Layers
                    },
                    {
                       step: "02",
                       title: "Cold Forging",
                       desc: "High-speed CNC headers form the perfect head geometry and drive recess without breaking the metal grain flow.",
                       icon: Hammer
                    },
                    {
                       step: "03",
                       title: "Thread Rolling",
                       desc: "Threads are rolled, not cut. This densifies the material structure, increasing tensile strength by 30% vs standard cutting.",
                       icon: ScanLine
                    },
                    {
                       step: "04",
                       title: "Heat Treatment",
                       desc: "Computer-controlled Carbo-Nitriding furnaces ensure the core is tough while the surface remains diamond-hard.",
                       icon: Thermometer
                    },
                    {
                       step: "05",
                       title: "Surface Engineering",
                       desc: "Advanced Zinc & Phosphate plating lines provide 720+ hours of salt-spray resistance against corrosion.",
                       icon: ShieldCheck
                    },
                    {
                       step: "06",
                       title: "Zero-Defect QC",
                       desc: "Optical sorting machines check dimensions, while our lab tests torque, ductility, and pull-out strength.",
                       icon: FileCheck
                    }
                 ].map((item, i) => (
                    <SectionReveal key={i} delay={i * 0.1}>
                       <motion.div 
                         whileHover={{ y: -10 }}
                         className="group relative p-8 h-full bg-neutral-900/50 border border-neutral-800 hover:border-yellow-500/50 rounded-3xl transition-all duration-300"
                       >
                          {/* Hover Glow */}
                          <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                          
                          <div className="relative z-10 flex flex-col h-full justify-between">
                             <div>
                                <div className="flex justify-between items-start mb-6">
                                   <div className="p-4 bg-black border border-neutral-800 rounded-2xl text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                      <item.icon size={28} strokeWidth={1.5} />
                                   </div>
                                   <span className="text-4xl font-black text-neutral-800 group-hover:text-neutral-700 transition-colors select-none">
                                      {item.step}
                                   </span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                                   {item.title}
                                </h3>
                                <p className="text-neutral-400 text-sm leading-relaxed">
                                   {item.desc}
                                </p>
                             </div>

                             {/* Bottom Line Indicator */}
                             <div className="w-full h-px bg-neutral-800 mt-8 group-hover:bg-yellow-500/50 transition-colors relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-800 rounded-full group-hover:bg-yellow-500 transition-colors" />
                             </div>
                          </div>
                       </motion.div>
                    </SectionReveal>
                 ))}
              </div>

              {/* Bottom CTA */}
              <SectionReveal delay={0.6}>
                 <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-6 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                          <ShieldCheck size={24} />
                       </div>
                       <div>
                          <h4 className="text-white font-bold">Lab Certified Quality</h4>
                          <p className="text-xs text-neutral-400">Every shipment includes a Mill Test Certificate (MTC).</p>
                       </div>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-neutral-700 mx-4"></div>
                    <Link to="/quality" className="group flex items-center gap-2 text-sm font-bold text-yellow-500 hover:text-white transition-colors uppercase tracking-widest">
                       See Quality Protocol <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                 </div>
              </SectionReveal>

          </div>
        </section>

        {/* CULTURE & CAREERS */}
        <section className="py-20 bg-[#050505]">
          <SectionReveal>
            <div className="flex flex-col md:flex-row h-[70vh] border-y border-white/10">
                {/* CULTURE */}
                <Link to="/life-at-durable" className="flex-1 relative group overflow-hidden border-r border-white/10 bg-[#0a0a0a]">
                    <div className="absolute inset-0 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 grayscale contrast-125 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110" alt="Team Culture" />
                    </div>
                    <motion.div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-yellow-500/10 to-transparent z-10 opacity-20 pointer-events-none" animate={{ top: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                    <div className="relative z-20 h-full flex flex-col items-center justify-center p-10 text-center">
                        <div className="scale-100 transition-transform duration-500 group-hover:-translate-y-4"><AnimatedCultureIcon /></div>
                        <h3 className="text-5xl font-black mt-4 text-white tracking-tighter group-hover:text-yellow-400 transition-colors drop-shadow-2xl">CULTURE</h3>
                        <p className="mt-2 text-white/60 uppercase tracking-[0.3em] text-[10px] group-hover:text-white transition-colors font-mono">Life at Durable</p>
                        <div className="absolute bottom-20 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <span className="px-6 py-2 bg-yellow-500 text-black font-bold text-xs uppercase tracking-widest rounded-full">View Gallery</span>
                        </div>
                    </div>
                </Link>

                {/* CAREERS */}
                <Link to="/careers" className="flex-1 relative group overflow-hidden bg-[#0a0a0a]">
                    <div className="absolute inset-0 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 grayscale contrast-125 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110" alt="Engineering Career" />
                    </div>
                    <motion.div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-yellow-500/10 to-transparent z-10 opacity-20 pointer-events-none" animate={{ top: ['-100%', '100%'] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }} />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                    <div className="relative z-20 h-full flex flex-col items-center justify-center p-10 text-center">
                        <div className="scale-100 transition-transform duration-500 group-hover:-translate-y-4"><AnimatedCareerIcon /></div>
                        <h3 className="text-5xl font-black mt-4 text-white tracking-tighter group-hover:text-yellow-400 transition-colors drop-shadow-2xl">CAREERS</h3>
                        <p className="mt-2 text-white/60 uppercase tracking-[0.3em] text-[10px] group-hover:text-white transition-colors font-mono">Join the Mission</p>
                        <div className="absolute bottom-20 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <span className="px-6 py-2 bg-yellow-500 text-black font-bold text-xs uppercase tracking-widest rounded-full">Open Positions</span>
                        </div>
                    </div>
                </Link>
            </div>
          </SectionReveal>
        </section>

        {/* CTA */}
        <section className="py-40 bg-yellow-500 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
              <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="flex whitespace-nowrap will-change-transform">
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