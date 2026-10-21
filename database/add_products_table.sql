-- ============================================================
--  MIGRATION: Buat tabel products + seed data 12 produk GPT
--  Jalankan sekali di MySQL: SOURCE path/to/add_products_table.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS `products` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `model_code`    VARCHAR(100)  NOT NULL,
  `category`      VARCHAR(100)  NOT NULL DEFAULT 'automation',
  `badge`         VARCHAR(100)  DEFAULT NULL,
  `badge_color`   VARCHAR(50)   DEFAULT NULL,
  `image`         VARCHAR(255)  DEFAULT NULL,
  `gallery`       LONGTEXT      DEFAULT NULL COMMENT 'JSON array of image paths',
  `title_id`      TEXT          NOT NULL,
  `title_en`      TEXT          NOT NULL,
  `short_desc_id` TEXT          DEFAULT NULL,
  `short_desc_en` TEXT          DEFAULT NULL,
  `specs`         LONGTEXT      DEFAULT NULL COMMENT 'JSON array of {label, value} - max 4 items',
  `full_specs`    LONGTEXT      DEFAULT NULL COMMENT 'JSON object of key-value pairs',
  `diagram_type`  VARCHAR(50)   NOT NULL DEFAULT 'infotainment',
  `status`        TINYINT(1)    NOT NULL DEFAULT 1 COMMENT '1=aktif, 0=nonaktif',
  `sort_order`    INT           NOT NULL DEFAULT 0,
  `created_at`    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
--  SEED DATA — 12 produk resmi PT. Global Philsonic Technologies (GPT)
--  Kategori strictly 7 kategori:
--  automation, mobile_intelligent_device, amplifier, subwoofer, dsp,
--  android_headunit, dash_camera_recorders
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO `products`
  (`model_code`, `category`, `badge`, `badge_color`, `title_id`, `title_en`,
   `short_desc_id`, `short_desc_en`, `specs`, `full_specs`, `diagram_type`, `status`, `sort_order`)
VALUES

-- ── 1. ANDROID HEADUNIT ───────────────────────────────────────────────────────
(
  'GPT-HU9800 PRO', 'android_headunit', 'OEM Flagship', 'teal',
  'Sistem Infotainment Otomotif Pintar 10.1" QLED Optical Bonding',
  'Smart Android Automotive Infotainment System 10.1" QLED',
  'Headunit standar OEM dengan prosesor Octa-Core 2.0 GHz, panel QLED 1280x720 optical bonding anti-glare, DSP 32-band terintegrasi, dan integrasi penuh CAN-Bus multi-protokol.',
  'OEM-grade infotainment powered by Octa-core 2.0 GHz SoC, 10.1" optical-bonded QLED panel, integrated 32-band DSP, and native multi-protocol CAN-Bus architecture.',
  '[{"label":"Display","value":"10.1\\\" QLED 1280x720 Optical Bonding"},{"label":"Processor","value":"Octa-Core 2.0 GHz ARM 64-bit"},{"label":"Connectivity","value":"Wireless CarPlay & Android Auto, 4G LTE"},{"label":"CAN-Bus","value":"Multi-Protocol Steering & OBD-II Telemetry"}]',
  '{"operatingVoltage":"9V - 16V DC (Reverse Polarity & Load Dump Protected)","operatingTemp":"-30°C to +80°C (Automotive Cockpit Grade)","memory":"4GB / 8GB LPDDR4 + 64GB / 128GB eMMC 5.1","audioDsp":"AKM 32-bit DAC with 32-Band PEQ, Time Alignment & Sub Out","radioTuner":"NXP TEF6686 Automotive Tuner with RDS / AF","videoInput":"AHD 1080p Reverse Camera & 360° AVM Support","certifications":"IATF 16949 Compliant, ISO 9001:2015, CE, E-Mark"}',
  'infotainment', 1, 10
),
(
  'GPT-HU7200 SLIM', 'android_headunit', 'Double-DIN Slim', 'blue',
  'Receiver Multimedia Double-DIN 7" IPS Mechless',
  'Double-DIN 7" IPS Mechless Multimedia Receiver',
  'Unit penerima multimedia sasis ultra-slim (kedalaman instalasi hanya 65mm) dengan layar IPS 7 inci kapasitif, Apple CarPlay & Android Auto nirkabel, dan DAC 24-bit audio.',
  'Ultra-slim chassis (65mm mounting depth) 7-inch IPS capacitive multimedia receiver with wireless CarPlay & Android Auto, and 24-bit audio DAC.',
  '[{"label":"Display","value":"7.0\\\" IPS Capacitive 1024x600 Glass"},{"label":"Chassis Depth","value":"65mm Ultra-Slim Short-Body"},{"label":"Audio Power","value":"4 x 50W Max MOSFET Built-in"},{"label":"Smartphone","value":"Wireless CarPlay & Wired Android Auto"}]',
  '{"operatingVoltage":"10.8V - 14.8V DC","operatingTemp":"-20°C to +70°C","usbPorts":"Dual Front & Rear USB 2.0 (Fast Charging 2.1A)","bluetooth":"Qualcomm Bluetooth 5.0 with aptX Audio","preouts":"3 Pairs (Front, Rear, Subwoofer) 4V RMS High-Volt","certifications":"ISO 9001:2015, RoHS, FCC Part 15"}',
  'infotainment', 1, 20
),

