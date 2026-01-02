import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Save, Loader2, LayoutTemplate, Upload, 
  Component, Crosshair, MapPin, Settings, ShieldCheck,
  Microscope, ListChecks, Plus, Trash2, Image as ImageIcon, X
} from 'lucide-react';

// Interface for the list items
interface StyleItem {
  name: string;
  img: string;
}

const ManageOEM: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null); // To track which item is uploading

  // Standard Form Data
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_video_url: '',
    spec_material: '',
    spec_diameter: '',
    spec_length: '',
    spec_thread: '',
    spec_finish: '',
    qa_cpk: '',
    qa_max_class: ''
  });

  // Dedicated State for the Lists
  const [headStyles, setHeadStyles] = useState<StyleItem[]>([]);
  const [driveSystems, setDriveSystems] = useState<StyleItem[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('oem_content').select('*').single();
      
      if (data && !error) {
        const specs = data.technical_specs || {};

        setFormData({
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          hero_video_url: data.hero_video_url || '',
          spec_material: specs.material || 'MS & SS',
          spec_diameter: specs.diameter || '2.2mm - 5.5mm',
          spec_length: specs.length || '4.5mm - 125mm',
          spec_thread: specs.thread || 'Fine, Coarse & Metric',
          spec_finish: specs.finish || 'Black Phosphate, Zinc...',
          qa_cpk: data.qa_cpk || '',
          qa_max_class: data.qa_max_class || ''
        });

        // --- DATA CLEANING FUNCTION (यह आपके Error को ठीक करेगा) ---
        const cleanData = (list: any[]) => {
          if (!Array.isArray(list)) return [];
          
          return list.map(item => {
            // Case 1: अगर item सिर्फ एक String है (Old Data)
            if (typeof item === 'string') {
              try {
                // कोशिश करें कि क्या यह JSON string है?
                const parsed = JSON.parse(item);
                if (typeof parsed === 'object') return parsed;
              } catch (e) {
                // नहीं, यह simple text है
                return { name: item, img: '' };
              }
              return { name: item, img: '' };
            }

            // Case 2: (YOUR ERROR) अगर item Object है लेकिन name के अंदर JSON फंसा हुआ है
            if (typeof item === 'object' && item.name && typeof item.name === 'string' && item.name.trim().startsWith('{')) {
               try {
                 const parsedName = JSON.parse(item.name);
                 return {
                   name: parsedName.name || '',   // असली नाम निकालो 
                   img: item.img || parsedName.img || '' // बाहर वाली इमेज या अंदर वाली इमेज
                 };
               } catch (e) {
                 return item;
               }
            }

            // Case 3: Data सही है
            return item;
          });
        };
        // -----------------------------------------------------------

        setHeadStyles(cleanData(data.head_styles));
        setDriveSystems(cleanData(data.drive_systems));
      }
      setFetching(false);
    };
    fetchData();
  }, []);
  // Handle Basic Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- MAIN HERO IMAGE UPLOAD ---
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const filePath = `oem-hero-${Date.now()}.${file.name.split('.').pop()}`;
    setUploadingId('hero');

    try {
      const { error: uploadError } = await supabase.storage.from('site-assets').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath);
      setFormData({ ...formData, hero_video_url: data.publicUrl });
    } catch (error) {
      alert('Error uploading hero asset.');
    } finally {
      setUploadingId(null);
    }
  };

  // --- LIST MANAGEMENT HELPERS ---

  // Update a specific item in a list
  const updateListItem = (
    listType: 'head' | 'drive', 
    index: number, 
    field: 'name' | 'img', 
    value: string
  ) => {
    if (listType === 'head') {
      const newList = [...headStyles];
      newList[index] = { ...newList[index], [field]: value };
      setHeadStyles(newList);
    } else {
      const newList = [...driveSystems];
      newList[index] = { ...newList[index], [field]: value };
      setDriveSystems(newList);
    }
  };

  // Add new empty item
  const addItem = (listType: 'head' | 'drive') => {
    const newItem = { name: '', img: '' };
    if (listType === 'head') setHeadStyles([...headStyles, newItem]);
    else setDriveSystems([...driveSystems, newItem]);
  };

  // Remove item
  const removeItem = (listType: 'head' | 'drive', index: number) => {
    if (listType === 'head') {
      const newList = headStyles.filter((_, i) => i !== index);
      setHeadStyles(newList);
    } else {
      const newList = driveSystems.filter((_, i) => i !== index);
      setDriveSystems(newList);
    }
  };

  // Handle Icon Upload for Lists
  const handleListUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    listType: 'head' | 'drive', 
    index: number
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const uniqueId = `${listType}-${index}`;
    const filePath = `icon-${uniqueId}-${Date.now()}.${file.name.split('.').pop()}`;
    
    setUploadingId(uniqueId);

    try {
      const { error: uploadError } = await supabase.storage.from('site-assets').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath);
      updateListItem(listType, index, 'img', data.publicUrl);
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  // --- SAVE FUNCTION ---
  const handleSave = async () => {
    setLoading(true);
    try {
      const technicalSpecsJson = {
        material: formData.spec_material,
        diameter: formData.spec_diameter,
        length: formData.spec_length,
        thread: formData.spec_thread,
        finish: formData.spec_finish
      };

      const { error } = await supabase
        .from('oem_content')
        .update({
          hero_title: formData.hero_title,
          hero_subtitle: formData.hero_subtitle,
          hero_video_url: formData.hero_video_url,
          technical_specs: technicalSpecsJson,
          // Save the full object arrays directly
          head_styles: headStyles, 
          drive_systems: driveSystems, 
          qa_cpk: formData.qa_cpk,
          qa_max_class: formData.qa_max_class,
          updated_at: new Date()
        })
        .eq('id', 1);

      if (error) throw error;
      alert('OEM Platform Data Updated Successfully!');
    } catch (error) {
      console.error('Error updating page:', error);
      alert('Failed to update page.');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER COMPONENT FOR LISTS ---
  const renderListEditor = (
    title: string, 
    items: StyleItem[], 
    listType: 'head' | 'drive',
    accentColor: string
  ) => (
    <div className={`p-6 rounded-xl border border-gray-200 bg-white shadow-sm`}>
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="font-bold text-gray-700 uppercase text-sm tracking-wider">{title}</h3>
        <button 
          onClick={() => addItem(listType)}
          className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full text-white ${accentColor} hover:opacity-90`}
        >
          <Plus size={14} /> ADD NEW
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200 group">
            {/* Image Preview / Upload */}
            <div className="relative w-12 h-12 bg-gray-200 rounded-md flex-shrink-0 border border-gray-300 overflow-hidden flex items-center justify-center">
              {item.img ? (
                <img src={item.img} alt="" className="w-full h-full object-contain p-1" />
              ) : (
                <ImageIcon size={20} className="text-gray-400" />
              )}
              
              {/* Overlay Upload Button */}
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                {uploadingId === `${listType}-${index}` ? (
                  <Loader2 size={16} className="text-white animate-spin" />
                ) : (
                  <Upload size={16} className="text-white" />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleListUpload(e, listType, index)}
                />
              </label>
            </div>

            {/* Inputs */}
            <div className="flex-1 space-y-1">
               <input 
                 type="text" 
                 placeholder="Name (e.g. Hexagon)"
                 value={item.name}
                 onChange={(e) => updateListItem(listType, index, 'name', e.target.value)}
                 className="w-full text-sm font-bold text-gray-800 bg-transparent border-b border-transparent focus:border-blue-500 outline-none"
               />
               <input 
                 type="text" 
                 placeholder="Image URL (optional)"
                 value={item.img}
                 onChange={(e) => updateListItem(listType, index, 'img', e.target.value)}
                 className="w-full text-[10px] font-mono text-gray-500 bg-transparent outline-none"
               />
            </div>

            {/* Remove Action */}
            <button 
              onClick={() => removeItem(listType, index)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-xs italic">No items added yet.</div>
        )}
      </div>
    </div>
  );

  if (fetching) return <div className="p-10 flex items-center gap-2 text-blue-600"><Loader2 className="animate-spin"/> Loading data...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-gray-50/95 backdrop-blur py-4 z-10 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">OEM Controller</h1>
          <p className="text-gray-500 text-sm">Update technical parameters and visual assets.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-md font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          PUBLISH CHANGES
        </button>
      </div>

      <div className="space-y-8">
        
        {/* 1. HERO SECTION */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold text-lg border-b pb-4">
            <LayoutTemplate size={24} className="text-blue-600"/> 
            <span className="uppercase tracking-wider text-sm">Hero Configuration</span>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Headline</label>
                <input 
                  type="text" 
                  name="hero_title" 
                  value={formData.hero_title} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="e.g. OEM FOUNDATION"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtitle</label>
                <textarea 
                  name="hero_subtitle" 
                  value={formData.hero_subtitle} 
                  onChange={handleChange} 
                  rows={3} 
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="e.g. Rajkot's premier platform..."
                />
              </div>
            </div>

            {/* Hero Asset Upload */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Background</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-all relative overflow-hidden group">
                {formData.hero_video_url && (
                   <div className="absolute inset-0 opacity-40 group-hover:opacity-20 transition-opacity">
                      {formData.hero_video_url.match(/\.(mp4|webm)$/) ? (
                        <video src={formData.hero_video_url} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={formData.hero_video_url} alt="bg" className="w-full h-full object-cover" />
                      )}
                   </div>
                )}
                
                <input 
                  type="file" 
                  accept="image/*,video/*"
                  onChange={handleHeroImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                <div className="text-center z-0 pointer-events-none">
                  {uploadingId === 'hero' ? (
                    <Loader2 className="animate-spin text-blue-600 mx-auto" />
                  ) : (
                    <>
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-xs font-bold text-gray-500">CLICK TO UPLOAD</span>
                    </>
                  )}
                </div>
              </div>
              <input 
                  type="text" 
                  name="hero_video_url" 
                  value={formData.hero_video_url} 
                  onChange={handleChange} 
                  className="w-full mt-2 p-2 bg-gray-50 border rounded text-[10px] text-gray-500 font-mono"
                  placeholder="Asset URL"
              />
            </div>
          </div>
        </div>

        {/* 2. TECHNICAL SPECS */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
          <div className="relative z-10 flex items-center gap-2 mb-6 text-gray-900 font-bold text-lg border-b pb-4">
            <Settings size={24} className="text-blue-600"/> 
            <span className="uppercase tracking-wider text-sm">Factory Capabilities</span>
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-50 rounded text-blue-600"><Component size={18}/></div>
                 <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Material</label>
                    <input type="text" name="spec_material" value={formData.spec_material} onChange={handleChange} className="w-full p-2 border rounded font-mono font-medium text-gray-800" />
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-50 rounded text-blue-600"><Crosshair size={18}/></div>
                 <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Diameter</label>
                    <input type="text" name="spec_diameter" value={formData.spec_diameter} onChange={handleChange} className="w-full p-2 border rounded font-mono font-medium text-gray-800" />
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-50 rounded text-blue-600"><MapPin size={18}/></div>
                 <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Length</label>
                    <input type="text" name="spec_length" value={formData.spec_length} onChange={handleChange} className="w-full p-2 border rounded font-mono font-medium text-gray-800" />
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-50 rounded text-blue-600"><Settings size={18}/></div>
                 <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Thread</label>
                    <input type="text" name="spec_thread" value={formData.spec_thread} onChange={handleChange} className="w-full p-2 border rounded font-mono font-medium text-gray-800" />
                 </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
               <div className="flex items-center gap-2 mb-2 text-blue-700">
                  <ShieldCheck size={18}/>
                  <span className="text-xs font-bold uppercase">Surface Finish</span>
               </div>
               <textarea 
                 name="spec_finish" 
                 value={formData.spec_finish} 
                 onChange={handleChange} 
                 rows={6}
                 className="w-full p-3 border border-gray-300 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none"
               />
            </div>
          </div>
        </div>

        {/* 3. STYLES & SYSTEMS LISTS (NEW DYNAMIC EDITORS) */}
        <div className="grid md:grid-cols-2 gap-8">
          {renderListEditor('Head Styles', headStyles, 'head', 'bg-blue-600')}
          {renderListEditor('Drive Systems', driveSystems, 'drive', 'bg-emerald-600')}
        </div>

        {/* 4. QA STATISTICS */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold text-lg border-b pb-4">
            <Microscope size={24} className="text-blue-600"/> 
            <span className="uppercase tracking-wider text-sm">Quality Metrics</span>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cpk Index Value</label>
              <input 
                type="text" 
                name="qa_cpk" 
                value={formData.qa_cpk} 
                onChange={handleChange} 
                className="w-full p-2 bg-white border border-gray-300 rounded-lg font-mono font-bold text-xl text-center" 
              />
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Max Class Strength</label>
              <input 
                type="text" 
                name="qa_max_class" 
                value={formData.qa_max_class} 
                onChange={handleChange} 
                className="w-full p-2 bg-white border border-gray-300 rounded-lg font-mono font-bold text-xl text-center" 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageOEM;