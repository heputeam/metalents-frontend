import Dialog from '@/components/Dialog';
import React from 'react';
import { IDialogState, useDispatch, useSelector } from 'umi';
import styles from './index.less';

interface IOperateServiceDialogState {
  visible: boolean;
}
export interface IOperateServiceDialog {
  title: string;
  content: React.ReactChild;
}

export const operate_service_dialog_key = 'operateServiceDialog'; // dialog 唯一值
const OperateServiceDialog: React.FC<IOperateServiceDialog> = ({
  title,
  content,
}) => {
  const dispatch = useDispatch();

  // 提取dialog 状态
  const dialogState: IOperateServiceDialogState = useSelector<
    any,
    IDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[operate_service_dialog_key],
  }));
  // 关闭 dialog
  const handleClose = (opt?: {}) => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: operate_service_dialog_key,
        ...opt,
      },
    });
  };

  return (
    <Dialog
      visible={dialogState.visible}
      title={title}
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['dialog-content']}>{content}</div>
    </Dialog>
  );
};

export default OperateServiceDialog;
