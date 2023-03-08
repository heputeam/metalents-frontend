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
import React, { useEffect } from 'react';
import styles from './index.less';
import ReferralsEmptyPNG from '../../assets/referrals-empty.png';
import { useDispatch, useSelector } from 'umi';
import { ReactComponent as HookSVG } from '../../assets/hook.svg';
import { IResponse } from '@/service/types';
import { getActivityReferrals } from '@/service/invite';
import { IReferrals, IReferralsItem } from '@/service/invite/type';
import { toThousands } from '@/utils';

export interface IReferralsTable {
  activityId: number;
  refreshNum?: number;
}

const ReferralsTable: React.FC<IReferralsTable> = ({
  activityId,
  refreshNum,
}) => {
  const { uid } = useSelector((state: any) => state.user);
  const {
    data: rewardData,
    loading,
    run: getReferrals,
  } = useRequest<IResponse<IReferrals>, any>(
    (params) => getActivityReferrals(params),
    {
      manual: true,
      onSuccess: (res: any) => {},
    },
  );

  useEffect(() => {
    if (uid && activityId) {
      getReferrals({
        activityId: activityId,
        offset: 0,
        pageSize: 100,
      });
    }
  }, [uid, activityId, refreshNum]);

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
              <TableCell align="left">Registration date</TableCell>
              <TableCell align="left">Seller name</TableCell>
              <TableCell align="left">Verification</TableCell>
              <TableCell align="left">Order completed</TableCell>
              <TableCell align="left">Rewards</TableCell>
            </TableRow>
          </TableHead>

          {!loading && rewardData && Number(rewardData?.data?.total) > 0 && (
            <TableBody classes={{ root: styles['table-body'] }}>
              {rewardData?.data?.list?.map(
                (item: IReferralsItem, index: number) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell align="left">
                      {moment(item?.registrationAt * 1000).format(
                        'MMM D, YYYY HH:mm',
                      )}
                    </TableCell>

                    <TableCell align="left">
                      <div className={styles['seller-name']}>
                        {item?.sellerName}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      {item?.isVerify === 'verified' && <HookSVG />}
                    </TableCell>
                    <TableCell align="left">
                      {Number(item?.completedOrder) > 0 && <HookSVG />}
                    </TableCell>
                    <TableCell align="left">{`+ ${toThousands(
                      item?.totalReward,
                    )} WORK`}</TableCell>
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
              <img src={ReferralsEmptyPNG} width={120} height={120} />
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

export default ReferralsTable;
