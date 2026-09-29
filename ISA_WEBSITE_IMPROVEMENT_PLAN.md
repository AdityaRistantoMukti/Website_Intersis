# 🏭 IMPROVEMENT PLAN — Website PT. Global Philsonic Technologies (GPT)
## Unit Bisnis PT. Intersis Sejahtera Abadi (ISA) — Versi 2.0 Final

> **Konteks Penting**: GPT (PT. Global Philsonic Technologies) adalah **unit bisnis dari PT. ISA**.
> Tugas kita bukan membuat website dari nol, melainkan **meng-improve & merombak** website GPT yang sudah ada
> di `globalphilsonics.com/isa` menjadi platform yang jauh lebih modern, lengkap, dan profesional.
>
> **Referensi yang dianalisis**:
> - Website GPT (lama): https://www.globalphilsonics.com/isa/
> - Website ISA (parent company): https://intersis.co.id/isa/
> - Backend yang sudah dibangun: Node.js + Express + MySQL (Fase 1-6 ✅ Selesai)

---

## 📌 Ringkasan Eksekutif

| Item | Detail |
|---|---|
| **Unit Bisnis** | PT. Global Philsonic Technologies (GPT) |
| **Parent Company** | PT. Intersis Sejahtera Abadi (ISA) |
| **Bidang Usaha GPT** | Automotive Electronics — OEM/ODM Manufacturing & Assembly |
| **Produk GPT** | Automation Robot, Car Electronics Assembly, Car Headunit, Amplifier, Subwoofer, DSP, Mobile Device |
| **Lokasi** | Komplek Tanah Mas Blok L No.2, Batam City, Riau Island |
| **Website Lama** | globalphilsonics.com/isa — WordPress, outdated, tidak ada career |
| **Website Baru** | React.js SPA — Business Profile + Products + Automation + Career |
| **Bahasa** | 🌐 **Bilingual: Indonesia & English** |
| **Asset** | Dummy logo & gambar (sementara untuk demo) |
| **Apply Now** | Placeholder button (Google Form belum ada) |
| **Deploy** | Vercel (untuk demo ke atasan) → pindah ke hosting berbayar jika diapprove |
| **Status Backend** | ✅ SELESAI (Fase 1-6 — Career & HRD module sudah jadi) |

---

## 🏛️ STRUKTUR ORGANISASI (Konteks)

```
PT. Intersis Sejahtera Abadi (ISA) — Parent Company
│   Website: intersis.co.id/isa
│   Bisnis: Importir & distributor elektronik otomotif premium
│   Brand yang dipegang: Zapco, Arc Audio, MB Quart, Dynaudio, Stinger, dll.
│
├── PT. Global Philsonic Technologies (GPT) ← WEBSITE INI
│   Website lama: globalphilsonics.com/isa
│   Bisnis: OEM/ODM Manufacturing & Assembly otomotif elektronik
│   Produk: Automation Robot, Car Headunit, Amplifier, Subwoofer, DSP, dll.
│
├── ASUKA (brand)
├── BEGJA Autotronics
├── INTERSYS
├── Massindo Mentari
├── MediaAudio.id
└── Nexindo Global
```

---

## 🔍 APA YANG AKAN KITA IMPROVE?

### Website Lama GPT (globalphilsonics.com/isa) — Inventory Masalah

| Kategori | Masalah | Severity |
|---|---|---|
| **Design** | Tampilan outdated (style 2012), warna tidak konsisten, tidak ada design system | 🔴 CRITICAL |
| **Responsif** | Tidak mobile-friendly sempurna, layout rusak di layar kecil | 🔴 CRITICAL |
| **Produk** | Katalog produk sangat minim — hanya list nama di sidebar kiri | 🔴 CRITICAL |
| **Kontak** | Form kontak tidak ada, nomor telepon kosong | 🔴 CRITICAL |
| **Karir** | **Tidak ada sama sekali** — padahal backend sudah siap | 🔴 CRITICAL |
| **Animasi** | Tidak ada micro-animation, website terasa "mati" | 🟡 MEDIUM |
| **SEO** | Meta tags tidak dioptimasi, loading lambat (WordPress) | 🟡 MEDIUM |
| **Bahasa** | Hanya Bahasa Inggris, tidak ada pilihan bahasa | 🟡 MEDIUM |
| **About** | Terlalu singkat, tidak ada timeline, tidak ada leadership section | 🟡 MEDIUM |
| **Testimoni** | Tidak ada social proof sama sekali | 🟡 MEDIUM |
| **CTA** | Tombol "See More" generik, tidak direktif | 🟡 MEDIUM |
| **Footer** | Informasi kurang lengkap | 🟢 LOW |

---

## 🆕 WEBSITE BARU GPT — VISI & KONSEP

### "GPT — Smart Manufacturing Hub"

Website baru GPT akan menjadi **platform bisnis modern** yang berfungsi sebagai:

```
┌─────────────────────────────────────────────────────────────┐
│                    WEBSITE BARU GPT                         │
│                                                             │
│  1. 🏭 BUSINESS PROFILE  — Company profile, visi, misi     │
│  2. ⚙️ AUTOMATION         — Showcase teknologi & robot      │
│  3. 🛒 PRODUCTS           — Katalog produk lengkap         │
│  4. 💼 CAREER             — Lowongan + Benefits + Apply     │
│  5. 🖼️ GALLERY            — Life at GPT (foto kegiatan)     │
│  6. ❓ FAQ & CONTACT       — Info lengkap + form kontak     │
│  7. 🔐 ADMIN PORTAL        — HRD dashboard (internal)       │
│                                                             │
│  🌐 Bilingual: Bahasa Indonesia / English                   │
│  📱 Mobile-first, fully responsive                          │
│  ⚡ React.js SPA — loading < 2 detik                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 DESIGN SYSTEM — BRAND IDENTITY

### Color Palette

Kita **mempertahankan warna hijau teal GPT** yang sudah ada, namun dimodernisasi dengan sentuhan **merah ISA** sebagai parent company.

```css
/* === GPT PRIMARY — Teal (dari brand GPT lama) === */
--gpt-teal:         #00897B;   /* Primary brand teal */
--gpt-teal-dark:    #005F56;   /* Hover/pressed */
--gpt-teal-light:   #26A69A;   /* Light variant */
--gpt-teal-pale:    #E0F2F1;   /* Background tint */

/* === ISA PARENT ACCENT — Red === */
--isa-red:          #E31E24;   /* ISA Red — aksen parent company */
--isa-red-dark:     #B01419;   /* Red hover */

/* === PROFESSIONAL DARK === */
--gpt-dark:         #0D1117;   /* Near black — premium dark */
--gpt-dark-card:    #161B22;   /* Card dark background */
--gpt-dark-mid:     #21262D;   /* Border dark */

/* === NEUTRALS === */
--gpt-white:        #FFFFFF;
--gpt-bg:           #F6F8FA;   /* Page background */
--gpt-surface:      #FFFFFF;   /* Card surface */
--gpt-gray-light:   #EAEEF2;   /* Divider */
--gpt-gray-mid:     #8B949E;   /* Text muted */
--gpt-text:         #1C2128;   /* Body text */

/* === ACCENT — Gold/Amber (premium touch) === */
--gpt-gold:         #D4A017;   /* Badge, highlight */
--gpt-gold-light:   #F5C842;

/* === FUNCTIONAL === */
--gpt-success:      #10B981;
--gpt-warning:      #F59E0B;
--gpt-info:         #3B82F6;
```

### Typography (Bilingual-Friendly)

```css
/* Heading — Poppins (tegas, modern, works great in ID & EN) */
--font-heading: 'Poppins', sans-serif;

/* Body — Inter (clean, highly legible untuk dua bahasa) */
--font-body: 'Inter', sans-serif;

