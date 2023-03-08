import Button from '@/components/Button';
import React from 'react';
import {
  IUserState,
  IWalletStateType,
  useDispatch,
  useSelector,
  history,
} from 'umi';
import styles from './index.less';
import TransactionHistory from '@/components/Wallet/components/TransactionHistory';
import { IBalancesItem } from '@/service/wallet/types';
import { toThousands } from '@/utils';
import AddFundsSVG from '@/assets/imgs/wallet/addFunds.svg';
import { WithdrawIcon } from '@/components/Icons/Withdraw';
import SelectAddFundsDialog from '@/components/Wallet/components/SelectAddFundsDialog';
import TransferAddFundsDialog from '@/components/Wallet/components/TransferAddFundsDialog';
import WalletAddfundsDialog from '@/components/Wallet/components/WalletAddFundsDialog';
import WithdrawDialog from '@/components/Wallet/components/WithdrawDialog';
import AddFundsSuccess from '@/components/Wallet/components/AddFundsSuccess';
import { USER_TYPE } from '@/define';
import SellerWalletBalance from '@/components/Wallet/components/SellerWalletBalance';
import { Typography } from '@mui/material';
import { ReactComponent as RightArrowSVG } from '@/assets/imgs/wallet/rightArrow.svg';
import Loading from '@/components/Loading';

export const buyerTradeType = [
  {
    label: 'All types',
    value: -1,
    val: [8, 7, 3, 5],
  },
  {
    label: 'Withdraw',
    value: 8,
    val: [8],
  },
  {
    label: 'Add Funds',
    value: 7,
    val: [7],
  },
  {
    label: 'Order Payment',
    value: 3,
    val: [3],
  },
  {
    label: 'Order Refund',
    value: 5,
    val: [5],
  },
];

export const sellerTradeType = [
  {
    label: 'All types',
    value: -1,
    val: [],
  },
  {
    label: 'Withdraw',
    value: 8,
    val: [8],
  },
  {
    label: 'Add Funds',
    value: 7,
    val: [7],
  },
  {
    label: 'Order Payment',
    value: 3,
    val: [3],
  },
  {
    label: 'Order Refund',
    value: 5,
    val: [5],
  },
  {
    label: 'Order Income',
    value: 4,
    val: [4],
  },
  {
    label: 'Others',
    value: 0,
    val: [1, 2, 6, 9, 10, 11],
  },
];

interface ICoinCard {
  balanceInfo: IBalancesItem;
}
const CoinCard: React.FC<ICoinCard> = ({ balanceInfo }) => {
  const { currency } = useSelector((state: any) => state.coins);
  return (
    <div
      className={`${styles['coin-card']} ${
        styles[currency?.[balanceInfo?.coinId]?.name + '-sty']
      }`}
    >
      <div className={styles['coin-box']}>
        <span className={styles['coin-name']}>
          {currency?.[balanceInfo?.coinId]?.name}
        </span>
        <img src={currency?.[balanceInfo?.coinId]?.avatar} />
      </div>
      <div className={styles['balance']}>
        {toThousands(
          balanceInfo?.amount,
          currency?.[balanceInfo?.coinId]?.sysDecimals,
        )}
      </div>
    </div>
  );
};

export type IWalletProps = {};

const Wallet: React.FC<IWalletProps> = ({}) => {
  const { userInfo } = useSelector<any, IUserState>((state) => state?.user);
  const { balances: balancesData, loading } = useSelector<
    any,
    IWalletStateType
  >((state) => state.wallet);

  const dispatch = useDispatch();
  return (
    <section className={styles['wallet-page']}>
      <div className={styles['balance-wrap']}>
        <div className={styles['title-head']}>
          <h5>Wallet Balance</h5>
          {USER_TYPE.Seller === userInfo?.userType && (
            <div
              className={styles['reward-enter']}
              onClick={() => history.push('/invite')}
            >
              <Typography variant="body2" sx={{ mr: 6 }}>
                View My WORK Rewards
              </Typography>
              <RightArrowSVG />
            </div>
          )}
        </div>
        {loading ? (
          <div className={styles['loading-box']}>
            <Loading className={styles['loading']} />
          </div>
        ) : (
          <>
            {USER_TYPE.Seller === userInfo?.userType ? (
              <SellerWalletBalance />
            ) : (
              <div className={styles['coin-card-wrap']}>
                <div className={styles['coin-card-box']}>
                  {balancesData?.balances?.map((item) => {
                    return <CoinCard key={item.coinId} balanceInfo={item} />;
                  })}
                </div>
                <div className={styles['buttons-box']}>
                  <Button
                    rounded
                    variant="contained"
                    startIcon={<img src={AddFundsSVG} />}
                    style={{
                      marginRight: '10px',
                      height: '36px',
                      width: '180px',
                      borderRadius: '18px',
                    }}
                    onClick={() => {
                      dispatch({
                        type: 'dialog/show',
                        payload: { key: 'selectAddFundsDialog' },
                      });
                    }}
                  >
                    Add Funds
                  </Button>
                  <Button
                    className={styles['withdraw-btn']}
                    rounded
                    variant="outlined"
                    startIcon={<WithdrawIcon />}
                    style={{
                      height: '36px',
                      width: '180px',
                      borderRadius: '18px',
                    }}
                    onClick={() => {
                      dispatch({
                        type: 'dialog/show',
                        payload: { key: 'withdrawDialog' },
                      });
                    }}
                  >
                    Withdraw Funds
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div>
        <TransactionHistory
          transactionType={
            USER_TYPE.Seller === userInfo?.userType
              ? sellerTradeType
              : buyerTradeType
          }
        />
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
