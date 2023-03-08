import Dialog from '@/components/Dialog';
import { useFormik } from 'formik';
import * as yup from 'yup';
import React, { useEffect, useState } from 'react';
import { IDialogState, IUserState, useDispatch, useSelector } from 'umi';
import styles from './index.less';
import MetaMaskSVG from '@/assets/imgs/wallet/metaMask.svg';
import {
  Box,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Stack,
} from '@mui/material';
import FromItemControl from '../FromItemControl';
import Button from '@/components/Button';
import CurrencySelect from '../CurrencySelect';
import SendCountDown from '@/components/SendCountDown';
import { useWalletConnection } from '@/web3/hooks';
import { useWeb3React } from '@web3-react/core';
import CurrencyOption from '@/pages/seller/services/components/CurrencyOption';
import ChainLabel from '../ChainLabel';
import { networkOption } from '@/web3/define';
import { postWalletWithdraw } from '@/service/wallet';
import { useRequest } from 'ahooks';
import { Toast } from '@/components/Toast';
import { toThousands } from '@/utils';
import { ENV } from '@/define';

const dialog_key = 'withdrawDialog';
interface IWithdrawDialogState {
  visible: boolean;
}
export type IWithdrawDialogProps = {};

const WithdrawDialog: React.FC<IWithdrawDialogProps> = ({}) => {
  const { connect } = useWalletConnection();
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: IWithdrawDialogState = useSelector<any, IDialogState>(
    ({ dialog }) => ({
      visible: false,
      ...dialog?.[dialog_key],
    }),
  );
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
  const { coinBalance } = useSelector((state: any) => state.wallet);
  const { tokens, currency } = useSelector((state: any) => state.coins);
  const { userInfo } = useSelector<any, IUserState>((state) => state.user);
  const { active, account } = useWeb3React();
  const [options, setOptions] = useState<any[]>([]);
  const { loading, run: runWithdraw } = useRequest(
    (address, amount, coinId, verifyCode) =>
      postWalletWithdraw(address, amount, coinId, verifyCode),
    {
      manual: true,
      onSuccess: (response: any) => {
        const { code } = response;
        if (code === 10306) {
          return Toast.error('Incorrect verification code');
        }
        if (code === 30326) {
          return Toast.error('Not enough balance');
        }
        if (code !== 200) {
          return Toast.error('Unknown system failure: Please try');
        }
        handleClose();
        dispatch({
          type: 'wallet/queryBalances',
        });
        Toast.success(
          `Successfully applied to withdraw ${amount} ${currency?.[coinId]?.name}!`,
        );
      },
    },
  );
  const validationSchema = yup.object({
    accountAddress: yup
      .string()
      .required('Please enter your receiving address')
      .test('ADDRESS', 'Wrong wallet address.', function (val) {
        if (val?.length !== 42) {
          return false;
        }
        return true;
      }),
    amount: yup
      .string()
      .required('Please enter the withdrawal amount and currency.')
      .test('AMOUNTNumber', 'Please enter in 0.00 format.', (val) => {
        if (val) {
          if (/^\.\d+$/.test(val)) {
            return false;
          }
        }
        return true;
      })
      .test('MUST BE', 'Must be > 0 numbers.', function (val) {
        if (val && /^((\d+\.?\d+)|(\d+))$/g.test(val)) {
          return true;
        }
        return false;
      })
      .test(
        'AMOUNT',
        'Amount should be less than your balance.',
        function (val) {
          const { balance } = this.parent;
          if (val && Number(balance) < Number(val)) {
            return false;
          }
          return true;
        },
      )
      .test(
        'GREATER',
        `Amount should be greater than Processing Fee`,
        function (val) {
          if (val && Number(val) > Number(currency?.[coinId]?.sysFee)) {
            return true;
          }
          return false;
        },
      ),
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
      accountAddress: '',
      chainNetwork: '',
      amount: '',
      coinId: '',
      tokenAddress: '',
      code: '',
      balance: '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    onSubmit: (values: any) => {
      console.log('values====', values);
      const { accountAddress, amount, coinId, code } = values;
      runWithdraw(accountAddress, amount, coinId, code);
    },
  });
  const { amount, chainNetwork, coinId, tokenAddress, accountAddress, code } =
    formik.values;

  useEffect(() => {
    if (!coinId) return;
    formik.setFieldValue('tokenAddress', currency?.[coinId]?.contract);
    formik.setFieldValue('balance', coinBalance[coinId]);
  }, [coinId]);
  useEffect(() => {
    if (!chainNetwork || !tokens) return;
    const tempOptions = Object.keys(tokens)
      .reduce((pre: any, cur: any) => {
        if (tokens[cur]?.chainId === chainNetwork) {
          pre.push(tokens[cur]);
        }
        return pre;
      }, [])
      .map((item: any) => ({
        label: (
          <CurrencyOption iconPath={item?.avatar} currencyName={item?.name} />
        ),
        value: item?.symbol,
        name: item?.name,
        id: item?.id,
        contract: item?.contract,
      }));
    setOptions(tempOptions);
    formik.setFieldValue('coinId', tempOptions?.[0]?.id);
  }, [chainNetwork, tokens]);

  const handleMetaMaskAddress = async () => {
    if (!active) {
      return connect();
    }
    formik.setFieldValue('accountAddress', account);
  };
  return (
    <Dialog
      visible={dialogState?.visible}
      title="Withdraw Funds"
      backBtn={<div />}
      onClose={handleClose}
      onBack={() =>
        dispatch({
          type: 'dialog/show',
          payload: {
            key: '',
          },
        })
      }
    >
      <div className={styles['withdraw-content']}>
        <div className={styles['tips']}>
          <span>
            Please make sure the withdrawal address you entered is
            correct.&nbsp;
          </span>
          It will take several hours for your withdrawal request to be
          confirmed.
        </div>
        <form onSubmit={formik.handleSubmit} className={styles['form']}>
          <Stack direction="column" sx={{ width: '100%', mb: 10 }}>
            <Box mb={4} className={styles['label']}>
              <span>To this address:</span>
              <div className={styles['fill-mataMask-box']}>
                <span
                  className={styles['fill-metaMask-address']}
                  onClick={handleMetaMaskAddress}
                >
                  Fill in Metamask address
                </span>
                <img src={MetaMaskSVG} />
              </div>
            </Box>
            <FormControl
              error={
                !!formik.touched['accountAddress'] &&
                !!formik.errors['accountAddress']
              }
              className={styles['input-form-control']}
            >
              <OutlinedInput
                placeholder="Enter..."
                name="accountAddress"
                value={accountAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={styles['input-style']}
              />
            </FormControl>
            <FormHelperText className={styles['helper-text']}>
              {formik.touched['accountAddress'] &&
                formik.errors['accountAddress']}
            </FormHelperText>
          </Stack>
          <Stack direction="column" sx={{ width: '100%', mb: 35 }}>
            <Box mb={4} className={styles['label']}>
              Through this network:
            </Box>
            <FormControl
              className={`${styles['input-form-control']} ${styles['select-form-control']}`}
            >
              <FromItemControl
                placeholder="Select Network..."
                formik={formik}
                name="chainNetwork"
                options={networkOption[ENV]}
                renderValue={(value) => {
                  const temp = networkOption[ENV].filter(
                    (v) => v.value === value,
                  )[0];
                  return (
                    <div className={styles['select-render-value']}>
                      <ChainLabel value={temp.value} label={temp.label} />
                    </div>
                  );
                }}
              />
            </FormControl>
          </Stack>
          <Stack direction="column" sx={{ width: '100%', mb: 10 }}>
            <Box mb={4} className={styles['label']}>
              <span>Amount:</span>
              <span className={styles['balance']}>
                Balance :&nbsp;
                {coinBalance && coinId && currency
                  ? `${toThousands(
                      coinBalance[coinId] || 0,
                      currency?.[coinId]?.sysDecimals,
                    )} ${currency?.[coinId]?.name}`
                  : '--'}
              </span>
            </Box>
            <FormControl
              error={!!formik.touched['amount'] && !!formik.errors['amount']}
              className={`${styles['input-form-control']} ${styles['select-form-control']}`}
            >
              <CurrencySelect
                maxValue={coinBalance?.[coinId]}
                menuValue={coinId}
                chainNetwork={chainNetwork}
                inputValue={amount}
                options={options}
                onInputChange={(value) => {
                  formik.setFieldValue('amount', value?.trim());
                }}
                onMenuChange={(value) => {
                  formik.setFieldValue('coinId', value);
                }}
                placeholder="Amount..."
                onBlurFun={(e) => {
                  formik?.setFieldTouched('amount', true);
                  formik?.handleBlur(e);
                }}
              />
            </FormControl>
            <FormHelperText className={styles['helper-text']}>
              {formik.touched['amount'] && formik.errors['amount']}
            </FormHelperText>
          </Stack>
          <Box className={styles['form-item-code']}>
            <Stack direction="column" sx={{ mb: 10, flex: 1, mr: 10 }}>
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={styles['input-style']}
                />
              </FormControl>
              <FormHelperText className={styles['helper-text']}>
                {formik.touched['code'] && formik.errors['code']}
              </FormHelperText>
            </Stack>
            <SendCountDown email={userInfo?.email || ''} />
          </Box>
          <div className={styles['label-item']}>
            <div className={styles['label']}>Processing Fee:</div>
            <div className={styles['label-val']}>
              {coinId
                ? `${currency?.[coinId]?.sysFee} ${currency?.[coinId]?.name}`
                : '--'}
            </div>
          </div>
          <div className={styles['confirm-box']}>
            <Button
              disabled={
                !(Number(amount) > 0) ||
                !/^((\d+\.?\d+)|(\d+))$/g.test(amount) ||
                !accountAddress ||
                !chainNetwork ||
                !coinId ||
                code.length < 6
              }
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
        </form>
      </div>
    </Dialog>
  );
};

export default WithdrawDialog;
