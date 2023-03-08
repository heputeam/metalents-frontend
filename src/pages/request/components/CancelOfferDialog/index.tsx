import Dialog from '@/components/Dialog';
import React from 'react';
import { IDialogState, useDispatch, useSelector } from 'umi';
import styles from './index.less';
import CancelRequestSVG from '@/assets/imgs/request/cancel_request.svg';
import Button from '@/components/Button';
import { useRequest } from 'ahooks';
import { Toast } from '@/components/Toast';
import { OfferStatus } from '../../_define';
import { postOffersUpdate } from '@/service/offers';

interface ICancelOfferDialogState {
  visible: boolean;
  offerId: number;
  onSuccess?: () => void;
}

const dialog_key = 'cancelOfferDialog'; // dialog 唯一值

export type ICancelOfferDialogProps = {};

const CancelOfferDialog: React.FC<ICancelOfferDialogProps> = ({}) => {
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: ICancelOfferDialogState = useSelector<
    any,
    IDialogState & ICancelOfferDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[dialog_key],
  }));
  // 关闭 dialog
  const handleClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };
  const { loading, run: cancelOffers } = useRequest(
    (params) => postOffersUpdate({ ...params }),
    {
      manual: true,
      onSuccess: (data: any) => {
        const { code } = data;
        if (code !== 200) {
          return Toast.error('Unknown system failure: Please try');
        }
        dialogState?.onSuccess?.();
        handleClose();
        Toast.success('Successfully cancelled!');
      },
    },
  );
  const handleCancleRequest = () => {
    if (dialogState?.offerId) {
      cancelOffers({
        offerId: dialogState?.offerId,
        status: OfferStatus.Cancel,
      });
    }
  };
  return (
    <Dialog
      visible={dialogState.visible}
      title="Cancel the offer"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['cancel-offer-content']}>
        <img src={CancelRequestSVG} alt="" />
        <p>Are you sure you want to cancel this offer?</p>
        <Button
          loading={loading}
          variant="contained"
          size="large"
          style={{ width: '240px', height: '48px' }}
          onClick={handleCancleRequest}
        >
          Confirm
        </Button>
      </div>
    </Dialog>
  );
};

export default CancelOfferDialog;
