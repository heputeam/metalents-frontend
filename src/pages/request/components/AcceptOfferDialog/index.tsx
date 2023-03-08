import Dialog from '@/components/Dialog';
import React from 'react';
import { IDialogState, useDispatch, useSelector, history } from 'umi';
import styles from './index.less';
import Button from '@/components/Button';
import { useRequest } from 'ahooks';
import { Toast } from '@/components/Toast';
import { OfferStatus } from '../../_define';
import { getCurrentToken, toThousands } from '@/utils';
import { postOffersUpdate } from '@/service/offers';
import { IOtherOffersItem, IRequestDetails } from '@/service/user/types';
import { OrderCreateType } from '@/service/orders/types';
import MyAvatar from '@/components/Avatar';

interface IAcceptOfferDialogState {
  visible: boolean;
  offerId: number;
  offerData: IOtherOffersItem;
  requestDetails: IRequestDetails | null;
  onSuccess: () => void;
}
const dialog_key = 'acceptOfferDialog'; // dialog 唯一值
export type IAcceptOfferDialogProps = {};

const AcceptOfferDialog: React.FC<IAcceptOfferDialogProps> = ({}) => {
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: IAcceptOfferDialogState = useSelector<
    any,
    IDialogState & IAcceptOfferDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[dialog_key],
  }));
  const { tokens } = useSelector((state: any) => state.coins);
  // 关闭 dialog
  const handleClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };

  const handleAcceptOffer = () => {
    const { requestDetails, offerData } = dialogState;

    const initInfo = {
      requestId: offerData?.id,
      sellerId: offerData?.userId,
      orderType: OrderCreateType.request,
      request: {
        description: requestDetails?.description,
        posts: requestDetails?.posts,
        deliverTime: offerData?.deliverTime,
        budgetAmount: offerData?.budgetAmount,
        coinId: offerData?.coinId,
        category: requestDetails?.category,
        subcategory: requestDetails?.subcategory,
      },
    };
    dialogState?.onSuccess();
    handleClose();
    history.push('/orders/apply', {
      initInfo: initInfo,
    });
  };
  return (
    <Dialog
      visible={dialogState.visible}
      title="Submit the order"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['accept-offer-content']}>
        <div className={styles['order-info']}>
          <div className={styles['user-info']}>
            <MyAvatar
              src={
                dialogState?.offerData?.userAvatar?.fileUrl ||
                dialogState?.offerData?.userAvatar?.fileThumbnailUrl
              }
              sx={{ width: '44px', height: '44px' }}
            >
              {dialogState?.offerData?.userName
                ?.slice(0, 1)
                ?.toLocaleUpperCase()}
            </MyAvatar>

            <span className={styles['user-name']}>
              {dialogState?.offerData?.userName}
            </span>
          </div>
          <div className={styles['price-time-info']}>
            <div className={styles['price-box']}>
              <span className={styles['price']}>
                {toThousands(dialogState?.offerData?.budgetAmount)}&nbsp;
                {getCurrentToken(dialogState?.offerData?.coinId, tokens)?.name}
                {dialogState?.offerData?.budgetToken}
              </span>
              Price
            </div>
            <div className={styles['delivery-time']}>
              Delivery time: {dialogState?.offerData?.deliverTime}&nbsp;
              {dialogState?.offerData?.deliverTime > 1 ? 'Days' : 'Day'}
            </div>
          </div>
        </div>
        <div className={styles['tips']}>
          <p>
            Have you confirmed your favorite offer?
            <br /> You can place an order with this seller now.
          </p>
        </div>
        <div className={styles['button-box']}>
          <Button
            variant="contained"
            size="large"
            style={{
              width: '240px',
              height: '48px',
            }}
            onClick={handleAcceptOffer}
          >
            Submit
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default AcceptOfferDialog;