/* Font weights yang digunakan */
/* 400 — body text */
/* 500 — label, button */
/* 600 — subtitle, card title */
/* 700 — section heading */
/* 800 — hero headline */
```

### Komponen UI

| Komponen | Deskripsi Style |
|---|---|
| **Navbar** | Dark background, teal active state, language switcher (ID/EN), hamburger mobile |
| **Hero** | Full-screen + animated gradient teal-dark + particle effect / manufactur foto |
| **Feature Cards** | Dark card glassmorphism, teal border hover, ikon teal |
| **Product Card** | Putih bersih, teal tag kategori, image hover zoom, shadow lift |
| **Job Card** | Border kiri teal, badge tipe (Full Time/Internship), deadline info |
| **Stats Counter** | Angka besar teal, count-up animation on viewport enter |
| **Process Steps** | Timeline horizontal, numbered steps teal, connecting line |
| **Automation Section** | Dark background, teal glow effect, tech aesthetic |
| **Gallery Grid** | Masonry layout, overlay on hover, lightbox |
| **FAQ Accordion** | Putih, border kiri teal aktif, smooth chevron |
| **CTA Banner** | Gradient teal to dark, teks putih, pulse animation |
| **Footer** | Dark (#0D1117), teal accent link hover |
| **Language Toggle** | Pill toggle "ID / EN" di navbar |
| **Floating Contact** | WhatsApp floating button, hover reveal teal |

---

## 🗺️ SITEMAP WEBSITE BARU (BILINGUAL)

```
🌐 PT. Global Philsonic Technologies — Website Baru
│   (URL: / atau /en/ untuk English)
│
├── 🏠 HOME ( / | /en )
│   ├── Hero — Tagline + CTA (bilingual)
│   ├── Key Stats — 10+ Years | 3 Production Lines | 24h Service
│   ├── About GPT Snippet — Ringkasan company profile
│   ├── Our Advantages — Free Trade Zone | Skilled Workforce | ISO Compliance
│   ├── Product Categories Preview — 4 kartu kategori utama
│   ├── Automation Highlight — Preview teknologi automation
│   ├── Life at GPT Preview — 3 foto galeri terbaru
│   ├── Career Preview — 3 lowongan terbaru
│   └── CTA Banner — "Partner With Us" + "Join Our Team"
│
├── 🏢 ABOUT US ( /about | /en/about )
│   ├── Hero — Foto pabrik + overlay
│   ├── Who We Are — Deskripsi lengkap GPT
│   ├── Our Mission — Misi perusahaan
│   ├── Why Batam Free Trade Zone — Keunggulan lokasi
│   ├── Core Values — Nilai perusahaan (dinamis dari DB)
│   ├── Certifications — ISO 9001:2015, dll.
│   └── Parent Company — Section "Part of ISA Group" + link ke intersis.co.id
│
├── ⚙️ AUTOMATION ( /automation | /en/automation )
│   ├── Hero — "Smart Manufacturing Solutions"
│   ├── Automation Overview — Penjelasan kapabilitas
│   ├── Process Flow — Design & Engineering → Quality → Manufacturing → Supply
│   └── Product List Automation
│
├── 🛒 PRODUCTS ( /products | /en/products )
│   ├── Hero — "Our Product Lineup"
│   ├── Category Filter — All | Automation | Car Electronics | Mobile Device | Audio
│   ├── Product Grid — Card dengan foto, nama, kategori, deskripsi singkat
│   └── /products/:slug — Product Detail Page
│       ├── Foto produk besar
│       ├── Deskripsi lengkap + spesifikasi
│       └── CTA "Request a Quote / Inquiry"
│
├── 🖼️ GALLERY ( /gallery | /en/gallery )
│   ├── Filter Tab — All | Production | R&D | Events | CSR
│   └── Masonry Grid + Lightbox
│
├── 💼 CAREER ( /career | /en/career )
│   ├── Hero — "Build Your Career at GPT"
│   ├── Why Work at GPT — 4 card (Environment, Compensation, Growth, Culture)
│   ├── Program Preview — Internship | OJT | Management Trainee
│   ├── Job Listings — Filter [Dept ▼] [Type ▼] [Location ▼] + Search
│   │   └── /career/jobs/:id — Job Detail + Apply Now (placeholder)
│   ├── /career/benefits — Full Benefits & Perks page
│   ├── /career/programs — Full Programs page
│   └── /career/life — Life at GPT gallery + employee stories
│
├── ❓ FAQ ( /faq | /en/faq )
│   └── Accordion — Rekrutmen | Produk | Partnership | Umum
│
├── 📞 CONTACT ( /contact | /en/contact )
│   ├── Info kontak (Alamat Batam, telepon, email)
│   ├── Google Maps embed
│   ├── Contact/Inquiry Form — Nama, Email, Company, Topic, Message
│   └── Jam operasional
│
└── 🔐 ADMIN PORTAL ( /admin ) [Internal — HRD only]
    ├── Login (JWT)
    ├── Dashboard
    ├── CRUD: Company Profile, Core Values, Gallery
    ├── CRUD: Jobs, Benefits, Programs, FAQ, Contact
    ├── Users Management
    └── Activity Logs
