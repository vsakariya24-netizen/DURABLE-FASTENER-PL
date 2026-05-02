import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// .env file load karne ke liye
dotenv.config();

const STATIC_URLS = [
  'https://durablefastener.com/',
  'https://durablefastener.com/products',
  'https://durablefastener.com/manufacturing',
  'https://durablefastener.com/about',
  'https://durablefastener.com/blog',
  'https://durablefastener.com/contact'
];

async function generateSitemap() {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials missing in .env file");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetching data from Supabase
    const { data: blogs } = await supabase.from('blogs').select('slug');
    const { data: products } = await supabase.from('products').select('slug');

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${STATIC_URLS.map(url => `
  <url>
    <loc>${url}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}

  ${blogs ? blogs.map(blog => `
  <url>
    <loc>https://durablefastener.com/blog/${blog.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('') : ''}

  ${products ? products.map(product => `
  <url>
    <loc>https://durablefastener.com/product/${product.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('') : ''}
</urlset>`;

    // Public folder mein sitemap save karein
    fs.writeFileSync('public/sitemap.xml', sitemapContent);
    console.log('✅ Success: Dynamic sitemap generated successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

generateSitemap();