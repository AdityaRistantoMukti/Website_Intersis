const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Evaluasi & Rekomendasi Improvement Website GPT</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 24mm 22mm 24mm 22mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: 'Times New Roman', Times, Georgia, serif;
      font-size: 11pt;
      line-height: 1.65;
      color: #000000;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }

    .page-break {
      page-break-before: always;
    }

    /* Headings */
    h1, h2, h3, h4 {
      font-family: Arial, Helvetica, sans-serif;
      color: #000000;
      margin-top: 0;
    }

    h1 {
      font-size: 24pt;
      font-weight: 800;
      text-transform: uppercase;
      line-height: 1.25;
      letter-spacing: 0.5px;
      margin-bottom: 12pt;
    }

    h2 {
      font-size: 14pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1.5px solid #000000;
      padding-bottom: 6pt;
      margin-top: 0;
      margin-bottom: 14pt;
    }

    h3 {
      font-size: 11.5pt;
      font-weight: 700;
      margin-top: 14pt;
      margin-bottom: 6pt;
    }

    p {
      margin-top: 0;
      margin-bottom: 10pt;
      text-align: justify;
      text-justify: inter-word;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 10pt;
      padding-left: 20pt;
    }

    li {
      margin-bottom: 5pt;
      text-align: justify;
    }

    /* Table styling */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10pt;
      margin-bottom: 14pt;
      font-size: 9.5pt;
    }

    th, td {
      border: 1px solid #000000;
      padding: 7pt 9pt;
      text-align: left;
      vertical-align: top;
    }

    th {
      background-color: #f2f2f2;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8.5pt;
      letter-spacing: 0.4px;
    }

    /* Cover Page Styling */
    .cover-container {
      min-height: 800px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-top: 120px;
      padding-bottom: 60px;
    }

    .cover-divider {
      width: 100%;
      height: 3px;
      background-color: #000000;
      margin: 20pt 0;
    }

    .cover-sub {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #222222;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .cover-desc {
      font-size: 11.5pt;
      line-height: 1.7;
      color: #333333;
      margin-top: 24pt;
      max-width: 90%;
    }

    .cover-footer {
      margin-top: 160px;
      padding-top: 14pt;
      border-top: 1px solid #000000;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9.5pt;
      display: flex;
      justify-content: space-between;
      color: #222222;
    }

    .highlight-box {
      border: 1px solid #000000;
      padding: 10pt 12pt;
      margin: 12pt 0;
      background: #fafafa;
      font-size: 10pt;
    }

    .footer-line {
      margin-top: 20pt;
      padding-top: 6pt;
      border-top: 1px solid #cccccc;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      color: #555555;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <!-- ==================== HALAMAN 1: JUDUL & COVER UTAMA ==================== -->
  <div class="cover-container">
    <div class="cover-sub">PT. GLOBAL PHILSONIC TECHNOLOGIES (GPT) &bull; BATAM FTZ</div>
    <div class="cover-divider"></div>
    <h1>Laporan Evaluasi & Rekomendasi Improvement Website GPT</h1>
    <div class="cover-sub" style="font-size: 10.5pt; color: #444444; margin-top: 6pt;">
      Kajian Teknis Rekayasa Web, Koreksi Positioning Model Bisnis Perakitan Manufaktur (EMS/OEM/ODM), dan Rencana Peningkatan Sistem Digital
    </div>

    <div class="cover-desc">
      Dokumen ini memuat audit teknis komprehensif terhadap arsitektur, kinerja, dan penyajian konten pada website referensi GPT (<code>globalphilsonics.com/isa</code>). Di dalamnya terangkum kelemahan mendasar sistem eksisting, perumusan rekomendasi perbaikan berbasis teknologi modern, serta komparasi konkret manfaat sistem baru guna memperkuat kredibilitas industri PT. Global Philsonic Technologies di hadapan mitra bisnis global.
    </div>

    <div class="cover-footer">
      <div><strong>Disusun Oleh:</strong> Software Development & Engineering Team</div>
      <div><strong>Entitas:</strong> PT. Global Philsonic Technologies</div>
    </div>
  </div>

  <!-- ==================== HALAMAN 2: HASIL ANALISIS & KEKURANGAN ==================== -->
  <div class="page-break"></div>
  <h2>HASIL ANALISIS & KEKURANGAN WEBSITE EKSISTING</h2>

  <p>
    Berdasarkan peninjauan mendalam terhadap website referensi (<code>https://www.globalphilsonics.com/isa/</code>), ditemukan sejumlah permasalahan kritis yang mencakup aspek model bisnis, arsitektur perangkat lunak, hingga efektivitas saluran komunikasi korporat:
  </p>

  <h3>1. Kesalahan Mendasar pada Positioning Model Bisnis (Retailer vs. Jasa Perakitan)</h3>
  <p>
    Kekurangan paling fundamental pada website referensi adalah penggambaran model bisnis yang rancu. Konten situs menampilkan katalog produk seperti <em>"Android Headunit", "Amplifier", "Subwoofer", "DSP",</em> dan <em>"Dash Camera Recorders"</em> dengan format etalase komersial yang menyerupai toko ritel elektronik jadi (B2C).
  </p>
  <p>
    Padahal, <strong>PT. Global Philsonic Technologies (GPT) adalah entitas manufaktur murni yang bergerak di bidang Jasa Perakitan Elektronik Kontrak (Electronics Manufacturing Services / EMS, OEM, dan ODM)</strong>. Calon klien B2B (perusahaan manufaktur mobil, Tier-1 automotive vendor, atau principal brand elektronik) tidak berkunjung untuk membeli unit barang jadi eceran, melainkan mencari data kapabilitas pabrik, kapasitas lini SMT berkecepatan tinggi, akurasi perakitan PCBA, standar kendali mutu IATF 16949, dan keunggulan fasilitas logistik Bebas Bea di Batam FTZ.
  </p>

  <h3>2. Kinerja Lambat dan Pemborosan Sumber Daya (Bloatware Arsitektur)</h3>
  <p>
    Website referensi dibangun menggunakan tumpukan sistem WordPress yang dipadukan dengan pembangun halaman Elementor serta berbagai plugin pihak ketiga. Hal ini menimbulkan beban teknis yang berat:
  </p>
  <ul>
    <li><strong>Ukuran Payload Berlebihan:</strong> Halaman awal memuat lebih dari 2,5 MB data dengan puluhan stylesheet dan script eksternal yang tidak diperlukan, menyebabkan skor PageSpeed rendah (45–60/100) dan First Contentful Paint (FCP) lambat (>3,2 detik).</li>
    <li><strong>Kerapuhan Keamanan:</strong> Penggunaan plugin WordPress rentan terhadap celah keamanan (security vulnerabilities), ancaman injeksi script berbahaya, dan membutuhkan pemeliharaan versi yang membebani server.</li>
  </ul>

  <h3>3. Visual dan Struktur Informasi yang Kurang Profesional</h3>
  <ul>
    <li><strong>Ketiadaan Data Teknis Manufaktur:</strong> Tidak terdapat penjelasan mengenai kapasitas mesin surface mount (CPH), jenis feeder, fasilitas cleanroom, inspeksi otomatis 3D AOI & X-Ray, serta rute supply chain Selat Malaka yang menjadi nilai jual utama Batam.</li>
    <li><strong>Aset Visual dan Gambar Tidak Terstandarisasi:</strong> Penamaan file gambar menggunakan kode acak (misal: <code>2024102603295837e28.png</code>), resolusi buram tanpa kompresi modern WebP, serta teks email yang rusak akibat enkripsi script pihak ketiga (<code>[email protected]</code>).</li>
  </ul>

  <h3>4. Saluran Konversi Kemitraan B2B yang Tidak Relevan</h3>
  <p>
    Website lama hanya menyediakan formulir kontak umum tanpa parameter kualifikasi bisnis manufaktur. Tidak ada mekanisme bagi calon mitra untuk melampirkan berkas spesifikasi teknis, memperkirakan volume batch produksi, maupun meminta dokumen resmi penawaran harga perakitan (Request for Quotation / RFQ).
  </p>

  <div class="footer-line">
    <div>Laporan Evaluasi & Rekomendasi Improvement Website GPT</div>
    <div>Halaman 2</div>
  </div>

  <!-- ==================== HALAMAN 3: REKOMENDASI IMPROVEMENT ==================== -->
  <div class="page-break"></div>
  <h2>REKOMENDASI IMPROVEMENT WEBSITE GPT</h2>

  <p>
    Untuk mengatasi seluruh kelemahan di atas dan menyelaraskan website dengan kapabilitas riil pabrik PT. Global Philsonic Technologies, dirumuskan pilar-pilar rekomendasi peningkatan berikut:
  </p>

  <h3>1. Reposisi Konten Menjadi "Katalog Kapabilitas Manufaktur & Perakitan"</h3>
  <p>
    Halaman produk harus direorientasi secara total bukan sebagai barang dagangan eceran, melainkan sebagai <strong>Bukti Portfolio Kapabilitas Perakitan Elektronik (Assembly & Manufacturing Capabilities Portfolio)</strong>:
  </p>
  <ul>
    <li>Setiap unit (Headunit, DSP Amplifier, Robotic Fixture) diposisikan sebagai contoh keahlian rekayasa (proof of engineering execution).</li>
    <li>Menyajikan spesifikasi manufaktur mendalam: toleransi penempatan komponen SMT, ketebalan PCB multi-layer, proses conformal coating, hingga rangkaian pengujian fungsional (Burn-In Test, Thermal Cycling, dan End-of-Line Testing).</li>
    <li>Mengubah seluruh tombol Call-to-Action (CTA) menjadi ajakan kemitraan B2B resmi: <strong>"Minta Penawaran RFQ"</strong> dan <strong>"Konsultasi Sales Engineering"</strong>.</li>
  </ul>

  <h3>2. Transformasi Arsitektur Menuju Single Page Application (React 18 + Node.js)</h3>
  <p>
    Meninggalkan ekosistem WordPress/Elementor dan beralih ke arsitektur web modern enterprise:
  </p>
  <ul>
    <li><strong>Kecepatan Maksimal:</strong> Menggunakan React 18 dengan bundler Vite yang menghasilkan payload gzip sangat ringan (&lt;250 KB) dan waktu muat instan (&lt;0,8 detik), memastikan website dapat diakses cepat oleh mitra internasional di Singapura, Jepang, Eropa, dan Amerika.</li>
    <li><strong>Keamanan Tanpa Kompromi:</strong> Sistem API berbasis Node.js Express terisolasi dengan proteksi JWT, parameterized database queries, dan rate limiter untuk mencegah serangan siber.</li>
  </ul>

  <h3>3. Penerapan Fitur Interaktif B2B: Interactive RFQ Builder & 3D CAD Viewer</h3>
  <ul>
    <li><strong>Formulir RFQ Khusus Korporat:</strong> Menyediakan formulir terstruktur yang menangkap data esensial klien (nama perusahaan, email korporat, kategori kebutuhan perakitan, estimasi volume batch/pilot run, dan catatan BOM).</li>
    <li><strong>Interactive 3D Tooling Viewer:</strong> Menampilkan visualisasi CAD 3 dimensi interaktif untuk memperlihatkan rancang bangun mesin otomasi, ICT/FCT test jigs, dan fixture presisi yang dibuat oleh divisi rekayasa GPT.</li>
  </ul>

  <h3>4. Sistem Manajemen Konten (CMS) Internal Mandiri</h3>
  <p>
    Membangun dashboard admin khusus yang elegan, bersih, dan monokrom:
  </p>
  <ul>
    <li>Pengelolaan konten situs secara real-time tanpa perlu menyentuh kode pemrograman.</li>
    <li>Fitur <strong>Audit Trail & Log Aktivitas</strong> untuk mencatat riwayat penambahan, pengubahan, dan penghapusan data oleh staf admin guna menjamin transparansi serta kepatuhan standar audit mutu pabrik.</li>
    <li>Telemetri pengunjung riil dan pencatatan permohonan RFQ yang masuk secara langsung ke basis data perusahaan.</li>
  </ul>

  <div class="footer-line">
    <div>Laporan Evaluasi & Rekomendasi Improvement Website GPT</div>
    <div>Halaman 3</div>
  </div>

  <!-- ==================== HALAMAN 4: PERBANDINGAN & MANFAAT IMPROVEMENT ==================== -->
  <div class="page-break"></div>
  <h2>PERBANDINGAN EVALUASI & MANFAAT IMPROVEMENT</h2>

  <p>
    Berikut adalah matriks komparasi sistematis antara kondisi website referensi saat ini dengan solusi website baru yang tengah kita bangun, beserta analisis manfaat konkret yang diperoleh perusahaan:
  </p>

  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Aspek Penilaian</th>
        <th style="width: 35%;">Website Eksisting (Saat Ini)</th>
        <th style="width: 45%;">Improvement yang Diberikan (Website Baru)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Penyajian Model Bisnis</strong></td>
        <td>Menyerupai toko ritel; mengaburkan identitas perusahaan di hadapan calon klien manufaktur.</td>
        <td><strong>Jasa Manufaktur & Perakitan OEM/ODM Terbuka:</strong> Menampilkan portofolio kapabilitas lini SMT, perakitan presisi, dan uji fungsional.</td>
      </tr>
      <tr>
        <td><strong>Fondasi Teknologi</strong></td>
        <td>WordPress 6.x + Elementor; rentan konflik plugin dan rentan eksploitasi keamanan.</td>
        <td><strong>React 18 + Node.js Express + MySQL:</strong> Kode bersih, modern, aman, serta memiliki performa tinggi berstandar enterprise.</td>
      </tr>
      <tr>
        <td><strong>Kecepatan Akses</strong></td>
        <td>Lambat (PageSpeed 45–60), aset >2,5 MB; berisiko ditinggalkan klien luar negeri sebelum halaman selesai termuat.</td>
        <td><strong>Sangat Cepat (PageSpeed 95–100):</strong> Bundle teroptimasi &lt;250 KB, waktu muat &lt;0,8 detik untuk kenyamanan navigasi global.</td>
      </tr>
      <tr>
        <td><strong>Alur Konversi Kemitraan</strong></td>
        <td>Formulir umum tidak terstruktur; email rentan terblokir dan tidak memiliki parameter tender.</td>
        <td><strong>Interactive B2B RFQ Builder:</strong> Mengakomodasi kebutuhan spesifikasi volume dan langsung terarsip di basis data internal.</td>
      </tr>
      <tr>
        <td><strong>Interaktivitas Rekayasa</strong></td>
        <td>Foto statis sederhana; tidak mendemonstrasikan keunggulan mesin uji otomasi secara nyata.</td>
        <td><strong>Interactive 3D CAD Viewer:</strong> Visualisasi 3 dimensi fixture dan test jig yang memperkuat bukti kompetensi teknis pabrik.</td>
      </tr>
      <tr>
        <td><strong>Panel Manajemen (CMS)</strong></td>
        <td>Dashboard wp-admin standar yang rumit bagi pengguna non-teknis.</td>
        <td><strong>Admin Panel Khusus Monokrom:</strong> Sederhana, aman, dilengkapi Audit Trail log perubahan data dan telemetri pengunjung riil.</td>
      </tr>
    </tbody>
  </table>

  <h3>Manfaat Nyata dari Implementasi Improvement:</h3>
  <ol>
    <li><strong>Peningkatan Kredibilitas di Mata Klien Global:</strong> Tampilan web yang modern, profesional, dan berfokus pada kapabilitas perakitan secara instan menyejajarkan PT GPT dengan manufaktur EMS internasional di kawasan Asia Pasifik.</li>
    <li><strong>Akurasi Permintaan Prospek Bisnis:</strong> Penggunaan formulir RFQ terstruktur menyaring pesan spam dan memastikan setiap prospek yang masuk berisi data teknis yang lengkap untuk langsung ditindaklanjuti oleh tim Sales Engineering.</li>
    <li><strong>Efisiensi Operasional & Kemandirian IT:</strong> CMS kustom memungkinkan tim internal memperbarui informasi pabrik, mesin baru, maupun dokumentasi galeri tanpa biaya pemeliharaan lisensi plugin pihak ketiga.</li>
  </ol>

  <div class="footer-line">
    <div>Laporan Evaluasi & Rekomendasi Improvement Website GPT</div>
    <div>Halaman 4</div>
  </div>

  <!-- ==================== HALAMAN 5: KESIMPULAN ==================== -->
  <div class="page-break"></div>
  <h2>KESIMPULAN</h2>

  <p>
    Berdasarkan serangkaian evaluasi teknis dan analisis fungsional yang telah diuraikan pada bab-bab sebelumnya, dapat ditarik beberapa kesimpulan pokok:
  </p>

  <ol>
    <li>
      <strong>Urgensi Reposisi Identitas Digital:</strong> Website lama PT GPT (<code>globalphilsonics.com/isa</code>) tidak lagi memadai untuk merepresentasikan skala bisnis perusahaan yang sesungguhnya. Format etalase produk ritel komersial telah mengaburkan positioning PT. Global Philsonic Technologies sebagai penyedia <strong>Jasa Kontrak Perakitan Elektronika Otomotif (EMS / OEM / ODM)</strong> berstandar IATF 16949 di Batam Free Trade Zone.
    </li>
    <li>
      <strong>Ketepatan Arah Pengembangan Sistem Baru:</strong> Langkah peremajaan sistem web berbasis <strong>React 18, Node.js API, dan MySQL CMS terintegrasi</strong> yang sedang kita jalankan merupakan solusi tepat sasaran. Pendekatan ini berhasil menyelesaikan kendala kecepatan muat, mengeliminasi risiko keamanan plugin pihak ketiga, serta menghadirkan interaktivitas modern yang dibutuhkan klien industri masa kini.
    </li>
    <li>
      <strong>Efektivitas Saluran B2B RFQ:</strong> Pergantian dari tombol pembelian ritel menjadi <strong>Permintaan Penawaran RFQ B2B</strong> dan konsultasi teknis langsung ke tim Sales Engineering merupakan kunci utama dalam mengubah website dari sekadar profil pasif menjadi generator peluang bisnis perakitan yang bernilai strategis bagi perusahaan.
    </li>
    <li>
      <strong>Kesiapan Implementasi:</strong> Seluruh modul inti pada website baru—mulai dari showcase kapabilitas lini SMT, interaktivitas 3D CAD tooling, modul otomasi industri, galeri cleanroom, dukungan bilingual (ID/EN), hingga CMS internal berfitur Audit Trail—telah tersinkronisasi dan siap untuk memasuki tahapan deployment produksi.
    </li>
  </ol>

  <div class="highlight-box" style="margin-top: 24pt;">
    <strong>Pernyataan Penutup:</strong><br>
    Pengembangan website baru ini bukan sekadar pembaruan visual, melainkan sebuah investasi digital strategis untuk mempertegas reputasi PT. Global Philsonic Technologies sebagai mitra manufaktur elektronik otomotif kelas dunia yang andal, presisi, dan siap bersaing di kancah pasar manufaktur global.
  </div>

  <div style="margin-top: 50pt; text-align: right; font-family: Arial, sans-serif; font-size: 10pt;">
    Batam, 5 Oktober 2026<br><br><br><br>
    <strong>Tim Pengembang Perangkat Lunak & Web Engineering</strong><br>
    PT. Global Philsonic Technologies
  </div>

  <div class="footer-line" style="margin-top: 40pt;">
    <div>Laporan Evaluasi & Rekomendasi Improvement Website GPT</div>
    <div>Halaman 5</div>
  </div>

</body>
</html>`;

const outputPathHtml = path.join(__dirname, 'laporan_evaluasi.html');
const outputPathPdf = path.join(__dirname, 'LAPORAN_EVALUASI_DAN_REKOMENDASI_WEBSITE_GPT.pdf');

// Overwrite HTML template
fs.writeFileSync(outputPathHtml, htmlContent, 'utf8');

// If old PDF exists, delete it first
if (fs.existsSync(outputPathPdf)) {
  fs.unlinkSync(outputPathPdf);
  console.log('Old PDF deleted successfully.');
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const cmd = `"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${outputPathPdf}" --no-pdf-header-footer "file:///${outputPathHtml.replace(/\\/g, '/')}"`;

try {
  console.log('Generating new clean executive PDF...');
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(outputPathPdf)) {
    const stats = fs.statSync(outputPathPdf);
    console.log('SUCCESS! New PDF generated at:', outputPathPdf);
    console.log('File Size:', (stats.size / 1024).toFixed(2), 'KB');
  } else {
    console.error('PDF file was not found after execution.');
  }
} catch (err) {
  console.error('Execution error:', err);
}
