import React, { useState, useEffect } from 'react';
import { 
  FileText, Printer, ShieldCheck, Mail, MapPin, 
  Globe, Lock, CheckCircle, Scale, AlertCircle, ChevronRight,
  ArrowLeft // Added ArrowLeft icon
} from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('section-1');

  // Handle scroll spy to update active section in sidebar
  useEffect(() => {
    const handleScroll = () => {
      // Get all sections that have an ID
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 150;

      sections.forEach((section) => {
        // FIX: We explicitly tell TypeScript this is an HTMLElement
        const htmlSection = section as HTMLElement;
        
        const top = htmlSection.offsetTop;
        const height = htmlSection.offsetHeight;
        
        if (scrollPosition >= top && scrollPosition < top + height) {
          const id = htmlSection.getAttribute('id');
          if (id) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { id: 'section-1', label: '1. Scope of Policy' },
    { id: 'section-2', label: '2. Data Collection' },
    { id: 'section-3', label: '3. Usage & Purpose' },
    { id: 'section-4', label: '4. Cookies & Tracking' },
    { id: 'section-5', label: '5. Information Sharing' },
    { id: 'section-6', label: '6. Security Protocols' },
    { id: 'section-7', label: '7. Data Retention' },
    { id: 'section-8', label: '8. User Rights' },
    { id: 'section-contact', label: 'Contact & Compliance' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans print:bg-white">
      
      {/* Top Bar - Trust Indicators */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-700 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Lock size={12} className="text-green-400" /> SSL Encrypted Connection</span>
            <span className="hidden sm:flex items-center gap-1"><CheckCircle size={12} className="text-blue-400" /> Official Compliance Document</span>
          </div>
          <div className="font-mono opacity-70">DOC-REF: DF-2026-PP-V2</div>
        </div>
      </div>

      {/* Official Header */}
      <header className="bg-white shadow-sm border-b border-gray-300 relative overflow-hidden pb-8 pt-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* NEW: Back to Home Navigation */}
          <div className="mb-6 print:hidden">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-all text-sm font-medium group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </a>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            
            {/* Title Area */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-900 text-white p-1.5 rounded-sm">
                  <Scale size={20} />
                </div>
                <span className="uppercase tracking-widest text-xs font-bold text-blue-900">Legal Department</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Privacy Policy</h1>
              <p className="mt-3 text-lg text-slate-600 font-light">Durable Fastener Private Limited</p>
            </div>

            {/* Meta Data Box */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="bg-slate-50 border border-slate-200 rounded p-4 text-sm shadow-sm">
                <div className="flex justify-between md:justify-start gap-8 border-b border-slate-200 pb-2 mb-2">
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold text-green-700 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div> Active
                  </span>
                </div>
                <div className="flex justify-between md:justify-start gap-8">
                  <span className="text-slate-500">Effective</span>
                  <span className="font-semibold text-slate-900">Jan 06, 2026</span>
                </div>
              </div>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded text-sm font-medium transition-colors print:hidden"
              >
                <Printer size={16} /> Print Official Copy
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation - Sticky */}
          <aside className="lg:col-span-3 print:hidden">
            <nav className="sticky top-6 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Document Index</h3>
              </div>
              <ul className="py-2">
                {sections.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between group transition-all border-l-4 ${
                        activeSection === item.id 
                          ? 'border-blue-700 bg-blue-50 text-blue-800 font-semibold' 
                          : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                      {activeSection === item.id && <ChevronRight size={14} />}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Trust Badge Widget */}
            <div className="mt-6 bg-blue-900 rounded-lg p-6 text-white text-center shadow-lg">
              <ShieldCheck size={40} className="mx-auto mb-3 text-blue-300 opacity-90" />
              <h4 className="font-bold text-sm mb-1">Data Protection</h4>
              <p className="text-xs text-blue-200">Compliant with IT Act 2000 & Global Privacy Standards.</p>
            </div>
          </aside>

          {/* Main Content - Paper Style */}
          <article className="lg:col-span-9 bg-white shadow-xl shadow-slate-200/60 rounded-sm border border-slate-200 min-h-[800px] print:shadow-none print:border-none">
            
            <div className="p-8 md:p-12 lg:p-16 space-y-12">
              
              {/* Introduction / Preamble */}
              <div className="prose prose-slate max-w-none border-b border-slate-200 pb-8">
                <p className="lead text-lg text-slate-700 leading-relaxed">
                  <strong>Durable Fastener Private Limited</strong> We are committed to maintaining the confidentiality, integrity, and security of all personal information entrusted to us by our industrial partners, distributors, and website visitors. This Privacy Policy outlines our legal obligations and your rights regarding data processing.
                </p>
                <div className="flex items-start gap-3 bg-blue-50 border-l-4 border-blue-700 p-4 mt-6 text-sm text-blue-900 rounded-r">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <div>
                    <strong className="block mb-1 font-bold uppercase text-xs tracking-wider">Legal Compliance Statement</strong>
                    This document is drafted in accordance with the <em>Information Technology Act, 2000</em>, the <em>IT Rules, 2011</em>, and adheres to standard industrial data protection protocols.
                  </div>
                </div>
              </div>

              {/* Section 1 */}
              <section id="section-1" className="scroll-mt-24">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">1. Scope of This Policy</h2>
                <p className="text-slate-600 mb-4">This policy applies to all digital interactions with Durable Fastener Private Limited, including:</p>
                <ul className="list-[square] pl-5 space-y-2 text-slate-700 marker:text-blue-700">
                  <li><strong>Website Visitors:</strong> Individuals browsing our product catalog.</li>
                  <li><strong>Business Inquiries:</strong> Distributors and OEM clients submitting RFQs (Request for Quotation).</li>
                  <li><strong>Vendors:</strong> Suppliers interacting through our digital procurement portals.</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section id="section-2" className="scroll-mt-24">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">2. Information We Collect</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-5 rounded border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div> Personal Data
                    </h3>
                    <p className="text-sm text-slate-600">Information you voluntarily provide via forms, such as Name, Company Designation, Email, Official Phone Number, and Shipping Address.</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div> Technical Data
                    </h3>
                    <p className="text-sm text-slate-600">Automated data including IP addresses, browser type, device specifications, and interaction logs for security auditing.</p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="section-3" className="scroll-mt-24">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">3. Purpose of Data Collection</h2>
                <p className="text-slate-600 mb-4">We process data strictly for business-to-business (B2B) purposes:</p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-600 shrink-0 mt-1" />
                    <span>To process manufacturing orders and generate technical invoices.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-600 shrink-0 mt-1" />
                    <span>To provide product certifications and material test reports.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-600 shrink-0 mt-1" />
                    <span>To verify business identity and prevent fraud.</span>
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="section-4" className="scroll-mt-24">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">4. Cookies & Tracking Policy</h2>
                <p className="text-slate-600 leading-relaxed">
                  Our website utilizes essential cookies to ensure site functionality and performance cookies to analyze industrial traffic patterns. We do not use advertising cookies to track your behavior across unrelated websites. You retain the right to disable cookies via your browser settings.
                </p>
              </section>

              {/* Section 5 & 6 */}
              <div className="grid md:grid-cols-2 gap-8">
                <section id="section-5" className="scroll-mt-24">
                  <h2 className="text-xl font-serif font-bold text-slate-900 mb-3">5. Information Sharing</h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We strictly <strong>do not sell</strong> data. Information is shared only with logistics partners for delivery, legal authorities when mandated by law, and authorized IT service providers under strict Non-Disclosure Agreements (NDAs).
                  </p>
                </section>
                <section id="section-6" className="scroll-mt-24">
                  <h2 className="text-xl font-serif font-bold text-slate-900 mb-3">6. Security Protocols</h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We implement SSL encryption, firewalls, and strict access controls. Data is stored on secure servers with regular backups to prevent loss. Only authorized personnel have access to sensitive business data.
                  </p>
                </section>
              </div>

              {/* Section 7 & 8 */}
              <div className="grid md:grid-cols-2 gap-8">
                <section id="section-7" className="scroll-mt-24">
                  <h2 className="text-xl font-serif font-bold text-slate-900 mb-3">7. Data Retention</h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Client data is retained for the duration of the business relationship and for 5 years thereafter for tax and audit purposes, after which it is securely archived or anonymized.
                  </p>
                </section>
                <section id="section-8" className="scroll-mt-24">
                  <h2 className="text-xl font-serif font-bold text-slate-900 mb-3">8. User Rights</h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    You have the right to request a copy of your data, request corrections to company details, or request deletion of data (subject to pending orders or legal invoice retention requirements).
                  </p>
                </section>
              </div>

              {/* Contact Footer */}
              <section id="section-contact" className="scroll-mt-24 mt-12 bg-slate-900 text-white p-8 rounded shadow-inner">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b border-slate-700 pb-2 mb-4">Official Contact Information</h2>
                    <div className="flex items-start gap-3">
                      <MapPin className="text-blue-400 shrink-0" size={20} />
                      <p className="text-slate-300 text-sm">
                        <strong className="text-white block">Registered Office:</strong>
                        Durable Fastener Private Limited<br />
                        Plot No.16, Survey No.660,
                        Surbhi Ind Zone-D, Ravki, Rajkot-360004,
                        Gujarat, India <br />
                        
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="text-blue-400 shrink-0" size={20} />
                      <a href="mailto:info@durablefastener.com" className="text-slate-300 text-sm hover:text-white transition-colors">info@durablefastener.com</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="text-blue-400 shrink-0" size={20} />
                      <a href="https://durablefastener.com" className="text-slate-300 text-sm hover:text-white transition-colors">www.durablefastener.com</a>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end items-start md:items-end">
                    <div className="flex gap-2 mb-4">
                      {/* Placeholder for Certification Icons */}
                      <div className="bg-white/10 p-2 rounded text-xs text-center">
                        <ShieldCheck size={24} className="mx-auto mb-1 text-green-400" />
                        <span>Secured</span>
                      </div>
                      <div className="bg-white/10 p-2 rounded text-xs text-center">
                        <FileText size={24} className="mx-auto mb-1 text-blue-400" />
                        <span>IT Act Compliant</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 text-right max-w-xs">
                      This privacy policy is subject to the jurisdiction of the courts in Rajkot, Gujarat.
                    </p>
                  </div>
                </div>
              </section>

            </div>
          </article>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 mb-2">&copy; {new Date().getFullYear()} Durable Fastener Private Limited. All Rights Reserved.</p>
          <p className="text-xs text-slate-400">Unauthorized reproduction or distribution of this legal document is strictly prohibited.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;