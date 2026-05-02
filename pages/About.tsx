import React, { useEffect, useRef, useState } from 'react';
import { 
  Target, Eye, Award, Zap, ShieldCheck, 
  Settings, ChevronRight, Boxes, 
  RefreshCw, AlertTriangle, Factory, 
  MapPin, Users, TrendingUp, Landmark,
  Scale, Gauge
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
const useCounter = (target: number, duration: number = 2000, isDecimal: boolean = false) => {
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
        setCount(start);
      }
    }, duration / totalSteps);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return { 
    displayValue: isDecimal ? count.toFixed(2) : Math.floor(count), 
    elementRef 
  };
};

const About: React.FC = () => {
  const [offsetY, setOffsetY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stats Configuration
  const turnoverStat = useCounter(5.12, 2000, true);
  const yearsStat = useCounter(7, 2000);
  const teamStat = useCounter(25, 2000);
  const citiesStat = useCounter(3, 2000);

  return (
    <HelmetProvider>
      <div className="bg-[#0D0F14] min-h-screen text-[#F4F2ED] font-['Barlow'] overflow-x-hidden">
        <Helmet>
          <title>About Us | DFPL — Fasteners That Hold Industries Together</title>
          <meta name="description" content="Founded in 2018 by Vipul Sakariya. Precision fastener manufacturing with ₹5.12 Crore turnover and a proven QC-first philosophy." />
          <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;600;700&family=Barlow+Condensed:wght@400;600;700&display=swap" rel="stylesheet" />
        </Helmet>

        {/* --- SECTION 1: HERO --- */}
        <section className="relative min-h-screen flex items-center overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 opacity-10"
            style={{ 
              backgroundImage: `linear-gradient(#E8A020 1px,transparent 1px), linear-gradient(90deg,#E8A020 1px,transparent 1px)`,
              backgroundSize: '64px 64px'
            }}
          />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
            <RevealSection>
              <div className="inline-flex items-center gap-3 px-4 py-2 border border-amber-500/30 bg-amber-500/10 rounded-sm mb-10">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-[11px] tracking-[0.3em] font-bold text-amber-500 uppercase font-['Barlow_Condensed']">
                  Since 29 August 2018 · Rajkot, Gujarat
                </span>
              </div>
              <h1 className="text-7xl md:text-9xl lg:text-[140px] font-['Bebas_Neue'] leading-[0.85] tracking-tight uppercase mb-8">
                Fasteners That <br/>
                <span className="text-amber-500">Hold Industries</span> <br/>
                <span className="text-slate-500">Together.</span>
              </h1>
              <p className="max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed font-normal">
                From a single dedicated founder to a <span className="text-white font-semibold">₹5.12 Crore</span> precision business — Durable Fastener Private Limited was built to solve the problems that others chose to ignore.
              </p>
            </RevealSection>
          </div>
        </section>

        {/* --- SECTION 2: STAT STRIP --- */}
        <section className="bg-amber-500 py-0 relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 border-x border-black/10">
            {[
              { label: "Annual Turnover 2025–26", val: turnoverStat.displayValue, prefix: "₹", suffix: " Cr", ref: turnoverStat.elementRef },
              { label: "Years of Operation", val: yearsStat.displayValue, prefix: "", suffix: "+", ref: yearsStat.elementRef },
              { label: "Strong Team Members", val: teamStat.displayValue, prefix: "", suffix: "", ref: teamStat.elementRef },
              { label: "Operating Hubs", val: citiesStat.displayValue, prefix: "", suffix: "", ref: citiesStat.elementRef },
            ].map((stat, i) => (
              <div key={i} ref={stat.ref} className="p-10 border-r border-black/10 last:border-0 text-[#0D0F14]">
                <div className="text-5xl md:text-6xl font-['Bebas_Neue'] leading-none mb-2">
                  {stat.prefix}{stat.val}{stat.suffix}
                </div>
                <div className="text-[10px] tracking-[0.2em] font-bold uppercase opacity-70 font-['Barlow_Condensed']">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 3: ORIGIN --- */}
        <section className="py-32 px-6 bg-[#161A24]">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
            <RevealSection>
              <span className="text-amber-500 text-xs tracking-[0.4em] font-bold uppercase block mb-6 font-['Barlow_Condensed']">01 / The Catalyst</span>
              <h2 className="text-5xl md:text-7xl font-['Bebas_Neue'] mb-8 uppercase leading-none">
                The Problem We <em className="text-amber-500 not-italic">Saw</em> From Inside.
              </h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                Vipul Sakariya did not start DFPL from a business school plan. He started it because he worked inside the fastener industry and witnessed the same issues repeat every single day. In 2018, he decided that if no one else was going to fix this, he would.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "No Sales Infrastructure", desc: "Strong production existed in Rajkot, but manufacturers had no systems to reach the right buyers." },
                  { title: "QC Was Optional", desc: "Standardized quality control did not exist. Products shipped without proper checks, leaving customers with rejected material." },
                  { title: "Application Gaps", desc: "Screws were recommended for the wrong use-cases. When they failed, the customer bore the entire cost." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-[#1E2535] border border-white/5 rounded-sm group hover:border-amber-500/30 transition-all">
                    <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded flex items-center justify-center shrink-0">
                      <ShieldCheck className="text-amber-500" size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs tracking-widest font-bold uppercase text-white mb-2 font-['Barlow_Condensed']">{item.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RevealSection>

            <div className="sticky top-32">
              <RevealSection>
                <div className="text-5xl md:text-8xl font-bold italic text-white leading-tight font-['Barlow'] mb-8">
                  "A screw is <br/>
                  <span className="text-amber-500">not hardware.</span> <br/>
                  It is an engineering component."
                </div>
                <div className="p-8 bg-[#1E2535] border-l-4 border-amber-500">
                  <span className="text-amber-500 text-[10px] tracking-[0.3em] font-bold uppercase block mb-3 font-['Barlow_Condensed']">Technical Insight</span>
                  <p className="text-slate-300 leading-relaxed italic">
                    Wood and plywood possess different strength characteristics across the seasons. A screw that holds in winter might fail in summer. We built our entire quality control system around this seasonal calibration.
                  </p>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* --- SECTION 4: THE CRISIS --- */}
        <section className="py-32 px-6 bg-[#0D0F14]">
          <div className="max-w-7xl mx-auto">
            <RevealSection>
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-6xl md:text-8xl font-['Bebas_Neue'] leading-none mb-10">
                    ₹8 Lakh. <br/>
                    Batch Rejected. <br/>
                    <span className="text-amber-500 italic">Everything Changed.</span>
                  </h2>
                  <div className="p-10 bg-[#161A24] border border-white/5 relative overflow-hidden group">
                    <Landmark className="absolute -right-10 -bottom-10 text-white/5 group-hover:text-amber-500/5 transition-colors" size={240} />
                    <h3 className="text-2xl font-bold mb-4 relative z-10">The Most Expensive Lesson</h3>
                    <p className="text-slate-400 leading-relaxed mb-8 relative z-10">
                      Our first significant order of 5,000 kg failed. The material behaved differently due to <span className="text-white">seasonal heat treatment</span> variables that we had not accounted for. We accepted the full rejection and pivoted immediately.
                    </p>
                    <div className="flex gap-10 relative z-10">
                      <div>
                        <div className="text-amber-500 font-['Bebas_Neue'] text-4xl">5,000 KG</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-['Barlow_Condensed']">Material Size</div>
                      </div>
                      <div>
                        <div className="text-white font-['Bebas_Neue'] text-4xl">₹8 LAKH</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-['Barlow_Condensed']">Value Lost</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                   <div className="p-8 bg-[#161A24] border border-white/5">
                      <AlertTriangle className="text-red-500 mb-6" size={32} />
                      <h4 className="text-xl font-bold mb-3">Root Cause</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Heat treatment parameters were not adjusted for environmental humidity and temperature. This taught us that precision is not static; it must be calibrated daily.
                      </p>
                   </div>
                   <div className="p-8 bg-[#161A24] border border-white/5">
                      <RefreshCw className="text-emerald-500 mb-6" size={32} />
                      <h4 className="text-xl font-bold mb-3">The Pivot to 360° QC</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        From that point forward, quality control was embedded at every stage. We do not ship unless the batch passes the "Seven Point Verification" protocol.
                      </p>
                   </div>
                </div>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* --- SECTION 5: SYSTEMS --- */}
        <section className="py-32 px-6 bg-[#161A24]">
          <div className="max-w-7xl mx-auto">
            <RevealSection className="text-center mb-20">
              <span className="text-amber-500 text-xs tracking-[0.4em] font-bold uppercase block mb-4 font-['Barlow_Condensed']">Operational Integrity</span>
              <h2 className="text-6xl md:text-8xl font-['Bebas_Neue'] uppercase leading-none">
                Systems That Build <span className="text-slate-500">Certainty.</span>
              </h2>
            </RevealSection>

            <div className="grid md:grid-cols-3 gap-1 bg-white/5 border border-white/5">
              {[
                { icon: <Gauge />, title: "360° Daily QC", desc: "Quality, packing, and documentation are checked every single working day across all departments." },
                { icon: <Boxes />, title: "Real-Time Inventory", desc: "Every stock movement is recorded automatically. Floor inventory and software always match perfectly." },
                { icon: <Settings />, title: "Seasonal Calibration", desc: "Heat treatment parameters are adjusted for summer, monsoon, and winter to ensure consistent hardness." },
                { icon: <Scale />, title: "Zero Substitution", desc: "We ship the exact grade specified. There are no silent substitutions or grade changes without notice." },
                { icon: <Factory />, title: "Technical Support", desc: "We provide engineered solutions, matching the specific SKU to the customer application requirements." },
                { icon: <Users />, title: "Team Discipline", desc: "A 25-person team follows structured SOPs to ensure that commitment equals delivery every time." }
              ].map((sys, i) => (
                <div key={i} className="p-12 bg-[#0D0F14] hover:bg-[#1E2535] transition-colors group">
                  <div className="w-12 h-12 bg-amber-500/10 flex items-center justify-center mb-8 border border-amber-500/20">
                    {React.cloneElement(sys.icon as React.ReactElement, { className: "text-amber-500", size: 24 })}
                  </div>
                  <h4 className="text-xl font-bold mb-4 uppercase tracking-tight">{sys.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{sys.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SECTION 6: THE VISION --- */}
        <section className="py-32 px-6 bg-[#0D0F14]">
          <div className="max-w-7xl mx-auto">
            <RevealSection>
              <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
                <div className="max-w-2xl">
                  <span className="text-amber-500 text-xs tracking-[0.4em] font-bold uppercase block mb-4 font-['Barlow_Condensed']">07 / The Roadmap</span>
                  <h2 className="text-6xl md:text-8xl font-['Bebas_Neue'] uppercase leading-none">
                    Not An Aspiration. <br/> <em className="text-amber-500 not-italic">A Plan.</em>
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-['Bebas_Neue'] text-white">Target 2030</div>
                  <div className="text-[10px] uppercase tracking-widest text-amber-500 font-bold font-['Barlow_Condensed']">₹30 Crore Turnover</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-12 bg-[#161A24] border border-white/5">
                  <div className="text-amber-500 text-xs font-bold tracking-widest mb-6 font-['Barlow_Condensed']">FY 2026–27</div>
                  <div className="text-5xl font-['Bebas_Neue'] mb-6">₹10 <em className="text-amber-500 not-italic">Cr</em></div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Systems and inventory infrastructure are already aligned to support this doubling of our current revenue.
                  </p>
                </div>

                <div className="p-12 bg-transparent border border-amber-500/40 relative group overflow-hidden">
                  <TrendingUp className="absolute -right-10 -bottom-10 text-amber-500/10 group-hover:text-amber-500/20 transition-all" size={200} />
                  <div className="text-amber-500 text-xs font-bold tracking-widest mb-6 font-['Barlow_Condensed']">WITHIN 5 YEARS</div>
                  <div className="text-5xl font-['Bebas_Neue'] mb-6 uppercase">SME <em className="text-amber-500 not-italic">IPO</em></div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    A structured public listing on the SME board, reflecting the financial discipline we have maintained since 2021.
                  </p>
                </div>

                <div className="p-12 bg-[#161A24] border border-white/5">
                  <div className="text-amber-500 text-xs font-bold tracking-widest mb-6 font-['Barlow_Condensed']">BY 2036</div>
                  <div className="text-5xl font-['Bebas_Neue'] mb-6 uppercase">Main <em className="text-amber-500 not-italic">Board</em></div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Transitioning to the main board of the stock exchange as a leader in Indian precision manufacturing.
                  </p>
                </div>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* --- SECTION 7: FINAL CTA --- */}
        <section className="py-32 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <RevealSection>
              <h2 className="text-7xl md:text-9xl font-['Bebas_Neue'] leading-[0.85] mb-10">
                Precision <br/> <span className="text-amber-500 italic">Delivered.</span>
              </h2>
              <p className="text-xl text-slate-400 mb-14 leading-relaxed">
                Experience the DFPL difference, where every screw is an engineering commitment and every order is a promise kept.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-10 py-5 bg-amber-500 text-black font-['Barlow_Condensed'] font-bold text-xs tracking-[0.2em] uppercase hover:bg-amber-400 transition-all">
                  Request Technical Catalog
                </button>
                <button className="px-10 py-5 border border-white/20 text-white font-['Barlow_Condensed'] font-bold text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all">
                  Contact Our Team
                </button>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="py-12 px-6 bg-[#0D0F14] border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-50">
            <div className="text-3xl font-['Bebas_Neue'] tracking-widest"><span className="text-amber-500">DF</span>PL</div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase font-['Barlow_Condensed']">
              Rajkot, Gujarat · Est. 29 August 2018 · CIN Registered
            </div>
            <div className="text-[10px] italic font-bold tracking-[0.2em] uppercase font-['Barlow_Condensed']">
              Fasteners That Hold Industries Together
            </div>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
};

export default About;