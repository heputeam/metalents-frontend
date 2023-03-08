import BSCBlockSVG from '@/assets/imgs/services/bsc.svg';
import ETHBlockSVG from '@/assets/imgs/services/eth.svg';

export enum NetworkChain {
  Rinkeby = 4,
  Ethereum = 1,
  BinanceMainnet = 56,
  BinanceTestnet = 97,
}

export interface IChainItem {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  abbreviation: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  blockIcon: string;
  iconUrls?: string[]; // Currently ignored.
}

export interface IChainNodes {
  [NetworkChain.Ethereum]: IChainItem;
  [NetworkChain.Rinkeby]: IChainItem;
  [NetworkChain.BinanceTestnet]: IChainItem;
  [NetworkChain.BinanceMainnet]: IChainItem;
}

const ChainNodes: IChainNodes = {
  '1': {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    abbreviation: 'ETH',
    rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://etherscan.io'],
    blockIcon: ETHBlockSVG,
    nativeCurrency: {
      name: 'Ethereum Mainnet',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  '4': {
    chainId: '0x4',
    chainName: 'Rinkeby',
    abbreviation: 'tETH',
    rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
    blockIcon: ETHBlockSVG,
    nativeCurrency: {
      name: 'Rinkeby',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  '56': {
    chainId: '0x38',
    chainName: 'Binance Smart Chain Mainnet',
    abbreviation: 'BSC',
    rpcUrls: ['https://bsc-dataseed1.ninicoin.io'],
    blockExplorerUrls: ['https://bscscan.com'],
    blockIcon: BSCBlockSVG,
    nativeCurrency: {
      name: 'Binance Smart Chain Mainnet',
      symbol: 'BNB',
      decimals: 18,
    },
  },
  '97': {
    chainId: '0x61',
    chainName: 'Binance Smart Chain Testnet',
    abbreviation: 'tBSC',
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    blockIcon: BSCBlockSVG,
    nativeCurrency: {
      name: 'Binance Smart Chain Testnet',
      symbol: 'tBNB',
      decimals: 18,
    },
  },
};

export default ChainNodes;
