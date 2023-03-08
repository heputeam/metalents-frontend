import { IFileWithStatus } from '@/hooks/useSwiperContent';
import { Button as MuiButton, Stack, Typography } from '@mui/material';
import Uploader, {
  FileWithFid,
  IFileWithFid,
  IUploaderError,
} from '../Uploader';
import styles from './index.less';
import { ReactComponent as FileSVG } from './file.svg';
import { ReactComponent as BlueDownloadSVG } from '@/assets/imgs/orders/blue-download.svg';
import moment from 'moment';
import Button from '../Button';
import ThumbSwiper from '../ThumbSwiper';
import { useCallback, useEffect, useState } from 'react';
import { IOrderDetailsRes, ORDER_STATUS } from '@/service/orders/types';
import { useSelector } from 'umi';
import ViewFiles from '@/pages/request/components/ViewFiles';
import { handleDownload } from '@/utils/download';
import { acceptFileType } from '@/utils';
import Toast from '../Toast';
import { Errors } from '@/service/errors';

export type IFinalDocsProps = {
  limitSize: number;
  initialLength: number;
  fileList: IFileWithStatus[];
  deliverBefore: number;
  beforeUpload?: (file: FileWithFid) => void;
  onUploadSuccess?: (file: IFileWithFid) => void;
  onDelete?: (files: IFileWithStatus[]) => void;
  onError?: (error: IUploaderError[], file?: FileWithFid) => void;
  onRetry?: (file: IFileWithStatus) => void;
  onCancel: () => void;
  onReupload: () => void;
  onSubmit: () => void;
  character: 'buyer' | 'seller';
  orderDetails: IOrderDetailsRes | undefined;
};

