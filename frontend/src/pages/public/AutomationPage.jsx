import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RobotCanvas3D from '../../components/automation/RobotCanvas3D';
import './AutomationPage.css';

// ── Images from user's authentic robot assets ──
import weldingImg from '../../assets/robot_welding.png';
import handlingImg from '../../assets/robot_handling.png';
import cuttingImg from '../../assets/robot_cutting.png';

// ════════════════════════════════════════════════════════════════════════════
// ROBOT PRODUCTS DATA WITH 4 SCROLLYTELLING CHAPTERS
// ════════════════════════════════════════════════════════════════════════════
const ROBOTS = [
  {
    id: 'welding',
    tabEn: 'Robot Welding',
    tabId: 'Robot Welding',
    titleEn: 'Robot Welding Series',
    titleId: 'Seri Robot Welding',
    image: weldingImg,
    heroStats: [
      { val: '6-Axis', labelEn: 'Kinematics', labelId: 'Kinematika' },
      { val: '±0.04 mm', labelEn: 'Repeatability', labelId: 'Akurasi Ulang' },
      { val: '2,010 mm', labelEn: 'Max Reach', labelId: 'Jangkauan Maks' },
      { val: '20 kg', labelEn: 'Payload', labelId: 'Kapasitas Beban' },
    ],
    steps: [
      {
        kickerEn: '01 / OVERVIEW & CAPABILITY',
        kickerId: '01 / IKHTISAR & KAPABILITAS',
        titleEn: 'Industrial High-Speed Arc & Spot Welding Automation',
        titleId: 'Otomasi Pengelasan Busur & Titik Presisi Kecepatan Tinggi',
        descEn:
          'Engineered for 24/7 demanding production lines. Our robotic welding systems eliminate weld spatter, guarantee uniform bead penetration, and achieve structural repeatability across automotive frames, heavy chassis, and aluminum enclosures.',
        descId:
          'Dirancang untuk lini produksi berstandar industri 24/7. Sistem pengelasan robotik kami meminimalkan percikan, menjamin penetrasi kampuh yang seragam, dan menghasilkan kekuatan struktural konsisten pada rangka otomotif, sasis baja berat, hingga housing aluminium.',
        highlights: [
          { en: 'Automotive & Shipyard Heavy Steel Grade', id: 'Standar Industri Otomotif & Galangan Baja' },
          { en: 'Consistent Penetration & Low Heat Distortion', id: 'Penetrasi Seragam & Distorsi Panas Rendah' },
          { en: 'Integrated Digital Waveform Control', id: 'Kontrol Bentuk Gelombang Digital Terintegrasi' },
        ],
        tags: ['MIG / MAG', 'TIG Pulse', 'Arc Welding', 'Spot Welding', 'Aluminum / SS / Carbon'],
      },
      {
        kickerEn: '02 / KINEMATICS & REACH ENVELOPE',
        kickerId: '02 / KINEMATIKA & AREA JANGKAUAN',
        titleEn: '6-Axis Articulated Geometry for Tight Complex Seams',
        titleId: 'Geometri Artikulasi 6-Sumbu untuk Sudut Kampuh Sempit',
        descEn:
          'Equipped with hollow-wrist architecture to route welding torch cables internally. The 1,440 mm to 2,010 mm hemispherical reach envelope allows uninterrupted 360° rotational seam tracking around circular pipes and recessed automotive floor pans.',
        descId:
          'Dilengkapi konstruksi hollow-wrist untuk perlindungan kabel internal obor las. Radius kerja hemisfer 1.440 mm hingga 2.010 mm memungkinkan penelusuran kampuh las kontinu 360° pada pipa sirkular dan kompartemen rangka sempit tanpa risiko puntiran kabel.',
        highlights: [
          { en: 'High-Torque AC Synchronous Servomotors', id: 'Motor Servo Sinkron Torsi Tinggi' },
          { en: 'Backlash-Free Harmonic & RV Cycloidal Reducers', id: 'Reduser Sikloidal RV Bebas Backlash' },
          { en: 'Dynamic Vibration Suppression Filtering', id: 'Filter Peredam Getaran Dinamis' },
        ],
        tags: ['Reach: 2,010 mm', 'Payload: 6 – 20 kg', 'Repeatability: ±0.04 mm', 'Hollow Wrist'],
      },
      {
        kickerEn: '03 / TOOLING & PROCESS CONTROL',
        kickerId: '03 / PERKAKAS & KONTROL PROSES',
        titleEn: 'Precision MIG/TIG Torch, Digital Inverter & Push-Pull Feeder',
        titleId: 'Obor Las Presisi MIG/TIG, Inverter Digital & Pengumpan Push-Pull',
        descEn:
          'The end-effector features an anti-spatter brass gas cup, water-cooled torch neck, and high-frequency digital arc control. Dual push-pull wire feeding guarantees smooth feeding even for soft aluminum wires with zero bird-nesting.',
        descId:
          'End-effector dilengkapi gas cup kuningan anti-spatter, leher obor pendingin air, dan kontrol busur digital frekuensi tinggi. Sistem pengumpan kawat push-pull ganda memastikan kelancaran kawat aluminium lunak tanpa risiko macet atau kusut.',
        highlights: [
          { en: 'Push-Pull Wire Feeder with Optical Encoder', id: 'Pengumpan Push-Pull dengan Encoder Optik' },
          { en: 'Anti-Collision Breakaway Safety Mount', id: 'Dudukan Pengaman Anti-Tabrakan Breakaway' },
          { en: 'Auto Torch Cleaner & Wire-Cutter Station', id: 'Stasiun Pembersih Obor & Pemotong Kawat Otomatis' },
        ],
        tags: ['Water-Cooled Torch', 'Push-Pull Feed', 'Anti-Spatter Nozzle', 'Arc Voltage Control'],
      },
      {
        kickerEn: '04 / TECHNICAL SPECS & INTEGRATION',
        kickerId: '04 / SPESIFIKASI TEKNIS & INTEGRASI',
        titleEn: 'Fieldbus Connectivity & Full Plant Integration',
        titleId: 'Konektivitas Fieldbus & Integrasi Penuh Sistem Pabrik',
        descEn:
          'Seamlessly plugs into your MES Industry 4.0 architecture via EtherCAT or PROFINET. Real-time logging of weld voltage, current, and wire consumption enables complete traceability for ISO/TS automotive compliance.',
        descId:
          'Terhubung langsung ke arsitektur MES Industri 4.0 pabrik Anda melalui EtherCAT atau PROFINET. Pencatatan telemetri tegangan, arus, dan konsumsi kawat secara real-time memberikan ketertelusuran penuh standar otomotif ISO/TS.',
        specs: [
          { labelEn: 'Number of Axes', labelId: 'Jumlah Sumbu', val: '6-Axis Articulated' },
          { labelEn: 'Working Radius', labelId: 'Radius Kerja', val: '1,440 – 2,010 mm' },
          { labelEn: 'Payload Capacity', labelId: 'Kapasitas Beban', val: '6 – 20 kg' },
          { labelEn: 'Pose Repeatability', labelId: 'Akurasi Pengulangan', val: '±0.04 mm' },
          { labelEn: 'Welding Speed', labelId: 'Kecepatan Las', val: '80 – 300 cm/min' },
          { labelEn: 'Communication Bus', labelId: 'Protokol Komunikasi', val: 'EtherCAT / PROFINET' },
          { labelEn: 'Protection Class', labelId: 'Kelas Perlindungan', val: 'IP54 / Anti-Spatter' },
          { labelEn: 'Safety Standards', labelId: 'Standar Keselamatan', val: 'ISO 10218-1 / CE / E-Stop' },
        ],
      },
    ],
  },
  {
    id: 'handling',
    tabEn: 'Robot Handling',
    tabId: 'Robot Handling',
    titleEn: 'Robot Handling Series',
    titleId: 'Seri Robot Handling',
    image: handlingImg,
    heroStats: [
      { val: '4 – 6 Axis', labelEn: 'Kinematics', labelId: 'Kinematika' },
      { val: '±0.02 mm', labelEn: 'Repeatability', labelId: 'Akurasi Ulang' },
      { val: '3,100 mm', labelEn: 'Max Reach', labelId: 'Jangkauan Maks' },
      { val: '250 kg', labelEn: 'Payload', labelId: 'Kapasitas Beban' },
    ],
    steps: [
      {
        kickerEn: '01 / OVERVIEW & CAPABILITY',
        kickerId: '01 / IKHTISAR & KAPABILITAS',
        titleEn: 'High-Throughput Material Handling & Machine Tending',
        titleId: 'Transfer Material & Otomasi Mesin Berkecepatan Tinggi',
        descEn:
          'From high-speed pick & place on surface-mount electronics to heavy palletizing of packaged goods, our handling robots run 24/7 without fatigue. Eliminate line bottlenecks and protect operators from repetitive strain injuries.',
        descId:
          'Dari pick & place berkecepatan tinggi pada lini perakitan elektronik hingga paletisasi muatan berat, robot handling kami beroperasi 24/7 tanpa henti. Menghilangkan bottleneck lini produksi dan menjaga keselamatan operator.',
        highlights: [
          { en: 'Ultra-Fast Cycle Times (< 0.37s standard motion)', id: 'Waktu Siklus Cepat (< 0,37 detik gerakan standar)' },
          { en: 'Payloads from 3 kg up to 250 kg Industrial Range', id: 'Kapasitas Beban dari 3 kg hingga 250 kg' },
          { en: 'Zero Fatigue 24/7 Continuous Automated Transfer', id: 'Operasional Kontinu 24/7 Tanpa Hambatan' },
        ],
        tags: ['Pick & Place', 'Palletizing', 'CNC Tending', 'Sorting', 'High-Speed Assembly'],
      },
      {
        kickerEn: '02 / KINEMATICS & REACH ENVELOPE',
        kickerId: '02 / KINEMATIKA & AREA JANGKAUAN',
        titleEn: 'Expansive Work Envelope with 13,000 mm/s Axis Velocity',
        titleId: 'Area Jangkauan Luas dengan Kecepatan Sumbu 13.000 mm/s',
        descEn:
          'Optimized arm link ratios enable lightning-fast point-to-point transfers across distances up to 3,100 mm. Advanced jerk-limited path planners ensure smooth acceleration curves that prevent parts from slipping out of grippers.',
        descId:
          'Rasio sambungan lengan yang dioptimalkan menghasilkan transfer point-to-point sangat cepat hingga jangkauan 3.100 mm. Algoritma perencanaan jalur bebas kejutan menjamin kurva akselerasi mulus agar komponen tidak bergeser dari gripper.',
        highlights: [
          { en: 'Advanced S-Curve Jerk-Limiting Trajectory', id: 'Trajektori S-Curve Halus Bebas Hentakan' },
          { en: 'Massive Reach up to 3,100 mm for Multi-Station Tending', id: 'Jangkauan hingga 3.100 mm untuk Multi-Stasiun' },
          { en: 'Heavy-Duty Reinforced Base Bearing Structure', id: 'Struktur Bantalan Base Heavy-Duty Diperkuat' },
        ],
        tags: ['Reach: 3,100 mm', 'Max Velocity: 13 m/s', 'Cycle Time: <0.37s', 'High Ingress IP67'],
      },
      {
        kickerEn: '03 / TOOLING & PROCESS CONTROL',
        kickerId: '03 / PERKAKAS & KONTROL PROSES',
        titleEn: 'Adaptive Parallel Grippers, Vacuum Cups & Vision Guidance',
        titleId: 'Gripper Paralel Adaptif, Suction Vakum & Panduan Kamera Visi',
        descEn:
          'Equipped with pneumatic parallel jaws, quick-change tool changers, and optional 2D/3D vision cameras. Integrated force-torque sensors detect part misalignments in real-time, preventing jamming in automated fixtures.',
        descId:
          'Dilengkapi rahang paralel pneumatik, pengganti alat otomatis (tool changer), dan opsi kamera 2D/3D vision. Sensor torsi-gaya terintegrasi mendeteksi posisi komponen secara real-time untuk mencegah kerusakan cetakan atau mesin.',
        highlights: [
          { en: 'Pneumatic Parallel Gripper with Rubber Friction Pads', id: 'Gripper Paralel Pneumatik Berbantalan Gesekan' },
          { en: 'Venturi Vacuum Generator with Part-Presence Sensor', id: 'Generator Vakum Venturi dengan Sensor Kehadiran' },
          { en: 'Smart 3D Vision AI Part Recognition Option', id: 'Opsi Pengenalan Objek AI Kamera 3D Pintar' },
        ],
        tags: ['Pneumatic Gripper', 'Vacuum Suction', 'Vision Guidance', 'Quick Tool Changer'],
      },
      {
        kickerEn: '04 / TECHNICAL SPECS & INTEGRATION',
        kickerId: '04 / SPESIFIKASI TEKNIS & INTEGRASI',
        titleEn: 'Scalable Controllers & Industrial Fieldbus Architecture',
        titleId: 'Pengendali Skalabel & Arsitektur Fieldbus Industri',
        descEn:
          'Pre-configured for plug-and-play connection with CNC lathes, milling centers, and conveyor sensors. Intuitive teach pendant interface enables rapid re-tooling in under 15 minutes for mixed-model production lines.',
        descId:
          'Terkonfigurasi siap pakai untuk integrasi cepat dengan mesin CNC, konveyor, dan sensor lini. Antarmuka teach pendant yang intuitif memungkinkan pergantian program produk dalam waktu kurang dari 15 menit.',
        specs: [
          { labelEn: 'Number of Axes', labelId: 'Jumlah Sumbu', val: '4 to 6 Axis' },
          { labelEn: 'Working Radius', labelId: 'Radius Kerja', val: '700 – 3,100 mm' },
          { labelEn: 'Payload Range', labelId: 'Rentang Beban', val: '3 – 250 kg' },
          { labelEn: 'Repeatability', labelId: 'Akurasi Pengulangan', val: '±0.02 mm' },
          { labelEn: 'Standard Cycle', labelId: 'Waktu Siklus', val: '< 0.37 s' },
          { labelEn: 'Communication Bus', labelId: 'Protokol Komunikasi', val: 'EtherCAT / PROFINET / Modbus' },
          { labelEn: 'Protection Class', labelId: 'Kelas Perlindungan', val: 'IP65 / IP67 (Wrist)' },
          { labelEn: 'Vision Support', labelId: 'Dukungan Visi', val: '2D / 3D Smart Camera' },
        ],
      },
    ],
  },
  {
    id: 'cutting',
    tabEn: 'Robot Cutting',
    tabId: 'Robot Cutting',
    titleEn: 'Robot Cutting Series',
    titleId: 'Seri Robot Cutting',
    image: cuttingImg,
    heroStats: [
      { val: '6-Axis', labelEn: 'Kinematics', labelId: 'Kinematika' },
      { val: '±0.5 mm', labelEn: 'Path Accuracy', labelId: 'Akurasi Jalur' },
      { val: '2,500 mm', labelEn: 'Max Reach', labelId: 'Jangkauan Maks' },
      { val: '200 mm', labelEn: 'Max Plate', labelId: 'Ketebalan Maks' },
    ],
    steps: [
      {
        kickerEn: '01 / OVERVIEW & CAPABILITY',
        kickerId: '01 / IKHTISAR & KAPABILITAS',
        titleEn: 'Heavy Industrial Plasma, Flame & 3D Laser Profile Cutting',
        titleId: 'Pemotongan Profil Plat Baja 3D Plasma, Api & Laser',
        descEn:
          'Engineered for structural steel fabrication, pressure vessel heads, and shipyard hull profiling. Handles bevel cuts up to ±45° and pierces plates up to 200 mm thickness with sharp dross-free edge quality.',
        descId:
          'Dirancang khusus untuk fabrikasi baja struktural, bejana tekan, dan pemotongan plat lambung kapal. Mampu melakukan pemotongan bevel miring hingga ±45° dan menembus plat hingga ketebalan 200 mm dengan tepi bersih bebas dross.',
        highlights: [
          { en: 'TrueHole & Beveling Accuracy for Bolt Holes', id: 'Akurasi Lubang Baut TrueHole & Beveling Mulus' },
          { en: 'Cuts Carbon Steel, Stainless Steel, & Aluminum', id: 'Memotong Baja Karbon, Stainless Steel, & Aluminium' },
          { en: 'Automated Kerf Compensation & Nesting CAD Import', id: 'Kompensasi Celah Otomatis & Import CAD Nesting' },
        ],
        tags: ['High-Def Plasma', 'Oxy-Fuel Flame', 'Fiber Laser', 'Pipe Beveling', 'Plate Piercing'],
      },
      {
        kickerEn: '02 / KINEMATICS & REACH ENVELOPE',
        kickerId: '02 / KINEMATIKA & AREA JANGKAUAN',
        titleEn: 'Extended Reach Geometry for Large Gantry & Pipe Stations',
        titleId: 'Geometri Jangkauan Luas untuk Gantry Besar & Pipa',
        descEn:
          'A long-reach 1,600 mm to 2,500 mm articulated arm mounted on gantry rails allows cutting across massive 12-meter steel plates. Continuous wrist rotation allows continuous beveling without stopping at sharp corners.',
        descId:
          'Lengan artikulasi jangkauan panjang 1.600 mm hingga 2.500 mm dapat dipasang pada rel gantry untuk memotong plat baja raksasa hingga panjang 12 meter. Rotasi pergelangan tanpa batas menghasilkan bevel sudut tajam tanpa henti.',
        highlights: [
          { en: 'Gantry Linear Rail Synchronization Ready', id: 'Sinkronisasi Siap Rel Linear Gantry' },
          { en: 'Sealed Rotary Joints Immune to Hot Slag & Dust', id: 'Sambungan Rotari Tersegel Tahan Terak Panas & Debu' },
          { en: 'Sub-Millimeter Contouring Accuracy Along 3D Edges', id: 'Akurasi Kontur Sub-Milimeter pada Tepi 3D' },
        ],
        tags: ['Reach: 2,500 mm', 'Cutting Speed: 12 m/min', 'Thickness: 1 – 200 mm', 'Anti-Spatter Seals'],
      },
      {
        kickerEn: '03 / TOOLING & PROCESS CONTROL',
        kickerId: '03 / PERKAKAS & KONTROL PROSES',
        titleEn: 'Capacitive Torch Height Control (THC) & Safety Breakaway',
        titleId: 'Kontrol Ketinggian Obor Kapasitif (THC) & Proteksi Tabrakan',
        descEn:
          'Features real-time high-speed arc voltage height sensing (THC) that adjusts nozzle elevation dynamically over warped steel plates. Magnetic breakaway torch mounts prevent catastrophic damage in case of tip-up collision.',
        descId:
          'Dilengkapi sensor ketinggian kapasitif & tegangan busur real-time (THC) yang menyesuaikan posisi nozzle secara dinamis di atas plat baja yang bergelombang. Dudukan magnetik breakaway mencegah kerusakan fatal jika terjadi benturan.',
        highlights: [
          { en: 'Capacitive & Arc Voltage THC Height Sensing', id: 'Sensor Ketinggian THC Kapasitif & Tegangan Busur' },
          { en: 'Magnetic Collision Breakaway Sensor Shield', id: 'Pelindung Sensor Tabrakan Magnetik Breakaway' },
          { en: 'Dual Gas Vortex Plasma Cutting Consumable Stack', id: 'Nozzle Plasma Aliran Gas Ganda Tahan Aus' },
        ],
        tags: ['Capacitive THC', 'Collision Breakaway', 'Vortex Gas Shield', 'Laser Guide Pointer'],
      },
      {
        kickerEn: '04 / TECHNICAL SPECS & INTEGRATION',
        kickerId: '04 / SPESIFIKASI TEKNIS & INTEGRASI',
        titleEn: 'Direct CAD/CAM Code Execution & CNC Gantry Link',
        titleId: 'Eksekusi Kode CAD/CAM Langsung & Tautan CNC Gantry',
        descEn:
          'Directly parses STEP, IGES, and DXF nested drawing files. Synchronizes motion with positioner rotators and fume extraction tables to maintain compliant workplace safety standards.',
        descId:
          'Mampu membaca file gambar nesting STEP, IGES, dan DXF secara langsung. Menyinkronkan gerakan dengan meja pemutar posisi (positioner) dan meja hisap asap untuk memenuhi standar keselamatan kerja internasional.',
        specs: [
          { labelEn: 'Number of Axes', labelId: 'Jumlah Sumbu', val: '6-Axis + Gantry Sync' },
          { labelEn: 'Working Radius', labelId: 'Radius Kerja', val: '1,600 – 2,500 mm' },
          { labelEn: 'Cutting Thickness', labelId: 'Ketebalan Potong', val: '1 – 200 mm (Oxy/Plasma)' },
          { labelEn: 'Path Accuracy', labelId: 'Akurasi Jalur', val: '±0.5 mm' },
          { labelEn: 'Cutting Velocity', labelId: 'Kecepatan Potong', val: 'Up to 12,000 mm/min' },
          { labelEn: 'Height Sensing', labelId: 'Sensor Ketinggian', val: 'Auto THC (Arc Voltage)' },
          { labelEn: 'Plasma Power', labelId: 'Daya Plasma', val: '60 – 400 Ampere' },
          { labelEn: 'Collision Safety', labelId: 'Keselamatan', val: 'Breakaway + E-Stop' },
        ],
      },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// BATAM INDUSTRIAL AUTOMATION DATA (Clean, Minimal, Typography-Driven)
// ════════════════════════════════════════════════════════════════════════════
const BATAM_PILLARS = [
  {
    titleEn: 'Precision Meets Productivity',
    titleId: 'Presisi Tinggi & Produktivitas Maksimal',
    descEn: 'Robots deliver consistent, repeatable quality—whether you’re welding a car frame or cutting a heavy steel plate. Their accuracy reduces errors, rework, and downtime.',
    descId: 'Robot memberikan kualitas presisi dan repetitif yang konsisten—baik untuk pengelasan rangka otomotif maupun pemotongan pelat baja berat. Akurasi tinggi meminimalkan kesalahan, pengerjaan ulang (rework), dan downtime produksi.',
  },
  {
    titleEn: 'Local Support in Batam',
    titleId: 'Dukungan Teknis Lokal di Batam',
    descEn: 'With our authorized distributor PT. Global Philsonic Technologies, you get technical support, training, spare parts, and troubleshooting assistance — all in Batam.',
    descId: 'Bersama distributor resmi kami PT. Global Philsonic Technologies, Anda memperoleh dukungan teknis langsung, pelatihan operator bersertifikat, ketersediaan suku cadang cepat, dan pendampingan troubleshooting — semuanya berbasis langsung di Batam.',
  },
  {
    titleEn: 'Full System Integration',
    titleId: 'Integrasi Sistem Penuh',
    descEn: 'We deliver not only robots but also the welding power source, torches, positioners, sensors, and software. A complete ecosystem for smooth and optimized performance.',
    descId: 'Bukan sekadar robot mandiri, kami menyuplai mesin sumber daya las (power source), obor las presisi, positioner putar, sensor cerdas, hingga perangkat lunak kontrol terintegrasi. Ekosistem lengkap untuk performa tanpa hambatan kompatibilitas.',
  },
  {
    titleEn: 'Compact to Heavy-Duty Options',
    titleId: 'Pilihan Kompak Hingga Beban Berat',
    descEn: 'Whether you run a small fabrication workshop or a large automotive assembly line, there’s a robot that fits your space, cycle time, and process needs.',
    descId: 'Mulai dari bengkel fabrikasi presisi skala menengah hingga lini perakitan pabrik otomotif dan galangan kapal berat, kami memiliki varian robot yang dirancang presisi sesuai batasan ruang, target cycle time, dan kebutuhan proses Anda.',
  },
];

const BATAM_ADVANTAGES = [
  {
    titleEn: 'High Efficiency & Productivity',
    titleId: 'Efisiensi & Produktivitas Tinggi',
    descEn: 'Robots operate 24/7 with high precision, significantly reducing cycle time.',
    descId: 'Robot beroperasi 24/7 tanpa henti dengan presisi tinggi, memangkas waktu siklus produksi secara signifikan.',
  },
  {
    titleEn: 'Lower Operational Costs',
    titleId: 'Biaya Operasional Lebih Rendah',
    descEn: 'Automation reduces labor costs and eliminates expensive human errors.',
    descId: 'Otomasi menekan biaya tenaga kerja berulang dan mengeliminasi kerugian material akibat kelalaian manual.',
  },
  {
    titleEn: 'Enhanced Workplace Safety',
    titleId: 'Keselamatan Kerja Maksimal',
    descEn: 'Dangerous welding tasks are handled by robots, minimizing safety risks.',
    descId: 'Tugas pengelasan bersuhu tinggi, radiasi sinar, dan bahaya fisik ditangani robot, meminimalkan risiko K3.',
  },
  {
    titleEn: 'Flexible Production',
    titleId: 'Produksi Adaptif & Fleksibel',
    descEn: 'Easily reprogram robots for different tasks—ideal for agile manufacturing.',
    descId: 'Pemrograman ulang cepat untuk berbagai tipe komponen—sangat ideal untuk lini produksi agile manufacturing.',
  },
  {
    titleEn: 'Consistent Quality',
    titleId: 'Kualitas Konsisten Terjamin',
    descEn: 'Precision-built systems ensure top-tier results every single time.',
    descId: 'Sistem rekayasa presisi tinggi menjamin hasil mutu berstandar global di setiap batch produksi.',
  },
];

const TECH_FEATURES = [
  {
    titleEn: 'AI & Machine Learning Integration',
    titleId: 'Integrasi AI & Machine Learning',
    descEn: 'Adaptive trajectory learning, automatic welding parameter tuning, and self-correcting seam tracking for zero-defect production.',
    descId: 'Pembelajaran lintasan adaptif, penyesuaian parameter las otomatis, dan pelacakan kampuh mandiri tanpa cacat.',
  },
  {
    titleEn: 'High-Precision Welding Sensors',
    titleId: 'Sensor Pengelasan Presisi Tinggi',
    descEn: 'Laser optical seam finders, touch sensing, and arc voltage tracking for millimeter-accurate positioning in challenging bevel joints.',
    descId: 'Pencari kampuh laser optik non-kontak, touch sensing, dan pelacakan tegangan busur untuk presisi milimeter.',
  },
  {
    titleEn: 'IoT-Enabled Monitoring & Diagnostics',
    titleId: 'Pemantauan & Diagnostik Berbasis IoT',
    descEn: 'Live OEE metrics, cloud operational telemetry, heat input tracking, and proactive predictive maintenance alerts.',
    descId: 'Metrik OEE real-time, telemetri operasional cloud, pemantauan heat input, dan peringatan servis prediktif sebelum downtime.',
  },
  {
    titleEn: 'Scalable Multi-Axis Control',
    titleId: 'Kontrol Multi-Sumbu Tersinkronisasi',
    descEn: 'Coordinated control for up to 72 external axes including servo positioners, linear tracks, and multi-robot cells.',
    descId: 'Kontrol terkoordinasi hingga 72 sumbu eksternal termasuk positioner putar, rel geser gantry, dan sel robot ganda.',
  },
];

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function AutomationPage() {
  const { i18n } = useTranslation();
  const isId = i18n.language === 'id';
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const narrativeRef = useRef(null);
  const activeRobot = ROBOTS[activeTab];

  // ── Scroll tracking to link narrative position with 3D robot pose ──
  useEffect(() => {
    const handleScroll = () => {
      if (!narrativeRef.current) return;
      const steps = narrativeRef.current.querySelectorAll('.auto-story-step');
      if (!steps || steps.length === 0) return;

      const vh = window.innerHeight;
      const focusY = vh * 0.42;

      let detectedStep = 0;
      steps.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= focusY && rect.bottom >= focusY) {
          detectedStep = idx;
        }
      });
      setActiveStep(detectedStep);

      // Continuous 0.0 to 3.0 progress for smooth kinematic lerping
      const firstRect = steps[0].getBoundingClientRect();
      const lastRect = steps[steps.length - 1].getBoundingClientRect();
      const totalDist = lastRect.top - firstRect.top;
      if (totalDist > 0) {
        const currentDist = focusY - firstRect.top;
        const prog = Math.max(0, Math.min(3, (currentDist / totalDist) * 3));
        setScrollProgress(prog);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  // Click-to-scroll to narrative step
  const scrollToStep = (idx) => {
    if (!narrativeRef.current) return;
    const steps = narrativeRef.current.querySelectorAll('.auto-story-step');
    if (steps[idx]) {
      const yOffset = -120;
      const y = steps[idx].getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
    setActiveStep(0);
    setScrollProgress(0);
  };

  return (
    <div className="automation-page">

      {/* ═══════ PAGE HEADER — Always-Dark Industrial Theme ═══════ */}
      <header className="auto-page-header">
        <div className="auto-page-header__grid-bg" aria-hidden="true" />

        <div className="container auto-page-header__content">
          <h1 className="auto-page-header__title">
            {isId ? 'Solusi Robot Industri & Otomasi Manufaktur' : 'Industrial Robot Solutions & Manufacturing Automation'}
          </h1>
          <p className="auto-page-header__subtitle">
            {isId
              ? 'Jelajahi simulasi 3D robot welding, handling, dan cutting berkecepatan tinggi dengan artikulasi 6-sumbu presisi untuk jalur produksi Anda.'
              : 'Explore interactive 3D simulations of our 6-axis welding, handling, and cutting industrial robots designed for smart manufacturing.'}
          </p>
        </div>
      </header>

      {/* ═══════ ROBOT SELECTOR TABS ═══════ */}
      <div className="auto-tabs-sticky-wrapper">
        <div className="container">
          <div className="auto-tabs-nav" role="tablist">
            {ROBOTS.map((robot, index) => (
              <button
                key={robot.id}
                className={`auto-tab-btn ${activeTab === index ? 'auto-tab-btn--active' : ''}`}
                onClick={() => handleTabChange(index)}
                role="tab"
                aria-selected={activeTab === index}
                id={`tab-${robot.id}`}
              >
                <span className="auto-tab-btn__name">{isId ? robot.tabId : robot.tabEn}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ SCROLLYTELLING SHOWCASE: 3D VIEWPORT + PARALLAX NARRATIVE ═══════ */}
      <section className="auto-scrolly-section">
        <div className="container auto-scrolly-container">

          {/* LEFT COLUMN: STICKY 3D ROBOT VIEWPORT */}
          <div className="auto-scrolly-sticky">
            <RobotCanvas3D
              robotType={activeRobot.id}
              activeStep={activeStep}
              scrollProgress={scrollProgress}
              isId={isId}
              onStepSelect={scrollToStep}
            />

            {/* Quick Specs Quick-Bar Under 3D Canvas */}
            <div className="auto-quick-specs">
              {activeRobot.heroStats.map((st, i) => (
                <div key={i} className="auto-quick-spec-item">
                  <span className="auto-quick-spec-val">{st.val}</span>
                  <span className="auto-quick-spec-label">{isId ? st.labelId : st.labelEn}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: SCROLLING NARRATIVE STREAM */}
          <div className="auto-scrolly-narrative" ref={narrativeRef}>
            {activeRobot.steps.map((step, idx) => (
              <div
                key={idx}
                className={`auto-story-step ${activeStep === idx ? 'auto-story-step--active' : ''}`}
                data-step={idx}
              >
                {/* Step Kicker Label */}
                <div className="auto-story-kicker">
                  {isId ? step.kickerId : step.kickerEn}
                </div>

                {/* Section Title */}
                <h2 className="auto-story-title">
                  {isId ? step.titleId : step.titleEn}
                </h2>

                {/* Description */}
                <p className="auto-story-desc">
                  {isId ? step.descId : step.descEn}
                </p>

                {/* Bullet Highlights */}
                {step.highlights && (
                  <ul className="auto-story-highlights">
                    {step.highlights.map((h, hi) => (
                      <li key={hi}>
                        <span>{isId ? h.id : h.en}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Step 4 Technical Specs Table */}
                {step.specs && (
                  <div className="auto-story-specs-table">
                    <div className="auto-story-specs-grid">
                      {step.specs.map((sp, si) => (
                        <div key={si} className="auto-story-spec-row">
                          <span className="auto-story-spec-name">{isId ? sp.labelId : sp.labelEn}</span>
                          <span className="auto-story-spec-data">{sp.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Actions Outside Narrative Cards */}
            <div className="auto-narrative-actions">
              <Link to="/contact" className="auto-btn auto-btn--primary">
                {isId ? 'Minta Penawaran Spesifik' : 'Request RFQ & Layout Consultation'}
              </Link>
              <Link to="/contact" className="auto-btn auto-btn--outline">
                {isId ? 'Konsultasi Tim Ahli' : 'Talk with Robotics Engineer'}
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════ WHY CHOOSE ROBOTS IN BATAM SECTION ═══════ */}
      <section className="auto-batam-section">
        <div className="container">
          <div className="auto-batam-header">
            <h2 className="auto-batam-title">
              {isId ? 'Why Choose Robot in Batam?' : 'Why Choose Robot in Batam?'}
            </h2>
            <p className="auto-batam-subtitle">
              {isId
                ? 'Seiring meningkatnya tuntutan industri, otomasi bukan lagi sekadar pilihan — melainkan kebutuhan mendesak. Inilah alasan pabrik-pabrik di seluruh Batam, dari Batu Ampar hingga Muka Kuning, memilih robot:'
                : 'As industrial demands increase, automation is no longer an option — it’s a necessity. Here’s why factories across Batam, from Batu Ampar to Muka Kuning, are choosing robots:'}
            </p>
          </div>

          {/* 4 Core Value Pillars Grid */}
          <div className="auto-batam-grid">
            {BATAM_PILLARS.map((pillar, idx) => (
              <div key={idx} className="auto-batam-card">
                <h3 className="auto-batam-card__title">
                  {isId ? pillar.titleId : pillar.titleEn}
                </h3>
                <p className="auto-batam-card__desc">
                  {isId ? pillar.descId : pillar.descEn}
                </p>
              </div>
            ))}
          </div>

          {/* 5 Core Operational Advantages Strip */}
          <div className="auto-impact-strip">
            <div className="auto-impact-grid">
              {BATAM_ADVANTAGES.map((adv, idx) => (
                <div key={idx} className="auto-impact-card">
                  <h4 className="auto-impact-card__title">
                    {isId ? adv.titleId : adv.titleEn}
                  </h4>
                  <p className="auto-impact-card__desc">
                    {isId ? adv.descId : adv.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ADVANCED ROBOTIC TECHNOLOGY FOR BATAM INDUSTRIES ═══════ */}
      <section className="auto-tech-section">
        <div className="container">
          <div className="auto-tech-header">
            <h2 className="auto-tech-title">
              {isId ? 'Advanced Robotic Technology for Batam Industries' : 'Advanced Robotic Technology for Batam Industries'}
            </h2>
            <p className="auto-tech-subtitle">
              {isId
                ? 'Kami menghadirkan solusi otomasi kelas dunia melalui kemitraan strategis dengan brand otomasi global terkemuka. Sistem kami dilengkapi dengan:'
                : 'We deliver world-class solutions by partnering with global automation brands. Our systems feature:'}
            </p>
          </div>

          <div className="auto-tech-grid">
            {TECH_FEATURES.map((tech, idx) => (
              <div key={idx} className="auto-tech-card">
                <h3 className="auto-tech-card__title">
                  {isId ? tech.titleId : tech.titleEn}
                </h3>
                <p className="auto-tech-card__desc">
                  {isId ? tech.descId : tech.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ DISCOVER OUR ROBOT SERIES IN BATAM ═══════ */}
      <section className="auto-comparison-section">
        <div className="container">
          <div className="auto-comparison-header">
            <h2 className="auto-comparison-title">
              {isId ? 'Discover Our Robot Series in Batam' : 'Discover Our Robot Series in Batam'}
            </h2>
            <p className="auto-comparison-subtitle">
              {isId
                ? 'Kami menawarkan rangkaian lengkap solusi robotika untuk mengotomasi hampir setiap proses produksi:'
                : 'We offer a complete suite of robotic solutions to automate almost every production process:'}
            </p>
          </div>

          <div className="auto-overview-grid">
            {ROBOTS.map((robot, index) => (
              <div
                key={robot.id}
                className={`auto-overview-card ${activeTab === index ? 'auto-overview-card--active' : ''}`}
                onClick={() => {
                  handleTabChange(index);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTabChange(index);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }
                }}
              >
                <img src={robot.image} alt={isId ? robot.titleId : robot.titleEn} loading="lazy" />
                <div className="auto-overview-card__overlay">
                  <span className="auto-overview-card__name">{isId ? robot.titleId : robot.titleEn}</span>
                  <span className="auto-overview-card__cta">
                    {activeTab === index
                      ? (isId ? 'Sedang Dilihat' : 'Currently Viewing')
                      : (isId ? 'Lihat Model 3D →' : 'View 3D Model →')
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ BOTTOM CTA BANNER ═══════ */}
      <section className="auto-contact-wrapper">
        <div className="container">
          <div className="auto-contact-bar">
            <div className="auto-contact-bar__inner">
              <div className="auto-contact-bar__text">
                <h3>{isId ? 'Butuh Konsultasi Desain Otomasi Pabrik?' : 'Need Custom Automation Plant Design?'}</h3>
                <p>
                  {isId
                    ? 'Tim engineering PT. Global Philsonic Technologies di Batam siap membantu studi kelayakan, simulasi siklus, dan integrasi sel robot di fasilitas Anda.'
                    : 'Our engineering team at Batam FTZ is ready to assist with feasibility studies, cycle time simulation, and turnkey robot cell integration.'}
                </p>
              </div>
              <div className="auto-contact-bar__actions">
                <Link to="/contact" className="auto-btn auto-btn--primary">
                  {isId ? 'Hubungi Tim Engineering' : 'Contact Engineering Team'}
                </Link>
                <Link to="/products" className="auto-btn auto-btn--outline">
                  {isId ? 'Lihat Solusi Manufaktur' : 'Manufacturing Solutions'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
