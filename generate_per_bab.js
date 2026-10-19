const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetFolder = path.join(__dirname, 'Dokumentasi_Per_BAB');
const htmlTempFolder = path.join(targetFolder, 'html_sources');

if (!fs.existsSync(targetFolder)) {
  fs.mkdirSync(targetFolder, { recursive: true });
}
if (!fs.existsSync(htmlTempFolder)) {
  fs.mkdirSync(htmlTempFolder, { recursive: true });
}

console.log('Target output directory:', targetFolder);

const commonCss = `
  @page {
    size: A4 portrait;
    margin: 20mm 18mm 20mm 18mm;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body {
    font-family: 'Times New Roman', Times, Georgia, serif;
    font-size: 10.5pt;
    line-height: 1.55;
    color: #000000;
    background: #ffffff;
    margin: 0;
    padding: 0;
  }
  .doc-header {
    border-top: 3px solid #000000;
    border-bottom: 1px solid #000000;
    padding: 8px 0;
    margin-bottom: 22px;
    display: flex;
    justify-content: space-between;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .chapter-title-box {
    margin-bottom: 20px;
    border-bottom: 2px solid #000000;
    padding-bottom: 12px;
  }
  .chapter-num {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }
  h1 {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16pt;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 1.25;
    margin: 0 0 6px 0;
  }
  .chapter-sub {
    font-size: 11pt;
    font-style: italic;
    color: #333333;
    margin: 0;
  }
  .meta-box {
    border: 1px solid #000000;
    background-color: #fafafa;
    padding: 8px 12px;
    margin-bottom: 20px;
    font-size: 9pt;
    font-family: Arial, Helvetica, sans-serif;
    page-break-inside: avoid;
  }
  .meta-box table {
    width: 100%;
    border-collapse: collapse;
  }
  .meta-box td {
    padding: 3px 0;
    vertical-align: top;
  }
  .meta-box td.lbl {
    font-weight: bold;
    width: 160px;
  }
  h2 {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12pt;
    font-weight: bold;
    margin-top: 18px;
    margin-bottom: 8px;
    border-bottom: 1px solid #000000;
    padding-bottom: 3px;
    break-after: avoid;
  }
  h3 {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10.5pt;
    font-weight: bold;
    margin-top: 14px;
    margin-bottom: 6px;
    break-after: avoid;
  }
  p {
    margin-top: 0;
    margin-bottom: 8px;
    text-align: justify;
  }
  ul, ol {
    margin-top: 0;
    margin-bottom: 8px;
    padding-left: 20px;
  }
  li {
    margin-bottom: 3px;
  }
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    margin-bottom: 14px;
    font-size: 9pt;
    page-break-inside: avoid;
  }
  table.data-table th, table.data-table td {
    border: 1px solid #333333;
    padding: 5px 7px;
    vertical-align: top;
  }
  table.data-table th {
    background-color: #f2f2f2;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    text-align: left;
  }
  pre {
    background-color: #f9f9f9;
    border: 1px solid #cccccc;
    padding: 8px;
    margin-top: 6px;
    margin-bottom: 12px;
    overflow-x: auto;
    white-space: pre-wrap;
    line-height: 1.35;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8pt;
    page-break-inside: avoid;
  }
  .doc-footer {
    margin-top: 35px;
    border-top: 1px solid #000000;
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 8.5pt;
    page-break-inside: avoid;
  }
  .page-break {
    page-break-before: always;
    break-before: page;
  }
`;

function buildHtml(babNum, babTitle, babSub, contentHtml) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${babNum}: ${babTitle}</title>
  <style>${commonCss}</style>
</head>
<body>
  <div class="doc-header">
    <span>PT. Intersis Sejahtera Abadi &bull; PT. Global Philsonic Technologies</span>
    <span>Dokumentasi Sistem Resmi &bull; ${babNum}</span>
  </div>

  <div class="chapter-title-box">
    <div class="chapter-num">${babNum}</div>
    <h1>${babTitle}</h1>
    <div class="chapter-sub">${babSub}</div>
  </div>

  <div class="meta-box">
    <table>
      <tr>
        <td class="lbl">Penyusun / Penulis:</td>
        <td>Saya (Fullstack Developer &amp; System Architect)</td>
      </tr>
      <tr>
        <td class="lbl">Entitas Perusahaan:</td>
        <td>PT. Global Philsonic Technologies (GPT) &mdash; Unit Bisnis PT. Intersis Sejahtera Abadi (ISA)</td>
      </tr>
      <tr>
        <td class="lbl">Kawasan Operasional:</td>
        <td>Batam Free Trade Zone (FTZ), Kepulauan Riau, Indonesia</td>
      </tr>
      <tr>
        <td class="lbl">Tanggal &amp; Status:</td>
        <td>Oktober 2026 &bull; Dokumen Final Teknis (Monokrom Standar)</td>
      </tr>
    </table>
  </div>

  ${contentHtml}

  <div class="doc-footer">
    <div>
      <strong>Disahkan Oleh:</strong> Saya (Fullstack Developer &amp; System Architect)<br>
      PT. Intersis Sejahtera Abadi &bull; PT. Global Philsonic Technologies
    </div>
    <div style="text-align: right;">
      <strong>Lokasi:</strong> Batam Free Trade Zone, Indonesia<br>
      Oktober 2026
    </div>
  </div>
</body>
</html>`;
}

// ── BAB 1 CONTENT ─────────────────────────────────────────────────────────────
const bab1Content = `
  <h2>1.1 Latar Belakang &amp; Pemahaman Entitas Bisnis</h2>
  <p>
    Pada tahap awal penugasan, saya melakukan analisis mendalam terhadap alamat web <code>https://www.globalphilsonics.com/isa/automation-gpt/</code> serta domain induk <code>globalphilsonics.com/isa/</code>. Dari observasi struktural dan korporat, saya memahami bahwa PT. Global Philsonic Technologies (GPT) merupakan unit bisnis manufaktur dan perakitan dari PT. Intersis Sejahtera Abadi (ISA). GPT beroperasi di Kawasan Bebas Batam (Batam Free Trade Zone / FTZ) dengan fokus model bisnis B2B (Business-to-Business) penyedia layanan perakitan elektronik otomotif (OEM/ODM Assembly Services) dan teknologi otomasi industri robotik.
  </p>
  <p>
    Halaman spesifik <code>automation-gpt/</code> dirancang untuk mempromosikan kapabilitas robotika industri di Batam (mencakup Robot Welding, Robot Handling, dan Robot Cutting) guna melayani pabrik perakitan otomotif, manufaktur logam, dan galangan kapal. Namun, media digital yang ada sebelumnya belum mampu merepresentasikan keunggulan teknologi dan skala industri perusahaan secara optimal.
  </p>

  <h2>1.2 Identifikasi Masalah &amp; Kesenjangan (Gap Analysis)</h2>
  <p>Saya melakukan audit teknis komprehensif terhadap website eksisting dan mencatat sejumlah kelemahan kritis sebagai berikut:</p>
  <ul>
    <li><strong>Arsitektur Monolitik Usang (WordPress 6.9.9 + Elementor 4.1.4):</strong> Website menggunakan tumpukan plugin CMS yang menghasilkan struktur DOM sangat dalam, pemuatan berkas CSS dan JavaScript yang berlebihan, serta ketergantungan plugin pihak ketiga yang memperlambat kinerja pemuatan halaman pada perangkat seluler.</li>
    <li><strong>Inkonsistensi Navigasi &amp; Redundansi Menu:</strong> Terdapat duplikasi menu navigasi utama. Menu "Automation" ditampilkan dua kali, yaitu sebagai menu tingkat atas mandiri dan sekaligus sebagai sub-menu di bawah kategori "Products".</li>
    <li><strong>Ketiadaan Saluran Konversi B2B (RFQ):</strong> Calon mitra industri tidak disediakan formulir Request for Quotation (RFQ) yang terstruktur. Calon klien hanya disajikan teks kontak umum dan tautan WhatsApp tanpa pelacakan konteks kebutuhan.</li>
    <li><strong>Ketiadaan Modul Karir &amp; Portal HRD:</strong> Sebagai pabrik berteknologi tinggi di Batam yang membutuhkan tenaga kerja teknis terampil secara berkelanjutan, website lama sama sekali tidak memiliki modul publikasi lowongan kerja maupun portal rekrutmen internal.</li>
    <li><strong>Keterbatasan Multi-Bahasa:</strong> Konten disajikan secara parsial dalam Bahasa Inggris tanpa mekanisme peralihan bahasa yang bersih ke Bahasa Indonesia untuk pasar dan pelamar domestik.</li>
  </ul>

  <h2>1.3 Matriks Penilaian Kuantitatif Kondisi Lama</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Dimensi Evaluasi</th>
        <th style="width: 15%;">Skor (1-10)</th>
        <th style="width: 60%;">Catatan Penilaian Saya</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Desain Visual &amp; UI</td>
        <td>4.5 / 10</td>
        <td>Tampilan generik khas template WordPress lama, tata warna kurang tegas, hierarki visual lemah.</td>
      </tr>
      <tr>
        <td>Arsitektur Informasi</td>
        <td>5.5 / 10</td>
        <td>Duplikasi navigasi Automation, struktur produk kurang sistematis bagi pembeli B2B.</td>
      </tr>
      <tr>
        <td>User Experience (UX)</td>
        <td>4.0 / 10</td>
        <td>Hero slider statis tanpa pesan nilai yang tegas, tidak ada animasi interaktif atau umpan balik pengguna.</td>
      </tr>
      <tr>
        <td>Konten &amp; Messaging</td>
        <td>5.0 / 10</td>
        <td>Penjelasan robotik masih umum, belum menonjolkan sertifikasi mutu IATF 16949 dan keunggulan tarif 0% Batam FTZ.</td>
      </tr>
      <tr>
        <td>Performa Teknis</td>
        <td>5.0 / 10</td>
        <td>Beban script Elementor berat, ketergantungan cache LiteSpeed, waktu render awal lambat.</td>
      </tr>
      <tr>
        <td>Kesesuaian Strategis B2B</td>
        <td>3.5 / 10</td>
        <td>Tidak ada formulir RFQ terintegrasi, tidak ada modul karir perusahaan, tidak ada portal manajemen admin.</td>
      </tr>
      <tr>
        <th>Rata-Rata Keseluruhan</th>
        <th>4.6 / 10</th>
        <th>Kategori: Memerlukan Rekayasa Ulang Menyeluruh (Major Modernization)</th>
      </tr>
    </tbody>
  </table>

  <h2>1.4 Saran &amp; Rekomendasi Solusi yang Saya Ambil</h2>
  <p>
    Berdasarkan temuan di atas, saya mengambil keputusan strategis untuk tidak mempertahankan CMS WordPress lama, melainkan membangun kembali platform digital ini menggunakan arsitektur Decoupled Fullstack Application:
  </p>
  <ol>
    <li><strong>Membangun Frontend Modern (React.js + Vite):</strong> Mengganti tampilan CMS dengan Single Page Application yang ringan, responsif, dan bebas bloatware dengan waktu loading di bawah 1.5 detik.</li>
    <li><strong>Membangun Backend REST API Independen (Node.js + Express.js):</strong> Mengembangkan API terpusat yang aman, cepat, dan modular untuk mengelola data operasional dan konten publik.</li>
    <li><strong>Merancang Database Relasional Terstruktur (MySQL):</strong> Menerapkan skema database relasional 3NF yang mendukung integritas data referensial, audit trail aktivitas, dan pencatatan telemetri.</li>
    <li><strong>Menyusun Modul Karir Terpadu &amp; Portal HRD:</strong> Menyediakan halaman pencarian lowongan kerja publik beserta formulir lamaran terintegrasi, serta dasbor manajemen lowongan terproteksi JWT untuk tim HRD internal.</li>
    <li><strong>Menerapkan Dukungan Bilingual End-to-End:</strong> Mendukung Bahasa Indonesia dan Bahasa Inggris secara penuh baik pada antarmuka frontend maupun penyimpanan data di database.</li>
    <li><strong>Mengintegrasikan Sistem RFQ &amp; WhatsApp Telemetry:</strong> Membangun formulir permintaan penawaran harga industri yang langsung mencatat log telemetri dan memfasilitasi komunikasi instan melalui WhatsApp.</li>
  </ol>
