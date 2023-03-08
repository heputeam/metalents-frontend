import Dialog from '@/components/Dialog';
import React from 'react';
import styles from './index.less';
import { IDialogState, useDispatch, useSelector } from 'umi';
import MetamaskPNG from '@/assets/imgs/login/metamask.png';
import TransferSVG from '@/assets/imgs/wallet/transfer.svg';

const dialog_key = 'selectAddFundsDialog';
interface ISelectAddFundsDialogState {
  visible: boolean;
  params?: any;
}
export type ISelectAddFundsDialogProps = {};

const SelectAddFundsDialog: React.FC<ISelectAddFundsDialogProps> = ({}) => {
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: ISelectAddFundsDialogState = useSelector<
    any,
    IDialogState & ISelectAddFundsDialogState
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
  return (
    <Dialog
      visible={dialogState.visible}
      title="Select to add funds"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['select-addfunds-content']}>
        <div className={styles['tips']}>
          Add ERC-20 tokens to your wallet and no gas is required for all
          transactions on Metalents.
        </div>
        <div className={styles['addfunds-box']}>
          <div
            className={`${styles['matemask-box']}`}
            onClick={() => {
              handleClose();
              dispatch({
                type: 'dialog/show',
                payload: {
                  key: 'walletAddFundsDialog',
                  params: dialogState?.params,
                },
              });
            }}
          >
            <img src={MetamaskPNG} />
          </div>
          <div
            className={`${styles['transfer-box']}`}
            onClick={() => {
              handleClose();
              dispatch({
                type: 'dialog/show',
                payload: {
                  key: 'transferAddFundsDialog',
                  params: dialogState?.params,
                },
              });
            }}
          >
            <span className={styles['tip']}>Continue with</span>
            <img src={TransferSVG} />
            <span className={styles['tit']}>Transfer</span>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SelectAddFundsDialog;
