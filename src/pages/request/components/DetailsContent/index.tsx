import moment from 'moment';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import ClockSVG from '@/assets/imgs/request/clock.svg';
import messageSVG from '@/assets/imgs/request/message.svg';
import { IUserState, useDispatch, useSelector, history, Link } from 'umi';
import { Status } from '../../_define';
import { IDENTITY_TYPE, USER_TYPE } from '@/define';
import { Toast } from '@/components/Toast';
import { getCurrentToken, toThousands } from '@/utils';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import { IRequestDetails } from '@/service/requests/types';
import { IUserOffers } from '@/service/user/types';
import { IResponse } from '@/service/types';
import ViewFiles from '../ViewFiles';
import SendMessage from '@/components/SendMessage';
import PreviewDialog from '../PreviewDialog';

export type IDetailsContentProps = {
  type: number;
  requestId: number;
  requestDetails: IRequestDetails | null;
  myOfferData: IUserOffers;
  canCreateData: IResponse<null> | null;
  refreshDetails: () => void;
  refreshMyOffer: () => void;
  refreshOtherOffer: () => void;
};

const DetailsContent: React.FC<IDetailsContentProps> = ({
  type,
  requestId,
  requestDetails,
  myOfferData,
  canCreateData,
  refreshDetails,
  refreshMyOffer,
  refreshOtherOffer,
}) => {
  const dispatch = useDispatch();
  const { tokens } = useSelector((state: any) => state.coins);
  const { token, userInfo } = useSelector<any, IUserState>(
    (state) => state?.user,
  );
  const [rate, setRate] = useState<number>(0);
  const { config } = useSelector((state: any) => state.config);

  const handleMakeOffer = () => {
    if (!token) {
      return dispatch({
        type: 'dialog/show',
        payload: {
          key: 'loginChooseDialog',
        },
      });
    }
    if (userInfo?.userType !== USER_TYPE.Seller) {
      return history.push('/request/notSeller');
    }
    if (canCreateData?.code === 30029) {
      // 未交保证金
      return Toast.error('You need to paid the seller register deposit first.');
    }
    if (canCreateData?.code === 30035) {
      // 用户waiting 状态的offer大于等于3个
      return Toast.error(
        `Oops! You already have ${config?.['OFFER_WAITING_COUNT']?.cfgVal} offers in waiting.`,
      );
    }
    if (canCreateData?.code === 30030) {
      // 用户的卖家功能被禁用
      return Toast.error(
        'Your account is disabled. Please contact Metalents Customer Service.',
      );
    }
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'makeEditOfferDialog',
        title: 'Make an offer',
        id: 0,
        requestId: requestId,
        onSuccess: refreshMyOffer,
      },
    });
  };

  const handleDateRate = () => {
    const beginAt = requestDetails?.createdAt;
    const endAt = requestDetails
      ? moment(requestDetails?.createdAt * 1000)
          .add(Number(config?.['REQ_NOOFFER_15_DAYS']?.cfgVal), 'days')
          .unix()
      : 0;
    const currentAt = moment(Date.now()).unix();
    if (beginAt && endAt) {
      const rate = (currentAt - beginAt) / (endAt - beginAt);
      setRate(requestDetails?.status === Status.Waiting ? rate : 1);
    }
  };
  useEffect(() => {
    if (!requestDetails) return;
    handleDateRate();
  }, [requestDetails]);
  return (
    <>
      {requestDetails && (
        <div className={styles['details-wrap']}>
          <div className={styles['head-title']}>
            <span
              className={`${styles['status']} ${
                styles[Status[requestDetails?.status]]
              }`}
            >
              {Status[requestDetails?.status]}
            </span>
            <h5>Request Detail</h5>
            <span className={styles['category']}>
              {requestDetails?.category}/{requestDetails?.subcategory}
            </span>
          </div>
          <div className={styles['details-content']}>
            <div className={styles['info-box']}>
              <div className={styles['user-info']}>
                <Link
                  to={`/account/profile?sidebar&userId=${requestDetails?.userId}`}
                  className={styles['user-box']}
                >
                  <Avatar
                    size={44}
                    sx={{
                      margin: '0 auto',
                      fontSize: '26px',
                    }}
                    src={requestDetails?.userAvatar?.fileUrl}
                  >
                    {requestDetails?.userName?.slice(0, 1)?.toLocaleUpperCase()}
                  </Avatar>
                  <span className={styles['user-name']}>
                    {requestDetails?.userName}
                  </span>
                </Link>
                <span className={styles['level']}>
                  Lv.{requestDetails?.levels}
                </span>
                {type === IDENTITY_TYPE.Other && (
                  <SendMessage
                    sx={{ ml: 12 }}
                    targetId={(requestDetails?.userId || '')?.toString()}
                    svg={messageSVG}
                    text="Message"
                  />
                )}
              </div>
              <div className={styles['request-date']}>
                <div className={styles['selection-time']}>
                  <img src={ClockSVG} alt="" />
                  <span>
                    Selection time:&nbsp;
                    {moment(requestDetails?.createdAt * 1000).format(
                      'MMM D, YYYY HH:mm',
                    )}
                    &nbsp;-&nbsp;
                    {requestDetails?.status === Status['Waiting']
                      ? moment(requestDetails?.createdAt * 1000)
                          .add(
                            Number(config?.['REQ_NOOFFER_15_DAYS']?.cfgVal),
                            'days',
                          )
                          .format('MMM D, YYYY HH:mm')
                      : moment(requestDetails?.modifyAt * 1000).format(
                          'MMM D, YYYY HH:mm',
                        )}
                  </span>
                </div>
                <div className={styles['progress-box']}>
                  <div
                    className={styles['progress']}
                    style={{ width: `${(rate * 100).toFixed(2)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className={styles['description-box']}>
              <label>Description:</label>
              <p className={styles['description']}>
                {requestDetails?.description}
              </p>
              <div className={styles['portfolio-box']}>
                <ViewFiles posts={requestDetails?.posts || []} />
                <div className={styles['price-time-box']}>
                  <div className={styles['price-box']}>
                    <span className={styles['price']}>
                      {requestDetails &&
                        toThousands(requestDetails?.budgetAmount)}
                      &nbsp;
                      {getCurrentToken(requestDetails?.coinId, tokens)?.name}
                    </span>
                    Budget
                  </div>
                  <span className={styles['delivery-time']}>
                    Delivery time: {requestDetails?.deliverTime}&nbsp;
                    {requestDetails?.deliverTime > 1 ? 'Days' : 'Day'}
                  </span>
                </div>
              </div>
              {requestDetails?.status === Status.Waiting && (
                <div className={styles['button-box']}>
                  {type === IDENTITY_TYPE.Other ? (
                    <Button
                      disabled={
                        !!(
                          token &&
                          userInfo?.userType === USER_TYPE.Seller &&
                          myOfferData?.total > 0
                        )
                      }
                      variant="contained"
                      rounded
                      onClick={handleMakeOffer}
                    >
                      Make an offer
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      rounded
                      onClick={() => {
                        dispatch({
                          type: 'dialog/show',
                          payload: {
                            key: 'cancelRequestDialog',
                            requestId: requestDetails?.id,
                            onSuccess: () => {
                              refreshDetails();
                              refreshMyOffer();
                              refreshOtherOffer();
                            },
                          },
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <PreviewDialog />
    </>
  );
};

export default DetailsContent;
