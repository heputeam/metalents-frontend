import React from 'react';
import styles from './index.less';
import { Dialog as MUIDialog, IconButton } from '@mui/material';
import CloseSVG from './assets/close.svg';
import BackSVG from './assets/back.svg';

interface IHeaderBackProps {
  backText?: string;
  onBack?: () => void;
  backBtn?: React.ReactNode; // 可覆盖
}

const HeaderBack: React.FC<IHeaderBackProps> = ({
  backText = 'Back',
  onBack,
  backBtn,
}) => {
  return (
    <div className={styles['dialog-header-back']}>
      {backBtn || (
        <div
          className={styles['back-btn']}
          onClick={() => {
            onBack?.();
          }}
        >
          <img src={BackSVG} alt="back" />
          <span>{backText}</span>
        </div>
      )}
    </div>
  );
};
interface IHeaderCloseProps {
  onClose?: () => void;
  closeBtn?: React.ReactNode; // 可覆盖
}

const HeaderClose: React.FC<IHeaderCloseProps> = ({ onClose, closeBtn }) => {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className={styles['dialog-header-close']}>
      {closeBtn || (
        <IconButton
          className={styles['close-btn']}
          onClick={handleClose}
          size="small"
        >
          <img src={CloseSVG} alt="back" />
        </IconButton>
      )}
    </div>
  );
};
export type IDialogHeaderProps = IHeaderBackProps &
  IHeaderCloseProps & {
    title: string;
  };
const DialogHeader: React.FC<IDialogHeaderProps> = (props) => {
  const { title } = props;
  return (
    <div className={styles['dialog-header']}>
      <div className={styles['dialog-header-options']}>
        <HeaderBack {...props} />
        <HeaderClose {...props} />
      </div>

      <div className={styles['dialog-header-title']}>
        <h5>{title}</h5>
      </div>
    </div>
  );
};

export interface IDialogProps extends IDialogHeaderProps {
  visible: boolean;
}

const Dialog: React.FC<IDialogProps> = (props) => {
  const { children, visible } = props;

  return (
    <MUIDialog
      open={!!visible}
      sx={{ background: 'none' }}
      classes={{
        root: styles['dialog-root'],
        paper: styles['dialog-paper'],
      }}
    >
      <DialogHeader {...props} />
      <div className={styles['dialog-content']}>{children}</div>
    </MUIDialog>
  );
};

export default Dialog;
