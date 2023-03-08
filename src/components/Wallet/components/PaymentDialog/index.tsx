import Dialog from '@/components/Dialog';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { IDialogState, IUserState, useDispatch, useSelector } from 'umi';
import styles from './index.less';
import {
  Box,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Stack,
} from '@mui/material';
import Button from '@/components/Button';
import Toast from '@/components/Toast';

import SendCountDown from '@/components/SendCountDown';
import * as yup from 'yup';
import { toThousands } from '@/utils';
import { useRequest } from 'ahooks';
import { postOrderCreate } from '@/service/orders';
import { history } from 'umi';

const dialog_key = 'paymentDialog';
interface IPaymentDialogState {
  visible: boolean;
  params: any;
  payCallback?: () => void;
}
export type IPaymentDialogProps = {};

const PaymentDialog: React.FC<IPaymentDialogProps> = ({}) => {
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: IPaymentDialogState = useSelector<
    any,
    IDialogState & IPaymentDialogState
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
  const { currency } = useSelector((state: any) => state.coins);
  const { userInfo } = useSelector<any, IUserState>((state) => state.user);
  const { coinBalance } = useSelector((state: any) => state.wallet);
  const { run: createOrder, loading } = useRequest(
    (params) => postOrderCreate(params),
    {
      manual: true,
      onSuccess: (res: any) => {
        const { code, data } = res;
        if (code === 200) {
          dispatch({
            type: 'wallet/queryBalances',
          });
          dialogState?.payCallback?.();
          handleClose();
          history.push(`/orders/paySuccess?orderId=${data?.orderId}`);
        } else if (code === 10306) {
          return Toast.error('Incorrect verification code');
        } else if (code === 50001) {
          // 订单价格有变化
          Toast.error('Order price has changed, please repurchase and pay.');
          handleClose();
        } else if (code === 31004) {
          // 余额不足
          Toast.error(
            'Your wallet balance has changed, please confirm and pay again.',
          );
          dispatch({
            type: 'wallet/queryBalances',
          });
          handleClose();
        } else if (code === 30031) {
          return Toast.error(
            'Your account is disabled. Please contact Metalents Customer Service.',
          );
        } else {
          return Toast.error('Unknown system failure: Please try');
        }
      },
    },
  );
  const validationSchema = yup.object({
    code: yup
      .string()
      .required('Please enter your verification code')
      .test('CODE', 'Incorrect verification code', function (val) {
        if (val && /^[0-9]{6}$/.test(val)) {
          return true;
        }
        return false;
      }),
  });

  const formik = useFormik({
    initialValues: {
      balance: '',
      payAmount: '',
      code: '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    onSubmit: (values: any) => {
      const { code } = values;
      const { description, fiels, proId, proType, budgetAmount } =
        dialogState?.params;
      createOrder({
        description,
        fiels,
        proId,
        proType,
        verifyCode: code,
        currentPrice: budgetAmount,
      });
    },
  });
  const { balance, payAmount, code } = formik.values;

  useEffect(() => {
    if (!dialogState?.params || !coinBalance) return;
    formik.setFieldValue('payAmount', dialogState?.params?.budgetAmount);
    formik.setFieldValue(
      'balance',
      coinBalance?.[dialogState?.params?.coinId] ?? 0,
    );
  }, [dialogState?.params?.budgetAmount, coinBalance]);
  return (
    <Dialog
      visible={dialogState?.visible}
      title="Payment"
      backBtn={<div />}
      onClose={handleClose}
    >
      <div className={styles['payment-content']}>
        <div className={styles['pay-amount-box']}>
          <div className={styles['pay-amount']}>
            <span>
              {toThousands(
                dialogState?.params?.budgetAmount,
                currency?.[dialogState?.params?.coinId]?.sysDecimals,
              )}
            </span>
            <span>{currency?.[dialogState?.params?.coinId]?.name}</span>
          </div>
          <span className={styles['price']}>
            = $&nbsp;
            {toThousands(
              (
                dialogState?.params?.budgetAmount *
                currency?.[dialogState?.params?.coinId]?.price
              ).toFixed(2),
            )}
          </span>
        </div>
        <form onSubmit={formik.handleSubmit} className={styles['form']}>
          <Stack direction="column" sx={{ width: '100%', mb: 10 }}>
            <Box mb={4} className={styles['label']}>
              <span>Wallet Balance:</span>
            </Box>
            <FormControl
              error={dialogState?.params?.budgetAmount > Number(balance)}
              className={`${styles['input-form-control']} ${styles['input-balance']}`}
            >
              <OutlinedInput
                startAdornment={
                  <img
                    src={currency?.[dialogState?.params?.coinId]?.avatar}
                    width={24}
                    height={24}
                  />
                }
                endAdornment={
                  <span className={styles['coin-balance']}>
                    {toThousands(
                      coinBalance?.[dialogState?.params?.coinId],
                      currency?.[dialogState?.params?.coinId]?.sysDecimals,
                    )}
                  </span>
                }
                value={currency?.[dialogState?.params?.coinId]?.name}
                disabled
              />
              <FormHelperText className={styles['helper-text']}>
                {dialogState?.params?.budgetAmount > Number(balance) &&
                  'Not enough balance'}
              </FormHelperText>
            </FormControl>
          </Stack>

          <Box className={styles['form-item-code']}>
            <Stack direction="column" sx={{ mb: 20, flex: 1, mr: 10 }}>
              <Box mb={4} className={styles['label']}>
                <span>Email verification code:</span>
              </Box>
              <FormControl
                error={!!formik.touched['code'] && !!formik.errors['code']}
                className={styles['input-form-control']}
              >
                <OutlinedInput
                  placeholder="Enter..."
                  name="code"
                  value={code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </FormControl>
              <FormHelperText className={styles['helper-text']}>
                {formik.touched['code'] && formik.errors['code']}
              </FormHelperText>
            </Stack>
            <SendCountDown
              email={userInfo?.email || ''}
              disable={dialogState?.params?.budgetAmount > Number(balance)}
            />
          </Box>
          {Number(balance) >= Number(payAmount) && (
            <div className={styles['confirm-box']}>
              <Button
                loading={loading}
                type="submit"
                variant="contained"
                size="large"
                style={{ width: '250px' }}
                classes={{
                  root: styles['button-root'],
                  disabled: styles['btn-disabled'],
                }}
              >
                {loading ? 'Confirming' : 'Confirm'}
              </Button>
            </div>
          )}
        </form>
        {Number(payAmount) > Number(balance) && (
          <div className={styles['confirm-box']}>
            <Button
              onClick={() => {
                handleClose();
                dispatch({
                  type: 'dialog/show',
                  payload: {
                    key: 'selectAddFundsDialog',
                    params: dialogState?.params,
                  },
                });
              }}
              variant="contained"
              size="large"
              style={{ width: '250px' }}
            >
              Add funds
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default PaymentDialog;
