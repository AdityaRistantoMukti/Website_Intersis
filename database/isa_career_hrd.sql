-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 25 Sep 2026 pada 08.19
-- Versi server: 10.1.38-MariaDB
-- Versi PHP: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `isa_career_hrd`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL COMMENT 'FK: ID user yang melakukan aksi',
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Jenis aksi: CREATE, UPDATE, DELETE, LOGIN, LOGOUT',
  `module` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Modul yang diakses (misal: job_vacancies, gallery)',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Deskripsi detail aktivitas',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Audit trail: riwayat aktivitas pengguna internal HRD';

--
-- Dumping data untuk tabel `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `module`, `description`, `created_at`) VALUES
(1, 1, 'CREATE', 'users', 'Inisialisasi akun Administrator, HRD Manager, dan Staff HRD', '2026-09-25 01:00:00'),
(2, 1, 'UPDATE', 'company_profile', 'Memperbarui profil, visi, dan misi PT. Intersis Sejahtera Abadi', '2026-09-25 01:15:00'),
(3, 2, 'CREATE', 'job_vacancies', 'Membuat lowongan baru: Senior Fullstack Software Engineer', '2026-09-25 01:30:00'),
(4, 2, 'CREATE', 'job_vacancies', 'Membuat lowongan baru: Recruitment Specialist', '2026-09-25 01:45:00'),
(5, 3, 'CREATE', 'gallery', 'Mengunggah dokumentasi foto Annual Team Building 2026', '2026-09-25 02:00:00'),
(6, 1, 'LOGIN', 'auth', 'User \'administrator\' berhasil login ke sistem', '2026-09-25 07:37:02'),
(7, 3, 'LOGIN', 'auth', 'User \'staff_hrd\' berhasil login ke sistem', '2026-09-25 07:37:13'),
(8, 3, 'CREATE', 'job_vacancies', 'Membuat lowongan kerja baru \'Frontend Developer (React.js)\' (Status: draft)', '2026-09-25 07:37:13'),
(9, 1, 'LOGIN', 'auth', 'User \'administrator\' berhasil login ke sistem', '2026-09-25 08:19:30'),
(10, 3, 'LOGIN', 'auth', 'User \'staff_hrd\' berhasil login ke sistem', '2026-09-25 08:19:30'),
(11, 3, 'CREATE', 'job_vacancies', 'Membuat lowongan kerja baru \'Automation QA Engineer\' (Status: draft)', '2026-09-25 08:19:31');

-- --------------------------------------------------------

--
-- Struktur dari tabel `benefits`
--

CREATE TABLE `benefits` (
  `id` int(11) NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Judul benefit',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Penjelasan benefit',
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Nama/class icon',
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Path/URL gambar ilustrasi',
  `sort_order` int(11) NOT NULL DEFAULT '0' COMMENT 'Urutan tampil (ascending)',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 = aktif, 0 = nonaktif',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Manfaat dan fasilitas perusahaan (Benefits & Perks)';

--
-- Dumping data untuk tabel `benefits`
--

INSERT INTO `benefits` (`id`, `title`, `description`, `icon`, `image`, `sort_order`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Asuransi Kesehatan & BPJS Lengkap', 'Perlindungan kesehatan menyeluruh meliputi BPJS Kesehatan, BPJS Ketenagakerjaan (JKK, JKM, JHT, JP), serta asuransi swasta tambahan.', 'heart-pulse', '/uploads/benefits/health.jpg', 1, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(2, 'Pengembangan Karir & Beasiswa Pelatihan', 'Dukungan penuh untuk peningkatan kompetensi karyawan melalui sertifikasi profesional, workshop internal, dan pelatihan eksternal.', 'graduation-cap', '/uploads/benefits/learning.jpg', 2, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(3, 'Bonus Kinerja & Insentif Penjualan', 'Apresiasi finansial yang adil berupa bonus tahunan berbasis KPI, insentif kuartalan, dan reward khusus bagi karyawan berprestasi.', 'coins', '/uploads/benefits/bonus.jpg', 3, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(4, 'Jam Kerja Fleksibel & Skema Hybrid', 'Keseimbangan kehidupan kerja (work-life balance) dengan pengaturan jam kerja yang adaptif serta opsi kerja hybrid untuk divisi tertentu.', 'clock-history', '/uploads/benefits/flexible.jpg', 4, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(5, 'Fasilitas Olahraga & Program Wellness', 'Dukungan gaya hidup sehat melalui klub olahraga karyawan (bulutangkis, futsal, yoga) dan pemeriksaan kesehatan rutin gratis.', 'activity', '/uploads/benefits/wellness.jpg', 5, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(6, 'Lingkungan Kerja Modern & Kolaboratif', 'Ruang kerja kekinian berkonsep terbuka, area pantry nyaman dengan kopi & camilan gratis, serta budaya kerja bebas intimidasi.', 'building-smile', '/uploads/benefits/workspace.jpg', 6, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `company_profile`
--

CREATE TABLE `company_profile` (
  `id` int(11) NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nama/judul profil perusahaan',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Deskripsi singkat perusahaan',
  `vision` text COLLATE utf8mb4_unicode_ci COMMENT 'Visi perusahaan',
  `mission` text COLLATE utf8mb4_unicode_ci COMMENT 'Misi perusahaan',
  `about_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Path/URL foto profil perusahaan',
  `updated_by` int(11) DEFAULT NULL COMMENT 'FK: ID user yang terakhir update',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Profil, visi, dan misi perusahaan (singleton)';

