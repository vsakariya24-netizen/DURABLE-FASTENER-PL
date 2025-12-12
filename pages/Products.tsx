import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

import { Product } from '../types'; // Make sure this path is correct
import {
  Search, ChevronDown, ChevronRight, Filter,
  ArrowRight, X, CornerDownRight,
  LayoutGrid, SlidersHorizontal, Layers
} from 'lucide-react';

// --- TYPES FOR DYNAMIC TREE ---
type CategoryNode = {
  id: string;
  name: string;
  sub_categories: SubCategoryNode[];
};

type SubCategoryNode = {
  id: string;
  name: string;
  category_id: string;
  child_categories: ChildCategoryNode[];
};

type ChildCategoryNode = {
  id: string;
  name: string;
  sub_category_id: string;
};

const Products: React.FC = () => {
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [activeCategory, setActiveCategory] = useState('All'); 
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // --- 1. FETCH DATA & RESOLVE URL ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // A. Fetch Hierarchy Tables
        const { data: cats } = await supabase.from('categories').select('*').order('name');
        const { data: subs } = await supabase.from('sub_categories').select('*').order('name');
        const { data: childs } = await supabase.from('child_categories').select('*').order('name');
        const { data: productData } = await supabase.from('products').select('*');

        // B. Build Tree Structure
        let tree: CategoryNode[] = [];
        if (cats && subs) {
          tree = cats.map(cat => ({
            id: cat.id,
            name: cat.name,
            sub_categories: subs
              .filter(s => s.category_id === cat.id)
              .map(sub => ({
                id: sub.id,
                name: sub.name,
                category_id: sub.category_id,
                child_categories: childs ? childs.filter(c => c.sub_category_id === sub.id) : []
              }))
          }));
          setCategoryTree(tree);
        }

        if (productData) {
          setProducts(productData);
        }

        // C. Resolve URL Parameter to an ID
        const urlParam = searchParams.get('category');
        if (urlParam && urlParam !== 'All') {
          const paramLower = urlParam.toLowerCase();
          let foundId = '';
          let parentToExpand = '';

          // Search Level 1
          const mainMatch = tree.find(c => c.name.toLowerCase() === paramLower || c.id === urlParam);
          if (mainMatch) {
            foundId = mainMatch.id;
            parentToExpand = mainMatch.id;
          } else {
            // Search Level 2 & 3
            for (const cat of tree) {
              const subMatch = cat.sub_categories.find(s => s.name.toLowerCase() === paramLower || s.id === urlParam);
              if (subMatch) {
                foundId = subMatch.id;
                parentToExpand = cat.id;
                break;
              }
              for (const sub of cat.sub_categories) {
                const childMatch = sub.child_categories.find(c => c.name.toLowerCase() === paramLower || c.id === urlParam);
                if (childMatch) {
                  foundId = childMatch.id;
                  parentToExpand = cat.id; 
                  break;
                }
              }
              if (foundId) break;
            }
          }

          if (foundId) {
            setActiveCategory(foundId);
            setExpandedCats(prev => [...prev, parentToExpand]);
          }
        }

      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        // ✅ FIX: Timeout hata diya, ab fast load hoga
        setLoading(false);
      }
    };
    fetchData();
  }, []); 

  // --- 2. SYNC STATE TO URL ---
  useEffect(() => {
    if (activeCategory === 'All') {
      searchParams.delete('category');
    } else {
      let nameForUrl = activeCategory;
      const main = categoryTree.find(c => c.id === activeCategory);
      if (main) nameForUrl = main.name;
      else {
        for (const c of categoryTree) {
          const sub = c.sub_categories.find(s => s.id === activeCategory);
          if (sub) { nameForUrl = sub.name; break; }
          const child = c.sub_categories.flatMap(s => s.child_categories).find(ch => ch.id === activeCategory);
          if (child) { nameForUrl = child.name; break; }
        }
      }
      searchParams.set('category', nameForUrl.toLowerCase());
    }
    setSearchParams(searchParams);
    setCurrentPage(1);
  }, [activeCategory, categoryTree]); 

  const toggleCategory = (id: string) => {
    setExpandedCats(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // --- 3. FILTERING LOGIC ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      let categoryMatch = true;

      if (activeCategory !== 'All') {
        let foundLevel = 0; 
        let mainCategoryName = '';

        const mainCat = categoryTree.find(c => c.id === activeCategory);
        if (mainCat) {
           foundLevel = 1;
           mainCategoryName = mainCat.name;
        } else {
           for (const cat of categoryTree) {
             const sub = cat.sub_categories.find(s => s.id === activeCategory);
             if (sub) { foundLevel = 2; break; }
             const child = cat.sub_categories.flatMap(s => s.child_categories).find(c => c.id === activeCategory);
             if (child) { foundLevel = 3; break; }
           }
        }

        if (foundLevel === 1) {
           // Ensure your DB column logic matches (Name vs ID)
           categoryMatch = p.category?.toLowerCase() === mainCategoryName.toLowerCase();
        } else if (foundLevel === 2) {
           categoryMatch = p.sub_category === activeCategory;
        } else if (foundLevel === 3) {
           categoryMatch = p.child_category === activeCategory;
        } else {
           // Fallback
           categoryMatch = p.category === activeCategory || p.sub_category === activeCategory;
        }
      }

      const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [products, activeCategory, searchTerm, categoryTree]);

  // Pagination Slice
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  

  // --- MAIN RENDER ---
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 pt-24">
      
      {/* HEADER */}
      <div className="bg-[#1a1a1a] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Our Products
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6 text-lg">
            Browse our complete catalogue of fasteners and fittings.
          </p>
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 text-sm font-medium">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2 text-gray-600" />
            <button onClick={() => setActiveCategory('All')} className="text-gray-400 hover:text-white transition-colors">
              Categories
            </button>
            <ChevronRight size={14} className="mx-2 text-gray-600" />
            <span className="text-yellow-400">
              {activeCategory === 'All' ? 'All Products' : 'Selection'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* ================= SIDEBAR ================= */}
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <div className="sticky top-32 space-y-6">
              
              {/* Search */}
              <div className="relative group">
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-transparent shadow-sm rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:shadow-md group-hover:border-gray-200"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-3.5 text-gray-400 transition-colors group-hover:text-yellow-500" size={20} />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3.5 text-gray-400 hover:text-red-500 transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Dynamic Filter Tree */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-white">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-yellow-500" /> Filters
                  </h3>
                  {activeCategory !== 'All' && (
                    <button onClick={() => setActiveCategory('All')} className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-wide transition-colors">Clear</button>
                  )}
                </div>

                <div className="p-2 space-y-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <button
                    onClick={() => setActiveCategory('All')}
                    className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-3
                    ${activeCategory === 'All' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <LayoutGrid size={16} /> View All
                  </button>

                   {categoryTree.map((cat) => (
                    <div key={cat.id} className="pt-2">
                      <div className="px-1 mb-1">
                          <button
                            className={`flex items-center justify-between w-full p-2 text-xs font-bold uppercase tracking-widest transition-colors rounded-lg
                            ${activeCategory === cat.id ? 'bg-yellow-50 text-yellow-700' : 'text-gray-400 hover:text-gray-900'}`}
                            onClick={() => {
                                toggleCategory(cat.id);
                                setActiveCategory(cat.id);
                            }}
                          >
                            {cat.name}
                            <ChevronDown size={14} className={`transform transition-transform duration-300 ${expandedCats.includes(cat.id) ? 'rotate-180 text-yellow-500' : ''}`} />
                          </button>
                      </div>

                      <div className={`space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${expandedCats.includes(cat.id) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                           {cat.sub_categories.map((sub) => {
                             const isActiveSub = activeCategory === sub.id;
                             const isChildActive = sub.child_categories.some(c => c.id === activeCategory);
                             const showChildren = isActiveSub || isChildActive; 

                             return (
                               <div key={sub.id} className="pl-2">
                                 <button
                                   onClick={() => setActiveCategory(sub.id)}
                                   className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center justify-between group
                                     ${isActiveSub
                                       ? 'bg-gray-100 text-gray-900 font-bold border-l-4 border-yellow-400'
                                       : 'text-gray-600 border-l-4 border-transparent hover:bg-gray-50'}`}
                                 >
                                    <span className="flex-1 truncate">{sub.name}</span>
                                    {sub.child_categories.length > 0 && (
                                       <ChevronRight size={12} className={`text-gray-300 transition-transform ${showChildren ? 'rotate-90' : ''}`} />
                                    )}
                                 </button>

                                 {sub.child_categories.length > 0 && (
                                     <div className={`ml-4 pl-3 border-l border-gray-200 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${showChildren ? 'max-h-60 opacity-100 py-1' : 'max-h-0 opacity-0'}`}>
                                        {sub.child_categories.map(child => (
                                            <button
                                                key={child.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveCategory(child.id);
                                                }}
                                                className={`w-full text-left px-3 py-1.5 text-xs rounded transition-colors flex items-center gap-2
                                                ${activeCategory === child.id
                                                    ? 'text-yellow-600 font-bold bg-yellow-50/50'
                                                    : 'text-gray-500 hover:text-gray-900'}`}
                                            >
                                                <CornerDownRight size={10} className={activeCategory === child.id ? 'text-yellow-500' : 'opacity-30'} />
                                                {child.name}
                                            </button>
                                        ))}
                                     </div>
                                 )}
                               </div>
                             );
                           })}
                           {cat.sub_categories.length === 0 && <p className="text-[10px] text-gray-300 pl-4 py-2">No items here</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ================= PRODUCT GRID ================= */}
          <div className="flex-1">
             <div className="flex flex-col sm:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-4">
               <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {activeCategory === 'All' ? 'Complete Catalogue' : 'Filtered Selection'}
                  </h2>
                  <p className="text-gray-500 mt-1 text-sm">Quality hardware for professionals.</p>
               </div>
               <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {filteredProducts.length} Items Found
               </span>
            </div>

            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl hover:border-yellow-400/50 transition-all duration-500"
                  >
                      <div className="absolute top-4 left-4 z-10">
                         <span className="px-2.5 py-1 rounded-md bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            {product.category}
                        </span>
                      </div>
                      <div className="relative w-full aspect-square bg-white p-4 flex items-center justify-center overflow-hidden">
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-50 to-white opacity-50"></div>
                         {product.images?.[0] ? (
                           <img
                             src={product.images[0]}
                             alt={product.name}
                             // Added loading="lazy" for better performance
                             loading="lazy" 
                             className="relative z-10 w-full h-full object-contain drop-shadow-lg transform transition-transform duration-700 ease-out group-hover:scale-110"
                           />
                         ) : (
                           <div className="text-gray-300 text-xs">No Image</div>
                         )}
                         <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                            <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-yellow-300 transition-colors">
                              View Details <ArrowRight size={16} />
                            </button>
                         </div>
                      </div>
                      <div className="p-6 pt-4 flex-grow flex flex-col border-t border-gray-50">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-yellow-600 transition-colors">
                          {product.name}
                        </h3>
                        {product.child_category && (
                           <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                               <CornerDownRight size={12}/> Specific Type
                           </p>
                        )}
                        <div className="mt-auto pt-3 flex items-center justify-between text-xs font-medium text-gray-400 border-t border-gray-100 border-dashed">
                           <span>In Stock</span>
                           <span className="text-green-500 flex items-center gap-1"><Layers size={12}/> Available</span>
                        </div>
                      </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                   <Filter size={40} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                 <p className="text-gray-500 mb-8 max-w-md mx-auto">Try selecting a different category or clear filters.</p>
                 <button onClick={() => { setActiveCategory('All'); setSearchTerm(''); }} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all">
                   Clear All Filters
                 </button>
              </div>
            )}
            
            {/* ✅ FIX: Improved Pagination Logic */}
            {filteredProducts.length > itemsPerPage && (
               <div className="mt-12 flex justify-center gap-2">
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(c => c-1)} 
                    className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="rotate-90" size={20}/>
                  </button>
                  
                  <span className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold">{currentPage}</span>
                  
                  <button 
                    // Yahan check kar rahe hain ki kya agla page exist karta hai
                    disabled={currentPage * itemsPerPage >= filteredProducts.length} 
                    onClick={() => setCurrentPage(c => c+1)} 
                    className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="-rotate-90" size={20}/>
                  </button>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;