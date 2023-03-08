import React from 'react';
import styles from './index.less';
import RequestDisableSVG from '@/assets/imgs/request/request-disable.svg';
import { history } from 'umi';
import Button from '@/components/Button';
import BackIcon from '@/components/ProfileFormItem/BackIcon';

export type IRequestDisableProps = {};

const RequestDisable: React.FC<IRequestDisableProps> = ({}) => {
  const handleBack = () => {
    if (history?.length > 1) {
      history.goBack();
    } else {
      history.replace('/');
    }
  };
  return (
    <div className={styles['request-disable-page']}>
      <Button
        classes={{ root: styles['back-btn'] }}
        startIcon={<BackIcon />}
        onClick={handleBack}
      >
        Back
      </Button>

      <div className={styles['request-disable-content']}>
        <img src={RequestDisableSVG} alt="" />
        <div className={styles['tips']}>This request has been disabled!</div>
        <div className={styles['sub-tips']}>
          The detail page cannot be accessed now.
        </div>
      </div>
    </div>
  );
};

export default RequestDisable;
