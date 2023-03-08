import React, { useEffect, useState } from 'react';
import styles from './index.less';
import CropDialog from '@/components/CropDialog';
import { useDispatch, useSelector } from 'umi';
import { useRequest } from 'ahooks';
import Toast from '@/components/Toast';

import Uploader, { FileWithFid, IUploaderError } from '../Uploader';
import { IResponse } from '@/service/types';
import LoadImg from '../LoadImg';
import { postUpdateBanner } from '@/service/public';
import Loading from '../Loading';
import { acceptFileType, getFileMaxSize } from '@/utils';

export type IBannerProps = {
  bannerSrc: string;
  onSuccess?: (res: string) => void;
  onError?: (error: IUploaderError[]) => void;
  enable?: boolean;
};

const CropDialogKey = 'banner_cropDialog';

const Banner: React.FC<IBannerProps> = ({
  onSuccess,
  bannerSrc,
  onError,
  enable = true,
}) => {
  const { fileConfig } = useSelector((state: any) => state.fileConfig);
  const { run: updatePost, params } = useRequest<
    IResponse<unknown>,
    [{ bannerImage: string }]
  >((params) => postUpdateBanner(params), {
    manual: true,
    onSuccess: (resp) => {
      const { code } = resp;
      if (code === 200) {
        if (params[0]) {
          setBannerSrc(params[0].bannerImage);
          dispatch({
            type: 'user/queryUser',
          });
        }
        Toast.success('Successfully uploaded!');
      } else {
        Toast.error('Unknown system failure: Please try');
      }
    },
  });

  const dispatch = useDispatch();

  const [file, setFile] = useState<File | null>(null);
  const [initBannerSrc, setBannerSrc] = useState(bannerSrc);
  const [loading, setLoading] = useState(false);

  const acceptedFileType = ['image/jpeg', 'image/png', 'image/webp'];

  useEffect(() => {
    setBannerSrc(bannerSrc);
  }, [bannerSrc]);

  const handleBefore = (filelist: FileWithFid[]) => {
    setLoading(true);

    return new Promise<FileWithFid[]>((resolve, reject) => {
      if (
        (fileConfig?.user_banner?.fileExt &&
          !acceptFileType(fileConfig?.user_banner?.fileExt).includes(
            filelist[0].type,
          )) ||
        filelist[0].size > fileConfig?.user_banner?.fileMaxSize
      ) {
        Toast.error(
          `Only ${fileConfig?.user_banner?.fileExt?.toUpperCase()} files. Size<${getFileMaxSize(
            fileConfig?.user_banner?.fileMaxSize,
          )}MB`,
        );
        setLoading(false);
        return reject('AcceptError');
      }

      if (filelist.length > 0) {
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
        enable={!loading && enable}
        sx={{ height: '100%', width: '100%', borderRadius: '26px' }}
        onBefore={handleBefore}
        limitSize={getFileMaxSize(fileConfig?.user_banner?.fileMaxSize)}
        maxCount={fileConfig?.user_banner?.fileCount || 1}
        onSuccess={(res) => {
          setTimeout(() => {
            setLoading(false);
          }, 500);

          updatePost({ bannerImage: res.fileUrl });
        }}
        onError={(errors) => {
          if (
            !!errors.find(
              (err) =>
                err.error === 'LimitError' || err.error === 'AcceptError',
            )
          ) {
            Toast.error(
              `Only ${fileConfig?.user_banner?.fileExt?.toUpperCase()} files. Size<${getFileMaxSize(
                fileConfig?.user_banner?.fileMaxSize,
              )}MB`,
            );
          }
          setLoading(false);

          onError?.(errors);
        }}
        accept={
          fileConfig?.user_banner?.fileExt
            ? acceptFileType(fileConfig?.user_banner?.fileExt)
            : undefined
        }
      >
        <div className={styles['uploader-content']}>
          <div className={styles['banner-container']}>
            <LoadImg url={initBannerSrc} />
          </div>

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
        dialog_key={'banner_cropDialog'}
        dialogWidth={900}
        corpSetting={{
          aspect: 3,
          cropShape: 'rect',
          objectFit: 'horizontal-cover',
        }}
      />
    </>
  );
};

export default Banner;
