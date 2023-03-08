import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import SelectFormItem from '@/components/ProfileFormItem/SelectFormItem';
import TextAreaFormItem from '@/components/ProfileFormItem/TextAreaFormItem';
import ThumbSwiper from '@/components/ThumbSwiper';
import Toast from '@/components/Toast';
import { FileWithFid, IFileWithFid } from '@/components/Uploader';
import { useSwiperContent } from '@/hooks/useSwiperContent';
import { useUploadFile } from '@/hooks/useUploadFile';
import { IDialogState } from '@/models/dialog';
import { IOptionList } from '@/pages/seller/services/basic';
import { Errors } from '@/service/errors';
import { IOrderReasons } from '@/service/general/types';
import { postOrderCancel, postSubmitCustomerService } from '@/service/orders';
import { ORDER_REASON_TYPE, ORDER_STATUS } from '@/service/orders/types';
import { ITokensItem } from '@/service/services/types';
import { EPostType } from '@/service/user/types';
import {
  acceptFileType,
  getCurrentToken,
  getFileMaxSize,
  toThousands,
} from '@/utils';
import { useRequest } from 'ahooks';
import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import styles from './index.less';

export interface ICancelOrderDialogState {
  visible: boolean;
  orderId: number;
  cancelType: ORDER_REASON_TYPE;
  txFee: string;
  budget: string;
  coinId: number;
  reload?: () => void;
}

