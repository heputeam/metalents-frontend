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
import { history, Link, useDispatch, useSelector } from 'umi';
import React, { useState } from 'react';
import styles from './index.less';
import CompletedSVG from '@/assets/imgs/services/completed.svg';
import CanceledSVG from '@/assets/imgs/services/canceled.svg';
import StartSVG from '@/assets/imgs/seller/sidebar/star.svg';
import IconDetailsSVG from '@/assets/imgs/seller/profile/iconDetails.svg';
import Pagination from '@/components/Pagination';
import CheckSVG from '@/assets/imgs/services/checked.svg';
import UncheckSVG from '@/assets/imgs/services/unChecked.svg';
import moment from 'moment';
import { toThousands } from '@/utils';
import { IDENTITY_TYPE, USER_TYPE } from '@/define';
import Loading from '../Loading';
import PersonSVG from '@/assets/imgs/seller/profile/person.svg';
import { PAGE_SIZE } from '@/pages/request/_define';
import { IUserOrderData } from '@/service/user/types';
import { ReactComponent as TelescopeSVG } from '@/assets/imgs/account/mint/telescope.svg';
import { ORDER_STATUS } from '@/service/orders/types';
import FileBlock from '@/pages/services/components/comments/components/FileBlock';
import { IFile } from '@/types';
import PreviewDialog from '@/pages/request/components/PreviewDialog';
import ChainNodes, { NetworkChain } from '@/web3/chains';

interface IHomeTransactions {
  name?: string;
  loading: boolean;
  pagination: any;
  userOrders: IUserOrderData;
  identityType: number;
  userType: number;
  onChange: (val: string[]) => void;
}
const HomeTransactions: React.FC<IHomeTransactions> = ({
  name,
  loading,
  pagination,
  userOrders,
  identityType,
  userType,
  onChange,
}) => {
  const { currency } = useSelector((state: any) => state.coins);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const handlePreview = (slideIndex: number, doc: IFile[]) => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'previewDialog',
        previewIndex: slideIndex,
        posts: doc,
        disableDownload: true,
      },
    });
  };
  return (
    <div className={styles['transactions-wrap']}>
      <FormControlLabel
        className={styles['checkbox-box']}
        control={
          <Checkbox
            checked={checked}
            onChange={(ev) => {
              setChecked(!checked);
              onChange(
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
                {name}
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
              userOrders?.list?.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <div
                        className={styles['buyer-info']}
                        onClick={() => {
                          const path =
                            userType === USER_TYPE.Buyer
                              ? `/seller/profile?sidebar&tab=services&userId=${item?.sellerId}`
                              : `/account/profile?sidebar&userId=${item?.buyerId}`;
                          history.push(path);
                        }}
                      >
                        <Avatar
                          src={
                            userType === USER_TYPE.Buyer
                              ? item?.sellerAvatar?.fileUrl
                              : item?.buyerAvatar.fileUrl
                          }
                          sx={{
                            width: 36,
                            height: 36,
                          }}
                          className={styles['avatar']}
                        />
                        <p>
                          {userType === USER_TYPE.Buyer
                            ? item?.sellerName
                            : item?.buyerName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles['service-info']}>
                        <div className={styles['img-box']}>
                          {item?.deliverDocs?.[0]?.fileUrl ? (
                            <>
                              <div
                                className={styles['mask']}
                                onClick={() => {
                                  handlePreview(index, item?.deliverDocs || []);
                                }}
                              >
                                <TelescopeSVG />
                              </div>

                              <FileBlock
                                width={70}
                                height={70}
                                fileUrl={
                                  item?.deliverDocs?.[0]?.fileThumbnailUrl ||
                                  item?.deliverDocs?.[0]?.fileUrl
                                }
                                fileType={
                                  item?.deliverDocs?.[0]?.fileType || ''
                                }
                                skeletonSx={{ borderRadius: '6px' }}
                                blockStyle={{
                                  borderRadius: '6px',
                                }}
                              />
                            </>
                          ) : (
                            '-'
                          )}
                        </div>
                        <div className={styles['info-box']}>
                          {item?.proType === 1 ? (
                            <Link
                              to={{
                                pathname: `/services/0`,
                                state: { subServerId: item?.proId },
                              }}
                            >
                              <span className={styles['title']}>
                                {item?.serviceTitle}
                              </span>
                            </Link>
                          ) : (
                            <Link
                              to={`/request/details?offerId=${item?.proId}`}
                            >
                              <span className={styles['title']}>
                                {`It's a customized service of ${item?.category}/${item?.subcategory}`}
                              </span>
                            </Link>
                          )}
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
                          <div className={styles['rating-box']}>
                            <img src={StartSVG} />
                            <span>{item?.scope}</span>
                          </div>
                        ) : (
                          <div className={styles['rating-box']}>-</div>
                        )}
                        {identityType === IDENTITY_TYPE.Owner && (
                          <IconButton
                            size="small"
                            onClick={() => {
                              history.push(`/orders/details?id=${item?.id}`);
                            }}
                          >
                            <img src={IconDetailsSVG} />
                          </IconButton>
                        )}
                      </div>
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
            {userOrders?.total === 0 && (
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

        {!loading && userOrders && userOrders?.total > 10 && (
          <div className={styles['pagination-box']}>
            <Pagination
              total={userOrders?.total}
              size={PAGE_SIZE}
              current={pagination.current}
              onChange={(_, targetPage) => {
                pagination.changeCurrent(targetPage);
              }}
            />
          </div>
        )}
      </TableContainer>
      <PreviewDialog />
    </div>
  );
};

export default HomeTransactions;
