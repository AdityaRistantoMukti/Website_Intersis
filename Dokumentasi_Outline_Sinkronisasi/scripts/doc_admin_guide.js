/**
 * Script Content: Panduan Penggunaan & Alur Pengeditan Website Admin
 * Portal Headless CMS PT Global Philsonic Technologies (website_intersis)
 */

const docAdminGuide = {
  docNumber: "14",
  docCode: "TI.PG.14.2026",
  docTitle: "Buku Panduan Penggunaan & Alur Pengeditan Portal Admin",
  docSubtitle: "Petunjuk Lengkap Operasional CMS, Akun Pengujian Dummy, Tata Cara Pengeditan Konten, dan Manajemen Keamanan",
  executiveSummary: "Buku panduan operasional komprehensif bagi pengelola dan staf teknis dalam mengoperasikan portal administrasi (Headless CMS) PT Global Philsonic Technologies. Dokumen ini memandu pengguna secara terstruktur mulai dari prosedur masuk (login) menggunakan akun pengujian dummy (Administrator, HRD Manager, Staff Konten), navigasi antarmuka, tata cara pengeditan katalog produk manufaktur, pengelolaan konten dinamis (Beranda, Profil Perusahaan, Galeri Fasilitas), penanganan inquiry penawaran harga B2B (RFQ), hingga pengawasan audit trail dan keamanan sistem berbasis peran (RBAC).",

  sections: [
    {
      secNumber: "1",
      title: "Pendahuluan & Arsitektur Portal Administrasi",
      contentHtml: `
        <p>Portal Administrasi Website PT Global Philsonic Technologies (Automation-GPT) dirancang menggunakan arsitektur <strong>Decoupled Headless CMS</strong> berbasis Single Page Application (SPA) React 19 yang terhubung secara asinkron dengan RESTful API Express.js dan database relasional MySQL 8. Portal ini berfungsi sebagai pusat kendali terintegrasi bagi pengelola internal untuk memperbarui seluruh informasi katalog produk, materi profil pabrik Batam FTZ, galeri ruang bersih (cleanroom), serta menindaklanjuti permintaan penawaran harga (RFQ) dari mitra industri global.</p>
        <p>Seluruh antarmuka admin diisolasi dari jangkauan publik pada jalur rute <code>/admin</code> dan dilindungi oleh otentikasi berbasis <em>JSON Web Token (JWT)</em> dengan enkripsi kata sandi menggunakan pustaka <em>bcryptjs</em> (salt rounds 10). Sistem ini juga menerapkan <em>Role-Based Access Control (RBAC)</em> berlapis untuk menjamin bahwa setiap pengguna hanya dapat mengakses modul yang sesuai dengan wewenang kerjanya.</p>
      `
    },
    {
      secNumber: "2",
      title: "Daftar Akun Pengujian (Dummy Accounts) & Fitur Quick Demo Access",
      contentHtml: `
        <p>Untuk mempermudah proses evaluasi, verifikasi, dan demonstrasi sistem tanpa mengharuskan pengguna mengingat atau mengetik kredensial secara manual, sistem telah dilengkapi dengan <strong>3 akun dummy bawaan</strong> yang merepresentasikan tingkatan peran berbeda:</p>
        
        <table class="table-custom">
          <thead>
            <tr>
              <th style="width: 18%;">Tingkatan Peran</th>
              <th style="width: 25%;">Email / Username</th>
              <th style="width: 17%;">Kata Sandi</th>
              <th style="width: 40%;">Wewenang &amp; Hak Akses Modul</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight: bold;">Administrator (Super Admin)</td>
              <td><code>admin@gpt.co.id</code><br><small style="color:#555;">(atau: <code>administrator</code>)</small></td>
              <td><code>admin123</code><br><small style="color:#555;">(atau: <code>Admin@ISA2026</code>)</small></td>
              <td><strong>Hak Akses Penuh (Full Control):</strong> Berhak mengelola seluruh modul CMS, mengelola katalog produk, meninjau RFQ, mengelola akun pengguna admin (tambah/edit/hapus user), serta membaca rekaman audit trail sistem.</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">HRD Manager</td>
              <td><code>hrd@isa.co.id</code><br><small style="color:#555;">(atau: <code>hrd_manager</code>)</small></td>
              <td><code>Hrd@ISA2026</code></td>
              <td><strong>Manajemen Konten &amp; RFQ:</strong> Berhak mengelola konten profil perusahaan, galeri fasilitas, modul karir rekrutmen, meninjau pesan masuk RFQ, serta melihat daftar pengguna.</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Staff Konten</td>
              <td><code>staff.hrd@isa.co.id</code><br><small style="color:#555;">(atau: <code>staff_hrd</code>)</small></td>
              <td><code>Staff@ISA2026</code></td>
              <td><strong>Operasional Entri Data:</strong> Berhak menambah dan mengedit data produk, mengunggah foto galeri fasilitas, dan memperbarui teks deskripsi halaman publik. Modul Keamanan Pengguna dan Log Audit tidak ditampilkan pada peran ini.</td>
            </tr>
          </tbody>
        </table>

        <h3>Fitur Tombol Pintas "Quick Demo Access" (Pilih Akun Cepat)</h3>
        <p>Pada halaman login admin (<code>/admin/login</code>), tepat di bawah formulir login konvensional, tersedia panel khusus bertajuk <strong>"Pilih Akun Cepat (Development)"</strong>. Fitur ini menyediakan 3 tombol chip interaktif:</p>
        <ul>
          <li><strong>Chip Administrator:</strong> Mengisi otomatis kolom login dengan email <code>admin@gpt.co.id</code> dan password <code>admin123</code>.</li>
          <li><strong>Chip HRD Manager:</strong> Mengisi otomatis kolom login dengan email <code>hrd@isa.co.id</code> dan password <code>Hrd@ISA2026</code>.</li>
          <li><strong>Chip Staff Konten:</strong> Mengisi otomatis kolom login dengan email <code>staff.hrd@isa.co.id</code> dan password <code>Staff@ISA2026</code>.</li>
        </ul>
        <p>Setelah menekan salah satu chip, pengguna cukup menekan tombol <strong>"Masuk ke Portal"</strong> untuk langsung mengakses antarmuka dashboard admin.</p>
      `
    },
    {
      secNumber: "3",
      title: "Langkah-Langkah Login & Pengenalan Antarmuka Dashboard",
      contentHtml: `
        <p>Berikut adalah tata cara masuk ke dalam sistem portal admin langkah demi langkah:</p>
        <ol>
          <li>Buka peramban (browser) dan akses alamat <code>http://localhost:5173/admin</code>. Apabila belum memiliki sesi aktif, sistem akan secara otomatis mengarahkan ke halaman login di <code>/admin/login</code>.</li>
          <li>Pada halaman login, pengguna dapat memilih salah satu dari dua cara berikut:
            <ul>
              <li><strong>Cara Cepat:</strong> Klik salah satu chip akun dummy pada panel <em>"Pilih Akun Cepat"</em> (misalnya chip Administrator).</li>
              <li><strong>Cara Manual:</strong> Masukkan email/username pada kolom identitas dan ketikkan kata sandi yang sesuai.</li>
            </ul>
          </li>
          <li>Klik tombol <strong>"Masuk ke Portal"</strong>. Sistem akan menampilkan status <em>"Memverifikasi..."</em>, mengirimkan kredensial ke API <code>/api/admin/auth/login</code>, menyimpan token JWT pada penyimpanan browser, dan mengarahkan pengguna ke halaman utama dashboard.</li>
        </ol>

        <h3>Struktur Antarmuka Dashboard Admin</h3>
        <p>Antarmuka dashboard dirancang dengan tata letak modern dan intuitif yang terbagi menjadi dua area utama:</p>
        <ul>
          <li><strong>Bilah Navigasi Samping (Sidebar Kiri):</strong> Mengelompokkan modul kerja ke dalam 3 kategori utama:
            <ol>
              <li><em>Kelompok UTAMA:</em> Berisi <strong>Ringkasan Portal</strong> (Overview statistik produk, total RFQ, status server) dan <strong>Logo &amp; Favicon URL</strong> (Pengaturan identitas visual website).</li>
              <li><em>Kelompok KONTEN PER HALAMAN (CMS):</em> Berisi modul Beranda (Home), Tentang Kami (About), Produk &amp; Solusi (Products), Otomasi &amp; Robotik (Automation), Galeri &amp; Fasilitas (Gallery), Karir &amp; Rekrutmen (Career), serta Kontak &amp; RFQ (Contact).</li>
              <li><em>Kelompok SISTEM &amp; KEAMANAN (Khusus Admin/HRD):</em> Berisi modul <strong>Pengguna Admin</strong> (manajemen akun staf) dan <strong>Log Audit Trail</strong> (rekaman jejak aktivitas sistem).</li>
            </ol>
          </li>
          <li><strong>Bilah Navigasi Atas (Top Header Bar):</strong> Menampilkan informasi nama pengguna yang sedang aktif, lencana peran (Administrator / HRD / Staff), tombol beralih tema <strong>Mode Gelap / Terang (Dark / Light Theme)</strong>, tombol <strong>Ubah Kata Sandi Pribadi</strong>, tombol <strong>Logout</strong>, serta tautan cepat <strong>"Lihat Website Publik"</strong> yang membuka tab baru ke halaman publik klien.</li>
        </ul>
      `
    },
    {
      secNumber: "4",
      title: "Alur Kerja Pengelolaan Katalog Produk (Products Module)",
      contentHtml: `
        <p>Modul <strong>Produk &amp; Solusi</strong> (dapat diakses melalui sidebar kiri menu <em>"Produk &amp; Solusi"</em>) merupakan pusat pengelolaan seluruh lini produk audio otomotif dan mesin otomatisasi pabrik. Berikut adalah alur lengkap penggunaannya:</p>

        <h3>1. Pencarian &amp; Penyaringan Produk</h3>
        <p>Pada bagian atas daftar produk, tersedia bilah pencarian real-time dan bilah filter kategori. Pengguna dapat mengetikkan kode model (misal: <code>GPT-AHU</code>) atau nama produk untuk menyaring hasil seketika. Tersedia pula filter tombol kategori cepat: <em>Semua Produk, Infotainment (Headunit), Amplifier, Subwoofer, DSP, Dashcam,</em> dan <em>Automation</em>.</p>

        <h3>2. Menambahkan Produk Baru atau Mengedit Produk Eksisting</h3>
        <p>Untuk menambahkan produk baru, klik tombol biru <strong>"+ Tambah Produk Baru"</strong> di sudut kanan atas. Untuk mengedit produk yang telah ada, klik tombol ikon pensil <strong>"Edit"</strong> pada baris produk yang diinginkan. Sebuah jendela modal interaktif dengan 4 tab utama akan muncul:</p>

        <ul>
          <li><strong>Tab 1: Identitas &amp; Model</strong>
            <ul>
              <li><em>Kode Model (SKU):</em> Masukkan kode identitas unik produk (contoh: <code>GPT-AHU-901</code>).</li>
              <li><em>Kategori Manufaktur:</em> Pilih kategori produk yang sesuai dari menu dropdown.</li>
              <li><em>Lencana / Badge (Opsional):</em> Teks lencana penanda khusus (misal: "New", "Flagship Tier-1", "IATF Certified") beserta pilihan warna (Teal, Blue, Purple, Red, Gold).</li>
              <li><em>Urutan Tampil (Sort Order):</em> Menentukan prioritas kemunculan produk pada katalog publik (angka lebih kecil tampil lebih awal).</li>
              <li><em>Foto Utama (Cover Image):</em> Unggah berkas gambar foto produk beresolusi tinggi (format JPG, PNG, atau WEBP). Sistem akan otomatis menampilkan pratinjau foto secara instan.</li>
              <li><em>Galeri Foto Tambahan:</em> Pengguna dapat mengunggah beberapa foto sudut pandang lain (multi-upload).</li>
            </ul>
          </li>
          <li><strong>Tab 2: Judul &amp; Deskripsi Bilingual</strong>
            <ul>
              <li><em>Judul Produk:</em> Masukkan judul dalam Bahasa Indonesia dan Bahasa Inggris.</li>
              <li><em>Ringkasan Singkat (Short Description):</em> Deskripsi 1–2 kalimat yang akan tampil pada kartu produk di katalog utama publik.</li>
              <li><em>Deskripsi Teknis Lengkap (Detailed Description):</em> Penjelasan mendalam mengenai arsitektur perangkat keras, kompatibilitas kendaraan, dan kapabilitas perakitan SMT.</li>
              <li><em>Tombol Terjemahan Otomatis (AI):</em> Mengklik tombol ini akan menerjemahkan teks dari Bahasa Indonesia ke Bahasa Inggris (atau sebaliknya) secara otomatis.</li>
            </ul>
          </li>
          <li><strong>Tab 3: Specs Singkat (4 Item Unggulan)</strong>
            <ul>
              <li>Mengatur 4 parameter kunci yang tampil ringkas pada kartu produk di website publik (contoh: <em>Operating Voltage, Power Output, DSP Architecture, Operating Temperature</em>).</li>
              <li><em>Fitur Preset Cepat (Quick Specs Preset):</em> Tersedia tombol preset 1-klik untuk Headunit, Amplifier, DSP, Subwoofer, Dashcam, dan Automation yang langsung mengisi 4 parameter standar tanpa perlu mengetik manual.</li>
            </ul>
          </li>
          <li><strong>Tab 4: Spesifikasi Lengkap (Full Specifications)</strong>
            <ul>
              <li>Digunakan untuk mengisi tabel spesifikasi teknis mendalam yang akan dibaca oleh engineering dan calon mitra pengadaan B2B.</li>
              <li>Menyediakan dua mode pengeditan yang saling tersinkronisasi: <strong>Mode Formulir Baris (Key-Value)</strong> yang ramah pengguna awam, dan <strong>Mode JSON Editor Interaktif</strong> yang dilengkapi validasi format sintaks real-time.</li>
            </ul>
          </li>
        </ul>

        <div class="code-box vscode-box">
          <div class="vscode-titlebar">
            <div class="vscode-dots">
              <span class="vsc-dot vsc-dot-red"></span>
              <span class="vsc-dot vsc-dot-yellow"></span>
              <span class="vsc-dot vsc-dot-green"></span>
            </div>
            <div class="vscode-tab">
              <span>Struktur Data Spesifikasi Produk (JSON Format)</span>
            </div>
            <div class="vscode-lang">JSON &bull; SPEC ENGINE</div>
          </div>
          <div class="vscode-body">
            <pre><code>{
  "operatingVoltage": "9V - 16V DC (Reverse Polarity & Load Dump Protected)",
  "operatingTemp": "-30°C to +80°C (Automotive Cockpit Grade)",
  "memory": "4GB / 8GB LPDDR4 + 64GB / 128GB eMMC 5.1",
  "audioDsp": "AKM 32-bit DAC with 32-Band PEQ, Time Alignment",
  "radioTuner": "NXP TEF6686 Automotive Tuner with RDS / AF",
  "videoInput": "AHD 1080p Reverse Camera & 360° AVM Support",
  "certifications": "IATF 16949 Compliant, ISO 9001:2015, CE, E-Mark"
}</code></pre>
          </div>
        </div>

        <h3>3. Aksi Cepat pada Baris Tabel Produk</h3>
        <p>Pada daftar tabel produk, pengelola dapat menjalankan aksi cepat berikut:</p>
        <ul>
          <li><strong>Toggle Status Aktif / Nonaktif:</strong> Klik tombol status berwarna hijau ("Aktif") atau abu-abu ("Draft") untuk mengubah status penayangan produk secara instan tanpa harus membuka modal formulir.</li>
          <li><strong>Hapus Produk:</strong> Menekan tombol ikon tempat sampah merah akan memicu dialog konfirmasi keamanan untuk mencegah penghapusan data secara tidak sengaja.</li>
        </ul>
      `
    },
    {
      secNumber: "5",
      title: "Alur Kerja Pembaruan Konten Beranda & Halaman Profil (Home & About)",
      contentHtml: `
        <p>Konten teks, narasi keunggulan pabrik, dan statistik telemetri yang tampil di halaman Beranda (<code>/</code>) dan Tentang Kami (<code>/about</code>) dapat dikelola secara mandiri tanpa memerlukan intervensi tim programmer:</p>

        <h3>1. Modul Beranda (Home Module)</h3>
        <ul>
          <li><strong>Hero Carousel Slider:</strong> Pengelola dapat mengedit teks Judul Utama (Headline), Subjudul kapabilitas pabrik, Teks Tombol CTA (misalnya: <em>"Konsultasi Engineering RFQ"</em>), Tautan Aksi (misal mengarahkan ke <code>/contact</code> atau <code>/products</code>), serta mengganti gambar latar belakang banner utama.</li>
          <li><strong>Keywords Ticker:</strong> Mengatur kata kunci keunggulan industri (misal: <em>"SMT Assembly 80,000 CPH", "IATF 16949 Certified", "Batam FTZ Strategic Logistics"</em>) yang berjalan halus pada bagian atas halaman depan.</li>
          <li><strong>Telemetri Batam FTZ (Stats Metrics):</strong> Memperbarui angka statistik performa pabrik seperti kapasitas penempatan komponen SMT per jam, rasio kualitas First Pass Yield, dan jumlah negara tujuan ekspor.</li>
          <li><strong>Kontrol Bahasa &amp; Penyimpanan:</strong> Menggunakan tab pemilihan bahasa (ID / EN) di sudut kanan atas panel, lalu menekan tombol <strong>"Simpan Pembaruan Beranda"</strong> untuk menyimpan seluruh perubahan ke database MySQL.</li>
        </ul>

        <h3>2. Modul Tentang Kami (About Module)</h3>
        <ul>
          <li><strong>Identitas Pabrik:</strong> Memperbarui nama legal perusahaan, tahun awal pendirian, estimasi jumlah karyawan teknis, dan foto fasilitas pabrik utama.</li>
          <li><strong>Visi &amp; Misi Perusahaan:</strong> Mengedit naskah pernyataan visi jangka panjang dan butir-butir misi keunggulan manufaktur dalam Bahasa Indonesia dan Bahasa Inggris.</li>
          <li><strong>Tonggak Sejarah (Timeline Milestones):</strong> Menambah atau memperbarui rekaman peristiwa penting sejarah pabrik (misal: tahun peresmian lini SMT baru, perolehan sertifikasi otomotif internasional, atau ekspansi fasilitas ruang bersih). Setiap milestone dilengkapi tahun, judul peristiwa, narasi, dan foto dokumentasi.</li>
          <li><strong>Sertifikasi Standar Industri:</strong> Mengelola daftar sertifikasi mutu seperti IATF 16949, ISO 9001:2015, dan ISO 14001 yang menjadi jaminan kualitas bagi klien Tier-1 internasional.</li>
        </ul>
      `
    },
    {
      secNumber: "6",
      title: "Alur Unggah & Kurasi Galeri Fasilitas (Gallery Module)",
      contentHtml: `
        <p>Modul <strong>Galeri &amp; Fasilitas</strong> (sidebar <em>"Galeri &amp; Fasilitas"</em>) memungkinkan tim admin mempublikasikan dokumentasi fotografi terkini mengenai lini perakitan, mesin inspeksi otomatis, dan ruang bersih Class 100K di Batam FTZ:</p>
        <ol>
          <li><strong>Pengaturan Teks Pembuka Galeri (Header):</strong> Pada bagian atas modul, pengelola dapat mengedit judul dan narasi pembuka halaman galeri publik dalam dua bahasa (ID dan EN).</li>
          <li><strong>Menambahkan Foto Dokumentasi Baru:</strong>
            <ul>
              <li>Klik tombol <strong>"+ Tambah Foto Fasilitas"</strong>.</li>
              <li>Pilih berkas foto dari komputer lokal (mendukung format gambar resolusi tinggi: JPG, PNG, WEBP). Sistem akan otomatis mengunggah berkas ke direktori server <code>/uploads/gallery/</code> dan menampilkan pratinjau visual seketika.</li>
              <li>Masukkan <strong>Judul Foto</strong> (misal: <em>"Lini Penempatan Komponen High-Speed SMT 80.000 CPH"</em>).</li>
              <li>Pilih <strong>Kategori Fasilitas</strong>: <em>SMT Lines, Testing Lab, Cleanroom, Box-Build,</em> atau <em>Otomasi</em>.</li>
              <li>Tentukan <strong>Tanggal Dokumentasi</strong> dan <strong>Status</strong> (pilih <em>"Active"</em> agar langsung tayang di galeri publik).</li>
              <li>Tuliskan <strong>Deskripsi Teknis</strong> singkat mengenai mesin atau proses yang terdapat pada foto tersebut.</li>
              <li>Klik tombol <strong>"Simpan Foto"</strong>. Notifikasi konfirmasi keberhasilan akan muncul dan foto baru akan langsung dapat dilihat oleh publik di halaman <code>/gallery</code>.</li>
            </ul>
          </li>
          <li><strong>Pengelolaan Foto Eksisting:</strong> Pengelola dapat mengedit keterangan foto yang telah diunggah atau menghapus foto dokumentasi lama yang sudah tidak relevan.</li>
        </ol>
      `
    },
    {
      secNumber: "7",
      title: "Alur Penanganan Pesan Masuk & Permintaan Penawaran B2B (Contact Module)",
      contentHtml: `
        <p>Modul <strong>Kontak &amp; Google Maps</strong> (sidebar <em>"Kontak &amp; Google Maps"</em>) memiliki dua fungsi strategis: mengelola informasi kontak resmi perusahaan dan memproses setiap permintaan penawaran harga (RFQ) yang masuk dari formulir kontak publik:</p>

        <h3>1. Pengaturan Kontak Resmi &amp; Lokasi Pabrik</h3>
        <ul>
          <li><strong>Informasi Kontak:</strong> Mengedit alamat fisik pabrik di Kawasan Industri Batamindo Free Trade Zone, nomor telepon sentral, nomor WhatsApp resmi tim engineering, email penjualan B2B, serta jam operasional kantor.</li>
          <li><strong>Integrasi Google Maps:</strong> Memperbarui URL sematan iframe Google Maps dan koordinat lintang/bujur agar calon klien dapat menemukan lokasi pabrik dengan akurat saat melakukan audit fasilitas.</li>
        </ul>

        <h3>2. Manajemen Kotak Masuk Permintaan Penawaran (RFQ Inbox)</h3>
        <p>Setiap pesan yang dikirimkan oleh pengunjung melalui halaman publik <code>/contact</code> akan secara otomatis masuk ke dalam tabel daftar inquiry di modul ini secara real-time:</p>
        <ul>
          <li><strong>Rincian Data Pengirim:</strong> Pengelola dapat membaca nama lengkap pemesan, nama perusahaan klien, alamat email bisnis, nomor telepon/WhatsApp, kategori kebutuhan manufaktur (<em>SMT &amp; PCBA, Box-Build, Testing Fixtures, OEM/ODM</em>), estimasi volume pesanan (<em>Pilot Run &lt; 1.000 unit, Medium, Mass Production &gt; 10.000 unit</em>), serta deskripsi teknis proyek.</li>
          <li><strong>Pemeriksaan Anti-Spam:</strong> Sistem secara otomatis mengevaluasi pesan menggunakan algoritma deteksi bot (skor honeypot dan validasi pola waktu pengisian). Pesan yang dicurigai spam akan diberi label khusus dan dapat difilter secara terpisah.</li>
          <li><strong>Alur Pembaruan Status Tindak Lanjut:</strong> Pengelola dapat memperbarui siklus status setiap inquiry untuk memudahkan koordinasi tim sales:
            <ol>
              <li><strong style="color:#0d9488;">Baru (New):</strong> Pesan baru masuk yang belum ditindaklanjuti.</li>
              <li><strong style="color:#d97706;">Dihubungi (Contacted):</strong> Klien telah dikontak oleh perwakilan tim sales/engineering.</li>
              <li><strong style="color:#9333ea;">Penawaran Diberikan (Quoted):</strong> Surat penawaran harga resmi (Quotation) telah dikirimkan kepada calon klien.</li>
              <li><strong style="color:#16a34a;">Selesai / Deal (Closed):</strong> Kesepakatan manufaktur tercapai atau inquiry telah selesai ditangani secara paripurna.</li>
              <li><strong style="color:#64748b;">Spam / Ditolak:</strong> Pesan tidak relevan atau promosi spam.</li>
            </ol>
          </li>
          <li><strong>Fitur Respon Cepat 1-Klik:</strong> Tersedia tombol <strong>"Balas via WhatsApp"</strong> yang langsung membuka percakapan WhatsApp Web ke nomor pemesan dengan salam pembuka otomatis, serta tombol <strong>"Kirim Email"</strong> yang membuka program email komputer pengelola.</li>
        </ul>
      `
    },
    {
      secNumber: "8",
      title: "Manajemen Pengguna Admin & Keamanan Sistem Berbasis Peran (Users & Logs)",
      contentHtml: `
        <p>Keamanan dan akuntabilitas sistem dikelola melalui dua modul khusus yang hanya dapat diakses oleh akun dengan tingkat wewenang <strong>Administrator</strong> atau <strong>HRD Manager</strong>:</p>

        <h3>1. Modul Pengguna Admin (Users Module)</h3>
        <ul>
          <li><strong>Menambahkan Akun Pengguna Baru:</strong> Klik tombol <strong>"+ Tambah Pengguna Baru"</strong>. Masukkan Nama Lengkap, Username unik, Alamat Email aktif, Kata Sandi awal, pilih Peran (<em>Administrator, HRD Manager,</em> atau <em>Staff Konten</em>), dan tentukan Status akun (<em>Active / Inactive</em>).</li>
          <li><strong>Mengedit &amp; Mereset Sandi Pengguna:</strong> Administrator dapat mengubah data profil staf atau mereset kata sandi staf yang lupa tanpa menghapus akun yang bersangkutan.</li>
          <li><strong>Menonaktifkan Akun:</strong> Apabila seorang staf tidak lagi bertugas, status akun dapat diubah menjadi <em>"Inactive"</em> untuk mencabut hak akses masuk secara seketika tanpa menghapus riwayat kerja yang telah dibuat di masa lalu.</li>
          <li><strong>Perlindungan Akun Sendiri:</strong> Sistem memiliki proteksi bawaan yang mencegah pengguna menghapus atau menonaktifkan akun miliknya sendiri yang sedang digunakan saat itu.</li>
        </ul>

        <h3>2. Modul Log Audit Trail (Logs Module)</h3>
        <p>Setiap tindakan penting yang terjadi di dalam portal admin direkam secara otomatis oleh sistem ke dalam tabel database <code>activity_logs</code>. Rekaman ini berfungsi sebagai bukti kepatuhan tata kelola teknologi informasi industri:</p>
        <ul>
          <li><strong>Informasi yang Terekam:</strong> Waktu peristiwa presisi (Timestamp), Nama dan Akun pengguna pelaku tindakan, Tipe Aksi (contoh: <code>LOGIN</code>, <code>CREATE_PRODUCT</code>, <code>UPDATE_PRODUCT</code>, <code>DELETE_PRODUCT</code>, <code>UPDATE_SETTINGS</code>), Modul Sasaran, Deskripsi Rincian Perubahan (misal kode SKU produk yang diubah), serta Alamat IP (IP Address) perangkat pengguna.</li>
          <li><strong>Pencarian &amp; Filter Forensik:</strong> Pengelola dapat memfilter riwayat aktivitas berdasarkan rentang tanggal, kategori aksi, atau mengetikkan kata kunci pencarian tertentu untuk memudahkan audit keamanan.</li>
        </ul>
      `
    },
    {
      secNumber: "9",
      title: "Prosedur Penggantian Kata Sandi Mandiri & Keluar Sistem (Logout)",
      contentHtml: `
        <p>Untuk menjaga keamanan akun pribadi masing-masing pengelola, sistem menyediakan prosedur pengelolaan sesi dan kata sandi yang mudah dijalankan:</p>
        <ol>
          <li><strong>Mengganti Kata Sandi Mandiri:</strong>
            <ul>
              <li>Klik menu dropdown profil di sudut kanan atas antarmuka dashboard, lalu pilih opsi <strong>"Ubah Kata Sandi"</strong>.</li>
              <li>Masukkan Kata Sandi Saat Ini (Current Password) untuk verifikasi identitas.</li>
              <li>Masukkan Kata Sandi Baru (minimal 6 karakter) dan ketikkan ulang pada kolom Konfirmasi Kata Sandi Baru.</li>
              <li>Klik tombol <strong>"Simpan Password Baru"</strong>. Sistem akan mengenkripsi kata sandi baru menggunakan <em>bcryptjs</em> dan memperbarui database.</li>
            </ul>
          </li>
          <li><strong>Prosedur Keluar Sistem (Logout) yang Aman:</strong>
            <ul>
              <li>Setelah selesai melakukan pengeditan data, pengelola diwajibkan untuk menekan tombol <strong>"Logout"</strong> pada bilah atas atau menu navigasi profil.</li>
              <li>Sistem akan mencatat aktivitas log keluar, menghapus token otentikasi JWT dari memori peramban, dan mengalihkan halaman kembali ke <code>/admin/login</code>.</li>
              <li>Hal ini memastikan bahwa sesi kerja tidak dapat disalahgunakan oleh pihak lain pada komputer bersama di lingkungan kantor.</li>
            </ul>
          </li>
        </ol>
      `
    },
    {
      secNumber: "10",
      title: "Kesimpulan & Rekomendasi Tata Kelola Konten",
      contentHtml: `
        <p>Portal Administrasi PT Global Philsonic Technologies telah berhasil mengimplementasikan sistem manajemen konten mandiri yang tangguh, aman, dan mudah dioperasikan bahkan oleh staf non-teknis. Melalui pemisahan peran yang tegas (RBAC), penyediaan akun dummy pengujian yang terintegrasi tombol akses cepat (Quick Demo Access), formulir produk bilingual terstruktur, serta rekaman audit trail otomatis, sistem ini siap mendukung operasional publikasi digital korporat secara profesional, akuntabel, dan berkelanjutan.</p>
      `
    }
  ]
};

module.exports = docAdminGuide;
