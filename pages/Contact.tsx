import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, Loader2, 
  Globe, Clock, Briefcase, Building2 
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.from('enquiries').insert([formData]);

    setLoading(false);
    if (error) {
      setError('Something went wrong. Please try again.');
    } else {
      setSubmitted(true);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
    }
  };

  // --- Animation Variants ---
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardSlideUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" } }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* 👇 SEO, GEO & AEO OPTIMIZED HELMET 👇 */}
      <Helmet>
        {/* 1. Title optimized for high-intent searches */}
        <title>Contact Durable Fastener | Top Screw Manufacturer in Rajkot & Gujarat</title>
        
        {/* 2. Description with natural keyword placement for Voice Search (AEO) */}
        <meta 
          name="description" 
          content="Contact Durable Fastener Private Limited, a leading fastener factory and MS screw manufacturer in Rajkot. We are top high tensile fasteners manufacturers in Gujarat supplying across India. Call +91 87587 00709." 
        />
        
        {/* 3. TARGET KEYWORDS (Exact Match from your list) */}
        <meta 
          name="keywords" 
          content="durable fastener private limited, durable fastener, durable fastener private limited photos, durable enterprise, ms screw manufacturer in rajkot, fasteners manufacturers in rajkot, high tensile fasteners gujarat, durable fasteners, top screw manufacturers in gujarat, fastener manufacturer in rajkot, durable fasteners ltd, fastener factory, screw manufacturer in rajkot, fasteners manufacturers in gujarat, fastener manufacturing factory, fasteners manufacturers in india" 
        />

        {/* 4. LOCAL BUSINESS SCHEMA (GEO SEO) */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "mainEntity": {
                "@type": "LocalBusiness",
                "name": "Durable Fastener Private Limited",
                "alternateName": ["Durable Enterprise", "Durable Fasteners Ltd"],
                "image": "https://durablefastener.com/durablefastener.png",
                "telephone": "+918758700709",
                "email": "durablefastener@outlook.com",
                "url": "https://durablefastener.com/contact",
                "description": "Durable Fastener Private Limited is a premier fastener manufacturing factory in Rajkot. We are recognized as top screw manufacturers in Gujarat, producing high tensile fasteners and MS screws for industrial clients across India.",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Plot No.16, Survey No.660, Surbhi Ind Zone-D, Ravki",
                  "addressLocality": "Rajkot",
                  "addressRegion": "Gujarat",
                  "postalCode": "360004",
                  "addressCountry": "IN"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 22.2587,
                  "longitude": 70.7993
                },
                "areaServed": {
                  "@type": "Country",
                  "name": "India"
                },
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                  ],
                  "opens": "09:00",
                  "closes": "19:00"
                },
                "hasMap": "https://goo.gl/maps/YOUR_GOOGLE_MAPS_LINK_HERE" 
              }
            }
          `}
        </script>
      </Helmet>
      {/* 👆 END HELMET 👆 */}

      {/* --- Section 1: Immersive Hero Header --- */}
      <div className="relative bg-slate-900 text-white pb-32 pt-20 lg:pt-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-0 left-0 w-full h-full"
        >
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 L100 0 L100 100 Z" fill="white" />
            </svg>
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm"
          >
            <Globe size={14} className="animate-pulse" /> Global Distribution Network
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Let's Engineer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Excellence</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Whether you need a custom manufacturing quote or technical specifications, our engineering team in Rajkot is ready to assist.
          </motion.p>
        </div>
      </div>

      {/* --- Section 2: Floating Contact Interface --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20 pb-20">
        <motion.div 
            variants={cardSlideUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px]"
        >
          
          {/* LEFT SIDE: Contact Information */}
          <div className="lg:w-2/5 bg-slate-800 text-white p-10 md:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Texture */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Building2 size={300} />
            </div>

            <div>
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-2xl font-bold mb-2"
              >
                Contact Information
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-slate-400 mb-10 text-sm"
              >
                Fill up the form or reach out to us directly.
              </motion.p>

              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-8 relative z-10"
              >
                <InfoItem 
                    icon={<MapPin size={22} />} 
                    colorClass="bg-blue-500/10 text-blue-400 group-hover:bg-blue-500"
                    title="Factory & HQ"
                    content={<>Plot No.16, Survey No.660, <br/>Surbhi Ind Zone-D, Ravki, Rajkot-360004,<br/>Gujarat, India</>}
                />
                
                <InfoItem 
    icon={<Phone size={22} />} 
    colorClass="bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500"
    title="Call Us"
    content={
        <div className="flex flex-col gap-1">
            <a href="tel:+918758700704" className="hover:text-emerald-400 transition-colors">+91 87587 00704</a>
            <a href="tel:+918758700709" className="hover:text-emerald-400 transition-colors">+91 87587 00709</a>
        </div>
    }
    subContent="Mon-Sat, 9am - 7pm"
/>

{/* NEW: WhatsApp Integration */}
<InfoItem 
    icon={
        <svg size={22} viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.438h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
    } 
    colorClass="bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366]"
    title="WhatsApp"
    content={
        <a 
            href="https://wa.me/918758700709?text=Hello%20Durable%20Fastener,%20I%20have%20an%20inquiry." 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-bold text-lg hover:underline"
        >
            Chat with Sales
        </a>
    }
    subContent="Instant support via WhatsApp"
/>

                <InfoItem 
                    icon={<Mail size={22} />} 
                    colorClass="bg-amber-500/10 text-amber-400 group-hover:bg-amber-500"
                    title="Email Support"
                    content="durablefastener@outlook.com"
                />
              </motion.div>
            </div>

            {/* Bottom Mini Map Preview */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-12 p-4 bg-slate-700/50 rounded-2xl backdrop-blur-sm border border-slate-600/50"
            >
                <div className="flex items-center gap-3 text-slate-300 mb-3">
                    <Clock size={16} /> <span className="text-xs font-medium uppercase tracking-wider">Business Hours</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Monday - Saturday</span>
                    <span className="text-white font-semibold">09:00 - 19:00</span>
                </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE: The Form */}
          <div className="lg:w-3/5 p-10 md:p-14 bg-white">
            <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-slate-900 mb-8"
            >
                Send us a message
            </motion.h2>
            
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Send size={32} className="text-green-600 ml-1" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent Successfully!</h3>
                  <p className="text-slate-500 mb-8">Thank you for contacting Durable Fasteners. Our sales team will review your inquiry and get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-2">
                    Send another message <Briefcase size={16} />
                  </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100">
                        {error}
                    </motion.div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Enter first name" />
                  <InputGroup label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Enter last name" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@company.com" />
                    <div className="group">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Topic</label>
                        <motion.div whileTap={{ scale: 0.99 }}>
                            <select 
                                name="subject" value={formData.subject} onChange={handleChange}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all duration-200 font-medium text-slate-900 cursor-pointer"
                            >
                                <option>General Inquiry</option>
                                <option>Request for Quote (Bulk)</option>
                                <option>Distributorship Application</option>
                                <option>Technical Support</option>
                            </select>
                        </motion.div>
                    </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                  <motion.div whileTap={{ scale: 0.99 }}>
                    <textarea 
                        name="message" rows={4} required value={formData.message} onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all duration-200 font-medium text-slate-900 placeholder-gray-400 resize-none" 
                        placeholder="Tell us about your requirements..."
                    ></textarea>
                  </motion.div>
                </div>

                <div className="pt-4">
                    <motion.button 
                        type="submit" 
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {loading ? <Loader2 className="animate-spin" /> : <>Send Message <Briefcase size={20} /></>}
                    </motion.button>
                    <p className="text-center text-slate-400 text-xs mt-4">
                        By submitting this form, you agree to our privacy policy.
                    </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      {/* --- Section 3: Wide Map (Now Colorful & Taller) --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        // CHANGED: Removed grayscale, increased height to 500px, added distinct border
        className="w-full h-[500px] bg-white relative border-t-4 border-slate-900 shadow-2xl"
      >
        <iframe 
            width="100%" 
            height="100%" 
            id="gmap_canvas" 
            src="https://maps.google.com/maps?q=Durable%20Fastener%20Pvt%20Ltd%20Rajkot&t=&z=13&ie=UTF8&iwloc=&output=embed" 
            frameBorder="0" 
            scrolling="no" 
            title="Durable Fastener Location"
            // No filter applied here, so it will be full color
        ></iframe>
      </motion.div>
    </div>
  );
};

// --- Sub-components to keep code clean ---

const InfoItem = ({ icon, colorClass, title, content, subContent }: any) => (
    <motion.div 
        variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
        }}
        className="flex items-start gap-4 group cursor-default"
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:text-white ${colorClass}`}>
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-lg">{title}</h4>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">{content}</p>
            {subContent && <p className="text-slate-500 text-xs mt-1">{subContent}</p>}
        </div>
    </motion.div>
);

const InputGroup = ({ label, name, type="text", value, onChange, placeholder }: any) => (
    <div className="group">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
        <motion.div whileTap={{ scale: 0.99 }}>
            <input 
                type={type} name={name} required value={value} onChange={onChange}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all duration-200 font-medium text-slate-900 placeholder-placeholder" 
                placeholder={placeholder} 
            />
        </motion.div>
    </div>
);

export default Contact;