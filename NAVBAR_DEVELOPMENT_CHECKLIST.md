# 📋 NAVBAR DEVELOPMENT & CONTENT TRACKING CHECKLIST
## PT. Global Philsonic Technologies (GPT) — Enterprise Web Platform

> **Status:** Active Working Document  
> **Tujuan:** Panduan dan acuan pelacakan progres pembuatan seluruh halaman navigasi (Navbar) website PT. Global Philsonic Technologies.  
> **Aturan:** Centang `[x]` setiap kali sub-fitur atau halaman telah selesai diimplementasikan dan diuji.

---

## 📊 Quick Status Dashboard (Struktur Navbar Ramping 6 Menu Bersatu)

| Nav Item | Route Path | Status | Prioritas | Peran Pada Website |
|---|---|---|---|---|
| **1. Beranda** | `/` | 🟢 **SELESAI (100%)** | — | Pintu masuk & ringkasan kapabilitas manufaktur Batam FTZ. |
| **2. Produk** | `/products` | 🟡 **IN PROGRESS (Layout Ready)** | — | 12 SKU Manufaktur, Festo-style Toolbar, Matrix Table & RFQ Modal (Menunggu finalisasi konten). |
| **3. Otomasi** | `/automation` | 🟢 **LAYOUT READY (Prototyped)** | — | 6 Mesin Uji Otomatis (ICT/FCT/EOL/Dispensing), PLC specs, and modal detail. |
| **4. Galeri** | `/gallery` | 🟢 **LAYOUT READY (Prototyped)** | — | 8 Fasilitas Pabrik (SMT/Cleanroom 100K/Lab), filter kategori, dan modal Lightbox. |
| **5. Karir** | `/career` | 🟢 **LAYOUT READY (Prototyped)** | — | 4 Employee Perks, 6 Lowongan Kerja Batam & Program Magang, modal lamaran. |
| **6. Kontak** | `/contact` | 🟢 **LAYOUT READY (Prototyped)** | — | 2-Kolom: Alamat Pabrik Batam FTZ, Rute Selat Singapura, dan Formulir RFQ B2B. |

> *Catatan: Modul halaman `About Us` (`/about`) telah selesai dibuat dan disimpan sebagai arsip modul di `src/pages/public/AboutPage.jsx` untuk diaktifkan sewaktu-waktu saat data profil korporat resmi cabang sudah lengkap.*

---

## 🎯 Detail Checklist Per Halaman

### 🟢 1. Home Page (`/`) — Status: SELESAI
- [x] **Header & Sticky Navbar:** Responsive desktop + mobile drawer, logo perusahaan, manual language switcher (ID/EN).
- [x] **Hero Section (100vh):** Dual-slide background (SMT & Wave soldering), live typewriter effect, 2 B2B CTA button.
- [x] **Telemetry Stats Deck:** Counter animasi otomatis (10+ Thn Pengalaman, 80K CPH, 24/7 Support, 100% Quality).
- [x] **About & Product Lines (Editorial Split):** Ringkasan profil pabrik Batam FTZ & skematik interaktif 4 lini produk.
- [x] **4-Stage Manufacturing Lifecycle:** Visual interaktif 3D HUD (Engineering, Quality Testing, Manufacturing, Batam FTZ Trade).
- [x] **Global Market Footprint:** Peta dunia interaktif canvas titik GPS + SVG radar ping rute ekspor global.
- [x] **Core Engineering Values:** Integrasi API dinamis `useCoreValues`.
- [x] **B2B CTA Banner & Footer:** Micro-interaction button & footer korporat komprehensif.

---

### 🟢 2. About Us Page (`/about`) — Status: SELESAI (100%)
Target file utama: `frontend/src/pages/public/AboutPage.jsx` & `frontend/src/pages/public/AboutPage.css`

- [x] **A. Hero Header About Us**
  - [x] Judul dan subjudul korporat kelas industri (*"Membangun Keunggulan Rekayasa Otomotif & Otomasi Global"*).
  - [x] Background banner bertekstur grid teknis, glow radial, dan 4 kartu telemetri pabrik (10+ Tahun, 80K CPH, 10.000 m², 99.8% Yield).
  - [x] Breadcrumb navigasi (*Home > About Us / Beranda > Tentang Kami*).
- [x] **B. Company Profile & Legacy Narrative**
  - [x] Narasi profil PT. Global Philsonic Technologies sebagai bagian dari Intersis Group.
  - [x] Hubungan strategis Batam Free Trade Zone (0% tarif impor, kedekatan maritim 45 menit ke pelabuhan Singapura, dan Certificate of Origin C/O Indonesia).
