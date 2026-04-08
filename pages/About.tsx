import React, { useEffect, useRef, useState } from 'react';
import { 
  Target, Eye, Heart, TrendingUp, Award, MapPin, Users, 
  Calendar, ArrowUpRight, CheckCircle2, Factory, Crown, 
  Sparkles, MoveRight, ShieldCheck, AlertCircle, Zap, Clock 
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// --- Helper Components for Animation ---
const RevealSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
};

const useCounter = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) setHasStarted(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration, start]);

  return { count, ref };
};

const About: React.FC = () => {
  const [offsetY, setOffsetY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const statOfficeStart = useCounter(35, 1500);
  const statOfficeNow = useCounter(7000, 2500);
  const statSuppliers = useCounter(500, 2000);

  return (
    <div className="bg-[#fcfcfc] min-h-screen overflow-x-hidden font-sans text-gray-900">
      <Helmet>
        <title>Our Story | Durable Fastener Pvt Ltd - Manufacturing Excellence</title>
        <meta name="description" content="From a 35 sq. ft. room to a 7000 sq. ft. facility. Discover the journey, values, and mission of Durable Fastener Pvt Ltd." />
      </Helmet>

      {/* 1. POWER HERO SECTION */}
      <div className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-[#0a0f1a] text-white">
        <div 
          className="absolute inset-0 opacity-30 z-0 grayscale"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=2000')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${1 + offsetY * 0.0005}) translateY(${offsetY * 0.2}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-black/60 z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <RevealSection>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-xs font-black tracking-[0.3em] uppercase mb-8 backdrop-blur-xl">
               Precision Engineered Since 2018
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
              ROOTED IN <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-600">
                RESILIENCE
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              We didn't just start a business; we solved a deficit. From a 35 sq. ft. micro-office to an industrial powerhouse, we anchor the world's finest machinery.
            </p>
          </RevealSection>
        </div>
      </div>

      {/* 2. THE ORIGIN (Market Problem) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <RevealSection>
              <span className="text-amber-600 font-black text-xs tracking-widest uppercase">01. The Origin</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 mb-6 tracking-tighter italic">Why We Started.</h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  <strong className="text-slate-900">The Problem:</strong> In 2018, we observed a massive gap in the Indian fastener market. Customers were forced to choose between <span className="text-amber-600 font-bold">low-cost/poor-quality</span> components or <span className="text-amber-600 font-bold">high-cost/long-lead-time</span> imports.
                </p>
                <p>
                  Service was an afterthought. Technical queries went unanswered for days. We entered this industry to prove that <strong className="text-slate-900">World-Class Quality</strong> and <strong className="text-slate-900">Instant Responsiveness</strong> could coexist under one roof.
                </p>
              </div>
            </RevealSection>
            <div className="relative">
               <div className="aspect-square bg-slate-100 rounded-[4rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                  {/* Placeholder for "Old Photo" of 35 sq ft room */}
                  <img src="https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=800" alt="Our Humble Beginnings" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
               </div>
               <div className="absolute -bottom-10 -left-10 bg-amber-500 p-8 rounded-3xl shadow-xl text-black max-w-[200px]">
                  <p className="font-black text-4xl mb-1" ref={statOfficeStart.ref}>{statOfficeStart.count}</p>
                  <p className="text-xs font-bold uppercase tracking-widest">Sq. Ft. Start-up Space</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GROWTH DASHBOARD */}
      <section className="py-20 bg-[#0a0f1a] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-6xl font-black text-amber-500 mb-2" ref={statOfficeNow.ref}>{statOfficeNow.count}+</div>
              <p className="text-slate-400 uppercase tracking-[0.2em] text-xs">Production Sq. Ft.</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black text-amber-500 mb-2">100%</div>
              <p className="text-slate-400 uppercase tracking-[0.2em] text-xs">In-House Manufacturing</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black text-amber-500 mb-2" ref={statSuppliers.ref}>{statSuppliers.count}+</div>
              <p className="text-slate-400 uppercase tracking-[0.2em] text-xs">Active OEM/B2B Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GROWTH & TURNING POINTS (Timeline Style) */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-amber-600 font-black text-xs tracking-widest uppercase">The Journey</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 tracking-tighter">Growth Milestones</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Milestone Card 1 */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
               <TrendingUp className="text-amber-500 mb-6" size={40} />
               <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">The Breakthrough</h3>
               <p className="text-slate-500 leading-relaxed">Securing our first Tier-1 OEM contract was the turning point. It forced us to evolve from a workshop into a process-driven manufacturing plant with rigorous dispatch systems.</p>
            </div>
            {/* Turning Point / Challenge */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
               <AlertCircle className="text-red-500 mb-6" size={40} />
               <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">The Critical Pivot</h3>
               <p className="text-slate-500 leading-relaxed">Early on, we faced quality rejection on a bulk batch. It was a failure that changed everything. Instead of fixing the product, we re-engineered our entire QC process—making it impossible for a defect to leave our floor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CURRENT POSITIONING (Bento) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-amber-600 font-black text-xs tracking-widest uppercase">Today</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-2 tracking-tighter italic">Strategic Positioning</h2>
            </div>
            <p className="text-slate-500 max-w-md font-light italic">Serving OEM and B2B sectors where reliability isn't a luxury—it's the baseline.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#111827] p-12 rounded-[3rem] text-white">
              <Zap className="text-amber-500 mb-8" size={48} />
              <h3 className="text-4xl font-black mb-4">Response Time King</h3>
              <p className="text-slate-400 text-lg leading-relaxed">In an industry known for delays, we positioned ourselves through speed. From quote to dispatch, our systems are optimized for the fast-moving modern supply chain.</p>
            </div>
            <div className="bg-amber-500 p-12 rounded-[3rem] text-black">
              <Users className="mb-8" size={48} />
              <h3 className="text-3xl font-black mb-4 tracking-tighter">OEM Specialist</h3>
              <p className="font-bold opacity-80">We don't just sell bolts; we provide integrated supply solutions for large-scale manufacturers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MISSION & VISION (Action-Based) */}
      <section className="py-32 bg-[#0a0f1a] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 relative z-10">
          <div>
            <Target className="text-amber-500 mb-8" size={50} />
            <h2 className="text-5xl font-black mb-6 tracking-tighter">Daily Mission</h2>
            <p className="text-slate-400 text-xl font-light leading-relaxed">
              To manufacture high-precision fasteners with <span className="text-white font-medium italic">zero variance</span>, ensuring our clients’ production lines never stop.
            </p>
          </div>
          <div>
            <Eye className="text-blue-400 mb-8" size={50} />
            <h2 className="text-5xl font-black mb-6 tracking-tighter">Long-term Vision</h2>
            <p className="text-slate-400 text-xl font-light leading-relaxed">
              Building a global manufacturing hub in Rajkot that stands as a synonym for <span className="text-white font-medium italic">unbreakable trust</span> in industrial hardware.
            </p>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-500/5 blur-[120px] -z-0"></div>
      </section>

      {/* 7. CORE VALUES (Action-Based Grid) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">The Durable DNA</h2>
            <p className="text-slate-500 mt-4 font-medium uppercase tracking-widest text-xs">Values Defined by Action, Not Words</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                label: "Quality", 
                action: "No dispatch without multi-layer QC clearance.", 
                icon: ShieldCheck,
                color: "text-green-600"
              },
              { 
                label: "Responsiveness", 
                action: "Defined response timelines for every query.", 
                icon: Clock,
                color: "text-blue-600"
              },
              { 
                label: "Integrity", 
                action: "Material test reports provided with every batch.", 
                icon: Award,
                color: "text-amber-600"
              },
              { 
                label: "Efficiency", 
                action: "System-driven dispatch to ensure on-time delivery.", 
                icon: Zap,
                color: "text-purple-600"
              }
            ].map((value, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
                <value.icon className={`${value.color} mb-6 group-hover:scale-110 transition-transform`} size={32} />
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{value.label}</h4>
                <p className="text-slate-900 font-bold text-lg leading-tight italic">“{value.action}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISUALS PLACEHOLDER SECTION */}
      <section className="py-32 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="aspect-square bg-slate-200 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all">
                 <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600" alt="Factory" />
              </div>
              <div className="aspect-square bg-slate-200 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all">
                 <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600" alt="Machinery" />
              </div>
              <div className="aspect-square bg-slate-200 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all">
                 <img src="https://images.unsplash.com/photo-1530124560677-bdaea027df01?auto=format&fit=crop&q=80&w=600" alt="Packaging" />
              </div>
              <div className="aspect-square bg-slate-200 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all">
                 <img src="https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=600" alt="Team" />
              </div>
           </div>
           <p className="text-center text-slate-400 text-xs mt-8 uppercase tracking-[0.5em]">Glimpses of Our Facility & Process</p>
        </div>
      </section>

    </div>
  );
};

export default About;
