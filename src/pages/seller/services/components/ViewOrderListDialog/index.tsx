import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import Loading from '@/components/Loading';
import { getOrderFilter } from '@/service/orders';
import { IOrderFilter, ORDER_STATUS } from '@/service/orders/types';
import { IResponse } from '@/service/types';
import { getCurrentToken, toThousands } from '@/utils';
import { Grid, IconButton, Link } from '@mui/material';
import { useRequest } from 'ahooks';
import React, { useEffect } from 'react';
import { IDialogState, useDispatch, useSelector, history } from 'umi';
import styles from './index.less';

interface IViewOrderListDialogState {
  visible: boolean;
  proId: number;
  proType: number;
}
const dialog_key = 'viewOrderListDialog';
const ViewOrderListDialog: React.FC = () => {
  const dispatch = useDispatch();
  const dialogState: IViewOrderListDialogState = useSelector<
    any,
    IDialogState & IViewOrderListDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[dialog_key],
  }));

  const {
    data: orderData,
    loading,
    run: getOrder,
  } = useRequest<IResponse<IOrderFilter>, any>(
    (params: any) => getOrderFilter(params),
    {
      manual: true,
    },
  );

  useEffect(() => {
    if (dialogState?.proId && dialogState?.proType) {
      getOrder({
        offset: 0,
        pageSize: 50,
        proId: dialogState?.proId,
        proType: dialogState?.proType,
        status: [
          ORDER_STATUS.Paid,
          ORDER_STATUS.Delivery,
          ORDER_STATUS.Applycancel,
          ORDER_STATUS.Applycustomer,
        ],
      });
    }
  }, [dialogState?.proId, dialogState?.proType]);

  const { tokens } = useSelector((state: any) => state.coins);

  const handleClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };

  const handleDetail = (orderId: number) => {
    handleClose();
    history.push(`/orders/details?id=${orderId}`);
  };

  const getOrderStatus = (status: ORDER_STATUS) => {
    switch (status) {
      case ORDER_STATUS.Paid: {
        return 'In Progress';
      }
      case ORDER_STATUS.Delivery: {
        return 'To Review';
      }
      case ORDER_STATUS.Applycancel:
      case ORDER_STATUS.Applycustomer: {
        return 'Refunding';
      }
      default: {
        return 'Error Status';
      }
    }
  };

  return (
    <Dialog
      visible={dialogState.visible}
      title={`View order list (${Number(orderData?.data?.list?.length)})`}
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['view-order-list-dialog']}>
        <div className={styles['title']}>
          <div className={styles['item-title']} style={{ width: 156 }}>
            Buyer
          </div>
          <div className={styles['item-title']} style={{ width: 120 }}>
            Price
          </div>
          <div className={styles['item-title']} style={{ width: 120 }}>
            Status
          </div>
        </div>
        <div className={styles['order-list']}>
          {!loading &&
            orderData?.data?.list?.map((item) => {
              return (
                <div className={styles['order-item']} key={item?.orderId}>
                  <div className={styles['user-info']}>
                    <IconButton size="small">
                      <Avatar
                        src={
                          item?.buyerAvatar?.fileThumbnailUrl ||
                          item?.buyerAvatar?.fileUrl
                        }
                        size={36}
                      />
                    </IconButton>
                    <div className={styles['user-name']}>{item?.buyerName}</div>
                  </div>
                  <div className={styles['price']}>
                    {`${toThousands(item?.budgetAmount)} ${getCurrentToken(
                      item?.coinId || 1,
                      tokens,
                    )?.name?.toLocaleUpperCase()}`}
                  </div>
                  <div className={styles['status']}>
                    {getOrderStatus(item?.status)}
                  </div>
                  <Button
                    variant="outlined"
                    className={styles['btn']}
                    onClick={() => handleDetail(item?.orderId)}
                  >
                    Detail Page
                  </Button>
                </div>
              );
            })}
        </div>
        {loading && (
          <div className={styles['loading']}>
            <Loading className={styles['service-loading']} />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default ViewOrderListDialog;
