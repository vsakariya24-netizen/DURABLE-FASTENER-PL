import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader, Image as ImageIcon, FileText, Upload, RefreshCw, CheckCircle, Hash, Phone, Mail, MapPin, Video } from 'lucide-react';

const AdminSiteContent = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  
  // 1. STATE: Added 'showreel_url'
  const [formData, setFormData] = useState({
    hero_bg: '',
    about_img: '',
    cat_fasteners: '',
    cat_fittings: '',
    cat_automotive: '',
    stat_dealers: 0,
    stat_years: 0,
    stat_products: 0,
    catalogue_pdf: '',
    showreel_url: '', // 👈 Added Field
    contact_address: '',
    contact_email: '',
    contact_phone: ''
  });

  // 2. FETCH DATA
  async function fetchContent() {
    setFetching(true);
    const { data, error } = await supabase.from('site_content').select('*').eq('id', 1).single();

    if (data) {
        setFormData({
            hero_bg: data.hero_bg || '',
            about_img: data.about_img || '',
            cat_fasteners: data.cat_fasteners || '',
            cat_fittings: data.cat_fittings || '',
            cat_automotive: data.cat_automotive || '',
            stat_dealers: data.stat_dealers || 350,
            stat_years: data.stat_years || 13,
            stat_products: data.stat_products || 120,
            catalogue_pdf: data.catalogue_pdf || '',
            showreel_url: data.showreel_url || '', // 👈 Mapping
            contact_address: data.contact_address || '',
            contact_email: data.contact_email || '',
            contact_phone: data.contact_phone || ''
        });
    } else if (error && error.code === 'PGRST116') {
        await supabase.from('site_content').insert([{ id: 1 }]);
        fetchContent();
    }
    setFetching(false);
  }

  useEffect(() => { fetchContent(); }, []);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) || 0 });
  };

  // File Upload Logic
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    setUploading(fieldName);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${fieldName}-${Date.now()}.${fileExt}`;
      const folder = fieldName === 'catalogue_pdf' ? 'docs' : 'home-images';
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('site-assets').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, [fieldName]: data.publicUrl }));
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(null);
    }
  };

  // Save Data
  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.from('site_content').update(formData).eq('id', 1);
    if (error) alert("Error: " + error.message);
    else alert("Website Updated Successfully!");
    setLoading(false);
  };

  if (fetching) return <div className="p-10 flex items-center gap-2"><Loader className="animate-spin"/> Loading...</div>;

  // Helper for Image
  const ImageUploadField = ({ label, name, value }: any) => (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <label className="text-sm font-bold text-gray-800 mb-2 block">{label}</label>
        <div className="mb-3 h-32 bg-gray-200 rounded-lg overflow-hidden relative border border-gray-300">
           {value ? <img src={value} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon/></div>}
           {uploading === name && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white"><Loader className="animate-spin"/></div>}
        </div>
        <div className="relative">
            <input type="file" id={`f-${name}`} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, name)} disabled={uploading !== null}/>
            <label htmlFor={`f-${name}`} className="block text-center cursor-pointer bg-white border border-gray-300 py-2 rounded-lg text-sm font-bold hover:bg-gray-100">
               {uploading === name ? 'Uploading...' : 'Change Image'}
            </label>
        </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      <div className="flex justify-between items-end border-b pb-6">
        <div><h1 className="text-3xl font-bold">Content Manager</h1><p className="text-gray-500">Edit homepage images, stats, and files.</p></div>
        <button onClick={fetchContent} className="p-2 bg-white border rounded-full hover:bg-gray-50"><RefreshCw size={20}/></button>
      </div>

      {/* 1. IMAGES */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ImageIcon className="text-blue-600"/> Visual Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2"><ImageUploadField label="Hero Banner" name="hero_bg" value={formData.hero_bg} /></div>
            <ImageUploadField label="About Section Image" name="about_img" value={formData.about_img} />
            <ImageUploadField label="Fasteners Category" name="cat_fasteners" value={formData.cat_fasteners} />
            <ImageUploadField label="Fittings Category" name="cat_fittings" value={formData.cat_fittings} />
            <ImageUploadField label="Automotive Category" name="cat_automotive" value={formData.cat_automotive} />
        </div>
      </div>

      {/* 2. STATS & CATALOGUE & SHOWREEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Hash className="text-green-600"/> Company Stats</h2>
            <div className="space-y-4">
                <div><label className="text-sm font-bold text-gray-700">Suppliers</label><input type="number" name="stat_dealers" value={formData.stat_dealers} onChange={handleNumberChange} className="w-full p-2 border rounded-lg"/></div>
                <div><label className="text-sm font-bold text-gray-700">Years Exp.</label><input type="number" name="stat_years" value={formData.stat_years} onChange={handleNumberChange} className="w-full p-2 border rounded-lg"/></div>
                <div><label className="text-sm font-bold text-gray-700">Products</label><input type="number" name="stat_products" value={formData.stat_products} onChange={handleNumberChange} className="w-full p-2 border rounded-lg"/></div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            {/* PDF Upload */}
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="text-red-600"/> PDF Catalogue</h2>
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <input type="file" id="pdf-upload" className="hidden" accept="application/pdf" onChange={(e) => handleFileUpload(e, 'catalogue_pdf')} disabled={uploading !== null}/>
                        <label htmlFor="pdf-upload" className="block w-full text-center bg-gray-50 border border-dashed border-gray-300 py-3 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-100">
                            {uploading === 'catalogue_pdf' ? 'Uploading...' : 'Upload New PDF'}
                        </label>
                    </div>
                    {formData.catalogue_pdf && <a href={formData.catalogue_pdf} target="_blank" className="text-blue-600 text-sm underline font-bold whitespace-nowrap">View Current</a>}
                </div>
            </div>

            {/* 👇 SHOWREEL URL INPUT */}
            <div>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Video className="text-purple-600"/> Showreel Video</h2>
                <label className="text-xs text-gray-500 mb-2 block">Paste YouTube or Video link here</label>
                <input 
                    type="text" 
                    name="showreel_url" 
                    value={formData.showreel_url} 
                    onChange={handleChange} 
                    placeholder="https://youtube.com/..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
            </div>
         </div>
      </div>

      {/* 3. CONTACT INFO */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
         <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Phone className="text-purple-600"/> Contact Info (Footer)</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="text-sm font-bold block mb-1">Phone</label><input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} className="w-full p-2 border rounded-lg"/></div>
            <div><label className="text-sm font-bold block mb-1">Email</label><input type="text" name="contact_email" value={formData.contact_email} onChange={handleChange} className="w-full p-2 border rounded-lg"/></div>
            <div className="md:col-span-2"><label className="text-sm font-bold block mb-1">Address</label><textarea rows={2} name="contact_address" value={formData.contact_address} onChange={handleChange} className="w-full p-2 border rounded-lg"/></div>
         </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
          <button onClick={handleSave} disabled={loading} className="bg-yellow-400 text-black px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform">
             {loading ? <Loader className="animate-spin"/> : <Save/>} Save Changes
          </button>
      </div>
    </div>
  );
};

export default AdminSiteContent;