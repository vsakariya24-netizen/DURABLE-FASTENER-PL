import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  motion, useMotionValue, useMotionTemplate, useTransform, useSpring, AnimatePresence 
} from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, Factory, Flame, Droplets, ScanFace, 
  Zap, Hexagon, ShieldCheck, MapPin, Settings, Component, 
  Crosshair, Layers, Cpu, Phone, Download, Container, FileSearch, 
  Database, Microscope
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// =========================================
// 1. UTILITY COMPONENTS
// =========================================

// Scroll Reveal Wrapper
const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Mouse Spotlight Card
const SpotlightCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div 
      className={`group relative border border-white/10 bg-slate-900/50 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

// 3D Parallax Card
const TiltedCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative h-full"
    >
      {children}
    </motion.div>
  );
};

// =========================================
// 2. REUSABLE PROTOCOL COMPONENT
// =========================================

interface ProtocolProps {
  theme: 'amber' | 'emerald' | 'blue' | 'violet';
  title: React.ReactNode;
  subtitle: string;
  icon: any;
  steps: string[];
}

const colorMap = {
  amber: {
    bg: 'bg-black',
    glow: 'from-amber-900/10 via-black to-black',
    accent: 'text-amber-500',
    border: 'border-amber-500/30',
    bgIcon: 'bg-amber-500/5',
    scanLine: 'bg-amber-500 shadow-[0_0_15px_#f59e0b]',
    stepBg: 'bg-amber-900/10 border-amber-900/30 text-amber-500/80'
  },
  emerald: { 
    bg: 'bg-[#020502]',
    glow: 'from-emerald-900/10 via-black to-black',
    accent: 'text-emerald-500',
    border: 'border-emerald-500/30',
    bgIcon: 'bg-emerald-500/5',
    scanLine: 'bg-emerald-500 shadow-[0_0_15px_#10b981]',
    stepBg: 'bg-emerald-900/10 border-emerald-900/30 text-emerald-500/80'
  },
  blue: { 
    bg: 'bg-[#020305]',
    glow: 'from-blue-900/10 via-black to-black',
    accent: 'text-blue-500',
    border: 'border-blue-500/30',
    bgIcon: 'bg-blue-500/5',
    scanLine: 'bg-blue-500 shadow-[0_0_15px_#3b82f6]',
    stepBg: 'bg-blue-900/10 border-blue-900/30 text-blue-500/80'
  },
  violet: { 
    bg: 'bg-[#050205]',
    glow: 'from-violet-900/10 via-black to-black',
    accent: 'text-violet-500',
    border: 'border-violet-500/30',
    bgIcon: 'bg-violet-500/5',
    scanLine: 'bg-violet-500 shadow-[0_0_15px_#8b5cf6]',
    stepBg: 'bg-violet-900/10 border-violet-900/30 text-violet-500/80'
  }
};

const ProtocolVisualization: React.FC<ProtocolProps> = ({ theme, title, subtitle, icon: Icon, steps }) => {
  const colors = colorMap[theme];

  return (
    <section className={`py-32 relative overflow-hidden ${colors.bg}`}>
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${colors.glow}`}></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <ScrollReveal>
          <div className="inline-block relative mb-8">
            {/* Laser Scanner Animation */}
            <motion.div 
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className={`absolute left-0 w-full h-[2px] z-20 ${colors.scanLine}`}
            />
            {/* Central Icon Box */}
            <div className={`w-24 h-24 border ${colors.border} ${colors.bgIcon} rounded-2xl flex items-center justify-center relative overflow-hidden backdrop-blur-sm`}>
               <Icon className={colors.accent} size={40} />
            </div>
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={0.2}>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            {title}
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={0.4}>
          <p className="text-xl text-slate-400 leading-relaxed mb-12 font-light max-w-2xl mx-auto">
            {subtitle}
          </p>
        </ScrollReveal>

        {/* Steps */}
        <div className="flex flex-wrap gap-4 justify-center">
           {steps.map((step, i) => (
             <ScrollReveal key={i} delay={0.4 + (i * 0.1)}>
               <div className={`flex items-center gap-2 text-xs font-mono px-4 py-2 rounded border uppercase tracking-wide ${colors.stepBg}`}>
                 <CheckCircle2 size={12} /> {step}
               </div>
             </ScrollReveal>
           ))}
        </div>
      </div>
    </section>
  );
};


