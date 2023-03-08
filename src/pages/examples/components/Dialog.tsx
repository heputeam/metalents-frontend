import { IDialogState } from '@/models/dialog';
import { Box, Button } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'umi';
import Dialog from '@/components/Dialog';

export type IExamDialogProps = {};

interface IExamDialogState {
  visible: boolean;
}
const dialog_key = 'examDialog'; // dialog 唯一值
export const ExamDialog: React.FC<IExamDialogProps> = () => {
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: IExamDialogState = useSelector<any, IDialogState>(
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

  return (
    <Dialog
      visible={dialogState.visible}
      title="Create an account"
      onClose={handleClose}
      // backBtn={<div />}
      onBack={() => {
        alert('自行填写事件');
      }}
    >
      {/* // 演示用 */}
      <Box sx={{ height: 300, width: 600 }}></Box>
    </Dialog>
  );
};

// 演示Dialog demo
const DialogExample = () => {
  const dispatch = useDispatch();
  return (
    <>
      <Button
        onClick={() => {
          // 状态控制开启
          dispatch({
            type: 'dialog/show',
            payload: {
              key: 'examDialog',
            },
          });
        }}
        variant="contained"
        size="small"
      >
        Show dialog
      </Button>
      {/* 父层挂载即可 */}
      <ExamDialog />
    </>
  );
};

export default DialogExample;
