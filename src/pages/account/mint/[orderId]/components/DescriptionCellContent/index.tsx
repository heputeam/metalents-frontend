import { ReactComponent as PencilSVG } from '@/assets/imgs/account/mint/pencil.svg';
import { IFinalPost } from '@/service/user/types';
import { IconButton, Tooltip, Typography } from '@mui/material';
import styles from './index.less';
import { DialogKey as EditDescriptionDialogKey } from '../../../../components/EditDescriptionDialog';
import { useDispatch } from 'umi';
import { useContext } from 'react';
import { MintContext } from '../..';

export type IDescriptionCellContentProps = { finalPost: IFinalPost };

const DescriptionCellContent: React.FC<IDescriptionCellContentProps> = ({
  finalPost,
}) => {
  const dispatch = useDispatch();

  const { mintableFileType } = useContext(MintContext);

  const canMint = mintableFileType?.includes(
    finalPost.post.fileType.split('/')?.[0],
  );

  return (
    <div className={styles['description-cell-content']}>
      {finalPost.nftDescription ? (
        <>
          <Tooltip
            arrow
            placement="top"
            classes={{
              tooltip: styles['tooltip'],
              arrow: styles['tooltip-arrow'],
            }}
            title={<Typography>{finalPost.nftDescription}</Typography>}
          >
            <Typography className={styles['description']}>
              {finalPost.nftDescription}
            </Typography>
          </Tooltip>
        </>
      ) : (
        <span>-</span>
      )}

      {!(finalPost.status === 'minting') && canMint && (
        <IconButton
          size="small"
          onClick={() => {
            dispatch({
              type: 'dialog/show',
              payload: {
                key: EditDescriptionDialogKey,
                nftName: finalPost.nftName,
                nftDescription: finalPost.nftDescription,
                postId: finalPost.post.id,
              },
            });
          }}
        >
          <PencilSVG />
        </IconButton>
      )}
    </div>
  );
};

export default DescriptionCellContent;
