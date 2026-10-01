import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { extractErrorMessage } from '../lib/api';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('isa_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('isa_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast notification manager
  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync token changes to headers
  useEffect(() => {
    if (token) {
      localStorage.setItem('isa_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('isa_token');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('isa_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('isa_user');
    }
  }, [user]);

  // Login handler
  const login = async (identity, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/admin/auth/login', { identity, password });
      const { token: receivedToken, user: receivedUser } = response.data?.data || {};

      if (!receivedToken || !receivedUser) {
        throw new Error('Respon login tidak valid dari server.');
      }

      setToken(receivedToken);
      setUser(receivedUser);
      addToast(`Selamat datang kembali, ${receivedUser.name}!`, 'success');
      return { success: true, user: receivedUser };
    } catch (err) {
      const msg = extractErrorMessage(err);
      addToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('isa_token');
    localStorage.removeItem('isa_user');
    addToast('Anda telah berhasil keluar (logout).', 'info');
  }, [addToast]);

  // Refresh profile
  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await api.get('/admin/auth/me');
      if (res.data?.data) {
        setUser(res.data.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await api.put('/admin/auth/change-password', { currentPassword, newPassword });
      addToast(res.data?.message || 'Password berhasil diperbarui.', 'success');
      return { success: true };
    } catch (err) {
      const msg = extractErrorMessage(err);
      addToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
    refreshProfile,
    changePassword,
    toasts,
    addToast,
    removeToast,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}

      {/* Global Admin Toast Floating Container */}
      <div className="admin-toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`admin-toast admin-toast--${toast.type}`}>
            <span className="admin-toast__icon">
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '✕'}
              {toast.type === 'warning' && '⚠'}
              {toast.type === 'info' && 'ℹ'}
            </span>
            <div className="admin-toast__message">{toast.message}</div>
            <button
              type="button"
              className="admin-toast__close"
              onClick={() => removeToast(toast.id)}
              aria-label="Tutup notifikasi"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
