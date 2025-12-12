import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, User, ArrowRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

// Helper for Badge Colors based on category
const getBadgeStyles = (category: string) => {
  if (category === 'Industry Trends') return 'bg-blue-50 text-blue-700 border-blue-100';
  if (category === 'Technical Guide') return 'bg-indigo-50 text-indigo-700 border-indigo-100';
  if (category === 'Company News') return 'bg-orange-50 text-orange-700 border-orange-100';
  return 'bg-gray-100 text-gray-700 border-gray-200';
};

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setPosts(data);
      if (error) console.error("Error loading blogs:", error);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Format Date Function (e.g., Oct 24, 2023)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white font-sans selection:bg-yellow-200">
      
      {/* Header Section */}
      <div className="text-center pt-32 pb-16 px-4 bg-gray-50">
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Insights & Updates</h1>
        <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
          Technical articles, industry news, and updates from the world of fastener engineering.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <Loader className="animate-spin text-zinc-300 mb-4" size={40} />
             <p className="text-gray-400">Loading articles...</p>
          </div>
        ) : (
          <>
            {posts.length === 0 ? (
               <div className="text-center py-20 text-gray-400">
                  <p className="text-xl">No articles published yet.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article 
                    key={post.id} 
                    className="flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {/* Image */}
                    <div className="h-56 w-full bg-gray-100 overflow-hidden relative">
                       <img 
                         src={post.image_url || 'https://via.placeholder.com/400x250?text=No+Image'} 
                         alt={post.title} 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                         onError={(e: any) => e.target.src = 'https://placehold.co/600x400?text=No+Image'}
                       />
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-grow p-6">
                      
                      {/* Meta (Category & Date) */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getBadgeStyles(post.category)}`}>
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                          <Calendar size={12} />
                          {formatDate(post.created_at)}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-zinc-900 mb-3 leading-tight group-hover:text-yellow-600 transition-colors">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Footer (Author & Read More) */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wide">
                           <User size={14} className="text-yellow-500" /> {post.author}
                        </div>
                        <Link 
                          to={`/blog/${post.id}`} 
                          className="text-zinc-900 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all hover:text-yellow-600"
                        >
                          Read More <ArrowRight size={14} />
                        </Link>
                      </div>

                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-zinc-900 py-20 px-6 text-center text-white rounded-t-[3rem] mx-4 md:mx-8 shadow-2xl">
         <h2 className="text-3xl font-bold mb-4">Stay in the loop</h2>
         <p className="text-zinc-400 mb-8 max-w-xl mx-auto">Get the latest technical guides and company news sent to your inbox.</p>
         <div className="max-w-md mx-auto flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors"
            />
            <button className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors">
              Subscribe
            </button>
         </div>
      </div>

    </div>
  );
};

export default Blog;