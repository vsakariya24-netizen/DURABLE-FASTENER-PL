import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import dotenv from 'dotenv';
import path from 'path';

// 🛠️ FIX: Current Working Directory use karein (Yeh hamesha root folder check karega)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log("-----------------------------------------");
console.log("Checking Environment Variables...");
// Check manually from process.env
console.log("URL:", process.env.VITE_SUPABASE_URL ? "✅ Detected" : "❌ MISSING");
console.log("Key:", process.env.VITE_SUPABASE_ANON_KEY ? "✅ Detected" : "❌ MISSING");
console.log("-----------------------------------------");

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error("❌ ERROR: Supabase credentials not found. Build stopped.");
  process.exit(1); 
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function generate() {
  try {
    console.log("🚀 Starting data generation...");

    console.log("Fetching categories...");
    const { data: categories, error: catError } = await supabase.from("categories").select("*");
    if (catError) throw catError;

    console.log("Fetching subcategories...");
    const { data: subs, error: subError } = await supabase.from("sub_categories").select("*");
    if (subError) throw subError;

    console.log("Fetching products...");
    const { data: products, error: prodError } = await supabase.from("products").select("*");
    if (prodError) throw prodError;

    // Ensure directory exists
    if (!fs.existsSync("./public/data")) {
      fs.mkdirSync("./public/data", { recursive: true });
    }

    fs.writeFileSync("./public/data/categories.json", JSON.stringify(categories, null, 2));
    fs.writeFileSync("./public/data/subcategories.json", JSON.stringify(subs, null, 2));
    fs.writeFileSync("./public/data/products.json", JSON.stringify(products, null, 2));

    console.log("✅ Static data generated successfully!");
  } catch (err) {
    console.error("❌ Generation failed:", err.message);
    process.exit(1);
  }
}

generate();