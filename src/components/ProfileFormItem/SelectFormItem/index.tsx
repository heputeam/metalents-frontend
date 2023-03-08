import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  OutlinedInput,
} from '@mui/material';
import React, { ReactNode } from 'react';
import styles from './index.less';
import countries from 'i18n-iso-countries';
import english from 'i18n-iso-countries/langs/en.json';
import DropDownIcon from '../DropDownIcon';
import CheckSVG from '@/assets/imgs/account/profile/check.svg';

countries.registerLocale(english);

export type ISelectFormItemProps = {
  label: string;
  name: string;
  required?: boolean;
  formik: any;
  options: { label: any; value: string | number }[];
  multiple?: boolean;
  renderValue?: (value: any) => ReactNode;
  width?: number | string;
  maxCount?: number;
  extraLabel?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (event: any) => void;
  formValue?: number | string;
  className?: string;
};

const SelectFormItem: React.FC<ISelectFormItemProps> = ({
  label,
  name,
  required,
  formik,
  options,
  multiple,
  renderValue,
  width = '100%',
  maxCount,
  extraLabel,
  disabled = false,
  placeholder,
  onChange,
  formValue,
  className,
}) => {
  return (
    <FormControl
      error={!!formik.touched[name] && !!formik.errors[name]}
      sx={{ width }}
      className={`${styles['select-form-item']} ${className}`}
    >
      <label className={styles['form-label']}>
        {label}
        {required && (
          <Typography component="span" className={styles['required-mark']}>
            &nbsp;*
          </Typography>
        )}

        <Typography component="span" className={styles['required-mark']}>
          {extraLabel}
        </Typography>
      </label>

      <Select
        className={styles['select']}
        classes={{ iconOutlined: styles['select-icon'] }}
        name={name}
        value={formValue || formik.values[name]}
        onChange={(event) => {
          if (multiple && maxCount && event.target.value.length > maxCount) {
            return;
          }

          formik.handleChange(event);
          onChange?.(event);
        }}
        IconComponent={DropDownIcon}
        multiple={multiple}
        input={
          <OutlinedInput
            onBlur={formik.handleBlur}
            disabled={disabled}
            classes={{
              root: styles['input'],
              disabled: styles['input-disabled'],
            }}
          />
        }
        displayEmpty
        MenuProps={{
          sx: {
            width,
            marginTop: 20,
            '.MuiPaper-root': {
              maxHeight: 254,
              borderRadius: '10px',
              '-ms-overflow-style': 'none',
              scrollbarWidth: 'none',
            },
            '.MuiMenuItem-root': { paddingTop: 5, paddingBottom: 5 },
            '.MuiPaper-root::-webkit-scrollbar': {
              display: 'none',
            },
          },
        }}
        renderValue={(values) => {
          // console.log(name, values, typeof values);

          if (
            ((typeof values === 'string' || values instanceof Array) &&
              values?.length === 0) ||
            !values
          ) {
            return (
              <Typography
                sx={{
                  color: '#111111',
                  opacity: 0.3,
                }}
              >
                {placeholder}
              </Typography>
            );
          }

          if (renderValue) {
            return renderValue(values);
          }

          if (multiple) {
            const selectedOptions = options?.filter(
              (option) => values?.indexOf(option.value) > -1,
            );

            const selectedOptionsLabel = selectedOptions?.map(
              (selectedOption) => selectedOption.label,
            );

            return selectedOptionsLabel?.join(', ');
          } else {
            return options?.find((option) => values === option.value)?.label;
          }

          return values;
        }}
      >
        {options?.map((option) => (
          <MenuItem
            classes={{
              root: styles['menu-item'],
              selected: styles['select-item'],
            }}
            key={option.value}
            value={option.value}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {option.label}
            </span>
            {((multiple && formik.values[name]?.indexOf(option.value) > -1) ||
              (!multiple && formik.values[name] === option.value) ||
              (!multiple && formValue && formValue === option.value)) && (
              <img
                src={CheckSVG}
                alt=""
                className={styles['check-img']}
                style={{ marginLeft: 'auto' }}
              />
            )}
          </MenuItem>
        ))}
      </Select>

      <FormHelperText className={styles['helper-text']}>
        {formik.touched[name] && formik.errors[name]}
      </FormHelperText>
    </FormControl>
  );
};

export default SelectFormItem;
