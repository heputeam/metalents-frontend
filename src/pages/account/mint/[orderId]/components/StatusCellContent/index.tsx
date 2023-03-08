import ChainNodes, { NetworkChain } from '@/web3/chains';
import { Link, Tooltip, Typography } from '@mui/material';
import classNames from 'classnames';
import { useContext } from 'react';
import { MintContext } from '../..';
import styles from './index.less';
import { toOmitAccount } from '@/utils';
import { IFinalPost } from '@/service/user/types';

export type IStatusCellContentProps = {
  finalPost: IFinalPost;
};

const StatusCellContent: React.FC<IStatusCellContentProps> = ({
  finalPost,
}) => {
  const { mintableFileType } = useContext(MintContext);

  return (
    <div className={styles['status-cell-content']}>
      {mintableFileType?.includes(finalPost.post.fileType.split('/')?.[0]) &&
      finalPost.chainStatus.some((chainStatus) => chainStatus.txHash) ? (
        finalPost.chainStatus.map((item) =>
          item.txHash ? (
            <div className={styles['address-box']} key={item.chainId}>
              <Typography>
                {ChainNodes[item.chainId as NetworkChain].abbreviation}
              </Typography>

              <Tooltip
                arrow
                placement="top"
                classes={{
                  tooltip: classNames(
                    styles['tooltip'],
                    styles['address-tooltip'],
                  ),
                  arrow: styles['tooltip-arrow'],
                }}
                title={<Typography>{item.txHash}</Typography>}
              >
                <Link
                  target="_blank"
                  href={`${
                    ChainNodes[item.chainId as NetworkChain].blockExplorerUrls
                  }/tx/${item.txHash}`}
                >
                  <Typography className={styles['address']}>
                    {toOmitAccount(item.txHash)}
                  </Typography>
                </Link>
              </Tooltip>
            </div>
          ) : (
            <></>
          ),
        )
      ) : (
        <span>-</span>
      )}
    </div>
  );
};

export default StatusCellContent;
