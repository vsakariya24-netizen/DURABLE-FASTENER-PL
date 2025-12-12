import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
// 👇 1. Supabase Import
import { supabase } from '../lib/supabase';
import { 
  Heart, Zap, Users, BookOpen, TrendingUp, Smile, 
  Award, Globe, Coffee, ArrowRight, Star, ShieldCheck, 
  CheckCircle, Target, Sparkles, Rocket
} from 'lucide-react';

// --- Animation Variants (Same as before) ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.1 } }
};

// --- Reusable Components (Same as before) ---
const SectionHeader = ({ title, subtitle, align = "center", light = false }: { title: React.ReactNode, subtitle?: string, align?: "center" | "left", light?: boolean }) => (
  <motion.div 
    initial="hidden" 
    whileInView="visible" 
    viewport={{ once: true, margin: "-100px" }} 
    variants={fadeInUp} 
    className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}
  >
    <h2 className={`text-4xl md:text-6xl font-black mb-6 tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
      {title}
    </h2>
    <div className={`h-1.5 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 ${align === "center" ? "mx-auto" : ""}`}></div>
    {subtitle && (
      <p className={`text-xl max-w-3xl mx-auto font-medium leading-relaxed ${light ? "text-slate-300" : "text-slate-600"}`}>
        {subtitle}
      </p>
    )}
  </motion.div>
);

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    variants={fadeInUp}
    whileHover={{ y: -5 }}
    className={`bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 ${className}`}
  >
    {children}
  </motion.div>
);

// --- Main Component ---

const LifeAtDurable: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });

  // 👇 2. State for Gallery
  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  // 👇 3. Fetch Gallery Data
  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase
        .from('life_gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setGalleryItems(data);
      } else {
        // Fallback agar database empty ho
        setGalleryItems([
           { title: "Diwali Bash", image_url: "https://images.unsplash.com/photo-1514525253440-b393452e2729?w=800", tag: "Festival" },
           { title: "Goa Retreat", image_url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800", tag: "Trip" },
           { title: "Box Cricket", image_url: "https://images.unsplash.com/photo-1593341646782-e0b495cffd32?w=800", tag: "Sports" }
        ]);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div ref={targetRef} className="bg-slate-50 min-h-screen font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">

      {/* Hero Section - Same */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-black"></div>
        <div className="absolute top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="inline-block py-2 px-6 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 font-bold tracking-widest uppercase text-sm mb-8">
              Where People Grow
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-black leading-tight mb-6">
              Life At Durable <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Where People Come First.
              </span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-2xl text-slate-300 max-w-4xl mx-auto mb-10 font-light">
              Where careers take flight. Where the future works. You don’t just work — you evolve.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4">
               <button className="bg-white text-slate-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-cyan-50 transition-colors">Join The Future</button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Culture - Same */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <SectionHeader 
          title="Culture. Not Policy." 
          subtitle="This is who we are. We believe in high trust, high ownership, and humanity over hierarchy."
        />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={fadeInUp} className="md:col-span-2 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 flex flex-col justify-between relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700"><Heart size={240} fill="currentColor" /></div>
             <div><h3 className="text-3xl font-bold mb-4">People-First Mindset</h3><p className="text-blue-100 text-lg max-w-md">We value mental wellness and genuine connections over metrics. You are a person here, not a resource.</p></div>
          </motion.div>
          <GlassCard className="bg-slate-100/50">
             <ShieldCheck className="text-green-500 mb-4" size={40} />
             <h3 className="text-xl font-bold mb-2">High Trust</h3>
             <p className="text-slate-600 text-sm">We don't micromanage. We give you the keys and let you drive.</p>
          </GlassCard>
          <GlassCard className="bg-slate-100/50">
             <Users className="text-purple-500 mb-4" size={40} />
             <h3 className="text-xl font-bold mb-2">Zero Politics</h3>
             <p className="text-slate-600 text-sm">No ego. No toxicity. Just a team that feels like family.</p>
          </GlassCard>
          <motion.div variants={fadeInUp} className="md:col-span-2 rounded-[2.5rem] bg-slate-900 text-white p-10 flex items-center justify-between relative overflow-hidden">
             <div className="relative z-10"><h3 className="text-2xl font-bold mb-2">Transparent Leadership</h3><p className="text-slate-400">Open doors. Open conversations. Learning over blaming.</p></div>
             <div className="hidden md:block bg-white/10 p-4 rounded-full"><Sparkles className="text-yellow-400" /></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Durable Way - Same */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 leading-tight mb-8">
              IDEAS OVER <span className="text-blue-600">TITLES.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              {[
                { title: "Micromanage Less", desc: "We push people to rise, not to fit in." },
                { title: "Listen More", desc: "We encourage young minds and fresh thoughts." },
                { title: "Bold Experiments", desc: "If it makes sense, ship it. Your creativity shapes our future." }
              ].map((item, i) => (
                <div key={i} className="border-l-4 border-slate-900 pl-6">
                   <h4 className="text-2xl font-bold mb-2">{item.title}</h4>
                   <p className="text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* =================================================================
          4. STAFF ACTIVITIES (DYNAMIC GALLERY)
      ================================================================= */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
           <SectionHeader title="Work Hard. Celebrate Harder." subtitle="Great teams grow through great memories. Every celebration becomes a story." align="left" />
        </div>
        
        {/* 👇 4. Use galleryItems State here */}
        <div className="flex gap-6 overflow-x-auto pb-12 px-6 snap-x hide-scrollbar max-w-[100vw]">
          {galleryItems.map((item, i) => (
             <motion.div 
               key={item.id || i} // Use ID from DB
               whileHover={{ scale: 0.98 }}
               className="min-w-[300px] md:min-w-[400px] h-[500px] rounded-[2rem] relative overflow-hidden group snap-center shadow-lg"
             >
                {/* Use image_url from DB */}
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                   <span className="text-xs font-bold bg-white/20 backdrop-blur px-3 py-1 rounded-full uppercase mb-2 inline-block">
                     {item.tag}
                   </span>
                   <h3 className="text-3xl font-bold">{item.title}</h3>
                </div>
             </motion.div>
          ))}
        </div>
      </section>

      {/* Rest of the sections (Academy, Spotlight, etc.) remain static as per request for now */}
      <section className="py-24 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="md:w-1/2">
                 <div className="flex items-center gap-2 text-yellow-400 font-bold tracking-widest uppercase mb-4">
                    <BookOpen size={20}/> Durable Learning Academy
                 </div>
                 <h2 className="text-5xl font-black mb-6">Today's Skills Create <br /><span className="text-indigo-400">Tomorrow's Leaders.</span></h2>
                 <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                   Stagnation is the enemy. Here, you don't just do your job — you upgrade yourself. We map the path from Junior to Leader.
                 </p>
                 <ul className="space-y-4">
                    {["Skill Stacking Sessions", "Leadership Training", "Career Roadmap Planning", "Mentorship by Seniors"].map((item, i) => (
                       <li key={i} className="flex items-center gap-3 text-lg">
                          <CheckCircle className="text-green-400" size={20} /> {item}
                       </li>
                    ))}
                 </ul>
              </div>
              <div className="md:w-1/2">
                 <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-1 rounded-3xl rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="bg-slate-900 rounded-[1.3rem] p-8">
                       <h3 className="text-2xl font-bold mb-6">Course Offerings</h3>
                       <div className="space-y-4">
                          {[1,2,3].map((_, i) => (
                            <div key={i} className="bg-white/5 p-4 rounded-xl flex items-center gap-4">
                               <div className="bg-indigo-500/20 p-3 rounded-full text-indigo-400"><Target size={20}/></div>
                               <div>
                                  <div className="font-bold">Module {i+1}: Advanced Strategy</div>
                                  <div className="text-xs text-slate-500">Duration: 4 Weeks • Certification Incl.</div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* How We Care */}
      <section className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-6">
            <SectionHeader title="Your Growth. Our Priority." subtitle="We place humans above everything else. We build individuals who become future leaders." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-3xl font-bold mb-8 flex items-center gap-3"><Heart className="text-red-500"/> How We Care</h3>
                  <div className="grid grid-cols-1 gap-6">
                     {["Professional Growth & Skill Building", "Emotional Well-being Support", "Healthy Work Culture", "Clear Career Roadmaps"].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                           <div className="w-2 h-2 rounded-full bg-slate-900"></div><span className="font-medium text-lg text-slate-700">{item}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-xl">
                  <h3 className="text-3xl font-bold mb-8 flex items-center gap-3"><Smile className="text-yellow-400"/> The Vibe Check</h3>
                  <div className="space-y-6">
                     <div className="flex gap-4"><CheckCircle className="text-green-400 shrink-0 mt-1" /><div><h4 className="font-bold text-lg">Respect is Default</h4><p className="text-slate-400 text-sm">No shouting. No blaming. Discipline with kindness.</p></div></div>
                     <div className="flex gap-4"><CheckCircle className="text-green-400 shrink-0 mt-1" /><div><h4 className="font-bold text-lg">Zero Politics Policy</h4><p className="text-slate-400 text-sm">We don't tolerate toxicity. Mutual trust at every level.</p></div></div>
                     <div className="flex gap-4"><CheckCircle className="text-green-400 shrink-0 mt-1" /><div><h4 className="font-bold text-lg">Calm & Professional</h4><p className="text-slate-400 text-sm">A supportive environment where you can focus.</p></div></div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Spotlight */}
      <section className="py-24 px-6 bg-white relative">
         <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black mb-12 text-center">Real Stories. Real Growth.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[{ name: "Rahul M.", role: "Production Lead", quote: "I joined as a trainee. In 3 years, I'm leading a team of 40. Durable saw potential in me I didn't see in myself." }, { name: "Sneha P.", role: "Sales Executive", quote: "The culture here is different. You aren't just an employee number. My ideas actually get implemented." }].map((story, i) => (
                  <motion.div key={i} whileHover={{ y: -5 }} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative">
                     <div className="text-6xl text-blue-200 font-serif absolute top-4 right-6">"</div>
                     <p className="text-xl text-slate-700 font-medium mb-6 relative z-10 leading-relaxed">{story.quote}</p>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
                        <div><div className="font-bold text-slate-900">{story.name}</div><div className="text-sm text-slate-500">{story.role}</div></div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Gen Z */}
      <section className="py-24 bg-black text-white px-6 overflow-hidden">
         <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl md:text-8xl font-black mb-12">BUILT FOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500">GEN-Z</span></h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">We understand this generation. We give respect, we build growth, and we offer purpose.</p>
            <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
               {["🚀 Fast Promotion Cycles", "💻 Digital First", "🌎 Remote Friendly", "🎨 Creative Freedom", "🧠 Mental Health Leaves", "⏰ Flexible Hours", "🔥 Purpose Driven", "✅ Respect", "📈 Limitless Growth"].map((tag, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.1, rotate: Math.random() * 6 - 3 }} className="px-6 py-3 rounded-full border border-white/20 text-lg font-bold bg-white/5 hover:bg-lime-400 hover:text-black hover:border-lime-400 transition-all cursor-default select-none">
                     {tag}
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Final Closing */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="container mx-auto px-6 text-center relative z-10">
           <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter">
             WE DON'T JUST BUILD SCREWS. <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">WE BUILD PEOPLE.</span>
           </h2>
           <p className="text-2xl text-slate-500 mb-12">
             We build leaders. We build futures. <br/> And we want YOU to be a part of this journey.
           </p>
           <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-slate-900 text-white px-12 py-6 rounded-full text-xl font-bold hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 flex items-center gap-3 mx-auto">
             Apply Now <Rocket />
           </motion.button>
        </div>
      </section>

    </div>
  );
};

export default LifeAtDurable;