import { Typography } from '@mui/material';
import React from 'react';
import styles from './index.less';
import NoServiceBgPNG from '@/assets/imgs/services/no-service-bg.png';

const NoServicesPackage: React.FC = () => {
  return (
    <div className={styles['no-services-container']}>
      <Typography classes={{ root: styles['str-service-packages'] }}>
        Service Packages
      </Typography>
      <img src={NoServiceBgPNG} />
      <Typography className={styles['info']}>
        This service is under renovation.
      </Typography>
      <Typography className={styles['info']}>
        Please come back later~
      </Typography>
    </div>
  );
};

export default NoServicesPackage;
