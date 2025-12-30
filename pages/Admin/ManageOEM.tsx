import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, LayoutTemplate, Upload, Image as ImageIcon, X } from 'lucide-react';

const ManageOEM: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false); // State for image upload

  // State structure matches DB columns
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_video_url: '',
    mfg_limits: [] as any[],
    head_styles: '',
    drive_systems: '',
    qa_cpk: '',
    qa_max_class: ''
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('oem_content').select('*').single();
      if (data && !error) {
        setFormData({
          ...data,
          head_styles: data.head_styles ? data.head_styles.join(', ') : '',
          drive_systems: data.drive_systems ? data.drive_systems.join(', ') : '',
        });
      }
      setFetching(false);
    };
    fetchData();
  }, []);

  // Handle Text Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Limits (JSON Array) Inputs
  const handleLimitChange = (index: number, field: string, value: string) => {
    const newLimits = [...formData.mfg_limits];
    newLimits[index] = { ...newLimits[index], [field]: value };
    setFormData({ ...formData, mfg_limits: newLimits });
  };

  // --- NEW: Handle Image Upload ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `oem-hero-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploading(true);

    try {
      // 1. Upload file to 'site-assets' bucket
      const { error: uploadError } = await supabase.storage
        .from('site-assets') // Make sure this bucket exists in Supabase
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      // 3. Update Form Data
      setFormData({ ...formData, hero_video_url: data.publicUrl });
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Make sure "site-assets" bucket exists and is public.');
    } finally {
      setUploading(false);
    }
  };

  // Save to Supabase
  const handleSave = async () => {
    setLoading(true);
    try {
      const stylesArray = formData.head_styles.split(',').map(s => s.trim()).filter(s => s !== '');
      const drivesArray = formData.drive_systems.split(',').map(s => s.trim()).filter(s => s !== '');

      const { error } = await supabase
        .from('oem_content')
        .update({
          hero_title: formData.hero_title,
          hero_subtitle: formData.hero_subtitle,
          hero_video_url: formData.hero_video_url,
          mfg_limits: formData.mfg_limits,
          head_styles: stylesArray,
          drive_systems: drivesArray,
          qa_cpk: formData.qa_cpk,
          qa_max_class: formData.qa_max_class,
          updated_at: new Date()
        })
        .eq('id', 1);

      if (error) throw error;
      alert('OEM Page Updated Successfully!');
    } catch (error) {
      console.error('Error updating page:', error);
      alert('Failed to update page.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10">Loading page data...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage OEM Page</h1>
          <p className="text-gray-500">Edit content for your OEM Platform landing page.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* 1. Hero Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold text-lg border-b pb-2">
            <LayoutTemplate size={20} className="text-blue-600"/> Hero Section
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Headline</label>
              <input type="text" name="hero_title" value={formData.hero_title} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle / Description</label>
              <textarea name="hero_subtitle" value={formData.hero_subtitle} onChange={handleChange} rows={3} className="w-full p-2 border rounded-md" />
            </div>

            {/* --- UPDATED IMAGE UPLOAD SECTION --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image</label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
                
                {uploading ? (
                   <div className="flex items-center gap-2 text-blue-600 font-bold">
                      <Loader2 className="animate-spin" /> Uploading...
                   </div>
                ) : (
                  <>
                    <input 
                      type="file" 
                      accept="image/*,video/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-900">Click to upload image</p>
                      <p className="text-xs text-gray-500">SVG, PNG, JPG or Video</p>
                    </div>
                  </>
                )}
              </div>

              {/* Preview & URL Input */}
              <div className="mt-4 flex gap-4 items-start">
                 {formData.hero_video_url && (
                   <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-md overflow-hidden border">
                      <img src={formData.hero_video_url} alt="Preview" className="w-full h-full object-cover" />
                   </div>
                 )}
                 <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Image URL (Auto-filled or paste manually)</label>
                    <input 
                      type="text" 
                      name="hero_video_url" 
                      value={formData.hero_video_url} 
                      onChange={handleChange} 
                      className="w-full p-2 border rounded-md text-sm text-gray-600 font-mono" 
                      placeholder="https://..."
                    />
                 </div>
              </div>
            </div>
            {/* --- END IMAGE UPLOAD SECTION --- */}

          </div>
        </div>

        {/* 2. Manufacturing Limits */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4 text-gray-800 font-bold text-lg border-b pb-2">Manufacturing Limits (Grid)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.mfg_limits.map((limit, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">{limit.label}</p>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={limit.value} 
                    onChange={(e) => handleLimitChange(index, 'value', e.target.value)}
                    className="w-full p-1 text-sm border rounded font-mono font-bold"
                    placeholder="Value (e.g. M1.2)"
                  />
                  <input 
                    type="text" 
                    value={limit.sub} 
                    onChange={(e) => handleLimitChange(index, 'sub', e.target.value)}
                    className="w-full p-1 text-sm border rounded text-gray-500"
                    placeholder="Subtitle"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Lists (Heads & Drives) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4 text-gray-800 font-bold text-lg border-b pb-2">Technical Lists</div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Head Styles (Separate by comma)</label>
              <textarea 
                name="head_styles" 
                value={formData.head_styles} 
                onChange={handleChange} 
                rows={5} 
                className="w-full p-2 border rounded-md font-mono text-sm"
                placeholder="Hexagon, Pan Head, etc..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drive Systems (Separate by comma)</label>
              <textarea 
                name="drive_systems" 
                value={formData.drive_systems} 
                onChange={handleChange} 
                rows={5} 
                className="w-full p-2 border rounded-md font-mono text-sm"
                placeholder="Phillips, Torx, etc..."
              />
            </div>
          </div>
        </div>

        {/* 4. QA Stats */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4 text-gray-800 font-bold text-lg border-b pb-2">Quality Analytics</div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cpk Index Value</label>
              <input type="text" name="qa_cpk" value={formData.qa_cpk} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Class Strength</label>
              <input type="text" name="qa_max_class" value={formData.qa_max_class} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageOEM;