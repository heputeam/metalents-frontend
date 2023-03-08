import Dialog from '@/components/Dialog';
import React from 'react';
import styles from './index.less';
import { IDialogState, useDispatch, useSelector } from 'umi';
import PersonSVG from '@/assets/imgs/wallet/person.svg';
import Button from '@/components/Button';

const dialog_key = 'addFundsSuccessDialog';
interface IAddFundsSuccessDialogState {
  visible: boolean;
  amountAndToken: string;
  params?: any;
  fromPay?: boolean;
}
export type IAddFundsSuccessProps = {};

const AddFundsSuccess: React.FC<IAddFundsSuccessProps> = ({}) => {
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: IAddFundsSuccessDialogState = useSelector<
    any,
    IDialogState & IAddFundsSuccessDialogState
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
  const handleAddMore = () => {
    handleClose();
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'selectAddFundsDialog',
        params: dialogState?.params,
      },
    });
  };
  const handleToPay = () => {
    handleClose();
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'paymentDialog',
        params: dialogState?.params,
      },
    });
  };
  const handleOk = () => {
    handleClose();
  };
  return (
    <Dialog
      visible={dialogState?.visible}
      title="Congratulations"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['addfunds-success-content']}>
        <img src={PersonSVG} />
        <span>
          Successfully added {dialogState?.amountAndToken} to your account!
        </span>
        <div className={styles['buttons-box']}>
          <Button
            variant="outlined"
            size="large"
            style={{ width: '220px' }}
            onClick={handleAddMore}
          >
            Add more
          </Button>

          {dialogState?.params ? (
            <Button
              variant="contained"
              size="large"
              style={{ width: '220px' }}
              onClick={handleToPay}
            >
              Continue to pay
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              style={{ width: '220px' }}
              onClick={handleOk}
            >
              OK
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default AddFundsSuccess;
