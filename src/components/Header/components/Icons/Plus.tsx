import { SvgIcon, SvgIconProps } from '@mui/material';

export const Plus: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 15 20">
      <path fill="currentColor" d="M10 0h5v5h-5zM0 10h15v5H0z" />
      <path fill="currentColor" d="M5 20V5h5v15z" />
    </SvgIcon>
  );
};
