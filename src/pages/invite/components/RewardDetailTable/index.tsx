import Loading from '@/components/Loading';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useRequest } from 'ahooks';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import RewardEmptyPNG from '../../assets/reward-empty.png';
import { useDispatch, useSelector } from 'umi';
import { getActivityRewards } from '@/service/invite';
import { IResponse } from '@/service/types';
import { ACTIVITY_TYPE, IRewards, IRewardsItem } from '@/service/invite/type';
import { getCurrentToken, getTokenSysDecimals, toThousands } from '@/utils';
import BigNumber from 'bignumber.js';

export interface IRewardDetailTable {
  refreshNum?: number;
}

const RewardDetailTable: React.FC<IRewardDetailTable> = ({ refreshNum }) => {
  const { uid } = useSelector((state: any) => state.user);

  const {
    data: rewardData,
    loading,
    run: getRewards,
  } = useRequest<IResponse<IRewards>, any>(
    (params) => getActivityRewards(params),
    {
      manual: true,
      onSuccess: (res: any) => {},
    },
  );

  useEffect(() => {
    if (uid) {
      getRewards({
        offset: 0,
        pageSize: 100,
      });
    }
  }, [uid, refreshNum]);

  const dispatch = useDispatch();
  const handleSignIn = () => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'loginDialog',
      },
    });
  };

  return (
    <div className={styles['reward-table']}>
      <TableContainer
        sx={{
          overflowX: 'hidden',
          borderRadius: '16px',
          maxHeight: 466,
          minHeight: 466,
        }}
      >
        <Table
          stickyHeader={Number(rewardData?.data?.total) > 8 ? true : false}
        >
          <TableHead classes={{ root: styles['reward-table-header'] }}>
            <TableRow>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Activity</TableCell>
              <TableCell align="left">Amount</TableCell>
            </TableRow>
          </TableHead>

          {!loading && rewardData && Number(rewardData?.data?.total) > 0 && (
            <TableBody classes={{ root: styles['table-body'] }}>
              {rewardData?.data?.list.map(
                (item: IRewardsItem, index: number) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell align="left">
                      {moment(item?.createdAt * 1000).format(
                        'MMM D, YYYY HH:mm',
                      )}
                    </TableCell>

                    <TableCell align="left">
                      {ACTIVITY_TYPE[item?.pointType]}
                    </TableCell>

                    <TableCell align="left">
                      {item?.pointType === 'withdraw'
                        ? ` ${toThousands(item?.points)} WORK (${toThousands(
                            new BigNumber(1 / Number(item?.coinPrice))
                              .multipliedBy(Math.abs(item?.points))
                              .toNumber() || 0,
                            2,
                          )} AUCTION)`
                        : `+${toThousands(item?.points)} WORK`}
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          )}
        </Table>

        {loading && (
          <div className={styles['loading-box']}>
            <Loading className={styles['loading']} />
          </div>
        )}

        {!loading && (!rewardData || Number(rewardData?.data?.total) === 0) && (
          <div className={styles['empty-box']}>
            <div className={styles['empty']}>
              <img src={RewardEmptyPNG} width={120} height={120} />
              {uid ? (
                <Typography className={styles['str']}>No data.</Typography>
              ) : (
                <Typography className={styles['str']}>
                  View more,{' '}
                  <span className={styles['sign-in']} onClick={handleSignIn}>
                    Sign In&gt;
                  </span>
                </Typography>
              )}
            </div>
          </div>
        )}
      </TableContainer>
    </div>
  );
};

export default RewardDetailTable;
