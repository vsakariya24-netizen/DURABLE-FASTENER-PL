import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Factory, Anvil, Flame, Layers, Microscope, Truck, 
  ShieldCheck, CheckCircle2, Package, Settings, 
  Activity, ArrowRight, FileCheck, Scale, Play, Video
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
// --- REUSABLE ANIMATION COMPONENT ---
const RevealOnScroll: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ 
  children, 
  delay = 0, 
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const Manufacturing: React.FC = () => {
  return (
    // Base font size increased and color lightened for readability
    <div className="bg-[#0f172a] min-h-screen pt-20 font-sans text-slate-200 overflow-x-hidden selection:bg-blue-500 selection:text-white">
      <Helmet>
        {/* 1. Industrial & Factory Specific Title */}
        <title>Fastener Manufacturing Factory in R
         ajkot | Durable Fastener</title>
        
        <meta 
          name="description" 
          content="Inside Durable Fastener's Rajkot factory: Explore our Cold Forging, Thread Rolling, and Heat Treatment lines. 400T+ monthly capacity with ISO 9001:2015 QC lab." 
        />
        <meta name="geo.region" content="IN-GJ" />
<meta name="geo.placename" content="Rajkot, Gujarat, India" />
<meta name="ICBM" content="22.2587,70.7993" />
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />

        
        <meta 
          name="keywords" 
          content="fastener manufacturing process, screw factory rajkot, cold forging facility india, bolt manufacturing plant, heat treatment rajkot, thread rolling jobwork" 
        />

        {/* 2. 'HOW TO' SCHEMA (Process samjhane ke liye) */}
        <script type="application/ld+json">
          {`
            {
         "@context": "https://schema.org",
         "@type": "FAQPage",
          "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the production capacity of Durable Fastener Factory?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our Rajkot facility produces over 400T+ fasteners monthly with full QC lab support."
      }
    },
    {
      "@type": "Question",
      "name": "Does Durable Fastener supply across India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we supply industrial fasteners throughout India with OEM partnerships."
      }
    }
  ]
}
          `}
        </script>
        <script type="application/ld+json">
{`
{
  "@context": "https://schema.org",
  "@type": "ManufacturingBusiness",
  "name": "Durable Fastener Pvt Ltd",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Rajkot",
    "addressRegion": "Gujarat",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 22.2587,
    "longitude": 70.7993
  },
  "url": "https://durablefastener.com",
  "logo": "https://durablefastener.com/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/durable-fastener",
    "https://www.facebook.com/durablefastener"
  ]
},
"@type": "LocalBusiness",
"name": "Durable Fastener Pvt Ltd",
"image": "https://durablefastener.com/logo.png",
"address": {
  "@type": "PostalAddress",
  "streetAddress": "Your Street Address",
  "addressLocality": "Rajkot",
  "addressRegion": "Gujarat",
  "postalCode": "360001",
  "addressCountry": "IN"
},
"geo": {
  "@type": "GeoCoordinates",
  "latitude": 22.2587,
  "longitude": 70.7993
},
"url": "https://durablefastener.com",
"telephone": "+91-1234567890",
"openingHours": "Mo-Fr 08:00-18:00",
"sameAs": [
   "https://www.linkedin.com/company/durable-fastener",
   "https://www.facebook.com/durablefastener"
]

`}
</script>

        {/* 3. ITEM LIST SCHEMA (Machinery List ke liye) */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Factory Machinery Inventory",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Multi-Station Cold Headers (8 Units)"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "High-Speed Thread Rollers (18 Units)"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Optical Sorting Machines (3 Units)"
                }
              ]
            }
          `}
        </script>
      </Helmet>
      {/* ================= 1. HERO SECTION ================= */}
      <div className="relative py-32 md:py-48 border-b border-white/10 overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1565193566173-7a641a980755?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-[20s] group-hover:scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/95 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
           <div className="max-w-4xl">
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-bold mb-8 uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                   <Factory size={16} /> Rajkot Facility: 100% In-House Control
                </div>
              </RevealOnScroll>
              
              <RevealOnScroll delay={100}>
                {/* Heading Font Improved: Extrabold & Tighter Tracking */}
                <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight drop-shadow-lg">
                   IN-HOUSE <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-white">
                     MANUFACTURING
                   </span>
                </h1>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                {/* Paragraph Font Improved: Larger text, Relaxed Line Height */}
                <p className="text-xl md:text-2xl text-slate-300 mb-10 font-medium leading-relaxed border-l-4 border-blue-500 pl-8 max-w-2xl">
                   From raw wire to finished fastener – fully controlled under one roof. 
                   We are not traders; we are <span className="text-white font-bold underline decoration-blue-500 decoration-2 underline-offset-4">Precision Manufacturers.</span>
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={300}>
                <div className="flex flex-col sm:flex-row gap-5">
                   <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 hover:-translate-y-1">
                      Schedule Factory Visit <ArrowRight size={22} />
                   </button>
                   <button className="bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-xl font-bold text-lg transition-all border border-white/10 flex items-center justify-center gap-3 hover:-translate-y-1 backdrop-blur-sm">
                      <Play size={22} fill="white" /> Watch Facility Video
                   </button>
                </div>
              </RevealOnScroll>
           </div>
        </div>
      </div>

      {/* ================= 2. MANUFACTURING OVERVIEW ================= */}
      <section className="py-24 px-6 bg-[#0b1120]">
         <RevealOnScroll>
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">Built for Scale & Precision</h2>
                {/* Improved Readability: Lighter text, wider leading */}
                <p className="text-xl md:text-2xl text-slate-300 leading-9 font-light">
                   With over <span className="text-white font-semibold">15+ years of experience</span>, Durable Fasteners Pvt Ltd operates a high-capacity unit in Rajkot. 
                   Our facility is equipped with modern cold forging, thread rolling, heat treatment, and surface finishing systems to deliver <span className="text-blue-400 font-medium">high-volume, consistent OEM fasteners.</span>
                </p>
            </div>
         </RevealOnScroll>
      </section>

      {/* ================= 3. VIRTUAL FACTORY TOUR ================= */}
      <section className="py-24 bg-[#0f172a] border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <RevealOnScroll>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                   <div>
                      <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">Live Production Floor</h2>
                      <p className="text-lg text-slate-400">See our high-speed headers in action.</p>
                   </div>
                   <div className="flex items-center gap-3 text-red-500 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20 animate-pulse">
                      <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_red]"></div>
                      <span className="font-bold tracking-widest uppercase text-xs">Live Feed</span>
                   </div>
                </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-8">
               {[
                  { title: "Cold Heading Line", sub: "180 PPM Speed", label: "CAM 01: HEADING", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" },
                  { title: "Thread Rolling", sub: "Precision Dies", label: "CAM 02: ROLLING", img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop" },
                  { title: "Optical Sorting", sub: "Zero Defect Check", label: "CAM 03: QC LAB", img: "https://plus.unsplash.com/premium_photo-1661962692059-55d5a4319814?q=80&w=2070&auto=format&fit=crop" }
               ].map((item, index) => (
                  <RevealOnScroll key={index} delay={index * 150} className="h-full">
                      <div className="group relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer h-full hover:border-blue-500/50 transition-colors">
                          <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(${item.img})` }}></div>
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                          
                          <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center pl-1 border border-white/20 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:scale-110 transition-all shadow-xl">
                                <Play fill="white" className="text-white" size={32} />
                             </div>
                          </div>
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] text-white font-mono border border-white/10">{item.label}</div>
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-12">
                             <p className="text-white font-bold text-xl">{item.title}</p>
                             <p className="text-sm text-blue-300 font-medium">{item.sub}</p>
                          </div>
                      </div>
                  </RevealOnScroll>
               ))}
            </div>
         </div>
      </section>

      {/* ================= 4. COMPLETE MANUFACTURING FLOW ================= */}
      <section className="py-24 bg-[#0b1120]">
         <div className="max-w-7xl mx-auto px-6">
            <RevealOnScroll>
                <div className="text-center mb-20">
                   <h2 className="text-blue-400 font-bold uppercase tracking-[0.2em] text-sm mb-3">The Process</h2>
                   <h3 className="text-4xl md:text-5xl font-black text-white">End-to-End Production Flow</h3>
                   

