import React, { useEffect, useRef, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  ArrowRight, Settings, ShieldCheck, Truck, Users, Play, 
  ChevronRight, FileText, Factory, Briefcase, 
  Newspaper, Layers, Cpu, Globe 
} from 'lucide-react';
import { supabase } from '../lib/supabase'; 
import { motion, useScroll, useTransform } from 'framer-motion';

const { Link } = ReactRouterDOM;

// --- Animation Variants ---
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

// --- Helper: Counter ---
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

const Home: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]); // Parallax for Hero

  const [siteContent, setSiteContent] = useState({
    hero_bg: '/allscrew.jpg', // Ensure this image exists in public folder
    stat_dealers: 350,
    stat_years: 13,
    stat_products: 120,
    catalogue_pdf: '',
    showreel_url: ''
  });

  // Fetch Supabase Content
  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*').eq('id', 1).single();
      if (data) setSiteContent(prev => ({ ...prev, ...data }));
    };
    fetchContent();
  }, []);

  const statDealers = useCounter(siteContent.stat_dealers);
  const statYears = useCounter(siteContent.stat_years);
  const statProducts = useCounter(siteContent.stat_products);

  return (
    <main className="bg-white overflow-x-hidden font-sans selection:bg-blue-600 selection:text-white">
      <Helmet>
        <title>Durable Fasteners Pvt Ltd | Premier Manufacturer in India</title>
        <meta name="description" content="ISO 9001:2015 Certified Manufacturer of High Tensile Fasteners, Bolts, and OEM Components in Rajkot, Gujarat." />
      </Helmet>

      {/* 1. HERO SECTION (Parallax & Cinematic) */}
      <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden bg-slate-900 text-white">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img 
            src={siteContent.hero_bg} 
            alt="Durable Fasteners Factory" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-6 pt-20">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeIn} className="flex items-center gap-3 mb-6">
              <span className="h-[2px] w-12 bg-blue-500"></span>
              <span className="text-blue-400 font-bold tracking-[0.2em] uppercase text-sm">ISO 9001:2015 Certified</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl font-black leading-none mb-8">
              PRECISION <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">ENGINEERED</span> <br />
              PERFECTION
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl text-gray-300 max-w-xl leading-relaxed mb-10 border-l-4 border-blue-600 pl-6">
              Durable Fastener Pvt. Ltd. connects the world with industrial-grade high-tensile hardware. From automotive to aerospace, we hold it together.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
              <Link to="/products" className="bg-blue-600 text-white px-8 py-4 rounded-sm font-bold uppercase tracking-wider hover:bg-blue-700 transition-all flex items-center gap-2">
                Explore Products <ArrowRight size={18}/>
              </Link>
              <Link to="/contact" className="px-8 py-4 rounded-sm font-bold uppercase tracking-wider border border-white/20 hover:bg-white/10 text-white transition-all backdrop-blur-sm">
                Contact Sales
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronRight className="rotate-90" />
        </motion.div>
      </section>

      {/* 2. STATS & INTRO (Floating Cards) */}
      <section className="relative z-20 -mt-24 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Global Dealers', value: statDealers.count, ref: statDealers.ref, icon: Globe },
            { label: 'Years Excellence', value: statYears.count, ref: statYears.ref, icon: ShieldCheck },
            { label: 'Product SKU', value: statProducts.count, ref: statProducts.ref, icon: Layers }
          ].map((stat, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              ref={stat.ref} 
              className="bg-white p-8 rounded-sm shadow-2xl border-b-4 border-blue-600 flex items-center justify-between group hover:-translate-y-2 transition-transform duration-300"
            >
              <div>
                <h3 className="text-4xl font-bold text-slate-900">{stat.value}+</h3>
                <p className="text-slate-500 font-medium uppercase text-sm tracking-wider">{stat.label}</p>
              </div>
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <stat.icon size={28} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. PRODUCT ECOSYSTEM (The Core) */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <span className="text-blue-600 font-bold tracking-wider uppercase">Our Portfolio</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2">Engineered for Strength</h2>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors">
              View All Categories <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <Link to="/products?cat=fasteners" className="group relative h-[400px] overflow-hidden rounded-sm bg-slate-900">
              <img src="https://images.unsplash.com/photo-1586864387967-d02ef85d93e8" alt="Fasteners" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-2">Industrial Fasteners</h3>
                <p className="text-slate-300 text-sm translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">High tensile bolts, nuts, and washers.</p>
              </div>
            </Link>
            
            {/* Card 2 */}
            <Link to="/products?cat=automotive" className="group relative h-[400px] overflow-hidden rounded-sm bg-slate-900 lg:translate-y-12">
              <img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3" alt="Automotive" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-2">Automotive Parts</h3>
                <p className="text-slate-300 text-sm translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">Precision components for engines & chassis.</p>
              </div>
            </Link>

            {/* Card 3 */}
            <Link to="/products?cat=fittings" className="group relative h-[400px] overflow-hidden rounded-sm bg-slate-900">
              <img src="https://images.unsplash.com/photo-1530124566582-a618bc2615dc" alt="Fittings" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-2">Furniture Fittings</h3>
                <p className="text-slate-300 text-sm translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">Sleek, durable hardware for modern interiors.</p>
              </div>
            </Link>

            {/* Card 4 - OEM */}
            <Link to="/oem" className="group relative h-[400px] overflow-hidden rounded-sm bg-blue-600 lg:translate-y-12 flex flex-col items-center justify-center text-center p-6">
              <Settings size={48} className="text-white mb-6 group-hover:rotate-180 transition-transform duration-700" />
              <h3 className="text-2xl font-bold text-white mb-2">Custom OEM</h3>
              <p className="text-blue-100 mb-6">Have a drawing? We manufacture to your exact specifications.</p>
              <span className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold text-sm">Learn More</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. MANUFACTURING & INFRASTRUCTURE (Dark Tech Theme) */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
         {/* Background Grid Pattern */}
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         
         <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-blue-400 font-bold tracking-wider uppercase mb-2 block">Our Backbone</span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Advanced Manufacturing <br/> Facility</h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Located in Rajkot, our 7,000+ sq. ft. facility is equipped with state-of-the-art headers, thread rollers, and quality testing labs. We combine traditional craftsmanship with modern automation.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <Factory className="text-blue-500" /> <span>Heading Machines</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Cpu className="text-blue-500" /> <span>Auto-Sorting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Settings className="text-blue-500" /> <span>Thread Rolling</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-blue-500" /> <span>Quality Lab</span>
                  </div>
                </div>

                <Link to="/manufacturing" className="inline-flex items-center gap-2 border-b border-blue-500 text-blue-400 pb-1 hover:text-white hover:border-white transition-all">
                  Take a Virtual Tour <ChevronRight size={16} />
                </Link>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-blue-600/20 blur-xl rounded-full"></div>
                <img 
                  src="https://images.unsplash.com/photo-1565439396655-0dc065c717b0" 
                  alt="Factory Floor" 
                  className="relative rounded-lg shadow-2xl border border-slate-700 grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
         </div>
      </section>

      {/* 5. LIFE AT DURABLE & CAREERS (Split Section) */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: Life */}
        <div className="relative h-[500px] group overflow-hidden">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c" alt="Team" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-blue-900/80 opacity-90 group-hover:bg-blue-900/70 transition-all flex flex-col justify-center items-center text-center p-8">
            <Users size={48} className="text-white mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">Life at Durable</h3>
            <p className="text-blue-100 max-w-sm mb-6">Celebrate festivals, growth, and teamwork. See what makes our culture unique.</p>
            <Link to="/life-at-durable" className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors">
              View Gallery
            </Link>
          </div>
        </div>

        {/* Right: Careers */}
        <div className="relative h-[500px] group overflow-hidden bg-slate-100 flex flex-col justify-center items-center text-center p-8 border-l border-white">
          <Briefcase size={48} className="text-slate-800 mb-4" />
          <h3 className="text-3xl font-bold text-slate-900 mb-2">Build Your Career</h3>
          <p className="text-slate-600 max-w-sm mb-6">We are looking for engineers, operators, and sales executives to join our growing family.</p>
          <Link to="/career" className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-700 transition-colors">
            Current Openings
          </Link>
        </div>
      </section>

      {/* 6. BLOG / NEWS HIGHLIGHTS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Latest Insights</h2>
            <Link to="/blog" className="text-blue-600 font-bold hover:underline">View All Posts</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <article key={item} className="group cursor-pointer">
                <div className="h-48 bg-slate-200 rounded-lg overflow-hidden mb-4 relative">
                   <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm">News</div>
                   {/* Placeholder for blog image */}
                   <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-400"><Newspaper /></div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  The future of High-Tensile Fasteners in India (2026)
                </h3>
                <p className="text-slate-500 text-sm mb-4">Jan 01, 2026 • By Admin</p>
                <Link to="/blog/single" className="text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Article <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA (Blue Brand Color) */}
      <section className="py-20 bg-blue-700 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="relative z-10 container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase">Ready to Start?</h2>
          <p className="text-xl mb-10 text-blue-100 font-light max-w-2xl mx-auto">
            Whether you need a bulk order of standard fasteners or custom OEM development, our team is ready.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="bg-white text-blue-800 px-10 py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              Request Quotation
            </Link>
            <Link to="/about" className="bg-blue-800 border border-blue-500 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-900 transition-all">
              About Company
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;
