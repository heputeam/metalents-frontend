import Button from '@/components/Button';
import BackIcon from '@/components/ProfileFormItem/BackIcon';
import React from 'react';
import { history } from 'umi';
import styles from './index.less';
import ServicesDisabledPNG from '@/assets/imgs/services/disabled-bg.png';

const ServiceDisabledPage: React.FC = () => {
  const handleBack = () => {
    if (history?.length > 1) {
      history.goBack();
    } else {
      history.replace('/');
    }
  };
  return (
    <div className={styles['service-disable-page']}>
      <Button
        classes={{ root: styles['back-btn'] }}
        startIcon={<BackIcon />}
        onClick={handleBack}
      >
        Back
      </Button>

      <div className={styles['service-disable-content']}>
        <img src={ServicesDisabledPNG} alt="" />
        <div className={styles['tips']}>This service has been disabled!</div>
        <div className={styles['sub-tips']}>
          The detail page cannot be accessed now.
        </div>
      </div>
    </div>
  );
};

export default ServiceDisabledPage;
