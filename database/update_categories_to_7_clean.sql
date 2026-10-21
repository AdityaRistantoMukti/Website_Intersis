-- Migration script: Clean and strictly enforce 7 product categories
-- 1. Migrate any remaining legacy category values in `products` table
UPDATE `products` SET `category` = 'android_headunit' WHERE `category` IN ('headunit', 'infotainment');
UPDATE `products` SET `category` = 'dash_camera_recorders' WHERE `category` IN ('dashcam');
UPDATE `products` SET `category` = 'automation' WHERE `category` IN ('ems');
UPDATE `products` SET `category` = 'amplifier' WHERE `category` = 'audio' AND (`model_code` LIKE '%AMP%' OR `title_id` LIKE '%Amplifier%');
UPDATE `products` SET `category` = 'subwoofer' WHERE `category` = 'audio' AND (`model_code` LIKE '%SUB%' OR `title_id` LIKE '%Subwoofer%');
UPDATE `products` SET `category` = 'dsp' WHERE `category` = 'audio' AND (`model_code` LIKE '%DSP%' OR `title_id` LIKE '%DSP%');
UPDATE `products` SET `category` = 'amplifier' WHERE `category` = 'audio';

-- 2. Ensure site_settings products_categories has clean 7 categories
UPDATE `site_settings`
SET `content_json` = '{
  "id": [
    {
      "key": "automation",
      "name": "Automation",
      "desc": "Mesin jig uji otomatis multi-stasiun ICT & FCT terintegrasi PLC, serta bangku pengujian kontinuitas wire harness presisi."
    },
    {
      "key": "mobile_intelligent_device",
      "name": "Mobile Intelligent Device",
      "desc": "Modul AI Box pintar, telematics control unit (T-Box) 4G/IoT, dan perangkat pintar integrasi kokpit kendaraan nirkabel."
    },
    {
      "key": "amplifier",
      "name": "Amplifier",
      "desc": "Penguat daya audio mobil Class-D dan Class-AB multi-kanal efisiensi tinggi dengan proteksi termal andal."
    },
    {
      "key": "subwoofer",
      "name": "Subwoofer",
      "desc": "Subwoofer aktif kabin, downfire box, sparetire active sub, dan underseat subwoofer bertenaga bass tinggi."
    },
    {
      "key": "dsp",
      "name": "DSP",
      "desc": "Digital Signal Processor resolusi tinggi 32-bit floating point, multi-channel equalizer, dan penyesuaian akustik kabin."
    },
    {
      "key": "android_headunit",
      "name": "Android Headunit",
      "desc": "Headunit pintar layar sentuh QLED otomotif, konektivitas wireless Apple CarPlay & Android Auto, serta integrasi CAN-Bus kendaraan."
    },
    {
      "key": "dash_camera_recorders",
      "name": "Dash Camera Recorders",
      "desc": "Kamera perekam perjalanan sensor Sony STARVIS 4K UHD, smart mirror recorder, dan modul keselamatan aktif ADAS."
    }
  ],
  "en": [
    {
      "key": "automation",
      "name": "Automation",
      "desc": "PLC-integrated automated multi-station ICT & FCT test fixtures and precision automotive wire harness test benches."
    },
    {
      "key": "mobile_intelligent_device",
      "name": "Mobile Intelligent Device",
      "desc": "Smart AI Boxes, 4G/IoT telematics control units (T-Box), and wireless intelligent vehicle cockpit devices."
    },
    {
      "key": "amplifier",
      "name": "Amplifier",
      "desc": "High-efficiency multi-channel Class-D and Class-AB car audio power amplifiers with advanced thermal protection."
    },
    {
      "key": "subwoofer",
      "name": "Subwoofer",
      "desc": "Active cabin subwoofers, downfire subwoofer enclosures, spare tire active subs, and slim underseat subwoofers."
    },
    {
      "key": "dsp",
      "name": "DSP",
      "desc": "High-resolution 32-bit floating point Digital Signal Processors, multi-channel acoustic tuning, and time alignment."
    },
    {
      "key": "android_headunit",
      "name": "Android Headunit",
      "desc": "Automotive QLED touchscreen smart headunit solutions, wireless Apple CarPlay & Android Auto, and native CAN-Bus telemetry."
    },
    {
      "key": "dash_camera_recorders",
      "name": "Dash Camera Recorders",
      "desc": "Sony STARVIS 4K UHD driving dash cameras, smart mirror recorders, and active ADAS safety vision sensors."
    }
  ]
}',
`updated_at` = NOW()
WHERE `key_name` = 'products_categories';
