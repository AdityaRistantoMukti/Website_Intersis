-- Seed site_settings for Products & Solusi (products_header, products_categories, products_rfq)
INSERT INTO `site_settings` (`key_name`, `content_json`, `updated_at`)
VALUES
(
  'products_header',
  '{
    "id": {
      "title": "Solusi Manufaktur Elektronik Otomotif & Otomasi Presisi",
      "subtitle": "Katalog resmi produk siap OEM/ODM standar Tier-1, prosesor audio DSP, perangkat keselamatan berkendara, mesin jig uji otomatis, dan layanan kontrak perakitan SMT berkecepatan tinggi di Kawasan Bebas Batam (FTZ).",
      "chips": [
        { "value": "12+ Model", "label": "SKU Siap Produksi", "sub": "Turnkey OEM / ODM" },
        { "value": "80.000 CPH", "label": "Kecepatan Lini SMT", "sub": "Yamaha & Panasonic Lines" },
        { "value": "IATF 16949", "label": "Standar Mutu Nol Cacat", "sub": "& ISO 9001:2015" },
        { "value": "45 Menit", "label": "Logistik Bebas Pajak", "sub": "Batam FTZ ke Singapura" }
      ]
    },
    "en": {
      "title": "Automotive Electronics & Precision Manufacturing Catalog",
      "subtitle": "Official engineering catalog of Tier-1 standard OEM/ODM products, DSP audio processors, in-vehicle safety sensors, automated test fixtures, and high-speed turnkey SMT assembly at Batam Free Trade Zone.",
      "chips": [
        { "value": "12+ Models", "label": "Production-Ready SKUs", "sub": "Turnkey OEM / ODM" },
        { "value": "80,000 CPH", "label": "SMT Line Capacity", "sub": "Yamaha & Panasonic Lines" },
        { "value": "IATF 16949", "label": "Zero-Defect Standard", "sub": "& ISO 9001:2015" },
        { "value": "45 Minutes", "label": "Duty-Free Logistics", "sub": "Batam FTZ to Singapore" }
      ]
    }
  }',
  NOW()
)
ON DUPLICATE KEY UPDATE `content_json` = VALUES(`content_json`), `updated_at` = NOW();

INSERT INTO `site_settings` (`key_name`, `content_json`, `updated_at`)
VALUES
(
  'products_categories',
  '{
    "id": [
      {
        "key": "headunit",
        "name": "Headunit / Infotainment",
        "desc": "Solusi headunit pintar layar sentuh QLED otomotif, konektivitas Apple CarPlay & Android Auto tanpa kabel, serta integrasi bus data CAN-Bus kendaraan."
      },
      {
        "key": "audio",
        "name": "Audio DSP & Amplifier",
        "desc": "Digital Signal Processor (DSP) resolusi tinggi dan amplifier multi-kanal performa tinggi dengan kontrol akustik presisi 32-bit DAC."
      },
      {
        "key": "dashcam",
        "name": "Dashcam & ADAS Safety",
        "desc": "Kamera pengawas berkendara sensor Sony STARVIS 2 4K UHD, radar sensor Blind-Spot 77GHz, dan modul keselamatan aktif ADAS."
      },
      {
        "key": "automation",
        "name": "Automation & Test Jigs",
        "desc": "Mesin jig uji otomatis multi-stasiun ICT & FCT terintegrasi PLC, serta bangku pengujian kontinuitas wire harness 128-pin."
      },
      {
        "key": "ems",
        "name": "EMS / Contract Manufacturing",
        "desc": "Layanan manufaktur kontrak elektronik (EMS) lini SMT berkecepatan 80.000 CPH, inspeksi 3D SPI/AOI, pelapisan konformal, hingga perakitan box-build."
      }
    ],
    "en": [
      {
        "key": "headunit",
        "name": "Headunit / Infotainment",
        "desc": "Smart automotive QLED touchscreen headunit solutions, wireless Apple CarPlay & Android Auto connectivity, and in-vehicle CAN-Bus telemetry integration."
      },
      {
        "key": "audio",
        "name": "Audio DSP & Amplifier",
        "desc": "High-resolution Digital Signal Processors (DSP) and high-performance multi-channel amplifiers featuring 32-bit DAC precision acoustic control."
      },
      {
        "key": "dashcam",
        "name": "Dashcam & ADAS Safety",
        "desc": "Sony STARVIS 2 4K UHD driving dashcams, 77GHz millimeter-wave blind-spot radar sensors, and active ADAS safety modules."
      },
      {
        "key": "automation",
        "name": "Automation & Test Jigs",
        "desc": "PLC-integrated automated multi-station ICT & FCT test fixtures and 128-point automotive wire harness continuity test benches."
      },
      {
        "key": "ems",
        "name": "EMS / Contract Manufacturing",
        "desc": "Turnkey electronics contract manufacturing (EMS) featuring 80,000 CPH high-speed SMT lines, 3D SPI/AOI inspection, conformal coating, and full box-build assembly."
      }
    ]
  }',
  NOW()
)
ON DUPLICATE KEY UPDATE `content_json` = VALUES(`content_json`), `updated_at` = NOW();

