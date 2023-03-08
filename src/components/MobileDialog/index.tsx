import { Dialog as MuiDialog } from '@mui/material';
import { IDialogState, useDispatch, useLocation, useSelector } from 'umi';
import styles from './index.less';
import MobilePNG from '@/assets/imgs/home/mobile.png';

const dialog_key = 'mobileDialog'; // dialog 唯一值
export type MobileDialogProps = {};

const MobileDialog: React.FC<MobileDialogProps> = ({}) => {
  const { query } = useLocation() as any;
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState = useSelector<any, IDialogState>(({ dialog }) => ({
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
    <MuiDialog
      disableEscapeKeyDown
      onClose={() => console.log('close')}
      open={dialogState?.visible}
      classes={{ root: styles['dailog-root'], paper: styles['paper'] }}
    >
      <div className={styles['content']}>
        <img src={MobilePNG} height={163} />
        <div className={styles['text']}>
          Mobile version is coming soon, please use the desktop version for now
        </div>
      </div>
    </MuiDialog>
  );
};
export default MobileDialog;
