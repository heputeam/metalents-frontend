import React from 'react';
import styles from './index.less';
import EmptyServiceSVG from '@/assets/imgs/seller/services/empty-service.svg';
import NavLink from '@/components/NavLink';
import { Typography } from '@mui/material';

export interface IEmptyService {
  depositStatus: string | undefined;
}

const EmptyService: React.FC<IEmptyService> = ({ depositStatus }) => {
  return (
    <div className={styles['empty-service']}>
      <img src={EmptyServiceSVG} />
      <Typography variant="body1" color="#000000">
        Your seller account is not yet displayed on the Marketplace&nbsp;
        <NavLink path="/seller/profile/edit" className={styles['link']}>
          Edit my profile &gt;
        </NavLink>
      </Typography>
      {/* {!depositStatus && (
        <Typography variant="body1" color="#000000">
          Pay the seller register deposit, and start to provide services on the
          marketplace now.&nbsp;
          <NavLink path="" className={styles['link']}>
            Deposit Now &gt;
          </NavLink>
        </Typography>
      )} */}
      {/* {depositStatus && (
        <Typography variant="body1" color="#000000">
          You have paid your seller register deposit.&nbsp;
          <NavLink path="" className={styles['link']}>
            Redeem the deposit &gt;
          </NavLink>
        </Typography>
      )} */}
      {depositStatus && (
        <Typography variant="body1" color="#000000">
          Start to&nbsp;
          <NavLink path="/seller/services/basic" className={styles['link']}>
            Create your first service &gt;
          </NavLink>
        </Typography>
      )}
    </div>
  );
};

export default EmptyService;
