import React from 'react';
import { toast, ToastOptions } from 'react-toastify';
import styles from './index.less';

import SuccessSVG from './assets/success.svg';
import WarnSVG from './assets/warn.svg';
import ErrorSVG from './assets/error.svg';

//api: https://fkhadra.github.io/react-toastify/introduction
const config: ToastOptions = {
  autoClose: 3500, // 自动关闭时间,false 永久不关闭
  closeButton: false, // 关闭按钮
  closeOnClick: false,
  hideProgressBar: true,
  position: 'top-center',
};

export const Toast = {
  removeAll: () => toast.dismiss(),
  success: (msg: React.ReactNode, options?: ToastOptions) => {
    const extra = {
      icon:
        typeof msg === 'string' ? (
          <img src={SuccessSVG} alt="success" />
        ) : (
          false
        ),
    };

    return toast.success(msg, {
      ...config,
      ...options,
      ...extra,
      className: `${styles['toast-root']} ${styles['toast-success']}`,
    });
  },
  warn: (msg: React.ReactNode, options?: ToastOptions) => {
    const extra = {
      icon:
        typeof msg === 'string' ? <img src={WarnSVG} alt="success" /> : false,
    };
    return toast.warn(msg, {
      ...config,
      ...options,
      ...extra,
      className: `${styles['toast-root']} ${styles['toast-warn']}`,
    });
  },

  error: (msg: React.ReactNode, options?: ToastOptions) => {
    const extra = {
      icon:
        typeof msg === 'string' ? <img src={ErrorSVG} alt="success" /> : false,
    };
    return toast.error(msg, {
      ...config,
      ...options,
      ...extra,
      className: `${styles['toast-root']} ${styles['toast-error']}`,
    });
  },
};

export default Toast;
