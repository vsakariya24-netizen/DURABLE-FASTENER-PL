import React, { useState, useEffect } from 'react';
import { 
  FileText, Printer, ShieldCheck, Mail, MapPin, 
  Globe, Scale, AlertTriangle, ArrowLeft, ChevronRight,
  Copyright, Package, CreditCard, Gavel, Ban
} from 'lucide-react';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('section-1');

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 150;

      sections.forEach((section) => {
        const htmlSection = section as HTMLElement;
        const top = htmlSection.offsetTop;
        const height = htmlSection.offsetHeight;
        
        if (scrollPosition >= top && scrollPosition < top + height) {
          const id = htmlSection.getAttribute('id');
          if (id) setActiveSection(id);
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
    { id: 'section-1', label: '1. Use of Website', icon: Globe },
    { id: 'section-2', label: '2. Intellectual Property', icon: Copyright },
    { id: 'section-3', label: '3. Product Info & Accuracy', icon: Package },
    { id: 'section-4', label: '4. Pricing & Quotations', icon: CreditCard },
    { id: 'section-5', label: '5. Orders & Acceptance', icon: FileText },
    { id: 'section-6', label: '6. Limitation of Liability', icon: AlertTriangle },
    { id: 'section-10', label: '10. Prohibited Activities', icon: Ban },
    { id: 'section-12', label: '13. Governing Law', icon: Gavel },
    { id: 'section-contact', label: '14. Contact Info', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans print:bg-white">
      
      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-700 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Scale size={12} className="text-blue-400" /> Legal Compliance Document</span>
          </div>
          <div className="font-mono opacity-70">DOC-REF: DF-2026-TC-V1</div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-300 relative overflow-hidden pb-8 pt-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back to Home Navigation */}
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
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-slate-800 text-white p-1.5 rounded-sm">
                  <FileText size={20} />
                </div>
                <span className="uppercase tracking-widest text-xs font-bold text-slate-800">Legal Department</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Terms & Conditions</h1>
              <p className="mt-3 text-lg text-slate-600 font-light">Durable Fastener Private Limited</p>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="bg-slate-50 border border-slate-200 rounded p-4 text-sm shadow-sm">
                <div className="flex justify-between md:justify-start gap-8 border-b border-slate-200 pb-2 mb-2">
                  <span className="text-slate-500">Effective Date</span>
                  <span className="font-semibold text-slate-900">Jan 06, 2026</span>
                </div>
                <div className="flex justify-between md:justify-start gap-8">
                  <span className="text-slate-500">Last Updated</span>
                  <span className="font-semibold text-slate-900">Jan 06, 2026</span>
                </div>
              </div>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded text-sm font-medium transition-colors print:hidden"
              >
                <Printer size={16} /> Print Agreement
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sticky Sidebar */}
          <aside className="lg:col-span-3 print:hidden">
            <nav className="sticky top-6 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Agreement Index</h3>
              </div>
              <ul className="py-2">
                {sections.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 group transition-all border-l-4 ${
                        activeSection === item.id 
                          ? 'border-blue-700 bg-blue-50 text-blue-800 font-semibold' 
                          : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {activeSection === item.id && <ChevronRight size={14} className="shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="mt-6 bg-slate-800 rounded-lg p-6 text-white text-center shadow-lg">
              <Gavel size={40} className="mx-auto mb-3 text-slate-400 opacity-90" />
              <h4 className="font-bold text-sm mb-1">Governing Law</h4>
              <p className="text-xs text-slate-300">Jurisdiction: Rajkot, Gujarat, India.</p>
            </div>
          </aside>

          {/* Main Content */}
          <article className="lg:col-span-9 bg-white shadow-xl shadow-slate-200/60 rounded-sm border border-slate-200 min-h-[800px] print:shadow-none print:border-none">
            
            <div className="p-8 md:p-12 lg:p-16 space-y-12">
              
              {/* Introduction */}
              <div className="prose prose-slate max-w-none border-b border-slate-200 pb-8">
                <p className="lead text-lg text-slate-700 leading-relaxed">
                  <strong>Welcome to https://durablefastener.com/ Website.</strong> This Website is owned and operated by Durable Fastener Private Limited. By accessing or using this Website, you agree to comply with and be bound by these Terms & Conditions. If you do not agree, please do not use the Website.
                </p>
              </div>

              {/* 1. Use of Website */}
              <section id="section-1" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">1.</span> Use of Website
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 marker:text-slate-400">
                  <li>This Website is intended for business, commercial, and informational purposes only.</li>
                  <li>You agree to use the Website only for lawful purposes and in a manner that does not violate any applicable laws or regulations.</li>
                  <li>Unauthorized use of this Website may give rise to a claim for damages and/or be a criminal offense under Indian law.</li>
                </ul>
              </section>

              {/* 2. Intellectual Property Rights */}
              <section id="section-2" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">2.</span> Intellectual Property Rights
                </h2>
                <div className="bg-slate-50 p-6 rounded border-l-4 border-slate-300">
                  <p className="text-slate-700 mb-3">
                    All content on this Website, including but not limited to text, images, graphics, logos, product descriptions, technical data, videos, icons, and layout, is the intellectual property of <strong>Durable Fastener Private Limited</strong>, unless otherwise stated.
                  </p>
                  <p className="text-slate-700 text-sm">
                    No material may be copied, reproduced, republished, uploaded, posted, transmitted, or distributed without prior written permission. Unauthorized use may violate intellectual property laws.
                  </p>
                </div>
              </section>

              {/* 3. Product Information */}
              <section id="section-3" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">3.</span> Product Information & Accuracy
                </h2>
                <p className="text-slate-600 mb-3">Product specifications, dimensions, grades, standards, finishes, and technical details displayed on the Website are for general informational purposes only.</p>
                <div className="flex items-start gap-3 p-4 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
                  <AlertTriangle className="shrink-0 mt-0.5" size={16} />
                  <p>While we make reasonable efforts to ensure accuracy, Durable Fastener does not guarantee that all information is complete, current, or error-free. Final product specifications shall be confirmed through official quotation, technical datasheets, or written confirmation.</p>
                </div>
              </section>

              {/* 4. Pricing & Quotations */}
              <section id="section-4" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">4.</span> Pricing & Quotations
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 marker:text-slate-400">
                  <li>Prices displayed on the Website (if any) are indicative and subject to change without prior notice.</li>
                  <li>All quotations provided by Durable Fastener are valid only for the specified period mentioned in the quotation.</li>
                  <li>Taxes, duties, freight, and other charges may apply unless stated otherwise.</li>
                </ul>
              </section>

              {/* 5. Orders & Acceptance */}
              <section id="section-5" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">5.</span> Orders & Acceptance
                </h2>
                <p className="text-slate-700">Submission of an inquiry or purchase order does not constitute acceptance. All orders are subject to written confirmation by Durable Fastener. We reserve the right to accept or reject any order at our discretion.</p>
              </section>

              {/* 6. Limitation of Liability */}
              <section id="section-6" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">6.</span> Limitation of Liability
                </h2>
                <p className="text-slate-600 mb-4">Durable Fastener shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from:</p>
                <ul className="grid md:grid-cols-2 gap-4">
                  <li className="bg-slate-50 p-3 rounded text-sm text-slate-700 border border-slate-100">Use or inability to use the Website</li>
                  <li className="bg-slate-50 p-3 rounded text-sm text-slate-700 border border-slate-100">Reliance on information provided on the Website</li>
                  <li className="bg-slate-50 p-3 rounded text-sm text-slate-700 border border-slate-100">Website downtime, errors, or technical issues</li>
                </ul>
                <p className="text-xs text-slate-500 mt-4">Website content is provided on an “as-is” and “as-available” basis.</p>
              </section>

              {/* Sections 7, 8, 9 Grouped */}
              <div className="border-t border-b border-slate-200 py-8 space-y-8">
                <section id="section-7">
                  <h3 className="font-bold text-slate-900 mb-2">7. External Links</h3>
                  <p className="text-sm text-slate-600">This Website may contain links to third-party websites. Durable Fastener has no control over such websites and is not responsible for their content, privacy practices, or terms. Accessing third-party links is at your own risk.</p>
                </section>
                <section id="section-8">
                  <h3 className="font-bold text-slate-900 mb-2">8. User Submissions</h3>
                  <p className="text-sm text-slate-600">Any information, inquiry, or material submitted through the Website (forms, emails, etc.) shall be deemed non-confidential unless stated otherwise. You grant Durable Fastener the right to use such information for business communication and service purposes.</p>
                </section>
                <section id="section-9">
                  <h3 className="font-bold text-slate-900 mb-2">9. Privacy Policy</h3>
                  <p className="text-sm text-slate-600">Use of this Website is also governed by our Privacy Policy, which explains how we collect, use, and protect personal information. By using the Website, you consent to practices described in the Privacy Policy.</p>
                </section>
              </div>

              {/* 10. Prohibited Activities */}
              <section id="section-10" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">10.</span> Prohibited Activities
                </h2>
                <div className="bg-red-50 border border-red-100 rounded-lg p-5">
                  <p className="font-semibold text-red-800 mb-3 text-sm uppercase tracking-wide">Users shall not:</p>
                  <ul className="space-y-2">
                    {['Attempt to gain unauthorized access to the Website or server', 'Upload malicious code, viruses, or harmful content', 'Misuse product data or technical information', 'Use the Website for fraudulent or unlawful purposes'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-red-700 text-sm">
                        <Ban size={16} className="shrink-0 mt-0.5 opacity-70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* 11 & 13 Generic Terms */}
              <div className="grid md:grid-cols-2 gap-8">
                <section id="section-11">
                  <h3 className="font-bold text-slate-900 mb-2">11. Termination of Access</h3>
                  <p className="text-sm text-slate-600">Durable Fastener reserves the right to suspend or terminate access to the Website without notice or restrict access if these Terms & Conditions are violated.</p>
                </section>
                <section id="section-13">
                  <h3 className="font-bold text-slate-900 mb-2">12. Changes to Terms</h3>
                  <p className="text-sm text-slate-600">Durable Fastener may revise these Terms & Conditions at any time without prior notice. Continued use of the Website constitutes acceptance of the updated terms.</p>
                </section>
              </div>

              {/* 12. Governing Law */}
              <section id="section-12" className="scroll-mt-24 bg-slate-50 p-6 rounded border border-slate-200">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-blue-700">13.</span> Governing Law & Jurisdiction
                </h2>
                <p className="text-slate-700 mb-2">These Terms & Conditions shall be governed by and interpreted in accordance with the laws of <strong>India</strong>.</p>
                <p className="text-slate-700">Any disputes shall be subject to the exclusive jurisdiction of courts located in <strong>Gujarat, India</strong>.</p>
              </section>

              {/* 14. Contact Information */}
              <section id="section-contact" className="scroll-mt-24 mt-12 bg-slate-900 text-white p-8 rounded shadow-inner">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b border-slate-700 pb-2 mb-4">14. Contact Information</h2>
                    <p className="text-slate-300 text-sm mb-4">For any questions regarding these Terms & Conditions, please contact:</p>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="text-blue-400 shrink-0" size={20} />
                      <p className="text-slate-300 text-sm">
                        <strong className="text-white block">Registered Office:</strong>
                        Durable Fastener Private Limited<br />
                        Plot No.16, Survey No.660,<br />
                        Surbhi Ind Zone-D, Ravki, Rajkot-360004,<br />
                        Gujarat, India
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
                    <div className="bg-white/10 p-4 rounded text-center">
                      <ShieldCheck size={32} className="mx-auto mb-2 text-blue-400" />
                      <span className="text-xs text-blue-100">Official Legal Document</span>
                    </div>
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


export default TermsAndConditions;
