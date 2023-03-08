import Dialog from '@/components/Dialog';
import React from 'react';
import { IDialogState, useDispatch, useSelector } from 'umi';
import styles from './index.less';
import CancelRequestSVG from '@/assets/imgs/request/cancel_request.svg';
import Button from '@/components/Button';
import { useRequest } from 'ahooks';
import { Toast } from '@/components/Toast';
import { postRequestsCancel } from '@/service/requests';

interface ICancelRequestDialogState {
  visible: boolean;
  requestId: number;
  onSuccess?: () => void;
}

const dialog_key = 'cancelRequestDialog'; // dialog 唯一值

export type ICancelRequestDialogProps = {};

const CancelRequestDialog: React.FC<ICancelRequestDialogProps> = ({}) => {
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: ICancelRequestDialogState = useSelector<
    any,
    IDialogState & ICancelRequestDialogState
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
  const { loading, run: cancelRequest } = useRequest(
    (params) => postRequestsCancel({ ...params }),
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
    if (dialogState?.requestId) {
      cancelRequest({ requestId: dialogState?.requestId });
    }
  };
  return (
    <Dialog
      visible={dialogState.visible}
      title="Cancel the request"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['cancel-request-content']}>
        <img src={CancelRequestSVG} alt="" />
        <p>Are you sure you want to cancel this request?</p>
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

export default CancelRequestDialog;
