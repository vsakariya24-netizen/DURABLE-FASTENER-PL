import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft, Save, Loader2, Trash2, Upload,
  X, Check, Ruler, Image as ImageIcon,
  LayoutGrid, Settings, Hammer, Plus, Info,
  Search, ListPlus, Activity, ShieldCheck,
  Palette, Box, Tag, Layers
} from 'lucide-react';

// --- TYPES ---
type CategoryStructure = {
  id: string;
  name: string;
  sub_categories: { id: string; name: string }[];
};

type SpecItem = { key: string; value: string };
type DimItem = { label: string; symbol: string; values: Record<string, string>; };
type CertItem = { title: string; subtitle: string };
type MaterialRow = { name: string; grades: string };
type AppItem = { name: string; image: string; loading?: boolean };

// --- CONSTANTS ---
const HEAD_TYPES = ["Bugle Head", "Countersunk (CSK)", "Pan Head", "Wafer Head"];
const DRIVE_TYPES = ["Phillips No.2", "Pozi (PZ)", "Torx (Star)", "Slotted"];
const THREAD_TYPES = ["Fine Thread", "Coarse Thread", "Twinfast", "Hi-Lo"];
const MATERIALS = ["C1022 Hardened Carbon Steel", "Stainless Steel 304", "Mild Steel", "Zinc Alloy", "Aluminium", "Brass"];

const DEFAULT_PERFORMANCE_KEYS = [
  "Core Hardness", "Surface Hardness", "Tensile Strength",
  "Shear Strength", "Salt Spray Resistance", "Installation Speed", "Temperature Range"
];

const AddProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<CategoryStructure[]>([]);
    
  const [materialRows, setMaterialRows] = useState<MaterialRow[]>([{ name: '', grades: '' }]);

  // Expert / SEO Data
  const [expertData, setExpertData] = useState({ seo_keywords: '' });

  // Fitting Specific Data
  const [fittingExtras, setFittingExtras] = useState({
      colors: '',       // "Available Colors"
      general_names: '', // "General Names"
      packing: ''        // "Standard Packing"
  });

  // Main Form Data
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '', 
    sub_category: '',
    material: '',        
    material_grade: '', 
    short_description: '',
    long_description: '',
    images: [] as string[],
    technical_drawing: '', 
    specifications: [] as SpecItem[], 
    dimensional_specifications: [] as DimItem[],
    applications: [] as AppItem[],
    certifications: [] as CertItem[] 
  });

  // Dynamic Specs & Performance
  const [dynamicCoreSpecs, setDynamicCoreSpecs] = useState<SpecItem[]>([
    { key: 'Head Type', value: '' }, { key: 'Drive Type', value: '' }, { key: 'Thread Type', value: '' }
  ]);
  const [availablePerfKeys, setAvailablePerfKeys] = useState<string[]>(DEFAULT_PERFORMANCE_KEYS);
  const [selectedPerformance, setSelectedPerformance] = useState<string[]>([]);
  const [isAddingPerf, setIsAddingPerf] = useState(false);
  const [newPerfName, setNewPerfName] = useState('');

  // Variants & Finishes
  const [sizes, setSizes] = useState<Array<{ diameter: string, length: string }>>([{ diameter: '', length: '' }]);
  const [finishes, setFinishes] = useState<Array<{ name: string, image: string, loading: boolean }>>([{ name: '', image: '', loading: false }]);

  // Detect Fitting Category
  const isFittingCategory = useMemo(() => {
    const cat = formData.category?.toLowerCase() || '';
    const sub = formData.sub_category?.toLowerCase() || '';
    return (
        cat.includes('fitting') || cat.includes('channel') || cat.includes('hinge') || 
        cat.includes('handle') || cat.includes('lock') || cat.includes('hardware') ||
        sub.includes('fitting') || sub.includes('channel')
    );
  }, [formData.category, formData.sub_category]);

  // --- 1. INITIAL FETCH ---
  useEffect(() => {
    const fetchCategories = async () => {
      const { data: cats } = await supabase.from('categories').select('*');
      const { data: subs } = await supabase.from('sub_categories').select('*');
      if (cats && subs) {
         setCategories(cats.map(cat => ({
           id: cat.id, name: cat.name,
           sub_categories: subs.filter(sub => sub.category_id === cat.id)
         })));
      }
    };
    fetchCategories();
  }, []);

  // --- 2. FETCH PRODUCT ---
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        const { data: product, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error || !product) return;

        // Parse Apps
        let loadedApps: AppItem[] = [];
        if (Array.isArray(product.applications)) {
            loadedApps = product.applications.map((app: any) => ({ 
                name: typeof app === 'string' ? app : app.name, 
                image: typeof app === 'object' ? app.image || '' : '' 
            }));
        }

        // Parse Material (Handle | separator)
        if (product.material) {
             const parts = product.material.split('|').map((s: string) => s.trim());
             const rows = parts.map((part: string) => {
                 const match = part.match(/^(.*?)\s*\(Grade\s*([^)]*)\)$/i);
                 return match ? { name: match[1].trim(), grades: match[2].trim() } : { name: part.trim(), grades: '' };
             });
             setMaterialRows(rows.length ? rows : [{ name: '', grades: '' }]);
        }

        const specs = product.specifications || [];
        const getVal = (k:string) => specs.find((s:any) => s.key === k)?.value || '';
        
        setExpertData({ seo_keywords: getVal('seo_keywords') });
        setFittingExtras({
           colors: specs.find((s:any) => s.key === 'Available Colors')?.value || '',
           general_names: specs.find((s:any) => s.key === 'General Names')?.value || '',
           packing: specs.find((s:any) => s.key === 'Standard Packing')?.value || ''
        });

        // Load rest of form data...
        setFormData({
           name: product.name || '',
           slug: product.slug || '',
           category: product.category || '',
           sub_category: product.sub_category || '',
           material: product.material || '',
           material_grade: product.material_grade || '',
           short_description: product.short_description || '',
           long_description: product.long_description || '',
           images: product.images || [],
           technical_drawing: product.technical_drawing || '',
           specifications: specs.filter((s:any) => !['available colors', 'general names', 'standard packing', 'seo_keywords'].includes(s.key.toLowerCase())),
           dimensional_specifications: product.dimensional_specifications || [],
           applications: loadedApps,
           certifications: product.certifications || []
        });

        // Variants
        const { data: variantData } = await supabase.from('product_variants').select('*').eq('product_id', id);
        if (variantData && variantData.length > 0) {
           const uniqueSizes = variantData.reduce((acc: any[], curr) => {
               if (!acc.find(s => s.diameter === curr.diameter && s.length === curr.length)) {
                   if(curr.diameter || curr.length) acc.push({ diameter: curr.diameter, length: curr.length });
               }
               return acc;
           }, []);
           setSizes(uniqueSizes.length ? uniqueSizes : [{ diameter: '', length: '' }]);

           // Extract finishes and map images if they exist
           const uniqueFinishes = variantData.reduce((acc: any[], curr) => {
               if (!acc.find(f => f.name === curr.finish) && curr.finish) {
                   const img = product.finish_images ? product.finish_images[curr.finish] : '';
                   acc.push({ name: curr.finish, image: img, loading: false });
               }
               return acc;
           }, []);
           setFinishes(uniqueFinishes.length ? uniqueFinishes : [{ name: '', image: '', loading: false }]);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  // Sync Material String
  useEffect(() => {
    const combined = materialRows.filter(r => r.name.trim()).map(r => r.grades.trim() ? `${r.name.trim()} (Grade ${r.grades.trim()})` : r.name.trim()).join(' | '); 
    setFormData(prev => ({ ...prev, material: combined }));
  }, [materialRows]);

  // Handlers
  const handleChange = (e: any) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFittingChange = (e: any) => setFittingExtras(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  // File Upload Logic
  const uploadFile = async (file: File, folder: string) => {
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const { error } = await supabase.storage.from('product-images').upload(fileName, file); 
    if (error) throw error;
    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleFinishImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
      if(!e.target.files?.[0]) return;
      const n = [...finishes]; n[idx].loading = true; setFinishes(n);
      try { const url = await uploadFile(e.target.files[0], 'finishes'); n[idx].image = url; } catch(err) { alert('Upload failed'); }
      n[idx].loading = false; setFinishes(n);
  };
  
  const handleAppImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
      if(!e.target.files?.[0]) return;
      const n = [...formData.applications]; n[idx].loading = true; setFormData(p => ({...p, applications: n}));
      try { const url = await uploadFile(e.target.files[0], 'applications'); n[idx].image = url; } catch(err) { alert('Upload failed'); }
      n[idx].loading = false; setFormData(p => ({...p, applications: n}));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try { const url = await uploadFile(e.target.files[0], 'gallery'); setFormData(prev => ({ ...prev, images: [url, ...prev.images] })); } catch(err) { alert('Upload failed'); }
    setUploading(false);
  };

  // Helper arrays update functions
  const updateMaterialRow = (i: number, f: string, v: string) => { const n=[...materialRows]; (n[i] as any)[f]=v; setMaterialRows(n); };
  const addMaterialRow = () => setMaterialRows([...materialRows, {name:'', grades:''}]);
  const removeMaterialRow = (i:number) => setMaterialRows(materialRows.filter((_,idx)=>idx!==i));

  const updateAppName = (i: number, v: string) => { const n=[...formData.applications]; n[i].name=v; setFormData(p=>({...p, applications:n})); };
  const addApp = () => setFormData(p=>({...p, applications:[...p.applications, {name:'', image:''}]}));
  const removeApp = (i:number) => setFormData(p=>({...p, applications:p.applications.filter((_,idx)=>idx!==i)}));

  const handleSizeChange = (i: number, f: string, v: string) => { const n=[...sizes]; (n[i] as any)[f]=v; setSizes(n); };
  const addSizeRow = () => setSizes([...sizes, {diameter:'', length:''}]);
  const removeSizeRow = (i:number) => setSizes(sizes.filter((_,idx)=>idx!==i));

  const handleFinishNameChange = (i: number, v: string) => { const n=[...finishes]; n[i].name=v; setFinishes(n); };
  const addFinishRow = () => setFinishes([...finishes, {name:'', image:'', loading:false}]);
  const removeFinishRow = (i:number) => setFinishes(finishes.filter((_,idx)=>idx!==i));

  const addCert = () => setFormData(p => ({ ...p, certifications: [...p.certifications, { title: 'ISO 9001:2015', subtitle: 'Certified Facility' }] }));
  const removeCert = (idx: number) => setFormData(p => ({ ...p, certifications: p.certifications.filter((_, i) => i !== idx) }));
  const updateCert = (idx: number, field: 'title' | 'subtitle', val: string) => {
      const newCerts = [...formData.certifications];
      newCerts[idx][field] = val;
      setFormData(p => ({ ...p, certifications: newCerts }));
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalSlug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Create Map of Finish Name -> Image URL
    const finishImageMap: Record<string, string> = {};
    finishes.forEach(f => { if(f.name && f.image) finishImageMap[f.name] = f.image; });

    // Merge Specs
    const mergedSpecs = [
        ...formData.specifications,
        { key: 'Available Colors', value: fittingExtras.colors },
        { key: 'General Names', value: fittingExtras.general_names },
        { key: 'Standard Packing', value: fittingExtras.packing },
        { key: 'seo_keywords', value: expertData.seo_keywords }
    ].filter(s => s.value && s.value.trim() !== '');

    const payload = {
      ...formData,
      slug: finalSlug,
      // IMPORTANT: Save the map so frontend can click color -> show image
      finish_images: finishImageMap,
      specifications: mergedSpecs,
      applications: formData.applications.filter(a => a.name.trim()).map(({loading, ...rest}) => rest),
      dimensional_specifications: formData.dimensional_specifications.filter(d => d.label.trim())
    };

    try {
      let productId = id;
      if (isEditMode) {
        const { error } = await supabase.from('products').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('products').insert([payload]).select().single();
        if (error) throw error;
        productId = data.id;
      }

      // Handle Variants (Insert Rows)
      if (productId) {
        await supabase.from('product_variants').delete().eq('product_id', productId);
        const validSizes = sizes.filter(s => s.diameter || s.length);
        const validFinishes = finishes.filter(f => f.name);
        const variantsToInsert: any[] = [];

        // Logic to create cartesian product of sizes x finishes
        if (validSizes.length > 0) {
            validSizes.forEach(size => {
                if (validFinishes.length > 0) {
                    validFinishes.forEach(finish => { 
                        variantsToInsert.push({ product_id: productId, diameter: size.diameter, length: size.length, finish: finish.name }); 
                    });
                } else {
                    variantsToInsert.push({ product_id: productId, diameter: size.diameter, length: size.length, finish: '' });
                }
            });
        } else if (validFinishes.length > 0) {
            validFinishes.forEach(finish => variantsToInsert.push({ product_id: productId, diameter: '', length: '', finish: finish.name }));
        }

        if (variantsToInsert.length > 0) await supabase.from('product_variants').insert(variantsToInsert);
      }
      navigate('/admin/products');
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally { setLoading(false); }
  };

  // --- RENDER (Abbreviated Layout for Cleanliness) ---
  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-200 rounded-full"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <h3 className="font-bold mb-4 flex items-center gap-2"><Check size={18} className="text-blue-600"/> Basic Info</h3>
             <div className="grid grid-cols-2 gap-6 mb-4">
                 <div className="col-span-2 md:col-span-1"><label className="block text-sm font-bold">Product Name</label><input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required /></div>
                 <div><label className="block text-sm font-bold">Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded"><option value="">Select...</option>{categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
                 <div><label className="block text-sm font-bold">Sub Category</label><select name="sub_category" value={formData.sub_category} onChange={handleChange} className="w-full border p-2 rounded"><option value="">Select...</option>{categories.find(c=>c.name===formData.category)?.sub_categories.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
             </div>
             <div className="mb-4"><label className="text-xs font-bold text-gray-500">SEO Keywords</label><input name="seo_keywords" value={expertData.seo_keywords} onChange={(e)=>setExpertData({seo_keywords:e.target.value})} className="w-full border p-2 rounded bg-gray-50"/></div>
        </div>

        {/* Certifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold flex gap-2"><ShieldCheck size={18}/> Certifications</h3><button type="button" onClick={addCert} className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded font-bold">+ Add</button></div>
            {formData.certifications.map((c,i)=>(<div key={i} className="flex gap-2 mb-2"><input value={c.title} onChange={e=>updateCert(i,'title',e.target.value)} placeholder="ISO 9001" className="border p-2 rounded w-1/3"/><input value={c.subtitle} onChange={e=>updateCert(i,'subtitle',e.target.value)} placeholder="Certified" className="border p-2 rounded flex-1"/><button type="button" onClick={()=>removeCert(i)}><Trash2 size={16} className="text-red-500"/></button></div>))}
        </div>

        {/* Architectural DNA (Fittings) */}
        {isFittingCategory && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                <h3 className="font-bold mb-4 flex gap-2"><LayoutGrid size={18} className="text-orange-500"/> Architectural DNA</h3>
                
                {/* Material */}
                <div className="mb-4">
                    <label className="text-xs font-bold uppercase block mb-1">Material Composition</label>
                    {materialRows.map((r,i)=>(<div key={i} className="flex gap-2 mb-2"><input value={r.name} onChange={e=>updateMaterialRow(i,'name',e.target.value)} placeholder="Material" className="border p-2 rounded flex-1"/><button type="button" onClick={()=>removeMaterialRow(i)}><Trash2 size={16}/></button></div>))}
                    <button type="button" onClick={addMaterialRow} className="text-xs text-blue-600 font-bold">+ Add Material</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold uppercase block">Available Colors</label><input name="colors" value={fittingExtras.colors} onChange={handleFittingChange} placeholder="Gold, Silver..." className="w-full border p-2 rounded bg-orange-50/30"/></div>
                    <div><label className="text-xs font-bold uppercase block">Standard Packing</label><input name="packing" value={fittingExtras.packing} onChange={handleFittingChange} placeholder="100 pcs/box" className="w-full border p-2 rounded bg-orange-50/30"/></div>
                    <div className="col-span-2"><label className="text-xs font-bold uppercase block">General Names</label><input name="general_names" value={fittingExtras.general_names} onChange={handleFittingChange} placeholder="Tags..." className="w-full border p-2 rounded bg-orange-50/30"/></div>
                </div>
            </div>
        )}

        {/* Applications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold flex gap-2"><LayoutGrid size={18}/> Applications</h3><button type="button" onClick={addApp} className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded font-bold">+ Add</button></div>
            <div className="grid grid-cols-2 gap-4">
                {formData.applications.map((app,i)=>(
                    <div key={i} className="flex items-center gap-3 border p-2 rounded">
                        <div className="w-12 h-12 bg-gray-100 relative rounded overflow-hidden">
                            {app.image && <img src={app.image} className="w-full h-full object-cover"/>}
                            {app.loading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 size={12} className="animate-spin"/></div>}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e=>handleAppImageUpload(e,i)}/>
                        </div>
                        <input value={app.name} onChange={e=>updateAppName(i,e.target.value)} placeholder="App Name" className="border p-1 rounded flex-1 text-sm"/>
                        <button type="button" onClick={()=>removeApp(i)}><Trash2 size={16} className="text-red-400"/></button>
                    </div>
                ))}
            </div>
        </div>

        {/* Dimensions & Models */}
        <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold">Models (Sizes)</h3><button type="button" onClick={addSizeRow} className="text-blue-600 text-sm font-bold">+ Add Row</button></div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                    <div className="flex gap-2 text-xs font-bold uppercase text-gray-500">
                        <span className="w-24">Model Code</span><span className="flex-1">Design/Type</span>
                    </div>
                    {sizes.map((s,i)=>(<div key={i} className="flex gap-2"><input value={s.diameter} onChange={e=>handleSizeChange(i,'diameter',e.target.value)} className="w-24 border p-1 rounded"/><input value={s.length} onChange={e=>handleSizeChange(i,'length',e.target.value)} className="flex-1 border p-1 rounded"/><button type="button" onClick={()=>removeSizeRow(i)}><Trash2 size={16}/></button></div>))}
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold">Finishes (Variants)</h3><button type="button" onClick={addFinishRow} className="text-purple-600 text-sm font-bold">+ Add Finish</button></div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                    {finishes.map((f,i)=>(
                        <div key={i} className="flex gap-2 items-center border p-2 rounded">
                            <div className="w-10 h-10 bg-gray-100 relative rounded overflow-hidden">
                                {f.image && <img src={f.image} className="w-full h-full object-cover"/>}
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e=>handleFinishImageUpload(e,i)}/>
                            </div>
                            <input value={f.name} onChange={e=>handleFinishNameChange(i,e.target.value)} placeholder="Finish Name" className="flex-1 border p-1 rounded"/>
                            <button type="button" onClick={()=>removeFinishRow(i)}><Trash2 size={16} className="text-red-400"/></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Gallery */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold mb-4">Gallery</h3>
            <div className="flex flex-wrap gap-4">
                {formData.images.map((img,i)=>(<div key={i} className="w-24 h-24 relative border rounded overflow-hidden group"><img src={img} className="w-full h-full object-cover"/><button type="button" onClick={()=>setFormData(p=>({...p, images:p.images.filter((_,x)=>x!==i)}))} className="absolute top-1 right-1 bg-white text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100"><X size={12}/></button></div>))}
                <label className="w-24 h-24 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">{uploading?<Loader2 className="animate-spin"/>:<Upload className="text-gray-400"/>}<span className="text-xs">Upload</span><input type="file" className="hidden" onChange={handleImageUpload}/></label>
            </div>
        </div>

        <div className="flex justify-end"><button type="submit" disabled={loading} className="bg-black text-white px-8 py-3 rounded font-bold flex gap-2 hover:bg-gray-800">{loading?<Loader2 className="animate-spin"/>:<Save/>} Save Product</button></div>
      </form>
    </div>
  );
};

export default AddProduct;