-- ── 2. MOBILE INTELLIGENT DEVICE ──────────────────────────────────────────────
(
  'GPT-CP1200 AI-BOX', 'mobile_intelligent_device', 'Smart Module', 'purple',
  'Modul Pintar Wireless CarPlay & Android Auto AI Box',
  'Wireless CarPlay & Android Auto AI Smart Adapter Box',
  'Modul plug-and-play mandiri berbasis Android 13 untuk mengonversi headunit pabrikan OEM kabel menjadi sistem pintar nirkabel dengan slot kartu SIM 4G dan GPS mandiri.',
  'Standalone plug-and-play Android 13 smart box converting wired OEM factory head units into full wireless ecosystem with independent 4G SIM and GNSS GPS.',
  '[{"label":"OS & CPU","value":"Android 13 / Qualcomm QCM6125 Octa-Core"},{"label":"Network","value":"Dual-Band Wi-Fi 5GHz + 4G LTE SIM Slot"},{"label":"GPS","value":"Integrated GPS, GLONASS, BeiDou"},{"label":"Installation","value":"USB Plug & Play (Factory OEM Ports)"}]',
  '{"operatingVoltage":"5V DC via USB Bus Power (< 1.5A)","operatingTemp":"-20°C to +75°C","internalStorage":"4GB RAM + 64GB ROM (MicroSD expandable up to 256GB)","dimensions":"78 x 78 x 16 mm (Compact Pocket Size)","certifications":"CE, FCC, RoHS, Telec"}',
  'infotainment', 1, 30
),
(
  'GPT-BMS-48V ECU', 'mobile_intelligent_device', 'EV & Mobility', 'teal',
  'PCBA Modul Battery Management System (BMS) 48V Otomotif EV',
  'Automotive 48V EV Battery Management System (BMS) PCBA Module',
  'Perakitan papan sirkuit PCBA BMS 48V densitas tinggi untuk kendaraan listrik ringan dan modul baterai otomotif, dilengkapi monitoring tegangan sel presisi tinggi dan komunikasi CAN-Bus 2.0B.',
  'High-density 48V automotive BMS PCBA module for light electric vehicles and energy storage, featuring precision cell voltage monitoring and CAN-Bus 2.0B.',
  '[{"label":"Voltage Range","value":"12S - 16S Li-Ion / LiFePO4 (36V - 60V DC)"},{"label":"Continuous Current","value":"100A Continuous / 250A Peak Discharge"},{"label":"Cell Accuracy","value":"±1.5 mV Precision Cell Voltage Telemetry"},{"label":"Communication","value":"Isolated CAN-Bus 2.0B, RS485, UART"}]',
  '{"balancingCurrent":"150 mA Passive Cell Balancing per Channel","temperatureSensors":"4x External NTC Thermistors for Pack Health","protectionLevels":"Over/Under Voltage, Over Current, Short Circuit, Overtemp","pcbConstruction":"4-Layer 2oz Heavy Copper with Conformal Coating","certifications":"ISO 26262 ASIL-B Ready, UN38.3, RoHS"}',
  'ems', 1, 120
),

