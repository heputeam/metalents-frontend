import React from 'react';
import { history, IWalletStateType, useSelector } from 'umi';
import styles from './index.less';
import { Typography } from '@mui/material';
import TransactionHistory from '@/components/Wallet/components/TransactionHistory';
import { ReactComponent as RightArrowSVG } from '@/assets/imgs/wallet/rightArrow.svg';
import SelectAddFundsDialog from '@/components/Wallet/components/SelectAddFundsDialog';
import TransferAddFundsDialog from '@/components/Wallet/components/TransferAddFundsDialog';
import WalletAddfundsDialog from '@/components/Wallet/components/WalletAddFundsDialog';
import WithdrawDialog from '@/components/Wallet/components/WithdrawDialog';
import AddFundsSuccess from '@/components/Wallet/components/AddFundsSuccess';
import SellerWalletBalance from '@/components/Wallet/components/SellerWalletBalance';
import { sellerTradeType } from '@/pages/account/wallet';
import Loading from '@/components/Loading';

export type IWalletProps = {};

const Wallet: React.FC<IWalletProps> = ({}) => {
  const { loading } = useSelector<any, IWalletStateType>(
    (state) => state.wallet,
  );
  return (
    <section className={styles['wallet-page']}>
      <div className={styles['balance-wrap']}>
        <div className={styles['balance-head']}>
          <h5>Wallet Balance</h5>
          <div
            className={styles['reward-enter']}
            onClick={() => history.push('/invite')}
          >
            <Typography variant="body2" sx={{ mr: 6 }}>
              View My WORK Rewards
            </Typography>
            <RightArrowSVG />
          </div>
        </div>
        {loading ? (
          <div className={styles['loading-box']}>
            <Loading className={styles['loading']} />
          </div>
        ) : (
          <SellerWalletBalance />
        )}
      </div>
      <div>
        <TransactionHistory transactionType={sellerTradeType} />
      </div>
      <SelectAddFundsDialog />
      <WalletAddfundsDialog />
      <TransferAddFundsDialog />
      <WithdrawDialog />
      <AddFundsSuccess />
    </section>
  );
};

export default Wallet;
