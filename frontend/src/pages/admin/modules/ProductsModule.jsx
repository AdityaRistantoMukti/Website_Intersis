import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Save, Plus, Pencil, Trash2, Package, Layers, Sliders, FileCheck,
  X, Sparkles, Search, CheckCircle2, AlertCircle, RefreshCw, FileText,
  Tag, Globe, Zap, Cpu, Code, ArrowRight, ArrowLeft, Upload, Image as ImageIcon,
  Star, Images
} from 'lucide-react';
import api, { getImageUrl, extractErrorMessage } from '../../../lib/api';
import { translateContent } from '../../../lib/translator';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import LanguageTabControl from '../../../components/admin/LanguageTabControl';
import './ProductsModule.css';

// ─── Default Content Constants ────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'automation',                label: 'Automation' },
  { key: 'mobile_intelligent_device', label: 'Mobile Intelligent Device' },
  { key: 'amplifier',                 label: 'Amplifier' },
  { key: 'subwoofer',                 label: 'Subwoofer' },
  { key: 'dsp',                       label: 'DSP' },
  { key: 'android_headunit',          label: 'Android Headunit' },
  { key: 'dash_camera_recorders',     label: 'Dash Camera Recorders' },
];

export const normalizeCategory = (catKey) => {
  if (!catKey) return 'automation';
  const legacyMap = {
    headunit: 'android_headunit',
    infotainment: 'android_headunit',
    audio: 'amplifier',
    dashcam: 'dash_camera_recorders',
    ems: 'automation',
  };
  return legacyMap[catKey] || catKey;
};

const getCategoryLabel = (catKey) => {
  const norm = normalizeCategory(catKey);
  const found = CATEGORIES.find(c => c.key === norm);
  return found ? found.label : (catKey || 'Automation');
};

const BADGE_COLORS = ['teal', 'blue', 'purple', 'red', 'gold'];
const DIAGRAM_TYPES = [
  { key: 'infotainment', label: 'Infotainment (Headunit/Display)' },
  { key: 'dsp',          label: 'DSP (Digital Signal Processor)' },
  { key: 'amplifier',    label: 'Amplifier (Multi-Channel Power)' },
  { key: 'dashcam',      label: 'Dashcam & ADAS Sensor' },
  { key: 'automation',   label: 'Automation & Test Jig' },
  { key: 'ems',          label: 'EMS / SMT Box-Build' },
];

const COMMON_SPEC_KEYS = [
  { key: 'operatingVoltage', label: 'Tegangan Kerja (Operating Voltage)' },
  { key: 'operatingTemp',    label: 'Suhu Operasional (Operating Temp)' },
  { key: 'certifications',   label: 'Sertifikasi Standar (Certifications)' },
  { key: 'memory',           label: 'Konfigurasi Memori (Memory & Storage)' },
  { key: 'audioDsp',         label: 'Arsitektur Audio DSP' },
  { key: 'radioTuner',       label: 'Modul Tuner Radio' },
  { key: 'videoInput',       label: 'Input Video & Kamera' },
  { key: 'dimensions',       label: 'Dimensi Fisik (Dimensions)' },
  { key: 'powerSupply',      label: 'Konsumsi Daya (Power Supply)' },
  { key: 'dataInterface',    label: 'Antarmuka Data (Interface/CAN)' },
  { key: 'fieldOfView',      label: 'Sudut Pandang Lensa (FOV)' },
  { key: 'nightVision',      label: 'Sensor Malam (Night Vision)' },
  { key: 'storageMedia',     label: 'Media Penyimpanan (MicroSD / SSD)' },
  { key: 'smtCapacity',      label: 'Kapasitas Lini SMT (Speed CPH)' },
  { key: 'pcbSizeRange',     label: 'Ukuran PCB (PCB Dimension Range)' },
];

const DEFAULT_HEADER = {
  id: {
    title: 'Solusi Manufaktur Elektronik Otomotif & Otomasi Presisi',
    subtitle: 'Katalog resmi produk siap OEM/ODM standar Tier-1, prosesor audio DSP, perangkat keselamatan berkendara, mesin jig uji otomatis, dan layanan kontrak perakitan SMT berkecepatan tinggi di Kawasan Bebas Batam (FTZ).',
    chips: [
      { value: '12+ Model', label: 'SKU Siap Produksi', sub: 'Turnkey OEM / ODM' },
      { value: '80.000 CPH', label: 'Kecepatan Lini SMT', sub: 'Yamaha & Panasonic Lines' },
      { value: 'IATF 16949', label: 'Standar Mutu Nol Cacat', sub: '& ISO 9001:2015' },
      { value: '45 Menit', label: 'Logistik Bebas Pajak', sub: 'Batam FTZ ke Singapura' },
    ],
  },
  en: {
    title: 'Automotive Electronics & Precision Manufacturing Catalog',
    subtitle: 'Official engineering catalog of Tier-1 standard OEM/ODM products, DSP audio processors, in-vehicle safety sensors, automated test fixtures, and high-speed turnkey SMT assembly at Batam Free Trade Zone.',
    chips: [
      { value: '12+ Models', label: 'Production-Ready SKUs', sub: 'Turnkey OEM / ODM' },
      { value: '80,000 CPH', label: 'SMT Line Capacity', sub: 'Yamaha & Panasonic Lines' },
      { value: 'IATF 16949', label: 'Zero-Defect Standard', sub: '& ISO 9001:2015' },
      { value: '45 Minutes', label: 'Duty-Free Logistics', sub: 'Batam FTZ to Singapore' },
    ],
  },
};

const DEFAULT_CATEGORIES = {
  id: [
    {
      key: 'automation',
      name: 'Automation',
      desc: 'Mesin jig uji otomatis multi-stasiun ICT & FCT terintegrasi PLC, serta bangku pengujian kontinuitas wire harness presisi.',
    },
    {
      key: 'mobile_intelligent_device',
      name: 'Mobile Intelligent Device',
      desc: 'Modul AI Box pintar, telematics control unit (T-Box) 4G/IoT, dan perangkat pintar integrasi kokpit kendaraan nirkabel.',
    },
    {
      key: 'amplifier',
      name: 'Amplifier',
      desc: 'Penguat daya audio mobil Class-D dan Class-AB multi-kanal efisiensi tinggi dengan proteksi termal andal.',
    },
    {
      key: 'subwoofer',
      name: 'Subwoofer',
      desc: 'Subwoofer aktif kabin, downfire box, sparetire active sub, dan underseat subwoofer bertenaga bass tinggi.',
    },
    {
      key: 'dsp',
      name: 'DSP',
      desc: 'Digital Signal Processor resolusi tinggi 32-bit floating point, multi-channel equalizer, dan penyesuaian akustik kabin.',
    },
    {
      key: 'android_headunit',
      name: 'Android Headunit',
      desc: 'Headunit pintar layar sentuh QLED otomotif, konektivitas wireless Apple CarPlay & Android Auto, serta integrasi CAN-Bus kendaraan.',
    },
    {
      key: 'dash_camera_recorders',
      name: 'Dash Camera Recorders',
      desc: 'Kamera perekam perjalanan sensor Sony STARVIS 4K UHD, smart mirror recorder, dan modul keselamatan aktif ADAS.',
    },
  ],
  en: [
    {
      key: 'automation',
      name: 'Automation',
      desc: 'PLC-integrated automated multi-station ICT & FCT test fixtures and precision automotive wire harness test benches.',
    },
    {
      key: 'mobile_intelligent_device',
      name: 'Mobile Intelligent Device',
      desc: 'Smart AI Boxes, 4G/IoT telematics control units (T-Box), and wireless intelligent vehicle cockpit devices.',
    },
    {
      key: 'amplifier',
      name: 'Amplifier',
      desc: 'High-efficiency multi-channel Class-D and Class-AB car audio power amplifiers with advanced thermal protection.',
    },
    {
      key: 'subwoofer',
      name: 'Subwoofer',
      desc: 'Active cabin subwoofers, downfire subwoofer enclosures, spare tire active subs, and slim underseat subwoofers.',
    },
    {
      key: 'dsp',
      name: 'DSP',
      desc: 'High-resolution 32-bit floating point Digital Signal Processors, multi-channel acoustic tuning, and time alignment.',
    },
    {
      key: 'android_headunit',
      name: 'Android Headunit',
      desc: 'Automotive QLED touchscreen smart headunit solutions, wireless Apple CarPlay & Android Auto, and native CAN-Bus telemetry.',
    },
    {
      key: 'dash_camera_recorders',
      name: 'Dash Camera Recorders',
      desc: 'Sony STARVIS 4K UHD driving dash cameras, smart mirror recorders, and active ADAS safety vision sensors.',
    },
  ],
};

