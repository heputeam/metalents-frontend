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

interface IRejectOfferDialogState {
  visible: boolean;
  offerId: number;
  onSuccess: () => void;
}
const dialog_key = 'rejectOfferDialog'; // dialog 唯一值

export type IRejectOfferDialogProps = {};

const CancelRequestDialog: React.FC<IRejectOfferDialogProps> = ({}) => {
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: IRejectOfferDialogState = useSelector<
    any,
    IDialogState & IRejectOfferDialogState
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
  const { loading, run: runRejectOffer } = useRequest(
    (params) => postOffersUpdate({ ...params }),
    {
      manual: true,
      onSuccess: (data: any) => {
        const { code } = data;
        if (code !== 200) {
          return Toast.error('Unknown system failure: Please try');
        }
        handleClose();
        dialogState?.onSuccess();
        Toast.success('Successfully rejected!');
      },
    },
  );
  const handleRejectOffer = () => {
    if (dialogState?.offerId) {
      runRejectOffer({
        offerId: dialogState?.offerId,
        status: OfferStatus.Reject,
      });
    }
  };
  return (
    <Dialog
      visible={dialogState.visible}
      title="Reject this offer"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['reject-offer-content']}>
        <img src={CancelRequestSVG} alt="" />
        <p>Are you sure you want to reject this seller's offer?</p>
        <Button
          loading={loading}
          variant="contained"
          size="large"
          style={{ width: '240px', height: '48px' }}
          onClick={handleRejectOffer}
        >
          Confirm
        </Button>
      </div>
    </Dialog>
  );
};

export default CancelRequestDialog;