--
-- Dumping data untuk tabel `company_profile`
--

INSERT INTO `company_profile` (`id`, `title`, `description`, `vision`, `mission`, `about_image`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'PT. Intersis Sejahtera Abadi', 'PT. Intersis Sejahtera Abadi (ISA) adalah perusahaan manufaktur dan distributor terkemuka di Indonesia yang bergerak di bidang sistem otomotif, aksesoris audio mobil modern, dan solusi elektronik kendaraan. Sejak didirikan, ISA terus berkomitmen melahirkan inovasi produk bermutu tinggi seperti brand ternama Asuka Car TV dan Mirai Car Entertainment, didukung oleh tim profesional yang berdedikasi tinggi serta jaringan distribusi di seluruh wilayah Nusantara.', 'Menjadi pemimpin pasar manufaktur & teknologi elektronik otomotif di Asia Tenggara yang inovatif, terpercaya, dan memberikan nilai tambah berkelanjutan bagi pelanggan, karyawan, dan masyarakat.', '1. Mengembangkan produk teknologi otomotif berkualitas prima, aman, dan ramah pengguna.\n2. Membangun budaya kerja yang kolaboratif, profesional, dan berorientasi pada pengembangan potensi SDM.\n3. Memberikan pelayanan purna jual terbaik demi kepuasan pelanggan secara menyeluruh.\n4. Menerapkan tata kelola perusahaan yang berkelanjutan dan bertanggung jawab sosial.', '/uploads/company/about_isa.jpg', 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `contact_recruitment`
--

CREATE TABLE `contact_recruitment` (
  `id` int(11) NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Email tim rekrutmen',
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Nomor telepon/HP',
  `address` text COLLATE utf8mb4_unicode_ci COMMENT 'Alamat lengkap kantor',
  `instagram` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL/username Instagram',
  `linkedin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL LinkedIn perusahaan',
  `whatsapp` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Nomor WhatsApp rekrutmen',
  `updated_by` int(11) DEFAULT NULL COMMENT 'FK: ID user yang terakhir update',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Informasi kontak tim rekrutmen (singleton)';

--
-- Dumping data untuk tabel `contact_recruitment`
--

INSERT INTO `contact_recruitment` (`id`, `email`, `phone`, `address`, `instagram`, `linkedin`, `whatsapp`, `updated_by`, `updated_at`) VALUES
(1, 'recruitment@isa.co.id', '+62 21 5420 5555', 'Ruko Gading Boulevard Block 8B No. 12-15, Gading Serpong, Pakulonan Barat, Kelapa Dua, Tangerang, Banten 15810', 'https://instagram.com/isa_career_official', 'https://linkedin.com/company/pt-intersis-sejahtera-abadi', '+62 812 9900 8877', 1, '2026-09-25 07:34:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `core_values`
--

CREATE TABLE `core_values` (
  `id` int(11) NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Judul/nama core value',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Penjelasan core value',
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Nama icon (misal: class icon atau path file)',
  `sort_order` int(11) NOT NULL DEFAULT '0' COMMENT 'Urutan tampil (ascending)',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 = aktif, 0 = nonaktif',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nilai-nilai utama (core values) perusahaan';

--
-- Dumping data untuk tabel `core_values`
--

INSERT INTO `core_values` (`id`, `title`, `description`, `icon`, `sort_order`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Integritas & Kejujuran', 'Menjunjung tinggi prinsip kejujuran, transparansi, serta etika profesionalisme dalam setiap tindakan dan pengambilan keputusan.', 'shield-check', 1, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(2, 'Inovasi Berkelanjutan', 'Selalu mendorong kreativitas dan mengadopsi teknologi terbaru untuk menghadirkan produk serta solusi yang relevan dengan perkembangan zaman.', 'lightbulb', 2, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(3, 'Sinergi & Kerjasama Tim', 'Membangun hubungan kerja yang harmonis, saling menghargai perbedaan, dan berkolaborasi secara aktif demi mencapai tujuan bersama.', 'users-group', 3, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(4, 'Keunggulan Kualitas', 'Berkomitmen memberikan standar kualitas tertinggi pada setiap produk, layanan, dan proses bisnis perusahaan tanpa kompromi.', 'award', 4, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(5, 'Fokus pada Pelanggan', 'Mendengarkan dan memahami kebutuhan pelanggan secara mendalam untuk memberikan pengalaman serta kepuasan pelanggan yang optimal.', 'heart-handshake', 5, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `faqs`
--

CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `question` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Pertanyaan yang sering ditanyakan',
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Jawaban atas pertanyaan',
  `sort_order` int(11) NOT NULL DEFAULT '0' COMMENT 'Urutan tampil (ascending)',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 = aktif, 0 = nonaktif',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='FAQ seputar proses rekrutmen dan seleksi';

--
-- Dumping data untuk tabel `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `answer`, `sort_order`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Bagaimanakah alur seleksi rekrutmen di PT. Intersis Sejahtera Abadi?', 'Alur rekrutmen kami terdiri dari 4 tahap utama: 1) Pendaftaran online melalui Google Form di halaman lowongan; 2) Seleksi Administrasi & Screening CV; 3) Wawancara HRD & Tes Psikotes (jika ada); 4) Wawancara User/Direksi & Offering Letter.', 1, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(2, 'Berapa lama proses seleksi dari pendaftaran hingga pengumuman?', 'Proses seleksi biasanya memakan waktu sekitar 1 hingga 2 minggu kerja tergantung pada posisi yang dilamar. Tim HRD akan menghubungi kandidat yang lolos kualifikasi melalui WhatsApp atau email resmi perusahaan.', 2, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(3, 'Apakah pendaftaran lowongan kerja di PT. Intersis Sejahtera Abadi dipungut biaya?', 'TIDAK. Seluruh proses rekrutmen dan seleksi di PT. Intersis Sejahtera Abadi bersifat GRATIS. Kami tidak pernah memungut biaya apapun atau bekerjasama dengan agen travel tertentu.', 3, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(4, 'Apakah fresh graduate dipersilakan melamar?', 'Tentu saja! Kami memiliki banyak posisi khusus untuk Fresh Graduate, serta program khusus seperti Management Trainee, Internship, dan On the Job Training (OJT). Silakan cek kualifikasi pada detail masing-masing lowongan.', 4, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(5, 'Bagaimana cara saya melamar pekerjaan yang tersedia?', 'Pilih posisi lowongan yang sesuai dengan kualifikasi Anda di halaman Lowongan Kerja, kemudian klik tombol \"Apply Now\". Anda akan diarahkan ke formulir resmi Google Form untuk mengunggah CV dan berkas pendukung.', 5, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(6, 'Bisakah saya melamar lebih dari satu posisi sekaligus?', 'Kami menyarankan Anda melamar 1 posisi yang paling sesuai dengan latar belakang pendidikan dan pengalaman terbaik Anda agar proses evaluasi kandidat berjalan lebih fokus.', 6, 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Judul foto/kegiatan',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Deskripsi foto/kegiatan',
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Path/URL gambar',
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Kategori kegiatan (misal: team building, workshop)',
  `event_date` date DEFAULT NULL COMMENT 'Tanggal kegiatan berlangsung',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'Status tampil di publik',
  `created_by` int(11) DEFAULT NULL COMMENT 'FK: ID user yang upload',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Galeri foto kegiatan perusahaan (Life at ISA)';

