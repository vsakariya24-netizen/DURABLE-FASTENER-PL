import React, { useEffect, useRef, useState } from 'react';
import { Target, Eye, Heart, TrendingUp, Award, MapPin, Users, Calendar, ArrowUpRight, CheckCircle2, Factory, Crown, Star } from 'lucide-react';

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
  
  // Parallax logic
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Growth Stats
  const statOfficeStart = useCounter(35, 1500);
  const statOfficeNow = useCounter(7000, 2500);
  const statSuppliers = useCounter(350, 2000);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden font-sans text-gray-900">
      
      {/* 1. Hero Section with Parallax */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-brand-dark text-white">
        <div 
          className="absolute inset-0 opacity-40 z-0"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${offsetY * 0.5}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-dark/50 to-brand-dark z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
          <RevealSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 text-brand-yellow text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
               <Award size={16} /> Est. 2018
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
              Our Legacy of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-200">
                Unwavering Strength
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
              From a humble 35 sq. ft. office to a 7,000 sq. ft. manufacturing powerhouse, our journey is defined by quality, precision, and trust.
            </p>
          </RevealSection>
        </div>
      </div>

      {/* 2. Growth Story (Animated Stats) */}
      <section className="py-20 bg-white relative -mt-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Start Stat */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border-b-4 border-gray-200 text-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Started In 2018</div>
              <div className="text-5xl font-extrabold text-gray-300 mb-2 flex justify-center items-baseline gap-1" ref={statOfficeStart.ref}>
                {statOfficeStart.count} <span className="text-xl">sq ft</span>
              </div>
              <p className="text-gray-500 text-sm">Our Humble Beginning</p>
            </div>

            {/* Current Stat (Hero) */}
            <div className="bg-brand-dark p-8 rounded-2xl shadow-2xl border-b-4 border-brand-yellow text-center transform scale-110 relative z-10">
              <div className="text-brand-yellow font-bold uppercase tracking-wider text-xs mb-2">Facility Today</div>
              <div className="text-6xl font-extrabold text-white mb-2 flex justify-center items-baseline gap-1" ref={statOfficeNow.ref}>
                {statOfficeNow.count} <span className="text-2xl text-brand-yellow">sq ft</span>
              </div>
              <p className="text-gray-400 text-sm">State-of-the-art Manufacturing</p>
            </div>

            {/* Network Stat */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border-b-4 border-brand-blue text-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="text-brand-blue font-bold uppercase tracking-wider text-xs mb-2">Network Strength</div>
              <div className="text-5xl font-extrabold text-gray-900 mb-2 flex justify-center items-baseline gap-1" ref={statSuppliers.ref}>
                {statSuppliers.count} <span className="text-xl">+</span>
              </div>
              <p className="text-gray-500 text-sm">Suppliers & Dealers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Origin Story (Timeline) */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <RevealSection className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <div className="w-24 h-1 bg-brand-yellow mx-auto rounded-full"></div>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                A timeline of continuous evolution and strategic expansion.
              </p>
           </RevealSection>

           <div className="relative">
             {/* Vertical Line */}
             <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 hidden md:block"></div>

             {/* Timeline Item 1 */}
             <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 group">
                 <div className="md:w-5/12 order-2 md:order-1 text-right pr-0 md:pr-10">
                    <RevealSection>
                      <span className="text-brand-blue font-bold text-lg">August 29, 2018</span>
                      <h3 className="text-2xl font-bold text-gray-900 mt-2">The Foundation</h3>
                      <p className="text-gray-600 mt-2">
                        Established as "Durable Enterprise", a proprietorship firm with a vision to redefine hardware quality.
                      </p>
                    </RevealSection>
                 </div>
                 <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-brand-blue rounded-full border-4 border-white shadow-lg z-10 hidden md:flex items-center justify-center order-1">
                   <div className="w-3 h-3 bg-white rounded-full"></div>
                 </div>
                 <div className="md:w-5/12 order-3 md:order-2 pl-0 md:pl-10">
                   <div className="w-full h-48 bg-gray-200 rounded-xl overflow-hidden shadow-md">
                     <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" alt="Office 2018" />
                   </div>
                 </div>
             </div>

             {/* Timeline Item 2 */}
             <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 group">
                 <div className="md:w-5/12 order-2 md:order-1 text-right pr-0 md:pr-10">
                   <div className="w-full h-48 bg-gray-200 rounded-xl overflow-hidden shadow-md">
                     <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" alt="Incorporation" />
                   </div>
                 </div>
                 <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-brand-yellow rounded-full border-4 border-white shadow-lg z-10 hidden md:flex items-center justify-center order-1">
                   <div className="w-3 h-3 bg-white rounded-full"></div>
                 </div>
                 <div className="md:w-5/12 order-3 md:order-2 pl-0 md:pl-10">
                    <RevealSection>
                      <span className="text-brand-yellow font-bold text-lg">Evolution</span>
                      <h3 className="text-2xl font-bold text-gray-900 mt-2">Private Limited</h3>
                      <p className="text-gray-600 mt-2">
                        Transitioned to "Durable Fastener Pvt. Ltd.", formalizing our structure to support large-scale industrial demands.
                      </p>
                    </RevealSection>
                 </div>
             </div>

             {/* Timeline Item 3 */}
             <div className="relative flex flex-col md:flex-row items-center justify-between group">
                 <div className="md:w-5/12 order-2 md:order-1 text-right pr-0 md:pr-10">
                    <RevealSection>
                      <span className="text-gray-900 font-bold text-lg">Present Day</span>
                      <h3 className="text-2xl font-bold text-gray-900 mt-2">Rapid Expansion</h3>
                      <p className="text-gray-600 mt-2">
                        Operating from a 7,000 sq. ft. facility, focusing on our premium flagship brand: <span className="font-bold text-brand-blue">classone®</span>.
                      </p>
                    </RevealSection>
                 </div>
                 <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-900 rounded-full border-4 border-white shadow-lg z-10 hidden md:flex items-center justify-center order-1">
                   <div className="w-3 h-3 bg-white rounded-full"></div>
                 </div>
                 <div className="md:w-5/12 order-3 md:order-2 pl-0 md:pl-10">
                   <div className="w-full h-48 bg-gray-200 rounded-xl overflow-hidden shadow-md">
                     <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" alt="Factory Today" />
                   </div>
                 </div>
             </div>
           </div>
        </div>
      </section>

      {/* 4. Vision & Mission (Glass Cards) */}
      <section className="py-24 bg-brand-dark relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-yellow-900/20 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             
             {/* Vision */}
             <RevealSection>
               <div className="glass-dark p-10 rounded-3xl h-full border border-white/10 hover:border-brand-blue/50 transition-colors group">
                 <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Eye size={36} />
                 </div>
                 <h3 className="text-3xl font-bold text-white mb-6">Our Vision</h3>
                 <p className="text-gray-300 text-lg leading-relaxed mb-8">
                   We dedicate ourselves to focus on the needs of users in the industry, enabling us to satisfy our customers by providing them with better solutions, while contributing to the creation of a prosperous society and future.
                 </p>
                 <div className="flex items-center gap-3 text-sm font-semibold text-blue-300 bg-blue-500/10 p-4 rounded-xl">
                   <MapPin size={18} />
                   Target: Pan-India presence in every city & district.
                 </div>
               </div>
             </RevealSection>

             {/* Mission */}
             <RevealSection className="delay-200">
               <div className="glass-dark p-10 rounded-3xl h-full border border-white/10 hover:border-brand-yellow/50 transition-colors group">
                 <div className="w-16 h-16 bg-yellow-500/20 text-yellow-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Target size={36} />
                 </div>
                 <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
                 <ul className="space-y-6">
                   {[
                     "Explore industry-leading quality, safety, and performance.",
                     "Provide customer-friendly products incorporating creative wisdom.",
                     "Inherit the DNA of classone® to achieve Quality and Sustainable Growth."
                   ].map((item, idx) => (
                     <li key={idx} className="flex items-start gap-4">
                       <div className="mt-1 min-w-[20px] text-brand-yellow">
                         <CheckCircle2 size={20} />
                       </div>
                       <span className="text-gray-300 text-lg">{item}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             </RevealSection>

           </div>
        </div>
      </section>

      {/* 5. Aspiration & Brand (Redesigned for Single Brand) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <RevealSection>
             <div className="inline-block p-4 bg-red-50 text-red-500 rounded-full mb-6">
               <Heart size={32} fill="currentColor" />
             </div>
             <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Aspiration</h2>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
               To be the No.1 premium brand that always places 'Customer First', creating a trusted environment that attracts and retains the best talent.
             </p>
           </RevealSection>

           {/* --- NEW SINGLE BRAND DESIGN --- */}
         <div className="flex justify-center">
  <RevealSection className="w-full max-w-5xl">
    <div className="relative group overflow-hidden rounded-[2.5rem] bg-gray-900 shadow-2xl transition-all duration-500 hover:shadow-brand-blue/20 hover:shadow-3xl">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#0a192f] to-gray-900 opacity-100"></div>
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className="relative z-10 px-8 py-20 md:py-24 flex flex-col items-center justify-center text-center">
        
        {/* Badge */}
        <div className="mb-12 flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-xs font-bold tracking-widest uppercase text-gray-400 backdrop-blur-sm">
          <Crown size={14} className="text-brand-yellow" /> Flagship Brand
        </div>

        {/* LOGO GROUP */}
        <div className="relative transform group-hover:scale-105 transition-transform duration-500 mb-6">
          
          {/* 1. MAIN TEXT */}
          <h3 className="relative z-10 text-7xl md:text-9xl font-normal text-white tracking-normal font-['Century_Gothic','Futura','sans-serif'] flex items-baseline leading-none">
            class
            {/* Custom 'o' with dot */}
            <span className="relative inline-flex items-center justify-center mx-[2px]">
              o
              {/* UPDATED: -translate-y-1/2 puts it in the exact center */}
              <span className="absolute w-[0.16em] h-[0.16em] bg-white rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/8 shadow-[0_0_10px_white]"></span>
            </span>
            ne
            <sup className="text-2xl md:text-5xl text-brand-WHITE self-start ml-1 mt-2 md:mt-4">®</sup>
          </h3>

          {/* 2. REFLECTION EFFECT */}
          <h3 
            className="absolute top-[75%] left-0 w-full text-7xl md:text-9xl font-normal text-white tracking-normal font-['Century_Gothic','Futura','sans-serif'] flex items-baseline leading-none scale-y-[-1] opacity-10 select-none pointer-events-none"
            style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)' }}
          >
             class
            <span className="relative inline-flex items-center justify-center mx-[2px]">
              o
              {/* UPDATED REFLECTION DOT TOO */}
              <span className="absolute w-[0.16em] h-[0.16em] bg-white rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
            </span>
            ne
             <sup className="text-2xl md:text-5xl text-brand-WHITE self-start ml-1 mt-2 md:mt-4">®</sup>
          </h3>
       

          {/* 2. REFLECTION EFFECT */}
          <h3 
            className="absolute top-[75%] left-0 w-full text-7xl md:text-9xl font-normal text-white tracking-normal font-['Century_Gothic','Futura','sans-serif'] flex items-baseline leading-none scale-y-[-1] opacity-10 select-none pointer-events-none"
            style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)' }}
          >
             class
            <span className="relative inline-flex items-center justify-center mx-[2px]">
              o
              <span className="absolute w-[0.16em] h-[0.16em] bg-white rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%]"></span>
            </span>
            ne
             <sup className="text-2xl md:text-5xl text-brand-blue self-start ml-1 mt-2 md:mt-4">®</sup>
          </h3>
        </div>

                    {/* Divider */}
                    <div className="w-24 h-1.5 bg-gradient-to-r from-brand-blue to-cyan-400 rounded-full my-8 group-hover:w-48 transition-all duration-500"></div>

                    {/* Description */}
                    <p className="text-gray-300 text-lg md:text-xl font-light tracking-wide uppercase max-w-lg">
                      Premium Architectural Hardware
                    </p>
                    
                    <div className="mt-8 flex gap-2">
                       {[1,2,3,4,5].map(star => (
                          <Star key={star} size={20} className="text-brand-yellow fill-brand-yellow animate-pulse" style={{animationDelay: `${star * 200}ms`}} />
                       ))}
                    </div>

                  </div>
                </div>
              </RevealSection>
           </div>
           {/* --- END NEW DESIGN --- */}

        </div>
      </section>

      {/* 6. Why Choose Us (Bento Grid) */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-gray-900">Why Choose Durable Fastener?</h2>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
             {[
               { title: "13+ Years", desc: "Industry Experience", icon: Calendar },
               { title: "Quality Assurance", desc: "Rigorous Testing", icon: CheckCircle2 },
               { title: "After Sales", desc: "Dedicated Support", icon: Users },
               { title: "Fair Dealing", desc: "Transparent Business", icon: Award },
               { title: "Cost Effective", desc: "Factory Direct", icon: TrendingUp },
               { title: "Inventory", desc: "Smart Control", icon: Factory },
               { title: "Professional", desc: "Expert Team", icon: Award },
               { title: "Follow Up", desc: "Pre & Post Service", icon: ArrowUpRight },
             ].map((item, idx) => (
               <RevealSection key={idx} className={`p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg hover:border-brand-yellow/30 transition-all group ${idx === 0 || idx === 7 ? 'md:col-span-2 bg-gradient-to-br from-white to-gray-50' : ''}`}>
                 <item.icon className="w-8 h-8 text-gray-400 group-hover:text-brand-yellow mb-4 transition-colors" />
                 <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                 <p className="text-sm text-gray-500">{item.desc}</p>
               </RevealSection>
             ))}
           </div>
        </div>
      </section>

    </div>
  );
};

export default About;