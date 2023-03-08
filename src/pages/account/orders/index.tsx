import styles from './index.less';
import { Box, Container, Stack, Typography } from '@mui/material';
import classNames from 'classnames';
import { useState } from 'react';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import { useGetOrders } from '@/hooks/useUser';
import Loading from '@/components/Loading';
import DateRang from '@/components/Wallet/components/DateRang';
import DateSVG from '@/assets/imgs/wallet/date.svg';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { DateRange as DateRangeType } from '@mui/x-date-pickers-pro/DateRangePicker';
import moment from 'moment';
import PersonSVG from '@/assets/imgs/request/person.svg';
import OrderCard from '@/pages/seller/orders/components/OrderCard';
import { ORDER_STATUS } from '@/service/orders/types';
import PreviewDialog from '@/pages/request/components/PreviewDialog';
import ConfirmProductDialog from '@/pages/orders/components/ConfirmProductDialog';
import OrderCancelDetailDialog from '@/pages/orders/components/OrderCancelDetailDialog';
import SellerReplyCancelDialog from '@/pages/orders/components/SellerReplyCancelDialog';
import CancelOrderDialog from '@/pages/orders/components/CancelOrderDialog';
import ViewCommentDialog from '@/pages/orders/components/ViewCommentDialog';

export type IOrdersProps = {};

const Orders: React.FC<IOrdersProps> = ({}) => {
  const [filter, setFilter] = useState<{
    val: ORDER_STATUS[] | [];
    valLabel: string;
  }>({
    val: [],
    valLabel: '',
  });

  const [value, setValue] = useState<DateRangeType<Date>>([null, null]);
  const [valueStr, setValueStr] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<{
    startTime?: number;
    endTime?: number;
  }>({
    startTime: undefined,
    endTime: undefined,
  });
  const handleClear = () => {
    setValue([null, null]);
  };
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const handleConfirm = () => {
    setAnchorEl(null);
    const starAt = value[0] ? moment(value[0]).format('D MMM') : null;
    const endAt = value[1] ? moment(value[1]).format('D MMM') : null;
    if (starAt && endAt && starAt !== endAt) {
      setValueStr(`From ${starAt} to ${endAt}`);
      setDateFilter({
        startTime: moment(value[0]).unix(),
        endTime: moment(value[1]).unix(),
      });

      getOrders({
        startTime: moment(value[0]).unix(),
        endTime: moment(value[1]).unix(),
        seller: false,
        sortBy: 1,
        pageSize: 5,
        status: filter,
        current: 1,
      });
    } else {
      setValueStr('');
      setDateFilter({
        startTime: undefined,
        endTime: undefined,
      });

      getOrders({
        seller: false,
        sortBy: 1,
        pageSize: 5,
        status: filter,
        current: 1,
      });
    }
  };

  const {
    pagination,
    run: getOrders,
    refresh: refreshOrders,
    data: orders,
    loading: isOrdersLoading,
  } = useGetOrders({
    defaultParams: [
      {
        ...dateFilter,
        seller: false,
        sortBy: 1,
        pageSize: 5,
        status: {
          val: [],
          valLabel: '',
        },
        current: 1,
      },
    ],
    onSuccess: (data) => {
      console.log('>>> data: ', data);
    },
  });

  const filterBtnLabels: Record<
    string,
    { val: ORDER_STATUS[]; valLabel: string }
  > = {
    'All Orders': {
      val: [],
      valLabel: '',
    },
    'In Progress': {
      val: [ORDER_STATUS.Paid],
      valLabel: 'progress',
    },
    'To Review': {
      val: [ORDER_STATUS.Delivery],
      valLabel: 'review',
    },
    Completed: {
      val: [ORDER_STATUS.Autocomplete, ORDER_STATUS.Complete],
      valLabel: 'completed',
    },
    'Refund/Canceled': {
      val: [
        ORDER_STATUS.Applycancel,
        ORDER_STATUS.Applycustomer,
        ORDER_STATUS.Cancel,
      ],
      valLabel: 'cancelled',
    },
  };

  return (
    <Container className={styles['container']}>
      <div className={styles['row-1']}>
        <Typography variant="h2" className={styles['title']}>
          My Orders
        </Typography>

        <div className={styles['date-range']}>
          <DateRang
            prefix={<img src={DateSVG} alt="" />}
            showItemStr={valueStr ? valueStr : 'Date range'}
            valueStr={valueStr}
            title="Date range"
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
          >
            <div className={styles['select-container']}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <StaticDateRangePicker
                  displayStaticWrapperAs="desktop"
                  calendars={1}
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  renderInput={() => <></>}
                />
              </LocalizationProvider>

              <Box className={styles['buttonGroup']}>
                <span onClick={handleClear}>Clear all</span>
                <Button
                  onClick={handleConfirm}
                  variant="contained"
                  rounded
                  sx={{
                    width: 100,
                    height: 28,
                  }}
                >
                  {value.every((v) => v) &&
                  value[0]?.toString() !== value[1]?.toString()
                    ? 'Confirm'
                    : 'Cancel'}
                </Button>
              </Box>
            </div>
          </DateRang>
        </div>
      </div>

      <Stack direction="row" className={styles['filter-btn-group']}>
        {Object.keys(filterBtnLabels)
          .filter((key) => {
            return typeof key === 'string';
          })
          .slice(0, 5)
          .map((item) => {
            return (
              <Button
                key={item}
                size="large"
                variant={
                  filter?.valLabel === filterBtnLabels[item]?.valLabel
                    ? 'contained'
                    : 'outlined'
                }
                className={`${classNames(
                  styles['filter-btn'],
                  filter?.valLabel === filterBtnLabels[item]?.valLabel
                    ? styles['active']
                    : '',
                )} `}
                onClick={() => {
                  setFilter(filterBtnLabels[item]);
                  getOrders({
                    ...dateFilter,
                    seller: false,
                    sortBy: 1,
                    pageSize: 5,
                    status: filterBtnLabels[item],
                    current: 1,
                  });
                }}
              >
                {`${item} ${
                  orders?.overview?.[filterBtnLabels[item]?.valLabel]
                    ? `(${orders?.overview?.[filterBtnLabels[item]?.valLabel]})`
                    : `(0)`
                }`}
              </Button>
            );
          })}
      </Stack>

      {isOrdersLoading ? (
        <div className={styles['loading-box']}>
          <Loading />
        </div>
      ) : orders?.list && orders.list.length > 0 ? (
        <>
          <Stack spacing={20}>
            {orders.list.map((order) => (
              <OrderCard
                key={order?.id}
                detailData={order}
                reload={refreshOrders}
              />
            ))}
          </Stack>

          {pagination.total > pagination.pageSize && (
            <div className={styles['pagination-container']}>
              <Pagination
                total={pagination.total}
                size={pagination.pageSize}
                current={pagination.current}
                onChange={(_, targetPage) => {
                  pagination.changeCurrent(targetPage);
                }}
              />
            </div>
          )}
        </>
      ) : (
        <div className={styles['empty-box']}>
          <img src={PersonSVG} alt="" />
          <span>Sorry! No orders now.</span>
        </div>
      )}
      <PreviewDialog />
      <ConfirmProductDialog />
      <ViewCommentDialog />
      <OrderCancelDetailDialog />
      <SellerReplyCancelDialog />
      <CancelOrderDialog />
    </Container>
  );
};

export default Orders;
