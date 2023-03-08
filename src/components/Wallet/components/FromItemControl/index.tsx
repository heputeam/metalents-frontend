import React, { ReactNode } from 'react';
import styles from './index.less';
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  OutlinedInput,
} from '@mui/material';
import DropDownIcon from '../DropDownIcon';
import CheckSVG from '@/assets/imgs/account/profile/check.svg';
import ChainLabel from '../ChainLabel';

export type IFromItemControlProps = {
  name: string;
  formik: any;
  options: { label: any; value: string | number }[];
  multiple?: boolean;
  renderValue?: (value: any) => ReactNode;
  width?: number | string;
  maxCount?: number;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (event: any) => void;
  formValue?: number | string;
  className?: string;
  type?: string;
};

const FromItemControl: React.FC<IFromItemControlProps> = ({
  name,
  formik,
  options,
  multiple,
  renderValue,
  width = '100%',
  maxCount,
  disabled = false,
  placeholder,
  onChange,
  formValue,
  className,
  type,
}) => {
  return (
    <div className={styles['form-item-control']}>
      <Select
        className={styles['select-box']}
        classes={{
          select: styles['select-root'],
          iconOutlined: styles['select-icon'],
        }}
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
              <ChainLabel
                value={Number(option.value)}
                label={option.label}
                type={type}
              />
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
    </div>
  );
};

export default FromItemControl;
