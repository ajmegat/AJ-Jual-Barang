// ─────────────────────────────────────────────────────────────────
// config.js — AJ's Preloved Item
//
// Fill in your Supabase project details below.
// How to find them:
//   1. Go to https://supabase.com → your project
//   2. Settings → API
//   3. Copy "Project URL" and "anon public" key
//
// IMPORTANT: This file will be public if you host on GitHub Pages.
// The anon key is safe to expose — it is controlled by Row Level
// Security (RLS) policies. Never put your service_role key here.
// ─────────────────────────────────────────────────────────────────

window.SUPABASE_URL      = 'https://YOUR_PROJECT_ID.supabase.co';
window.SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

// Admin password for admin.html
// This is a simple client-side gate — it keeps casual visitors out
// but is not a replacement for real auth. Keep this secret.
window.ADMIN_PASSWORD = 'changeme123';

// Supabase Storage bucket name (create this in your Supabase dashboard)
window.STORAGE_BUCKET = 'product-images';
