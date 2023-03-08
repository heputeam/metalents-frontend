import Button from '@/components/Button';
import {
  Container,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import styles from './index.less';
import BackIcon from '@/components/ProfileFormItem/BackIcon';
import {
  history,
  IConfigStateType,
  useDispatch,
  useParams,
  useSelector,
} from 'umi';
import Avatar from '@/components/Avatar';
import { ReactComponent as HelpSVG } from '@/assets/imgs/account/mint/help.svg';
import { ReactComponent as TelescopeSVG } from '@/assets/imgs/account/mint/telescope.svg';
import { createContext, useEffect, useState } from 'react';
import {
  EditNameDialog,
  DialogKey as EditNameDialogKey,
} from '../../components/EditNameDialog';
import {
  EditDescriptionDialog,
  DialogKey as EditDescriptionDialogKey,
} from '../../components/EditDescriptionDialog';
import { MintToDialog } from '../../components/MintToDialog';
import PreviewDialog from '@/pages/request/components/PreviewDialog';
import classNames from 'classnames';
import { useGetFinalPost } from '@/hooks/useUser';
import Loading from '@/components/Loading';
import ArweaveCellContent from './components/ArweaveCellContent';
import ActionCellContent from './components/ActionCellContent';
import StatusCellContent from './components/StatusCellContent';
import NameCellContent from './components/NameCellContent';
import DescriptionCellContent from './components/DescriptionCellContent';
import FileBlock from '@/pages/services/components/comments/components/FileBlock';

export type ApplyingOrEditing = 'idle' | 'applying' | 'editing';

const handleBack = () => {
  history.goBack();
};

const urlPrefix =
  window.location?.host?.includes('test') ||
  window.location?.host?.includes('localhost')
    ? 'https://test.metalents.com'
    : 'https://app.metalents.com';

export const ArReadyFileType = [
  'JPEG',
  'PNG',
  'GIF',
  'SVG',
  'MP4',
  'WEBM',
  'MPEG',
  'WAV',
  'OGG',
  'GLB',
  'GLTF',
];

export const MintContext = createContext<{
  mintableFileType: string[];
  currentPostId?: number;
  setCurrentPostId?: (postId: number | undefined) => void;
  applyingOrEditing: ApplyingOrEditing;
  setApplyingOrEditing?: (state: ApplyingOrEditing) => void;
}>({
  mintableFileType: [],
  currentPostId: undefined,
  setCurrentPostId: undefined,
  applyingOrEditing: 'idle',
  setApplyingOrEditing: undefined,
});

/**
 *
 * @param fullFileName 完整的文件名
 * @param nameCount 保留的文件名位数
 * @returns 处理后的文件名, 扩展名
 */
export const processFileName = (fullFileName: string, nameCount?: number) => {
  if (!fullFileName.includes('.')) {
    return { name: fullFileName, extension: '' };
  }

  const wordArr = fullFileName.split('.');
  const extension = '.' + wordArr.pop();
  const fileName = wordArr.join('.');

  let name = fileName;

  if (nameCount && 0 < nameCount && nameCount <= fullFileName.length) {
    name = fileName.slice(0, nameCount);
  }

  return { name, extension };
};

const MintNftPage: React.FC = () => {
  const params: { orderId: string } = useParams();

  const dispatch = useDispatch();

  const [mintableFileType, setMintableFileType] = useState<string[]>([]);
  const [applyingOrEditing, setApplyingOrEditing] =
    useState<ApplyingOrEditing>('idle');
  const [currentPostId, setCurrentPostId] = useState<number>();

  const [isMinting, setIsMinting] = useState(false);

  const { config: sysConfig } = useSelector<any, IConfigStateType>(
    (state) => state.config,
  );

  useEffect(() => {
    console.log('>>> currentPostId: ', currentPostId);
  }, [currentPostId]);

  useEffect(() => {
    if (!sysConfig) {
      return;
    }

    setMintableFileType(
      sysConfig.MINT_FILE_FORMAT.cfgVal.toLowerCase().split('/'),
    );
  }, [sysConfig]);

  const {
    data: finalPost,
    refresh: refreshFinalPosts,
    loading: isFinalPostLoading,
  } = useGetFinalPost(Number(params.orderId));

  const handlePreview = (slideIndex: number) => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'previewDialog',
        previewIndex: slideIndex,
        posts: finalPost?.list.map((item) => ({
          fileUrl: item.post.fileThumbnailUrl || item.post.fileUrl,
          fileName: item.post.fileName,
          fileSize: item.post.fileSize,
          fileType: item.post.fileType,
        })),
        disableDownload: true,
      },
    });
  };

  return (
    <MintContext.Provider
      value={{
        mintableFileType,
        applyingOrEditing,
        setApplyingOrEditing,
        currentPostId,
        setCurrentPostId,
      }}
    >
      <Container className={styles['page-container']}>
        <Button
          classes={{ root: styles['back-btn'] }}
          startIcon={<BackIcon />}
          onClick={handleBack}
        >
          Back
        </Button>

        <Typography className={styles['page-title']}>Mint NFT</Typography>

        <Typography className={styles['str-seller-detail']}>
          Seller detail
        </Typography>

        <div className={styles['seller-info']}>
          <IconButton
            size="small"
            onClick={() => {
              history.push(
                `/seller/profile?sidebar&tab=services&userId=${finalPost?.sellerId}`,
              );
            }}
          >
            <Avatar
              src={
                finalPost?.sellerAvatar.fileThumbnailUrl ||
                finalPost?.sellerAvatar.fileUrl
              }
              size={36}
            >
              {finalPost?.sellerShopName.slice(0, 1)}
            </Avatar>
          </IconButton>

          <Typography className={styles['seller-shop-name']}>
            {finalPost?.sellerShopName}
          </Typography>

          <div className={styles['seller-homepage-link']}>
            <Typography>Homepage:&nbsp;</Typography>
            <Link
              href={`/seller/profile?sidebar&tab=services&userId=${finalPost?.sellerId}`}
              underline="hover"
            >
              <Typography>
                {`${urlPrefix}/seller/profile?sidebar&tab=services&userId=${finalPost?.sellerId}`}
              </Typography>
            </Link>
          </div>
        </div>

        <Typography className={styles['str-file-list']}>File list</Typography>

        <TableContainer>
          <Table>
            <TableHead classes={{ root: styles['table-header'] }}>
              <TableRow>
                <TableCell align="left">Preview</TableCell>
                <TableCell align="left" width={73}>
                  Name
                </TableCell>
                <TableCell align="left" width={174}>
                  Description
                </TableCell>
                <TableCell align="left">
                  <div className={styles['arweave-url-header-cell']}>
                    <Typography className={styles['str-arweave-url']}>
                      ARWEAVE URL
                    </Typography>
                    <Tooltip
                      arrow
                      placement="top"
                      classes={{
                        tooltip: classNames(
                          styles['tooltip'],
                          styles['arweave-url-tooltip'],
                        ),
                        arrow: styles['tooltip-arrow'],
                      }}
                      title={
                        <Typography>
                          Please click Apply first, then mint NFT. Arwave URL is
                          a decentralized data storage protocol that provides
                          permanent and scalable on-chain storage and can be
                          used to mint NFT.
                        </Typography>
                      }
                    >
                      <HelpSVG />
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell align="left" width={89}>
                  Status
                </TableCell>
                <TableCell align="left" width={116}></TableCell>
              </TableRow>
            </TableHead>

            {!isFinalPostLoading && finalPost && finalPost.list.length > 0 && (
              <TableBody classes={{ root: styles['table-body'] }}>
                {finalPost?.list.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">
                      <Button
                        className={styles['work-img-button']}
                        onClick={() => {
                          handlePreview(index);
                        }}
                      >
                        <div className={styles['mask']}>
                          <TelescopeSVG />
                        </div>
                        <FileBlock
                          width={70}
                          height={70}
                          fileUrl={
                            item.post.fileThumbnailUrl || item.post.fileUrl
                          }
                          fileType={item.post.fileType}
                          skeletonSx={{ borderRadius: '6px' }}
                          blockStyle={{
                            borderRadius: '6px',
                          }}
                        />
                      </Button>
                    </TableCell>

                    <TableCell align="left">
                      <NameCellContent finalPost={item} />
                    </TableCell>

                    <TableCell align="left">
                      <DescriptionCellContent finalPost={item} />
                    </TableCell>

                    <TableCell align="left">
                      <ArweaveCellContent
                        status={item.status}
                        arweaveUrl={item.arweaveUrl}
                        onApplyArSuccess={refreshFinalPosts}
                        postId={item.post?.id}
                        orderId={Number(params.orderId)}
                        fileType={item.post.fileType}
                      />
                    </TableCell>

                    <TableCell align="left">
                      <StatusCellContent finalPost={item} />
                    </TableCell>

                    <TableCell align="left">
                      <ActionCellContent
                        finalPost={item}
                        orderId={Number(params.orderId)}
                        onMintStart={() => {
                          setIsMinting(true);
                        }}
                        onMintError={() => {
                          setIsMinting(false);
                        }}
                        onMintEnd={() => {
                          setIsMinting(false);
                          refreshFinalPosts();
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>

          {isFinalPostLoading && (
            <div className={styles['loading-box']}>
              <Loading className={styles['loading']} />
            </div>
          )}
        </TableContainer>

        <EditNameDialog
          onSuccess={() => {
            dispatch({
              type: 'dialog/hide',
              payload: {
                key: EditNameDialogKey,
              },
            });
            refreshFinalPosts();
          }}
        />

        <EditDescriptionDialog
          onSuccess={() => {
            dispatch({
              type: 'dialog/hide',
              payload: {
                key: EditDescriptionDialogKey,
              },
            });
            refreshFinalPosts();
          }}
        />

        <MintToDialog isMinting={isMinting} />

        <PreviewDialog />
      </Container>
    </MintContext.Provider>
  );
};

export default MintNftPage;
