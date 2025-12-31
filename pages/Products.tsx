import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { 
  Search, ChevronDown, ChevronRight, 
  ArrowRight, LayoutGrid, ShoppingBag, Sparkles
} from 'lucide-react';

// --- HELPER: Slugify ---
const toSlug = (text: string) => {
  if (!text) return '';
  return text.toLowerCase().trim().replace(/[\s/]+/g, '-');
};

// --- HELPER: Un-Slugify ---
const fromSlug = (slug: string) => {
  if (!slug) return '';
  return slug.replace(/-/g, ' ').toLowerCase();
};

const Products: React.FC = () => {
  const { category: urlCategory, subcategory: urlSubCategory } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // STATE
  const [activeFilter, setActiveFilter] = useState<{ type: string; value: string; name: string }>({ 
    type: 'ALL', 
    value: '', 
    name: 'All Products' 
  });

  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // -------------------------------------------
  // STEP 0: LEGACY REDIRECT
  // -------------------------------------------
  useEffect(() => {
    const queryCat = searchParams.get('category');
    if (queryCat && !urlCategory) {
      navigate(`/products/${toSlug(queryCat)}`, { replace: true });
    }
  }, [searchParams, urlCategory, navigate]);

  // -------------------------------------------
  // STEP 1: LOAD CATEGORIES
  // -------------------------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      const [cats, subs] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('sub_categories').select('*').order('name')
      ]);

      const tree = cats.data?.map(cat => ({
        ...cat,
        sub_categories: subs.data?.filter(s => s.category_id === cat.id) || []
      })) || [];

      setCategoryTree(tree);
    };
    fetchCategories();
  }, []);

  // -------------------------------------------
  // STEP 2: SET FILTER FROM URL (SMART MATCHING ADDED)
  // -------------------------------------------
  useEffect(() => {
    if (categoryTree.length === 0) return;

    if (urlCategory) {
      const cleanUrlCat = fromSlug(urlCategory); // e.g., "fasteners"

      // 1. Exact Match Try karo (e.g. "fasteners segment" === "fasteners segment")
      let matchedCat = categoryTree.find(c => 
        c.name.toLowerCase().trim() === cleanUrlCat
      );

      // 2. Agar Exact Match na mile, to PARTIAL MATCH (Smart Search) karo
      // e.g. Agar URL "fasteners" hai aur DB mein "Fasteners Segment" hai, to match kar lo
      if (!matchedCat) {
        matchedCat = categoryTree.find(c => 
          c.name.toLowerCase().includes(cleanUrlCat) || 
          cleanUrlCat.includes(c.name.toLowerCase())
        );
      }
      
      if (matchedCat) {
        // MATCH FOUND!
        let newFilter = { type: 'CATEGORY', value: matchedCat.name, name: matchedCat.name };
        let shouldExpand = matchedCat.id;

        // Sub-Category Check
        if (urlSubCategory) {
           const cleanUrlSub = fromSlug(urlSubCategory);
           const matchedSub = matchedCat.sub_categories.find((s: any) => 
             s.name.toLowerCase().trim() === cleanUrlSub ||
             s.name.toLowerCase().includes(cleanUrlSub) // Smart match for sub-cat too
           );
           
           if (matchedSub) {
             newFilter = { type: 'SUB_CATEGORY', value: matchedSub.id, name: matchedSub.name };
           }
        }

        setActiveFilter(newFilter);
        setExpandedCats(prev => prev.includes(shouldExpand) ? prev : [...prev, shouldExpand]);
      } else {
        console.warn("Category mismatch:", urlCategory);
        // Fallback: Optional - Stay on All Products or show error
      }
    } else {
       setActiveFilter({ type: 'ALL', value: '', name: 'All Products' });
    }
    
  }, [urlCategory, urlSubCategory, categoryTree]);

  // -------------------------------------------
  // STEP 3: FETCH PRODUCTS
  // -------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
    let query = supabase.from('products').select('*').order('created_at', { ascending: true });
        if (activeFilter.type === 'CATEGORY') {
          query = query.ilike('category', activeFilter.value); 
        } else if (activeFilter.type === 'SUB_CATEGORY') {
          query = query.eq('sub_category', activeFilter.value); 
        }

        if (searchTerm) {
          query = query.ilike('name', `%${searchTerm}%`);
        }

        const { data, error } = await query;
        if (data) setProducts(data);
        
      } finally {
        setLoading(false);
      }
    };

    // Debounce
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [activeFilter, searchTerm]);


  // -------------------------------------------
  // UI HANDLERS
  // -------------------------------------------
  const toggleCategory = (catId: string) => {
    setExpandedCats(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleMainCategoryClick = (catName: string) => {
    navigate(`/products/${toSlug(catName)}`);
  };

  const handleSubCategoryClick = (catName: string, subId: string, subName: string) => {
    navigate(`/products/${toSlug(catName)}/${toSlug(subName)}`);
  };

  const resetFilter = () => {
    navigate('/products');
    setSearchTerm('');
  };

  // Animations
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-[#dbdbdc] min-h-screen pt-20">
      <Helmet>
        <title>{`${activeFilter.name} | Durable Fasteners Pvt Ltd`}</title>
      </Helmet>

      {/* HERO */}
      <section className="relative h-[30vh] flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#fbbf24 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <span className="inline-flex items-center gap-2 text-yellow-500 font-bold text-xs uppercase tracking-[0.3em] mb-4">
            <Sparkles size={14} /> Elite Hardware
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">
            {activeFilter.name}
          </h1>
        </motion.div>
      </section>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR */}
          <aside className="lg:w-[300px] shrink-0">
            <div className="sticky top-32 space-y-6">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-white border-2 border-zinc-100 rounded-xl px-10 py-3 text-sm focus:border-yellow-400 focus:ring-0 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              </div>

              {/* Filters */}
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-zinc-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-black text-zinc-900 uppercase tracking-wide">Filters</h3>
                  {activeFilter.type !== 'ALL' && (
                    <button onClick={resetFilter} className="text-xs text-red-500 font-bold hover:underline">Reset</button>
                  )}
                </div>

                <div className="space-y-1">
                  <button
                    onClick={resetFilter}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${activeFilter.type === 'ALL' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-50 text-zinc-600'}`}
                  >
                    <LayoutGrid size={16} /> All Products
                  </button>

                  {categoryTree.map((cat) => {
                      const isActiveCat = activeFilter.value === cat.name || (activeFilter.type === 'SUB_CATEGORY' && expandedCats.includes(cat.id));
                      const isExpanded = expandedCats.includes(cat.id);

                      return (
                      <div key={cat.id} className="space-y-1">
                        <div className={`flex items-center justify-between group rounded-lg px-3 py-2 transition-colors ${isActiveCat ? 'bg-yellow-50' : 'hover:bg-zinc-50'}`}>
                           <button 
                             onClick={() => handleMainCategoryClick(cat.name)}
                             className={`flex-1 text-left text-sm font-bold ${isActiveCat ? 'text-yellow-700' : 'text-zinc-700'}`}
                           >
                             {cat.name}
                           </button>
                           {cat.sub_categories.length > 0 && (
                             <button onClick={(e) => { e.stopPropagation(); toggleCategory(cat.id); }} className="p-1 hover:bg-zinc-200 rounded">
                                <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}/>
                             </button>
                           )}
                        </div>

                        <AnimatePresence>
                          {isExpanded && cat.sub_categories.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 pl-4 border-l-2 border-zinc-100 py-1 space-y-1">
                                {cat.sub_categories.map((sub: any) => {
                                  const isActiveSub = activeFilter.type === 'SUB_CATEGORY' && activeFilter.value === sub.id;
                                  return (
                                    <button
                                      key={sub.id}
                                      onClick={() => handleSubCategoryClick(cat.name, sub.id, sub.name)}
                                      className={`w-full text-left text-xs py-2 px-2 rounded-md transition-colors font-medium flex items-center justify-between ${isActiveSub ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}
                                    >
                                      {sub.name}
                                      {isActiveSub && <ChevronRight size={12}/>}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN GRID */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="text-zinc-500 font-medium text-sm">
                Showing <strong className="text-black">{products.length}</strong> results
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[350px] bg-zinc-100 animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : products.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200">
                  <h3 className="text-xl font-bold text-zinc-400">No products found for {activeFilter.name}</h3>
                  <button onClick={resetFilter} className="mt-4 text-sm text-blue-600 font-bold underline">Clear Filters</button>
               </div>
            ) : (
              <motion.div 
                variants={containerVars}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence mode='wait'>
                  {products.map((product) => (
                    <motion.div 
                      layout
                      variants={itemVars}
                      key={product.id}
                      className="group bg-white rounded-[1.5rem] border border-zinc-200 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300 flex flex-col"
                    >
                       <Link to={`/product/${product.slug}`} className="flex flex-col h-full">
                          <div className="relative aspect-[1.1/1] bg-[#f2f2f2] flex items-center justify-center p-6">
                            {product.images && product.images[0] ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                loading="lazy"
                                className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out"
                              />
                            ) : (
                              <div className="text-zinc-300 font-bold">No Image</div>
                            )}
                          </div>

                          <div className="p-5 flex flex-col flex-grow bg-white relative z-10">
                            <span className="inline-block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">
                              {product.category}
                            </span>
                            <h3 className="text-lg font-bold text-zinc-900 leading-tight group-hover:text-yellow-600 transition-colors line-clamp-2 mb-4">
                              {product.name}
                            </h3>
                            
                            <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4">
                              <span className="text-xs font-medium text-green-600 flex items-center gap-1.5">
                                <ShoppingBag size={12} fill="currentColor" /> In Stock
                              </span>
                              <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <ArrowRight size={14} />
                              </div>
                            </div>
                          </div>
                       </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;