import { Switch as MuiSwitch } from '@mui/material';

export type ISwitchProps = {
  value?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
  disabled?: boolean;
};

const Switch: React.FC<ISwitchProps> = ({
  value = false,
  onChange,
  className,
  disabled,
}) => {
  return (
    <MuiSwitch
      className={className}
      checked={!!value}
      disabled={disabled}
      onChange={(event) => {
        onChange?.(event.target.checked);
      }}
      sx={[
        {
          width: 83,
          height: 44,
          padding: 8,
          '& .MuiSwitch-track': {
            opacity: 'unset !important',
            background: 'rgba(201, 201, 201, 0.4)',
            borderRadius: 28 / 2,
            '&:before, &:after': {
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-51%)',
            },
          },
          '& .MuiSwitch-thumb': {
            boxShadow: 'none',
            width: 26,
            height: 26,
            color: '#fff',
          },
          '& .Mui-checked': {
            transform: 'translateX(39px) !important',

            '&+.MuiSwitch-track': {
              background: '#3AE090 !important',
            },
          },
        },
        value && {
          '& .MuiSwitch-track': {
            '&:before': {
              content: '"ON"',
              left: 15,
              color: '#fff',
            },
          },
        },
        !value && {
          '& .MuiSwitch-track': {
            '&:after': {
              content: '"OFF"',
              right: 15,
              color: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ]}
    />
  );
};

export default Switch;
