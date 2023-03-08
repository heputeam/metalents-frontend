import React from 'react';
import styles from './index.less';
import NotQualifiedPNG from '@/pages/orders/assets/imgs/notQualified.png';
import { Typography } from '@mui/material';
import Button from '@/components/Button';
import { history } from 'umi';

const NotQualified: React.FC = () => {
  return (
    <div className={styles['not-qualified']}>
      <img src={NotQualifiedPNG} height={198} />
      <div className={styles['title']}>
        Sorry! You are not qualified to view this page!
      </div>
      <Typography className={styles['info']}>
        Please re-check your login information.
      </Typography>
      <Button
        variant="contained"
        className={styles['btn']}
        onClick={() => history.push('/')}
      >
        Homepage
      </Button>
    </div>
  );
};

export default NotQualified;
