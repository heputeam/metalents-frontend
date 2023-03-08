import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { usePostArApply } from '@/hooks/useChain';
import { Errors } from '@/service/errors';
import { TFinalPostStatus } from '@/service/user/types';
import { Link, Tooltip, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { ArReadyFileType, MintContext } from '../..';
import styles from './index.less';

export type IArweaveCellContentProps = {
  status: TFinalPostStatus;
  arweaveUrl: string;
  orderId: number;
  postId?: number;
  onApplyArSuccess: () => void;
  fileType: string;
};

const ArweaveCellContent: React.FC<IArweaveCellContentProps> = ({
  status,
  arweaveUrl,
  orderId,
  postId,
  onApplyArSuccess,
  fileType,
}) => {
  const {
    mintableFileType,
    setCurrentPostId,
    applyingOrEditing,
    setApplyingOrEditing,
  } = useContext(MintContext);

  const { run: applyArweave, loading: isApplyingArweave } = usePostArApply({
    onBefore: () => {
      setApplyingOrEditing?.('applying');
      setCurrentPostId?.(postId!);
    },
    onSuccess: (resp) => {
      if (resp.code === 200) {
        onApplyArSuccess();
      } else {
        Toast.error(Errors[resp.code] || Errors['*']);
      }
    },
    onError: (resp: any) => {
      Toast.error(Errors[resp.code] || Errors['*']);
    },
    onFinally: () => {
      setApplyingOrEditing?.('idle');
      setCurrentPostId?.(undefined);
    },
  });

  return (
    <div className={styles['arweave-cell-content']}>
      {postId &&
      orderId &&
      mintableFileType?.includes(fileType.split('/')?.[0]) &&
      ArReadyFileType.includes(fileType.split('/')?.[1].toUpperCase()) ? (
        <>
          {(status === 'uploaded' ||
            status === 'minting' ||
            status === 'minted') &&
            arweaveUrl && (
              <Tooltip
                arrow
                placement="top"
                classes={{
                  tooltip: styles['tooltip'],
                  arrow: styles['tooltip-arrow'],
                }}
                title={<Typography>{arweaveUrl}</Typography>}
              >
                <Link
                  target="_blank"
                  href={arweaveUrl}
                  className={styles['arweave-url']}
                >
                  {arweaveUrl}
                </Link>
              </Tooltip>
            )}

          {(status === '' ||
            status === 'upload_failed' ||
            status === 'mint_failed') && (
            <Button
              loading={isApplyingArweave}
              rounded
              disabled={applyingOrEditing === 'editing'}
              variant="contained"
              sx={{ width: '120px' }}
              onClick={() => {
                if (postId) {
                  applyArweave({
                    postId: postId,
                    orderId: Number(orderId),
                  });
                } else {
                  Toast.error(Errors['*']);
                }
              }}
            >
              {isApplyingArweave ? 'Applying' : 'Apply'}
            </Button>
          )}

          {status === 'uploading' && (
            <Button
              rounded
              disabled
              variant="contained"
              sx={{
                width: '120px',
                '&.Mui-disabled': {
                  color: '#fff',
                  backgroundColor: '#b9b9b9',
                },
              }}
            >
              Applying
            </Button>
          )}
        </>
      ) : (
        '-'
      )}
    </div>
  );
};

export default ArweaveCellContent;
