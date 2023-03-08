import { Container, Grid, Link, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import Button from '@/components/Button';
import { history, useDispatch, useSelector } from 'umi';
import { ReactComponent as HandSVG } from './assets/hand.svg';
import { ReactComponent as DiscordSVG } from './assets/discord.svg';
import { ReactComponent as WhiteDiscordSVG } from './assets/white-discord.svg';
import DashboardPNG from './assets/dashboard.png';
import RewardsPNG from './assets/rewards-bg.png';
import WorkIconSVG from './assets/work-icon.svg';
import { ReactComponent as QuoteSVG } from './assets/quote.svg';
import Tooltip from './components/Tooltip';
import InviteInfoCard from './components/InviteInfoCard';
import RewardPNG from './assets/reward.png';
import TopSellerPNG from './assets/top-seller.png';
import ReferralsPNG from './assets/referrals.png';
import RewardDetailTable from './components/RewardDetailTable';
import TopSellersTable from './components/TopSellersTable';
import ReferralsTable from './components/ReferralsTable';
import { useGetActivity, useGetActivityConfig } from '@/hooks/useActivity';
import InvitePersonPNG from './assets/invite-person.png';
import WaterMarkPNG from './assets/watermark.png';
import {
  getConfigItem,
  getCurrentToken,
  getTokenSysDecimals,
  toThousands,
} from '@/utils';
import UserStepProgress from './components/UserStepProgress';
import BigNumber from 'bignumber.js';
import { IResponse } from '@/service/types';
import { useRequest } from 'ahooks';
import {
  IActivityConfigItem,
  IDashboard,
  IWithdraw,
} from '@/service/invite/type';
import { getActivityDashboard, postActivityWithdraw } from '@/service/invite';
import Toast from '@/components/Toast';
export interface IPointReward {
  twitterPoint: number;
  verifyPoint: number;
}
export interface ICardInfo {
  title: string;
  value: React.ReactNode;
  tooltip?: string;
  extra?: React.ReactNode;
}

const InvitePage: React.FC = () => {
  const { activityData } = useGetActivity({ title: ['registration'] });
  const [activityId, setActivityId] = useState<number>();
  const { configData } = useGetActivityConfig(activityId);
  const [totalReward, setTotalReward] = useState<number>(0);
  const [pointReward, setPointReward] = useState<IPointReward>({
    twitterPoint: 0,
    verifyPoint: 0,
  });
  const [isDefaultSvg, setIsDefaultSvg] = useState<boolean>(true);
  const [refreshNum, setRefreshNum] = useState<number>(0);

  useEffect(() => {
    if (activityData && activityData?.total > 0) {
      if (activityData?.list?.[0]?.status !== 'enable') {
        return history.replace('/invite/end');
      }
      setActivityId(activityData?.list?.[0]?.id);
    }
  }, [activityData]);

  const getSellerOrderDoneVal = () => {
    const temp = configData?.filter(
      (item: IActivityConfigItem) =>
        item?.status === 'enable' && item?.cfgName === 'SellerOrderDone',
    );
    return Number(temp?.[0]?.cfgVal);
  };

  const getConfigItemVal = (name: string) => {
    return Number(getConfigItem(configData, activityId, name)?.cfgVal);
  };

  useEffect(() => {
    if (configData && activityId) {
      const temp =
        getConfigItemVal('VerifyPoint') +
        getConfigItemVal('TwitterSharePoint') +
        getConfigItemVal('FirstOrderPoint');
      setTotalReward(temp);
      setPointReward({
        verifyPoint: getConfigItemVal('VerifyPoint'),
        twitterPoint: getConfigItemVal('TwitterSharePoint'),
      });
    }
  }, [configData, activityId]);

  const { uid } = useSelector((state: any) => state.user);
  const { data: dashboardInfo, run: getDashboard } = useRequest<
    IResponse<IDashboard>,
    any
  >(() => getActivityDashboard(), {
    manual: true,
    refreshDeps: [refreshNum],
    onSuccess: (res: any) => {},
  });

  useEffect(() => {
    if (uid) {
      getDashboard();
    }
  }, [uid, refreshNum]);

  const cardInfo: ICardInfo[] = [
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
      title: 'Your referrals',
      value: (
        <div className={styles['num']}>
          {toThousands(dashboardInfo?.data?.referralCount || 0)}
        </div>
      ),
      tooltip:
        'If a seller signs up through your link in Metalents. You can get rewards from the tasks he completed.',
    },
    {
      title: 'Verified referrals',
      value: (
        <div className={styles['num']}>
          {toThousands(dashboardInfo?.data?.referralVerifyCount || 0)}
        </div>
      ),
      tooltip: `Once a referral gets verified, you will receive a $${
        getConfigItemVal('ReferredVerifyPoint') || 0
      } reward.`,
    },
    {
      title: 'Orders completed by referrals',
      value: (
        <div className={styles['num']}>
          {toThousands(dashboardInfo?.data?.referralCompletedOrder || 0)}
        </div>
      ),
      tooltip: `When a verified referral completes his first order, you will receive a $${
        getConfigItemVal('ReferredFirstOrderPoint') || 0
      } reward.`,
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
        setRefreshNum(refreshNum + 1);
        getDashboard();
      }
    },
  });

  const handleClaim = () => {
    return Toast.warn('New features coming soon.');
    postWithdraw();
  };
  const handleRefresh = () => {
    setRefreshNum(refreshNum + 1);
  };

  return (
    <div className={styles['invite-page']}>
      <div className={styles['part-1']}>
        <Container disableGutters maxWidth="lg">
          <div className={styles['text-box']}>
            <div className={styles['banner-content']}>
              <Stack direction="row" alignItems="center">
                <HandSVG />
                <Typography variant="body1" sx={{ ml: 6 }}>
                  For a limited time only! Become a Metalents 'Early Bird'
                  artist, developer or community manager and...
                </Typography>
              </Stack>
              <div className={styles['banner-title']}>
                Gain an instant <span>${totalReward}</span> Reward
              </div>
              <Typography variant="h2" sx={{ mr: 6, fontWeight: 500 }}>
                Earn a $
                {Number(
                  getConfigItemVal('ReferredVerifyPoint') +
                    getConfigItemVal('ReferredFirstOrderPoint'),
                ) || 0}{' '}
                reward for every successful referral you make. No limits!
              </Typography>
              <Stack direction="row" spacing={24} mt={40}>
                <Button
                  variant="contained"
                  size="large"
                  rounded
                  onClick={() => history.push(`/selling${location.search}`)}
                >
                  Become a seller
                </Button>
                <Link
                  href="https://discord.gg/CjzRjhgUNd"
                  target="_blank"
                  className={styles['discord']}
                  onMouseEnter={() => {
                    setIsDefaultSvg(false);
                  }}
                  onMouseLeave={() => {
                    setIsDefaultSvg(true);
                  }}
                >
                  <Button variant="outlined" size="large" rounded>
                    {isDefaultSvg ? <DiscordSVG /> : <WhiteDiscordSVG />}
                    &nbsp;&nbsp;Join Metalents Discord
                  </Button>
                </Link>
                <Link
                  target="_blank"
                  className={styles['discord']}
                  href="https://metalents.medium.com/metalents-seller-verification-process-rewards-program-1b3965956341"
                >
                  <Button size="large" rounded className={styles['more-btn']}>
                    Learn more
                  </Button>
                </Link>
              </Stack>
            </div>
            <img src={WaterMarkPNG} className={styles['watermark']} />
            <img src={InvitePersonPNG} className={styles['person']} />
          </div>
        </Container>
      </div>
      <div className={styles['part-2']}>
        <Container maxWidth="lg" disableGutters>
          <div className={styles['part-2-content']}>
            <Typography variant="h1" className={styles['rewards-title']}>
              How to earn rewards?
            </Typography>
            <img src={RewardsPNG} className={styles['rewards-img']} />
            <div className={styles['rewards-content']}>
              <div className={styles['verified']}>
                <div className={styles['second-title']}>Get verified</div>
                <div className={styles['rewards-info']}>
                  Create an account, provide your personal details, link your
                  social media accounts, and verify your identity!
                </div>
              </div>
              <div className={styles['services']}>
                <div className={styles['second-title']}>Provide services</div>
                <div className={styles['rewards-info']}>
                  Define the services you provide or deliver a buyer's request.
                  For your first completed order, you receive a $
                  {getConfigItemVal('FirstOrderPoint') || 0} bonus! Also, you
                  get a {getSellerOrderDoneVal() || 0}% reward for each
                  following order you complete!
                </div>
              </div>
              <div className={styles['friends']}>
                <div className={styles['second-title']}>Invite friends</div>
                <div className={styles['rewards-info']}>
                  For every friend you refer, who gets verified and completes
                  the first order, you earn extra $
                  {getConfigItemVal('ReferredVerifyPoint') || 0} + $
                  {getConfigItemVal('ReferredFirstOrderPoint') || 0} rewards as
                  our way of saying 'Thanks!'
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div className={styles['part-3']}>
        <Container maxWidth="lg" disableGutters>
          <UserStepProgress
            pointReward={pointReward}
            onRefresh={handleRefresh}
          />
        </Container>
      </div>
      <div className={styles['part-4']}>
        <Container maxWidth="lg" disableGutters>
          <div className={styles['dashboard']}>
            <Stack direction="row" alignItems="center" mb={30}>
              <img src={DashboardPNG} width={32} height={32} />
              <Typography variant="h1" className={styles['part-title']}>
                Dashboard
              </Typography>
            </Stack>
            <Grid container>
              <Grid item xs={7.6}>
                <div className={styles['left-dashboard']}>
                  <div className={styles['left']}>
                    <img src={WorkIconSVG} />
                    <Typography variant="body1" className={styles['work']}>
                      WORK
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 10 }}>
                      1 WORK ($1) = {workPrice || 0} AUCTION
                    </Typography>
                  </div>
                  <div className={styles['right']}>
                    <Stack direction="row" alignItems="center">
                      <Typography
                        variant="body1"
                        sx={{ mr: 6, lineHeight: '19px' }}
                      >
                        Your available rewards{' '}
                      </Typography>
                      <Tooltip
                        title={
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            Rewards that can be claimed. 1WORK is worth 1 USD.
                            The Claim operation will convert this reward into
                            AUCTION and withdraw it to your platform balance (in
                            the current exchange rate).
                          </Typography>
                        }
                        arrow
                        placement="top"
                        className={styles['tooltip-content']}
                      >
                        <QuoteSVG />
                      </Tooltip>
                    </Stack>
                    <div className={styles['work-num']}>
                      <strong>
                        {toThousands(dashboardInfo?.data?.availablePoints || 0)}
                      </strong>
                      WORK
                    </div>
                    <Typography
                      variant="body2"
                      sx={{ mt: 8, lineHeight: '16px' }}
                    >
                      ={' '}
                      {toThousands(
                        new BigNumber(dashboardInfo?.data?.availablePoints || 0)
                          .multipliedBy(workPrice)
                          .toNumber(),
                        2,
                      )}{' '}
                      AUCTION
                    </Typography>
                    <Stack direction="row" alignItems="center" sx={{ mt: 40 }}>
                      <Typography
                        variant="body1"
                        sx={{ mr: 6, lineHeight: '19px' }}
                      >
                        Total rewards{' '}
                      </Typography>
                      <Tooltip
                        title={
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            The total amount of WORK rewards you have received.
                          </Typography>
                        }
                        arrow
                        placement="top"
                        className={styles['reward-tooltip']}
                      >
                        <QuoteSVG />
                      </Tooltip>
                    </Stack>
                    <div className={styles['reward-num']}>
                      <strong>
                        {toThousands(dashboardInfo?.data?.totalPoints || 0)}
                      </strong>
                      WORK
                    </div>
                    <Button
                      variant="contained"
                      disabled={
                        !uid ||
                        Number(dashboardInfo?.data?.availablePoints) === 0
                      }
                      className={styles['claim-btn']}
                      onClick={handleClaim}
                      loading={withdrawLoading}
                    >
                      Claim
                    </Button>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4.4} sx={{ pl: 20 }}>
                <div className={styles['right-dashboard']}>
                  <Grid container spacing={20}>
                    {cardInfo?.map((item, index) => {
                      return (
                        <Grid item xs={6} key={index}>
                          <InviteInfoCard height={112} data={item} />
                        </Grid>
                      );
                    })}
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className={styles['table-part']}>
            <Grid container columnGap={20}>
              <Grid item xs={7.6}>
                <Stack direction="row" alignItems="center" mb={30}>
                  <img src={RewardPNG} width={32} height={32} />
                  <Typography variant="h1" className={styles['part-title']}>
                    Reward Details
                  </Typography>
                </Stack>
                <RewardDetailTable refreshNum={refreshNum} />
              </Grid>
              <Grid item xs={4.2}>
                <Stack direction="row" alignItems="center" mb={30}>
                  <img src={TopSellerPNG} width={32} height={32} />
                  <Typography variant="h1" className={styles['part-title']}>
                    Top 20 sellers
                  </Typography>
                </Stack>
                <TopSellersTable refreshNum={refreshNum} />
              </Grid>
            </Grid>
          </div>
          <div className={styles['referrals']}>
            <Stack direction="row" alignItems="center" mb={30}>
              <img src={ReferralsPNG} width={32} height={32} />
              <Typography variant="h1" className={styles['part-title']}>
                Referrals
              </Typography>
            </Stack>
            <ReferralsTable activityId={activityId} refreshNum={refreshNum} />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default InvitePage;