--
-- Dumping data untuk tabel `gallery`
--

INSERT INTO `gallery` (`id`, `title`, `description`, `image`, `category`, `event_date`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Annual Team Building 2026', 'Kegiatan keakraban seluruh divisi PT ISA yang diselenggarakan di Puncak Bogor untuk mempererat sinergi antar tim.', '/uploads/gallery/team_building_2026.jpg', 'Team Building', '2026-02-15', 'active', 2, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(2, 'Technology & Automotive Workshop', 'Sesi pelatihan internal mengenai perkembangan teknologi terkini head unit Android dan sistem keselamatan berkendara.', '/uploads/gallery/workshop_tech.jpg', 'Workshop', '2026-04-10', 'active', 3, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(3, 'ISA Innovation Day & Exhibition', 'Pameran karya inovasi internal staf engineering dan peluncuran produk flagship terbaru Asuka & Mirai.', '/uploads/gallery/innovation_day.jpg', 'Exhibition', '2026-06-20', 'active', 2, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(4, 'Employee Excellence Award 2025', 'Malam penganugerahan bagi karyawan dengan kinerja terbaik dan kontribusi luar biasa sepanjang tahun 2025.', '/uploads/gallery/excellence_award.jpg', 'Event Perusahaan', '2025-12-18', 'active', 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(5, 'CSR ISA Peduli Lingkungan', 'Aksi sosial penanaman 1.000 bibit pohon dan pembagian paket sembako di sekitar kawasan industri kantor pusat.', '/uploads/gallery/csr_green.jpg', 'CSR', '2026-03-22', 'active', 3, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(6, 'Halal Bihalal & Fasting Break', 'Momen kebersamaan berbuka puasa bersama seluruh direksi dan staf PT. Intersis Sejahtera Abadi.', '/uploads/gallery/halal_bihalal.jpg', 'Event Perusahaan', '2026-04-02', 'active', 2, '2026-09-25 07:34:29', '2026-09-25 07:34:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `job_categories`
--

CREATE TABLE `job_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nama kategori/divisi (misal: Engineering, Finance)',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Deskripsi singkat kategori',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 = aktif, 0 = nonaktif',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Kategori atau divisi lowongan kerja';

--
-- Dumping data untuk tabel `job_categories`
--

INSERT INTO `job_categories` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Engineering & IT', 'Pengembangan perangkat lunak, sistem elektronik, IoT otomotif, dan infrastruktur IT.', 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(2, 'Human Capital & GA', 'Pengelolaan sumber daya manusia, rekrutmen, pelatihan, dan operasional umum kantor.', 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(3, 'Sales & Marketing', 'Penjualan produk B2B/B2C, strategi pemasaran digital, branding, dan ekspansi pasar.', 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(4, 'Finance & Accounting', 'Perencanaan keuangan, akuntansi, perpajakan, audit, dan penganggaran perusahaan.', 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(5, 'Supply Chain & Operations', 'Pengadaan bahan baku, manajemen gudang, logistik, dan kontrol kualitas produksi.', 1, '2026-09-25 07:34:29', '2026-09-25 07:34:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `job_vacancies`
--

CREATE TABLE `job_vacancies` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL COMMENT 'FK: Kategori/divisi lowongan',
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Judul posisi/jabatan',
  `location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Lokasi penempatan (misal: Jakarta, Remote)',
  `employment_type` enum('Full Time','Part Time','Internship','Contract','OJT') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tipe pekerjaan',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Deskripsi pekerjaan (job description)',
  `responsibilities` text COLLATE utf8mb4_unicode_ci COMMENT 'Tanggung jawab pekerjaan',
  `requirements` text COLLATE utf8mb4_unicode_ci COMMENT 'Persyaratan/kualifikasi pelamar',
  `form_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL Google Form untuk Apply Now',
  `status` enum('draft','published','closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft' COMMENT 'draft=belum publish, published=live, closed=ditutup',
  `published_at` timestamp NULL DEFAULT NULL COMMENT 'Waktu lowongan dipublikasikan',
  `closed_at` timestamp NULL DEFAULT NULL COMMENT 'Waktu lowongan ditutup',
  `created_by` int(11) DEFAULT NULL COMMENT 'FK: ID user yang membuat lowongan',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Data lowongan kerja (Apply Now -> Google Form)';

--
-- Dumping data untuk tabel `job_vacancies`
--

INSERT INTO `job_vacancies` (`id`, `category_id`, `title`, `location`, `employment_type`, `description`, `responsibilities`, `requirements`, `form_url`, `status`, `published_at`, `closed_at`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 'Senior Fullstack Software Engineer', 'Gading Serpong, Tangerang / Hybrid', 'Full Time', 'Kami mencari Senior Fullstack Engineer yang berpengalaman untuk mengembangkan platform internal HRD, aplikasi backend pendukung produk otomotif, serta integrasi API sistem enterprise.', '• Merancang dan membangun RESTful API berkinerja tinggi menggunakan Node.js dan MySQL.\n• Mengembangkan antarmuka pengguna admin dashboard dan public site menggunakan React.js.\n• Memastikan keamanan sistem, optimasi query database, serta performa aplikasi secara menyeluruh.\n• Berkolaborasi dengan tim UI/UX dan Project Manager dalam mengimplementasikan fitur baru.', '• Pendidikan Minimal S1 Teknik Informatika / Sistem Informasi / sejenis.\n• Pengalaman kerja minimal 3 tahun sebagai Fullstack Engineer (Node.js & React).\n• Menguasai Node.js (Express), MySQL (Query Optimization), REST API, dan JWT Auth.\n• Mahir menggunakan Git, Docker, serta pemahaman yang baik tentang arsitektur microservices / monolithic clean architecture.\n• Memiliki kemampuan problem solving yang kuat dan komunikasi yang baik.', 'https://forms.gle/isaCareerFullstack2026', 'published', '2026-09-01 02:00:00', NULL, 2, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(2, 2, 'Recruitment & Talent Acquisition Specialist', 'Gading Serpong, Tangerang', 'Full Time', 'Bertanggung jawab mengelola seluruh siklus proses rekrutmen dari perencanaan kebutuhan tenaga kerja hingga proses onboarding karyawan baru.', '• Menyusun strategi pencarian kandidat (sourcing) melalui LinkedIn, job portal, dan jaringan profesional.\n• Melakukan screening CV, wawancara psikologis/kompetensi, dan koordinasi interview dengan user.\n• Mengelola proses psikotes, background check, dan penawaran kerja (offering letter).\n• Menyusun laporan berkala metriks rekrutmen (time-to-hire, cost-per-hire).', '• Pendidikan S1 Psikologi / Manajemen SDM.\n• Pengalaman minimal 2 tahun di bidang Talent Acquisition (diutamakan dari industri manufaktur/otomotif/tech).\n• Menguasai alat tes psikologi dan teknik wawancara berbasis kompetensi (BEI).\n• Memiliki interpersonal skill yang sangat baik dan berpenampilan rapi.', 'https://forms.gle/isaCareerRecruitment2026', 'published', '2026-09-10 03:00:00', NULL, 2, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(3, 3, 'Digital Marketing & Content Officer', 'Gading Serpong, Tangerang', 'Full Time', 'Mengelola kampanye pemasaran digital, pembuatan konten kreatif sosial media, dan meningkatkan brand awareness produk Asuka & Mirai.', '• Merencanakan dan merilis konten harian untuk Instagram, TikTok, YouTube, dan LinkedIn perusahaan.\n• Mengelola kampanye iklan berbayar (Meta Ads, Google Ads, TikTok Ads) untuk peningkatan lead penjualan.\n• Memantau tren industri otomotif dan menganalisis performa konten menggunakan tools analytics.', '• Pendidikan S1 Ilmu Komunikasi / Pemasaran / DKV / sejenis.\n• Pengalaman minimal 1-2 tahun di bidang Digital Marketing.\n• Menguasai copywriting, desain grafis dasar (Canva/Adobe Photoshop), dan pembuatan video pendek.\n• Familiar dengan pengelolaan budget iklan digital.', 'https://forms.gle/isaCareerDigitalMarketing2026', 'published', '2026-09-12 04:30:00', NULL, 3, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(4, 4, 'Accounting & Tax Staff', 'Gading Serpong, Tangerang', 'Full Time', 'Mengelola pencatatan transaksi keuangan harian, verifikasi dokumen invoice, dan pelaporan perpajakan berkala perusahaan.', '• Melakukan input jurnal umum, kas kecil, dan rekonsiliasi bank harian.\n• Menyiapkan laporan pajak bulanan (PPN, PPh 21, PPh 23, PPh 4 ayat 2) dan SPT Masa.\n• Memeriksa kelengkapan berkas tagihan supplier dan proses pembayarannya.\n• Menyusun draft laporan keuangan bulanan untuk ditinjau oleh Finance Manager.', '• Pendidikan D3/S1 Akuntansi / Perpajakan.\n• Pengalaman minimal 1-2 tahun di posisi Akuntansi/Pajak (Fresh Graduate berprestasi dipersilakan melamar).\n• Memiliki sertifikat Brevet A & B menjadi nilai tambah utama.\n• Menguasai Microsoft Excel lanjutan (VLOOKUP, Pivot Table, Formula Keuangan).', 'https://forms.gle/isaCareerAccounting2026', 'published', '2026-09-15 01:00:00', NULL, 3, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(5, 1, 'UI/UX Designer Intern', 'Gading Serpong, Tangerang / Remote', 'Internship', 'Program magang bagi mahasiswa/fresh graduate yang ingin belajar dan berkontribusi langsung dalam perancangan antarmuka aplikasi web dan seluler.', '• Membantu pembuatan wireframe, mockup, dan prototype interaktif menggunakan Figma.\n• Melakukan riset pengguna dasar dan usability testing untuk fitur-fitur baru website karir dan internal.\n• Berkolaborasi dengan tim front-end developer dalam menyiapkan asset desain.', '• Mahasiswa tingkat akhir atau fresh graduate S1 DKV / Sistem Informasi / sejenis.\n• Memiliki portofolio desain UI/UX (Figma / Adobe XD).\n• Memahami prinsip dasar User-Centered Design, typography, dan warna.\n• Bersedia mengikuti program magang minimal 6 bulan.', 'https://forms.gle/isaCareerUIUXIntern2026', 'published', '2026-09-18 07:00:00', NULL, 3, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(6, 5, 'Supply Chain & Warehouse Supervisor', 'Kawasan Industri Cikupa, Tangerang', 'Full Time', 'Pengawasan operasional penerimaan, penyimpanan, dan pengiriman barang aksesoris otomotif di gudang pusat.', '• Mengatur alur stok barang masuk dan keluar gudang agar sesuai dengan dokumen Surat Jalan / PO.\n• Melakukan stock opname rutin bulanan dan menjaga akurasi persediaan barang.\n• Mengawasi kinerja tim staf gudang dan driver pengiriman.', '• Pendidikan D3/S1 Teknik Industri / Manajemen Logistik / sejenis.\n• Pengalaman minimal 3 tahun sebagai Supervisor Gudang/Logistik.\n• Menguasai sistem WMS (Warehouse Management System) atau ERP.\n• Bersedia ditempatkan di area pergudangan Cikupa Tangerang.', 'https://forms.gle/isaCareerSupplyChain2026', 'published', '2026-09-20 03:00:00', NULL, 2, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(7, 1, 'Mobile App Developer (On the Job Training)', 'Gading Serpong, Tangerang', 'OJT', 'Program pelatihan langsung bagi calon developer muda untuk mempelajari pengembangan aplikasi head unit Android otomotif.', '• Mengikuti alur bimbingan teknik dari Senior Developer.\n• Membantu pembuatan modul fitur Android native/Flutter untuk sistem in-car entertainment.\n• Menguji coba kestabilan aplikasi pada unit hardware sesungguhnya.', '• Pendidikan Minimal SMK/D3/S1 Jurusan RPL, Computer Science, atau sejenis.\n• Menguasai dasar pemrograman Java / Kotlin / Dart (Flutter).\n• Semangat belajar tinggi dan tertarik dengan dunia teknologi elektronik otomotif.', 'https://forms.gle/isaCareerMobileOJT2026', 'published', '2026-09-21 02:00:00', NULL, 3, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(8, 3, 'B2B Sales Executive (Automotive Products)', 'Jakarta & Tangerang Area', 'Full Time', 'Mengembangkan jaringan kemitraan dengan dealer mobil, bengkel variasi, dan distributor resmi otomotif.', '• Melakukan kunjungan prospeksi ke dealer dan bengkel otomotif di wilayah target.\n• Mempresentasikan keunggulan produk Asuka Car TV & Mirai kepada calon mitra usaha.\n• Mencapai target penjualan bulanan yang telah ditetapkan perusahaan.', '• Pendidikan Minimal SMA/D3/S1 semua jurusan.\n• Pengalaman minimal 2 tahun di bidang Sales B2B (diutamakan bidang aftermarket otomotif).\n• Memiliki SIM A / SIM C aktif dan kendaraan pribadi.\n• Berjiwa pantang menyerah, komunikatif, dan memiliki jaringan luas.', 'https://forms.gle/isaCareerB2BSales2026', 'draft', NULL, NULL, 2, '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(9, 1, 'Frontend Developer (React.js)', NULL, 'Full Time', 'Dibutuhkan Frontend Developer mahir React.js', NULL, NULL, NULL, 'draft', NULL, NULL, 3, '2026-09-25 07:37:13', '2026-09-25 07:37:13'),
(10, 1, 'Automation QA Engineer', NULL, 'Full Time', 'Pengujian otomatis REST API dan UI', NULL, NULL, NULL, 'draft', NULL, NULL, 3, '2026-09-25 08:19:31', '2026-09-25 08:19:31');

-- --------------------------------------------------------

--
-- Struktur dari tabel `programs`
--

CREATE TABLE `programs` (
  `id` int(11) NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nama program (misal: Internship Program)',
  `slug` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'URL-friendly identifier (unique)',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Deskripsi lengkap program',
  `requirements` text COLLATE utf8mb4_unicode_ci COMMENT 'Persyaratan mengikuti program',
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Path/URL gambar program',
  `registration_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL Google Form / link pendaftaran',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'Status tampil di publik',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Program khusus: Internship, Management Trainee, OJT, dll.';

--
-- Dumping data untuk tabel `programs`
--

INSERT INTO `programs` (`id`, `title`, `slug`, `description`, `requirements`, `image`, `registration_url`, `status`, `created_at`, `updated_at`) VALUES
(1, 'ISA Management Trainee Program 2026', 'management-trainee-2026', 'Program percepatan karir komprehensif selama 12 bulan yang dirancang untuk menyiapkan talenta-talenta muda berbakat menjadi pemimpin masa depan di PT. Intersis Sejahtera Abadi. Peserta akan rotasi ke berbagai divisi strategis dan dibimbing langsung oleh jajaran manajemen senior.', '1. Lulusan S1/S2 dari Universitas terkemuka (IPK min 3.25).\n2. Usia maksimal 25 tahun untuk S1 dan 27 tahun untuk S2.\n3. Berjiwa kepemimpinan kuat, aktif dalam organisasi kemahasiswaan.\n4. Bersedia rotasi ke seluruh cabang operational perusahaan.', '/uploads/programs/mt_2026.jpg', 'https://forms.gle/isaProgramMT2026', 'active', '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(2, 'ISA NextGen Internship Experience', 'nextgen-internship', 'Pengalaman magang intensif selama 3-6 bulan bagi mahasiswa aktif untuk terlibat langsung dalam pengerjaan proyek nyata perusahaan. Peserta magang mendapatkan uang saku kompetitif, sertifikat resmi, dan peluang direkrut menjadi karyawan tetap.', '1. Mahasiswa aktif minimal semester 5 atau 7 dari semua jurusan yang relevan.\n2. Bersedia magang secara full-time (Senin-Jumat).\n3. Memiliki motivasi belajar tinggi, proaktif, dan dapat bekerjasama dalam tim.', '/uploads/programs/internship.jpg', 'https://forms.gle/isaProgramIntern2026', 'active', '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(3, 'Automotive Technical OJT Program', 'automotive-technical-ojt', 'Program Pelatihan Kerja Lapangan (On the Job Training) khusus lulusan SMK/D3 Teknik Elektro, Otomotif, dan Mekatronika untuk menguasai instalasi dan perawatan sistem audio video otomotif canggih.', '1. Lulusan SMK/D3 jurusan Teknik Otomotif, Elektro, atau Mekatronika.\n2. Memahami dasar-dasar kelistrikan kendaraan.\n3. Teliti, disiplin, dan mengutamakan keselamatan kerja (K3).', '/uploads/programs/ojt_tech.jpg', 'https://forms.gle/isaProgramOJT2026', 'active', '2026-09-25 07:34:29', '2026-09-25 07:34:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nama lengkap pengguna',
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Username unik untuk login',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email unik untuk login',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Password terenkripsi (bcrypt)',
  `role` enum('administrator','hrd','staff') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'staff' COMMENT 'Hak akses: administrator > hrd > staff',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'Status akun pengguna',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Akun internal HRD: Administrator, HRD, Staff HRD';

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Administrator ISA', 'administrator', 'admin@isa.co.id', '$2b$10$SvUmPqC1WlPrJZPpW9eOJOeUGmcxCoVdKo2U1IozUr5Y3CjJ0P4ai', 'administrator', 'active', '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(2, 'Budi Santoso, S.Psi', 'hrd_manager', 'hrd@isa.co.id', '$2b$10$LPxUmfYATiGFYdWLcWXI0u3gEfMyNjdWlHWOBA0hjtjpSsayriItK', 'hrd', 'active', '2026-09-25 07:34:29', '2026-09-25 07:34:29'),
(3, 'Siti Rahmawati', 'staff_hrd', 'staff.hrd@isa.co.id', '$2b$10$coY10sU/Mkz8WgtB5QCRLOAaCN3XiBHMcxJLjFbtilVwpcmTKOpmu', 'staff', 'active', '2026-09-25 07:34:29', '2026-09-25 07:34:29');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_activity_logs_user_id` (`user_id`),
  ADD KEY `idx_activity_logs_action` (`action`),
  ADD KEY `idx_activity_logs_module` (`module`),
  ADD KEY `idx_activity_logs_created_at` (`created_at`);

--
-- Indeks untuk tabel `benefits`
--
ALTER TABLE `benefits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_benefits_status` (`status`),
  ADD KEY `idx_benefits_sort_order` (`sort_order`);

--
-- Indeks untuk tabel `company_profile`
--
ALTER TABLE `company_profile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_company_profile_users` (`updated_by`);

--
-- Indeks untuk tabel `contact_recruitment`
--
ALTER TABLE `contact_recruitment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contact_recruitment_users` (`updated_by`);

--
-- Indeks untuk tabel `core_values`
--
ALTER TABLE `core_values`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_core_values_status` (`status`),
  ADD KEY `idx_core_values_sort_order` (`sort_order`);

--
-- Indeks untuk tabel `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_faqs_status` (`status`),
  ADD KEY `idx_faqs_sort_order` (`sort_order`);

--
-- Indeks untuk tabel `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_gallery_status` (`status`),
  ADD KEY `idx_gallery_category` (`category`),
  ADD KEY `fk_gallery_users` (`created_by`);

--
-- Indeks untuk tabel `job_categories`
--
ALTER TABLE `job_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_job_categories_status` (`status`);

--
-- Indeks untuk tabel `job_vacancies`
--
ALTER TABLE `job_vacancies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_job_vacancies_status` (`status`),
  ADD KEY `idx_job_vacancies_category_id` (`category_id`),
  ADD KEY `idx_job_vacancies_employment_type` (`employment_type`),
  ADD KEY `idx_job_vacancies_location` (`location`),
  ADD KEY `fk_job_vacancies_users` (`created_by`);

--
-- Indeks untuk tabel `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_programs_slug` (`slug`),
  ADD KEY `idx_programs_status` (`status`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_username` (`username`),
  ADD UNIQUE KEY `uq_users_email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `benefits`
--
ALTER TABLE `benefits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `company_profile`
--
ALTER TABLE `company_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `contact_recruitment`
--
ALTER TABLE `contact_recruitment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `core_values`
--
ALTER TABLE `core_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `job_categories`
--
ALTER TABLE `job_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `job_vacancies`
--
ALTER TABLE `job_vacancies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `programs`
--
ALTER TABLE `programs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_activity_logs_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `company_profile`
--
ALTER TABLE `company_profile`
  ADD CONSTRAINT `fk_company_profile_users` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `contact_recruitment`
--
ALTER TABLE `contact_recruitment`
  ADD CONSTRAINT `fk_contact_recruitment_users` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `gallery`
--
ALTER TABLE `gallery`
  ADD CONSTRAINT `fk_gallery_users` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `job_vacancies`
--
ALTER TABLE `job_vacancies`
  ADD CONSTRAINT `fk_job_vacancies_category` FOREIGN KEY (`category_id`) REFERENCES `job_categories` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_job_vacancies_users` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
