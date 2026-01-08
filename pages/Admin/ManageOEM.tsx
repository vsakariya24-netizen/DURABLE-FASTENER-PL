import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Save, Loader2, LayoutTemplate, Upload, 
  Settings, Plus, Trash2, Image as ImageIcon, FileText,
  Palette, Component, Crosshair, MapPin
} from 'lucide-react';

// --- INTERFACES ---
interface StyleItem {
  name: string;
  img: string;
}

interface ColorItem {
  name: string;
  color: string;
}

const ManageOEM: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_video_url: '',
    spec_material: '',
    spec_diameter: '',
    spec_length: '',
    qa_cpk: '',
    qa_max_class: ''
  });

  // --- DYNAMIC LISTS STATE ---
  const [headStyles, setHeadStyles] = useState<StyleItem[]>([]);
  const [driveSystems, setDriveSystems] = useState<StyleItem[]>([]);
  const [threadingTypes, setThreadingTypes] = useState<StyleItem[]>([]);
  const [surfaceFinishes, setSurfaceFinishes] = useState<ColorItem[]>([]);

  // --- 1. FETCH & CLEAN DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('oem_content').select('*').single();
        
        if (error) throw error;

        if (data) {
          const specs = data.technical_specs || {};

          setFormData({
            hero_title: data.hero_title || '',
            hero_subtitle: data.hero_subtitle || '',
            hero_video_url: data.hero_video_url || '',
            spec_material: specs.material || '',
            spec_diameter: specs.diameter || '',
            spec_length: specs.length || '',
            qa_cpk: data.qa_cpk || '',
            qa_max_class: data.qa_max_class || ''
          });

          // --- "HARD RESET" CLEANING FUNCTION ---
          // This uses Regex to forcefully extract names if JSON fails
          const fixCorruptedItem = (item: any): StyleItem => {
             // 1. If it's just a string, try to parse it
             if (typeof item === 'string') {
                 try {
                     return fixCorruptedItem(JSON.parse(item));
                 } catch {
                     // If parse fails, assume the string is the name
                     return { name: item, img: '' };
                 }
             }

             // 2. If it's an object, check if the NAME field contains JSON code
             if (typeof item === 'object' && item !== null) {
                 let realName = item.name || '';
                 let realImg = item.img || '';

                 // Check if the 'name' looks like code (starts with { or contains "name":)
                 if (typeof realName === 'string' && (realName.trim().startsWith('{') || realName.includes('"name":'))) {
                     try {
                         // Attempt 1: JSON Parse
                         const parsedInner = JSON.parse(realName);
                         if (parsedInner.name) realName = parsedInner.name;
                         if (parsedInner.img && !realImg) realImg = parsedInner.img;
                     } catch (e) {
                         // Attempt 2: Regex Extraction (The "Hammer" Approach)
                         // Matches: "name":"Value"
                         const nameMatch = realName.match(/"name"\s*:\s*"([^"]+)"/);
                         if (nameMatch && nameMatch[1]) {
                             realName = nameMatch[1];
                         }

                         // Matches: "img":"Value"
                         const imgMatch = realName.match(/"img"\s*:\s*"([^"]+)"/);
                         if (imgMatch && imgMatch[1] && !realImg) {
                             realImg = imgMatch[1];
                         }
                     }
                 }
                 
                 return { name: realName, img: realImg };
             }

             // 3. Fallback
             return { name: '', img: '' };
          };

          const fixColorItem = (item: any): ColorItem => {
             // Similar logic for colors
             if (typeof item === 'string') {
                 try { return fixColorItem(JSON.parse(item)); } catch { return { name: item, color: '#000000' }; }
             }
             if (typeof item === 'object' && item !== null) {
                 let rName = item.name || '';
                 let rColor = item.color || '#000000';
                 
                 if (typeof rName === 'string' && rName.includes('"name":')) {
                     try {
                         const p = JSON.parse(rName);
                         if (p.name) rName = p.name;
                         if (p.color) rColor = p.color;
                     } catch {
                         const nm = rName.match(/"name"\s*:\s*"([^"]+)"/);
                         if (nm) rName = nm[1];
                     }
                 }
                 return { name: rName, color: rColor };
             }
             return { name: '', color: '#000000' };
          };

          const processList = (list: any[]) => Array.isArray(list) ? list.map(fixCorruptedItem) : [];
          const processColors = (list: any[]) => Array.isArray(list) ? list.map(fixColorItem) : [];

          setHeadStyles(processList(data.head_styles));
          setDriveSystems(processList(data.drive_systems));
          setThreadingTypes(processList(data.threading_types));
          setSurfaceFinishes(processColors(data.surface_finishes));
        }
      } catch (error) {
        console.error("Error fetching OEM data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. HANDLERS ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    target: 'hero' | 'head' | 'drive' | 'thread', 
    index?: number
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const uniqueId = target === 'hero' ? 'hero' : `${target}-${index}`;
    const fileExt = file.name.split('.').pop();
    const fileName = `${target}-${Date.now()}.${fileExt}`;
    const filePath = `oem/${fileName}`;
    
    setUploadingId(uniqueId);

    try {
      const { error: uploadError } = await supabase.storage.from('site-assets').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      if (target === 'hero') {
        setFormData(prev => ({ ...prev, hero_video_url: publicUrl }));
      } else {
        if (typeof index !== 'number') return;
        
        // Updates state immediately with new URL
        if (target === 'head') {
            const list = [...headStyles]; list[index].img = publicUrl; setHeadStyles(list);
        } else if (target === 'drive') {
            const list = [...driveSystems]; list[index].img = publicUrl; setDriveSystems(list);
        } else if (target === 'thread') {
            const list = [...threadingTypes]; list[index].img = publicUrl; setThreadingTypes(list);
        }
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploadingId(null);
    }
  };

  const updateListItem = (
    listType: 'head' | 'drive' | 'thread' | 'surface', 
    index: number, 
    field: 'name' | 'img' | 'color', 
    value: string
  ) => {
    let list: any[] = [];
    let setList: any = null;

    if (listType === 'head') { list = [...headStyles]; setList = setHeadStyles; }
    else if (listType === 'drive') { list = [...driveSystems]; setList = setDriveSystems; }
    else if (listType === 'thread') { list = [...threadingTypes]; setList = setThreadingTypes; }
    else if (listType === 'surface') { list = [...surfaceFinishes]; setList = setSurfaceFinishes; }

    const updatedItem = { ...list[index], [field]: value };
    list[index] = updatedItem;
    setList(list);
  };

  const addItem = (listType: 'head' | 'drive' | 'thread' | 'surface') => {
    if (listType === 'surface') {
        setSurfaceFinishes([...surfaceFinishes, { name: '', color: '#3b82f6' }]);
    } else {
        const newItem = { name: '', img: '' };
        if (listType === 'head') setHeadStyles([...headStyles, newItem]);
        else if (listType === 'drive') setDriveSystems([...driveSystems, newItem]);
        else if (listType === 'thread') setThreadingTypes([...threadingTypes, newItem]);
    }
  };

  const removeItem = (listType: 'head' | 'drive' | 'thread' | 'surface', index: number) => {
    if (listType === 'head') setHeadStyles(headStyles.filter((_, i) => i !== index));
    else if (listType === 'drive') setDriveSystems(driveSystems.filter((_, i) => i !== index));
    else if (listType === 'thread') setThreadingTypes(threadingTypes.filter((_, i) => i !== index));
    else if (listType === 'surface') setSurfaceFinishes(surfaceFinishes.filter((_, i) => i !== index));
  };

  // --- 3. SAVE FUNCTION ---
  const handleSave = async () => {
    setLoading(true);
    try {
      const technicalSpecsJson = {
        material: formData.spec_material,
        diameter: formData.spec_diameter,
        length: formData.spec_length,
        thread: "Metric & Imperial" 
      };

      const { error } = await supabase
        .from('oem_content')
        .update({
          hero_title: formData.hero_title,
          hero_subtitle: formData.hero_subtitle,
          hero_video_url: formData.hero_video_url,
          technical_specs: technicalSpecsJson,
          
          head_styles: headStyles, 
          drive_systems: driveSystems,
          threading_types: threadingTypes,
          surface_finishes: surfaceFinishes,

          qa_cpk: formData.qa_cpk,
          qa_max_class: formData.qa_max_class,
          updated_at: new Date()
        })
        .eq('id', 1);

      if (error) throw error;
      alert('OEM Platform updated successfully! Data has been cleaned and saved.');
      window.location.reload(); 
    } catch (error) {
      console.error('Error updating page:', error);
      alert('Failed to update page. Check console for DB errors.');
    } finally {
      setLoading(false);
    }
  };

  // --- 4. RENDER HELPERS ---
  
  const renderListEditor = (title: string, items: StyleItem[], listType: 'head' | 'drive' | 'thread', colorClass: string) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className={`px-6 py-4 border-b border-slate-100 flex justify-between items-center ${colorClass} bg-opacity-5`}>
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-slate-600"/>
          <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">{title}</h3>
        </div>
        <button 
          onClick={() => addItem(listType)}
          className={`text-[10px] font-bold px-3 py-1.5 rounded-full text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1`}
        >
          <Plus size={12} /> ADD ITEM
        </button>
      </div>

      <div className="p-6 space-y-3 overflow-y-auto max-h-[500px]">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 p-3 rounded-lg border border-slate-200 hover:border-blue-400 transition-colors bg-slate-50/50 group">
            {/* Image Uploader */}
            <div className="relative w-16 h-16 bg-white rounded-md border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {item.img ? (
                <img src={item.img} alt={item.name} className="w-full h-full object-contain p-1" />
              ) : (
                <ImageIcon size={20} className="text-slate-300" />
              )}
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity z-10">
                {uploadingId === `${listType}-${index}` ? (
                  <Loader2 size={16} className="text-white animate-spin" />
                ) : (
                  <Upload size={16} className="text-white" />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, listType, index)}
                />
              </label>
            </div>

            {/* Inputs */}
            <div className="flex-1 flex flex-col justify-center gap-2">
               <input 
                 type="text" 
                 placeholder="Item Name"
                 value={item.name} 
                 onChange={(e) => updateListItem(listType, index, 'name', e.target.value)}
                 className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 pb-1"
               />
               <input 
                 type="text" 
                 value={item.img}
                 readOnly
                 className="w-full bg-transparent outline-none text-[10px] font-mono text-slate-400 truncate"
               />
            </div>
            <button onClick={() => removeItem(listType, index)} className="self-center p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs italic">No items yet.</div>
        )}
      </div>
    </div>
  );

  const renderColorListEditor = (title: string, items: ColorItem[]) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-purple-50">
        <div className="flex items-center gap-2">
          <Palette size={18} className="text-purple-600"/>
          <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">{title}</h3>
        </div>
        <button 
          onClick={() => addItem('surface')}
          className="text-[10px] font-bold px-3 py-1.5 rounded-full text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1"
        >
          <Plus size={12} /> ADD COLOR
        </button>
      </div>

      <div className="p-6 space-y-3 overflow-y-auto max-h-[500px]">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 p-3 rounded-lg border border-slate-200 hover:border-purple-400 transition-colors bg-slate-50/50 items-center">
            
            <div className="relative w-12 h-12 flex-shrink-0">
                <input 
                  type="color" 
                  value={item.color} 
                  onChange={(e) => updateListItem('surface', index, 'color', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                    className="w-full h-full rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: item.color }}
                ></div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-2">
               <input 
                 type="text" 
                 placeholder="Finish Name"
                 value={item.name}
                 onChange={(e) => updateListItem('surface', index, 'name', e.target.value)}
                 className="w-full bg-transparent border-b border-slate-200 focus:border-purple-500 outline-none text-sm font-bold text-slate-700 pb-1"
               />
               <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-slate-400">HEX:</span>
                   <input 
                     type="text" 
                     value={item.color}
                     onChange={(e) => updateListItem('surface', index, 'color', e.target.value)}
                     className="w-full bg-transparent outline-none text-[10px] font-mono text-slate-500 uppercase"
                   />
               </div>
            </div>

            <button onClick={() => removeItem('surface', index)} className="self-center p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
         {items.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs italic">No finishes added.</div>
        )}
      </div>
    </div>
  );

  if (fetching) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-blue-600">
      <Loader2 size={40} className="animate-spin mb-4"/>
      <p className="font-mono text-xs uppercase tracking-widest">Loading Admin Panel...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* TOP BAR */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">OEM CONTROL</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage Content & Capabilities</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-md font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {loading ? 'SAVING...' : 'PUBLISH UPDATES'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* HERO SECTION */}
        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
             <LayoutTemplate size={20} className="text-blue-500" />
             <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Hero Section</h2>
           </div>
           
           <div className="grid lg:grid-cols-12 gap-8">
             <div className="lg:col-span-8 space-y-6">
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Main Headline</label>
                 <input 
                   type="text" 
                   name="hero_title"
                   value={formData.hero_title}
                   onChange={handleChange}
                   className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-2xl font-black text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300"
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subtitle</label>
                 <textarea 
                   name="hero_subtitle"
                   value={formData.hero_subtitle}
                   onChange={handleChange}
                   rows={3}
                   className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                 />
               </div>
             </div>

             <div className="lg:col-span-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Background Asset</label>
                <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden group border border-slate-200">
                  {formData.hero_video_url && (
                    <div className="absolute inset-0 opacity-50">
                        {formData.hero_video_url.match(/\.(mp4|webm)$/) ? (
                          <video src={formData.hero_video_url} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={formData.hero_video_url} alt="Hero" className="w-full h-full object-cover" />
                        )}
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <label className="cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all">
                        {uploadingId === 'hero' ? <Loader2 size={16} className="animate-spin"/> : <Upload size={16}/>}
                        <span className="text-xs font-bold">CHANGE ASSET</span>
                        <input type="file" onChange={(e) => handleFileUpload(e, 'hero')} className="hidden" />
                    </label>
                  </div>
                </div>
             </div>
           </div>
        </section>

        {/* TECHNICAL SPECS */}
        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
             <Component size={20} className="text-blue-500" />
             <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Core Specifications</h2>
           </div>

           <div className="grid md:grid-cols-3 gap-6">
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                 <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Component size={14} />
                    <span className="text-[10px] font-bold uppercase">Material</span>
                 </div>
                 <input 
                   type="text" 
                   name="spec_material" 
                   value={formData.spec_material} 
                   onChange={handleChange}
                   className="w-full bg-transparent font-mono text-lg font-bold text-slate-800 outline-none border-b border-transparent focus:border-blue-500"
                 />
             </div>

             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                 <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Crosshair size={14} />
                    <span className="text-[10px] font-bold uppercase">Diameter</span>
                 </div>
                 <input 
                   type="text" 
                   name="spec_diameter" 
                   value={formData.spec_diameter} 
                   onChange={handleChange}
                   className="w-full bg-transparent font-mono text-lg font-bold text-slate-800 outline-none border-b border-transparent focus:border-blue-500"
                 />
             </div>

             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                 <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <MapPin size={14} />
                    <span className="text-[10px] font-bold uppercase">Length</span>
                 </div>
                 <input 
                   type="text" 
                   name="spec_length" 
                   value={formData.spec_length} 
                   onChange={handleChange}
                   className="w-full bg-transparent font-mono text-lg font-bold text-slate-800 outline-none border-b border-transparent focus:border-blue-500"
                 />
             </div>
           </div>
        </section>

        {/* DYNAMIC SPEC LISTS */}
        <div className="grid lg:grid-cols-2 gap-8 h-auto">
           {renderListEditor('Threading Specifications', threadingTypes, 'thread', 'bg-orange-600')}
           {renderColorListEditor('Surface Engineering', surfaceFinishes)}
        </div>

        {/* CATALOG LISTS */}
        <div className="grid lg:grid-cols-2 gap-8 h-auto">
           {renderListEditor('Head Styles Catalog', headStyles, 'head', 'bg-blue-600')}
           {renderListEditor('Drive Systems Catalog', driveSystems, 'drive', 'bg-emerald-600')}
        </div>

        {/* QA METRICS */}
        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
             <FileText size={20} className="text-blue-500" />
             <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Quality Assurance Metrics</h2>
           </div>
           
           <div className="grid md:grid-cols-2 gap-8">
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cpk Index</label>
               <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <span className="text-slate-400 font-mono mr-3">Index:</span>
                  <input 
                    type="text" 
                    name="qa_cpk" 
                    value={formData.qa_cpk} 
                    onChange={handleChange}
                    className="flex-1 bg-transparent font-bold text-slate-800 outline-none"
                  />
               </div>
             </div>

             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Maximum Class Strength</label>
               <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <span className="text-slate-400 font-mono mr-3">Class:</span>
                  <input 
                    type="text" 
                    name="qa_max_class" 
                    value={formData.qa_max_class} 
                    onChange={handleChange}
                    className="flex-1 bg-transparent font-bold text-slate-800 outline-none"
                  />
               </div>
             </div>
           </div>
        </section>

      </div>
    </div>
  );
};

export default ManageOEM;