import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useBranding } from '../../context/BrandingContext';
import { getImageUrl } from '../../lib/api';
import {
  LayoutDashboard,
  Globe,
  Home,
  Sliders,
  Building2,
  Package,
  Cpu,
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
  Sun,
  Moon,
} from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout({ activeTab, onSelectTab, children }) {
  const { user, logout, changePassword, addToast } = useAdminAuth();
  const { branding } = useBranding();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Dark & Light Mode State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('gpt-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gpt-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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

  // Navigation Items Organized Per Page
  const navSections = [
    {
      title: 'UTAMA',
      items: [
        { key: 'overview', label: 'Ringkasan Portal', icon: LayoutDashboard },
        { key: 'branding', label: 'Logo & Favicon URL', icon: Globe },
      ],
    },
    {
      title: 'KONTEN PER HALAMAN (CMS)',
      items: [
        { key: 'home', label: 'Beranda (Home)', icon: Home },
        { key: 'about', label: 'Tentang Kami (About)', icon: Building2 },
        { key: 'products', label: 'Produk & Solusi', icon: Package },
        { key: 'automation', label: 'Otomasi & Robotik', icon: Cpu },
        { key: 'gallery', label: 'Galeri & Fasilitas', icon: Image },
        { key: 'career', label: 'Karir & Rekrutmen', icon: Briefcase },
        { key: 'contact', label: 'Kontak & Google Maps', icon: Phone },
      ],
    },
    ...(isFullAdmin
      ? [
          {
            title: 'SISTEM & KEAMANAN',
            items: [
              { key: 'users', label: 'Pengguna Admin', icon: Users },
              { key: 'logs', label: 'Log Audit Trail', icon: FileText },
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
      {/* Mobile Drawer Backdrop */}
      <div
        className={`admin-sidebar-backdrop ${mobileOpen ? 'admin-sidebar-backdrop--visible' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── SIDEBAR ── */}
      <aside className={`admin-sidebar ${mobileOpen ? 'admin-sidebar--open' : ''}`}>
        {/* Header */}
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-sidebar-logo" onClick={() => setMobileOpen(false)}>
            <img
              src={branding?.logo_url ? getImageUrl(branding.logo_url) : '/images/logo_company.jpg'}
              alt="Logo"
              className="admin-sidebar-logo-img"
              onError={(e) => { e.target.src = '/images/logo_company.jpg'; }}
            />
            <div>
              <div className="admin-sidebar-brand-name">PT GPT</div>
              <div className="admin-sidebar-brand-sub">Internal CMS</div>
            </div>
          </Link>
          <div className="admin-sidebar-header-right">
            <button
              type="button"
              className="admin-sidebar-close-btn"
              onClick={() => setMobileOpen(false)}
              aria-label="Tutup sidebar"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>
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
            {/* Dark & Light Theme Switcher */}
            <button
              type="button"
              className="admin-theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
              aria-label="Toggle dark/light mode"
            >
              {theme === 'dark' ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
              <span className="admin-theme-toggle-label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* Direct Link to Public Landing Page */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn-public-preview"
              title="Buka Website Publik di Tab Baru"
            >
              <span className="admin-preview-text">Lihat Website</span>
              <ExternalLink size={13} strokeWidth={2} />
            </a>

            {/* User Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="admin-btn-secondary admin-profile-btn"
                style={{ padding: '6px 12px', fontSize: '0.825rem', gap: '8px', display: 'flex', alignItems: 'center' }}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <User size={15} strokeWidth={2} />
                <span className="admin-profile-name">{user?.name?.split(' ')[0] || 'Admin'}</span>
                <ChevronDown size={14} strokeWidth={2} />
              </button>

              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '115%',
                    width: '210px',
                    background: 'var(--adm-card)',
                    border: '1.5px solid var(--adm-border-visible)',
                    borderRadius: '8px',
                    boxShadow: 'var(--adm-shadow)',
                    padding: '8px',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--adm-border)', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--adm-text)' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--adm-muted)' }}>{user?.email}</div>
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
