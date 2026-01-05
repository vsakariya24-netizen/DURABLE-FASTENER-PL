import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, User, ArrowLeft, Loader, Share2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
const BlogDetail: React.FC = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single(); // Fetch only ONE record

      if (data) setPost(data);
      if (error) console.error("Error fetching post:", error);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-zinc-400" size={40} />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900">Article not found</h2>
        <Link to="/blog" className="mt-4 text-blue-600 hover:underline">Back to Blog</Link>
    </div>
  );
const cleanDescription = post.excerpt || post.content.substring(0, 150).replace(/"/g, "") + "...";
  return (
    <div className="bg-white font-sans min-h-screen pt-32 pb-20">
      <Helmet>
        {/* 1. Dynamic Article SEO */}
        <title>{post.title} | Durable Fastener Blog</title>
        <meta name="description" content={cleanDescription} />
        
        {/* 2. Open Graph (For Social Media Sharing) */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={cleanDescription} />
        <meta property="og:image" content={post.image_url || 'https://durablefastener.com/default-blog.jpg'} />
        <meta property="og:url" content={`https://durablefastener.com/blog/${id}`} />
        
        {/* 3. Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={cleanDescription} />
        <meta name="twitter:image" content={post.image_url} />

        {/* 4. Article Schema (Structured Data) */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "${post.title.replace(/"/g, '\\"')}",
              "image": "${post.image_url || ''}",
              "datePublished": "${post.created_at}",
              "dateModified": "${post.created_at}",
              "author": {
                "@type": "Person",
                "name": "${post.author || 'Durable Fastener Team'}"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Durable Fastener Pvt Ltd",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://durablefastener.com/durablefastener.png"
                }
              },
              "description": "${cleanDescription.replace(/"/g, '\\"')}"
            }
          `}
        </script>
      </Helmet>
      {/* Progress Bar (Visual Touch) */}
      <div className="fixed top-0 left-0 h-1 bg-yellow-500 z-50 w-full animate-pulse"></div>

      <article className="max-w-4xl mx-auto px-6">
        
        {/* Back Button */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors font-medium">
            <ArrowLeft size={20} /> Back to Insights
        </Link>
        
        {/* Header Info */}
        <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
                {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-zinc-900 mb-6 leading-tight">
                {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm border-b border-gray-100 pb-8">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold">
                        {post.author ? post.author.charAt(0) : 'A'}
                    </div>
                    <span className="font-medium text-zinc-900">{post.author || 'Admin'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
        </div>

        {/* Featured Image */}
        <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl bg-gray-100">
             <img 
                src={post.image_url} 
                className="w-full h-full object-cover" 
                alt={post.title} 
                onError={(e: any) => e.target.src = 'https://placehold.co/800x400?text=No+Image'}
             />
        </div>

        {/* Content Body */}
        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
            {post.content.split('\n').map((paragraph: string, idx: number) => (
                paragraph.trim() !== "" && (
                    <p key={idx} className="mb-6">
                        {paragraph}
                    </p>
                )
            ))}
        </div>

      </article>
    </div>
  );
};

export default BlogDetail;