import React, { FC, useState, useEffect } from 'react';
import {
  OutlinedInput,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  SxProps,
} from '@mui/material';
import styles from './index.less';
import DropDownIcon from '../DropDownIcon';
import CheckSVG from '@/assets/imgs/account/profile/check.svg';

export type ICurrencySelectProps = {
  options: any[];
  maxValue?: number | string;
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  menuValue: string | number;
  onMenuChange: (value: string | number) => void;
  inputSx?: SxProps;
  onBlurFun?: (e?: any) => void;
  chainNetwork: number | string;
};

const CurrencySelect: FC<ICurrencySelectProps> = ({
  maxValue,
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
  chainNetwork,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [chainNetwork]);

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
          root: styles['input-box'],
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
          <>
            {maxValue !== undefined && (
              <IconButton
                onClick={() => onInputChange(`${maxValue}`)}
                className={styles['max-btn']}
              >
                MAX
              </IconButton>
            )}
            <InputAdornment
              position="end"
              classes={{ root: styles['input-adornment'] }}
            >
              {menuValue ? options?.[selectedIndex]?.label : 'Select token'}
              <IconButton
                disabled={!menuValue || disabled}
                onClick={handleDropDownBtnClick}
                classes={{ root: styles['dropdown-btn'] }}
              >
                <DropDownIcon />
              </IconButton>
            </InputAdornment>
          </>
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
            key={option.id}
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

export default CurrencySelect;
