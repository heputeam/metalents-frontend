import React from 'react';
import styles from './index.less';

import LikeSVG from './assets/like.svg';
import UnLikeSVG from './assets/unlike.svg';
import { IconButton } from '@mui/material';

export type ILikesProps = {
  size?: number;
  value?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
  icon?: string;
  id?: string;
  [key: string]: any;
};

const Likes: React.FC<ILikesProps> = ({
  value,
  onChange,
  size,
  className,
  icon,
  ...rest
}) => {
  const handleChange = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    onChange?.(!value);
  };
  return (
    <>
      <IconButton
        {...rest}
        disableRipple
        onClick={handleChange}
        className={`${styles['link-box']} ${className}`}
      >
        <img
          width={size}
          height={size}
          src={value ? LikeSVG : icon ? icon : UnLikeSVG}
          alt={value ? 'Like' : 'UnLike'}
        />
      </IconButton>
    </>
  );
};

export default Likes;

Likes.defaultProps = {
  value: false,
  size: 33,
};
