import Dialog from '@/components/Dialog';
import { IDialogState, useDispatch, useSelector, history } from 'umi';
import styles from './index.less';
import { ReactComponent as MintNFTSVG } from '@/assets/imgs/orders/mint-nft.svg';
import { Stack, Typography } from '@mui/material';
import Button from '@/components/Button';

interface IMintNFTDialogState {
  visible: boolean;
  orderId: number;
}

const DialogKey = 'MintNFTDialog'; // dialog 唯一值

const MintNFTDialog: React.FC = ({}) => {
  const dispatch = useDispatch();

  // 提取dialog 状态
  const dialogState: IMintNFTDialogState = useSelector<
    any,
    IDialogState & IMintNFTDialogState
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

  const handelMint = () => {
    handleClose();
    history.push(`/account/mint/${dialogState?.orderId}`);
  };

  return (
    <Dialog
      visible={dialogState.visible}
      title="Mint NFT"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['mint-NFT-content']}>
        <MintNFTSVG />
        <Typography mt={40} className={styles['content-des']}>
          You can mint the work you just confirmed into NFT.
        </Typography>
        <Typography className={styles['content-des']}>
          ETH and BSC are supported at present.
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          className={styles['btn-group']}
        >
          <Button variant="outlined" size="large" onClick={handleClose}>
            Later
          </Button>
          <Button variant="contained" size="large" onClick={handelMint}>
            Mint now
          </Button>
        </Stack>
      </div>
    </Dialog>
  );
};

export default MintNFTDialog;