`;

// ── BAB 2 CONTENT ─────────────────────────────────────────────────────────────
const bab2Content = `
  <h2>2.1 Arsitektur &amp; Standar Respons RESTful API</h2>
  <p>
    Saya merancang antarmuka Application Programming Interface (API) berbasis arsitektur RESTful yang memanfaatkan protokol HTTP dan format payload JSON. Seluruh endpoint mengembalikan struktur respons yang seragam untuk mempermudah integrasi dan penanganan kesalahan pada sisi klien:
  </p>
  <pre>
// Format Respons Sukses:
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": { ... },
  "meta": { "total": 12, "page": 1, "limit": 10 } // Opsional jika paginasi
}

// Format Respons Gagal / Error:
{
  "success": false,
  "message": "Deskripsi kesalahan yang terjadi",
  "errors": [ { "field": "email", "message": "Format email tidak valid" } ] // Opsional
}</pre>

  <h2>2.2 Mekanisme Keamanan, Autentikasi, &amp; Rate Limiting</h2>
  <p>Untuk menjaga keandalan dan keamanan data perusahaan, saya menerapkan standar keamanan berlapis:</p>
  <ul>
    <li><strong>JSON Web Token (JWT):</strong> Endpoint administratif dilindungi dengan verifikasi token JWT melalui header HTTP <code>Authorization: Bearer [token]</code>. Token memiliki masa berlaku terbatas dan diverifikasi oleh middleware <code>verifyToken</code>.</li>
    <li><strong>Role-Based Access Control (RBAC):</strong> Sistem membatasi hak akses pengguna ke dalam tiga tingkatan melalui middleware <code>restrictTo(...)</code>:
      <ul>
        <li><code>administrator</code>: Hak akses penuh ke seluruh modul, pengaturan sistem, dan manajemen user.</li>
        <li><code>hrd</code>: Mengelola lowongan kerja, data pelamar, konten perusahaan, dan akun staf.</li>
        <li><code>staff</code>: Mengelola operasional entri konten website publik (read, create, update terbatas).</li>
      </ul>
    </li>
    <li><strong>Rate Limiting:</strong> Saya memasang limitasi permintaan menggunakan <code>express-rate-limit</code> guna menangkal serangan brute-force dan Denial of Service (DoS):
      <ul>
        <li><code>apiLimiter</code>: Maksimum 200 permintaan per jendela 15 menit untuk endpoint publik.</li>
        <li><code>authLimiter</code>: Maksimum 5 percobaan login gagal per 15 menit per alamat IP.</li>
        <li><code>rfqSubmissionLimiter</code>: Maksimum 10 pengiriman RFQ per 1 jam per alamat IP.</li>
      </ul>
    </li>
  </ul>

  <h2>2.3 Katalog Endpoint Publik (Read-Only &amp; Interaksi Klien)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 12%;">Method</th>
        <th style="width: 33%;">Endpoint URL</th>
        <th style="width: 55%;">Deskripsi Fungsi &amp; Parameter</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/company</code></td>
        <td>Mengambil data profil perusahaan, visi, misi, deskripsi bilingual, dan tautan gambar banner.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/core-values</code></td>
        <td>Mengambil daftar 4 pilar nilai inti perusahaan (SMT Precision, IATF 16949, Smart Jigs, FTZ).</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/contact</code></td>
        <td>Mengambil informasi kontak resmi recruitment dan perusahaan (email, alamat, telepon, media sosial).</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/trade-destinations</code></td>
        <td>Mengambil data hub ekspor logistik Batam FTZ (Singapore, USA, Japan, Europe, China).</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/site-settings</code></td>
        <td>Mengambil konfigurasi visual situs (logo URL, favicon, nomor telepon darurat, status operasional).</td>
      </tr>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/telemetry/visit</code></td>
        <td>Mencatat log kunjungan pengunjung secara anonim untuk statistik performa antarmuka.</td>
      </tr>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/rfq</code></td>
        <td>Menerima pengiriman formulir RFQ dari calon klien industri. Memeriksa validitas email dan nomor telepon.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/job-categories</code></td>
        <td>Mengambil daftar kategori divisi pekerjaan yang memiliki status aktif.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/jobs</code></td>
        <td>Mengambil daftar lowongan kerja berstatus 'published' dengan query params: category, type, search, page.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/jobs/:id</code></td>
        <td>Mengambil detail lengkap lowongan kerja (tanggung jawab, persyaratan, batas waktu lamaran).</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/benefits</code></td>
        <td>Mengambil daftar fasilitas dan kompensasi kerja yang ditawarkan kepada karyawan.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/programs</code></td>
        <td>Mengambil program pembinaan karir (Internship/Magang, Management Trainee, On-the-Job Training).</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/programs/:slugOrId</code></td>
        <td>Mengambil detail spesifik program magang atau pelatihan berdasarkan slug URL atau ID.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/faqs</code></td>
        <td>Mengambil daftar pertanyaan yang sering diajukan (FAQ) seputar proses rekrutmen.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/gallery</code></td>
        <td>Mengambil galeri dokumentasi foto kegiatan fasilitas kerja, perakitan, dan lingkungan pabrik.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/products</code></td>
        <td>Mengambil katalog 12 produk elektronik manufaktur GPT dengan filter parameter category.</td>
      </tr>
    </tbody>
  </table>

  <h2>2.4 Katalog Endpoint Administratif (Protected Admin Routes)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 12%;">Method</th>
        <th style="width: 33%;">Endpoint URL</th>
        <th style="width: 25%;">Role Diizinkan</th>
        <th style="width: 30%;">Keterangan Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/admin/auth/login</code></td>
        <td>Publik (Rate Limited)</td>
        <td>Autentikasi admin; mengembalikan token JWT dan profil.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/admin/auth/me</code></td>
        <td>Semua Role Terdaftar</td>
        <td>Verifikasi validitas token sesi dan identitas user.</td>
      </tr>
      <tr>
        <td><code>PUT</code></td>
        <td><code>/api/admin/auth/change-password</code></td>
        <td>Semua Role Terdaftar</td>
        <td>Mengganti password akun user aktif setelah validasi lama.</td>
      </tr>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/admin/translate</code></td>
        <td>administrator, hrd, staff</td>
        <td>Mesin bantu terjemahan otomatis konten ID ke EN.</td>
      </tr>
      <tr>
        <td><code>GET / POST</code></td>
        <td><code>/api/admin/users</code></td>
        <td>administrator, hrd</td>
        <td>Melihat daftar user dan mendaftarkan akun internal baru.</td>
      </tr>
      <tr>
        <td><code>PUT / DELETE</code></td>
        <td><code>/api/admin/users/:id</code></td>
        <td>administrator, hrd</td>
        <td>Memperbarui role/status user atau menghapus user.</td>
      </tr>
      <tr>
        <td><code>PUT</code></td>
        <td><code>/api/admin/company</code></td>
        <td>administrator, hrd, staff</td>
        <td>Memperbarui profil perusahaan dan unggah banner utama.</td>
      </tr>
      <tr>
        <td><code>PUT</code></td>
        <td><code>/api/admin/contact</code></td>
        <td>administrator, hrd, staff</td>
        <td>Memperbarui kontak, tautan sosial media, dan WhatsApp.</td>
      </tr>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/admin/upload</code></td>
        <td>administrator, hrd, staff</td>
        <td>Unggah berkas gambar multipart dengan pembersihan berkas lama.</td>
      </tr>
      <tr>
        <td><code>GET / POST</code></td>
        <td><code>/api/admin/jobs</code></td>
        <td>administrator, hrd, staff</td>
        <td>Mengambil semua status lowongan dan membuat lowongan baru.</td>
      </tr>
      <tr>
        <td><code>PUT / DELETE</code></td>
        <td><code>/api/admin/jobs/:id</code></td>
        <td>administrator, hrd, staff</td>
        <td>Memperbarui kualifikasi atau menghapus lowongan.</td>
      </tr>
      <tr>
        <td><code>CRUD</code></td>
        <td><code>/api/admin/products</code></td>
        <td>administrator, hrd, staff</td>
        <td>Manajemen spesifikasi produk otomasi dan headunit.</td>
      </tr>
      <tr>
        <td><code>CRUD</code></td>
        <td><code>/api/admin/benefits</code></td>
        <td>administrator, hrd, staff</td>
        <td>Manajemen data fasilitas benefit kerja.</td>
      </tr>
      <tr>
        <td><code>CRUD</code></td>
        <td><code>/api/admin/programs</code></td>
        <td>administrator, hrd, staff</td>
        <td>Manajemen informasi program magang dan pelatihan.</td>
      </tr>
      <tr>
        <td><code>CRUD</code></td>
        <td><code>/api/admin/faqs</code></td>
        <td>administrator, hrd, staff</td>
        <td>Manajemen daftar pertanyaan tanya-jawab rekrutmen.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/admin/activity-logs</code></td>
        <td>administrator, hrd</td>
        <td>Audit trail rekaman aktivitas modifikasi data oleh user.</td>
      </tr>
    </tbody>
  </table>
