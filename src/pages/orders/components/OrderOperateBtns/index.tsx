import Button from '@/components/Button';
import {
  IOrderDetailsRes,
  ORDER_REASON_TYPE,
  ORDER_STATUS,
} from '@/service/orders/types';
import { Stack, Typography } from '@mui/material';
import React from 'react';
import messageSVG from '@/assets/imgs/orders/message.svg';
import StarSVG from '@/assets/imgs/seller/sidebar/star.svg';
import { ReactComponent as ArrowSVG } from '@/assets/imgs/orders/arrow.svg';
import styles from './index.less';
import { history, useDispatch, useSelector } from 'umi';
import moment from 'moment';
import SendMessage from '@/components/SendMessage';

const UploadFilesBtn: React.FC<{ orderId: number }> = ({ orderId }) => {
  const handleClick = () => {
    history.push(`/orders/details?id=${orderId}`);
  };
  return (
    <Button
      variant="contained"
      onClick={handleClick}
      className={styles['upload-btn']}
    >
      Upload files
    </Button>
  );
};

interface ISendMessageBtn {
  onClick?: () => void;
}
export interface IOrderOperateBtns {
  orderDetails: IOrderDetailsRes | undefined;
  reload?: () => void;
  userId: number;
  isList?: boolean;
}

const OrderOperateBtns: React.FC<IOrderOperateBtns> = ({
  orderDetails,
  reload,
  userId,
  isList = false,
}) => {
  const dispatch = useDispatch();

  const { config } = useSelector((state: any) => state.config);

  // 确认订单
  const handleConfirmService = () => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'confirmProductDialog',
        orderId: orderDetails?.id,
        reload: reload,
        isList: isList,
      },
    });
  };

  // 查看订单评价详情
  const handleViewComment = () => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'viewCommentDialog',
        scope: orderDetails?.scope,
        comment: orderDetails?.comment,
      },
    });
  };

  const handelMintNFT = () => {
    if (orderDetails?.id) {
      history.push(`/account/mint/${orderDetails.id}`);
    }
  };

  const handleCancel = (cancelType: ORDER_REASON_TYPE) => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'cancelOrderDialog',
        orderId: orderDetails?.id,
        cancelType: cancelType,
        txFee: orderDetails?.txFee,
        budget: orderDetails?.budgetAmount,
        coinId: orderDetails?.coinId,
        reload: reload,
      },
    });
  };

  const currentTime = moment(moment.now()).unix();

  const handleBuyerCancel = () => {
    if (orderDetails) {
      if (
        currentTime <
        orderDetails?.createdAt + orderDetails?.deliverTime * 86400
      ) {
        handleCancel(ORDER_REASON_TYPE.buyer_cancel);
      } else {
        handleCancel(ORDER_REASON_TYPE.overdue_cancel);
      }
    }
  };

  // 查看订单取消详情
  const handleCancelDetail = () => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'orderCancelDetailDialog',
        orderId: orderDetails?.id,
        sellerId: orderDetails?.sellerId,
        buyerId: orderDetails?.buyerId,
      },
    });
  };

  const handelReply = () => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'sellerReplyCancelDialog',
        orderId: orderDetails?.id,
        sellerId: orderDetails?.sellerId,
        buyerId: orderDetails?.buyerId,
        reload: reload,
      },
    });
  };

  // 卖家身份
  if (userId === orderDetails?.sellerId) {
    switch (orderDetails?.status) {
      case ORDER_STATUS.Paid: {
        return (
          <Stack direction="row" spacing={20}>
            <SendMessage
              targetId={orderDetails?.buyerId.toString()}
              svg={messageSVG}
              text="Send Message"
            />
            {isList && <UploadFilesBtn orderId={orderDetails?.id} />}
            {
              // 订单逾期则没有取消按钮
              currentTime <
                orderDetails?.createdAt + orderDetails?.deliverTime * 86400 && (
                <Button
                  variant="outlined"
                  onClick={() => handleCancel(ORDER_REASON_TYPE.seller_cancel)}
                >
                  Cancel
                </Button>
              )
            }
          </Stack>
        );
      }
      case ORDER_STATUS.Delivery: {
        return (
          <Stack direction="row" spacing={20}>
            <SendMessage
              targetId={orderDetails?.buyerId.toString()}
              svg={messageSVG}
              text="Send Message"
            />
            {isList && <UploadFilesBtn orderId={orderDetails?.id} />}
          </Stack>
        );
      }
      case ORDER_STATUS.Autocomplete:
      case ORDER_STATUS.Complete: {
        return (
          <Stack direction="row" spacing={20}>
            <SendMessage
              targetId={orderDetails?.buyerId.toString()}
              svg={messageSVG}
              text="Send Message"
            />
            {orderDetails?.scope ? (
              <Button variant="outlined" onClick={handleViewComment}>
                <img src={StarSVG} width={16} height={16} />
                <span className={styles['scope']}>
                  {orderDetails?.scope?.toFixed(1)}
                </span>
                View Comments
              </Button>
            ) : (
              <Button variant="outlined" disabled>
                No Comment
              </Button>
            )}
          </Stack>
        );
      }
      case ORDER_STATUS.Cancel: {
        return (
          <Stack direction="row" spacing={20}>
            <SendMessage
              targetId={orderDetails?.buyerId.toString()}
              svg={messageSVG}
              text="Send Message"
            />
            <Button
              variant="outlined"
              className={styles['cancel-detail']}
              onClick={handleCancelDetail}
            >
              Cancellation Detail
              <ArrowSVG className={styles['arrow']} />
            </Button>
          </Stack>
        );
      }
      case ORDER_STATUS.Applycancel: {
        return (
          <Stack direction="row" spacing={20}>
            <SendMessage
              targetId={orderDetails?.buyerId.toString()}
              svg={messageSVG}
              text="Send Message"
            />
            <Button
              variant="contained"
              style={{ background: '#3A68E0' }}
              onClick={handelReply}
            >
              Reply to cancellation
            </Button>
          </Stack>
        );
      }
      case ORDER_STATUS.Applycustomer: {
        return (
          <Stack direction="row" spacing={20}>
            <SendMessage
              targetId={orderDetails?.buyerId.toString()}
              svg={messageSVG}
              text="Send Message"
            />
            <Button
              variant="outlined"
              className={styles['cancel-detail']}
              onClick={handleCancelDetail}
            >
              Canceling
              <ArrowSVG className={styles['arrow']} />
            </Button>
          </Stack>
        );
      }
      default: {
        return <></>;
      }
    }
  }

  // 买家身份
  if (userId === orderDetails?.buyerId) {
    switch (orderDetails?.status) {
      case ORDER_STATUS.Paid: {
        return (
          <Stack direction="row" spacing={20}>
            <SendMessage
              targetId={orderDetails?.sellerId.toString()}
              svg={messageSVG}
              text="Send Message"
            />
            <Button variant="outlined" onClick={handleBuyerCancel}>
              Cancel
            </Button>
          </Stack>
        );
      }
      case ORDER_STATUS.Delivery: {
        return (
          <Stack direction="row" spacing={20}>
            <SendMessage
              targetId={orderDetails?.sellerId.toString()}
              svg={messageSVG}
              text="Send Message"
            />
            {orderDetails?.buyerCancelAt > 0 ? (
              orderDetails?.submissionCustomerServiceAt > 0 ? (
                <></>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() =>
                    handleCancel(ORDER_REASON_TYPE.apply_customer_service)
                  }
                >
                  Customer Service
                </Button>
              )
            ) : (
              <Button
                variant="outlined"
                onClick={() =>
                  handleCancel(ORDER_REASON_TYPE.apply_buyer_cancel)
                }
              >
                Cancel
              </Button>
            )}

            <Button
              variant="contained"
              style={{ background: '#3A68E0' }}
              onClick={handleConfirmService}
            >
              Confirm Service
            </Button>
          </Stack>
        );
      }
      case ORDER_STATUS.Autocomplete:
      case ORDER_STATUS.Complete: {
        return (
          <Stack direction="row" spacing={20}>
            <SendMessage
              targetId={orderDetails?.sellerId.toString()}
              svg={messageSVG}
              text="Send Message"
            />
            {orderDetails?.scope ? (
              <Button variant="outlined" onClick={handleViewComment}>
                <img src={StarSVG} width={16} height={16} />
                <span className={styles['scope']}>
                  {orderDetails?.scope?.toFixed(1)}
                </span>
                View Comments
              </Button>
            ) : (
              <Button variant="outlined" disabled>
                No Comment
              </Button>
            )}
            {!isList && (
              <Button variant="contained" onClick={handelMintNFT}>
                Mint NFT
              </Button>
            )}
          </Stack>
        );
      }
      case ORDER_STATUS.Cancel: {
        return (
          <Stack direction="row" spacing={20}>
            <SendMessage
              targetId={orderDetails?.sellerId.toString()}
              svg={messageSVG}
              text="Send Message"
            />
            <Button
              variant="outlined"
              className={styles['cancel-detail']}
              onClick={handleCancelDetail}
            >
              Cancellation Detail
              <ArrowSVG className={styles['arrow']} />
            </Button>
          </Stack>
        );
      }
      case ORDER_STATUS.Applycustomer:
      case ORDER_STATUS.Applycancel: {
        return (
          <Stack direction="row" spacing={20}>
            <SendMessage
              targetId={orderDetails?.sellerId.toString()}
              svg={messageSVG}
              text="Send Message"
            />
            <Button
              variant="outlined"
              className={styles['cancel-detail']}
              onClick={handleCancelDetail}
            >
              Canceling
              <ArrowSVG className={styles['arrow']} />
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmService}
              style={{ background: '#3A68E0' }}
            >
              Confirm Service
            </Button>
          </Stack>
        );
      }
      default: {
        return <></>;
      }
    }
  }
  return <></>;
};

export default OrderOperateBtns;
