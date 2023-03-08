import React, { useState } from 'react';
import styles from './index.less';
import SuccessSVG from '@/assets/imgs/login/success.svg';
import ErrorSVG from '@/assets/imgs/login/error.svg';

export type IFormItemProps = {
  label: string;
  children: React.ReactNode;
  name: string;
  require?: boolean;
  formik: any;
  validSuccess?: boolean;
};

const FormItem: React.FC<IFormItemProps> = ({
  label,
  children,
  name,
  require = true,
  formik,
  validSuccess = true,
}) => {
  const touched = formik.touched[name];
  const error = formik.errors[name];
  return (
    <div className={styles['form-item']}>
      <div className={styles['item-label']}>
        <label className={`${require ? styles['required'] : ''}`}>
          {label}
        </label>
      </div>
      <div
        className={`${styles['item-control']} ${
          !touched && styles['item-control-hov']
        } ${validSuccess && touched && !error ? styles['success'] : ''} ${
          touched && error ? styles['error'] : ''
        }`}
      >
        {children}
        {validSuccess && touched && !error ? (
          <img src={SuccessSVG} alt="" />
        ) : null}
        {touched && error ? <img src={ErrorSVG} alt="" /> : null}
      </div>
      <div className={styles['item-explain']}>{touched && error}</div>
    </div>
  );
};

export default FormItem;
