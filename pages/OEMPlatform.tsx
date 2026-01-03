import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  motion, AnimatePresence, useMotionValue, 
  useMotionTemplate, useTransform, useSpring 
} from 'framer-motion';
import { 
  ArrowRight, Activity, FileText, CheckCircle2, FileCog, 
  Crosshair, Globe, Download, Phone, Layers, Cpu, 
  Component, Factory, Flame, Droplets, ScanFace, 
  Zap, Hexagon, Shield, Microscope, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- UTILITY COMPONENTS (FIXED TYPES) ---

// 1. SCROLL REVEAL WRAPPER
// Added React.FC type to accept 'key' prop
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

// 2. MOUSE SPOTLIGHT CARD
// Added React.FC type to accept 'key' prop
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

// 3. 3D PARALLAX CARD
// Added React.FC type for consistency
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

const OEMPlatform: React.FC = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'material' | 'heat_treat' | 'plating'>('material');

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

  const techSpecs = {
    material: {
      title: "Raw Material Integrity",
      desc: "Zero-scrap policy. 100% sourced from Tata/JSW primary mills.",
      points: [
        { label: "Steel Grades", value: "SAE 1010, 1022, 10B21 (Boron)" },
        { label: "Stainless", value: "AISI 304, 316 (A2/A4)" },
        { label: "Wire Origin", value: "Primary Mills Only" },
        { label: "Structure", value: "Spheroidized Annealed" }
      ],
      icon: Layers,
      color: "text-blue-400",
      borderColor: "border-blue-500/50"
    },
    heat_treat: {
      title: "Thermal Processing",
      desc: "Continuous Mesh Belt Furnace for uniform core hardening.",
      points: [
        { label: "Method", value: "Carburizing / Carbonitriding" },
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
              We don't just manufacture fasteners. We engineer reliability for the global automotive supply chain.
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
          3. THE PROCESS: SPOTLIGHT CARDS
      ========================================= */}
      <section className="py-32 px-6 relative">
         {/* Connecting Beam Animation */}
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
          4. TECH SPECS: DIGITAL HUD
      ========================================= */}
      <section className="py-24 bg-[#08080a] relative overflow-hidden border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Nav Tabs */}
              <div className="flex flex-row lg:flex-col gap-2 lg:w-1/4">
                {Object.entries(techSpecs).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as any)}
                    className={`text-left px-6 py-4 rounded-lg border transition-all duration-300 flex items-center gap-4 group ${
                      activeTab === key 
                        ? `bg-slate-800/50 ${data.borderColor} text-white` 
                        : 'bg-transparent border-transparent text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    <data.icon size={18} className={activeTab === key ? data.color : 'text-slate-600 group-hover:text-slate-400'} />
                    <span className="font-bold text-xs uppercase tracking-widest">{data.title}</span>
                    {activeTab === key && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
                  </button>
                ))}
              </div>

              {/* Content Display */}
              <div className="lg:w-3/4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-900/30 border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-${techSpecs[activeTab].color.split('-')[1]}-500/10 to-transparent blur-3xl opacity-20`}></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 border border-white/5`}>
                            SPEC-SHEET 2026
                          </span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2">{techSpecs[activeTab].title}</h3>
                        <p className="text-slate-400 mb-10 font-mono text-sm max-w-lg">{techSpecs[activeTab].desc}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                          {techSpecs[activeTab].points.map((pt, i) => (
                            <div key={i} className="flex flex-col border-b border-dashed border-white/10 pb-4">
                                <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-widest mb-1">{pt.label}</span>
                                <span className={`font-mono text-lg ${techSpecs[activeTab].color}`}>{pt.value}</span>
                            </div>
                          ))}
                        </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================
          5. VISUAL CAPABILITIES: 3D CARDS
      ========================================= */}
   <section className="py-32 px-6 bg-[#050507] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-white">Engineering <span className="text-blue-500">Inventory.</span></h2>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* --- Head Styles Section --- */}
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-8 pl-2">
                  <Component className="text-blue-500" size={24} />
                  <h4 className="text-xl font-bold text-white tracking-widest uppercase">Head Styles</h4>
                </div>
              </ScrollReveal>
              
              <div className="grid grid-cols-2 gap-6">
                {liveHeadStyles.map((item: any, i: number) => {
                  const { name, img } = getCleanData(item);
                  return (
                    <ScrollReveal key={i} delay={i * 0.1}>
                      <div className="h-48 perspective-1000">
                        <TiltedCard>
                          <div className="relative h-full w-full bg-[#0F172A] rounded-xl border border-white/5 p-6 flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 hover:bg-[#141d36] transition-colors shadow-2xl">
                            {/* Floating Image */}
                            <div 
                              className="relative z-10 w-20 h-20 flex items-center justify-center drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform translate-z-20"
                              style={{ transform: "translateZ(30px)" }} 
                            >
                              {img ? (
                                <img src={img} alt={name} className="w-full h-full object-contain filter drop-shadow-lg" />
                              ) : (
                                <Component size={32} className="text-slate-600" />
                              )}
                            </div>
                            <div className="text-center transform translate-z-10" style={{ transform: "translateZ(10px)" }}>
                              <div className="text-white font-bold text-sm uppercase tracking-wider">{name}</div>
                              <div className="text-xs text-blue-500/60 font-mono mt-1">ISO STD</div>
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
                <div className="flex items-center gap-4 mb-8 pl-2">
                  <Cpu className="text-emerald-500" size={24} />
                  <h4 className="text-xl font-bold text-white tracking-widest uppercase">Drive Systems</h4>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-2 gap-6">
                {liveDriveSystems.map((item: any, i: number) => {
                  const { name, img } = getCleanData(item);
                  return (
                    <ScrollReveal key={i} delay={i * 0.1}>
                      <div className="h-48 perspective-1000">
                        <TiltedCard>
                          <div className="relative h-full w-full bg-[#0F172A] rounded-xl border border-white/5 p-6 flex flex-col items-center justify-center gap-4 hover:border-emerald-500/50 hover:bg-[#141d36] transition-colors shadow-2xl">
                            {/* Floating Image */}
                            <div 
                              className="relative z-10 w-20 h-20 flex items-center justify-center transform translate-z-20"
                              style={{ transform: "translateZ(30px)" }}
                            >
                              {img ? (
                                <img src={img} alt={name} className="w-full h-full object-contain filter drop-shadow-lg" />
                              ) : (
                                <Cpu size={32} className="text-slate-600" />
                              )}
                            </div>
                            <div className="text-center transform translate-z-10" style={{ transform: "translateZ(10px)" }}>
                              <div className="text-white font-bold text-sm uppercase tracking-wider">{name}</div>
                              <div className="text-xs text-emerald-500/60 font-mono mt-1">HIGH TORQUE</div>
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
          6. THE GOLDEN SAMPLE: LASER SCANNER
      ========================================= */}
      <section className="py-32 relative overflow-hidden bg-black">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-black to-black"></div>
         
         <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <ScrollReveal>
              <div className="inline-block relative mb-8">
                {/* Scan Line Animation */}
                <motion.div 
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-[2px] bg-amber-500 shadow-[0_0_15px_#f59e0b] z-20"
                />
                <div className="w-24 h-24 border border-amber-500/30 bg-amber-500/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <Hexagon className="text-amber-500" size={40} />
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                The <span className="text-amber-500">Golden Sample</span> Protocol.
              </h2>
            </ScrollReveal>
            
            <ScrollReveal delay={0.4}>
              <p className="text-xl text-slate-400 leading-relaxed mb-12 font-light">
                We eliminate import risk. You receive a lab-verified pre-production sample. <br/>
                <span className="text-white font-medium">Mass production only starts when you say "GO".</span>
              </p>
            </ScrollReveal>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
               {["Drawing Approval", "Lab Testing", "Sample Dispatch", "Mass Production"].map((step, i) => (
                  <ScrollReveal key={i} delay={0.4 + (i * 0.1)}>
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-500/80 bg-amber-900/10 px-4 py-2 rounded border border-amber-900/30">
                      <CheckCircle2 size={12} /> {step}
                    </div>
                  </ScrollReveal>
               ))}
            </div>
         </div>
      </section>

      {/* =========================================
          7. FOOTER CTA
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