const DEFAULT_RFQ = {
  id: {
    rfqTitle: 'Membutuhkan Kustomisasi Khusus atau Tooling Baru?',
    rfqSubtitle: 'Tim R&D dan engineering kami di Batam FTZ siap berkolaborasi untuk perancangan skematik PCB, penyesuaian firmware CAN-Bus, hingga perakitan turnkey box-build standar ekspor global.',
    rfqButton: 'Konsultasi Cepat via WhatsApp B2B',
    workflowTitle: 'Dari Desain Konsep Hingga Produksi Massal (OEM / ODM Journey)',
    workflowSubtitle: 'Metodologi rekayasa terstruktur kami menjamin kualitas bebas cacat (Zero-Defect), kepatuhan regulasi otomotif, dan efisiensi biaya manufaktur.',
    steps: [
      {
        step: '01',
        title: 'Analisis RFQ & Review BOM',
        desc: 'Evaluasi mendalam spesifikasi teknis, ketersediaan komponen, dan kalkulasi penawaran biaya resmi dalam 24-48 jam.',
      },
      {
        step: '02',
        title: 'Rekayasa DFM & Rapid Prototyping',
        desc: 'Optimalisasi layout Design-for-Manufacturing (DFM) untuk menjamin yield SMT maksimal dan pembuatan sampel uji fungsional.',
      },
      {
        step: '03',
        title: 'Tooling, Stensil & Pilot Run',
        desc: 'Fabrikasi stensil laser elektropolis serta pengujian perakitan batch awal terkontrol untuk memvalidasi toleransi mesin.',
      },
      {
        step: '04',
        title: 'Validasi Kualitas 100% (SPI, AOI, ICT)',
        desc: 'Inspeksi pasta solder 3D, inspeksi optik otomatis AOI, validasi jalur kelistrikan ICT, dan uji ketahanan termal ekstrem.',
      },
      {
        step: '05',
        title: 'Produksi Massal & Ekspor FTZ',
        desc: 'Perakitan massal berkecepatan 80.000 CPH, integrasi serialisasi barcode MES, dan pengiriman kilat 45 menit ke pelabuhan Singapura.',
      },
    ],
  },
  en: {
    rfqTitle: 'Need Custom Engineering or New Product Tooling?',
    rfqSubtitle: 'Our engineering & R&D team at Batam FTZ is ready to collaborate on schematic design, CAN-Bus firmware customization, and turnkey box-build assembly for global export.',
    rfqButton: 'Direct B2B WhatsApp Consultation',
    workflowTitle: 'From Concept Design to Mass Production (OEM / ODM Journey)',
    workflowSubtitle: 'Our structured engineering methodology guarantees zero-defect quality, automotive regulatory compliance, and maximum cost efficiency.',
    steps: [
      {
        step: '01',
        title: 'RFQ & BOM Review',
        desc: 'Technical specification review, component sourcing validation, and cost quotation within 24-48 business hours.',
      },
      {
        step: '02',
        title: 'DFM Engineering & Prototyping',
        desc: 'Design-for-Manufacturing optimization ensuring optimal SMT placement yields and functional engineering prototypes.',
      },
      {
        step: '03',
        title: 'Tooling, Stencils & Pilot Run',
        desc: 'Electro-polished laser stencil fabrication and controlled pilot production batches to qualify machinery tolerances.',
      },
      {
        step: '04',
        title: '100% Quality Validation (SPI, AOI, ICT)',
        desc: '3D solder paste inspection, automated optical inspection, in-circuit testing, and dynamic thermal burn-in validation.',
      },
      {
        step: '05',
        title: 'Mass Assembly & FTZ Logistics',
        desc: 'High-speed 80K CPH assembly, real-time MES barcode serialization, and 45-minute express transit to Singapore seaport.',
      },
    ],
  },
};

const EMPTY_PRODUCT = {
  model_code: '', category: 'automation', badge: '', badge_color: 'teal',
  title_id: '', title_en: '', short_desc_id: '', short_desc_en: '',
  specs: [
    { label: '', value: '' }, { label: '', value: '' },
    { label: '', value: '' }, { label: '', value: '' },
  ],
  full_specs: {},
  diagram_type: 'infotainment', status: 1, sort_order: 0,
  image: '',
  gallery: [],
};

