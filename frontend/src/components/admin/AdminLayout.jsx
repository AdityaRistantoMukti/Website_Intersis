import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './AdminLayout.css';

export default function AdminLayout({ activeTab, onSelectTab, children }) {
  const { user, logout, changePassword, addToast } = useAdminAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Change Password Modal
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passSubmitting, setPassSubmitting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast('Password baru minimal 6 karakter.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('Konfirmasi password tidak cocok.', 'error');
      return;
    }

    setPassSubmitting(true);
    const res = await changePassword(currentPassword, newPassword);
    setPassSubmitting(false);

    if (res.success) {
      setIsPassModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const isFullAdmin = user?.role === 'administrator' || user?.role === 'hrd';

  // Navigation Items
  const navSections = [
    {
      title: 'UTAMA',
      items: [
        { key: 'overview', label: 'Ringkasan Portal', icon: '📊' },
      ],
    },
    {
      title: 'KONTEN LANDING PAGE BISNIS',
      items: [
        { key: 'company',     label: 'Profil & Hero Utama', icon: '🏢' },
        { key: 'contact',     label: 'Kontak & WhatsApp',   icon: '📞' },
        { key: 'core-values', label: 'Nilai Inti Rekayasa',  icon: '💎' },
        { key: 'gallery',     label: 'Galeri & Fasilitas',  icon: '🖼️' },
      ],
    },
    {
      title: 'KARIR & REKRUTMEN',
      items: [
        { key: 'jobs',       label: 'Lowongan Kerja',      icon: '💼' },
        { key: 'categories', label: 'Kategori Departemen', icon: '📂' },
        { key: 'benefits',   label: 'Benefit Karyawan',    icon: '🎁' },
        { key: 'programs',   label: 'Program Magang / MT', icon: '🎓' },
        { key: 'faqs',       label: 'Tanya Jawab (FAQ)',   icon: '❓' },
      ],
    },
    ...(isFullAdmin
      ? [
          {
            title: 'SISTEM & KEAMANAN',
            items: [
              { key: 'users', label: 'Pengguna Admin', icon: '👥' },
              { key: 'logs',  label: 'Log Audit Trail', icon: '📜' },
            ],
          },
        ]
      : []),
  ];

  const getPageTitle = () => {
    for (const sec of navSections) {
      const match = sec.items.find((i) => i.key === activeTab);
      if (match) return match.label;
    }
    return 'Dashboard Admin';
  };

  return (
    <div className="admin-shell">
      {/* ── SIDEBAR ── */}
      <aside className={`admin-sidebar ${mobileOpen ? 'admin-sidebar--open' : ''}`}>
        {/* Header */}
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-sidebar-logo">
            <img
              src="/images/logo_company.jpg"
              alt="Logo"
              className="admin-sidebar-logo-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <div className="admin-sidebar-brand-name">PT. INTERSIS</div>
              <div className="admin-sidebar-brand-sub">GPT &bull; Internal CMS</div>
            </div>
          </Link>
          <span className="admin-sidebar-version">v1.0</span>
        </div>

        {/* Nav Sections */}
        <nav className="admin-sidebar-nav">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="admin-nav-group">
              <div className="admin-nav-group-title">{section.title}</div>
              <ul className="admin-nav-list">
                {section.items.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      className={`admin-nav-item-btn ${activeTab === item.key ? 'admin-nav-item-btn--active' : ''}`}
                      onClick={() => {
                        onSelectTab(item.key);
                        setMobileOpen(false);
                      }}
                    >
                      <span className="admin-nav-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-summary">
            <div className="admin-user-avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="admin-user-meta">
              <span className="admin-user-name" title={user?.name}>{user?.name || 'Administrator'}</span>
              <span className="admin-user-role">{user?.role || 'administrator'}</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-btn-logout-icon"
            onClick={handleLogout}
            title="Keluar (Logout)"
            aria-label="Logout"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ── MAIN WRAPPER ── */}
      <div className="admin-main-wrap">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle sidebar"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <h1 className="admin-header-title">
              <span>{getPageTitle()}</span>
            </h1>
          </div>

          <div className="admin-header-right">
            {/* Server Online Badge */}
            <span className="admin-status-indicator" title="Backend Express connected on port 3000">
              <span className="admin-status-dot" />
              <span>Backend API Aktif</span>
            </span>

            {/* Direct Link to Public Landing Page */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn-public-preview"
              title="Buka Website Publik di Tab Baru"
            >
              <span>Lihat Website</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>

            {/* User Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="admin-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.825rem', gap: '8px' }}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <span>👤 {user?.name?.split(' ')[0] || 'Admin'}</span>
                <span style={{ fontSize: '0.7rem' }}>▼</span>
              </button>

              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '115%',
                    width: '210px',
                    background: '#0b1320',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                    padding: '8px',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ padding: '6px 10px', borderBottom: '1px solid #1e293b', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{user?.email}</div>
                  </div>

                  <button
                    type="button"
                    className="admin-nav-item-btn"
                    style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setIsPassModalOpen(true);
                    }}
                  >
                    <span>🔑 Ganti Password</span>
                  </button>

                  <button
                    type="button"
                    className="admin-nav-item-btn"
                    style={{ fontSize: '0.8rem', padding: '6px 10px', color: '#f87171' }}
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    <span>🚪 Keluar (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="admin-body">
          {children}
        </main>
      </div>

      {/* Change Password Modal */}
      {isPassModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsPassModalOpen(false)}>
          <div className="admin-modal-box" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">🔑 Ganti Password Akun</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsPassModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-label">Password Saat Ini</label>
                  <input
                    type="password"
                    className="admin-text-input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Password Baru (Min. 6 Karakter)</label>
                  <input
                    type="password"
                    className="admin-text-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    className="admin-text-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setIsPassModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  disabled={passSubmitting}
                >
                  {passSubmitting ? 'Memperbarui...' : 'Perbarui Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
