import React, { useRef } from 'react';
import { Target, TrendingUp, Users, Calendar, CheckCircle2, Factory, Crown, Sparkles, MapPin, Globe2, ArrowRight, ShieldCheck, Microscope } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';

// --- 1. Reusable Animation Components ---

const FadeInUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const CountUp: React.FC<{ end: number; suffix?: string; duration?: number }> = ({ end, suffix = "", duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Create a motion value starting at 0
  const count = useSpring(0, { duration: duration * 1000, bounce: 0 });

  React.useEffect(() => {
    if (isInView) count.set(end);
  }, [isInView, end, count]);

  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    return count.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [count]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
};

// --- 2. Main Page Component ---

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax for Hero
  const yHero = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="bg-slate-50 min-h-screen overflow-x-hidden font-sans text-slate-900 selection:bg-blue-200">
      <Helmet>
        <title>About Durable Fastener | Engineering Excellence Since 2018</title>
        <meta name="description" content="Discover the journey of Durable Fastener Pvt Ltd, from a small workshop to a global manufacturing hub." />
      </Helmet>

      {/* ================= HERO SECTION ================= */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0a0f1a] text-white">
        {/* Parallax Background */}
        <motion.div 
          style={{ y: yHero, opacity: opacityHero }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center grayscale opacity-40 mix-blend-overlay"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2000')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1a]/50 to-[#0a0f1a]" />
        </motion.div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-black tracking-[0.3em] uppercase mb-8 backdrop-blur-md"
          >
            Since 2018
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-9xl font-black mb-6 tracking-tighter leading-[0.85]"
          >
            PRECISION <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-white to-blue-400">
              IN MOTION
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed"
          >
            From a 35 sq. ft. workshop to a national infrastructure partner. <br/>
            We don't just manufacture fasteners; we build <span className="text-white font-semibold">trust.</span>
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-blue-500 to-transparent"></div>
        </motion.div>
      </div>

      {/* ================= STATS DASHBOARD ================= */}
      <section className="relative z-30 -mt-24 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 group hover:border-blue-200 transition-colors"
            >
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Origins</div>
              <div className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">
                <CountUp end={35} suffix="" />
                <span className="text-lg text-slate-400 ml-2 font-medium">SQ FT</span>
              </div>
              <p className="text-slate-500 font-medium">Where we started (2018)</p>
            </motion.div>

            {/* Stat 2 (Featured) */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#1e293b] p-10 rounded-[2rem] shadow-2xl border-t-4 border-blue-500 relative overflow-hidden transform md:-translate-y-6"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none"></div>
              <div className="relative z-10">
                <div className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">Current Capacity</div>
                <div className="text-7xl font-black text-white mb-2 tracking-tighter">
                  <CountUp end={7000} suffix="" />
                  <span className="text-2xl text-blue-500 ml-2 font-medium">FT²</span>
                </div>
                <p className="text-slate-400 font-light">Advanced Manufacturing Hub</p>
              </div>
            </motion.div>

            {/* Stat 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 group hover:border-amber-200 transition-colors"
            >
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Network</div>
              <div className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">
                <CountUp end={350} suffix="+" />
              </div>
              <p className="text-slate-500 font-medium">Active Dealers & Partners</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS FLOW (NEW: STEP BY STEP DETAILS) ================= */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:flex justify-between items-end">
            <div>
               <span className="text-blue-600 font-black text-xs tracking-[0.3em] uppercase mb-4 block">Transparency</span>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                 How We Build <br /> <span className="text-blue-600">Perfection</span>
               </h2>
            </div>
            <p className="md:w-1/3 text-slate-500 mt-6 md:mt-0">
              Understanding our quality means understanding our process. Here is the step-by-step journey of a Durable Fastener.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {/* Step 1 */}
             <div className="group relative bg-slate-50 p-8 rounded-3xl hover:bg-slate-900 transition-all duration-500 hover:shadow-2xl">
                <div className="absolute top-6 right-6 text-6xl font-black text-slate-200 group-hover:text-white/10 transition-colors">01</div>
                <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mb-16 group-hover:scale-110 transition-transform">
                  <Factory className="text-blue-600" size={24}/>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-white">Raw Material</h3>
                <p className="text-sm text-slate-500 group-hover:text-slate-400">We source only premium grade steel wire. Every batch undergoes tensile testing before entering the floor.</p>
             </div>

             {/* Step 2 */}
             <div className="group relative bg-slate-50 p-8 rounded-3xl hover:bg-blue-600 transition-all duration-500 hover:shadow-2xl">
                <div className="absolute top-6 right-6 text-6xl font-black text-slate-200 group-hover:text-white/10 transition-colors">02</div>
                <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mb-16 group-hover:scale-110 transition-transform">
                  <Target className="text-blue-600" size={24}/>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-white">Cold Forging</h3>
                <p className="text-sm text-slate-500 group-hover:text-blue-100">High-speed headers form the screw head and body with micron-level precision and structural integrity.</p>
             </div>

             {/* Step 3 */}
             <div className="group relative bg-slate-50 p-8 rounded-3xl hover:bg-slate-900 transition-all duration-500 hover:shadow-2xl">
                <div className="absolute top-6 right-6 text-6xl font-black text-slate-200 group-hover:text-white/10 transition-colors">03</div>
                <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mb-16 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="text-blue-600" size={24}/>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-white">Threading & Heat</h3>
                <p className="text-sm text-slate-500 group-hover:text-slate-400">Threads are rolled (not cut) for strength. Heat treatment ensures the perfect balance of hardness and flexibility.</p>
             </div>

             {/* Step 4 */}
             <div className="group relative bg-slate-50 p-8 rounded-3xl hover:bg-amber-400 transition-all duration-500 hover:shadow-2xl">
                <div className="absolute top-6 right-6 text-6xl font-black text-slate-200 group-hover:text-white/20 transition-colors">04</div>
                <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mb-16 group-hover:scale-110 transition-transform">
                  <Crown className="text-amber-500" size={24}/>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-white">QC & Finish</h3>
                <p className="text-sm text-slate-500 group-hover:text-slate-900/80">Anti-corrosive plating is applied. Final QC checks dimensions, finish, and packing before dispatch.</p>
             </div>
          </div>
        </div>
      </section>

      {/* ================= EVOLUTION TIMELINE (SCROLL DRAWN) ================= */}
      <section className="py-32 bg-[#0f172a] relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <span className="text-blue-400 font-black text-xs tracking-[0.3em] uppercase">Our History</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-4">The Evolution Timeline</h2>
          </div>

          <div className="relative">
            {/* The Vertical Line Container */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-800 md:-translate-x-1/2"></div>
            
            {/* The Animated Line */}
            <motion.div 
              style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
              className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] md:-translate-x-1/2 z-10"
            ></motion.div>

            {/* --- Timeline Item 1 --- */}
            <div className="relative flex flex-col md:flex-row items-center justify-between mb-32">
               {/* Content Left */}
               <div className="md:w-1/2 md:pr-16 pl-16 md:pl-0 md:text-right mb-8 md:mb-0">
                  <FadeInUp>
                    <div className="inline-block px-3 py-1 rounded border border-blue-500/30 text-blue-400 text-sm font-bold mb-3">2018</div>
                    <h3 className="text-3xl font-bold text-white mb-3">The Spark</h3>
                    <p className="text-slate-400 leading-relaxed">Durable Enterprise is born in a 35 sq. ft. room. A small space with a massive vision: to redefine hardware quality in Gujarat.</p>
                  </FadeInUp>
               </div>
               
               {/* Dot */}
               <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0f172a] border-2 border-blue-500 rounded-full z-20"></div>

               {/* Image Right */}
               <div className="md:w-1/2 md:pl-16 pl-16 md:pl-0">
                 <FadeInUp delay={0.2}>
                   <div className="relative rounded-xl overflow-hidden border border-slate-700">
                     <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600" alt="Workshop" className="w-full h-48 object-cover opacity-60 hover:opacity-100 transition-opacity" />
                   </div>
                 </FadeInUp>
               </div>
            </div>

            {/* --- Timeline Item 2 --- */}
            <div className="relative flex flex-col md:flex-row-reverse items-center justify-between mb-32">
               <div className="md:w-1/2 md:pl-16 pl-16 md:pl-0 mb-8 md:mb-0">
                  <FadeInUp>
                    <div className="inline-block px-3 py-1 rounded border border-blue-500/30 text-blue-400 text-sm font-bold mb-3">Expansion Era</div>
                    <h3 className="text-3xl font-bold text-white mb-3">Becoming Private Limited</h3>
                    <p className="text-slate-400 leading-relaxed">Transitioned to <strong className="text-white">Durable Fastener Pvt. Ltd.</strong> We moved to a 7000 sq. ft. facility, automating production to meet high-volume OEM demands.</p>
                  </FadeInUp>
               </div>
               <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0f172a] border-2 border-white rounded-full z-20"></div>
               <div className="md:w-1/2 md:pr-16 pl-16 md:pl-0">
                 <FadeInUp delay={0.2}>
                   <div className="relative rounded-xl overflow-hidden border border-slate-700">
                     <img src="https://images.unsplash.com/photo-1565515263731-06915ec52960?auto=format&fit=crop&q=80&w=600" alt="Factory" className="w-full h-48 object-cover opacity-60 hover:opacity-100 transition-opacity" />
                   </div>
                 </FadeInUp>
               </div>
            </div>

            {/* --- Timeline Item 3 --- */}
            <div className="relative flex flex-col md:flex-row items-center justify-between mb-32">
               <div className="md:w-1/2 md:pr-16 pl-16 md:pl-0 md:text-right mb-8 md:mb-0">
                  <FadeInUp>
                    <div className="inline-block px-3 py-1 rounded border border-amber-500/30 text-amber-500 text-sm font-bold mb-3">Brand Launch</div>
                    <h3 className="text-3xl font-bold text-white mb-3">ClassOne Arrives</h3>
                    <p className="text-slate-400 leading-relaxed">Identifying a gap in the premium architectural market, we launched <span className="text-amber-500 font-bold">ClassOne</span>. Superior finish, higher strength, aesthetic perfection.</p>
                  </FadeInUp>
               </div>
               <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-6 h-6 bg-[#0f172a] border-2 border-amber-500 rounded-full z-20 flex items-center justify-center">
                 <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
               </div>
               <div className="md:w-1/2 md:pl-16 pl-16 md:pl-0">
                 <FadeInUp delay={0.2}>
                   <div className="relative rounded-xl overflow-hidden border border-amber-500/30">
                     <img src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=600" alt="ClassOne" className="w-full h-48 object-cover opacity-80 hover:opacity-100 transition-opacity" />
                   </div>
                 </FadeInUp>
               </div>
            </div>

            {/* --- Timeline Item 4 --- */}
            <div className="relative flex flex-col md:flex-row-reverse items-center justify-between">
               <div className="md:w-1/2 md:pl-16 pl-16 md:pl-0 mb-8 md:mb-0">
                  <FadeInUp>
                    <div className="inline-block px-3 py-1 rounded border border-blue-500/30 text-blue-400 text-sm font-bold mb-3">Future Vision</div>
                    <h3 className="text-3xl font-bold text-white mb-3">2030 Roadmap</h3>
                    <p className="text-slate-400 leading-relaxed">Our goal is clear: A Durable Fastener product in every district of India. We are expanding our dealer network to over 1000+ partners.</p>
                  </FadeInUp>
               </div>
               <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full z-20 shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
               <div className="md:w-1/2 md:pr-16 pl-16 md:pl-0">
                 <FadeInUp delay={0.2}>
                   <div className="p-6 rounded-xl bg-blue-900/20 border border-blue-500/20">
                      <div className="flex items-center gap-4 text-white">
                        <Globe2 size={32} className="text-blue-500" />
                        <div>
                          <div className="font-bold">Pan-India Reach</div>
                          <div className="text-xs text-blue-300">Expanding Territories</div>
                        </div>
                      </div>
                   </div>
                 </FadeInUp>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US (STAGGERED GRID) ================= */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Why Industry Leaders Choose Us</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
               { icon: <Calendar size={24}/>, title: "13+ Years Legacy", desc: "Deep manufacturing roots since 2013, ensuring we understand the technical nuances of your requirements.", color: "text-blue-600", bg: "bg-blue-50" },
               { icon: <TrendingUp size={24}/>, title: "Direct Cost Benefit", desc: "Buy directly from the manufacturer. We eliminate middleman margins, passing the savings straight to distributors.", color: "text-green-600", bg: "bg-green-50" },
               { icon: <ShieldCheck size={24}/>, title: "Quality Assurance", desc: "Rigorous ISO-standard testing protocols. Every batch is checked for dimension, torque, and plating quality.", color: "text-purple-600", bg: "bg-purple-50" },
               { icon: <Factory size={24}/>, title: "Inventory Control", desc: "Our 7000 sq ft warehouse ensures we always have stock. Just-in-time delivery for your urgent needs.", color: "text-orange-600", bg: "bg-orange-50" },
               { icon: <Users size={24}/>, title: "Fair Dealing", desc: "Transparency is our policy. Professional handling of orders with clear communication and ethical pricing.", color: "text-indigo-600", bg: "bg-indigo-50" },
               { icon: <Target size={24}/>, title: "After Sales Support", desc: "We don't vanish after dispatch. We track delivery and ensure the product meets your exact performance needs.", color: "text-pink-600", bg: "bg-pink-50" },
             ].map((item, index) => (
               <FadeInUp key={index} delay={index * 0.1}>
                 <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                    <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-6`}>
                      <div className={item.color}>{item.icon}</div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                 </div>
               </FadeInUp>
             ))}
          </div>
        </div>
      </section>

      {/* ================= CTA FOOTER ================= */}
      <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to upgrade your inventory?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Join our network of 350+ satisfied dealers and experience the ClassOne difference today.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold shadow-2xl inline-flex items-center gap-2 hover:bg-slate-50 transition-colors"
          >
            Become a Partner <ArrowRight size={20}/>
          </motion.button>
        </div>
      </section>

    </div>
  );
};

export default About;