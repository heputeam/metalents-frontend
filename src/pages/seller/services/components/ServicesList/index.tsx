import MyAvatar from '@/components/Avatar';
import {
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { history, useDispatch, useSelector } from 'umi';

import EditSVG from '@/assets/imgs/seller/services/edit.svg';
import StartSVG from '@/assets/imgs/seller/services/start.svg';
import PauseSVG from '@/assets/imgs/seller/services/pause.svg';
import CloseSVG from '@/assets/imgs/seller/services/close.svg';
import DisableEditSVG from '@/assets/imgs/seller/services/disable-edit.svg';
import DisableStartSVG from '@/assets/imgs/seller/services/disable-start.svg';
import PersonSVG from '@/assets/imgs/seller/profile/person.svg';
import NavLink from '@/components/NavLink';
import OperateServiceDialog, {
  operate_service_dialog_key,
} from '../OperateServiceDialog';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import {
  IServiceList,
  IUserServiceInfo,
  ServiceStatus,
} from '@/service/services/types';
import Pagination from '@/components/Pagination';
import { useRequest } from 'ahooks';
import { postServiceMainUpdate } from '@/service/services';
import ViewOrderListDialog from '../ViewOrderListDialog';
import { toDigitalFormat, toThousands } from '@/utils';
import { OrderCreateType } from '@/service/orders/types';

export interface IDialogContent {
  type: string;
  data: IServiceList;
  updateUserService: () => void;
}

const DialogContent: React.FC<IDialogContent> = ({
  type,
  data,
  updateUserService,
}) => {
  const dispatch = useDispatch();

  const checkType = (type: string) => {
    switch (type) {
      case 'Pause':
        return ServiceStatus.PAUSE;
      case 'Restart':
        return ServiceStatus.LIVE;
      case 'Close':
        return ServiceStatus.CLOSE;
      default:
        return ServiceStatus.LIVE;
    }
  };

  const { data: operateRes, run: operateStatus } = useRequest(
    () => postServiceMainUpdate(data?.id, checkType(type)),
    {
      manual: true,
      onSuccess: (res: any) => {
        const { code } = res;
        if (code !== 200) {
          Toast.error('Unknown system failure: Please try');
          dispatch({
            type: 'dialog/hide',
            payload: {
              key: operate_service_dialog_key,
            },
          });
        } else {
          if (type === 'Pause') {
            Toast.success('Successfully paused!');
          } else if (type === 'Close') {
            Toast.success('Successfully closed!');
          } else {
            Toast.success('Successfully restarted!');
          }
          dispatch({
            type: 'dialog/hide',
            payload: {
              key: operate_service_dialog_key,
            },
          });
          updateUserService();
        }
      },
      onError: () => {
        Toast.error('Unknown system failure: Please try');
        dispatch({
          type: 'dialog/hide',
          payload: {
            key: operate_service_dialog_key,
          },
        });
      },
    },
  );

  const handleConfirm = () => {
    operateStatus();
  };

  const { config } = useSelector((state: any) => state.config);

  return (
    <>
      {type === 'Pause' && (
        <>
          <Typography variant="body1" className={styles['dialog-text']}>
            You can pause the service at any time.
          </Typography>
          <Typography variant="body1" className={styles['dialog-text']} mt={30}>
            Paused services will still be shown in the Marketplace but no more
            new orders can be created.
          </Typography>
          <Button
            variant="contained"
            className={styles['confirm-btn']}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </>
      )}
      {type === 'Restart' && (
        <>
          <Typography
            variant="body1"
            sx={{ minHeight: 100, display: 'flex', alignItems: 'center' }}
          >
            You can restart the service at any time. Are you sure you want to
            restart this service?
          </Typography>
          <Button
            variant="contained"
            className={styles['confirm-btn']}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </>
      )}
      {type === 'Close' && (
        <>
          <Typography
            variant="body1"
            className={styles['dialog-text']}
            style={{ color: '#F50202' }}
          >
            You can close the service when all related orders have completed for
            more than {config?.['CLOSE_SERVICE_NO_ORDERS_TIME']?.cfgVal} days.{' '}
          </Typography>
          <Typography variant="body1" className={styles['dialog-text']} mt={30}>
            Closed services will not be shown in the Marketplace and can be
            re-opened at any time. However your transaction history will always
            be preserved.
          </Typography>
          <Button
            variant="contained"
            className={styles['confirm-btn']}
            classes={{ disabled: styles['disable-confirm'] }}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </>
      )}
    </>
  );
};

interface IOperationCell {
  data: IServiceList;
  depositStatus: string | undefined; // 保证金状态
  setType: (val: string) => void;
  setRowItem: (data: any) => void;
}

const OperationCell: React.FC<IOperationCell> = ({
  data,
  depositStatus,
  setType,
  setRowItem,
}) => {
  const dispatch = useDispatch();

  const handleOperate = (type: string) => {
    setType(type);
    setRowItem(data);
    dispatch({
      type: 'dialog/show',
      payload: {
        key: operate_service_dialog_key,
      },
    });
  };

  return (
    <Stack direction="row" alignItems="center" spacing={20}>
      {depositStatus ? (
        <>
          {data?.status !== ServiceStatus.DELETE && (
            <Tooltip
              arrow
              placement="top"
              title="Edit"
              classes={{
                tooltip: styles['tooltip'],
                arrow: styles['tooltip-arrow'],
              }}
            >
              <IconButton
                sx={{ padding: 0 }}
                onClick={() =>
                  history.push(`/seller/services/basic?id=${data?.id}`)
                }
              >
                <img src={EditSVG} />
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : (
        <img src={DisableEditSVG} />
      )}

      {depositStatus ? (
        <>
          {(data?.status === ServiceStatus.PAUSE ||
            data?.status === ServiceStatus.CLOSE) && (
            <Tooltip
              arrow
              placement="top"
              title="Restart"
              classes={{
                tooltip: styles['tooltip'],
                arrow: styles['tooltip-arrow'],
              }}
            >
              <IconButton
                sx={{ padding: 0 }}
                onClick={() => handleOperate('Restart')}
              >
                <img src={StartSVG} />
              </IconButton>
            </Tooltip>
          )}
          {data?.status === ServiceStatus.LIVE && (
            <Tooltip
              arrow
              placement="top"
              title="Pause"
              classes={{
                tooltip: styles['tooltip'],
                arrow: styles['tooltip-arrow'],
              }}
            >
              <IconButton
                sx={{ padding: 0 }}
                onClick={() => handleOperate('Pause')}
              >
                <img src={PauseSVG} />
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : (
        <img src={DisableStartSVG} />
      )}
      {depositStatus &&
        (data?.status === ServiceStatus.LIVE ||
          data?.status === ServiceStatus.PAUSE) && (
          <Tooltip
            arrow
            placement="top"
            title="Close"
            classes={{
              tooltip: styles['tooltip'],
              arrow: styles['tooltip-arrow'],
            }}
          >
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => handleOperate('Close')}
            >
              <img src={CloseSVG} />
            </IconButton>
          </Tooltip>
        )}
    </Stack>
  );
};

interface IServiceCell {
  data: IServiceList;
  depositStatus: string | undefined;
}

const ServiceCell: React.FC<IServiceCell> = ({ data, depositStatus }) => {
  // 跳转详情
  const goDetail = () => {
    if (depositStatus) {
      if (data?.status === ServiceStatus.DELETE) {
        history.push('/seller/services/disabled');
      } else {
        history.push(`/services/${data?.id}`);
      }
    }
  };

  return (
    <div className={styles['service-cell']}>
      {data?.posts?.[0]?.fileType?.includes('audio/mp4') ||
      data?.posts?.[0]?.fileType?.includes('video/mp4') ? (
        <video
          width="48px"
          height="48px"
          onClick={goDetail}
          style={{ cursor: 'pointer' }}
        >
          <source
            src={
              data?.posts?.[0]?.fileThumbnailUrl || data?.posts?.[0]?.fileUrl
            }
            type="video/mp4"
          />
        </video>
      ) : (
        <MyAvatar
          src={data?.posts?.[0]?.fileThumbnailUrl || data?.posts?.[0]?.fileUrl}
          variant="square"
          sx={{ width: 70, height: 70, borderRadius: '6px', cursor: 'pointer' }}
          onClick={goDetail}
        />
      )}
      <Box ml={10}>
        <div className={styles['service-title']} onClick={goDetail}>
          <a data-underline>{data?.title}</a>
        </div>
        <Typography variant="body2" className={styles['create-time']}>
          Creation Time: {moment(data?.createdAt * 1000).format('MMM D,YYYY')}
        </Typography>
      </Box>
    </div>
  );
};

export interface IServicesListProps {
  depositStatus: string | undefined;
  serviceData: IUserServiceInfo;
  pageSize: number;
  page: number;
  handlePage: (event: object, page: number) => void;
  updateUserService: () => void;
}

const ServicesList: React.FC<IServicesListProps> = ({
  depositStatus,
  serviceData,
  pageSize,
  page,
  handlePage,
  updateUserService,
}) => {
  const [type, setType] = useState<string>('');
  const [rowItem, setRowItem] = useState<any>(null);
  const dispatch = useDispatch();

  const handleOrders = (inQueue: number, id: number) => {
    if (inQueue > 0) {
      dispatch({
        type: 'dialog/show',
        payload: {
          key: 'viewOrderListDialog',
          proId: id,
          proType: OrderCreateType.service,
        },
      });
    }
  };

  return (
    <div>
      <div className={styles['services-list']}>
        <TableContainer sx={{ overflowX: 'hidden' }}>
          <Table>
            <TableHead classes={{ root: styles['table-heade'] }}>
              <TableRow>
                <TableCell align="left">Service</TableCell>
                <TableCell align="left">In queue</TableCell>
                <TableCell align="left">Followed</TableCell>
                <TableCell align="left">Total</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody classes={{ root: styles['table-body'] }}>
              {serviceData?.list &&
                serviceData?.list?.map((row: IServiceList, index: number) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="left">
                      <ServiceCell data={row} depositStatus={depositStatus} />
                    </TableCell>
                    <TableCell align="left">
                      <Tooltip
                        arrow
                        placement="top"
                        title={row?.inQueue ? 'View order list' : ''}
                        classes={{
                          tooltip: styles['tooltip'],
                          arrow: styles['tooltip-arrow'],
                        }}
                      >
                        <div
                          className={styles[row?.inQueue > 0 ? 'orders' : '']}
                          onClick={() => handleOrders(row?.inQueue, row?.id)}
                        >{`${toThousands(row?.inQueue)} ${
                          row?.inQueue > 1 ? 'Orders' : 'Order'
                        }`}</div>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2">
                        {toThousands(row?.followed)}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Stack direction="column" justifyContent="center">
                        <Typography variant="body2">
                          {row?.total === 0
                            ? '0'
                            : `${toThousands(row?.total)} ${
                                row?.total > 1 ? 'Orders' : 'Order'
                              }`}
                        </Typography>
                        {row?.total > 0 && row?.totalAmount && (
                          <Typography
                            variant="caption"
                            color="rgba(17, 17, 17, 0.5)"
                          >{`$${toThousands(
                            toDigitalFormat(row?.totalAmount),
                            2,
                          )}`}</Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="left">
                      {(row?.status === ServiceStatus.LIVE ||
                        row?.status === ServiceStatus.PAUSE) && (
                        <Typography variant="body2" color="#3AE090">
                          Live
                        </Typography>
                      )}
                      {row?.status === ServiceStatus.CLOSE && (
                        <Typography variant="body2" color="#000000">
                          Closed
                        </Typography>
                      )}
                      {row?.status === ServiceStatus.DELETE && (
                        <Typography variant="body2" color="#F50202">
                          Disabled
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="left">
                      <OperationCell
                        data={row}
                        depositStatus={depositStatus}
                        setType={setType}
                        setRowItem={setRowItem}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {serviceData?.overview?.total && !serviceData?.total && (
            <div className={styles['empty-box']}>
              <img src={PersonSVG} />
              <Typography className={styles['empty-text']}>
                Sorry! No services now.
              </Typography>
            </div>
          )}

          {serviceData?.total > pageSize && (
            <div className={styles['service-pagination']}>
              <Pagination
                total={serviceData?.total}
                size={pageSize}
                current={page}
                onChange={handlePage}
              />
            </div>
          )}
        </TableContainer>
      </div>
      <div className={styles['bottom-link']}>
        <Typography variant="body1" color="#000000">
          Your seller account is already displayed on the marketplace&nbsp;
          <NavLink path="/seller/profile/edit" className={styles['link']}>
            Edit my profile &gt;
          </NavLink>
        </Typography>
        {/* {depositStatus && (
          <Typography variant="body1" color="#000000">
            You have paid your seller register deposit.&nbsp;
            <NavLink path="" className={styles['link']}>
              Redeem the deposit &gt;
            </NavLink>
          </Typography>
        )} */}
        {/* {!depositStatus && (
          <Typography variant="body1" color="#000000">
            Pay the seller register deposit, and start to provide services on
            the marketplace again.&nbsp;
            <NavLink path="" className={styles['link']}>
              Deposit Now &gt;
            </NavLink>
          </Typography>
        )} */}
      </div>
      <OperateServiceDialog
        title={`${type} the service`}
        content={
          <DialogContent
            type={type}
            data={rowItem}
            updateUserService={updateUserService}
          />
        }
      />
      <ViewOrderListDialog />
    </div>
  );
};

export default ServicesList;
