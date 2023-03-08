import { IOrderDetailsRes, ORDER_STATUS } from '@/service/orders/types';
import React, { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { ReactComponent as WaitingSVG } from '../../assets/imgs/waiting.svg';
import { ReactComponent as ProgressSVG } from '../../assets/imgs/progress.svg';
import { ReactComponent as ReviewSVG } from '../../assets/imgs/review.svg';
import { ReactComponent as CompletedSVG } from '../../assets/imgs/completed.svg';
import { ReactComponent as RefundingSVG } from '../../assets/imgs/refunding.svg';
import { ReactComponent as CanceledSVG } from '../../assets/imgs/canceled.svg';
import { useCountDown } from 'ahooks';
import { useSelector } from 'umi';

export interface IOrderStatusComponent {
  orderDetails: IOrderDetailsRes | undefined;
  reload?: () => void;
}

const OrderStatusComponent: React.FC<IOrderStatusComponent> = ({
  orderDetails,
  reload,
}) => {
  const { config } = useSelector((state: any) => state.config);

  const [targetDate, setTargetDate] = useState<number>();

  const [countdown, formattedRes] = useCountDown({
    targetDate,
    onEnd: () => {
      reload?.();
    },
  });
  const { days, hours, minutes, seconds } = formattedRes;

  const formatDaysTime = () => {
    if (days) {
      return `(${days} days ${hours} hours left)`;
    }
    if (!days && hours) {
      return `(${hours} hours ${minutes} minutes left)`;
    }
    if (!days && !hours && minutes) {
      return `(${minutes} minutes ${seconds} seconds left)`;
    }
    if (!days && !hours && !minutes && seconds) {
      return `(${seconds} seconds left)`;
    }
  };

  useEffect(() => {
    checkLeftTime();
  }, [orderDetails]);

  // 计算倒计时时间
  const checkLeftTime = () => {
    if (orderDetails) {
      // 正在处于提交客服阶段。客服倒计时
      if (
        orderDetails?.status === ORDER_STATUS.Applycustomer &&
        orderDetails?.submissionCustomerServiceAt > 0 &&
        orderDetails?.customerServiceReplyAt === 0
      ) {
        return setTargetDate(
          orderDetails?.submissionCustomerServiceAt * 1000 +
            Number(config?.DELIVERY_ORDER_WAITING_FOR_CUSTOMER?.cfgVal) *
              86400000,
        );
      }
      // 正在处于买家申请取消，等待卖家处理阶段。取消倒计时 status=6
      if (
        orderDetails?.status === ORDER_STATUS.Applycancel &&
        orderDetails?.buyerCancelAt > 0 &&
        orderDetails?.sellerReplyAt === 0
      ) {
        return setTargetDate(
          orderDetails?.buyerCancelAt * 1000 +
            Number(config?.DELIVERY_ORDER_BUYER_APPLY_CANCEL?.cfgVal) *
              86400000,
        );
      }
      // 待验收
      if (orderDetails?.status === ORDER_STATUS.Delivery) {
        return setTargetDate(
          orderDetails?.sellerFirstDeliverAt * 1000 +
            Number(config?.DELIVERY_ORDER_AUTO_COMPLETED?.cfgVal) * 86400000 +
            (orderDetails?.sellerReplyAt -
              orderDetails?.buyerCancelAt +
              (orderDetails?.customerServiceReplyAt -
                orderDetails?.submissionCustomerServiceAt)) *
              1000,
        );
      }
      // 进行中， 距离交付时间还多久、自动取消时间
      if (orderDetails?.status === ORDER_STATUS.Paid) {
        return setTargetDate(
          orderDetails?.createdAt * 1000 +
            (orderDetails?.deliverTime +
              Number(config?.ORDER_AUTO_CANCEL?.cfgVal)) *
              86400000,
        );
      }
    }
  };

  switch (orderDetails?.status) {
    case ORDER_STATUS.Paid: {
      return (
        <Stack direction="row" alignItems="center">
          <ProgressSVG />
          <Typography variant="h3" fontWeight={500} color="#FAC917" ml={10}>
            In Progress {formatDaysTime()}{' '}
          </Typography>
        </Stack>
      );
    }
    case ORDER_STATUS.Delivery: {
      return (
        <Stack direction="row" alignItems="center">
          <ReviewSVG />
          <Typography variant="h3" fontWeight={500} color="#E03A3A" ml={10}>
            To Review {formatDaysTime()}{' '}
          </Typography>
        </Stack>
      );
    }
    case ORDER_STATUS.Autocomplete:
    case ORDER_STATUS.Complete: {
      return (
        <Stack direction="row" alignItems="center">
          <CompletedSVG />
          <Typography variant="h3" fontWeight={500} color="#3AE090" ml={10}>
            Order Completed
          </Typography>
        </Stack>
      );
    }
    case ORDER_STATUS.Cancel: {
      return (
        <Stack direction="row" alignItems="center">
          <CanceledSVG />
          <Typography variant="h3" fontWeight={500} color="#999999" ml={10}>
            Canceled
          </Typography>
        </Stack>
      );
    }

    case ORDER_STATUS.Applycancel:
    case ORDER_STATUS.Applycustomer: {
      return (
        <Stack direction="row" alignItems="center">
          <RefundingSVG />
          <Typography variant="h3" fontWeight={500} color="#E03A3A" ml={10}>
            Refunding {formatDaysTime()}
          </Typography>
        </Stack>
      );
    }
    case ORDER_STATUS.Waiting:
    default: {
      return (
        <Stack direction="row" alignItems="center">
          <WaitingSVG />
          <Typography variant="h3" color="#FAC917" ml={10}>
            Waiting for confirmation
          </Typography>
        </Stack>
      );
    }
  }
};

export default OrderStatusComponent;
