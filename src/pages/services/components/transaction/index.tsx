import Avatar from '@/components/Avatar';
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { history, useSelector } from 'umi';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import CompletedSVG from '@/assets/imgs/services/completed.svg';
import CanceledSVG from '@/assets/imgs/services/canceled.svg';
import PersonSVG from '@/assets/imgs/seller/profile/person.svg';
import MyRating from '@/components/Rating';
import Pagination from '@/components/Pagination';
import CheckSVG from '@/assets/imgs/services/checked.svg';
import UncheckSVG from '@/assets/imgs/services/unChecked.svg';
import moment from 'moment';
import Loading from '@/components/Loading';
import { useServicesOrders } from '@/hooks/useServices';
import { ORDER_STATUS } from '@/service/orders/types';
import { ServiceLevelType } from '../../[serviceId$]/type';
import { toThousands } from '@/utils';
import {
  AUDIO_FILES_MIMES,
  IMAGE_FILES_MIMES,
  VIDEO_FILES_MIMES,
} from '@/components/Uploader/mimeTypes';
import DocSVG from '@/assets/imgs/request/doc.svg';
import Mp3SVG from '@/assets/imgs/request/mp3.svg';
import ChainNodes, { NetworkChain } from '@/web3/chains';
const PAGE_SIZE = 10;

