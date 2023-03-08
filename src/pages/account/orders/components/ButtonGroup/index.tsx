import Button from '@/components/Button';
import { Stack, Typography } from '@mui/material';
import { EOrderStatus } from '../OrderStatus';
import styles from './index.less';
import MessageSVG from '@/assets/imgs/request/message.svg';
import { ReactComponent as StarSVG } from '@/assets/imgs/orders/star.svg';
import { ReactComponent as DoubleRightArrowsSVG } from '@/assets/imgs/orders/doubleRightArrows.svg';
import classNames from 'classnames';

interface IButtonGroupProps {
  status: EOrderStatus;
}

const ButtonGroup: React.FC<IButtonGroupProps> = ({ status }) => {
  const SendMessageBtn = () => (
    <Button
      variant="contained"
      rounded
      startIcon={<img src={MessageSVG}></img>}
      onClick={() => {
        alert('待后续迭代接入 IM聊天工具');
      }}
    >
      Send Message
    </Button>
  );

  const CancelBtn = () => (
    <Button variant="outlined" classes={{ root: styles['button'] }}>
      Cancel
    </Button>
  );

  const CustomerServiceBtn = () => (
    <Button
      variant="outlined"
      classes={{
        root: classNames(styles['button'], styles['customer-service-button']),
      }}
    >
      Customer Service
    </Button>
  );

  const ConfirmServiceBtn = () => (
    <Button
      variant="contained"
      classes={{
        root: classNames(styles['button'], styles['confirm-service-button']),
      }}
    >
      Confirm Service
    </Button>
  );

  const ViewCommentsBtn = () => (
    <Button
      variant="outlined"
      classes={{ root: styles['view-comments-button'] }}
    >
      <StarSVG />
      <Typography className={styles['rating']}>5.0</Typography>
      <Typography className={styles['str-view-comments']}>
        View Comments
      </Typography>
    </Button>
  );

  const NoCommentFakeBtn = () => (
    <div className={classNames(styles['button'], styles['no-comment-button'])}>
      No Comment
    </div>
  );

  const CancelingBtn = () => (
    <Button
      variant="outlined"
      classes={{
        root: styles['button'],
      }}
    >
      Canceling
      <DoubleRightArrowsSVG />
    </Button>
  );

  const CancelDetailBtn = () => (
    <Button
      variant="outlined"
      classes={{
        root: styles['button'],
      }}
    >
      Cancellation Detail
      <DoubleRightArrowsSVG />
    </Button>
  );

  switch (status) {
    case EOrderStatus.InProgress:
      return (
        <Stack direction="row" spacing={10}>
          {/* <SendMessageBtn /> */}
          <CancelBtn />
        </Stack>
      );

    case EOrderStatus.ToReview:
      return (
        <Stack direction="row" spacing={10}>
          {/* <SendMessageBtn /> */}
          {(Math.floor(Date.now() / 60000) % 60) % 2 === 0 ? (
            <CancelBtn />
          ) : (
            <CustomerServiceBtn />
          )}
          <ConfirmServiceBtn />
        </Stack>
      );

    case EOrderStatus.Completed:
      return (
        <Stack direction="row" spacing={10}>
          {/* <SendMessageBtn /> */}
          {(Math.floor(Date.now() / 60000) % 60) % 2 === 0 ? (
            <ViewCommentsBtn />
          ) : (
            <NoCommentFakeBtn />
          )}
        </Stack>
      );

    case EOrderStatus.Refund:
      return (
        <Stack direction="row" spacing={10}>
          {/* <SendMessageBtn /> */}
          <CancelingBtn />
          <ConfirmServiceBtn />
        </Stack>
      );

    case EOrderStatus.Canceled:
      return (
        <Stack direction="row" spacing={10}>
          {/* <SendMessageBtn /> */}
          <CancelDetailBtn />
        </Stack>
      );

    default:
      return <></>;
  }
};

export default ButtonGroup;