[Image of cold forging process flow chart]

                </div>
            </RevealOnScroll>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                  { id: "01", title: "Raw Material Inspection", icon: FileCheck },
                  { id: "02", title: "Wire Drawing & Annealing", icon: Activity },
                  { id: "03", title: "Cold Heading (Forging)", icon: Anvil },
                  { id: "04", title: "Thread Rolling", icon: Settings },
                  { id: "05", title: "Heat Treatment", icon: Flame },
                  { id: "06", title: "Surface Coating", icon: Layers },
                  { id: "07", title: "Optical Sorting", icon: Microscope },
                  { id: "08", title: "Packing & Dispatch", icon: Truck },
               ].map((step, i) => (
                  <RevealOnScroll key={i} delay={i * 100} className="h-full">
                      <div className="bg-[#1e293b]/50 border border-white/5 p-8 rounded-2xl relative group hover:bg-blue-600/20 hover:border-blue-500/40 transition-all h-full flex flex-col items-center text-center shadow-lg">
                         <span className="absolute top-4 right-4 text-4xl font-black text-white/5 group-hover:text-blue-500/20 transition-colors">{step.id}</span>
                         <div className="p-4 bg-blue-500/10 rounded-full text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                            <step.icon size={36} />
                         </div>
                         <h4 className="text-white font-bold text-lg leading-snug">{step.title}</h4>
                         {i !== 7 && <div className="hidden md:block absolute -right-3 top-1/2 w-6 h-6 bg-[#0b1120] rotate-45 border-t border-r border-white/10 z-10"></div>}
                      </div>
                  </RevealOnScroll>
               ))}
            </div>
         </div>
      </section>

      {/* ================= 5. MACHINERY & EQUIPMENT ================= */}
    

      {/* ================= 6. RAW MATERIAL ================= */}
      <section className="py-24 px-6 bg-[#0b1120]">
         <RevealOnScroll>
             <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-900/20 to-slate-900 rounded-[2.5rem] border border-blue-500/20 overflow-hidden shadow-2xl">
                <div className="grid md:grid-cols-2">
                   <div className="p-12 md:p-16">
                      <div className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold mb-6 tracking-wider">STEP 01: SOURCING</div>
                      <h2 className="text-4xl font-black text-white mb-6">Raw Material Integrity</h2>
                      <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                         Quality starts with the wire. We source exclusively from premium mills like <span className="text-white font-bold border-b-2 border-blue-500">JSW, TATA Steel</span>.
                      </p>
                      <ul className="space-y-4">
                         {[
                             "Grade Control: 10B21, 1541, EN8, SS304",
                             "Full Chemical Traceability (Heat No.)",
                             "Incoming Wire Testing Lab"
                         ].map((item, i) => (
                             <li key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                                 <CheckCircle2 className="text-green-500 shrink-0" size={24}/> {item}
                             </li>
                         ))}
                      </ul>
                   </div>
                   <div className="relative h-80 md:h-auto min-h-[400px]">
                       <img src="https://images.unsplash.com/photo-1535063404286-f3655131a48c?q=80&w=2069&auto=format&fit=crop" alt="Cold Heading Machine at Durable Fastener Factory Rajkot" className="absolute inset-0 w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 transition-all duration-700"/>
                       <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply"></div>
                   </div>
                </div>
             </div>
         </RevealOnScroll>
      </section>

      {/* ================= 7. HEAT TREATMENT & COATING ================= */}
      <section className="py-24 bg-[#0f172a]">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-12">
            
            <RevealOnScroll delay={0}>
                <div className="relative p-10 md:p-12 bg-slate-900 rounded-[2rem] border border-orange-500/30 overflow-hidden group h-full hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838686-37da4a9fd1b3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900/90 to-slate-900/60"></div>
                   
                   <div className="relative z-10">
                       <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 mb-8 border border-orange-500/20">
                           <Flame size={32} />
                       </div>
                       <h3 className="text-3xl font-bold text-white mb-4">Heat Treatment Facility</h3>
                       <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                        Heat treatment ensures uniform hardness and mechanical properties across every batch.
                       </p>
                       <ul className="space-y-3 text-slate-300 font-medium">
                          <li className="flex gap-3"><span className="text-orange-500">✔</span> Continuous Mesh Belt Furnaces</li>
                          <li className="flex gap-3"><span className="text-orange-500">✔</span> Matrial Range: 8.8, 10.9, 12.9 Grade</li>
                       </ul>
                   </div>
                </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
                <div className="relative p-10 md:p-12 bg-slate-900 rounded-[2rem] border border-cyan-500/30 overflow-hidden group h-full hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900/90 to-slate-900/60"></div>

                   <div className="relative z-10">
                       <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-500 mb-8 border border-cyan-500/20">
                           <Layers size={32} />
                       </div>
                       <h3 className="text-3xl font-bold text-white mb-4">Surface Coating & Finishing</h3>
                       <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                          Advanced plating lines delivering aesthetic finish and high corrosion resistance.
                       </p>
                       <ul className="space-y-3 text-slate-300 font-medium">
                          <li className="flex gap-3"><span className="text-cyan-500">✔</span> Trivalent Zinc Plating</li>
                          <li className="flex gap-3"><span className="text-cyan-500">✔</span> Black Phosphate & Oil</li>
                       </ul>
                   </div>
                </div>
            </RevealOnScroll>
         </div>
      </section>

      {/* ================= 8. QUALITY CONTROL & CAPACITY ================= */}
      <section className="py-24 px-6 bg-[#0b1120] border-t border-white/5">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
            
            {/* QC Section */}
            <div>
               <RevealOnScroll>
                   <h2 className="text-4xl font-black text-white mb-10">Quality Assurance Lab</h2>
               </RevealOnScroll>
               <div className="grid gap-6">
                   {[
                       { id: "1", title: "Incoming Check", desc: "Spectro analysis of raw wire rod." },
                       { id: "2", title: "In-Process QC", desc: "Hourly dimension checks by operators." },
                       { id: "3", title: "Final Lab Certification", desc: "Tensile, Torque, & SST before dispatch." }
                   ].map((qc, i) => (
                       <RevealOnScroll key={i} delay={i * 100}>
                           <div className="bg-slate-800 p-8 rounded-2xl border border-white/5 flex gap-6 hover:bg-slate-700/50 transition-colors">
                               <div className="h-14 w-14 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-black text-xl shrink-0 border border-blue-500/30">{qc.id}</div>
                               <div>
                                   <h4 className="text-white font-bold text-xl mb-2">{qc.title}</h4>
                                   <p className="text-slate-400 text-base leading-relaxed">{qc.desc}</p>
                               </div>
                           </div>
                       </RevealOnScroll>
                   ))}
               </div>
            </div>

            {/* Capacity Dashboard */}
            <div>
               <RevealOnScroll>
                   <h2 className="text-4xl font-black text-white mb-10">Production Capacity</h2>
               </RevealOnScroll>
               <div className="grid grid-cols-2 gap-6">
                  {[
                      { l: "Monthly Output", v: "50T+" },
                      { l: "Shift System", v: "24/7 Ops" },
                      { l: "Expansion", v: "Ready Infra" },
                      { l: "Lead Time", v: "Quick Turnaround" }
                  ].map((stat, i) => (
                      <RevealOnScroll key={i} delay={i * 100}>
                          <div className="p-8 bg-slate-800 rounded-2xl border border-white/5 h-full flex flex-col justify-center hover:border-blue-500/40 transition-all">
                             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">{stat.l}</p>
                             <p className="text-3xl md:text-4xl font-black text-white">{stat.v}</p>
                          </div>
                      </RevealOnScroll>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* ================= 9. USP, COMPLIANCE & CTA ================= */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0f172a] to-blue-900/20 text-center">
         <div className="max-w-5xl mx-auto">
            
            {/* Compliance Badges */}
            <RevealOnScroll>
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16 opacity-80">
                   
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-12">Why Durable Fasteners?</h2>
            </RevealOnScroll>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 text-left">
               {[
                  { t: "Fully In-House", d: "No outsourcing, full control." },
                  { t: "Consistent Quality", d: "Repeatable precision." },
                  { t: "On-Time Delivery", d: "Committed to schedules." },
                  { t: "OEM Focus", d: "Industrial supply chains." }
               ].map((usp, i) => (
                  <RevealOnScroll key={i} delay={i * 100}>
                      <div className="p-6 bg-slate-900/80 rounded-2xl border border-white/10 h-full hover:-translate-y-2 transition-transform duration-300">
                         <h4 className="text-white font-bold text-lg mb-2">{usp.t}</h4>
                         <p className="text-slate-400 text-sm font-medium">{usp.d}</p>
                      </div>
                  </RevealOnScroll>
               ))}
            </div>

            <RevealOnScroll delay={300}>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                   <Link to="/contact" className="bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold px-12 py-6 rounded-2xl shadow-2xl shadow-blue-600/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                      Start OEM Manufacturing <ArrowRight />
                   </Link>
                   <button className="bg-transparent border-2 border-white/10 hover:border-white/30 text-white text-xl font-bold px-12 py-6 rounded-2xl transition-all hover:-translate-y-1 hover:bg-white/5">
                      Request Capability Sheet
                   </button>
                </div>
            </RevealOnScroll>
            
         </div>
      </section>

    </div>
  );
};

export default Manufacturing;