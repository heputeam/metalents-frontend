import Dialog from '@/components/Dialog';
import { IDialogState, useDispatch, useSelector } from 'umi';
import styles from './index.less';
import Button from '@/components/Button';
import { InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { NetworkChain, TokenRegExp } from '@/web3/define';
import { useWeb3React } from '@web3-react/core';
import { useChainCheck, useWalletConnection } from '@/web3/hooks';
import { SupportedChains } from '@/define';

interface IMintToDialogState {
  visible: boolean;
  chainId: number;
  getMintSign: (address: string) => void;
}

const DialogKey = 'MintToDialog'; // dialog 唯一值

export type IMintToDialogProps = { isMinting: boolean };

const MintToDialog: React.FC<IMintToDialogProps> = ({ isMinting }) => {
  const dispatch = useDispatch();

  // 提取dialog 状态
  const dialogState: IMintToDialogState = useSelector<
    any,
    IDialogState & IMintToDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[DialogKey],
  }));

  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<'Empty' | 'InvalidAddress' | null>(null);
  const [chainName, setChainName] = useState<string>('');

  useEffect(() => {
    setInputValue('');
    setError(null);
  }, [dialogState.visible]);

  const { active, chainId } = useWeb3React();
  const { connect } = useWalletConnection();
  const { handleSwitch } = useChainCheck();

  const handleClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: DialogKey,
      },
    });
  };

  useEffect(() => {
    if (
      [NetworkChain.BinanceMainnet, NetworkChain.BinanceTestnet].includes(
        dialogState.chainId,
      )
    ) {
      setChainName('BSC');
    } else if (
      [NetworkChain.Ethereum, NetworkChain.Rinkeby].includes(
        dialogState.chainId,
      )
    ) {
      setChainName('ETH');
    }
  }, [dialogState.chainId]);

  useEffect(() => {
    if (active && dialogState.chainId && chainId !== dialogState.chainId) {
      handleSwitch(dialogState.chainId);
    }
  }, [active, chainId, dialogState.chainId]);

  return (
    <Dialog
      visible={dialogState.visible}
      title="Mint to"
      onClose={handleClose}
      backBtn={<></>}
      // closeBtn={<></>}
    >
      <div className={styles['cancel-request-content']}>
        <div className={styles['input-box']}>
          <InputLabel
            htmlFor="name-input"
            classes={{ root: styles['input-label'] }}
          >
            ERC-721 will be minted to this address in {chainName}
          </InputLabel>

          <OutlinedInput
            id="name-input"
            fullWidth
            placeholder="Enter..."
            error={!!error}
            value={inputValue}
            onChange={(event) => {
              setError(null);
              setInputValue(event.target.value);
            }}
            onBlur={(event) => {
              if (event?.target.value.length === 0) {
                return setError('Empty');
              }
              if (!TokenRegExp.test(event?.target.value || '')) {
                return setError('InvalidAddress');
              }
            }}
            aria-describedby="name-input-text"
            sx={{
              borderRadius: '7px',
              background: 'rgba(255, 255, 255, 0.5)',
              '&.Mui-focused': {
                '.MuiOutlinedInput-notchedOutline': {
                  borderWidth: '1px',
                },
              },
              '&.Mui-error': {
                '.MuiOutlinedInput-notchedOutline': {
                  borderWidth: '1px',
                },
              },
              '.MuiOutlinedInput-notchedOutline': {
                borderWidth: 0,
                boxShadow: '3px 3px 12px rgba(0, 0, 0, 0.1)',
              },
              '.MuiOutlinedInput-input': {
                padding: '12px 20px 13px 20px',
              },
            }}
          />

          <Typography className={styles['helper-text']}>
            {error === 'Empty' && `Required fields can't be blank`}
            {error === 'InvalidAddress' && `Wrong wallet address`}
            {!error && <br />}
          </Typography>
        </div>

        <Stack direction="row" spacing={10} sx={{ marginTop: '17px' }}>
          <Button
            disabled={isMinting}
            variant="outlined"
            size="large"
            style={{ width: '220px', height: '48px' }}
            onClick={handleClose}
          >
            Cancel
          </Button>

          {!active ||
          !(chainId && SupportedChains.includes(chainId)) ||
          chainId !== dialogState.chainId ? (
            <Button
              loading={isMinting}
              variant="contained"
              size="large"
              style={{ width: '240px', height: '48px' }}
              onClick={async () => {
                if (!active) {
                  connect();
                } else {
                  handleSwitch(dialogState.chainId);
                }
              }}
            >
              Connect
            </Button>
          ) : (
            <Button
              loading={isMinting}
              disabled={
                !!error || !inputValue.length || chainId !== dialogState.chainId
              }
              variant="contained"
              size="large"
              style={{ width: '240px', height: '48px' }}
              onClick={() => {
                dialogState.getMintSign(inputValue);
              }}
            >
              {isMinting ? 'Comfirming' : 'Comfirm'}
            </Button>
          )}
        </Stack>
      </div>
    </Dialog>
  );
};

export { MintToDialog, DialogKey };
