import Swal from 'sweetalert2';

// Check whether current theme is dark
const isDarkMode = () =>
  document.documentElement.getAttribute('data-theme') === 'dark';

// Color palette per alert type (no glow, no badges - clean flat colors)
const ICON_COLORS = {
  success: '#22c55e', // clean green
  error:   '#ef4444', // clean red
  warning: '#f59e0b', // amber
  info:    '#3b82f6', // blue
  question:'#8b5cf6', // purple
};

const BORDER_COLORS = {
  success: '#16a34a',
  error:   '#dc2626',
  warning: '#d97706',
  info:    '#2563eb',
  question:'#7c3aed',
};

const PROGRESS_COLORS = {
  success: '#22c55e',
  error:   '#ef4444',
  warning: '#f59e0b',
  info:    '#3b82f6',
  question:'#8b5cf6',
};

/**
 * Build shared SweetAlert2 base config (theme-aware, color-coded)
 */
const baseConfig = (type) => {
  const dark = isDarkMode();
  return {
    background: dark ? '#1c1c1f' : '#ffffff',
    color:      dark ? '#f4f4f5' : '#18181b',
    iconColor:  ICON_COLORS[type] || '#3b82f6',
  };
};

// ─── Toast Mixin ──────────────────────────────────────────────────────────────
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (el) => {
    el.onmouseenter = Swal.stopTimer;
    el.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    popup: 'swal2-adm-toast',
  },
});

/**
 * Show an interactive Toast notification
 * @param {string} message
 * @param {'success' | 'error' | 'warning' | 'info'} type
 */
export const showToast = (message, type = 'success') => {
  const cfg = baseConfig(type);
  return Toast.fire({
    icon: type,
    title: message,
    background: cfg.background,
    color: cfg.color,
    iconColor: cfg.iconColor,
    didOpen: (el) => {
      // Color-code the progress bar per type
      const bar = el.querySelector('.swal2-timer-progress-bar');
      if (bar) bar.style.background = PROGRESS_COLORS[type] || '#3b82f6';
      // Color-code the left border accent
      el.style.borderLeftColor = BORDER_COLORS[type] || '#3b82f6';
    },
  });
};

/**
 * Show a modal alert dialog
 * @param {{ title, text, icon?, confirmButtonText? }} options
 */
export const showAlert = ({
  title,
  text,
  icon = 'info',
  confirmButtonText = 'OK',
}) => {
  const cfg = baseConfig(icon);
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    background: cfg.background,
    color:      cfg.color,
    iconColor:  cfg.iconColor,
    confirmButtonColor: ICON_COLORS[icon] || '#3b82f6',
    customClass: {
      popup:         'swal2-adm-modal',
      confirmButton: 'swal2-adm-confirm',
      cancelButton:  'swal2-adm-cancel',
    },
    didOpen: (el) => {
      el.style.borderTopColor = BORDER_COLORS[icon] || '#3b82f6';
    },
  });
};

/**
 * Show a confirmation dialog (for destructive / important actions)
 * @param {{ title?, text?, confirmText?, cancelText?, icon? }} options
 * @returns {Promise<boolean>}
 */
export const showConfirm = async ({
  title        = 'Konfirmasi Tindakan',
  text         = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText  = 'Ya, Lanjutkan',
  cancelText   = 'Batal',
  icon         = 'warning',
} = {}) => {
  const cfg = baseConfig(icon);
  const dark = isDarkMode();
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton:   true,
    confirmButtonText:  confirmText,
    cancelButtonText:   cancelText,
    reverseButtons:     true,
    focusCancel:        true,
    background:         cfg.background,
    color:              cfg.color,
    iconColor:          cfg.iconColor,
    confirmButtonColor: ICON_COLORS[icon] || '#f59e0b',
    cancelButtonColor:  dark ? '#3f3f46' : '#e4e4e7',
    customClass: {
      popup:         'swal2-adm-modal',
      confirmButton: 'swal2-adm-confirm',
      cancelButton:  'swal2-adm-cancel',
    },
    didOpen: (el) => {
      el.style.borderTopColor = BORDER_COLORS[icon] || '#f59e0b';
    },
  });
  return Boolean(result.isConfirmed);
};

export default { Toast, showToast, showAlert, showConfirm };