-- ── 3. DSP (DIGITAL SIGNAL PROCESSOR) ─────────────────────────────────────────
(
  'GPT-DSP8800 HD', 'dsp', 'Audiophile Hi-Res', 'red',
  'Prosesor Sinyal Digital Otomotif 8-Channel Resolusi Tinggi',
  'High-Resolution 8-Channel Automotive Digital Sound Processor',
  'Prosesor audio digital presisi tinggi dengan dual 32-bit floating-point DSP engine, 6 input / 8 output aktif, konverter AKM 192 kHz, dan kalibrasi akustik via software PC & Bluetooth.',
  'High-fidelity audio processor with dual 32-bit floating-point DSP, 6 high/low inputs, 8 active outputs, AKM 192 kHz converters, and PC/Bluetooth acoustic calibration suite.',
  '[{"label":"Architecture","value":"Dual 32-Bit Floating Point DSP Engine"},{"label":"I/O Channels","value":"6 High/Low-Level In / 8 RCA Out"},{"label":"Sampling Rate","value":"192 kHz / 32-bit Native Hi-Res Audio"},{"label":"Equalizer","value":"31-Band PEQ / 0.02ms Time Alignment"}]',
  '{"operatingVoltage":"10V - 15.5V DC (Auto Turn-On on High-Level Signal)","operatingTemp":"-20°C to +75°C","dynamicRange":"> 110 dB (A-Weighted)","thd":"< 0.003% @ 1 kHz, 1V RMS","opticalInput":"Toslink Optical SPDIF up to 24-bit/96kHz","softwareSupport":"Windows PC Suite Tuning + iOS/Android App (BT 5.0)","certifications":"ISO 9001:2015, FCC, CE, RoHS"}',
  'dsp', 1, 40
),

-- ── 4. AMPLIFIER ──────────────────────────────────────────────────────────────
(
  'GPT-AMP4100 D-CLASS', 'amplifier', 'Compact Power', 'gold',
  'Amplifier Otomotif Kelas-D 4-Channel Efisiensi Tinggi',
  'Ultra-Compact 4-Channel Automotive Class-D Power Amplifier',
  'Penguat daya Class-D efisiensi tinggi (>88%) dengan sasis die-cast aluminium kompak, disipasi termal optimal, dan proteksi sirkuit pintar terhadap kelebihan beban dan panas.',
  'High-efficiency Class-D power amplifier with die-cast aluminum heat dissipation chassis, low thermal loss, and automotive multi-fault short/thermal protection.',
  '[{"label":"RMS Output","value":"4 x 100W @ 4Ω (Bridgeable 2 x 200W @ 4Ω)"},{"label":"Efficiency","value":"High-Efficiency Class-D Topology (> 88%)"},{"label":"Frequency Resp.","value":"10 Hz - 35 kHz (±1 dB Audio Band)"},{"label":"Chassis","value":"Compact Extruded Aluminum Heat-Sink"}]',
  '{"operatingVoltage":"9V - 16V DC with Auto-Sense High-Level Turn On","operatingTemp":"-40°C to +85°C (Automotive Underseat/Trunk Grade)","dampingFactor":"> 180 @ 100 Hz","protectionCircuit":"Thermal Shutdown, Output Short-Circuit, DC Offset","dimensions":"185 x 115 x 42 mm","certifications":"ISO 9001:2015, E-Mark, CE"}',
  'amplifier', 1, 50
),

-- ── 5. SUBWOOFER ──────────────────────────────────────────────────────────────
(
  'GPT-AMP11000 MONO', 'subwoofer', 'Subwoofer Master', 'red',
  'Amplifier Monoblock Subwoofer 1000W RMS Kelas-D',
  'Monoblock 1000W RMS Class-D Subwoofer Power Amplifier',
  'Penguat monoblock bertenaga 1000W RMS @ 1Ω untuk sistem subwoofer kabin mobil dengan kontrol subsonic filter, remote bass knob, dan efisiensi catu daya PWM MOSFET ganda.',
  '1000W RMS @ 1Ω heavy-duty monoblock amplifier for automotive subwoofer drivers with subsonic filter, remote bass knob, and dual PWM MOSFET power supply.',
  '[{"label":"RMS Power","value":"1 x 1000W @ 1Ω / 1 x 650W @ 2Ω"},{"label":"Low Pass Filter","value":"30 Hz - 250 Hz Variable (-24dB/oct)"},{"label":"Subsonic Filter","value":"10 Hz - 50 Hz Adjustable"},{"label":"Remote Control","value":"Wired Dashboard Bass Level Controller"}]',
  '{"operatingVoltage":"10V - 16V DC","operatingTemp":"-30°C to +80°C","signalToNoise":"> 95 dB","inputSensitivity":"0.2V - 6.0V Low Level / 0.5V - 12V High Level","dimensions":"260 x 145 x 50 mm","certifications":"ISO 9001:2015, CE, RoHS"}',
  'amplifier', 1, 60
),

