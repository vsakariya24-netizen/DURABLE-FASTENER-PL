import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Briefcase, MapPin, IndianRupee, ChevronDown, ChevronUp, Send, 
  Clock, Search, Filter, X, Users, User, ArrowRight, Building2
} from 'lucide-react';

// --- HELPERS ---
const getBadgeStyles = (text: string) => {
  const t = text ? text.toLowerCase() : '';
  if (t.includes('engineer') || t.includes('manufactur') || t.includes('dispatch')) return 'bg-blue-50 text-blue-700 ring-blue-600/20';
  if (t.includes('sales') || t.includes('market') || t.includes('export')) return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
  if (t.includes('financ') || t.includes('account')) return 'bg-amber-50 text-amber-700 ring-amber-600/20';
  if (t.includes('admin') || t.includes('hr') || t.includes('found')) return 'bg-purple-50 text-purple-700 ring-purple-600/20';
  return 'bg-slate-100 text-slate-700 ring-slate-500/20';
};

// --- CONSTANTS ---
const SALARY_RANGES = [
  { label: '< 15k', min: 0, max: 15000 },
  { label: '15k - 30k', min: 15000, max: 30000 },
  { label: '30k - 50k', min: 30000, max: 50000 },
  { label: '50k - 1L', min: 50000, max: 100000 },
  { label: '1L+', min: 100000, max: 1000000 },
];

// --- COMPONENTS ---

