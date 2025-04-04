import { toast, ToastOptions } from 'react-toastify';

function useToast() {
  const showSuccess = (message: string, options: ToastOptions = {}): void => {
    toast.success(message, {
      autoClose: 3000,
      ...options,
    });
  };

  const showError = (message: string, options: ToastOptions = {}): void => {
    toast.error(message, {
      autoClose: 3000,
      ...options,
    });
  };

  const showInfo = (message: string, options: ToastOptions = {}): void => {
    toast.info(message, {
      autoClose: 3000,
      ...options,
    });
  };

  const showWarning = (message: string, options: ToastOptions = {}): void => {
    toast.warn(message, {
      autoClose: 3000,
      ...options,
    });
  };

  return { showSuccess, showError, showInfo, showWarning };
}

export default useToast;
