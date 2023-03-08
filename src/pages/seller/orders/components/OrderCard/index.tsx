import { IconButton, Link, Stack, Typography } from '@mui/material';
import styles from './index.less';
import { ReactComponent as CopySVG } from '@/assets/imgs/orders/copy.svg';
import { ReactComponent as DoubleRightArrowsSVG } from '@/assets/imgs/orders/doubleRightArrows.svg';
import moment from 'moment';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import classNames from 'classnames';
import CopyToClipboard from 'react-copy-to-clipboard';
import Toast from '@/components/Toast';
import { history, IUserState, useSelector, Link as UmiLink } from 'umi';
import OrderStatusComponent from '@/pages/orders/components/OrderStatusComponent';
import InitServicePNG from '@/assets/imgs/orders/init-service.png';
import { IOrderDetailsRes, ORDER_STATUS } from '@/service/orders/types';
import { ServiceLevelType } from '@/pages/services/[serviceId$]/type';
import { getCurrentToken } from '@/utils';
import OrderOperateBtns from '@/pages/orders/components/OrderOperateBtns';
import { NetworkChain } from '@/web3/define';
import { toThousands } from '@/utils';
import ViewFiles from '@/pages/request/components/ViewFiles';
import ChainNodes from '@/web3/chains';

export type IOrderCardProps = {
  detailData: IOrderDetailsRes;
  reload?: () => void;
  sellerCard?: boolean;
};

const OrderCard: React.FC<IOrderCardProps> = ({
  detailData,
  reload,
  sellerCard,
}) => {
  const { tokens, currency } = useSelector((state: any) => state.coins);
  const { uid } = useSelector<any, IUserState>((state) => state.user);

  return (
    <div className={styles['order-card-container']}>
      <div className={styles['row-1']}>
        <Stack direction="row" alignItems="center">
          <Typography
            className={styles['id']}
          >{`Order ${detailData?.id}`}</Typography>

          <CopyToClipboard
            text={String(detailData?.id)}
            onCopy={() => {
              Toast.success('Order ID copied!');
            }}
          >
            <IconButton size="small" sx={{ ml: '5px', mr: '5px' }}>
              <CopySVG />
            </IconButton>
          </CopyToClipboard>

          <Typography
            className={styles['creation-time']}
          >{`Creation time: ${moment(detailData?.createdAt * 1000).format(
            'MMM D, YYYY',
          )}`}</Typography>

          {(detailData?.status === ORDER_STATUS.Complete ||
            detailData?.status === ORDER_STATUS.Autocomplete) &&
            detailData?.txHash && (
              <Link
                target="_blank"
                href={`${
                  ChainNodes[detailData?.txChainId as NetworkChain]
                    .blockExplorerUrls
                }/tx/${detailData?.txHash}`}
              >
                <IconButton size="small" sx={{ ml: '5px' }}>
                  <img
                    src={
                      ChainNodes[detailData?.txChainId as NetworkChain]
                        .blockIcon
                    }
                  />
                </IconButton>
              </Link>
            )}
        </Stack>

        <OrderStatusComponent orderDetails={detailData} />
      </div>

      <div className={styles['row-2']}>
        <>
          {detailData?.servicePosts?.length > 0 ? (
            <ViewFiles
              posts={[detailData?.servicePosts?.[0]]}
              disabledPreview
              className={styles['view-file']}
            />
          ) : (
            <img src={InitServicePNG} className={styles['init-post']} />
          )}
        </>

        <div className={styles['row-2-col-2']}>
          {detailData?.proType === 1 ? (
            <UmiLink
              to={{
                pathname: `/services/0`,
                state: { subServerId: detailData?.proId },
              }}
            >
              <Typography className={styles['service-title']}>
                {detailData?.serviceTitle}
              </Typography>
            </UmiLink>
          ) : (
            <UmiLink to={`/request/details?offerId=${detailData?.proId}`}>
              <Typography className={styles['service-title']}>
                {`It's a customized service of ${detailData?.category} / ${detailData?.subcategory}`}
              </Typography>
            </UmiLink>
          )}

          <Typography className={styles['tag-and-count']}>
            {detailData?.subServiceLevel > 0
              ? `${ServiceLevelType[detailData?.subServiceLevel]} service x 1`
              : `Customized service x 1`}
          </Typography>

          {!detailData?.deliverDocs || detailData?.deliverDocs?.length === 0 ? (
            <>
              {detailData?.status === ORDER_STATUS.Cancel && (
                <Typography className={styles['delivery-info']}>
                  No files
                </Typography>
              )}
              {detailData?.status === ORDER_STATUS.Paid &&
                (moment.now() >
                detailData?.createdAt * 1000 +
                  detailData?.deliverTime * 86400000 ? (
                  <Typography
                    className={classNames(
                      styles['str-delivery-timeout'],
                      styles['delivery-info'],
                    )}
                  >
                    Delivery time-out
                  </Typography>
                ) : (
                  <Typography className={styles['delivery-info']}>
                    Deliver before{' '}
                    {moment(
                      detailData?.createdAt * 1000 +
                        detailData?.deliverTime * 86400000,
                    ).format('MMM D, HH:mm')}
                  </Typography>
                ))}
            </>
          ) : (
            <Typography className={styles['delivery-info']}>
              Total {Number(detailData?.deliverDocs?.length)} files (
              {moment(detailData?.sellerDeliverAt * 1000).format(
                'MMM D, HH:mm',
              )}
              )
            </Typography>
          )}
        </div>

        <div className={styles['payment-info']}>
          <Typography className={styles['payment']}>
            Payment: {toThousands(detailData?.budgetAmount || 0)}{' '}
            {getCurrentToken(
              detailData?.coinId,
              tokens,
            )?.name?.toLocaleUpperCase()}
          </Typography>
          <Typography className={styles['fee']}>
            (including {toThousands(detailData?.txFee)}{' '}
            {getCurrentToken(
              detailData?.coinId,
              tokens,
            )?.name?.toLocaleUpperCase()}{' '}
            Fee)
          </Typography>
        </div>
      </div>

      <div className={styles['row-3']}>
        <div className={styles['user-info']}>
          <IconButton
            size="small"
            onClick={() => {
              if (sellerCard) {
                history.push(
                  `/account/profile?sidebar&tab=services&userId=${detailData?.buyerId}`,
                );
              } else {
                history.push(
                  `/seller/profile?sidebar&tab=services&userId=${detailData?.sellerId}`,
                );
              }
            }}
          >
            <Avatar
              src={
                sellerCard
                  ? detailData?.buyerAvatar?.fileUrl
                  : detailData?.sellerAvatar?.fileUrl
              }
              size={36}
            />
          </IconButton>

          <Link
            href={
              sellerCard
                ? `/account/profile?sidebar&tab=services&userId=${detailData?.buyerId}`
                : `/seller/profile?sidebar&tab=services&userId=${detailData?.sellerId}`
            }
            underline="hover"
            className={styles['customer-homepage-link']}
          >
            {sellerCard ? detailData?.buyerName : detailData?.sellerName}
          </Link>
        </div>

        <div className={styles['action-box']}>
          <div className={styles['operate-btns']}>
            {detailData && uid && (
              <OrderOperateBtns
                orderDetails={detailData}
                reload={reload}
                userId={uid}
                isList
              />
            )}
          </div>
          <Button
            className={styles['details-btn']}
            onClick={() => history.push(`/orders/details?id=${detailData?.id}`)}
          >
            Details
            <DoubleRightArrowsSVG />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
