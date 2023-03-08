import { IOrderDetailsRes, ORDER_STATUS } from '@/service/orders/types';
import { Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import styles from './index.less';
import moment from 'moment';
import { useDispatch, useSelector } from 'umi';
import FinalDocs from '@/components/FinalDocs';
import { useSwiperContent } from '@/hooks/useSwiperContent';
import { useUploadFile } from '@/hooks/useUploadFile';
import Toast from '@/components/Toast';
import { Errors } from '@/service/errors';
import { FileWithFid, IFileWithFid } from '@/components/Uploader';
import { useRequest } from 'ahooks';
import { postUpdateOrderDeliverDocs } from '@/service/orders';
import { uid } from 'react-uid';
import { getFileMaxSize } from '@/utils';

export interface IUploadBtn {
  userId: number | undefined;
  orderDetails: IOrderDetailsRes | undefined;
}
export interface IOrderFilesComponent {
  userId: number | undefined;
  orderDetails: IOrderDetailsRes | undefined;
  reload?: () => void;
  loading?: boolean;
}

const OrderFilesComponent: React.FC<IOrderFilesComponent> = ({
  userId,
  orderDetails,
  reload,
  loading,
}) => {
  const currentTime = moment(moment.now()).unix();

  const { config } = useSelector((state: any) => state.config);
  const { uid } = useSelector((state: any) => state.user);
  const { fileConfig } = useSelector((state: any) => state.fileConfig);

  const {
    contentList,
    setContentList,
    checkFile,
    batchBeforeUpload,
    batchAfterSuccess,
    batchAfterError,
    batchAfterRetry,
  } = useSwiperContent();

  useEffect(() => {
    setContentList(orderDetails?.deliverDocs || []);
  }, [orderDetails]);

  const { run: uploadFile } = useUploadFile({
    manual: true,
    onSuccess: (resp: any, params: any) => {
      if (resp.code === 200) {
        // ↓  error code for test
        // if (resp.code !== 200) {
        batchAfterSuccess(params[0].fid, resp?.data.path);
        Toast.success('Successfully uploaded!');
      } else {
        batchAfterError(params[0].fid);
        Toast.error(Errors[resp.code] || Errors['*']);
      }
    },
    onError: (resp: any, params: any) => {
      batchAfterError(params[0].fid);
      Toast.error(Errors[resp.code] || Errors['*']);
    },
  });
  const LimitSize = getFileMaxSize(fileConfig?.order_delivery?.fileMaxSize);

  const beforeUpload = useCallback(
    (file: FileWithFid): void => {
      const errors = checkFile({
        file,
        limitSize: LimitSize,
      });

      if (errors.length > 0) {
        return;
      }

      batchBeforeUpload(file);
    },
    [batchBeforeUpload],
  );

  const onError = useCallback(
    (_, file) => {
      if (file) {
        batchAfterError(file?.fid);
      }
    },
    [batchAfterError],
  );

  const onRetry = useCallback(
    (file) => {
      if (file?.originFileObj) {
        uploadFile(file.originFileObj);
        batchAfterRetry(file.fid);
      }
    },
    [uploadFile, batchAfterRetry],
  );

  const onSuccess = useCallback(
    (file: IFileWithFid): void => {
      batchAfterSuccess(file.fid, file.fileUrl);
    },
    [batchAfterSuccess],
  );

  const { data, run: updateFile } = useRequest(
    () =>
      postUpdateOrderDeliverDocs({
        orderId: orderDetails?.id,
        deliverDocs: contentList.map((item) => ({
          ...item,
          fileThumbnailUrl: item.fileUrl,
          userId: uid,
        })),
      }),
    {
      manual: true,
      onSuccess: (res: any) => {
        const { code, data } = res;
        if (code === 200 && data?.success) {
          reload?.();
        } else {
          Toast.error('Unknown system failure: Please try');
        }
      },
    },
  );

  const dispatch = useDispatch();

  const handelSellerSubmitFile = () => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'orderFileSubmissionDialog',
        content:
          Number(orderDetails?.deliverDocs?.length) > 0
            ? `Your operation will overwrite the last submitted files, please proceed with caution.`
            : `Once the documents are submitted, the status of the order will change to the ${config?.DELIVERY_ORDER_AUTO_COMPLETED?.cfgVal}-day review period. Are you sure to submit the documents?`,
        onSuccess: updateFile,
      },
    });
  };

  return (
    <div className={styles['file-box']}>
      {!orderDetails?.deliverDocs || orderDetails?.deliverDocs?.length === 0 ? (
        <>
          {orderDetails?.status === ORDER_STATUS.Paid && (
            <>
              {
                // 卖家未交付
                userId === orderDetails?.sellerId ? (
                  <FinalDocs
                    orderDetails={orderDetails}
                    character="seller"
                    limitSize={LimitSize}
                    initialLength={orderDetails?.deliverDocs?.length || 0}
                    fileList={contentList}
                    deliverBefore={Math.floor(Date.now() / 1000)}
                    beforeUpload={beforeUpload}
                    onUploadSuccess={onSuccess}
                    onError={onError}
                    onRetry={onRetry}
                    onDelete={setContentList}
                    onCancel={() => {
                      setContentList(orderDetails?.deliverDocs || []);
                    }}
                    onReupload={() => {
                      setContentList([]);
                    }}
                    onSubmit={() => {
                      handelSellerSubmitFile();
                    }}
                  />
                ) : (
                  // 买家进行中的状态
                  <>
                    {
                      // 正常进行中
                      currentTime <
                      orderDetails?.createdAt +
                        orderDetails?.deliverTime * 86400 ? (
                        <div className={styles['first-upload']}>
                          <Typography variant="body1" fontWeight={500}>
                            Seller will deliver before{' '}
                            {`${moment(
                              orderDetails?.createdAt * 1000 +
                                (orderDetails?.deliverTime +
                                  Number(config?.ORDER_AUTO_CANCEL?.cfgVal)) *
                                  86400000,
                            ).format('MMM D, HH:mm')}`}
                            . Once submitted, the order status will change to
                            the {config?.DELIVERY_ORDER_AUTO_COMPLETED?.cfgVal}
                            -day review period.
                          </Typography>
                        </div>
                      ) : (
                        // 逾期
                        <div className={styles['first-upload']}>
                          <div className={styles['out-time']}>Out of time</div>
                          <Typography
                            variant="body2"
                            color="#E03A3A"
                            sx={{ mt: '20px' }}
                          >
                            The order will be cancelled automatically after the
                            deadline, and the funds will be returned to you in
                            full.
                          </Typography>
                        </div>
                      )
                    }
                  </>
                )
              }
            </>
          )}
          {orderDetails?.status === ORDER_STATUS.Cancel && (
            <div className={styles['first-upload']}>
              <Typography variant="body1" color="#444444">
                No files
              </Typography>
            </div>
          )}
        </>
      ) : (
        <>
          {!loading && userId && orderDetails && (
            <FinalDocs
              orderDetails={orderDetails}
              character={userId === orderDetails?.sellerId ? 'seller' : 'buyer'}
              limitSize={LimitSize}
              initialLength={orderDetails?.deliverDocs?.length || 0}
              fileList={contentList}
              deliverBefore={Math.floor(Date.now() / 1000)}
              beforeUpload={beforeUpload}
              onUploadSuccess={onSuccess}
              onError={onError}
              onRetry={onRetry}
              onDelete={setContentList}
              onCancel={() => {
                setContentList(orderDetails?.deliverDocs || []);
              }}
              onReupload={() => {
                setContentList([]);
              }}
              onSubmit={() => {
                handelSellerSubmitFile();
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default OrderFilesComponent;
