/**
 * Script Content: Perbandingan Sitemap & Fitur Website Referensi vs Website yang Dibangun
 * Website Referensi: https://www.globalphilsonics.com/isa/
 * Website Terbangun: Website Resmi & Profil Industri PT Global Philsonic Technologies (website_intersis)
 */

const docSitemapComparison = {
  docNumber: "13",
  docCode: "TI.SM.13.2026",
  docTitle: "Analisis Komparasi Sitemap & Fitur: Website Referensi vs Website Terbangun",
  docSubtitle: "Studi Perbandingan Struktur Navigasi, Fitur Unggulan, dan Peningkatan Arsitektur Sistem",
  executiveSummary: "Laporan komparatif komprehensif yang membedah arsitektur sitemap dan matriks fitur antara website referensi eksisting (https://www.globalphilsonics.com/isa/) dengan website baru yang dibangun (PT Global Philsonic Technologies). Dokumen ini menguraikan transformasi dari platform monolitik WordPress multi-halaman menjadi Single Page Application (SPA) berbasis React 19, WebGL 3D, Headless CMS, dan sistem bilingual instan.",
  
  sections: [
    {
      secNumber: "1",
      title: "Pendahuluan & Konteks Analisis Perbandingan",
      contentHtml: `
        <p>Dalam proses rekayasa perangkat lunak website resmi PT Global Philsonic Technologies (Automation-GPT), website resmi eksisting yang beralamat di <code>https://www.globalphilsonics.com/isa/</code> dijadikan sebagai acuan dasar (benchmark referensi). Analisis perbandingan sitemap dan fitur ini dilakukan untuk memastikan bahwa seluruh informasi bisnis korporat yang telah ada tetap terakomodasi secara utuh, sembari menghadirkan modernisasi arsitektur, peningkatan kecepatan akses, serta fitur interaktif baru berstandar industri Tier-1 internasional.</p>
        <p>Pendekatan rekayasa yang diterapkan berfokus pada pembaruan arsitektur dari <em>Multi-Page Traditional CMS</em> menjadi <em>Decoupled Single Page Application (SPA)</em> berkinerja tinggi yang memisahkan lapisan presentasi publik, gerbang API asinkron, dan sistem manajemen konten (CMS) internal.</p>
      `
    },
    {
      secNumber: "2",
      title: "Struktur Sitemap & Karakteristik Website Referensi (globalphilsonics.com/isa/)",
      contentHtml: `
        <p>Berdasarkan penelusuran struktur tautan pada domain referensi <code>https://www.globalphilsonics.com/isa/</code>, website referensi memiliki struktur navigasi sebagai berikut:</p>
        <div class="sitemap-tree-box">
          <div class="sitemap-tree-header">
            <span>Struktur Sitemap: Website Referensi (WordPress / Elementor)</span>
            <span class="sitemap-tree-header-tag">WP SITEMAP &bull; URL TREE</span>
          </div>
          <div class="sitemap-tree-body">
            <pre><code>https://www.globalphilsonics.com/isa/
├── Home (/isa/)
├── About Us (/isa/about-us/)
├── Company Profile (/isa/company-profile/)
├── Automation (/isa/automation-gpt/ &amp; /isa/automation/)
├── Mobile Intelligent Device (/isa/mobile-intelligent-device/)
│   ├── Amplifier (/isa/amplifier/)
│   ├── Subwoofer (/isa/subwoofer/)
│   ├── DSP (/isa/dsp/)
│   ├── Android Headunit (/isa/android-headunit/)
│   └── Dash Camera Recorders (/isa/dash-camera-recorders/)
└── Contact us (/isa/contact/)</code></pre>
          </div>
        </div>
        <p><strong>Karakteristik &amp; Keterbatasan Teknis Website Referensi:</strong></p>
        <ul>
          <li><strong>Arsitektur Monolitik Tradisional:</strong> Website referensi menggunakan CMS WordPress dengan Elementor Builder. Setiap kali pengguna berpindah kategori produk atau menu navigasi, browser melakukan pemuatan ulang halaman penuh (<em>full page reload</em>), yang menyebabkan latensi navigasi dan penggunaan kuota bandwidth lebih tinggi.</li>
          <li><strong>Fragmentasi Halaman Produk:</strong> Setiap lini kategori produk (Amplifier, Subwoofer, DSP, Headunit, Dashcam) dipecah ke dalam URL terpisah. Hal ini menyulitkan pengunjung industri untuk membandingkan spesifikasi teknis lintas kategori secara cepat.</li>
          <li><strong>Konten Grafis 2D Statis:</strong> Seluruh presentasi mesin otomasi industri hanya disajikan dalam bentuk foto gambar diam tanpa visualisasi interaktif atau simulasi 3 dimensi.</li>
          <li><strong>Ketiadaan Sistem Multi-Bahasa Komponen:</strong> Tidak tersedia sistem multi-bahasa terintegrasi pada antarmuka pengguna yang dapat beralih secara instan antara Bahasa Indonesia dan Bahasa Inggris tanpa reload halaman.</li>
          <li><strong>Formulir Kontak Konvensional:</strong> Formulir kontak masih bersifat email umum, belum memiliki klasifikasi estimasi volume pesanan manufaktur (pilot sample vs mass production) maupun sistem validasi skor anti-spam khusus industri.</li>
        </ul>
      `
    },
    {
      secNumber: "3",
      title: "Struktur Sitemap & Fitur Unggulan Website yang Kita Bangun (website_intersis)",
      contentHtml: `
        <p>Website yang baru dibangun mengadopsi arsitektur <em>Decoupled Enterprise</em> yang membagi sistem ke dalam dua portal independen: <strong>Portal Publik (Client-Facing SPA)</strong> dan <strong>Portal Administrasi Internal (Admin Dashboard CMS)</strong>:</p>
        <div class="sitemap-tree-box">
          <div class="sitemap-tree-header">
            <span>Struktur Sitemap: Website Baru yang Dibangun (React 19 + Express API + MySQL 8)</span>
            <span class="sitemap-tree-header-tag">MODERN SPA &bull; FULL ROUTE TREE</span>
          </div>
          <div class="sitemap-tree-body">
            <pre><code>c:/Projek_Magang/website_intersis/ (Portal Publik &amp; Admin)
├── PORTAL PUBLIK (Client-Facing Single Page App):
│   ├── / (Beranda / Home) &mdash; Hero Carousel 100vh, Typewriter Keywords, Animated Stats FTZ
│   ├── /about (Tentang Kami) &mdash; Bento Grid, Sejarah Timeline, Sertifikasi IATF/ISO, Keunggulan FTZ
│   ├── /automation (Otomasi Industri) &mdash; WebGL 3D Robot Canvas, Test Jigs ICT/FCT, Cloud MES
│   ├── /products (Katalog Produk Terpadu) &mdash; Filter Kategori Instan, Realtime SKU Search, Modal Specs JSON, RFQ Modal
│   ├── /gallery (Dokumentasi Fasilitas) &mdash; Cleanroom Class 100K, Lini SMT 80.000 CPH, Lightbox Zoom
│   ├── /career (Portal Karir &amp; Talenta) &mdash; /career/jobs/:id, /career/benefits, /career/programs
│   ├── /faq (Pusat Bantuan &amp; FAQ) &mdash; Tanya Jawab Layanan OEM/ODM &amp; Kapabilitas Pabrik
│   └── /contact (Kontak &amp; RFQ B2B) &mdash; Form Penawaran Harga Anti-Spam, Direct WhatsApp, Google Maps Embed
└── PORTAL ADMINISTRASI (Headless Admin CMS &amp; Audit):
    ├── /admin/login &mdash; Otentikasi JWT RBAC, Proteksi Sesi, Quick-Fill Demo Accounts
    └── /admin/* (Dashboard Navigasi Terpusat):
        ├── Overview &mdash; Metrik Statistik Kunjungan &amp; Ringkasan Data
        ├── Products Module &mdash; Kelola 19 SKU, Multi-Tab Input, JSON Specs, Image Upload
        ├── Home Module &mdash; Konfigurasi Hero Slider, Keywords Typewriter, Angka Statistik
        ├── About Module &mdash; Editor Visi Misi, Milestone Sejarah Timeline, Sertifikasi Mutu
        ├── Gallery Module &mdash; Unggah &amp; Kelola Dokumentasi Fasilitas Produksi
        ├── Contact &amp; RFQ Module &mdash; Penanganan Tiket Penawaran B2B Masuk &amp; Deteksi Spam
        ├── Users Module &mdash; Manajemen Akun Staf &amp; Hak Akses (Administrator, HRD, Staff)
        └── Activity Logs Module &mdash; Audit Trail 116 Rekaman Aktivitas Perubahan Data</code></pre>
          </div>
        </div>
        <p><strong>Fitur Unggulan Nilai Tambah (Value-Added Enhancements) pada Website Baru:</strong></p>
        <ol>
          <li><strong>Single Page Unified Product Catalog:</strong> Seluruh kategori produk (Headunit, Audio DSP &amp; Amplifier, Dashcam &amp; ADAS, Otomasi &amp; Test Jigs, EMS Box-Build) disatukan dalam satu katalog dinamis dengan filter instan tanpa reload, pencarian SKU cerdas, skema diagram sirkuit, dan modal RFQ langsung.</li>
          <li><strong>Simulasi 3D WebGL Robotika Manufaktur (RobotCanvas3D):</strong> Visualisasi 3 dimensi model robotika presisi berkecepatan 60 FPS pada halaman <code>/automation</code> yang dapat diputar 360 derajat, mode wireframe, dan tampilan telemetri sumbu (Joint 1 sampai 6).</li>
          <li><strong>Sistem Multi-Bahasa Bilingual Instan:</strong> Penerapan pustaka <code>i18next</code> pada seluruh halaman yang memungkinkan peralihan bahasa Indonesia dan Inggris secara instan tanpa memicu reload peramban.</li>
          <li><strong>Dual Theme Mode (Dark/Light):</strong> Pilihan tema gelap berstandar cockpit modern dan tema terang formal dengan persistensi preferensi di <code>localStorage</code>.</li>
          <li><strong>Formulir RFQ Khusus Klien Industri Tier-1:</strong> Formulir penawaran harga pada halaman <code>/contact</code> dilengkapi pilihan skala produksi (prototipe uji 10-50 unit hingga produksi massal >10.000 unit), pendeteksi alamat IP, negara asal, dan algoritma skor anti-spam otomatis.</li>
          <li><strong>Portal Administrasi Mandiri (Headless CMS):</strong> Seluruh teks, gambar, angka statistik, dan spesifikasi produk dapat diperbarui secara mandiri oleh staf melalui antarmuka admin yang terproteksi token JWT dan diaudit oleh sistem <code>activity_logs</code>.</li>
        </ol>
      `
    },
    {
      secNumber: "4",
      title: "Matriks Komparasi Fitur & Aspek Rekayasa Sistem",
      contentHtml: `
        <p>Tabel berikut menyajikan perbandingan terperinci antara website referensi dengan website baru yang dibangun:</p>
        <table class="table-custom">
          <thead>
            <tr>
              <th style="width: 18%;">Aspek Evaluasi</th>
              <th style="width: 38%;">Website Referensi (globalphilsonics.com/isa/)</th>
              <th style="width: 44%;">Website Baru yang Dibangun (website_intersis)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Arsitektur Sistem</strong></td>
              <td>Monolitik WordPress berbasis PHP Server-Side Rendering (SSR).</td>
              <td>Decoupled 3-Tier: Frontend SPA React 19 + Vite, Backend REST API Node.js Express, dan Database Relasional MySQL 8.</td>
            </tr>
            <tr>
              <td><strong>Kecepatan Navigasi</strong></td>
              <td>Perpindahan menu memicu reload halaman penuh (latensi 1.2s - 2.5s).</td>
              <td>Client-Side Routing via React Router DOM; navigasi instan (&lt; 100ms) tanpa layar putih (blank screen).</td>
            </tr>
            <tr>
              <td><strong>Struktur Katalog Produk</strong></td>
              <td>Terfragmentasi ke dalam 6 URL halaman terpisah (Headunit, Amplifier, DSP, dll.).</td>
              <td>Unified Single-Page Catalog: Seluruh kategori produk terintegrasi dalam 1 grid berfilter instan dan pencarian SKU real-time.</td>
            </tr>
            <tr>
              <td><strong>Spesifikasi Teknis</strong></td>
              <td>Teks statis sederhana pada deskripsi halaman Elementor.</td>
              <td>Tersimpan dalam kolom JSON terstruktur (<code>specs</code> dan <code>full_specs</code>) yang dapat ditampilkan via Modal Interaktif dan Skema Diagram.</td>
            </tr>
            <tr>
              <td><strong>Visualisasi Otomasi</strong></td>
              <td>Gambar foto 2 dimensi statis.</td>
              <td>Interactive WebGL 3D Robot Canvas (Three.js) dengan rotasi 360°, pencahayaan directional, wireframe mode, dan HUD telemetri sumbu.</td>
            </tr>
            <tr>
              <td><strong>Multi-Bahasa (Bilingual)</strong></td>
              <td>Hanya satu bahasa default, atau mengandalkan Google Translate widget eksternal.</td>
              <td>Integrasi native <code>i18next</code>: Seluruh komponen dan konten CMS mendukung peralihan instan Bahasa Indonesia dan Bahasa Inggris.</td>
            </tr>
            <tr>
              <td><strong>Tema Tampilan (Theme)</strong></td>
              <td>Hanya satu mode tampilan standar (Light theme statis).</td>
              <td>Dual Theme: Mode Gelap (Dark Mode industrial) dan Mode Terang (Light Mode) yang tersinkronisasi di <code>localStorage</code>.</td>
            </tr>
            <tr>
              <td><strong>Formulir Penawaran (RFQ)</strong></td>
              <td>Formulir kontak umum pengirim pesan email standar.</td>
              <td>Formulir Request for Quotation (RFQ) profesional dengan pemilihan skala volume produksi, skor anti-spam, dan integrasi WhatsApp sales.</td>
            </tr>
            <tr>
              <td><strong>Pengelolaan Konten (CMS)</strong></td>
              <td>Mengandalkan WP-Admin bawaan yang rentan celah keamanan plugin.</td>
              <td>Custom Admin Portal mandiri berbasis JWT, dilindungi role RBAC (Admin, HRD, Staff), dan dilengkapi audit trail <code>activity_logs</code>.</td>
            </tr>
            <tr>
              <td><strong>Keamanan Data &amp; DB</strong></td>
              <td>Skema tabel WordPress default (wp_posts, wp_postmeta).</td>
              <td>Database relasional 3NF terindeks (15 tabel fisik), password dienkripsi bcrypt 10 salt rounds, dan kueri terparameterisasi aman.</td>
            </tr>
          </tbody>
        </table>
      `
    },
    {
      secNumber: "5",
      title: "Diagram Arsitektur Alur Navigasi Pengguna & Integrasi Portal",
      contentHtml: `
        <p>Diagram di bawah ini mengilustrasikan keterhubungan antara portal publik yang diakses oleh klien internasional dengan portal manajemen konten admin internal:</p>
      `,
      diagramHtml: `
        <svg viewBox="0 0 680 180" width="100%" height="160" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #000000; padding:5px;">
          <!-- PENGUNJUNG PUBLIK -->
          <rect x="15" y="15" width="310" height="150" fill="#f9f9f9" stroke="#000000" stroke-width="1"/>
          <text x="170" y="32" fill="#000000" font-family="Arial" font-size="9" font-weight="bold" text-anchor="middle">PORTAL PUBLIK (Client-Facing SPA)</text>
          <line x1="15" y1="38" x2="325" y2="38" stroke="#000000" stroke-width="0.8"/>
          
          <rect x="25" y="48" width="135" height="26" fill="#ffffff" stroke="#000000" stroke-width="0.8"/>
          <text x="92" y="64" fill="#000000" font-family="Arial" font-size="7.5" text-anchor="middle">/ (Beranda + Hero Stats)</text>

          <rect x="175" y="48" width="140" height="26" fill="#ffffff" stroke="#000000" stroke-width="0.8"/>
          <text x="245" y="64" fill="#000000" font-family="Arial" font-size="7.5" text-anchor="middle">/about (Timeline &amp; FTZ)</text>

          <rect x="25" y="82" width="135" height="26" fill="#e5e5e5" stroke="#000000" stroke-width="0.8"/>
          <text x="92" y="98" fill="#000000" font-family="Arial" font-size="7.5" text-anchor="middle" font-weight="bold">/products (Katalog Terpadu)</text>

          <rect x="175" y="82" width="140" height="26" fill="#e5e5e5" stroke="#000000" stroke-width="0.8"/>
          <text x="245" y="98" fill="#000000" font-family="Arial" font-size="7.5" text-anchor="middle" font-weight="bold">/automation (WebGL 3D)</text>

          <rect x="25" y="116" width="135" height="26" fill="#ffffff" stroke="#000000" stroke-width="0.8"/>
          <text x="92" y="132" fill="#000000" font-family="Arial" font-size="7.5" text-anchor="middle">/gallery (Fasilitas SMT)</text>

          <rect x="175" y="116" width="140" height="26" fill="#ffffff" stroke="#000000" stroke-width="0.8"/>
          <text x="245" y="132" fill="#000000" font-family="Arial" font-size="7.5" text-anchor="middle">/contact (Form RFQ B2B)</text>

          <text x="170" y="157" fill="#555555" font-family="Arial" font-size="7" text-anchor="middle">Fitur Global: Bilingual (ID/EN) &bull; Dark/Light Theme &bull; Telemetry</text>

          <!-- ARROW -->
          <line x1="325" y1="90" x2="355" y2="90" stroke="#000000" stroke-width="1.5"/>
          <polygon points="355,90 347,86 347,94" fill="#000000"/>

          <!-- PORTAL ADMIN -->
          <rect x="355" y="15" width="310" height="150" fill="#f5f5f5" stroke="#000000" stroke-width="1.2"/>
          <text x="510" y="32" fill="#000000" font-family="Arial" font-size="9" font-weight="bold" text-anchor="middle">PORTAL ADMINISTRASI (/admin)</text>
          <line x1="355" y1="38" x2="665" y2="38" stroke="#000000" stroke-width="0.8"/>

          <rect x="365" y="48" width="140" height="26" fill="#ffffff" stroke="#000000" stroke-width="0.8"/>
          <text x="435" y="64" fill="#000000" font-family="Arial" font-size="7.5" text-anchor="middle">Products Management</text>

          <rect x="515" y="48" width="140" height="26" fill="#ffffff" stroke="#000000" stroke-width="0.8"/>
          <text x="585" y="64" fill="#000000" font-family="Arial" font-size="7.5" text-anchor="middle">CMS Settings (Home/About)</text>

          <rect x="365" y="82" width="140" height="26" fill="#ffffff" stroke="#000000" stroke-width="0.8"/>
          <text x="435" y="98" fill="#000000" font-family="Arial" font-size="7.5" text-anchor="middle">Gallery Uploads</text>

          <rect x="515" y="82" width="140" height="26" fill="#ffffff" stroke="#000000" stroke-width="0.8"/>
          <text x="585" y="98" fill="#000000" font-family="Arial" font-size="7.5" text-anchor="middle">RFQ Inquiries &amp; Spam</text>

          <rect x="365" y="116" width="140" height="26" fill="#ffffff" stroke="#000000" stroke-width="0.8"/>
          <text x="435" y="132" fill="#000000" font-family="Arial" font-size="7.5" text-anchor="middle">Users &amp; RBAC Security</text>

          <rect x="515" y="116" width="140" height="26" fill="#ffffff" stroke="#000000" stroke-width="0.8"/>
          <text x="585" y="132" fill="#000000" font-family="Arial" font-size="7.5" text-anchor="middle">Audit Trail (Activity Logs)</text>

          <text x="510" y="157" fill="#555555" font-family="Arial" font-size="7" text-anchor="middle">Otentikasi JWT &bull; RestrictTo Role &bull; Log Otomatis Database</text>
        </svg>
      `
    },
    {
      secNumber: "6",
      title: "Kesimpulan Analisis Komparatif",
      contentHtml: `
        <p>Berdasarkan analisis komparasi sitemap dan matriks fitur yang telah dipaparkan, dapat disimpulkan bahwa:</p>
        <ol>
          <li>Seluruh konten, kategori produk (Headunit, Audio, Dashcam), identitas korporat, dan informasi kontak dari website referensi <code>globalphilsonics.com/isa/</code> telah berhasil diserap dan dimigrasikan ke dalam website baru tanpa ada data yang hilang.</li>
          <li>Website baru menghadirkan lompatan teknologi (<em>technological leap</em>) yang signifikan: navigasi instan berbasis SPA React 19, katalog terpadu dengan modal spesifikasi teknis mendalam, visualisasi robotika 3D WebGL, sistem bilingual instan, dual-theme, formulir penawaran RFQ anti-spam, serta sistem administrasi headless CMS mandiri yang aman dan ter-audit.</li>
          <li>Transformasi ini menempatkan portal digital PT Global Philsonic Technologies pada standar industri otomotif internasional yang siap bersaing dalam menarik mitra bisnis Tier-1 global.</li>
        </ol>
      `
    }
  ]
};

module.exports = docSitemapComparison;
