import Dialog from '@/components/Dialog';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { IDialogState, IUserState, useDispatch, useSelector } from 'umi';
import styles from './index.less';
import { Box, FormControl, IconButton, Stack } from '@mui/material';
import FromItemControl from '../FromItemControl';
import Button from '@/components/Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CopySVG from '@/assets/imgs/wallet/copy.svg';
import Toast from '@/components/Toast';
import CurrencySelect from '../CurrencySelect';
import CurrencyOption from '@/pages/seller/services/components/CurrencyOption';
import { networkOption, ZERO_TOEKN } from '@/web3/define';
import { useChainCheck, useWalletConnection } from '@/web3/hooks';
import { Erc20Contract } from '@/web3/contract';
import { toOmitAccount, toThousands, toWei } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import ChainLabel from '../ChainLabel';
import { ENV } from '@/define';

const dialog_key = 'walletAddFundsDialog';
interface IWalletAddFundsDialogState {
  visible: boolean;
  params?: any;
}
export type IWalletAddfundsDialogProps = {};

const WalletAddfundsDialog: React.FC<IWalletAddfundsDialogProps> = ({}) => {
  const { account, library, chainId, active } = useWeb3React();
  const { connect } = useWalletConnection();
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: IWalletAddFundsDialogState = useSelector<
    any,
    IDialogState & IWalletAddFundsDialogState
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
  const { handleSwitch } = useChainCheck();
  const { userInfo } = useSelector<any, IUserState>((state) => state.user);
  const { tokens, currency } = useSelector((state: any) => state.coins);
  const { coinBalance } = useSelector((state: any) => state.wallet);
  const [loading, setLoading] = useState<boolean>(false);

  const [options, setOptions] = useState<any[]>([]);

  const handleApprove = async (tokenAddress: string) => {
    if (!account) return;
    try {
      await Erc20Contract(library, tokenAddress)
        .methods.approve(tokenAddress, '0xffffffffffffffffffffffffffffffff')
        .send({
          from: account,
        });
    } catch (error) {
      console.log('approve--error', error);
    }
  };
  const formik = useFormik({
    initialValues: {
      chainNetwork: '',
      amount: '',
      coinId: '',
      tokenAddress: '',
    },
    validateOnChange: false,
    onSubmit: async (values: any) => {
      const { chainNetwork, tokenAddress, amount, coinId } = values;
      if (!account) return;
      if (chainNetwork !== chainId) {
        return handleSwitch(Number(chainNetwork));
      }
      setLoading(true);
      if (!userInfo?.hdWalletAddress) return;
      if (tokenAddress === ZERO_TOEKN) {
        try {
          library?.eth
            .sendTransaction({
              from: account,
              to: userInfo?.hdWalletAddress,
              value: toWei(
                Number(amount),
                currency?.[coinId]?.decimals,
              ).toString(),
            })
            .on('receipt', (receipt: any) => {
              setLoading(false);
              handleClose();
              dispatch({
                type: 'wallet/queryBalances',
              });
              dispatch({
                type: 'dialog/show',
                payload: {
                  key: 'addFundsSuccessDialog',
                  amountAndToken: `${amount} ${currency[coinId].name}`,
                  params: dialogState?.params,
                },
              });
            })
            .on('error', () => {
              setLoading(false);
            });
        } catch (error) {
          setLoading(false);
        }
      } else {
        try {
          await Erc20Contract(library, tokenAddress)
            .methods.transfer(
              userInfo?.hdWalletAddress,
              toWei(Number(amount), currency?.[coinId]?.decimals).toString(),
            )
            .send({
              from: account,
            })
            .on('receipt', (receipt) => {
              setLoading(false);
              handleClose();
              dispatch({
                type: 'wallet/queryBalances',
              });
              dispatch({
                type: 'dialog/show',
                payload: {
                  key: 'addFundsSuccessDialog',
                  amountAndToken: `${amount} ${currency[coinId].name}`,
                  params: dialogState?.params,
                },
              });
            })
            .on('error', () => {
              setLoading(false);
            });
        } catch (error) {
          console.log('transfer--err', error);
          setLoading(false);
        }
      }
    },
  });
  const { amount, chainNetwork, coinId } = formik.values;
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

  useEffect(() => {
    if (!coinId || options.length === 0) return;
    formik.setFieldValue(
      'tokenAddress',
      options?.filter((item) => item?.id === coinId)[0]?.contract,
    );
  }, [coinId, options]);

  useEffect(() => {
    if (!dialogState?.params) return;
    formik.setFieldValue(
      'chainNetwork',
      currency?.[dialogState?.params?.coinId]?.chainId,
    );
    formik.setFieldValue('coinId', dialogState?.params?.coinId);
  }, [dialogState?.params]);

  return (
    <Dialog
      visible={dialogState?.visible}
      title="Add Funds"
      onClose={handleClose}
      onBack={() => {
        handleClose();
        dispatch({
          type: 'dialog/show',
          payload: {
            key: 'selectAddFundsDialog',
            params: dialogState?.params,
          },
        });
      }}
    >
      <div className={styles['add-funds-content']}>
        <div className={styles['tips']}>
          You can add funds with your Metamask Chrome plugin.
          <br /> This process may take several hours to complete.
        </div>
        <form onSubmit={formik.handleSubmit} className={styles['form']}>
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
                formValue={chainNetwork}
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

          <Stack direction="column" sx={{ width: '100%' }}>
            <Box mb={4} className={styles['label']}>
              Amount:
            </Box>
            <FormControl
              className={`${styles['input-form-control']} ${styles['select-form-control']}`}
            >
              <CurrencySelect
                chainNetwork={chainNetwork}
                menuValue={coinId}
                inputValue={amount}
                options={options}
                onInputChange={(value) => {
                  formik.setFieldValue('amount', value?.trim());
                }}
                onMenuChange={(value) => {
                  formik.setFieldValue('coinId', value);
                }}
                placeholder="Enter..."
                onBlurFun={(e) => {
                  formik?.setFieldTouched('amount', true);
                }}
              />
            </FormControl>
          </Stack>
          <div className={styles['label-item']}>
            <div className={styles['label']}>Balance:</div>
            <div className={styles['label-val']}>
              {coinBalance && coinId && currency
                ? `${toThousands(
                    coinBalance[coinId] || 0,
                    currency[coinId]?.sysDecimals,
                  )} ${currency[coinId].name}`
                : '--'}
            </div>
          </div>
          <div className={styles['label-item']}>
            <div className={styles['label']}>Receive Address:</div>
            {amount && chainNetwork && coinId ? (
              <div className={styles['copy-box']}>
                <span>{toOmitAccount(userInfo?.hdWalletAddress || '')}</span>
                <CopyToClipboard
                  text={userInfo?.hdWalletAddress || ''}
                  onCopy={() => {
                    Toast.success('Wallet address copied!');
                  }}
                >
                  <IconButton
                    classes={{ root: styles['copy-btn'] }}
                    size="small"
                    disableFocusRipple
                  >
                    <img src={CopySVG} />
                  </IconButton>
                </CopyToClipboard>
              </div>
            ) : (
              '--'
            )}
          </div>
          <div className={styles['confirm-box']}>
            {!active ? (
              <Button
                onClick={() => connect()}
                variant="contained"
                size="large"
                style={{ width: '250px' }}
              >
                Connect
              </Button>
            ) : (
              <Button
                loading={loading}
                disabled={
                  !(Number(amount) > 0) ||
                  !/^((\d+\.?\d+)|(\d+))$/g.test(amount) ||
                  !chainNetwork ||
                  !coinId
                }
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
            )}
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default WalletAddfundsDialog;
