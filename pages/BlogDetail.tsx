import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, Loader, Share2, Clock, 
  Layout, ChevronRight, CheckCircle2, 
  BookOpen, MessageSquare, Twitter, Linkedin, Copy
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

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

  // Generate Table of Contents from headings
  const toc = useMemo(() => {
    return sections.filter(s => s.heading).map(s => s.heading);
  }, [sections]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader className="text-yellow-600" size={32} />
      </motion.div>
    </div>
  );

  return (
    <div className="bg-[#FCFCFC] min-h-screen font-sans text-zinc-900 selection:bg-yellow-200">
      <Helmet><title>{post?.title} | Durable Fastener</title></Helmet>

      {/* 1. PROGRESS HUD */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-yellow-500 origin-left z-[250]" 
        style={{ scaleX }} 
      />

      {/* 2. DYNAMIC FLOATING NAV */}
      <nav className="sticky top-0 w-full z-[200] bg-white/70 backdrop-blur-xl border-b border-zinc-100 px-4 md:px-12 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-6">
          <Link to="/blog" className="group flex items-center gap-2 text-zinc-400 hover:text-black transition-all">
            <div className="p-1.5 group-hover:bg-zinc-100 rounded-full transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Back to Lab</span>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-200 hidden sm:block" />
          <span className="text-[11px] font-bold text-zinc-400 truncate max-w-[200px] hidden lg:block">
            {post?.title}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-zinc-900 text-white px-4 py-2 rounded-full hover:bg-yellow-500 hover:text-black transition-all">
            Get Quote <ChevronRight size={14} />
          </button>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 3. LEFT SIDEBAR: SOCIAL & NAVIGATION (Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-2 pt-32 sticky top-0 h-screen">
          <div className="space-y-12">
            <div>
              <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-6">Share Insight</p>
              <div className="flex flex-col gap-4">
                {[Linkedin, Twitter, Copy].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 flex items-center justify-center border border-zinc-100 rounded-full hover:border-yellow-500 hover:text-yellow-600 transition-all text-zinc-400 bg-white shadow-sm">
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>
            {toc.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-6">Contents</p>
                <div className="flex flex-col gap-3">
                  {toc.map((item, i) => (
                    <a key={i} href={`#section-${i}`} className="text-xs font-bold text-zinc-400 hover:text-yellow-600 transition-colors line-clamp-1">
                      0{i+1}. {item}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* 4. MAIN ARTICLE AREA */}
        <article className="lg:col-span-7 pt-16 pb-32">
          <header className="mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="px-3 py-1 bg-yellow-500/10 text-yellow-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-yellow-500/20">
                {post?.category || 'Fastening Tech'}
              </span>
              <span className="text-zinc-200">/</span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                <Clock size={12} className="text-zinc-300" /> 5 Min Read
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-8 text-zinc-900"
            >
              {post?.title}
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 p-4 border-y border-zinc-100"
            >
              <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black text-xs">DF</div>
              <div>
                <p className="text-sm font-bold text-zinc-900">Durable Editorial Team</p>
                <p className="text-[11px] font-medium text-zinc-400">
                  {new Date(post?.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Rajkot, India
                </p>
              </div>
            </motion.div>
          </header>

          {/* QUICK SUMMARY CARD */}
          <div className="relative mb-16 p-8 bg-zinc-900 rounded-[2rem] text-white overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <BookOpen size={80} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-yellow-500">
                <div className="h-px w-8 bg-yellow-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Executive Summary</span>
              </div>
              <p className="text-lg text-zinc-300 leading-relaxed font-serif italic">
                {post?.summary || "A deep dive into manufacturing excellence, exploring the critical role of precision-engineered fasteners in modern structural integrity."}
              </p>
            </div>
          </div>

          <main className="prose prose-zinc prose-lg max-w-none">
            {sections.map((section, idx) => (
              <motion.section 
                key={idx} 
                id={`section-${idx}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mb-16"
              >
                {section.type === 'table' ? (
                  <div className="my-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
                        <Layout size={16} />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Technical Specifications</h3>
                    </div>
                    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-zinc-50/50 border-b border-zinc-100">
                              {section.headers?.map((h: string, i: number) => (
                                <th key={i} className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-50">
                            {section.rows?.map((row: string[], ri: number) => (
                              <tr key={ri} className="hover:bg-zinc-50/30 transition-colors">
                                {row.map((cell, ci) => (
                                  <td key={ci} className={`px-8 py-5 text-sm ${ci === 0 ? 'font-bold text-zinc-900' : 'text-zinc-600'}`}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {section.heading && (
                      <h2 className="text-3xl font-bold text-zinc-900 mb-8 tracking-tight">
                        {section.heading}
                      </h2>
                    )}
                    <div className="space-y-8">
                      {section.body.split('\n').map((para: string, pIdx: number) => (
                        para.trim() && (
                          <p key={pIdx} className="text-xl leading-[1.8] text-zinc-700 font-serif font-light">
                            {para}
                          </p>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </motion.section>
            ))}
          </main>
        </article>

        {/* 5. RIGHT SIDEBAR: ADS / CTA (Desktop Only) */}
        
      </div>

      {/* 6. MEGA FOOTER CTA */}
      <footer className="max-w-5xl mx-auto px-6 mb-32">
        <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.1),transparent)]" />
          <div className="relative z-10">
            <CheckCircle2 className="mx-auto text-yellow-500 mb-8" size={48} />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Built for Industrial Strength</h2>
            <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto">
              Join 500+ global partners who trust Durable Fastener for high-precision manufacturing.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="tel:+918758700704" className="bg-yellow-500 text-black font-black px-10 py-5 rounded-full text-[11px] uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 shadow-lg shadow-yellow-500/20">
                Call Engineering <ChevronRight size={16} />
              </a>
              <button className="border border-white/20 text-white font-black px-10 py-5 rounded-full text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all">
                Request Sample Kit
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogDetail;