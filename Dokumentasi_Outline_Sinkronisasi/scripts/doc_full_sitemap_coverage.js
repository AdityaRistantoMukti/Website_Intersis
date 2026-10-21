/**
 * Script Content: Cakupan Sitemap Lengkap & Rincian Fitur: Portal Publik dan Dashboard Admin
 * Website Resmi & Profil Industri PT Global Philsonic Technologies (website_intersis)
 */

const docFullSitemapCoverage = {
  docNumber: "15",
  docCode: "TI.SM.15.2026",
  docTitle: "Cakupan Sitemap Lengkap & Rincian Fitur: Portal Publik dan Dashboard Admin",
  docSubtitle: "Inventarisasi Menyeluruh Struktur Halaman, Komponen Section, Fungsi Operasional, Fitur Interaktif, dan Tujuan Perancangan Sistem",
  executiveSummary: "Laporan teknis arsitektur komprehensif yang memetakan seluruh hierarki halaman, komponen section, fitur interaktif, fungsi operasional, dan tujuan perancangan perangkat lunak PT Global Philsonic Technologies (website_intersis). Dokumen ini menguraikan seluruh rute portal publik (client-facing Single Page Application) dan modul portal administrasi (Headless CMS terproteksi JWT RBAC), menjadikannya rujukan tunggal (single source of truth) mengenai cakupan sistem end-to-end yang telah selesai dibangun dan dideploy.",

  sections: [
    {
      secNumber: "1",
      title: "Pendahuluan & Gambaran Arsitektur Sitemap Sistem Terpadu",
      contentHtml: `
        <p>Pembangunan website resmi dan profil industri PT Global Philsonic Technologies (Automation-GPT) menerapkan paradigma arsitektur <strong>Decoupled Enterprise</strong> berbasis <em>Single Page Application (SPA)</em>. Sistem ini memisahkan secara tegas antara lapisan presentasi yang dapat diakses oleh publik (mitra bisnis, klien industri otomotif, investor, dan mitra manufaktur global) dengan lapisan manajemen data operasional yang hanya dapat diakses oleh staf internal perusahaan yang telah terverifikasi.</p>
        
        <p>Arsitektur sistem dibagi menjadi dua pilar utama:</p>
        <ol>
          <li><strong>Portal Publik (Client-Facing Portal):</strong> Dibangun menggunakan framework modern React 19, Vite, dan pustaka animasi performa tinggi. Berfungsi sebagai etalase industri berstandar Tier-1 internasional untuk memperkenalkan kapabilitas manufaktur di Kawasan Perdagangan Bebas Batam (Batam Free Trade Zone), katalog 19 SKU produk terpadu, visualisasi robotika 3D interaktif, serta gerbang pengajuan penawaran harga (Request for Quotation / RFQ) yang aman dari serangan bot spam.</li>
          <li><strong>Portal Administrasi (Headless CMS &amp; Audit Portal):</strong> Terisolasi pada rute <code>/admin</code> dengan perlindungan otentikasi berbasis <em>JSON Web Token (JWT)</em> dan otorisasi bertingkat <em>Role-Based Access Control (RBAC)</em>. Berfungsi sebagai pusat kendali mandiri bagi staf untuk memodifikasi konten bilingual secara langsung, mengunggah media, mengelola master data produk, mengonfigurasi gerbang pengiriman email (Resend HTTPS API / SMTP), menindaklanjuti permohonan RFQ, serta memantau riwayat perubahan melalui audit trail forensik.</li>
        </ol>

        <div style="margin: 14px 0 18px 0;">
          <div style="font-family: Arial, sans-serif; font-size: 8.5pt; font-weight: bold; color: #000000; text-transform: uppercase; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span>Diagram Visual Peta Struktur Hierarki Sitemap Lengkap (Full Route &amp; Module Tree)</span>
            <span style="font-size: 7.5pt; background: #e2e8f0; color: #0f172a; padding: 2px 8px; border-radius: 4px; font-weight: bold;">CONNECTED TREE DIAGRAM</span>
          </div>

          <svg viewBox="0 0 740 525" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #000000; border-radius:6px; display:block;">
            <!-- DEFINITIONS -->
            <defs>
              <filter id="nodeShadow" x="-3%" y="-3%" width="106%" height="106%">
                <feDropShadow dx="1" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.08"/>
              </filter>
            </defs>

            <!-- ════════ ROOT NODE (SYSTEM ROOT) ════════ -->
            <g filter="url(#nodeShadow)">
              <rect x="210" y="12" width="320" height="46" rx="6" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
              <text x="370" y="31" fill="#ffffff" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" text-anchor="middle" letter-spacing="0.5">PT. GLOBAL PHILSONIC TECHNOLOGIES</text>
              <text x="370" y="47" fill="#94a3b8" font-family="Arial, sans-serif" font-size="8" text-anchor="middle">Arsitektur Terpadu: Single Page App (SPA) + Headless CMS</text>
            </g>

            <!-- ROOT TRUNK & HORIZONTAL BUS -->
            <line x1="370" y1="58" x2="370" y2="76" stroke="#334155" stroke-width="1.6"/>
            <circle cx="370" cy="76" r="3" fill="#334155"/>
            <line x1="185" y1="76" x2="555" y2="76" stroke="#334155" stroke-width="1.6"/>
            <circle cx="185" cy="76" r="3" fill="#334155"/>
            <circle cx="555" cy="76" r="3" fill="#334155"/>

            <!-- VERTICAL DROPS TO BOTH BRANCHES -->
            <line x1="185" y1="76" x2="185" y2="92" stroke="#334155" stroke-width="1.6"/>
            <line x1="555" y1="76" x2="555" y2="92" stroke="#334155" stroke-width="1.6"/>

            <!-- ════════ BRANCH 1: PORTAL PUBLIK (LEFT COLUMN) ════════ -->
            <!-- Header Box Public -->
            <g filter="url(#nodeShadow)">
              <rect x="25" y="92" width="320" height="38" rx="5" fill="#f8fafc" stroke="#0d9488" stroke-width="1.5"/>
              <rect x="25" y="92" width="6" height="38" rx="2" fill="#0d9488"/>
              <text x="40" y="108" fill="#0f172a" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold">PORTAL PUBLIK (Client-Facing SPA)</text>
              <text x="40" y="122" fill="#64748b" font-family="Arial, sans-serif" font-size="7.5">Akses Terbuka &bull; Profil Industri, Katalog Produk, Otomasi 3D &amp; RFQ</text>
            </g>

            <!-- Public Trunk Line -->
            <line x1="45" y1="130" x2="45" y2="400" stroke="#0d9488" stroke-width="1.4"/>

            <!-- Leaf 1: / (Beranda) -->
            <line x1="45" y1="152" x2="62" y2="152" stroke="#0d9488" stroke-width="1.2"/>
            <circle cx="45" cy="152" r="2.5" fill="#0d9488"/>
            <rect x="62" y="137" width="283" height="30" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="72" y="150" fill="#0f172a" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold">/ (Beranda / Home)</text>
            <text x="72" y="161" fill="#64748b" font-family="Arial, sans-serif" font-size="7">Hero 100vh Carousel &bull; Typewriter &bull; Stats FTZ &bull; Lifecycle 5-Stage</text>

            <!-- Leaf 2: /about -->
            <line x1="45" y1="192" x2="62" y2="192" stroke="#0d9488" stroke-width="1.2"/>
            <circle cx="45" cy="192" r="2.5" fill="#0d9488"/>
            <rect x="62" y="177" width="283" height="30" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="72" y="190" fill="#0f172a" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold">/about (Tentang Kami &amp; Fasilitas)</text>
            <text x="72" y="201" fill="#64748b" font-family="Arial, sans-serif" font-size="7">Narasi FTZ &bull; 3D Tilt Card &bull; Visi Misi &bull; Cleanroom 100K &bull; Timeline</text>

            <!-- Leaf 3: /automation -->
            <line x1="45" y1="232" x2="62" y2="232" stroke="#0d9488" stroke-width="1.2"/>
            <circle cx="45" cy="232" r="2.5" fill="#0d9488"/>
            <rect x="62" y="217" width="283" height="30" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="72" y="230" fill="#0f172a" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold">/automation (Otomasi &amp; Robotika 3D)</text>
            <text x="72" y="241" fill="#64748b" font-family="Arial, sans-serif" font-size="7">WebGL 3D 60 FPS &bull; Scrollytelling 3 Seri Robot &bull; Jigs ICT/FCT &bull; MES</text>

            <!-- Leaf 4: /products -->
            <line x1="45" y1="272" x2="62" y2="272" stroke="#0d9488" stroke-width="1.2"/>
            <circle cx="45" cy="272" r="2.5" fill="#0d9488"/>
            <rect x="62" y="257" width="283" height="30" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="72" y="270" fill="#0f172a" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold">/products (Katalog Produk Terpadu)</text>
            <text x="72" y="281" fill="#64748b" font-family="Arial, sans-serif" font-size="7">Filter 7 Kategori &bull; Search SKU &bull; 19 Produk &bull; JSON Specs &bull; Modal RFQ</text>

            <!-- Leaf 5: /gallery -->
            <line x1="45" y1="312" x2="62" y2="312" stroke="#0d9488" stroke-width="1.2"/>
            <circle cx="45" cy="312" r="2.5" fill="#0d9488"/>
            <rect x="62" y="297" width="283" height="30" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="72" y="310" fill="#0f172a" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold">/gallery (Dokumentasi Fasilitas)</text>
            <text x="72" y="321" fill="#64748b" font-family="Arial, sans-serif" font-size="7">Lini SMT 80k CPH &bull; Oven N2 &bull; 3D AOI/X-Ray Lab &bull; Lightbox Zoom</text>

            <!-- Leaf 6: /contact -->
            <line x1="45" y1="352" x2="62" y2="352" stroke="#0d9488" stroke-width="1.2"/>
            <circle cx="45" cy="352" r="2.5" fill="#0d9488"/>
            <rect x="62" y="337" width="283" height="30" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="72" y="350" fill="#0f172a" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold">/contact (Kontak &amp; RFQ Inbound)</text>
            <text x="72" y="361" fill="#64748b" font-family="Arial, sans-serif" font-size="7">Form RFQ Anti-Spam &bull; Direct WA &bull; Google Maps Embed Batam</text>

            <!-- Leaf 7: /* (404) -->
            <line x1="45" y1="392" x2="62" y2="392" stroke="#0d9488" stroke-width="1.2"/>
            <circle cx="45" cy="392" r="2.5" fill="#0d9488"/>
            <rect x="62" y="377" width="283" height="30" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="72" y="390" fill="#0f172a" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold">/* (Penanganan Error 404)</text>
            <text x="72" y="401" fill="#64748b" font-family="Arial, sans-serif" font-size="7">Fallback Halaman Responsif &bull; Tombol Navigasi Kembali ke Beranda</text>

            <!-- Badge Fitur Global Publik -->
            <rect x="62" y="417" width="283" height="36" rx="4" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="3,2" stroke-width="1"/>
            <text x="72" y="430" fill="#0f172a" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold">Komponen Navigasi &amp; Telemetri Global:</text>
            <text x="72" y="442" fill="#475569" font-family="Arial, sans-serif" font-size="7">Bilingual ID/EN &bull; Dark/Light Cockpit Theme &bull; Visitor Telemetry</text>


            <!-- ════════ BRANCH 2: PORTAL ADMINISTRASI (RIGHT COLUMN) ════════ -->
            <!-- Header Box Admin -->
            <g filter="url(#nodeShadow)">
              <rect x="395" y="92" width="320" height="38" rx="5" fill="#f8fafc" stroke="#2563eb" stroke-width="1.5"/>
              <rect x="395" y="92" width="6" height="38" rx="2" fill="#2563eb"/>
              <text x="410" y="108" fill="#0f172a" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold">PORTAL ADMINISTRASI (/admin)</text>
              <text x="410" y="122" fill="#64748b" font-family="Arial, sans-serif" font-size="7.5">Headless CMS &bull; Otentikasi JWT &bull; RBAC &bull; Audit Trail</text>
            </g>

            <!-- Login Gate Dropdown -->
            <line x1="555" y1="130" x2="555" y2="142" stroke="#2563eb" stroke-width="1.4"/>
            <rect x="415" y="142" width="280" height="28" rx="4" fill="#eff6ff" stroke="#93c5fd" stroke-width="1"/>
            <text x="555" y="155" fill="#1e3a8a" font-family="Arial, sans-serif" font-size="8" font-weight="bold" text-anchor="middle">/admin/login (Gerbang Masuk &amp; Keamanan JWT)</text>
            <text x="555" y="165" fill="#3b82f6" font-family="Arial, sans-serif" font-size="7" text-anchor="middle">Quick Demo: Administrator &bull; HRD Manager &bull; Staff Konten</text>

            <!-- Connector to Tab Modules -->
            <line x1="555" y1="170" x2="555" y2="182" stroke="#2563eb" stroke-width="1.4"/>
            <circle cx="555" cy="182" r="3" fill="#2563eb"/>

            <!-- Admin Sub-Bus for 2 Sub-Columns -->
            <line x1="410" y1="182" x2="700" y2="182" stroke="#2563eb" stroke-width="1.2"/>

            <!-- Sub-Column A Trunk (Left Admin: Config & CMS) -->
            <line x1="410" y1="182" x2="410" y2="355" stroke="#2563eb" stroke-width="1.2"/>

            <!-- Modul 1: ?tab=overview -->
            <line x1="410" y1="202" x2="422" y2="202" stroke="#2563eb" stroke-width="1"/>
            <circle cx="410" cy="202" r="2" fill="#2563eb"/>
            <rect x="422" y="190" width="135" height="25" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="430" y="201" fill="#0f172a" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold">?tab=overview</text>
            <text x="430" y="210" fill="#64748b" font-family="Arial, sans-serif" font-size="6.5">Telemetri &amp; Status DB</text>

            <!-- Modul 2: ?tab=branding -->
            <line x1="410" y1="237" x2="422" y2="237" stroke="#2563eb" stroke-width="1"/>
            <circle cx="410" cy="237" r="2" fill="#2563eb"/>
            <rect x="422" y="225" width="135" height="25" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="430" y="236" fill="#0f172a" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold">?tab=branding</text>
            <text x="430" y="245" fill="#64748b" font-family="Arial, sans-serif" font-size="6.5">Identitas Visual &amp; Logo</text>

            <!-- Modul 3: ?tab=home -->
            <line x1="410" y1="272" x2="422" y2="272" stroke="#2563eb" stroke-width="1"/>
            <circle cx="410" cy="272" r="2" fill="#2563eb"/>
            <rect x="422" y="260" width="135" height="25" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="430" y="271" fill="#0f172a" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold">?tab=home</text>
            <text x="430" y="280" fill="#64748b" font-family="Arial, sans-serif" font-size="6.5">Hero Slider &amp; Stats FTZ</text>

            <!-- Modul 4: ?tab=about -->
            <line x1="410" y1="307" x2="422" y2="307" stroke="#2563eb" stroke-width="1"/>
            <circle cx="410" cy="307" r="2" fill="#2563eb"/>
            <rect x="422" y="295" width="135" height="25" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="430" y="306" fill="#0f172a" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold">?tab=about</text>
            <text x="430" y="315" fill="#64748b" font-family="Arial, sans-serif" font-size="6.5">Profil, Visi &amp; Fasilitas</text>

            <!-- Modul 5: ?tab=automation -->
            <line x1="410" y1="342" x2="422" y2="342" stroke="#2563eb" stroke-width="1"/>
            <circle cx="410" cy="342" r="2" fill="#2563eb"/>
            <rect x="422" y="330" width="135" height="25" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="430" y="341" fill="#0f172a" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold">?tab=automation</text>
            <text x="430" y="350" fill="#64748b" font-family="Arial, sans-serif" font-size="6.5">Seri Robot &amp; Test Jigs</text>


            <!-- Sub-Column B Trunk (Right Admin: Data & Ops) -->
            <line x1="565" y1="182" x2="565" y2="355" stroke="#2563eb" stroke-width="1.2"/>

            <!-- Modul 6: ?tab=products -->
            <line x1="565" y1="202" x2="577" y2="202" stroke="#2563eb" stroke-width="1"/>
            <circle cx="565" cy="202" r="2" fill="#2563eb"/>
            <rect x="577" y="190" width="135" height="25" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="585" y="201" fill="#0f172a" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold">?tab=products</text>
            <text x="585" y="210" fill="#64748b" font-family="Arial, sans-serif" font-size="6.5">Katalog 19 SKU &amp; Specs</text>

            <!-- Modul 7: ?tab=gallery -->
            <line x1="565" y1="237" x2="577" y2="237" stroke="#2563eb" stroke-width="1"/>
            <circle cx="565" cy="237" r="2" fill="#2563eb"/>
            <rect x="577" y="225" width="135" height="25" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="585" y="236" fill="#0f172a" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold">?tab=gallery</text>
            <text x="585" y="245" fill="#64748b" font-family="Arial, sans-serif" font-size="6.5">Foto Fasilitas Produksi</text>

            <!-- Modul 8: ?tab=contact -->
            <line x1="565" y1="272" x2="577" y2="272" stroke="#2563eb" stroke-width="1"/>
            <circle cx="565" cy="272" r="2" fill="#2563eb"/>
            <rect x="577" y="260" width="135" height="25" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="585" y="271" fill="#0f172a" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold">?tab=contact</text>
            <text x="585" y="280" fill="#64748b" font-family="Arial, sans-serif" font-size="6.5">Resend/SMTP &amp; CRM RFQ</text>

            <!-- Modul 9: ?tab=users -->
            <line x1="565" y1="307" x2="577" y2="307" stroke="#2563eb" stroke-width="1"/>
            <circle cx="565" cy="307" r="2" fill="#2563eb"/>
            <rect x="577" y="295" width="135" height="25" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="585" y="306" fill="#0f172a" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold">?tab=users (RBAC)</text>
            <text x="585" y="315" fill="#64748b" font-family="Arial, sans-serif" font-size="6.5">Kelola Staf (Admin/HRD)</text>

            <!-- Modul 10: ?tab=logs -->
            <line x1="565" y1="342" x2="577" y2="342" stroke="#2563eb" stroke-width="1"/>
            <circle cx="565" cy="342" r="2" fill="#2563eb"/>
            <rect x="577" y="330" width="135" height="25" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <text x="585" y="341" fill="#0f172a" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold">?tab=logs (Audit)</text>
            <text x="585" y="350" fill="#64748b" font-family="Arial, sans-serif" font-size="6.5">Audit Trail Forensik Data</text>

            <!-- Bottom Admin Security & Cloud Integration Badge -->
            <rect x="422" y="375" width="290" height="42" rx="4" fill="#f8fafc" stroke="#93c5fd" stroke-dasharray="3,2" stroke-width="1"/>
            <text x="432" y="390" fill="#1e3a8a" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold">Standar Keamanan &amp; Integrasi Cloud:</text>
            <text x="432" y="401" fill="#475569" font-family="Arial, sans-serif" font-size="7">bcryptjs (10 salt) &bull; RestrictTo RBAC &bull; Append-Only Logs</text>
            <text x="432" y="411" fill="#2563eb" font-family="Arial, sans-serif" font-size="6.8" font-weight="bold">Resend HTTPS API (Port 443 — Bebas Blokir Firewall Cloud)</text>

            <!-- Footer Legend -->
            <rect x="25" y="475" width="690" height="34" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
            <circle cx="45" cy="492" r="4" fill="#0d9488"/>
            <text x="55" y="495" fill="#334155" font-family="Arial, sans-serif" font-size="7.5"><strong>Portal Publik:</strong> 6 Rute Inti + 404 Handler &bull; Responsif &amp; Terhubung Langsung ke WhatsApp / Email</text>
            <circle cx="395" cy="492" r="4" fill="#2563eb"/>
            <text x="405" y="495" fill="#334155" font-family="Arial, sans-serif" font-size="7.5"><strong>Portal Admin:</strong> 10 Modul CMS Berbasis Tab &bull; Terproteksi JWT Token &amp; Hak Akses Bertingkat</text>
          </svg>
        </div>
      `
    },
    {
      secNumber: "2",
      title: "Cakupan Rinci Halaman & Komponen Section Portal Publik",
      contentHtml: `
        <p>Portal publik dirancang untuk memberikan pengalaman navigasi yang intuitif, informatif, dan meyakinkan bagi mitra industri internasional. Berikut adalah rincian seluruh halaman publik, struktur section internal, fungsi operasional, fitur-fitur, dan tujuan rekayasanya:</p>

        <!-- 2.1 HOME PAGE -->
        <div class="sitemap-tree-box" style="margin-top: 14px;">
          <div class="sitemap-tree-header">
            <span>1. Halaman Beranda (Home Page) &bull; Rute: <code>/</code></span>
            <span class="sitemap-tree-header-tag">PUBLIC ROUTE</span>
          </div>
          <div class="sitemap-tree-body">
            <table class="table-custom" style="margin: 0;">
              <thead>
                <tr>
                  <th style="width: 20%;">Section / Komponen</th>
                  <th style="width: 30%;">Fungsi Operasional</th>
                  <th style="width: 25%;">Fitur Interaktif &amp; Teknis</th>
                  <th style="width: 25%;">Tujuan Pembuatan (Untuk Apa)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Hero Carousel Fullscreen (100vh)</strong></td>
                  <td>Menyajikan impresi visual pertama (first impression) berstandar industri dengan background fasilitas manufaktur berskala penuh.</td>
                  <td>
                    &bull; Multi-slide carousel otomatis (6,5 detik)<br>
                    &bull; Pause on hover &amp; kontrol dash progress<br>
                    &bull; Animasi typewriter keyword dinamis<br>
                    &bull; Tombol CTA interaktif (RFQ &amp; Kapabilitas)
                  </td>
                  <td>Membangun kredibilitas instan bahwa PT Global Philsonic Technologies adalah manufaktur elektronik presisi kelas dunia di Batam FTZ.</td>
                </tr>
                <tr>
                  <td><strong>Stats Deck (Telemetri Angka Kunci)</strong></td>
                  <td>Menampilkan 4 metrik performa operasional pabrik yang terukur dan kredibel secara kuantitatif.</td>
                  <td>
                    &bull; Animasi penghitung angka (CountUp observer)<br>
                    &bull; 80.000 CPH SMT Placement Speed<br>
                    &bull; 0% Bea Masuk Batam Free Trade Zone<br>
                    &bull; 100% IPC-A-610 Class 3 Inspection<br>
                    &bull; &lt;24 Jam Respons B2B Inquiry
                  </td>
                  <td>Memberikan bukti konkret atas kapasitas dan kecepatan produksi perusahaan kepada calon pembeli (buyer) industri.</td>
                </tr>
                <tr>
                  <td><strong>About &amp; Product Portfolio Section</strong></td>
                  <td>Memperkenalkan ringkasan identitas korporat dan memandu pengunjung langsung ke lini produk utama.</td>
                  <td>
                    &bull; Split grid layout responsif<br>
                    &bull; Tautan langsung ke kategori produk<br>
                    &bull; Efek transisi kartu dengan micro-interaction
                  </td>
                  <td>Menjembatani alur navigasi dari pengenalan awal menuju eksplorasi produk yang lebih mendalam.</td>
                </tr>
                <tr>
                  <td><strong>Company Turnkey Lifecycle (5-Stage)</strong></td>
                  <td>Memvisualisasikan alur kerja manufaktur menyeluruh dari perancangan hingga pengiriman logistik.</td>
                  <td>
                    &bull; 5 Tahapan: Engineering Design &rarr; SMT PCBA &rarr; Box-Build &rarr; Automated Testing &rarr; Global Logistics<br>
                    &bull; Indikator progres bernomor dengan garis alir
                  </td>
                  <td>Menunjukkan kapabilitas *turnkey contract manufacturing* penuh di mana klien dapat menyerahkan proyek dari konsep awal hingga produk jadi siap kirim.</td>
                </tr>
                <tr>
                  <td><strong>Global Footprint &amp; Batam FTZ Logistics</strong></td>
                  <td>Menjelaskan posisi strategis pabrik Batam yang hanya berjarak 45 menit dari Pelabuhan Singapura.</td>
                  <td>
                    &bull; Diagram rute multimoda (Laut &amp; Udara via Changi)<br>
                    &bull; Ringkasan keunggulan bonded warehouse FTZ
                  </td>
                  <td>Meyakinkan mitra multinasional bahwa rantai pasok (supply chain) dan pengiriman ekspor sangat efisien dan bebas hambatan tarif.</td>
                </tr>
                <tr>
                  <td><strong>Call to Action (CTA) Banner</strong></td>
                  <td>Ajakan bertindak penutup halaman untuk mengonversi pengunjung menjadi prospek bisnis riil.</td>
                  <td>
                    &bull; Tombol pintas pengajuan RFQ langsung<br>
                    &bull; Tautan penjadwalan audit fasilitas pabrik
                  </td>
                  <td>Meningkatkan rasio konversi (conversion rate) prospek bisnis B2B secara terukur.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2.2 ABOUT PAGE -->
        <div class="sitemap-tree-box" style="margin-top: 14px;">
          <div class="sitemap-tree-header">
            <span>2. Halaman Profil Perusahaan &bull; Rute: <code>/about</code></span>
            <span class="sitemap-tree-header-tag">PUBLIC ROUTE</span>
          </div>
          <div class="sitemap-tree-body">
            <table class="table-custom" style="margin: 0;">
              <thead>
                <tr>
                  <th style="width: 20%;">Section / Komponen</th>
                  <th style="width: 30%;">Fungsi Operasional</th>
                  <th style="width: 25%;">Fitur Interaktif &amp; Teknis</th>
                  <th style="width: 25%;">Tujuan Pembuatan (Untuk Apa)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Hero Profil Perusahaan</strong></td>
                  <td>Membuka halaman tentang perusahaan dengan visualisasi gedung fasilitas pabrik Batam Industrial Park.</td>
                  <td>
                    &bull; Dynamic badge sertifikasi mutu<br>
                    &bull; Judul dan subjudul bilingual
                  </td>
                  <td>Menegaskan status legalitas dan eksistensi fisik pabrik manufaktur di Batam.</td>
                </tr>
                <tr>
                  <td><strong>Narasi Korporat &amp; 3D Tilt Card</strong></td>
                  <td>Menceritakan fondasi rekayasa perusahaan dan dedikasi pada industri otomotif presisi tinggi.</td>
                  <td>
                    &bull; Kartu foto fasilitas dengan interaksi perspektif miring 3D (card tilt mengikuti kursor mouse)<br>
                    &bull; Dynamic glare lighting effect
                  </td>
                  <td>Memberikan sentuhan modernitas teknologi tinggi (high-tech aesthetics) yang membedakan website dari profil kompetitor tradisional.</td>
                </tr>
                <tr>
                  <td><strong>Visi, Misi, &amp; 4 Pilar Nilai Inti</strong></td>
                  <td>Menegaskan komitmen strategis perusahaan dan budaya kerja profesional.</td>
                  <td>
                    &bull; 4 Kartu Pilar: Presisi Teknis, Integritas Kemitraan, Inovasi Otomasi, dan Kepuasan Mitra Tier-1
                  </td>
                  <td>Memenuhi kriteria audit korporat internasional dalam hal tata kelola perusahaan (good corporate governance).</td>
                </tr>
                <tr>
                  <td><strong>Manufacturing Facilities &amp; Cleanroom Zones</strong></td>
                  <td>Memamerkan zona-zona kritis di dalam pabrik manufaktur secara transparan.</td>
                  <td>
                    &bull; Pemilih tab 4 Zona: Cleanroom ESD Class 100K, Lini SMT 80k CPH, Lab 3D AOI &amp; X-Ray, Tooling Workshop<br>
                    &bull; Pergantian foto resolusi tinggi seketika
                  </td>
                  <td>Memberikan bukti visual otentik bahwa pabrik memiliki ruang bersih dan mesin perakitan yang memenuhi standar otomotif internasional.</td>
                </tr>
                <tr>
                  <td><strong>Historical Milestones Timeline</strong></td>
                  <td>Menyajikan rekam jejak pertumbuhan perusahaan dari tahun ke tahun (2018 s/d 2026).</td>
                  <td>
                    &bull; Linimasa vertikal dengan penanda tahun dan pencapaian ekspansi kapasitas
                  </td>
                  <td>Membuktikan stabilitas bisnis dan perkembangan teknologi perusahaan secara berkelanjutan.</td>
                </tr>
                <tr>
                  <td><strong>Batam FTZ Strategic Advantage (Bento Grid)</strong></td>
                  <td>Menjabarkan keuntungan komparatif lokasi manufaktur di Kawasan Perdagangan Bebas Batam.</td>
                  <td>
                    &bull; Bento grid modern multi-dimensi<br>
                    &bull; 0% Bea Masuk Komponen, Pajak Pertambahan Nilai 0%, Bebas Pajak Penjualan Barang Mewah
                  </td>
                  <td>Menjelaskan secara transparan mengapa biaya produksi di Batam jauh lebih kompetitif dibandingkan kawasan lain di Asia Tenggara.</td>
                </tr>
                <tr>
                  <td><strong>Sertifikasi Kepatuhan &amp; Mutu</strong></td>
                  <td>Menampilkan daftar akreditasi dan sertifikat internasional yang telah diraih.</td>
                  <td>
                    &bull; ISO 9001:2015, IATF 16949 (Standar Otomotif), ISO 14001, Kepatuhan Bahan Kimia RoHS &amp; REACH
                  </td>
                  <td>Menjadi syarat mutlak (pre-requisite) bagi calon pembeli OEM otomotif dalam meloloskan tahap vendor qualification.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2.3 AUTOMATION PAGE -->
        <div class="sitemap-tree-box" style="margin-top: 14px;">
          <div class="sitemap-tree-header">
            <span>3. Halaman Otomasi Industri &bull; Rute: <code>/automation</code></span>
            <span class="sitemap-tree-header-tag">PUBLIC ROUTE</span>
          </div>
          <div class="sitemap-tree-body">
            <table class="table-custom" style="margin: 0;">
              <thead>
                <tr>
                  <th style="width: 20%;">Section / Komponen</th>
                  <th style="width: 30%;">Fungsi Operasional</th>
                  <th style="width: 25%;">Fitur Interaktif &amp; Teknis</th>
                  <th style="width: 25%;">Tujuan Pembuatan (Untuk Apa)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>WebGL 3D Robot Canvas Simulation</strong></td>
                  <td>Simulasi real-time interaktif lengan robot 6-sumbu berkecepatan 60 FPS langsung di peramban tanpa plugin.</td>
                  <td>
                    &bull; Rotasi 360&deg;, tilt, dan zoom orbit control<br>
                    &bull; Telemetri dinamis sudut sumbu Joint 1 s/d 6<br>
                    &bull; Mode Wireframe (tampilan geometris rekayasa)<br>
                    &bull; Tombol uji simulasi Emergency Stop (E-Stop)
                  </td>
                  <td>Menjadi fitur pamer teknologi (showstopper) yang membuktikan keunggulan rekayasa sistem otomatisasi perusahaan kepada klien teknik.</td>
                </tr>
                <tr>
                  <td><strong>Scrollytelling 3 Seri Robot Industri</strong></td>
                  <td>Eksplorasi mendalam 3 lini robot manufaktur otentik: Robot Welding, Robot Handling, dan Robot Laser Cutting.</td>
                  <td>
                    &bull; 4 Bab terstruktur per robot: Ikhtisar, Kinematika, Perkakas Proses, dan Spesifikasi Teknis<br>
                    &bull; Foto otentik aset robotika beresolusi tinggi<br>
                    &bull; Filter tag material dan protokol bus
                  </td>
                  <td>Menyajikan informasi teknis mendalam yang dibutuhkan oleh manajer pabrik dan insinyur otomasi dalam memilih solusi perakitan.</td>
                </tr>
                <tr>
                  <td><strong>Automated Testing Fixtures (ICT/FCT)</strong></td>
                  <td>Menjelaskan layanan perancangan jig uji fungsional elektronik khusus pesanan (custom-built).</td>
                  <td>
                    &bull; Pogo-pin test bed, pneumatik vacuum clamping, pengujian sirkuit terpadu otomatis
                  </td>
                  <td>Menghilangkan risiko cacat tersembunyi (zero defect) pada produk elektronik otomotif sebelum dikirim ke pelanggan.</td>
                </tr>
                <tr>
                  <td><strong>Smart Factory 4.0 &amp; Cloud MES</strong></td>
                  <td>Menerangkan konektivitas data produksi secara real-time dari lantai pabrik ke cloud dashboard.</td>
                  <td>
                    &bull; Protokol EtherCAT, PROFINET, pelacakan OEE (Overall Equipment Effectiveness), dan barcode traceability
                  </td>
                  <td>Menjamin ketertelusuran penuh komponen (part traceability) sesuai standar audit otomotif IATF 16949.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2.4 PRODUCTS PAGE -->
        <div class="sitemap-tree-box" style="margin-top: 14px;">
          <div class="sitemap-tree-header">
            <span>4. Halaman Katalog Produk Terpadu &bull; Rute: <code>/products</code></span>
            <span class="sitemap-tree-header-tag">PUBLIC ROUTE</span>
          </div>
          <div class="sitemap-tree-body">
            <table class="table-custom" style="margin: 0;">
              <thead>
                <tr>
                  <th style="width: 20%;">Section / Komponen</th>
                  <th style="width: 30%;">Fungsi Operasional</th>
                  <th style="width: 25%;">Fitur Interaktif &amp; Teknis</th>
                  <th style="width: 25%;">Tujuan Pembuatan (Untuk Apa)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Filter 7 Kategori Produk Terpadu</strong></td>
                  <td>Memfilter 19 SKU produk ke dalam 7 kategori manufaktur otentik secara instan tanpa reload halaman.</td>
                  <td>
                    &bull; 7 Kategori: Otomasi, Mobile Intelligent Device, Amplifier, Subwoofer, DSP, Android Headunit, Dashcam<br>
                    &bull; Penghitung jumlah SKU aktif per kategori
                  </td>
                  <td>Menyatukan seluruh ragam produk manufaktur ke dalam satu antarmuka terpadu agar calon pembeli dapat menelusuri portofolio secara efisien.</td>
                </tr>
                <tr>
                  <td><strong>Pencarian Realtime SKU &amp; Kata Kunci</strong></td>
                  <td>Memudahkan pencarian instan berdasarkan kode model (misal: "GPT-MID-901") atau spesifikasi teknis.</td>
                  <td>
                    &bull; Input pencarian asinkron dengan filter instan<br>
                    &bull; Respons rendering dalam hitungan milidetik
                  </td>
                  <td>Mempercepat insinyur pengadaan dalam menemukan SKU spesifik tanpa harus membaca seluruh daftar.</td>
                </tr>
                <tr>
                  <td><strong>Grid Kartu Produk (19 SKU)</strong></td>
                  <td>Menampilkan ringkasan visual dan parameter teknis utama untuk setiap produk elektronik dan otomasi.</td>
                  <td>
                    &bull; Foto produk berkualitas tinggi<br>
                    &bull; Badge model code dan kategori<br>
                    &bull; Chip spesifikasi kunci (Daya, Tegangan, Resolusi)<br>
                    &bull; Tombol ganda: Spesifikasi Lengkap &amp; Minta Penawaran
                  </td>
                  <td>Memberikan perbandingan cepat antar produk sebelum masuk ke rincian spesifikasi mendalam.</td>
                </tr>
                <tr>
                  <td><strong>Modal Spesifikasi Teknis Interaktif</strong></td>
                  <td>Jendela popup yang menampilkan lembar data teknis komprehensif (datasheet JSON) dari produk terpilih.</td>
                  <td>
                    &bull; Tabel JSON spesifikasi lengkap (THD, SNR, Frekuensi)<br>
                    &bull; Galeri multi-foto dengan switcher thumbnail<br>
                    &bull; Tombol unduh datasheet teknis berformat PDF
                  </td>
                  <td>Menyediakan dokumen spesifikasi teknis setingkat lembar data pabrikan resmi untuk keperluan evaluasi engineering klien.</td>
                </tr>
                <tr>
                  <td><strong>Skema Sirkuit &amp; Blok Arsitektur</strong></td>
                  <td>Visualisasi diagram blok internal yang menjelaskan alur sinyal elektronik produk.</td>
                  <td>
                    &bull; Diagram blok interaktif (Power Stage, DSP Architecture, MCU Control)<br>
                    &bull; Tata letak skematik standar industri
                  </td>
                  <td>Membuktikan transparansi arsitektur elektronik dan kapabilitas rekayasa sirkuit internal perusahaan.</td>
                </tr>
                <tr>
                  <td><strong>Modal RFQ Terhubung WhatsApp &amp; Email</strong></td>
                  <td>Formulir pemesanan penawaran harga langsung dari kartu produk dengan data SKU yang terisi otomatis.</td>
                  <td>
                    &bull; Pilihan skala volume produksi: Prototipe (10-50 unit), Volume Sedang (1k-10k), Produksi Massal (&gt;10k unit)<br>
                    &bull; Integrasi langsung ke obrolan WhatsApp sales B2B
                  </td>
                  <td>Memangkas birokrasi komunikasi sehingga calon pembeli dapat langsung berinteraksi dengan tim penjualan komersial.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2.5 GALLERY PAGE -->
        <div class="sitemap-tree-box" style="margin-top: 14px;">
          <div class="sitemap-tree-header">
            <span>5. Halaman Galeri Fasilitas Manufaktur &bull; Rute: <code>/gallery</code></span>
            <span class="sitemap-tree-header-tag">PUBLIC ROUTE</span>
          </div>
          <div class="sitemap-tree-body">
            <table class="table-custom" style="margin: 0;">
              <thead>
                <tr>
                  <th style="width: 20%;">Section / Komponen</th>
                  <th style="width: 30%;">Fungsi Operasional</th>
                  <th style="width: 25%;">Fitur Interaktif &amp; Teknis</th>
                  <th style="width: 25%;">Tujuan Pembuatan (Untuk Apa)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Filter Kategori Fasilitas</strong></td>
                  <td>Memilah dokumentasi foto berdasarkan area kerja pabrik.</td>
                  <td>
                    &bull; Kategori: Semua, Lini SMT, Cleanroom 100K, Workshop Otomasi, Kualitas &amp; Lab NDT, Plant Batam FTZ
                  </td>
                  <td>Memudahkan auditor manufaktur melihat bukti fisik kesiapan mesin pada bidang spesifik yang sedang dievaluasi.</td>
                </tr>
                <tr>
                  <td><strong>Grid Foto Fasilitas Beresolusi Tinggi</strong></td>
                  <td>Menyajikan dokumentasi visual peralatan produksi dengan badge lokasi teluk pabrik (bay location).</td>
                  <td>
                    &bull; Hover overlay efek industri<br>
                    &bull; Label spesifikasi mesin (misal: 80k CPH, KIC thermal profiler, 160kV X-Ray microfocus)
                  </td>
                  <td>Memberikan bukti transparansi operasional dan kemutakhiran mesin pabrik.</td>
                </tr>
                <tr>
                  <td><strong>Lightbox Modal Zoom &amp; Inspeksi Detail</strong></td>
                  <td>Jendela pembesar foto untuk melihat rincian presisi mesin perakitan dan ruang bersih.</td>
                  <td>
                    &bull; Tampilan gambar layar penuh<br>
                    &bull; Rincian parameter teknis dan standar pengoperasian
                  </td>
                  <td>Memungkinkan tim teknis klien memeriksa kerapian dan standar sanitasi/ESD fasilitas perakitan secara visual.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2.6 CONTACT PAGE -->
        <div class="sitemap-tree-box" style="margin-top: 14px;">
          <div class="sitemap-tree-header">
            <span>6. Halaman Kontak &amp; RFQ B2B &bull; Rute: <code>/contact</code></span>
            <span class="sitemap-tree-header-tag">PUBLIC ROUTE</span>
          </div>
          <div class="sitemap-tree-body">
            <table class="table-custom" style="margin: 0;">
              <thead>
                <tr>
                  <th style="width: 20%;">Section / Komponen</th>
                  <th style="width: 30%;">Fungsi Operasional</th>
                  <th style="width: 25%;">Fitur Interaktif &amp; Teknis</th>
                  <th style="width: 25%;">Tujuan Pembuatan (Untuk Apa)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Saluran Komunikasi Resmi</strong></td>
                  <td>Menyajikan kontak resmi perusahaan untuk komunikasi cepat.</td>
                  <td>
                    &bull; Email resmi: sales@globalphilsonic.com<br>
                    &bull; Telepon kantor hunting Batam: +62 778 408 8888<br>
                    &bull; WhatsApp B2B Sales &amp; tautan profil LinkedIn
                  </td>
                  <td>Memberikan saluran resmi multi-kanal yang mudah dihubungi oleh klien domestik maupun internasional.</td>
                </tr>
                <tr>
                  <td><strong>Formulir RFQ B2B Anti-Spam Terpadu</strong></td>
                  <td>Gerbang pengajuan penawaran harga resmi dengan parameter spesifik kebutuhan industri.</td>
                  <td>
                    &bull; Input: Nama, Perusahaan, Email Korporat, Telepon/WhatsApp, Kategori Proyek, Estimasi Target Volume, Pesan Teknis<br>
                    &bull; Perangkap Honeypot (silent drop untuk bot spam)<br>
                    &bull; Algoritma Evaluator Skor Spam otomatis<br>
                    &bull; Notifikasi Email Asinkron (Resend HTTPS API / SMTP)<br>
                    &bull; Auto-Reply tanda terima resmi otomatis ke pemohon<br>
                    &bull; Direct WhatsApp redirect dengan draf pesan otomatis
                  </td>
                  <td>Mengumpulkan data kebutuhan proyek klien secara terstruktur, mencegah database dipenuhi spam bot, dan memastikan tim sales menerima notifikasi detik itu juga.</td>
                </tr>
                <tr>
                  <td><strong>Titik Lokasi Google Maps Batam Interaktif</strong></td>
                  <td>Peta interaktif yang menunjukkan posisi fisik fasilitas pabrik di Batam Industrial Park.</td>
                  <td>
                    &bull; Google Maps Iframe Embed dengan koordinat lintang/bujur presisi<br>
                    &bull; Tombol "Buka di Google Maps" eksternal
                  </td>
                  <td>Mempermudah klien dan auditor asing dalam merencanakan rute kunjungan lapangan saat mendarat di Batam.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2.7 GLOBAL COMPONENTS & 404 -->
        <div class="sitemap-tree-box" style="margin-top: 14px;">
          <div class="sitemap-tree-header">
            <span>7. Komponen Navigasi Global &amp; Halaman Penanganan Error (404) &bull; Rute: <code>/*</code></span>
            <span class="sitemap-tree-header-tag">GLOBAL FRAMEWORK</span>
          </div>
          <div class="sitemap-tree-body">
            <table class="table-custom" style="margin: 0;">
              <thead>
                <tr>
                  <th style="width: 20%;">Komponen</th>
                  <th style="width: 30%;">Fungsi Operasional</th>
                  <th style="width: 25%;">Fitur Interaktif &amp; Teknis</th>
                  <th style="width: 25%;">Tujuan Pembuatan (Untuk Apa)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Global Navbar (Header)</strong></td>
                  <td>Navigasi utama yang melayang (sticky) pada bagian atas seluruh halaman portal publik.</td>
                  <td>
                    &bull; Switcher Bahasa Bilingual (ID / EN) via pustaka i18next<br>
                    &bull; Switcher Tema Tampilan (Dark Cockpit / Clean Light Mode)<br>
                    &bull; Indikator rute aktif &amp; Mobile hamburger drawer menu
                  </td>
                  <td>Memastikan pengguna internasional dapat berpindah bahasa dan halaman secara instan tanpa kehilangan konteks visual.</td>
                </tr>
                <tr>
                  <td><strong>Global Footer</strong></td>
                  <td>Navigasi sekunder penutup pada bagian bawah seluruh halaman publik.</td>
                  <td>
                    &bull; Peta situs tautan cepat (quick links)<br>
                    &bull; Alamat pabrik Batam FTZ &amp; nomor kontak resmi<br>
                    &bull; Badge sertifikasi ISO 9001:2015 &amp; IATF 16949<br>
                    &bull; Tautan hak cipta dan portal admin internal
                  </td>
                  <td>Menyediakan informasi penutup yang kredibel dan memudahkan pengunjung mengakses halaman penting dari ujung bawah halaman.</td>
                </tr>
                <tr>
                  <td><strong>Visitor Telemetry Tracker</strong></td>
                  <td>Pencatat telemetri kunjungan pengunjung yang berjalan secara asinkron di latar belakang.</td>
                  <td>
                    &bull; Mencatat session ID, IP, negara asal (CF-IPCountry), user-agent, dan halaman yang dikunjungi<br>
                    &bull; 100% bebas cookie pihak ketiga (GDPR compliant)
                  </td>
                  <td>Memberikan data statistik kepada manajemen mengenai dari negara mana saja calon mitra mengakses website perusahaan.</td>
                </tr>
                <tr>
                  <td><strong>NotFoundPage (404 Handler)</strong></td>
                  <td>Menangani seluruh permintaan rute URL yang tidak terdaftar pada sistem perutean React.</td>
                  <td>
                    &bull; Tampilan responsif dengan ilustrasi geometris industri<br>
                    &bull; Tombol arah balik ke Beranda (Back to Home)
                  </td>
                  <td>Mencegah layar putih (blank screen) jika pengguna salah mengetik URL dan menjaga kenyamanan navigasi.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `
    },
    {
      secNumber: "3",
      title: "Cakupan Rinci Halaman & Modul Portal Administrasi (Headless CMS)",
      contentHtml: `
        <p>Portal administrasi merupakan sistem manajemen konten terpusat (Headless CMS) yang dirancang khusus untuk mempermudah staf internal mengelola seluruh konten manufaktur dan menindaklanjuti permohonan penawaran harga. Berikut adalah rincian seluruh modul administrasi, struktur formulir di dalamnya, fungsi, fitur, dan tujuan pembuatannya:</p>

        <!-- 3.1 ADMIN LOGIN -->
        <div class="sitemap-tree-box" style="margin-top: 14px;">
          <div class="sitemap-tree-header">
            <span>1. Halaman Masuk Admin &bull; Rute: <code>/admin/login</code></span>
            <span class="sitemap-tree-header-tag">AUTH GATE</span>
          </div>
          <div class="sitemap-tree-body">
            <table class="table-custom" style="margin: 0;">
              <thead>
                <tr>
                  <th style="width: 20%;">Section / Komponen</th>
                  <th style="width: 30%;">Fungsi Operasional</th>
                  <th style="width: 25%;">Fitur Interaktif &amp; Teknis</th>
                  <th style="width: 25%;">Tujuan Pembuatan (Untuk Apa)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Formulir Otentikasi JWT</strong></td>
                  <td>Memverifikasi identitas pengguna sebelum mengizinkan akses ke dalam dasbor manajemen data.</td>
                  <td>
                    &bull; Validasi format email/username dan kata sandi<br>
                    &bull; Enkripsi sandi via bcryptjs (10 salt rounds)<br>
                    &bull; Penerbitan token JWT tersimpan aman di localStorage<br>
                    &bull; Proteksi brute force login rate-limiter
                  </td>
                  <td>Melindungi integritas data perusahaan dari akses pihak luar yang tidak memiliki wewenang.</td>
                </tr>
                <tr>
                  <td><strong>Panel Quick Demo Access (3 Akun Dummy)</strong></td>
                  <td>Fitur kemudahan demonstrasi untuk menguji sistem dengan 3 tingkatan peran kerja berbeda.</td>
                  <td>
                    &bull; 3 Tombol Chip: Administrator, HRD Manager, dan Staff Konten<br>
                    &bull; Sekali klik mengisi otomatis email dan kata sandi
                  </td>
                  <td>Mempermudah penguji, asesor, dan manajemen dalam mendemonstrasikan sistem tanpa repot menghafal kredensial.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3.2 OVERVIEW & BRANDING MODULES -->
        <div class="sitemap-tree-box" style="margin-top: 14px;">
          <div class="sitemap-tree-header">
            <span>2. Modul Ringkasan &amp; Identitas Visual &bull; Tab: <code>overview</code> &amp; <code>branding</code></span>
            <span class="sitemap-tree-header-tag">ADMIN MODULE</span>
          </div>
          <div class="sitemap-tree-body">
            <table class="table-custom" style="margin: 0;">
              <thead>
                <tr>
                  <th style="width: 20%;">Modul / Tab</th>
                  <th style="width: 30%;">Fungsi Operasional</th>
                  <th style="width: 25%;">Fitur Interaktif &amp; Teknis</th>
                  <th style="width: 25%;">Tujuan Pembuatan (Untuk Apa)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Overview (?tab=overview)</strong></td>
                  <td>Pusat kendali eksekutif yang merangkum kesehatan sistem dan metrik aktivitas dalam satu layar.</td>
                  <td>
                    &bull; 4 Kartu Metrik: Pengunjung Hari Ini, Total RFQ Baru, Total SKU Aktif, Total Catatan Audit Log<br>
                    &bull; Status koneksi server Express API &amp; MySQL Database<br>
                    &bull; Tombol navigasi cepat ke modul-modul lain
                  </td>
                  <td>Memberikan informasi kondisi operasional sistem secara sekilas kepada pengelola saat pertama kali masuk dasbor.</td>
                </tr>
                <tr>
                  <td><strong>Branding (?tab=branding)</strong></td>
                  <td>Mengatur identitas visual perusahaan yang diterapkan seragam pada seluruh portal publik.</td>
                  <td>
                    &bull; Editor nama resmi perusahaan dan slogan korporat<br>
                    &bull; Pengunggah logo header (navbar), logo footer, dan favicon browser<br>
                    &bull; Pratinjau logo live sebelum disimpan
                  </td>
                  <td>Menjaga konsistensi identitas merek (brand identity) tanpa perlu menyunting kode sumber aplikasi.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3.3 CONTENT EDITING MODULES: HOME & ABOUT -->
        <div class="sitemap-tree-box" style="margin-top: 14px;">
          <div class="sitemap-tree-header">
            <span>3. Modul Pengeditan Konten: Beranda &amp; Tentang Kami &bull; Tab: <code>home</code> &amp; <code>about</code></span>
            <span class="sitemap-tree-header-tag">ADMIN MODULE</span>
          </div>
          <div class="sitemap-tree-body">
            <table class="table-custom" style="margin: 0;">
              <thead>
                <tr>
                  <th style="width: 20%;">Modul / Tab</th>
                  <th style="width: 30%;">Fungsi Operasional</th>
                  <th style="width: 25%;">Fitur Interaktif &amp; Teknis</th>
                  <th style="width: 25%;">Tujuan Pembuatan (Untuk Apa)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Home Module (?tab=home)</strong></td>
                  <td>Mengatur seluruh elemen dinamis pada halaman Beranda utama.</td>
                  <td>
                    &bull; Editor multi-slide carousel (tambah/hapus slide, unggah gambar background, edit judul/subjudul)<br>
                    &bull; Editor daftar kata kunci animasi typewriter<br>
                    &bull; Editor angka statistik performa pabrik Batam FTZ<br>
                    &bull; Tombol Auto-Translate terjemahan otomatis ID &rarr; EN
                  </td>
                  <td>Memungkinkan tim pemasaran memperbarui promosi dan pencapaian kapasitas pabrik secara mandiri kapan saja.</td>
                </tr>
                <tr>
                  <td><strong>About Module (?tab=about)</strong></td>
                  <td>Mengatur narasi korporat, visi misi, fasilitas ruang bersih, dan linimasa sejarah.</td>
                  <td>
                    &bull; Editor teks narasi perusahaan dwibahasa<br>
                    &bull; Editor visi, misi, dan nilai-nilai inti<br>
                    &bull; Pengelola 4 zona fasilitas manufaktur (nama zona, badge, foto, deskripsi mesin)<br>
                    &bull; Editor linimasa sejarah (tambah/hapus milestone tahunan)<br>
                    &bull; Terjemahan otomatis berbasis Google Translation API
                  </td>
                  <td>Menjaga data profil pabrik dan sertifikasi mutu selalu mutakhir sesuai perkembangan audit fasilitas terbaru.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3.4 PRODUCTS & AUTOMATION MODULES -->
        <div class="sitemap-tree-box" style="margin-top: 14px;">
          <div class="sitemap-tree-header">
            <span>4. Modul Manajemen Produk &amp; Otomasi Industri &bull; Tab: <code>products</code> &amp; <code>automation</code></span>
            <span class="sitemap-tree-header-tag">ADMIN MODULE</span>
          </div>
          <div class="sitemap-tree-body">
            <table class="table-custom" style="margin: 0;">
              <thead>
                <tr>
                  <th style="width: 20%;">Modul / Tab</th>
                  <th style="width: 30%;">Fungsi Operasional</th>
                  <th style="width: 25%;">Fitur Interaktif &amp; Teknis</th>
                  <th style="width: 25%;">Tujuan Pembuatan (Untuk Apa)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Products Module (?tab=products)</strong></td>
                  <td>Pusat manajemen master data 19 SKU produk terpadu dalam 7 kategori manufaktur.</td>
                  <td>
                    &bull; Formulir multi-tab: Data Utama, Spesifikasi Teknis JSON, dan Galeri Foto Produk<br>
                    &bull; Editor format JSON spesifikasi lengkap dengan validasi sintaks otomatis<br>
                    &bull; Pengunggah foto produk utama dan foto galeri tambahan<br>
                    &bull; Pengubah status publikasi (Published / Draft)<br>
                    &bull; Fitur pencarian produk cepat dan tombol hapus aman dengan dialog konfirmasi
                  </td>
                  <td>Memberikan fleksibilitas penuh bagi staf teknik produk dalam meluncurkan SKU baru, mengubah spesifikasi daya/tegangan, dan mengarsipkan produk lawas.</td>
                </tr>
                <tr>
                  <td><strong>Automation Module (?tab=automation)</strong></td>
                  <td>Mengatur konten halaman otomasi, spesifikasi seri robot, dan kapabilitas jig pengujian.</td>
                  <td>
                    &bull; Editor judul dan parameter 3 seri robot (Welding, Handling, Cutting)<br>
                    &bull; Manajemen rincian jig uji ICT/FCT dan integrasi Cloud MES<br>
                    &bull; Sinkronisasi data ke tampilan publik
                  </td>
                  <td>Menyelaraskan informasi kapabilitas robotika di website dengan mesin otomatisasi aktual yang terpasang di lantai pabrik.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3.5 GALLERY MODULE -->
        <div class="sitemap-tree-box" style="margin-top: 14px;">
          <div class="sitemap-tree-header">
            <span>5. Modul Galeri Fasilitas Manufaktur &bull; Tab: <code>gallery</code></span>
            <span class="sitemap-tree-header-tag">ADMIN MODULE</span>
          </div>
          <div class="sitemap-tree-body">
            <table class="table-custom" style="margin: 0;">
              <thead>
                <tr>
                  <th style="width: 20%;">Modul / Tab</th>
                  <th style="width: 30%;">Fungsi Operasional</th>
                  <th style="width: 25%;">Fitur Interaktif &amp; Teknis</th>
                  <th style="width: 25%;">Tujuan Pembuatan (Untuk Apa)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Gallery Module (?tab=gallery)</strong></td>
                  <td>Mengunggah dan mengorganisir dokumentasi foto fasilitas manufaktur dan ruang bersih.</td>
                  <td>
                    &bull; Pengunggah foto resolusi tinggi dengan pratinjau instan<br>
                    &bull; Pengelompokan kategori zona fasilitas (SMT, Cleanroom, Quality, Tooling)<br>
                    &bull; Input teks judul, lokasi teluk pabrik, dan spesifikasi mesin dwibahasa<br>
                    &bull; Pengatur urutan tampil dan tombol hapus foto
                  </td>
                  <td>Memperbarui portofolio visual pabrik saat ada penambahan lini SMT baru atau sertifikasi cleanroom berkala.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3.6 CONTACT, EMAIL ENGINE, & CRM RFQ MODULE -->
        <div class="sitemap-tree-box" style="margin-top: 14px;">
          <div class="sitemap-tree-header">
            <span>6. Modul Kontak, Email Engine &amp; CRM RFQ Leads &bull; Tab: <code>contact</code></span>
            <span class="sitemap-tree-header-tag">ADMIN MODULE</span>
          </div>
          <div class="sitemap-tree-body">
            <table class="table-custom" style="margin: 0;">
              <thead>
                <tr>
                  <th style="width: 20%;">Bagian / Fitur</th>
                  <th style="width: 30%;">Fungsi Operasional</th>
                  <th style="width: 25%;">Fitur Interaktif &amp; Teknis</th>
                  <th style="width: 25%;">Tujuan Pembuatan (Untuk Apa)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Saluran Kontak &amp; Google Maps</strong></td>
                  <td>Mengatur informasi alamat pabrik, telepon kantor, nomor WhatsApp sales, dan pin peta Google Maps.</td>
                  <td>
                    &bull; Editor email resmi dan nomor WhatsApp format internasional (+62)<br>
                    &bull; Editor alamat pabrik dwibahasa<br>
                    &bull; Pengatur titik koordinat lintang &amp; bujur Google Maps dengan pratinjau peta live embed
                  </td>
                  <td>Memastikan data saluran kontak dan lokasi pabrik pada website selalu akurat dan terhubung ke perwakilan penjualan.</td>
                </tr>
                <tr>
                  <td><strong>Dual Engine Email Notification (Resend HTTPS &amp; SMTP)</strong></td>
                  <td>Mengonfigurasi pengiriman notifikasi email peringatan RFQ ke tim sales dan tanda terima otomatis ke klien.</td>
                  <td>
                    &bull; <strong>Pemilih Mesin Pengiriman (Dual Engine):</strong><br>
                    1. <em>Resend HTTPS API (Rekomendasi Cloud / Port 443):</em> Kebal blokir port firewall Railway/Vercel, pengiriman instan (~300ms) tanpa timeout.<br>
                    2. <em>SMTP Konvensional (Port 465/587):</em> Koneksi socket TCP langsung (Google App Password/cPanel).<br>
                    &bull; Input Resend API Key dengan toggle show/hide kata sandi<br>
                    &bull; Kustomisasi template pesan Auto-Reply resmi ke klien (Subjek, Salam Pembuka, Komitmen Respon &lt;24 Jam, Instruksi Lampiran Gerber/CAD)<br>
                    &bull; Kotak Uji Coba Pengiriman Langsung (Live Test Email)
                  </td>
                  <td>Menjamin keandalan pengiriman email notifikasi bisnis di lingkungan hosting cloud publik tanpa pernah mengalami kendala timeout firewall.</td>
                </tr>
                <tr>
                  <td><strong>CRM Permohonan Penawaran Masuk (Inbound RFQ Leads)</strong></td>
                  <td>Dasbor penanganan permohonan penawaran harga dari calon mitra industri secara terstruktur.</td>
                  <td>
                    &bull; Filter Status: Semua, Baru (New), Dihubungi (Contacted), Penawaran Diberikan (Quoted), Selesai (Closed), dan Spam<br>
                    &bull; Pencarian realtime berdasarkan nama pemohon, perusahaan, email, atau no telepon<br>
                    &bull; Pencatatan telemetri: Tanggal/jam, IP pengirim, dan negara asal<br>
                    &bull; Input catatan internal tindak lanjut proyek per RFQ<br>
                    &bull; Tombol aksi cepat: Balas via Email resmi &amp; Hubungi via WhatsApp<br>
                    &bull; Tombol hapus data RFQ aman dengan modal konfirmasi
                  </td>
                  <td>Mengubah pesan formulir kontak biasa menjadi sistem CRM penjualan B2B profesional sehingga tidak ada permohonan proyek yang terlewatkan.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3.7 USERS & AUDIT LOGS MODULES -->
        <div class="sitemap-tree-box" style="margin-top: 14px;">
          <div class="sitemap-tree-header">
            <span>7. Modul Manajemen Pengguna &amp; Audit Trail &bull; Tab: <code>users</code> &amp; <code>logs</code></span>
            <span class="sitemap-tree-header-tag">ADMIN MODULE &bull; RBAC PROTECTED</span>
          </div>
          <div class="sitemap-tree-body">
            <table class="table-custom" style="margin: 0;">
              <thead>
                <tr>
                  <th style="width: 20%;">Modul / Tab</th>
                  <th style="width: 30%;">Fungsi Operasional</th>
                  <th style="width: 25%;">Fitur Interaktif &amp; Teknis</th>
                  <th style="width: 25%;">Tujuan Pembuatan (Untuk Apa)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Users Module (?tab=users)</strong></td>
                  <td>Mengelola akun staf pengelola sistem dan pembagian wewenang hak akses (RBAC).</td>
                  <td>
                    &bull; Khusus peran <em>Administrator</em> dan <em>HRD Manager</em><br>
                    &bull; Formulir pembuatan akun baru (Nama, Email, Username, Password, Role: Administrator, HRD, Staff)<br>
                    &bull; Reset password akun dan pengubahan status aktif pengguna<br>
                    &bull; Proteksi diri: pengguna tidak dapat menghapus akunnya sendiri
                  </td>
                  <td>Menerapkan prinsip hak akses terendah (principle of least privilege) agar staf hanya memiliki wewenang pada modul yang relevan.</td>
                </tr>
                <tr>
                  <td><strong>Logs Module (?tab=logs)</strong></td>
                  <td>Memantau rekaman audit trail sistem atas setiap tindakan penambahan, pengubahan, atau penghapusan data.</td>
                  <td>
                    &bull; Khusus peran <em>Administrator</em> dan <em>HRD Manager</em><br>
                    &bull; Mencatat stempel waktu presisi (timestamp), nama staf, peran, modul yang diubah, tipe aksi (CREATE, UPDATE, DELETE), alamat IP, dan rincian perubahan<br>
                    &bull; Filter berdasarkan tipe aksi dan pengguna<br>
                    &bull; Sifat rekaman bersifat *append-only* (tidak dapat diubah atau dihapus)
                  </td>
                  <td>Memenuhi standar kepatuhan tata kelola TI dan mempermudah investigasi forensik apabila terjadi kesalahan operasional data.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `
    },
    {
      secNumber: "4",
      title: "Matriks Relasi Antara Halaman Publik, Modul Admin, dan Tabel Basis Data",
      contentHtml: `
        <p>Arsitektur sistem dibangun secara terpadu di mana setiap halaman portal publik dikontrol secara langsung oleh modul yang bersesuaian pada portal administrasi, serta dipersistensikan ke dalam tabel basis data relasional MySQL 8. Tabel matriks berikut merangkum integrasi end-to-end tersebut:</p>

        <table class="table-custom">
          <thead>
            <tr>
              <th style="width: 18%;">Halaman Publik</th>
              <th style="width: 22%;">Modul Admin Pengontrol</th>
              <th style="width: 22%;">Tabel Database MySQL</th>
              <th style="width: 38%;">Tujuan Fungsional &amp; Nilai Bisnis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>/</code> (Beranda)</td>
              <td>Modul Home (<code>?tab=home</code>) &amp; Branding (<code>?tab=branding</code>)</td>
              <td><code>site_settings</code> (key: home_hero, home_stats, home_cta) &amp; <code>company_profile</code></td>
              <td>Memperbarui slide promosi manufaktur, teks typewriter, logo, dan angka kapasitas pabrik Batam FTZ secara instan.</td>
            </tr>
            <tr>
              <td><code>/about</code> (Tentang Kami)</td>
              <td>Modul About (<code>?tab=about</code>)</td>
              <td><code>site_settings</code> (key: about_header, about_narrative, about_facilities, about_timeline) &amp; <code>company_profile</code></td>
              <td>Menyajikan profil legalitas, foto fasilitas ruang bersih ESD Class 100K, dan sertifikasi otomotif IATF 16949 untuk audit buyer.</td>
            </tr>
            <tr>
              <td><code>/automation</code> (Otomasi)</td>
              <td>Modul Automation (<code>?tab=automation</code>)</td>
              <td><code>site_settings</code> (key: automation_settings, automation_robots)</td>
              <td>Menampilkan simulasi WebGL 3D robotika 6-sumbu, parameter 3 seri robot industri, dan spesifikasi jig uji fungsional ICT/FCT.</td>
            </tr>
            <tr>
              <td><code>/products</code> (Katalog Produk)</td>
              <td>Modul Products (<code>?tab=products</code>)</td>
              <td><code>products</code> &amp; <code>product_categories</code> (19 SKU pada 7 Kategori)</td>
              <td>Menyediakan katalog terpadu 19 SKU elektronik &amp; otomasi dengan lembar spesifikasi JSON lengkap dan modal RFQ instan.</td>
            </tr>
            <tr>
              <td><code>/gallery</code> (Dokumentasi Fasilitas)</td>
              <td>Modul Gallery (<code>?tab=gallery</code>)</td>
              <td><code>facility_gallery</code></td>
              <td>Memamerkan bukti visual otentik lini SMT berkecepatan 80.000 CPH, oven reflow nitrogen, dan laboratorium inspeksi 3D AOI &amp; X-Ray.</td>
            </tr>
            <tr>
              <td><code>/contact</code> (Kontak &amp; RFQ)</td>
              <td>Modul Contact (<code>?tab=contact</code>)</td>
              <td><code>site_settings</code> (key: email_smtp_settings, contact_header), <code>company_profile</code>, &amp; <code>rfq_inquiries</code></td>
              <td>Menerima permohonan penawaran harga B2B dengan filter anti-spam, dispatching email Resend HTTPS API / SMTP, dan CRM tindak lanjut sales.</td>
            </tr>
            <tr>
              <td>Telemetri Global</td>
              <td>Modul Overview (<code>?tab=overview</code>)</td>
              <td><code>visitor_telemetry</code></td>
              <td>Merekam asal negara pengunjung dan halaman yang diakses untuk analisis pasar ekspor tanpa melanggar privasi pengguna.</td>
            </tr>
            <tr>
              <td>Keamanan &amp; Tata Kelola</td>
              <td>Modul Users (<code>?tab=users</code>) &amp; Logs (<code>?tab=logs</code>)</td>
              <td><code>admin_users</code> &amp; <code>activity_logs</code></td>
              <td>Mengatur kontrol akses bertingkat (RBAC: Admin, HRD, Staff) dan merekam audit trail forensik atas setiap perubahan data sistem.</td>
            </tr>
          </tbody>
        </table>
      `
    },
    {
      secNumber: "5",
      title: "Kesimpulan Arsitektur Informasi & Panduan Pemeliharaan Sistem",
      contentHtml: `
        <p>Berdasarkan inventarisasi menyeluruh di atas, website resmi dan profil industri PT Global Philsonic Technologies (<code>website_intersis</code>) telah berhasil mengimplementasikan arsitektur informasi yang lengkap, kohesif, dan siap beroperasi secara publik (*production-grade*).</p>

        <p><strong>Pencapaian Kunci Rekayasa Sistem:</strong></p>
        <ol>
          <li><strong>Cakupan Lengkap Sisi Publik:</strong> Seluruh aspek bisnis manufaktur modern &mdash; mulai dari etalase beranda, identitas kawasan berikat Batam FTZ, robotika 3D interaktif, katalog 19 SKU produk terpadu pada 7 kategori otentik, dokumentasi fasilitas perakitan dan ruang bersih, hingga gerbang RFQ aman anti-spam &mdash; telah terakomodasi tanpa ada celah fungsional yang tertinggal.</li>
          <li><strong>Pusat Kendali Mandiri Sisi Admin:</strong> Pengelola internal memiliki kemandirian mutlak untuk menyunting teks dwibahasa, mengunggah foto beresolusi tinggi, memodifikasi spesifikasi teknis produk berformat JSON, mengatur saluran komunikasi, hingga menindaklanjuti permohonan RFQ dengan dukungan sistem CRM internal.</li>
          <li><strong>Keandalan Komunikasi Cloud (Resend HTTPS API via Port 443):</strong> Penerapan dual engine email pada modul kontak menjamin notifikasi bisnis tidak akan pernah terblokir oleh firewall hosting cloud (seperti Railway dan Vercel) yang memblokir port SMTP konvensional, sehingga notifikasi proyek selalu sampai ke tim penjualan komersial seketika.</li>
          <li><strong>Keamanan &amp; Kepatuhan Forensik:</strong> Proteksi otentikasi JWT, enkripsi kata sandi bcryptjs, otorisasi bertingkat RBAC, serta audit trail *append-only* menjamin keamanan operasional dan akuntabilitas data perusahaan dalam jangka panjang.</li>
        </ol>

        <p>Sistem ini telah siap dipublikasikan secara global untuk mendukung ekspansi bisnis manufaktur elektronik presisi dan otomasi industri PT Global Philsonic Technologies di pasar Tier-1 internasional.</p>
      `
    }
  ],

  conclusion: "Seluruh cakupan sitemap dari portal publik hingga portal administrasi telah terdokumentasi secara lengkap dan detail beserta seluruh section di dalamnya, fungsi operasional, fitur teknis, matriks relasi basis data, serta tujuan rekayasanya. Sistem ini telah terverifikasi memenuhi standar arsitektur perangkat lunak enterprise modern yang aman, terukur, dan siap digunakan secara publik."
};

module.exports = docFullSitemapCoverage;