- [x] **C. Interactive Milestone Timeline (Sejarah Perusahaan)**
  - [x] Garis waktu interaktif 5 era tonggak pencapaian (2014, 2017, 2020, 2023, 2026).
  - [x] Navigasi tab tahun interaktif yang menampilkan kartu pencapaian rekayasa secara dinamis.
- [x] **D. Visi, Misi & Komitmen Perusahaan**
  - [x] Kartu Visi Korporat & Pernyataan Misi Manufaktur Presisi dengan 4 komitmen bernomor.
  - [x] Fallback anggun ke API `useCompany()` jika data dinamis tersedia dari backend.
- [x] **E. Standar Mutu & Sertifikasi Industri (Badges of Trust)**
  - [x] Grid sertifikasi resmi: **IATF 16949:2016**, **ISO 9001:2015**, **ISO 14001:2015**, **RoHS/REACH Compliant**, dan **IPC-A-610 Class 2 & 3**.
  - [x] Indikator status kepatuhan terverifikasi dengan badge kode monospace.
- [x] **F. Fasilitas Pabrik & Kapabilitas Mesin (Interactive Tour)**
  - [x] Showcase 4 zona pabrik interaktif: Cleanroom Class 100K ESD, SMT Placement Lines, Quality & Reliability Lab, serta Automation & Tooling Workshop.
  - [x] Visualisasi SVG skematik dinamis untuk masing-masing zona dengan spesifikasi teknis lengkap.
- [x] **G. Lokalisasi Penuh & Responsivitas**
  - [x] Integrasi i18n dwibahasa lengkap di `src/locales/id/about.json` dan `src/locales/en/about.json`.
  - [x] Desain responsif sempurna untuk Desktop, Tablet, dan Mobile.
- [ ] **G. Kepemimpinan & Budaya Rekayasa (*Leadership & Engineering Team*)**
  - [ ] Sambutan Direksi / Manajemen Eksekutif.
  - [ ] Komposisi tenaga kerja ahli (Insinyur Elektronik, Mekanikal, QA/QC, & Spesialis SMT).
- [ ] **H. Lokalisasi & Responsivitas**
  - [ ] Penerjemahan lengkap Bahasa Indonesia (`id`) & English (`en`) di file i18n JSON.
  - [ ] Tampilan responsif sempurna di perangkat Mobile (360px), Tablet (768px), dan Desktop (1440px+).

---

### 🟢 3. Automation Page (`/automation`) — Status: LAYOUT READY (Prototyped)
Target file: `frontend/src/pages/public/AutomationPage.jsx` & `AutomationPage.css`

- [x] Header minimalis & navigasi breadcrumb bersih `[Home] / Automation`.
- [x] Kategori filter pills (Semua, ICT, FCT, EOL, Robotic Dispensing, Wire Harness).
- [x] 6 Mesin Otomasi & Test Jigs dengan visual SVG skematik presisi:
  - [x] GPT-ICT-4000: Dual-Chamber Vacuum Pneumatic ICT Jig (<8.5s cycle, 1024 probe points, Festo pneumatics).
  - [x] GPT-FCT-900: High-Speed Infotainment & Display FCT Station (HDMI 2.1, CAN-FD/LIN, Mitsubishi iQ-R).
  - [x] GPT-EOL-8200: Smart BMS & Power Electronics EOL Station (Beckhoff TwinCAT 3, high voltage isolation).
  - [x] GPT-DISP-600: Automated Dual-Head Selective Conformal Coating Robot (Nordson valves, ±0.015mm).
  - [x] GPT-OPT-300: Multi-Angle Solder Joint Metrology & Vision Jig (Keyence KV-8000, 3D laser AOI).
  - [x] GPT-HARN-150: Automated Wire Harness Continuity & Hipot Rig (256 test pins, 1500VDC Hipot).
- [x] Modal Spesifikasi Sistem Teknik lengkap dengan tombol hubungi tim engineering.
- [x] 4 Kapabilitas Rekayasa In-House (Haas 4-Axis CNC Tooling, Multi-Brand PLC, MES Industry 4.0, 7-Day Rapid Prototyping).

---

### 🟡 4. Products Page (`/products`) — Status: IN PROGRESS (Layout Ready — Belum Dicetang Sesuai Arahan User)
Target file: `frontend/src/pages/public/ProductsPage.jsx` & `frontend/src/pages/public/ProductsPage.css`

