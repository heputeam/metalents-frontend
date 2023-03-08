import {
  FormControl,
  FormHelperText,
  OutlinedInput,
  Typography,
} from '@mui/material';
import React from 'react';
import styles from './index.less';

export type ITextAreaFormItemProps = {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  formik: any;
  disabled?: boolean;
  maxLength?: number;
  minHeight?: string;
  className?: string;
};

const TextAreaFormItem: React.FC<ITextAreaFormItemProps> = ({
  label,
  name,
  placeholder,
  required,
  formik,
  disabled = false,
  maxLength = 600,
  minHeight = '147px',
  className,
}) => {
  return (
    <FormControl
      error={!!formik.touched[name] && !!formik.errors[name]}
      className={`${styles['textArea-form-control']} ${className}`}
      fullWidth
    >
      <label htmlFor="description-form-label" className={styles['form-label']}>
        {label}
        {required && (
          <Typography component="span" className={styles['required-mark']}>
            &nbsp;*
          </Typography>
        )}
      </label>

      <OutlinedInput
        className={styles['textArea']}
        classes={{
          root: styles['textArea'],
          disabled: styles['textArea-disabled'],
        }}
        placeholder={placeholder}
        multiline
        disabled={disabled}
        name={name}
        value={formik.values?.[name]}
        onChange={(event) => {
          if (event.target.value.length <= maxLength) {
            formik.handleChange(event);
          }
        }}
        onBlur={formik.handleBlur}
        inputProps={{ sx: { minHeight: minHeight } }}
      />

      <Typography variant="body2" className={styles['letter-counter']}>
        {`(${formik.values?.[name]?.length || 0}/${maxLength})`}
      </Typography>

      <FormHelperText
        id="description-helper-text"
        className={styles['helper-text']}
      >
        {formik.touched[name] && formik.errors[name]}
      </FormHelperText>
    </FormControl>
  );
};

export default TextAreaFormItem;
