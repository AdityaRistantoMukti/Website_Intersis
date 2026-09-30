/**
 * Featured Engineering Products & Manufacturing Solutions Catalog
 * PT. Global Philsonic Technologies (GPT) — Batam FTZ Plant
 * Genuine automotive electronics, DSP audio, test automation, and EMS assemblies
 */

export const FEATURED_PRODUCTS = [
  /* ══════════════════════════════════════════════════════════════════════
     CATEGORY 1: AUTOMOTIVE INFOTAINMENT & SMART COCKPIT (headunit)
     ══════════════════════════════════════════════════════════════════════ */
  {
    id: 'gpt-hu9800',
    modelCode: 'GPT-HU9800 PRO',
    category: 'headunit',
    badge: 'OEM Flagship',
    badgeColor: 'teal',
    title: {
      id: 'Sistem Infotainment Otomotif Pintar 10.1" QLED Optical Bonding',
      en: 'Smart Android Automotive Infotainment System 10.1" QLED'
    },
    shortDesc: {
      id: 'Headunit standar OEM dengan prosesor Octa-Core 2.0 GHz, panel QLED 1280x720 optical bonding anti-glare, DSP 32-band terintegrasi, dan integrasi penuh CAN-Bus multi-protokol.',
      en: 'OEM-grade infotainment powered by Octa-core 2.0 GHz SoC, 10.1" optical-bonded QLED panel, integrated 32-band DSP, and native multi-protocol CAN-Bus architecture.'
    },
    specs: [
      { label: 'Display', value: '10.1" QLED 1280x720 Optical Bonding' },
      { label: 'Processor', value: 'Octa-Core 2.0 GHz ARM 64-bit' },
      { label: 'Connectivity', value: 'Wireless CarPlay & Android Auto, 4G LTE' },
      { label: 'CAN-Bus', value: 'Multi-Protocol Steering & OBD-II Telemetry' }
    ],
    fullSpecs: {
      operatingVoltage: '9V - 16V DC (Reverse Polarity & Load Dump Protected)',
      operatingTemp: '-30°C to +80°C (Automotive Cockpit Grade)',
      memory: '4GB / 8GB LPDDR4 + 64GB / 128GB eMMC 5.1',
      audioDsp: 'AKM 32-bit DAC with 32-Band PEQ, Time Alignment & Sub Out',
      radioTuner: 'NXP TEF6686 Automotive Tuner with RDS / AF',
      videoInput: 'AHD 1080p Reverse Camera & 360° AVM Support',
      certifications: 'IATF 16949 Compliant, ISO 9001:2015, CE, E-Mark'
    },
    diagramType: 'infotainment'
  },
  {
    id: 'gpt-hu7200',
    modelCode: 'GPT-HU7200 SLIM',
    category: 'headunit',
    badge: 'Double-DIN Slim',
    badgeColor: 'blue',
    title: {
      id: 'Receiver Multimedia Double-DIN 7" IPS Mechless',
      en: 'Double-DIN 7" IPS Mechless Multimedia Receiver'
    },
    shortDesc: {
      id: 'Unit penerima multimedia sasis ultra-slim (kedalaman instalasi hanya 65mm) dengan layar IPS 7 inci kapasitif, Apple CarPlay & Android Auto nirkabel, dan DAC 24-bit audio.',
      en: 'Ultra-slim chassis (65mm mounting depth) 7-inch IPS capacitive multimedia receiver with wireless CarPlay & Android Auto, and 24-bit audio DAC.'
    },
    specs: [
      { label: 'Display', value: '7.0" IPS Capacitive 1024x600 Glass' },
      { label: 'Chassis Depth', value: '65mm Ultra-Slim Short-Body' },
      { label: 'Audio Power', value: '4 x 50W Max MOSFET Built-in' },
      { label: 'Smartphone', value: 'Wireless CarPlay & Wired Android Auto' }
    ],
    fullSpecs: {
      operatingVoltage: '10.8V - 14.8V DC',
      operatingTemp: '-20°C to +70°C',
      usbPorts: 'Dual Front & Rear USB 2.0 (Fast Charging 2.1A)',
      bluetooth: 'Qualcomm Bluetooth 5.0 with aptX Audio',
      preouts: '3 Pairs (Front, Rear, Subwoofer) 4V RMS High-Volt',
      certifications: 'ISO 9001:2015, RoHS, FCC Part 15'
    },
    diagramType: 'infotainment'
  },
  {
    id: 'gpt-cp1200',
    modelCode: 'GPT-CP1200 AI-BOX',
    category: 'headunit',
    badge: 'Smart Module',
    badgeColor: 'purple',
    title: {
      id: 'Modul Pintar Wireless CarPlay & Android Auto AI Box',
      en: 'Wireless CarPlay & Android Auto AI Smart Adapter Box'
    },
    shortDesc: {
      id: 'Modul plug-and-play mandiri berbasis Android 13 untuk mengonversi headunit pabrikan OEM kabel menjadi sistem pintar nirkabel dengan slot kartu SIM 4G dan GPS mandiri.',
      en: 'Standalone plug-and-play Android 13 smart box converting wired OEM factory head units into full wireless ecosystem with independent 4G SIM and GNSS GPS.'
    },
    specs: [
      { label: 'OS & CPU', value: 'Android 13 / Qualcomm QCM6125 Octa-Core' },
      { label: 'Network', value: 'Dual-Band Wi-Fi 5GHz + 4G LTE SIM Slot' },
      { label: 'GPS', value: 'Integrated GPS, GLONASS, BeiDou' },
      { label: 'Installation', value: 'USB Plug & Play (Factory OEM Ports)' }
    ],
    fullSpecs: {
      operatingVoltage: '5V DC via USB Bus Power (< 1.5A)',
      operatingTemp: '-20°C to +75°C',
      internalStorage: '4GB RAM + 64GB ROM (MicroSD expandable up to 256GB)',
      dimensions: '78 x 78 x 16 mm (Compact Pocket Size)',
      certifications: 'CE, FCC, RoHS, Telec'
    },
    diagramType: 'infotainment'
  },

  /* ══════════════════════════════════════════════════════════════════════
     CATEGORY 2: DIGITAL AUDIO PROCESSORS & AMPLIFIERS (audio)
     ══════════════════════════════════════════════════════════════════════ */
  {
    id: 'gpt-dsp8800',
    modelCode: 'GPT-DSP8800 HD',
    category: 'audio',
    badge: 'Audiophile Hi-Res',
    badgeColor: 'red',
    title: {
      id: 'Prosesor Sinyal Digital Otomotif 8-Channel Resolusi Tinggi',
      en: 'High-Resolution 8-Channel Automotive Digital Sound Processor'
    },
    shortDesc: {
      id: 'Prosesor audio digital presisi tinggi dengan dual 32-bit floating-point DSP engine, 6 input / 8 output aktif, konverter AKM 192 kHz, dan kalibrasi akustik via software PC & Bluetooth.',
      en: 'High-fidelity audio processor with dual 32-bit floating-point DSP, 6 high/low inputs, 8 active outputs, AKM 192 kHz converters, and PC/Bluetooth acoustic calibration suite.'
    },
    specs: [
      { label: 'Architecture', value: 'Dual 32-Bit Floating Point DSP Engine' },
      { label: 'I/O Channels', value: '6 High/Low-Level In / 8 RCA Out' },
      { label: 'Sampling Rate', value: '192 kHz / 32-bit Native Hi-Res Audio' },
      { label: 'Equalizer', value: '31-Band PEQ / 0.02ms Time Alignment' }
    ],
    fullSpecs: {
      operatingVoltage: '10V - 15.5V DC (Auto Turn-On on High-Level Signal)',
      operatingTemp: '-20°C to +75°C',
      dynamicRange: '> 110 dB (A-Weighted)',
      thd: '< 0.003% @ 1 kHz, 1V RMS',
      opticalInput: 'Toslink Optical SPDIF up to 24-bit/96kHz',
      softwareSupport: 'Windows PC Suite Tuning + iOS/Android App (BT 5.0)',
      certifications: 'ISO 9001:2015, FCC, CE, RoHS'
    },
    diagramType: 'dsp'
  },
  {
    id: 'gpt-amp4100',
    modelCode: 'GPT-AMP4100 D-CLASS',
    category: 'audio',
    badge: 'Compact Power',
    badgeColor: 'gold',
    title: {
      id: 'Amplifier Otomotif Kelas-D 4-Channel Efisiensi Tinggi',
      en: 'Ultra-Compact 4-Channel Automotive Class-D Power Amplifier'
    },
    shortDesc: {
      id: 'Penguat daya Class-D efisiensi tinggi (>88%) dengan sasis die-cast aluminium kompak, disipasi termal optimal, dan proteksi sirkuit pintar terhadap kelebihan beban dan panas.',
      en: 'High-efficiency Class-D power amplifier with die-cast aluminum heat dissipation chassis, low thermal loss, and automotive multi-fault short/thermal protection.'
    },
    specs: [
      { label: 'RMS Output', value: '4 x 100W @ 4Ω (Bridgeable 2 x 200W @ 4Ω)' },
      { label: 'Efficiency', value: 'High-Efficiency Class-D Topology (> 88%)' },
      { label: 'Frequency Resp.', value: '10 Hz - 35 kHz (±1 dB Audio Band)' },
      { label: 'Chassis', value: 'Compact Extruded Aluminum Heat-Sink' }
    ],
    fullSpecs: {
      operatingVoltage: '9V - 16V DC with Auto-Sense High-Level Turn On',
      operatingTemp: '-40°C to +85°C (Automotive Underseat/Trunk Grade)',
      dampingFactor: '> 180 @ 100 Hz',
      protectionCircuit: 'Thermal Shutdown, Output Short-Circuit, DC Offset',
      dimensions: '185 x 115 x 42 mm',
      certifications: 'ISO 9001:2015, E-Mark, CE'
    },
    diagramType: 'amplifier'
  },
  {
    id: 'gpt-amp11000',
    modelCode: 'GPT-AMP11000 MONO',
    category: 'audio',
    badge: 'Subwoofer Master',
    badgeColor: 'red',
    title: {
      id: 'Amplifier Monoblock Subwoofer 1000W RMS Kelas-D',
      en: 'Monoblock 1000W RMS Class-D Subwoofer Power Amplifier'
    },
    shortDesc: {
      id: 'Penguat monoblock bertenaga 1000W RMS @ 1Ω untuk sistem subwoofer kabin mobil dengan kontrol subsonic filter, remote bass knob, dan efisiensi catu daya PWM MOSFET ganda.',
      en: '1000W RMS @ 1Ω heavy-duty monoblock amplifier for automotive subwoofer drivers with subsonic filter, remote bass knob, and dual PWM MOSFET power supply.'
    },
    specs: [
      { label: 'RMS Power', value: '1 x 1000W @ 1Ω / 1 x 650W @ 2Ω' },
      { label: 'Low Pass Filter', value: '30 Hz - 250 Hz Variable (-24dB/oct)' },
      { label: 'Subsonic Filter', value: '10 Hz - 50 Hz Adjustable' },
      { label: 'Remote Control', value: 'Wired Dashboard Bass Level Controller' }
    ],
    fullSpecs: {
      operatingVoltage: '10V - 16V DC',
      operatingTemp: '-30°C to +80°C',
      signalToNoise: '> 95 dB',
      inputSensitivity: '0.2V - 6.0V Low Level / 0.5V - 12V High Level',
      dimensions: '260 x 145 x 50 mm',
      certifications: 'ISO 9001:2015, CE, RoHS'
    },
    diagramType: 'amplifier'
  },

  /* ══════════════════════════════════════════════════════════════════════
     CATEGORY 3: IN-VEHICLE SAFETY & VISION SYSTEMS (dashcam)
     ══════════════════════════════════════════════════════════════════════ */
  {
    id: 'gpt-dvr4k',
    modelCode: 'GPT-DVR4K PRO ADAS',
    category: 'dashcam',
    badge: 'Vision & Safety',
    badgeColor: 'teal',
    title: {
      id: 'Dashcam Dual-Channel 4K UHD Sensor Sony STARVIS™ 2',
      en: 'Dual-Channel 4K UHD Dashcam with Sony STARVIS™ 2 & ADAS'
    },
    shortDesc: {
      id: 'Kamera pengawas berkendara sensor Sony STARVIS 2 IMX678 dengan resolusi 4K sejati, algoritma ADAS (peringatan tabrakan depan & keluar jalur), serta superkapasitor tahan panas tropis.',
      en: 'Dual-channel automotive dashcam with genuine Sony STARVIS 2 IMX678 sensor, built-in intelligent ADAS safety alerts, and extreme heat resilient supercapacitor.'
    },
    specs: [
      { label: 'Front Sensor', value: 'Sony STARVIS™ 2 4K UHD (3840x2160 @ 30fps)' },
      { label: 'Rear Camera', value: '1080p Full HD HDR (IP68 Waterproof External)' },
      { label: 'ADAS Features', value: 'Lane Departure (LDWS) & Forward Collision (FCWS)' },
      { label: 'Power Unit', value: 'Dual Supercapacitor (-25°C ~ +80°C Tropical)' }
    ],
    fullSpecs: {
      fieldOfView: '150° Ultra-Wide Diagonal Glass Lens (F/1.8 Aperture)',
      storageMedia: 'Dual Slot MicroSD (Up to 512GB Class 10 / U3 / V30)',
      nightVision: 'True HDR Super Night Vision with Dynamic WDR',
      connectivity: 'Dual-Band 5GHz Wi-Fi + Integrated GNSS GPS Logger',
      gSensor: '3-Axis Shock Sensor with Parking Mode Time-Lapse Monitoring',
      certifications: 'ISO 9001:2015, FCC Part 15, CE, RoHS'
    },
    diagramType: 'dashcam'
  },
  {
    id: 'gpt-bsm240',
    modelCode: 'GPT-BSM240 RADAR',
    category: 'dashcam',
    badge: 'ADAS Sensor',
    badgeColor: 'purple',
    title: {
      id: 'Sistem Radar Blind Spot Detection 77GHz Otomotif',
      en: 'Automotive 77GHz Millimeter-Wave Blind Spot Detection System'
    },
    shortDesc: {
      id: 'Modul sensor radar gelombang milimeter 77GHz untuk pemantauan titik buta (BSD), bantuan pindah lajur (LCA), dan peringatan lalu lintas lintas belakang (RCTA) dengan akurasi segala cuaca.',
      en: '77GHz millimeter-wave radar ECU system for blind-spot detection (BSD), lane-change assist (LCA), and rear cross-traffic alert (RCTA) in all weather conditions.'
    },
    specs: [
      { label: 'Radar Frequency', value: '77 GHz - 81 GHz Millimeter-Wave FMCW' },
      { label: 'Detection Range', value: 'Up to 50 meters (Vehicle & Motorcycle)' },
      { label: 'Alert Protocols', value: 'A-Pillar LED Warning & Acoustic Buzzer' },
      { label: 'Weather Rating', value: 'IP67 Waterproof & Dustproof Radar Transceivers' }
    ],
    fullSpecs: {
      operatingVoltage: '9V - 18V DC',
      operatingTemp: '-40°C to +85°C (Automotive Bumper Exterior)',
      detectionAccuracy: '±0.25 meters range / ±1° azimuth',
      latency: '< 40 ms Real-Time CAN-Bus Processing',
      certifications: 'ISO 16750, E-Mark ECE R151, FCC, RoHS'
    },
    diagramType: 'dashcam'
  },

  /* ══════════════════════════════════════════════════════════════════════
     CATEGORY 4: INDUSTRIAL AUTOMATION & TEST JIGS (automation)
     ══════════════════════════════════════════════════════════════════════ */
  {
    id: 'gpt-jig4000',
    modelCode: 'GPT-JIG4000 AUTO',
    category: 'automation',
    badge: 'Turnkey Solution',
    badgeColor: 'blue',
    title: {
      id: 'Jig Uji Otomatis Multi-Stasiun ICT & FCT Terintegrasi PLC',
      en: 'Automated ICT & FCT Multi-Station Test Fixture'
    },
    shortDesc: {
      id: 'Mesin jig uji otomatis terintegrasi PLC dan sistem pneumatik servo presisi untuk validasi kelistrikan jalur PCB (ICT) dan fungsionalitas produk akhir (FCT) dengan pelacakan MES cloud.',
      en: 'Industrial automated test jig integrating PLC logic and servo pneumatic clamping for high-throughput In-Circuit and Functional PCB validation with cloud MES tracking.'
    },
    specs: [
      { label: 'Control System', value: 'Omron/Mitsubishi Industrial PLC + Touch HMI' },
      { label: 'Test Modules', value: 'ICT Resistance/Capacitance & FCT Signal Sweep' },
      { label: 'Cycle Time', value: '< 8.5 seconds / Unit throughput' },
      { label: 'MES Logging', value: 'Automated 2D Barcode / Cloud MES Database' }
    ],
    fullSpecs: {
      airSupply: '0.4 - 0.7 MPa Clean Dry Air (Festo Pneumatic Servos)',
      powerSupply: '220V AC ±10%, 50/60Hz, 1.2 kW',
      probePinPitch: 'Down to 0.5mm Spring Probe Contactors (Ingun / QA)',
      safetyFeatures: 'Dual Optical Light Curtains & Hardware E-Stop',
      dataInterface: 'Ethernet TCP/IP, RS485, USB 3.0 MES Bridge',
      certifications: 'CE Machinery Directive 2006/42/EC, ISO 9001:2015'
    },
    diagramType: 'automation'
  },
  {
    id: 'gpt-wh-tester',
    modelCode: 'GPT-WH-TESTER 128P',
    category: 'automation',
    badge: 'Harness Bench',
    badgeColor: 'teal',
    title: {
      id: 'Bench Pengujian Kontinuitas & Hipot Wire Harness Otomotif 128-Pin',
      en: '128-Point Automotive Wire Harness Continuity & Hipot Tester'
    },
    shortDesc: {
      id: 'Sistem pengujian kabel wire harness otomotif berkecepatan tinggi untuk mendeteksi hubungan singkat, kabel putus, resistansi kontak, dan uji isolasi tegangan tinggi (Hipot) hingga 1000V DC.',
      en: 'High-speed automotive wire harness testing bench verifying continuity, open/short circuits, contact resistance, and high-voltage insulation (Hipot) up to 1000V DC.'
    },
    specs: [
      { label: 'Test Points', value: '128 Test Points (Expandable to 512 Points)' },
      { label: 'Hipot Voltage', value: 'Up to 1000V DC Insulation Test' },
      { label: 'Testing Speed', value: '< 1.2 seconds for full 128-pin harness' },
      { label: 'Visual Guidance', value: 'LED Guided Insertion & Audio Pass/Fail Buzzer' }
    ],
    fullSpecs: {
      continuityThreshold: '0.1Ω - 100Ω Programmable',
      insulationResistance: '1MΩ - 500MΩ @ 500V/1000V DC',
      clampingMechanism: 'Pneumatic Quick-Lock Connector Blocks',
      traceability: 'Pass/Fail Barcode Label Printing Integration',
      certifications: 'ISO 9001:2015, CE'
    },
    diagramType: 'automation'
  },

  /* ══════════════════════════════════════════════════════════════════════
     CATEGORY 5: TURNKEY EMS & SMT SUB-ASSEMBLIES (ems)
     ══════════════════════════════════════════════════════════════════════ */
  {
    id: 'gpt-smt-ems',
    modelCode: 'GPT-SMT-BOX TURNKEY',
    category: 'ems',
    badge: 'FTZ Manufacturing',
    badgeColor: 'purple',
    title: {
      id: 'Layanan Kontrak Manufaktur EMS SMT Presisi & Perakitan Box-Build',
      en: 'High-Precision SMT & Box-Build EMS Contract Manufacturing'
    },
    shortDesc: {
      id: 'Fasilitas manufaktur EMS kontrak lengkap di Batam FTZ: lini SMT kecepatan tinggi Panasonic/Yamaha (80K CPH), inspeksi 3D SPI/AOI, pelapisan konformal, hingga perakitan produk jadi siap ekspor.',
      en: 'Turnkey contract EMS manufacturing in Batam FTZ: high-speed Yamaha/Panasonic SMT lines (80K CPH), 3D SPI/AOI verification, conformal coating, and full box-build assembly.'
    },
    specs: [
      { label: 'Placement Speed', value: 'Up to 80,000 Components / Hour per Line' },
      { label: 'Micro Capability', value: '01005 (0402 Metric) Chips & 0.3mm BGA Pitch' },
      { label: 'Reflow Process', value: '10-Zone Nitrogen (N2) Convection Oven' },
      { label: 'Cleanroom', value: 'Class 100K ESD Protected Workshop' }
    ],
    fullSpecs: {
      pcbSizeRange: '50 x 50 mm to 510 x 460 mm (Up to 16 Layers)',
      componentHeight: 'Up to 25 mm with 3D Component Verification',
      solderPasteInspection: 'Koh Young 3D SPI Inline Closed-Loop Inspection',
      opticalInspection: 'Mirtec 3D AOI (100% Component & Joint Check)',
      conformalCoating: 'Automated Selective Spray & UV Curing Oven',
      certifications: 'ISO 9001:2015, IATF 16949 Process Compliant, ANSI/ESD S20.20'
    },
    diagramType: 'ems'
  },
  {
    id: 'gpt-bms-48v',
    modelCode: 'GPT-BMS-48V ECU',
    category: 'ems',
    badge: 'EV & Mobility',
    badgeColor: 'teal',
    title: {
      id: 'PCBA Modul Battery Management System (BMS) 48V Otomotif EV',
      en: 'Automotive 48V EV Battery Management System (BMS) PCBA Module'
    },
    shortDesc: {
      id: 'Perakitan papan sirkuit PCBA BMS 48V densitas tinggi untuk kendaraan listrik ringan dan modul baterai otomotif, dilengkapi monitoring tegangan sel presisi tinggi dan komunikasi CAN-Bus 2.0B.',
      en: 'High-density 48V automotive BMS PCBA module for light electric vehicles and energy storage, featuring precision cell voltage monitoring and CAN-Bus 2.0B.'
    },
    specs: [
      { label: 'Voltage Range', value: '12S - 16S Li-Ion / LiFePO4 (36V - 60V DC)' },
      { label: 'Continuous Current', value: '100A Continuous / 250A Peak Discharge' },
      { label: 'Cell Accuracy', value: '±1.5 mV Precision Cell Voltage Telemetry' },
      { label: 'Communication', value: 'Isolated CAN-Bus 2.0B, RS485, UART' }
    ],
    fullSpecs: {
      balancingCurrent: '150 mA Passive Cell Balancing per Channel',
      temperatureSensors: '4x External NTC Thermistors for Pack Health',
      protectionLevels: 'Over/Under Voltage, Over Current, Short Circuit, Overtemp',
      pcbConstruction: '4-Layer 2oz Heavy Copper with Conformal Coating',
      certifications: 'ISO 26262 ASIL-B Ready, UN38.3, RoHS'
    },
    diagramType: 'ems'
  }
];