// =========================================
// 3. MAIN OEM PLATFORM PAGE
// =========================================

const OEMPlatform: React.FC = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // --- ISO & TECHNICAL STANDARDS MAPPING ---
  const TECHNICAL_STANDARDS: Record<string, { std: string; label: string }> = {
    // HEAD STYLES
    "HEXAGON": { std: "ISO 4014 / 4017", label: "STRUCTURAL" },
    "PAN HEAD": { std: "ISO 7045", label: "GENERAL PURPOSE" },
    "COUNTERSUNK": { std: "ISO 7046", label: "FLUSH MOUNT" },
    "TRUSS": { std: "JIS B 1111", label: "WIDE BEARING" }, 
    "BUTTON": { std: "ISO 7380", label: "SAFETY PROFILE" },
    "SOCKET CAP": { std: "ISO 4762", label: "HIGH TENSILE" },
    "FLANGE": { std: "ISO 4161", label: "NON-SLIP" },
    "BUGLE": { std: "ISO 15481", label: "DRYWALL/WOOD" },
    
    // DRIVE SYSTEMS
    "PHILLIPS": { std: "ISO 7045-H", label: "TYPE H" },
    "TORX / STAR": { std: "ISO 10664", label: "HIGH TORQUE" },
    "ALLEN / HEX": { std: "ISO 2936", label: "INTERNAL DRV" },
    "SLOTTED": { std: "ISO 1207", label: "TRADITIONAL" },
    "SQUARE": { std: "ASME B18.6", label: "NO CAM-OUT" },
    "POZI": { std: "ISO 7048-Z", label: "TYPE Z" },
    "TRI-WING": { std: "NAS 4000", label: "AEROSPACE" },
    "ONE-WAY": { std: "SECURITY", label: "TAMPER PROOF" }
  };

  const getStandard = (name: string, type: 'head' | 'drive') => {
    const key = name ? name.toUpperCase().trim() : "";
    return TECHNICAL_STANDARDS[key] || { 
      std: type === 'head' ? "ISO STD" : "HIGH TORQUE", 
      label: "STANDARD" 
    };
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data } = await supabase.from('oem_content').select('*').single();
      if (data) setContent(data);
    } catch (error) {
      console.error("Error fetching OEM content", error);
    } finally {
      setLoading(false);
    }
  };

  // --- DATA CLEANING UTILS ---
  const getCleanData = (input: any) => {
    let clean = { name: '', img: '' };
    const unwrap = (val: any): any => {
      if (typeof val === 'string' && val.trim().startsWith('{')) {
        try { return unwrap(JSON.parse(val)); } catch { return val; }
      }
      return val;
    };
    const unwrappedInput = unwrap(input);
    if (typeof unwrappedInput === 'object' && unwrappedInput !== null) {
      clean.name = unwrappedInput.name || '';
      clean.img = unwrappedInput.img || '';
      const nestedData = unwrap(clean.name);
      if (typeof nestedData === 'object' && nestedData !== null) {
         if (nestedData.name) clean.name = nestedData.name;
         if (nestedData.img) clean.img = nestedData.img; 
      }
    } else {
      clean.name = String(unwrappedInput);
    }
    return clean;
  };

  const specs = content?.technical_specs || {};

  // --- EXISTING TAB DATA (Refactored to Grid) ---
  const techSpecs = {
    material: {
      title: "Raw Material Integrity",
      desc: "Zero-scrap policy. 100% sourced from Tata/JSW primary mills.",
      points: [
        { label: "Steel Grades", value: "SAE 1010, 1022, 10B21" },
        { label: "Stainless", value: "AISI 304, 316" },
        { label: "Wire Origin", value: "Primary Mills Only" },
        { label: "Structure", value: "Spheroidized" }
      ],
      icon: Layers,
      color: "text-blue-400",
      borderColor: "border-blue-500/50"
    },
    heat_treat: {
      title: "Thermal Processing",
      desc: "Continuous Mesh Belt Furnace for uniform core hardening.",
      points: [
        { label: "Method", value: "Carburizing / Carb" },
        { label: "Case Depth", value: "0.05mm - 0.25mm" },
        { label: "Core Hardness", value: "32-39 HRC" },
        { label: "Surface HV", value: "Min 550 HV" }
      ],
      icon: Flame,
      color: "text-orange-400",
      borderColor: "border-orange-500/50"
    },
    plating: {
      title: "Surface Engineering",
      desc: "High-performance coatings for extreme environments.",
      points: [
        { label: "Zinc (Cr3+)", value: "Blue, Yellow, Black" },
        { label: "Ruspert", value: "500H+ Salt Spray" },
        { label: "SST Life", value: "72Hrs - 1000Hrs" },
        { label: "De-embrittlement", value: "Baked @ 200°C" }
      ],
      icon: Droplets,
      color: "text-cyan-400",
      borderColor: "border-cyan-500/50"
    }
  };

  const liveHeadStyles = content?.head_styles || [];
  const liveDriveSystems = content?.drive_systems || [];

  if (loading) return (
    <div className="min-h-screen bg-[#030305] flex items-center justify-center">
       <div className="relative">
         <div className="w-20 h-20 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
         <div className="absolute inset-0 flex items-center justify-center font-mono text-blue-500 text-xs animate-pulse">LOADING</div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030305] text-slate-200 font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
      <Helmet>
        {/* 1. B2B & Commercial Title */}
        <title>OEM Fastener Manufacturer | Custom Automotive Bolts India - Durable Fastener</title>
        
        <meta 
          name="description" 
          content="India's leading OEM platform for custom industrial fasteners. We manufacture bespoke screws, bolts, and automotive components based on engineering drawings. ISO 9001:2015 Certified." 
        />
        
        <meta 
          name="keywords" 
          content="oem fastener manufacturer, custom bolts india, automotive oem fasteners, bespoke screw manufacturing, contract manufacturing rajkot, fastener product development" 
        />

        {/* 2. SERVICE SCHEMA (Google ko batane ke liye ki aap Custom Kaam karte hain) */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "OEM Custom Fastener Manufacturing",
              "serviceType": "Contract Manufacturing",
              "provider": {
                "@type": "Organization",
                "name": "Durable Fastener Pvt Ltd",
                "url": "https://durablefastener.com",
                "logo": "https://durablefastener.com/durablefastener.png",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Rajkot",
                  "addressRegion": "Gujarat",
                  "addressCountry": "IN"
                }
              },
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "description": "We provide end-to-end OEM manufacturing services for automotive and industrial brands. From cold forging to heat treatment, we produce fasteners exactly as per technical blueprints.",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Manufacturing Capabilities",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Cold Forging"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Thread Rolling"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Custom Heat Treatment"
                    }
                  }
                ]
              }
            }
          `}
        </script>
      </Helmet>
      {/* =========================================
          1. HERO: HOLOGRAPHIC BLUEPRINT
      ========================================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.07]"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030305]/80 to-[#030305]"></div>
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-blue-500/20 bg-blue-500/5 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-mono text-blue-400 tracking-[0.2em] uppercase">
                Rajkot Manufacturing Hub
              </span>
            </div>
          </ScrollReveal>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6 leading-none"
          >
            PRECISION <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-white to-blue-500 bg-[length:200%_auto] animate-gradient">
              ENGINEERED.
            </span>
          </motion.h1>

          <ScrollReveal delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light">
             We don't just manufacture fasteners. We engineer reliability for high-precision OEM supply chains across every industry.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/rfq" className="group relative px-8 py-4 bg-blue-600 text-white font-bold rounded-sm overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-shadow">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center gap-2">
                  INITIATE RFQ <ArrowRight size={18} />
                </span>
              </Link>
              <button className="px-8 py-4 border border-white/10 text-slate-300 font-mono text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
                <Download size={18} /> DOWNLOAD BROCHURE
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================
          2. DATA TICKER
      ========================================= */}
      <div className="border-y border-white/10 bg-[#0A0A0C] relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { label: "Monthly Output", val: "75M+", sub: "Pieces" },
              { label: "Steel Grade", val: "10B21", sub: "Boron Steel" },
              { label: "PPM Quality", val: "<50", sub: "Defect Rate" },
              { label: "Exporting To", val: "12+", sub: "Countries" },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.1} className="h-full">
                <div className="p-6 md:p-8 flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-default h-full">
                   <span className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight">{stat.val}</span>
                   <div className="flex flex-col items-center mt-1">
                      <span className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">{stat.label}</span>
                      <span className="text-[10px] text-slate-600 font-mono">{stat.sub}</span>
                   </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          3. TECHNICAL BASELINE (Redesigned)
      ========================================= */}
      <section className="py-32 px-6 relative bg-[#050505] overflow-hidden">
        {/* Abstract Technical Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Section Header */}
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-blue-500"></div>
                  <span className="text-blue-500 font-mono text-xs uppercase tracking-[0.2em] font-bold">
                    Production Capabilities
                  </span>
                </div>
                <h3 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                  TECHNICAL <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-600">
                    BASELINE.
                  </span>
                </h3>
              </div>
              
              {/* Certification Badge */}
              <div className="flex items-center gap-4 border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-sm">
                <ShieldCheck className="text-emerald-500" size={24} />
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm tracking-wide">ISO 9001:2015</span>
                  <span className="text-emerald-500 text-[10px] font-mono uppercase tracking-wider">Certified Facility</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* The Spec Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/10 border border-white/10 shadow-2xl">
            
            {/* 1. Material (Large Box) */}
            <div className="md:col-span-4 bg-[#0A0A0C] p-8 md:p-10 group hover:bg-[#0F1115] transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Component size={80} />
              </div>
              <div className="flex flex-col justify-between h-full relative z-10">
                 <div>
                    <span className="text-slate-500 font-mono text-xs uppercase tracking-widest block mb-2">Raw Material</span>
                    <h4 className="text-3xl font-mono text-white font-bold">{specs.material || "Steel & SS"}</h4>
                 </div>
                 <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400 font-mono text-xs">GRADES</span>
                      <span className="text-slate-300 font-mono text-sm">SAE 1010, 10B21, SS304</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* 2. Diameter (Range Visualizer) */}
            <div className="md:col-span-4 bg-[#0A0A0C] p-8 md:p-10 group hover:bg-[#0F1115] transition-colors">
               <span className="text-slate-500 font-mono text-xs uppercase tracking-widest block mb-4">Diameter Range</span>
               <div className="flex items-baseline gap-2 mb-6">
                 <h4 className="text-4xl font-mono text-white font-bold">{specs.diameter || "M2 - M8"}</h4>
                 <span className="text-sm text-slate-500 font-mono">metric</span>
               </div>
               {/* Visual Bar */}
               <div className="w-full h-12 bg-white/5 rounded-sm relative flex items-center px-2 border border-white/5">
                  <div className="absolute left-[10%] right-[10%] h-6 bg-blue-600/20 border border-blue-500/50 rounded-sm flex items-center justify-center">
                     <span className="text-[10px] text-blue-400 font-mono tracking-wider">OPTIMAL RANGE</span>
                  </div>
                  {/* Ticks */}
                  <div className="w-full flex justify-between px-1">
                     {[...Array(5)].map((_,i) => <div key={i} className="w-px h-2 bg-white/20"></div>)}
                  </div>
               </div>
            </div>

             {/* 3. Length (Range Visualizer) */}
             <div className="md:col-span-4 bg-[#0A0A0C] p-8 md:p-10 group hover:bg-[#0F1115] transition-colors">
               <span className="text-slate-500 font-mono text-xs uppercase tracking-widest block mb-4">Length Capacity</span>
               <div className="flex items-baseline gap-2 mb-6">
                 <h4 className="text-4xl font-mono text-white font-bold">{specs.length || "4mm - 125mm"}</h4>
                 <span className="text-sm text-slate-500 font-mono">mm</span>
               </div>
                {/* Visual Scale */}
                <div className="relative w-full h-1 bg-white/10 mt-10">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-3 flex justify-between items-center">
                     <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                     <div className="w-full h-px bg-gradient-to-r from-blue-500 to-blue-500"></div>
                     <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                  </div>
                  <div className="absolute -top-6 right-0 text-blue-500 font-mono text-xs">MAX 125mm</div>
                  <div className="absolute -top-6 left-0 text-slate-500 font-mono text-xs">MIN 4mm</div>
               </div>
            </div>

            {/* 4. Threads (Detail Box) */}
            <div className="md:col-span-5 bg-[#0A0A0C] p-8 group hover:bg-[#0F1115] transition-colors border-t md:border-t-0 border-white/10">
               <div className="flex items-start justify-between mb-6">
                 <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">Threading Spec</span>
                 <Settings className="text-blue-500/50 group-hover:text-blue-500 transition-colors" size={20} />
               </div>
               <h4 className="text-2xl font-mono text-white font-medium mb-4">{specs.thread || "Metric & Inch"}</h4>
               <div className="flex gap-2 flex-wrap">
                  {['Coarse', 'Fine', 'Machine', 'Self-Tapping'].map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono uppercase rounded-sm">
                      {tag}
                    </span>
                  ))}
               </div>
            </div>

            {/* 5. Surface Finishes (Wide Highlight Box) */}
            <div className="md:col-span-7 bg-gradient-to-br from-[#0F172A] to-[#0A0A0C] p-8 group border-t md:border-t-0 border-l md:border-l-0 border-white/10 relative">
               <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="text-blue-400 font-mono text-xs uppercase tracking-widest mb-2 block">Surface Engineering</span>
                    <h4 className="text-2xl md:text-3xl font-mono text-white font-bold leading-tight">
                      {specs.finish || "Zinc, Phosphate, Ruspert"}
                    </h4>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[140px]">
                     <div className="flex justify-between text-xs font-mono border-b border-white/10 pb-1">
                        <span className="text-slate-500">SST LIFE</span>
                        <span className="text-emerald-400">72-1000 HRS</span>
                     </div>
                     <div className="flex justify-between text-xs font-mono border-b border-white/10 pb-1">
                         <span className="text-slate-500">ROHS</span>
                         <span className="text-emerald-400">COMPLIANT</span>
                     </div>
                  </div>
               </div>
            </div>

          </div>
          
          {/* Bottom Decoration */}
          <div className="flex justify-between items-center mt-4 opacity-50">
             <div className="flex gap-4">
               <span className="text-[10px] text-slate-600 font-mono">REF: MFG-2025-A</span>
             </div>
             <div className="h-px w-32 bg-white/20"></div>
          </div>

        </div>
      </section>
      {/* =========================================
          4. THE PROCESS: SPOTLIGHT CARDS
      ========================================= */}
      <section className="py-32 px-6 relative">
         <div className="absolute top-[40%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent z-0 hidden lg:block"></div>
         <div className="absolute top-[40%] left-0 w-20 h-[2px] bg-blue-500 blur-sm z-0 hidden lg:block animate-beam"></div>

         <div className="max-w-7xl mx-auto relative z-10">
            <ScrollReveal>
              <div className="flex items-end justify-between mb-20">
                <div>
                  <h2 className="text-blue-500 font-mono text-xs mb-3 uppercase tracking-[0.3em] font-bold flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-blue-500 inline-block"></span> Workflow
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black text-white">Production Pipeline.</h3>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { step: "01", title: "Cold Heading", desc: "5-Station Bolt Formers", icon: Factory },
                 { step: "02", title: "Thread Rolling", desc: "High-precision rotary dies", icon: Zap },
                 { step: "03", title: "Heat Treat", desc: "Atmosphere Controlled", icon: Flame },
                 { step: "04", title: "Auto Sorting", desc: "Optical 360° Inspection", icon: ScanFace },
               ].map((proc, i) => (
                 <ScrollReveal key={i} delay={i * 0.15}>
                   <SpotlightCard className="rounded-2xl p-8 h-full">
                     <div className="absolute top-4 right-4 text-white/5 text-6xl font-black select-none">{proc.step}</div>
                     
                     <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 border border-blue-500/20 text-blue-400 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <proc.icon size={24} />
                     </div>
                     
                     <h4 className="text-xl font-bold text-white mb-2 relative z-10">{proc.title}</h4>
                     <p className="text-sm text-slate-500 leading-relaxed font-mono relative z-10">{proc.desc}</p>
                   </SpotlightCard>
                 </ScrollReveal>
               ))}
            </div>
         </div>
      </section>

      {/* =========================================
          5. TECH SPECS: DIGITAL GRID
      ========================================= */}
      <section className="py-24 bg-[#08080a] relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="mb-12">
               <span className="text-blue-500 font-mono text-xs uppercase tracking-widest font-bold">Specification Breakdown</span>
               <h3 className="text-4xl font-black text-white mt-2">Quality Standards.</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(techSpecs).map(([key, data], index) => (
                <div 
                  key={key} 
                  className="bg-slate-900/30 border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-blue-500/30 hover:bg-[#0F172A] transition-all duration-300"
                >
                  {/* Subtle Color Glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent blur-3xl opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                  
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-lg bg-white/5 ${data.color} ring-1 ring-white/10 group-hover:ring-blue-500/30 transition-all`}>
                      <data.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white">{data.title}</h3>
                  </div>
                  
                  {/* Description */}
                  <p className="text-slate-400 text-sm font-mono mb-8 leading-relaxed h-10 border-l-2 border-white/10 pl-3">
                    {data.desc}
                  </p>
                  
                  {/* Data Points List */}
                  <div className="space-y-4">
                      {data.points.map((pt, i) => (
                        <div key={i} className="flex justify-between items-end border-b border-dashed border-white/5 pb-2">
                           <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-widest">{pt.label}</span>
                           <span className={`font-mono text-sm font-bold ${data.color}`}>{pt.value}</span>
                        </div>
                      ))}
                  </div>
                  
                  {/* Bottom indicator */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-transparent group-hover:w-full transition-all duration-700"></div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================
          6. VISUAL CAPABILITIES: REBUILT FOR HIGHLIGHT
      ========================================= */}
      <section className="py-32 px-6 bg-[#030304] relative overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#030304_70%)] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
               <span className="text-blue-500 font-mono text-xs uppercase tracking-[0.3em] font-bold">Catalogue</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mt-2">Engineering <span className="text-blue-500">Inventory.</span></h2>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-20">
            
            {/* --- Head Styles Section --- */}
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-8 pl-2 border-l-4 border-blue-500">
                  <Database className="text-blue-500" size={24} />
                  <h4 className="text-xl font-bold text-white tracking-widest uppercase">Head Styles</h4>
                </div>
              </ScrollReveal>
              
              <div className="grid grid-cols-2 gap-8">
                {liveHeadStyles.map((item: any, i: number) => {
                  const { name, img } = getCleanData(item);
                  const info = getStandard(name, 'head');
                  
                  return (
                    <ScrollReveal key={i} delay={i * 0.1}>
                      <div className="h-64 perspective-1000 group">
                        <TiltedCard>
                          <div className="relative h-full w-full bg-[#0B0F17] rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center gap-4 overflow-hidden transition-all duration-500 group-hover:border-blue-500/40 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                            
                            {/* 1. Cyber Grid Background (Reveals on Hover) */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* 2. Central Spotlight (Glow behind image) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"></div>

                            {/* 3. Floating Image with Animation */}
                            <div 
                              className="relative z-20 w-32 h-32 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110"
                              style={{ transform: "translateZ(40px)" }} 
                            >
                              <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                              >
                                {img ? (
                                  <img 
                                    src={img} 
                                    alt={name} 
                                    className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_20px_20px_rgba(59,130,246,0.3)] transition-all duration-300" 
                                  />
                                ) : (
                                  <Component size={48} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                                )}
                              </motion.div>
                            </div>

                            {/* 4. Glassmorphic Text Panel */}
                            <div className="absolute bottom-0 inset-x-0 p-4 bg-white/5 backdrop-blur-md border-t border-white/5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center">
                              <div className="text-white font-bold text-sm uppercase tracking-wider">{name}</div>
                              <div className="flex items-center gap-2 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-blue-400 font-mono border border-blue-500/30 px-1.5 rounded bg-blue-500/5">
                                  {info.std}
                                </span>
                              </div>
                            </div>

                          </div>
                        </TiltedCard>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>

            {/* --- Drive Systems Section --- */}
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-8 pl-2 border-l-4 border-emerald-500">
                  <Microscope className="text-emerald-500" size={24} />
                  <h4 className="text-xl font-bold text-white tracking-widest uppercase">Drive Systems</h4>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-2 gap-8">
                {liveDriveSystems.map((item: any, i: number) => {
                  const { name, img } = getCleanData(item);
                  const info = getStandard(name, 'drive');

                  return (
                    <ScrollReveal key={i} delay={i * 0.1}>
                      <div className="h-64 perspective-1000 group">
                        <TiltedCard>
                           <div className="relative h-full w-full bg-[#0B0F17] rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center gap-4 overflow-hidden transition-all duration-500 group-hover:border-emerald-500/40 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                            
                            {/* 1. Cyber Grid Background (Emerald) */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* 2. Central Spotlight */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"></div>

                            {/* 3. Floating Image */}
                            <div 
                              className="relative z-20 w-32 h-32 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110"
                              style={{ transform: "translateZ(40px)" }} 
                            >
                               <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                              >
                                {img ? (
                                  <img 
                                    src={img} 
                                    alt={name} 
                                    className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_20px_20px_rgba(16,185,129,0.3)] transition-all duration-300" 
                                  />
                                ) : (
                                  <Cpu size={48} className="text-slate-700 group-hover:text-emerald-500 transition-colors" />
                                )}
                              </motion.div>
                            </div>

                            {/* 4. Glassmorphic Text Panel */}
                            <div className="absolute bottom-0 inset-x-0 p-4 bg-white/5 backdrop-blur-md border-t border-white/5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center">
                              <div className="text-white font-bold text-sm uppercase tracking-wider">{name}</div>
                              <div className="flex flex-col items-center mt-1 gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-emerald-400 font-mono border border-emerald-500/30 px-1.5 rounded bg-emerald-500/5">
                                  {info.std}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase scale-0 group-hover:scale-100 transition-transform delay-75">
                                  {info.label}
                                </span>
                              </div>
                            </div>
                            
                          </div>
                        </TiltedCard>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          7. THE GOLDEN SAMPLE: USING NEW REUSABLE COMPONENT
      ========================================= */}
      <ProtocolVisualization 
        theme="amber" 
        icon={Hexagon} 
        title={
          <>
            The <span className="text-amber-500">Golden Sample</span> Protocol.
          </>
        }
        subtitle="We eliminate import risk. You receive a lab-verified pre-production sample. Mass production only starts when you say 'GO'."
        steps={["Drawing Approval", "Lab Testing", "Sample Dispatch", "Mass Production"]}
      />

      {/* =========================================
          8. FOOTER CTA
      ========================================= */}
      <section className="py-24 bg-white text-black relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <ScrollReveal>
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
               READY TO <span className="text-blue-600">SCALE?</span>
             </h2>
           </ScrollReveal>
           <ScrollReveal delay={0.2}>
             <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="mailto:info@durablefastener.com" className="px-10 py-5 bg-black text-white font-bold rounded-sm hover:scale-105 transition-transform flex items-center justify-center gap-3 text-lg shadow-2xl">
                   <Phone size={22} /> BOOK ENGINEERING CALL
                </a>
             </div>
           </ScrollReveal>
        </div>
      </section>

    </div>
  );
};

export default OEMPlatform;