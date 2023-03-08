import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import Toast from '@/components/Toast';
import { IOrderReasons } from '@/service/general/types';
import { getOrderCancelDetails, postOrderSellerAccept } from '@/service/orders';
import { IOrderCancelDetailsRes } from '@/service/orders/types';
import { IResponse } from '@/service/types';
import { Typography } from '@mui/material';
import { useRequest } from 'ahooks';
import React, { useEffect, useState } from 'react';
import { IDialogState, useDispatch, useSelector } from 'umi';
import styles from './index.less';

interface IOrderFileSubmissionDialogState {
  visible: boolean;
  sellerId: number;
  buyerId: number;
  orderId: number;
  reload?: () => void;
}

const dialog_key = 'sellerReplyCancelDialog';

const SellerReplyCancelDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { orderReasons } = useSelector((state: any) => state.orderReasons);
  const [reason, setReason] = useState<string>('');
  const [replyType, setReplyType] = useState<'accept' | 'reject' | ''>('');

  const dialogState: IOrderFileSubmissionDialogState = useSelector<
    any,
    IDialogState & IOrderFileSubmissionDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[dialog_key],
  }));

  // 获取订单取消的详情信息
  const { data: cancelDetailData, run: getCancelDetail } = useRequest<
    IResponse<IOrderCancelDetailsRes>,
    any
  >((params) => getOrderCancelDetails(params), {
    manual: true,
    onSuccess: (res: any) => {},
  });

  // 卖家回复
  const {
    data,
    loading,
    run: sellerReply,
  } = useRequest((params) => postOrderSellerAccept(params), {
    manual: true,
    onSuccess: (res: any) => {
      const { code, data } = res;
      if (code === 200 && data?.success) {
        handleClose();
        dialogState?.reload?.();
      } else {
        Toast.error('Unknown system failure: Please try');
      }
    },
  });

  useEffect(() => {
    if (cancelDetailData?.data?.reasonId && orderReasons) {
      const reasonObj = orderReasons?.filter(
        (item: IOrderReasons) => item?.id === cancelDetailData?.data?.reasonId,
      );
      setReason(reasonObj?.[0]?.reason);
    }
  }, [cancelDetailData?.data?.reasonId]);

  useEffect(() => {
    if (dialogState.orderId) {
      getCancelDetail(dialogState?.orderId);
    }
  }, [dialogState.orderId]);

  const handleClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };

  const handleReply = (accept: boolean) => {
    if (accept) {
      setReplyType('accept');
    } else {
      setReplyType('reject');
    }
    const tempVal = {
      accept: accept,
      orderId: dialogState?.orderId,
    };
    sellerReply(tempVal);
  };

  return (
    <Dialog
      visible={dialogState.visible}
      title={`${
        cancelDetailData?.data?.userId === dialogState?.sellerId
          ? 'Seller'
          : 'Buyer'
      } cancel the order`}
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['seller-reply-dialog']}>
        <Typography variant="body1" className={styles['label']}>
          Reason for cancellation
        </Typography>
        <div className={styles['reason']}>{reason}</div>
        <Typography variant="body1" className={styles['label']} sx={{ mt: 40 }}>
          Message
        </Typography>
        <div className={styles['reason']}>
          {cancelDetailData?.data?.message}
        </div>

        <div className={styles['btns']}>
          <Button
            loading={replyType === 'reject' && loading}
            disabled={replyType === 'accept' && loading}
            variant="outlined"
            size="large"
            onClick={() => handleReply(false)}
          >
            Reject
          </Button>
          <Button
            loading={replyType === 'accept' && loading}
            disabled={replyType === 'reject' && loading}
            variant="contained"
            size="large"
            onClick={() => handleReply(true)}
          >
            Accept
          </Button>
        </div>
        <div className={styles['info']}>
          Once you accept, the order will be cancelled.
          <br />
          If you reject the application, the order will be{' '}
          <strong>returned to the To Review status</strong> and automatically
          completed.
        </div>
      </div>
    </Dialog>
  );
};

export default SellerReplyCancelDialog;
