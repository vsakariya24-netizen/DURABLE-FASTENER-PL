import React, { useEffect, useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Timer, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Eye, 
  History,
  Factory,
  MessageSquareWarning,
  Zap,
  Award
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

/**
 * DURABLE FASTENER DESIGN SYSTEM
 * Primary: #1A2744 (Navy) | Accent: #D85A30 (Coral) | Neutral: #5F5E5A
 * Brand: CLASSONE
 */

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

const About: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#FBFCFE] min-h-screen font-sans text-[#5F5E5A] selection:bg-orange-100">
      <Helmet>
        <title>Our Story | Durable Fastener - The CLASSONE Standard</title>
        <meta name="description" content="From a communication gap to a 48-hour dispatch leader. Discover the journey of Durable Fastener, Gujarat's premier OEM screw manufacturer." />
      </Helmet>

      {/* 01. HERO: THE ORIGIN (WHY) */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-[#1A2744] text-white">
        <div 
          className="absolute inset-0 opacity-20 grayscale"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=2000')`,
            backgroundSize: 'cover',
            transform: `translateY(${scrollY * 0.2}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2744] via-[#1A2744]/80 to-transparent z-10" />
        
        <div className="relative z-20 max-w-6xl mx-auto px-6">
          <RevealSection className="max-w-3xl">
            <span className="text-[#D85A30] font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Established 2018</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              We started because the industry <span className="text-[#D85A30]">stopped talking.</span>
            </h1>
            <p className="text-xl font-light text-slate-300 mb-10 leading-relaxed">
              In 2018, we didn't just see a business opportunity in Gujarat; we saw a breakdown in trust. Large OEMs were left in the dark, and we decided to turn the lights back on.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                <Zap size={18} className="text-[#D85A30]" />
                <span className="text-sm font-bold uppercase tracking-widest">48-Hour Dispatch</span>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                <ShieldCheck size={18} className="text-[#D85A30]" />
                <span className="text-sm font-bold uppercase tracking-widest">ISO 9001:2015</span>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* 02. GROWTH MILESTONES: MEANINGFUL PROGRESS */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <RevealSection>
              <h2 className="text-4xl font-serif text-[#1A2744] mb-6">Our Evolution</h2>
              <p className="text-lg leading-relaxed mb-8">
                What began as a vision to revolutionize bulk OEM supply chains grew into a 7,000 sq. ft. manufacturing powerhouse in Gujarat.
              </p>
              
              <div className="space-y-8">
                {[
                  { year: "2018", title: "The Communication Void", desc: "Started Durable Enterprise with a focus on transparent B2B lead times." },
                  { year: "2021", title: "GIDC Expansion", desc: "Scalability reached new heights with our high-capacity hub, enabling supply to all of South India." },
                  { year: "2023", title: "CLASSONE Launch", desc: "Our brand identity solidified with the implementation of automated optical sorting for zero-defect supply." }
                ].map((item, index) => (
                  <div key={index} className="flex gap-6 group">
                    <div className="text-[#D85A30] font-bold text-xl pt-1">{item.year}</div>
                    <div className="pb-6 border-b border-slate-100 group-last:border-0">
                      <h4 className="font-bold text-[#1A2744] text-lg mb-1">{item.title}</h4>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
             <RevealSection className="space-y-4">
                <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800" className="rounded-2xl shadow-lg grayscale hover:grayscale-0 transition-all duration-700" alt="Factory" />
                <div className="bg-[#1A2744] p-8 rounded-2xl text-white">
                  <div className="text-4xl font-bold mb-2">350+</div>
                  <div className="text-xs uppercase tracking-widest opacity-60">OEM Partners Served</div>
                </div>
             </RevealSection>
             <RevealSection className="space-y-4 pt-12">
                <div className="bg-[#D85A30] p-8 rounded-2xl text-white">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-xs uppercase tracking-widest opacity-80">South India Coverage</div>
                </div>
                <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800" className="rounded-2xl shadow-lg grayscale hover:grayscale-0 transition-all duration-700" alt="Quality Control" />
             </RevealSection>
          </div>
        </div>
      </section>

      {/* 03. TURNING POINTS: THE HARD TRUTH */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
           <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <RevealSection className="text-center max-w-3xl mx-auto mb-16">
            <MessageSquareWarning className="mx-auto text-[#D85A30] mb-6" size={48} />
            <h2 className="text-4xl font-serif mb-6">The Lessons We Learned</h2>
            <p className="text-slate-400 text-lg">
              Scaling wasn't linear. In our early years, we realized that "good enough" quality doesn't survive in the OEM world.
            </p>
          </RevealSection>

          <div className="grid md:grid-cols-2 gap-12">
            <RevealSection className="bg-white/5 p-10 rounded-3xl border border-white/10">
              <h4 className="text-[#D85A30] font-bold mb-4 uppercase tracking-widest text-sm">The Challenge</h4>
              <p className="text-xl font-light leading-relaxed">
                Manually checking a million screws is a recipe for failure. One single defective screw can stop a multi-million dollar assembly line.
              </p>
            </RevealSection>
            <RevealSection className="bg-white/5 p-10 rounded-3xl border border-white/10">
              <h4 className="text-green-400 font-bold mb-4 uppercase tracking-widest text-sm">The Pivot</h4>
              <p className="text-xl font-light leading-relaxed">
                We invested heavily in <strong>Automated Optical Sorting</strong>. We shifted from "trusting the process" to "verifying the physics." Every batch now comes with documented clearance.
              </p>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* 04. CURRENT POSITIONING & BRAND */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <RevealSection>
            <h2 className="text-sm font-bold text-[#D85A30] uppercase tracking-[0.4em] mb-4">Current Positioning</h2>
            <h3 className="text-5xl font-serif text-[#1A2744] mb-12">The CLASSONE Standard</h3>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Factory className="text-[#D85A30]" size={32} />
                </div>
                <h4 className="text-xl font-bold">Gujarat Hub</h4>
                <p className="text-slate-500">Centrally manufactured in Gujarat for efficient logistics and high-volume production control.</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="text-[#D85A30]" size={32} />
                </div>
                <h4 className="text-xl font-bold">South India Specialist</h4>
                <p className="text-slate-500">Tailored supply chain networks dedicated to servicing the industrial clusters of South India.</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="text-[#D85A30]" size={32} />
                </div>
                <h4 className="text-xl font-bold">Precision OEM</h4>
                <p className="text-slate-500">Specializing in high-tensile, custom-spec fasteners for automotive and heavy machinery.</p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* 05. MISSION & VISION */}
      <section className="py-24 container mx-auto px-6 border-t border-slate-100">
        <div className="grid md:grid-cols-2 gap-8">
          <RevealSection className="bg-[#1A2744] p-12 rounded-[2rem] text-white">
            <Target className="text-[#D85A30] mb-8" size={48} />
            <h3 className="text-3xl font-serif mb-6">Daily Mission</h3>
            <p className="text-xl font-light opacity-80 leading-relaxed">
              To empower India's manufacturing backbone by providing precision fasteners with a **guaranteed 48-hour dispatch** and zero-defect quality.
            </p>
          </RevealSection>
          <RevealSection className="bg-orange-50 p-12 rounded-[2rem]">
            <Eye className="text-[#D85A30] mb-8" size={48} />
            <h3 className="text-3xl font-serif text-[#1A2744] mb-6">2028 Vision</h3>
            <p className="text-xl font-light text-slate-600 leading-relaxed">
              To be the preferred industrial partner for **500+ global manufacturers** and establish CLASSONE as a global benchmark in the GCC and European markets.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* 06. CORE VALUES: ACTION-BASED */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-serif text-[#1A2744]">The Durable Ethics</h2>
             <div className="h-1 w-20 bg-[#D85A30] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "No Dispatch Without QC", desc: "Every batch must pass our 12-point automated sorting before a shipping label is generated.", icon: ShieldCheck },
              { title: "4-Hour Query Response", desc: "No silence. Every technical inquiry or quote request is addressed within 4 business hours.", icon: Timer },
              { title: "Founder-Level Access", desc: "All OEM partners have direct access to lead engineers for custom design requirements.", icon: Users }
            ].map((v, i) => (
              <RevealSection key={i} className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 hover:border-[#D85A30] transition-colors group">
                <v.icon className="text-[#D85A30] mb-6 group-hover:scale-110 transition-transform" size={40} />
                <h4 className="text-xl font-bold text-[#1A2744] mb-4">{v.title}</h4>
                <p className="text-slate-500 leading-relaxed">{v.desc}</p>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* 07. FINAL CTA */}
      <section className="py-32 bg-[#1A2744] text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <RevealSection>
            <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">Secure Your Supply Chain <br />With CLASSONE Precision.</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="bg-[#D85A30] hover:bg-[#c44e27] px-12 py-5 rounded-full font-bold transition-all shadow-xl text-lg">
                Request Batch Pricing
              </button>
              <button className="border border-white/20 hover:bg-white/10 px-12 py-5 rounded-full font-bold transition-all backdrop-blur-sm text-lg">
                Download Technical Catalog
              </button>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
};

export default About;