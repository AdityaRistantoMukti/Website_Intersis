import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './AdminLoginPage.css';

export default function AdminLoginPage() {
  const { login, isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identity, setIdentity] = useState('admin@isa.co.id');
  const [password, setPassword] = useState('Admin@ISA2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState('');

  // If already authenticated, redirect to /admin
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Check URL parameters for session expired alert
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('session_expired')) {
      setFormError('Sesi Anda telah berakhir. Silakan login kembali.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!identity.trim() || !password.trim()) {
      setFormError('Mohon isi email/username dan password.');
      return;
    }

    const res = await login(identity.trim(), password);
    if (res.success) {
      navigate('/admin', { replace: true });
    } else {
      setFormError(res.error || 'Autentikasi gagal. Periksa kembali akun Anda.');
    }
  };

  const handleQuickFill = (emailVal, passVal) => {
    setIdentity(emailVal);
    setPassword(passVal);
    setFormError('');
  };

  return (
    <div className="admin-login-wrapper">
      <Helmet>
        <title>Login Admin — PT. Intersis Sejahtera Abadi / PT. GPT</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Decorative Lights & Mesh */}
      <div className="admin-login-grid-bg" aria-hidden="true" />
      <div className="admin-login-glow-1" aria-hidden="true" />
      <div className="admin-login-glow-2" aria-hidden="true" />

      <div className="admin-login-container">
        {/* Header */}
        <div className="admin-login-header">
          <Link to="/" className="admin-login-logo-wrap">
            <img
              src="/images/logo_company.jpg"
              alt="Logo PT. Intersis Sejahtera Abadi"
              className="admin-login-logo-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="admin-login-logo-titles">
              <span className="admin-login-logo-brand">PT. INTERSIS</span>
              <span className="admin-login-logo-sub">SEJAHTERA ABADI &bull; GPT</span>
            </div>
          </Link>

          <div>
            <div className="admin-login-badge">
              <span className="admin-login-badge-dot" />
              <span>Internal CMS Portal</span>
            </div>
            <h1 className="admin-login-title">Portal Dashboard Admin</h1>
            <p className="admin-login-desc">
              Kelola teks, gambar fasilitas, lowongan kerja, dan profil publik.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="admin-login-card">
          {formError && (
            <div className="admin-login-alert admin-login-alert--error" role="alert">
              <span>⚠</span>
              <div>{formError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            {/* Identity */}
            <div className="admin-input-group">
              <label className="admin-input-label" htmlFor="admin-identity">
                <span>Username atau Email</span>
              </label>
              <div className="admin-input-wrap">
                <span className="admin-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="admin-identity"
                  type="text"
                  className="admin-input"
                  placeholder="admin@isa.co.id / username"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="admin-input-group">
              <label className="admin-input-label" htmlFor="admin-password">
                <span>Password Akun</span>
              </label>
              <div className="admin-input-wrap">
                <span className="admin-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="admin-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#94a3b8' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#2dd4bf', cursor: 'pointer' }}
                />
                <span>Ingat sesi saya</span>
              </label>
              <span style={{ color: '#64748b' }}>Port 3000 &bull; JWT 8 Jam</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="admin-login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="admin-spinner" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="admin-quick-fill-section">
            <div className="admin-quick-fill-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Akses Cepat Pengujian (Default Seeders)</span>
            </div>
            <div className="admin-quick-fill-chips">
              <button
                type="button"
                className="admin-quick-chip"
                onClick={() => handleQuickFill('admin@isa.co.id', 'Admin@ISA2026')}
              >
                <div>
                  <div className="admin-quick-chip__role">
                    <span>👑 Administrator (Full Akses)</span>
                  </div>
                  <div className="admin-quick-chip__email">admin@isa.co.id</div>
                </div>
                <span className="admin-quick-chip__badge">Pilih</span>
              </button>

              <button
                type="button"
                className="admin-quick-chip"
                onClick={() => handleQuickFill('hrd@isa.co.id', 'Hrd@ISA2026')}
              >
                <div>
                  <div className="admin-quick-chip__role">
                    <span>💼 HRD Manager</span>
                  </div>
                  <div className="admin-quick-chip__email">hrd@isa.co.id</div>
                </div>
                <span className="admin-quick-chip__badge">Pilih</span>
              </button>

              <button
                type="button"
                className="admin-quick-chip"
                onClick={() => handleQuickFill('staff.hrd@isa.co.id', 'Staff@ISA2026')}
              >
                <div>
                  <div className="admin-quick-chip__role">
                    <span>📝 Staf HRD / Konten</span>
                  </div>
                  <div className="admin-quick-chip__email">staff.hrd@isa.co.id</div>
                </div>
                <span className="admin-quick-chip__badge">Pilih</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="admin-login-footer">
          <Link to="/" className="admin-login-back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Kembali ke Halaman Publik Website Bisnis</span>
          </Link>
          <div>&copy; {new Date().getFullYear()} PT. Intersis Sejahtera Abadi. Seluruh hak cipta dilindungi.</div>
        </div>
      </div>
    </div>
  );
}