- [x] Header minimalis & navigasi breadcrumb bersih `[Home] / Products` (tanpa hero banner berlebih).
- [x] Festo/Siemens Industrial Toolbar dengan live search bar dan filter kategori pills.
- [x] Dual View Switcher: **Grid Card View** (diagram skematik sirkuit SVG) vs **Technical Comparison Table View** (matriks spesifikasi teknik).
- [x] 12 SKU manufaktur autentik terbagi ke 5 divisi (Automotive Infotainment, DSP Audio, ADAS Vision, Industrial Jigs, Turnkey EMS).
- [x] Modal Spesifikasi Lengkap (`ProductSpecsModal`) dan Modal Penawaran RFQ (`RfqModal`) dengan direct WhatsApp sales.
- [ ] *Finalisasi konten produk & validasi detail teknis (Akan dilanjutkan di sesi kerja berikutnya).*

---

### 🟢 5. Gallery Page (`/gallery`) — Status: LAYOUT READY (Prototyped)
Target file: `frontend/src/pages/public/GalleryPage.jsx` & `GalleryPage.css`

- [x] Header minimalis & navigasi breadcrumb bersih `[Home] / Gallery`.
- [x] Filter tab kategori: *Semua*, *SMT Lines*, *Cleanroom Class 100K*, *Workshop Otomasi*, *QA & Lab Testing*, *Gedung & Logistik*.
- [x] 8 Kartu Galeri Fasilitas Manufaktur dengan foto resolusi tinggi, lokasi spesifik pabrik Batam, dan badge spesifikasi inti.
- [x] Interactive Lightbox Modal: Tampilan perbesaran foto, deskripsi mendalam, serta parameter fasilitas.

---

### 🟢 6. Career Portal (`/career`) — Status: LAYOUT READY (Prototyped)
Target file: `frontend/src/pages/public/CareerPage.jsx` & `CareerPage.css`

- [x] Header minimalis & navigasi breadcrumb bersih `[Home] / Career`.
- [x] 4 Kartu Benefit Karyawan (Asuransi Penuh, Sertifikasi IPC/IATF, Lab & Cleanroom Ber-AC, Program Magang Bersertifikat).
- [x] Filter Departemen: *Semua*, *Engineering*, *Otomasi & Tooling*, *QA/QC*, *Produksi*, *Program Magang (OJT)*.
- [x] 6 Lowongan Kerja Otentik Batam Plant (Senior SMT Engineer, PLC Programmer, QA Inspector, Shift Supervisor, CNC Tech, dan Program Magang Mahasiswa).
- [x] Modal Detail Lowongan & Pengiriman Lamaran Cepat (Link email `hr@philsonic.co.id` dengan subjek otomatis terformat).

---

### 🟢 7. Contact & RFQ Page (`/contact`) — Status: LAYOUT READY (Prototyped)
Target file: `frontend/src/pages/public/ContactPage.jsx` & `ContactPage.css`

- [x] Header minimalis & navigasi breadcrumb bersih `[Home] / Contact`.
- [x] Layout 2-Kolom B2B Terstruktur:
  - [x] **Kolom Kiri (Identitas & Logistik Batam FTZ):** Alamat Cammo Industrial Park Batam Center, nomor telepon kantor, direct WhatsApp RFQ (+62 811-7700-899), email per departemen (rfq, sales, hr), jam operasional 24/7 SMT, dan kartu keunggulan logistik 45 menit ke Singapura.
  - [x] **Kolom Kanan (Formulir RFQ B2B):** Form input nama lengkap, email korporat, perusahaan, nomor telepon/WA, cakupan kebutuhan, estimasi volume produksi, serta rincian spesifikasi BOM.
  - [x] Feedback konfirmasi pengiriman form dengan tombol fast-track WhatsApp.

---

## 🛡️ Standar Kualitas Teknis (QA Checklist)
Untuk setiap halaman yang diselesaikan, wajib memenuhi standar berikut:
- [ ] **Dual Language (i18n):** Tidak ada teks statis yang bocor; semua teks memiliki terjemahan `id` dan `en`.
- [ ] **Responsive Design:** Sempurna di resolusi Mobile (375px), Tablet (768px), Laptop (1024px), Desktop (1440px+).
- [ ] **Modern Industrial Aesthetics:** Menggunakan palet resmi (`--teal: #00897B`, `--navy: #0B1320`), tipografi modern, micro-interactions, dan clean white/dark contrast.
- [ ] **SEO & Metadata:** Masing-masing halaman dilengkapi tag `<Helmet>` dengan `<title>` dan `<meta description>` yang deskriptif.
- [ ] **Zero Console Errors:** Bebas dari React hydration error, broken image link, atau warning unhandled exceptions.