// ─── REVAMPED PRODUCT FORM MODAL ──────────────────────────────────────────────
function ProductFormModal({ product, onClose, onSaved }) {
  const { addToast } = useAdminAuth();
  const isEdit = Boolean(product?.id);
  const [modalTab, setModalTab] = useState('identity'); // 'identity' | 'bilingual' | 'specs' | 'full_specs'
  const [translating, setTranslating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cover Image State
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('');
  const [existingCover, setExistingCover] = useState(product?.image || '');
  const [removeCover, setRemoveCover] = useState(false);

  // Gallery Images State (Multi-Angle)
  const [existingGallery, setExistingGallery] = useState(() => {
    if (Array.isArray(product?.gallery)) return [...product.gallery];
    if (typeof product?.gallery === 'string') {
      try { return JSON.parse(product.gallery); } catch (e) { return []; }
    }
    return [];
  });
  const [newGalleryFiles, setNewGalleryFiles] = useState([]); // array of { id, file, previewUrl }

  // Form State
  const [form, setForm] = useState(() => {
    if (!product) return { ...EMPTY_PRODUCT, specs: EMPTY_PRODUCT.specs.map(s => ({ ...s })) };
    return {
      model_code:    product.model_code   || '',
      category:      normalizeCategory(product.category),
      badge:         product.badge        || '',
      badge_color:   product.badge_color  || 'teal',
      title_id:      product.title_id     || '',
      title_en:      product.title_en     || '',
      short_desc_id: product.short_desc_id || '',
      short_desc_en: product.short_desc_en || '',
      specs: Array.isArray(product.specs)
        ? [...product.specs, { label: '', value: '' }, { label: '', value: '' }].slice(0, 4)
        : EMPTY_PRODUCT.specs.map(s => ({ ...s })),
      full_specs:    typeof product.full_specs === 'object' && product.full_specs ? product.full_specs : {},
      diagram_type:  product.diagram_type  || 'infotainment',
      status:        product.status !== undefined ? Number(product.status) : 1,
      sort_order:    product.sort_order   || 0,
      image:         product.image        || '',
      gallery:       Array.isArray(product.gallery) ? product.gallery : [],
    };
  });

  // Full Specs Key-Value array state for Visual Mode
  const [specRows, setSpecRows] = useState(() => {
    const fs = typeof product?.full_specs === 'object' && product?.full_specs ? product.full_specs : {};
    const entries = Object.entries(fs);
    if (entries.length === 0) {
      return [
        { key: 'operatingVoltage', value: '9V - 16V DC (Reverse Polarity Protected)' },
        { key: 'operatingTemp',    value: '-30°C to +80°C (Automotive Cockpit Grade)' },
        { key: 'certifications',   value: 'IATF 16949, ISO 9001:2015, CE, E-Mark' },
      ];
    }
    return entries.map(([k, v]) => ({ key: k, value: String(v) }));
  });

  // Full Specs JSON Raw Text & Mode
  const [specsMode, setSpecsMode] = useState('visual'); // 'visual' | 'json'
  const [fullSpecsText, setFullSpecsText] = useState(() => {
    const fs = typeof product?.full_specs === 'object' && product?.full_specs ? product.full_specs : {};
    return JSON.stringify(fs, null, 2);
  });
  const [fullSpecsError, setFullSpecsError] = useState('');

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const setSpec = (idx, key, val) => {
    setForm(prev => {
      const s = [...prev.specs];
      s[idx] = { ...s[idx], [key]: val };
      return { ...prev, specs: s };
    });
  };

  // Synchronize specRows to form.full_specs and raw JSON text
  const updateSpecRows = (newRows) => {
    setSpecRows(newRows);
    const obj = {};
    newRows.forEach(r => {
      if (r.key.trim()) obj[r.key.trim()] = r.value.trim();
    });
    setForm(prev => ({ ...prev, full_specs: obj }));
    setFullSpecsText(JSON.stringify(obj, null, 2));
    setFullSpecsError('');
  };

  const handleAddSpecRow = () => {
    updateSpecRows([...specRows, { key: '', value: '' }]);
  };

  const handleRemoveSpecRow = (idx) => {
    updateSpecRows(specRows.filter((_, i) => i !== idx));
  };

  const handleSpecRowChange = (idx, field, val) => {
    const updated = [...specRows];
    updated[idx] = { ...updated[idx], [field]: val };
    updateSpecRows(updated);
  };

  // Sync from JSON Text when user edits in JSON mode
  const handleFullSpecsChange = (text) => {
    setFullSpecsText(text);
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        setForm(prev => ({ ...prev, full_specs: parsed }));
        setSpecRows(Object.entries(parsed).map(([k, v]) => ({ key: k, value: String(v) })));
        setFullSpecsError('');
      } else {
        setFullSpecsError('Full specifications harus berupa JSON Object { "kunci": "nilai" }');
      }
    } catch {
      setFullSpecsError('Format JSON tidak valid — periksa tanda kutip ganda dan koma.');
    }
  };

  // Preset Template loader
  const loadPresetTemplate = (type) => {
    let preset = {};
    if (type === 'android_headunit' || type === 'headunit') {
      preset = {
        operatingVoltage: '9V - 16V DC (Reverse Polarity & Load Dump Protected)',
        operatingTemp: '-30°C to +80°C (Automotive Cockpit Grade)',
        memory: '4GB / 8GB LPDDR4 + 64GB / 128GB eMMC 5.1',
        audioDsp: 'AKM 32-bit DAC with 32-Band PEQ, Time Alignment',
        radioTuner: 'NXP TEF6686 Automotive Tuner with RDS / AF',
        videoInput: 'AHD 1080p Reverse Camera & 360° AVM Support',
        certifications: 'IATF 16949 Compliant, ISO 9001:2015, CE, E-Mark',
      };
    } else if (type === 'amplifier') {
      preset = {
        operatingVoltage: '9V - 16V DC with Auto-Sense Turn On',
        operatingTemp: '-40°C to +85°C Automotive Grade',
        dampingFactor: '> 180 @ 100 Hz',
        powerSupply: 'High-Current MOSFET PWM Switching Power Supply',
        dimensions: '185 x 115 x 42 mm (Extruded Aluminum Heatsink)',
        certifications: 'ISO 9001:2015, E-Mark, CE, RoHS',
      };
    } else if (type === 'subwoofer') {
      preset = {
        operatingVoltage: '10V - 16V DC',
        operatingTemp: '-30°C to +80°C Underseat/Trunk Grade',
        signalToNoise: '> 95 dB',
        inputSensitivity: '0.2V - 6.0V Low Level / 0.5V - 12V High Level',
        dimensions: '260 x 145 x 50 mm Heavy Duty Enclosure',
        certifications: 'ISO 9001:2015, CE, RoHS',
      };
    } else if (type === 'dsp' || type === 'audio') {
      preset = {
        operatingVoltage: '10V - 15.5V DC (Auto Turn-On)',
        operatingTemp: '-20°C to +75°C',
        audioDsp: 'Dual 32-Bit Floating Point DSP Engine (192 kHz)',
        dynamicRange: '> 110 dB (A-Weighted)',
        opticalInput: 'Toslink Optical SPDIF up to 24-bit/96kHz',
        certifications: 'ISO 9001:2015, CE, RoHS',
      };
    } else if (type === 'dash_camera_recorders' || type === 'dashcam') {
      preset = {
        fieldOfView: '150° Ultra-Wide Diagonal Glass Lens (F/1.8 Aperture)',
        storageMedia: 'Dual Slot MicroSD (Up to 512GB Class 10 / U3 / V30)',
        nightVision: 'True HDR Super Night Vision with Dynamic WDR',
        operatingVoltage: '9V - 18V DC Automotive Bumper Grade',
        operatingTemp: '-40°C to +85°C Extreme Heat Resilient',
        certifications: 'ISO 16750, E-Mark ECE R151, FCC, RoHS',
      };
    } else if (type === 'mobile_intelligent_device') {
      preset = {
        operatingVoltage: '5V DC via USB Bus Power / 9V-16V DC Telematics',
        operatingTemp: '-20°C to +75°C Vehicle Interior Grade',
        memory: '4GB RAM + 64GB ROM (eMMC 5.1)',
        dataInterface: 'Dual-Band Wi-Fi 5GHz + 4G LTE SIM Slot + CAN-Bus 2.0B',
        dimensions: '78 x 78 x 16 mm Compact Pocket Size',
        certifications: 'CE, FCC, RoHS, Telec, ISO 9001:2015',
      };
    } else { // automation
      preset = {
        operatingVoltage: '220V AC ±10%, 50/60Hz, 1.2 kW',
        operatingTemp: '10°C to +45°C Cleanroom Environment',
        dataInterface: 'Ethernet TCP/IP, RS485, USB 3.0 MES Cloud Bridge',
        certifications: 'CE Machinery Directive 2006/42/EC, ISO 9001:2015',
      };
    }
    const rows = Object.entries(preset).map(([k, v]) => ({ key: k, value: String(v) }));
    updateSpecRows(rows);
    addToast(`Template spesifikasi '${type}' berhasil dimuat!`, 'info');
  };

  // Quick 4-specs presets
  const loadQuickSpecsPreset = (type) => {
    let s = [];
    if (type === 'android_headunit' || type === 'headunit') {
      s = [
        { label: 'Display', value: '10.1" QLED 1280x720 Optical Bonding' },
        { label: 'Processor', value: 'Octa-Core 2.0 GHz ARM 64-bit' },
        { label: 'Connectivity', value: 'Wireless CarPlay & Android Auto' },
        { label: 'CAN-Bus', value: 'Multi-Protocol Steering & OBD-II' },
      ];
    } else if (type === 'amplifier') {
      s = [
        { label: 'RMS Output', value: '4 x 100W @ 4Ω (Bridgeable 2 x 200W)' },
        { label: 'Topology', value: 'High-Efficiency Class-D (> 88%)' },
        { label: 'Frequency Resp.', value: '10 Hz - 35 kHz (±1 dB)' },
        { label: 'Chassis', value: 'Die-Cast Aluminum Heat-Sink' },
      ];
    } else if (type === 'subwoofer') {
      s = [
        { label: 'RMS Power', value: '1 x 1000W @ 1Ω / 650W @ 2Ω' },
        { label: 'Low Pass Filter', value: '30 Hz - 250 Hz Variable' },
        { label: 'Subsonic Filter', value: '10 Hz - 50 Hz Adjustable' },
        { label: 'Remote Control', value: 'Wired Dashboard Bass Knob' },
      ];
    } else if (type === 'dsp' || type === 'audio') {
      s = [
        { label: 'Architecture', value: 'Dual 32-Bit Floating Point DSP Engine' },
        { label: 'I/O Channels', value: '6 In / 8 Out RCA Active Outputs' },
        { label: 'Sampling Rate', value: '192 kHz / 32-bit Native Hi-Res' },
        { label: 'Equalizer', value: '31-Band PEQ / 0.02ms Time Alignment' },
      ];
    } else if (type === 'dash_camera_recorders' || type === 'dashcam') {
      s = [
        { label: 'Resolution', value: '4K UHD 3840x2160 @ 30fps' },
        { label: 'Sensor', value: 'Sony STARVIS 2 IMX678 HDR' },
        { label: 'ADAS Features', value: 'Lane Departure & Forward Collision' },
        { label: 'Power Backup', value: 'Dual Supercapacitor (-25°C ~ +80°C)' },
      ];
    } else if (type === 'mobile_intelligent_device') {
      s = [
        { label: 'OS & CPU', value: 'Android 13 / Qualcomm Octa-Core' },
        { label: 'Network', value: 'Dual-Band Wi-Fi 5GHz + 4G LTE SIM' },
        { label: 'GPS', value: 'Integrated GNSS GPS, GLONASS, BeiDou' },
        { label: 'Installation', value: 'USB Plug & Play Factory Port' },
      ];
    } else { // automation
      s = [
        { label: 'Control System', value: 'Omron/Mitsubishi PLC + Touch HMI' },
        { label: 'Test Modules', value: 'ICT Resistance/Capacitance & FCT' },
        { label: 'Cycle Time', value: '< 8.5 seconds / Unit throughput' },
        { label: 'MES Logging', value: 'Automated 2D Barcode / Cloud MES' },
      ];
    }
    setForm(prev => ({ ...prev, specs: s }));
    addToast('Preset spesifikasi singkat berhasil disisipkan!', 'info');
  };

  // Auto Translate Handler
  const handleAutoTranslate = async () => {
    if (!form.title_id.trim()) {
      addToast('Isi Judul (Indonesia) terlebih dahulu.', 'warning');
      return;
    }
    setTranslating(true);
    try {
      addToast('Menerjemahkan judul dan deskripsi ke English...', 'info');
      const translated = await translateContent({
        title: form.title_id,
        short_desc: form.short_desc_id || '',
      });
      setForm(prev => ({
        ...prev,
        title_en: translated.title || prev.title_en,
        short_desc_en: translated.short_desc || prev.short_desc_en,
      }));
      addToast('Berhasil menerjemahkan ke field Bahasa Inggris!', 'success');
    } catch (err) {
      addToast('Gagal menerjemahkan: ' + extractErrorMessage(err), 'error');
    } finally {
      setTranslating(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.model_code.trim()) {
      addToast('Kode Model / SKU wajib diisi.', 'error');
      setModalTab('identity');
      return;
    }
    if (!form.title_id.trim()) {
      addToast('Judul Produk (Indonesia) wajib diisi.', 'error');
      setModalTab('bilingual');
      return;
    }
    if (!form.title_en.trim()) {
      addToast('Product Title (English) wajib diisi.', 'error');
      setModalTab('bilingual');
      return;
    }
    if (fullSpecsError) {
      addToast('Perbaiki format JSON pada tab Spesifikasi Lengkap.', 'error');
      setModalTab('full_specs');
      return;
    }

    const formData = new FormData();
    formData.append('model_code', form.model_code);
    formData.append('category', form.category);
    formData.append('badge', form.badge || '');
    formData.append('badge_color', form.badge_color || 'teal');
    formData.append('title_id', form.title_id);
    formData.append('title_en', form.title_en);
    formData.append('short_desc_id', form.short_desc_id || '');
    formData.append('short_desc_en', form.short_desc_en || '');
    formData.append('diagram_type', form.diagram_type || 'infotainment');
    formData.append('status', form.status !== undefined ? String(form.status) : '1');
    formData.append('sort_order', String(form.sort_order || 0));
    formData.append('folder', 'products');

    const cleanSpecs = form.specs.filter(s => s.label.trim() || s.value.trim());
    formData.append('specs', JSON.stringify(cleanSpecs));
    formData.append('full_specs', JSON.stringify(form.full_specs || {}));

    if (coverFile) {
      formData.append('image', coverFile);
    } else if (removeCover) {
      formData.append('remove_image', '1');
    } else if (existingCover) {
      formData.append('image', existingCover);
    }

    formData.append('existing_gallery', JSON.stringify(existingGallery));
    newGalleryFiles.forEach(item => {
      formData.append('gallery', item.file);
    });

    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/admin/products/${product.id}`, formData);
        addToast(`Produk '${form.model_code}' berhasil diperbarui!`, 'success');
      } else {
        await api.post('/admin/products', formData);
        addToast(`Produk baru '${form.model_code}' berhasil ditambahkan!`, 'success');
      }
      onSaved();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const tabsConfig = [
    { id: 'identity',   label: '1. Identitas & Model',        icon: Tag },
    { id: 'bilingual',  label: '2. Judul & Deskripsi',        icon: Globe },
    { id: 'specs',      label: '3. Specs Singkat (4 Item)',   icon: Zap },
    { id: 'full_specs', label: '4. Spesifikasi Lengkap',      icon: Cpu },
  ];

  return (
    <div className="admin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="prod-modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="prod-modal-header">
          <div className="prod-modal-header__left">
            <div className="prod-modal-header__icon">
              <Package size={22} />
            </div>
            <div>
              <h3 className="prod-modal-header__title">
                {isEdit ? `Edit Produk — ${product.model_code}` : 'Tambah Produk Baru'}
                {form.badge && (
                  <span className={`prod-live-preview__badge prod-live-preview__badge--${form.badge_color || 'teal'}`}>
                    {form.badge}
                  </span>
                )}
              </h3>
              <p className="prod-modal-header__subtitle">
                {isEdit
                  ? `SKU Database ID #${product.id} • Kategori: ${getCategoryLabel(form.category)}`
                  : 'Daftarkan SKU produk baru ke katalog manufaktur PT. Global Philsonic Technologies.'}
              </p>
            </div>
          </div>
          <button type="button" className="prod-modal-close-btn" onClick={onClose} aria-label="Tutup Modal" title="Tutup">
            <X size={18} />
          </button>
        </div>

        {/* Modal Tabs Bar */}
        <div className="prod-modal-tabs">
          {tabsConfig.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                className={`prod-modal-tab-btn ${modalTab === t.id ? 'active' : ''}`}
                onClick={() => setModalTab(t.id)}
              >
                <Icon size={15} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="prod-modal-body">

            {/* ═════════ TAB 1: IDENTITAS & MODEL ═════════ */}
            {modalTab === 'identity' && (
              <>
                {/* Live Preview Bar */}
                <div className="prod-live-preview">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem', color: 'var(--adm-text)' }}>
                      {form.model_code || 'KODE-MODEL-BELUM-DIISI'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>•</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--adm-muted)' }}>
                      {getCategoryLabel(form.category)}
                    </span>
                    {form.badge && (
                      <span className={`prod-live-preview__badge prod-live-preview__badge--${form.badge_color || 'teal'}`}>
                        {form.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                      background: form.status ? '#22c55e' : '#71717a'
                    }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: form.status ? '#22c55e' : '#71717a' }}>
                      {form.status ? 'Aktif di Web' : 'Disembunyikan'}
                    </span>
                  </div>
                </div>

                {/* Form Fields Row 1 */}
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">
                      Kode Model / SKU <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      value={form.model_code}
                      onChange={e => set('model_code', e.target.value.toUpperCase())}
                      placeholder="mis: GPT-HU9800 PRO"
                      required
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>
                      Kode SKU unik (otomatis kapitalisasi).
                    </span>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">
                      Kategori Produk <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      className="admin-input"
                      value={form.category}
                      onChange={e => set('category', e.target.value)}
                    >
                      {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                    </select>
                    <span style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>
                      Menentukan tab filter di katalog publik.
                    </span>
                  </div>
                </div>

                {/* Form Fields Row 2 */}
                <div className="admin-form-grid" style={{ gridTemplateColumns: '1.2fr 1fr 1.2fr' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Label Badge (Opsional)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={form.badge}
                      onChange={e => set('badge', e.target.value)}
                      placeholder="mis: OEM Flagship, FTZ Line"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Warna Badge</label>
                    <select
                      className="admin-input"
                      value={form.badge_color}
                      onChange={e => set('badge_color', e.target.value)}
                    >
                      {BADGE_COLORS.map(c => (
                        <option key={c} value={c}>{c.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Tipe Diagram CAD</label>
                    <select
                      className="admin-input"
                      value={form.diagram_type}
                      onChange={e => set('diagram_type', e.target.value)}
                    >
                      {DIAGRAM_TYPES.map(d => (
                        <option key={d.key} value={d.key}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Form Fields Row 3 */}
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Urutan Tampil (Sort Order)</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={form.sort_order}
                      onChange={e => set('sort_order', Number(e.target.value))}
                      min={0}
                      step={10}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>
                      Angka lebih kecil tampil lebih awal (mis: 10, 20, 30).
                    </span>
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Status Visibilitas</label>
                    <select
                      className="admin-input"
                      value={form.status}
                      onChange={e => set('status', Number(e.target.value))}
                    >
                      <option value={1}>Aktif (Tampil di Website Publik)</option>
                      <option value={0}>Nonaktif (Disembunyikan dari Publik)</option>
                    </select>
                    <span style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>
                      Pilih Nonaktif jika produk sedang dalam tahap pengembangan rahasia.
                    </span>
                  </div>
                </div>

                {/* ── SECTION MEDIA PRODUK: COVER & GALERI ── */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--adm-border-visible)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--adm-text)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                        <Images size={16} />
                        <span>Media Visual Produk (Cover & Galeri Multi-Angle)</span>
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--adm-muted)', margin: '2px 0 0 0' }}>
                        Kelola foto cover depan serta foto-foto sudut lain (tampak belakang port, modul PCB, sasis).
                      </p>
                    </div>
                  </div>

                  {/* 1. Foto Sampul Utama */}
                  <div className="admin-form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="admin-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <Star size={14} style={{ color: '#eab308' }} />
                        <span>Foto Sampul Utama (Cover Thumbnail)</span>
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--adm-muted)' }}>
                        Tampil di kartu katalog utama /products
                      </span>
                    </label>

                    {(coverPreviewUrl || (existingCover && !removeCover)) ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '12px 16px',
                        background: 'var(--adm-card-inner)',
                        border: '1px solid var(--adm-border-visible)',
                        borderRadius: '8px',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{
                          position: 'relative',
                          width: '90px',
                          height: '75px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: '1px solid var(--adm-border-visible)',
                          background: '#090d16',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <img
                            src={coverPreviewUrl || getImageUrl(existingCover)}
                            alt="Cover Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>

                        <div style={{ flex: 1, minWidth: '180px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                              background: '#eab30825', color: '#eab308', border: '1px solid #eab30840'
                            }}>
                              COVER UTAMA
                            </span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--adm-text)' }}>
                              {coverFile ? coverFile.name : (existingCover ? existingCover.split('/').pop() : 'Foto Terpasang')}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--adm-muted)', margin: '4px 0 0 0' }}>
                            {coverFile ? `${(coverFile.size / 1024).toFixed(1)} KB (Baru Dipilih)` : 'Tersimpan di server'}
                          </p>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <label className="admin-btn admin-btn-ghost" style={{ padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <RefreshCw size={12} />
                              <span>Ganti Cover</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={e => {
                                  const f = e.target.files?.[0];
                                  if (f) {
                                    setCoverFile(f);
                                    setCoverPreviewUrl(URL.createObjectURL(f));
                                    setRemoveCover(false);
                                  }
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              className="admin-btn"
                              style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'transparent', border: '1px solid #ef444460', color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => {
                                setCoverFile(null);
                                setCoverPreviewUrl('');
                                setRemoveCover(true);
                              }}
                            >
                              <Trash2 size={12} />
                              <span>Hapus Cover</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '18px 16px',
                        border: '2px dashed var(--adm-border-visible)',
                        borderRadius: '8px',
                        background: 'var(--adm-card-inner)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'border-color 0.2s',
                      }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'rgba(234, 179, 8, 0.1)',
                          color: '#eab308',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '6px'
                        }}>
                          <Star size={18} />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--adm-text)', marginBottom: '2px' }}>
                          Pilih Foto Sampul Utama
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>
                          JPG, PNG, WEBP, SVG (Maks: 5MB). Otomatis fallback ke skematik jika kosong.
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={e => {
                            const f = e.target.files?.[0];
                            if (f) {
                              setCoverFile(f);
                              setCoverPreviewUrl(URL.createObjectURL(f));
                              setRemoveCover(false);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* 2. Galeri Foto Pendukung (Multi-Angle) */}
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                      <label className="admin-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <Images size={14} />
                        <span>Galeri Foto Pendukung ({existingGallery.length + newGalleryFiles.length} Foto)</span>
                      </label>
                      <label className="admin-btn admin-btn-ghost" style={{ padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Plus size={13} />
                        <span>Tambah Foto Galeri (Bisa Banyak)</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={e => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0) {
                              const newItems = files.map(file => ({
                                id: Math.random().toString(36).substring(2, 9),
                                file,
                                previewUrl: URL.createObjectURL(file),
                              }));
                              setNewGalleryFiles(prev => [...prev, ...newItems]);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {(existingGallery.length === 0 && newGalleryFiles.length === 0) ? (
                      <div style={{
                        padding: '18px 16px',
                        border: '1px dashed var(--adm-border-visible)',
                        borderRadius: '8px',
                        background: 'var(--adm-card-inner)',
                        textAlign: 'center',
                        color: 'var(--adm-muted)',
                        fontSize: '0.8rem'
                      }}>
                        <p style={{ margin: 0 }}>Belum ada foto tambahan di galeri.</p>
                        <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>
                          💡 Tambahkan foto tampak belakang port soket konektor atau PCB board untuk pengalaman interaktif pengunjung.
                        </span>
                      </div>
                    ) : (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                        gap: '10px',
                        background: 'var(--adm-card-inner)',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--adm-border-visible)',
                      }}>
                        {/* Existing Gallery Items */}
                        {existingGallery.map((path, idx) => (
                          <div key={`existing-${idx}`} style={{
                            position: 'relative',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            border: '1px solid var(--adm-border-visible)',
                            background: '#090d16',
                            aspectRatio: '4/3',
                            display: 'flex',
                            flexDirection: 'column',
                          }}>
                            <img
                              src={getImageUrl(path)}
                              alt={`Galeri #${idx + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                            {/* Quick Actions Overlay */}
                            <div style={{
                              position: 'absolute', inset: 0,
                              background: 'rgba(0,0,0,0.65)',
                              opacity: 0,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'opacity 0.2s',
                              padding: '6px',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                            >
                              <button
                                type="button"
                                className="admin-btn"
                                style={{
                                  fontSize: '0.68rem', padding: '3px 8px', width: '100%',
                                  background: '#eab308', color: '#000', fontWeight: 700,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px'
                                }}
                                onClick={() => {
                                  setExistingCover(path);
                                  setCoverFile(null);
                                  setCoverPreviewUrl('');
                                  setRemoveCover(false);
                                  setExistingGallery(prev => prev.filter((_, i) => i !== idx));
                                  addToast('Foto galeri dipindahkan menjadi Foto Sampul Utama!', 'info');
                                }}
                                title="Jadikan Foto Sampul Utama"
                              >
                                <Star size={11} />
                                <span>Jadikan Cover</span>
                              </button>
                              <button
                                type="button"
                                className="admin-btn"
                                style={{
                                  fontSize: '0.68rem', padding: '3px 8px', width: '100%',
                                  background: '#ef4444', color: '#fff',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px'
                                }}
                                onClick={() => {
                                  setExistingGallery(prev => prev.filter((_, i) => i !== idx));
                                }}
                                title="Hapus foto ini dari galeri"
                              >
                                <Trash2 size={11} />
                                <span>Hapus</span>
                              </button>
                            </div>
                            <span style={{
                              position: 'absolute', bottom: 4, left: 4,
                              fontSize: '0.65rem', background: 'rgba(0,0,0,0.7)',
                              padding: '1px 5px', borderRadius: 4, color: '#fff'
                            }}>
                              #{idx + 1}
                            </span>
                          </div>
                        ))}

                        {/* New Gallery Items */}
                        {newGalleryFiles.map((item) => (
                          <div key={item.id} style={{
                            position: 'relative',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            border: '1px solid var(--adm-accent)',
                            background: '#090d16',
                            aspectRatio: '4/3',
                            display: 'flex',
                            flexDirection: 'column',
                          }}>
                            <img
                              src={item.previewUrl}
                              alt="New Gallery Item"
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                            {/* Quick Actions Overlay */}
                            <div style={{
                              position: 'absolute', inset: 0,
                              background: 'rgba(0,0,0,0.65)',
                              opacity: 0,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'opacity 0.2s',
                              padding: '6px',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                            >
                              <button
                                type="button"
                                className="admin-btn"
                                style={{
                                  fontSize: '0.68rem', padding: '3px 8px', width: '100%',
                                  background: '#eab308', color: '#000', fontWeight: 700,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px'
                                }}
                                onClick={() => {
                                  setCoverFile(item.file);
                                  setCoverPreviewUrl(item.previewUrl);
                                  setRemoveCover(false);
                                  setNewGalleryFiles(prev => prev.filter(i => i.id !== item.id));
                                  addToast('Foto baru dipindahkan menjadi Foto Sampul Utama!', 'info');
                                }}
                                title="Jadikan Foto Sampul Utama"
                              >
                                <Star size={11} />
                                <span>Jadikan Cover</span>
                              </button>
                              <button
                                type="button"
                                className="admin-btn"
                                style={{
                                  fontSize: '0.68rem', padding: '3px 8px', width: '100%',
                                  background: '#ef4444', color: '#fff',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px'
                                }}
                                onClick={() => {
                                  setNewGalleryFiles(prev => prev.filter(i => i.id !== item.id));
                                }}
                                title="Hapus foto ini"
                              >
                                <Trash2 size={11} />
                                <span>Hapus</span>
                              </button>
                            </div>
                            <span style={{
                              position: 'absolute', bottom: 4, left: 4,
                              fontSize: '0.65rem', background: 'var(--adm-accent)',
                              padding: '1px 5px', borderRadius: 4, color: '#fff', fontWeight: 700
                            }}>
                              BARU
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ═════════ TAB 2: TEKS BILINGUAL ID / EN ═════════ */}
            {modalTab === 'bilingual' && (
              <>
                {/* Auto Translate Bar */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'var(--adm-card-inner)', border: '1px solid var(--adm-border-visible)',
                  padding: '10px 14px', borderRadius: 8,
                }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--adm-text)', fontWeight: 600, display: 'block' }}>
                      Bilingual Copywriting Assistant
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>
                      Isi konten Bahasa Indonesia, lalu klik tombol untuk menerjemahkan ke English secara otomatis.
                    </span>
                  </div>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    style={{
                      fontSize: '0.8rem', padding: '6px 14px', height: 'auto',
                      display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0
                    }}
                    onClick={handleAutoTranslate}
                    disabled={translating}
                  >
                    <Sparkles size={15} style={{ color: 'var(--adm-accent)' }} />
                    <span>{translating ? 'Menerjemahkan...' : 'Terjemahkan ID → EN'}</span>
                  </button>
                </div>

                {/* Titles */}
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">
                      Judul Produk — Bahasa Indonesia <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      value={form.title_id}
                      onChange={e => set('title_id', e.target.value)}
                      placeholder="mis: Headunit Pintar Otomotif 10.1 Inch QLED 4G"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">
                      Product Title — English <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      value={form.title_en}
                      onChange={e => set('title_en', e.target.value)}
                      placeholder="e.g. 10.1-Inch QLED Smart Automotive Infotainment"
                      required
                    />
                  </div>
                </div>

                {/* Short Descriptions */}
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Deskripsi Singkat — Indonesia</label>
                    <textarea
                      rows={5}
                      className="admin-textarea"
                      value={form.short_desc_id}
                      onChange={e => set('short_desc_id', e.target.value)}
                      placeholder="Tuliskan deskripsi 1-2 kalimat mengenai keunggulan produk untuk kartu katalog..."
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Short Description — English</label>
                    <textarea
                      rows={5}
                      className="admin-textarea"
                      value={form.short_desc_en}
                      onChange={e => set('short_desc_en', e.target.value)}
                      placeholder="Write 1-2 concise sentences summarizing key features for product card..."
                    />
                  </div>
                </div>
              </>
            )}

            {/* ═════════ TAB 3: SPESIFIKASI SINGKAT (4 ITEM) ═════════ */}
            {modalTab === 'specs' && (
              <>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'var(--adm-card-inner)', border: '1px solid var(--adm-border-visible)',
                  padding: '10px 14px', borderRadius: 8, flexWrap: 'wrap', gap: 10
                }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--adm-text)', fontWeight: 600, display: 'block' }}>
                      4 Kartu Spesifikasi Sorotan (Card Highlights)
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>
                      Ditampilkan di matriks 2x2 pada kartu produk website publik. Kosongkan baris yang tidak digunakan.
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost"
                      style={{ fontSize: '0.72rem', padding: '3px 8px', height: 'auto' }}
                      onClick={() => loadQuickSpecsPreset('automation')}
                    >
                      Automation
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost"
                      style={{ fontSize: '0.72rem', padding: '3px 8px', height: 'auto' }}
                      onClick={() => loadQuickSpecsPreset('android_headunit')}
                    >
                      Headunit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost"
                      style={{ fontSize: '0.72rem', padding: '3px 8px', height: 'auto' }}
                      onClick={() => loadQuickSpecsPreset('dsp')}
                    >
                      DSP
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost"
                      style={{ fontSize: '0.72rem', padding: '3px 8px', height: 'auto' }}
                      onClick={() => loadQuickSpecsPreset('amplifier')}
                    >
                      Amplifier
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost"
                      style={{ fontSize: '0.72rem', padding: '3px 8px', height: 'auto' }}
                      onClick={() => loadQuickSpecsPreset('subwoofer')}
                    >
                      Subwoofer
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost"
                      style={{ fontSize: '0.72rem', padding: '3px 8px', height: 'auto' }}
                      onClick={() => loadQuickSpecsPreset('dash_camera_recorders')}
                    >
                      Dashcam
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost"
                      style={{ fontSize: '0.72rem', padding: '3px 8px', height: 'auto' }}
                      onClick={() => loadQuickSpecsPreset('mobile_intelligent_device')}
                    >
                      Mobile / AI Box
                    </button>
                  </div>
                </div>

                <div className="prod-specs-grid">
                  {form.specs.map((spec, idx) => (
                    <div key={idx} className="prod-spec-card">
                      <div className="prod-spec-card__tag">
                        <span>SPESIFIKASI #{idx + 1}</span>
                        {spec.label && <span style={{ color: 'var(--adm-accent)' }}>✓ Terisi</span>}
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 4 }}>
                        <label className="admin-label" style={{ fontSize: '0.78rem' }}>Label Singkat</label>
                        <input
                          type="text"
                          className="admin-input"
                          style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem' }}
                          value={spec.label}
                          onChange={e => setSpec(idx, 'label', e.target.value)}
                          placeholder="mis: Display, Processor..."
                        />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label" style={{ fontSize: '0.78rem' }}>Nilai Parameter</label>
                        <input
                          type="text"
                          className="admin-input"
                          style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem' }}
                          value={spec.value}
                          onChange={e => setSpec(idx, 'value', e.target.value)}
                          placeholder="mis: 10.1&quot; QLED 1280x720..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ═════════ TAB 4: SPESIFIKASI LENGKAP (FULL SPECS) ═════════ */}
            {modalTab === 'full_specs' && (
              <>
                {/* Header Controls */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'var(--adm-card-inner)', border: '1px solid var(--adm-border-visible)',
                  padding: '10px 14px', borderRadius: 8, flexWrap: 'wrap', gap: 10
                }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--adm-text)', fontWeight: 600, display: 'block' }}>
                      Spesifikasi Teknis Rinci (Modal Detail & Technical Table)
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>
                      Digunakan pada pop-up detail teknis website dan tabel perbandingan spesifikasi.
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {/* Mode Toggle Button */}
                    <div style={{
                      display: 'inline-flex', background: 'var(--adm-card)',
                      border: '1px solid var(--adm-border-visible)', borderRadius: 6, padding: 2
                    }}>
                      <button
                        type="button"
                        onClick={() => setSpecsMode('visual')}
                        style={{
                          padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, borderRadius: 4,
                          border: 'none', cursor: 'pointer',
                          background: specsMode === 'visual' ? 'var(--adm-accent)' : 'transparent',
                          color: specsMode === 'visual' ? 'var(--adm-accent-text)' : 'var(--adm-muted)'
                        }}
                      >
                        Form Visual
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpecsMode('json')}
                        style={{
                          padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, borderRadius: 4,
                          border: 'none', cursor: 'pointer',
                          background: specsMode === 'json' ? 'var(--adm-accent)' : 'transparent',
                          color: specsMode === 'json' ? 'var(--adm-accent-text)' : 'var(--adm-muted)'
                        }}
                      >
                        Raw JSON
                      </button>
                    </div>
                  </div>
                </div>

                {/* Template Quick Actions */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--adm-muted)', marginRight: 4 }}>
                    Template Cepat:
                  </span>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    style={{ fontSize: '0.72rem', padding: '3px 8px', height: 'auto' }}
                    onClick={() => loadPresetTemplate('automation')}
                  >
                    + Automation
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    style={{ fontSize: '0.72rem', padding: '3px 8px', height: 'auto' }}
                    onClick={() => loadPresetTemplate('android_headunit')}
                  >
                    + Headunit
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    style={{ fontSize: '0.72rem', padding: '3px 8px', height: 'auto' }}
                    onClick={() => loadPresetTemplate('dsp')}
                  >
                    + DSP
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    style={{ fontSize: '0.72rem', padding: '3px 8px', height: 'auto' }}
                    onClick={() => loadPresetTemplate('amplifier')}
                  >
                    + Amplifier
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    style={{ fontSize: '0.72rem', padding: '3px 8px', height: 'auto' }}
                    onClick={() => loadPresetTemplate('subwoofer')}
                  >
                    + Subwoofer
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    style={{ fontSize: '0.72rem', padding: '3px 8px', height: 'auto' }}
                    onClick={() => loadPresetTemplate('dash_camera_recorders')}
                  >
                    + Dashcam
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    style={{ fontSize: '0.72rem', padding: '3px 8px', height: 'auto' }}
                    onClick={() => loadPresetTemplate('mobile_intelligent_device')}
                  >
                    + Mobile / AI Box
                  </button>
                </div>

                {/* MODE 1: VISUAL KEY-VALUE EDITOR */}
                {specsMode === 'visual' ? (
                  <div className="prod-keyval-table">
                    {specRows.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--adm-muted)' }}>
                        <p style={{ fontSize: '0.85rem' }}>Belum ada parameter spesifikasi.</p>
                        <button
                          type="button"
                          className="admin-btn admin-btn-ghost"
                          style={{ marginTop: 8 }}
                          onClick={handleAddSpecRow}
                        >
                          <Plus size={14} />
                          <span>Tambah Baris Parameter</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div style={{
                          display: 'grid', gridTemplateColumns: '220px 1fr 40px', gap: 8,
                          padding: '0 8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--adm-muted)'
                        }}>
                          <span>PARAMETER KEY</span>
                          <span>NILAI SPESIFIKASI</span>
                          <span style={{ textAlign: 'center' }}>AKSI</span>
                        </div>

                        {specRows.map((row, idx) => (
                          <div key={idx} className="prod-keyval-row">
                            {/* Key input with common suggestions */}
                            <div>
                              <input
                                type="text"
                                className="admin-input"
                                style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem', fontFamily: 'monospace' }}
                                list="common-spec-keys"
                                value={row.key}
                                onChange={e => handleSpecRowChange(idx, 'key', e.target.value)}
                                placeholder="mis: operatingVoltage"
                              />
                            </div>

                            {/* Value input */}
                            <div>
                              <input
                                type="text"
                                className="admin-input"
                                style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem' }}
                                value={row.value}
                                onChange={e => handleSpecRowChange(idx, 'value', e.target.value)}
                                placeholder="mis: 9V - 16V DC..."
                              />
                            </div>

                            {/* Delete action */}
                            <button
                              type="button"
                              className="prod-keyval-delete"
                              onClick={() => handleRemoveSpecRow(idx)}
                              title="Hapus baris spesifikasi"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}

                        <datalist id="common-spec-keys">
                          {COMMON_SPEC_KEYS.map(k => (
                            <option key={k.key} value={k.key}>{k.label}</option>
                          ))}
                        </datalist>

                        <div style={{ marginTop: 8 }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn-ghost"
                            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                            onClick={handleAddSpecRow}
                          >
                            <Plus size={14} />
                            <span>Tambah Baris Parameter</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  /* MODE 2: RAW JSON CODE EDITOR */
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <textarea
                      rows={12}
                      className="admin-textarea"
                      style={{
                        fontFamily: 'monospace', fontSize: '0.82rem',
                        lineHeight: 1.5,
                        ...(fullSpecsError ? { borderColor: '#ef4444' } : {})
                      }}
                      value={fullSpecsText}
                      onChange={e => handleFullSpecsChange(e.target.value)}
                    />
                    {fullSpecsError ? (
                      <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4 }}>
                        {fullSpecsError}
                      </p>
                    ) : (
                      <p style={{ color: 'var(--adm-muted)', fontSize: '0.75rem', marginTop: 4 }}>
                        Format JSON valid ({Object.keys(form.full_specs || {}).length} parameter terdaftar).
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="prod-modal-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {modalTab !== 'identity' && (
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  onClick={() => {
                    const idx = tabsConfig.findIndex(t => t.id === modalTab);
                    if (idx > 0) setModalTab(tabsConfig[idx - 1].id);
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Sebelumnya</span>
                </button>
              )}
              {modalTab !== 'full_specs' && (
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  onClick={() => {
                    const idx = tabsConfig.findIndex(t => t.id === modalTab);
                    if (idx < tabsConfig.length - 1) setModalTab(tabsConfig[idx + 1].id);
                  }}
                >
                  <span>Selanjutnya</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>
                Batal
              </button>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={submitting}
              >
                <Save size={16} />
                <span>{submitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan Produk' : 'Simpan Produk Baru')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────
export default function ProductsModule() {
  const { addToast, showConfirm } = useAdminAuth();
  const [activeSection, setActiveSection] = useState('catalog');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [translatingKey, setTranslatingKey] = useState(null);

  // Active language per section
  const [langMap, setLangMap] = useState({
    header_chips: 'id', categories: 'id', rfq_workflow: 'id',
  });
  const setSectionLang = (sec, lang) => setLangMap(prev => ({ ...prev, [sec]: lang }));

  // ─── Catalog State ───
  const [products, setProducts] = useState([]);
  const [catFilter, setCatFilter] = useState('automation');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalProduct, setModalProduct] = useState(undefined); // undefined=closed, null=new, obj=edit

  // ─── CMS State (Header, Categories, RFQ) — Initialized with rich defaults ───
  const [headerData, setHeaderData] = useState(DEFAULT_HEADER);
  const [categoryData, setCategoryData] = useState(DEFAULT_CATEGORIES);
  const [rfqWorkflowData, setRfqWorkflowData] = useState(DEFAULT_RFQ);

  // ─── Fetch Products ───
  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get('/admin/products');
      setProducts(res.data?.data || []);
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    }
  }, [addToast]);

  // ─── Fetch CMS Settings ───
  useEffect(() => {
    let isMounted = true;
    async function fetchAll() {
      try {
        setLoading(true);
        const [headRes, catRes, rfqRes] = await Promise.allSettled([
          api.get('/public/site-settings/products_header'),
          api.get('/public/site-settings/products_categories'),
          api.get('/public/site-settings/products_rfq'),
        ]);

        if (isMounted) {
          if (headRes.status === 'fulfilled' && headRes.value.data?.data) {
            const d = headRes.value.data.data;
            if (d.id && d.en) setHeaderData(d);
          }
          if (catRes.status === 'fulfilled' && catRes.value.data?.data) {
            const d = catRes.value.data.data;
            if (Array.isArray(d.id) && Array.isArray(d.en)) setCategoryData(d);
          }
          if (rfqRes.status === 'fulfilled' && rfqRes.value.data?.data) {
            const d = rfqRes.value.data.data;
            if (d.id && d.en) setRfqWorkflowData(d);
          }
        }
      } catch (err) {
        addToast(extractErrorMessage(err), 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAll();
    fetchProducts();
    return () => { isMounted = false; };
  }, [addToast, fetchProducts]);

  const handleSaveSection = async (key, payload, name) => {
    setSavingKey(key);
    try {
      await api.put(`/admin/site-settings/${key}`, payload);
      addToast(`Konten '${name}' berhasil disimpan ke database!`, 'success');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSavingKey(null);
    }
  };

  const handleAutoTranslate = async (sectionKey, sourceIdData, updateState) => {
    setTranslatingKey(sectionKey);
    try {
      addToast('Menerjemahkan teks dari Bahasa Indonesia ke English...', 'info');
      const translatedEn = await translateContent(sourceIdData);
      updateState(prev => ({ ...prev, en: translatedEn }));
      setSectionLang(sectionKey, 'en');
      addToast('Terjemahan selesai! Periksa tab English dan simpan.', 'success');
    } catch (err) {
      addToast('Gagal menerjemahkan: ' + extractErrorMessage(err), 'error');
    } finally {
      setTranslatingKey(null);
    }
  };

  const handleToggleProductStatus = async (prod) => {
    const newStatus = prod.status ? 0 : 1;
    try {
      await api.put(`/admin/products/${prod.id}`, {
        ...prod,
        status: newStatus,
      });
      addToast(`Status produk '${prod.model_code}' berhasil diubah ke ${newStatus ? 'Aktif' : 'Nonaktif'}.`, 'success');
      fetchProducts();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    }
  };

  const handleDeleteProduct = async (prod) => {
    const confirmed = await showConfirm({
      title: 'Hapus Produk?',
      text: `Produk "${prod.model_code}" akan dihapus permanen dari database dan tidak akan tampil lagi di website.`,
      confirmText: 'Ya, Hapus Produk',
      icon: 'error',
    });
    if (!confirmed) return;

    try {
      await api.delete(`/admin/products/${prod.id}`);
      addToast(`Produk '${prod.model_code}' berhasil dihapus.`, 'success');
      fetchProducts();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    }
  };

  // Filtered products list - strictly filtered by active 1 of 7 categories
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const pCat = normalizeCategory(p.category);
      const matchCat = pCat === catFilter;
      if (!matchCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const codeMatch = (p.model_code || '').toLowerCase().includes(q);
      const titleMatch = (p.title_id || '').toLowerCase().includes(q) || (p.title_en || '').toLowerCase().includes(q);
      return codeMatch || titleMatch;
    });
  }, [products, catFilter, searchQuery]);

  if (loading) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="admin-spinner" style={{ width: 28, height: 28, margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--adm-muted)' }}>Memuat data Produk & Solusi...</p>
      </div>
    );
  }

  const currentHeadLang = langMap.header_chips;
  const currentHead = headerData[currentHeadLang] || headerData.id;
  const currentCatLang = langMap.categories;
  const currentCat = categoryData[currentCatLang] || categoryData.id;
  const currentRfqLang = langMap.rfq_workflow;
  const currentRfq = rfqWorkflowData[currentRfqLang] || rfqWorkflowData.id;

  const sectionsList = [
    { id: 'catalog',       label: 'Katalog Produk (CRUD)',         icon: Package },
    { id: 'header_chips',  label: 'Header & Chip Kapabilitas',      icon: Sliders },
    { id: 'categories',    label: 'Deskripsi Kategori',             icon: Layers },
    { id: 'rfq_workflow',  label: 'Banner RFQ & Alur 5-Langkah',   icon: FileCheck },
  ];

  return (
    <div className="admin-module">
      {/* Page Header */}
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '0.35rem' }}>
          Manajemen Halaman Produk & Solusi
        </h2>
        <p style={{ color: 'var(--adm-muted)', fontSize: '0.875rem' }}>
          Kelola katalog produk manufaktur (SKU, spesifikasi, diagram), header hero, deskripsi kategori, dan alur RFQ OEM/ODM.
        </p>
      </div>

      {/* Section Nav Tabs */}
      <div className="admin-section-nav">
        {sectionsList.map(sec => {
          const Icon = sec.icon;
          return (
            <button key={sec.id} type="button"
              className={`admin-section-nav-btn ${activeSection === sec.id ? 'active' : ''}`}
              onClick={() => setActiveSection(sec.id)}>
              <Icon size={16} />
              <span>{sec.label}</span>
              {sec.id === 'catalog' && (
                <span style={{
                  marginLeft: 4, background: 'var(--adm-accent)', color: 'var(--adm-accent-text)',
                  borderRadius: 99, fontSize: '0.7rem', fontWeight: 700, padding: '1px 7px',
                }}>
                  {products.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── SECTION 1: CATALOG CRUD ── */}
      {activeSection === 'catalog' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 className="admin-card-title">Katalog Produk GPT — Database</h3>
              <p className="admin-card-subtitle">
                Total {products.length} SKU terdaftar di database MySQL. Ditampilkan di halaman <strong>/products</strong> website publik.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="admin-btn admin-btn-ghost"
                onClick={fetchProducts} title="Segarkan Data">
                <RefreshCw size={15} />
                <span>Refresh</span>
              </button>
              <button type="button" className="admin-btn admin-btn-primary"
                onClick={() => setModalProduct(null)}>
                <Plus size={16} />
                <span>Tambah Produk</span>
              </button>
            </div>
          </div>

          {/* Search Box & Quick Stats */}
          <div style={{
            display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
            margin: '1rem 0 0.75rem',
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
              <Search size={16} style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--adm-muted)'
              }} />
              <input
                type="text"
                className="admin-input"
                style={{ paddingLeft: 36 }}
                placeholder="Cari kode SKU atau judul produk..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-muted)'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills - strictly 7 categories only */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {CATEGORIES.map(c => ({
              key: c.key,
              label: `${c.label} (${products.filter(p => normalizeCategory(p.category) === c.key).length})`
            })).map(f => (
              <button key={f.key} type="button"
                onClick={() => setCatFilter(f.key)}
                style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                  border: '1px solid var(--adm-border-visible)', cursor: 'pointer',
                  background: catFilter === f.key ? 'var(--adm-accent)' : 'transparent',
                  color: catFilter === f.key ? 'var(--adm-accent-text)' : 'var(--adm-text)',
                  transition: 'all 0.15s',
                }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Products List */}
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-muted)' }}>
              <Package size={40} style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
              <p>
                {searchQuery
                  ? `Tidak ada produk yang cocok dengan pencarian "${searchQuery}" pada kategori ini.`
                  : `Belum ada produk untuk kategori "${getCategoryLabel(catFilter)}". Klik "+ Tambah Produk" untuk mulai.`}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredProducts.map(prod => (
                <div key={prod.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '0.85rem 1rem',
                  background: 'var(--adm-card-inner)',
                  border: '1px solid var(--adm-border-visible)',
                  borderRadius: 8,
                  flexWrap: 'wrap',
                }}>
                  {/* Status Quick Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleProductStatus(prod)}
                    title={`Klik untuk mengubah status (Saat ini: ${prod.status ? 'Aktif' : 'Nonaktif'})`}
                    style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                      display: 'flex', alignItems: 'center'
                    }}
                  >
                    {prod.status ? (
                      <span style={{
                        display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
                        background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.4)'
                      }} />
                    ) : (
                      <span style={{
                        display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
                        background: '#71717a'
                      }} />
                    )}
                  </button>

                  {/* Thumbnail / Icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 6,
                    background: '#090d16', border: '1px solid var(--adm-border-visible)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', flexShrink: 0
                  }}>
                    {prod.image ? (
                      <img
                        src={getImageUrl(prod.image)}
                        alt={prod.model_code}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <Package size={20} style={{ color: 'var(--adm-muted)', opacity: 0.6 }} />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700, color: 'var(--adm-text)' }}>
                        {prod.model_code}
                      </span>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px',
                        borderRadius: 20, border: '1px solid var(--adm-border-visible)',
                        color: 'var(--adm-muted)',
                      }}>
                        {getCategoryLabel(prod.category)}
                      </span>
                      {prod.badge && (
                        <span className={`prod-live-preview__badge prod-live-preview__badge--${prod.badge_color || 'teal'}`}>
                          {prod.badge}
                        </span>
                      )}
                      <span style={{
                        fontSize: '0.7rem', color: prod.status ? '#22c55e' : '#71717a',
                        fontWeight: 600, marginLeft: 4
                      }}>
                        {prod.status ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.82rem', color: 'var(--adm-muted)', marginTop: 3,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 520
                    }}>
                      {prod.title_id}
                    </p>
                  </div>

                  {/* Specs summary */}
                  <span style={{ fontSize: '0.75rem', color: 'var(--adm-muted)', flexShrink: 0 }}>
                    {Array.isArray(prod.specs) ? prod.specs.length : 0} specs singkat
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button type="button" className="admin-btn admin-btn-ghost"
                      style={{ padding: '5px 10px' }}
                      onClick={() => setModalProduct(prod)}
                      title="Edit Detail Produk">
                      <Pencil size={14} />
                      <span>Edit</span>
                    </button>
                    <button type="button" className="admin-btn"
                      style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #ef444460', color: '#ef4444' }}
                      onClick={() => handleDeleteProduct(prod)}
                      title="Hapus Produk">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 2: HEADER & CHIPS ── */}
      {activeSection === 'header_chips' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Header Halaman & 4 Chip Kapabilitas</h3>
              <p className="admin-card-subtitle">Judul, subjudul, dan 4 kartu badge statistik di bagian hero atas halaman /products.</p>
            </div>
            <button type="button" className="admin-btn admin-btn-primary"
              disabled={savingKey === 'products_header'}
              onClick={() => handleSaveSection('products_header', headerData, 'Header')}>
              <Save size={16} />
              <span>{savingKey === 'products_header' ? 'Menyimpan...' : 'Simpan Header'}</span>
            </button>
          </div>

          <LanguageTabControl activeLang={currentHeadLang}
            onSelectLang={lang => setSectionLang('header_chips', lang)}
            onTranslate={() => handleAutoTranslate('header_chips', headerData.id, setHeaderData)}
            isTranslating={translatingKey === 'header_chips'} />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Judul Utama Hero ({currentHeadLang.toUpperCase()})</label>
              <input type="text" className="admin-input" value={currentHead.title || ''}
                onChange={e => setHeaderData(prev => ({
                  ...prev, [currentHeadLang]: { ...prev[currentHeadLang], title: e.target.value }
                }))} />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Subjudul Hero ({currentHeadLang.toUpperCase()})</label>
              <textarea rows={3} className="admin-textarea" value={currentHead.subtitle || ''}
                onChange={e => setHeaderData(prev => ({
                  ...prev, [currentHeadLang]: { ...prev[currentHeadLang], subtitle: e.target.value }
                }))} />
            </div>

            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--adm-text)', margin: '1.5rem 0 0.75rem' }}>
              4 Kartu Badge Kapabilitas Industri (Telemetry Chips)
            </h4>

            <div className="admin-form-grid admin-form-grid-2">
              {(currentHead.chips || []).map((chip, idx) => (
                <div key={idx} style={{
                  background: 'var(--adm-card-inner)', border: '1px solid var(--adm-border-visible)',
                  borderRadius: 8, padding: '1rem',
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-muted)', fontFamily: 'monospace' }}>
                    CHIP #{idx + 1}
                  </span>
                  <div className="admin-form-group" style={{ marginTop: '0.5rem' }}>
                    <label className="admin-label" style={{ fontSize: '0.78rem' }}>Nilai / Angka Utama</label>
                    <input type="text" className="admin-input" value={chip.value || ''}
                      onChange={e => {
                        const val = e.target.value;
                        setHeaderData(prev => {
                          const ci = [...prev.id.chips]; const ce = [...prev.en.chips];
                          if (ci[idx]) ci[idx] = { ...ci[idx], value: val };
                          if (ce[idx]) ce[idx] = { ...ce[idx], value: val };
                          return { ...prev, id: { ...prev.id, chips: ci }, en: { ...prev.en, chips: ce } };
                        });
                      }} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label" style={{ fontSize: '0.78rem' }}>Label ({currentHeadLang.toUpperCase()})</label>
                    <input type="text" className="admin-input" value={chip.label || ''}
                      onChange={e => {
                        const val = e.target.value; const lang = currentHeadLang;
                        setHeaderData(prev => {
                          const c = [...prev[lang].chips]; c[idx] = { ...c[idx], label: val };
                          return { ...prev, [lang]: { ...prev[lang], chips: c } };
                        });
                      }} />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label" style={{ fontSize: '0.78rem' }}>Sub Keterangan ({currentHeadLang.toUpperCase()})</label>
                    <input type="text" className="admin-input" value={chip.sub || ''}
                      onChange={e => {
                        const val = e.target.value; const lang = currentHeadLang;
                        setHeaderData(prev => {
                          const c = [...prev[lang].chips]; c[idx] = { ...c[idx], sub: val };
                          return { ...prev, [lang]: { ...prev[lang], chips: c } };
                        });
                      }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 3: CATEGORIES ── */}
      {activeSection === 'categories' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Deskripsi Kategori Produk</h3>
              <p className="admin-card-subtitle">Nama dan penjelasan fungsi 7 kategori spesialisasi di halaman produk.</p>
            </div>
            <button type="button" className="admin-btn admin-btn-primary"
              disabled={savingKey === 'products_categories'}
              onClick={() => handleSaveSection('products_categories', categoryData, 'Kategori')}>
              <Save size={16} />
              <span>{savingKey === 'products_categories' ? 'Menyimpan...' : 'Simpan Kategori'}</span>
            </button>
          </div>

          <LanguageTabControl activeLang={currentCatLang}
            onSelectLang={lang => setSectionLang('categories', lang)}
            onTranslate={() => handleAutoTranslate('categories', categoryData.id, setCategoryData)}
            isTranslating={translatingKey === 'categories'} />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-grid admin-form-grid-2">
              {(currentCat || []).map((cat, idx) => (
                <div key={cat.key || idx} style={{
                  background: 'var(--adm-card-inner)', border: '1px solid var(--adm-border-visible)',
                  borderRadius: 8, padding: '1rem',
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-muted)', fontFamily: 'monospace' }}>
                    KEY: {cat.key}
                  </span>
                  <div className="admin-form-group" style={{ marginTop: '0.5rem' }}>
                    <label className="admin-label" style={{ fontSize: '0.78rem' }}>Nama Kategori ({currentCatLang.toUpperCase()})</label>
                    <input type="text" className="admin-input" value={cat.name || ''}
                      onChange={e => {
                        const val = e.target.value; const lang = currentCatLang;
                        setCategoryData(prev => {
                          const c = [...prev[lang]]; c[idx] = { ...c[idx], name: val };
                          return { ...prev, [lang]: c };
                        });
                      }} />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label" style={{ fontSize: '0.78rem' }}>Deskripsi Penjelasan ({currentCatLang.toUpperCase()})</label>
                    <textarea rows={3} className="admin-textarea" value={cat.desc || ''}
                      onChange={e => {
                        const val = e.target.value; const lang = currentCatLang;
                        setCategoryData(prev => {
                          const c = [...prev[lang]]; c[idx] = { ...c[idx], desc: val };
                          return { ...prev, [lang]: c };
                        });
                      }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 4: RFQ WORKFLOW ── */}
      {activeSection === 'rfq_workflow' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Banner RFQ & Alur Proses Rekayasa (5 Langkah)</h3>
              <p className="admin-card-subtitle">CTA banner penawaran dan 5 tahap alur manufaktur rekayasa OEM/ODM.</p>
            </div>
            <button type="button" className="admin-btn admin-btn-primary"
              disabled={savingKey === 'products_rfq'}
              onClick={() => handleSaveSection('products_rfq', rfqWorkflowData, 'Banner RFQ')}>
              <Save size={16} />
              <span>{savingKey === 'products_rfq' ? 'Menyimpan...' : 'Simpan Banner RFQ'}</span>
            </button>
          </div>

          <LanguageTabControl activeLang={currentRfqLang}
            onSelectLang={lang => setSectionLang('rfq_workflow', lang)}
            onTranslate={() => handleAutoTranslate('rfq_workflow', rfqWorkflowData.id, setRfqWorkflowData)}
            isTranslating={translatingKey === 'rfq_workflow'} />

          <div style={{ marginTop: '1.25rem' }}>
            {/* Workflow Section Titles */}
            <div style={{
              background: 'var(--adm-card-inner)', border: '1px solid var(--adm-border-visible)',
              borderRadius: 8, padding: '1rem', marginBottom: '1.25rem',
            }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--adm-text)', marginBottom: '0.75rem' }}>
                Bagian Alur Rekayasa (OEM / ODM Journey)
              </h4>
              <div className="admin-form-group">
                <label className="admin-label">Judul Bagian Alur ({currentRfqLang.toUpperCase()})</label>
                <input type="text" className="admin-input" value={currentRfq.workflowTitle || ''}
                  onChange={e => setRfqWorkflowData(prev => ({
                    ...prev, [currentRfqLang]: { ...prev[currentRfqLang], workflowTitle: e.target.value }
                  }))} />
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-label">Subjudul Bagian Alur ({currentRfqLang.toUpperCase()})</label>
                <textarea rows={2} className="admin-textarea" value={currentRfq.workflowSubtitle || ''}
                  onChange={e => setRfqWorkflowData(prev => ({
                    ...prev, [currentRfqLang]: { ...prev[currentRfqLang], workflowSubtitle: e.target.value }
                  }))} />
              </div>
            </div>

            {/* 5 Steps Grid */}
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--adm-text)', margin: '1.25rem 0 0.75rem' }}>
              5 Langkah Proses Rekayasa
            </h4>
            <div className="admin-form-grid admin-form-grid-2" style={{ marginBottom: '1.5rem' }}>
              {(currentRfq.steps || []).map((st, idx) => (
                <div key={idx} style={{
                  background: 'var(--adm-card-inner)', border: '1px solid var(--adm-border-visible)',
                  borderRadius: 8, padding: '1rem',
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-muted)', fontFamily: 'monospace' }}>
                    LANGKAH {st.step}
                  </span>
                  <div className="admin-form-group" style={{ marginTop: '0.5rem' }}>
                    <label className="admin-label" style={{ fontSize: '0.78rem' }}>Judul Langkah ({currentRfqLang.toUpperCase()})</label>
                    <input type="text" className="admin-input" value={st.title || ''}
                      onChange={e => {
                        const val = e.target.value; const lang = currentRfqLang;
                        setRfqWorkflowData(prev => {
                          const s = [...prev[lang].steps]; s[idx] = { ...s[idx], title: val };
                          return { ...prev, [lang]: { ...prev[lang], steps: s } };
                        });
                      }} />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label" style={{ fontSize: '0.78rem' }}>Deskripsi ({currentRfqLang.toUpperCase()})</label>
                    <textarea rows={3} className="admin-textarea" value={st.desc || ''}
                      onChange={e => {
                        const val = e.target.value; const lang = currentRfqLang;
                        setRfqWorkflowData(prev => {
                          const s = [...prev[lang].steps]; s[idx] = { ...s[idx], desc: val };
                          return { ...prev, [lang]: { ...prev[lang], steps: s } };
                        });
                      }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom RFQ CTA Banner */}
            <div style={{
              background: 'var(--adm-card-inner)', border: '1px solid var(--adm-border-visible)',
              borderRadius: 8, padding: '1rem',
            }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--adm-text)', marginBottom: '0.75rem' }}>
                Banner Penawaran B2B (Manufacturing Fast Action Strip)
              </h4>
              <div className="admin-form-group">
                <label className="admin-label">Judul Banner ({currentRfqLang.toUpperCase()})</label>
                <input type="text" className="admin-input" value={currentRfq.rfqTitle || ''}
                  onChange={e => setRfqWorkflowData(prev => ({
                    ...prev, [currentRfqLang]: { ...prev[currentRfqLang], rfqTitle: e.target.value }
                  }))} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Subjudul Penjelasan ({currentRfqLang.toUpperCase()})</label>
                <textarea rows={3} className="admin-textarea" value={currentRfq.rfqSubtitle || ''}
                  onChange={e => setRfqWorkflowData(prev => ({
                    ...prev, [currentRfqLang]: { ...prev[currentRfqLang], rfqSubtitle: e.target.value }
                  }))} />
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-label">Teks Tombol Aksi ({currentRfqLang.toUpperCase()})</label>
                <input type="text" className="admin-input" value={currentRfq.rfqButton || ''}
                  onChange={e => setRfqWorkflowData(prev => ({
                    ...prev, [currentRfqLang]: { ...prev[currentRfqLang], rfqButton: e.target.value }
                  }))} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Product Form Modal ── */}
      {modalProduct !== undefined && (
        <ProductFormModal
          product={modalProduct}
          onClose={() => setModalProduct(undefined)}
          onSaved={() => { setModalProduct(undefined); fetchProducts(); }}
        />
      )}
    </div>
  );
}
