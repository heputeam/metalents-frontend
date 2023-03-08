import { Container, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Tooltip from '../components/Tooltip';
import styles from './index.less';
import { ReactComponent as QuoteSVG } from '../assets/quote.svg';
import {
  getConfigItem,
  getCurrentToken,
  getTokenSysDecimals,
  toThousands,
} from '@/utils';
import Button from '@/components/Button';
import { ICardInfo } from '..';
import InviteInfoCard from '../components/InviteInfoCard';
import RewardPNG from '../assets/reward.png';
import RewardDetailTable from '../components/RewardDetailTable';
import { useDispatch, useSelector } from 'umi';
import { useRequest } from 'ahooks';
import {
  IActivityConfigItem,
  IDashboard,
  IWithdraw,
} from '@/service/invite/type';
import { getActivityDashboard, postActivityWithdraw } from '@/service/invite';
import { IResponse } from '@/service/types';
import { useGetActivity, useGetActivityConfig } from '@/hooks/useActivity';
import BigNumber from 'bignumber.js';
import Toast from '@/components/Toast';
import EndPersonPNG from '../assets/end-person.png';
import WaterMarkPNG from '../assets/watermark.png';

const InviteEnd: React.FC = () => {
  const applyDisable = true;
  const { uid } = useSelector((state: any) => state.user);
  const { data: dashboardInfo, run: getDashboard } = useRequest<
    IResponse<IDashboard>,
    any
  >(() => getActivityDashboard(), {
    manual: true,
    onSuccess: (res: any) => {},
  });

  const { activityData } = useGetActivity({ title: ['registration'] });
  const [activityId, setActivityId] = useState<number>();
  const { configData } = useGetActivityConfig(activityId);

  const getSellerOrderDoneVal = () => {
    const temp = configData?.filter(
      (item: IActivityConfigItem) =>
        item?.status === 'enable' && item?.cfgName === 'SellerOrderDone',
    );
    return Number(temp?.[0]?.cfgVal);
  };

  useEffect(() => {
    if (activityData && activityData?.total > 0) {
      setActivityId(activityData?.list?.[0]?.id);
    }
  }, [activityData]);
  useEffect(() => {
    if (uid) {
      getDashboard();
    }
  }, [uid]);

  const getConfigItemVal = (name: string) => {
    return Number(getConfigItem(configData, activityId, name)?.cfgVal);
  };

  const cardInfo: ICardInfo[] = [
    {
      title: 'Total Rewards',
      value: (
        <div className={styles['num']}>
          {toThousands(dashboardInfo?.data?.totalPoints || 0)} <span>WORK</span>
        </div>
      ),
      tooltip: 'The total amount of WORK rewards you have received.',
    },
    {
      title: 'Your orders completed',
      value: (
        <div className={styles['num']}>
          {toThousands(dashboardInfo?.data?.completedOrder || 0)}
        </div>
      ),
      tooltip: `First you need to get verified. Then, you can get $${
        getConfigItemVal('FirstOrderPoint') || 0
      } for the first completed order and an extra ${
        getSellerOrderDoneVal() || 0
      }% reward for each completed order.`,
    },
    {
      title: 'To increase ranking',
      value: (
        <div className={styles['num']}>
          ??&nbsp;
          <span>WORK/service/day</span>
        </div>
      ),
      extra: (
        <div className={styles['apply-box']}>
          <Button
            variant="contained"
            disabled={applyDisable}
            className={styles['apply-btn']}
          >
            Apply
          </Button>
          {applyDisable && (
            <div className={styles['coming-soon']}>Coming soon</div>
          )}
        </div>
      ),
    },
    {
      title: 'To purchase Ad spot',
      value: (
        <div className={styles['num']}>
          ??&nbsp;
          <span>WORK/spot/day</span>
        </div>
      ),
      extra: (
        <div className={styles['apply-box']}>
          <Button
            variant="contained"
            disabled={applyDisable}
            className={styles['apply-btn']}
          >
            Apply
          </Button>
          {applyDisable && (
            <div className={styles['coming-soon']}>Coming soon</div>
          )}
        </div>
      ),
    },
  ];

  const { tokens } = useSelector((state: any) => state.coins);
  const [workPrice, setWorkPrice] = useState<number>(0);

  useEffect(() => {
    if (tokens) {
      const auctionPrice = Number(getCurrentToken(3, tokens)?.price);
      const tempPrice = new BigNumber(1).dividedBy(auctionPrice).toNumber();
      setWorkPrice(Number(tempPrice.toFixed(getTokenSysDecimals(3, tokens))));
    }
  }, [tokens]);
  const dispatch = useDispatch();

  const {
    data: withdrawData,
    loading: withdrawLoading,
    run: postWithdraw,
  } = useRequest<IResponse<IWithdraw>, any>(() => postActivityWithdraw(), {
    manual: true,
    onSuccess: (res: any) => {
      const { code, data } = res;
      if (code === 200 && data?.success) {
        dispatch({
          type: 'wallet/queryBalances',
        });
        Toast.success(
          `Successfully claimed ${toThousands(
            new BigNumber(Math.abs(data?.points))
              .multipliedBy(1 / Number(data?.coinPrice))
              .toNumber(),
            2,
          )} AUCTION !`,
        );
        getDashboard();
      }
    },
  });

  const handleClaim = () => {
    return Toast.warn('New features coming soon.');
    postWithdraw();
  };

  return (
    <div className={styles['invite-end']}>
      <div className={styles['part-1']}>
        <Container disableGutters maxWidth="lg">
          <div className={styles['text-box']}>
            <div className={styles['banner-content']}>
              <Stack direction="row" alignItems="center">
                <Typography variant="body1" className={styles['reward']}>
                  Your available rewards
                </Typography>
                <Tooltip
                  title={
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Rewards that can be claimed. 1WORK is worth 1 USD. The
                      Claim operation will convert this reward into AUCTION and
                      withdraw it to your platform balance (in the current
                      exchange rate).
                    </Typography>
                  }
                  arrow
                  placement="top"
                  className={styles['tooltip-content']}
                >
                  <QuoteSVG width={20} height={20} />
                </Tooltip>
              </Stack>
              <div className={styles['reward-work']}>
                {toThousands(dashboardInfo?.data?.availablePoints || 0)}
                &nbsp;WORK
              </div>
              <div className={styles['reward-aution']}>
                ={' '}
                {toThousands(
                  new BigNumber(dashboardInfo?.data?.availablePoints || 0)
                    .multipliedBy(workPrice)
                    .toNumber(),
                  2,
                )}{' '}
                AUCTION
              </div>
              <Button
                variant="contained"
                size="large"
                className={styles['claim-btn']}
                disabled={
                  !uid || Number(dashboardInfo?.data?.availablePoints) === 0
                }
                onClick={handleClaim}
                loading={withdrawLoading}
              >
                Claim
              </Button>
            </div>
            <img src={WaterMarkPNG} className={styles['watermark']} />
            <img src={EndPersonPNG} className={styles['person']} />
          </div>
        </Container>
      </div>
      <div className={styles['part-2']}>
        <Container disableGutters maxWidth="lg">
          <Grid container columnSpacing={20}>
            {cardInfo?.map((item, index) => {
              return (
                <Grid item xs={3} key={index}>
                  <InviteInfoCard height={137} data={item} />
                </Grid>
              );
            })}
          </Grid>
          <Stack direction="row" alignItems="center" mb={30} mt={60}>
            <img src={RewardPNG} />
            <Typography variant="h1" className={styles['part-title']}>
              Reward Details
            </Typography>
          </Stack>
          <RewardDetailTable />
        </Container>
      </div>
    </div>
  );
};

export default InviteEnd;
function getConfigItemVal(arg0: string) {
  throw new Error('Function not implemented.');
}
