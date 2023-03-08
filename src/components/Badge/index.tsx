import React from 'react';
import { Box, Badge as MuiBadge, BadgeProps } from '@mui/material';
import styles from './index.less';

export interface IBadgeProps extends BadgeProps {
  content: number;
}

const Badge: React.FC<IBadgeProps> = ({ content, ...rest }) => {
  const notificationsLabel = (count: number) => {
    if (count === 0) {
      return 'no notifications';
    }
    if (count > 99) {
      return 'more than 99 notifications';
    }
    return `${count} notifications`;
  };
  return (
    <Box
      aria-label={notificationsLabel(content)}
      className={styles['badge-container']}
    >
      <MuiBadge badgeContent={content} color="error" {...rest}></MuiBadge>
    </Box>
  );
};

export default Badge;
