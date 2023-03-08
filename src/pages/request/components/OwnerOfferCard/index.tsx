import React from 'react';
import styles from './index.less';
import { useDispatch, useSelector, history } from 'umi';
import moment from 'moment';
import { OfferStatus } from '../../_define';
import { getCurrentToken, toThousands } from '@/utils';
import { IUserOffersItem } from '@/service/user/types';
import Button from '@/components/Button';

export type IOwnerOfferCardProps = {
  offerData: IUserOffersItem;
  refreshMyOffer: () => void;
  refreshCanCreate: () => void;
};

const OwnerOfferCard: React.FC<IOwnerOfferCardProps> = ({
  offerData,
  refreshMyOffer,
  refreshCanCreate,
}) => {
  const dispatch = useDispatch();
  const { tokens } = useSelector((state: any) => state.coins);
  return (
    <div className={styles['offer-wrap']}>
      <div className={styles['user-info']}>
        <span className={styles['title']}>My offer</span>
      </div>
      <div className={styles['offer-box']}>
        <label className={styles['label']}>Reply:</label>
        <div className={styles['offer-content']}>
          <div className={styles['reply-box']}>
            <p className={styles['reply-description']}>
              {offerData?.description}
            </p>
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

            {offerData?.status === OfferStatus.Waiting && (
              <div className={styles['button-box']}>
                <Button
                  variant="contained"
                  className={styles['contained-btn']}
                  onClick={() => {
                    dispatch({
                      type: 'dialog/show',
                      payload: {
                        key: 'makeEditOfferDialog',
                        title: 'Edit my offer',
                        id: offerData?.id,
                        requestId: offerData?.requestId,
                        offerData,
                        onSuccess: refreshMyOffer,
                      },
                    });
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    dispatch({
                      type: 'dialog/show',
                      payload: {
                        key: 'cancelOfferDialog',
                        offerId: offerData?.id,
                        onSuccess: () => {
                          refreshMyOffer();
                          refreshCanCreate();
                        },
                      },
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
            {offerData?.status === OfferStatus.Accept && (
              <div
                className={`${styles['button-box']} ${styles['accept-button-box']}`}
              >
                <Button
                  variant="contained"
                  className={styles['contained-btn']}
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
                <Button
                  disabled
                  variant="outlined"
                  className={styles['outlined-btn']}
                >
                  Rejected
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerOfferCard;
