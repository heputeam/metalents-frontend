import React, { useEffect, useState } from 'react';
import {
  history,
  IOAuthResponse,
  IUserState,
  useDispatch,
  useSelector,
} from 'umi';
import styles from './index.less';
import Step1PNG from '../../assets/step1.png';
import Step2PNG from '../../assets/step2.png';
import Step3PNG from '../../assets/step3.png';
import Step4PNG from '../../assets/step4.png';
import Step5PNG from '../../assets/step5.png';
import VerifySuccessSVG from '../../assets/verify-success.svg';
import CopySVG from '../../assets/copy.svg';
import VerifyErrorSVG from '../../assets/verify-error.svg';
import HelpSVG from '../../assets/help.svg';
import RefreshSVG from '../../assets/refresh.svg';
import Button from '@/components/Button';
import { IOAuth, USER_TYPE } from '@/define';
import CopyToClipboard from 'react-copy-to-clipboard';
import Toast from '@/components/Toast';
import base58 from 'base58-encode';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { postUpdateThirdpart } from '@/service/public';
import { useLocalStorageState, useRequest } from 'ahooks';
import { IPointReward } from '../..';
import { toThousands } from '@/utils';
import { postActivityRetweet } from '@/service/invite';
import { Errors } from '@/service/errors';
import { userCheckRetweetStatus } from '@/hooks/useActivity';

const MyTooltip = () => {
  return (
    <Tooltip
      arrow
      placement="bottom"
      classes={{
        tooltip: styles['tooltip'],
        arrow: styles['tooltip-arrow'],
      }}
      title={
        <div className={styles['tips']}>
          <Typography>
            Have you registered on other metalents platforms? If yes, provide
            personal pages for other platforms.
            <br /> a) What is your trading volume on other freelance platforms?{' '}
            <br />
            b) If your transaction volume is [5] or more - your account can be
            verified (combined with the verification of the number of followers
            you have on your social media accounts). <br />
            c) If transaction volume is [0-5], your account can be verified by
            the following test to identify whether your qualification meets the
            professional standards for our platform. <br />
          </Typography>
          <Typography>
            2. Do you have an Instagram, Twitter, or TikTok account? a) What is
            the number of followers on your accounts? b) Does it match with the
            general number of similar artists? (i.e. more than{' '}
            {toThousands(1000)}) c) Provide the link to your account page where
            you have examples of your work.
          </Typography>
          <Typography>
            3. If you are a developer, please provide a Github account ID and a
            homepage link.
          </Typography>
          <Typography>
            4. For the operational position, please provide some proofs of
            previous work experience, i.e. discord, telegram, etc.
          </Typography>
        </div>
      }
    >
      <img src={HelpSVG} style={{ marginLeft: '4px' }} />
    </Tooltip>
  );
};

export type IUserStepProgressProps = {
  pointReward: IPointReward;
  onRefresh: () => void;
};

