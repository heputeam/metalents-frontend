import {
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
  SelectProps,
} from '@mui/material';
import { ReactComponent as CheckSVG } from '@/assets/imgs/account/profile/check.svg';
import DropDownIcon from '@/components/ProfileFormItem/DropDownIcon';
import { ReactNode } from 'react';

export type ISelectProps = {
  value: number | string;
  onChange: (
    event: SelectChangeEvent<string | number>,
    child: ReactNode,
  ) => void;
  options: { label: ReactNode; value: number | string }[];
};

const Select: React.FC<ISelectProps & SelectProps> = ({
  value,
  onChange,
  options,
  ...rest
}) => {
  return (
    <MuiSelect
      // open
      value={value}
      onChange={onChange}
      sx={{
        flex: 1,
        fontWeight: 500,
        borderRadius: '10px',
        '.MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          paddingTop: '12px',
          paddingBottom: '12px',
          paddingLeft: '10px',
          paddingRight: '15px',
          '#check': {
            display: 'none',
          },
        },
        '.MuiOutlinedInput-notchedOutline': {
          borderWidth: 0,
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.12)',
        },
        '&.Mui-focused fieldset.MuiOutlinedInput-notchedOutline': {
          borderWidth: '1px',
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
          borderWidth: '1.5px',
        },
      }}
      IconComponent={DropDownIcon}
      {...rest}
    >
      {options.map((option, index) => (
        <MenuItem
          key={`${option.value}_${index}`}
          sx={{
            fontWeight: 500,
            paddingLeft: '10px',
            paddingRight: '10px',
            '#check': { marginLeft: 'auto' },
            '&.Mui-selected': {
              backgroundColor: 'inherit',
            },
          }}
          value={option.value}
        >
          {option.label}
          {value === option.value && (
            <CheckSVG id="check" width={16} height={16} />
          )}
        </MenuItem>
      ))}
    </MuiSelect>
  );
};

export { Select };
