import SelectItem from '@/pages/home/components/SelectOptions/SetectItem';
import React, { useState } from 'react';
import styles from './index.less';
import FilterCard from '../components/FilterCard';
import CategorySVG from '@/assets/imgs/request/category.svg';
import OfferSVG from '@/assets/imgs/request/offer.svg';
import { Button, Link } from '@mui/material';
import { history, IUserState, useSelector } from 'umi';
import Pagination from '@/components/Pagination';
import { getCurrentToken, toThousands } from '@/utils';
import { PAGE_SIZE, Status } from '../_define';
import moment from 'moment';
import { useBanner, userSearchRequests } from '@/hooks/useGeneral';
import Loading from '@/components/Loading';
import Avatar from '@/components/Avatar';
import { ESortBy } from '@/pages/home/components/SelectOptions/config';

const soryByConfig = [
  {
    label: 'Most recent',
    value: 1,
  },
  {
    label: 'Budget (high to low)',
    value: 3,
  },
];

const statusConfig = [
  {
    label: 'All status',
    value: 0,
  },
  {
    label: 'Waiting',
    value: 1,
  },
  {
    label: 'Completed',
    value: 2,
  },
  {
    label: 'Closed',
    value: 3,
  },
];
export interface IFilters {
  category: string;
  // status: number;
}
export type IPublicMarketProps = {};
const PublicMarket: React.FC<IPublicMarketProps> = ({}) => {
  const { tokens } = useSelector((state: any) => state.coins);
  const [sortBy, setSortBy] = useState<string>(ESortBy.salesVolumelHighToLow);
  const [status, setStatus] = useState<number>(0);
  const [filters, setFilters] = useState({
    category: '',
    // status: 0,
  });
  const { config } = useSelector((state: any) => state.config);
  const { bannerData } = useBanner(2);
  const {
    data: requestsData,
    pagination,
    loading,
  } = userSearchRequests({
    filters,
    sortBy,
    status,
  });
  const handleFilters = (values: IFilters) => {
    setFilters(values);
  };

  return (
    <div className={styles['public-market-page']}>
      <div className={styles['request-center-wrap']}>
        <div className={styles['request-head']}>
          {/* <h5>Browse Open Jobs</h5> */}
          <div className={styles['select-status']}>
            <SelectItem
              title="Status"
              type="Select"
              value={status}
              showItemStr={(() => {
                let showLabel = statusConfig[0].label;
                statusConfig.forEach((item) => {
                  if (status === item.value) {
                    showLabel = item.label;
                  }
                });
                return showLabel;
              })()}
              prefix={'Status'}
            >
              <ul className={styles['select-container']}>
                {statusConfig.map((item) => {
                  return (
                    <li
                      className={item.value === status ? styles['active'] : ''}
                      key={item.label}
                      onClick={() => {
                        setStatus(item.value);
                      }}
                    >
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            </SelectItem>
          </div>
          <div className={styles['sort-box']}>
            <SelectItem
              title="Sort By"
              type="Select"
              value={sortBy}
              showItemStr={(() => {
                let showLabel = soryByConfig[0].label;
                soryByConfig.forEach((item) => {
                  if (sortBy === item.value) {
                    showLabel = item.label;
                  }
                });
                return showLabel;
              })()}
              prefix={'Sort By'}
            >
              <ul className={styles['select-container']}>
                {soryByConfig.map((item) => {
                  return (
                    <li
                      className={item.value === sortBy ? styles['active'] : ''}
                      key={item.label}
                      onClick={() => {
                        setSortBy(item.value);
                      }}
                    >
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            </SelectItem>
          </div>
        </div>
        <FilterCard onChange={handleFilters} />
        {loading ? (
          <div className={styles['loading-box']}>
            <Loading className={styles['loading']} />
          </div>
        ) : (
          <div>
            <div className={styles['request-card-wrap']}>
              {requestsData?.list?.map((item: any) => {
                return (
                  <div
                    className={styles['request-card']}
                    key={item?.id}
                    onClick={() => {
                      history.push(`/request/details?requestId=${item?.id}`);
                    }}
                  >
                    <div className={styles['top-box']}>
                      <div
                        className={styles['buyer-info']}
                        onClick={(e) => {
                          e.stopPropagation();
                          history.push(
                            `/account/profile?sidebar&userId=${item?.userId}`,
                          );
                        }}
                      >
                        <Avatar
                          size={36}
                          sx={{
                            margin: '0 auto',
                            fontSize: '24px',
                          }}
                          src={item?.userAvatar?.fileUrl}
                        >
                          {item?.userName?.slice(0, 1)?.toLocaleUpperCase() ||
                            'U'}
                        </Avatar>

                        <div className={styles['buyer-name']}>
                          {item?.userName}
                        </div>
                      </div>
                      <div className={styles['price-info']}>
                        <span className={styles['price']}>
                          {item && toThousands(item?.budgetAmount)}&nbsp;
                          {getCurrentToken(item?.coinId, tokens)?.name}
                        </span>
                        <span className={styles['time']}>
                          /{item?.deliverTime}{' '}
                          {Number(item?.deliverTime) > 1 ? 'Days' : 'Day'}
                        </span>
                      </div>
                    </div>
                    <div className={styles['bottom-box']}>
                      <a data-underline>{item?.description}</a>
                      {/* <div className={styles['offer-info']}>
                        <div className={styles['offer-wrap']}>
                          <div className={styles['offer-content']}>
                            <img src={OfferSVG} alt="" /> 
                            <span>
                              {toThousands(item?.offerCount)}{' '}
                              {Number(item?.offerCount) > 1
                                ? 'offers'
                                : 'offer'}
                            </span>
                          </div>
                          <div
                            className={`${styles['categor-content']} ${styles['mar']}`}
                          >
                            <img src={CategorySVG} alt="" />
                            <span>
                              {item?.category}/{item?.subcategory}
                            </span>
                          </div>
                        </div>
                        <div className={styles['date-range']}>
                          {moment(item?.createdAt * 1000).format(
                            'MMM D, YYYY HH:mm',
                          )}
                          &nbsp;-&nbsp;
                          {item?.status === Status['Waiting']
                            ? moment(item?.createdAt * 1000)
                                .add(
                                  Number(
                                    config?.['REQ_NOOFFER_15_DAYS']?.cfgVal,
                                  ),
                                  'days',
                                )
                                .format('MMM D, YYYY HH:mm')
                            : moment(item?.modifyAt * 1000).format(
                                'MMM D, YYYY HH:mm',
                              )}
                        </div>
                      </div>
                      <div className={styles['status-box']}>
                        <Button
                          variant="outlined"
                          className={`${styles[Status[item?.status]]}`}
                          disabled
                        >
                          {Status[item?.status]}
                        </Button>
                      </div> */}
                    </div>
                    <div className={styles['center-box']}>
                      {/* <a data-underline>{item?.description}</a> */}
                      <div className={styles['offer-info']}>
                        <div className={styles['offer-wrap']}>
                          <div className={styles['offer-content']}>
                            <img src={OfferSVG} alt="" />
                            <span>
                              {toThousands(item?.offerCount)}{' '}
                              {Number(item?.offerCount) > 1
                                ? 'offers'
                                : 'offer'}
                            </span>
                          </div>
                          <div
                            className={`${styles['categor-content']} ${styles['mar']}`}
                          >
                            <img src={CategorySVG} alt="" />
                            <span>
                              {item?.category}/{item?.subcategory}
                            </span>
                          </div>
                        </div>
                        <div className={styles['date-range']}>
                          {moment(item?.createdAt * 1000).format(
                            'MMM D, YYYY HH:mm',
                          )}
                          &nbsp;-&nbsp;
                          {item?.status === Status['Waiting']
                            ? moment(item?.createdAt * 1000)
                                .add(
                                  Number(
                                    config?.['REQ_NOOFFER_15_DAYS']?.cfgVal,
                                  ),
                                  'days',
                                )
                                .format('MMM D, YYYY HH:mm')
                            : moment(item?.modifyAt * 1000).format(
                                'MMM D, YYYY HH:mm',
                              )}
                        </div>
                      </div>
                      <div className={styles['status-box']}>
                        <Button
                          variant="outlined"
                          className={`${styles[Status[item?.status]]}`}
                          disabled
                        >
                          {Status[item?.status]}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles['total-tip']}>
              Total&nbsp;
              <span>{requestsData && toThousands(requestsData?.total)}</span>
              &nbsp;{Number(requestsData?.total) > 1
                ? 'requests'
                : 'request'}{' '}
              displayed
            </div>
            {requestsData && requestsData?.total > 10 && (
              <div className={styles['pagination-box']}>
                <Pagination
                  total={requestsData?.total}
                  size={PAGE_SIZE}
                  current={pagination.current}
                  onChange={(_, targetPage) => {
                    pagination.changeCurrent(targetPage);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicMarket;