```

---

## 🌐 IMPLEMENTASI BILINGUAL

### Strategi: i18n dengan react-i18next

```javascript
// Struktur folder locales
src/
├── locales/
│   ├── id/          // Bahasa Indonesia
│   │   ├── common.json
│   │   ├── home.json
│   │   ├── about.json
│   │   ├── products.json
│   │   ├── career.json
│   │   └── contact.json
│   └── en/          // English
│       ├── common.json
│       ├── home.json
│       ├── about.json
│       ├── products.json
│       ├── career.json
│       └── contact.json
```

### Contoh Konten Bilingual

| Konten | Bahasa Indonesia | English |
|---|---|---|
| Hero Tagline | "Solusi Manufaktur Elektronik Otomotif Terpercaya" | "Your Trusted Automotive Electronics Manufacturing Solution" |
| Tagline Sub | "Lebih dari 10 tahun pengalaman dalam industri elektronik otomotif" | "Over 10 years of experience in automotive electronics industry" |
| CTA Primary | "Lihat Produk Kami" | "Explore Our Products" |
| CTA Career | "Bergabung Bersama Kami" | "Join Our Team" |
| Nav: About | "Tentang Kami" | "About Us" |
| Nav: Career | "Karir" | "Career" |

---

## 🔌 INTEGRASI API — Mapping Backend yang Sudah Ada

| Halaman | API Endpoint | Status Backend |
|---|---|---|
| Home/About — Company Info | `GET /api/public/company` | ✅ Ready |
| About — Core Values | `GET /api/public/core-values` | ✅ Ready |
| Gallery | `GET /api/public/gallery` + `?category=` | ✅ Ready |
| Job Categories | `GET /api/public/job-categories` | ✅ Ready |
| Career — Jobs List | `GET /api/public/jobs` + filters | ✅ Ready |
| Career — Job Detail | `GET /api/public/jobs/:id` | ✅ Ready |
| Benefits Page | `GET /api/public/benefits` | ✅ Ready |
| Programs Page | `GET /api/public/programs` | ✅ Ready |
| FAQ Page | `GET /api/public/faqs` | ✅ Ready |
| Contact Info | `GET /api/public/contact` | ✅ Ready |
| Admin Login | `POST /api/admin/auth/login` | ✅ Ready |
| Admin All CRUD | `GET/POST/PUT/DELETE /api/admin/*` | ✅ Ready |

> ⚠️ **Halaman Products & Automation** belum ada backend-nya.
> **Keputusan (P3)**: Kerjakan **satu per satu** — mulai dengan Career & Company Profile
> yang sudah ada backend-nya, baru kemudian extend dengan Products/Automation.

---

## 📋 SPRINT PLAN — FASE 7 FRONTEND (Prioritas)

### 🏁 Sprint 1 — Fondasi & Design System (Hari 1-3)
```
✅ Goals: Semua komponen dasar siap, bisa mulai render halaman
```
- [ ] Setup project structure: `src/components/`, `src/pages/`, `src/hooks/`, `src/locales/`
- [ ] Setup **react-i18next** (bilingual ID/EN)
- [ ] Buat `index.css` — CSS Variables GPT brand, reset, typography
- [ ] Komponen shared:
  - `Navbar` (with language switcher + mobile hamburger)
  - `Footer` (dark, 3 kolom)
  - `Button` (primary teal, secondary, outline)
  - `SectionHeader` (judul + subtitle + garis teal)
  - `Card` (product card, job card, feature card)
  - `Badge` (tag kategori, tipe pekerjaan)
  - `LoadingSkeleton`
- [ ] Setup Axios instance + base URL + JWT interceptor
- [ ] Custom hooks: `useApi()`, `useJobs()`, `useBenefits()`, dll.

### 🏠 Sprint 2 — Home & About (Hari 4-6)
```
✅ Goals: 2 halaman utama live dengan data dari API
```
- [ ] **Home Page**:
  - Hero section (full-screen, animated gradient, typewriter text bilingual)
  - Stats Counter (10+ Years, 3 Prod Lines, 24h Service)
  - About GPT snippet (data dari `GET /api/public/company`)
  - Our Advantages (3 kolom: Free Trade Zone, Skilled Workforce, ISO)
  - Career Preview (3 jobs terbaru dari `GET /api/public/jobs`)
  - CTA Banner merah/teal gradient
- [ ] **About Page**:
  - Company story + foto
  - Visi & misi (data dari `GET /api/public/company`)
  - Core Values grid (data dari `GET /api/public/core-values`)
  - ISA Group section

### 💼 Sprint 3 — Career Module (Hari 7-10)
```
✅ Goals: Fitur karir lengkap — ini backbone utama dari backend yang sudah ada
```
- [ ] **Career Main Page**: Hero + Why Join + Programs Preview + Job Listing + Filter
- [ ] **Job Detail Page**: Full description + Apply Now (placeholder) + Related Jobs
- [ ] **Benefits Page**: Grid 8 benefit dengan ikon besar
- [ ] **Programs Page**: 3 card (Internship, OJT, MT)
- [ ] **Life at GPT**: Gallery foto karyawan (dari `GET /api/public/gallery`)
- [ ] Filter job: Dept | Type | Location + Keyword Search
- [ ] Integrasi: `jobs`, `benefits`, `programs`, `job-categories` API

### 🖼️ Sprint 4 — Gallery, FAQ & Contact (Hari 11-12)
```
✅ Goals: Halaman pendukung lengkap
```
- [ ] **Gallery**: Filter tab + Masonry + Lightbox modal
- [ ] **FAQ**: Smooth accordion per kategori (data dari `GET /api/public/faqs`)
- [ ] **Contact**: Info + Google Maps + Contact Form
- [ ] **404 Page**: Custom branded GPT

### 🛒 Sprint 5 — Products & Automation (Hari 13-14)
```
✅ Goals: Product catalog dengan data statis (backend extend nanti)
```
- [ ] **Products Page**: Category filter + product grid (data statis dulu)
- [ ] **Product Detail**: Foto + deskripsi + spec + inquiry CTA
- [ ] **Automation Page**: Overview + process flow + product list automation
- [ ] *Backend extension bisa dilakukan paralel atau sprint terpisah*

### 🔐 Sprint 6 — Admin Dashboard (Hari 15-17)
```
✅ Goals: HRD bisa kelola semua konten website lewat admin panel
```
- [ ] Login Page (JWT → localStorage)
- [ ] Dashboard overview
- [ ] CRUD: Company Profile, Core Values, Gallery
- [ ] CRUD: Jobs (publish/unpublish toggle), Benefits, Programs, FAQ
- [ ] Edit Contact Info
- [ ] Users Management (HRD & Admin only)
- [ ] Activity Logs viewer

### ✨ Sprint 7 — Polish & Deploy (Hari 18-20)
```
✅ Goals: Website siap demo ke atasan di Vercel
```
- [ ] Micro-animations (AOS scroll animations / Framer Motion)
- [ ] Responsive audit: 375px | 768px | 1024px | 1440px
- [ ] SEO — react-helmet-async, title + meta per halaman
- [ ] Loading skeleton + empty states yang proper
- [ ] Error boundaries
- [ ] Lighthouse audit (target: Performance > 90, SEO > 90)
- [ ] **Deploy ke Vercel** + share preview link ke atasan

---

## 📐 PERBANDINGAN AKHIR

| Aspek | Website GPT Lama | Website GPT Baru |
|---|---|---|
| **Platform** | WordPress (outdated) | React.js Vite SPA (modern) |
| **Halaman** | 5 halaman basic | 10+ halaman + admin dashboard |
| **Produk** | List nama di sidebar | Katalog lengkap dengan gambar & filter |
| **Karir** | Tidak ada | Full career module (jobs, benefits, programs) |
| **Bahasa** | English only | **Bilingual ID/EN** |
| **Responsif** | Partial | Mobile-first, fully responsive |
| **Animasi** | Tidak ada | Micro-animations + scroll effects |
| **Admin** | WordPress Admin | Custom JWT-secured dashboard |
| **Contact Form** | Tidak ada | Ada (nama, email, topik, pesan) |
| **Nomor Telpon** | Kosong (placeholder) | Diisi info kontak lengkap |
| **Loading Speed** | ~4-6 detik | Target < 2 detik |
| **SEO Score** | ~45/100 | Target > 88/100 |
| **Mobile Score** | ~55/100 | Target > 92/100 |

---

## ✅ KEPUTUSAN TEKNIS YANG SUDAH DIKONFIRMASI

| # | Keputusan | Detail |
|---|---|---|
| P1 | **Logo** | Dummy/placeholder logo GPT sementara |
| P2 | **Gambar/Foto** | Dummy placeholder profesional untuk demo |
| P3 | **Products & Automation** | Kerjakan satu-satu — Career & Company dulu, Products belakangan |
| P4 | **Bahasa** | **Bilingual Indonesia + English** (react-i18next) |
| P5 | **Apply Now** | Placeholder button — Google Form akan diisi nanti |
| P6 | **Deploy** | **Vercel** untuk demo ke atasan → pindah ke hosting berbayar jika diapprove |

---

## 🚀 LANGKAH PERTAMA

**Sekarang kita siap mulai Sprint 1!**

Urutan pekerjaan pertama:
1. Review & sesuaikan struktur folder `frontend/src/`
2. Buat design system (`index.css` + CSS variables)
3. Buat komponen `Navbar` dan `Footer`
4. Setup routing dan i18n
5. Render halaman Home pertama kali dengan data dari API

---

*Dokumen dibuat: 28 September 2026*
*Versi: 2.0 FINAL — Konteks GPT sebagai unit bisnis ISA*
*Status: ✅ CONFIRMED — Sprint 1 siap dimulai*
