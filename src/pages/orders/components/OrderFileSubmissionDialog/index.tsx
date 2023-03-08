import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import { IFile } from '@/types';
import { Stack, Typography } from '@mui/material';
import React from 'react';
import { IDialogState, useDispatch, useSelector } from 'umi';
import styles from './index.less';

interface IOrderFileSubmissionDialogState {
  visible: boolean;
  content: string;
  deliverDocs?: IFile;
  orderId?: number;
  onSuccess?: () => void;
}

const dialog_key = 'orderFileSubmissionDialog';

const OrderFileSubmissionDialog: React.FC = () => {
  const dispatch = useDispatch();
  const dialogState: IOrderFileSubmissionDialogState = useSelector<
    any,
    IDialogState & IOrderFileSubmissionDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[dialog_key],
  }));

  const handleClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };

  const handleConfirm = () => {
    dialogState?.onSuccess?.();
    handleClose();
  };

  return (
    <Dialog
      visible={dialogState.visible}
      title="Confirm submission"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['file-submission-dialog']}>
        <div className={styles['content']}>{dialogState?.content}</div>
        <Stack
          direction="row"
          justifyContent="space-between"
          className={styles['btns']}
        >
          <Button variant="outlined" size="large" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" size="large" onClick={handleConfirm}>
            Confirm
          </Button>
        </Stack>
      </div>
    </Dialog>
  );
};

export default OrderFileSubmissionDialog;
