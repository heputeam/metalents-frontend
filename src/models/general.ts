import { DAppWallet } from '@/web3/wallets';
import { useSessionStorageState } from 'ahooks';

export default function () {
  const [walletName, setWalletName] =
    useSessionStorageState<DAppWallet>('dapp_wallet_name');

  return { walletName, setWalletName };
}
