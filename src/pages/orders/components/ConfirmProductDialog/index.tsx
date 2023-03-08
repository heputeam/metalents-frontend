import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import TextAreaFormItem from '@/components/ProfileFormItem/TextAreaFormItem';
import MyRating from '@/components/Rating';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { IDialogState, useDispatch, useSelector } from 'umi';
import styles from './index.less';
import * as yup from 'yup';
import { Checkbox, Typography } from '@mui/material';
import Toast from '@/components/Toast';
import { useRequest } from 'ahooks';
import { postOrderComplete } from '@/service/orders';

interface IOrderFileSubmissionDialogState {
  visible: boolean;
  orderId: number;
  reload?: () => void;
  isList?: boolean;
}

const dialog_key = 'confirmProductDialog';

const ConfirmProductDialog: React.FC = () => {
  const dispatch = useDispatch();

  const handleChange = (e: object, val: number | null) => {
    if (val !== null) {
      formik?.setFieldValue('scope', val);
    }
  };

  const dialogState: IOrderFileSubmissionDialogState = useSelector<
    any,
    IDialogState & IOrderFileSubmissionDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[dialog_key],
  }));

  const {
    data,
    loading,
    run: confirmOrder,
  } = useRequest((params) => postOrderComplete(params), {
    manual: true,
    onSuccess: (res: any) => {
      const { code, data } = res;
      if (code === 200 && data?.success) {
        dialogState?.reload?.();
        handleClose();
        if (!dialogState?.isList) {
          setTimeout(() => {
            dispatch({
              type: 'dialog/show',
              payload: {
                key: 'MintNFTDialog',
                orderId: dialogState?.orderId,
              },
            });
          }, 100);
        }
      } else {
        Toast.error('Unknown system failure: Please try');
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      scope: 5,
      comment: '',
      display: true,
      orderId: dialogState?.orderId,
    },
    onSubmit: (values) => {
      if (!formik?.values?.comment?.trim()) {
        return Toast.error(`Comments can't be blank.`);
      }
      values.orderId = dialogState?.orderId;
      confirmOrder(values);
    },
  });

  useEffect(() => {
    formik?.setFieldValue('scope', 5);
    formik?.setFieldValue('comment', '');
    formik?.setFieldValue('display', true);
  }, [dialogState?.visible]);

  const handleClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };

  const handleCheck = (event: any) => {
    formik?.setFieldValue('display', event.target.checked);
  };

  return (
    <Dialog
      visible={dialogState.visible}
      title="Confirm Product"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['file-submission-dialog']}>
        <div className={styles['content']}>
          Please confirm the service and rate the order. Once the order has been
          completed, comments and status cannot be modified.
        </div>
        <div className={styles['rating']}>
          <MyRating
            value={formik?.values?.scope}
            size={36}
            precision={1}
            showLabel
            onChange={handleChange}
            ratingDirection="column"
            hideScope
          />
        </div>
        <TextAreaFormItem
          label=""
          placeholder="Enter ..."
          formik={formik}
          name="comment"
          maxLength={200}
          minHeight="70px"
          className={styles['description-box']}
        />
        <div className={styles['checkbox-box']}>
          <Checkbox
            classes={{ root: styles['checkbox-root'] }}
            size="small"
            checked={formik?.values?.display}
            onChange={handleCheck}
          />
          <Typography variant="body1" color="#111111">
            I want the files to be publicly displayed
          </Typography>
        </div>

        <div className={styles['btns']}>
          <Button
            loading={loading}
            variant="contained"
            size="large"
            type="submit"
            onClick={() => formik?.handleSubmit()}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmProductDialog;
