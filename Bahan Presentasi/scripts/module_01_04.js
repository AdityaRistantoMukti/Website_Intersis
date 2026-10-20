/**
 * Data Definition for Units 01 to 04
 * Proyek: Website Intersis / Automation GPT
 */

const modules01to04 = [
  // ==========================================
  // UNIT 01: MENGIMPLEMENTASIKAN USER INTERFACE
  // ==========================================
  {
    unitNumber: "01",
    unitCode: "TI.UI.01.2026",
    unitTitle: "Mengimplementasikan User Interface",
    subTitles: [
      {
        title: "Identifikasi mock-up",
        desc: "Menganalisis acuan desain, tata letak visual, wireframe, dan mengonversinya menjadi komponen antarmuka web modern berbasis standar industri."
      },
      {
        title: "Penyusunan hirarki dialog UI",
        desc: "Merancang navigasi berlapis, modal detail interaktif, konfirmasi aksi kritikal, serta sistem dialog transaksional pengguna."
      },
      {
        title: "Penerapan tampilan interaktif",
        desc: "Mengimplementasikan animasi visual 3D, pergantian tema gelap/terang, lokalisasi multi-bahasa, serta mikro-interaksi responsif."
      }
    ],
    speechScript: `
      <p><span class="speech-stage-cue">[Pembukaan &amp; Sikap]</span> "Selamat pagi/siang Dewan Penguji dan Bapak/Ibu Pembimbing yang saya hormati. Pada kesempatan hari ini, saya Aditya Ristanto Mukti akan memaparkan pencapaian teknis pada unit kompetensi <strong>Mengimplementasikan User Interface</strong> dalam pengembangan Website Resmi &amp; Portal Karir PT Global Philsonic Technologies (Intersis)."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 1: Identifikasi Mock-up]</span> "Langkah awal yang kami lakukan adalah <em>Identifikasi Mock-up</em>. Kami tidak sekadar menyalin visual biasa, melainkan menganalisis kebutuhan branding industri otomasi manufaktur modern. Mengacu pada benchmark desain global seperti Astra International, Accela, dan pola bento-grid EduChild, kami menerjemahkan wireframe ke dalam arsitektur komponen React 19 dan Tailwind CSS v4. Kami membangun Hero Section dinamis di <code>HomePage.jsx</code> yang memuat tombol pengarah aksi langsung (Direct Redirection ke Katalog Produk dan Form Kontak), grid 5-kolom terstagger di <code>AboutPage.jsx</code>, hingga showcase kartu lowongan pekerjaan terfilter di <code>CareerPage.jsx</code>."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 2: Penyusunan Hirarki Dialog UI]</span> "Selanjutnya, dalam <em>Penyusunan Hirarki Dialog UI</em>, kami merancang tata kelola antarmuka agar pengguna tidak tersesat dalam interaksi data yang kompleks. Pada area publik, kami menyediakan Modal Detail Galeri dan Modal Pendaftaran Karir dengan focus trap dan backdrop blur. Sedangkan pada Dashboard Admin (<code>AdminDashboard.jsx</code> dan modul-modulnya), kami mengintegrasikan dialog konfirmasi <code>SweetAlert2</code> untuk setiap tindakan kritikal—seperti penghapusan lowongan atau pengubahan status produk—lengkap dengan umpan balik visual instan (toast notification) tanpa perlu memuat ulang keseluruhan halaman."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 3: Penerapan Tampilan Interaktif]</span> "Sub-topik ketiga adalah <em>Penerapan Tampilan Interaktif</em>, yang menjadi keunggulan daya saing website ini. Kami mengintegrasikan <strong>Interactive 3D Canvas Globe</strong> menggunakan library <code>cobe</code> dan <code>three</code> pada halaman Automation &amp; Home, menghadirkan visualisasi bumi interaktif 3 dimensi yang responsif terhadap rotasi kursor. Selain itu, kami menerapkan sistem dual-theme (Dark/Light mode) menggunakan context API dan localStorage, sistem bilingual Bahasa Indonesia dan Bahasa Inggris dengan <code>react-i18next</code>, serta animasi scroll-reveal dan card-tilt berbasis CSS GPU-accelerated."</p>
      
      <p><span class="speech-stage-cue">[Penutup Unit 1]</span> "Dengan sinergi ketiga pilar antarmuka tersebut, website tidak hanya memiliki estetika premium berstandar industri, tetapi juga menghadirkan usability yang tinggi dan ramah di segala perangkat seluler. Terima kasih."</p>
    `,
    technicalSections: [
      {
        subNumber: "1.1",
        title: "Identifikasi Mock-up & Rekayasa Antarmuka High-Fidelity",
        codeRef: "frontend/src/pages/public/HomePage.jsx & AboutPage.jsx",
        bodyHtml: `
          <p>Mock-up awal diidentifikasi dari kebutuhan presentasi korporat PT Global Philsonic Technologies yang membutuhkan perpaduan antara identitas industri berteknologi tinggi (Automation-GPT) dan portal rekrutmen talenta muda. Proses translasi desain melibatkan pemilahan modul komponen:</p>
          <ul>
            <li><strong>Hero Section Component:</strong> Memadukan headline tipografi tebal, lencana akreditasi, dan dual-call-to-action dinamis yang mengarahkan pengunjung ke halaman produk manufaktur dan form kontak langsung.</li>
            <li><strong>Bento Grid Architecture:</strong> Diterapkan pada <code>AboutPage.jsx</code> dengan skema grid responsif 5-kolom tanpa border kaku, menghadirkan hierarki visual berjenjang untuk sejarah pabrik, kapasitas produksi, dan core values.</li>
            <li><strong>Statistik Metrik Korporat:</strong> Penghitung dinamis yang disesuaikan dengan skema monokrom kontras tinggi agar terbaca tajam pada perangkat mobile dan desktop layar lebar.</li>
          </ul>
        `,
        codeSnippet: {
          filename: "frontend/src/pages/public/HomePage.jsx",
          code: `// Implementasi Call to Action Dinamis dan Rendering Terstruktur
<div className="hero-action-group flex flex-wrap gap-4 items-center">
  <button 
    onClick={() => navigate('/products')} 
    className="btn-primary-gradient px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-cyan-500/25 transition-all">
    <Cpu className="w-5 h-5" /> {t('hero.explore_tech')}
  </button>
  <button 
    onClick={() => navigate('/contact')} 
    className="btn-outline-glass px-6 py-3 rounded-xl font-medium border border-slate-700 hover:border-slate-400 transition-all">
    <Mail className="w-5 h-5" /> {t('hero.contact_us')}
  </button>
</div>`
        }
      },
      {
        subNumber: "1.2",
        title: "Penyusunan Hirarki Dialog UI & State Modal",
        codeRef: "frontend/src/pages/admin/modules/JobsModule.jsx & GalleryPage.jsx",
        bodyHtml: `
          <p>Hirarki dialog antarmuka memisahkan secara tegas level interaksi antara pengguna umum dan pengguna administratif internal:</p>
          <table class="table-custom">
            <tr>
              <th>Level Dialog</th>
              <th>Komponen / Trigger</th>
              <th>Tujuan &amp; Manajemen State</th>
            </tr>
            <tr>
              <td>Level 1: Modal View</td>
              <td><code>selectedJob</code> di CareerPage / Gallery Lightbox</td>
              <td>Menampilkan rincian persyaratan kualifikasi atau foto resolusi tinggi tanpa memindahkan URL rute aplikasi.</td>
            </tr>
            <tr>
              <td>Level 2: Form Drawer / Dialog</td>
              <td>Modal Input Lowongan &amp; Produk Baru di Admin</td>
              <td>Mengisolasi form pengisian data multipart/form-data dengan validasi real-time sebelum submit ke REST API.</td>
            </tr>
            <tr>
              <td>Level 3: Critical Confirm</td>
              <td>SweetAlert2 Confirmation Dialog</td>
              <td>Pencegahan accidental delete dengan dialog konfirmasi modal bertingkat dan handling promise async/await.</td>
            </tr>
          </table>
        `,
        codeSnippet: {
          filename: "frontend/src/pages/admin/modules/JobsModule.jsx",
          code: `// Penanganan Dialog Interaktif Konfirmasi Hapus Data via SweetAlert2
const handleDeleteJob = async (id, title) => {
  const result = await Swal.fire({
    title: 'Hapus Lowongan?',
    text: \`Apakah Anda yakin ingin menghapus "\${title}"? Data tidak dapat dikembalikan.\`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal'
  });

  if (result.isConfirmed) {
    await apiClient.delete(\`/api/admin/jobs/\${id}\`);
    Swal.fire('Terhapus!', 'Lowongan pekerjaan telah dihapus.', 'success');
    loadJobs();
  }
};`
        }
      },
      {
        subNumber: "1.3",
        title: "Penerapan Tampilan Interaktif, Animasi 3D, dan Multi-Bahasa",
        codeRef: "frontend/src/components/home/HeroGlobe.jsx & src/i18n.js",
        bodyHtml: `
          <p>Interaktivitas website diperkuat melalui tiga pilar komputasi browser modern:</p>
          <ol>
            <li><strong>Interactive WebGL Canvas (Cobe & Three.js):</strong> Menghitung matriks proyeksi lingkaran bumi bola secara 60 FPS menggunakan WebGL shader ringan, memungkinkan pengguna memutar globe secara halus mengikuti interaksi drag mouse.</li>
            <li><strong>Bilingual Localization Engine (i18next):</strong> Mendeteksi preferensi browser dan memungkinkan pengguna beralih antara Bahasa Indonesia dan Bahasa Inggris secara instan tanpa flickering halaman.</li>
            <li><strong>Theme Persistence Engine:</strong> Mengatur penambahan class <code>dark</code> pada tag <code>&lt;html&gt;</code> dan menyinkronkannya ke local storage browser untuk kenyamanan mata pengguna di lingkungan redup.</li>
          </ol>
        `,
        codeSnippet: {
          filename: "frontend/src/components/automation/AutomationGlobe.jsx",
          code: `// Inisialisasi WebGL 3D Globe dengan Library Cobe
import createGlobe from 'cobe';
useEffect(() => {
  let phi = 0;
  const globe = createGlobe(canvasRef.current, {
    devicePixelRatio: 2,
    width: 600 * 2,
    height: 600 * 2,
    phi: 0,
    theta: 0.25,
    dark: isDark ? 1 : 0,
    diffuse: 1.2,
    mapSamples: 16000,
    mapBrightness: 6,
    baseColor: [0.1, 0.15, 0.25],
    markerColor: [0.1, 0.8, 1],
    markers: [{ location: [1.1301, 104.0529], size: 0.1 }], // Lokasi Batam, Indonesia
    onRender: (state) => {
      state.phi = phi;
      phi += 0.003; // Otomasi rotasi halus
    }
  });
  return () => globe.destroy();
}, [isDark]);`
        }
      }
    ],
    slideTalkingPoints: [
      "Translasi Mock-up: Mengubah wireframe konseptual menjadi high-fidelity UI berbasis React 19 + Tailwind CSS v4.",
      "Desain Bento Grid Modern: Diterapkan pada profil korporat dan galeri industri untuk navigasi visual yang ergonomis.",
      "Arsitektur Dialog 3-Level: Modal detail pelamar, drawer form input dinamis, dan dialog proteksi SweetAlert2.",
      "WebGL 3D Globe Integration: Visualisasi interaktif rotasi bumi 60 FPS menggunakan library Cobe & Three.js.",
      "Fitur Bilingual & Dark Mode: Dukungan ID/EN real-time via react-i18next serta sinkronisasi tema lokal."
    ],
    qaDefenseMatrix: [
      {
        question: "Mengapa Anda memilih kombinasi Tailwind CSS v4 dan CSS manual pada halaman About/Home, tidak pure utility?",
        answer: "Tailwind v4 kami gunakan untuk utilitas layouting cepat dan konsistensi spacing token, sedangkan CSS manual (seperti AboutPage.css) digunakan untuk kalkulasi keyframes 3D transform, tracing-beam pseudo-elements, dan glassmorphism backdrop-filter kompleks yang memerlukan presisi performa GPU rendering."
      },
      {
        question: "Bagaimana cara Anda menjamin performa rendering tetap ringan saat memuat animasi 3D WebGL di perangkat mobile?",
        answer: "Kami mengatur devicePixelRatio secara adaptif, mematikan loop kalkulasi saat canvas keluar dari viewport (menggunakan IntersectionObserver), serta menurunkan mapSamples dari 16.000 menjadi 8.000 pada resolusi layar ponsel di bawah 768px."
      }
    ]
  },

  // =========================================================================
  // UNIT 02: MENGIMPLEMENTASIKAN RANCANGAN ENTITAS DAN KETERKAITAN ANTAR ENTITAS
  // =========================================================================
  {
    unitNumber: "02",
    unitCode: "TI.DB.02.2026",
    unitTitle: "Mengimplementasikan Rancangan Entitas dan Keterkaitan Antar Entitas",
    subTitles: [
      {
        title: "Perancangan ERD",
        desc: "Memodelkan skema entitas database relasional sesuai kebutuhan fungsional sistem, mengeliminasi redundansi melalui normalisasi 3NF."
      },
      {
        title: "Identifikasi hubungan antar entitas",
        desc: "Menetapkan kardinalitas relasi (1:N, Singleton Audit), pendefinisian Primary Key, Foreign Key, dan integritas referensial data."
      },
      {
        title: "Eksekusi query dasar",
        desc: "Mengeksekusi perintah SQL DDL untuk pembuatan skema tabel serta query DQL terindeks dengan operasi JOIN antar tabel."
      }
    ],
    speechScript: `
      <p><span class="speech-stage-cue">[Pembukaan &amp; Sikap]</span> "Dewan Penguji yang saya hormati, data merupakan pondasi utama dari sebuah sistem informasi enterprise. Pada unit kompetensi <strong>Mengimplementasikan Rancangan Entitas dan Keterkaitan Antar Entitas</strong>, saya bertanggung jawab penuh merancang dan merealisasikan arsitektur basis data relasional untuk sistem Website Intersis."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 1: Perancangan ERD]</span> "Pada tahap <em>Perancangan ERD (Entity Relationship Diagram)</em>, kami membedah seluruh kebutuhan fungsional sistem karir dan profil industri. Database kami beri nama <code>isa_career_hrd</code>. Kami merancang 12 entitas terstruktur, di antaranya tabel <code>users</code>, <code>job_vacancies</code>, <code>job_categories</code>, <code>company_profile</code>, <code>products</code>, <code>gallery</code>, hingga <code>activity_logs</code>. Skema ini dirancang memenuhi kaidah <strong>Third Normal Form (3NF)</strong>, di mana seluruh atribut bernilai atomik (1NF), bergantung penuh pada Primary Key (2NF), dan tidak memiliki dependensi transitif antar kolom non-key (3NF)."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 2: Identifikasi Hubungan Antar Entitas]</span> "Selanjutnya pada <em>Identifikasi Hubungan Antar Entitas</em>, kami memetakan relasi One-to-Many (1:N) yang kokoh. Sebagai contoh, satu kategori lowongan (<code>job_categories</code>) dapat menaungi banyak lowongan aktif (<code>job_vacancies</code>) yang dikaitkan melalui Foreign Key <code>category_id</code> dengan aturan <code>ON DELETE RESTRICT</code> guna mencegah lowongan kehilangan kategorinya secara tidak sengaja. Demikian juga setiap aksi pengubahan didokumentasikan ke tabel <code>activity_logs</code> yang berelasi dengan <code>users.id</code>. Kami juga menerapkan konsep <em>Singleton Entity</em> untuk tabel profil perusahaan dan kontak rekrutmen yang hanya membutuhkan 1 baris record utama namun tetap memiliki foreign key <code>updated_by</code> untuk jejak audit."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 3: Eksekusi Query Dasar]</span> "Pada sub-topik <em>Eksekusi Query Dasar</em>, seluruh skema dieksekusi menggunakan skrip SQL DDL dengan penetapan indeks pada foreign keys dan kolom pencarian. Untuk penarikan data ke frontend, kami menyusun query DQL dengan klausa <code>LEFT JOIN</code> untuk menggabungkan data lowongan beserta nama kategorinya dalam satu round-trip query yang efisien. Melalui rancangan ini, konsistensi dan kecepatan akses data terjamin secara optimal."</p>
    `,
    technicalSections: [
      {
        subNumber: "2.1",
        title: "Perancangan ERD dan Normalisasi Basis Data 3NF",
        codeRef: "database/ERD.md & database/isa_career_hrd.sql",
        bodyHtml: `
          <p>Database <code>isa_career_hrd</code> dirancang untuk mendukung operasional sistem multi-tier yang handal. Pemodelan mencakup 12 tabel fungsional dengan kepatuhan normalisasi ketat:</p>
          <ul>
            <li><strong>1NF (Atomisitas):</strong> Kolom seperti persyaratan kualifikasi disimpan dalam format teks terstruktur atau relasi baris terpisah, bukan koma tanpa batasan.</li>
            <li><strong>2NF (Dependensi Penuh):</strong> Setiap tabel memiliki Primary Key integer Auto Increment tunggal (seperti <code>id</code>), dan seluruh kolom non-kunci bergantung penuh pada ID tersebut.</li>
            <li><strong>3NF (Bebas Transitif):</strong> Data kategori jabatan tidak disematkan sebagai string berulang di tabel lowongan, melainkan dipisah ke <code>job_categories</code> sehingga perubahan nama kategori tidak menimbulkan anomali pembaruan.</li>
          </ul>
        `,
        codeSnippet: {
          filename: "database/isa_career_hrd.sql",
          code: `-- Struktur Tabel Relasional Lowongan Pekerjaan (Job Vacancies)
CREATE TABLE IF NOT EXISTS job_vacancies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  location VARCHAR(100) NOT NULL DEFAULT 'Batam, Kepulauan Riau',
  employment_type ENUM('Full Time','Part Time','Internship','Contract','OJT') NOT NULL DEFAULT 'Full Time',
  description TEXT NOT NULL,
  responsibilities TEXT,
  requirements TEXT NOT NULL,
  form_url VARCHAR(500),
  status ENUM('draft','published','closed') NOT NULL DEFAULT 'draft',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_jobs_category (category_id),
  INDEX idx_jobs_status (status),
  CONSTRAINT fk_jobs_category FOREIGN KEY (category_id) REFERENCES job_categories(id) ON DELETE RESTRICT,
  CONSTRAINT fk_jobs_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
        }
      },
      {
        subNumber: "2.2",
        title: "Identifikasi Relasi Kardinalitas & Audit Trail",
        codeRef: "database/DATABASE_DOCUMENTATION.md",
        bodyHtml: `
          <p>Matriks relasi antar entitas mencakup hubungan kardinalitas sebagai berikut:</p>
          <table class="table-custom">
            <tr>
              <th>Relasi Antar Entitas</th>
              <th>Kardinalitas</th>
              <th>Foreign Key &amp; Constraint</th>
              <th>Deskripsi Bisnis</th>
            </tr>
            <tr>
              <td><code>job_categories</code> &rarr; <code>job_vacancies</code></td>
              <td>1 : N</td>
              <td><code>category_id</code> (ON DELETE RESTRICT)</td>
              <td>Satu divisi kategori memiliki banyak posting lowongan pekerjaan. Kategori tidak boleh dihapus jika masih ada lowongan aktif.</td>
            </tr>
            <tr>
              <td><code>users</code> &rarr; <code>job_vacancies</code></td>
              <td>1 : N</td>
              <td><code>created_by</code> (ON DELETE SET NULL)</td>
              <td>Mencatat staf HRD yang merilis lowongan kerja untuk akuntabilitas internal.</td>
            </tr>
            <tr>
              <td><code>users</code> &rarr; <code>activity_logs</code></td>
              <td>1 : N</td>
              <td><code>user_id</code> (ON DELETE CASCADE)</td>
              <td>Setiap login, manipulasi data produk, dan lowongan terekam lengkap beserta timestamp ke log audit.</td>
            </tr>
            <tr>
              <td><code>users</code> &rarr; <code>company_profile</code></td>
              <td>1 : 1 (Singleton)</td>
              <td><code>updated_by</code> (ON DELETE SET NULL)</td>
              <td>Hanya terdapat tepat 1 baris profil korporat untuk menjaga integritas tampilan landing page.</td>
            </tr>
          </table>
        `,
        codeSnippet: {
          filename: "database/ERD.md (Mermaid Syntax)",
          code: `erDiagram
    users ||--o{ job_vacancies : "creates (1..N)"
    users ||--o{ activity_logs : "generates (1..N)"
    users ||--o{ gallery : "uploads (1..N)"
    job_categories ||--o{ job_vacancies : "categorizes (1..N)"
    users ||--|| company_profile : "manages (1..1 singleton)"`
        }
      },
      {
        subNumber: "2.3",
        title: "Eksekusi Query Terindeks & Penggabungan Relasi (JOIN)",
        codeRef: "backend/src/controllers/public/publicJobController.js",
        bodyHtml: `
          <p>Untuk menyajikan data lowongan kepada calon pelamar, backend mengeksekusi query DQL relasional dengan prepared statements. Query ini menggabungkan tabel <code>job_vacancies</code> dengan <code>job_categories</code> menggunakan klausa <code>LEFT JOIN</code>:</p>
        `,
        codeSnippet: {
          filename: "backend/src/controllers/public/publicJobController.js",
          code: `// Eksekusi Query Relasional DQL dengan LEFT JOIN & Filter Status
exports.getPublishedJobs = async (req, res, next) => {
  try {
    const query = \`
      SELECT 
        j.id, j.title, j.location, j.employment_type,
        j.description, j.responsibilities, j.requirements,
        j.form_url, j.created_at,
        c.name AS category_name
      FROM job_vacancies j
      LEFT JOIN job_categories c ON j.category_id = c.id
      WHERE j.status = 'published'
      ORDER BY j.created_at DESC
    \`;
    const [jobs] = await db.query(query);
    return res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};`
        }
      }
    ],
    slideTalkingPoints: [
      "Database Enterprise: Skema 'isa_career_hrd' terdiri dari 12 entitas relasional terorganisir.",
      "Kepatuhan 3NF: Meniadakan redundansi atribut, anomali insert, update, dan delete.",
      "Integritas Referensial: Penerapan Foreign Key constraints (RESTRICT, CASCADE, SET NULL).",
      "Pola Singleton Entity: Desain khusus tabel profil korporat & kontak untuk proteksi konfigurasi tunggal.",
      "Optimasi Query: Penggunaan indeks pada kolom foreign key dan status untuk kecepatan operasi JOIN."
    ],
    qaDefenseMatrix: [
      {
        question: "Mengapa pada tabel lowongan pekerjaan Anda menggunakan constraint ON DELETE RESTRICT untuk category_id?",
        answer: "Kami menggunakan ON DELETE RESTRICT secara sengaja agar sebuah kategori jabatan tidak dapat dihapus apabila masih memiliki data lowongan yang terhubung. Ini melindungi konsistensi data riil sistem rekrutmen dan menghindari terjadinya 'orphan records' di database."
      },
      {
        question: "Apa keuntungan menerapkan tabel singleton pada company_profile dibandingkan file konfigurasi JSON biasa?",
        answer: "Dengan menyimpan profil korporat pada tabel database singleton, administrator HRD dapat memperbarui visi, misi, deskripsi, dan logo perusahaan secara real-time melalui form CMS dashboard tanpa perlu redeploy aplikasi atau mengubah file konfigurasi di server."
      }
    ]
  },

  // =========================================================================================================
  // UNIT 03: MENERAPKAN PERINTAH EKSEKUSI BAHASA PEMROGRAMAN BERBASIS TEKS, GRAFIK, DAN MULTIMEDIA
  // =========================================================================================================
  {
    unitNumber: "03",
    unitCode: "TI.PG.03.2026",
    unitTitle: "Menerapkan Perintah Eksekusi Bahasa Pemrograman Berbasis Teks, Grafik, dan Multimedia",
    subTitles: [
      {
        title: "Mekanisme running source code",
        desc: "Mengonfigurasi dan mengoperasikan eksekusi runtime Node.js v18+, bundler Vite ESM, skrip npm, serta orkestrasi cloud hosting."
      },
      {
        title: "Debugging",
        desc: "Mendiagnosis kesalahan sintaksis, logika, network status, serta penggunaan middleware logger terpusat dan DevTools."
      },
      {
        title: "Pengelolaan executable files",
        desc: "Memproses stream upload media (gambar/dokumen), file system static serving, serta automasi CLI rendering headless Chrome via Puppeteer."
      }
    ],
    speechScript: `
      <p><span class="speech-stage-cue">[Pembukaan &amp; Sikap]</span> "Selamat pagi/siang Dewan Penguji. Pada unit kompetensi <strong>Menerapkan Perintah Eksekusi Bahasa Pemrograman Berbasis Teks, Grafik, dan Multimedia</strong>, saya akan mendemonstrasikan bagaimana siklus hidup kode, dari proses eksekusi lokal hingga pemrosesan aset multimedia, dikelola secara profesional."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 1: Mekanisme Running Source Code]</span> "Dalam <em>Mekanisme Running Source Code</em>, proyek kami menerapkan arsitektur client-server dual-runtime. Di sisi backend, kami menjalankan runtime <strong>Node.js v24</strong> dengan framework <strong>Express v5</strong> melalui perintah <code>npm run dev</code> yang memanfaatkan <code>nodemon</code> untuk hot-reloading otomatis saat ada perubahan berkas. Di sisi frontend, kami mengeksekusi <strong>Vite</strong> berbasis Rollup ESM engine yang memproses Hot Module Replacement (HMR) dalam hitungan milidetik. Untuk fase produksi, perintah <code>vite build</code> mengompilasi kode JSX dan CSS menjadi static chunks yang sangat teroptimasi untuk di-deploy ke Vercel dan Railway."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 2: Debugging]</span> "Pada aspek <em>Debugging</em>, kami menerapkan pendekatan observabilitas berlapis. Di backend, kami mengintegrasikan middleware <code>morgan</code> untuk melacak setiap HTTP Request secara transparan dan membangun Global Error Handling Middleware yang menangkap exception database tanpa membiarkan server crash. Di frontend, kami memanfaatkan Chrome DevTools Network Tab untuk memvalidasi payload JSON dan header status HTTP (200 OK, 401 Unauthorized, 422 Unprocessable Entity), serta React DevTools untuk menginspeksi state component secara real-time."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 3: Pengelolaan Executable Files &amp; Multimedia]</span> "Pada sub-topik <em>Pengelolaan Executable Files</em>, kami menangani pemrosesan aset grafis dan multimedia secara ketat. Kami menggunakan <code>multer</code> untuk memfilter tipe file MIME (hanya mengizinkan JPEG, PNG, dan WebP) dengan batasan ukuran maksimum 5MB. Selain itu, kami juga merancang skrip automasi executable <code>generate_handbook_pdf.js</code> yang memanfaatkan Puppeteer headless browser untuk mengonversi dokumen HTML kompleks menjadi berkas PDF A4 berstandar resmi secara otomatis melalui baris perintah CLI."</p>
    `,
    technicalSections: [
      {
        subNumber: "3.1",
        title: "Mekanisme Eksekusi Runtime & Orkestrasi Skrip NPM",
        codeRef: "backend/package.json & frontend/package.json",
        bodyHtml: `
          <p>Lingkungan eksekusi dibagi menjadi dua modul runtime independen yang dapat dijalankan secara bersamaan:</p>
          <table class="table-custom">
            <tr>
              <th>Layer</th>
              <th>Runtime &amp; Bundler</th>
              <th>Perintah Eksekusi</th>
              <th>Perilaku Runtime</th>
            </tr>
            <tr>
              <td>Backend Service</td>
              <td>Node.js v18+ (CommonJS) / Express 5</td>
              <td><code>npm run dev</code> (Nodemon)</td>
              <td>Memantau direktori <code>backend/src</code>, merestart server otomatis saat terjadi perubahan kode pada port 5000.</td>
            </tr>
            <tr>
              <td>Frontend Client</td>
              <td>Vite 8.3 / React 19 (ES Modules)</td>
              <td><code>npm run dev</code> (Vite HMR)</td>
              <td>Menyediakan dev-server instan berbasis native browser ESM pada port 5173 dengan pembaruan state tanpa refresh halaman.</td>
            </tr>
            <tr>
              <td>Production Build</td>
              <td>Rollup Bundler Engine</td>
              <td><code>npm run build</code></td>
              <td>Minifikasi JavaScript, tree-shaking CSS Tailwind, dan menghasilkan berkas static di direktori <code>frontend/dist</code>.</td>
            </tr>
          </table>
        `,
        codeSnippet: {
          filename: "backend/package.json",
          code: `"scripts": {
  "dev": "nodemon src/server.js",
  "start": "node src/server.js",
  "seed": "node src/seeders/seed.js",
  "test": "node test_api_runner.js"
}`
        }
      },
      {
        subNumber: "3.2",
        title: "Strategi Debugging, HTTP Logging, dan Exception Handling",
        codeRef: "backend/src/server.js & backend/src/middlewares/errorHandler.js",
        bodyHtml: `
          <p>Debugging dilakukan secara terpusat untuk memastikan tidak ada kesalahan internal yang membocorkan kredensial sistem ke publik:</p>
          <ul>
            <li><strong>HTTP Traffic Monitoring:</strong> Menggunakan <code>morgan('dev')</code> untuk mencatat method, URL rute, kode status response, dan response time milidetik pada konsol terminal backend.</li>
            <li><strong>Centralized Error Interceptor:</strong> Middleware Express yang menangani error penolakan promise database, duplikasi key, dan kegagalan token autentikasi.</li>
          </ul>
        `,
        codeSnippet: {
          filename: "backend/src/server.js",
          code: `// Global Error Handling Middleware untuk Debugging Terpusat
app.use((err, req, res, next) => {
  console.error('[SERVER EXCEPTION]', {
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server.',
    error_code: err.code || 'INTERNAL_ERROR'
  });
});`
        }
      },
      {
        subNumber: "3.3",
        title: "Pengelolaan Upload Media & Automasi Executable PDF Generator",
        codeRef: "backend/src/middlewares/upload.js & generate_handbook_pdf.js",
        bodyHtml: `
          <p>Pengelolaan file grafis multimedia dan skrip executable mencakup dua komponen utama:</p>
          <ol>
            <li><strong>Middleware Multer Storage:</strong> Mengelola stream file upload foto profil dan galeri industri. File diverifikasi ekstensinya, dinamai ulang menggunakan kombinasi timestamp acak, dan disimpan ke direktori publik <code>/uploads</code>.</li>
            <li><strong>Headless Chrome Automation (Puppeteer):</strong> Skrip Node.js mandiri yang mengontrol browser Chrome secara programmatic untuk mem-print dokumen HTML teknis menjadi berkas PDF A4 beresolusi tinggi tanpa intervensi manual.</li>
          </ol>
        `,
        codeSnippet: {
          filename: "generate_handbook_pdf.js",
          code: `// Automasi Pembuatan Berkas PDF Menggunakan Puppeteer-Core
const puppeteer = require('./frontend/node_modules/puppeteer-core');
const browser = await puppeteer.launch({
  executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});
const page = await browser.newPage();
await page.goto('file:///' + htmlPath.replace(/\\\\/g, '/'), { waitUntil: 'networkidle0' });
await page.pdf({
  path: outputPath,
  format: 'A4',
  margin: { top: '16mm', bottom: '16mm', left: '16mm', right: '16mm' },
  printBackground: true
});
await browser.close();`
        }
      }
    ],
    slideTalkingPoints: [
      "Dual Runtime Ecosystem: Node.js v24 (Backend Express) dan Vite HMR Engine (Frontend React).",
      "Skrip Eksekusi Terstruktur: 'npm run dev', 'npm run build', dan 'npm run seed'.",
      "Debugging Observability: Logging HTTP otomatis dengan Morgan dan Centralized Error Handler.",
      "Multimedia Upload Pipeline: Validasi MIME-type dan proteksi ukuran file via Multer.",
      "Headless Browser Automation: Generator PDF otomatis menggunakan Puppeteer dan Chrome Binary Engine."
    ],
    qaDefenseMatrix: [
      {
        question: "Mengapa Anda menggunakan 'puppeteer-core' dan mengarahkan executablePath ke Chrome lokal, bukan 'puppeteer' standar?",
        answer: "Penggunaan puppeteer-core menghindarkan pengunduhan binary Chromium tambahan sebesar 300MB ke dalam node_modules. Kami memanfaatkan executable Chrome resmi yang sudah terpasang di sistem operasi host, sehingga eksekusi lebih cepat, hemat bandwidth, dan hemat kapasitas penyimpanan."
      },
      {
        question: "Bagaimana Anda mencegah celah keamanan saat pengguna mengunggah file media ke server?",
        answer: "Kami menerapkan fileFilter pada Multer untuk memeriksa header MIME type (hanya mengizinkan image/jpeg, image/png, image/webp), membatasi ukuran maksimal 5MB, serta mengubah nama asli file menjadi hash timestamp acak untuk mencegah penimpaan file sistem atau eksekusi remote script (.php/.sh)."
      }
    ]
  },

  // =========================================================================================================
  // UNIT 04: MENYUSUN FUNGSI, FILE ATAU SUMBER DAYA PEMROGRAMAN DALAM ORGANISASI YANG RAPI
  // =========================================================================================================
  {
    unitNumber: "04",
    unitCode: "TI.OR.04.2026",
    unitTitle: "Menyusun Fungsi, File atau Sumber Daya Pemrograman dalam Organisasi yang Rapi",
    subTitles: [
      {
        title: "Konvensi penamaan",
        desc: "Menerapkan standarisasi identitas variabel (camelCase), komponen (PascalCase), database (snake_case), dan environment (SCREAMING_SNAKE_CASE)."
      },
      {
        title: "Penulisan komentar/dokumentasi kode",
        desc: "Menyusun dokumentasi internal JSDoc, catatan arsitektur sistem, dan berkas panduan teknis yang mudah dipelihara tim."
      },
      {
        title: "Struktur folder rapi",
        desc: "Mengorganisasikan direktori proyek mengikuti prinsip Separation of Concerns (SoC) dan arsitektur modular multi-tier."
      }
    ],
    speechScript: `
      <p><span class="speech-stage-cue">[Pembukaan &amp; Sikap]</span> "Bapak/Ibu Dewan Penguji yang terhormat, kerapian dan standarisasi kode merupakan penentu utama kualitas perangkat lunak dalam jangka panjang (maintainability). Pada unit kompetensi <strong>Menyusun Fungsi, File atau Sumber Daya Pemrograman dalam Organisasi yang Rapi</strong>, saya akan memperlihatkan bagaimana standar rekayasa perangkat lunak diterapkan secara disiplin pada proyek ini."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 1: Konvensi Penamaan]</span> "Dimulai dari <em>Konvensi Penamaan</em>, kami menerapkan standar ketat di seluruh tingkatan aplikasi. Pada kode JavaScript dan React, fungsi dan variabel menggunakan <strong>camelCase</strong> seperti <code>fetchJobVacancies</code> dan <code>isSubmitting</code>. Nama komponen antarmuka dan file page selalu menggunakan <strong>PascalCase</strong> seperti <code>CoreValuesModule.jsx</code> dan <code>ProductsPage.jsx</code>. Pada skema database relasional MySQL, seluruh tabel dan kolom dinamai dengan <strong>snake_case</strong> seperti <code>job_vacancies</code> dan <code>created_at</code>. Sementara itu, variabel konfigurasi environment ditulis dalam format <strong>SCREAMING_SNAKE_CASE</strong> seperti <code>JWT_SECRET</code> dan <code>MYSQL_URL</code>. Standarisasi ini mempermudah pembacaan kode bagi siapa pun yang melanjutkan pengembangan."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 2: Penulisan Komentar &amp; Dokumentasi Kode]</span> "Pada sub-topik <em>Penulisan Komentar/Dokumentasi Kode</em>, kami mendokumentasikan setiap logika fungsi menggunakan format standar <strong>JSDoc</strong> yang menjelaskan parameter masukan, tipe data, dan nilai kembalian. Selain komentar di baris kode, kami membuat berkas dokumentasi mandiri yang sangat komprehensif di root proyek, seperti <code>README.md</code>, <code>ERD.md</code>, <code>DATABASE_DOCUMENTATION.md</code>, serta sepuluh bab dokumentasi teknis berformat PDF."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 3: Struktur Folder Rapi]</span> "Pilar ketiga adalah <em>Struktur Folder Rapi</em>. Kami memisahkan sistem menjadi dua direktori utama: <code>/backend</code> dan <code>/frontend</code>. Di backend, kami menerapkan pola Model-Controller-Routes dengan memisahkan pengontrol publik (<code>/controllers/public</code>) dan pengontrol manajemen internal (<code>/controllers/admin</code>). Di frontend, folder diorganisir menjadi <code>/components</code> untuk widget yang reusable, <code>/pages</code> untuk tampilan rute, <code>/context</code> untuk global state, dan <code>/locales</code> untuk berkas terjemahan. Struktur modular ini memastikan tidak ada percampuran tanggung jawab logika (Separation of Concerns)."</p>
    `,
    technicalSections: [
      {
        subNumber: "4.1",
        title: "Standarisasi Konvensi Penamaan (Naming Conventions)",
        codeRef: "Aturan Konsistensi di Frontend & Backend",
        bodyHtml: `
          <p>Tabel konvensi penamaan yang diterapkan pada seluruh berkas codebase:</p>
          <table class="table-custom">
            <tr>
              <th>Cakupan Elemen</th>
              <th>Standar Format</th>
              <th>Contoh Penerapan Nyata</th>
              <th>Tujuan &amp; Manfaat</th>
            </tr>
            <tr>
              <td>React Component &amp; JSX Files</td>
              <td>PascalCase</td>
              <td><code>AutomationPage.jsx</code>, <code>JobsModule.jsx</code></td>
              <td>Membedakan elemen kustom React dengan tag HTML native browser.</td>
            </tr>
            <tr>
              <td>Variabel &amp; Fungsi JS</td>
              <td>camelCase</td>
              <td><code>handleFormSubmit()</code>, <code>activeCategory</code></td>
              <td>Standar resmi ECMAScript untuk kemudahan keterbacaan (readability).</td>
            </tr>
            <tr>
              <td>Tabel &amp; Kolom SQL</td>
              <td>snake_case</td>
              <td><code>job_vacancies</code>, <code>employment_type</code></td>
              <td>Mencegah konflik case-sensitivity pada sistem operasi Linux/Windows.</td>
            </tr>
            <tr>
              <td>Environment Config</td>
              <td>SCREAMING_SNAKE_CASE</td>
              <td><code>JWT_SECRET</code>, <code>DB_PORT</code></td>
              <td>Menegaskan status variabel sebagai nilai konstan immutable sistem.</td>
            </tr>
          </table>
        `,
        codeSnippet: {
          filename: "backend/src/controllers/admin/adminJobVacancyController.js",
          code: `// Contoh Penerapan Konvensi Penamaan camelCase & Destructuring Konsisten
exports.updateJobStatus = async (req, res, next) => {
  const { jobId } = req.params;
  const { status: targetStatus } = req.body;
  const adminUserId = req.user.id;

  // Variabel penampung hasil query
  const updatedJobResult = await jobService.changeStatus(jobId, targetStatus, adminUserId);
  return res.json({ success: true, data: updatedJobResult });
};`
        }
      },
      {
        subNumber: "4.2",
        title: "Dokumentasi Kode Terstruktur & JSDoc Annotations",
        codeRef: "backend/src/controllers/public/publicBenefitController.js & Dokumentasi_Per_BAB",
        bodyHtml: `
          <p>Seluruh fungsi publik dilengkapi dengan dokumentasi berstandar JSDoc untuk memfasilitasi IntelliSense IDE dan memudahkan proses audit kode:</p>
        `,
        codeSnippet: {
          filename: "backend/src/controllers/public/publicBenefitController.js",
          code: `/**
 * Controller untuk mengambil daftar fasilitas dan tunjangan aktif perusahaan.
 * 
 * @route   GET /api/public/benefits
 * @access  Public (Tanpa token autentikasi)
 * @param   {import('express').Request} req - Express Request Object
 * @param   {import('express').Response} res - Express Response Object
 * @param   {import('express').NextFunction} next - Express Error Handler Callback
 * @returns {Promise<void>} Mengembalikan JSON array berisi daftar benefit berstatus aktif
 */
exports.getAllActiveBenefits = async (req, res, next) => {
  try {
    const [benefits] = await db.query(
      'SELECT id, title, description, icon, image FROM benefits WHERE status = 1 ORDER BY sort_order ASC'
    );
    res.json({ success: true, count: benefits.length, data: benefits });
  } catch (err) {
    next(err);
  }
};`
        }
      },
      {
        subNumber: "4.3",
        title: "Struktur Folder Modular & Separation of Concerns (SoC)",
        codeRef: "Direktori backend/src & frontend/src",
        bodyHtml: `
          <p>Pemisahan tanggung jawab kode diimplementasikan secara tegas melalui pohon direktori berikut:</p>
          <div class="code-box">
            <span class="file-tag">Pohon Arsitektur Folder Proyek</span>
            <pre>c:/Projek_Magang/website_intersis/
├── backend/
│   ├── src/
│   │   ├── config/          # Koneksi MySQL pool & variabel environment
│   │   ├── controllers/     # Logika bisnis (dipisah /admin dan /public)
│   │   ├── middlewares/     # JWT Auth, Multer Upload, Centralized Error
│   │   ├── routes/          # Definisi endpoint RESTful Express
│   │   ├── utils/           # Helper fungsi, token sign, format response
│   │   └── server.js        # Entry point aplikasi backend
├── frontend/
│   ├── src/
│   │   ├── assets/          # Logo, icon SVG, dan gambar statis
│   │   ├── components/      # Reusable UI widgets (admin, home, layout)
│   │   ├── context/         # React Context (AuthContext, ThemeContext)
│   │   ├── locales/         # JSON kamus multi-bahasa (id.json, en.json)
│   │   ├── pages/           # View routed (public pages vs admin modules)
│   │   └── index.css        # Design tokens & Tailwind utility setup
└── database/
    ├── ERD.md               # Dokumentasi diagram entitas relasi
    └── isa_career_hrd.sql   # Skrip DDL & seed data basis data</pre>
          </div>
        `,
        codeSnippet: null
      }
    ],
    slideTalkingPoints: [
      "Konvensi Penamaan Terstandarisasi: PascalCase, camelCase, snake_case, dan SCREAMING_SNAKE_CASE.",
      "Dokumentasi Kode JSDoc: Penjelasan parameter, return type, dan alur otorisasi pada setiap controller.",
      "Dokumentasi Teknis Lengkap: Berkas ERD.md, DATABASE_DOCUMENTATION.md, dan 10 Bab PDF dossier.",
      "Separation of Concerns: Pemisahan tegas antara routing, controller, middleware, dan configuration layer.",
      "Modularitas Frontend: Pengelompokan komponen reusable, halaman publik, dan modul admin yang independen."
    ],
    qaDefenseMatrix: [
      {
        question: "Mengapa Anda memisahkan folder controllers menjadi /admin dan /public?",
        answer: "Pemisahan ini menerapkan prinsip Separation of Concerns dan keamanan. Controller /public dapat diakses secara terbuka tanpa autentikasi dengan query yang hanya memuat data publik (status='published'), sedangkan controller /admin memerlukan middleware verifikasi JWT token dan dapat mengakses data draf, log, serta manipulasi mutasi data."
      },
      {
        question: "Bagaimana struktur folder Anda mempermudah kerja kolaborasi tim jika ada pengembang baru yang bergabung?",
        answer: "Dengan struktur folder standar dan konvensi penamaan yang konsisten, pengembang baru dapat langsung mengetahui lokasi file hanya dari melihat rute URL (misal: rute /products langsung merujuk ke ProductsPage.jsx di frontend dan publicProductController.js di backend), tanpa perlu menyisir seluruh baris kode."
      }
    ]
  }
];

module.exports = modules01to04;
