-- ════════════════════════════════════════════════════════════════════════════
-- MIGRATION & REALIGNMENT SCRIPT: PT. GLOBAL PHILSONIC TECHNOLOGIES (BATAM FTZ)
-- Replaces all old dummy data with actual website content
-- ════════════════════════════════════════════════════════════════════════════

USE `isa_career_hrd`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Alter contact_recruitment to support dynamic Google Map fields
ALTER TABLE `contact_recruitment`
  ADD COLUMN IF NOT EXISTS `maps_latitude` VARCHAR(50) DEFAULT '1.1368003',
  ADD COLUMN IF NOT EXISTS `maps_longitude` VARCHAR(50) DEFAULT '104.0452514',
  ADD COLUMN IF NOT EXISTS `maps_place_name` VARCHAR(255) DEFAULT 'GLOBAL PHILSONIC TECHNOLOGIES',
  ADD COLUMN IF NOT EXISTS `maps_url` VARCHAR(500) DEFAULT 'https://www.google.com/maps/place/GLOBAL+PHILSONIC+TECHNOLOGIES/@1.137263,104.045233,435m/data=!3m1!1e3!4m6!3m5!1s0x31d98900364038b5:0xf424af624a151322!8m2!3d1.1368003!4d104.0452514!16s%2Fg%2F11z007pkw1?hl=id',
  ADD COLUMN IF NOT EXISTS `maps_embed_url` TEXT;