`;

// ── BAB 3 CONTENT ─────────────────────────────────────────────────────────────
const bab3Content = `
  <h2>3.1 Alur Pengguna Publik (Visitor, Industrial Client, &amp; Job Seeker)</h2>
  <p>
    Saya merancang alur interaksi pengguna publik agar intuitif, informatif, dan memiliki hierarki yang jelas sesuai dengan target audiens perusahaan:
  </p>
  <pre>
[ Pengunjung Membuka Website ]
             |
             v
[ Inisialisasi Aplikasi React ] ---&gt; [ Cek LocalStorage Bahasa ] ---&gt; Terapkan ID atau EN
             |
             |---&gt; [ Menu Home ] -------&gt; Tinjau Profil Singkat, Keunggulan FTZ, &amp; Metrik Industri
             |
             |---&gt; [ Menu About ] ------&gt; Eksplorasi Visi-Misi, Sejarah, Filosofi, Fasilitas SMT
             |
             |---&gt; [ Menu Automation ] -&gt; Inspeksi Robot Welding, Handling, &amp; Cutting (Model 3D)
             |                                   |
             |                                   v
             |                        [ Tombol Konsultasi Teknis ] ---&gt; [ WhatsApp Engineering ]
             |
             |---&gt; [ Menu Products ] ---&gt; Filter Kategori (Headunit, Audio DSP, Dashcam, SMT EMS)
             |                                   |
             |                                   v
             |                        [ Klik Detail / Request RFQ ] --&gt; [ Buka Modal Formulir RFQ ]
             |                                                                   |
             |                                                                   v
             |                                                        [ Kirim RFQ ke Backend API ]
             |
             +---&gt; [ Menu Career ] -----&gt; Filter Lowongan (FullTime, Magang, Kontrak)
                                                 |
                                                 v
                                      [ Pilih Lowongan Pekerjaan ]
                                                 |
                                                 v
                                      [ Baca Persyaratan &amp; Benefit ]
                                                 |
                                                 v
                                      [ Klik 'Apply Now' ] ---&gt; Pengalihan ke Google Form Rekrutmen</pre>

  <h2>3.2 Alur Pengguna Internal / Administratif (Admin &amp; HRD Portal)</h2>
  <p>
    Alur kerja internal dirancang untuk memudahkan staf HRD dan administrator dalam memelihara konten website tanpa memerlukan bantuan teknis pemrograman:
  </p>
  <pre>
[ Admin Mengakses /admin/login ]
             |
             v
[ Form Input: Username &amp; Password ] ---&gt; [ Submit via POST /api/admin/auth/login ]
                                                        |
                                                        v
                                           [ Backend Verifikasi Kredensial ]
                                                        |
                                    +-------------------+-------------------+
                                    | Gagal                                 | Sukses
                                    v                                       v
                       [ Error: Kredensial Salah ]             [ Terbitkan Token JWT &amp; Profil ]
                                                                            |
                                                                            v
                                                               [ Simpan di State / LocalStorage ]
                                                                            |
                                                                            v
                                                               [ Render AdminDashboard Layout ]
                                                                            |
                          +-------------------------+-----------------------+-------------------------+
                          v                         v                                                 v
                [ Kelola Lowongan ]       [ Kelola Konten &amp; Media ]                               [ Manajemen User ]
                          |                         |                                                 |
                          v                         v                                                 v
               - Buat Lowongan Baru      - Update Visi Misi Perusahaan                            - Tambah Staf HRD Baru
               - Ubah Status (Draft/     - Edit Kontak &amp; Alamat                                   - Reset Password Akun
                 Published/Closed)       - Unggah Gambar Galeri Baru                              - Nonaktifkan User
               - Atur Tautan Form        - Edit Spesifikasi Produk                                  (Khusus Admin)
                          |                         |                                                 |
                          +-------------------------+-------------------------------------------------+
                                                    |
                                                    v
                                     [ Catat Log ke tabel activity_logs ]
                                                    |
                                                    v
                                  [ Perubahan Tampil Instan di Publik ]</pre>

  <h2>3.3 Siklus Hidup Permintaan HTTP (HTTP Request &amp; Middleware Lifecycle)</h2>
  <p>
    Setiap transaksi data antara antarmuka React dan server Express melalui tahapan pemrosesan sistematis sebagai berikut:
  </p>
  <ol>
    <li><strong>Client Dispatch:</strong> Antarmuka frontend mengirimkan permintaan asinkron (menggunakan Axios atau Fetch API) dengan payload JSON atau Form-Data multipart.</li>
    <li><strong>Security &amp; Rate Limiter:</strong> Permintaan masuk disambut oleh middleware keamanan <code>helmet()</code>, kebijakan CORS, dan rate limiter IP. Permintaan yang melampaui ambang batas langsung ditolak dengan kode status HTTP 429.</li>
    <li><strong>Authentication Guard:</strong> Pada rute terproteksi, <code>verifyToken</code> mengekstrak token Bearer dari header. Jika token valid, objek user didekodekan dan disimpan di <code>req.user</code>. Jika tidak valid atau kedaluwarsa, server mengembalikan status HTTP 401.</li>
    <li><strong>Authorization Filter:</strong> Middleware <code>restrictTo(roles)</code> mencocokkan role user pada <code>req.user.role</code>. Akses ditolak dengan status HTTP 403 jika role tidak memenuhi wewenang.</li>
    <li><strong>Payload Validation:</strong> Skema validasi <code>express-validator</code> memeriksa tipe data, panjang string, dan pola regex. Jika ada anomali, middleware <code>validate</code> memutus eksekusi dan mengembalikan daftar rincian error dengan status HTTP 400.</li>
    <li><strong>Controller Execution:</strong> Controller memanggil koneksi pool MySQL, menjalankan query SQL berparameter (Prepared Statements), memproses transformasi bilingual, dan menyusun objek data.</li>
    <li><strong>Centralized Error Handling:</strong> Apabila terjadi pengecualian (runtime exception atau kendala database), error diteruskan ke middleware <code>errorHandler</code> untuk dicatat ke log server dan dikembalikan kepada klien dalam format JSON yang aman tanpa membocorkan kredensial sistem.</li>
  </ol>
