/**
 * Featured Engineering Products & Solutions Catalog
 * Inspired by Festo's industrial technical catalog layout
 */

export const FEATURED_PRODUCTS = [
  {
    id: 'gpt-hu9800',
    modelCode: 'GPT-HU9800 PRO',
    category: 'headunit',
    badge: 'OEM Flagship',
    badgeColor: 'teal',
    title: {
      id: 'Smart Android Infotainment System 10.1" QLED',
      en: 'Smart Android Infotainment System 10.1" QLED'
    },
    shortDesc: {
      id: 'Headunit standar otomotif dengan prosesor Octa-core, panel QLED 1280x720, DSP 32-Band terintegrasi, dan dukungan penuh CAN-Bus mobil modern.',
      en: 'Automotive-grade infotainment powered by Octa-core SoC, 10.1" QLED panel, integrated 32-band DSP, and native CAN-Bus protocol integration.'
    },
    specs: [
      { label: 'Display', value: '10.1" QLED 1280x720 / 2.5D Glass' },
      { label: 'Processor', value: 'Octa-Core 2.0 GHz ARM 64-bit' },
      { label: 'Connectivity', value: 'Wireless CarPlay, Android Auto, 4G LTE' },
      { label: 'CAN-Bus', value: 'Multi-Protocol Steering Wheel & OBD-II' }
    ],
    fullSpecs: {
      operatingVoltage: '9V - 16V DC (Reverse Polarity Protected)',
      operatingTemp: '-30°C to +80°C',
      memory: '4GB / 8GB LPDDR4 + 64GB / 128GB eMMC',
      audioDsp: 'AKM 32-bit DAC with 32-Band PEQ & Time Delay',
      radioTuner: 'NXP TEF6686 Automotive Tuner with RDS',
      certifications: 'ISO 9001:2015, CE, RoHS, E-Mark Compliant'
    },
    diagramType: 'infotainment'
  },
  {
    id: 'gpt-dsp8800',
    modelCode: 'GPT-DSP8800 HD',
    category: 'audio',
    badge: 'Audiophile Grade',
    badgeColor: 'red',
    title: {
      id: 'High-Resolution 8-Channel Digital Sound Processor',
      en: 'High-Resolution 8-Channel Digital Sound Processor'
    },
    shortDesc: {
      id: 'Prosesor audio digital presisi tinggi dengan dual 32-bit DSP engine, 6 input / 8 output aktif, dan kalibrasi akustik via software PC & Bluetooth.',
      en: 'High-fidelity audio processor with dual 32-bit floating-point DSP, 6 high/low inputs, 8 active outputs, and PC/Bluetooth acoustic calibration.'
    },
    specs: [
      { label: 'Architecture', value: 'Dual 32-Bit Floating Point DSP' },
      { label: 'I/O Channels', value: '6 High/Low-Level In / 8 RCA Out' },
      { label: 'Sampling Rate', value: '192 kHz / 32-bit Native Hi-Res' },
      { label: 'Equalizer', value: '31-Band PEQ / 0.02ms Time Delay' }
    ],
    fullSpecs: {
      operatingVoltage: '10V - 15.5V DC',
      operatingTemp: '-20°C to +75°C',
      dynamicRange: '> 110 dB (A-Weighted)',
      thd: '< 0.003% @ 1 kHz, 1V RMS',
      softwareSupport: 'Windows PC Suite + iOS/Android App (BT 5.0)',
      certifications: 'ISO 9001:2015, FCC, CE, RoHS'
    },
    diagramType: 'dsp'
  },
  {
    id: 'gpt-jig4000',
    modelCode: 'GPT-JIG4000 AUTO',
    category: 'automation',
    badge: 'Turnkey Solution',
    badgeColor: 'blue',
    title: {
      id: 'Automated ICT & FCT Multi-Station Test Jig',
      en: 'Automated ICT & FCT Multi-Station Test Jig'
    },
    shortDesc: {
      id: 'Mesin jig uji otomatis terintegrasi PLC dan sistem pneumatik servo presisi untuk validasi kelistrikan (ICT) dan fungsionalitas (FCT) jalur perakitan.',
      en: 'Industrial automated test jig integrating PLC logic and servo pneumatic clamping for high-throughput In-Circuit and Functional PCB validation.'
    },
    specs: [
      { label: 'Control System', value: 'Industrial PLC + Pneumatic Servo' },
      { label: 'Test Modules', value: 'ICT, FCT, Current/Voltage Sweep' },
      { label: 'Cycle Time', value: '< 8.5 seconds / Unit throughput' },
      { label: 'MES Logging', value: 'Automated Barcode/QR Cloud Logging' }
    ],
    fullSpecs: {
      airSupply: '0.4 - 0.7 MPa Clean Dry Air',
      powerSupply: '220V AC ±10%, 50/60Hz, 1.2 kW',
      probePinPitch: 'Down to 0.5mm Spring Probe Contactors',
      safetyFeatures: 'Dual Optical Light Curtains & Emergency Stop',
      dataInterface: 'Ethernet TCP/IP, RS485, USB 3.0 MES Bridge',
      certifications: 'CE Machinery Directive, ISO 9001:2015'
    },
    diagramType: 'automation'
  },
  {
    id: 'gpt-amp4100',
    modelCode: 'GPT-AMP4100 D-CLASS',
    category: 'audio',
    badge: 'Compact OEM',
    badgeColor: 'gold',
    title: {
      id: 'Ultra-Compact 4-Channel Automotive Class-D Amplifier',
      en: 'Ultra-Compact 4-Channel Automotive Class-D Amplifier'
    },
    shortDesc: {
      id: 'Penguat audio Class-D efisiensi tinggi (>88%) dengan sasis die-cast aluminium compact, minim disipasi panas, dan proteksi sirkuit pintar terintegrasi.',
      en: 'High-efficiency Class-D power amplifier with die-cast aluminum heat dissipation chassis, low thermal loss, and automotive multi-fault protection.'
    },
    specs: [
      { label: 'RMS Output', value: '4 x 100W @ 4Ω (Bridgeable 2x200W)' },
      { label: 'Topology', value: 'High-Efficiency Class-D (> 88%)' },
      { label: 'Frequency Resp.', value: '10 Hz - 35 kHz (±1 dB)' },
      { label: 'Chassis', value: 'Compact Extruded Aluminum Heat-Sink' }
    ],
    fullSpecs: {
      operatingVoltage: '9V - 16V DC with Auto-Sense Turn On',
      operatingTemp: '-40°C to +85°C (Automotive Underseat/Trunk)',
      dampingFactor: '> 180 @ 100 Hz',
      protectionCircuit: 'Thermal Shutdown, Short Circuit, DC Offset, Over-Volt',
      dimensions: '185 x 115 x 42 mm',
      certifications: 'ISO 9001:2015, E-Mark, CE'
    },
    diagramType: 'amplifier'
  },
  {
    id: 'gpt-dvr4k',
    modelCode: 'GPT-DVR4K PRO ADAS',
    category: 'dashcam',
    badge: 'Vision & Safety',
    badgeColor: 'teal',
    title: {
      id: 'Dual-Channel 4K UHD Dashcam with Sony STARVIS™ 2',
      en: 'Dual-Channel 4K UHD Dashcam with Sony STARVIS™ 2'
    },
    shortDesc: {
      id: 'Kamera pengawas berkendara sensor Sony STARVIS 2 IMX678 dengan resolusi 4K sejati, peringatan keselamatan ADAS (LDWS/FCWS), dan superkapasitor tahan panas.',
      en: 'Dual-channel automotive dashcam with genuine Sony STARVIS 2 sensor, built-in intelligent ADAS safety alerts, and extreme heat resilient supercapacitor.'
    },
    specs: [
      { label: 'Front Sensor', value: 'Sony STARVIS™ 2 4K UHD (3840x2160)' },
      { label: 'Rear Sensor', value: '1080p Full HD HDR (IP68 Waterproof)' },
      { label: 'ADAS Features', value: 'Lane Departure & Forward Collision Alert' },
      { label: 'Power Unit', value: 'Supercapacitor Resilience (-20°C ~ +75°C)' }
    ],
    fullSpecs: {
      fieldOfView: '150° Ultra-Wide Angle Lens (F/1.8 Aperture)',
      storageMedia: 'Dual Slot MicroSD (Up to 512GB High Endurance)',
      nightVision: 'True HDR Super Night Vision 2.0 with WDR',
      connectivity: 'Dual-Band 5GHz Wi-Fi + GPS Geo-Tagging',
      gSensor: '3-Axis Shock Sensor with Parking Mode Time-Lapse',
      certifications: 'ISO 9001:2015, FCC, CE, RoHS'
    },
    diagramType: 'dashcam'
  },
  {
    id: 'gpt-smt-ems',
    modelCode: 'GPT-SMT-BOX TURNKEY',
    category: 'ems',
    badge: 'FTZ Manufacturing',
    badgeColor: 'purple',
    title: {
      id: 'High-Precision SMT & Box-Build EMS Contract Manufacturing',
      en: 'High-Precision SMT & Box-Build EMS Contract Manufacturing'
    },
    shortDesc: {
      id: 'Fasilitas manufaktur EMS kontrak lengkap di Batam FTZ: lini SMT kecepatan tinggi Panasonic/Yamaha, 3D SPI/AOI, pelapisan konformal, hingga perakitan produk jadi.',
      en: 'Turnkey contract EMS manufacturing in Batam FTZ: high-speed Yamaha/Panasonic SMT lines, 3D SPI/AOI verification, conformal coating, and full box-build.'
    },
    specs: [
      { label: 'Placement Speed', value: 'Up to 80,000 Components / Hour' },
      { label: 'Micro Capability', value: '01005 (0402 Metric) Chips & 0.3mm BGA' },
      { label: 'Reflow Process', value: '10-Zone Nitrogen (N2) Convection Oven' },
      { label: 'Cleanroom', value: 'Class 100K ESD Protected Workshop' }
    ],
    fullSpecs: {
      pcbSizeRange: '50 x 50 mm to 510 x 460 mm',
      componentHeight: 'Up to 25 mm with 3D Component Inspection',
      solderPasteInspection: 'Koh Young 3D SPI Inline Inspection',
      opticalInspection: 'Mirtec 3D AOI (100% Component & Joint Check)',
      conformalCoating: 'Automated Selective Spray & UV Curing Oven',
      certifications: 'ISO 9001:2015, IATF 16949 Compliant Process, ESD S20.20'
    },
    diagramType: 'ems'
  }
];
