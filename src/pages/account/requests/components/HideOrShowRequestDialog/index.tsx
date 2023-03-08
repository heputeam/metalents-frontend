import Dialog from '@/components/Dialog';
import { IDialogState, useDispatch, useSelector } from 'umi';
import styles from './index.less';
import EyeShowingSVG from '@/assets/imgs/account/requests/eyeShowing.svg';
import EyeHiddenSVG from '@/assets/imgs/account/requests/eyeHidden.svg';
import Button from '@/components/Button';
import { UserRequestsVisibility } from '@/service/user/types';

interface IHideOrShowRequestDialogState {
  visible: boolean;
  type: UserRequestsVisibility;
  title: string;
  content: React.ReactNode;
  loading: boolean;
  handleConfirm: () => void;
  btnText: string;
}

const DialogKey = 'HideOrShowRequestDialog'; // dialog 唯一值

const HideOrShowRequestDialog: React.FC = () => {
  const dispatch = useDispatch();

  // 提取dialog 状态
  const dialogState: IHideOrShowRequestDialogState = useSelector<
    any,
    IDialogState & IHideOrShowRequestDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[DialogKey],
  }));

  // 关闭 dialog
  const handleClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: DialogKey,
      },
    });
  };

  const handleClick = () => {
    dialogState?.handleConfirm();
    handleClose();
  };

  return (
    <Dialog
      visible={dialogState.visible}
      title={`${
        dialogState?.type === UserRequestsVisibility.HIDDEN ? 'Hide' : 'Show'
      } ${dialogState?.title}`}
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['cancel-request-content']}>
        {dialogState?.type === UserRequestsVisibility.HIDDEN ? (
          <img src={EyeHiddenSVG} alt="" />
        ) : (
          <img src={EyeShowingSVG} alt="" />
        )}

        {dialogState?.content}

        <Button
          loading={dialogState?.loading}
          variant="contained"
          size="large"
          style={{ width: '240px', height: '48px' }}
          onClick={handleClick}
        >
          {dialogState?.btnText}
        </Button>
      </div>
    </Dialog>
  );
};

export { HideOrShowRequestDialog, DialogKey };