// 1. Polished Job Card
// 1. Polished Job Card
const JobCard: React.FC<{ job: any }> = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // --- STEP 1: Apna Company ka WhatsApp Number yahan dalein (Country code ke saath, bina + ke) ---
    const phoneNumber = "919876543210"; 
    
    // --- STEP 2: Message Format ---
    const message = `Hello, I am interested in the position of *${job.title}* at Durable Fastener.`;
    
    // --- STEP 3: Detect Mobile vs PC ---
    // Ye check karta hai ki user Android ya iOS device par hai kya
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // --- STEP 4: URL Set Karna ---
    let url = '';
    
    if (isMobile) {
        // Mobile ke liye: Ye seedha WhatsApp App kholne ki koshish karega
        url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    } else {
        // Desktop ke liye: Ye seedha WhatsApp Web interface kholega
        url = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    }

    // New Tab mein open karein
    window.open(url, '_blank');
  };

  return (
    <div className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-blue-500 shadow-lg ring-1 ring-blue-500/20' : 'border-slate-200 hover:border-blue-300 hover:shadow-md'}`}>
      <div className="p-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {/* ... baaki ka same design code ... */}
        
        {/* Main Card Content (Header) */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          
          {/* Left Side: Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${getBadgeStyles(job.department)}`}>
                {job.department}
              </span>

              {job.gender && (
                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset flex items-center gap-1 
                    ${job.gender === 'Male' 
                        ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20' 
                        : job.gender === 'Female' 
                            ? 'bg-pink-50 text-pink-700 ring-pink-600/20'
                            : 'bg-slate-100 text-slate-600 ring-slate-500/20' 
                    }`}>
                    {job.gender === 'Any' ? <Users size={10} /> : <User size={10} />}
                    {job.gender === 'Any' ? 'Male / Female' : `${job.gender} Only`}
                 </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1.5 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-slate-400"/>
                  <span>Durable Fastener Pvt Ltd</span>
                </div>
                {job.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400"/>
                    <span>{job.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400"/>
                    <span>Full Time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Salary & Action */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4">
             {job.salary && (
               <div className="flex items-center gap-1 text-slate-900 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <IndianRupee size={16} className="text-slate-500" /> 
                  <span>{job.salary}</span>
               </div>
             )}
             <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown size={20} className="text-slate-400" />
             </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-0 border-t border-slate-100 mt-2">
            
            {/* Meta Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Experience</p>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Briefcase size={14} className="text-blue-500"/> {job.experience || 'Not Specified'}
                    </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Gender</p>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Users size={14} className="text-blue-500"/> 
                        {job.gender === 'Any' || !job.gender ? 'Male / Female' : `${job.gender} Only`}
                    </p>
                </div>
            </div>

            {/* Description Content */}
            <div 
                className="prose prose-sm prose-slate max-w-none 
                prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600
                prose-strong:text-slate-900 prose-li:marker:text-slate-400" 
                dangerouslySetInnerHTML={{ __html: job.description }} 
            />
            
            {/* CTA Button - Isme onClick event set hai */}
            <div className="mt-8 flex items-center justify-end pt-6 border-t border-slate-100">
              <button onClick={handleApply} className="group relative inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30">
                <span>Apply via WhatsApp</span>
                <Send size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// 2. Stylish Checkbox Filter
const FilterSection: React.FC<{
  title: string;
  options: { label: string; count: number }[];
  selected: string[];
  onChange: (val: string) => void;
}> = ({ title, options, selected, onChange }) => {
  if (options.length === 0) return null;
  return (
    <div className="mb-8">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{title}</h4>
        <div className="space-y-2">
            {options.map((opt) => {
                const isSelected = selected.includes(opt.label);
                return (
                    <label key={opt.label} className="flex items-center justify-between cursor-pointer group py-1">
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-all border ${isSelected ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                                {isSelected && <CheckIcon />}
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={isSelected}
                                    onChange={() => onChange(opt.label)}
                                />
                            </div>
                            <span className={`text-sm transition-colors ${isSelected ? 'font-semibold text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                {opt.label}
                            </span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${isSelected ? 'bg-slate-100 text-slate-900 font-bold' : 'bg-slate-50 text-slate-400'}`}>
                            {opt.count}
                        </span>
                    </label>
                );
            })}
        </div>
    </div>
  );
};

// Simple check icon SVG
const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// --- MAIN PAGE ---
const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedLocs, setSelectedLocs] = useState<string[]>([]);
  const [selectedSalaries, setSelectedSalaries] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (!error && data) setJobs(data);
    setLoading(false);
  };

  // --- LOGIC (Updated to handle exact location strings) ---
  const filterOptions = useMemo(() => {
    const depts: Record<string, number> = {};
    const locs: Record<string, number> = {};
    const salaries: Record<string, number> = {};
    const genders: Record<string, number> = {};

    jobs.forEach(job => {
        const d = job.department || 'Other';
        depts[d] = (depts[d] || 0) + 1;

        // Use location exactly as it comes from DB now since we use a Dropdown in Admin
        const l = job.location || 'Remote';
        locs[l] = (locs[l] || 0) + 1;

        const g = job.gender || 'Any';
        genders[g] = (genders[g] || 0) + 1;

        if (job.salary_min || job.salary_max) {
            const jobMin = job.salary_min || 0;
            const jobMax = job.salary_max || 9999999;
            SALARY_RANGES.forEach(range => {
                if (range.min < jobMax && range.max > jobMin) {
                    salaries[range.label] = (salaries[range.label] || 0) + 1;
                }
            });
        }
    });

    return {
        departments: Object.entries(depts).map(([label, count]) => ({ label, count })).sort((a,b) => b.count - a.count),
        locations: Object.entries(locs).map(([label, count]) => ({ label, count })).sort((a,b) => b.count - a.count),
        salaries: SALARY_RANGES.map(r => ({ label: r.label, count: salaries[r.label] || 0 })),
        genders: Object.entries(genders).map(([label, count]) => ({ label, count })).sort((a,b) => b.count - a.count)
    };
  }, [jobs]);

  const filteredJobs = jobs.filter(job => {
    const searchContent = `${job.title} ${job.description} ${job.department}`.toLowerCase();
    const matchesSearch = searchContent.includes(searchQuery.toLowerCase());
    const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(job.department);
    // Exact match for location since its a dropdown now
    const matchesLoc = selectedLocs.length === 0 || selectedLocs.includes(job.location); 
    const matchesGender = selectedGenders.length === 0 || selectedGenders.includes(job.gender || 'Any');
    
    let matchesSalary = true;
    if (selectedSalaries.length > 0) {
        if (!job.salary_min && !job.salary_max) matchesSalary = false;
        else {
            const jobMin = job.salary_min || 0;
            const jobMax = job.salary_max || 9999999;
            matchesSalary = selectedSalaries.some(label => {
                const range = SALARY_RANGES.find(r => r.label === label);
                if (!range) return false;
                return range.min < jobMax && range.max > jobMin;
            });
        }
    }
    return matchesSearch && matchesDept && matchesLoc && matchesSalary && matchesGender;
  });

  const toggleFilter = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) setList(list.filter(i => i !== item));
    else setList([...list, item]);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepts([]);
    setSelectedLocs([]);
    setSelectedSalaries([]);
    setSelectedGenders([]);
  };

  const activeFiltersCount = selectedDepts.length + selectedLocs.length + selectedSalaries.length + selectedGenders.length;

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      
      {/* PROFESSIONAL HEADER with Subtle Gradient */}
      <div className="relative bg-slate-900 pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative max-w-5xl mx-auto text-center z-10">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                We are hiring now
             </div>
             <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
               Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Durable Fastener</span>
             </h1>
             <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
               Discover your next role in Engineering, Manufacturing, Finance, or Sales. Build the future with us.
             </p>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 -mt-10 relative z-20">
        
        {/* MOBILE FILTER TOGGLE & SEARCH */}
        <div className="lg:hidden mb-6">
            <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-200 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search for roles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400 font-medium"
                    />
                </div>
                <button 
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className={`p-3 rounded-lg flex items-center justify-center transition-colors ${activeFiltersCount > 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                    <Filter size={20} />
                    {activeFiltersCount > 0 && <span className="ml-2 text-xs font-bold bg-white text-slate-900 px-1.5 py-0.5 rounded-full">{activeFiltersCount}</span>}
                </button>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* SIDEBAR (Professional Card Style) */}
            <aside className={`
                lg:w-72 w-full flex-shrink-0
                ${showMobileFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto animate-fadeIn' : 'hidden lg:block'}
                lg:sticky lg:top-24 lg:z-auto
            `}>                
                {/* Mobile Header */}
                <div className="lg:hidden flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Filters</h2>
                    <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-slate-100 rounded-full"><X size={20}/></button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8">
                    {/* Desktop Search */}
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Keyword search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                        />
                    </div>

                    {/* Active Filters */}
                    {activeFiltersCount > 0 && (
                        <div className="pb-6 border-b border-slate-100">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-slate-900">Active Filters ({activeFiltersCount})</span>
                                <button onClick={clearFilters} className="text-xs font-semibold text-blue-600 hover:text-blue-700">Clear All</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[...selectedDepts, ...selectedLocs, ...selectedSalaries, ...selectedGenders].map(f => (
                                    <span key={f} className="inline-flex items-center gap-1 text-[10px] uppercase font-bold bg-slate-900 text-white px-2 py-1 rounded">
                                        {f} <X size={10} className="cursor-pointer opacity-75 hover:opacity-100" onClick={() => {
                                            if(selectedDepts.includes(f)) toggleFilter(f, selectedDepts, setSelectedDepts);
                                            else if(selectedLocs.includes(f)) toggleFilter(f, selectedLocs, setSelectedLocs);
                                            else if(selectedGenders.includes(f)) toggleFilter(f, selectedGenders, setSelectedGenders);
                                            else toggleFilter(f, selectedSalaries, setSelectedSalaries);
                                        }}/>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <FilterSection title="Gender" options={filterOptions.genders} selected={selectedGenders} onChange={(val) => toggleFilter(val, selectedGenders, setSelectedGenders)} />
                    <FilterSection title="Location" options={filterOptions.locations} selected={selectedLocs} onChange={(val) => toggleFilter(val, selectedLocs, setSelectedLocs)} />
                    <FilterSection title="Department" options={filterOptions.departments} selected={selectedDepts} onChange={(val) => toggleFilter(val, selectedDepts, setSelectedDepts)} />
                    <FilterSection title="Monthly Salary" options={filterOptions.salaries} selected={selectedSalaries} onChange={(val) => toggleFilter(val, selectedSalaries, setSelectedSalaries)} />

                     <div className="lg:hidden mt-8">
                        <button onClick={() => setShowMobileFilters(false)} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg">
                            Show {filteredJobs.length} Jobs
                        </button>
                     </div>
                </div>
            </aside>

            {/* JOB LIST AREA */}
            <main className="flex-1 w-full min-h-[500px]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        Open Positions 
                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{filteredJobs.length}</span>
                    </h2>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="bg-white h-40 rounded-2xl border border-slate-200 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map(job => <JobCard key={job.id} job={job} />)
                        ) : (
                            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="text-slate-400" size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">No jobs found</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mt-2">We couldn't find any positions matching your filters. Try adjusting them.</p>
                                <button onClick={clearFilters} className="mt-6 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto">
                                    Clear all filters <ArrowRight size={14}/>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
      </div>
    </div>
  );
};

export default Careers;