-- ── 6. DASH CAMERA RECORDERS ──────────────────────────────────────────────────
(
  'GPT-DVR4K PRO ADAS', 'dash_camera_recorders', 'Vision & Safety', 'teal',
  'Dashcam Dual-Channel 4K UHD Sensor Sony STARVIS™ 2',
  'Dual-Channel 4K UHD Dashcam with Sony STARVIS™ 2 & ADAS',
  'Kamera pengawas berkendara sensor Sony STARVIS 2 IMX678 dengan resolusi 4K sejati, algoritma ADAS (peringatan tabrakan depan & keluar jalur), serta superkapasitor tahan panas tropis.',
  'Dual-channel automotive dashcam with genuine Sony STARVIS 2 IMX678 sensor, built-in intelligent ADAS safety alerts, and extreme heat resilient supercapacitor.',
  '[{"label":"Front Sensor","value":"Sony STARVIS™ 2 4K UHD (3840x2160 @ 30fps)"},{"label":"Rear Camera","value":"1080p Full HD HDR (IP68 Waterproof External)"},{"label":"ADAS Features","value":"Lane Departure (LDWS) & Forward Collision (FCWS)"},{"label":"Power Unit","value":"Dual Supercapacitor (-25°C ~ +80°C Tropical)"}]',
  '{"fieldOfView":"150° Ultra-Wide Diagonal Glass Lens (F/1.8 Aperture)","storageMedia":"Dual Slot MicroSD (Up to 512GB Class 10 / U3 / V30)","nightVision":"True HDR Super Night Vision with Dynamic WDR","connectivity":"Dual-Band 5GHz Wi-Fi + Integrated GNSS GPS Logger","gSensor":"3-Axis Shock Sensor with Parking Mode Time-Lapse Monitoring","certifications":"ISO 9001:2015, FCC Part 15, CE, RoHS"}',
  'dashcam', 1, 70
),
(
  'GPT-BSM240 RADAR', 'dash_camera_recorders', 'ADAS Sensor', 'purple',
  'Sistem Radar Blind Spot Detection 77GHz Otomotif',
  'Automotive 77GHz Millimeter-Wave Blind Spot Detection System',
  'Modul sensor radar gelombang milimeter 77GHz untuk pemantauan titik buta (BSD), bantuan pindah lajur (LCA), dan peringatan lalu lintas lintas belakang (RCTA) dengan akurasi segala cuaca.',
  '77GHz millimeter-wave radar ECU system for blind-spot detection (BSD), lane-change assist (LCA), and rear cross-traffic alert (RCTA) in all weather conditions.',
  '[{"label":"Radar Frequency","value":"77 GHz - 81 GHz Millimeter-Wave FMCW"},{"label":"Detection Range","value":"Up to 50 meters (Vehicle & Motorcycle)"},{"label":"Alert Protocols","value":"A-Pillar LED Warning & Acoustic Buzzer"},{"label":"Weather Rating","value":"IP67 Waterproof & Dustproof Radar Transceivers"}]',
  '{"operatingVoltage":"9V - 18V DC","operatingTemp":"-40°C to +85°C (Automotive Bumper Exterior)","detectionAccuracy":"±0.25 meters range / ±1° azimuth","latency":"< 40 ms Real-Time CAN-Bus Processing","certifications":"ISO 16750, E-Mark ECE R151, FCC, RoHS"}',
  'dashcam', 1, 80
),

