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
import React, { useEffect } from 'react';
import styles from './index.less';
import SellerEmptyPNG from '../../assets/seller-empty.png';
import { getActivityTopSeller } from '@/service/invite';
import { IResponse } from '@/service/types';
import { ITopSeller, ITopSellerItem } from '@/service/invite/type';
import { toThousands } from '@/utils';

export interface ITopSellersTable {
  refreshNum?: number;
}

const TopSellersTable: React.FC<ITopSellersTable> = ({ refreshNum }) => {
  const {
    data: rewardData,
    loading,
    run: getTopSeller,
  } = useRequest<IResponse<ITopSeller>, any>(
    (params) => getActivityTopSeller(params),
    {
      manual: true,
    },
  );

  useEffect(() => {
    getTopSeller({
      offset: 0,
      pageSize: 20,
    });
  }, [refreshNum]);

  return (
    <div className={styles['top-seller-table']}>
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
          <TableHead classes={{ root: styles['top-table-header'] }}>
            <TableRow>
              <TableCell align="left">Seller name</TableCell>
              <TableCell align="left">Total rewards</TableCell>
            </TableRow>
          </TableHead>

          {!loading && rewardData && Number(rewardData?.data?.total) > 0 && (
            <TableBody classes={{ root: styles['table-body'] }}>
              {rewardData?.data?.list?.map(
                (item: ITopSellerItem, index: number) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell align="left">
                      <div className={styles['seller-name']}>
                        {item?.sellerName}
                      </div>
                    </TableCell>

                    <TableCell align="left">
                      {toThousands(item?.totalPoints)} WORK
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
              <img src={SellerEmptyPNG} width={120} height={120} />
              <Typography className={styles['str']}>No data.</Typography>
            </div>
          </div>
        )}
      </TableContainer>
    </div>
  );
};

export default TopSellersTable;
