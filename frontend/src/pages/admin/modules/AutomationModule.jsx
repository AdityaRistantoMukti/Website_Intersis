import { useState, useEffect } from 'react';
import {
  Save,
  Cpu,
  Bot,
  Sliders,
  Network,
  Activity,
} from 'lucide-react';
import api, { extractErrorMessage } from '../../../lib/api';
import { translateContent } from '../../../lib/translator';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import LanguageTabControl from '../../../components/admin/LanguageTabControl';

export default function AutomationModule() {
  const { addToast } = useAdminAuth();
  const [activeSection, setActiveSection] = useState('header');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [translatingKey, setTranslatingKey] = useState(null);

  const [langMap, setLangMap] = useState({
    header: 'id',
    models: 'id',
    architecture: 'id',
  });

  const setSectionLang = (sec, lang) => {
    setLangMap((prev) => ({ ...prev, [sec]: lang }));
  };

  // ─── 1. HEADER STATE ───
  const [headerData, setHeaderData] = useState({
    id: {
      title: 'Solusi Rekayasa Otomasi & Robotik Industri Presisi',
      subtitle: 'Sistem lengan robotik 6-axis berkecepatan tinggi untuk pengelasan busur presisi, penanganan material berbobot berat, pemotongan serat laser, dan jig uji fungsional terintegrasi di Batam FTZ.',
      highlights: [
        { label: 'Kinematika Robotik', val: 'Artikulasi 6-Sumbu Presisi' },
        { label: 'Akurasi Pengulangan', val: 'Toleransi ±0.03 – ±0.05 mm' },
        { label: 'Protokol Industri', val: 'EtherCAT / PROFINET Real-Time' },
      ],
    },
    en: {
      title: 'Precision Industrial Automation & Robotics Engineering Solutions',
      subtitle: 'High-speed 6-axis articulated robotic arms for precision arc welding, heavy-duty material handling, fiber laser trimming, and integrated automated test fixtures in Batam FTZ.',
      highlights: [
        { label: 'Robotic Kinematics', val: 'Precision 6-Axis Articulated' },
        { label: 'Repeatability Accuracy', val: '±0.03 to ±0.05 mm Tolerance' },
        { label: 'Industrial Fieldbus', val: 'Real-Time EtherCAT / PROFINET' },
      ],
    },
  });

  // ─── 2. ROBOT MODELS SUMMARY STATE ───
  const [modelsData, setModelsData] = useState({
    id: [
      {
        id: 'welding',
        title: 'Seri Robot Welding (Pengelasan Busur & Spot)',
        payload: '20 kg',
        reach: '2.010 mm',
        accuracy: '±0.04 mm',
        desc: 'Pengelasan busur presisi tinggi untuk sasis otomotif, tangki baja, dan komponen struktural dengan penelusuran kampuh las digital dan busur anti-spatter.',
      },
      {
        id: 'handling',
        title: 'Seri Robot Handling & Palletizing (Penanganan Material)',
        payload: '50 kg',
        reach: '2.200 mm',
        accuracy: '±0.05 mm',
        desc: 'Pemindahan muatan berat berkecepatan tinggi, integrasi konveyor perakitan PCBA, dan sistem pengemasan otomatis dengan gripper kustom.',
      },
      {
        id: 'cutting',
        title: 'Seri Robot Cutting (Pemotongan Serat Laser 3D)',
        payload: '10 kg',
        reach: '1.850 mm',
        accuracy: '±0.03 mm',
        desc: 'Pemotongan laser 3D presisi untuk plat logam otomotif, tabung profil rumit, dan kompartemen baterai dengan kontrol gas otomatis.',
      },
    ],
    en: [
      {
        id: 'welding',
        title: 'Robot Welding Series (Arc & Spot Welding)',
        payload: '20 kg',
        reach: '2,010 mm',
        accuracy: '±0.04 mm',
        desc: 'High-precision arc and spot welding for automotive chassis, steel enclosures, and structural assemblies with digital seam tracking.',
      },
      {
        id: 'handling',
        title: 'Robot Handling Series (Material Handling & Palletizing)',
        payload: '50 kg',
        reach: '2,200 mm',
        accuracy: '±0.05 mm',
        desc: 'High-speed heavy payload transfer, PCBA line conveyor integration, and automated packaging with custom pneumatic grippers.',
      },
      {
        id: 'cutting',
        title: 'Robot Cutting Series (3D Precision Fiber Laser)',
        payload: '10 kg',
        reach: '1,850 mm',
        accuracy: '±0.03 mm',
        desc: '3D robotic fiber laser trimming for automotive sheet metals, complex profiled tubes, and EV battery housings with dual assist-gas control.',
      },
    ],
  });

  // ─── 3. CONTROL ARCHITECTURE STATE ───
  const [archData, setArchData] = useState({
    id: {
      title: 'Arsitektur Kontrol Industri & Integrasi Cloud MES',
      subtitle: 'Semua sistem otomasi dan robotik terhubung secara terpusat untuk pemantauan OEE, telemetri real-time, dan ketertelusuran kualitas standar otomotif.',
      points: [
        { name: 'Konektivitas EtherCAT & PROFINET', detail: 'Sinkronisasi servo multi-sumbu dengan latensi sub-milidetik.' },
        { name: 'Pencatatan Data Cloud MES', detail: 'Ketertelusuran 100% parameter pengelasan, siklus waktu, dan serial unit.' },
        { name: 'Keamanan Fungsional Terpadu', detail: 'Sirkuit E-Stop ganda dan tirai cahaya keselamatan bersertifikasi ISO 13849.' },
      ],
    },
    en: {
      title: 'Industrial Control Architecture & Cloud MES Integration',
      subtitle: 'All robotic and automation systems connect into centralized plant networks for OEE monitoring, real-time telemetry, and automotive traceability.',
      points: [
        { name: 'EtherCAT & PROFINET Bus', detail: 'Multi-axis servo synchronization with sub-millisecond bus cycle times.' },
        { name: 'Cloud MES Data Logging', detail: '100% traceability for welding current, cycle durations, and unit serialization.' },
        { name: 'Integrated Functional Safety', detail: 'Dual-channel E-Stop loops and optical safety light curtains compliant with ISO 13849.' },
      ],
    },
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchAutomationSettings() {
      try {
        setLoading(true);
        const [headRes, modRes, archRes] = await Promise.allSettled([
          api.get('/public/site-settings/automation_header'),
          api.get('/public/site-settings/automation_models'),
          api.get('/public/site-settings/automation_architecture'),
        ]);

        if (isMounted) {
          const loadBilingual = (res, setter) => {
            if (res.status === 'fulfilled' && res.value.data?.data) {
              const d = res.value.data.data;
              if (d.id && d.en) {
                setter(d);
              } else if (d.id) {
                setter((prev) => ({ ...prev, id: d.id, en: d.en || prev.en }));
              }
            }
          };

          loadBilingual(headRes, setHeaderData);
          loadBilingual(modRes, setModelsData);
          loadBilingual(archRes, setArchData);
        }
      } catch (err) {
        addToast(extractErrorMessage(err), 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchAutomationSettings();
    return () => { isMounted = false; };
  }, [addToast]);

  const handleSaveSection = async (key, payload, name) => {
    setSavingKey(key);
    try {
      await api.put(`/admin/site-settings/${key}`, payload);
      addToast(`Bagian ${name} berhasil disimpan!`, 'success');
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
      updateState((prev) => ({
        ...prev,
        en: translatedEn,
      }));
      setSectionLang(sectionKey, 'en');
      addToast('Terjemahan selesai! Teks Bahasa Inggris telah terisi dan dapat Anda edit langsung.', 'success');
    } catch (err) {
      addToast('Gagal menerjemahkan: ' + extractErrorMessage(err), 'error');
    } finally {
      setTranslatingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="admin-spinner" style={{ width: 28, height: 28, margin: '0 auto 1rem' }} />
        <p style={{ color: '#94a3b8' }}>Memuat konfigurasi konten Otomasi & Robotik...</p>
      </div>
    );
  }

  const sectionsList = [
    { id: 'header', label: '1. Header & Ikhtisar Robotik', icon: Sliders },
    { id: 'models', label: '2. Seri Model Robot 6-Axis', icon: Bot },
    { id: 'architecture', label: '3. Arsitektur Kontrol & SCADA', icon: Network },
  ];

  const currentHeadLang = langMap.header;
  const currentHead = headerData[currentHeadLang] || headerData.id;

  const currentModLang = langMap.models;
  const currentMod = modelsData[currentModLang] || modelsData.id;

  const currentArchLang = langMap.architecture;
  const currentArch = archData[currentArchLang] || archData.id;

  return (
    <div className="admin-module">
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
          Manajemen Konten Halaman Otomasi & Robotik
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Kelola deskripsi kapabilitas sistem lengan robotik 6-axis, spesifikasi model welding/handling/cutting, dan arsitektur kontrol jaringan pabrik per section.
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

      {/* ── SECTION 1: HEADER & HIGHLIGHTS ── */}
      {activeSection === 'header' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 1: Header Halaman & Ikhtisar Robotik</h3>
              <p className="admin-card-subtitle">
                Atur judul header halaman robotik, narasi pengantar, dan poin sorotan kapabilitas.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'automation_header'}
              onClick={() => handleSaveSection('automation_header', headerData, 'Header Robotik')}
            >
              <Save size={16} />
              <span>{savingKey === 'automation_header' ? 'Menyimpan...' : 'Simpan Header'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentHeadLang}
            onSelectLang={(lang) => setSectionLang('header', lang)}
            onTranslate={() => handleAutoTranslate('header', headerData.id, setHeaderData)}
            isTranslating={translatingKey === 'header'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Judul Utama Halaman ({currentHeadLang.toUpperCase()})</label>
              <input
                type="text"
                className="admin-input"
                value={currentHead.title || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setHeaderData((prev) => ({
                    ...prev,
                    [currentHeadLang]: { ...prev[currentHeadLang], title: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Subjudul Penjelasan ({currentHeadLang.toUpperCase()})</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={currentHead.subtitle || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setHeaderData((prev) => ({
                    ...prev,
                    [currentHeadLang]: { ...prev[currentHeadLang], subtitle: val },
                  }));
                }}
              />
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', margin: '1.5rem 0 1rem' }}>
              3 Poin Sorotan Robotik
            </h4>
            <div className="admin-form-grid admin-form-grid-3">
              {currentHead.highlights?.map((hl, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid #1e293b',
                    borderRadius: 8,
                    padding: '1.15rem',
                  }}
                >
                  <div className="admin-form-group">
                    <label className="admin-label">Label Sorotan ({currentHeadLang.toUpperCase()})</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={hl.label || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHeaderData((prev) => {
                          const lang = currentHeadLang;
                          const copy = [...prev[lang].highlights];
                          copy[idx] = { ...copy[idx], label: val };
                          return { ...prev, [lang]: { ...prev[lang], highlights: copy } };
                        });
                      }}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Nilai / Deskripsi ({currentHeadLang.toUpperCase()})</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={hl.val || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHeaderData((prev) => {
                          const lang = currentHeadLang;
                          const copy = [...prev[lang].highlights];
                          copy[idx] = { ...copy[idx], val };
                          return { ...prev, [lang]: { ...prev[lang], highlights: copy } };
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 2: ROBOT MODELS ── */}
      {activeSection === 'models' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 2: Seri Model Robot 6-Axis</h3>
              <p className="admin-card-subtitle">
                Atur judul, muatan beban (payload), jangkauan lengan (reach), akurasi toleransi, dan deskripsi aplikasi untuk 3 model robot.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'automation_models'}
              onClick={() => handleSaveSection('automation_models', modelsData, 'Model Robot')}
            >
              <Save size={16} />
              <span>{savingKey === 'automation_models' ? 'Menyimpan...' : 'Simpan Model Robot'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentModLang}
            onSelectLang={(lang) => setSectionLang('models', lang)}
            onTranslate={() => handleAutoTranslate('models', modelsData.id, setModelsData)}
            isTranslating={translatingKey === 'models'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            {currentMod.map((model, idx) => (
              <div
                key={model.id || idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  padding: '1.25rem',
                  marginBottom: '1rem',
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2dd4bf', fontFamily: 'monospace' }}>
                  MODEL ID: {model.id}
                </span>
                <div className="admin-form-group" style={{ marginTop: '0.5rem' }}>
                  <label className="admin-label">Nama Seri Robot ({currentModLang.toUpperCase()})</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={model.title || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setModelsData((prev) => {
                        const lang = currentModLang;
                        const copy = [...prev[lang]];
                        copy[idx] = { ...copy[idx], title: val };
                        return { ...prev, [lang]: copy };
                      });
                    }}
                  />
                </div>

                <div className="admin-form-grid admin-form-grid-3">
                  <div className="admin-form-group">
                    <label className="admin-label">Payload Maksimal</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={model.payload || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setModelsData((prev) => {
                          const copyId = [...prev.id];
                          const copyEn = [...prev.en];
                          if (copyId[idx]) copyId[idx] = { ...copyId[idx], payload: val };
                          if (copyEn[idx]) copyEn[idx] = { ...copyEn[idx], payload: val };
                          return { id: copyId, en: copyEn };
                        });
                      }}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Jangkauan (Reach)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={model.reach || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setModelsData((prev) => {
                          const copyId = [...prev.id];
                          const copyEn = [...prev.en];
                          if (copyId[idx]) copyId[idx] = { ...copyId[idx], reach: val };
                          if (copyEn[idx]) copyEn[idx] = { ...copyEn[idx], reach: val };
                          return { id: copyId, en: copyEn };
                        });
                      }}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Akurasi Ulang</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={model.accuracy || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setModelsData((prev) => {
                          const copyId = [...prev.id];
                          const copyEn = [...prev.en];
                          if (copyId[idx]) copyId[idx] = { ...copyId[idx], accuracy: val };
                          if (copyEn[idx]) copyEn[idx] = { ...copyEn[idx], accuracy: val };
                          return { id: copyId, en: copyEn };
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Deskripsi Aplikasi ({currentModLang.toUpperCase()})</label>
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    value={model.desc || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setModelsData((prev) => {
                        const lang = currentModLang;
                        const copy = [...prev[lang]];
                        copy[idx] = { ...copy[idx], desc: val };
                        return { ...prev, [lang]: copy };
                      });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 3: ARCHITECTURE & SCADA ── */}
      {activeSection === 'architecture' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 3: Arsitektur Kontrol Industri & SCADA IoT</h3>
              <p className="admin-card-subtitle">
                Atur judul, pengantar arsitektur jaringan kontrol fieldbus (EtherCAT/PROFINET), dan 3 poin integrasi pabrik cerdas.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'automation_architecture'}
              onClick={() => handleSaveSection('automation_architecture', archData, 'Arsitektur Kontrol')}
            >
              <Save size={16} />
              <span>{savingKey === 'automation_architecture' ? 'Menyimpan...' : 'Simpan Arsitektur'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentArchLang}
            onSelectLang={(lang) => setSectionLang('architecture', lang)}
            onTranslate={() => handleAutoTranslate('architecture', archData.id, setArchData)}
            isTranslating={translatingKey === 'architecture'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Judul Arsitektur ({currentArchLang.toUpperCase()})</label>
              <input
                type="text"
                className="admin-input"
                value={currentArch.title || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setArchData((prev) => ({
                    ...prev,
                    [currentArchLang]: { ...prev[currentArchLang], title: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Subjudul Penjelasan ({currentArchLang.toUpperCase()})</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={currentArch.subtitle || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setArchData((prev) => ({
                    ...prev,
                    [currentArchLang]: { ...prev[currentArchLang], subtitle: val },
                  }));
                }}
              />
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', margin: '1.5rem 0 1rem' }}>
              3 Poin Integrasi Kontrol & Cloud MES
            </h4>
            <div className="admin-form-grid admin-form-grid-3">
              {currentArch.points?.map((pt, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid #1e293b',
                    borderRadius: 8,
                    padding: '1.15rem',
                  }}
                >
                  <div className="admin-form-group">
                    <label className="admin-label">Nama Fitur ({currentArchLang.toUpperCase()})</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={pt.name || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setArchData((prev) => {
                          const lang = currentArchLang;
                          const copy = [...prev[lang].points];
                          copy[idx] = { ...copy[idx], name: val };
                          return { ...prev, [lang]: { ...prev[lang], points: copy } };
                        });
                      }}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Deskripsi Detail ({currentArchLang.toUpperCase()})</label>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={pt.detail || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setArchData((prev) => {
                          const lang = currentArchLang;
                          const copy = [...prev[lang].points];
                          copy[idx] = { ...copy[idx], detail: val };
                          return { ...prev, [lang]: { ...prev[lang], points: copy } };
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
