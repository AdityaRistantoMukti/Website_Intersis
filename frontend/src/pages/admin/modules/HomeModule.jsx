import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Sliders, Type, BarChart3, HelpCircle } from 'lucide-react';
import api, { extractErrorMessage } from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function HomeModule() {
  const { addToast } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [savingStats, setSavingStats] = useState(false);
  const [savingCta, setSavingCta] = useState(false);

  // 1. Hero State
  const [heroData, setHeroData] = useState({
    slides: [
      {
        title: 'Presisi Manufaktur Elektronik Otomotif Batam FTZ',
        subtitle: 'Perakitan SMT berkecepatan 80.000 CPH, modul smart headunit Tier-1, dan sistem DSP audio bersertifikasi IATF 16949 di Kawasan Perdagangan Bebas Batam.',
        ctaPrimary: 'Jelajahi Produk & Kapabilitas',
        ctaSecondary: 'Hubungi Sales Engineering',
        tag: 'Fasilitas FTZ 10.000 m² & Bebas Bea Masuk',
        bgImage: '/images/hero-smt.jpg',
      },
      {
        title: 'Solusi Turnkey OEM / ODM & Otomasi Mesin Uji',
        subtitle: 'Dari evaluasi DFM, prototipe kilat, hingga perakitan massal box-build dengan jaminan mutu nol-cacat dan transit cepat 45 menit ke Singapura.',
        ctaPrimary: 'Permintaan Penawaran (RFQ)',
        ctaSecondary: 'Konsultasi Teknis B2B',
        tag: 'Inspeksi 100% 3D SPI, Inline AOI & X-Ray',
        bgImage: '/images/hero-wave.jpg',
      },
    ],
    typewriterTexts: [
      'Elektronik Otomotif',
      'Perakitan SMT Presisi',
      'Otomasi Industri',
      'Partner OEM / ODM',
    ],
  });

  // 2. Stats Deck State
  const [statsData, setStatsData] = useState({
    experience: { value: 10, suffix: '+', label: 'Tahun Pengalaman', sublabel: 'Manufaktur Presisi Tinggi' },
    capacity: { value: 80, suffix: 'K CPH', label: 'Kapasitas Lini SMT', sublabel: 'Mounter Yamaha & Panasonic' },
    support: { value: 24, suffix: '/7', label: 'Dukungan Rekayasa', sublabel: 'Kolaborasi DFM & NPI Cepat' },
    quality: { value: 100, suffix: '%', label: 'Jaminan Kualitas', sublabel: 'Standar IATF 16949 Otomotif' },
  });

  // 3. CTA Banner State
  const [ctaData, setCtaData] = useState({
    title: 'Siap Mewujudkan Proyek Elektronik Otomotif Anda?',
    subtitle: 'Diskusikan kebutuhan spesifikasi teknis, estimasi volume perakitan, dan penawaran biaya resmi bersama tim engineering kami di Batam FTZ.',
    btnText: 'Mulai Diskusi Proyek B2B',
    btnUrl: '/contact',
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchHomeSettings() {
      try {
        setLoading(true);
        const [heroRes, statsRes, ctaRes] = await Promise.allSettled([
          api.get('/public/site-settings/home_hero'),
          api.get('/public/site-settings/home_stats'),
          api.get('/public/site-settings/home_cta'),
        ]);

        if (isMounted) {
          if (heroRes.status === 'fulfilled' && heroRes.value.data?.data) {
            setHeroData(heroRes.value.data.data);
          }
          if (statsRes.status === 'fulfilled' && statsRes.value.data?.data) {
            setStatsData(statsRes.value.data.data);
          }
          if (ctaRes.status === 'fulfilled' && ctaRes.value.data?.data) {
            setCtaData(ctaRes.value.data.data);
          }
        }
      } catch (err) {
        addToast(extractErrorMessage(err), 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchHomeSettings();
    return () => { isMounted = false; };
  }, [addToast]);

  // Handlers for Slides
  const handleSlideChange = (index, field, value) => {
    const nextSlides = [...heroData.slides];
    nextSlides[index] = { ...nextSlides[index], [field]: value };
    setHeroData({ ...heroData, slides: nextSlides });
  };

  const handleAddSlide = () => {
    setHeroData({
      ...heroData,
      slides: [
        ...heroData.slides,
        {
          title: 'Judul Slide Baru',
          subtitle: 'Deskripsi subjudul mengenai kapabilitas manufaktur...',
          ctaPrimary: 'Katalog Produk',
          ctaSecondary: 'Hubungi Kami',
          tag: 'Standar Industri Global',
          bgImage: '/images/hero-smt.jpg',
        },
      ],
    });
  };

  const handleDeleteSlide = (index) => {
    if (heroData.slides.length <= 1) {
      addToast('Minimal harus ada satu slide aktif.', 'warning');
      return;
    }
    const nextSlides = heroData.slides.filter((_, i) => i !== index);
    setHeroData({ ...heroData, slides: nextSlides });
  };

  const handleSaveHero = async () => {
    setSavingHero(true);
    try {
      await api.put('/admin/site-settings/home_hero', heroData);
      addToast('Hero section beranda berhasil diperbarui!', 'success');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSavingHero(false);
    }
  };

  const handleSaveStats = async () => {
    setSavingStats(true);
    try {
      await api.put('/admin/site-settings/home_stats', statsData);
      addToast('Angka telemetri statistik berhasil disimpan!', 'success');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSavingStats(false);
    }
  };

  const handleSaveCta = async () => {
    setSavingCta(true);
    try {
      await api.put('/admin/site-settings/home_cta', ctaData);
      addToast('CTA banner beranda berhasil disimpan!', 'success');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSavingCta(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
        <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
        <span>Memuat data konten beranda...</span>
      </div>
    );
  }

  return (
    <div className="admin-home-module">
      {/* ── 1. HERO SLIDES & ROTATION ── */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">
              <Sliders size={18} />
              <span>Hero Carousel Beranda (Fullscreen Slides)</span>
            </h2>
            <p className="admin-card-desc">
              Atur teks headline, subheadline, tombol CTA, dan latar visual slide beranda utama.
            </p>
          </div>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={handleAddSlide}
          >
            <Plus size={14} />
            <span>Tambah Slide</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {heroData.slides.map((slide, sIdx) => (
            <div
              key={sIdx}
              style={{
                background: 'var(--adm-input-bg)',
                border: '1px solid var(--adm-border)',
                borderRadius: '6px',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--adm-teal)' }}>
                  Slide #{sIdx + 1}
                </span>
                {heroData.slides.length > 1 && (
                  <button
                    type="button"
                    className="admin-btn-danger"
                    onClick={() => handleDeleteSlide(sIdx)}
                  >
                    <Trash2 size={12} />
                    <span>Hapus Slide</span>
                  </button>
                )}
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group admin-form-group--full">
                  <label className="admin-label">Judul Utama Slide (H1)</label>
                  <input
                    type="text"
                    className="admin-text-input"
                    value={slide.title}
                    onChange={(e) => handleSlideChange(sIdx, 'title', e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group admin-form-group--full">
                  <label className="admin-label">Subjudul Penjelasan</label>
                  <textarea
                    className="admin-textarea"
                    rows="2"
                    value={slide.subtitle}
                    onChange={(e) => handleSlideChange(sIdx, 'subtitle', e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Tombol Utama (CTA Primary)</label>
                  <input
                    type="text"
                    className="admin-text-input"
                    value={slide.ctaPrimary}
                    onChange={(e) => handleSlideChange(sIdx, 'ctaPrimary', e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Tombol Kedua (CTA Secondary)</label>
                  <input
                    type="text"
                    className="admin-text-input"
                    value={slide.ctaSecondary}
                    onChange={(e) => handleSlideChange(sIdx, 'ctaSecondary', e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Badge Tagline Bawah</label>
                  <input
                    type="text"
                    className="admin-text-input"
                    value={slide.tag}
                    onChange={(e) => handleSlideChange(sIdx, 'tag', e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Path Gambar Latar</label>
                  <input
                    type="text"
                    className="admin-text-input"
                    value={slide.bgImage}
                    onChange={(e) => handleSlideChange(sIdx, 'bgImage', e.target.value)}
                    placeholder="/images/hero-smt.jpg"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Typewriter Keywords */}
          <div className="admin-form-group admin-form-group--full" style={{ marginTop: '0.5rem' }}>
            <label className="admin-label">
              <span>Kata Kunci Animasi Typewriter (Pisahkan dengan koma)</span>
            </label>
            <input
              type="text"
              className="admin-text-input"
              value={heroData.typewriterTexts ? heroData.typewriterTexts.join(', ') : ''}
              onChange={(e) => {
                const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                setHeroData({ ...heroData, typewriterTexts: arr });
              }}
              placeholder="Elektronik Otomotif, Perakitan SMT Presisi, Otomasi Industri..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="admin-btn-primary"
              onClick={handleSaveHero}
              disabled={savingHero}
            >
              <Save size={14} />
              <span>{savingHero ? 'Menyimpan...' : 'Simpan Hero Section'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. TELEMETRY STATS DECK ── */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">
              <BarChart3 size={18} />
              <span>Angka Telemetri & Statistik Beranda</span>
            </h2>
            <p className="admin-card-desc">
              Atur 4 metrik industri yang tampil pada section statistik di bawah hero banner.
            </p>
          </div>
        </div>

        <div className="admin-form-grid">
          {/* Experience */}
          <div style={{ background: 'var(--adm-input-bg)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--adm-border)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: 'var(--adm-teal)' }}>
              1. Pengalaman Industri
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div>
                <label className="admin-label">Nilai Angka</label>
                <input
                  type="number"
                  className="admin-text-input"
                  value={statsData.experience?.value ?? 10}
                  onChange={(e) => setStatsData({
                    ...statsData,
                    experience: { ...statsData.experience, value: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="admin-label">Suffix Satuan</label>
                <input
                  type="text"
                  className="admin-text-input"
                  value={statsData.experience?.suffix || '+'}
                  onChange={(e) => setStatsData({
                    ...statsData,
                    experience: { ...statsData.experience, suffix: e.target.value }
                  })}
                />
              </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label className="admin-label">Label Utama</label>
              <input
                type="text"
                className="admin-text-input"
                value={statsData.experience?.label || ''}
                onChange={(e) => setStatsData({
                  ...statsData,
                  experience: { ...statsData.experience, label: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="admin-label">Sublabel Penjelasan</label>
              <input
                type="text"
                className="admin-text-input"
                value={statsData.experience?.sublabel || ''}
                onChange={(e) => setStatsData({
                  ...statsData,
                  experience: { ...statsData.experience, sublabel: e.target.value }
                })}
              />
            </div>
          </div>

          {/* Capacity */}
          <div style={{ background: 'var(--adm-input-bg)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--adm-border)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: 'var(--adm-teal)' }}>
              2. Kapasitas Lini SMT
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div>
                <label className="admin-label">Nilai Angka</label>
                <input
                  type="number"
                  className="admin-text-input"
                  value={statsData.capacity?.value ?? 80}
                  onChange={(e) => setStatsData({
                    ...statsData,
                    capacity: { ...statsData.capacity, value: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="admin-label">Suffix Satuan</label>
                <input
                  type="text"
                  className="admin-text-input"
                  value={statsData.capacity?.suffix || 'K CPH'}
                  onChange={(e) => setStatsData({
                    ...statsData,
                    capacity: { ...statsData.capacity, suffix: e.target.value }
                  })}
                />
              </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label className="admin-label">Label Utama</label>
              <input
                type="text"
                className="admin-text-input"
                value={statsData.capacity?.label || ''}
                onChange={(e) => setStatsData({
                  ...statsData,
                  capacity: { ...statsData.capacity, label: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="admin-label">Sublabel Penjelasan</label>
              <input
                type="text"
                className="admin-text-input"
                value={statsData.capacity?.sublabel || ''}
                onChange={(e) => setStatsData({
                  ...statsData,
                  capacity: { ...statsData.capacity, sublabel: e.target.value }
                })}
              />
            </div>
          </div>

          {/* Support */}
          <div style={{ background: 'var(--adm-input-bg)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--adm-border)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: 'var(--adm-teal)' }}>
              3. Dukungan Rekayasa
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div>
                <label className="admin-label">Nilai Angka</label>
                <input
                  type="number"
                  className="admin-text-input"
                  value={statsData.support?.value ?? 24}
                  onChange={(e) => setStatsData({
                    ...statsData,
                    support: { ...statsData.support, value: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="admin-label">Suffix Satuan</label>
                <input
                  type="text"
                  className="admin-text-input"
                  value={statsData.support?.suffix || '/7'}
                  onChange={(e) => setStatsData({
                    ...statsData,
                    support: { ...statsData.support, suffix: e.target.value }
                  })}
                />
              </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label className="admin-label">Label Utama</label>
              <input
                type="text"
                className="admin-text-input"
                value={statsData.support?.label || ''}
                onChange={(e) => setStatsData({
                  ...statsData,
                  support: { ...statsData.support, label: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="admin-label">Sublabel Penjelasan</label>
              <input
                type="text"
                className="admin-text-input"
                value={statsData.support?.sublabel || ''}
                onChange={(e) => setStatsData({
                  ...statsData,
                  support: { ...statsData.support, sublabel: e.target.value }
                })}
              />
            </div>
          </div>

          {/* Quality */}
          <div style={{ background: 'var(--adm-input-bg)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--adm-border)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: 'var(--adm-teal)' }}>
              4. Jaminan Mutu Otomotif
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div>
                <label className="admin-label">Nilai Angka</label>
                <input
                  type="number"
                  className="admin-text-input"
                  value={statsData.quality?.value ?? 100}
                  onChange={(e) => setStatsData({
                    ...statsData,
                    quality: { ...statsData.quality, value: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="admin-label">Suffix Satuan</label>
                <input
                  type="text"
                  className="admin-text-input"
                  value={statsData.quality?.suffix || '%'}
                  onChange={(e) => setStatsData({
                    ...statsData,
                    quality: { ...statsData.quality, suffix: e.target.value }
                  })}
                />
              </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label className="admin-label">Label Utama</label>
              <input
                type="text"
                className="admin-text-input"
                value={statsData.quality?.label || ''}
                onChange={(e) => setStatsData({
                  ...statsData,
                  quality: { ...statsData.quality, label: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="admin-label">Sublabel Penjelasan</label>
              <input
                type="text"
                className="admin-text-input"
                value={statsData.quality?.sublabel || ''}
                onChange={(e) => setStatsData({
                  ...statsData,
                  quality: { ...statsData.quality, sublabel: e.target.value }
                })}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleSaveStats}
            disabled={savingStats}
          >
            <Save size={14} />
            <span>{savingStats ? 'Menyimpan...' : 'Simpan Statistik Telemetri'}</span>
          </button>
        </div>
      </div>

      {/* ── 3. CTA BANNER ── */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">
              <Type size={18} />
              <span>CTA Banner Bawah Beranda</span>
            </h2>
            <p className="admin-card-desc">
              Pesan ajakan kolaborasi manufaktur B2B yang tampil sebelum footer beranda.
            </p>
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-group admin-form-group--full">
            <label className="admin-label">Judul Banner (Heading)</label>
            <input
              type="text"
              className="admin-text-input"
              value={ctaData.title || ''}
              onChange={(e) => setCtaData({ ...ctaData, title: e.target.value })}
            />
          </div>

          <div className="admin-form-group admin-form-group--full">
            <label className="admin-label">Subjudul / Paragraf Ajakan</label>
            <textarea
              className="admin-textarea"
              rows="2"
              value={ctaData.subtitle || ''}
              onChange={(e) => setCtaData({ ...ctaData, subtitle: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Teks Tombol</label>
            <input
              type="text"
              className="admin-text-input"
              value={ctaData.btnText || ''}
              onChange={(e) => setCtaData({ ...ctaData, btnText: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Target URL</label>
            <input
              type="text"
              className="admin-text-input"
              value={ctaData.btnUrl || ''}
              onChange={(e) => setCtaData({ ...ctaData, btnUrl: e.target.value })}
              placeholder="/contact"
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleSaveCta}
            disabled={savingCta}
          >
            <Save size={14} />
            <span>{savingCta ? 'Menyimpan...' : 'Simpan CTA Banner'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
