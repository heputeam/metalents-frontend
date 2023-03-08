import { ReactComponent as PencilSVG } from '@/assets/imgs/account/mint/pencil.svg';
import { IFinalPost } from '@/service/user/types';
import { IconButton, Tooltip, Typography } from '@mui/material';
import styles from './index.less';
import { DialogKey as EditNameDialogKey } from '../../../../components/EditNameDialog';
import { useDispatch } from 'umi';
import { useContext } from 'react';
import { MintContext, processFileName } from '../..';
import classNames from 'classnames';

export type INameCellContentProps = {
  finalPost: IFinalPost;
};

const getfilesize = (size: number): string => {
  if (!size) return '0KB';

  var num = 1024; //byte

  if (size < num) return size + 'B';
  if (size < Math.pow(num, 2)) return (size / num).toFixed(0) + 'KB'; //kb
  if (size < Math.pow(num, 3))
    return (size / Math.pow(num, 2)).toFixed(0) + 'MB'; //M
  if (size < Math.pow(num, 4))
    return (size / Math.pow(num, 3)).toFixed(0) + 'GB'; //G
  if (size < Math.pow(num, 5))
    return (size / Math.pow(num, 4)).toFixed(0) + 'TB'; //T

  return size + 'B';
};

const NameCellContent: React.FC<INameCellContentProps> = ({ finalPost }) => {
  const dispatch = useDispatch();

  const { mintableFileType } = useContext(MintContext);

  const canMint = mintableFileType?.includes(
    finalPost.post.fileType.split('/')?.[0],
  );

  return (
    <div className={styles['name-cell-content']}>
      {finalPost.nftName ? (
        <>
          <Tooltip
            arrow
            placement="top"
            classes={{
              tooltip: styles['tooltip'],
              arrow: styles['tooltip-arrow'],
            }}
            title={<Typography>{finalPost.nftName}</Typography>}
          >
            <Typography
              className={classNames(
                styles['file-name'],
                !canMint && styles['file-name-disabled'],
              )}
            >
              {/* 如果原文件名超过8个字符，显示... */}
              {`${processFileName(finalPost.nftName, 8).name}${
                finalPost.nftName.length -
                  processFileName(finalPost.nftName, 8).extension.length >
                8
                  ? '...'
                  : ''
              }${processFileName(finalPost.nftName, 8).extension}`}
            </Typography>
          </Tooltip>

          <Typography className={styles['file-size']}>
            &nbsp;(
            {finalPost.post.fileSize
              ? getfilesize(Number(finalPost.post.fileSize))
              : '-'}
            )
          </Typography>
        </>
      ) : (
        <Typography>-</Typography>
      )}

      {!(finalPost.status === 'minting') && canMint && (
        <IconButton
          size="small"
          onClick={() => {
            dispatch({
              type: 'dialog/show',
              payload: {
                key: EditNameDialogKey,
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

export default NameCellContent;
