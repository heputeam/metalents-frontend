import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { usePagination } from 'ahooks';

import classNames from 'classnames';
import { useState } from 'react';
import RequestCell from './components/RequestCell';
import OperationCell from './components/OperationCell';
import styles from './index.less';
import EmpytSVG from '@/assets/imgs/seller/profile/person.svg';
import ReplyCell from './components/ReplyCell';
import MakeEditOfferDialog from '@/pages/request/components/MakeEditOfferDialog';
import { getUserOffers } from '@/service/user';
import {
  EOfferStatus,
  IGetUserOffersParams,
  IGetUserOffersResp,
} from '@/service/user/types';
import { useSelector, history } from 'umi';
import { getCurrentToken, toThousands } from '@/utils';
import CancelOfferDialog from '@/pages/request/components/CancelOfferDialog';
import Button from '@/components/Button';

export type IRequestsProps = {};

const statusConfig: Record<
  EOfferStatus,
  { statusCellText: string; filterBtnLabel: string; color: string }
> = {
  [EOfferStatus.all]: {
    statusCellText: 'All',
    filterBtnLabel: 'All Status',
    color: '#000000',
  },
  [EOfferStatus.waiting]: {
    statusCellText: 'Waiting',
    filterBtnLabel: 'Waiting',
    color: '#FAC917',
  },
  [EOfferStatus.accepted]: {
    statusCellText: 'Accepted',
    filterBtnLabel: 'Accepted',
    color: '#000000',
  },
  [EOfferStatus.rejected]: {
    statusCellText: 'Rejected',
    filterBtnLabel: 'Rejected',
    color: '#000000',
  },
  [EOfferStatus.cancel]: {
    statusCellText: 'Cancelled',
    filterBtnLabel: 'Cancelled',
    color: '#000000',
  },
};

const Requests: React.FC = () => {
  const { tokens } = useSelector((state: any) => state.coins);

  const [filter, setFilter] = useState<EOfferStatus>(EOfferStatus.all);

  const {
    data: offersData,
    refresh: refreshOffersData,
    loading: isOffersLoading,
    pagination,
  } = usePagination<
    IGetUserOffersResp,
    [Omit<IGetUserOffersParams, 'offset'> & { current: number }]
  >(
    async ({ current, pageSize, status }) => {
      const params: IGetUserOffersParams = {
        offset: (current - 1) * pageSize,
        pageSize: pageSize,
        status: status ? status : filter,
      };
      // IGetUserOffersResp
      const resp = await getUserOffers(params);

      const total =
        resp.data.overview.accepted +
        resp.data.overview.cancel +
        resp.data.overview.rejected +
        resp.data.overview.waiting;

      return {
        total: resp.data.total,
        list: resp.data.list ?? [],
        overview: { ...resp.data.overview, all: total },
      };
    },
    {
      defaultPageSize: 10,
      refreshDeps: [filter],
      onSuccess: (data) => {
        console.log('/user/offers data: ', data);
      },
    },
  );

  return (
    <>
      <Container className={styles['container']}>
        <div className={styles['first-line']}>
          <Typography variant="h2" className={styles['title']}>
            My Offers
          </Typography>

          <Button
            variant="contained"
            onClick={() => {
              history.push('/request/market');
            }}
          >
            Browse Open Jobs
          </Button>
        </div>

        <div className={styles['filter-btn-group']}>
          {Object.values(EOfferStatus)
            .filter((key) => {
              return typeof key === 'string';
            })
            .map((key) => {
              return (
                <Button
                  key={key}
                  size="large"
                  variant={
                    filter === EOfferStatus[key] ? 'contained' : 'outlined'
                  }
                  className={`${classNames(
                    styles['filter-btn'],
                    filter === EOfferStatus[key] ? styles['active'] : '',
                  )} `}
                  onClick={() => {
                    setFilter(EOfferStatus[key]);
                  }}
                >
                  {`${statusConfig[EOfferStatus[key]].filterBtnLabel} ${
                    offersData
                      ? `(${
                          offersData.overview[
                            EOfferStatus[EOfferStatus[key]]
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
                  <TableCell align="left" width={219}>
                    Reply
                  </TableCell>
                  <TableCell align="left" width={103}>
                    Price
                  </TableCell>
                  <TableCell align="left" width={89}>
                    Delivery
                  </TableCell>
                  <TableCell align="left" width={68}>
                    Status
                  </TableCell>
                  <TableCell align="left" width={100}>
                    Operation
                  </TableCell>
                </TableRow>
              </TableHead>

              {!isOffersLoading && offersData && offersData.list.length > 0 && (
                <TableBody classes={{ root: styles['table-body'] }}>
                  {offersData?.list.map((offer, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="left">
                        <RequestCell
                          id={offer.requestId}
                          status={offer.reqStatus}
                          description={offer.reqDescription}
                          createdAt={offer.reqCreatedAt}
                          modifyAt={offer.reqModifyAt}
                        />
                      </TableCell>

                      <TableCell align="left">
                        <ReplyCell
                          description={offer.description}
                          createdAt={offer.createdAt}
                        />
                      </TableCell>

                      <TableCell align="left">
                        {`${toThousands(offer.budgetAmount || 0)} ${
                          getCurrentToken(offer.coinId, tokens)?.name ||
                          'unkown token'
                        }`}
                      </TableCell>

                      <TableCell align="left">
                        {`${offer.deliverTime}${
                          offer.deliverTime > 1 ? 'Days' : 'Day'
                        }`}
                      </TableCell>

                      <TableCell align="left">
                        <Typography
                          sx={{
                            color: statusConfig[offer.status].color,
                            textTransform: 'capitalize',
                          }}
                        >
                          {statusConfig[offer.status].statusCellText}
                        </Typography>
                      </TableCell>

                      <TableCell align="left">
                        <OperationCell
                          offerData={offer}
                          offerId={offer.id}
                          requestId={offer.requestId}
                          offerStatus={offer.status}
                          onSuccess={refreshOffersData}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>

            {!isOffersLoading && offersData && offersData.total > 9 && (
              <div className={styles['pagination']}>
                <Pagination
                  total={offersData.total}
                  size={pagination.pageSize}
                  current={pagination.current}
                  onChange={(_, targetPage) => {
                    pagination.changeCurrent(targetPage);
                  }}
                />
              </div>
            )}

            {isOffersLoading && (
              <div className={styles['loading-box']}>
                <Loading className={styles['loading']} />
              </div>
            )}

            {!isOffersLoading &&
              (!offersData || offersData.list?.length === 0) && (
                <div className={styles['empty-box']}>
                  <div className={styles['empty']}>
                    <img className={styles['person-img']} src={EmpytSVG} />
                    <Typography
                      className={styles['str']}
                    >{`Sorry! No offers found.`}</Typography>
                  </div>
                </div>
              )}
          </TableContainer>
        </div>

        {!isOffersLoading && offersData && offersData.total > 0 && (
          <p className={styles['total-count']}>
            Total <span>{offersData.total}</span> offers found
          </p>
        )}
      </Container>

      <CancelOfferDialog />

      <MakeEditOfferDialog />
    </>
  );
};

export default Requests;
