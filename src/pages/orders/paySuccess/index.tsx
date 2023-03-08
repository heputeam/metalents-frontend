import React from 'react';
import styles from './index.less';
import PaySuccessSVG from '../assets/imgs/paysuccess.svg';
import Button from '@/components/Button';
import { Container } from '@mui/material';
import { history, useLocation } from 'umi';

export type IPaySuccessProps = {};

const PaySuccess: React.FC<IPaySuccessProps> = ({}) => {
  const { query }: any = useLocation();
  return (
    <Container maxWidth="lg">
      <div className={styles['paysuccess-page']}>
        <div className={styles['img-box']}>
          <img src={PaySuccessSVG} alt="" />
        </div>

        <div className={styles['title']}>
          The order has been successfully paid!
        </div>
        <div className={styles['sub-title']}>
          You can manage all orders on “My Orders”. More communication with
          seller is helpful to improve the services.
        </div>
        <div className={styles['buttons-box']}>
          <Button
            variant="outlined"
            size="large"
            style={{ width: 240 }}
            onClick={() => history.push('/')}
          >
            To Homepage
          </Button>
          <Button
            variant="contained"
            size="large"
            style={{ width: 240 }}
            onClick={() => history.push(`/orders/details?id=${query?.orderId}`)}
          >
            Order Details
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default PaySuccess;