`;

// ── BAB 4 CONTENT ─────────────────────────────────────────────────────────────
const bab4Content = `
  <h2>4.1 Pemilihan Database Engine &amp; Karakteristik Teknis</h2>
  <p>
    Saya memilih <strong>MySQL (InnoDB Engine)</strong> sebagai sistem manajemen basis data relasional utama. Pilihan ini didasarkan pada kepatuhan penuh terhadap prinsip ACID (Atomicity, Consistency, Isolation, Durability), dukungan native Foreign Key Constraints untuk menjaga integritas data, serta efisiensi indexing B-Tree yang sangat handal untuk pembacaan katalog produk dan lowongan kerja. Seluruh tabel menggunakan konfigurasi character set <code>utf8mb4</code> dan collation <code>utf8mb4_unicode_ci</code> guna mendukung penyimpanan karakter multi-bahasa, simbol teknik otomotif, dan tanda baca internasional.
  </p>

  <h2>4.2 Skema Tabel &amp; Kamus Data (Data Dictionary)</h2>
  <p>Berikut adalah tabel-tabel utama yang saya rancang dan operasikan pada database <code>isa_career_hrd</code>:</p>

  <h3>A. Tabel <code>users</code> (Akun Manajemen Internal)</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 20%;">Nama Kolom</th>
        <th style="width: 20%;">Tipe Data</th>
        <th style="width: 15%;">Atribut</th>
        <th style="width: 45%;">Keterangan &amp; Nilai Standar</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>id</code></td>
        <td>INT</td>
        <td>PK, Auto Increment</td>
        <td>Identifikator unik akun pengguna internal.</td>
      </tr>
      <tr>
        <td><code>name</code></td>
        <td>VARCHAR(100)</td>
        <td>NOT NULL</td>
        <td>Nama lengkap pengguna / staf administrasi.</td>
      </tr>
      <tr>
        <td><code>username</code></td>
        <td>VARCHAR(50)</td>
        <td>NOT NULL, UNIQUE</td>
        <td>Username untuk otentikasi login sistem.</td>
      </tr>
      <tr>
        <td><code>email</code></td>
        <td>VARCHAR(100)</td>
        <td>NOT NULL, UNIQUE</td>
        <td>Alamat email resmi untuk notifikasi dan audit.</td>
      </tr>
      <tr>
        <td><code>password</code></td>
        <td>VARCHAR(255)</td>
        <td>NOT NULL</td>
        <td>Hash kata sandi terenkripsi menggunakan algoritma bcrypt (salt rounds: 10).</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td>ENUM</td>
        <td>NOT NULL</td>
        <td>Tingkat akses: 'administrator', 'hrd', 'staff'.</td>
      </tr>
      <tr>
        <td><code>status</code></td>
        <td>ENUM</td>
        <td>DEFAULT 'active'</td>
        <td>Status akun: 'active' atau 'inactive'.</td>
      </tr>
      <tr>
        <td><code>created_at / updated_at</code></td>
        <td>TIMESTAMP</td>
        <td>CURRENT_TIMESTAMP</td>
        <td>Waktu pembuatan akun dan pembaruan terakhir.</td>
      </tr>
    </tbody>
  </table>

  <h3>B. Tabel <code>job_vacancies</code> (Daftar Lowongan Kerja)</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 20%;">Nama Kolom</th>
        <th style="width: 20%;">Tipe Data</th>
        <th style="width: 15%;">Atribut</th>
        <th style="width: 45%;">Keterangan &amp; Relasi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>id</code></td>
        <td>INT</td>
        <td>PK, Auto Increment</td>
        <td>Identifikator unik lowongan.</td>
      </tr>
      <tr>
        <td><code>category_id</code></td>
        <td>INT</td>
        <td>FK, NOT NULL</td>
        <td>Relasi foreign key ke <code>job_categories(id)</code> (ON DELETE RESTRICT).</td>
      </tr>
      <tr>
        <td><code>title / title_en</code></td>
        <td>VARCHAR(150)</td>
        <td>NOT NULL / NULL</td>
        <td>Judul posisi pekerjaan versi Bahasa Indonesia dan Inggris.</td>
      </tr>
      <tr>
        <td><code>location</code></td>
        <td>VARCHAR(100)</td>
        <td>DEFAULT 'Batam'</td>
        <td>Penempatan kerja (contoh: Batam Free Trade Zone).</td>
      </tr>
      <tr>
        <td><code>employment_type</code></td>
        <td>ENUM</td>
        <td>NOT NULL</td>
        <td>Tipe kerja: 'FullTime', 'PartTime', 'Internship', 'Contract', 'OJT'.</td>
      </tr>
      <tr>
        <td><code>description / description_en</code></td>
        <td>TEXT</td>
        <td>NULL</td>
        <td>Uraian umum posisi dan ikhtisar divisi kerja.</td>
      </tr>
      <tr>
        <td><code>responsibilities / responsibilities_en</code></td>
        <td>TEXT</td>
        <td>NOT NULL</td>
        <td>Daftar rincian tugas dan tanggung jawab harian karyawan.</td>
      </tr>
      <tr>
        <td><code>requirements / requirements_en</code></td>
        <td>TEXT</td>
        <td>NOT NULL</td>
        <td>Syarat kualifikasi teknis, latar pendidikan, dan pengalaman.</td>
      </tr>
      <tr>
        <td><code>form_url</code></td>
        <td>VARCHAR(500)</td>
        <td>NULL</td>
        <td>Tautan formulir pendaftaran daring (Google Form / Portal Seleksi).</td>
      </tr>
      <tr>
        <td><code>status</code></td>
        <td>ENUM</td>
        <td>DEFAULT 'draft'</td>
        <td>Status siklus lowongan: 'draft', 'published', 'closed'.</td>
      </tr>
      <tr>
        <td><code>created_by</code></td>
        <td>INT</td>
        <td>FK, NULL</td>
        <td>Relasi foreign key ke <code>users(id)</code> untuk audit pembuat data.</td>
      </tr>
    </tbody>
  </table>

  <h3>C. Tabel <code>products</code> (Katalog Elektronik &amp; Robotik Otomasi)</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 20%;">Nama Kolom</th>
        <th style="width: 20%;">Tipe Data</th>
        <th style="width: 15%;">Atribut</th>
        <th style="width: 45%;">Keterangan &amp; Format Data</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>id</code></td>
        <td>INT</td>
        <td>PK, Auto Increment</td>
        <td>Identifikator unik produk.</td>
      </tr>
      <tr>
        <td><code>model_code</code></td>
        <td>VARCHAR(100)</td>
        <td>NOT NULL</td>
        <td>Nomor model manufaktur (contoh: GPT-HU9800 PRO, GPT-ROBOT-WELD).</td>
      </tr>
      <tr>
        <td><code>category</code></td>
        <td>ENUM</td>
        <td>NOT NULL</td>
        <td>Kategori lini: 'headunit', 'audio', 'dashcam', 'automation', 'ems'.</td>
      </tr>
      <tr>
        <td><code>title_id / title_en</code></td>
        <td>TEXT</td>
        <td>NOT NULL</td>
        <td>Nama komersial produk dalam bahasa Indonesia dan Inggris.</td>
      </tr>
      <tr>
        <td><code>short_desc_id / short_desc_en</code></td>
        <td>TEXT</td>
        <td>NULL</td>
        <td>Ringkasan fitur unggulan produk untuk kartu ringkasan.</td>
      </tr>
      <tr>
        <td><code>specs</code></td>
        <td>LONGTEXT</td>
        <td>NULL</td>
        <td>JSON array berisi 4 spesifikasi ringkas [{"label": "...", "value": "..."}].</td>
      </tr>
      <tr>
        <td><code>full_specs</code></td>
        <td>LONGTEXT</td>
        <td>NULL</td>
        <td>JSON object spesifikasi teknik lengkap (tegangan, suhu kerja, DAC, sertifikasi).</td>
      </tr>
      <tr>
        <td><code>diagram_type</code></td>
        <td>VARCHAR(50)</td>
        <td>DEFAULT 'infotainment'</td>
        <td>Penentu diagram arsitektur visual pada antarmuka frontend.</td>
      </tr>
      <tr>
        <td><code>status / sort_order</code></td>
        <td>TINYINT(1) / INT</td>
        <td>DEFAULT 1 / 0</td>
        <td>Status aktif dan urutan prioritas penampilan produk.</td>
      </tr>
    </tbody>
  </table>

  <h2>4.3 Entitas Pendukung &amp; Singleton Pattern</h2>
  <p>Untuk kebutuhan master data lainnya, saya merancang beberapa tabel pendukung:</p>
  <ul>
    <li><code>company_profile</code> &amp; <code>contact_recruitment</code>: Menerapkan <strong>Singleton Pattern</strong> (hanya menyimpan 1 baris rekaman tunggal ID 1). Endpoint hanya melayani pembacaan (GET) dan pengkinian (PUT), mencegah duplikasi data profil.</li>
    <li><code>core_values</code>: Menyimpan 4 pilar filosofi kerja dengan dukungan bilingual dan penanda ikon visual.</li>
    <li><code>gallery</code>: Menyimpan dokumentasi visual kegiatan operasional pabrik dengan referensi user pengunggah.</li>
    <li><code>benefits</code> &amp; <code>programs</code>: Mengelola informasi fasilitas tunjangan kerja dan program magang vokasi di Batam.</li>
    <li><code>activity_logs</code>: Menyimpan rekam jejak setiap aksi mutasi data (CREATE, UPDATE, DELETE, LOGIN) untuk kebutuhan audit internal kepatuhan ISO 9001.</li>
  </ul>
