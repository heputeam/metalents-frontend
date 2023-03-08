export * from './chains';
import { ENV } from '@/define';
import { NetworkChain } from './chains';

export const defChain =
  ENV === 'PRO' ? NetworkChain.Ethereum : NetworkChain.Rinkeby;
export const TokenRegExp = /^0x[a-zA-Z0-9]{40}$/i;
export type IContractAddress = Record<
  NetworkChain,
  {
    erc20: string;
  }
>;

export const ContractAddrs: IContractAddress = {
  [NetworkChain.Rinkeby]: {
    erc20: '0x0000000000000000000000000000000000001002',
  },
  [NetworkChain.Ethereum]: {
    erc20: '0x0000000000000000000000000000000000001002',
  },
  [NetworkChain.BinanceMainnet]: {
    erc20: '0x0000000000000000000000000000000000001002',
  },
  [NetworkChain.BinanceTestnet]: {
    erc20: '0x0000000000000000000000000000000000001002',
  },
};

export const CURRENCY_OPTION = {
  [NetworkChain.Ethereum]: [
    {
      id: 1,
      name: 'ETH',
      symbol: 'ethereum',
      chainId: 1,
      sysDecimals: 4,
      contract: '0x0000000000000000000000000000000000000000',
    },
    {
      id: 3,
      name: 'AUCTION',
      symbol: 'auction',
      chainId: 1,
      sysDecimals: 4,
      contract: '0xA9B1Eb5908CfC3cdf91F9B8B3a74108598009096',
    },
    {
      id: 4,
      name: 'USDT',
      symbol: 'tether',
      chainId: 1,
      sysDecimals: 2,
      contract: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
  ],
  [NetworkChain.Rinkeby]: [
    {
      id: 1,
      name: 'ETH',
      symbol: 'ethereum',
      chainId: 4,
      contract: '0x0000000000000000000000000000000000000000',
    },
    {
      id: 3,
      name: 'AUCTION',
      symbol: 'auction',
      chainId: 4,
      sysDecimals: 4,
      contract: '0x5E26FA0FE067d28aae8aFf2fB85Ac2E693BD9EfA',
    },
    {
      id: 4,
      name: 'USDT',
      symbol: 'tether',
      chainId: 4,
      sysDecimals: 2,
      contract: '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02',
    },
  ],
  [NetworkChain.BinanceMainnet]: [
    {
      id: 2,
      name: 'BNB',
      symbol: 'binance-coin',
      chainId: 56,
      sysDecimals: 2,
      contract: '0x0000000000000000000000000000000000000000',
    },
    {
      id: 5,
      name: 'BUSD',
      symbol: 'binanceusd',
      chainId: 56,
      sysDecimals: 2,
      contract: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    },
  ],
  [NetworkChain.BinanceTestnet]: [
    {
      id: 2,
      name: 'BNB',
      symbol: 'binance-coin',
      chainId: 97,
      sysDecimals: 2,
      contract: '0x0000000000000000000000000000000000000000',
    },
    {
      id: 5,
      name: 'BUSD',
      symbol: 'binanceusd',
      chainId: 97,
      sysDecimals: 2,
      contract: '',
    },
  ],
};

export const networkOption = {
  PRO: [
    {
      label: 'BNB Smart Chain (BEP20)',
      value: NetworkChain.BinanceMainnet,
    },
    {
      label: 'Ethereum (ERC20)',
      value: NetworkChain.Ethereum,
    },
  ],
  DEV: [
    {
      label: 'BNB Smart Chain Test (BEP20)',
      value: NetworkChain.BinanceTestnet,
    },
    {
      label: 'Ethereum Test (ERC20)',
      value: NetworkChain.Rinkeby,
    },
  ],
};

export const ZERO_TOEKN = '0x0000000000000000000000000000000000000000';

/**
 * 合约MetalentsCreationNFT的地址
 */
export const CreationNFTContractAddress = {
  [NetworkChain.Rinkeby]: '0x94E7d2a17EAA6A86DFD2Fddb639F9878d8377CC7',
  [NetworkChain.BinanceTestnet]: '0x94E7d2a17EAA6A86DFD2Fddb639F9878d8377CC7',
  [NetworkChain.Ethereum]: '0x3E6590a6208C2ddA44d90AD1fCfC65805F2f30bC',
  [NetworkChain.BinanceMainnet]: '0x7971307a449bF979938Add422AC70Dbe76DAF689',
};