const FinalDocs: React.FC<IFinalDocsProps> = ({
  limitSize,
  initialLength,
  fileList,
  deliverBefore,
  beforeUpload,
  onUploadSuccess,
  onDelete,
  onError,
  onRetry,
  onCancel,
  onReupload,
  onSubmit,
  character,
  orderDetails,
}) => {
  const [action, setAction] = useState<'reupload' | 'submit' | 'download' | ''>(
    '',
  );

  const { fileConfig } = useSelector((state: any) => state.fileConfig);

  useEffect(() => {
    if (character === 'seller') {
      if (
        orderDetails?.status !== ORDER_STATUS.Waiting &&
        orderDetails?.status !== ORDER_STATUS.Paid &&
        orderDetails?.status !== ORDER_STATUS.Delivery
      ) {
        setAction('download');
      } else {
        if (initialLength > 0) {
          setAction('reupload');
        } else {
          setAction('submit');
        }
      }
    } else {
      if (initialLength > 0) {
        setAction('download');
      }
    }
  }, [initialLength, orderDetails, character]);
  const [fileUploading, setFileUploading] = useState<boolean>(false);

  useEffect(() => {
    const loading = fileList?.some((item) => item?.status === 'uploading');
    setFileUploading(loading);
  }, [fileList]);

  const handleBefore = (filelist: FileWithFid[]) => {
    setAction('submit');

    return new Promise<FileWithFid[]>((resolve) => {
      if (filelist.length > 0) {
        beforeUpload?.(filelist[0]);

        resolve([filelist[0]]);
      }
    });
  };

  const getSlidesPerView = (): number => {
    switch (action) {
      case 'download':
      case 'reupload':
        return fileList.length < 9 ? fileList.length : 9;

      case 'submit':
        return fileList.length < 8 ? fileList.length : 8;

      default:
        return 8;
    }
  };
  const currentTime = moment(moment.now()).unix();
  const { config } = useSelector((state: any) => state.config);

  // const handleDownload = () => {

  // alert('下载压缩包');
  // fileList?.map((item) => {
  //   // window.location.href = item?.fileThumbnailUrl || item?.fileUrl
  //   // 创建隐藏的可下载链接
  //   var eleLink = document.createElement('a');
  //   eleLink.download = item?.fileThumbnailUrl || item?.fileUrl;
  //   eleLink.style.display = 'none';
  //   // 字符内容转变成blob地址
  //   var blob = new Blob([content]);
  //   eleLink.href = URL.createObjectURL(blob);
  //   // 触发点击
  //   document.body.appendChild(eleLink);
  //   eleLink.click();
  //   // 然后移除
  //   document.body.removeChild(eleLink);
  // })
  // console.log('下载', fileList)
  // fileList?.map((item, index) => {
  //   setTimeout(() => {
  //     if (item?.fileUrl) {
  //       window.open(item.fileUrl, '_self');
  //     }
  //   }, 20 * index);
  // });
  // };

  const handleErrorFirst = useCallback(
    (errors, file) => {
      if (errors.some((err: IUploaderError) => err.error === 'LimitError')) {
        Toast.error(`Only size < ${limitSize}MB`);
      }
      if (errors.some((err: IUploaderError) => err.error === 'AcceptError')) {
        Toast.error(`Please upload file with specified type`);
      }
      if (errors.some((err: IUploaderError) => err.error === 'NetworkError')) {
        Toast.error(Errors['*']);
      }
      onError?.(errors, file);
    },
    [onError],
  );

  return (
    <div className={styles['final-docs-container']}>
      {orderDetails && (
        <>
          {character === 'seller' &&
            initialLength === 0 &&
            fileList.length <= 1 && (
              <>
                {currentTime <
                orderDetails?.createdAt + orderDetails?.deliverTime * 86400 ? (
                  <div
                    className={styles['final-docs-container-initial']}
                    style={{ display: fileList.length >= 1 ? 'none' : 'flex' }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      className={styles['initial-uploader-label']}
                    >
                      You should deliver before{' '}
                      {`${moment(
                        orderDetails?.createdAt * 1000 +
                          (orderDetails?.deliverTime +
                            Number(config?.ORDER_AUTO_CANCEL?.cfgVal)) *
                            86400000,
                      ).format('MMM D, HH:mm')}`}
                      . Once submitted, the order status will change to the{' '}
                      {config?.DELIVERY_ORDER_AUTO_COMPLETED?.cfgVal}-day review
                      period.
                    </Typography>
                    {fileList.length <= 1 && (
                      <Uploader
                        icon={null}
                        limitSize={limitSize}
                        maxCount={fileConfig?.order_delivery?.fileCount}
                        accept={
                          fileConfig?.order_delivery?.fileExt
                            ? acceptFileType(
                                fileConfig?.order_delivery?.fileExt,
                              )
                            : undefined
                        }
                        onBefore={handleBefore}
                        onError={handleErrorFirst}
                        onSuccess={(res) => {
                          setAction('submit');
                          onUploadSuccess?.(res);
                        }}
                      >
                        <MuiButton
                          disabled={fileUploading}
                          classes={{ root: styles['initial-upload-btn'] }}
                          startIcon={<FileSVG />}
                          variant="outlined"
                        >
                          <Typography>Upload files</Typography>
                        </MuiButton>
                      </Uploader>
                    )}
                  </div>
                ) : (
                  <div
                    className={styles['final-docs-container-initial']}
                    style={{ display: fileList.length >= 1 ? 'none' : 'flex' }}
                  >
                    <div className={styles['out-time']}>Out of time</div>
                    {fileList.length <= 1 && (
                      <Uploader
                        icon={null}
                        limitSize={limitSize}
                        onBefore={handleBefore}
                        onError={handleErrorFirst}
                        onSuccess={(res) => {
                          setAction('submit');
                          onUploadSuccess?.(res);
                        }}
                      >
                        <MuiButton
                          classes={{ root: styles['initial-upload-btn'] }}
                          startIcon={<FileSVG />}
                          variant="outlined"
                          disabled={fileUploading}
                        >
                          <Typography>Upload files</Typography>
                        </MuiButton>
                      </Uploader>
                    )}
                    <Typography
                      variant="body2"
                      color="#E03A3A"
                      sx={{ mt: '7px' }}
                    >
                      If the order is cancelled automatically after the
                      deadline, it may affect your credit and level.
                    </Typography>
                  </div>
                )}
              </>
            )}

          {(initialLength > 0 || fileList.length >= 1) && (
            <div className={styles['final-docs-container-later']}>
              <div className={styles['container-header']}>
                <div className={styles['container-header-left']}>
                  <Typography className={styles['deliver-before']}>
                    Deliver before&nbsp;
                    {`${moment(
                      orderDetails?.createdAt * 1000 +
                        (orderDetails?.deliverTime +
                          Number(config?.ORDER_AUTO_CANCEL?.cfgVal)) *
                          86400000,
                    ).format('MMM D, HH:mm')}`}
                  </Typography>

                  <Typography className={styles['files-count']}>
                    Total {fileList.length} files
                    <>
                      {orderDetails?.sellerDeliverAt && action !== 'submit'
                        ? `(${moment(
                            orderDetails?.sellerDeliverAt * 1000,
                          ).format('MMM D HH:mm')})`
                        : ''}
                    </>
                  </Typography>
                </div>

                {character === 'seller' && action === 'reupload' && (
                  <MuiButton
                    startIcon={<FileSVG />}
                    classes={{ root: styles['reupload-btn'] }}
                    disabled={fileUploading}
                    onClick={() => {
                      setAction('submit');
                      onReupload();
                    }}
                  >
                    Re-upload the files
                  </MuiButton>
                )}

                {character === 'seller' && action === 'submit' && (
                  <Stack spacing={20} direction="row">
                    <Button
                      variant="contained"
                      className={styles['btn']}
                      disabled={
                        !fileList.some((file) => file.status === 'success') ||
                        fileUploading
                      }
                      onClick={() => {
                        onSubmit();
                      }}
                    >
                      Submit
                    </Button>
                    <Button
                      variant="outlined"
                      className={styles['btn']}
                      onClick={() => {
                        setAction('reupload');
                        onCancel();
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                )}

                {action === 'download' && (
                  <MuiButton
                    startIcon={<BlueDownloadSVG />}
                    classes={{ root: styles['download-btn'] }}
                    onClick={() => {
                      handleDownload(fileList);
                    }}
                  >
                    Download files
                  </MuiButton>
                )}
              </div>
              <div className={styles['swip-box']}>
                {action === 'download' || action === 'reupload' ? (
                  <ViewFiles posts={fileList || []} />
                ) : (
                  <ThumbSwiper
                    slidesPerView={getSlidesPerView()}
                    limitSize={limitSize}
                    countLimit={fileConfig?.order_delivery?.fileCount}
                    accept={
                      fileConfig?.order_delivery?.fileExt
                        ? acceptFileType(fileConfig?.order_delivery?.fileExt)
                        : undefined
                    }
                    contentList={fileList}
                    buttonLabel={`Max ${fileConfig?.order_delivery?.fileCount}, <${limitSize}MB`}
                    canUpload={action === 'submit'}
                    canDelete={action === 'submit'}
                    beforeUpload={beforeUpload}
                    onUploadSuccess={onUploadSuccess}
                    onError={onError}
                    onRetry={onRetry}
                    onDelete={onDelete}
                    spaceBetween={22}
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* {character === 'buyer' && (
        <div className={styles['final-docs-container-buyer']}>
          <Typography className={styles['buyer-label']}>
            You should deliver before{' '}
            {moment(deliverBefore * 1000).format('MMM D, YYYY HH:mm')}. Once
            submitted, the order will change to the 10-day review period.
          </Typography>
        </div>
      )} */}
    </div>
  );
};

export default FinalDocs;
