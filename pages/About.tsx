import React, { useEffect, useRef, useState } from 'react';
import { 
  Target, Eye, TrendingUp, Award, Zap, ShieldCheck, 
  Settings, Globe2, ChevronRight, Quote, 
  Boxes, Handshake, Microscope, 
  ArrowUpRight, CheckCircle2, Factory, AlertTriangle, XCircle, RefreshCw,
  Anchor, Binary, HardHat, Ship
} from 'lucide-react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// --- 1. Helper: Reveal Animation ---
const RevealSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-10');
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out opacity-0 translate-y-10 ${className}`}>
      {children}
    </div>
  );
};

// --- 2. Helper: Counter Hook ---
const useCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.5 });
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const end = target;
    const totalSteps = 60;
    const increment = end / totalSteps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, duration / totalSteps);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return { count, elementRef };
};

const About: React.FC = () => {
  const [offsetY, setOffsetY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stats Configuration
  const yearsStat = useCounter(8);
  const clientsStat = useCounter(350);
  const skuStat = useCounter(600);
  const countriesStat = useCounter(12);

  return (
    <div className="bg-[#fcfcfc] min-h-screen overflow-x-hidden text-slate-900 font-['Inter']">
      <Helmet>
        <title>Our Legacy | Durable Fastener Pvt Ltd (DFPL)</title>
        <meta name="description" content="Forging excellence in Gujarat since 2018. Professional screw manufacturing for global industrial leaders like Titan and Reliance." />
        {/* EXTERNAL FONT INJECTION */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Syncopate:wght@400;700&display=swap" rel="stylesheet" />
      </Helmet>

      {/* SECTION 1: HERO - THE MANIFESTO */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-[#05070a] text-white">
        <div 
          className="absolute inset-0 opacity-40 z-0 grayscale contrast-125"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2000')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${offsetY * 0.3}px) scale(1.05)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-[#05070a]/70 to-[#05070a] z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <RevealSection>
            <span className="inline-block px-5 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] font-bold tracking-[0.5em] uppercase mb-8 backdrop-blur-md font-['Syncopate']">
              Gujarat, India — Global Export Standards
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-10 tracking-tighter leading-[0.85] uppercase font-['Inter']">
              Engineered for<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 italic">
                Zero Failure.
              </span>
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed tracking-tight">
                We didn't enter the fastener industry to join the crowd. We entered to fix the 
                <span className="text-amber-500 italic"> inconsistency </span> that plagues industrial supply chains.
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* SECTION 2: THE DATA STRIP */}
      <div className="bg-amber-500 py-12 relative z-30 -mt-16 mx-6 rounded-3xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-black">
            <div className="text-center border-r border-black/10 last:border-0" ref={yearsStat.elementRef}>
              <span className="block text-4xl md:text-6xl font-black tracking-tighter font-['Syncopate']">{yearsStat.count}+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Years of Precision</span>
            </div>
            <div className="text-center border-r border-black/10 last:border-0" ref={clientsStat.elementRef}>
              <span className="block text-4xl md:text-6xl font-black tracking-tighter font-['Syncopate']">{clientsStat.count}+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Global Partners</span>
            </div>
            <div className="text-center border-r border-black/10 last:border-0" ref={skuStat.elementRef}>
              <span className="block text-4xl md:text-6xl font-black tracking-tighter font-['Syncopate']">{skuStat.count}+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Technical SKUs</span>
            </div>
            <div className="text-center border-r border-black/10 last:border-0" ref={countriesStat.elementRef}>
              <span className="block text-4xl md:text-6xl font-black tracking-tighter font-['Syncopate']">{countriesStat.count}+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Export Nations</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: ORIGIN (THE WHY) */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-6 space-y-8">
            <RevealSection>
              <span className="text-amber-600 font-bold text-xs tracking-[0.4em] uppercase block font-['Syncopate']">The Catalyst</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase italic mb-8 font-['Inter']">
                Supply is easy.<br/> <span className="text-slate-400">Standards are hard.</span>
              </h2>
              <p className="text-xl text-slate-700 leading-relaxed font-medium italic border-l-4 border-amber-500 pl-8 font-['Inter']">
                In 2018, we observed a dangerous trend: Fasteners were being treated as "commodities" rather than "critical components." Low-quality threads and inconsistent hardening were causing assembly line failures across India.
              </p>
              <p className="text-slate-500 leading-relaxed text-lg font-normal">
                Durable Fastener Private Limited (DFPL) was founded to end this. We established our unit in Gujarat with one mission: To be the technical lead for engineers who cannot afford a 0.1% failure rate. Every screw we manufacture is a promise of structural integrity.
              </p>
            </RevealSection>
          </div>
          <div className="lg:col-span-6">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1530124566582-a618bc2615ad?auto=format&fit=crop&q=80&w=1200" 
                  alt="Quality Control Testing" 
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-10 left-10 text-white">
                   <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2 font-['Syncopate']">Internal Testing Lab</p>
                   <p className="text-2xl font-black italic uppercase">Torque & Hardness Verification</p>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TURNING POINTS */}
      <section className="py-32 bg-[#0a0f1a] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <span className="text-amber-500 font-bold text-[10px] tracking-[0.5em] uppercase font-['Syncopate']">The Turning Points</span>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mt-4">
              Moments that<br/> <span className="text-slate-600">Defined our resolve.</span>
            </h2>
            <p className="text-slate-400 mt-6 text-lg font-light tracking-tight">We don’t hide our challenges. They are the reason our current systems are unbreakable.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <RevealSection className="bg-white/[0.03] p-12 border border-white/5 hover:bg-white/[0.05] transition-all">
              <AlertTriangle className="text-red-500 mb-8" size={40} />
              <h3 className="text-2xl font-black italic uppercase mb-6 font-['Inter']">2020: The Supply Pivot</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-normal">When the global supply chain stalled, we didn't wait. We restructured our entire procurement logic to ensure zero-delay for essential infrastructure projects. We learned that reliability is about foresight, not just stock.</p>
            </RevealSection>

            <RevealSection className="bg-white/[0.03] p-12 border border-white/5 hover:bg-white/[0.05] transition-all">
              <XCircle className="text-amber-500 mb-8" size={40} />
              <h3 className="text-2xl font-black italic uppercase mb-6 font-['Inter']">The Scaling Lesson</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-normal">Early on, a high-speed production run outpaced our manual QC checks. A minor batch error taught us: "Speed is a liability without a rigid system." That moment led to our current automated double-verification protocol.</p>
            </RevealSection>

            <RevealSection className="bg-white/[0.03] p-12 border border-white/5 hover:bg-white/[0.05] transition-all">
              <RefreshCw className="text-emerald-500 mb-8" size={40} />
              <h3 className="text-2xl font-black italic uppercase mb-6 font-['Inter']">Vendor to Partner</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-normal">We stopped acting like a 'seller' and started acting like a 'technical consultant.' This shift in mindset is what opened doors to industrial titans like Titan Watches and Reliance Industries.</p>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* SECTION 5: CURRENT POSITIONING (CLIENTS) */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <RevealSection>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase">
                The Trust <span className="text-slate-300">League</span>
              </h2>
              <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-medium">Providing high-grade components to the leaders of Indian and Global industry.</p>
            </RevealSection>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-slate-50 rounded-[3rem] p-12 md:p-20 relative overflow-hidden group">
                <div className="relative z-10">
                   <span className="text-amber-600 font-bold text-[10px] tracking-[0.3em] uppercase mb-4 block font-['Syncopate']">Precision Partnership</span>
                   <h3 className="text-6xl font-black italic text-slate-900 mb-6 font-['Inter']">TITAN</h3>
                   <p className="text-slate-600 text-lg leading-relaxed max-w-sm font-medium tracking-tight">
                    Direct supplying micro-precision components for horology and lifestyle products where aesthetic finish meets mechanical perfection.
                   </p>
                </div>
                <Award className="absolute -right-10 -bottom-10 text-slate-200 group-hover:text-amber-200 transition-colors" size={300} />
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden group">
                <div className="relative z-10">
                   <span className="text-amber-500 font-bold text-[10px] tracking-[0.3em] uppercase mb-4 block font-['Syncopate']">Infrastructure Partner</span>
                   <h3 className="text-6xl font-black italic text-white mb-6 uppercase font-['Inter']">Reliance</h3>
                   <p className="text-slate-400 text-lg leading-relaxed max-w-sm font-medium tracking-tight">
                    Anchoring critical industrial infrastructure through high-volume, authorized supply chains that power national growth.
                   </p>
                </div>
                <Anchor className="absolute -right-10 -bottom-10 text-white/5 group-hover:text-white/10 transition-colors" size={300} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: MISSION & VISION (BENTO) */}
      <section className="py-32 px-6 bg-[#fcfcfc]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <RevealSection className="md:col-span-7 bg-slate-900 rounded-[4rem] p-16 text-white relative overflow-hidden group">
              <Target className="text-amber-500 mb-8" size={56} />
              <h3 className="text-5xl font-black mb-8 tracking-tighter uppercase italic font-['Inter']">Our Mission</h3>
              <p className="text-2xl text-slate-400 font-light leading-relaxed max-w-xl tracking-tight">
                To deliver high-integrity fastening solutions that serve as the <span className="text-white italic">silent, unbreakable backbone</span> of global industrial progress.
              </p>
              <div className="absolute -bottom-20 -right-20 opacity-5 group-hover:opacity-10 transition-opacity">
                <Settings size={400} />
              </div>
          </RevealSection>

          <RevealSection className="md:col-span-5 bg-amber-500 rounded-[4rem] p-16 flex flex-col justify-between hover:bg-amber-400 transition-colors cursor-default">
              <div>
                <Eye className="text-black mb-8" size={56} />
                <h3 className="text-5xl font-black mb-8 tracking-tighter uppercase italic font-['Inter']">Our Vision</h3>
                <p className="text-xl font-black text-black/80 leading-tight tracking-tight">
                  To become the global benchmark for fastener manufacturing, synonymous with <span className="italic underline decoration-black/20">Indian Engineering Excellence</span> by 2030.
                </p>
              </div>
              <div className="mt-12 flex justify-end">
                  <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center group">
                    <ChevronRight size={40} className="group-hover:translate-x-1 transition-transform" />
                  </div>
              </div>
          </RevealSection>
        </div>
      </section>

      {/* SECTION 7: ACTION-BASED VALUES */}
      <section className="py-32 bg-white font-['Inter']">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase italic">Decisions over <span className="text-slate-300">Words</span></h2>
            <p className="text-slate-500 mt-6 max-w-2xl mx-auto text-lg font-medium">Values aren't posters on our wall. They are the rules that shape our behavior when no one is watching.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck />, title: "Quality Clearance", action: "No Dispatch without Double QC", desc: "Every batch is cross-inspected against technical spec sheets. We do not skip steps for 'rush' orders." },
              { icon: <Zap />, title: "Defined Response", action: "4-Hour Query Resolution", desc: "Technical or pricing inquiries receive a documented response within 4 hours. Time is your most valuable asset." },
              { icon: <Handshake />, title: "Radical Honesty", action: "Disclose before Escalation", desc: "If a delay is detected, we notify the client before they have to ask. We resolve problems, we don't hide them." },
              { icon: <Microscope />, title: "Standard Obsession", action: "DIN/ISO/JIS Adherence", desc: "We don't manufacture 'generic' screws. Every thread complies with international codes for global compatibility." },
              { icon: <Binary />, title: "Process Integrity", action: "Monthly Friction Fix", desc: "Every department identifies and eliminates one process inefficiency every 30 days to ensure continuous scaling." },
              { icon: <Ship />, title: "Export Reliability", action: "Sea-Freight Grade Packing", desc: "Whether it’s Rajkot or Germany, our packaging must withstand 45 days of sea-freight moisture and movement." },
            ].map((value, idx) => (
              <RevealSection key={idx} className="group p-12 rounded-[3rem] bg-slate-50 border border-transparent hover:border-amber-500 hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="text-amber-600 mb-8 bg-amber-100/50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">{value.icon}</div>
                <h4 className="text-2xl font-black mb-3 uppercase tracking-tight italic">{value.title}</h4>
                <div className="inline-block px-4 py-1.5 bg-amber-500 text-black text-[10px] font-bold uppercase rounded-lg mb-6 font-['Syncopate']">{value.action}</div>
                <p className="text-slate-500 text-base leading-relaxed font-normal">{value.desc}</p>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto bg-slate-900 rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden">
          <RevealSection className="relative z-10">
            <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-tight uppercase italic font-['Inter']">
              Ready to Secure your <br/>
              <span className="text-amber-500 underline decoration-white/10">Industrial Future?</span>
            </h2>
            <p className="text-slate-400 mb-14 max-w-2xl mx-auto text-xl font-light tracking-tight">
              Experience the DFPL difference. Let’s discuss how our precision components can eliminate friction in your production line.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="px-14 py-7 bg-amber-500 text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-amber-400 hover:scale-105 transition-all shadow-xl shadow-amber-500/20 font-['Syncopate']">
                Talk to Technical Sales
              </button>
              <button className="px-14 py-7 border border-white/20 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all font-['Syncopate']">
                Request Catalog
              </button>
            </div>
          </RevealSection>
          <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none">
             <Factory size={800} className="text-white absolute -right-40 -bottom-40" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;