import SelectItem from '@/pages/home/components/SelectOptions/SetectItem';
import {
  Box,
  Link as MLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useSelector } from 'umi';
import DateRang from '../DateRang';
import styles from './index.less';
import DateSVG from '@/assets/imgs/wallet/date.svg';

import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange as DateRangeType } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Button from '@/components/Button';
import moment from 'moment';
import { useTransactionHistory } from '@/hooks/useWallet';
import { PAGE_SIZE } from '@/pages/request/_define';
import Pagination from '@/components/Pagination';
import { toOmitAccount, toThousands } from '@/utils';
import Loading from '@/components/Loading';
import PersonSVG from '@/assets/imgs/seller/profile/person.svg';
import ChainNodes, { NetworkChain } from '@/web3/chains';

export enum TRADE_TYPE {
  'Order Payment' = 3,
  'Order Income' = 4,
  'Order Refund' = 5,
  'Add Funds' = 7,
  'Withdraw' = 8,
  'Reward' = 11,
}

export enum STATUS {
  Success = 1,
  Failed = 2,
  Processing = 3,
}

export interface ItradeType {
  label: string;
  value: number;
  val: number[];
}

export type ITransactionHistoryProps = {
  transactionType: ItradeType[];
};

const TransactionHistory: React.FC<ITransactionHistoryProps> = ({
  transactionType,
}) => {
  const { currency } = useSelector((state: any) => state.coins);
  const [transType, setTransType] = useState<number>(-1);
  const [value, setValue] = useState<DateRangeType<Date>>([null, null]);
  const [valueStr, setValueStr] = useState<string>('');
  const [dateFilter, setDateFilter] = useState({
    startTime: 0,
    endTime: 0,
  });

  const handleClear = () => {
    setValue([null, null]);
  };
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
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
    } else {
      setValueStr('');
      setDateFilter({
        startTime: 0,
        endTime: 0,
      });
    }
  };
  const {
    data: historyData,
    pagination,
    loading,
  } = useTransactionHistory({
    dateFilter,
    transType: transactionType.filter((item) => item.value === transType)?.[0]
      ?.val,
  });
  return (
    <div className={styles['transaction-history']}>
      <h5>Total Transaction History</h5>
      <div className={styles['filter-box']}>
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
        <div className={styles['transaction-type']}>
          <SelectItem
            title="Transaction type"
            type="Select"
            value={transType}
            showItemStr={(() => {
              let showLabel = transactionType[0].label;
              transactionType.forEach((item) => {
                if (transType === item.value) {
                  showLabel = item.label;
                }
              });
              return showLabel || '';
            })()}
            prefix={'Transaction type'}
            className={styles['select-filter']}
          >
            <ul className={styles['select-container']}>
              {transactionType.map((item) => {
                return (
                  <li
                    className={item.value === transType ? styles['active'] : ''}
                    key={item.label}
                    onClick={() => {
                      setTransType(item.value);
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

      <div className={styles['history-wrap']}>
        <TableContainer
          component={Paper}
          classes={{ root: styles['paper-root'] }}
        >
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow classes={{ root: styles['head-row-root'] }}>
                <TableCell align="left" classes={{ root: styles['th-root'] }}>
                  Date
                </TableCell>
                <TableCell align="left" classes={{ root: styles['th-root'] }}>
                  Category
                </TableCell>
                <TableCell align="left" classes={{ root: styles['th-root'] }}>
                  Total
                </TableCell>
                <TableCell
                  align="left"
                  classes={{ root: styles['th-root'] }}
                  width={140}
                >
                  Details
                </TableCell>
                <TableCell align="left" classes={{ root: styles['th-root'] }}>
                  Txn
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody classes={{ root: styles['tbody-root'] }}>
              {!loading &&
                historyData?.list?.map((item: any) => {
                  const expense =
                    item?.tradeType === TRADE_TYPE.Withdraw ||
                    item?.tradeType === TRADE_TYPE['Order Payment'];

                  const deducting =
                    item?.tradeType === TRADE_TYPE['Order Refund'] ||
                    item?.tradeType === TRADE_TYPE['Order Income'] ||
                    item?.tradeType === 6;
                  return (
                    <TableRow key={item?.id}>
                      <TableCell>
                        {moment(item?.createdAt * 1000).format(
                          'MMM D,YYYY HH:mm',
                        )}
                      </TableCell>
                      <TableCell>
                        {item?.tradeType === 6
                          ? 'Order Refund'
                          : TRADE_TYPE[item?.tradeType]}
                      </TableCell>
                      <TableCell>
                        <div className={styles['total-cell']}>
                          <div
                            className={`${styles['top']} ${
                              expense ? styles['expense'] : ''
                            }`}
                          >
                            {expense ? '-' : '+'}
                            {toThousands(
                              item?.amount,
                              currency?.[item?.coinId]?.sysDecimals,
                            )}
                            &nbsp;
                            {currency?.[item?.coinId]?.name}
                            &nbsp;($
                            {toThousands(Number(item?.usdAmount).toFixed(2))})
                          </div>
                          {expense && (
                            <div className={styles['bot']}>
                              lncluding&nbsp;
                              {toThousands(
                                item?.fee,
                                currency?.[item?.coinId]?.sysDecimals,
                              )}
                              &nbsp;
                              {currency?.[item?.coinId]?.name}
                              &nbsp;Processing Fee
                            </div>
                          )}
                          {deducting && (
                            <div className={styles['bot']}>
                              Deducting&nbsp;
                              {toThousands(
                                item?.fee,
                                currency?.[item?.coinId]?.sysDecimals,
                              )}
                              &nbsp;
                              {currency?.[item?.coinId]?.name}
                              &nbsp;Processing Fee
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item?.tradeType === TRADE_TYPE.Reward ? (
                          <></>
                        ) : (
                          <>
                            {item?.tradeType === TRADE_TYPE.Withdraw ||
                            item?.tradeType === TRADE_TYPE['Add Funds'] ? (
                              item?.status === 4 ? (
                                'Processing'
                              ) : (
                                STATUS[item?.status]
                              )
                            ) : (
                              <Link
                                to={`/orders/details?id=${item?.txOrder}`}
                                className={styles['details-link']}
                              >
                                {`OrderID.${item?.txOrder}`}
                              </Link>
                            )}
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {item?.tradeType === TRADE_TYPE.Withdraw ||
                        item?.tradeType === TRADE_TYPE['Add Funds'] ? (
                          <>
                            {item.txHash ? (
                              <MLink
                                href={`${
                                  ChainNodes[item?.txChainId as NetworkChain]
                                    .blockExplorerUrls
                                }/tx/${item?.txHash}`}
                                target="_blank"
                                className={styles['txn-link']}
                              >
                                {toOmitAccount(item.txHash)}
                              </MLink>
                            ) : (
                              '-'
                            )}
                          </>
                        ) : (
                          <span className={styles['txt-notLink']}>
                            {item?.id ? `#${item.id}` : '-'}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          {loading ? (
            <div className={styles['loading-box']}>
              <Loading className={styles['loading']} />
            </div>
          ) : (
            <>
              {historyData?.total === 0 && (
                <div className={styles['empty-box']}>
                  <div className={styles['img-box']}>
                    <img src={PersonSVG} />
                  </div>

                  <Typography className={styles['empty-text']}>
                    Sorry! No transactions found.
                  </Typography>
                </div>
              )}
            </>
          )}
        </TableContainer>
        {!!historyData?.total && (
          <div className={styles['total-tip']}>
            Total&nbsp;
            <span>{historyData && toThousands(historyData?.total)}</span>
            &nbsp;transections
          </div>
        )}

        {historyData && historyData?.total > 10 && (
          <div className={styles['pagination-box']}>
            <Pagination
              total={historyData?.total}
              size={PAGE_SIZE}
              current={pagination.current}
              onChange={(_, targetPage) => {
                pagination.changeCurrent(targetPage);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
