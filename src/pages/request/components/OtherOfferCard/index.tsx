import React from 'react';
import styles from './index.less';
import moment from 'moment';
import messageSVG from '@/assets/imgs/request/message.svg';
import { OfferStatus, Status } from '../../_define';
import { Link, useDispatch, useSelector, history } from 'umi';
import { getCurrentToken, toThousands } from '@/utils';
import { IOtherOffersItem, IRequestDetails } from '@/service/user/types';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import { IDENTITY_TYPE } from '@/define';
import VerifiedSVG from '@/assets/imgs/home/verified.svg';
import SendMessage from '@/components/SendMessage';

export type IOtherOfferCardProps = {
  type: number;
  offerData: IOtherOffersItem;
  requestDetails: IRequestDetails | null;
  refreshDetails: () => void;
  refreshOtherOffer: () => void;
};

const OtherOfferCard: React.FC<IOtherOfferCardProps> = ({
  type,
  offerData,
  requestDetails,
  refreshDetails,
  refreshOtherOffer,
}) => {
  const { tokens } = useSelector((state: any) => state.coins);
  const dispatch = useDispatch();
  return (
    <div className={styles['offer-wrap']}>
      <div className={styles['user-info']}>
        <Link
          to={`/seller/profile?sidebar&userId=${offerData?.userId}`}
          className={styles['user-box']}
        >
          <Avatar
            size={44}
            sx={{
              margin: '0 auto',
              fontSize: '26px',
            }}
            src={offerData?.userAvatar?.fileUrl}
          >
            {offerData?.userName?.slice(0, 1)?.toLocaleUpperCase()}
          </Avatar>
          <div className={styles['user-name']}>{offerData?.userName}</div>
        </Link>
        {offerData?.userIsVerify === 'verified' && (
          <img
            src={VerifiedSVG}
            alt=""
            width={16}
            style={{ marginRight: 12 }}
          />
        )}
        <div className={styles['user-name-box']}>
          <span className={styles['level']}>Lv.{offerData?.levels}</span>
          {type === IDENTITY_TYPE.Owner && (
            <SendMessage
              sx={{ ml: 12 }}
              targetId={(offerData?.userId || '')?.toString()}
              svg={messageSVG}
              text="Message"
            />
          )}
        </div>
      </div>
      <div className={styles['offer-box']}>
        <label className={styles['label']}>Reply:</label>
        <div className={styles['offer-content']}>
          <div className={styles['reply-box']}>
            {type === IDENTITY_TYPE.Owner ? (
              <p className={styles['reply-description']}>
                {offerData?.description
                  ? offerData?.description
                  : 'This seller did not write any reply...'}
              </p>
            ) : (
              <p className={styles['reply-description']}>
                {offerData?.description}
              </p>
            )}
            <div className={styles['time']}>
              {moment(offerData?.createdAt * 1000).format('MMM D, YYYY HH:mm')}
            </div>
          </div>

          <div className={styles['price-time-box']}>
            <div className={styles['budget-box']}>
              <div className={styles['price-box']}>
                <span className={styles['price']}>
                  {offerData && toThousands(offerData?.budgetAmount)}&nbsp;
                  {getCurrentToken(offerData?.coinId, tokens)?.name}
                </span>
                Price
              </div>
              <div className={styles['delivery-time']}>
                Delivery time: {offerData?.deliverTime}&nbsp;
                {offerData?.deliverTime > 1 ? 'Days' : 'Day'}
              </div>
            </div>
            {type === IDENTITY_TYPE.Owner && (
              <div>
                {requestDetails?.status === Status.Waiting &&
                  offerData?.status === OfferStatus.Waiting && (
                    <div className={styles['button-box']}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          dispatch({
                            type: 'dialog/show',
                            payload: {
                              key: 'rejectOfferDialog',
                              offerId: offerData?.id,
                              onSuccess: refreshOtherOffer,
                            },
                          });
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          dispatch({
                            type: 'dialog/show',
                            payload: {
                              key: 'acceptOfferDialog',
                              offerId: offerData?.id,
                              offerData: offerData,
                              requestDetails: requestDetails,
                              onSuccess: () => {
                                refreshDetails();
                                refreshOtherOffer();
                              },
                            },
                          });
                        }}
                      >
                        Accept
                      </Button>
                    </div>
                  )}
                {offerData?.status === OfferStatus.Accept && (
                  <div
                    className={`${styles['button-box']} ${styles['accept-button-box']}`}
                  >
                    <Button
                      variant="contained"
                      style={{
                        width: '112px',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                      onClick={() =>
                        history.push(`/orders/details?id=${offerData?.orderId}`)
                      }
                    >
                      Order detail
                    </Button>
                  </div>
                )}
                {offerData?.status === OfferStatus.Reject && (
                  <div
                    className={`${styles['button-box']} ${styles['reject-button-box']}`}
                  >
                    <Button disabled variant="outlined">
                      Rejected
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherOfferCard;
