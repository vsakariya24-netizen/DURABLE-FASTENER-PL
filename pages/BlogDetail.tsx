import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, Loader, Clock, ChevronRight, CheckCircle2, 
  Facebook, BookOpen, Twitter, Linkedin, Copy, MapPin,
  Instagram, Youtube
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useSpring } from 'framer-motion';

const BlogDetail: React.FC = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data } = await supabase.from('blogs').select('*').eq('slug', slug).maybeSingle();
      if (data) {
        setPost(data);
        try {
          const parsed = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
          setSections(Array.isArray(parsed) ? parsed : [{ type: 'text', heading: 'Introduction', body: data.content }]);
        } catch {
          setSections([{ type: 'text', heading: 'Overview', body: data.content }]);
        }
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  const toc = useMemo(() => {
    return sections.filter(s => s.heading || s.type === 'heading2').map(s => s.heading || s.body);
  }, [sections]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Loader className="text-yellow-600" size={32} />
      </motion.div>
    </div>
  );

  return (
    <div className="bg-[#FCFCFC] min-h-screen font-sans text-zinc-900 selection:bg-yellow-200">
      <Helmet><title>{post?.title} | Durable Fastener</title></Helmet>

      {/* 1. PROGRESS BAR */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-yellow-500 origin-left z-[250]" style={{ scaleX }} />

      {/* 2. MAIN NAVIGATION */}
      <nav className="fixed top-48 w-full z-[200]  px-4 md:px-72 py-3 flex justify-between items-center transition-all">
       
          <Link to="/blog" className="group flex items-center gap-2">
            <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100 group-hover:bg-zinc-900 transition-all duration-300">
              <ArrowLeft size={14} className="group-hover:text-yellow-500 transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">Back to Lab</span>
            </div>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-200 hidden lg:block" />
          
      
        
        
      </nav>

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* 3. LEFT SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 pt-48 sticky top-0 h-screen overflow-y-auto pb-10 scrollbar-hide">
          <div className="flex flex-col items-start gap-16">
            
            {/* SOCIALS */}
            <div className="flex flex-col items-center w-fit">
              <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em] mb-8">Follow Us</p>
              <div className="flex flex-col gap-4">
                {[
                  { Icon: Linkedin, url: "https://www.linkedin.com/company/durable-fastener/", color: "hover:text-blue-600" },
                  { Icon: Facebook, url: "https://www.facebook.com/durablefastener", color: "hover:text-blue-500" },
                  { Icon: Instagram, url: "https://www.instagram.com/durablefastener/", color: "hover:text-pink-500" },
                  { Icon: Youtube, url: "https://www.youtube.com/@durablefastener-rajkot", color: "hover:text-red-600" }
                ].map((item, i) => (
                  <a key={i} href={item.url} className={`w-10 h-10 flex items-center justify-center border border-zinc-100 rounded-full bg-white shadow-sm transition-all duration-300 ${item.color} hover:border-zinc-900 hover:shadow-md hover:-translate-y-1`}>
                    <item.Icon size={16} className="text-zinc-400" />
                  </a>
                ))}
                <button className="w-10 h-10 flex items-center justify-center border border-zinc-100 rounded-full bg-white shadow-sm hover:border-yellow-500 transition-all">
                  <Copy size={14} className="text-zinc-400" />
                </button>
              </div>
            </div>

            {/* CONTENTS */}
            {toc.length > 0 && (
              <div className="w-full">
                <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em] mb-8">Contents</p>
                <div className="flex flex-col gap-6">
                  {toc.map((item, i) => (
                    <a key={i} href={`#section-${i}`} className="group flex gap-3 items-start text-[10px] font-bold text-zinc-400 hover:text-yellow-600 transition-all leading-tight">
                      <span className="text-zinc-200 tabular-nums">0{i+1}.</span>
                      <span className="line-clamp-2 uppercase tracking-wide">{item}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* 4. MAIN ARTICLE */}
        <article className="lg:col-span-8 pt-48 pb-32">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-yellow-400/10 text-yellow-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-md border border-yellow-400/20">
                {post?.category || 'Technical Guide'}
              </span>
              <div className="h-1 w-1 rounded-full bg-zinc-300" />
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                <Clock size={12} /> 5 Min Read
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-10 text-zinc-900">
              {post?.title}
            </h1>

            <div className="flex items-center gap-4 py-6 border-y border-zinc-100">
              <div className="w-12 h-12 rounded-full border border-zinc-100 overflow-hidden bg-white flex items-center justify-center shadow-sm">
                <img 
                  src="/logo.png" 
                  alt="Durable Fastener Logo" 
                  className="w-9 h-9 object-contain"
                  onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=DF&background=18181b&color=eab308"; }}
                />
              </div>
              <div>
                <p className="text-sm font-black text-zinc-900">Durable Editorial Team</p>
                <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-400">
                  <span>{new Date(post?.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider"><MapPin size={10} /> Rajkot, India</span>
                </div>
              </div>
            </div>
          </header>

          {/* SUMMARY CARD */}
          <div className="relative mb-20 p-8 md:p-12 bg-[#0f0f11] rounded-[2.5rem] text-white overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
              <BookOpen size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-6 bg-yellow-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-500">Executive Summary</span>
              </div>
              <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-serif italic font-light">
                {post?.summary || "A deep dive into manufacturing excellence, exploring the critical role of precision-engineered fasteners in modern structural integrity."}
              </p>
            </div>
          </div>

          <main className="prose prose-zinc prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight">
  {sections.map((section, idx) => {
    const sectionId = `section-${idx}`;
    switch (section.type) {
      case 'heading2':
        return (
          <h2 key={idx} id={sectionId} className="text-3xl md:text-4xl font-bold text-zinc-900 mt-20 mb-8 border-b-4 border-yellow-500 pb-4">
            {section.body}
          </h2>
        );
      case 'heading3':
        return (
          <h3 key={idx} id={sectionId} className="text-2xl font-bold text-zinc-800 mt-12 mb-6">
            {section.body}
          </h3>
        );

      // 1. TABLE CASE ADDED HERE
      case 'table':
        return (
          <div key={idx} id={sectionId} className="my-10 overflow-x-auto">
            {section.heading && <h3 className="text-xl font-bold text-zinc-900 mb-4">{section.heading}</h3>}
            <table className="w-full border-collapse rounded-xl overflow-hidden shadow-lg border border-zinc-200">
              <thead>
                <tr className="bg-zinc-900 text-yellow-500 uppercase text-[10px] font-black tracking-[0.2em]">
                  {section.headers?.map((h: string, i: number) => (
                    <th key={i} className="px-6 py-4 text-left border border-zinc-800">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows?.map((row: string[], ri: number) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}>
                    {row.map((cell: string, ci: number) => (
                      <td key={ci} className="px-6 py-4 text-sm text-zinc-600 border border-zinc-100">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      // 2. SUMMARY/CALLOUT CASE ADDED HERE
      case 'summary':
        return (
          <div key={idx} className="relative my-12 p-10 bg-[#0f0f11] rounded-[2rem] text-white shadow-2xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="h-[2px] w-8 bg-yellow-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500">Key Insight</span>
             </div>
             <p className="text-xl text-zinc-300 font-serif italic leading-relaxed">{section.body}</p>
          </div>
        );

      // 3. IMAGE CASE ADDED HERE
      case 'image':
        return (
          <figure key={idx} className="my-12 text-center">
            <img src={section.imageUrl} alt={section.caption} className="w-full rounded-2xl shadow-xl" />
            {section.caption && <figcaption className="mt-4 text-sm text-zinc-400 italic font-serif">— {section.caption}</figcaption>}
          </figure>
        );

      default:
        return (
          <section key={idx} id={sectionId} className="mb-12">
            {section.heading && <h2 className="text-2xl font-bold text-zinc-900 mb-6">{section.heading}</h2>}
            <div className="space-y-6">
              {section.body?.split('\n').map((para: string, pIdx: number) => (
                para.trim() && (
                  <p key={pIdx} className="text-lg leading-[1.8] text-zinc-600 font-serif font-light">
                    {para}
                  </p>
                )
              ))}
            </div>
          </section>
        );
    }
  })}
</main>
        </article>
      </div>

      {/* 5. FOOTER SECTION */}
      <footer className="max-w-6xl mx-auto px-6 mb-32">
        <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.1),transparent)]" />
          <div className="relative z-10 flex flex-col items-center">
            <CheckCircle2 className="text-yellow-500 mb-8" size={48} />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Built for Industrial Strength</h2>
            <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Join 500+ global partners who trust Durable Fastener for high-precision manufacturing.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a href="tel:+918758700704" className="bg-yellow-500 text-black font-black px-12 py-5 rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-xl shadow-yellow-500/20">
                Call Engineering
              </a>
              <button className="border border-white/20 text-white font-black px-12 py-5 rounded-full text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all">
                Request Samples
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogDetail;