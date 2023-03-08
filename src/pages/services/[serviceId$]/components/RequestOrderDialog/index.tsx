import Dialog from '@/components/Dialog';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, history } from 'umi';
import { IDialogState } from '@/models/dialog';
import styles from './index.less';
import { Stack, Typography } from '@mui/material';
import { ICusSubService } from '../ServiceSubmit';
import { IResDetail, ServiceLevelType } from '../../type';
import { acceptFileType, getCurrentToken, getFileMaxSize } from '@/utils';
import { ITokens, ITokensItem } from '@/service/services/types';
import TextAreaFormItem from '@/components/ProfileFormItem/TextAreaFormItem';
import { useFormik } from 'formik';
import ThumbSwiper from '@/components/ThumbSwiper';
import { useSwiperContent } from '@/hooks/useSwiperContent';
import { useUploadFile } from '@/hooks/useUploadFile';
import Toast from '@/components/Toast';
import { Errors } from '@/service/errors';
import { FileWithFid, IFileWithFid } from '@/components/Uploader';
import Button from '@/components/Button';
// import { EPostType } from '@/service/user/types';
import { OrderCreateType } from '@/service/orders/types';
import { toThousands } from '@/utils';
import { EPostType } from '@/service/user/types';

const request_order_key = 'requestOrderDialog';

export interface IRequestOrderDialog {}

export interface IRequestOrderDialogState {
  visible: boolean;
  serviceDetail: ICusSubService;
  // sellerId: number;
  detailData: IResDetail;
}

const RequestOrderDialog: React.FC<IRequestOrderDialog> = () => {
  const dispatch = useDispatch();
  const [currentToken, setCurrentToken] = useState<ITokensItem>();
  const { tokens } = useSelector<any, ITokens>((state) => state.coins);
  const { uid } = useSelector((state: any) => state.user);
  const { fileConfig } = useSelector((state: any) => state.fileConfig);

  const dialogState: IRequestOrderDialogState = useSelector<
    any,
    IDialogState & IRequestOrderDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[request_order_key],
  }));
  const { serviceDetail, detailData } = dialogState;

  const formik = useFormik({
    initialValues: {
      description: '',
      posts: [],
      serviceDetail: serviceDetail,
      detailData: detailData,
    },
    onSubmit: (values) => {
      const initInfo = {
        serviceId: serviceDetail?.id,
        sellerId: detailData?.userId,
        orderType: OrderCreateType.service,
        service: {
          title: detailData?.title,
          posts: detailData?.posts,
          category: detailData?.category,
          subcategory: detailData?.subcategory,
          level: serviceDetail?.level,
          budgetAmount: serviceDetail?.budgetAmount,
          coinId: serviceDetail?.coinId,
          deliverTime: serviceDetail?.deliverTime,
        },
        request: {
          description: values.description,
          posts: values.posts,
        },
      };
      onClose();
      history.push('/orders/apply', {
        initInfo: initInfo,
      });
    },
  });

  useEffect(() => {
    formik.setFieldValue('description', '');
    formik.setFieldValue('posts', []);
    formik.setFieldValue('serviceDetail', dialogState?.serviceDetail);
    formik.setFieldValue('detailData', dialogState?.detailData);
    setContentList([]);
  }, [dialogState?.serviceDetail, dialogState?.detailData]);

  useEffect(() => {
    if (serviceDetail && tokens) {
      const tempToken = getCurrentToken(serviceDetail?.coinId, tokens);
      setCurrentToken(tempToken);
    }
  }, [serviceDetail, tokens]);

  const onClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: request_order_key,
      },
    });
  };

  const [uploading, setUploading] = useState<boolean>(false);

  const {
    contentList,
    setContentList,
    checkFile,
    batchBeforeUpload,
    batchAfterSuccess,
    batchAfterError,
    batchAfterRetry,
  } = useSwiperContent();

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
  // window.formik = formik;
  useEffect(() => {
    let posts = contentList
      .filter((item) => item.status === 'success')
      .map((item) => ({
        ...item,
        fileThumbnailUrl: item.fileUrl,
        id: 0,
        type: fileConfig?.service_create_order?.postType || EPostType.service,
        userId: uid,
      }));

    formik.setFieldValue('posts', posts);
    const loading = contentList?.some((item) => item?.status === 'uploading');
    setUploading(loading);
  }, [contentList]);

  const acceptedFileType = useMemo(() => {
    return fileConfig?.service_create_order?.fileExt
      ? acceptFileType(fileConfig?.service_create_order?.fileExt)
      : undefined;
  }, [fileConfig]);

  const beforeUpload = useCallback(
    (file: FileWithFid): void => {
      const errors = checkFile({
        file,
        accept: acceptedFileType,
        limitSize: getFileMaxSize(
          fileConfig?.service_create_order?.fileMaxSize,
        ),
      });

      if (errors.length > 0) {
        return;
      }

      batchBeforeUpload(file);
    },
    [batchBeforeUpload, acceptedFileType],
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

  const handleSubmit = () => {
    if (!formik?.values?.description?.trim()) {
      return Toast.error(`Input box can't be blank`);
    }
    formik?.handleSubmit();
  };

  return (
    <Dialog
      visible={dialogState.visible}
      title="Submit your request"
      onClose={onClose}
      backBtn={<div />}
    >
      <div className={styles['request-order-dialog']}>
        <Typography variant="body1" sx={{ fontWeight: '500' }}>
          About the Service
        </Typography>
        <div className={styles['item-box']}>
          <Typography classes={{ root: styles['label'] }}>Service:</Typography>
          <Typography variant="body1">
            {`${ServiceLevelType[serviceDetail?.level]} service x 1`}
          </Typography>
        </div>

        <div className={styles['item-box']}>
          <Typography classes={{ root: styles['label'] }}>
            Delivery time:
          </Typography>
          <Typography variant="body1">
            {serviceDetail?.deliverTime}{' '}
            {serviceDetail?.deliverTime > 1 ? 'Days' : 'Day'}
          </Typography>
        </div>

        <div className={styles['item-box']}>
          <Typography classes={{ root: styles['label'] }}>Price:</Typography>
          <Stack direction="row" alignItems="center">
            <Typography variant="body1">
              <span className="price-num">
                {toThousands(serviceDetail?.budgetAmount || 0)}{' '}
                {currentToken?.name?.toLocaleUpperCase()}
              </span>
            </Typography>
            <img
              width={24}
              height={24}
              src={currentToken?.avatar}
              style={{ marginLeft: '8px' }}
            />
          </Stack>
        </div>

        <div className={styles['item-box']}>
          <Typography classes={{ root: styles['label'] }}>
            Final Documents:
          </Typography>
          <Typography variant="body1">
            {serviceDetail?.revisions === -1
              ? 'Unlimited'
              : serviceDetail?.revisions}{' '}
            Revisions
          </Typography>
        </div>

        <div className={styles['final-description-box']}>
          <Typography classes={{ root: styles['description'] }}>
            {serviceDetail?.finalDocs}
          </Typography>
        </div>

        <Typography variant="body1" sx={{ fontWeight: '500', mt: 25 }}>
          Describe your request:
        </Typography>
        <TextAreaFormItem
          label=""
          placeholder="Enter..."
          formik={formik}
          name="description"
          maxLength={400}
          minHeight="109px"
          className={styles['description-box']}
        />

        <ThumbSwiper
          slidesPerView={contentList.length < 4 ? contentList.length : 4.5}
          contentList={contentList}
          limitSize={getFileMaxSize(
            fileConfig?.service_create_order?.fileMaxSize,
          )}
          countLimit={fileConfig?.service_create_order?.fileCount || 1}
          beforeUpload={beforeUpload}
          onUploadSuccess={onSuccess}
          onError={onError}
          onRetry={onRetry}
          onDelete={setContentList}
          accept={
            fileConfig?.service_create_order?.fileExt
              ? acceptFileType(fileConfig?.service_create_order?.fileExt)
              : undefined
          }
          buttonLabel={`Max ${
            fileConfig?.service_create_order?.fileCount
          }, <${getFileMaxSize(
            fileConfig?.service_create_order?.fileMaxSize,
          )}MB`}
        />
        <div style={{ textAlign: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            className={styles['save-btn']}
            disabled={uploading}
            onClick={handleSubmit}
            classes={{ disabled: styles['disable-btn'] }}
          >
            Submit
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default RequestOrderDialog;
