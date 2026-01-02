import React, { useEffect, useRef, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, Settings, ShieldCheck, Truck, Users, Play, ChevronRight, FileText, MapPin, Mail, Phone, Box } from 'lucide-react';
import { supabase } from '../lib/supabase'; 
import { motion } from 'framer-motion';
const { Link } = ReactRouterDOM;

// --- Static Data ---
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
  return <section ref={ref} className={`reveal ${className}`}>{children}</section>;
};

const Home: React.FC = () => {
  const [offsetY, setOffsetY] = useState(0);
  const [siteContent, setSiteContent] = useState({
    hero_bg: '/allscrew.jpg',
    cat_fasteners: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8',
    cat_fittings: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc',
    cat_automotive: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3',
    about_img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    stat_dealers: 350,
    stat_years: 13,
    stat_products: 120,
    catalogue_pdf: '',
    showreel_url: '',
    contact_phone: '+91 8758700704',
    contact_email: 'info@durablefastener.com',
    contact_address: 'Plot No.16, Ravki, Rajkot, Gujarat'
  });

  // Fetch from Database
  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*').eq('id', 1).single();
      if (data) {
        setSiteContent(prev => ({ ...prev, ...data }));
      }
    };
    fetchContent();
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ManufacturingBusiness",
    "name": "Durable Fastener Pvt. Ltd.",
    "description": "Premium industrial fastener manufacturer in Rajkot, Gujarat specializing in high-tensile bolts and automotive parts.",
    "url": window.location.origin,
    "hasCertification": "ISO 9001:2015"
  };

  const statDealers = useCounter(siteContent.stat_dealers);
  const statYears = useCounter(siteContent.stat_years);
  const statProducts = useCounter(siteContent.stat_products);

  const dynamicCategories = [
    { ...CATEGORIES_DATA[0], image: siteContent.cat_fasteners },
    { ...CATEGORIES_DATA[1], image: siteContent.cat_fittings },
    { ...CATEGORIES_DATA[2], image: siteContent.cat_automotive }
  ];

  return (
   <main role="main" className="bg-white overflow-x-hidden font-sans
 selection:bg-yellow-400 selection:text-black">
      <Helmet>
  <title>Durable Fastener | Industrial Fastener Manufacturer in India</title>
  <meta
    name="description"
    content="Durable Fastener is a leading ISO 9001:2015 certified manufacturer of industrial fasteners, drywall screws, and automotive components in India."
  />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://durablefastener.com/" />

  {/* Open Graph */}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Durable Fastener – Industrial Fastener Manufacturer" />
  <meta property="og:description" content="High-quality fasteners for construction, automotive & industrial use." />
  <meta property="og:url" content="https://durablefastener.com" />
  <meta property="og:image" content="https://durablefastener.com/og-image.jpg" />

  {/* Twitter */}
  <meta name="twitter:card" content="summary_large_image" />
</Helmet>


      {/* 1. HERO SECTION */}
<section className="relative h-screen min-h-[700px] flex bg-[#0F1115] text-white overflow-hidden">
        <div className="absolute inset-0" style={{ transform: `translateY(${offsetY * 0.5}px)` }}>
            <img
  src={siteContent.hero_bg} className="w-full h-full object-cover grayscale opacity-50"  alt="Durable Fastener manufacturing unit in Rajkot Gujarat"
  loading="lazy" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

       <div className="relative z-20 max-w-[1440px] mx-auto px-6 lg:px-20 flex-grow w-full pt-32 md:pt-60">
          <RevealSection>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-12 bg-yellow-400"></span>
              <span className="text-yellow-400 font-bold tracking-[0.2em] uppercase text-xs">ISO 9001:2015 Certified Manufacturer</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">
              Where Desire <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Meets</span> <br/> Value
            </h1>
            <p className="text-lg text-gray-300 max-w-xl leading-relaxed mb-10 border-l-2 border-yellow-400 pl-6">
              Durable Fastener Pvt. Ltd. manufactures international-grade high-tensile hardware for automotive, construction, and heavy machinery industries.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={siteContent.catalogue_pdf || "#"} target="_blank" className="bg-white text-black px-8 py-4 rounded-sm font-bold uppercase tracking-wider hover:bg-yellow-400 transition-all flex items-center gap-2">
                <FileText size={18}/> Download Catalogue
              </a>
              {siteContent.showreel_url && (
                <a href={siteContent.showreel_url} target="_blank" className="px-8 py-4 rounded-sm font-bold uppercase tracking-wider border border-white/20 hover:bg-white/10 text-white flex items-center gap-3 transition-all backdrop-blur-sm">
                  <Play size={16} fill="currentColor" /> Watch Showreel
                </a>
              )}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* 2. DYNAMIC STATS */}
      <div className="relative -mt-44 z-30 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Suppliers & Dealers', value: statDealers.count, ref: statDealers.ref, suffix: '+', icon: Users, color: 'text-blue-500' },
            { label: 'Years Experience', value: statYears.count, ref: statYears.ref, suffix: '+', icon: ShieldCheck, color: 'text-green-500' },
            { label: 'Product Variations', value: statProducts.count, ref: statProducts.ref, suffix: '+', icon: Settings, color: 'text-yellow-500' }
          ].map((stat, idx) => (
            <div key={idx} ref={stat.ref} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-between">
              <div><h3 className="text-4xl font-bold text-gray-900">{stat.value}{stat.suffix}</h3><p className="text-gray-500 font-medium">{stat.label}</p></div>
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center"><stat.icon size={28} className={stat.color} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ABOUT SECTION */}
      <section className="py-24" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Industrial Fastener Experts</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">Building the world, one fastener at a time.</h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Founded in 2018 in Rajkot, Gujarat, we have evolved into a leading Private Limited company. Our 7,000 sq. ft. facility is a testament to our commitment to growth and quality.
            </p>
            <Link to="/about" className="text-blue-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">Read Our Full Story <ChevronRight size={18} /></Link>
          </div>
          
          <div className="lg:w-1/2">
             <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img src={siteContent.about_img} alt="Durable Fastener Manufacturing Floor" className="w-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md p-4 rounded-lg text-white">
                    <p className="font-bold">classone®</p>
                    <p className="text-xs opacity-80">Our Premium Brand</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT PORTFOLIO */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Product Portfolio</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dynamicCategories.slice(0, 2).map((cat) => (
                <div key={cat.id} className="group relative h-[400px] rounded-3xl overflow-hidden shadow-lg">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-8 flex flex-col justify-end">
                    <span className="text-yellow-400 text-xs font-bold uppercase mb-2">Catalogue Category</span>
                    <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
                    <Link to={`/products?category=${cat.slug}`} className="text-white mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">View Details <ArrowRight size={16}/></Link>
                  </div>
                </div>
              ))}
              <div className="h-[400px] bg-black rounded-3xl p-8 flex flex-col justify-center items-center text-center text-white">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-black mb-6"><ArrowRight size={30} /></div>
                <h3 className="text-2xl font-bold mb-3">View All Products</h3>
                <p className="text-gray-400 mb-8">Browse our full online inventory of industrial hardware.</p>
                <Link to="/products" className="border border-white/30 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all">Go to Store</Link>
              </div>
           </div>
        </div>
      </section>

      {/* 5. MARQUEE INDUSTRIES */}
      <section className="py-16 bg-white border-y border-gray-100 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-16">
          {[...INDUSTRIES, ...INDUSTRIES].map((ind, idx) => (
            <div key={idx} className="flex items-center gap-3 opacity-40">
              <Settings size={20} /> <span className="text-xl font-bold uppercase tracking-widest">{ind.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { title: 'Quality Assurance', desc: '100% Tested rigorously.', icon: ShieldCheck },
            { title: 'Cost Effective', desc: 'Factory direct pricing.', icon: Settings },
            { title: 'Fast Delivery', desc: 'Pan-India logistics.', icon: Truck },
            { title: 'Support', desc: 'Pre & Post sales service.', icon: Users },
          ].map((f, i) => (
            <div key={i} className="p-8 border border-white/10 rounded-2xl hover:bg-white/5 transition-all">
              <f.icon size={40} className="text-yellow-400 mb-4" />
              <h4 className="text-xl font-bold mb-2">{f.title}</h4>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ SECTION (SEO Boost) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Industrial Fasteners FAQ</h2>
          <div className="space-y-4">
            <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-2">Are you an ISO certified fastener manufacturer?</h3>
              <p className="text-gray-600">Yes, Durable Fastener Pvt. Ltd. is an ISO 9001:2015 certified company based in Rajkot, ensuring the highest quality standards.</p>
            </article>
            <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-2">Do you provide custom OEM manufacturing?</h3>
              <p className="text-gray-600">We specialize in OEM manufacturing for automotive and industrial sectors, providing custom hardware based on engineering drawings.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-20 bg-yellow-400 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-black mb-6 uppercase">Ready to upgrade your hardware?</h2>
          <p className="text-xl mb-10 text-black/80 font-medium">Connect with our engineering team for custom requirements and bulk quotes.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="bg-black text-white px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all">Get a Quote</Link>
            <a href={siteContent.catalogue_pdf} className="bg-white text-black px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all border border-black/10">Browse Catalogue</a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;