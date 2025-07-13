import Swal from 'sweetalert2';

// Custom styling for SweetAlert2
const customStyle = {
  background: 'rgba(0, 0, 0, 0.9)',
  backdropFilter: 'blur(20px)',
  color: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
};

// Custom button styling
const buttonStyle = {
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  borderRadius: '12px',
  color: '#ffffff',
  fontWeight: '600',
  padding: '12px 24px',
  fontSize: '14px',
};

const cancelButtonStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '12px',
  color: '#ffffff',
  fontWeight: '600',
  padding: '12px 24px',
  fontSize: '14px',
};

// Success Alert
export const showSuccessAlert = (title, message) => {
  return Swal.fire({
    title,
    text: message,
    icon: 'success',
    confirmButtonText: 'Great!',
    customClass: {
      popup: 'swal2-custom-popup',
      confirmButton: 'swal2-custom-confirm-button',
    },
    background: customStyle.background,
    backdropFilter: customStyle.backdropFilter,
    color: customStyle.color,
    border: customStyle.border,
    borderRadius: customStyle.borderRadius,
    confirmButtonColor: '#10b981',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
};

// Error Alert
export const showErrorAlert = (title, message) => {
  return Swal.fire({
    title,
    text: message,
    icon: 'error',
    confirmButtonText: 'Try Again',
    customClass: {
      popup: 'swal2-custom-popup',
      confirmButton: 'swal2-custom-confirm-button',
    },
    background: customStyle.background,
    backdropFilter: customStyle.backdropFilter,
    color: customStyle.color,
    border: customStyle.border,
    borderRadius: customStyle.borderRadius,
    confirmButtonColor: '#ef4444',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
};

// Warning Alert
export const showWarningAlert = (title, message) => {
  return Swal.fire({
    title,
    text: message,
    icon: 'warning',
    confirmButtonText: 'Continue',
    customClass: {
      popup: 'swal2-custom-popup',
      confirmButton: 'swal2-custom-confirm-button',
    },
    background: customStyle.background,
    backdropFilter: customStyle.backdropFilter,
    color: customStyle.color,
    border: customStyle.border,
    borderRadius: customStyle.borderRadius,
    confirmButtonColor: '#f59e0b',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
};

// Confirmation Alert
export const showConfirmAlert = (title, message, confirmText = 'Yes', cancelText = 'No') => {
  return Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      popup: 'swal2-custom-popup',
      confirmButton: 'swal2-custom-confirm-button',
      cancelButton: 'swal2-custom-cancel-button',
    },
    background: customStyle.background,
    backdropFilter: customStyle.backdropFilter,
    color: customStyle.color,
    border: customStyle.border,
    borderRadius: customStyle.borderRadius,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
};

// Loading Alert
export const showLoadingAlert = (title = 'Loading...') => {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
    customClass: {
      popup: 'swal2-custom-popup',
    },
    background: customStyle.background,
    backdropFilter: customStyle.backdropFilter,
    color: customStyle.color,
    border: customStyle.border,
    borderRadius: customStyle.borderRadius,
  });
};

// Close any open alert
export const closeAlert = () => {
  Swal.close();
};

// Custom input alert
export const showInputAlert = (title, inputPlaceholder, inputType = 'text') => {
  return Swal.fire({
    title,
    input: inputType,
    inputPlaceholder,
    inputAttributes: {
      'aria-label': inputPlaceholder,
      'aria-describedby': 'swal2-input'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Cancel',
    customClass: {
      popup: 'swal2-custom-popup',
      confirmButton: 'swal2-custom-confirm-button',
      cancelButton: 'swal2-custom-cancel-button',
      input: 'swal2-custom-input',
    },
    background: customStyle.background,
    backdropFilter: customStyle.backdropFilter,
    color: customStyle.color,
    border: customStyle.border,
    borderRadius: customStyle.borderRadius,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    },
    inputValidator: (value) => {
      if (!value) {
        return 'You need to write something!';
      }
    }
  });
}; 