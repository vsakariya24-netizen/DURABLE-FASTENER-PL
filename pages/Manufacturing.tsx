import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, ShieldCheck, Truck, Package, Factory } from 'lucide-react';

const Manufacturing: React.FC = () => {
  return (
    // FIX: Added pt-24 to prevent the fixed Navbar from covering the content
    <div className="bg-white min-h-screen pt-24 font-sans text-gray-800">
      
      {/* Hero Section */}
      <div className="bg-gray-50 border-b border-gray-200 py-20 text-center px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5"
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Manufacturing Excellence
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Combining advanced technology with strict quality control to deliver precision fasteners for global industries.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Facility Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
           <div className="lg:w-1/2 w-full">
             <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden relative group shadow-2xl border border-gray-800">
               {/* Placeholder Image Area */}
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a]">
                 <Factory size={64} className="text-gray-700 mb-4" />
                 <span className="text-gray-500 font-medium">Factory Image Placeholder</span>
               </div>
               
               {/* Overlay Info */}
               <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 pt-12 text-white">
                 <p className="font-bold text-lg flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    7000 Sq. Ft. Integrated Facility
                 </p>
               </div>
             </div>
           </div>
           
           <div className="lg:w-1/2">
             <div className="inline-block bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-full text-xs font-bold mb-4 tracking-wider">
               INFRASTRUCTURE
             </div>
             <h2 className="text-3xl font-bold text-gray-900 mb-6">State-of-the-Art Production</h2>
             

[Image of industrial cold heading machine operation diagram]

             <p className="text-gray-600 mb-4 leading-relaxed">
               Durable Fastener Pvt. Ltd. has expanded its operational footprint to a massive <strong>7000 square foot facility</strong> located in Rajkot, Gujarat. This expansion allows us to maintain high inventory levels and streamline our supply chain.
             </p>
             <p className="text-gray-600 mb-8 leading-relaxed">
               Our facility is equipped to handle bulk requirements for OEM (Original Equipment Manufacturer) partners, ensuring consistency in specification and finish across large batches.
             </p>

             <div className="grid grid-cols-2 gap-4">
               <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl">
                 <h4 className="text-2xl font-bold text-gray-900">350+</h4>
                 <p className="text-sm font-medium text-gray-500 mt-1">Suppliers Network</p>
               </div>
               <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl">
                 <h4 className="text-2xl font-bold text-gray-900">Pan-India</h4>
                 <p className="text-sm font-medium text-gray-500 mt-1">Logistics Reach</p>
               </div>
             </div>
           </div>
        </div>

        {/* Quality Process */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Quality Assurance</h2>
            <p className="text-gray-500 mt-3 text-lg">Strict adherence to international standards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl hover:border-green-200 transition-all duration-300 bg-white group">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Material Testing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We use strictly graded materials (Mild Steel Grade-1022, SS304, SS316) to ensure tensile strength and corrosion resistance.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl hover:border-blue-200 transition-all duration-300 bg-white group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Settings size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Precision Engineering</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Advanced heading and threading machinery ensures accurate dimensions (Diameter, Length) with zero tolerance for errors.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl hover:border-yellow-200 transition-all duration-300 bg-white group">
              <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                <Package size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Inventory Control</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Robust inventory methods are applied to ensure stock availability for immediate dispatch and order fulfillment.
              </p>
            </div>
          </div>
        </div>

        {/* Packing Section */}
        {/* FIX: Used bg-[#1a1a1a] to match your header color instead of undefined bg-brand-dark */}
        <div className="bg-[#1a1a1a] text-white rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Premium Shipment Packing</h2>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                We ensure your products arrive in perfect condition with our multi-tier packing solutions: Plastic Box, Corrugated Box, and Carton Pack.
              </p>
              
              {/* FIX: Used standard yellow-400 instead of bg-brand-yellow */}
              <Link to="/contact" className="inline-flex items-center gap-2 bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold hover:bg-white transition-all transform hover:-translate-y-1">
                Partner With Us <Truck size={20} />
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              {/* Visual representation of packing types */}
              <div className="w-28 h-28 bg-white/10 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center p-4 border border-white/10 hover:bg-white/20 transition-colors">
                <Package size={32} className="text-yellow-400 mb-2"/>
                <span className="text-xs font-bold text-gray-300">Plastic Box</span>
              </div>
               <div className="w-28 h-28 bg-white/10 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center p-4 border border-white/10 hover:bg-white/20 transition-colors">
                <div className="text-yellow-400 font-bold text-2xl mb-1">5+</div>
                <span className="text-xs font-bold text-gray-300">Layers Corrugated</span>
              </div>
               <div className="w-28 h-28 bg-white/10 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center p-4 border border-white/10 hover:bg-white/20 transition-colors">
                <Truck size={32} className="text-yellow-400 mb-2"/>
                <span className="text-xs font-bold text-gray-300">Master Carton</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Manufacturing;