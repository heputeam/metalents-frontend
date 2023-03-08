import { NetworkChain } from './web3/chains';

export const FANGIBLE_PATH = 'https://fangible.com';
export const BOUNCE_FINANCE_PATH = 'https://bounce.finance/';
export const METAVERSE_PATH = 'https://metaverse.bounce.finance/';
export const SIGNATURE_MSG = `Welcome to metalents ${Date.now()}`;

export const OAuthKeys = {
  google:
    '117868071955-qn5h5u34204f0d3djbpetroimfbvuatq.apps.googleusercontent.com',
  instagram: '460591812509549',
  twitter: 'PdfG0tpJ9QSECGnbnXcZE7EH4',
};

export type IOAuth = keyof typeof OAuthKeys;

export enum USER_TYPE {
  Buyer = 1,
  Seller = 2,
  Official = 3,
}

export enum IDENTITY_TYPE {
  Owner = 1,
  Other = 2,
}

// 禁用某些代币，以token的name为准
export const DisabledToken = [];

export const ENV =
  window.location?.host?.includes('test') ||
  window.location?.host?.includes('localhost') ||
  window.location?.host?.includes('192')
    ? 'DEV'
    : 'PRO';

export const SupportedChains: NetworkChain[] =
  ENV === 'PRO'
    ? [NetworkChain.BinanceMainnet, NetworkChain.Ethereum]
    : [NetworkChain.BinanceTestnet, NetworkChain.Rinkeby];
