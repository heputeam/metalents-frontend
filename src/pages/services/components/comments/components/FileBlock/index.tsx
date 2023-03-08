import React, { useEffect, useState } from 'react';
import { Skeleton, SxProps, Typography } from '@mui/material';
import styles from './index.less';
import {
  IMAGE_FILES_MIMES,
  VIDEO_FILES_MIMES,
  AUDIO_FILES_MIMES,
} from '@/components/Uploader/mimeTypes';
import { ReactComponent as PlaySVG } from '@/assets/imgs/swiper/play.svg';
import { ReactComponent as DocSVG } from '@/assets/imgs/swiper/doc.svg';
import { ReactComponent as AudioSVG } from '@/assets/imgs/swiper/audio.svg';

export type IFileBlockProps = {
  loading?: boolean;
  fileUrl?: string;
  fileType: string;
  fileName?: string;
  width?: number;
  height?: number;
  onImgError?: () => void;
  onImgSuccess?: () => void;
  skeletonSx?: SxProps;
  fileNameSx?: SxProps;
  blockStyle?: any;
};

const getBriefFileName = (fileFullName: string) => {
  if (fileFullName.includes('.')) {
    const wordArr = fileFullName.split('.');
    const extension = wordArr.pop();
    const fileName = wordArr.join('.');

    const briefFileName = fileName.slice(0, 5);

    return `${briefFileName}...${extension}`;
  } else {
    return `${fileFullName.slice(0, 5)}...`;
  }
};

const FileBlock: React.FC<IFileBlockProps> = ({
  loading,
  fileUrl,
  fileType,
  fileName,
  width,
  height,
  onImgError,
  onImgSuccess,
  skeletonSx,
  fileNameSx,
  blockStyle,
}) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!fileUrl) {
      return;
    }

    if (IMAGE_FILES_MIMES.includes(fileType)) {
      const _img = new Image(width, height);

      _img.src = fileUrl;
      _img.onload = () => {
        setSrc(fileUrl);
        onImgSuccess?.();
      };
      _img.onerror = () => {
        onImgError?.();
      };
    } else {
      setSrc(fileUrl);
    }
  }, [fileUrl]);

  if (!src || loading) {
    return (
      <Skeleton
        animation="wave"
        variant="rectangular"
        width={width || '100%'}
        height={height || '100%'}
        sx={skeletonSx}
      />
    );
  }

  switch (true) {
    case IMAGE_FILES_MIMES.includes(fileType):
      return (
        <img className={styles['img-file']} src={src} style={blockStyle} />
      );

    case VIDEO_FILES_MIMES.includes(fileType):
      return (
        <div
          className={styles['block']}
          style={{
            width,
            height,
            ...blockStyle,
          }}
        >
          <PlaySVG className={styles['play-svg']} />
          <video
            className={styles['video-file']}
            preload="metadata"
            style={blockStyle}
          >
            <source src={fileUrl} type={fileType} />
          </video>
        </div>
      );

    case AUDIO_FILES_MIMES.includes(fileType):
      return (
        <div
          className={styles['block']}
          style={{
            width,
            height,
            ...blockStyle,
          }}
        >
          <AudioSVG />
          {typeof fileName === 'string' && (
            <Typography variant="caption" sx={{ ...fileNameSx }}>
              {getBriefFileName(fileName)}
            </Typography>
          )}
        </div>
      );

    default:
      return (
        <div
          className={styles['block']}
          style={{
            width,
            height,
            ...blockStyle,
          }}
        >
          <DocSVG />
          {typeof fileName === 'string' && (
            <Typography
              variant="caption"
              sx={{ fontSize: '12px', ...fileNameSx }}
            >
              {getBriefFileName(fileName)}
            </Typography>
          )}
        </div>
      );
  }
};

export default FileBlock;
