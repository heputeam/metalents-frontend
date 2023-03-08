import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination';
import {
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { usePagination, useRequest } from 'ahooks';
import classNames from 'classnames';
import { useState } from 'react';
import RequestCell from './components/RequestCell';
import OperationCell from './components/OperationCell';
import styles from './index.less';
import EmpytSVG from '@/assets/imgs/seller/profile/person.svg';
import Toast from '@/components/Toast';
import CancelRequestDialog from '@/pages/request/components/CancelRequestDialog';
import {
  HideOrShowRequestDialog,
  DialogKey as HideOrShowRequestDialogKey,
} from './components/HideOrShowRequestDialog';
import { useDispatch, useSelector, history } from 'umi';
import { getCurrentToken, toThousands } from '@/utils';
import { postUserRequests } from '@/service/user';
import {
  ERequestStatus,
  IGetUserRequestsParams,
  IGetUserRequestsResp,
  IToggleRequestsVisiblityParams,
  UserRequestsVisibility,
} from '@/service/user/types';
import Button from '@/components/Button';
import { IResponse } from '@/service/types';
import { getCanCreate, postRequestsHidden } from '@/service/requests';

export type IRequestsProps = {};

const statusConfig: Record<
  ERequestStatus,
  { statusCellText: string; filterBtnLabel: string; color: string }
> = {
  [ERequestStatus.all]: {
    statusCellText: 'All',
    filterBtnLabel: 'All Status',
    color: '#000000',
  },
  [ERequestStatus.waiting]: {
    statusCellText: 'Waiting',
    filterBtnLabel: 'Waiting',
    color: '#FAC917',
  },
  [ERequestStatus.completed]: {
    statusCellText: 'Completed',
    filterBtnLabel: 'Completed',
    color: '#000000',
  },
  [ERequestStatus.close]: {
    statusCellText: 'Closed',
    filterBtnLabel: 'Closed',
    color: '#000000',
  },
  [ERequestStatus.disable]: {
    statusCellText: 'Disabled',
    filterBtnLabel: 'Disabled',
    color: '#F50202',
  },
};

const Requests: React.FC = () => {
  const dispatch = useDispatch();

  const { tokens } = useSelector((state: any) => state.coins);

  const [filter, setFilter] = useState<ERequestStatus>(ERequestStatus.all);

  const {
    data: requestsData,
    loading: isRequestsLoading,
    refresh: refreshRequestsData,
    pagination,
  } = usePagination<
    IGetUserRequestsResp,
    [Omit<IGetUserRequestsParams, 'offset'> & { current: number }]
  >(
    async ({ current, pageSize, status }) => {
      const params: IGetUserRequestsParams = {
        offset: (current - 1) * pageSize,
        pageSize: pageSize,
        status: status ? status : filter,
      };
      // IGetUserRequestsResp
      const resp = await postUserRequests(params);

      const total =
        resp.data.overview.close +
        resp.data.overview.completed +
        resp.data.overview.waiting;

      return {
        hidden: resp.data.hidden,
        total: resp.data.total,
        list: resp.data.list ?? [],
        overview: { ...resp.data.overview, all: total },
      };
    },
    {
      defaultPageSize: 10,
      refreshDeps: [filter],
      onSuccess: (data) => {
        console.log('/user/requests data: ', data);
      },
    },
  );

  const currentVisibility =
    requestsData?.hidden && requestsData.hidden > 0
      ? UserRequestsVisibility.HIDDEN
      : UserRequestsVisibility.SHOW;

  const { loading, run: toggleRequestVisiblity } = useRequest<
    IResponse<null | undefined>,
    [IToggleRequestsVisiblityParams]
  >((params) => postRequestsHidden(params), {
    manual: true,
    onSuccess: (data) => {
      const { code } = data;

      if (code !== 200) {
        Toast.error('Unknown system failure: Please try');
      }

      refreshRequestsData();
    },
  });

  const handleToggleRequestVisiblity = () => {
    toggleRequestVisiblity({
      hidden: (currentVisibility % 2) + 1,
      status: [2, 3],
    });
  };

  const { config } = useSelector((state: any) => state.config);
  const { run: checkCreate } = useRequest(() => getCanCreate(), {
    manual: true,
    onSuccess: (res: any) => {
      const { code } = res;
      if (code === 200) {
        history.push('/account/apply');
      } else if (code === 30032) {
        // 三个等待着
        return Toast.error(
          `Oops! You already have ${config?.REQ_WAITING_COUNT?.cfgVal} requests in waiting.`,
        );
      } else if (code === 30031) {
        //  账户禁用
        return Toast.error(
          'Your account is disabled. Please contact Metalents Customer Service.',
        );
      } else if (code === 403) {
        dispatch({
          type: 'dialog/show',
          payload: {
            key: 'loginChooseDialog',
          },
        });
      } else {
        return Toast.error('Unknown system failure: Please try');
      }
    },
  });

  return (
    <>
      <Container className={styles['container']}>
        <div className={styles['first-line']}>
          <Typography variant="h2" className={styles['title']}>
            My Requests
          </Typography>

          <div className={styles['first-line-right']}>
            <div className={styles['checkbox-box']}>
              <Checkbox
                classes={{ root: styles['checkbox-root'] }}
                size="small"
                disabled={!requestsData}
                checked={currentVisibility === UserRequestsVisibility.HIDDEN}
                onChange={() => {
                  dispatch({
                    type: 'dialog/show',
                    payload: {
                      key: HideOrShowRequestDialogKey,
                      type: (currentVisibility % 2) + 1,
                      title: `my request`,
                      content: (
                        <p className={styles['dialog-content']}>
                          {`Are you sure you want to `}
                          {(currentVisibility % 2) + 1 ===
                          UserRequestsVisibility.HIDDEN
                            ? 'hide'
                            : 'show'}
                          <br />
                          {`all your completed or closed requests in the Browse Open Jobs?`}
                        </p>
                      ),
                      btnText: 'Confirm',
                      loading: loading,
                      handleConfirm: handleToggleRequestVisiblity,
                    },
                  });
                }}
              />
              <Typography>Hide my request in the market</Typography>
            </div>

            <Button variant="contained" onClick={checkCreate}>
              New Requests
            </Button>
          </div>
        </div>

        <div className={styles['filter-btn-group']}>
          {Object.values(ERequestStatus)
            .filter((key) => {
              return typeof key === 'string' && key !== 'disable';
            })
            .map((key) => {
              return (
                <Button
                  key={key}
                  size="large"
                  variant={
                    filter === ERequestStatus[key] ? 'contained' : 'outlined'
                  }
                  className={`${styles['filter-btn']} ${
                    filter === ERequestStatus[key] ? styles['active'] : ''
                  }`}
                  onClick={() => {
                    setFilter(ERequestStatus[key]);
                  }}
                >
                  {`${statusConfig[ERequestStatus[key]].filterBtnLabel} ${
                    requestsData
                      ? `(${
                          requestsData.overview[
                            ERequestStatus[ERequestStatus[key]]
                          ] || 0
                        })`
                      : ''
                  }`}
                </Button>
              );
            })}
        </div>

        <div className={styles['requests-table']}>
          <TableContainer sx={{ overflowX: 'hidden', borderRadius: '16px' }}>
            <Table>
              <TableHead classes={{ root: styles['requests-table-header'] }}>
                <TableRow>
                  <TableCell align="left" width={228}>
                    Request
                  </TableCell>
                  <TableCell align="left" width={73}>
                    Offer list
                  </TableCell>
                  <TableCell align="left" width={174}>
                    Category
                  </TableCell>
                  <TableCell align="left" width={126}>
                    Budget
                  </TableCell>
                  <TableCell align="left" width={89}>
                    Status
                  </TableCell>
                  <TableCell align="left" width={116}>
                    Operation
                  </TableCell>
                </TableRow>
              </TableHead>

              {!isRequestsLoading &&
                requestsData &&
                requestsData.list.length > 0 && (
                  <TableBody classes={{ root: styles['table-body'] }}>
                    {requestsData?.list.map((request, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell align="left">
                          <RequestCell
                            id={request.requestId}
                            status={request.status}
                            description={request.description}
                            createdAt={request.createdAt}
                            modifyAt={request.modifyAt}
                          />
                        </TableCell>

                        <TableCell align="left">{request.offerCount}</TableCell>

                        <TableCell align="left">
                          {request.category}/
                          {request.category.length +
                            request.subcategory.length >
                            20 && <br />}
                          {request.subcategory}
                        </TableCell>

                        <TableCell align="left">{`${toThousands(
                          request.budgetAmount || 0,
                        )} ${
                          getCurrentToken(request.coinId, tokens)?.name ||
                          'unkown token'
                        }`}</TableCell>

                        <TableCell align="left">
                          <Typography
                            sx={{
                              color: statusConfig[request.status].color,
                              textTransform: 'capitalize',
                            }}
                          >
                            {statusConfig[request.status].statusCellText}
                          </Typography>
                        </TableCell>

                        <TableCell align="left">
                          <OperationCell
                            requestId={request.requestId}
                            requestStatus={request.status}
                            orderId={request?.orderId}
                            onSuccess={refreshRequestsData}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
            </Table>

            {!isRequestsLoading && requestsData && requestsData.total > 9 && (
              <div className={styles['pagination']}>
                <Pagination
                  total={requestsData.total}
                  size={pagination.pageSize}
                  current={pagination.current}
                  onChange={(_, targetPage) => {
                    pagination.changeCurrent(targetPage);
                  }}
                />
              </div>
            )}

            {isRequestsLoading && (
              <div className={styles['loading-box']}>
                <Loading className={styles['loading']} />
              </div>
            )}

            {!isRequestsLoading &&
              (!requestsData || requestsData.list?.length === 0) && (
                <div className={styles['empty-box']}>
                  <div className={styles['empty']}>
                    <img className={styles['person-img']} src={EmpytSVG} />
                    <Typography
                      className={styles['str']}
                    >{`Sorry! No requests found.`}</Typography>
                  </div>
                </div>
              )}
          </TableContainer>
        </div>

        {!isRequestsLoading && requestsData && requestsData.total > 0 && (
          <p className={styles['total-count']}>
            Total <span>{requestsData.total}</span> requests found
          </p>
        )}
      </Container>

      <CancelRequestDialog />

      <HideOrShowRequestDialog />
    </>
  );
};

export default Requests;
