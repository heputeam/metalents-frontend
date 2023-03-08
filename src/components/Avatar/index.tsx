import React from 'react';
import { Avatar as MuiAvatar } from '@mui/material';

export type IAvatarProps = {
  size?: number;
  height?: number;
  src?: string;
  bgcolor?: string;
  sx?: any;
  className?: string;
  variant?: any;
  onClick?: (e: any) => void;
};

const Avatar: React.FC<IAvatarProps> = ({
  children,
  size = 48,
  height,
  src,
  bgcolor,
  sx,
  variant,
  ...rest
}) => {
  return (
    <MuiAvatar
      variant={variant}
      src={src}
      sx={{
        ...sx,
        bgcolor: src ? '#FFFFFF' : '#AAE5FF',
        width: size,
        height: height || size,
        boxShadow: src && '3.77112px 3.77112px 13.1989px rgba(0, 0, 0, 0.1)',
      }}
      {...rest}
    >
      {children}
    </MuiAvatar>
  );
};

export default Avatar;
