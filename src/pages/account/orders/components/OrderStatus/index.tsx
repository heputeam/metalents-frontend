import { SxProps, Typography, Box } from '@mui/material';
import classNames from 'classnames';
import styles from './index.less';
import moment from 'moment';
import 'moment-precise-range-plugin';
import { ReactComponent as CheckSVG } from '@/assets/imgs/orders/check.svg';
import { ReactComponent as ClockSVG } from '@/assets/imgs/orders/clock.svg';
import { ReactComponent as ToReviewSVG } from '@/assets/imgs/orders/toReview.svg';
import { ReactComponent as MinusSVG } from '@/assets/imgs/orders/minus.svg';
import { ReactComponent as CloseSVG } from '@/assets/imgs/orders/close.svg';

export enum EOrderStatus {
  All,
  InProgress,
  ToReview,
  Completed,
  Refund,
  Canceled,
}

export type IOrderStatusProps = {
  sx?: SxProps;
  status: TOrderStatus;
  endTime: number;
  reviewTime: number;
  refundTime: number;
};

const OrderStatus: React.FC<IOrderStatusProps> = ({
  sx,
  status,
  endTime,
  reviewTime,
  refundTime,
}) => {
  // @ts-ignore
  const endTimeDiffObj = moment?.preciseDiff(moment(), moment(endTime), true);
  // @ts-ignore
  const reviewTimeDiffObj = moment?.preciseDiff(
    moment(),
    moment(reviewTime),
    true,
  );
  // @ts-ignore
  const refundTimeDiffObj = moment?.preciseDiff(
    moment(),
    moment(refundTime),
    true,
  );

  switch (status) {
    case 'completed':
      return (
        <Box sx={sx} className={styles['order-status-container']}>
          <CheckSVG />
          <Typography
            className={classNames(
              styles['status-text'],
              styles['status-text-completed'],
            )}
          >
            Completed
          </Typography>
        </Box>
      );

    case 'progress':
      return (
        <Box sx={sx} className={styles['order-status-container']}>
          <ClockSVG />
          <Typography
            className={classNames(
              styles['status-text'],
              styles['status-text-in-progress'],
            )}
          >
            In Progress ({endTimeDiffObj.years} years {endTimeDiffObj.months}{' '}
            months {endTimeDiffObj.days} days {endTimeDiffObj.hours} hours left)
          </Typography>
        </Box>
      );

    case 'review':
      return (
        <Box sx={sx} className={styles['order-status-container']}>
          <ToReviewSVG />
          <Typography
            className={classNames(
              styles['status-text'],
              styles['status-text-to-review'],
            )}
          >
            To Review ({reviewTimeDiffObj.years} years{' '}
            {reviewTimeDiffObj.months} months {reviewTimeDiffObj.days} days{' '}
            {reviewTimeDiffObj.hours} hours left)
          </Typography>
        </Box>
      );

    // case EOrderStatus.Refund:
    //   return (
    //     <Box sx={sx} className={styles['order-status-container']}>
    //       <MinusSVG />
    //       <Typography
    //         className={classNames(
    //           styles['status-text'],
    //           styles['status-text-refund'],
    //         )}
    //       >
    //         Refunding ({refundTimeDiffObj.years} years{' '}
    //         {refundTimeDiffObj.months} months {refundTimeDiffObj.days} days{' '}
    //         {refundTimeDiffObj.hours} hours left)
    //       </Typography>
    //     </Box>
    //   );

    case 'cancelled':
      return (
        <Box sx={sx} className={styles['order-status-container']}>
          <CloseSVG />
          <Typography
            className={classNames(
              styles['status-text'],
              styles['status-text-canceled'],
            )}
          >
            Canceled
          </Typography>
        </Box>
      );

    default:
      break;
  }

  return <div></div>;
};

export { OrderStatus };
