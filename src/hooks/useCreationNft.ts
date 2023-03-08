import { IMintPostParams } from '@/service/creationNft/types';
import { NetworkChain } from '@/web3/chains';
import { CreationNFTContract } from '@/web3/contract';
import { CreationNFTContractAddress } from '@/web3/define';
import { useWeb3React } from '@web3-react/core';
import { useRequest } from 'ahooks';
import { Options } from 'ahooks/lib/useRequest/src/types';

export const useMint = (
  chainId: NetworkChain,
  options?: Options<any, IMintPostParams>,
) => {
  const { library, active, account } = useWeb3React();

  const contractAddress = CreationNFTContractAddress[chainId];

  return useRequest<any, IMintPostParams>(
    (mint2Address, postId, sign, expireTime) => {
      return CreationNFTContract(library, contractAddress)
        .methods.mint(mint2Address, postId, sign, expireTime)
        .send({
          from: account || '',
        });
    },
    {
      manual: true,
      ready: !!chainId && !!account && active,
      onBefore: (params) => {
        console.log('mint params: ', params);
      },
      onError: (errors) => {
        console.log('mint errors: ', errors);
      },
      ...options,
    },
  );
};