-- 2. Create site_settings table for Home Page & Public Layout content
CREATE TABLE IF NOT EXISTS `site_settings` (
  `key_name` VARCHAR(100) NOT NULL PRIMARY KEY,
  `content_json` LONGTEXT NOT NULL,
  `updated_by` INT(11) DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Reset & Seed company_profile
TRUNCATE TABLE `company_profile`;
INSERT INTO `company_profile` (`id`, `title`, `description`, `vision`, `mission`, `about_image`, `updated_by`) VALUES
(
  1,
  'PT. Global Philsonic Technologies',
  'PT. Global Philsonic Technologies (GPT) adalah manufaktur perakitan elektronik presisi tinggi dan solusi otomasi industri terdepan yang beroperasi di Kawasan Bebas Batam (Free Trade Zone). Dengan fasilitas seluas 10.000 m² berstandar IATF 16949, kami memproduksi modul elektronik otomotif, headunit QLED pintar, sistem prosesor audio DSP, perangkat sensor keselamatan berkendara, dan jig uji fungsional otomatis berkecepatan 80.000 CPH.',
  'Menjadi mitra manufaktur Tier-1 elektronik otomotif dan rekayasa otomasi terpercaya di Asia Tenggara dengan standar mutu nol-cacat (Zero-Defect) serta efisiensi logistik bebas bea global.',
  '1. Menghasilkan perakitan SMT presisi tinggi dengan toleransi mikron sesuai standar otomotif internasional IATF 16949.\n2. Memberikan layanan OEM/ODM terintegrasi mulai dari DFM, prototyping kilat, hingga produksi massal dan box-build turnkey.\n3. Mengembangkan solusi rekayasa otomasi dan mesin jig uji pintar untuk memaksimalkan yield industri 4.0.\n4. Memanfaatkan keunggulan strategis Batam Free Trade Zone untuk menyediakan rantai pasok dan pengiriman bebas pajak 45 menit ke Singapura.',
  '/images/hero-smt.jpg',
  1
);

-- 4. Reset & Seed contact_recruitment with Batam location & Google Maps
TRUNCATE TABLE `contact_recruitment`;
INSERT INTO `contact_recruitment` (
  `id`, `email`, `phone`, `address`, `instagram`, `linkedin`, `whatsapp`,
  `maps_latitude`, `maps_longitude`, `maps_place_name`, `maps_url`, `maps_embed_url`, `updated_by`
) VALUES (
  1,
  'contact@philsonic.co.id',
  '+62 778 480 8888',
  'Cammo Industrial Park Blok B No. 8-10, Batam Center, Batam, Kepulauan Riau 29461 (Batam FTZ)',
  'https://instagram.com/philsonic.technologies',
  'https://linkedin.com/company/pt-global-philsonic-technologies',
  '+62 811 7700 888',
  '1.1368003',
  '104.0452514',
  'GLOBAL PHILSONIC TECHNOLOGIES',
  'https://www.google.com/maps/place/GLOBAL+PHILSONIC+TECHNOLOGIES/@1.137263,104.045233,435m/data=!3m1!1e3!4m6!3m5!1s0x31d98900364038b5:0xf424af624a151322!8m2!3d1.1368003!4d104.0452514!16s%2Fg%2F11z007pkw1?hl=id',
  'https://maps.google.com/maps?q=1.1368003,104.0452514+(GLOBAL%20PHILSONIC%20TECHNOLOGIES)&t=m&z=17&ie=UTF8&iwloc=B&output=embed',
  1
);

-- 5. Reset & Seed core_values
TRUNCATE TABLE `core_values`;
INSERT INTO `core_values` (`id`, `title`, `description`, `icon`, `sort_order`, `status`) VALUES
(1, 'Zero-Defect Quality Culture', 'Kepatuhan mutlak standar otomotif IATF 16949 & ISO 9001:2015 dengan inspeksi 100% 3D SPI, inline AOI, dan audit X-Ray.', 'award', 10, 1),
(2, 'Precision SMT Placement', 'Penempatan komponen pasif ukuran 0201 dan BGA fine-pitch berkecepatan 80.000 CPH dengan akurasi mikron tinggi.', 'cpu', 20, 1),
(3, 'Turnkey OEM & ODM Co-Development', 'Dukungan penuh dari review DFM, prototyping kilat, fabrikasi stensil laser, hingga perakitan box-build siap pasar.', 'settings', 30, 1),
(4, 'MES Barcode Traceability', 'Pelacakan digital end-to-end setiap komponen dan lot PCB dari gudang komponen hingga pengiriman produk jadi.', 'scan', 40, 1),
(5, 'In-House Automation Workshop', 'Fabrikasi mandiri jig mekanik CNC, ruang vakum pneumatik, dan fixture uji fungsional ICT/FCT.', 'wrench', 50, 1),
(6, 'Batam FTZ Strategic Logistics', 'Fasilitas kawasan bebas bea di Batam dengan rute feri kargo 45 menit langsung ke pelabuhan internasional Singapura.', 'truck', 60, 1);

-- 6. Reset & Seed gallery with Batam Facilities
TRUNCATE TABLE `gallery`;
INSERT INTO `gallery` (`id`, `title`, `description`, `image`, `category`, `event_date`, `status`, `created_by`) VALUES
(1, 'High-Speed SMT Modular Placement Lines', 'High-precision dual-beam Yamaha YSM20R mounters capable of 80,000 CPH, placing 0201 passives, fine-pitch BGA, and automotive microcontrollers.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80', 'SMT Lines', '2026-02-15', 'active', 1),
(2, '10-Zone Nitrogen Convection Reflow Oven', 'Automotive grade reflow soldering with real-time KIC thermal profiling, O2 ppm control (<100 ppm), ensuring zero-voiding on critical power electronics.', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80', 'SMT Lines', '2026-03-01', 'active', 1),
(3, 'ISO Class 8 (100K) Static-Controlled Cleanroom', 'Dedicated dust-free environment with continuous ESD floor grounding, positive air pressure, HEPA filtration, and strict temperature stability.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80', 'Cleanroom Class 100K', '2026-03-10', 'active', 1),
(4, '3D Solder Paste Inspection (SPI) & 3D AOI Station', 'Inline 3D moire fringe metrology measuring solder volume, height, and offset down to micron level before reflow.', 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=80', 'QA & Lab Testing', '2026-03-18', 'active', 1),
(5, 'In-House CNC Mechanical Tooling & Jig Fabrication', 'Haas 4-axis machining centers and precision drill presses crafting custom ESD-safe Bakelite and POM-C test fixtures.', 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1000&q=80', 'Workshop Otomasi', '2026-04-05', 'active', 1),
(6, 'High-Resolution 2D/3D X-Ray Non-Destructive Inspection', '160 kV microfocus open-tube X-ray inspection for detecting solder voids under BGA balls, QFN pads, and wire bond integrity.', 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1000&q=80', 'QA & Lab Testing', '2026-04-12', 'active', 1),
(7, 'Environmental Thermal Shock & Burn-In Chamber', 'Rapid temperature cycling from -40°C to +125°C under continuous operational electrical load to stress-test solder joint durability.', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80', 'QA & Lab Testing', '2026-05-02', 'active', 1),
(8, 'Batam Free Trade Zone Plant & Bonded Logistics Staging', 'Strategic 10,000 m² manufacturing hub situated 45 minutes by fast sea freight from Singapore port, featuring bonded customs clearance.', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', 'Gedung & Logistik', '2026-05-20', 'active', 1);

-- 7. Reset & Seed job_categories
TRUNCATE TABLE `job_categories`;
INSERT INTO `job_categories` (`id`, `name`, `description`, `status`) VALUES
(1, 'Engineering', 'SMT process engineering, DFM analysis, and hardware PCB layout', 1),
(2, 'Otomasi & Tooling', 'Custom pneumatic jigs, test automation beds, and Haas CNC machining', 1),
(3, 'QA / QC', 'IATF quality inspection gates, 3D SPI/AOI, and reliability testing', 1),
(4, 'Produksi', 'SMT line operation, cleanroom assembly, and machine maintenance', 1),
(5, 'Magang (Internship)', 'Program magang 6 bulan bersertifikat untuk mahasiswa teknik', 1);

-- 8. Reset & Seed job_vacancies
TRUNCATE TABLE `job_vacancies`;
INSERT INTO `job_vacancies` (
  `id`, `category_id`, `title`, `location`, `employment_type`,
  `description`, `responsibilities`, `requirements`, `form_url`,
  `status`, `published_at`, `created_by`
) VALUES
(
  1, 1, 'Senior SMT Process Engineer', 'Batam FTZ Plant', 'FullTime',
  'Lead solder paste printing optimization, reflow profile validation, and Yamaha YSM20R feeder setup to achieve zero-defect yields under IATF 16949 automotive standards.',
  '• Melakukan kalkulasi DFM & optimasi stencil printing\n• Mengatur profil suhu reflow nitrogen 10-zone\n• Menangani root-cause analysis cacat SPI dan AOI 3D',
  '• S1 Teknik Elektro, Elektronika, atau Mekatronika\n• Pengalaman minimal 3 tahun di lini perakitan SMT kecepatan tinggi\n• Memahami standar IPC-A-610 Class 3 & IATF 16949',
  'https://wa.me/628117700888?text=Halo%20HRD%20GPT,%20saya%20tertarik%20melamar%20posisi%20Senior%20SMT%20Process%20Engineer.',
  'published', CURRENT_TIMESTAMP, 1
),
(
  2, 2, 'Test Automation & PLC Programmer', 'Batam FTZ Plant', 'FullTime',
  'Design, write firmware, and debug custom pneumatic test fixtures and functional test beds using Omron Sysmac, Mitsubishi PLC, and Python/LabVIEW instrumentation.',
  '• Merancang ladder logic PLC & sistem akuisisi data sensor\n• Membangun fixture uji pneumatik kustom dengan katup Festo/SMC\n• Mengintegrasikan protokol CAN, LIN, dan RS485 pada jig ICT',
  '• D3/S1 Mekatronika, Otomasi, atau Teknik Komputer\n• Pengalaman pemrograman PLC & pengujian kelistrikan otomotif\n• Mampu membaca skematik pneumatik dan mekanik 2D/3D',
  'https://wa.me/628117700888?text=Halo%20HRD%20GPT,%20saya%20tertarik%20melamar%20posisi%20Test%20Automation%20PLC%20Programmer.',
  'published', CURRENT_TIMESTAMP, 1
),
(
  3, 3, 'QA Engineer - Automotive', 'Batam FTZ Plant', 'FullTime',
  'Oversee incoming, in-process, and outgoing PCBA quality gate inspections, X-ray BGA analysis, and manage non-conformance 8D corrective action reports for OEM clients.',
  '• Memimpin inspeksi gerbang mutu SMT (SPI, AOI, X-Ray)\n• Menyusun laporan korektif 8D untuk pelanggan Tier-1 internasional\n• Mengawal audit berkala ISO 9001 & IATF 16949',
  '• D3/S1 Teknik Industri atau Manajemen Mutu\n• Sertifikasi IPC-A-610 Specialist diutamakan\n• Kemampuan bahasa Inggris tertulis & lisan aktif',
  'https://wa.me/628117700888?text=Halo%20HRD%20GPT,%20saya%20tertarik%20melamar%20posisi%20QA%20Engineer%20Automotive.',
  'published', CURRENT_TIMESTAMP, 1
),
(
  4, 4, 'SMT Production Shift Supervisor', 'Batam FTZ Plant', 'FullTime',
  'Direct shift line operators, coordinate line changeovers, enforce 5S cleanroom disciplines, and ensure daily manufacturing targets and OEE KPIs are surpassed.',
  '• Mengkoordinasikan pergantian setup lini perakitan komponen\n• Memastikan penegakan disiplin ESD dan 5S cleanroom\n• Mencapai target OEE dan target output produksi harian',
  '• Pengalaman minimal 3 tahun sebagai supervisor di industri PCBA\n• Kepemimpinan kuat & siap bekerja dalam sistem shift Batam',
  'https://wa.me/628117700888?text=Halo%20HRD%20GPT,%20saya%20tertarik%20melamar%20posisi%20SMT%20Production%20Supervisor.',
  'published', CURRENT_TIMESTAMP, 1
),
(
  5, 2, 'CNC Tooling & Fixture Technician', 'Batam FTZ Plant', 'FullTime',
  'Operate Haas 4-axis CNC milling centers to fabricate custom Bakelite and POM-C test nests, perform preventative maintenance on pneumatic actuators and probe pins.',
  '• Mengoperasikan mesin CNC Haas untuk pemotongan Bakelite ESD\n• Melakukan kalibrasi jarum uji kelistrikan (ICT probe pins)\n• Merawat aktuator pneumatik dan nesting mekanik',
  '• SMK Mesin atau D3 Teknik Mesin / Perkakas Presisi\n• Mampu membaca gambar teknik CAD (SolidWorks/AutoCAD)',
  'https://wa.me/628117700888?text=Halo%20HRD%20GPT,%20saya%20tertarik%20melamar%20posisi%20CNC%20Tooling%20Technician.',
  'published', CURRENT_TIMESTAMP, 1
),
(
  6, 5, 'Engineering & IoT Smart Factory Internship (6 Bulan)', 'Batam FTZ Plant', 'Internship',
  'Program magang terstruktur 6 bulan untuk mahasiswa Politeknik / Universitas dalam bidang SMT Process, MES Industry 4.0 Telemetry, atau Embedded Firmware Testing.',
  '• Membantu engineer senior dalam pengujian jalur PCBA\n• Menganalisis data telemetri MES dan efisiensi lini SMT\n• Terlibat langsung dalam proyek otomatisasi industri',
  '• Mahasiswa aktif semester 5-8 Teknik Elektro, Mesin, atau Informatika\n• Diberikan uang saku bulanan, sertifikat, dan peluang kerja tetap',
  'https://wa.me/628117700888?text=Halo%20HRD%20GPT,%20saya%20tertarik%20mendaftar%20Program%20Magang%20Engineering%20IoT.',
  'published', CURRENT_TIMESTAMP, 1
);

-- 9. Reset & Seed benefits
TRUNCATE TABLE `benefits`;
INSERT INTO `benefits` (`id`, `title`, `description`, `icon`, `image`, `sort_order`, `status`) VALUES
(1, 'Asuransi & Jaminan Kesehatan', 'BPJS Kesehatan & Ketenagakerjaan lengkap ditambah asuransi swasta rawat inap karyawan dan keluarga.', 'shield', NULL, 10, 1),
(2, 'Sertifikasi IPC & IATF Berbayar', 'Pelatihan resmi dan sertifikasi IPC-A-610 serta metodologi Six Sigma dibiayai penuh oleh perusahaan.', 'award', NULL, 20, 1),
(3, 'Fasilitas Modern ESD Cleanroom', 'Lingkungan kerja ber-AC dengan regulasi suhu dan proteksi ESD ISO Class 8 berstandar otomotif internasional.', 'cpu', NULL, 30, 1),
(4, 'Program Magang Bersertifikat', 'Uang saku bulanan, bimbingan langsung engineer senior, dan jalur prioritas rekrutmen karyawan tetap.', 'graduation-cap', NULL, 40, 1);

-- 10. Reset & Seed faqs
TRUNCATE TABLE `faqs`;
INSERT INTO `faqs` (`id`, `question`, `answer`, `sort_order`, `status`) VALUES
(1, 'Apa keunggulan memproduksi elektronik otomotif di Batam Free Trade Zone (FTZ)?', 'Batam Free Trade Zone memberikan fasilitas 0% bea masuk untuk impor bahan baku dan komponen elektronik, pembebasan PPN/PPnBM, serta efisiensi waktu logistik laut hanya 45 menit menuju pelabuhan internasional Singapura.', 10, 1),
(2, 'Apakah PT. Global Philsonic Technologies melayani pesanan kustom OEM dan ODM?', 'Ya, kami menyediakan layanan OEM/ODM lengkap, mulai dari perancangan skematik PCB, peninjauan DFM, prototipe cepat 10-50 unit, pembuatan tooling stensil laser, hingga perakitan massal berkecepatan 80.000 CPH dan box-build turnkey.', 20, 1),
(3, 'Sertifikasi mutu apa saja yang dimiliki oleh pabrik GPT?', 'Pabrik kami beroperasi penuh dengan sertifikasi otomotif IATF 16949:2016, sistem manajemen mutu ISO 9001:2015, dan kepatuhan operator berstandar IPC-A-610 Class 3.', 30, 1),
(4, 'Bagaimana proses pengajuan penawaran resmi (RFQ) untuk proyek perakitan?', 'Anda dapat menghubungi tim sales engineering kami melalui formulir kontak atau tombol WhatsApp B2B di halaman Produk dengan melampirkan file Gerber, Bill of Materials (BOM), dan estimasi volume kebutuhan.', 40, 1);

-- 11. Seed initial site_settings (Home Hero, Stats, CTA, Products)
INSERT INTO `site_settings` (`key_name`, `content_json`, `updated_by`) VALUES
(
  'home_hero',
  '{
    "slides": [
      {
        "title": "Presisi Manufaktur Elektronik Otomotif Batam FTZ",
        "subtitle": "Perakitan SMT berkecepatan 80.000 CPH, modul smart headunit Tier-1, dan sistem DSP audio bersertifikasi IATF 16949 di Kawasan Perdagangan Bebas Batam.",
        "ctaPrimary": "Jelajahi Produk & Kapabilitas",
        "ctaSecondary": "Hubungi Sales Engineering",
        "tag": "Fasilitas FTZ 10.000 m² & Bebas Bea Masuk",
        "bgImage": "/images/hero-smt.jpg"
      },
      {
        "title": "Solusi Turnkey OEM / ODM & Otomasi Mesin Uji",
        "subtitle": "Dari evaluasi DFM, prototipe kilat, hingga perakitan massal box-build dengan jaminan mutu nol-cacat dan transit cepat 45 menit ke Singapura.",
        "ctaPrimary": "Permintaan Penawaran (RFQ)",
        "ctaSecondary": "Konsultasi Teknis B2B",
        "tag": "Inspeksi 100% 3D SPI, Inline AOI & X-Ray",
        "bgImage": "/images/hero-wave.jpg"
      }
    ],
    "typewriterTexts": [
      "Elektronik Otomotif",
      "Perakitan SMT Presisi",
      "Otomasi Industri",
      "Partner OEM / ODM"
    ]
  }',
  1
),
(
  'home_stats',
  '{
    "experience": { "value": 10, "suffix": "+", "label": "Tahun Pengalaman", "sublabel": "Manufaktur Presisi Tinggi" },
    "capacity": { "value": 80, "suffix": "K CPH", "label": "Kapasitas Lini SMT", "sublabel": "Mounter Yamaha & Panasonic" },
    "support": { "value": 24, "suffix": "/7", "label": "Dukungan Rekayasa", "sublabel": "Kolaborasi DFM & NPI Cepat" },
    "quality": { "value": 100, "suffix": "%", "label": "Jaminan Kualitas", "sublabel": "Standar IATF 16949 Otomotif" }
  }',
  1
),
(
  'home_cta',
  '{
    "title": "Siap Mewujudkan Proyek Elektronik Otomotif Anda?",
    "subtitle": "Diskusikan kebutuhan spesifikasi teknis, estimasi volume perakitan, dan penawaran biaya resmi bersama tim engineering kami di Batam FTZ.",
    "btnText": "Mulai Diskusi Proyek B2B",
    "btnUrl": "/contact"
  }',
  1
)
ON DUPLICATE KEY UPDATE `content_json` = VALUES(`content_json`);

SET FOREIGN_KEY_CHECKS = 1;


