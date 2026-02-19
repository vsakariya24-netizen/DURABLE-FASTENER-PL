import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Loader, Share2, Bookmark, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const BlogDetail: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((totalScroll / windowHeight) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const { data } = await supabase.from('blogs').select('*').eq('id', id).single(); 
      if (data) {
        setPost(data);
        try { 
          setSections(JSON.parse(data.content)); 
        } catch { 
          setSections([{ heading: '', body: data.content }]); 
        }
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF7]">
      <Loader className="animate-spin text-yellow-500" size={40} />
    </div>
  );

  return (
    <div className="bg-[#FDFCF7] min-h-screen font-sans selection:bg-yellow-100">
      <Helmet>
        <title>{post?.title} | Durable Fastener Insights</title>
      </Helmet>

      {/* FIXED PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-1 z-[150] bg-zinc-100">
        <div 
          className="h-full bg-yellow-500 transition-all duration-150 ease-out" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* STICKY NAVIGATION BAR (Updated based on image_2e631e.png) */}
   
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-full transition-all">
              <Share2 size={18}/>
            </button>
            <button className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-full transition-all">
              <Bookmark size={18}/>
            </button>
          </div>
        

      {/* ARTICLE CONTAINER with pt-16 (4rem) and pb-32 (8rem) */}
      <article className="pt-24 pb-32">
        <header className="max-w-4xl mx-auto px-6 mb-20 text-center md:text-left">
          <div className="inline-block px-3 py-1 rounded-md bg-zinc-900 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-6">
            {post?.category || 'TECHNICAL GUIDE'}
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-[#5A5245] leading-[1.05] tracking-tighter mb-10">
            {post?.title}
          </h1>
          
          {/* UPDATED AUTHOR SECTION (Matches image_2e7567.png) */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 py-8 border-y border-zinc-200/60">
            <div className="flex items-center gap-4">
              {/* BRAND LOGO CIRCLE */}
              {/* BRAND LOGO CIRCLE */}
<div className="w-14 h-14 rounded-2xl bg-[#F4F4F4] flex items-center justify-center border border-zinc-200 shadow-sm overflow-hidden">
  <img 
    src="/durablefastener.png" // Replace with your actual logo path (e.g., /logo.png or a URL)
    alt="Durable Fastener Logo" 
    className="w-10 h-10 object-contain"
    onError={(e) => {
      // Fallback if image fails to load
      e.currentTarget.style.display = 'none';
      e.currentTarget.parentElement!.innerHTML = '<span class="text-xl font-black text-zinc-400">D</span>';
    }}
  />
</div>
              
              <div className="text-left">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Published By</p>
                <p className="font-extrabold text-zinc-900 text-lg leading-tight">Durable Fastener Private Limited</p>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-zinc-200 hidden md:block"></div>

            <div className="flex items-center gap-6 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              <span>{new Date(post?.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="flex items-center gap-2"><Clock size={14} className="text-zinc-300"/> 5 MIN READ</span>
            </div>
          </div>
        </header>

        {/* CONTENT SECTIONS */}
        <div className="max-w-4xl mx-auto px-6 space-y-24">
          {sections.map((section, idx) => (
            <section key={idx} className="group">
              {section.heading && (
                <h2 className="text-3xl md:text-5xl font-black text-[#6B6254] mb-8 leading-tight tracking-tight border-l-8 border-yellow-500 pl-8">
                  {section.heading}
                </h2>
              )}
              <div className="prose prose-zinc prose-xl max-w-none text-[#5A5A5A] leading-[1.8] font-serif space-y-8">
                {section.body.split('\n').map((para: string, pIdx: number) => (
                  para.trim() && <p key={pIdx} className="mb-6">{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* FOOTER CTA */}
        <div className="max-w-5xl mx-auto px-6 mt-40">
          <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-none">
                Engineered for <span className="text-yellow-500">Durability</span>
              </h2>
              <p className="text-zinc-400 text-lg mb-12 max-w-lg mx-auto italic">
                Durable Fastener Private Limited — Your trusted manufacturing partner based in Rajkot, Gujarat.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:+918758700704" className="bg-yellow-500 text-black font-black px-12 py-5 rounded-2xl shadow-xl hover:scale-105 transition-all text-[10px] uppercase tracking-widest">Direct Contact</a>
                <Link to="/contact" className="bg-white/10 text-white backdrop-blur-md border border-white/20 px-12 py-5 rounded-2xl hover:bg-white/20 transition-all text-[10px] font-black uppercase tracking-widest">Bulk Inquiries</Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;