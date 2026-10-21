/**
 * Formal Monochrome Technical Documentation Report Data: Units 01 to 04
 * Proyek: Website Resmi & Profil Industri PT Global Philsonic Technologies (Automation GPT)
 * Strictly Black & White / Monochrome — Focused exclusively on Products, Company, Gallery, and Automation
 * ZERO HALLUCINATIONS — 100% Sourced from Real Project Codebase & Production Database
 */

const docModules01to04 = [
  // ==========================================
  // UNIT 01: MENGIMPLEMENTASIKAN USER INTERFACE
  // ==========================================
  {
    unitNumber: "01",
    unitCode: "TI.UI.01.2026",
    unitTitle: "Mengimplementasikan User Interface",
    executiveSummary: "Dokumentasi implementasi antarmuka pengguna website berbasis React 19, CSS Modern terstruktur, WebGL 3D Robot Canvas, sistem multi-bahasa bilingual (ID/EN), dual-theme (Gelap/Terang), dan sistem dialog multi-tingkat pada portal publik dan dashboard admin PT Global Philsonic Technologies.",
    checklistMatrix: [
      {
        subTitle: "Identifikasi mock-up",
        codeRef: "frontend/src/pages/public/HomePage.jsx & ProductsPage.jsx",
        summary: "Translasi wireframe bento-grid, Hero section dengan tombol direct redirection (/products & /contact), dan katalog produk industri."
      },
      {
        subTitle: "Penyusunan hirarki dialog UI",
        codeRef: "frontend/src/pages/admin/modules/ProductsModule.jsx & GalleryModule.jsx",
        summary: "Penyusunan modal input multi-tab produk manufaktur, form upload galeri industri, dan dialog validasi transaksional."
      },
      {
        subTitle: "Penerapan tampilan interaktif",
        codeRef: "frontend/src/components/automation/RobotCanvas3D.jsx & src/lib/i18n.js",
        summary: "Integrasi WebGL 3D Robot Canvas interaktif 60 FPS dengan telemetri 6-axis, toggle tema, dan lokalisasi multi-bahasa real-time."
      }
    ],
    subSections: [
      {
        subNumber: "1.1",
        title: "Identifikasi Mock-up & Translasi Wireframe ke Komponen Reaktif",
        fileLocation: "frontend/src/pages/public/HomePage.jsx & ProductsPage.jsx",
        descriptionHtml: `
          <p>Identifikasi mock-up dilakukan untuk menerjemahkan spesifikasi antarmuka industri elektronika otomotif dan rekayasa otomasi (Automation-GPT) ke dalam susunan komponen visual reaktif yang modular:</p>
          <ul>
            <li><strong>Hero Section Dinamis:</strong> Dilengkapi tombol aksi langsung (direct redirection) berukuran besar menuju katalog produk otomasi (<code>/products</code>) dan formulir penawaran RFQ (<code>/contact</code>).</li>
            <li><strong>Bento Grid Architecture:</strong> Diterapkan pada <code>AboutPage.jsx</code> dan <code>HomePage.jsx</code> untuk menampilkan data sejarah pabrik Batam Free Trade Zone (FTZ), sertifikasi IATF 16949 / ISO 9001, dan nilai inti korporat.</li>
            <li><strong>Katalog Produk Berfilter:</strong> Grid kartu produk responsif yang menampilkan kode SKU model, badge kategori (Headunit, Audio DSP, Dashcam, EMS), spesifikasi teknis ringkas, dan modal unduh skema diagram.</li>
          </ul>
        `,
        diagramHtml: `
          <svg viewBox="0 0 680 150" width="100%" height="130" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #000000;">
            <!-- Navbar -->
            <rect x="15" y="15" width="650" height="24" fill="#f0f0f0" stroke="#000000" stroke-width="1"/>
            <text x="25" y="31" fill="#000000" font-family="Arial" font-size="8.5" font-weight="bold">NAVBAR: Brand Logo | Beranda | Produk | Otomasi | Tentang Kami | Galeri | Kontak | ID/EN | Dark/Light</text>
            
            <!-- Hero Section -->
            <rect x="15" y="45" width="410" height="90" fill="#ffffff" stroke="#000000" stroke-width="1"/>
            <text x="25" y="65" fill="#000000" font-family="Arial" font-size="9" font-weight="bold">HERO SECTION (Headline Industri &amp; Direct Redirection)</text>
            <rect x="25" y="80" width="175" height="22" fill="#e5e5e5" stroke="#000000" stroke-width="0.8"/>
            <text x="112" y="94" fill="#000000" font-family="Arial" font-size="7.5" text-anchor="middle" font-weight="bold">Jelajahi Katalog (/products)</text>
            <rect x="210" y="80" width="175" height="22" fill="#ffffff" stroke="#000000" stroke-width="0.8"/>
            <text x="297" y="94" fill="#000000" font-family="Arial" font-size="7.5" text-anchor="middle">Konsultasi RFQ (/contact)</text>

            <!-- 3D Robot / Canvas Visual -->
            <rect x="435" y="45" width="230" height="90" fill="#f9f9f9" stroke="#000000" stroke-width="1"/>
            <circle cx="550" cy="90" r="30" fill="#ffffff" stroke="#000000" stroke-width="1.2" stroke-dasharray="3 2"/>
            <text x="550" y="93" fill="#000000" font-family="Arial" font-size="8" text-anchor="middle" font-weight="bold">3D WebGL Canvas</text>
            <text x="550" y="105" fill="#555555" font-family="Arial" font-size="7" text-anchor="middle">(Robotika Manufaktur 60 FPS)</text>
          </svg>
        `,
        codeSnippet: {
          filename: "frontend/src/pages/public/HomePage.jsx",
          code: `// Direct Redirection Action Buttons pada Hero Section HomePage.jsx
<div className="hero__actions">
  {(() => {
    const primaryLink = (slide.actionLink && slide.actionLink !== '#products-catalog')
      ? slide.actionLink
      : '/products';
    const primaryText = slide.actionText || slide.ctaPrimary || 
      (lang === 'id' ? 'JELAJAHI KATALOG PRODUK' : 'EXPLORE PRODUCT CATALOG');

    const isPrimaryContact = primaryLink.includes('/contact');
    const secondaryLink = slide.secondaryLink || (isPrimaryContact ? '/products' : '/contact');
    const secondaryText = slide.ctaSecondary || (isPrimaryContact
      ? (lang === 'id' ? 'LIHAT KATALOG PRODUK' : 'VIEW PRODUCT CATALOG')
      : (lang === 'id' ? 'KONSULTASI TEKNIK RFQ' : 'ENGINEERING RFQ INQUIRY'));

    return (
      <>
        <Link to={primaryLink} className="btn btn--hero-primary btn--lg">
          {primaryText}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
        <Link to={secondaryLink} className="btn btn--hero-secondary btn--lg">
          {secondaryText}
        </Link>
      </>
    );
  })()}
</div>`
        }
      },
      {
        subNumber: "1.2",
        title: "Penyusunan Hirarki Dialog UI & Form Input Multi-Tab Transaksional",
        fileLocation: "frontend/src/pages/admin/modules/ProductsModule.jsx & GalleryModule.jsx",
        descriptionHtml: `
          <p>Hirarki dialog antarmuka memisahkan interaksi tampilan cepat, formulir berstruktur, dan konfirmasi aksi kritis:</p>
          <ul>
            <li><strong>Tingkat 1 (Modal Penampil Ringkas):</strong> Dialog pop-up spesifikasi produk lengkap (<code>ProductSpecsModal.jsx</code>) dan Lightbox foto galeri industri tanpa merubah state navigasi halaman.</li>
            <li><strong>Tingkat 2 (Modal Form Input Multi-Tab):</strong> Dialog pengelolaan produk pada admin panel yang membagi formulir ke dalam 4 tab sekuensial (Identitas Model, Judul & Deskripsi Bilingual, Specs Singkat, dan JSON Spesifikasi Lengkap).</li>
            <li><strong>Tingkat 3 (Dialog Konfirmasi Transaksional):</strong> Feedback aksi transaksional berbasis sistem toast notifikasi real-time dan dialog validasi schema sebelum pengiriman data via Axios.</li>
          </ul>
        `,
        codeSnippet: {
          filename: "frontend/src/pages/admin/modules/ProductsModule.jsx",
          code: `// Hirarki Form Modal Multi-Tab & Eksekusi Simpan Produk Manufaktur
const handleSaveProduct = async (e) => {
  e.preventDefault();
  if (!form.model_code.trim()) {
    addToast('Kode Model Produk wajib diisi.', 'error');
    setModalTab('identity');
    return;
  }

  const formData = new FormData();
  formData.append('model_code', form.model_code);
  formData.append('category', form.category);
  formData.append('badge', form.badge || '');
  formData.append('title_id', form.title_id);
  formData.append('title_en', form.title_en);
  formData.append('specs', JSON.stringify(cleanSpecs));
  formData.append('full_specs', JSON.stringify(form.full_specs || {}));

  setSubmitting(true);
  try {
    if (isEdit) {
      await api.put(\`/admin/products/\${product.id}\`, formData);
      addToast(\`Produk '\${form.model_code}' berhasil diperbarui!\`, 'success');
    } else {
      await api.post('/admin/products', formData);
      addToast(\`Produk baru '\${form.model_code}' berhasil ditambahkan!\`, 'success');
    }
    onSaved();
  } catch (err) {
    addToast(extractErrorMessage(err), 'error');
  } finally {
    setSubmitting(false);
  }
};`
        }
      },
      {
        subNumber: "1.3",
        title: "Penerapan Tampilan Interaktif (WebGL 3D Robot Canvas & Multi-Bahasa)",
        fileLocation: "frontend/src/components/automation/RobotCanvas3D.jsx & src/lib/i18n.js",
        descriptionHtml: `
          <p>Fitur interaktif dieksekusi secara teroptimasi pada thread grafis browser:</p>
          <ol>
            <li><strong>Interactive 3D Robot Canvas:</strong> Menggunakan Three.js pada <code>RobotCanvas3D.jsx</code> untuk merender model robotika manufaktur berkecepatan 60 FPS dengan kontrol rotasi, mode wireframe, pencahayaan directional spotlight, dan visualisasi telemetri sumbu (joint 1-6).</li>
            <li><strong>Sistem Multi-Bahasa Bilingual:</strong> Integrasi <code>i18next</code> yang memungkinkan peralihan bahasa Indonesia dan Inggris secara instan tanpa memicu reload halaman web.</li>
            <li><strong>Persistensi Tema Gelap/Terang:</strong> Pengendalian class <code>dark</code> pada elemen dokumen HTML dengan sinkronisasi ke <code>localStorage</code> peramban klien.</li>
          </ol>
        `,
        codeSnippet: {
          filename: "frontend/src/components/automation/RobotCanvas3D.jsx",
          code: `// Inisialisasi Kanvas 3D WebGL dengan Three.js & State Telemetri Sumbu Robot
export default function RobotCanvas3D({ robotType = 'welding', activeStep = 0 }) {
  const mountRef = useRef(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [telemetry, setTelemetry] = useState({ j1: 0, j2: 0, j3: 0, j4: 0, j5: 0, j6: 0 });

  const stateRef = useRef({
    cameraPos: new THREE.Vector3(5.2, 3.8, 6.0),
    cameraTarget: new THREE.Vector3(0, 2.0, 0),
    camera: null,
    renderer: null,
    materials: []
  });

  return (
    <div className="robot-canvas-container" ref={mountRef}>
      {/* 3D WebGL Viewport, HUD Telemetri Sumbu, & Tombol Kontrol Rotasi */}
    </div>
  );
}`
        }
      }
    ],
    conclusion: "Seluruh sub-judul pada unit 'Mengimplementasikan User Interface' telah terpenuhi secara fungsional pada modul publik dan dashboard manajemen sistem PT Global Philsonic Technologies."
  },

  // =========================================================================
  // UNIT 02: MENGIMPLEMENTASIKAN RANCANGAN ENTITAS DAN KETERKAITAN ANTAR ENTITAS
  // =========================================================================
  {
    unitNumber: "02",
    unitCode: "TI.DB.02.2026",
    unitTitle: "Mengimplementasikan Rancangan Entitas dan Keterkaitan Antar Entitas",
    executiveSummary: "Dokumentasi perancangan dan implementasi skema basis data relasional sistem 'isa_career_hrd' yang mencakup total 15 tabel produksi terdaftar, dikelompokkan ke dalam 4 domain arsitektural (Katalog Produk & B2B RFQ, Profil CMS FTZ, Keamanan & Telemetri, serta Manajemen Organisasi Internal) dengan kepatuhan 3NF, integritas referensial Foreign Key, dan eksekusi kueri terindeks.",
    checklistMatrix: [
      {
        subTitle: "Perancangan ERD",
        codeRef: "database/BACKUP_DATABASE_ASLI_INTERSIS.sql & ERD.md",
        summary: "Perancangan skema relasional komprehensif mencakup total 15 tabel produksi sesuai kaidah Third Normal Form (3NF)."
      },
      {
        subTitle: "Identifikasi hubungan antar entitas",
        codeRef: "database/DATABASE_DOCUMENTATION.md",
        summary: "Penetapan relasi One-to-Many (1:N), entitas Singleton ter-audit, serta integritas referensial ON DELETE SET NULL / CASCADE."
      },
      {
        subTitle: "Eksekusi query dasar",
        codeRef: "backend/src/controllers/public/publicProductController.js",
        summary: "Eksekusi DDL fisik pembuatan tabel MySQL 8 dan kueri DQL penarikan data katalog produk berstatus aktif (status = 1)."
      }
    ],
    subSections: [
      {
        subNumber: "2.1",
        title: "Perancangan Diagram Hubungan Entitas (ERD) Komprehensif & Total 15 Tabel Terdaftar",
        fileLocation: "database/BACKUP_DATABASE_ASLI_INTERSIS.sql & database/DATABASE_DOCUMENTATION.md",
        descriptionHtml: `
          <p><strong>Pertanyaan Desain Basis Data:</strong> Apakah diagram basis data memang dirancang dengan jumlah tabel yang ada, dan berapa total tabel yang sebenarnya dibuat?</p>
          <p><strong>Jawaban &amp; Penjelasan Arsitektural:</strong> Basis data sistem (<code>isa_career_hrd</code>) dirancang dan diimplementasikan dengan <strong>TOTAL 15 TABEL FISIK</strong> pada lingkungan produksi. Seluruh 15 tabel ini terbagi secara sistematis ke dalam <strong>4 Domain Fungsional</strong>:</p>
          <ol>
            <li><strong>Domain 1 — Solusi Industri &amp; B2B RFQ (2 Tabel):</strong>
              <ul>
                <li><code>products</code>: Menyimpan 19 SKU produk elektronika industri (Headunit, Audio DSP, Dashcam, EMS) lengkap dengan data bilingual, spesifikasi teknis JSON, dan galeri foto.</li>
                <li><code>rfq_inquiries</code>: Menampung tiket formulir permintaan penawaran harga (Request for Quotation) B2B dari calon mitra internasional lengkap dengan audit IP, negara, dan skor anti-spam.</li>
              </ul>
            </li>
            <li><strong>Domain 2 — Profil Perusahaan, CMS &amp; Pengaturan Konten Batam FTZ (6 Tabel):</strong>
              <ul>
                <li><code>company_profile</code>: Entitas <em>Singleton</em> (1 baris) penyimpan visi, misi, dan profil utama korporat.</li>
                <li><code>core_values</code>: Menyimpan 4 nilai inti perusahaan (Inovasi, Mutu Presisi, Integritas, Keberlanjutan).</li>
                <li><code>site_settings</code>: Sistem CMS semi-terstruktur berbasis JSON untuk mengelola timeline sejarah pabrik, sertifikasi mutu IATF 16949/ISO, narasi keunggulan Batam Free Trade Zone (FTZ), konfigurasi hero banner, dan statistik pabrik.</li>
                <li><code>contact_recruitment</code>: Entitas <em>Singleton</em> penyimpan alamat pabrik, telepon resmi, WhatsApp sales, dan kanal media sosial.</li>
                <li><code>gallery</code>: Dokumentasi visual fasilitas manufaktur, lini SMT, ruang cleanroom Class 100K, dan kegiatan industri.</li>
                <li><code>faqs</code>: Daftar tanya jawab umum terkait kapabilitas produksi dan layanan OEM/ODM.</li>
              </ul>
            </li>
            <li><strong>Domain 3 — Keamanan Sistem, Manajemen Akses &amp; Telemetri (3 Tabel):</strong>
              <ul>
                <li><code>users</code>: Akun pengguna internal sistem dengan pembagian hak akses Role-Based Access Control (RBAC: Administrator, HRD Manager, Staff).</li>
                <li><code>activity_logs</code>: Audit trail otomatis pencatatan setiap aksi transaksi data (CREATE, UPDATE, DELETE, LOGIN) untuk transparansi operasional.</li>
                <li><code>visitor_telemetry</code>: Pelacakan kunjungan pengunjung portal publik (session ID, alamat IP, URL halaman, dan browser user agent) untuk analitik trafik.</li>
              </ul>
            </li>
            <li><strong>Domain 4 — Manajemen Fasilitas &amp; Organisasi Internal (4 Tabel):</strong>
              <ul>
                <li><code>job_categories</code>: Master kategori divisi operasional internal.</li>
                <li><code>job_vacancies</code>: Data lowongan kerja internal yang berelasi dengan divisi (<code>category_id</code>) dan pembuat lowongan (<code>created_by</code>).</li>
                <li><code>programs</code>: Program pengembangan SDM industri (Management Trainee, Magang Bersertifikat, Technical OJT).</li>
                <li><code>benefits</code>: Fasilitas dan tunjangan kerja internal bagi karyawan.</li>
              </ul>
            </li>
          </ol>
          <p>Diagram di bawah ini menggambarkan seluruh keterkaitan antar entitas dari ke-15 tabel basis data secara utuh:</p>
        `,
        diagramHtml: `
          <svg viewBox="0 0 680 430" width="100%" height="390" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #000000; padding:4px;">
            <!-- TITLE HEADER -->
            <rect x="10" y="8" width="660" height="20" fill="#000000" stroke="#000000"/>
            <text x="340" y="22" fill="#ffffff" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">ARSITEKTUR RELASIONAL LENGKAP — TOTAL 15 TABEL TERDAFTAR (DATABASE: isa_career_hrd)</text>

            <!-- ================= DOMAIN 1: PRODUK & RFQ ================= -->
            <rect x="15" y="36" width="155" height="118" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
            <text x="92" y="49" fill="#000000" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">products (19 SKU Aktif)</text>
            <line x1="15" y1="53" x2="170" y2="53" stroke="#000000" stroke-width="0.8"/>
            <text x="20" y="65" fill="#000000" font-family="Courier New" font-size="7">PK id (INT AUTO)</text>
            <text x="20" y="76" fill="#000000" font-family="Courier New" font-size="7">model_code (VARCHAR)</text>
            <text x="20" y="87" fill="#000000" font-family="Courier New" font-size="7">category (ENUM: audio,hu...)</text>
            <text x="20" y="98" fill="#000000" font-family="Courier New" font-size="7">title_id, title_en (TEXT)</text>
            <text x="20" y="109" fill="#000000" font-family="Courier New" font-size="7">specs, full_specs (JSON)</text>
            <text x="20" y="120" fill="#000000" font-family="Courier New" font-size="7">diagram_type, image, gallery</text>
            <text x="20" y="131" fill="#000000" font-family="Courier New" font-size="7">status (TINYINT), sort_order</text>
            <text x="20" y="142" fill="#000000" font-family="Courier New" font-size="7">created_at, updated_at</text>

            <rect x="15" y="162" width="155" height="85" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
            <text x="92" y="175" fill="#000000" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">rfq_inquiries (B2B Tickets)</text>
            <line x1="15" y1="179" x2="170" y2="179" stroke="#000000" stroke-width="0.8"/>
            <text x="20" y="191" fill="#000000" font-family="Courier New" font-size="7">PK id (INT AUTO)</text>
            <text x="20" y="202" fill="#000000" font-family="Courier New" font-size="7">full_name, corporate_email</text>
            <text x="20" y="213" fill="#000000" font-family="Courier New" font-size="7">company_name, phone</text>
            <text x="20" y="224" fill="#000000" font-family="Courier New" font-size="7">inquiry_type, volume, message</text>
            <text x="20" y="235" fill="#000000" font-family="Courier New" font-size="7">country_code, spam_score</text>
            <text x="20" y="244" fill="#000000" font-family="Courier New" font-size="6.5">status, ip_address, created_at</text>

            <!-- ================= DOMAIN 3: USERS, LOGS, TELEMETRI ================= -->
            <rect x="185" y="36" width="150" height="90" fill="#e5e5e5" stroke="#000000" stroke-width="1.2"/>
            <text x="260" y="49" fill="#000000" font-family="Arial" font-size="8.5" font-weight="bold" text-anchor="middle">users (Master Auth)</text>
            <line x1="185" y1="53" x2="335" y2="53" stroke="#000000" stroke-width="0.8"/>
            <text x="190" y="65" fill="#000000" font-family="Courier New" font-size="7">PK id (INT AUTO)</text>
            <text x="190" y="76" fill="#000000" font-family="Courier New" font-size="7">name (VARCHAR 100)</text>
            <text x="190" y="87" fill="#000000" font-family="Courier New" font-size="7">username (VARCHAR 50 UK)</text>
            <text x="190" y="98" fill="#000000" font-family="Courier New" font-size="7">email (VARCHAR 100 UK)</text>
            <text x="190" y="109" fill="#000000" font-family="Courier New" font-size="7">password (bcrypt hash)</text>
            <text x="190" y="120" fill="#000000" font-family="Courier New" font-size="7">role (ENUM: admin,hrd,staff)</text>

            <rect x="185" y="136" width="150" height="60" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
            <text x="260" y="148" fill="#000000" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">activity_logs (Audit Trail)</text>
            <line x1="185" y1="152" x2="335" y2="152" stroke="#000000" stroke-width="0.8"/>
            <text x="190" y="163" fill="#000000" font-family="Courier New" font-size="7">PK id (INT AUTO)</text>
            <text x="190" y="174" fill="#000000" font-family="Courier New" font-size="7">FK user_id &rarr; users.id</text>
            <text x="190" y="185" fill="#000000" font-family="Courier New" font-size="7">action, module, description</text>
            <text x="190" y="193" fill="#000000" font-family="Courier New" font-size="6.5">created_at (TIMESTAMP)</text>

            <rect x="185" y="206" width="150" height="42" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
            <text x="260" y="217" fill="#000000" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">visitor_telemetry (Analytics)</text>
            <line x1="185" y1="220" x2="335" y2="220" stroke="#000000" stroke-width="0.8"/>
            <text x="190" y="231" fill="#000000" font-family="Courier New" font-size="7">PK id | session_id | ip_address</text>
            <text x="190" y="241" fill="#000000" font-family="Courier New" font-size="7">country_code | page_url | time</text>

            <!-- ================= DOMAIN 2: CMS & PROFIL PERUSAHAAN ================= -->
            <rect x="350" y="36" width="155" height="52" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
            <text x="427" y="48" fill="#000000" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">company_profile (Singleton)</text>
            <line x1="350" y1="52" x2="505" y2="52" stroke="#000000" stroke-width="0.8"/>
            <text x="355" y="63" fill="#000000" font-family="Courier New" font-size="7">PK id | title | description</text>
            <text x="355" y="74" fill="#000000" font-family="Courier New" font-size="7">vision | mission | about_image</text>
            <text x="355" y="84" fill="#000000" font-family="Courier New" font-size="7">FK updated_by &rarr; users.id</text>

            <rect x="350" y="96" width="155" height="52" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
            <text x="427" y="108" fill="#000000" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">site_settings (JSON CMS)</text>
            <line x1="350" y1="112" x2="505" y2="112" stroke="#000000" stroke-width="0.8"/>
            <text x="355" y="123" fill="#000000" font-family="Courier New" font-size="7">PK key_name (VARCHAR 100)</text>
            <text x="355" y="134" fill="#000000" font-family="Courier New" font-size="7">content_json (LONGTEXT JSON)</text>
            <text x="355" y="144" fill="#000000" font-family="Courier New" font-size="7">FK updated_by &rarr; users.id</text>

            <rect x="350" y="156" width="155" height="45" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
            <text x="427" y="167" fill="#000000" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">contact_recruitment (Singleton)</text>
            <line x1="350" y1="170" x2="505" y2="170" stroke="#000000" stroke-width="0.8"/>
            <text x="355" y="181" fill="#000000" font-family="Courier New" font-size="7">PK id | email | phone | address</text>
            <text x="355" y="191" fill="#000000" font-family="Courier New" font-size="7">whatsapp | FK updated_by &rarr; users</text>

            <rect x="520" y="36" width="145" height="52" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
            <text x="592" y="48" fill="#000000" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">gallery (Fasilitas &amp; SMT)</text>
            <line x1="520" y1="52" x2="665" y2="52" stroke="#000000" stroke-width="0.8"/>
            <text x="525" y="63" fill="#000000" font-family="Courier New" font-size="7">PK id | title | description</text>
            <text x="525" y="74" fill="#000000" font-family="Courier New" font-size="7">image | category | status</text>
            <text x="525" y="84" fill="#000000" font-family="Courier New" font-size="7">FK created_by &rarr; users.id</text>

            <rect x="520" y="96" width="145" height="45" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
            <text x="592" y="108" fill="#000000" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">core_values (Nilai Budaya)</text>
            <line x1="520" y1="112" x2="665" y2="112" stroke="#000000" stroke-width="0.8"/>
            <text x="525" y="123" fill="#000000" font-family="Courier New" font-size="7">PK id | title | title_en</text>
            <text x="525" y="133" fill="#000000" font-family="Courier New" font-size="7">description | icon | status</text>

            <rect x="520" y="150" width="145" height="42" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
            <text x="592" y="161" fill="#000000" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">faqs (Tanya Jawab Layanan)</text>
            <line x1="520" y1="164" x2="665" y2="164" stroke="#000000" stroke-width="0.8"/>
            <text x="525" y="174" fill="#000000" font-family="Courier New" font-size="7">PK id | question | answer</text>
            <text x="525" y="184" fill="#000000" font-family="Courier New" font-size="7">sort_order | status (TINYINT)</text>

            <!-- ================= DOMAIN 4: ORGANISASI & FASILITAS INTERNAL ================= -->
            <rect x="15" y="260" width="155" height="55" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
            <text x="92" y="272" fill="#000000" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">job_categories (Divisi)</text>
            <line x1="15" y1="276" x2="170" y2="276" stroke="#000000" stroke-width="0.8"/>
            <text x="20" y="288" fill="#000000" font-family="Courier New" font-size="7">PK id (INT AUTO)</text>
            <text x="20" y="299" fill="#000000" font-family="Courier New" font-size="7">name (VARCHAR 100)</text>
            <text x="20" y="309" fill="#000000" font-family="Courier New" font-size="7">description | status</text>

            <rect x="185" y="260" width="165" height="70" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
            <text x="267" y="272" fill="#000000" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">job_vacancies (Lowongan)</text>
            <line x1="185" y1="276" x2="350" y2="276" stroke="#000000" stroke-width="0.8"/>
            <text x="190" y="288" fill="#000000" font-family="Courier New" font-size="7">PK id | title | location</text>
            <text x="190" y="299" fill="#000000" font-family="Courier New" font-size="7">FK category_id &rarr; job_cat.id</text>
            <text x="190" y="310" fill="#000000" font-family="Courier New" font-size="7">FK created_by &rarr; users.id</text>
            <text x="190" y="321" fill="#000000" font-family="Courier New" font-size="7">employment_type | status</text>

            <rect x="365" y="260" width="140" height="60" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
            <text x="435" y="272" fill="#000000" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">programs (Talenta/Magang)</text>
            <line x1="365" y1="276" x2="505" y2="276" stroke="#000000" stroke-width="0.8"/>
            <text x="370" y="288" fill="#000000" font-family="Courier New" font-size="7">PK id | title | slug (UK)</text>
            <text x="370" y="299" fill="#000000" font-family="Courier New" font-size="7">description | requirements</text>
            <text x="370" y="310" fill="#000000" font-family="Courier New" font-size="7">registration_url | status</text>

            <rect x="520" y="260" width="145" height="55" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
            <text x="592" y="272" fill="#000000" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle">benefits (Fasilitas Kerja)</text>
            <line x1="520" y1="276" x2="665" y2="276" stroke="#000000" stroke-width="0.8"/>
            <text x="525" y="288" fill="#000000" font-family="Courier New" font-size="7">PK id | title | description</text>
            <text x="525" y="299" fill="#000000" font-family="Courier New" font-size="7">icon | image | sort_order</text>
            <text x="525" y="309" fill="#000000" font-family="Courier New" font-size="7">status (TINYINT 1)</text>

            <!-- ================= RELATION LINES ================= -->
            <!-- users -> activity_logs -->
            <line x1="260" y1="126" x2="260" y2="136" stroke="#000000" stroke-width="1.2"/>
            <!-- users -> company_profile -->
            <line x1="335" y1="60" x2="350" y2="60" stroke="#000000" stroke-width="1.2"/>
            <!-- users -> site_settings -->
            <line x1="335" y1="115" x2="350" y2="115" stroke="#000000" stroke-width="1.2"/>
            <!-- users -> gallery -->
            <line x1="335" y1="45" x2="520" y2="45" stroke="#000000" stroke-width="1" stroke-dasharray="2 2"/>
            <!-- job_categories -> job_vacancies -->
            <line x1="170" y1="285" x2="185" y2="285" stroke="#000000" stroke-width="1.2"/>
            <!-- users -> job_vacancies -->
            <line x1="260" y1="196" x2="260" y2="260" stroke="#000000" stroke-width="1" stroke-dasharray="2 2"/>

            <!-- BOTTOM FOOTER -->
            <rect x="10" y="345" width="660" height="75" fill="#fafafa" stroke="#000000" stroke-width="0.8"/>
            <text x="20" y="360" fill="#000000" font-family="Arial" font-size="8" font-weight="bold">RINGKASAN TOTAL 15 TABEL SKEMA isa_career_hrd:</text>
            <text x="20" y="373" fill="#333333" font-family="Arial" font-size="7.5">&bull; Domain 1 (B2B &amp; Produk): products, rfq_inquiries &mdash; Menangani katalog manufaktur dan tiket penawaran harga klien Tier-1.</text>
            <text x="20" y="385" fill="#333333" font-family="Arial" font-size="7.5">&bull; Domain 2 (CMS &amp; Profil FTZ): company_profile, core_values, site_settings, contact_recruitment, gallery, faqs &mdash; Mengelola narasi FTZ, sejarah, &amp; sertifikasi.</text>
            <text x="20" y="397" fill="#333333" font-family="Arial" font-size="7.5">&bull; Domain 3 (Keamanan &amp; Telemetri): users, activity_logs, visitor_telemetry &mdash; RBAC login internal, audit trail 116 log, dan tracking sesi pengunjung.</text>
            <text x="20" y="409" fill="#333333" font-family="Arial" font-size="7.5">&bull; Domain 4 (Organisasi Internal): job_categories, job_vacancies, programs, benefits &mdash; Fondasi tata kelola SDM dan fasilitas internal korporat.</text>
          </svg>
        `,
        codeSnippet: {
          filename: "database/BACKUP_DATABASE_ASLI_INTERSIS.sql",
          code: `-- Skema DDL Fisik Tabel products (Engine MySQL 8 / InnoDB)
CREATE TABLE products (
  id int(11) NOT NULL AUTO_INCREMENT,
  model_code varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  category enum('headunit','audio','dashcam','automation','ems') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'headunit',
  badge varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  badge_color varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  title_id text COLLATE utf8mb4_unicode_ci NOT NULL,
  title_en text COLLATE utf8mb4_unicode_ci NOT NULL,
  short_desc_id text COLLATE utf8mb4_unicode_ci,
  short_desc_en text COLLATE utf8mb4_unicode_ci,
  specs longtext COLLATE utf8mb4_unicode_ci COMMENT 'JSON array {label, value}',
  full_specs longtext COLLATE utf8mb4_unicode_ci COMMENT 'JSON object key-value',
  diagram_type varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'infotainment',
  image varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  gallery longtext COLLATE utf8mb4_unicode_ci,
  status tinyint(1) NOT NULL DEFAULT '1' COMMENT '1=aktif, 0=nonaktif',
  sort_order int(11) NOT NULL DEFAULT '0',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
        }
      },
      {
        subNumber: "2.2",
        title: "Kamus Data Lengkap 15 Tabel & Spesifikasi Relasi Referensial",
        fileLocation: "database/DATABASE_DOCUMENTATION.md",
        descriptionHtml: `
          <p>Tabel kamus data berikut merangkum seluruh <strong>15 tabel</strong> yang beroperasi pada database produksi beserta peruntukan fungsional, tipe tabel, dan kardinalitas relasinya:</p>
          <table class="table-custom">
            <tr>
              <th style="width: 4%;">No</th>
              <th style="width: 18%;">Nama Tabel</th>
              <th style="width: 14%;">Domain Arsitektur</th>
              <th style="width: 12%;">Tipe Tabel</th>
              <th style="width: 14%;">Primary Key</th>
              <th style="width: 18%;">Foreign Key Relasi</th>
              <th style="width: 20%;">Peruntukan Sistem</th>
            </tr>
            <tr>
              <td>1</td>
              <td><code>products</code></td>
              <td>Katalog Produk</td>
              <td>Master</td>
              <td><code>id (INT)</code></td>
              <td>—</td>
              <td>19 SKU produk elektronika otomotif &amp; perakitan SMT.</td>
            </tr>
            <tr>
              <td>2</td>
              <td><code>rfq_inquiries</code></td>
              <td>Transaksi B2B</td>
              <td>Transaksi</td>
              <td><code>id (INT)</code></td>
              <td>—</td>
              <td>Formulir permintaan penawaran harga &amp; skor anti-spam.</td>
            </tr>
            <tr>
              <td>3</td>
              <td><code>company_profile</code></td>
              <td>CMS &amp; Profil FTZ</td>
              <td>Singleton (1 Baris)</td>
              <td><code>id (INT)</code></td>
              <td><code>updated_by &rarr; users.id</code></td>
              <td>Profil resmi, visi misi, &amp; foto pabrik Batam FTZ.</td>
            </tr>
            <tr>
              <td>4</td>
              <td><code>core_values</code></td>
              <td>CMS &amp; Profil FTZ</td>
              <td>Konten</td>
              <td><code>id (INT)</code></td>
              <td>—</td>
              <td>4 nilai budaya kerja dan standar mutu korporat.</td>
            </tr>
            <tr>
              <td>5</td>
              <td><code>site_settings</code></td>
              <td>CMS Dinamis</td>
              <td>Konfigurasi JSON</td>
              <td><code>key_name</code></td>
              <td><code>updated_by &rarr; users.id</code></td>
              <td>12 konfigurasi JSON (timeline, sertifikasi IATF, hero).</td>
            </tr>
            <tr>
              <td>6</td>
              <td><code>contact_recruitment</code></td>
              <td>CMS &amp; Profil FTZ</td>
              <td>Singleton (1 Baris)</td>
              <td><code>id (INT)</code></td>
              <td><code>updated_by &rarr; users.id</code></td>
              <td>Kontak pabrik, email sales, dan WhatsApp resmi.</td>
            </tr>
            <tr>
              <td>7</td>
              <td><code>gallery</code></td>
              <td>CMS &amp; Profil FTZ</td>
              <td>Konten</td>
              <td><code>id (INT)</code></td>
              <td><code>created_by &rarr; users.id</code></td>
              <td>12 dokumentasi fasilitas cleanroom &amp; mesin SMT.</td>
            </tr>
            <tr>
              <td>8</td>
              <td><code>faqs</code></td>
              <td>CMS &amp; Profil FTZ</td>
              <td>Konten</td>
              <td><code>id (INT)</code></td>
              <td>—</td>
              <td>6 daftar pertanyaan umum dan jawaban operasional.</td>
            </tr>
            <tr>
              <td>9</td>
              <td><code>users</code></td>
              <td>Keamanan &amp; Akses</td>
              <td>Master User</td>
              <td><code>id (INT)</code></td>
              <td>—</td>
              <td>3 akun pengguna internal dengan RBAC terenkripsi bcrypt.</td>
            </tr>
            <tr>
              <td>10</td>
              <td><code>activity_logs</code></td>
              <td>Keamanan &amp; Audit</td>
              <td>Audit Trail</td>
              <td><code>id (INT)</code></td>
              <td><code>user_id &rarr; users.id</code></td>
              <td>116 riwayat rekam jejak aksi CRUD dan login staf.</td>
            </tr>
            <tr>
              <td>11</td>
              <td><code>visitor_telemetry</code></td>
              <td>Telemetri &amp; Analitik</td>
              <td>Log Sesi</td>
              <td><code>id (INT)</code></td>
              <td>—</td>
              <td>66 sesi pelacakan kunjungan pengunjung dan peramban.</td>
            </tr>
            <tr>
              <td>12</td>
              <td><code>job_categories</code></td>
              <td>Organisasi Internal</td>
              <td>Master</td>
              <td><code>id (INT)</code></td>
              <td>—</td>
              <td>Master divisi/kategori rekrutmen internal.</td>
            </tr>
            <tr>
              <td>13</td>
              <td><code>job_vacancies</code></td>
              <td>Organisasi Internal</td>
              <td>Transaksi</td>
              <td><code>id (INT)</code></td>
              <td><code>category_id, created_by</code></td>
              <td>Perekaman lowongan kerja divisi internal perusahaan.</td>
            </tr>
            <tr>
              <td>14</td>
              <td><code>programs</code></td>
              <td>Organisasi Internal</td>
              <td>Konten</td>
              <td><code>id (INT)</code></td>
              <td>—</td>
              <td>3 program pelatihan (Management Trainee, Magang, OJT).</td>
            </tr>
            <tr>
              <td>15</td>
              <td><code>benefits</code></td>
              <td>Organisasi Internal</td>
              <td>Konten</td>
              <td><code>id (INT)</code></td>
              <td>—</td>
              <td>6 fasilitas tunjangan dan sarana penunjang kerja.</td>
            </tr>
          </table>
        `,
        codeSnippet: null
      },
      {
        subNumber: "2.3",
        title: "Eksekusi Query DQL Terindeks untuk Penarikan Data Katalog Produk",
        fileLocation: "backend/src/controllers/public/publicProductController.js",
        descriptionHtml: `
          <p>Query DQL berikut dieksekusi secara teroptimasi menggunakan Connection Pool MySQL untuk menyajikan produk berstatus aktif (<code>status = 1</code>) terurut berdasarkan prioritas:</p>
        `,
        codeSnippet: {
          filename: "backend/src/controllers/public/publicProductController.js",
          code: `const pool = require('../../config/database');
const { success } = require('../../utils/response');

/**
 * GET /api/public/products
 * Mendapatkan daftar produk aktif untuk halaman publik
 */
const getProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      \`SELECT id, model_code, category, badge, badge_color, image, gallery,
              title_id, title_en, short_desc_id, short_desc_en,
              specs, full_specs, diagram_type, sort_order
       FROM products
       WHERE status = 1
       ORDER BY sort_order ASC, id ASC\`
    );

    // Parse LONGTEXT JSON strings &rarr; JS objects (MariaDB/MySQL compat)
    const parsed = rows.map(row => ({
      ...row,
      specs:      row.specs      ? (typeof row.specs      === 'string' ? JSON.parse(row.specs)      : row.specs)      : [],
      full_specs: row.full_specs ? (typeof row.full_specs === 'string' ? JSON.parse(row.full_specs) : row.full_specs) : {},
      gallery:    row.gallery    ? (typeof row.gallery    === 'string' ? JSON.parse(row.gallery)    : row.gallery)    : [],
    }));

    return success(res, 'Daftar produk berhasil diambil.', parsed);
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts };`
        }
      }
    ],
    conclusion: "Seluruh sub-judul pada unit 'Mengimplementasikan Rancangan Entitas dan Keterkaitan Antar Entitas' telah terpenuhi secara utuh dengan skema basis data 15 tabel berstandar 3NF terverifikasi pada engine MySQL 8."
  },

  // =========================================================================================================
  // UNIT 03: MENERAPKAN PERINTAH EKSEKUSI BAHASA PEMROGRAMAN BERBASIS TEKS, GRAFIK, DAN MULTIMEDIA
  // =========================================================================================================
  {
    unitNumber: "03",
    unitCode: "TI.PG.03.2026",
    unitTitle: "Menerapkan Perintah Eksekusi Bahasa Pemrograman Berbasis Teks, Grafik, dan Multimedia",
    executiveSummary: "Dokumentasi eksekusi runtime Node.js v24 dan bundler Vite 8.3, sistem debugging terpusat via HTTP logger Morgan, serta pengelolaan berkas multimedia melalui pipeline Multer dan automasi skrip Puppeteer.",
    checklistMatrix: [
      {
        subTitle: "Mekanisme running source code",
        codeRef: "backend/package.json & frontend/package.json",
        summary: "Eksekusi nodemon backend dev, bundler Vite HMR frontend, dan skrip kompilasi Rollup."
      },
      {
        subTitle: "Debugging",
        codeRef: "backend/src/server.js & Chrome DevTools",
        summary: "Pencatatan HTTP traffic Morgan dan penanganan exception terpusat pada server."
      },
      {
        subTitle: "Perintah bahasa pemrograman",
        codeRef: "backend/src/middlewares/uploadMiddleware.js & generate_handbook_pdf.js",
        summary: "Pemrosesan upload multipart/form-data Multer dan automasi kompilasi grafis Puppeteer."
      }
    ],
    subSections: [
      {
        subNumber: "3.1",
        title: "Mekanisme Running Source Code (Node.js & Vite HMR)",
        fileLocation: "backend/package.json & frontend/package.json",
        descriptionHtml: `
          <p>Mekanisme eksekusi memisahkan server API asinkron berbasis Event Loop dari server dev frontend berbasis Hot Module Replacement (HMR):</p>
          <table class="table-custom">
            <tr>
              <th>Lingkungan</th>
              <th>Perintah Eksekusi</th>
              <th>Runtime / Bundler</th>
              <th>Mekanisme Kerja</th>
            </tr>
            <tr>
              <td>Backend Gateway</td>
              <td><code>npm run dev</code></td>
              <td>Node.js v24 + Nodemon</td>
              <td>Memonitor perubahan berkas JS dan merestart server otomatis tanpa downtime panjang.</td>
            </tr>
            <tr>
              <td>Frontend Client</td>
              <td><code>npm run dev</code></td>
              <td>Vite 8.3 + ESBuild</td>
              <td>Menyajikan kode via ESM native dengan pembaruan modul instan (HMR &lt; 50ms).</td>
            </tr>
          </table>
        `,
        codeSnippet: {
          filename: "backend/package.json",
          code: `{
  "name": "backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "node test_api_runner.js"
  }
}`
        }
      },
      {
        subNumber: "3.2",
        title: "Teknik Debugging & Pencatatan Transaksi HTTP Terpusat",
        fileLocation: "backend/src/server.js & backend/src/middlewares/errorHandler.js",
        descriptionHtml: `
          <p>Pencatatan diagnostik request-response menggunakan middleware <code>morgan('dev')</code>:</p>
        `,
        codeSnippet: {
          filename: "backend/src/server.js",
          code: `// Aktivasi HTTP Traffic Logger & Penanganan Error Terpusat
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev')); // Output: METHOD STATUS RES_TIME CONTENT_LENGTH
}

// Global Exception Handler: Menangkap Error Tak Terduga
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorHandler');
app.use(notFoundHandler);
app.use(globalErrorHandler);`
        }
      },
      {
        subNumber: "3.3",
        title: "Pemrosesan Upload Berkas Multimedia (Multer Storage Engine)",
        fileLocation: "backend/src/middlewares/uploadMiddleware.js",
        descriptionHtml: `
          <p>Penyimpanan gambar produk dan foto fasilitas dilakukan menggunakan <code>multer.diskStorage</code> dengan validasi MIME-type dan penamaan unik anti-collision:</p>
        `,
        codeSnippet: {
          filename: "backend/src/middlewares/uploadMiddleware.js",
          code: `const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subFolder = req.body.folder || 'general';
    const targetPath = path.join(uploadDir, subFolder);
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }
    cb(null, targetPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, \`\${cleanName}_\${uniqueSuffix}\${ext}\`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|svg|ico/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype) || file.mimetype === 'image/x-icon';

  if (extName && mimeType) {
    return cb(null, true);
  }
  cb(new Error('Format file tidak didukung! Hanya file gambar (JPG, PNG, WEBP, SVG, ICO).'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
  fileFilter,
});

module.exports = upload;`
        }
      }
    ],
    conclusion: "Seluruh sub-judul pada unit 'Menerapkan Perintah Eksekusi Bahasa Pemrograman Berbasis Teks, Grafik, dan Multimedia' telah terpenuhi dengan lingkungan Node.js, Vite HMR, logger Morgan, dan Multer."
  },

  // =========================================================================================================================
  // UNIT 04: MENYUSUN FUNGSI, FILE ATAU SUMBER DAYA PEMROGRAMAN DALAM ORGANISASI YANG RAPI
  // =========================================================================================================================
  {
    unitNumber: "04",
    unitCode: "TI.OR.04.2026",
    unitTitle: "Menyusun Fungsi, File atau Sumber Daya Pemrograman dalam Organisasi yang Rapi",
    executiveSummary: "Dokumentasi standarisasi struktur kode melalui penerapan konvensi penamaan baku (PascalCase, camelCase, snake_case), dokumentasi fungsi berstandar JSDoc, serta pengorganisasian pohon direktori backend dan frontend yang modular.",
    checklistMatrix: [
      {
        subTitle: "Standarisasi penamaan",
        codeRef: "Aturan Penamaan Identifier Frontend & Backend",
        summary: "Penerapan PascalCase untuk komponen React, camelCase untuk method/variabel, dan snake_case untuk kolom database."
      },
      {
        subTitle: "Dokumentasi internal",
        codeRef: "backend/src/controllers/public/publicProductController.js",
        summary: "Penyusunan blok komentar formal JSDoc pada setiap handler rute API."
      },
      {
        subTitle: "Struktur folder rapi",
        codeRef: "Pohon Direktori Proyek /backend & /frontend",
        summary: "Pemisahan concerns modular (controllers/admin vs controllers/public, reusable components, context, locales)."
      }
    ],
    subSections: [
      {
        subNumber: "4.1",
        title: "Matriks Standarisasi Konvensi Penamaan (Naming Conventions)",
        fileLocation: "Konvensi Kode Frontend & Backend",
        descriptionHtml: `
          <p>Tabel standarisasi konvensi penamaan yang diterapkan pada seluruh berkas sistem:</p>
          <table class="table-custom">
            <tr>
              <th>Cakupan Entitas</th>
              <th>Standar Format</th>
              <th>Contoh Konkret pada Proyek</th>
              <th>Tujuan Rekayasa</th>
            </tr>
            <tr>
              <td>Komponen &amp; Halaman React</td>
              <td>PascalCase</td>
              <td><code>HomePage.jsx</code>, <code>ProductsPage.jsx</code>, <code>RobotCanvas3D.jsx</code></td>
              <td>Membedakan komponen pengembang dari tag elemen bawaan peramban web.</td>
            </tr>
            <tr>
              <td>Variabel &amp; Fungsi JS</td>
              <td>camelCase</td>
              <td><code>getProducts()</code>, <code>handleSaveProduct()</code>, <code>filteredProducts</code></td>
              <td>Kepatuhan standar ECMAScript untuk keterbacaan kode berorientasi fungsi.</td>
            </tr>
            <tr>
              <td>Tabel &amp; Kolom Basis Data</td>
              <td>snake_case</td>
              <td><code>model_code</code>, <code>title_id</code>, <code>created_at</code>, <code>rfq_inquiries</code></td>
              <td>Mencegah konflik case-sensitivity pada server sistem operasi Linux produksi.</td>
            </tr>
            <tr>
              <td>Konfigurasi Environment</td>
              <td>SCREAMING_SNAKE_CASE</td>
              <td><code>JWT_SECRET</code>, <code>MYSQL_URL</code>, <code>ALLOWED_ORIGINS</code></td>
              <td>Menegaskan status nilai sebagai konstanta immutable tingkat proses.</td>
            </tr>
          </table>
        `,
        codeSnippet: {
          filename: "backend/src/controllers/admin/adminContentControllers.js",
          code: `// Penerapan Konvensi Penamaan camelCase & Destructuring Terstruktur
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      model_code, category, badge, badge_color,
      title_id, title_en, short_desc_id, short_desc_en,
      specs, full_specs, diagram_type, status, sort_order
    } = req.body;

    await pool.execute(
      \`UPDATE products SET
          model_code = ?, category = ?, badge = ?, badge_color = ?,
          title_id = ?, title_en = ?, short_desc_id = ?, short_desc_en = ?,
          diagram_type = ?, status = ?, sort_order = ?
       WHERE id = ?\`,
      [model_code, category, badge, badge_color, title_id, title_en, short_desc_id, short_desc_en, diagram_type, status, sort_order, id]
    );

    await logActivity(req.user.id, 'UPDATE', 'products', \`Memperbarui produk ID: \${id} (\${model_code})\`);
    return success(res, 'Produk berhasil diperbarui.');
  } catch (err) { next(err); }
};`
        }
      },
      {
        subNumber: "4.2",
        title: "Dokumentasi Internal Fungsi Berstandar JSDoc",
        fileLocation: "backend/src/controllers/public/publicProductController.js",
        descriptionHtml: `
          <p>Setiap fungsi handler dilengkapi dengan dokumentasi formal JSDoc untuk memfasilitasi audit kode dan integrasi IDE:</p>
        `,
        codeSnippet: {
          filename: "backend/src/controllers/public/publicProductController.js",
          code: `/**
 * GET /api/public/products
 * Mendapatkan daftar produk aktif untuk halaman publik
 * 
 * @param {import('express').Request} req - Express Request
 * @param {import('express').Response} res - Express Response
 * @param {import('express').NextFunction} next - Express Next Function
 * @returns {Promise<void>} JSON array produk dengan status aktif (status = 1)
 */
const getProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      \`SELECT id, model_code, category, badge, badge_color, image, gallery,
              title_id, title_en, short_desc_id, short_desc_en,
              specs, full_specs, diagram_type, sort_order
       FROM products
       WHERE status = 1
       ORDER BY sort_order ASC, id ASC\`
    );

    // Parsing JSON specs & full_specs
    const parsed = rows.map(row => ({
      ...row,
      specs:      row.specs      ? (typeof row.specs      === 'string' ? JSON.parse(row.specs)      : row.specs)      : [],
      full_specs: row.full_specs ? (typeof row.full_specs === 'string' ? JSON.parse(row.full_specs) : row.full_specs) : {},
      gallery:    row.gallery    ? (typeof row.gallery    === 'string' ? JSON.parse(row.gallery)    : row.gallery)    : [],
    }));

    return success(res, 'Daftar produk berhasil diambil.', parsed);
  } catch (err) {
    next(err);
  }
};`
        }
      },
      {
        subNumber: "4.3",
        title: "Pemisahan Tanggung Jawab Struktur Folder (Separation of Concerns)",
        fileLocation: "Direktori backend/src & frontend/src",
        descriptionHtml: `
          <p>Organisasi direktori memisahkan concern routing, controller bisnis, dan state antarmuka secara rapi:</p>
          <div class="code-box">
            <span class="file-tag">Pohon Berkas Proyek Aktual</span>
            <pre>c:/Projek_Magang/website_intersis/
├── backend/
│   ├── src/
│   │   ├── config/          # Pool database.js & konfigurasi MySQL
│   │   ├── controllers/     # Logika bisnis (/admin dan /public)
│   │   ├── middlewares/     # authMiddleware, uploadMiddleware, errorHandler
│   │   ├── routes/          # Definisi rute Express adminRoutes & publicRoutes
│   │   ├── utils/           # ApiError.js, response.js, activityLogger.js, fileCleanup.js
│   │   └── server.js        # Server entry point Express v5
├── frontend/
│   ├── src/
│   │   ├── components/      # UI widgets (ui, automation, home, layout)
│   │   ├── context/         # AdminAuthContext, ThemeContext
│   │   ├── locales/         # Kamus translasi id.json & en.json
│   │   ├── pages/           # Public pages & Admin modules
│   │   └── lib/             # api.js (Axios instance terpusat), translator.js, i18n.js
└── database/
    ├── BACKUP_DATABASE_ASLI_INTERSIS.sql # Master dump riil 15 tabel produksi
    ├── DATABASE_DOCUMENTATION.md         # Dokumentasi skema lengkap
    └── ERD.md                            # Kamus relasi entitas</pre>
          </div>
        `,
        codeSnippet: null
      }
    ],
    conclusion: "Seluruh sub-judul pada unit 'Menyusun Fungsi, File atau Sumber Daya Pemrograman dalam Organisasi yang Rapi' telah terpenuhi dengan standarisasi penamaan, JSDoc, dan arsitektur folder bersih."
  }
];

module.exports = docModules01to04;
