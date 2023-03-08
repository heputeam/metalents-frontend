import { FormControl, OutlinedInput } from '@mui/material';
import React from 'react';
import styles from './index.less';
import SuccessSVG from '@/assets/imgs/login/success.svg';
import ErrorSVG from '@/assets/imgs/login/error.svg';

{
  /* <FormItemControl
          label="Email"
          name="email"
          placeholder="Enter..."
          formik={formik}
        /> */
}
export type IFormItemControlProps = {
  label: string;
  name: string;
  require?: boolean;
  formik: any;
  placeholder: string;
};

const FormItemControl: React.FC<IFormItemControlProps> = ({
  label = 'Email',
  name,
  require = true,
  formik,
  placeholder,
}) => {
  return (
    <FormControl className={styles['form-control']}>
      <div className={styles['item-label']}>
        <label className={`${require ? styles['required'] : ''}`}>
          {label}
        </label>
      </div>
      <OutlinedInput
        name={name}
        value={formik.values.email}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder={placeholder}
        endAdornment={
          formik.touched[name] && !formik.errors[name] ? (
            <img src={SuccessSVG} alt="" width={26} />
          ) : formik.touched[name] && formik.errors[name] ? (
            <img src={ErrorSVG} alt="" width={26} />
          ) : null
        }
        classes={{
          root: styles['input-box'],
          focused: styles['input-focused'],
          notchedOutline: styles['notchedOutline'],
        }}
        className={`${
          formik.touched[name] && !formik.errors[name] ? styles['success'] : ''
        } ${
          formik.touched[name] && formik.errors[name] ? styles['error'] : ''
        }`}
      />
      <div className={styles['item-explain']}>
        {formik.touched[name] && formik.errors[name]}
      </div>
    </FormControl>
  );
};

export default FormItemControl;
