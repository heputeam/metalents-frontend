import Dialog from '@/components/Dialog';
import { Box, FormControl, IconButton, Stack } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { IDialogState, IUserState, useDispatch, useSelector } from 'umi';
import FromItemControl from '../FromItemControl';
import styles from './index.less';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CopySVG from '@/assets/imgs/wallet/copy.svg';
import { Toast } from '@/components/Toast';
import Button from '@/components/Button';
import CurrencyOption from '@/pages/seller/services/components/CurrencyOption';
import { networkOption } from '@/web3/define';
import { toOmitAccount, toThousands } from '@/utils';
import ChainLabel from '../ChainLabel';
import { ENV } from '@/define';

const dialog_key = 'transferAddFundsDialog';
interface ITransferAddFundsDialogState {
  visible: boolean;
  params?: any;
}
export type ITransferAddFundsDialogProps = {};

const TransferAddFundsDialog: React.FC<ITransferAddFundsDialogProps> = ({}) => {
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: ITransferAddFundsDialogState = useSelector<
    any,
    IDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[dialog_key],
  }));
  // 关闭 dialog
  const handleClose = () => {
    formik.resetForm();
    setOptions([]);
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };
  const { userInfo } = useSelector<any, IUserState>((state) => state.user);
  const { tokens, currency } = useSelector((state: any) => state.coins);
  const { coinBalance } = useSelector((state: any) => state.wallet);
  const [options, setOptions] = useState<any[]>([]);
  const formik = useFormik({
    initialValues: {
      chainNetwork: '',
      coinId: '',
      tokenAddress: '',
    },
    validateOnChange: false,
    onSubmit: (values: any) => {
      handleClose();
    },
  });
  const { chainNetwork, coinId } = formik.values;
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
          <CurrencyOption
            iconPath={item?.avatar}
            currencyName={item?.name}
            className={styles['label-coin']}
          />
        ),
        value: item?.id,
        name: item?.name,
        id: item?.id,
        contract: item?.contract,
      }));
    setOptions(tempOptions);
    formik.setFieldValue('coinId', tempOptions?.[0]?.id);
  }, [chainNetwork, tokens]);

  useEffect(() => {
    if (!coinId) return;
    formik.setFieldValue(
      'tokenAddress',
      options?.filter((item) => item?.id === coinId)[0]?.contract,
    );
  }, [coinId]);

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
          You can add funds by transferring to the address below.&nbsp;
          <span style={{ color: '#E03A3A' }}>
            Please don't transfer other types of tokens to this address.&nbsp;
          </span>
          Charging process will take several hours to confirm.
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
              Token:
            </Box>
            <FormControl
              className={`${styles['input-form-control']} ${styles['select-form-control']}`}
            >
              <FromItemControl
                placeholder="Select a Token..."
                formik={formik}
                name="coinId"
                options={options}
                type="token"
                renderValue={(value) => {
                  const temp = options.filter((v) => v.id === coinId)[0];
                  return (
                    <div className={styles['select-render-value']}>
                      <ChainLabel
                        value={temp?.value}
                        label={temp?.label}
                        type="token"
                      />
                    </div>
                  );
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
            {coinId && chainNetwork ? (
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
            {dialogState?.params ? (
              <Button
                disabled={!chainNetwork || !coinId}
                variant="contained"
                size="large"
                style={{ width: '250px' }}
                classes={{
                  disabled: styles['btn-disabled'],
                }}
                onClick={() => {
                  handleClose();
                  dispatch({
                    type: 'wallet/queryBalances',
                  });
                  dispatch({
                    type: 'dialog/show',
                    payload: {
                      key: 'paymentDialog',
                      params: dialogState?.params,
                    },
                  });
                }}
              >
                Continue to pay
              </Button>
            ) : (
              <Button
                disabled={!chainNetwork || !coinId}
                type="submit"
                variant="contained"
                size="large"
                style={{ width: '250px' }}
                classes={{
                  disabled: styles['btn-disabled'],
                }}
              >
                OK
              </Button>
            )}
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default TransferAddFundsDialog;