-- ── 7. AUTOMATION ─────────────────────────────────────────────────────────────
(
  'GPT-JIG4000 AUTO', 'automation', 'Turnkey Solution', 'blue',
  'Jig Uji Otomatis Multi-Stasiun ICT & FCT Terintegrasi PLC',
  'Automated ICT & FCT Multi-Station Test Fixture',
  'Mesin jig uji otomatis terintegrasi PLC dan sistem pneumatik servo presisi untuk validasi kelistrikan jalur PCB (ICT) dan fungsionalitas produk akhir (FCT) dengan pelacakan MES cloud.',
  'Industrial automated test jig integrating PLC logic and servo pneumatic clamping for high-throughput In-Circuit and Functional PCB validation with cloud MES tracking.',
  '[{"label":"Control System","value":"Omron/Mitsubishi Industrial PLC + Touch HMI"},{"label":"Test Modules","value":"ICT Resistance/Capacitance & FCT Signal Sweep"},{"label":"Cycle Time","value":"< 8.5 seconds / Unit throughput"},{"label":"MES Logging","value":"Automated 2D Barcode / Cloud MES Database"}]',
  '{"airSupply":"0.4 - 0.7 MPa Clean Dry Air (Festo Pneumatic Servos)","powerSupply":"220V AC ±10%, 50/60Hz, 1.2 kW","probePinPitch":"Down to 0.5mm Spring Probe Contactors (Ingun / QA)","safetyFeatures":"Dual Optical Light Curtains & Hardware E-Stop","dataInterface":"Ethernet TCP/IP, RS485, USB 3.0 MES Bridge","certifications":"CE Machinery Directive 2006/42/EC, ISO 9001:2015"}',
  'automation', 1, 90
),
(
  'GPT-WH-TESTER 128P', 'automation', 'Harness Bench', 'teal',
  'Bench Pengujian Kontinuitas & Hipot Wire Harness Otomotif 128-Pin',
  '128-Point Automotive Wire Harness Continuity & Hipot Tester',
  'Sistem pengujian kabel wire harness otomotif berkecepatan tinggi untuk mendeteksi hubungan singkat, kabel putus, resistansi kontak, dan uji isolasi tegangan tinggi (Hipot) hingga 1000V DC.',
  'High-speed automotive wire harness testing bench verifying continuity, open/short circuits, contact resistance, and high-voltage insulation (Hipot) up to 1000V DC.',
  '[{"label":"Test Points","value":"128 Test Points (Expandable to 512 Points)"},{"label":"Hipot Voltage","value":"Up to 1000V DC Insulation Test"},{"label":"Testing Speed","value":"< 1.2 seconds for full 128-pin harness"},{"label":"Visual Guidance","value":"LED Guided Insertion & Audio Pass/Fail Buzzer"}]',
  '{"continuityThreshold":"0.1Ω - 100Ω Programmable","insulationResistance":"1MΩ - 500MΩ @ 500V/1000V DC","clampingMechanism":"Pneumatic Quick-Lock Connector Blocks","traceability":"Pass/Fail Barcode Label Printing Integration","certifications":"ISO 9001:2015, CE"}',
  'automation', 1, 100
),
(
  'GPT-SMT-BOX TURNKEY', 'automation', 'FTZ Manufacturing', 'purple',
  'Layanan Kontrak Manufaktur EMS SMT Presisi & Perakitan Box-Build',
  'High-Precision SMT & Box-Build EMS Contract Manufacturing',
  'Fasilitas manufaktur EMS kontrak lengkap di Batam FTZ: lini SMT kecepatan tinggi Panasonic/Yamaha (80K CPH), inspeksi 3D SPI/AOI, pelapisan konformal, hingga perakitan produk jadi siap ekspor.',
  'Turnkey contract EMS manufacturing in Batam FTZ: high-speed Yamaha/Panasonic SMT lines (80K CPH), 3D SPI/AOI verification, conformal coating, and full box-build assembly.',
  '[{"label":"Placement Speed","value":"Up to 80,000 Components / Hour per Line"},{"label":"Micro Capability","value":"01005 (0402 Metric) Chips & 0.3mm BGA Pitch"},{"label":"Reflow Process","value":"10-Zone Nitrogen (N2) Convection Oven"},{"label":"Cleanroom","value":"Class 100K ESD Protected Workshop"}]',
  '{"pcbSizeRange":"50 x 50 mm to 510 x 460 mm (Up to 16 Layers)","componentHeight":"Up to 25 mm with 3D Component Verification","solderPasteInspection":"Koh Young 3D SPI Inline Closed-Loop Inspection","opticalInspection":"Mirtec 3D AOI (100% Component & Joint Check)","conformalCoating":"Automated Selective Spray & UV Curing Oven","certifications":"ISO 9001:2015, IATF 16949 Process Compliant, ANSI/ESD S20.20"}',
  'ems', 1, 110
);
