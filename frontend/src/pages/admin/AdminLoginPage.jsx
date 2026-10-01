import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { User, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, Shield, Briefcase, FileText } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './AdminLoginPage.css';

export default function AdminLoginPage() {
  const { login, isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identity, setIdentity] = useState('admin@isa.co.id');
  const [password, setPassword] = useState('Admin@ISA2026');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('session_expired')) {
      setFormError('Sesi login telah berakhir. Silakan login kembali.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!identity.trim() || !password.trim()) {
      setFormError('Email/username dan password wajib diisi.');
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
        <title>Login Admin — PT. Global Philsonic Technologies</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-login-container">
        {/* Header */}
        <div className="admin-login-header">
          <Link to="/" className="admin-login-logo-wrap">
            <img
              src="/images/logo_company.jpg"
              alt="GPT Logo"
              className="admin-login-logo-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="admin-login-logo-titles">
              <span className="admin-login-logo-brand">PT. GLOBAL PHILSONIC TECHNOLOGIES</span>
              <span className="admin-login-logo-sub">Batam FTZ &bull; Management Portal</span>
            </div>
          </Link>

          <div>
            <h1 className="admin-login-title">Admin Portal</h1>
            <p className="admin-login-desc">
              Kelola konten landing page, lowongan karir, galeri, dan kontak.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="admin-login-card">
          {formError && (
            <div className="admin-login-alert admin-login-alert--error" role="alert">
              <AlertCircle size={16} />
              <div>{formError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-input-group">
              <label className="admin-input-label" htmlFor="admin-identity">
                Email atau Username
              </label>
              <div className="admin-input-wrap">
                <span className="admin-input-icon">
                  <User size={16} />
                </span>
                <input
                  id="admin-identity"
                  type="text"
                  className="admin-input"
                  placeholder="admin@isa.co.id"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="admin-input-group">
              <label className="admin-input-label" htmlFor="admin-password">
                Password
              </label>
              <div className="admin-input-wrap">
                <span className="admin-input-icon">
                  <Lock size={16} />
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
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="admin-login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="admin-spinner" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk ke Portal</span>
              )}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="admin-quick-fill-section">
            <div className="admin-quick-fill-title">
              Pilih Akun Cepat (Development)
            </div>
            <div className="admin-quick-fill-chips">
              <button
                type="button"
                className="admin-quick-chip"
                onClick={() => handleQuickFill('admin@isa.co.id', 'Admin@ISA2026')}
              >
                <div>
                  <div className="admin-quick-chip__role">
                    <Shield size={14} color="#14b8a6" />
                    <span>Administrator</span>
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
                    <Briefcase size={14} color="#38bdf8" />
                    <span>HRD Manager</span>
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
                    <FileText size={14} color="#a855f7" />
                    <span>Staff Konten</span>
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
            <ArrowLeft size={14} />
            <span>Kembali ke Website Publik</span>
          </Link>
          <div>&copy; {new Date().getFullYear()} PT. Global Philsonic Technologies. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}
