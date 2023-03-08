import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import MyRating from '@/components/Rating';
import React from 'react';
import { IDialogState, useDispatch, useSelector } from 'umi';
import styles from './index.less';

interface IOrderFileSubmissionDialogState {
  visible: boolean;
  scope: number;
  comment: string;
}

const dialog_key = 'viewCommentDialog';

const ViewCommentDialog: React.FC = () => {
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

  return (
    <Dialog
      visible={dialogState.visible}
      title="View Comments"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['view-comment-dialog']}>
        <div className={styles['rating']}>
          <MyRating
            value={dialogState?.scope}
            size={36}
            precision={1}
            showLabel
            readOnly
            ratingDirection="column"
            hideScope
          />
        </div>
        <div className={styles['comment']}>{dialogState?.comment}</div>

        <div className={styles['btns']}>
          <Button variant="contained" size="large" onClick={handleClose}>
            OK
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewCommentDialog;
