import Web3 from 'web3';

export const getContract = function <T>(
  provider: Web3,
  abi: any,
  address: string,
): T {
  return new provider.eth.Contract(abi, address) as unknown as T;
};

export const initContract = function <T>(abi: any) {
  return (provider: Web3, address: string) => {
    return getContract<T>(provider, abi, address);
  };
};
