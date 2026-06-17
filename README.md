# AJ's Preloved Item — Setup Guide

A static storefront + admin panel that runs entirely from GitHub Pages, with Supabase as the backend.

## Files

| File | Purpose |
|---|---|
| `index.html` | Public storefront — your buyers see this |
| `admin.html` | Password-protected admin panel — upload and manage listings |
| `config.js` | Your Supabase credentials and admin password |

---

## Step 1 — Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign up (free).
2. Click **New project**, give it a name (e.g. `ajs-preloved`), set a database password, choose a region close to Malaysia (Singapore works).
3. Wait for the project to spin up (~1–2 min).

---

## Step 2 — Create the `products` table

In your Supabase project, go to **SQL Editor** and run:

```sql
create table products (
  id          bigint generated always as identity primary key,
  created_at  timestamptz default now(),
  title       text        not null,
  price       numeric     not null,
  category    text        not null,
  condition   text,
  size        text,
  description text,
  location    text,
  sold        boolean     default false,
  images      text        default '[]'   -- JSON array of image URLs
);

-- Allow public read access (your storefront needs this)
alter table products enable row level security;

create policy "Public can read products"
  on products for select
  using (true);

-- Allow anon users to insert / update / delete
-- (admin.html uses the anon key; the password gate keeps it semi-private)
create policy "Anon can insert products"
  on products for insert
  with check (true);

create policy "Anon can update products"
  on products for update
  using (true);

create policy "Anon can delete products"
  on products for delete
  using (true);
```

---

## Step 3 — Create a Storage bucket for images

1. In Supabase, go to **Storage** → **New bucket**.
2. Name it exactly: `product-images`
3. Toggle **Public bucket** ON (so the images can be embedded in your storefront).
4. Click **Create bucket**.

Then add a storage policy so the anon key can upload:

Go to **Storage → Policies → product-images** and add:

| Operation | Policy name | Definition |
|---|---|---|
| SELECT | Public read | `true` |
| INSERT | Anon upload | `true` |
| DELETE | Anon delete | `true` |

Or run this in SQL Editor:

```sql
create policy "Public read images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

create policy "Anon upload images"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' );

create policy "Anon delete images"
  on storage.objects for delete
  using ( bucket_id = 'product-images' );
```

---

## Step 4 — Fill in `config.js`

Open `config.js` and replace the placeholder values:

- **SUPABASE_URL** — Supabase dashboard → Settings → API → Project URL
- **SUPABASE_ANON_KEY** — Supabase dashboard → Settings → API → anon public key
- **ADMIN_PASSWORD** — pick something strong; this is what you type on admin.html
- **STORAGE_BUCKET** — leave as `product-images` unless you named it differently

---

## Step 5 — Deploy to GitHub Pages

1. Create a new GitHub repository (public is fine — your anon key is safe to expose).
2. Push all three files (`index.html`, `admin.html`, `config.js`).
3. In the repo settings → **Pages** → source: **Deploy from a branch** → branch: `main` → folder: `/ (root)`.
4. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

---

## Using the admin panel

1. Go to `https://YOUR_SITE/admin.html`
2. Enter your password from `config.js`
3. Fill in the listing form and upload photos (up to 5 per listing)
4. Click **Add Listing** — it appears on the storefront immediately
5. To edit or mark as sold, find the listing on the right and click **Edit**

---

## Adding more categories

Edit the filter buttons in `index.html` (the `.filters` div) and the `<select id="fCategory">` dropdown in `admin.html`.

---

## Notes

- The admin password in `config.js` is a simple client-side gate — good enough to keep strangers out, but not a substitute for proper auth. Don't store sensitive personal data in Supabase via this setup.
- Images are stored in Supabase Storage (free tier: 1 GB). Each photo should be kept under 5 MB.
- The storefront reads products in real time from Supabase — no rebuild needed after adding listings.
