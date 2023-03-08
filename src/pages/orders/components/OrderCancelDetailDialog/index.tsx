import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import Loading from '@/components/Loading';
import Toast from '@/components/Toast';
import { IOrderReasons } from '@/service/general/types';
import { getOrderCancelDetails } from '@/service/orders';
import { IOrderCancelDetailsRes } from '@/service/orders/types';
import { IResponse } from '@/service/types';
import { Typography } from '@mui/material';
import { useRequest } from 'ahooks';
import React, { useEffect, useState } from 'react';
import { IDialogState, useDispatch, useSelector } from 'umi';
import styles from './index.less';
import { ReactComponent as TimeOutSVG } from '@/assets/imgs/orders/time-out.svg';

interface IOrderFileSubmissionDialogState {
  visible: boolean;
  sellerId: number;
  buyerId: number;
  orderId: number;
}

const dialog_key = 'orderCancelDetailDialog';

const OrderCancelDetailDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { orderReasons } = useSelector((state: any) => state.orderReasons);
  const [reason, setReason] = useState<string>('');
  const [cancelType, setCancelType] = useState<'auto' | 'manual' | ''>('auto');

  const dialogState: IOrderFileSubmissionDialogState = useSelector<
    any,
    IDialogState & IOrderFileSubmissionDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[dialog_key],
  }));

  const [title, setTitle] = useState<string>('');
  const {
    data: cancelDetailData,
    loading,
    run: getCancelDetail,
  } = useRequest<IResponse<IOrderCancelDetailsRes>, any>(
    (params) => getOrderCancelDetails(params),
    {
      manual: true,
      onSuccess: (res: any) => {
        const { code } = res;
        if (code === 20407) {
          setCancelType('auto');
        } else if (code === 200) {
          setCancelType('manual');
        } else {
          Toast.error('Unknown system failure: Please try');
        }
      },
    },
  );

  useEffect(() => {
    if (cancelType === 'auto') {
      setTitle('Order timed out and cancelled');
    } else if (dialogState?.sellerId && cancelDetailData?.data?.userId) {
      if (cancelDetailData?.data?.userId === dialogState?.sellerId) {
        setTitle('Seller cancel the order');
      } else {
        setTitle('Buyer cancel the order');
      }
    }
  }, [cancelType, cancelDetailData?.data?.userId, dialogState?.sellerId]);

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

  return (
    <Dialog
      visible={dialogState.visible}
      title={loading ? '' : title}
      onClose={handleClose}
      backBtn={<div />}
    >
      {loading ? (
        <div className={styles['loading-container']}>
          <Loading className={styles['loading']} />
          <Typography color="#444444" sx={{ mt: 20 }}>
            Loading...
          </Typography>
        </div>
      ) : (
        <>
          {cancelType === 'auto' ? (
            <div className={styles['time-out-dialog']}>
              <TimeOutSVG />
              <Typography variant="body1" className={styles['overdue']}>
                The submission is overdue.
              </Typography>
              <div className={styles['btns']}>
                <Button variant="contained" size="large" onClick={handleClose}>
                  OK
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles['cancel-detail-dialog']}>
              <Typography variant="body1" className={styles['label']}>
                Reason for cancellation
              </Typography>
              <div className={styles['reason']}>{reason}</div>
              <Typography
                variant="body1"
                className={styles['label']}
                sx={{ mt: 40 }}
              >
                Message
              </Typography>
              <div className={styles['reason']}>
                {cancelDetailData?.data?.message}
              </div>

              <div className={styles['btns']}>
                <Button variant="contained" size="large" onClick={handleClose}>
                  OK
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Dialog>
  );
};

export default OrderCancelDetailDialog;
