/**
 * Trade Corridors & Global Export Destinations
 * Structured for dynamic admin CMS control.
 * Can be fetched from backend API or fall back to default verified trade hubs.
 */
export const defaultTradeDestinations = [
  {
    id: 'batam-hq',
    name: 'Batam FTZ',
    country: 'Indonesia',
    flag: '🇮🇩',
    role: 'Pusat Manufaktur & Perakitan SMT',
    subrole: 'HQ Plant',
    details: 'Produksi SMT High-Speed, R&D Car Infotainment, Wire Harness, & Cleanroom ISO 9001',
    lat: 1.12,
    lng: 104.05,
    mapOffsetX: 5,
    mapOffsetY: 6,
    labelPlacement: 'bottom',
    isOrigin: true,
    size: 0.12,
    badgeColor: '#00897B'
  },
  {
    id: 'singapore-psa',
    name: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    role: 'PSA Port Transshipment Hub',
    subrole: 'Transit 45 Mnt',
    details: 'Gerbang Kargo Laut Utama Menuju Seluruh Hub Maritim Internasional',
    lat: 1.35,
    lng: 103.82,
    mapOffsetX: -22,
    mapOffsetY: -16,
    labelPlacement: 'top',
    isOrigin: false,
    size: 0.06,
    badgeColor: '#0D9488'
  },
  {
    id: 'tokyo-hub',
    name: 'Tokyo',
    country: 'Jepang',
    flag: '🇯🇵',
    role: 'Koridor Ekspor Komponen OEM',
    subrole: 'Tier-1 Auto Buyer',
    details: 'Penyuplai Head Unit OEM, Audio DSP Amplifier, dan Modul Elektronik Otomotif',
    lat: 35.68,
    lng: 139.69,
    isOrigin: false,
    size: 0.07,
    badgeColor: '#0284C7'
  },
  {
    id: 'detroit-hub',
    name: 'Detroit',
    country: 'Amerika Serikat',
    flag: '🇺🇸',
    role: 'Pusat Inovasi Otomotif Global',
    subrole: 'Automotive Capital',
    details: 'Integrasi Sistem Infotainment Kendaraan & Rantai Pasok Perakitan Otomotif AS',
    lat: 42.33,
    lng: -83.04,
    isOrigin: false,
    size: 0.08,
    badgeColor: '#2563EB'
  },
  {
    id: 'frankfurt-hub',
    name: 'Frankfurt',
    country: 'Jerman',
    flag: '🇩🇪',
    role: 'Gerbang Pasar Otomotif Eropa',
    subrole: 'EU Auto Gateway',
    details: 'Koridor Distribusi Elektronik Otomotif Berstandar CE & Kepatuhan Industri Uni Eropa',
    lat: 50.11,
    lng: 8.68,
    isOrigin: false,
    size: 0.06,
    badgeColor: '#D97706'
  },
  {
    id: 'los-angeles-hub',
    name: 'Los Angeles',
    country: 'Amerika Serikat',
    flag: '🇺🇸',
    role: 'Gerbang Kargo Pasifik Barat',
    subrole: 'West Coast Logistics',
    details: 'Hub Logistik Distribusi Pantai Barat Amerika untuk Pasar Aftermarket & OEM',
    lat: 34.05,
    lng: -118.24,
    isOrigin: false,
    size: 0.07,
    badgeColor: '#7C3AED'
  }
];
