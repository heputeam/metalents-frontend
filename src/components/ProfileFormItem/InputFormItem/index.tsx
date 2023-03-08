import {
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  Typography,
} from '@mui/material';
import React from 'react';
import CautionIcon from '../CautionIcon';
import styles from './index.less';

export type IInputFormItemProps = {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  formik: any;
  width?: number | string;
  maxLength?: number;
  disabled?: boolean;
  formValue?: number | string;
  errorKey?: string;
  onBlurFun?: (e?: any) => void;
  touchKey?: boolean;
};

const InputFormItem: React.FC<IInputFormItemProps> = ({
  label,
  name,
  placeholder,
  required,
  formik,
  width = '100%',
  maxLength,
  disabled = false,
  formValue,
  errorKey,
  onBlurFun,
  touchKey,
}) => {
  return (
    <FormControl
      error={
        errorKey && touchKey
          ? !!touchKey && !!errorKey
          : !!formik.touched[name] && !!formik.errors[name]
      }
      className={styles['input-form-control']}
      sx={{ width }}
    >
      <label htmlFor={`${name}-helper-text`} className={styles['form-label']}>
        {label}
        {required && (
          <Typography component="span" className={styles['required-mark']}>
            &nbsp;*
          </Typography>
        )}
      </label>

      <OutlinedInput
        classes={{ root: styles['input'], disabled: styles['input-disabled'] }}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        value={formValue || formik.values[name]}
        onChange={(event) => {
          if (!maxLength || event.target.value.length <= maxLength) {
            formik.handleChange(event);
          }
        }}
        onBlur={(e) => {
          onBlurFun?.(e);
          formik.handleBlur(e);
        }}
        endAdornment={
          !!formik.touched[name] &&
          !!formik.errors[name] && (
            <InputAdornment position="end">
              <CautionIcon sx={{ width: 26, height: 26 }} />
            </InputAdornment>
          )
        }
      />

      <FormHelperText
        id={`${name}-helper-text`}
        className={styles['helper-text']}
      >
        {errorKey && touchKey
          ? touchKey && errorKey
          : formik.touched[name] && formik.errors[name]}
      </FormHelperText>
    </FormControl>
  );
};

export default InputFormItem;
