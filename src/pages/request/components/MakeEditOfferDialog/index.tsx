import Dialog from '@/components/Dialog';
import React, { useEffect } from 'react';
import { IDialogState, useDispatch, useSelector } from 'umi';
import styles from './index.less';
import Button from '@/components/Button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Stack,
} from '@mui/material';
import PriceInput from '@/pages/seller/services/components/PriceInput';
import { useRequest } from 'ahooks';
import Toast from '@/components/Toast';
import { postOffersCreateOfUpdate } from '@/service/offers';
import { getTokenSysDecimals, numberDecimal } from '@/utils';
import { IUserOffersItem } from '@/service/user/types';

interface IMakeEditOfferDialogState {
  visible: boolean;
  title: string;
  id: number;
  requestId: number;
  offerData?: IUserOffersItem;
  onSuccess: () => void;
}

const dialog_key = 'makeEditOfferDialog'; // dialog 唯一值
export type IMakeEditOfferDialogProps = {};

const MakeEditOfferDialog: React.FC<IMakeEditOfferDialogProps> = ({}) => {
  const dispatch = useDispatch();
  const { tokens } = useSelector((state: any) => state.coins);
  const { config } = useSelector((state: any) => state.config);
  // 提取dialog 状态
  const dialogState: IMakeEditOfferDialogState = useSelector<
    any,
    IDialogState & IMakeEditOfferDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[dialog_key],
  }));
  // 关闭 dialog
  const handleClose = () => {
    formik.resetForm();
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };
  const { loading, run } = useRequest(
    (params) =>
      postOffersCreateOfUpdate({
        ...params,
      }),
    {
      manual: true,
      onSuccess: (data: any) => {
        const { code } = data;
        if (code === 30035) {
          return Toast.error(
            `Oops! You already have ${config?.['OFFER_WAITING_COUNT']?.cfgVal} offers in waiting.`,
          );
        } else if (code === 30327) {
          return Toast.error('Sorry! This request is closed.');
        } else if (code !== 200) {
          return Toast.error('Unknown system failure: Please try');
        }
        handleClose();
        dialogState?.onSuccess();
        if (dialogState?.id === 0) {
          return Toast.success('Successfully made an offer!');
        } else {
          return Toast.success('Successfully saved!');
        }
      },
    },
  );
  const validationSchema = yup.object({
    deliverAt: yup
      .string()
      .required(`Input box can't be blank.`)
      .test('DELIVERAT', 'Must be > 0 integral numbers.', function (val) {
        if (val && /^[1-9][0-9]*$/.test(val)) {
          return true;
        }
        return false;
      }),
    budgetAmount: yup
      .string()
      .required(`Input box can't be blank.`)
      .test('AMOUNT', 'Please enter in 0.00 format.', (val) => {
        if (val) {
          if (/^\.\d+$/.test(val)) {
            return false;
          }
        }
        return true;
      })
      .test('BUDGETAMOUNT', 'Must be > 0 numbers.', function (val) {
        if (
          val &&
          (!/^((\d+\.?\d+)|(\d+))$/g.test(val) || !(Number(val) > 0))
        ) {
          return false;
        }
        return true;
      }),
  });
  const formik = useFormik({
    initialValues: {
      deliverAt: '',
      budgetAmount: '',
      coinId: 1,
      description: '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      const { deliverAt, budgetAmount, coinId, description } = values;
      const params = {
        budgetAmount: numberDecimal(
          budgetAmount,
          getTokenSysDecimals(coinId, tokens) || 0,
        ).toString(),
        coinId,
        deliverTime: Number(deliverAt),
        description: description?.trim(),
        id: dialogState?.id || 0,
        requestId: Number(dialogState?.requestId),
      };
      run(params);
    },
  });
  useEffect(() => {
    formik.setValues({
      deliverAt: dialogState?.offerData?.deliverTime.toString() || '',
      budgetAmount: dialogState?.offerData?.budgetAmount || '',
      description: dialogState?.offerData?.description || '',
      coinId: dialogState?.offerData?.coinId || 1,
    });
  }, [dialogState?.offerData]);
  const { deliverAt, budgetAmount, coinId, description } = formik.values;
  return (
    <Dialog
      visible={dialogState.visible}
      title={dialogState.title}
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['make-edit-content']}>
        <form onSubmit={formik.handleSubmit} className={styles['form']}>
          <Stack direction="column" sx={{ width: '100%', mb: 15 }}>
            <Box mb={4} className={styles['label']}>
              Price of the offer
              <span style={{ color: '#E03A3A' }}> * </span>
            </Box>
            <FormControl
              error={
                !!formik.touched['budgetAmount'] &&
                !!formik.errors['budgetAmount']
              }
              className={`${styles['input-form-control']} ${styles['select-form-control']}`}
            >
              <PriceInput
                menuValue={coinId}
                inputValue={budgetAmount}
                onInputChange={(value) => {
                  formik.setFieldValue('budgetAmount', value?.trim());
                }}
                onMenuChange={(value) => {
                  formik.setFieldValue('coinId', value);
                }}
                placeholder="Enter..."
                onBlurFun={(e) => {
                  formik?.setFieldTouched('budgetAmount', true);
                  formik?.handleBlur(e);
                }}
              />
              <FormHelperText className={styles['helper-text']}>
                {formik.touched['budgetAmount'] &&
                  formik.errors['budgetAmount']}
              </FormHelperText>
            </FormControl>
          </Stack>
          <Stack direction="column" sx={{ width: '100%' }}>
            <Box mb={4} className={styles['label']}>
              Delivery Time
              <span style={{ color: '#E03A3A' }}> * </span>
            </Box>
            <FormControl
              error={
                !!formik.touched['deliverAt'] && !!formik.errors['deliverAt']
              }
              className={styles['input-form-control']}
            >
              <OutlinedInput
                name="deliverAt"
                classes={{
                  root: styles['input-box'],
                  focused: styles['input-focused'],
                  notchedOutline: styles['notchedOutline'],
                  disabled: styles['disable-input'],
                }}
                value={deliverAt}
                placeholder="Enter..."
                fullWidth
                onBlur={formik.handleBlur}
                onChange={(ev) => {
                  formik.setFieldValue('deliverAt', ev.target.value?.trim());
                }}
                endAdornment={<span>Day(s)</span>}
              />
              <FormHelperText className={styles['helper-text']}>
                {formik.touched['deliverAt'] && formik.errors['deliverAt']}
              </FormHelperText>
            </FormControl>
          </Stack>

          <Stack sx={{ width: '100%', mb: 40 }}>
            <Box mb={4} className={styles['label']}>
              Leave a message
            </Box>
            <div className={styles['textare-box']}>
              <OutlinedInput
                name="description"
                classes={{
                  root: styles['textarea-root'],
                  notchedOutline: styles['textarea-notchedOutline'],
                  input: styles['textarea-input'],
                }}
                placeholder={'Enter description '}
                className={styles['textArea']}
                multiline
                inputProps={{ sx: { minHeight: '65px' } }}
                value={description}
                onChange={(event) => {
                  if (event.target.value.length <= 200) {
                    formik.setFieldValue('description', event.target.value);
                  }
                }}
              />
              <span className={styles['character-len']}>{`(${
                description?.length
              }/${200})`}</span>
            </div>
          </Stack>
          <div className={styles['submit-button']}>
            <Button
              loading={loading}
              variant="contained"
              type="submit"
              size="large"
              style={{ width: '240px', height: '48px' }}
            >
              Confirm
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default MakeEditOfferDialog;
