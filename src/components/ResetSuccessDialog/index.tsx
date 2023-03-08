import React from 'react';
import { IDialogState, useDispatch, useSelector } from 'umi';
import Dialog from '../Dialog';
import styles from './index.less';
import ResetSuccessSVG from '@/assets/imgs/login/resetSuccess.svg';
import Button from '../Button';

export type IResetSuccessDialogProps = {};

interface IResetSuccessDialogState {
  visible: boolean;
}
const dialog_key = 'resetSuccessDialog'; // dialog 唯一值
const ResetSuccessDialog: React.FC<IResetSuccessDialogProps> = ({}) => {
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: IResetSuccessDialogState = useSelector<any, IDialogState>(
    ({ dialog }) => ({
      visible: false,
      ...dialog?.[dialog_key],
    }),
  );
  // 关闭 dialog
  const handleClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };
  const handleLogin = () => {
    handleClose();
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'loginDialog',
      },
    });
  };
  return (
    <Dialog
      visible={dialogState.visible}
      title="Reset  Successfully"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['reset-success-content']}>
        <img src={ResetSuccessSVG} alt="" width={80} />
        <div className={styles['tips-content']}>
          <span className={styles['tips']}>
            Your password has been reset and you need to log in again.
          </span>
          <span className={styles['login-button']} onClick={handleLogin}>
            Log in here
          </span>
        </div>
        <Button
          onClick={handleClose}
          variant="contained"
          type="submit"
          size="large"
          style={{
            width: '240px',
            height: '48px',
          }}
        >
          Confirm
        </Button>
      </div>
    </Dialog>
  );
};

export default ResetSuccessDialog;
