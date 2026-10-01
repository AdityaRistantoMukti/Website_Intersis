import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  LayoutDashboard,
  Sliders,
  Building2,
  Phone,
  ShieldCheck,
  Image,
  Briefcase,
  FolderKanban,
  Gift,
  GraduationCap,
  HelpCircle,
  Users,
  FileText,
  LogOut,
  ExternalLink,
  Key,
  X,
  ChevronDown,
  User,
  Menu,
} from 'lucide-react';
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
        { key: 'overview', label: 'Ringkasan Portal', icon: LayoutDashboard },
      ],
    },
    {
      title: 'KONTEN LANDING PAGE BISNIS',
      items: [
        { key: 'home',        label: 'Beranda (Hero & Stats)', icon: Sliders },
        { key: 'company',     label: 'Profil & Tentang Kami',  icon: Building2 },
        { key: 'contact',     label: 'Kontak & Google Maps',   icon: Phone },
        { key: 'core-values', label: 'Nilai Inti Rekayasa',    icon: ShieldCheck },
        { key: 'gallery',     label: 'Galeri & Fasilitas',     icon: Image },
      ],
    },
    {
      title: 'KARIR & REKRUTMEN',
      items: [
        { key: 'jobs',       label: 'Lowongan Kerja',      icon: Briefcase },
        { key: 'categories', label: 'Kategori Departemen', icon: FolderKanban },
        { key: 'benefits',   label: 'Benefit Karyawan',    icon: Gift },
        { key: 'programs',   label: 'Program Magang / MT', icon: GraduationCap },
        { key: 'faqs',       label: 'Tanya Jawab (FAQ)',   icon: HelpCircle },
      ],
    },
    ...(isFullAdmin
      ? [
          {
            title: 'SISTEM & KEAMANAN',
            items: [
              { key: 'users', label: 'Pengguna Admin', icon: Users },
              { key: 'logs',  label: 'Log Audit Trail', icon: FileText },
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
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.key}>
                      <button
                        type="button"
                        className={`admin-nav-item-btn ${activeTab === item.key ? 'admin-nav-item-btn--active' : ''}`}
                        onClick={() => {
                          onSelectTab(item.key);
                          setMobileOpen(false);
                        }}
                      >
                        <span className="admin-nav-icon">
                          <Icon size={18} strokeWidth={2} />
                        </span>
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
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
            <LogOut size={16} strokeWidth={2} />
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
              <Menu size={20} strokeWidth={2} />
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
              <ExternalLink size={13} strokeWidth={2} />
            </a>

            {/* User Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="admin-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.825rem', gap: '8px', display: 'flex', alignItems: 'center' }}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <User size={15} strokeWidth={2} />
                <span>{user?.name?.split(' ')[0] || 'Admin'}</span>
                <ChevronDown size={14} strokeWidth={2} />
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
                    style={{ fontSize: '0.8rem', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setIsPassModalOpen(true);
                    }}
                  >
                    <Key size={14} strokeWidth={2} />
                    <span>Ganti Password</span>
                  </button>

                  <button
                    type="button"
                    className="admin-nav-item-btn"
                    style={{ fontSize: '0.8rem', padding: '6px 10px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={14} strokeWidth={2} />
                    <span>Keluar (Logout)</span>
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
              <h3 className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} strokeWidth={2} />
                <span>Ganti Password Akun</span>
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsPassModalOpen(false)}
              >
                <X size={16} strokeWidth={2} />
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
