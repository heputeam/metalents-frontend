import { LinearProgress, Typography } from '@mui/material';
import React from 'react';
import styles from './index.less';

interface IStarItem {
  label: string;
  value: number; // 1-100
  precent: number;
}

const StarItem: React.FC<IStarItem> = ({ value, precent, label }) => {
  return (
    <div className={styles['starItem-container']}>
      <Typography className={styles['prefix']}>{label}</Typography>

      <LinearProgress
        variant="determinate"
        value={precent}
        classes={{ root: styles['progress-root'], bar: styles['progress-bar'] }}
      />

      <Typography className={styles['after']}>({value})</Typography>
    </div>
  );
};

export default StarItem;