const dialog_key = 'cancelOrderDialog';
const CancelOrderDialog: React.FC = () => {
  const dispatch = useDispatch();

  const dialogState: ICancelOrderDialogState = useSelector<
    any,
    IDialogState & ICancelOrderDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[dialog_key],
  }));

  const { tokens } = useSelector((state: any) => state.coins);
  const { uid } = useSelector((state: any) => state.user);
  const { config } = useSelector((state: any) => state.config);
  const { orderReasons } = useSelector((state: any) => state.orderReasons);
  const { fileConfig } = useSelector((state: any) => state.fileConfig);

  const [currentToken, setCurrentToken] = useState<ITokensItem>();
  const [leftBudget, setLeftBudget] = useState<string>('');
  const [reasonList, setReasonList] = useState<IOptionList[]>([]);
  const [inputLabel, setInputLabel] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (dialogState?.cancelType === ORDER_REASON_TYPE.seller_cancel) {
      setInputLabel('Leave message to buyer');
    } else if (
      dialogState?.cancelType === ORDER_REASON_TYPE.apply_customer_service
    ) {
      setInputLabel('Leave message');
    } else {
      setInputLabel('Leave message to seller');
    }
  }, [dialogState?.cancelType]);

  // 买家或者卖家提交取消订单申请
  const { loading: cancelLoading, run: cancelOrder } = useRequest(
    (params) => postOrderCancel(params),
    {
      manual: true,
      onSuccess: (res: any) => {
        const { code, data } = res;
        if (code === 200 && data?.success) {
          handleClose();
          dialogState?.reload?.();
        } else {
          Toast.error('Unknown system failure: Please try');
        }
      },
    },
  );

  // 买家申请客服取消订单
  const { loading: submitLoading, run: submitCustomer } = useRequest(
    (params) => postSubmitCustomerService(params),
    {
      manual: true,
      onSuccess: (res: any) => {
        const { code, data } = res;
        if (code === 200 && data?.success) {
          handleClose();
          dialogState?.reload?.();
        } else {
          Toast.error('Unknown system failure: Please try');
        }
      },
    },
  );

  useEffect(() => {
    const validReason = orderReasons?.filter(
      (item: IOrderReasons) =>
        item?.status === 'enable' &&
        item?.reasonType === dialogState?.cancelType,
    );
    let tempOption: IOptionList[] = [];
    validReason?.map((item: IOrderReasons) => {
      const tempObj: IOptionList = {
        label: item?.reason,
        value: String(item?.id),
      };
      tempOption.push(tempObj);
    });
    setReasonList(tempOption);
  }, [dialogState?.cancelType, orderReasons]);

  useEffect(() => {
    if (dialogState && tokens) {
      setCurrentToken(getCurrentToken(dialogState?.coinId, tokens));
    }
    setLeftBudget(
      new BigNumber(dialogState?.budget).minus(dialogState?.txFee)?.toString(),
    );
  }, [dialogState]);

  const formik = useFormik({
    initialValues: {
      reason: '',
      reasonDetails: '',
      orderId: dialogState?.orderId,
      reasonPosts: [],
    },
    onSubmit: (values) => {
      console.log('values', values);
      if (
        dialogState?.cancelType === ORDER_REASON_TYPE.apply_customer_service
      ) {
        const tempValues = {
          ...values,
          reason: Number(values?.reason),
          cancel: true,
          orderId: dialogState?.orderId,
        };
        submitCustomer(tempValues);
      } else {
        const tempValues = {
          reasonDetails: values?.reasonDetails,
          reason: Number(values?.reason),
          cancel: true,
          orderId: dialogState?.orderId,
        };
        cancelOrder(tempValues);
      }
    },
  });

  const handleClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };

  useEffect(() => {
    formik.setFieldValue('reason', String(reasonList?.[0]?.value));
    formik.setFieldValue('reasonDetails', '');
    setContentList([]);
  }, [reasonList, dialogState?.visible]);

  const handleChangeReason = (event: any) => {
    formik.setFieldValue('reason', event.target.value);
  };

  const handleConfirm = () => {
    if (!formik?.values?.reasonDetails?.trim()) {
      return Toast.error(`Input box can't be blank`);
    }
    formik?.handleSubmit();
  };

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
        // ↓ error code for test
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

  const beforeUpload = useCallback(
    (file: FileWithFid): void => {
      const errors = checkFile({
        file,
        limitSize: getFileMaxSize(fileConfig?.submit_customer?.fileMaxSize),
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

  useEffect(() => {
    let posts = contentList
      .filter((item) => item.status === 'success')
      .map((item) => ({
        ...item,
        fileThumbnailUrl: item.fileUrl,
        id: 0,
        type: fileConfig?.submit_customer?.postType || EPostType.order,
        userId: uid,
      }));

    formik.setFieldValue('reasonPosts', posts);

    const loading = contentList?.some((item) => item?.status === 'uploading');
    setUploading(loading);
  }, [contentList]);

  return (
    <Dialog
      visible={dialogState?.visible}
      title="Cancel the order"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['cancel-order-dialog']}>
        <div className={styles['content']}>
          {dialogState?.cancelType === ORDER_REASON_TYPE.seller_cancel && (
            <div className={styles['seller-content']}>
              Are you sure you want to cancel the order?
            </div>
          )}
          {dialogState?.cancelType === ORDER_REASON_TYPE.buyer_cancel && (
            <div className={styles['buyer-content']}>
              You will receive a refund of{' '}
              <strong>{`${toThousands(
                leftBudget,
              )} ${currentToken?.name?.toLocaleUpperCase()}`}</strong>
              .
              <br />
              The{' '}
              <strong>{`${
                dialogState?.txFee
              } ${currentToken?.name?.toLocaleUpperCase()}`}</strong>{' '}
              processing fee will not be refunded.
              <br />
              Are you sure you want to cancel the order?
            </div>
          )}
          {dialogState?.cancelType === ORDER_REASON_TYPE.overdue_cancel && (
            <div className={styles['buyer-content']}>
              Because the seller has overdue to submit the work.
              <br />
              You will receive a refund of{' '}
              <strong>{`${toThousands(
                dialogState?.budget,
              )} ${currentToken?.name?.toLocaleUpperCase()}`}</strong>
              .
              <br />
              Are you sure you want to cancel the order?
            </div>
          )}
          {dialogState?.cancelType === ORDER_REASON_TYPE.apply_buyer_cancel && (
            <div className={styles['buyer-content']}>
              Contact the seller to cancel the order (reply in{' '}
              {config?.DELIVERY_ORDER_BUYER_APPLY_CANCEL?.cfgVal} days).
              <br />
              <strong>
                If success, you will receive a refund of{' '}
                {`${leftBudget} ${currentToken?.name?.toLocaleUpperCase()}`}.
                The{' '}
                <strong>{`${
                  dialogState?.txFee
                } ${currentToken?.name?.toLocaleUpperCase()}`}</strong>{' '}
                processing fee will not be refunded.
              </strong>{' '}
              Otherwise the order will return to status 'to review'. You can
              contact customer service to solve it or wait for the order to
              close after the countdown. Are you sure you want to cancel the
              order?
            </div>
          )}
          {dialogState?.cancelType ===
            ORDER_REASON_TYPE.apply_customer_service && (
            <div className={styles['buyer-content']}>
              Contact the customer service to cancel the order (reply in{' '}
              {config?.DELIVERY_ORDER_WAITING_FOR_CUSTOMER?.cfgVal} days).
              <br />
              <strong>
                If success, you will receive a refund of{' '}
                {`${leftBudget} ${currentToken?.name?.toLocaleUpperCase()}`}
              </strong>
              . The{' '}
              <strong>
                {`${
                  dialogState?.txFee
                } ${currentToken?.name?.toLocaleUpperCase()}`}
                processing fee will not be refunded{' '}
              </strong>{' '}
              . Otherwise the order will return to status 'to review'. Are you
              sure you want to cancel the order?
            </div>
          )}
        </div>

        <SelectFormItem
          label="Reason for cancellation"
          formik={formik}
          name="reason"
          placeholder="Select..."
          options={reasonList}
          onChange={(event: any) => handleChangeReason(event)}
          className={styles['select-box']}
        />

        <TextAreaFormItem
          label={inputLabel}
          placeholder="Enter ..."
          formik={formik}
          name="reasonDetails"
          maxLength={300}
          minHeight="63px"
          className={styles['reason-details']}
        />
        <div className={styles['post']}>
          {dialogState?.cancelType ===
            ORDER_REASON_TYPE.apply_customer_service && (
            <ThumbSwiper
              spaceBetween={14}
              slidesPerView={contentList.length < 4 ? contentList.length : 4}
              contentList={contentList}
              limitSize={getFileMaxSize(
                fileConfig?.submit_customer?.fileMaxSize,
              )}
              countLimit={fileConfig?.submit_customer?.fileCount}
              beforeUpload={beforeUpload}
              onUploadSuccess={onSuccess}
              onDelete={setContentList}
              onError={onError}
              onRetry={onRetry}
              buttonLabel={`Max ${
                fileConfig?.submit_customer?.fileCount
              }, <${getFileMaxSize(
                fileConfig?.submit_customer?.fileMaxSize,
              )}MB`}
              accept={
                fileConfig?.submit_customer?.fileExt
                  ? acceptFileType(fileConfig?.submit_customer?.fileExt)
                  : undefined
              }
            />
          )}
        </div>

        <div className={styles['btns']}>
          <Button
            loading={submitLoading || cancelLoading}
            disabled={uploading}
            variant="contained"
            size="large"
            type="submit"
            onClick={handleConfirm}
            classes={{ disabled: styles['disable-btn'] }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default CancelOrderDialog;