INSERT INTO `site_settings` (`key_name`, `content_json`, `updated_at`)
VALUES
(
  'products_rfq',
  '{
    "id": {
      "rfqTitle": "Membutuhkan Kustomisasi Khusus atau Tooling Baru?",
      "rfqSubtitle": "Tim R&D dan engineering kami di Batam FTZ siap berkolaborasi untuk perancangan skematik PCB, penyesuaian firmware CAN-Bus, hingga perakitan turnkey box-build standar ekspor global.",
      "rfqButton": "Konsultasi Cepat via WhatsApp B2B",
      "workflowTitle": "Dari Desain Konsep Hingga Produksi Massal (OEM / ODM Journey)",
      "workflowSubtitle": "Metodologi rekayasa terstruktur kami menjamin kualitas bebas cacat (Zero-Defect), kepatuhan regulasi otomotif, dan efisiensi biaya manufaktur.",
      "steps": [
        {
          "step": "01",
          "title": "Analisis RFQ & Review BOM",
          "desc": "Evaluasi mendalam spesifikasi teknis, ketersediaan komponen, dan kalkulasi penawaran biaya resmi dalam 24-48 jam."
        },
        {
          "step": "02",
          "title": "Rekayasa DFM & Rapid Prototyping",
          "desc": "Optimalisasi layout Design-for-Manufacturing (DFM) untuk menjamin yield SMT maksimal dan pembuatan sampel uji fungsional."
        },
        {
          "step": "03",
          "title": "Tooling, Stensil & Pilot Run",
          "desc": "Fabrikasi stensil laser elektropolis serta pengujian perakitan batch awal terkontrol untuk memvalidasi toleransi mesin."
        },
        {
          "step": "04",
          "title": "Validasi Kualitas 100% (SPI, AOI, ICT)",
          "desc": "Inspeksi pasta solder 3D, inspeksi optik otomatis AOI, validasi jalur kelistrikan ICT, dan uji ketahanan termal ekstrem."
        },
        {
          "step": "05",
          "title": "Produksi Massal & Ekspor FTZ",
          "desc": "Perakitan massal berkecepatan 80.000 CPH, integrasi serialisasi barcode MES, dan pengiriman kilat 45 menit ke pelabuhan Singapura."
        }
      ]
    },
    "en": {
      "rfqTitle": "Need Custom Engineering or New Product Tooling?",
      "rfqSubtitle": "Our engineering & R&D team at Batam FTZ is ready to collaborate on schematic design, CAN-Bus firmware customization, and turnkey box-build assembly for global export.",
      "rfqButton": "Direct B2B WhatsApp Consultation",
      "workflowTitle": "From Concept Design to Mass Production (OEM / ODM Journey)",
      "workflowSubtitle": "Our structured engineering methodology guarantees zero-defect quality, automotive regulatory compliance, and maximum cost efficiency.",
      "steps": [
        {
          "step": "01",
          "title": "RFQ & BOM Review",
          "desc": "Technical specification review, component sourcing validation, and cost quotation within 24-48 business hours."
        },
        {
          "step": "02",
          "title": "DFM Engineering & Prototyping",
          "desc": "Design-for-Manufacturing optimization ensuring optimal SMT placement yields and functional engineering prototypes."
        },
        {
          "step": "03",
          "title": "Tooling, Stencils & Pilot Run",
          "desc": "Electro-polished laser stencil fabrication and controlled pilot production batches to qualify machinery tolerances."
        },
        {
          "step": "04",
          "title": "100% Quality Validation (SPI, AOI, ICT)",
          "desc": "3D solder paste inspection, automated optical inspection, in-circuit testing, and dynamic thermal burn-in validation."
        },
        {
          "step": "05",
          "title": "Mass Assembly & FTZ Logistics",
          "desc": "High-speed 80K CPH assembly, real-time MES barcode serialization, and 45-minute express transit to Singapore seaport."
        }
      ]
    }
  }',
  NOW()
)
ON DUPLICATE KEY UPDATE `content_json` = VALUES(`content_json`), `updated_at` = NOW();
