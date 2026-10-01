import { useState, useEffect } from 'react';
import {
  Briefcase,
  FolderKanban,
  Gift,
  GraduationCap,
  HelpCircle,
  Sliders,
  Save,
} from 'lucide-react';
import api, { extractErrorMessage } from '../../../lib/api';
import { translateContent } from '../../../lib/translator';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import LanguageTabControl from '../../../components/admin/LanguageTabControl';

import JobsModule from './JobsModule';
import CategoriesModule from './CategoriesModule';
import BenefitsModule from './BenefitsModule';
import ProgramsModule from './ProgramsModule';
import FaqsModule from './FaqsModule';

export default function CareerModule() {
  const { addToast } = useAdminAuth();
  const [activeSection, setActiveSection] = useState('header');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [activeLang, setActiveLang] = useState('id');

  // 1. Header Karir State
  const [headerData, setHeaderData] = useState({
    id: {
      title: 'Bergabung Bersama Tim Rekayasa Berstandar Dunia di Batam FTZ',
      subtitle: 'Kembangkan keahlian Anda di bidang manufaktur SMT kecepatan tinggi, teknik otomasi industri, dan manajemen mutu otomotif internasional bersama PT. Global Philsonic Technologies.',
    },
    en: {
      title: 'Join Our World-Class Engineering Manufacturing Team in Batam FTZ',
      subtitle: 'Advance your career in high-speed SMT assembly, industrial automation engineering, and international automotive quality management with PT. Global Philsonic Technologies.',
    },
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchCareerHeader() {
      try {
        setLoading(true);
        const res = await api.get('/public/site-settings/career_header');
        if (isMounted && res.data?.data) {
          const d = res.data.data;
          if (d.id && d.en) {
            setHeaderData(d);
          } else if (d.id) {
            setHeaderData((prev) => ({ ...prev, id: d.id, en: d.en || prev.en }));
          }
        }
      } catch (err) {
        addToast(extractErrorMessage(err), 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchCareerHeader();
    return () => { isMounted = false; };
  }, [addToast]);

  const handleSaveHeader = async () => {
    setSavingKey('career_header');
    try {
      await api.put('/admin/site-settings/career_header', headerData);
      addToast('Header halaman karir berhasil disimpan!', 'success');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSavingKey(null);
    }
  };

  const handleAutoTranslateHeader = async () => {
    setTranslating(true);
    try {
      addToast('Menerjemahkan teks header ke English...', 'info');
      const translatedEn = await translateContent(headerData.id);
      setHeaderData((prev) => ({ ...prev, en: translatedEn }));
      setActiveLang('en');
      addToast('Terjemahan selesai!', 'success');
    } catch (err) {
      addToast('Gagal menerjemahkan: ' + extractErrorMessage(err), 'error');
    } finally {
      setTranslating(false);
    }
  };

  const sectionsList = [
    { id: 'header', label: '1. Header Halaman Karir', icon: Sliders },
    { id: 'jobs', label: '2. Lowongan Pekerjaan', icon: Briefcase },
    { id: 'categories', label: '3. Kategori Departemen', icon: FolderKanban },
    { id: 'benefits', label: '4. Benefit Karyawan', icon: Gift },
    { id: 'programs', label: '5. Program Magang & MT', icon: GraduationCap },
    { id: 'faqs', label: '6. Tanya Jawab (FAQ)', icon: HelpCircle },
  ];

  const currentHead = headerData[activeLang] || headerData.id;

  return (
    <div className="admin-module">
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
          Manajemen Konten Halaman Karir & Rekrutmen
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Semua bagian rekrutmen dibagi secara rapi per section: header pengantar, lowongan aktif, departemen, benefit kerja, program magang, hingga tanya jawab rekrutmen.
        </p>
      </div>

      <div className="admin-section-nav">
        {sectionsList.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              className={`admin-section-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveSection(sec.id)}
            >
              <Icon size={16} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {activeSection === 'header' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 1: Header Halaman Karir</h3>
              <p className="admin-card-subtitle">
                Atur judul sambutan karir dan deskripsi pengantar budaya kerja rekayasa.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'career_header'}
              onClick={handleSaveHeader}
            >
              <Save size={16} />
              <span>{savingKey === 'career_header' ? 'Menyimpan...' : 'Simpan Header'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={activeLang}
            onSelectLang={setActiveLang}
            onTranslate={handleAutoTranslateHeader}
            isTranslating={translating}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Judul Header Karir ({activeLang.toUpperCase()})</label>
              <input
                type="text"
                className="admin-input"
                value={currentHead.title || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setHeaderData((prev) => ({
                    ...prev,
                    [activeLang]: { ...prev[activeLang], title: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Subjudul Penjelasan ({activeLang.toUpperCase()})</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={currentHead.subtitle || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setHeaderData((prev) => ({
                    ...prev,
                    [activeLang]: { ...prev[activeLang], subtitle: val },
                  }));
                }}
              />
            </div>
          </div>
        </div>
      )}

      {activeSection === 'jobs' && <JobsModule />}
      {activeSection === 'categories' && <CategoriesModule />}
      {activeSection === 'benefits' && <BenefitsModule />}
      {activeSection === 'programs' && <ProgramsModule />}
      {activeSection === 'faqs' && <FaqsModule />}
    </div>
  );
}
