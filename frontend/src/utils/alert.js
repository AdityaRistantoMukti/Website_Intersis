import Swal from 'sweetalert2';

// Check whether current theme is dark
const isDarkMode = () => {
  return document.documentElement.getAttribute('data-theme') === 'dark';
};

// Custom SweetAlert2 Toast Mixin with Monochrome enterprise styling
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    popup: 'swal2-monochrome-toast',
    timerProgressBar: 'swal2-monochrome-progressbar',
  },
});

/**
 * Show an interactive Toast notification
 * @param {string} message - Notification text
 * @param {'success' | 'error' | 'warning' | 'info'} type - Toast type
 */
export const showToast = (message, type = 'success') => {
  const dark = isDarkMode();
  return Toast.fire({
    icon: type,
    title: message,
    background: dark ? '#18181b' : '#ffffff',
    color: dark ? '#f4f4f5' : '#09090b',
    iconColor: dark ? '#f4f4f5' : '#09090b',
  });
};

/**
 * Show an interactive Modal Alert
 * @param {object} options
 * @param {string} options.title - Alert title
 * @param {string} options.text - Alert description
 * @param {'success' | 'error' | 'warning' | 'info'} [options.icon='info'] - Icon type
 * @param {string} [options.confirmButtonText='OK'] - Confirm button label
 */
export const showAlert = ({
  title,
  text,
  icon = 'info',
  confirmButtonText = 'OK',
}) => {
  const dark = isDarkMode();
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    background: dark ? '#18181b' : '#ffffff',
    color: dark ? '#f4f4f5' : '#09090b',
    iconColor: dark ? '#f4f4f5' : '#09090b',
    confirmButtonColor: dark ? '#ffffff' : '#09090b',
    customClass: {
      popup: 'swal2-monochrome-modal',
      confirmButton: 'swal2-monochrome-confirm-btn',
      cancelButton: 'swal2-monochrome-cancel-btn',
    },
  });
};

/**
 * Show an interactive Confirmation Dialog
 * @param {object} options
 * @param {string} options.title - Dialog title
 * @param {string} options.text - Warning / detail message
 * @param {string} [options.confirmText='Ya, Lanjutkan'] - Confirm button label
 * @param {string} [options.cancelText='Batal'] - Cancel button label
 * @param {'warning' | 'question' | 'error' | 'info'} [options.icon='warning'] - Icon
 * @returns {Promise<boolean>} True if confirmed, false otherwise
 */
export const showConfirm = async ({
  title = 'Konfirmasi Tindakan',
  text = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  icon = 'warning',
}) => {
  const dark = isDarkMode();
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    focusCancel: true,
    background: dark ? '#18181b' : '#ffffff',
    color: dark ? '#f4f4f5' : '#09090b',
    iconColor: dark ? '#f4f4f5' : '#09090b',
    confirmButtonColor: dark ? '#ffffff' : '#09090b',
    cancelButtonColor: dark ? '#27272a' : '#e4e4e7',
    customClass: {
      popup: 'swal2-monochrome-modal',
      confirmButton: 'swal2-monochrome-confirm-btn',
      cancelButton: 'swal2-monochrome-cancel-btn',
    },
  });
  return Boolean(result.isConfirmed);
};

export default {
  Toast,
  showToast,
  showAlert,
  showConfirm,
};
