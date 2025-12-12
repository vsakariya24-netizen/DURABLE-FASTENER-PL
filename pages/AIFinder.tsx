import React, { useState } from 'react';
import { getProductRecommendations, RecommendationResult } from '../services/geminiService';
import { PRODUCTS } from '../constants';
import * as ReactRouterDOM from 'react-router-dom';
import { Sparkles, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const { Link } = ReactRouterDOM;

const AIFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    const recs = await getProductRecommendations(query);
    setResults(recs);
    setLoading(false);
  };

  const suggestions = [
    "I need a screw for outdoor decking that won't rust.",
    "Fastener for joining two pieces of drywall.",
    "Strong magnetic latch for a heavy wardrobe door.",
    "Caster wheels for a hospital trolley."
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-brand-yellow/20 text-orange-600 rounded-full mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI Product Finder</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Describe your application, environment, or specific needs. Our AI will analyze the Durable Fastener catalogue to find the perfect match.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-10">
          <form onSubmit={handleSearch} className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., I need a self-tapping screw for an aluminum window frame that is corrosion resistant..."
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 text-lg focus:border-brand-blue focus:ring-0 resize-none min-h-[120px]"
            />
            <div className="mt-4 flex justify-between items-center">
               <div className="hidden md:flex gap-2">
                 {suggestions.slice(0, 2).map((s, i) => (
                   <button key={i} type="button" onClick={() => setQuery(s)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition-colors">
                     {s}
                   </button>
                 ))}
               </div>
               <button 
                type="submit" 
                disabled={loading || !query.trim()}
                className="bg-brand-dark text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                {loading ? 'Analyzing...' : 'Find Matches'}
              </button>
            </div>
          </form>
        </div>

        {searched && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''}/> 
              {loading ? 'AI is thinking...' : 'Recommended Products'}
            </h2>
            
            {!loading && results.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center text-yellow-800">
                No direct matches found. Try broadening your description.
              </div>
            )}

            <div className="grid gap-6">
              {results.map((res) => {
                const product = PRODUCTS.find(p => p.id === res.productId);
                if (!product) return null;

                return (
                  <div key={res.productId} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                         <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                           {res.matchScore}% Match
                         </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                      
                      <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg mb-4">
                        <p className="text-sm text-blue-900">
                          <strong>AI Rationale:</strong> {res.rationale}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 mt-auto">
                        <Link to={`/product/${product.slug}`} className="text-brand-blue font-semibold flex items-center hover:underline">
                          View Details <ArrowRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AIFinder;