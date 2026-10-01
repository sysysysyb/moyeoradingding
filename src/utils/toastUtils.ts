import { type FieldErrors, type FieldValues } from 'react-hook-form';
import { toast, type ToastOptions } from 'react-toastify';

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    autoClose: 2000,
    hideProgressBar: false,
    position: 'top-right',
    closeOnClick: true,
    theme: 'light',
    ...options,
  });
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    autoClose: 2000,
    hideProgressBar: false,
    position: 'top-right',
    closeOnClick: true,
    theme: 'light',
    ...options,
  });
};

export const toastFormErrors = <T extends FieldValues>(
  errors: FieldErrors<T>,
) => {
  Object.values(errors).forEach(error => {
    if (typeof error?.message === 'string') {
      showErrorToast(error.message);
    }
  });
};
