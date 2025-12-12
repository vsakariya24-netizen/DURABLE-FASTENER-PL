import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft, Save, Loader2, Trash2, Upload,
  X, Check, Ruler, Image as ImageIcon,
  LayoutGrid, Settings, Hammer, Plus
} from 'lucide-react';

type CategoryStructure = {
  id: string;
  name: string;
  sub_categories: { id: string; name: string }[];
};

type SpecItem = { key: string; value: string };
type DimItem = { label: string; symbol: string; value: string };
type MaterialRow = { name: string; grades: string };
// NEW: Type for Application with Image
type AppItem = { name: string; image: string; loading?: boolean };

const AddProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<CategoryStructure[]>([]);
  
  const [materialRows, setMaterialRows] = useState<MaterialRow[]>([{ name: '', grades: '' }]);

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '', 
    sub_category: '',
    material: '',        
    material_grade: '', 
    head_type: '',
    drive_type: '',      
    thread_type: '',
    short_description: '',
    long_description: '',
    images: [] as string[],
    technical_drawing: '', 
    specifications: [] as SpecItem[], 
    dimensional_specifications: [] as DimItem[],
    // UPDATED: Applications is now an array of objects
    applications: [] as AppItem[] 
  });

  const [sizes, setSizes] = useState<Array<{ diameter: string, length: string }>>([{ diameter: '', length: '' }]);
  const [finishes, setFinishes] = useState<Array<{ name: string, image: string, loading: boolean }>>([{ name: '', image: '', loading: false }]);

  // 1. Fetch Categories
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

  // 2. Fetch Product Data
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        const { data: product, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) { console.error("Error fetching product:", error); return; }

        if (product) {
          // --- HANDLE APPLICATIONS PARSING (String vs Object) ---
          let loadedApps: AppItem[] = [];
          if (Array.isArray(product.applications)) {
             loadedApps = product.applications.map((app: any) => {
                 // If old data (string), convert to object
                 if (typeof app === 'string') return { name: app, image: '' };
                 return { name: app.name, image: app.image || '' };
             });
          }

          // Material Parsing
          let parsedRows: MaterialRow[] = [{ name: '', grades: '' }];
          if (product.material) {
             const smartSplitRegex = /\s*\|\s*(?![^()]*\))/g;
             let rawParts = (product.material.match(smartSplitRegex) || product.material.includes('|')) 
                ? product.material.split(smartSplitRegex).map((s: string) => s.trim())
                : product.material.split(',').map((s: string) => s.trim());
             
             parsedRows = rawParts.map((part: string) => {
                const match = part.match(/^(.*?)\s*\(Grade\s*([^)]*)\)$/i);
                return match ? { name: match[1].trim(), grades: match[2].trim() } : { name: part.replace(/\(Grade.*?\)/, '').trim(), grades: '' };
             });
          }
          setMaterialRows(parsedRows.length > 0 ? parsedRows : [{ name: '', grades: '' }]);

          setFormData({
            name: product.name || '',
            slug: product.slug || '',
            category: product.category || '',
            sub_category: product.sub_category || '',
            material: product.material || '',
            material_grade: product.material_grade || '',
            head_type: product.head_type || '',
            drive_type: product.drive_type || '',
            thread_type: product.thread_type || '',
            short_description: product.short_description || '',
            long_description: product.long_description || '',
            images: product.images || [],
            technical_drawing: product.technical_drawing || '',
            specifications: Array.isArray(product.specifications) ? product.specifications : [],
            dimensional_specifications: Array.isArray(product.dimensional_specifications) ? product.dimensional_specifications : [],
            applications: loadedApps 
          });

          // Fetch Variants logic...
          const { data: variantData } = await supabase.from('product_variants').select('*').eq('product_id', id);
          if (variantData && variantData.length > 0) {
            const uniqueSizes = variantData.reduce((acc: any[], curr) => {
                const exists = acc.find(s => s.diameter === curr.diameter && s.length === curr.length);
                if (!exists && (curr.diameter || curr.length)) acc.push({ diameter: curr.diameter, length: curr.length });
                return acc;
            }, []);
            setSizes(uniqueSizes.length ? uniqueSizes : [{ diameter: '', length: '' }]);

            const uniqueFinishes = variantData.reduce((acc: any[], curr) => {
                const exists = acc.find(f => f.name === curr.finish);
                if (!exists && curr.finish) {
                    const img = product.finish_images ? product.finish_images[curr.finish] : '';
                    acc.push({ name: curr.finish, image: img, loading: false });
                }
                return acc;
            }, []);
            setFinishes(uniqueFinishes.length ? uniqueFinishes : [{ name: '', image: '', loading: false }]);
          }
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  // Material Builder Logic
  useEffect(() => {
      const combinedMaterials = materialRows
          .filter(r => r.name.trim() !== '')
          .map(r => r.grades.trim() ? `${r.name} (Grade ${r.grades})` : r.name)
          .join(' | '); 
      setFormData(prev => ({ ...prev, material: combinedMaterials }));
  }, [materialRows]);

  const addMaterialRow = () => setMaterialRows([...materialRows, { name: '', grades: '' }]);
  const removeMaterialRow = (idx: number) => setMaterialRows(materialRows.filter((_, i) => i !== idx));
  const updateMaterialRow = (idx: number, field: 'name' | 'grades', val: string) => {
      const newRows = [...materialRows];
      newRows[idx][field] = val;
      setMaterialRows(newRows);
  };

  // Standard Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSpec = () => setFormData(p => ({ ...p, specifications: [...p.specifications, { key: '', value: '' }] }));
  const removeSpec = (idx: number) => setFormData(p => ({ ...p, specifications: p.specifications.filter((_, i) => i !== idx) }));
  const updateSpec = (idx: number, field: 'key'|'value', val: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[idx][field] = val;
    setFormData(p => ({ ...p, specifications: newSpecs }));
  };

  const addDim = () => setFormData(p => ({ ...p, dimensional_specifications: [...p.dimensional_specifications, { label: '', symbol: '', value: '' }] }));
  const removeDim = (idx: number) => setFormData(p => ({ ...p, dimensional_specifications: p.dimensional_specifications.filter((_, i) => i !== idx) }));
  const updateDim = (idx: number, field: 'label'|'symbol'|'value', val: string) => {
    const newDims = [...formData.dimensional_specifications];
    newDims[idx][field] = val;
    setFormData(p => ({ ...p, dimensional_specifications: newDims }));
  };

  // --- NEW APPLICATION HANDLERS ---
  const addApp = () => setFormData(p => ({ ...p, applications: [...p.applications, { name: '', image: '' }] }));
  
  const updateAppName = (idx: number, val: string) => { 
    const newApps = [...formData.applications]; 
    newApps[idx].name = val; 
    setFormData(p => ({ ...p, applications: newApps })); 
  };
  
  const removeApp = (idx: number) => setFormData(p => ({ ...p, applications: p.applications.filter((_, i) => i !== idx) }));

  const handleAppImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    if (!e.target.files?.[0]) return;
    
    // Set loading state for specific app row
    const newApps = [...formData.applications];
    newApps[idx].loading = true;
    setFormData(p => ({ ...p, applications: newApps }));

    try {
      const url = await uploadFile(e.target.files[0], 'applications');
      newApps[idx].image = url;
    } catch(err) { 
      alert('Application image upload failed'); 
    }
    
    newApps[idx].loading = false;
    setFormData(p => ({ ...p, applications: newApps }));
  };
  // --------------------------------

  const uploadFile = async (file: File, folder: string) => {
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const { error } = await supabase.storage.from('product-images').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const url = await uploadFile(e.target.files[0], 'gallery');
      setFormData(prev => ({ ...prev, images: [url, ...prev.images] }));
    } catch(err) { alert('Upload failed'); }
    setUploading(false);
  };

  const handleTechDrawingUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const url = await uploadFile(e.target.files[0], 'tech');
      setFormData(prev => ({ ...prev, technical_drawing: url }));
    } catch(err) { alert('Upload failed'); }
    setUploading(false);
  };

  const addSizeRow = () => setSizes([...sizes, { diameter: '', length: '' }]);
  const removeSizeRow = (idx: number) => setSizes(sizes.filter((_, i) => i !== idx));
  const handleSizeChange = (idx: number, field: 'diameter'|'length', val: string) => { const n = [...sizes]; n[idx][field] = val; setSizes(n); };

  const addFinishRow = () => setFinishes([...finishes, { name: '', image: '', loading: false }]);
  const removeFinishRow = (idx: number) => setFinishes(finishes.filter((_, i) => i !== idx));
  const handleFinishNameChange = (idx: number, val: string) => { const n = [...finishes]; n[idx].name = val; setFinishes(n); };
  const handleFinishImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
     if(!e.target.files?.[0]) return;
     const n = [...finishes]; n[idx].loading = true; setFinishes(n);
     try {
       const url = await uploadFile(e.target.files[0], 'finishes');
       n[idx].image = url;
     } catch(err) { alert('Finish upload failed'); }
     n[idx].loading = false; setFinishes(n);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalSlug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const finishImageMap: Record<string, string> = {};
    finishes.forEach(f => { if(f.name && f.image) finishImageMap[f.name] = f.image; });

    const payload = {
      ...formData,
      slug: finalSlug,
      finish_images: finishImageMap,
      // Ensure we clean up applications before sending
      applications: formData.applications.filter(a => a.name.trim() !== '').map(({loading, ...rest}) => rest),
      specifications: formData.specifications.filter(s => s.key.trim() !== '' && s.value.trim() !== ''),
      dimensional_specifications: formData.dimensional_specifications.filter(d => d.label.trim() !== '' && d.value.trim() !== '')
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

      if (productId) {
        await supabase.from('product_variants').delete().eq('product_id', productId);
        
        const validSizes = sizes.filter(s => s.diameter || s.length);
        const validFinishes = finishes.filter(f => f.name);
        const variantsToInsert: any[] = [];

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
      console.error("Save Error:", error);
      alert('Failed to save product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const activeSubCategories = categories.find(c => c.name === formData.category)?.sub_categories || [];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2"><Check size={18} className="text-blue-600" /> Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
             <div><label className="block text-sm font-bold mb-1">Product Name</label><input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required /></div>
             <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-sm font-bold mb-1">Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg"><option value="">Select...</option>{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
                <div><label className="block text-sm font-bold mb-1">Sub Category</label><select name="sub_category" value={formData.sub_category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg"><option value="">Select...</option>{activeSubCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
             </div>
          </div>
          <textarea name="short_description" value={formData.short_description} onChange={handleChange} placeholder="Short Description" className="w-full px-4 py-2 border rounded-lg mb-4" rows={2} />
          <textarea name="long_description" value={formData.long_description} onChange={handleChange} placeholder="Long Description" className="w-full px-4 py-2 border rounded-lg" rows={4} />
        </div>

        {/* --- CORE ATTRIBUTES with MATERIAL BUILDER --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <div className="flex justify-between items-center mb-4 border-b pb-2">
               <h3 className="font-bold text-gray-900 flex items-center gap-2"><Hammer size={18} /> Core Specifications</h3>
             </div>
             
             {/* 1. MATERIAL BUILDER SECTION */}
             <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                 <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Material Composition (Multi-Box)</label>
                    <button type="button" onClick={addMaterialRow} className="text-xs bg-black text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-gray-800"><Plus size={12}/> Add Material</button>
                 </div>
                 
                 <div className="space-y-2">
                     {materialRows.map((row, idx) => (
                         <div key={idx} className="flex gap-2 items-start">
                             <div className="flex-1">
                                 <input 
                                     value={row.name} 
                                     onChange={(e) => updateMaterialRow(idx, 'name', e.target.value)} 
                                     placeholder="Material Name (e.g. Mild Steel)" 
                                     className="w-full px-3 py-2 border rounded-md text-sm" 
                                 />
                             </div>
                             <div className="flex-1">
                                 <input 
                                     value={row.grades} 
                                     onChange={(e) => updateMaterialRow(idx, 'grades', e.target.value)} 
                                     placeholder="Grades (e.g. 1022, 1018)" 
                                     className="w-full px-3 py-2 border rounded-md text-sm" 
                                 />
                             </div>
                             {materialRows.length > 1 && (
                                 <button type="button" onClick={() => removeMaterialRow(idx)} className="p-2 text-red-400 hover:text-red-600">
                                     <Trash2 size={16}/>
                                 </button>
                             )}
                         </div>
                     ))}
                 </div>
                 {/* Preview */}
                 <div className="mt-2 text-[10px] text-gray-400">
                    Preview: <span className="font-mono text-gray-600">{formData.material || '(No material added)'}</span>
                 </div>
             </div>

             {/* 2. OTHER ATTRIBUTES */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Head Type</label>
                    <input name="head_type" value={formData.head_type} onChange={handleChange} placeholder="e.g. Countersunk" className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Drive Type</label>
                    <input name="drive_type" value={formData.drive_type} onChange={handleChange} placeholder="e.g. Phillips" className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Thread Type</label>
                    <input name="thread_type" value={formData.thread_type} onChange={handleChange} placeholder="e.g. Coarse" className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
                </div>
             </div>
        </div>

        {/* Blueprint Data */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-amber-500">
             <div className="flex justify-between items-center mb-4 border-b pb-2">
               <h3 className="font-bold text-gray-900 flex items-center gap-2"><Ruler size={18} /> Blueprint Data</h3>
               <button type="button" onClick={addDim} className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded hover:bg-amber-200">+ Add Row</button>
             </div>
             <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex items-center gap-6">
                <div className="w-32 h-20 bg-white border flex items-center justify-center overflow-hidden rounded">
                    {formData.technical_drawing ? <img src={formData.technical_drawing} className="w-full h-full object-contain mix-blend-multiply" /> : <ImageIcon className="text-gray-300" />}
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Technical Drawing Image</label>
                    <input type="file" onChange={handleTechDrawingUpload} className="text-sm" />
                </div>
             </div>
             <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-400 uppercase">
                    <div className="col-span-4">Feature Name</div><div className="col-span-3">Symbol</div><div className="col-span-4">Value</div><div className="col-span-1"></div>
                </div>
                {formData.dimensional_specifications.map((dim, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4"><input value={dim.label} onChange={(e) => updateDim(idx, 'label', e.target.value)} placeholder="Head Dia" className="w-full px-3 py-2 border rounded-lg" /></div>
                        <div className="col-span-3"><input value={dim.symbol} onChange={(e) => updateDim(idx, 'symbol', e.target.value)} placeholder="dk" className="w-full px-3 py-2 border rounded-lg font-mono" /></div>
                        <div className="col-span-4"><input value={dim.value} onChange={(e) => updateDim(idx, 'value', e.target.value)} placeholder="8.0mm" className="w-full px-3 py-2 border rounded-lg font-mono" /></div>
                        <div className="col-span-1 text-center"><button type="button" onClick={() => removeDim(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button></div>
                    </div>
                ))}
             </div>
        </div>

        {/* Additional Specs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <div className="flex justify-between items-center mb-4 border-b pb-2">
               <h3 className="font-bold text-gray-900 flex items-center gap-2"><Settings size={18} /> Additional Specs</h3>
               <button type="button" onClick={addSpec} className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded hover:bg-blue-200">+ Add Spec</button>
             </div>
             <div className="space-y-3">
                 {formData.specifications.map((spec, idx) => (
                     <div key={idx} className="flex gap-4">
                         <input value={spec.key} onChange={(e) => updateSpec(idx, 'key', e.target.value)} placeholder="Label (e.g. Tensile Strength)" className="flex-1 px-3 py-2 border rounded-lg" />
                         <input value={spec.value} onChange={(e) => updateSpec(idx, 'value', e.target.value)} placeholder="Value" className="flex-1 px-3 py-2 border rounded-lg" />
                         <button type="button" onClick={() => removeSpec(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                     </div>
                 ))}
             </div>
        </div>

        {/* --- UPDATED APPLICATIONS SECTION --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex justify-between items-center mb-4 border-b pb-2">
             <h3 className="font-bold text-gray-900 flex items-center gap-2"><LayoutGrid size={18} /> Applications & Icons</h3>
             <button type="button" onClick={addApp} className="text-xs bg-green-100 text-green-800 font-bold px-3 py-1 rounded hover:bg-green-200">+ Add Application</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {formData.applications.map((app, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                   {/* Image Upload Area */}
                   <div className="relative w-14 h-14 bg-white border border-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden group">
                       {app.image ? (
                           <img src={app.image} className="w-full h-full object-cover" />
                       ) : (
                           <ImageIcon size={20} className="text-gray-300" />
                       )}
                       {app.loading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 size={16} className="animate-spin text-green-600"/></div>}
                       
                       {/* Upload Input Overlay */}
                       <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white">
                           <Upload size={16} />
                           <input type="file" className="hidden" onChange={(e) => handleAppImageUpload(e, idx)} />
                       </label>
                   </div>

                   {/* Text Input */}
                   <div className="flex-1">
                       <label className="text-[10px] uppercase font-bold text-gray-400">App Name</label>
                       <input value={app.name} onChange={(e) => updateAppName(idx, e.target.value)} placeholder="e.g. Furniture" className="w-full px-2 py-1 border rounded text-sm" />
                   </div>

                   <button type="button" onClick={() => removeApp(idx)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                </div>
             ))}
           </div>
        </div>

        {/* Sizes & Finishes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold">Dimensions (Variants)</h3><button type="button" onClick={addSizeRow} className="text-blue-600 text-sm font-bold">+ Add Size</button></div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {sizes.map((s, idx) => (
                        <div key={idx} className="flex gap-2"><input value={s.diameter} onChange={e=>handleSizeChange(idx,'diameter',e.target.value)} placeholder="Dia" className="w-20 px-2 py-1 border rounded" /><input value={s.length} onChange={e=>handleSizeChange(idx,'length',e.target.value)} placeholder="Len" className="flex-1 px-2 py-1 border rounded" /><button type="button" onClick={()=>removeSizeRow(idx)}><Trash2 size={16} className="text-red-400"/></button></div>
                    ))}
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold">Finishes (Variants)</h3><button type="button" onClick={addFinishRow} className="text-purple-600 text-sm font-bold">+ Add Finish</button></div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {finishes.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-2 border p-2 rounded">
                            <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden relative"><img src={f.image} className="w-full h-full object-cover"/><input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e=>handleFinishImageUpload(e, idx)}/></div>
                            <input value={f.name} onChange={e=>handleFinishNameChange(idx,e.target.value)} placeholder="Finish" className="flex-1 px-2 py-1 border rounded" />
                            <button type="button" onClick={()=>removeFinishRow(idx)}><Trash2 size={16} className="text-red-400"/></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Gallery */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold mb-4">Product Gallery</h3>
            <div className="flex flex-wrap gap-4">
                {formData.images.map((img, idx) => (
                    <div key={idx} className="w-24 h-24 border rounded overflow-hidden relative group">
                        <img src={img} className="w-full h-full object-cover"/>
                        <button type="button" onClick={()=>setFormData(p=>({...p, images: p.images.filter((_, i)=>i!==idx)}))} className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100"><X size={12}/></button>
                    </div>
                ))}
                <label className="w-24 h-24 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                    {uploading ? <Loader2 className="animate-spin"/> : <Upload className="text-gray-400"/>}
                    <span className="text-xs text-gray-500 mt-1">Upload</span>
                    <input type="file" className="hidden" onChange={handleImageUpload}/>
                </label>
            </div>
        </div>

        <div className="flex justify-end pb-10">
            <button type="submit" disabled={loading} className="bg-black text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin"/> : <Save size={20}/>} {isEditMode ? 'Update Product' : 'Save Product'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;