interface ITransaction {
  serviceId: number;
}
const Transaction: React.FC<ITransaction> = ({ serviceId }) => {
  const { currency } = useSelector((state: any) => state.coins);
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<string[]>([
    ORDER_STATUS.Complete,
    ORDER_STATUS.Autocomplete,
    ORDER_STATUS.Cancel,
  ]);
  const [params, setParams] = useState({
    pageSize: PAGE_SIZE,
    serviceId: Number(serviceId),
    status,
  });
  useEffect(() => {
    setParams({
      ...params,
      serviceId: Number(serviceId),
      status,
    });
  }, [checked, serviceId]);

  const {
    loading,
    pagination,
    data: serversOrders,
  } = useServicesOrders(params);

  return (
    <div className={styles['transactions-wrap']}>
      <FormControlLabel
        className={styles['checkbox-box']}
        control={
          <Checkbox
            checked={checked}
            onChange={(ev) => {
              setChecked(!checked);
              setStatus(
                ev.target.checked
                  ? [ORDER_STATUS.Complete, ORDER_STATUS.Autocomplete]
                  : [
                      ORDER_STATUS.Complete,
                      ORDER_STATUS.Autocomplete,
                      ORDER_STATUS.Cancel,
                    ],
              );
            }}
            checkedIcon={<img src={CheckSVG} />}
            icon={<img src={UncheckSVG} />}
          />
        }
        label="Completed Only"
      />
      <TableContainer
        component={Paper}
        classes={{ root: styles['paper-root'] }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow classes={{ root: styles['head-row-root'] }}>
              <TableCell align="left" classes={{ root: styles['th-root'] }}>
                Buyer
              </TableCell>
              <TableCell align="left" classes={{ root: styles['th-root'] }}>
                Service
              </TableCell>
              <TableCell align="left" classes={{ root: styles['th-root'] }}>
                Price
              </TableCell>
              <TableCell align="left" classes={{ root: styles['th-root'] }}>
                Status
              </TableCell>
              <TableCell align="left" classes={{ root: styles['th-root'] }}>
                Comments
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody classes={{ root: styles['tbody-root'] }}>
            {!loading &&
              serversOrders?.list?.map((item, index) => {
                const fileType = item?.deliverDocs?.[0]?.fileType || '';
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <div
                        className={styles['buyer-info']}
                        onClick={() =>
                          history.push(
                            `/account/profile?sidebar&userId=${item?.buyerId}`,
                          )
                        }
                      >
                        <Avatar
                          src={
                            item?.userAvatar?.fileThumbnailUrl ||
                            item?.userAvatar?.fileUrl
                          }
                          sx={{
                            width: 44,
                            height: 44,
                          }}
                          className={styles['avatar']}
                        />
                        <p>{item?.userName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles['service-info']}>
                        <div className={styles['img-box']}>
                          {item?.deliverDocs?.[0]?.fileUrl ? (
                            <>
                              {VIDEO_FILES_MIMES.includes(fileType) && (
                                <video width="100%" height="100%">
                                  <source
                                    src={
                                      item?.deliverDocs?.[0]
                                        ?.fileThumbnailUrl ||
                                      item?.deliverDocs?.[0]?.fileUrl
                                    }
                                    type="video/mp4"
                                  />
                                </video>
                              )}
                              {AUDIO_FILES_MIMES.includes(fileType) && (
                                <img
                                  src={Mp3SVG}
                                  alt=""
                                  className={styles['icon']}
                                />
                              )}

                              {IMAGE_FILES_MIMES.includes(fileType) && (
                                <img
                                  src={
                                    item?.deliverDocs?.[0]?.fileThumbnailUrl ||
                                    item?.deliverDocs?.[0]?.fileUrl
                                  }
                                  className={styles['icon']}
                                />
                              )}

                              {(fileType === '' ||
                                ![
                                  ...IMAGE_FILES_MIMES,
                                  ...VIDEO_FILES_MIMES,
                                  ...AUDIO_FILES_MIMES,
                                ].some((v) => v.indexOf(fileType) !== -1)) && (
                                <img
                                  src={DocSVG}
                                  alt=""
                                  className={styles['icon']}
                                />
                              )}
                            </>
                          ) : (
                            '-'
                          )}
                        </div>

                        <div className={styles['info-box']}>
                          <span className={styles['title']}>
                            {ServiceLevelType[item?.level]}
                          </span>
                          <span className={styles['date']}>
                            {moment(item?.createdAt * 1000).format(
                              'MMM D,YYYY HH:mm',
                            )}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={styles['price']}>
                        {toThousands(item?.budgetAmount)}
                        &nbsp;{currency?.[item?.coinId]?.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className={styles['status-info']}>
                        {item?.status === ORDER_STATUS.Complete ||
                        item?.status === ORDER_STATUS.Autocomplete ? (
                          <>
                            <img src={CompletedSVG} width={22} />
                            <span>Completed</span>
                            {item?.txHash && (
                              <IconButton
                                href={`${
                                  ChainNodes[item?.txChainId as NetworkChain]
                                    .blockExplorerUrls
                                }/tx/${item?.txHash}`}
                                size="small"
                                target="_blank"
                              >
                                <img
                                  src={
                                    ChainNodes[item?.txChainId as NetworkChain]
                                      .blockIcon
                                  }
                                  className={styles['explorer-icon']}
                                />
                              </IconButton>
                            )}
                          </>
                        ) : (
                          <>
                            <img src={CanceledSVG} />
                            <span>Canceled</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles['comment-info']}>
                        {item?.scope ? (
                          <MyRating
                            value={item?.scope}
                            size={24}
                            precision={0.1}
                            fontSize="18px"
                            readOnly
                          />
                        ) : (
                          '-'
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        {loading && (
          <div className={styles['empty-box']}>
            <Loading />
          </div>
        )}

        {!loading && serversOrders?.total === 0 && (
          <div className={styles['empty-box']}>
            <img src={PersonSVG} alt="" />
            <Typography className={styles['str']}>
              Sorry! No transactions found.
            </Typography>
          </div>
        )}

        {!loading && serversOrders && serversOrders?.total > 10 && (
          <div className={styles['pagination-box']}>
            <Pagination
              total={serversOrders?.total}
              size={PAGE_SIZE}
              current={pagination.current}
              onChange={(_, targetPage) => {
                pagination.changeCurrent(targetPage);
              }}
            />
          </div>
        )}
      </TableContainer>
    </div>
  );
};

export default Transaction;
