import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // CHANGED: Added useParams, useNavigate
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { 
  Search, ChevronDown, ChevronRight, 
  ArrowRight, LayoutGrid, ShoppingBag, Sparkles
} from 'lucide-react';

// --- SCHEMA GENERATOR ---
const generateSchema = (categoryName: string, products: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryName} - Industrial Fasteners Catalogue`,
    "description": `Browse our premium collection of ${categoryName}.`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 10).map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://durablefastener.com/product/${p.slug}`,
        "name": p.name
      }))
    }
  };
};

const Products: React.FC = () => {
  // CHANGED: Use params instead of searchParams
  const { category: urlCategory, subcategory: urlSubCategory } = useParams();
  const navigate = useNavigate();
  
  const [activeFilter, setActiveFilter] = useState<{ type: string; value: string; name: string }>({ 
    type: 'ALL', 
    value: '', 
    name: 'All Products' 
  });

  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // 1. FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, subs, prods] = await Promise.all([
          supabase.from('categories').select('*').order('name'),
          supabase.from('sub_categories').select('*').order('name'),
          supabase.from('products').select('*').order('name')
        ]);

        // Build Tree
        const tree = cats.data?.map(cat => ({
          ...cat,
          sub_categories: subs.data?.filter(s => s.category_id === cat.id) || []
        })) || [];

        setCategoryTree(tree);
        if (prods.data) setProducts(prods.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. SYNC URL WITH FILTER STATE (New Logic)
  useEffect(() => {
    if (!categoryTree.length) return; // Wait for data to load

    if (urlCategory) {
      // Find the Category Object (Case Insensitive Match)
      const matchedCat = categoryTree.find(c => 
        c.name.toLowerCase() === urlCategory.toLowerCase()
      );

      if (matchedCat) {
        // If there is also a Subcategory in URL
        if (urlSubCategory) {
          const matchedSub = matchedCat.sub_categories.find((s: any) => 
            s.name.toLowerCase() === urlSubCategory.toLowerCase()
          );

          if (matchedSub) {
            setActiveFilter({ type: 'SUB_CATEGORY', value: matchedSub.id, name: matchedSub.name });
            // Auto expand the parent category
            setExpandedCats(prev => prev.includes(matchedCat.id) ? prev : [...prev, matchedCat.id]);
          }
        } else {
          // Only Main Category
          setActiveFilter({ type: 'CATEGORY', value: matchedCat.name, name: matchedCat.name });
        }
      }
    } else {
      // No URL params = All Products
      setActiveFilter({ type: 'ALL', value: '', name: 'All Products' });
    }
  }, [urlCategory, urlSubCategory, categoryTree]);

  // 3. TOGGLE ACCORDION
  const toggleCategory = (catId: string) => {
    setExpandedCats(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  // 4. FILTER LOGIC
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search Filter
      const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!searchMatch) return false;

      // Category Filter
      if (activeFilter.type === 'ALL') return true;

      if (activeFilter.type === 'CATEGORY') {
        return p.category === activeFilter.value; 
      }

      if (activeFilter.type === 'SUB_CATEGORY') {
        return p.sub_category === activeFilter.value; 
      }

      return true;
    });
  }, [products, activeFilter, searchTerm]);

  // 5. HANDLE CLICKS (Updated to use Navigate)
  const handleMainCategoryClick = (catName: string) => {
    // Navigate to clean URL
    navigate(`/products/${catName.toLowerCase()}`);
  };

  const handleSubCategoryClick = (catName: string, subName: string) => {
    // Navigate to clean URL (Requires passing parent cat name to this function)
    navigate(`/products/${catName.toLowerCase()}/${subName.toLowerCase()}`);
  };

  const resetFilter = () => {
    navigate('/products');
  };

  return (
    <div className="bg-[#dbdbdc] min-h-screen pt-20">
      <Helmet>
        <title>{`${activeFilter.name} | Durable Fasteners Pvt Ltd`}</title>
        <link rel="canonical" href={`https://durablefastener.com/products/${urlCategory || ''}`} />
        <script type="application/ld+json">
          {JSON.stringify(generateSchema(activeFilter.name, filteredProducts))}
        </script>
      </Helmet>

      {/* HERO SECTION */}
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
                  placeholder="Search Catalogue..."
                  className="w-full bg-white border-2 border-zinc-100 rounded-xl px-10 py-3 text-sm focus:border-yellow-400 focus:ring-0 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              </div>

              {/* Category Tree */}
              <div className="bg-white rounded-2xl p-5 shadow-lg shadow-zinc-200/50 border border-zinc-100">
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
                        {/* Main Category Row */}
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

                        {/* Sub Categories Accordion */}
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
                                      // CHANGED: We now pass Parent Name too for URL construction
                                      onClick={() => handleSubCategoryClick(cat.name, sub.name)}
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

          {/* MAIN CONTENT */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="text-zinc-500 font-medium text-sm">
                Showing <strong className="text-black">{filteredProducts.length}</strong> results
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[350px] bg-zinc-100 animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200">
                  <h3 className="text-xl font-bold text-zinc-400">No products found</h3>
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
                  {filteredProducts.map((product) => (
                    <motion.div 
                      layout
                      variants={itemVars}
                      key={product.id}
                      className="group bg-white rounded-[1.5rem] border border-zinc-200 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300 flex flex-col"
                    >
                       <Link to={`/product/${product.slug}`} className="flex flex-col h-full">
            
            {/* Image Area */}
            <div className="relative aspect-[1.1/1] bg-[#f2f2f2] flex items-center justify-center p-6">
              {product.images && product.images[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              ) : (
                 <div className="text-zinc-300 font-bold">No Image</div>
              )}
              
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                 <span className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                   View Details
                 </span>
              </div>
            </div>

            {/* Text Area */}
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