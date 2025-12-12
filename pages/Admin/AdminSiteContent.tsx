import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader, Image as ImageIcon, Trash2, Upload, RefreshCw, CheckCircle } from 'lucide-react';

const AdminSiteContent = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null); // Track which field is uploading
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    hero_bg: '',
    cat_fasteners: '',
    cat_fittings: '',
    cat_automotive: '',
    about_img: '' // 👈 New Field Added
});

  // 1. Data Fetch Logic
  async function fetchContent() {
        setFetching(true);
        const { data, error } = await supabase
            .from('site_content')
            .select('*')
            .eq('id', 1)
            .single();

       if (data) {
    setFormData({
        hero_bg: data.hero_bg || '',
        cat_fasteners: data.cat_fasteners || '',
        cat_fittings: data.cat_fittings || '',
        cat_automotive: data.cat_automotive || '',
        about_img: data.about_img || '' // 👈 Map here
    });
}else if (error && error.code === 'PGRST116') {
            await supabase.from('site_content').insert([{ id: 1 }]);
            fetchContent();
        }
        setFetching(false);
    }

  useEffect(() => {
    fetchContent();
  }, []);

  // 2. Handle Manual URL Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle File Upload Logic (NEW)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    setUploading(fieldName); // Start loading spinner for this field

    try {
      // a. Create a unique file name (e.g., hero-123456789.png)
      const fileExt = file.name.split('.').pop();
      const fileName = `${fieldName}-${Date.now()}.${fileExt}`;
      const filePath = `home-images/${fileName}`;

      // b. Upload to Supabase Storage 'site-assets' bucket
      const { error: uploadError } = await supabase.storage
        .from('site-assets') // Make sure this bucket exists in Supabase
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // c. Get Public URL
      const { data } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      // d. Update State with new URL
      setFormData(prev => ({ ...prev, [fieldName]: data.publicUrl }));
      
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(null); // Stop spinner
    }
  };

  // 4. Save to Database
  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('site_content')
      .update(formData)
      .eq('id', 1);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Website Updated Successfully!");
    }
    setLoading(false);
  };

  const handleDelete = (field: string) => {
    if(window.confirm('Are you sure?')) setFormData(prev => ({ ...prev, [field]: '' }));
  };

  if (fetching) return <div className="p-10 flex items-center gap-2"><Loader className="animate-spin"/> Loading data...</div>;

  // --- REUSABLE COMPONENT FOR UPLOAD FIELD ---
  const ImageUploadField = ({ label, name, value }: { label: string, name: string, value: string }) => (
    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-bold text-gray-800">{label}</label>
            {value && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={10}/> Active</span>}
        </div>
        
        {/* Preview Area */}
        <div className="mb-4 relative group w-full h-40 overflow-hidden rounded-lg bg-gray-200 border border-gray-300">
            {value ? (
                <>
                    <img src={value} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                        onClick={() => handleDelete(name)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
                        title="Remove Image"
                    >
                        <Trash2 size={16} />
                    </button>
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={32} className="mb-2 opacity-50"/>
                    <span className="text-xs">No Image Uploaded</span>
                </div>
            )}
            
            {/* Uploading Spinner Overlay */}
            {uploading === name && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white backdrop-blur-sm">
                    <Loader className="animate-spin" />
                </div>
            )}
        </div>

        {/* Action Area */}
        <div className="flex gap-2 items-center">
            {/* Hidden File Input + Custom Button */}
            <div className="relative">
                <input 
                    type="file" 
                    id={`file-${name}`}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, name)}
                    disabled={uploading !== null}
                />
                <label 
                    htmlFor={`file-${name}`}
                    className={`cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Upload size={16} /> 
                    {uploading === name ? 'Uploading...' : 'Upload New'}
                </label>
            </div>

            {/* URL Input (Optional fallback) */}
            <input 
                type="text" 
                name={name} 
                value={value} 
                onChange={handleChange}
                placeholder="Or paste URL..."
                className="flex-1 p-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
        </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      <div className="flex justify-between items-end border-b border-gray-200 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Content Manager</h1>
            <p className="text-gray-500 mt-1">Upload images directly to update the homepage.</p>
        </div>
        <button onClick={fetchContent} className="p-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 text-gray-600 transition-transform active:scale-95">
            <RefreshCw size={20} />
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Hero Section - Spans Full Width */}
            <div className="md:col-span-2 lg:col-span-3">
                <ImageUploadField label="Hero Background (Main Banner)" name="hero_bg" value={formData.hero_bg} />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
    <ImageUploadField 
        label="About Us Section Image (Factory Photo)" 
        name="about_img" 
        value={formData.about_img} 
    />
</div>


            {/* Categories */}
            <ImageUploadField label="Fasteners Image" name="cat_fasteners" value={formData.cat_fasteners} />
            <ImageUploadField label="Fittings Image" name="cat_fittings" value={formData.cat_fittings} />
            <ImageUploadField label="Automotive Image" name="cat_automotive" value={formData.cat_automotive} />
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end sticky bottom-0 bg-white p-4 -mx-4 -mb-4 rounded-b-2xl">
            <button 
                onClick={handleSave} 
                disabled={loading || uploading !== null}
                className="bg-black text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 transform hover:-translate-y-1"
            >
                {loading ? <Loader className="animate-spin" size={20}/> : <Save size={20}/>}
                Publish All Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSiteContent;