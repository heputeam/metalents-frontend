import { useEffect, useState } from 'react';

import { IDialogState, useDispatch, useSelector } from 'umi';

// import Toast from '@/components/Toast';
import CropDialog from '@/components/CropDialog';
import Avatar, { IAvatarProps } from '@/components/Avatar';
import Uploader, { FileWithFid, IUploaderError } from '@/components/Uploader';
import { acceptFileType, getFileMaxSize } from '@/utils';
import Loading from '../Loading';
import styles from './index.less';
import Toast from '../Toast';
interface IAvatar extends IAvatarProps {
  // TODO: 后续string要换成IFile
  onSuccess?: (res: string) => void;
  onError?: (error: IUploaderError[]) => void;
}

const CropDialogKey = 'avatar_cropDialog';

const AvatarUploader: React.FC<IAvatar> = ({
  onSuccess,
  onError,
  children,
  ...rest
}) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [objectFit, setObjectFit] = useState<
    'contain' | 'horizontal-cover' | 'vertical-cover'
  >('contain');

  const dialogState = useSelector(({ dialog }: { dialog: IDialogState }) => {
    const _state = dialog[CropDialogKey];
    return {
      visible: _state?.visible,
    };
  });
  const { fileConfig } = useSelector((state: any) => state.fileConfig);

  useEffect(() => {
    setObjectFit('contain');
  }, [dialogState.visible]);

  const handleBefore = (filelist: FileWithFid[]) => {
    setLoading(true);

    return new Promise<FileWithFid[]>((resolve, reject) => {
      if (filelist.length > 0) {
        if (
          (fileConfig?.user_avatar?.fileExt &&
            !acceptFileType(fileConfig?.user_avatar?.fileExt).includes(
              filelist[0].type,
            )) ||
          filelist[0].size > fileConfig?.user_avatar?.fileMaxSize
        ) {
          Toast.error(
            `Only ${fileConfig?.user_avatar?.fileExt?.toUpperCase()} files. Size<${getFileMaxSize(
              fileConfig?.user_avatar?.fileMaxSize,
            )}MB`,
          );
          setLoading(false);
          return reject('AcceptError');
        }

        setFile(filelist[0]);
        dispatch({
          type: 'dialog/show',
          payload: {
            key: CropDialogKey,
            callback: (file: FileWithFid) => {
              dispatch({
                type: 'dialog/hide',
                payload: {
                  key: CropDialogKey,
                },
              });
              resolve([file]);
            },
          },
        });
      }
    });
  };

  return (
    <>
      <Uploader
        validator={{
          fileSize: { disabled: false },
          fileType: { disabled: true },
        }}
        enable={!loading}
        onBefore={handleBefore}
        onSuccess={(res) => {
          setTimeout(() => {
            setLoading(false);
          }, 500);

          onSuccess?.(res?.fileUrl || '');
        }}
        limitSize={getFileMaxSize(fileConfig?.user_avatar?.fileMaxSize)}
        maxCount={fileConfig?.user_avatar?.fileCount || 1}
        onError={(errors) => {
          if (
            !!errors.find(
              (err) =>
                err.error === 'LimitError' || err.error === 'AcceptError',
            )
          ) {
            Toast.error(
              `Only ${fileConfig?.user_avatar?.fileExt?.toUpperCase()} files. Size<${getFileMaxSize(
                fileConfig?.user_avatar?.fileMaxSize,
              )}MB`,
            );
          }
          setLoading(false);

          onError?.(errors);
        }}
        sx={{ borderRadius: '50%' }}
        accept={
          fileConfig?.user_avatar?.fileExt
            ? acceptFileType(fileConfig?.user_avatar?.fileExt)
            : undefined
        }
      >
        <div className={styles['uploader-content']}>
          <Avatar {...rest} />

          {loading && (
            <div className={styles['loading-container']}>
              <Loading className={styles['loading']} />
            </div>
          )}
        </div>
      </Uploader>

      <CropDialog
        onClose={() => {
          setLoading(false);
        }}
        fileOrigin={file}
        dialog_key={CropDialogKey}
        dialogWidth={500}
        // cropContainerWidth={300}
        corpSetting={{
          aspect: 1,
          cropShape: 'round',
        }}
      />
    </>
  );
};

export default AvatarUploader;
