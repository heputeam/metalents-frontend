import ChainNodes from './chains';
import { InjectedConnector } from '@web3-react/injected-connector';
import { CloverConnector } from '@clover-network/clover-connector';
import { SupportedChains } from '@/define';

export enum DAppWallet {
  MetaMask = 'MetaMask',
  Clover = 'Clover',
}
export const Wallets = {
  [DAppWallet.MetaMask]: () => {
    return new InjectedConnector({
      supportedChainIds: [
        ...SupportedChains,
        // ...Object.keys(ChainNodes).map((chainId) => Number(chainId)),
      ],
    });
  },
  [DAppWallet.Clover]: () => {
    return new CloverConnector({
      supportedChainIds: [
        1,
        ...SupportedChains,
        // ...Object.keys(ChainNodes).map((chainId) => Number(chainId)),
      ],
    });
  },
};