const UserStepProgress: React.FC<IUserStepProgressProps> = ({
  pointReward,
  onRefresh,
}) => {
  const dispatch = useDispatch();
  const { token, userInfo } = useSelector<any, IUserState>(
    (state) => state?.user,
  );
  const { config } = useSelector((state: any) => state.config);
  const [active, setActive] = useState(0);
  const { isRetweet } = userCheckRetweetStatus();
  const [checkRetweet, setCheckRetweet] = useState(false);
  const [btnType, setBtnType] = useState('Retweet');
  const [loading, setLoading] = useState<boolean>(false);
  const [twitterToken, setTwitterToken] = useLocalStorageState('twitter_token');
  const { run: runThirdpart } = useRequest(
    (params) => postUpdateThirdpart(params),
    {
      manual: true,
      onSuccess: (data: any) => {
        const { code } = data;
        if (code === 200) {
          Toast.success('Successfully set!');
          dispatch({
            type: 'user/queryUser',
          });
        } else if (
          code === 30042 ||
          code === 30026 ||
          code === 30025 ||
          code === 30027
        ) {
          Toast.error(
            'Your social accounts have been used, please bind the other one.',
          );
        } else {
          Toast.error('Unknown system failure: Please try');
        }
      },
    },
  );
  const { run: runRetweet } = useRequest(
    (assessToken: string) => postActivityRetweet(assessToken),
    {
      manual: true,
      onSuccess: (data: any) => {
        setLoading(false);
        const { code } = data;
        if (code !== 200) {
          return Toast.error(Errors['*']);
        }
        if (data?.data?.success) {
          onRefresh?.();
          return setCheckRetweet(true);
        }
        if (btnType === 'Refresh') return;
        window.open(config?.['TWITTER_SHARE_LINK']?.cfgVal, '_blank');
      },
      onError: () => {
        setLoading(false);
      },
    },
  );

  const handleOAuthBind = async (authName: IOAuth, type: number) => {
    if (type === 4) {
      return Toast.warn('New features coming soon');
    }
    dispatch({
      type: 'user/loginOAuth',
      payload: {
        authName,
      },
      callback: async (res: IOAuthResponse) => {
        const accessToken = res.accessToken || '';
        const params = {
          accessToken,
          message: '',
          signature: '',
          thirdpartType: type,
          userAddress: '',
        };
        runThirdpart(params);
      },
    });
  };
  const handleStates = () => {
    if (isRetweet || checkRetweet) {
      return setActive(4);
    }
    if (userInfo?.isVerify === 'verified') {
      return setActive(3);
    }
    if (
      userInfo?.userType === USER_TYPE.Seller &&
      (userInfo?.instagramInfo?.name || userInfo?.twitterInfo?.name)
    ) {
      return setActive(2);
    }
    if (userInfo?.userType === USER_TYPE.Seller) {
      return setActive(1);
    }
    setActive(0);
  };
  const handleRetweet = (authName: IOAuth) => {
    dispatch({
      type: 'user/loginOAuth',
      payload: {
        authName,
      },
      callback: async (res: IOAuthResponse) => {
        const assessToken = res.accessToken || '';
        setTwitterToken(assessToken);
        setBtnType('Retweet');
        runRetweet(assessToken);
      },
    });
  };
  const handleRefresh = () => {
    if (twitterToken) {
      setBtnType('Refresh');
      setLoading(true);
      runRetweet(twitterToken);
    }
  };
  useEffect(() => {
    handleStates();
  }, [userInfo, isRetweet, checkRetweet]);
  useEffect(() => {
    if (!isRetweet) return;
    onRefresh?.();
  }, [isRetweet]);
  return (
    <div className={styles['user-step-progress-page']}>
      <div
        className={`${styles['card']} ${active === 0 ? styles['active'] : ''}`}
      >
        <span className={styles['step']}>01</span>
        <div className={styles['icon-box']}>
          <img src={Step1PNG} />
        </div>
        <div className={styles['card-content']}>
          {active === 0 && (
            <div className={styles['acitve-content']}>
              <div className={styles['become-seller']}>
                {token ? (
                  <Button
                    onClick={() => {
                      history.push('/seller/apply');
                    }}
                    variant="contained"
                    style={{
                      width: '142px',
                      height: '36px',
                      borderRadius: '30px',
                    }}
                  >
                    Become a seller
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      dispatch({
                        type: 'dialog/show',
                        payload: {
                          key: 'loginChooseDialog',
                        },
                      });
                    }}
                    variant="contained"
                    style={{
                      width: '142px',
                      height: '36px',
                      borderRadius: '30px',
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </div>

              <div className={styles['tit-box']}>
                <span>Apply to be a seller</span>
                <MyTooltip />
              </div>
            </div>
          )}
          {active > 0 && (
            <div>
              <div className={styles['tit-box']}>
                <span>Apply to be a seller</span>
                <MyTooltip />
              </div>
              <div className={styles['verify-icon']}>
                <img src={VerifySuccessSVG} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={`${styles['card']} ${active === 1 ? styles['active'] : ''}`}
      >
        <span className={styles['step']}>02</span>
        <div className={styles['icon-box']}>
          <img src={Step2PNG} />
        </div>

        <div className={styles['card-content']}>
          {active < 1 && (
            <div className={styles['befer-content']}>
              <div className={styles['tit-box']}>
                <span>Connect your social media accounts</span>
              </div>
            </div>
          )}
          {active === 1 && (
            <div>
              <div className={styles['tit-box']}>
                <span>
                  Connect one of your social media account for verification
                </span>
              </div>
              <div className={styles['buttons-box']}>
                <Button
                  onClick={() => handleOAuthBind('twitter', 3)}
                  variant="contained"
                  style={{
                    width: '118px',
                    height: '36px',
                    borderRadius: '30px',
                  }}
                >
                  Twitter
                </Button>
                <Button
                  onClick={() => handleOAuthBind('instagram', 4)}
                  variant="contained"
                  style={{
                    width: '118px',
                    height: '36px',
                    marginLeft: '10px',
                    borderRadius: '30px',
                  }}
                >
                  Instagram
                </Button>
              </div>
            </div>
          )}
          {active > 1 && (
            <div className={styles['after-content']}>
              <div className={styles['tit-box']}>
                <span>Connect your social media accounts</span>
              </div>
              <div className={styles['verify-icon']}>
                <img src={VerifySuccessSVG} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={`${styles['card']} ${active === 2 ? styles['active'] : ''}`}
      >
        <span className={styles['step']}>03</span>
        <div className={styles['icon-box']}>
          <img src={Step3PNG} />
        </div>
        <div className={styles['card-content']}>
          {active < 2 && (
            <div className={styles['before-content']}>
              <div className={styles['tit-box']}>
                <span>
                  Successfully verify, claim $
                  {toThousands(pointReward.verifyPoint)}
                </span>
              </div>
            </div>
          )}
          {active === 2 && (
            <div className={styles['active-content']}>
              <div className={styles['tit-box']}>
                <span>
                  Successfully verify,
                  <br /> get ${toThousands(pointReward.verifyPoint)}
                </span>
              </div>
              {userInfo?.isVerify === 'verify_failed' ? (
                <div className={styles['verify-failed']}>
                  <span>Sorry, you are not qualified for this activity.</span>
                  <img src={VerifyErrorSVG} alt="" width={24} height={24} />
                </div>
              ) : (
                <div className={styles['buttons-box']}>
                  <Button
                    variant="contained"
                    disabled
                    style={{
                      width: '118px',
                      height: '36px',
                      borderRadius: '30px',
                      padding: '0px',
                    }}
                  >
                    Under review
                  </Button>
                </div>
              )}
            </div>
          )}
          {active > 2 && (
            <div className={styles['after-content']}>
              <div className={styles['tit-box']}>
                <span>
                  Successfully verify, claim $
                  {toThousands(pointReward.verifyPoint)}
                </span>
              </div>
              <div className={styles['verify-icon']}>
                <img src={VerifySuccessSVG} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={`${styles['card']} ${active === 3 ? styles['active'] : ''}`}
      >
        <span className={styles['step']}>04</span>
        <div className={styles['icon-box']}>
          <img src={Step4PNG} />
        </div>
        <div className={styles['card-content']}>
          {active < 3 && (
            <div className={styles['befer-content']}>
              <div className={styles['tit-box']}>
                <span>
                  Share on Twitter, claim $
                  {toThousands(pointReward.twitterPoint)}
                </span>
              </div>
            </div>
          )}
          {active === 3 && (
            <div className={styles['active-content']}>
              <div className={styles['tit-box']}>
                <span>
                  Share on Twitter,
                  <br /> get ${toThousands(pointReward.twitterPoint)}
                </span>
              </div>
              <div className={styles['buttons-box']}>
                <Button
                  onClick={() => handleRetweet('twitter')}
                  variant="contained"
                  style={{
                    width: '118px',
                    height: '36px',
                    borderRadius: '30px',
                  }}
                >
                  Retweet
                </Button>
                {twitterToken && (
                  <IconButton
                    classes={{ root: styles['refreshBtn-root'] }}
                    className={`${loading ? styles['loading'] : ''}`}
                    onClick={handleRefresh}
                  >
                    <img src={RefreshSVG} alt="" />
                  </IconButton>
                )}
              </div>
            </div>
          )}
          {active > 3 && (
            <div className={styles['after-content']}>
              <div className={styles['tit-box']}>
                <span>
                  Share on Twitter, claim $
                  {toThousands(pointReward.twitterPoint)}
                </span>
              </div>
              <div className={styles['verify-icon']}>
                <img src={VerifySuccessSVG} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={`${styles['card']} ${active === 4 ? styles['active'] : ''}`}
      >
        <span className={styles['step']}>05</span>
        <div className={styles['icon-box']}>
          <img src={Step5PNG} />
        </div>
        <div className={styles['card-content']}>
          {active < 4 && (
            <div className={styles['befer-content']}>
              <div className={styles['tit-box']}>
                <span>Invite friends to register to earn rewards!</span>
              </div>
            </div>
          )}
          {active === 4 && (
            <div className={styles['active-content']}>
              <div className={styles['tit-box']}>
                <span>Invite friends to register to earn rewards!</span>
              </div>
              <div className={styles['buttons-box']}>
                <CopyToClipboard
                  text={`${location.href.split('?')[0]}?referralCode=${base58(
                    `${userInfo?.id}`,
                  )}`}
                  onCopy={() => {
                    Toast.success('Successfully copied!');
                  }}
                >
                  <Button
                    variant="contained"
                    style={{
                      width: '118px',
                      height: '36px',
                      borderRadius: '30px',
                    }}
                    startIcon={<img src={CopySVG} width={16} height={16} />}
                  >
                    Copy link
                  </Button>
                </CopyToClipboard>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStepProgress;
