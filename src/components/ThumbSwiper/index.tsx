import { IconButton, Typography } from '@mui/material';
import { FC, memo, useEffect, useRef, useState } from 'react';
import styles from './index.less';
import PlusSVG from '@/assets/imgs/swiper/plus.svg';
import RemoveSVG from '@/assets/imgs/swiper/remove.svg';
import { ReactComponent as PlaySVG } from '@/assets/imgs/swiper/play.svg';
import { ReactComponent as PauseSVG } from '@/assets/imgs/swiper/pause.svg';
import { ReactComponent as DocSVG } from '@/assets/imgs/swiper/doc.svg';
import { ReactComponent as AudioSVG } from '@/assets/imgs/swiper/audio.svg';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react/swiper-react';
import { FreeMode, Navigation, Thumbs } from 'swiper';
import classNames from 'classnames';
import Uploader, {
  FileWithFid,
  IFileWithFid,
  IUploaderError,
} from '@/components/Uploader';
import Loading from '../Loading';
import { IFileWithStatus } from '@/hooks/useSwiperContent';
import Toast from '../Toast';
import RetrySVG from '@/assets/imgs/swiper/retry.svg';
import { Errors } from '@/service/errors';

export type IMediaItemProps = {
  item: IFileWithStatus;
  index: number;
};

export type IVideoControlProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
  index: number;
  paused: boolean;
  setPaused: (paused: boolean) => void;
};

export type IThumbSwiperProps = {
  canUpload?: boolean;
  canDelete?: boolean;
  contentList: IFileWithStatus[];
  limitSize?: number;
  countLimit?: number;
  beforeUpload?: (file: FileWithFid) => void;
  onUploadSuccess?: (res: IFileWithFid) => void;
  onDelete?: (res: IFileWithStatus[]) => void;
  accept?: string[];
  slidesPerView?: number;
  buttonLabel?: string;
  onError?: (error: IUploaderError[], file?: FileWithFid) => void;
  onRetry?: (file: IFileWithStatus) => void;
  spaceBetween?: number;
};

type IFileItemProps = {
  content: IFileWithStatus;
  index: number;
};

const VideoControl: React.FC<IVideoControlProps> = ({
  videoRef,
  index,
  paused,
  setPaused,
}) => {
  // const videoDom = videoRef.current; ???

  const handlePlay = () => {
    const videoDom = videoRef.current;

    if (videoDom) {
      videoDom.paused ? videoDom.play() : videoDom.pause();
      setPaused(videoDom.paused);
    }
  };

  useEffect(() => {
    const videoDom = videoRef.current;

    if (videoDom && paused) {
      videoDom.pause();
      setPaused(true);
    }
  }, [index]);

  return (
    <div className={styles['video-play']}>
      <IconButton
        onClick={(ev) => {
          console.log('>>> !!!!!!!!!');
          ev.stopPropagation();
          handlePlay();
        }}
      >
        {paused ? <PlaySVG /> : <PauseSVG />}
      </IconButton>
    </div>
  );
};

const VideoItem: React.FC<IMediaItemProps> = ({ item, index }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [paused, setPaused] = useState(true);

  const swiper = useSwiper();

  swiper.on('slideChange', () => {
    videoRef.current?.pause();
    setPaused(true);
  });

  return (
    <div className={styles['video-item']}>
      {item.status === 'success' && (
        <VideoControl
          videoRef={videoRef}
          index={index}
          paused={paused}
          setPaused={setPaused}
        />
      )}
      {/*固定缩略图： poster={item?.fileThumbnailUrl} */}
      <video
        preload="metadata"
        ref={videoRef}
        // controls
        onEnded={() => {
          setPaused(true);
        }}
        // onLoadedMetadata={(arg) => {
        //   const target = arg.currentTarget;
        //   if (target) {
        //     // 随机帧数
        //     target.currentTime = Math.random() * (target.duration || 0);
        //   }
        // }}
      >
        <source
          src={item.fileThumbnailUrl || item.fileUrl}
          type={item.fileType}
        />
        Sorry, your browser doesn't support embedded videos.
      </video>
    </div>
  );
};

const FileItem: FC<IFileItemProps> = ({ content, index }) => {
  if (content.fileType.includes('image/')) {
    return <img src={content.fileThumbnailUrl || content.fileUrl} />;
  }

  if (content.fileType.includes('video/')) {
    return <VideoItem item={content} index={index} />;
  }

  const fileFullName = content.fileName;

  let nameOnShow = '';

  if (fileFullName.includes('.')) {
    const wordArr = fileFullName.split('.');
    const extension = wordArr.pop();
    const fileName = wordArr.join('.');

    const briefFileName = fileName.slice(0, 5);

    nameOnShow = `${briefFileName}...${extension}`;
  } else {
    nameOnShow = `${fileFullName.slice(0, 5)}...`;
  }

  if (content.fileType.includes('audio/')) {
    return (
      <div className={styles['file-item']}>
        <AudioSVG />
        <Typography variant="caption">{`${nameOnShow}`}</Typography>
      </div>
    );
  }

  return (
    <div className={styles['file-item']}>
      <DocSVG />
      <Typography variant="caption">{`${nameOnShow}`}</Typography>
    </div>
  );
};

