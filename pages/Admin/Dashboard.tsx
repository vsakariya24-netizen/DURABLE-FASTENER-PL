import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, MessageSquare, TrendingUp, FileText, Layers } from 'lucide-react'; // Added Layers icon
import { Link } from 'react-router-dom';

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState({ products: 0, enquiries: 0, blogs: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: enquiryCount } = await supabase.from('enquiries').select('*', { count: 'exact', head: true });
      const { count: blogCount } = await supabase.from('blogs').select('*', { count: 'exact', head: true });

      setStats({ 
        products: productCount || 0, 
        enquiries: enquiryCount || 0,
        blogs: blogCount || 0 
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back to your control panel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
             <Package size={32} />
           </div>
           <div>
             <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Products</div>
             <div className="text-3xl font-bold text-gray-900">{stats.products}</div>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
             <MessageSquare size={32} />
           </div>
           <div>
             <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">New Enquiries</div>
             <div className="text-3xl font-bold text-gray-900">{stats.enquiries}</div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
             <FileText size={32} />
           </div>
           <div>
             <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Articles</div>
             <div className="text-3xl font-bold text-gray-900">{stats.blogs}</div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="w-16 h-16 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
             <TrendingUp size={32} />
           </div>
           <div>
             <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">System Status</div>
             <div className="text-xl font-bold text-gray-900 text-green-600">Active</div>
           </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
         <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
         <div className="flex flex-wrap gap-4">
            <Link to="/admin/products/new" className="px-6 py-3 bg-zinc-900 text-white rounded-lg font-bold hover:bg-black transition-colors">
              + Add New Product
            </Link>
            
            <Link to="/admin/add-blog" className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2">
              <FileText size={18} /> Write New Article
            </Link>

            {/* NEW BUTTON: Manage Categories */}
            <Link to="/admin/categories" className="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 border border-blue-200">
              <Layers size={18} /> Manage Categories
            </Link>

            <Link to="/admin/products" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors">
              Manage Catalogue
            </Link>
         </div>
      </div>
    </div>
  );
};

export default DashboardHome;