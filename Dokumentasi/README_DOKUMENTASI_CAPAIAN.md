# 📋 Dokumentasi Laporan Rekayasa Perangkat Lunak & Buku Panduan Teknis
## Proyek: Website Resmi & Profil Industri PT Global Philsonic Technologies (Automation GPT)
**Pengembang:** Aditya Ristanto Mukti  
**Format:** Monokrom Formal — Blok Kode Tema Visual Studio Code IDE — Bahasa Indonesia Jelas & Terstruktur  
**Tahun:** 2026  

---

### 📌 Ringkasan Isi Folder `Dokumentasi`

Seluruh berkas dokumen di folder ini telah direvisi dan digenerate ulang dalam format laporan resmi:
1. **Penulisan Kode Sumber:** Seluruh blok kode program didesain menyerupai tema **Visual Studio Code IDE** (latar gelap `#1e1e1e`, bilah judul jendela dengan kontrol titik merah/kuning/hijau, tab aktif berkas dengan indikator biru, nama berkas spesifik, dan *syntax highlighting* konsol yang elegan).
2. **Kesesuaian Aktual (Bebas Halusinasi):** Seluruh kode, kelas (`class ApiError extends Error`), query database, tabel kamus data, dan rute controller 100% sinkron dengan kode sumber aktual di repositori proyek.
3. **Penambahan 2 Berkas PDF Baru Sesuai Permintaan:**
   - **Dokumen 13:** Analisis komparasi sitemap & matriks fitur antara website referensi (`https://www.globalphilsonics.com/isa/`) dengan website baru yang kita bangun.
   - **Dokumen 14:** Buku panduan operasional penggunaan portal admin dan alur pengeditan konten mulai dari login akun dummy pengujian.

---

### 📑 Daftar Lengkap 15 Berkas PDF Laporan & Panduan

| No | Berkas PDF Dokumen | Judul Dokumen | Fokus Pembahasan & Diagram Teknis |
|---|---|---|---|
| **01** | [`01_Mengimplementasikan_User_Interface.pdf`](./01_Mengimplementasikan_User_Interface.pdf) | **Mengimplementasikan User Interface** | Wireframe layout Hero, direct redirection ke `/products` & `/contact`, WebGL 3D Robot Canvas, form multi-tab produk. |
| **02** | [`02_Mengimplementasikan_Rancangan_Entitas_dan_Keterkaitan_Antar_Entitas.pdf`](./02_Mengimplementasikan_Rancangan_Entitas_dan_Keterkaitan_Antar_Entitas.pdf) | **Mengimplementasikan Rancangan Entitas dan Keterkaitan Antar Entitas** | **Diagram Visual ERD Monokrom Lengkap (Total 15 Tabel Terdaftar)**: 4 domain arsitektural (Katalog Produk & RFQ, Profil CMS FTZ, Keamanan & Telemetri, Fasilitas Internal), Kamus Data 15 tabel, dan DDL/DQL aktual. |
| **03** | [`03_Menerapkan_Perintah_Eksekusi_Bahasa_Pemrograman_Berbasis_Teks_Grafik_dan_Multimedia.pdf`](./03_Menerapkan_Perintah_Eksekusi_Bahasa_Pemrograman_Berbasis_Teks_Grafik_dan_Multimedia.pdf) | **Menerapkan Perintah Eksekusi Bahasa Pemrograman Berbasis Teks, Grafik, dan Multimedia** | Diagram eksekusi runtime Node.js/Vite, logging Morgan, upload gambar produk Multer, Puppeteer CLI. |
| **04** | [`04_Menyusun_Fungsi_File_atau_Sumber_Daya_Pemrograman_dalam_Organisasi_yang_Rapi.pdf`](./04_Menyusun_Fungsi_File_atau_Sumber_Daya_Pemrograman_dalam_Organisasi_yang_Rapi.pdf) | **Menyusun Fungsi, File atau Sumber Daya Pemrograman dalam Organisasi yang Rapi** | Matriks konvensi penamaan, anotasi JSDoc controller produk, dan pohon berkas /backend & /frontend. |
| **05** | [`05_Menulis_Kode_dengan_Prinsip_Sesuai_Guidelines_dan_Best_Practices.pdf`](./05_Menulis_Kode_dengan_Prinsip_Sesuai_Guidelines_dan_Best_Practices.pdf) | **Menulis Kode dengan Prinsip Sesuai Guidelines dan Best Practices** | Diagram arsitektur DRY HTTP client interceptor, penanganan error 1062 duplicate, dan Gzip compression. |
| **06** | [`06_Mengimplementasikan_Pemrograman_Terstruktur.pdf`](./06_Mengimplementasikan_Pemrograman_Terstruktur.pdf) | **Mengimplementasikan Pemrograman Terstruktur** | Diagram alur Guard Clauses, filtering array produk manufaktur, dan pembersihan file disk via fs.unlinkSync. |
| **07** | [`07_Mengimplementasikan_Pemrograman_Berorientasi_Objek_OOP.pdf`](./07_Mengimplementasikan_Pemrograman_Berorientasi_Objek_OOP.pdf) | **Mengimplementasikan Pemrograman Berorientasi Objek (OOP)** | Diagram UML Class Inheritance (`class ApiError extends Error`), enkapsulasi bcrypt, dan Button polimorfis. |
| **08** | [`08_Menggunakan_Library_atau_Komponen_Pre_Existing.pdf`](./08_Menggunakan_Library_atau_Komponen_Pre_Existing.pdf) | **Menggunakan Library atau Komponen Pre-Existing** | Matriks lengkap dependensi open-source NPM backend & frontend, SemVer, dan verifikasi npm audit. |
| **09** | [`09_Menggunakan_SQL.pdf`](./09_Menggunakan_SQL.pdf) | **Menggunakan SQL** | Diagram siklus transaksi ACID (Begin -> Insert Products -> Insert Logs -> Commit / Rollback), trigger produk. |
| **10** | [`10_Menerapkan_Akses_Basis_Data.pdf`](./10_Menerapkan_Akses_Basis_Data.pdf) | **Menerapkan Akses Basis Data** | Diagram arsitektur Decoupled 3-Tier Security, konfigurasi pool mysql2, dan profiling EXPLAIN produk. |
| **11** | [`11_Menggunakan_Source_Code_Versioning.pdf`](./11_Menggunakan_Source_Code_Versioning.pdf) | **Menggunakan Source Code Versioning** | Repositori GitHub resmi, diagram alur Git-Flow Feature Branching, Conventional Commits, dan panduan kloning. |
| **12** | [`12_Soft_Skills_dan_Design_Thinking_Kelompok_Penunjang.pdf`](./12_Soft_Skills_dan_Design_Thinking_Kelompok_Penunjang.pdf) | **Soft Skills / Design Thinking (Kelompok Penunjang)** | Diagram visual siklus 5 Tahap Design Thinking & tabel pemecahan masalah kebutuhan klien industri. |
| **13** | [`13_Sitemap_dan_Fitur_Website_Referensi_vs_Website_Terbangun.pdf`](./13_Sitemap_dan_Fitur_Website_Referensi_vs_Website_Terbangun.pdf) | **Analisis Komparasi Sitemap & Fitur: Referensi vs Terbangun** | **Studi Komparasi Mendalam**: Sitemap WordPress Multi-Page (`globalphilsonics.com/isa/`) vs Sitemap React 19 Decoupled SPA, perbandingan fitur per kategori (Headunit, Audio, Otomasi), arsitektur bilingual instan, 3D WebGL, RFQ anti-spam, dan diagram visual alur navigasi SVG. |
| **14** | [`14_Panduan_Penggunaan_dan_Alur_Pengeditan_Website_Admin.pdf`](./14_Panduan_Penggunaan_dan_Alur_Pengeditan_Website_Admin.pdf) | **Buku Panduan Penggunaan & Alur Pengeditan Portal Admin** | **Buku Petunjuk Operasional Lengkap**: 3 Akun Dummy Pengujian (Administrator, HRD Manager, Staff Konten) & Fitur Tombol Akses Cepat (Quick Demo Chips), Orientasi Layout Dashboard, Panduan Multi-Tab Pengeditan Produk (SKU, Badge, Gambar, Specs Singkat, JSON Editor), Alur Pembaruan Beranda (Hero & Batam FTZ Stats), Profil Perusahaan, Galeri Fasilitas, Tindak Lanjut RFQ Masuk (WhatsApp direct & Email), Manajemen User RBAC, dan Audit Trail. |
| **15** | [`15_Cakupan_Sitemap_Lengkap_Website_Publik_dan_Dashboard_Admin.pdf`](./15_Cakupan_Sitemap_Lengkap_Website_Publik_dan_Dashboard_Admin.pdf) | **Cakupan Sitemap Lengkap: Portal Publik dan Dashboard Admin** | **Inventarisasi End-to-End Menyeluruh**: Rincian 12 rute halaman publik dan 11 modul admin dashboard, setiap section di dalamnya, fungsi operasional, fitur teknis, tujuan rekayasa ("untuk apa dibuat"), serta diagram hierarki sitemap visual SVG. |
| **16** | [`16_Bedah_Visual_dan_Analisis_Fitur_Website_Publik_dan_Admin.pdf`](./16_Bedah_Visual_dan_Analisis_Fitur_Website_Publik_dan_Admin.pdf) | **Bedah Visual & Analisis Strategis Seluruh Fitur Website Publik dan Dashboard Admin** | **Panduan Presentasi Eksekutif Visual**: 23 kartu showcase visual berdampingan (*side-by-side*) dilengkapi screenshot riil website dan analisis 3 pilar: (1) Fungsi Utama & Mekanisme Kerja, (2) Dampak Bisnis & Nilai Operasional, dan (3) Alasan Pembuatan & Nilai Strategis untuk Presentasi. |

---

### 📂 Struktur Direktori

```text
c:/Projek_Magang/website_intersis/Dokumentasi/
├── 01_Mengimplementasikan_User_Interface.pdf
├── 02_Mengimplementasikan_Rancangan_Entitas_dan_Keterkaitan_Antar_Entitas.pdf
├── 03_Menerapkan_Perintah_Eksekusi_Bahasa_Pemrograman_Berbasis_Teks_Grafik_dan_Multimedia.pdf
├── 04_Menyusun_Fungsi_File_atau_Sumber_Daya_Pemrograman_dalam_Organisasi_yang_Rapi.pdf
├── 05_Menulis_Kode_dengan_Prinsip_Sesuai_Guidelines_dan_Best_Practices.pdf
├── 06_Mengimplementasikan_Pemrograman_Terstruktur.pdf
├── 07_Mengimplementasikan_Pemrograman_Berorientasi_Objek_OOP.pdf
├── 08_Menggunakan_Library_atau_Komponen_Pre_Existing.pdf
├── 09_Menggunakan_SQL.pdf
├── 10_Menerapkan_Akses_Basis_Data.pdf
├── 11_Menggunakan_Source_Code_Versioning.pdf
├── 12_Soft_Skills_dan_Design_Thinking_Kelompok_Penunjang.pdf
├── 13_Sitemap_dan_Fitur_Website_Referensi_vs_Website_Terbangun.pdf
├── 14_Panduan_Penggunaan_dan_Alur_Pengeditan_Website_Admin.pdf
├── 15_Cakupan_Sitemap_Lengkap_Website_Publik_dan_Dashboard_Admin.pdf
├── 16_Bedah_Visual_dan_Analisis_Fitur_Website_Publik_dan_Admin.pdf
├── README_DOKUMENTASI_CAPAIAN.md
├── html_sources/                # Berkas sumber HTML resmi
├── screenshots/                 # Tangkapan layar riil otomatis via Puppeteer
└── scripts/                     # Generator PDF Puppeteer & template script
```