const ThumbSwiper: FC<IThumbSwiperProps> = memo(
  ({
    canUpload = true,
    canDelete = true,
    contentList,
    limitSize = 15,
    countLimit = 9,
    beforeUpload,
    onUploadSuccess,
    onDelete,
    accept,
    slidesPerView = 6,
    buttonLabel,
    onError,
    onRetry,
    spaceBetween = 28,
  }) => {
    console.log('>>> ThumbSwiper');

    const [srcList, setSrcList] = useState<IFileWithStatus[]>([]);
    const srcListLength = srcList.length;

    const handleBefore = (filelist: FileWithFid[]) => {
      return new Promise<FileWithFid[]>((resolve) => {
        if (filelist.length > 0) {
          beforeUpload?.(filelist[0]);

          resolve([filelist[0]]);
        }
      });
    };

    const handleError = (
      errors: IUploaderError[],
      file?: FileWithFid,
    ): void => {
      console.log('>>> file: ', file);

      console.log('>>> errors: ', errors);
      if (errors.some((err) => err.error === 'LimitError')) {
        Toast.error(`Only size < ${limitSize}MB`);
      }
      if (errors.some((err) => err.error === 'AcceptError')) {
        Toast.error(`Please upload file with specified type`);
      }
      if (errors.some((err) => err.error === 'NetworkError')) {
        Toast.error(Errors['*']);
      }

      onError?.(errors, file);
    };

    const LargeThumbWidth = 98;
    const HorizontalPendding = 8;

    const getSwiperWidth = (): number => {
      if (srcListLength < slidesPerView) {
        return (
          srcListLength * (LargeThumbWidth + spaceBetween) -
          spaceBetween +
          HorizontalPendding
        );
      } else {
        return (
          slidesPerView * (LargeThumbWidth + spaceBetween) -
          spaceBetween +
          HorizontalPendding
        );
      }
    };

    useEffect(() => {
      setSrcList(contentList);
    }, [contentList]);

    return (
      <div className={styles['swiper-block']}>
        {canUpload && (
          <div
            className={classNames(
              styles['upload-block'],
              srcListLength >= countLimit && styles['upload-block-disabled'],
            )}
            style={{ marginRight: spaceBetween }}
          >
            <Uploader
              enable={srcListLength < countLimit}
              icon={null}
              limitSize={limitSize}
              onBefore={handleBefore}
              onSuccess={onUploadSuccess}
              onError={handleError}
              accept={accept}
            >
              <IconButton
                classes={{
                  root: classNames(
                    styles['upload-btn'],
                    srcListLength >= countLimit &&
                      styles['upload-btn-disabled'],
                  ),
                }}
              >
                <img src={PlusSVG} alt="upload" />
                {srcListLength < countLimit ? (
                  <Typography variant="caption">{buttonLabel}</Typography>
                ) : (
                  <Typography variant="caption">{`Max ${countLimit} files`}</Typography>
                )}
              </IconButton>
            </Uploader>
          </div>
        )}

        {/* 缩略图swiper */}
        <Swiper
          style={{
            width: getSwiperWidth(),
            // left: size === 'medium' && srcListLength === 1 ? 12 : 0,
          }}
          spaceBetween={spaceBetween}
          slidesPerView={slidesPerView}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className={classNames(
            styles['thumb-swiper'],
            canUpload && styles['upload-swiper'],
          )}
        >
          {srcList.map((content, index) => (
            <SwiperSlide
              className={styles['swiper-slide']}
              key={`${content.fid}_${index}`}
            >
              {content.status === 'uploading' && (
                <div className={styles['loading-box-thumb']}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Uploading...
                  </Typography>
                  <Loading className={styles['loading-thumb']} color="#fff" />
                </div>
              )}

              {content.status === 'error' && (
                <IconButton
                  className={styles['retry-box-thumb']}
                  onClick={() => {
                    onRetry?.(content);
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Try again
                  </Typography>
                  <img className={styles['retry']} src={RetrySVG} alt="" />
                </IconButton>
              )}

              <FileItem content={content} index={index} />

              {canDelete && content.status !== 'uploading' && (
                <IconButton
                  classes={{ root: styles['remove-btn'] }}
                  size="small"
                  onClick={() => {
                    const list = srcList.filter((_, _index) => {
                      return _index !== index;
                    });

                    onDelete?.(list);
                  }}
                >
                  <img src={RemoveSVG} alt="remove" />
                </IconButton>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  },
);

export default ThumbSwiper;
