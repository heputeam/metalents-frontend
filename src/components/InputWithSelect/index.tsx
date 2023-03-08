import React, { FC, useState, ReactNode, useEffect } from 'react';
import {
  OutlinedInput,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  SxProps,
} from '@mui/material';
import styles from './index.less';
import DropDownIcon from '../ProfileFormItem/DropDownIcon';
import CheckSVG from '@/assets/imgs/account/profile/check.svg';

export type IInputWithSelectProps = {
  options: { label: ReactNode; value: string | number; id: number }[];
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  menuValue: string | number;
  onMenuChange: (value: string | number) => void;
  inputSx?: SxProps;
  onBlurFun?: (e?: any) => void;
};

const InputWithSelect: FC<IInputWithSelectProps> = ({
  inputSx,
  options,
  disabled,
  error,
  placeholder,
  inputValue,
  onInputChange,
  menuValue,
  onMenuChange,
  onBlurFun,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const defOptions = options.findIndex((option) => option.id === menuValue);
    setSelectedIndex(defOptions === -1 ? 0 : defOptions);
  }, [menuValue, options]);

  const handleDropDownBtnClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    onMenuChange(options?.[index]?.id);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <OutlinedInput
        sx={{ width: 417, height: 48, ...inputSx }}
        classes={{
          root: styles['input'],
          notchedOutline: styles['notchedOutline'],
          focused: styles['input-focused'],
          disabled: styles['input-disabled'],
        }}
        disabled={disabled}
        error={error}
        placeholder={placeholder}
        value={inputValue}
        onChange={(event) => {
          onInputChange(event.target.value);
        }}
        onBlur={onBlurFun}
        endAdornment={
          <InputAdornment
            position="end"
            classes={{ root: styles['input-adornment'] }}
          >
            {options?.[selectedIndex]?.label}
            <IconButton
              disabled={disabled}
              onClick={handleDropDownBtnClick}
              classes={{ root: styles['dropdown-btn'] }}
            >
              <DropDownIcon />
            </IconButton>
          </InputAdornment>
        }
      />

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{ paper: styles['menu-paper'] }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option.value}
            selected={index === selectedIndex}
            className={styles['menu-item']}
            onClick={(event) => {
              handleMenuItemClick(event, index);
            }}
            classes={{ selected: styles['menu-item-selected'] }}
          >
            {option?.label}
            {index === selectedIndex && (
              <img
                src={CheckSVG}
                alt="checked"
                className={styles['check-img']}
              />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default InputWithSelect;
