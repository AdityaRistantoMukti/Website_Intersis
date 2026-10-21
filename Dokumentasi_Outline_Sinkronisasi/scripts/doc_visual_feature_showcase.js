/**
 * Data Model & Content Generator for Document 16:
 * 16_Bedah_Visual_dan_Analisis_Fitur_Website_Publik_dan_Admin.pdf
 * 
 * PT. GLOBAL PHILSONIC TECHNOLOGIES (Automation GPT)
 * Dokumentasi Fungsional & Verifikasi Visual 23 Section (Portal Publik & Dashboard Admin)
 * Dilengkapi Screenshot Riil Website & Analisis 2 Pilar:
 * 1. Fungsi Utama & Mekanisme Kerja (Core Functionality)
 * 2. Dampak Bisnis & Nilai Operasional (Business & Operational Impact)
 */

const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, '../screenshots');

function getBase64Image(filename) {
  const filePath = path.join(screenshotDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File gambar tidak ditemukan: ${filePath}`);
    return '';
  }
  const base64Data = fs.readFileSync(filePath).toString('base64');
  return `data:image/jpeg;base64,${base64Data}`;
}

const SECTIONS_DATA = [
  // ═════════════════════════════════════════════════════════════
  // BAGIAN I: PORTAL PUBLIK (CLIENT-FACING PORTAL)
  // ═════════════════════════════════════════════════════════════
  {
    category: "PORTAL PUBLIK (CLIENT-FACING)",
    secNum: "1.1",
    title: "Hero Section 100vh & Dynamic Industrial Cockpit",
    route: "Rute: / (Beranda / Home)",
    badgeColor: "#0d9488",
    imageFile: "pub_01_hero.jpg",
    caption: "Tampilan Layar Penuh Hero Carousel, Headline Typewriter Dinamis, dan Kartu Statistik Kunci Batam FTZ",
    fungsi: "Menampilkan visual landing page imersif berskala penuh (100vh) yang dilengkapi slider gambar otomatis beresolusi tinggi, efek teks animasi mesin ketik (typewriter tagline) industri presisi, tombol Call-to-Action instan 'Minta Penawaran (RFQ)', serta kartu metrik kilat mengenai keunggulan operasional kawasan perdagangan bebas Batam (Free Trade Zone).",
    dampak: "Menciptakan impresi awal yang kuat bagi calon investor dan mitra multinasional. Membangun persepsi bahwa PT Global Philsonic Technologies adalah fasilitas manufaktur otomasi kelas dunia, sehingga secara signifikan menurunkan rasio pentalan (*bounce rate*) pengunjung baru."
  },
  {
    category: "PORTAL PUBLIK (CLIENT-FACING)",
    secNum: "1.2",
    title: "Kapabilitas Manufaktur Presisi & Standar Mutu Industri",
    route: "Rute: / (Beranda / Home)",
    badgeColor: "#0d9488",
    imageFile: "pub_02_capabilities.jpg",
    caption: "Empat Pilar Kapabilitas Utama: Lini SMT 80.000 CPH, Cleanroom 100K, Perakitan Presisi, dan Quality Control",
    fungsi: "Menyajikan ringkasan 4 pilar kompetensi teknis inti pabrik dalam bentuk kartu interaktif: (1) Surface Mount Technology (SMT) dengan kecepatan hingga 80.000 CPH, (2) Ruang Bersih (Cleanroom) ISO Class 100K/10K, (3) Perakitan Mekatronika Presisi Tinggi, dan (4) Penjaminan Mutu Terpadu melalui inspeksi optik otomatis 3D AOI & X-Ray.",
    dampak: "Menjawab kebutuhan teknis *procurement engineer* klien luar negeri mengenai kesiapan kapasitas dan sertifikasi pabrik. Membantu mempercepat proses verifikasi kualifikasi vendor (*vendor qualification stage*) sebelum tender proyek manufaktur dimulai."
  },
  {
    category: "PORTAL PUBLIK (CLIENT-FACING)",
    secNum: "1.3",
    title: "Alur Siklus Manufaktur Terpadu 5-Tahap (Lifecycle Pipeline)",
    route: "Rute: / (Beranda / Home)",
    badgeColor: "#0d9488",
    imageFile: "pub_03_lifecycle.jpg",
    caption: "Diagram Visualisasi Tahapan Produksi dari R&D Prototyping hingga Pengemasan Akhir Anti-ESD",
    fungsi: "Memvisualisasikan alur produksi manufaktur terintegrasi mulai dari: (1) R&D & Prototyping Rekayasa Elektronika, (2) Pencetakan Pasta Solder Stencil Presisi, (3) Pemasangan Komponen Berkecepatan Tinggi (Pick & Place), (4) Penyolderan Oven Reflow Nitrogen Terkendali, hingga (5) Pengujian Fungsional dan Pengemasan Standar ESD.",
    dampak: "Memberikan transparansi rantai pasok (*supply chain visibility*) dan metodologi kendali proses kepada klien B2B. Memudahkan estimasi *lead-time* produksi dan memastikan setiap unit PCBA diproduksi dengan kepatuhan standar zero-defect IATF 16949."
  },
  {
    category: "PORTAL PUBLIK (CLIENT-FACING)",
    secNum: "1.4",
    title: "Profil Perusahaan, Visi Misi & Kartu Interaktif 3D Tilt",
    route: "Rute: /about (Tentang Kami)",
    badgeColor: "#0d9488",
    imageFile: "pub_04_about_profile.jpg",
    caption: "Narasi Profil Perusahaan, Pernyataan Visi Misi, Sertifikasi Mutu, dan Kartu Efek Gyroscope 3D",
    fungsi: "Menyajikan rekam jejak resmi PT Global Philsonic Technologies, nilai-nilai filosofi kerja perusahaan, komitmen keberlanjutan lingkungan, serta kartu interaktif dengan efek kedalaman 3D tilt yang bereaksi dinamis terhadap pergerakan kursor pengguna.",
    dampak: "Memperkuat profil hukum dan kredibilitas korporat dalam rangka audit legal dan *compliance* internasional. Memberikan kejelasan arah strategis perusahaan kepada mitra bisnis jangka panjang."
  },
  {
    category: "PORTAL PUBLIK (CLIENT-FACING)",
    secNum: "1.5",
    title: "Spesifikasi Fasilitas Pabrik & Lingkungan Cleanroom Class 100K",
    route: "Rute: /about (Tentang Kami)",
    badgeColor: "#0d9488",
    imageFile: "pub_05_about_cleanroom.jpg",
    caption: "Spesifikasi Teknis Ruang Bersih: Suhu 22±2°C, Kelembaban 50±5% RH, dan Proteksi Lantai Konduktif ESD",
    fungsi: "Menjabarkan spesifikasi ketat ruang produksi bebas debu: batas konsentrasi partikel mikro (<100.000 partikel/kaki kubik), sistem tata udara bertekanan positif bertingkat (HEPA Filter H14), lantai epoksi konduktif ESD, dan regulasi pakaian steril personil.",
    dampak: "Sangat krusial untuk memenuhi kualifikasi pembuatan perangkat medis sensitif dan modul komunikasi otomotif yang rentan mengalami kerusakan fatal akibat lonjakan elektrostatik (*Electrostatic Discharge*) dan kontaminasi partikulat."
  },
  {
    category: "PORTAL PUBLIK (CLIENT-FACING)",
    secNum: "1.6",
    title: "Kanvas 3D Interaktif WebGL & Showcase Seri Robotika",
    route: "Rute: /automation (Otomasi & Robotika 3D)",
    badgeColor: "#0d9488",
    imageFile: "pub_06_automation_3d.jpg",
    caption: "Simulasi 3D Real-time Lengan Robot Industri (Three.js/WebGL 60 FPS) dengan Kontrol Eksplorasi 360 Derajat",
    fungsi: "Merender objek 3D lengan robot industri secara *real-time* di peramban tanpa memerlukan plugin tambahan. Pengguna dapat memutar, memperbesar, dan mengamati persendian kinematika robot, didukung navigasi *scrollytelling* untuk 3 seri robot (SCARA, 6-Axis, dan Kolaboratif Cobot).",
    dampak: "Mendongkrak daya tawar (*brand equity*) perusahaan di mata mitra global, mengonfirmasi bahwa perusahaan telah mengadopsi teknologi Industri 4.0 secara menyeluruh baik di lini perakitan fisik maupun antarmuka digitalnya."
  },
  {
    category: "PORTAL PUBLIK (CLIENT-FACING)",
    secNum: "1.7",
    title: "Custom Test Jigs (ICT/FCT) & Arsitektur Smart Factory MES",
    route: "Rute: /automation (Otomasi & Robotika 3D)",
    badgeColor: "#0d9488",
    imageFile: "pub_07_automation_jigs.jpg",
    caption: "Spesifikasi Perlengkapan Uji Otomatis Bed-of-Nails dan Diagram Integrasi Sistem Eksekusi Manufaktur (MES)",
    fungsi: "Memperkenalkan kapabilitas perakitan jig pengujian kustom (In-Circuit Testing & Functional Circuit Testing) berkecepatan siklus <8.5 detik per papan sirkuit, serta integrasi telemetri ke sistem perangkat lunak pabrik cerdas (MES) berbasis IoT.",
    dampak: "Menjamin tingkat *yield rate* produk di atas 99.8% dan ketertelusuran penuh data pengujian (*end-to-end unit traceability*), meminimalkan risiko penarikan produk (*recall*) di pasar konsumen akhir."
  },
  {
    category: "PORTAL PUBLIK (CLIENT-FACING)",
    secNum: "1.8",
    title: "Katalog Produk Industri Terpadu Multi-Kategori & Live Search",
    route: "Rute: /products (Katalog Produk)",
    badgeColor: "#0d9488",
    imageFile: "pub_08_products_catalog.jpg",
    caption: "Penyaringan 19+ Model SKU berdasarkan 7 Kategori Industri dengan Pencarian Cepat dan Alur Pilihan View",
    fungsi: "Menyediakan katalog terstruktur untuk 19+ SKU siap produksi yang dapat difilter berdasarkan 7 kategori (Automotive, Mobile Devices, Amplifier, Subwoofer, DSP, Headunit, Dashcam), lengkap dengan fitur pencarian instan nama/kode SKU dan pemilihan tata letak (Grid/Specs Table).",
    dampak: "Menghemat waktu pencarian produk bagi manajer pengadaan B2B hingga 70%. Mempermudah distributor dalam menemukan referensi spesifikasi teknis dan ketersediaan layanan OEM/ODM."
  },
  {
    category: "PORTAL PUBLIK (CLIENT-FACING)",
    secNum: "1.9",
    title: "Modal Detail Spesifikasi Teknis & Pelatuk Permintaan RFQ",
    route: "Rute: /products (Katalog Produk)",
    badgeColor: "#0d9488",
    imageFile: "pub_09_products_modal.jpg",
    caption: "Jendela Pop-up Rincian Parameter Spesifikasi JSON Produk dan Tombol Aksi Penawaran Harga Terarah",
    fungsi: "Membuka jendela pop-up interaktif yang membedah detail spesifikasi teknik lengkap berbasis atribut JSON terstruktur (tegangan operasional, rasio daya, toleransi dimensi, antarmuka sinyal) beserta tombol langsung untuk memicu permintaan penawaran harga (*RFQ Action*).",
    dampak: "Memperpendek siklus pra-penjualan (*pre-sales engineering inquiry*) dan mengarahkan calon klien langsung ke corong konversi penawaran resmi dengan konteks produk yang telah terkunci."
  },
  {
    category: "PORTAL PUBLIK (CLIENT-FACING)",
    secNum: "1.10",
    title: "Galeri Dokumentasi Fasilitas Manufaktur & HD Lightbox",
    route: "Rute: /gallery (Dokumentasi Fasilitas)",
    badgeColor: "#0d9488",
    imageFile: "pub_10_gallery.jpg",
    caption: "Dokumentasi Riil Fasilitas SMT Line, Ruang Oven Nitrogen, dan Laboratorium X-Ray dengan Modal Zoom HD",
    fungsi: "Menampilkan portofolio visual fasilitas manufaktur riil yang dikelompokkan dalam kategori (Lini SMT, Ruang Bersih, Lab QC, Perakitan) serta fitur pembesar gambar resolusi tinggi (Lightbox) untuk inspeksi detail mesin.",
    dampak: "Memberikan bukti otentik (*tangible validation*) bagi klien internasional yang belum sempat melakukan inspeksi fisik ke pulau Batam, meningkatkan rasa percaya dan reputasi integritas perusahaan."
  },
  {
    category: "PORTAL PUBLIK (CLIENT-FACING)",
    secNum: "1.11",
    title: "Formulir Inbound RFQ & Integrasi Google Maps Batam FTZ",
    route: "Rute: /contact (Kontak & Penawaran)",
    badgeColor: "#0d9488",
    imageFile: "pub_11_contact.jpg",
    caption: "Formulir Pengajuan RFQ Terstruktur, Peta Google Maps Kawasan Batamindo, dan Tautan WhatsApp Bisnis",
    fungsi: "Menyediakan formulir kontak dan pengajuan RFQ dengan validasi data masukan (nama, email, volume produksi, catatan teknis), peta interaktif Google Maps lokasi pabrik di Batamindo Industrial Park, serta tombol pintas komunikasi instan WhatsApp.",
    dampak: "Berfungsi sebagai pintu masuk utama penangkapan prospek bisnis B2B (*inbound lead generation*). Data yang dikirimkan langsung tersimpan di basis data backend dan memicu notifikasi email konfirmasi otomatis."
  },
  {
    category: "PORTAL PUBLIK (CLIENT-FACING)",
    secNum: "1.12",
    title: "Bilingual Switcher, Dark/Light Cockpit & Global Navigation",
    route: "Rute: Komponen Global Seluruh Halaman",
    badgeColor: "#0d9488",
    imageFile: "pub_12_footer.jpg",
    caption: "Penyesuaian Tema Gelap/Terang, Pengalihan Bahasa Real-time (ID/EN), dan Navigasi Footer Lengkap",
    fungsi: "Menyediakan navigasi global yang mendukung peralihan bahasa instan Bahasa Indonesia dan Bahasa Inggris, pemilihan tema tampilan (Cockpit Dark Mode / Clean Light Mode) yang tersimpan di `localStorage`, serta footer korporat informatif.",
    dampak: "Memastikan website dapat diakses dengan optimal oleh delegasi luar negeri (Singapura, Jepang, Eropa) serta memberikan ergonomi visual bagi staf teknis yang terbiasa bekerja di lingkungan monitor redup."
  },

  // ═════════════════════════════════════════════════════════════
  // BAGIAN II: PORTAL ADMINISTRASI (MANAGEMENT PORTAL / CMS)
  // ═════════════════════════════════════════════════════════════
  {
    category: "PORTAL ADMINISTRASI (MANAGEMENT CMS)",
    secNum: "2.1",
    title: "Gerbang Masuk Otentikasi JWT & Tombol Akses Cepat Demo",
    route: "Rute: /admin/login (Otentikasi Staf)",
    badgeColor: "#2563eb",
    imageFile: "adm_01_login.jpg",
    caption: "Antarmuka Login Admin Terenkripsi JWT dengan Pilihan Akun Cepat untuk Uji Coba Peran Multi-Level",
    fungsi: "Memproteksi seluruh modul manajemen internal melalui otentikasi berbasis token JWT, pencegahan serangan brute-force, serta penyediaan tombol *Quick Demo Access* untuk verifikasi peran (Administrator, HRD Manager, Staff Konten) secara instan.",
    dampak: "Menjaga keamanan data strategis perusahaan dari akses pihak luar yang tidak berwenang, memastikan kepatuhan terhadap tata kelola teknologi informasi (IT Governance)."
  },
  {
    category: "PORTAL ADMINISTRASI (MANAGEMENT CMS)",
    secNum: "2.2",
    title: "Ringkasan Portal Eksekutif & Telemetri Pengunjung Riil",
    route: "Modul: /admin?tab=overview (Dashboard Eksekutif)",
    badgeColor: "#2563eb",
    imageFile: "adm_02_overview.jpg",
    caption: "Kartu KPI Statistik Konten, Grafik Kunjungan Unik Pengunjung, dan Status Koneksi Database Pool",
    fungsi: "Menampilkan kartu ringkasan eksekutif (Total Produk, Foto Fasilitas, Total Kunjungan, RFQ Masuk), grafik telemetri analitik lalu lintas pengunjung, status konektivitas basis data MySQL, dan daftar pintasan cepat ke modul CMS.",
    dampak: "Memberikan visibilitas instan kepada pihak manajemen atas kesehatan operasional website dan volume prospek RFQ yang masuk setiap harinya tanpa perlu membuka perangkat lunak analitik pihak ketiga."
  },
  {
    category: "PORTAL ADMINISTRASI (MANAGEMENT CMS)",
    secNum: "2.3",
    title: "Manajemen Identitas Branding & Parameter Legalitas Korporat",
    route: "Modul: /admin?tab=branding (Konfigurasi Merek)",
    badgeColor: "#2563eb",
    imageFile: "adm_03_branding.jpg",
    caption: "Editor Logo Resmi (Mode Gelap/Terang), URL Favicon, Slogan Manufaktur, dan Nomor Kontak Hotline",
    fungsi: "Menyediakan formulir pengelolaan terpusat untuk logo perusahaan versi mode terang dan gelap, ikon tab peramban (favicon), nama resmi perseroan, slogan korporat, alamat kantor operasional, dan nomor kontak resmi.",
    dampak: "Memungkinkan staf operasional memperbarui identitas visual perusahaan secara mandiri tanpa perlu menyunting baris kode sumber ataupun melakukan proses *deploy* ulang aplikasi."
  },
  {
    category: "PORTAL ADMINISTRASI (MANAGEMENT CMS)",
    secNum: "2.4",
    title: "Manajemen Konten Beranda & Metrik Kapasitas Pabrik",
    route: "Modul: /admin?tab=home (Editor Landing Page)",
    badgeColor: "#2563eb",
    imageFile: "adm_04_home.jpg",
    caption: "Pengelolaan Slider Spanduk Utama, Teks Berjalan, dan Angka Pencapaian Kapasitas Produksi",
    fungsi: "Memungkinkan admin mengubah urutan slide spanduk beranda, teks judul promosi, kalimat bergerak (*running ticker*), dan angka metrik performa pabrik (kecepatan CPH SMT, target zero defect, persentase pengiriman tepat waktu).",
    dampak: "Menjamin informasi kapasitas produksi yang ditampilkan kepada calon klien selalu akurat dan selaras dengan peningkatan fasilitas perakitan terbaru di pabrik."
  },
  {
    category: "PORTAL ADMINISTRASI (MANAGEMENT CMS)",
    secNum: "2.5",
    title: "Manajemen Narasi Tentang Kami & Sertifikasi Mutu ISO",
    route: "Modul: /admin?tab=about (Profil & Kepatuhan Mutu)",
    badgeColor: "#2563eb",
    imageFile: "adm_05_about.jpg",
    caption: "Editor Sejarah Perseroan, Poin Misi Strategis, Pilar Budaya Kerja, dan Dokumen Sertifikat Standar Mutu",
    fungsi: "Menyediakan antarmuka editor teks untuk narasi perjalanan industri perseroan, butir-butir visi-misi, nilai budaya kerja unggul, dan pembaharuan status akreditasi sertifikat ISO 9001/14001/IATF 16949.",
    dampak: "Mempermudah staf sekretariat perusahaan dalam memperbarui masa berlaku sertifikat audit tahunan sehingga klien selalu melihat bukti kepatuhan yang sah dan terkini."
  },
  {
    category: "PORTAL ADMINISTRASI (MANAGEMENT CMS)",
    secNum: "2.6",
    title: "Manajemen Modul Otomasi Robotika 3D & Data Uji Jigs",
    route: "Modul: /admin?tab=automation (Katalog Otomasi)",
    badgeColor: "#2563eb",
    imageFile: "adm_06_automation.jpg",
    caption: "Editor Parameter Seri Robot (Payload, Jangkauan Lengan, Presisi), Dokumentasi Test Jigs, dan MES",
    fungsi: "Mengelola spesifikasi teknis untuk masing-masing lini robot industri (kapasitas beban angkut, jangkauan kerja, tingkat repetisi akurasi), deskripsi kemampuan perakitan test jigs, dan diagram alur sistem MES pabrik.",
    dampak: "Memberikan keleluasaan bagi tim teknis otomasi untuk mempublikasikan inovasi lini robot terbaru saat perusahaan berinvestasi pada mesin baru."
  },
  {
    category: "PORTAL ADMINISTRASI (MANAGEMENT CMS)",
    secNum: "2.7",
    title: "Manajemen Katalog Produk Terpadu (CRUD 19+ SKU)",
    route: "Modul: /admin?tab=products (Inventaris Produk)",
    badgeColor: "#2563eb",
    imageFile: "adm_07_products.jpg",
    caption: "Tabel Kelola 19+ SKU Produk, Unggah Foto Komponen, dan Editor Spesifikasi Dinamis Format JSON",
    fungsi: "Menyediakan tabel manajemen lengkap (Create, Read, Update, Delete) untuk seluruh inventaris 19+ SKU produk, pengunggahan foto resolusi tinggi, penentuan kategori, status ketersediaan, serta editor spesifikasi teknis berbasis JSON dinamis.",
    dampak: "Memberikan kemandirian penuh kepada departemen pemasaran produk untuk mendaftarkan SKU baru atau merevisi spesifikasi teknis komponen dalam hitungan menit."
  },
  {
    category: "PORTAL ADMINISTRASI (MANAGEMENT CMS)",
    secNum: "2.8",
    title: "Manajemen Media & Kurasi Galeri Fasilitas Pabrik",
    route: "Modul: /admin?tab=gallery (Kurasi Portofolio Foto)",
    badgeColor: "#2563eb",
    imageFile: "adm_08_gallery.jpg",
    caption: "Pengunggahan Foto Dokumentasi Pabrik, Kategorisasi Album (SMT, Cleanroom, Lab), dan Status Visibilitas",
    fungsi: "Mengatur kurasi foto-foto dokumentasi fasilitas manufaktur, proses pengunggahan berkas gambar dengan validasi keamanan format/ukuran, pengelompokan album, dan pengubahan status tampil/arsip.",
    dampak: "Menjaga etalase visual fasilitas perusahaan tetap mutakhir, profesional, dan mencerminkan modernitas lini produksi fisik yang sesungguhnya di Batam."
  },
  {
    category: "PORTAL ADMINISTRASI (MANAGEMENT CMS)",
    secNum: "2.9",
    title: "Manajemen Prospek B2B & Kotak Masuk Permintaan RFQ",
    route: "Modul: /admin?tab=contact (CRM Inbound RFQ)",
    badgeColor: "#2563eb",
    imageFile: "adm_09_contact.jpg",
    caption: "Tabel Pelacakan Pesan Masuk dan Permintaan RFQ, Status Penanganan Prospek, dan Integrasi Email",
    fungsi: "Berfungsi sebagai sistem CRM untuk memantau pesan masuk dari formulir kontak publik, meninjau rincian permintaan penawaran harga (RFQ), memperbarui status penanganan prospek, serta melihat riwayat komunikasi klien.",
    dampak: "Mempercepat waktu tanggap (*response time*) tim penjualan B2B terhadap calon pembeli potensial dari hitungan hari menjadi hitungan jam, melipatgandakan peluang penutupan kontrak manufaktur."
  },
  {
    category: "PORTAL ADMINISTRASI (MANAGEMENT CMS)",
    secNum: "2.10",
    title: "Manajemen Pengguna & Role-Based Access Control (RBAC)",
    route: "Modul: /admin?tab=users (Keamanan & Hak Akses)",
    badgeColor: "#2563eb",
    imageFile: "adm_10_users.jpg",
    caption: "Pengaturan Akun Pengguna Admin, Pembagian Peran (Admin/Manager/Staff), dan Enkripsi Sandi bcrypt",
    fungsi: "Mengelola akun pengguna sistem dengan pembagian izin bertingkat (*Role-Based Access Control*): Administrator (akses penuh), HRD Manager (akses pengguna & log), dan Staff Konten (akses konten terbatas), dilindungi algoritma *hashing* kata sandi bcrypt 10 salt.",
    dampak: "Mencegah terjadinya kesalahan operasional tak disengaja maupun insiden manipulasi data internal (*Principle of Least Privilege*), menjamin akuntabilitas setiap personil pengelola."
  },
  {
    category: "PORTAL ADMINISTRASI (MANAGEMENT CMS)",
    secNum: "2.11",
    title: "Log Audit Trail Forensik & Rekam Jejak Aktivitas Sistem",
    route: "Modul: /admin?tab=logs (Audit Forensik Keamanan)",
    badgeColor: "#2563eb",
    imageFile: "adm_11_logs.jpg",
    caption: "Daftar Rekam Jejak Sistem Append-Only: Identitas Pengguna, Alamat IP, Waktu Presisi, dan Catatan Aksi",
    fungsi: "Mencatat setiap mutasi data yang terjadi di dalam portal admin secara otomatis (*append-only activity log*), meliputi stempel waktu presisi, ID dan nama pengguna, modul yang disentuh, jenis tindakan (CREATE/UPDATE/DELETE), dan alamat IP pemohon.",
    dampak: "Memenuhi prasyarat ketat audit kepatuhan IT korporat internasional dan memudahkan penyelidikan forensik digital apabila terjadi anomali atau sengketa perubahan data inventaris."
  }
];

function generateDocument16Html() {
  console.log('Menyiapkan kompilasi HTML Dokumen 16 dengan 23 visual screenshot...');

  let sectionsHtml = '';

  SECTIONS_DATA.forEach((sec, idx) => {
    const base64Img = getBase64Image(sec.imageFile);

    sectionsHtml += `
      <!-- CARD SHOWCASE SECTION ${sec.secNum} -->
      <div class="showcase-card">
        <div class="showcase-card-header" style="border-left: 4px solid ${sec.badgeColor};">
          <div class="showcase-card-titles">
            <span class="showcase-cat-badge" style="background:${sec.badgeColor};">${sec.category}</span>
            <span class="showcase-num-title">${sec.secNum} &bull; ${sec.title}</span>
          </div>
          <div class="showcase-route-tag">${sec.route}</div>
        </div>

        <div class="showcase-body-grid">
          <!-- KOLOM KIRI: SCREENSHOT ASLI -->
          <div class="showcase-img-col">
            <div class="showcase-frame">
              <div class="showcase-frame-bar">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
                <span class="frame-url">${sec.route.replace('Rute: ', '').replace('Modul: ', '')}</span>
              </div>
              <img src="${base64Img}" alt="${sec.title}" class="showcase-img" />
            </div>
            <div class="showcase-caption">
              <strong>Gambar ${idx + 1}:</strong> ${sec.caption}
            </div>
          </div>

          <!-- KOLOM KANAN: ANALISIS 2 PILAR UTAMA -->
          <div class="showcase-text-col">
            <!-- PILAR 1: FUNGSI UTAMA -->
            <div class="pillar-box pillar-fungsi">
              <div class="pillar-header">
                <span class="pillar-icon">⚙️</span>
                <span class="pillar-title">1. FUNGSI UTAMA &amp; MEKANISME KERJA</span>
              </div>
              <div class="pillar-desc">
                ${sec.fungsi}
              </div>
            </div>

            <!-- PILAR 2: DAMPAK BISNIS -->
            <div class="pillar-box pillar-dampak">
              <div class="pillar-header">
                <span class="pillar-icon">📈</span>
                <span class="pillar-title">2. DAMPAK BISNIS &amp; NILAI OPERASIONAL</span>
              </div>
              <div class="pillar-desc">
                ${sec.dampak}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Dokumen 16: Bedah Visual &amp; Analisis Fitur Website Publik dan Admin PT. Global Philsonic Technologies</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm 12mm 14mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      line-height: 1.45;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }

    /* HEADER DOKUMEN FORMAL */
    .doc-header {
      border-top: 2px solid #0f172a;
      border-bottom: 1px solid #0f172a;
      padding: 5px 0;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      font-size: 7.5pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: bold;
    }
    .title-banner {
      border-left: 3.5px solid #0f172a;
      padding-left: 10px;
      margin-bottom: 12px;
    }
    .unit-title-num {
      font-size: 8pt;
      font-weight: bold;
      text-transform: uppercase;
      color: #475569;
      margin-bottom: 2px;
    }
    h1 {
      font-size: 12pt;
      font-weight: bold;
      color: #0f172a;
      margin: 0;
      line-height: 1.25;
      text-transform: uppercase;
    }

    /* METADATA TABLE */
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 8pt;
    }
    .meta-table td {
      padding: 3.5px 7px;
      border: 1px solid #cbd5e1;
      color: #0f172a;
    }
    .meta-table td.lbl {
      font-weight: bold;
      background: #f1f5f9;
      width: 18%;
    }

    /* INTRODUCTORY CALLOUT */
    .intro-box {
      background: #f8fafc;
      border: 1px solid #94a3b8;
      border-left: 4px solid #0d9488;
      padding: 9px 12px;
      border-radius: 4px;
      margin-bottom: 16px;
      font-size: 8pt;
      line-height: 1.4;
      color: #334155;
    }

    /* SHOWCASE CARD */
    .showcase-card {
      page-break-inside: avoid;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      margin-bottom: 16px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .showcase-card-header {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 6px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .showcase-card-titles {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .showcase-cat-badge {
      font-size: 6.5pt;
      font-weight: bold;
      color: #ffffff;
      padding: 2px 6px;
      border-radius: 3px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .showcase-num-title {
      font-size: 8.5pt;
      font-weight: bold;
      color: #0f172a;
    }
    .showcase-route-tag {
      font-family: Consolas, 'Courier New', monospace;
      font-size: 7.2pt;
      background: #e2e8f0;
      color: #334155;
      padding: 2px 6px;
      border-radius: 3px;
      font-weight: bold;
    }

    /* GRID BODY: SIDE-BY-SIDE */
    .showcase-body-grid {
      display: grid;
      grid-template-columns: 46% 54%;
      gap: 10px;
      padding: 9px 10px;
    }

    /* SCREENSHOT FRAME */
    .showcase-img-col {
      display: flex;
      flex-direction: column;
    }
    .showcase-frame {
      background: #0f172a;
      border-radius: 5px;
      overflow: hidden;
      border: 1px solid #334155;
      display: flex;
      flex-direction: column;
    }
    .showcase-frame-bar {
      background: #1e293b;
      padding: 3px 6px;
      display: flex;
      align-items: center;
      gap: 4px;
      border-bottom: 1px solid #334155;
    }
    .dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      display: inline-block;
    }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }
    .frame-url {
      color: #94a3b8;
      font-size: 6pt;
      font-family: Consolas, monospace;
      margin-left: 4px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .showcase-img {
      width: 100%;
      height: auto;
      display: block;
      background: #000000;
    }
    .showcase-caption {
      font-size: 6.8pt;
      color: #64748b;
      margin-top: 5px;
      line-height: 1.3;
      font-style: italic;
    }

    /* 2 PILAR PENJELASAN */
    .showcase-text-col {
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: center;
    }
    .pillar-box {
      border-radius: 4px;
      padding: 8px 10px;
      border: 1px solid transparent;
    }
    .pillar-header {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 4px;
    }
    .pillar-icon {
      font-size: 8.5pt;
    }
    .pillar-title {
      font-size: 7.4pt;
      font-weight: bold;
      letter-spacing: 0.3px;
    }
    .pillar-desc {
      font-size: 7.8pt;
      line-height: 1.4;
      text-align: justify;
    }

    /* COLOR THEMES FOR 2 PILLARS */
    .pillar-fungsi {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    .pillar-fungsi .pillar-title {
      color: #334155;
    }
    .pillar-fungsi .pillar-desc {
      color: #1e293b;
    }

    .pillar-dampak {
      background: #f0fdf4;
      border-color: #bbf7d0;
    }
    .pillar-dampak .pillar-title {
      color: #15803d;
    }
    .pillar-dampak .pillar-desc {
      color: #14532d;
    }

    /* FOOTER */
    .doc-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 6px;
      margin-top: 18px;
      display: flex;
      justify-content: space-between;
      font-size: 7pt;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- HEADER FORMAL -->
  <div class="doc-header">
    <span>PT. GLOBAL PHILSONIC TECHNOLOGIES &bull; BATAM FTZ</span>
    <span>DOKUMEN TEKNIS &amp; SPESIFIKASI SISTEM &bull; UNIT 16</span>
  </div>

  <div class="title-banner">
    <div class="unit-title-num">DOKUMEN RESMI 16 &bull; SPESIFIKASI FUNGSIONAL &amp; VERIFIKASI SISTEM TERPADU</div>
    <h1>BEDAH VISUAL &amp; ANALISIS FITUR WEBSITE PUBLIK DAN DASHBOARD ADMIN</h1>
  </div>

  <!-- TABEL METADATA SISTEM -->
  <table class="meta-table">
    <tr>
      <td class="lbl">Sistem Target</td>
      <td>Website Manufaktur Presisi &amp; Headless CMS Terpadu (SPA + REST API)</td>
      <td class="lbl">Entitas Industri</td>
      <td>PT. Global Philsonic Technologies (Batam Free Trade Zone)</td>
    </tr>
    <tr>
      <td class="lbl">Tujuan Dokumen</td>
      <td>Spesifikasi Teknis Fungsional, Analisis Operasional, &amp; Verifikasi Antarmuka Riil</td>
      <td class="lbl">Cakupan Evaluasi</td>
      <td>23 Section Riil (12 Fitur Portal Publik &amp; 11 Modul Dashboard Admin)</td>
    </tr>
    <tr>
      <td class="lbl">Metodologi Uji</td>
      <td>Live Headless Browser Automated Capture &amp; Functional Inspection</td>
      <td class="lbl">Status Akses</td>
      <td>Bebas Modul Karier &amp; FAQ (Fokus Manufaktur, Produk, Otomasi &amp; CRM RFQ)</td>
    </tr>
  </table>

  <!-- KOTAK PENGANTAR -->
  <div class="intro-box">
    <strong>Ringkasan Eksekutif:</strong> Dokumen ini membedah secara komprehensif seluruh komponen antarmuka yang telah diimplementasikan pada website <em>PT. Global Philsonic Technologies</em>. Setiap section dilengkapi tangkapan layar aktual (*live high-resolution screenshot*) yang disandingkan langsung dengan dua parameter evaluasi teknis utama: <strong>(1) Fungsi Utama &amp; Mekanisme Kerja</strong>, serta <strong>(2) Dampak Bisnis &amp; Nilai Operasional</strong>. Penyajian ini memfokuskan dokumentasi pada kegunaan riil sistem dalam mendukung operasional manufaktur, otomasi industri, dan tata kelola administrasi perusahaan.
  </div>

  <!-- DAFTAR KARTU SHOWCASE SECTION -->
  ${sectionsHtml}

  <!-- FOOTER DOKUMEN -->
  <div class="doc-footer">
    <span>Dokumen Resmi 16 &bull; PT. Global Philsonic Technologies (Automated Live Capture)</span>
    <span>Spesifikasi Fungsional &amp; Verifikasi Visual Sistem Web Manufaktur dan Admin CMS</span>
  </div>

</body>
</html>`;
}

module.exports = {
  generateDocument16Html
};
