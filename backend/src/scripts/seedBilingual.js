const pool = require('../config/database');

async function migrateEn() {
  try {
    const [profile] = await pool.execute('SELECT * FROM company_profile LIMIT 1');
    if (profile.length > 0) {
      await pool.execute(
        `UPDATE company_profile SET
          title_en = ?,
          description_en = ?,
          vision_en = ?,
          mission_en = ?
        WHERE id = ?`,
        [
          'PT. Global Philsonic Technologies',
          'PT. Global Philsonic Technologies (GPT) is a premier high-precision electronics manufacturing and industrial automation solutions provider operating in the Batam Free Trade Zone (FTZ). With a 10,000 m² IATF 16949-certified facility, we manufacture automotive electronic modules, smart QLED head units, DSP audio processor systems, driving safety sensor devices, and high-speed automated functional test fixtures at 80,000 CPH.',
          'To be the trusted Tier-1 automotive electronics and automation engineering manufacturing partner in Southeast Asia with zero-defect quality standards and global duty-free logistics efficiency.',
          '1. Deliver high-precision SMT assembly with micron tolerance meeting international IATF 16949 automotive standards.\n2. Provide end-to-end OEM/ODM services from DFM, rapid prototyping, to mass production and turnkey box-build.\n3. Develop automation engineering solutions and smart test jigs to maximize Industry 4.0 yield.\n4. Leverage Batam Free Trade Zone strategic advantages to deliver duty-free supply chain and 45-minute freight to Singapore.',
          profile[0].id
        ]
      );
      console.log('company_profile English updated');
    }

    await pool.execute(
      `UPDATE contact_recruitment SET
        address_en = ?`,
      ['Batam Industrial Park, Mukakuning, Batam Free Trade Zone, Riau Islands 29433, Indonesia']
    );
    console.log('contact_recruitment English updated');

    const [values] = await pool.execute('SELECT id, title, description FROM core_values');
    for (const v of values) {
      let t_en = v.title;
      let d_en = v.description;
      if (v.title.includes('Presisi SMT')) {
        t_en = 'Micron SMT Precision';
        d_en = 'High-speed 80,000 CPH placement line with 100% inline 3D SPI and AOI inspection.';
      } else if (v.title.includes('Kepatuhan Mutu')) {
        t_en = 'IATF 16949 Quality Compliance';
        d_en = 'Strict automotive standard operating procedure with zero-defect quality discipline.';
      } else if (v.title.includes('Otomasi &')) {
        t_en = 'Automation & Smart Jigs';
        d_en = 'Custom automated functional test fixtures (FCT) integrated with cloud MES traceability.';
      } else if (v.title.includes('Logistik Bebas')) {
        t_en = '0% Tariff FTZ Logistics';
        d_en = 'Batam Free Trade Zone strategic hub with 45-minute direct sea freight to Singapore port.';
      }
      await pool.execute('UPDATE core_values SET title_en = ?, description_en = ? WHERE id = ?', [t_en, d_en, v.id]);
    }
    console.log('core_values English updated');

    // Also update existing site_settings (home_hero, home_stats, home_cta) to bilingual { id, en }
    const [heroRows] = await pool.execute("SELECT content_json FROM site_settings WHERE key_name = 'home_hero'");
    if (heroRows.length > 0) {
      const heroId = JSON.parse(heroRows[0].content_json);
      const bilingualHero = {
        id: {
          slides: [
            {
              title: "Presisi Manufaktur Elektronik Otomotif Batam FTZ",
              subtitle: "Perakitan SMT berkecepatan 80.000 CPH, jaminan mutu IATF 16949, dan keunggulan logistik 0% tarif ke seluruh dunia.",
              actionText: "Konsultasi Engineering RFQ",
              actionLink: "/contact"
            },
            {
              title: "Solusi Cerdas Headunit, Audio DSP & Otomasi Batam",
              subtitle: "Fasilitas cleanroom Class 100K terintegrasi di Batam Free Trade Zone — mitra Tier-1 perakitan OEM/ODM global.",
              actionText: "Lihat Produk & Spesifikasi",
              actionLink: "/products"
            }
          ],
          keywords: ["Elektronik Otomotif", "Perakitan SMT Presisi", "Otomasi Industri", "Partner OEM / ODM"]
        },
        en: {
          slides: [
            {
              title: "Precision Automotive Electronics Manufacturing Batam FTZ",
              subtitle: "High-speed 80,000 CPH SMT placement, IATF 16949 quality assurance, and 0% duty logistics worldwide.",
              actionText: "Engineering RFQ Consultation",
              actionLink: "/contact"
            },
            {
              title: "Smart Automotive Headunits, DSP Audio & Automation Batam",
              subtitle: "Integrated Class 100K cleanroom facility in Batam Free Trade Zone — trusted global Tier-1 OEM/ODM partner.",
              actionText: "Explore Products & Specs",
              actionLink: "/products"
            }
          ],
          keywords: ["Automotive Electronics", "Precision SMT Assembly", "Industrial Automation", "OEM / ODM Partner"]
        }
      };
      await pool.execute(
        "UPDATE site_settings SET content_json = ? WHERE key_name = 'home_hero'",
        [JSON.stringify(bilingualHero, null, 2)]
      );
      console.log('home_hero bilingual updated');
    }

    const [statsRows] = await pool.execute("SELECT content_json FROM site_settings WHERE key_name = 'home_stats'");
    if (statsRows.length > 0) {
      const bilingualStats = {
        id: {
          experience: { value: 10, suffix: "+", label: "Tahun Pengalaman", sublabel: "Manufaktur Presisi Batam" },
          capacity: { value: 80, suffix: "K CPH", label: "Kapasitas Penempatan SMT", sublabel: "Lini Berkecepatan Tinggi" },
          area: { value: 10000, suffix: "m²", label: "Luas Area Pabrik", sublabel: "Fasilitas Cleanroom Terkontrol" },
          yieldRate: { value: 99.8, suffix: "%", label: "Tingkat Yield Lolos Mutu", sublabel: "Standar Nol-Cacat Otomotif" }
        },
        en: {
          experience: { value: 10, suffix: "+", label: "Years of Experience", sublabel: "Precision Manufacturing Batam" },
          capacity: { value: 80, suffix: "K CPH", label: "SMT Placement Capacity", sublabel: "High-Speed Dual-Beam Line" },
          area: { value: 10000, suffix: "m²", label: "Factory Floor Area", sublabel: "Controlled Cleanroom Facility" },
          yieldRate: { value: 99.8, suffix: "%", label: "Quality First-Pass Yield", sublabel: "Automotive Zero-Defect Standard" }
        }
      };
      await pool.execute(
        "UPDATE site_settings SET content_json = ? WHERE key_name = 'home_stats'",
        [JSON.stringify(bilingualStats, null, 2)]
      );
      console.log('home_stats bilingual updated');
    }

    const [ctaRows] = await pool.execute("SELECT content_json FROM site_settings WHERE key_name = 'home_cta'");
    if (ctaRows.length > 0) {
      const bilingualCta = {
        id: {
          title: "Siap Mewujudkan Proyek Elektronik Otomotif Anda?",
          subtitle: "Diskusikan kebutuhan perakitan SMT, manufaktur OEM/ODM, atau integrasi otomasi pabrik dengan tim rekayasa GPT Batam.",
          buttonText: "Kirim Permintaan Penawaran (RFQ)",
          buttonLink: "/contact"
        },
        en: {
          title: "Ready to Accelerate Your Automotive Electronics Project?",
          subtitle: "Consult your high-speed SMT assembly, OEM/ODM box-build, or factory automation integration with GPT Batam engineering team.",
          buttonText: "Request an Engineering Quote (RFQ)",
          buttonLink: "/contact"
        }
      };
      await pool.execute(
        "UPDATE site_settings SET content_json = ? WHERE key_name = 'home_cta'",
        [JSON.stringify(bilingualCta, null, 2)]
      );
      console.log('home_cta bilingual updated');
    }

    await pool.end();
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migrateEn();
