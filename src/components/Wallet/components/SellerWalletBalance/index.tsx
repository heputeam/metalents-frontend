import Button from '@/components/Button';
import { IBalancesItem } from '@/service/wallet/types';
import { toThousands } from '@/utils';
import React from 'react';
import { IWalletStateType, useDispatch, useSelector } from 'umi';
import styles from './index.less';
import { WithdrawIcon } from '@/components/Icons/Withdraw';
import { IconButton, Tooltip } from '@mui/material';
import HelpIconSVG from '@/assets/imgs/wallet/helpIcon.svg';
import AddFundsSVG from '@/assets/imgs/wallet/addFunds.svg';

interface ICoinCard {
  balanceInfo: IBalancesItem;
}
const CoinCard: React.FC<ICoinCard> = ({ balanceInfo }) => {
  const { currency } = useSelector((state: any) => state.coins);
  return (
    <div
      className={`${styles['seller-coin-card']} ${
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
export type ISellerWalletBalanceProps = {};

const SellerWalletBalance: React.FC<ISellerWalletBalanceProps> = ({}) => {
  const { balances: balancesData } = useSelector<any, IWalletStateType>(
    (state) => state.wallet,
  );
  const dispatch = useDispatch();
  return (
    <div className={styles['balance-content']}>
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
            style={{ height: '36px', width: '180px', borderRadius: '18px' }}
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
      <div className={styles['income-stats-box']}>
        <div className={styles['title']}>Total Income</div>
        <div className={styles['total-income']}>
          {balancesData &&
            `$ ${toThousands(balancesData?.overview?.totalIncome, 2)}`}
        </div>
        <div className={styles['income-box']}>
          <div className={styles['income-item']}>
            <span className={styles['tit']}>Income in 7D</span>
            <span className={styles['amount']}>
              {balancesData &&
                `$ ${toThousands(balancesData?.overview?.weekIncome, 2)}`}
            </span>
          </div>
          {/* <div className={styles['income-item']}>
            <div className={styles['tit']}>
              <span>Freezed Income </span>
              <Tooltip
                title="Orders still in progress, expected earnings"
                arrow
                placement="top"
                classes={{
                  tooltip: styles['tooltip-box'],
                  arrow: styles['tooltip-arrow'],
                }}
              >
                <IconButton disableRipple sx={{ padding: 0, ml: '4px' }}>
                  <img src={HelpIconSVG} />
                </IconButton>
              </Tooltip>
            </div>
            <span className={styles['amount']}>
              {balancesData &&
                `$ ${toThousands(balancesData?.overview?.freezeIncome, 2)}`}
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SellerWalletBalance;