`;

// ── BAB 5 CONTENT ─────────────────────────────────────────────────────────────
const bab5Content = `
  <h2>5.1 Pemilihan Teknologi &amp; Filosofi Antarmuka</h2>
  <p>
    Pada sisi antarmuka, saya mengimplementasikan Single Page Application (SPA) berbasis <strong>React 18 / 19</strong> yang dikompilasi menggunakan <strong>Vite</strong>. Pendekatan ini memberikan pengalaman penjelajahan yang sangat cepat tanpa reload halaman (zero full-page refreshes). Berbeda dengan template WordPress lama yang sarat dependensi CSS berat, saya merancang sistem styling kustom berbasis <strong>Vanilla CSS murni dengan CSS Custom Properties (Design Tokens)</strong>. Pendekatan ini menjamin fleksibilitas penuh, performa rendering 60 FPS, ukuran bundle akhir yang sangat kecil, serta tampilan visual modern yang elegan.
  </p>

  <h2>5.2 Routing Dinamis &amp; Code Splitting (Lazy Loading)</h2>
  <p>
    Saya menggunakan <code>createBrowserRouter</code> dari <code>react-router-dom</code> dengan pemisahan bundel kode asinkron (Code Splitting) melalui <code>React.lazy()</code> dan <code>Suspense</code>. Halaman hanya diunduh saat pengguna menavigasikannya, memangkas waktu muat awal secara signifikan:
  </p>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Rute Halaman (Path)</th>
        <th style="width: 30%;">Komponen Lazy</th>
        <th style="width: 45%;">Tujuan &amp; Konten yang Ditampilkan</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/</code></td>
        <td><code>HomePage.jsx</code></td>
        <td>Beranda utama, showcase keunggulan manufaktur, pilar otomasi, dan metrik industri.</td>
      </tr>
      <tr>
        <td><code>/about</code></td>
        <td><code>AboutPage.jsx</code></td>
        <td>Profil PT. GPT &amp; PT. ISA, visi-misi, sejarah perkembangan, dan fasilitas Batam FTZ.</td>
      </tr>
      <tr>
        <td><code>/automation</code></td>
        <td><code>AutomationPage.jsx</code></td>
        <td>Halaman khusus robotik industri (Welding, Handling, Cutting) dengan kanvas 3D interaktif.</td>
      </tr>
      <tr>
        <td><code>/products</code></td>
        <td><code>ProductsPage.jsx</code></td>
        <td>Katalog interaktif 12 produk elektronik, modal spesifikasi teknik, dan formulir pemesanan RFQ.</td>
      </tr>
      <tr>
        <td><code>/gallery</code></td>
        <td><code>GalleryPage.jsx</code></td>
        <td>Dokumentasi foto fasilitas perakitan SMT, ruang pengujian cleanroom, dan kegiatan tim.</td>
      </tr>
      <tr>
        <td><code>/career</code></td>
        <td><code>CareerPage.jsx</code></td>
        <td>Portal karir publik, pencarian posisi kerja, filter kategori divisi, dan tautan pendaftaran.</td>
      </tr>
      <tr>
        <td><code>/career/jobs/:id</code></td>
        <td><code>JobDetailPage.jsx</code></td>
        <td>Rincian spesifik posisi kerja, kualifikasi pelamar, tanggung jawab, dan tombol apply langsung.</td>
      </tr>
      <tr>
        <td><code>/career/benefits</code></td>
        <td><code>BenefitsPage.jsx</code></td>
        <td>Informasi tunjangan, fasilitas kesehatan, asuransi, dan fasilitas lingkungan kerja karyawan.</td>
      </tr>
      <tr>
        <td><code>/career/programs</code></td>
        <td><code>ProgramsPage.jsx</code></td>
        <td>Peluang magang bersertifikat, Management Trainee, dan vokasi On-the-Job Training.</td>
      </tr>
      <tr>
        <td><code>/faq</code></td>
        <td><code>FaqPage.jsx</code></td>
        <td>Akordeon tanya-jawab interaktif seputar seleksi rekrutmen dan tahapan wawancara.</td>
      </tr>
      <tr>
        <td><code>/contact</code></td>
        <td><code>ContactPage.jsx</code></td>
        <td>Alamat resmi pabrik Batam, peta lokasi, kontak email departemen, dan form inquiry cepat.</td>
      </tr>
      <tr>
        <td><code>/admin/login</code></td>
        <td><code>AdminLoginPage.jsx</code></td>
        <td>Gerbang masuk otentikasi tim HRD dan administrator sistem internal.</td>
      </tr>
      <tr>
        <td><code>/admin/*</code></td>
        <td><code>AdminDashboard.jsx</code></td>
        <td>Dasbor kendali terproteksi untuk mengelola seluruh data website publik secara dinamis.</td>
      </tr>
    </tbody>
  </table>

  <h2>5.3 Manajemen State Global &amp; Arsitektur Provider</h2>
  <p>Untuk mengelola data yang diakses lintas komponen, saya membangun 3 Context Provider utama:</p>
  <ul>
    <li><strong>LanguageContext:</strong> Mengelola status bahasa aktif ('id' atau 'en'). Menyediakan fungsi <code>toggleLanguage()</code> dan kamus terjemahan untuk seluruh elemen UI statis. Pilihan bahasa pengguna disimpan secara persisten di <code>localStorage</code> sehingga tidak hilang saat tab ditutup.</li>
    <li><strong>AdminAuthContext:</strong> Mengelola sesi login administrator, penyimpanan token JWT, parsing payload profil pengguna, serta fungsi otomatisasi pembersihan sesi (auto-logout) saat token dinyatakan kedaluwarsa oleh backend.</li>
    <li><strong>BrandingContext:</strong> Mengambil konfigurasi visual terkini dari backend (logo perusahaan, nama instansi, tautan favicon dinamis, dan kontak darurat) dan mendistribusikannya ke Navbar serta Footer secara real-time.</li>
  </ul>

  <h2>5.4 Komponen Kunci Khusus (Inovasi Fitur)</h2>
  <ol>
    <li><strong>RobotCanvas3D (Halaman Automation):</strong> Komponen interaktif yang merender model representasi lengan robot multi-sumbu secara dinamis menggunakan HTML5 Canvas, memberikan kesan teknologi tinggi (Industry 4.0) kepada calon klien industri.</li>
    <li><strong>Interactive RFQ Modal:</strong> Kotak dialog penawaran harga terintegrasi yang menghitung estimasi kebutuhan perakitan dan langsung mengirimkan draf inquiry ke server dan WhatsApp tim sales engineering.</li>
    <li><strong>WhatsApp Floating Action Button:</strong> Tombol melayang cerdas yang menyertakan pelacakan halaman asal pengunjung (telemetri) untuk memudahkan tim sales mengetahui produk apa yang sedang dilihat calon pembeli saat menghubungi WhatsApp.</li>
  </ol>
`;

// ── BAB 6 CONTENT ─────────────────────────────────────────────────────────────
const bab6Content = `
  <h2>6.1 Struktur Direktori Proyek (Monorepo Workspace)</h2>
  <p>
    Saya menata seluruh berkas proyek dalam struktur direktori yang bersih dan terisolasi antara logika server dan logika klien di dalam workspace <code>website_intersis</code>:
  </p>
  <pre>
website_intersis/
|-- backend/                  # Server-side REST API (Node.js &amp; Express)
|   |-- src/
|   |   |-- config/           # Konfigurasi pool koneksi database MySQL (db.js)
|   |   |-- controllers/      # Logika pemrosesan bisnis (Admin &amp; Public controllers)
|   |   |-- middlewares/      # Interceptor HTTP (Auth, ErrorHandler, RateLimiter, Upload)
|   |   |-- routes/           # Pemetaan rute URL ke controller (Admin &amp; Public routes)
|   |   |-- scripts/          # Skrip bantu pemeliharaan dan seeding bilingual
|   |   |-- seeders/          # Skrip inisialisasi data dummy dan data master awal
|   |   |-- utils/            # Fungsi utilitas (Response formatter, Slugify, FileCleanup)
|   |   |-- validators/       # Aturan validasi payload input (express-validator)
|   |   +-- server.js         # Entry point server Express utama
|   |-- uploads/              # Penyimpanan lokal aset media berkas terunggah
|   |-- .env                  # Variabel lingkungan server (Port, DB credentials, JWT Secret)
|   +-- package.json          # Dependensi pustaka backend
|
|-- frontend/                 # Client-side SPA (React.js &amp; Vite)
|   |-- src/
|   |   |-- assets/           # Berkas statis gambar, logo dummy, dan diagram
|   |   |-- components/       # Komponen antarmuka atomik (Layout, Navbar, Footer, Automation)
|   |   |-- context/          # State global (LanguageContext, AdminAuthContext, BrandingContext)
|   |   |-- data/             # Data statis awal dan fallback data katalog produk
|   |   |-- hooks/            # Custom React Hooks pembantu interaksi data
|   |   |-- locales/          # Kamus terjemahan teks antarmuka (Indonesian &amp; English)
|   |   |-- pages/            # Komponen halaman (Public Pages &amp; Admin Portal Pages)
|   |   |-- utils/            # Helper format mata uang, tanggal, dan sanitasi teks
|   |   |-- App.jsx           # Registrasi routing browser dan Suspense fallback
|   |   |-- index.css         # Design system, variabel token, dan utilitas global
|   |   +-- main.jsx          # Titik masuk rendering React ke DOM
|   |-- public/               # Aset publik langsung (favicon, robots.txt)
|   |-- index.html            # Berkas HTML utama aplikasi SPA
|   |-- vite.config.js        # Konfigurasi bundling Vite dan reverse proxy dev server
|   +-- package.json          # Dependensi pustaka frontend
|
+-- database/                 # Berkas skrip DDL SQL, relasi ERD, dan dokumentasi skema</pre>

  <h2>6.2 Pola Perancangan (Design Patterns) yang Diterapkan</h2>
  <ul>
    <li><strong>Separation of Concerns (SoC):</strong> Setiap direktori memiliki tanggung jawab tunggal. Lapisan rute (Routes) tidak memuat query database; lapisan kontrol (Controller) tidak mendefinisikan aturan parsing regex (ditangani Validator); dan lapisan tampilan (React Pages) murni menangani antarmuka pengguna.</li>
    <li><strong>Layered Controller-Service Architecture:</strong> Controller menerima permintaan, memvalidasi parameter, mengeksekusi operasi basis data melalui abstraksi koneksi terpusat, dan mengembalikan respons terstandarisasi.</li>
    <li><strong>Singleton Configuration Pattern:</strong> Objek koneksi basis data pada <code>config/db.js</code> dibuat sekali dan digunakan kembali di seluruh aplikasi melalui mekanisme pooling, mencegah lonjakan konsumsi memori server.</li>
    <li><strong>Fail-Safe Fallback:</strong> Pada komponen frontend publik, jika server backend mengalami latensi atau gangguan koneksi, antarmuka tetap menyajikan data cadangan terverifikasi dari modul <code>data/</code> sehingga pengguna tidak pernah melihat layar putih kosong.</li>
  </ul>
`;

// ── BAB 7 CONTENT ─────────────────────────────────────────────────────────────
const bab7Content = `
  <h2>7.1 Fungsi Kunci Backend Controllers</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Nama Fungsi / Method</th>
        <th style="width: 30%;">Berkas Lokasi</th>
        <th style="width: 45%;">Tugas Logika &amp; Alur Eksekusi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>login()</code></td>
        <td><code>controllers/admin/authController.js</code></td>
        <td>Mencari username di database, membandingkan password via <code>bcrypt.compare()</code>, menerbitkan token JWT bertandatangan aman, dan mencatat log login.</td>
      </tr>
      <tr>
        <td><code>getJobVacancies()</code></td>
        <td><code>controllers/public/publicJobController.js</code></td>
        <td>Menjalankan query SQL dengan filter dinamis (kategori, tipe kerja, kata kunci), menghitung total paginasi, dan menyesuaikan bahasa respon berdasarkan header klien.</td>
      </tr>
      <tr>
        <td><code>createJob() / updateJob()</code></td>
        <td><code>controllers/admin/adminJobVacancyController.js</code></td>
        <td>Menyimpan atau memperbarui data lowongan. Menerapkan transaksi data, validasi tautan form pendaftaran, dan mencatat log mutasi ke tabel activity_logs.</td>
      </tr>
      <tr>
        <td><code>submitRfq()</code></td>
        <td><code>controllers/telemetryController.js</code></td>
        <td>Menerima formulir penawaran harga manufaktur, memeriksa batasan rate limiter, memvalidasi email, dan menyiapkan teks pesan ringkasan transaksi.</td>
      </tr>
      <tr>
        <td><code>translateContent()</code></td>
        <td><code>controllers/admin/translateController.js</code></td>
        <td>Mesin utilitas yang memproses teks Bahasa Indonesia menjadi draf terjemahan Bahasa Inggris untuk mempercepat kerja staf HRD saat menginput lowongan.</td>
      </tr>
      <tr>
        <td><code>getProducts()</code></td>
        <td><code>controllers/public/publicProductController.js</code></td>
        <td>Mengambil data 12 produk dari tabel products, mem-parsing kolom spesifikasi berformat JSON string menjadi objek JavaScript, dan mengurutkannya.</td>
      </tr>
    </tbody>
  </table>

  <h2>7.2 Middlewares &amp; Utilitas Keamanan</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Middleware / Helper</th>
        <th style="width: 30%;">Berkas Lokasi</th>
        <th style="width: 45%;">Mekanisme Kerja &amp; Fungsi Keamanan</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>verifyToken</code></td>
        <td><code>middlewares/authMiddleware.js</code></td>
        <td>Mengekstrak token Bearer dari header Authorization, mendekripsi via <code>jwt.verify()</code>, dan menyematkan payload user ke dalam <code>req.user</code>.</td>
      </tr>
      <tr>
        <td><code>restrictTo(...roles)</code></td>
        <td><code>middlewares/authMiddleware.js</code></td>
        <td>Mengecek apakah role user pada <code>req.user.role</code> terdaftar dalam parameter yang diizinkan. Mengembalikan 403 Forbidden jika tidak berwenang.</td>
      </tr>
      <tr>
        <td><code>errorHandler</code></td>
        <td><code>middlewares/errorHandler.js</code></td>
        <td>Menangkap seluruh error tak tertangani, mencatat rincian ke konsol internal, dan menyajikan pesan aman kepada klien.</td>
      </tr>
      <tr>
        <td><code>deleteFileIfLocal()</code></td>
        <td><code>utils/fileCleanup.js</code></td>
        <td>Menghapus berkas fisik lama di folder <code>uploads/</code> saat admin mengunggah berkas pengganti baru untuk mencegah pemborosan kapasitas harddisk server.</td>
      </tr>
      <tr>
        <td><code>upload.single()</code></td>
        <td><code>middlewares/uploadMiddleware.js</code></td>
        <td>Konfigurasi Multer untuk menangani berkas gambar dengan filter mime-type ketat (JPEG, PNG, WEBP) dan batas ukuran maksimal 5 Megabytes.</td>
      </tr>
    </tbody>
  </table>

  <h2>7.3 Custom Hooks &amp; State Management Frontend</h2>
  <ul>
    <li><strong><code>useLanguage()</code>:</strong> Mengembalikan nilai bahasa aktif saat ini (lang), fungsi pengubah bahasa (setLang), serta fungsi bantu terjemahan <code>t(key)</code> yang mengambil pasangan frasa dari berkas kamus <code>locales/</code>.</li>
    <li><strong><code>useAuth()</code>:</strong> Menyediakan data sesi akun admin (nama, email, role, token), status pengecekan otentikasi (isAuthenticated), serta fungsi <code>login(credentials)</code> dan <code>logout()</code>.</li>
    <li><strong><code>formatDate(dateString, lang)</code>:</strong> Mengubah format tanggal ISO dari database MySQL menjadi format bacaan formal manusia (contoh: "19 Oktober 2026" atau "October 19, 2026").</li>
  </ul>
`;

// ── BAB 8 CONTENT ─────────────────────────────────────────────────────────────
const bab8Content = `
  <h2>8.1 Katalog Berkas Kunci Direktori Backend</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 30%;">Path &amp; Nama Berkas</th>
        <th style="width: 70%;">Deskripsi Peran &amp; Tanggung Jawab Teknis</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>backend/src/server.js</code></td>
        <td>Titik masuk utama aplikasi Node.js. Menginisialisasi Express, mengaktifkan middleware keamanan (Helmet, CORS, Body Parser), menghubungkan rute publik dan admin, serta menangani error handler terpusat.</td>
      </tr>
      <tr>
        <td><code>backend/src/config/db.js</code></td>
        <td>Modul pool koneksi MySQL menggunakan <code>mysql2/promise</code>. Mengelola antrean koneksi, uji konektivitas awal, dan penanganan pemutusan jaringan database.</td>
      </tr>
      <tr>
        <td><code>backend/src/routes/publicRoutes.js</code></td>
        <td>Mendefinisikan 15 rute endpoint publik (profil perusahaan, produk, otomasi, lowongan kerja, form RFQ, telemetri) yang dapat diakses oleh publik tanpa otentikasi.</td>
      </tr>
      <tr>
        <td><code>backend/src/routes/adminRoutes.js</code></td>
        <td>Mendefinisikan seluruh rute terproteksi dashboard admin, menerapkan filter token JWT, pembatasan hak akses role, penanganan upload berkas, dan validator input.</td>
      </tr>
      <tr>
        <td><code>backend/src/middlewares/authMiddleware.js</code></td>
        <td>Berisi implementasi fungsi <code>verifyToken</code> dan <code>restrictTo</code> untuk pengamanan gerbang API administratif.</td>
      </tr>
      <tr>
        <td><code>backend/src/middlewares/rateLimiter.js</code></td>
        <td>Konfigurasi ambang batas permintaan IP untuk menangkal brute-force login dan spam formulir RFQ.</td>
      </tr>
      <tr>
        <td><code>backend/src/validators/contentValidators.js</code></td>
        <td>Aturan validasi field untuk modul profil perusahaan, kontak, nilai inti, produk, galeri, benefit, dan FAQ.</td>
      </tr>
      <tr>
        <td><code>backend/src/validators/jobVacancyValidator.js</code></td>
        <td>Aturan validasi ketat untuk pembuatan lowongan pekerjaan (kategori, format tipe kerja, deskripsi kualifikasi).</td>
      </tr>
      <tr>
        <td><code>backend/src/utils/fileCleanup.js</code></td>
        <td>Utilitas penghapusan berkas fisik lokal di server ketika ada pergantian aset gambar oleh admin.</td>
      </tr>
      <tr>
        <td><code>backend/.env</code></td>
        <td>Berkas konfigurasi variabel lingkungan yang memuat port server, nama database, kredensial pengguna MySQL, dan kunci rahasia enkripsi JWT.</td>
      </tr>
    </tbody>
  </table>

  <h2>8.2 Katalog Berkas Kunci Direktori Frontend</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 30%;">Path &amp; Nama Berkas</th>
        <th style="width: 70%;">Deskripsi Peran &amp; Tanggung Jawab Teknis</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>frontend/src/main.jsx</code></td>
        <td>Titik masuk kompilasi React. Me-mount elemen virtual root ke elemen DOM <code>#root</code> di <code>index.html</code>.</td>
      </tr>
      <tr>
        <td><code>frontend/src/App.jsx</code></td>
        <td>Konfigurasi router SPA (<code>createBrowserRouter</code>), pembungkusan context provider global, dan pemisahan modul lazy loading.</td>
      </tr>
      <tr>
        <td><code>frontend/src/index.css</code></td>
        <td>Desain sistem global aplikasi: mendefinisikan variabel warna korporat (Teal, Slate, Navy, Gray), tipografi modern, reset CSS, dan kelas utilitas flex/grid.</td>
      </tr>
      <tr>
        <td><code>frontend/src/pages/public/HomePage.jsx</code></td>
        <td>Halaman beranda utama dengan hero showcase, metrik kapasitas produksi pabrik Batam, dan cuplikan pilar robotik.</td>
      </tr>
      <tr>
        <td><code>frontend/src/pages/public/AutomationPage.jsx</code></td>
        <td>Halaman pameran teknologi otomasi robotik GPT (Welding, Handling, Cutting) lengkap dengan visual canvas 3D.</td>
      </tr>
      <tr>
        <td><code>frontend/src/pages/public/ProductsPage.jsx</code></td>
        <td>Katalog interaktif 12 produk elektronik manufaktur dengan modal popup spesifikasi teknis dan tombol order RFQ.</td>
      </tr>
      <tr>
        <td><code>frontend/src/pages/public/CareerPage.jsx</code></td>
        <td>Halaman pencarian karir dan lowongan kerja dengan filter kategori divisi dan kotak pencarian real-time.</td>
      </tr>
      <tr>
        <td><code>frontend/src/pages/admin/AdminDashboard.jsx</code></td>
        <td>Antarmuka dasbor manajemen internal terintegrasi untuk mengontrol seluruh konten website secara visual.</td>
      </tr>
      <tr>
        <td><code>frontend/src/components/layout/Navbar.jsx</code></td>
        <td>Komponen navigasi atas responsif, dilengkapi tombol pengalih bahasa bilingual (ID/EN) dan menu seluler.</td>
      </tr>
      <tr>
        <td><code>frontend/src/components/layout/Footer.jsx</code></td>
        <td>Bagian kaki website yang memuat informasi identitas PT. GPT, tautan navigasi cepat, dan hak cipta resmi.</td>
      </tr>
      <tr>
        <td><code>frontend/src/context/LanguageContext.jsx</code></td>
        <td>Pusat kendali bahasa antarmuka, menyediakan state aktif dan metode toggle bahasa dengan persistensi lokal.</td>
      </tr>
    </tbody>
  </table>
`;

// ── BAB 9 CONTENT ─────────────────────────────────────────────────────────────
const bab9Content = `
  <h2>9.1 Konvensi Penamaan (Naming Conventions)</h2>
  <p>
    Untuk menjaga konsistensi, keterbacaan, dan kemudahan kolaborasi jangka panjang, saya menetapkan aturan penamaan baku di seluruh repositori:
  </p>
  <ul>
    <li><strong>Variabel &amp; Fungsi JavaScript:</strong> Menggunakan format <code>camelCase</code>. Nama fungsi harus menggunakan kata kerja deskriptif yang mencerminkan tugasnya.<br>
      <em>Contoh:</em> <code>getJobVacancies</code>, <code>calculateTotalExperience</code>, <code>isTokenExpired</code>.
    </li>
    <li><strong>Komponen React (.jsx):</strong> Menggunakan format <code>PascalCase</code> sesuai standar resmi ekosistem React.<br>
      <em>Contoh:</em> <code>Navbar.jsx</code>, <code>JobCard.jsx</code>, <code>AutomationPage.jsx</code>, <code>RobotCanvas3D.jsx</code>.
    </li>
    <li><strong>Berkas Controller &amp; Helper:</strong> Menggunakan format <code>camelCase.js</code>.<br>
      <em>Contoh:</em> <code>publicJobController.js</code>, <code>authMiddleware.js</code>, <code>fileCleanup.js</code>.
    </li>
    <li><strong>Kolom &amp; Tabel Database MySQL:</strong> Menggunakan format <code>snake_case</code> dengan huruf kecil seluruhnya.<br>
      <em>Contoh:</em> <code>job_vacancies</code>, <code>category_id</code>, <code>employment_type</code>, <code>created_at</code>.
    </li>
    <li><strong>Variabel Lingkungan (Environment Variables):</strong> Menggunakan format <code>SCREAMING_SNAKE_CASE</code>.<br>
      <em>Contoh:</em> <code>PORT</code>, <code>DB_HOST</code>, <code>JWT_SECRET</code>, <code>NODE_ENV</code>.
    </li>
  </ul>

  <h2>9.2 Standar Penanganan Kesalahan (Error Handling Pattern)</h2>
  <p>
    Saya mewajibkan setiap operasi I/O asinkron (asynchronous database query atau file system access) dibungkus dalam blok kontrol <code>try...catch</code> dengan alur penanganan terpadu:
  </p>
  <pre>
// Standar Penulisan Controller Asinkron:
exports.getJobVacancyById = async (req, res, next) =&gt; {
  try {
    const { id } = req.params;
    
    // 1. Eksekusi query menggunakan prepared statement aman
    const [rows] = await db.query(
      'SELECT * FROM job_vacancies WHERE id = ? AND status = "published"',
      [id]
    );

    // 2. Evaluasi keberadaan data
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lowongan pekerjaan tidak ditemukan atau sudah ditutup.'
      });
    }

    // 3. Kembalikan data dengan status 200 OK
    return res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    // 4. Teruskan galat internal ke middleware terpusat
    next(error);
  }
};</pre>

  <h2>9.3 Standar Sanitasi Data &amp; Proteksi SQL Injection</h2>
  <p>
    Saya memberlakukan aturan mutlak bahwa <strong>tidak ada parameter masukan dari pengguna yang boleh langsung digabungkan (string concatenation) ke dalam perintah SQL</strong>. Seluruh query wajib menggunakan fitur <em>Prepared Statements</em> dengan placeholder tanda tanya (<code>?</code>) yang disediakan oleh pustaka <code>mysql2/promise</code>. Hal ini menjamin sistem 100% aman dari ancaman manipulasi SQL Injection.
  </p>

  <h2>9.4 Format Respons API Seragam (Standardized JSON Envelope)</h2>
  <p>
    Semua rute API wajib mengembalikan respons terbungkus (envelope) dengan properti boolean <code>success</code> di tingkat akar. Dengan aturan ini, komponen frontend dapat melakukan pengecekan kondisi secara elegan:
  </p>
  <pre>
// Pada sisi Frontend:
const response = await api.get('/jobs');
if (response.data.success) {
  setJobList(response.data.data);
} else {
  displayNotification(response.data.message);
}</pre>
`;

// ── BAB 10 CONTENT ────────────────────────────────────────────────────────────
const bab10Content = `
  <h2>10.1 Ringkasan Perbandingan Transformasi Sistem</h2>
  <p>
    Proyek rekayasa ulang ini telah berhasil mentransformasi website lama menjadi platform digital modern kelas industri:
  </p>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Aspek Perbandingan</th>
        <th style="width: 37%;">Kondisi Website Lama (WordPress CMS)</th>
        <th style="width: 38%;">Kondisi Website Baru (Fullstack Modern)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Arsitektur Sistem</td>
        <td>Monolitik WordPress 6.9.9 + Elementor 4.1.4 lambat.</td>
        <td>Decoupled React.js SPA + Express REST API + MySQL.</td>
      </tr>
      <tr>
        <td>Kecepatan Rendering</td>
        <td>Waktu muat &gt; 4 detik; DOM tree membengkak oleh plugin.</td>
        <td>Waktu muat &lt; 1.5 detik; bundling Vite ringan &amp; instan.</td>
      </tr>
      <tr>
        <td>Katalog Robotik</td>
        <td>Teks statis di sub-halaman tanpa interaktivitas.</td>
        <td>Showcase 3 Pilar Robotik lengkap dengan kanvas visual 3D.</td>
      </tr>
      <tr>
        <td>Katalog Produk Elektronik</td>
        <td>Gambar statis seadanya tanpa spesifikasi detail.</td>
        <td>12 Produk unggulan terinci (spesifikasi teknik &amp; sertifikasi).</td>
      </tr>
      <tr>
        <td>Modul Karir / HRD</td>
        <td><strong>Tidak ada sama sekali.</strong></td>
        <td>Portal karir publik + Dasbor HRD terproteksi JWT.</td>
      </tr>
      <tr>
        <td>Saluran Konversi (Leads)</td>
        <td>Kontak statis umum tanpa sistem penawaran harga.</td>
        <td>Formulir RFQ otomatis &amp; integrasi WhatsApp telemetri.</td>
      </tr>
      <tr>
        <td>Dukungan Bahasa</td>
        <td>Bahasa Inggris seadanya tanpa opsi Bahasa Indonesia.</td>
        <td>Sistem bilingual penuh (ID / EN) dari DB hingga UI.</td>
      </tr>
    </tbody>
  </table>

  <h2>10.2 Hasil Pengujian Fungsionalitas &amp; Kompatibilitas</h2>
  <p>Saya telah melakukan serangkaian pengujian terukur sebelum merilis sistem ke tahap akhir:</p>
  <ul>
    <li><strong>Pengujian Responsivitas Multi-Perangkat:</strong> Antarmuka diuji pada resolusi desktop lebar (1920x1080), laptop (1366x768), tablet iPad (768x1024), serta layar smartphone (iPhone &amp; Android 375px s.d. 414px). Seluruh elemen tata letak flexbox dan grid beradaptasi secara harmonis.</li>
    <li><strong>Pengujian Validasi &amp; Keamanan API:</strong> Pengujian endpoint melalui Postman Runner menunjukkan 100% permintaan berhasil sesuai status code yang diharapkan (200, 201, 400, 401, 403, 404, 429).</li>
    <li><strong>Pengujian Alur Rekrutmen:</strong> Simulasi pembukaan lowongan oleh HRD di dasbor admin langsung terbit secara real-time di halaman karir publik, dan tombol "Apply Now" berhasil mengarahkan pelamar ke formulir pendaftaran yang tepat.</li>
  </ul>

  <h2>10.3 Kesimpulan &amp; Rekomendasi Pemeliharaan Sistem</h2>
  <p>
    Secara keseluruhan, sistem website baru PT. Global Philsonic Technologies (GPT) di bawah naungan PT. Intersis Sejahtera Abadi (ISA) telah berhasil diselesaikan dengan mutu rekayasa perangkat lunak yang tinggi, andal, dan siap mendukung pertumbuhan bisnis perusahaan di kancah industri internasional.
  </p>
  <p>Untuk pemeliharaan jangka panjang, saya menyarankan beberapa langkah operasional berikut:</p>
  <ol>
    <li><strong>Pencadangan Basis Data Otomatis (Database Backup):</strong> Menjadwalkan cron job harian pada server MySQL untuk mengekspor berkas dump database ke penyimpanan cloud terisolasi.</li>
    <li><strong>Rotasi Kunci Rahasia JWT:</strong> Melakukan pembaruan nilai <code>JWT_SECRET</code> di file <code>.env</code> secara berkala (misalnya setiap 6 bulan sekali) guna meminimalkan risiko eksploitasi sesi lama.</li>
    <li><strong>Pemantauan Kapasitas Penyimpanan:</strong> Memantau penggunaan disk space pada folder <code>uploads/</code> dan mempertimbangkan migrasi ke penyimpanan obyek cloud (seperti AWS S3 atau Cloudinary) jika volume dokumentasi foto galeri terus meningkat.</li>
  </ol>
`;

const chapters = [
  {
    num: 'BAB I',
    filename: 'BAB_I_Hasil_Analisis_dan_Rekomendasi_Solusi.pdf',
    title: 'Hasil Analisis Website Eksisting & Rekomendasi Solusi',
    sub: 'Evaluasi Kritis Halaman automation-gpt & Perumusan Solusi Decoupled Modern',
    content: bab1Content
  },
  {
    num: 'BAB II',
    filename: 'BAB_II_Dokumentasi_Spesifikasi_API.pdf',
    title: 'Dokumentasi Spesifikasi API (RESTful Endpoints)',
    sub: 'Katalog Endpoint Publik & Administratif, Format JSON Envelope, JWT & Rate Limiter',
    content: bab2Content
  },
  {
    num: 'BAB III',
    filename: 'BAB_III_Alur_Website_Bekerja_System_Flow.pdf',
    title: 'Dokumentasi Alur Website Bekerja (Flowchart & System Flow)',
    sub: 'User Journey Publik, Siklus Rekrutmen HRD, dan HTTP Request Middleware Lifecycle',
    content: bab3Content
  },
  {
    num: 'BAB IV',
    filename: 'BAB_IV_Backend_dan_Perancangan_Database.pdf',
    title: 'Dokumentasi Backend & Perancangan Database Relasional',
    sub: 'Arsitektur MySQL 3NF, Skema Tabel, Relasi ERD, Singleton Pattern, & Dukungan Bilingual',
    content: bab4Content
  },
  {
    num: 'BAB V',
    filename: 'BAB_V_Arsitektur_Frontend_dan_Antarmuka.pdf',
    title: 'Dokumentasi Arsitektur Frontend & Antarmuka Pengguna',
    sub: 'React SPA dengan Vite, Vanilla CSS Design Tokens, Code Splitting, & 3D Robot Canvas',
    content: bab5Content
  },
  {
    num: 'BAB VI',
    filename: 'BAB_VI_Arsitektur_Codebase_dan_Modularitas.pdf',
    title: 'Dokumentasi Arsitektur Codebase & Modularitas Sistem',
    sub: 'Struktur Direktori Monorepo, Separation of Concerns, & Fail-Safe Fallbacks',
    content: bab6Content
  },
  {
    num: 'BAB VII',
    filename: 'BAB_VII_Function_Method_dan_Helper_Kunci.pdf',
    title: 'Dokumentasi Function, Method, Middleware, & Helper Kunci',
    sub: 'Rincian Logika Controller, Filter Hak Akses RBAC, Centralized Error, & Custom Hooks',
    content: bab7Content
  },
  {
    num: 'BAB VIII',
    filename: 'BAB_VIII_Struktur_Berkas_Proyek.pdf',
    title: 'Dokumentasi Struktur Berkas Proyek (File Catalog)',
    sub: 'Katalog Lengkap File Backend, Frontend, Konfigurasi Lingkungan, & Modul Database',
    content: bab8Content
  },
  {
    num: 'BAB IX',
    filename: 'BAB_IX_Rules_dan_Standar_Penulisan_Code.pdf',
    title: 'Dokumentasi Rules, Standard, & Tipe Penulisan Code',
    sub: 'Konvensi Penamaan Naming Standard, Prepared Statements SQL, & Async Error Handling',
    content: bab9Content
  },
  {
    num: 'BAB X',
    filename: 'BAB_X_Website_Final_dan_Hasil_Pengujian.pdf',
    title: 'Dokumentasi Website Final, Hasil Pengujian, & Rekomendasi',
    sub: 'Komparasi Sebelum-Sesudah, Uji Multi-Device, Validasi Postman, & SOP Maintenance',
    content: bab10Content
  }
];

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

console.log('Generating 10 Individual Chapter PDFs...');

chapters.forEach((ch, idx) => {
  const htmlFile = path.join(htmlTempFolder, `${ch.num.replace(/\s+/g, '_')}.html`);
  const pdfFile = path.join(targetFolder, ch.filename);

  const fullHtml = buildHtml(ch.num, ch.title, ch.sub, ch.content);
  fs.writeFileSync(htmlFile, fullHtml, 'utf8');

  const fileUrl = 'file:///' + htmlFile.replace(/\\/g, '/');
  const cmd = `"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfFile}" --no-pdf-header-footer "${fileUrl}"`;

  try {
    execSync(cmd, { stdio: 'pipe' });
    const stats = fs.statSync(pdfFile);
    console.log(`[${idx + 1}/10] Selesai: ${ch.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`Error generating ${ch.filename}:`, err);
  }
});

console.log('All 10 chapter PDFs have been generated in:', targetFolder);
