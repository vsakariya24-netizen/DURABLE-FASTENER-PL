import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader, Clock, ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// ✅ R2 Base URL — same jo Home.tsx mein hai
const R2_BASE = "https://pub-ffd0eb07a99540ac95c35c521dd8f7ae.r2.dev";

const cleanImageUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '';

  // Already R2 URL → as-is
  if (url.startsWith(R2_BASE)) return url;

  // Unsplash ya external CDN → as-is
  if (url.includes('unsplash.com') || url.includes('images.unsplash')) return url;

  // Local static file → as-is
  if (url.startsWith('/') && !url.startsWith('//')) return url;

  // Supabase ya koi bhi http URL → filename nikalo → R2 se serve karo
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const fileName = url.split('/').pop();
    return `${R2_BASE}/${fileName}`;
  }

  // Relative path → R2 se serve karo
  return `${R2_BASE}/${url}`;
};

const getBadgeStyles = (category: string) => {
  const styles: Record<string, string> = {
    'Industry Trends': 'bg-blue-500/10 text-blue-600 border-blue-200',
    'Technical Guide': 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
    'Company News': 'bg-amber-500/10 text-amber-600 border-amber-200',
  };
  return styles[category] || 'bg-gray-500/10 text-gray-600 border-gray-200';
};

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        // ✅ Har blog image R2 se serve hogi — Supabase egress ZERO
        const postsWithR2 = data.map((post: any) => ({
          ...post,
          image_url: cleanImageUrl(post.image_url)
        }));
        setPosts(postsWithR2);
      }

      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans selection:bg-yellow-100">
      <Helmet>
        <title>Insights | Durable Fastener - Industrial Excellence</title>
      </Helmet>

      {/* Hero Header */}
      <div className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.3em] text-yellow-600 uppercase bg-yellow-50 rounded-full border border-yellow-100">
            Durable Journal
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 mb-6 tracking-tighter leading-none">
            Fastening the <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500">Future.</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Deep dives into fastener engineering, metallurgy, and industrial innovation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader className="animate-spin text-yellow-500" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post) => (
              <article key={post.id} className="group flex flex-col">

                {/* Image — ✅ R2 se aa rahi hai */}
                <Link
                  to={`/blog/${post.slug}`}
                  className="block overflow-hidden rounded-[2rem] mb-8 relative aspect-[16/10] bg-zinc-100 shadow-sm border border-zinc-200"
                >
                  <img
                    src={post.image_url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={post.title}
                    onError={(e) => {
                      // ✅ R2 pe image nahi mili toh fallback
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-5 left-5">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md bg-white/90 border shadow-sm ${getBadgeStyles(post.category)}`}>
                      {post.category}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="px-2">
                  <div className="flex items-center gap-3 text-[10px] font-black text-zinc-400 mb-4 uppercase tracking-[0.1em]">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} /> {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} /> 5 MIN READ
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-zinc-900 mb-4 leading-tight group-hover:text-yellow-600 transition-colors tracking-tight">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-zinc-500 text-base line-clamp-2 leading-relaxed mb-8 font-medium">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-xs font-black uppercase tracking-widest text-zinc-900 gap-2 group-hover:gap-4 transition-all"
                  >
                    Read Insight <ChevronRight size={18} className="text-yellow-500" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
