import React, { useEffect, useRef, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { ArrowRight, Settings, ShieldCheck, Truck, Users, Sparkles, Play, ChevronRight, Box, Anchor, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase'; 

const { Link } = ReactRouterDOM;

// --- Static Structure (Images will come from DB) ---
const CATEGORIES_DATA = [
  { id: '1', name: 'Fasteners Segment', slug: 'fasteners' },
  { id: '2', name: 'Door & Furniture Fittings', slug: 'fittings' },
  { id: '3', name: 'Automotive Components', slug: 'automotive' }
];

const INDUSTRIES = [
  { name: 'Automotive' }, { name: 'Construction' }, { name: 'Aerospace' },
  { name: 'Heavy Machinery' }, { name: 'Furniture' }, { name: 'Electronics' }
];

// --- Helper Components ---
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setHasStarted(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return { count, ref };
};

const RevealSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) entry.target.classList.add('active'); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
};

// --- Main Page Component ---
const Home: React.FC = () => {
  const [offsetY, setOffsetY] = useState(0);

  // 1. STATE FOR ALL DYNAMIC DATA
  const [siteContent, setSiteContent] = useState({
    hero_bg: '/allscrew.jpg',
    cat_fasteners: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8',
    cat_fittings: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc',
    cat_automotive: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3',
    about_img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    // Stats
    stat_dealers: 350,
    stat_years: 13,
    stat_products: 120,
    // Files & Contact
    catalogue_pdf: '',
    showreel_url: '', // 👈 Added Showreel State
    contact_phone: '+91 0000000000',
    contact_email: 'info@durable.com',
    contact_address: 'Rajkot, Gujarat'
  });

  // 2. FETCH FROM DB
  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*').eq('id', 1).single();
      if (data) {
        setSiteContent({
            hero_bg: data.hero_bg || siteContent.hero_bg,
            cat_fasteners: data.cat_fasteners || siteContent.cat_fasteners,
            cat_fittings: data.cat_fittings || siteContent.cat_fittings,
            cat_automotive: data.cat_automotive || siteContent.cat_automotive,
            about_img: data.about_img || siteContent.about_img,
            stat_dealers: data.stat_dealers || 350,
            stat_years: data.stat_years || 13,
            stat_products: data.stat_products || 120,
            catalogue_pdf: data.catalogue_pdf || '',
            showreel_url: data.showreel_url || '', // 👈 Mapped from Database
            contact_phone: data.contact_phone || '',
            contact_email: data.contact_email || '',
            contact_address: data.contact_address || ''
        });
      }
    };
    fetchContent();
    
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. DYNAMIC STATS HOOKS
  const statDealers = useCounter(siteContent.stat_dealers);
  const statYears = useCounter(siteContent.stat_years);
  const statProducts = useCounter(siteContent.stat_products);

  // Dynamic Categories Array
  const dynamicCategories = [
    { ...CATEGORIES_DATA[0], image: siteContent.cat_fasteners },
    { ...CATEGORIES_DATA[1], image: siteContent.cat_fittings },
    { ...CATEGORIES_DATA[2], image: siteContent.cat_automotive }
  ];

   return (
    <div className="bg-white overflow-x-hidden font-sans selection:bg-yellow-400 selection:text-black">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen min-h-[700px] flex items-center bg-[#0F1115] text-white overflow-hidden">
        <div className="absolute inset-0" style={{ transform: `translateY(${offsetY * 0.5}px)` }}>
            <img src={siteContent.hero_bg} className="w-full h-full object-cover grayscale" alt="Factory" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />

       <div className="relative z-20 max-w-[1440px] mx-auto px-6 lg:px-12 w-full pt-20">
          <RevealSection>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-12 bg-yellow-400"></span>
              <span className="text-yellow-400 font-bold tracking-[0.2em] uppercase text-xs">ISO 9001:2015 Certified</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              WHERE DESIRE<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">MEETS</span> <br/> VALUE
            </h1>
            
            <p className="text-lg text-gray-400 max-w-xl leading-relaxed mb-10 border-l-2 border-white/10 pl-6">
              Durable Fastener Pvt. Ltd. manufactures high-tensile hardware for the world's most demanding industries.
            </p>

            <div className="flex flex-wrap gap-4">
              {/* DYNAMIC CATALOGUE BUTTON */}
              {siteContent.catalogue_pdf ? (
                  <a href={siteContent.catalogue_pdf} target="_blank" rel="noreferrer" className="bg-white text-black px-8 py-4 rounded-sm font-bold uppercase tracking-wider hover:bg-yellow-400 transition-colors duration-300 flex items-center gap-2">
                     <FileText size={18}/> Download Catalogue
                  </a>
              ) : (
                  <Link to="/products" className="bg-white text-black px-8 py-4 rounded-sm font-bold uppercase tracking-wider hover:bg-yellow-400 transition-colors">
                     View Products
                  </Link>
              )}
              
              {/* 👇 DYNAMIC SHOWREEL BUTTON */}
              {siteContent.showreel_url && (
                <a 
                  href={siteContent.showreel_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-8 py-4 rounded-sm font-bold uppercase tracking-wider border border-white/20 hover:bg-white/10 text-white flex items-center gap-3 transition-all backdrop-blur-sm"
                >
                  <Play size={16} fill="currentColor" /> Watch Showreel
                </a>
              )}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* 2. DYNAMIC STATS */}
      <section className="relative -mt-20 z-30 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Suppliers & Dealers', value: statDealers.count, ref: statDealers.ref, suffix: '+', icon: Users, color: 'text-blue-500' },
              { label: 'Years Experience', value: statYears.count, ref: statYears.ref, suffix: '+', icon: ShieldCheck, color: 'text-green-500' },
              { label: 'Product Variations', value: statProducts.count, ref: statProducts.ref, suffix: 'k+', icon: Settings, color: 'text-brand-yellow' }
            ].map((stat, idx) => (
              <div key={idx} ref={stat.ref} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-between transform hover:-translate-y-2 transition-transform duration-300">
                <div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-1">
                    {stat.value}{stat.suffix}
                  </h3>
                  <p className="text-gray-500 font-medium">{stat.label}</p>
                </div>
                <div className={`w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={28} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION (Dynamic Image) */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-40 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
             <div className="lg:w-1/2">
                <RevealSection>
                  <span className="text-brand-blue font-bold tracking-wider uppercase text-sm">About Durable Fastener</span>
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">Building the world, <br />one fastener at a time.</h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Founded in 2018, we have evolved from a small proprietorship into a leading Private Limited company. Our 7,000 sq. ft. facility is a testament to our commitment to growth and quality.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {['Pan-India Network', 'ISO Certified Processes', 'OEM Specialists'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><ShieldCheck size={14} /></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to="/about" className="text-brand-blue font-bold hover:text-brand-dark transition-colors flex items-center gap-2">
                    Read Our Full Story <ChevronRight size={18} />
                  </Link>
                </RevealSection>
             </div>
             <div className="lg:w-1/2 relative">
                <RevealSection className="delay-200">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                    {/* DYNAMIC ABOUT IMAGE */}
                    <img 
                      src={siteContent.about_img} 
                      alt="Manufacturing Floor" 
                      className="w-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                        <div className="text-white">
                          <p className="font-bold text-lg">classone®</p>
                          <p className="text-sm opacity-80">Our Premium Brand</p>
                        </div>
                    </div>
                  </div>
                </RevealSection>
             </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT PORTFOLIO (Dynamic) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <RevealSection>
               <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Product Portfolio</h2>
               <div className="w-24 h-1 bg-brand-yellow mx-auto rounded-full"></div>
               <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                 Explore our comprehensive range of fasteners designed for durability, precision, and performance across all industries.
               </p>
             </RevealSection>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {dynamicCategories.slice(0, 2).map((cat) => (
               <RevealSection key={cat.id} className="group relative h-[400px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
                 <Link to={`/products?category=${cat.slug}`} className="block w-full h-full">
                   <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/0 transition-colors z-10" />
                   <img 
                     src={cat.image} 
                     alt={cat.name} 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20 flex flex-col justify-end p-8">
                     <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                       <span className="text-brand-yellow font-bold text-xs tracking-wider uppercase mb-2 block">Catalogue Category</span>
                       <h3 className="text-3xl font-bold text-white mb-2">{cat.name}</h3>
                       <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                         Premium grade materials engineered for high-stress environments.
                       </p>
                     </div>
                   </div>
                 </Link>
               </RevealSection>
             ))}

             {/* DYNAMIC CTA CARD (Uses Catalogue PDF link) */}
             <RevealSection className="h-[400px] bg-brand-dark rounded-3xl p-8 flex flex-col justify-center items-center text-center text-white relative overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark mb-6 mx-auto group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,200,0,0.5)]">
                    <ArrowRight size={36} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">View All Products</h3>
                  <p className="text-gray-400 text-sm mb-8 px-4">Download our complete PDF catalogue or browse our full online inventory.</p>
                  
                  {siteContent.catalogue_pdf ? (
                      <a href={siteContent.catalogue_pdf} target="_blank" rel="noreferrer" className="inline-block border border-white/30 px-8 py-3 rounded-full hover:bg-white hover:text-brand-dark transition-colors text-sm font-bold tracking-wide uppercase">
                        Download PDF
                      </a>
                  ) : (
                      <Link to="/products" className="inline-block border border-white/30 px-8 py-3 rounded-full hover:bg-white hover:text-brand-dark transition-colors text-sm font-bold tracking-wide uppercase">
                        Go to Store
                      </Link>
                  )}
                </div>
             </RevealSection>
           </div>
        </div>
      </section>

      {/* 5. MARQUEE (Static - Good to keep static) */}
      <section className="py-16 bg-white border-y border-gray-100 overflow-hidden">
        <div className="text-center mb-10">
           <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Trusted By Industries Worldwide</h3>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex gap-16 group-hover:paused">
            {[...INDUSTRIES, ...INDUSTRIES].map((ind, idx) => (
               <div key={idx} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"><Settings size={20} /></div>
                  <span className="text-xl font-bold text-gray-800">{ind.name}</span>
               </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US (Static) */}
      <section className="py-24 bg-brand-dark text-white relative">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { title: 'Quality Assurance', desc: '100% Tested rigorously.', icon: ShieldCheck },
                 { title: 'Cost Effective', desc: 'Factory direct pricing.', icon: Settings },
                 { title: 'Fast Delivery', desc: 'Pan-India logistics.', icon: Truck },
                 { title: 'Support', desc: 'Pre & Post sales service.', icon: Users },
               ].map((feature, idx) => (
                 <RevealSection key={idx} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                    <feature.icon size={40} className="text-brand-yellow mb-4" />
                    <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                 </RevealSection>
               ))}
            </div>
         </div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-24 bg-brand-yellow relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6">Ready to upgrade your hardware?</h2>
            <p className="text-xl text-brand-dark/80 mb-10 font-medium">
               Get a quote within 24 hours. Connect with our engineering team for custom requirements.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link to="/contact" className="bg-brand-dark text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
                  Get a Quote
               </Link>
               <Link to="/products" className="bg-white text-brand-dark px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:shadow-xl transition-all border border-brand-dark/10">
                  Browse Catalogue
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;