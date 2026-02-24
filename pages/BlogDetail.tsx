import React, { useEffect, useState } from 'react';
// Change 'id' to 'slug' in useParams
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Loader, Share2, Bookmark, Clock, Layout } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const BlogDetail: React.FC = () => {
  const { slug } = useParams();
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
    if (!slug) return;

    // Search by 'slug' column instead of 'id'
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug) 
      .maybeSingle(); 

    if (error) {
      console.error("Fetch error:", error.message);
      setLoading(false);
      return;
    }

    if (data) {
      setPost(data);
      try {
        setSections(JSON.parse(data.content));
      } catch {
        setSections([{ type: 'text', heading: '', body: data.content }]);
      }
    }
    setLoading(false);
  };
  fetchPost();
}, [slug]);

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

      {/* STICKY NAVIGATION BAR (UPDATED WITH BACK BUTTON) */}
      <div className="fixed top-6 left-6 md:left-10 z-[100]">
        <Link 
          to="/blog" 
          className="flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-md border border-zinc-200 text-zinc-900 hover:text-yellow-600 rounded-full shadow-lg shadow-zinc-200/50 transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden md:block font-black text-[10px] uppercase tracking-[0.2em]">
            Back to Journal
          </span>
        </Link>
      </div>

      {/* ACTION BUTTONS (SHARE/BOOKMARK) */}
      <div className="fixed top-6 right-6 md:right-10 z-[100] flex items-center gap-2">
        <button className="p-3 bg-white/80 backdrop-blur-md border border-zinc-200 text-zinc-400 hover:text-black rounded-full shadow-sm transition-all hover:scale-110">
          <Share2 size={18}/>
        </button>
        <button className="p-3 bg-white/80 backdrop-blur-md border border-zinc-200 text-zinc-400 hover:text-black rounded-full shadow-sm transition-all hover:scale-110">
          <Bookmark size={18}/>
        </button>
      </div>

      <article className="pt-32 pb-32">
        <header className="max-w-4xl mx-auto px-6 mb-20 text-center md:text-left">
          <div className="inline-block px-3 py-1 rounded-md bg-zinc-900 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-6">
            {post?.category || 'TECHNICAL GUIDE'}
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-[#5A5245] leading-[1.05] tracking-tighter mb-10">
            {post?.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 py-8 border-y border-zinc-200/60">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F4F4F4] flex items-center justify-center border border-zinc-200 shadow-sm overflow-hidden">
                <img 
                  src="/durablefastener.png" 
                  alt="Durable Fastener Logo" 
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
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
              {section.type === 'table' ? (
                /* TABLE RENDERER */
                <div className="my-12">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="bg-zinc-100 p-2 rounded-lg border border-zinc-200">
                      <Layout size={18} className="text-zinc-600" />
                    </div>
                    <h3 className="text-2xl font-black text-[#5A5245] tracking-tight">
                      {section.heading}
                    </h3>
                  </div>

                  <div className="overflow-hidden border border-zinc-200/60 rounded-[2rem] bg-white shadow-xl shadow-zinc-200/20">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="border-b border-zinc-200/60">
                            {section.headers?.map((header: string, i: number) => (
                              <th key={i} className="px-8 py-5 text-[11px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-50/50">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {section.rows?.map((row: string[], rowIndex: number) => (
                            <tr key={rowIndex} className="hover:bg-zinc-50/50 transition-colors">
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className={`px-8 py-5 text-[16px] ${cellIndex === 0 ? 'font-bold text-zinc-900' : 'text-zinc-600 font-medium'}`}>
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
                /* TEXT RENDERER */
                <>
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
                </>
              )}
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