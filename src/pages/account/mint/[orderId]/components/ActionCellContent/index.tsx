import { useDispatch } from 'umi';
import styles from './index.less';
import { ReactComponent as BscSVG } from '@/assets/imgs/account/mint/bsc.svg';
import { ReactComponent as EthSVG } from '@/assets/imgs/account/mint/eth.svg';
import { Select } from '@/pages/account/components/Select';
import { NetworkChain } from '@/web3/chains';
import { DialogKey as MintToDialogKey } from '@/pages/account/components/MintToDialog';
import { useContext, useState } from 'react';
import { IFinalPost } from '@/service/user/types';
import { ArReadyFileType, MintContext } from '../..';
import Toast from '@/components/Toast';
import { Errors } from '@/service/errors';
import { usePostGetMintSign, usePostMintNft } from '@/hooks/useChain';
import Button from '@/components/Button';
import { useMint } from '@/hooks/useCreationNft';
import { ENV } from '@/define';

interface IActionCellContentProps {
  orderId: number;
  finalPost: IFinalPost;
  onMintStart: () => void;
  onMintError: () => void;
  onMintEnd: () => void;
}

const ActionCellContent: React.FC<IActionCellContentProps> = ({
  orderId,
  finalPost,
  onMintStart,
  onMintError,
  onMintEnd,
}) => {
  const dispatch = useDispatch();

  const { mintableFileType } = useContext(MintContext);

  const [chainId, setChainId] = useState(
    ENV === 'PRO' ? NetworkChain.BinanceMainnet : NetworkChain.BinanceTestnet,
  );

  const canMint =
    !!chainId &&
    mintableFileType?.includes(finalPost.post.fileType.split('/')?.[0]) &&
    !finalPost.chainStatus.find(
      (status) => status.chainId === chainId && !!status.txHash,
    ) &&
    (finalPost.status === 'uploaded' || finalPost.status === 'minting') &&
    !!finalPost.arweaveUrl;

  const { run: uploadMintInfo, loading: isUploadingMintInfo } = usePostMintNft({
    onSuccess: (resp) => {
      if (resp.code === 200) {
        dispatch({
          type: 'dialog/hide',
          payload: {
            key: MintToDialogKey,
          },
        });

        Toast.success(
          'Successfully minted! Please view on Blockchain Explorer. ',
        );

        onMintEnd?.();
      } else {
        return Toast.error(Errors['*']);
      }
    },
    onError: (err) => {
      onMintError();
      return Toast.error(Errors['*']);
    },
  });

  const { run: mintPost, loading: isMintingPost } = useMint(chainId, {
    onSuccess: (resp) => {
      if (resp?.transactionHash) {
        uploadMintInfo({
          chainId: chainId,
          postId: finalPost.post.id!,
          txHash: resp.transactionHash,
        });
      }
    },
    onError: (error) => {
      onMintError();
      if (error.message.includes('denied')) {
        return Toast.error('You denied the transaction signature');
      }
      return Toast.error(Errors['*']);
    },
  });

  const { run: getMintSign, loading: isGettingMintSign } = usePostGetMintSign({
    onBefore: () => {
      onMintStart();
    },
    onSuccess: (resp, params) => {
      if (resp.code !== 200) {
        return Toast.error(Errors['*']);
      } else {
        mintPost(
          params[0].mintAddress,
          finalPost.post.id!,
          resp.data.sign,
          resp.data.expireTime,
        );
      }
    },
    onError: () => {
      onMintError();
      return Toast.error(Errors['*']);
    },
  });

  const options: { label: JSX.Element; value: NetworkChain }[] = [
    {
      label: (
        <>
          <BscSVG style={{ marginRight: '10px' }} />
          BNB Smart Chain
        </>
      ),
      value:
        ENV === 'PRO'
          ? NetworkChain.BinanceMainnet
          : NetworkChain.BinanceTestnet,
    },
    {
      label: (
        <>
          <EthSVG style={{ marginRight: '10px' }} />
          Ethereum
        </>
      ),
      value: ENV === 'PRO' ? NetworkChain.Ethereum : NetworkChain.Rinkeby,
    },
  ];

  return (
    <>
      <div className={styles['action-cell-content']}>
        {mintableFileType?.includes(finalPost.post.fileType.split('/')?.[0]) &&
          ArReadyFileType.includes(
            finalPost.post.fileType.split('/')?.[1].toUpperCase(),
          ) && (
            <>
              <Select
                value={chainId}
                onChange={(event) => {
                  setChainId(Number(event.target.value));
                  console.log('>>> target chainId: ', event.target.value);
                }}
                options={options}
              />

              <Button
                variant="contained"
                className={styles['mint-to-button']}
                disabled={!canMint}
                loading={
                  isUploadingMintInfo || isMintingPost || isGettingMintSign
                }
                onClick={() => {
                  dispatch({
                    type: 'dialog/show',
                    payload: {
                      key: MintToDialogKey,
                      chainId,
                      getMintSign: (address: string) => {
                        getMintSign({
                          chainId,
                          mintAddress: address,
                          postId: finalPost.post.id!,
                          orderId,
                        });
                      },
                    },
                  });
                }}
                sx={{
                  '&.Mui-disabled': {
                    color: '#fff',
                    backgroundColor: '#b9b9b9',
                  },
                }}
              >
                Mint to
              </Button>
            </>
          )}
      </div>
    </>
  );
};

export default ActionCellContent;
