import Button from '@/components/Button';
import BackIcon from '@/components/ProfileFormItem/BackIcon';
import MyStepper, { stepValueType } from '@/pages/seller/components/Stepper';
import {
  Checkbox,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import {
  history,
  useDispatch,
  useLocation,
  useSelector,
  Link as UmiLink,
} from 'umi';
import { ServiceLevelType } from '@/pages/services/[serviceId$]/type';
import { IFile } from '@/types';
import { getCurrentToken, toThousands } from '@/utils';
import { ITokensItem } from '@/service/services/types';
import InitServicePNG from '@/assets/imgs/orders/init-service.png';
import { IUserState } from '@/models/user';
import moment from 'moment';
import { ReactComponent as DownloadRequestSVG } from '@/assets/imgs/orders/download-request.svg';
import {
  IOrderDetailsRes,
  OrderCreateType,
  ORDER_STATUS,
} from '@/service/orders/types';
import OrderStatusComponent from '../components/OrderStatusComponent';
import OrderOperateBtns from '../components/OrderOperateBtns';
import OrderFilesComponent from '../components/OrderFilesComponent';
import OrderFileSubmissionDialog from '../components/OrderFileSubmissionDialog';
import MintNFTDialog from '../components/MintNFTDialog';
import { UserRequestsVisibility } from '@/service/user/types';
import { HideOrShowRequestDialog } from '@/pages/account/requests/components/HideOrShowRequestDialog';
import { useRequest } from 'ahooks';
import { getOrderDetails, postOrderPublic } from '@/service/orders';
import { IResponse } from '@/service/types';
import Toast from '@/components/Toast';
// import JSZip from 'jszip';
// import FileSaver from 'file-saver';
// import { saveAs } from 'file-saver';
import axios from 'axios';
import VerifiedSVG from '@/assets/imgs/home/verified.svg';
import ViewFiles from '@/pages/request/components/ViewFiles';
import PreviewDialog from '@/pages/request/components/PreviewDialog';
import ConfirmProductDialog from '@/pages/orders/components/ConfirmProductDialog';
import OrderCancelDetailDialog from '@/pages/orders/components/OrderCancelDetailDialog';
import SellerReplyCancelDialog from '@/pages/orders/components/SellerReplyCancelDialog';
import CancelOrderDialog from '@/pages/orders/components/CancelOrderDialog';
import ViewCommentDialog from '@/pages/orders/components/ViewCommentDialog';
import Loading from '@/components/Loading';
import NotQualified from '../components/NotQualified';
import ChainNodes, { NetworkChain } from '@/web3/chains';

export interface IOrderInfo {
  label: string;
  value: string | React.ReactElement;
}

const OrdersDetail: React.FC = () => {
  const [steps, setSteps] = useState<stepValueType[]>([
    {
      label: 'Confirm order & Pay',
      description: 'Freeze the funds',
    },
    {
      label: 'Order in progress',
      description: 'Complete the agreed work',
    },
    {
      label: 'Review the service',
      description: 'Wait for review',
    },
    {
      label: 'Confirm & Close order',
      description: 'Package and evaluate orders',
    },
  ]);
  const [activeStep, setActiveStep] = useState<number>(0);

  const [orderInfo, setOrderInfo] = useState<IOrderInfo[]>([]);
  const [orderDetails, setOrderDetails] = useState<IOrderDetailsRes>();

  const [currentToken, setCurrentToken] = useState<ITokensItem | undefined>(
    undefined,
  );
  const { tokens } = useSelector((state: any) => state.coins);
  const { uid } = useSelector<any, IUserState>((state) => state.user);
  const [hasQualified, setHasQualified] = useState<boolean>(false);

  const { state } = useLocation() as any;

  const dispatch = useDispatch();

  const { query } = useLocation() as any;

  const {
    data,
    loading,
    run: updateOrderDetails,
  } = useRequest<IResponse<IOrderDetailsRes>, any>(() =>
    getOrderDetails(query?.id),
  );

  useEffect(() => {
    setOrderDetails(data?.data);
  }, [data]);

  useEffect(() => {
    if (orderDetails) {
      const { status } = orderDetails;
      if (
        status === ORDER_STATUS.Applycancel ||
        status === ORDER_STATUS.Applycustomer ||
        status === ORDER_STATUS.Cancel
      ) {
        setSteps([
          {
            label: 'Confirm order & Pay',
            description: 'Freeze the funds',
          },
          {
            label: 'Order in progress',
            description: 'Complete the agreed work',
          },
          {
            label: 'Payment  refunding',
            description: 'Waiting for negotiation',
          },
          {
            label: 'Order canceled',
            description: 'No processing fee return',
          },
        ]);
      }

      if (status === ORDER_STATUS.Paid) {
        setActiveStep(1);
      } else if (
        status === ORDER_STATUS.Delivery ||
        status === ORDER_STATUS.Applycancel ||
        status === ORDER_STATUS.Applycustomer
      ) {
        setActiveStep(2);
      } else if (
        status === ORDER_STATUS.Complete ||
        status === ORDER_STATUS.Cancel ||
        status === ORDER_STATUS.Autocomplete
      ) {
        setActiveStep(3);
      } else {
        setActiveStep(0);
      }
    }
  }, [orderDetails]);

  useEffect(() => {
    if (orderDetails && tokens) {
      let tempToken = getCurrentToken(orderDetails?.coinId, tokens);
      setCurrentToken(tempToken);
    }
  }, [orderDetails, tokens]);

  const goBack = () => {
    history.goBack();
  };

  const getFile = (url: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          responseType: 'arraybuffer',
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.toString());
        });
    });
  };

  const handleDownload = (files: IFile[]) => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'previewDialog',
        previewIndex: 0,
        posts: files,
      },
    });
    // console.log('文件', files);
    // // files?.map((item) => {
    // //   getFile(item?.fileUrl)
    // // })

    // // 创建JSZip实例
    // const zip = new JSZip();
    // // promise对象
    // let newFile: any[] = [];
    // // 文件后缀名
    // let suffix = '';
    // files.forEach((el) => {
    //   // 生成promise实例
    //   const promise = getFile(el?.fileThumbnailUrl || el?.fileUrl).then(
    //     (res: any) => {
    //       zip.file(el?.fileName, res);
    //     },
    //   );
    //   newFile.push(promise);
    // });
    // // 异步处理
    // Promise.all(newFile).then(() => {
    //   // 生成二进制流
    //   zip
    //     .generateAsync({
    //       type: 'blob',
    //     })
    //     .then((content) => {
    //       saveAs(content, '压缩文件.zip');
    //       /* 保存文件 */
    //     });
    // });
  };

  useEffect(() => {
    const tempOrderInfo: IOrderInfo[] = [
      {
        label: 'Payment ID',
        value: `#${orderDetails?.paymentId}` || '-',
      },
      {
        label: 'Order ID',
        value: `#${orderDetails?.id}` || '-',
      },
      {
        label: 'Creation time',
        value:
          Number(orderDetails?.createdAt) > 0
            ? `${moment(Number(orderDetails?.createdAt) * 1000).format(
                'MMM D, YYYY HH:mm',
              )}`
            : '-',
      },
      {
        label: 'Last submission time',
        value:
          Number(orderDetails?.sellerDeliverAt) > 0
            ? `${moment(Number(orderDetails?.sellerDeliverAt) * 1000).format(
                'MMM D, YYYY HH:mm',
              )}`
            : '-',
      },
      {
        label: 'Order completion time',
        value:
          orderDetails?.status === ORDER_STATUS.Complete ||
          orderDetails?.status === ORDER_STATUS.Autocomplete ||
          orderDetails?.status === ORDER_STATUS.Cancel
            ? `${moment(Number(orderDetails?.modifyAt) * 1000).format(
                'MMM D, YYYY HH:mm',
              )}`
            : '-',
      },
      {
        label: 'Order Txn',
        value: orderDetails?.txHash ? (
          <IconButton
            href={`${
              ChainNodes[orderDetails?.txChainId as NetworkChain]
                .blockExplorerUrls
            }/tx/${orderDetails?.txHash}`}
            size="small"
            target="_blank"
          >
            <img
              src={
                ChainNodes[orderDetails?.txChainId as NetworkChain].blockIcon
              }
              className={styles['explorer-icon']}
            />
          </IconButton>
        ) : (
          '-'
        ),
      },
    ];
    setOrderInfo(tempOrderInfo);
    if (uid === orderDetails?.buyerId || uid === orderDetails?.sellerId) {
      setHasQualified(true);
    } else {
      setHasQualified(false);
    }
  }, [orderDetails]);

  const { run: changeDocPublic } = useRequest(
    (params) => postOrderPublic(params),
    {
      manual: true,
      onSuccess: (res: any) => {
        const { code, data } = res;
        if (code === 200 && data?.success) {
          updateOrderDetails();
        } else {
          Toast.error('Unknown system failure: Please try');
        }
      },
    },
  );

  const handleCheckDisplay = () => {
    changeDocPublic({
      display: !orderDetails?.fileDisplay,
      orderId: orderDetails?.id,
    });
  };

  const handleCheck = () => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'HideOrShowRequestDialog',
        type: orderDetails?.fileDisplay
          ? UserRequestsVisibility.HIDDEN
          : UserRequestsVisibility.SHOW,
        title: `the files`,
        content: (
          <p className={styles['dialog-content']}>
            {!orderDetails?.fileDisplay ? (
              <>
                Are you sure you want to show all media files of
                <br />
                your completed orders as thumbnails? Share the files can
                increase the traceability of the works, and help more people.
              </>
            ) : (
              <>
                Are you sure you want to hide
                <br />
                all files of your completed orders? Share the files can increase
                the traceability of the works, and help more people.
              </>
            )}
          </p>
        ),
        btnText: orderDetails?.fileDisplay ? 'Hide all' : 'Show all',
        loading: false,
        handleConfirm: handleCheckDisplay,
      },
    });
  };

  return (
    <Container disableGutters maxWidth="lg" className={styles['orders-detail']}>
      {loading ? (
        <div className={styles['loading']}>
          <Loading />
        </div>
      ) : (
        <>
          {!hasQualified ? (
            <NotQualified />
          ) : (
            <>
              <MyStepper value={steps} activeStep={activeStep} />
              <section className={styles['order-section']}>
                <Button
                  classes={{ root: styles['back-btn'] }}
                  startIcon={<BackIcon />}
                  onClick={goBack}
                >
                  Back
                </Button>

                <Typography variant="h2" classes={{ root: styles['title'] }}>
                  Order ID.{orderDetails?.id}
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  className={styles['content-header']}
                >
                  <Stack direction="row" alignItems="center">
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      className={styles['user-name']}
                    >
                      {uid === orderDetails?.buyerId ? 'Seller' : 'Buyer'}:
                      &nbsp;
                      <span style={{ fontWeight: '700' }}>
                        {uid === orderDetails?.buyerId
                          ? orderDetails?.sellerName
                          : orderDetails?.buyerName}
                      </span>
                    </Typography>
                    {orderDetails?.sellerIsVerify === 'verified' && (
                      <img
                        src={VerifiedSVG}
                        alt=""
                        width={16}
                        style={{ marginLeft: 6, marginRight: 12 }}
                      />
                    )}
                    <Typography variant="body1" color="#444444" ml={26}>
                      {`Creation time:  ${moment(
                        (orderDetails?.createdAt || 0) * 1000,
                      ).format('MMM D, YYYY HH:mm')}`}
                    </Typography>
                  </Stack>
                  <OrderStatusComponent
                    orderDetails={orderDetails}
                    reload={updateOrderDetails}
                  />
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  className={styles['service-box']}
                >
                  <div className={styles['service']}>
                    {orderDetails?.proType === OrderCreateType.service &&
                    orderDetails?.servicePosts?.length > 0 ? (
                      <ViewFiles
                        posts={[orderDetails?.servicePosts?.[0]] || []}
                        disabledPreview
                        className={styles['view-file']}
                      />
                    ) : (
                      <img
                        src={InitServicePNG}
                        className={styles['init-post']}
                      />
                    )}
                    <Stack ml={10}>
                      {orderDetails?.proType === 1 ? (
                        <UmiLink
                          to={{
                            pathname: `/services/0`,
                            state: { subServerId: orderDetails?.proId },
                          }}
                        >
                          <Typography className={styles['service-title']}>
                            {orderDetails?.serviceTitle}
                          </Typography>
                        </UmiLink>
                      ) : (
                        <UmiLink
                          to={`/request/details?offerId=${orderDetails?.proId}`}
                        >
                          <Typography className={styles['service-title']}>
                            {`It's a customized service of ${orderDetails?.category} / ${orderDetails?.subcategory}`}
                          </Typography>
                        </UmiLink>
                      )}
                      <div className={styles['service-type']}>
                        {orderDetails?.proType === OrderCreateType.service
                          ? `${
                              ServiceLevelType[orderDetails?.subServiceLevel]
                            } service x 1`
                          : `Customized service x 1`}
                      </div>
                    </Stack>
                  </div>
                  <div className={styles['price']}>
                    <Typography variant="h2">
                      Total:&nbsp;
                      <span className={'price-num'}>
                        {toThousands(orderDetails?.budgetAmount || 0)}{' '}
                        {currentToken?.name?.toLocaleUpperCase()}
                      </span>
                    </Typography>
                    <Typography className={styles['fee']}>
                      {`(including
              ${toThousands(
                orderDetails?.txFee || 0,
              )} ${currentToken?.name?.toLocaleUpperCase()} Fee)`}
                    </Typography>
                  </div>
                </Stack>

                <div className={styles['request']}>
                  <Typography variant="body1" fontWeight={500}>
                    Request Description:
                  </Typography>
                  <Typography
                    variant="body2"
                    mt={10}
                    color="#444444"
                    sx={{ lineHeight: '24px', wordBreak: 'break-word' }}
                  >
                    {orderDetails?.description}
                  </Typography>
                  <Stack direction="row" mt={20} justifyContent="space-between">
                    <Typography variant="body1" fontWeight={500}>
                      Delivery time: &nbsp;
                      <span>{`${orderDetails?.deliverTime} ${
                        Number(orderDetails?.deliverTime) > 1 ? 'Days' : 'Day'
                      }`}</span>
                    </Typography>
                    {Number(orderDetails?.files?.length) > 0 && (
                      <div
                        className={styles['download-box']}
                        onClick={() =>
                          handleDownload(orderDetails?.files || [])
                        }
                      >
                        <DownloadRequestSVG />
                        <Typography
                          variant="body1"
                          className={styles['download']}
                        >
                          View request files
                        </Typography>
                      </div>
                    )}
                  </Stack>
                </div>
                {/* 操作按钮组件 */}
                <div className={styles['operate-btns']}>
                  {orderDetails && uid && (
                    <OrderOperateBtns
                      orderDetails={orderDetails}
                      reload={updateOrderDetails}
                      userId={uid}
                    />
                  )}
                </div>

                <div className={styles['final-documents']}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body1" fontWeight={500} mb={20}>
                      The Final Documents :
                    </Typography>
                    {uid === orderDetails?.buyerId &&
                      (orderDetails?.status === ORDER_STATUS.Complete ||
                        orderDetails?.status === ORDER_STATUS.Autocomplete) && (
                        <div className={styles['checkbox-box']}>
                          <Checkbox
                            classes={{ root: styles['checkbox-root'] }}
                            size="small"
                            checked={orderDetails?.fileDisplay}
                            onChange={handleCheck}
                          />
                          <Typography variant="body1" color="#111111">
                            I want the files to be publicly displayed
                          </Typography>
                        </div>
                      )}
                  </Stack>

                  {/* 文件组件 */}
                  <OrderFilesComponent
                    userId={uid}
                    orderDetails={orderDetails}
                    loading={loading}
                    reload={updateOrderDetails}
                  />
                </div>
                <div className={styles['order-info']}>
                  <Typography variant="body1" fontWeight={500} mb={20}>
                    Order Information:
                  </Typography>
                  <Grid container spacing={2} rowSpacing={17}>
                    {orderInfo?.map((item) => {
                      return (
                        <Grid item xs={4} key={item?.label}>
                          <Stack direction="row" alignItems="center">
                            <Typography color="#444444">
                              {item?.label}:
                            </Typography>
                            <Typography color="#444444" ml={16}>
                              {item?.value}
                            </Typography>
                          </Stack>
                        </Grid>
                      );
                    })}
                  </Grid>
                </div>
              </section>
            </>
          )}
        </>
      )}

      <OrderFileSubmissionDialog />
      <MintNFTDialog />
      <HideOrShowRequestDialog />
      <PreviewDialog />
      <ConfirmProductDialog />
      <ViewCommentDialog />
      <OrderCancelDetailDialog />
      <SellerReplyCancelDialog />
      <CancelOrderDialog />
    </Container>
  );
};

export default OrdersDetail;
