import React from 'react';
import styles from './index.less';
import SellerSVG from '@/assets/imgs/request/seller.svg';
import { history } from 'umi';
import Button from '@/components/Button';

export type INotSellerProps = {};

const NotSeller: React.FC<INotSellerProps> = ({}) => {
  const handleBecomeSeller = () => {
    history.push('/selling');
  };
  return (
    <div className={styles['not-seller-page']}>
      <img src={SellerSVG} alt="" />
      <div className={styles['tips']}>You need to become a seller first!</div>
      <div className={styles['sub-tips']}>
        This feature is only accessible for sellers. Fortunately, it is only 2
        clicks away!
      </div>
      <Button
        variant="contained"
        onClick={handleBecomeSeller}
        size="large"
        style={{ width: '240px', height: '48px', textTransform: 'none' }}
      >
        Become a seller
      </Button>
    </div>
  );
};

export default NotSeller;
