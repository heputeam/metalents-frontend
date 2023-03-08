import { IconButton, Typography } from '@mui/material';
import { FC, useState, useRef, useEffect } from 'react';
import styles from './index.less';
import PreviousSVG from '@/assets/imgs/swiper/previous.svg';
import NextSVG from '@/assets/imgs/swiper/next.svg';
import PlusSVG from '@/assets/imgs/swiper/plus.svg';
import RemoveSVG from '@/assets/imgs/swiper/remove.svg';
import FilledPlusSVG from '@/assets/imgs/swiper/filledPlus.svg';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react/swiper-react';
import { FreeMode, Navigation, Thumbs } from 'swiper';
import type { Swiper as TSwiper } from 'swiper';
import classNames from 'classnames';
import Uploader, {
  FileWithFid,
  IFileWithFid,
  IUploaderError,
} from '@/components/Uploader';
import Toast from '@/components/Toast';
import Loading from '../Loading';
import { IFileWithStatus } from '@/hooks/useSwiperContent';
import { ReactComponent as PlaySVG } from './assets/play.svg';
import RetrySVG from '@/assets/imgs/swiper/retry.svg';
import { Errors } from '@/service/errors';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export type IMediaSwiperProps = {
  canUpload?: boolean;
  canDelete?: boolean;
  contentList: IFileWithStatus[];
  countLimit?: number;
  limitSize?: number;
  beforeUpload?: (file: FileWithFid) => void;
  onUploadSuccess?: (res: IFileWithFid) => void;
  onDelete?: (fileList: IFileWithStatus[], target?: IFileWithStatus) => void;
  onError?: (error: IUploaderError[], file?: FileWithFid) => void;
  onRetry?: (file: IFileWithStatus) => void;
  size?: 'large' | 'medium';
  accept?: string[];
  labelText?: string;
};

export type IMediaItemProps = {
  item: IFileWithStatus;
  index: number;
  ready: boolean;
};

export type IVideoControlProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
  index: number;
  paused: boolean;
  setPaused: (paused: boolean) => void;
};

const SwiperControl = ({ srcListLength }: { srcListLength: number }) => {
  const swiper = useSwiper();

  return (
    <>
      <IconButton
        className={classNames(
          styles['previous-btn'],
          swiper.activeIndex === 0 && styles['btn-hiden'],
        )}
        size="small"
        sx={{
          display: swiper.activeIndex > 0 ? 'inline-flex' : 'none',
        }}
      >
        <img src={PreviousSVG} alt="previous" />
      </IconButton>

      <IconButton
        className={classNames(
          styles['next-btn'],
          swiper.activeIndex === srcListLength - 1 && styles['btn-hiden'],
        )}
        size="small"
        sx={{
          display:
            swiper.activeIndex < srcListLength - 1 ? 'inline-flex' : 'none',
        }}
      >
        <img src={NextSVG} alt="next" />
      </IconButton>
    </>
  );
};

const VideoControl: React.FC<IVideoControlProps> = ({
  videoRef,
  index,
  paused,
  setPaused,
}) => {
  const [videoDom, setVideoDom] = useState<HTMLVideoElement | null>(
    videoRef.current,
  );

  useEffect(() => {
    setVideoDom(videoRef.current);
  }, [videoRef]);

  const handlePlay = () => {
    if (videoDom) {
      // videoDom.currentTime = 0;
      videoDom.paused ? videoDom.play() : videoDom.pause();
      setPaused(videoDom.paused);
    }
  };
  useEffect(() => {
    if (videoDom && paused) {
      videoDom.pause();
      setPaused(true);
    }
  }, [index, videoDom, paused]);

  return (
    <div className={styles['video-play']}>
      <IconButton
        onClick={(ev) => {
          ev.stopPropagation();
          handlePlay();
        }}
      >
        {paused ? <PlaySVG /> : <></>}
      </IconButton>
    </div>
  );
};

export const VideoItem: React.FC<IMediaItemProps> = ({
  item,
  index,
  ready,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [paused, setPaused] = useState(true);

  const swiper = useSwiper();

  swiper.on('slideChange', () => {
    videoRef.current?.pause();
    setPaused(true);
  });
  return (
    <div className={styles['video-item']}>
      {ready && paused && (
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
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        ref={videoRef}
        controls={ready && !paused}
        onEnded={() => {
          setPaused(true);
        }}
        // TODO: 在缩略图中使用同一个初始的随机帧
        // onLoadedMetadata={(arg) => {
        //   const target = arg.currentTarget;
        //   if (target) {
        //     // 随机帧数
        //     target.currentTime = Math.random() * (target.duration || 0);
        //   }
        // }}
      >
        <source src={item.fileUrl} type={item.fileType} />
        Sorry, your browser doesn't support embedded videos.
      </video>
    </div>
  );
};

const MediaSwiper: FC<IMediaSwiperProps> = ({
  canUpload = true,
  canDelete = true,
  contentList,
  countLimit,
  limitSize = 15,
  beforeUpload,
  onUploadSuccess,
  onDelete,
  onError,
  onRetry,
  size = 'large',
  accept,
  labelText,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<TSwiper | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const srcListLength = contentList.length;

  const SpaceBetweenThumb = 28;
  const LargeThumbWidth = 98;
  const HorizontalPendding = 8;

  const handleBefore = (filelist: FileWithFid[]) => {
    return new Promise<FileWithFid[]>((resolve) => {
      if (filelist.length > 0) {
        beforeUpload?.(filelist[0]);

        resolve([filelist[0]]);
      }
    });
  };

  const handleError = (errors: IUploaderError[], file?: FileWithFid): void => {
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

  const getSwiperWidth = (): number => {
    switch (size) {
      case 'large':
        if (canUpload) {
          return 507;
        } else {
          if (srcListLength < 6) {
            return (
              srcListLength * (LargeThumbWidth + SpaceBetweenThumb) -
              SpaceBetweenThumb +
              HorizontalPendding
            );
          } else {
            return (
              6 * (LargeThumbWidth + SpaceBetweenThumb) -
              SpaceBetweenThumb +
              HorizontalPendding
            );
          }
        }

      case 'medium':
        if (srcListLength < 5) {
          return srcListLength * 97 + 8;
        } else {
          return 504;
        }

      default:
        return 504;
    }
  };

  const getSlidePerView = () => {
    switch (size) {
      case 'large':
        if (canUpload) {
          return 4;
        } else if (srcListLength <= 5) {
          return srcListLength;
        } else {
          return 6;
        }

      case 'medium':
        if (srcListLength <= 5) {
          return srcListLength;
        } else {
          return 5;
        }
      default:
        return 4;
    }
  };

  return (
    <>
      {canUpload && (!srcListLength || srcListLength === 1) && (
        <div
          className={classNames(
            styles['empty-upload-block'],
            size === 'large' && styles['large-swiper'],
            size === 'medium' && styles['medium-swiper'],
          )}
          style={{ display: srcListLength === 1 ? 'none' : 'flex' }}
        >
          <Uploader
            icon={null}
            limitSize={limitSize}
            maxCount={countLimit}
            onSuccess={(res) => {
              onUploadSuccess?.(res);
            }}
            onBefore={handleBefore}
            accept={accept}
            // accept={['image/jpeg', 'image/png', 'video/mp4']}
            onError={handleError}
          >
            <IconButton classes={{ root: styles['empty-upload-btn'] }}>
              <Typography
                variant="body1"
                className={styles['empty-label-1']}
              >{`You haven't added your portfolio yet`}</Typography>

              <Typography variant="body1" className={styles['empty-label-2']}>
                {labelText}
              </Typography>

              <img src={FilledPlusSVG} alt="upload" />
            </IconButton>
          </Uploader>
        </div>
      )}

      {srcListLength >= 1 && (
        <div
          className={classNames(
            styles['swiper-block'],
            // size === 'large' && styles['large-swiper'],
            size === 'large'
              ? canUpload
                ? styles['large-swiper']
                : styles['centered-large-swiper']
              : undefined,
            size === 'medium' && styles['medium-swiper'],
          )}
        >
          {/* 主swiper */}
          <Swiper
            spaceBetween={10}
            thumbs={{
              swiper: thumbsSwiper,
            }}
            navigation={{
              prevEl: `.${styles['previous-btn']}`,
              nextEl: `.${styles['next-btn']}`,
            }}
            modules={[Navigation, Thumbs]}
            className={classNames(styles['main-swiper'], styles['swiper'])}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.activeIndex);
            }}
          >
            {thumbsSwiper && (
              <Typography
                classes={{ root: styles['swiper-counter'] }}
                variant="body2"
              >{`${(activeIndex || 0) + 1}/${srcListLength}`}</Typography>
            )}

            <SwiperControl srcListLength={srcListLength} />

            {contentList.map((content, index) => {
              return (
                <SwiperSlide
                  className={styles['swiper-slide']}
                  key={`${content.fid}_${index}`}
                >
                  {content.status !== 'success' && (
                    <div className={styles['loading-box-main']}>
                      {content.status === 'uploading' && (
                        <Loading
                          className={styles['loading-main']}
                          color="#fff"
                        />
                      )}
                    </div>
                  )}

                  {content.fileType.includes('image/') && (
                    <PhotoProvider maskClosable>
                      <PhotoView
                        src={content.fileThumbnailUrl || content.fileUrl}
                      >
                        <img
                          src={content.fileThumbnailUrl || content.fileUrl}
                        />
                      </PhotoView>
                    </PhotoProvider>
                  )}

                  {content.fileType === 'video/mp4' && (
                    <VideoItem
                      item={content}
                      index={index}
                      ready={content.status === 'success'}
                    />
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* 缩略图swiper */}
          <div className={styles['thumb-swiper-box']}>
            {canUpload && countLimit && (
              <div
                className={classNames(
                  styles['upload-block'],
                  srcListLength >= countLimit &&
                    styles['upload-block-disabled'],
                )}
              >
                <Uploader
                  enable={srcListLength < countLimit}
                  icon={null}
                  limitSize={limitSize}
                  maxCount={countLimit}
                  onBefore={handleBefore}
                  onSuccess={(res) => {
                    onUploadSuccess?.(res);
                  }}
                  onError={handleError}
                  accept={accept}
                  // accept={['image/jpeg', 'image/png', 'video/mp4']}
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
                      <Typography variant="caption">{`Max ${countLimit}, < ${limitSize}MB`}</Typography>
                    ) : (
                      <Typography variant="caption">{`Max ${countLimit} files`}</Typography>
                    )}
                  </IconButton>
                </Uploader>
              </div>
            )}

            <Swiper
              style={{
                width: getSwiperWidth(),
                left: size === 'medium' && srcListLength === 1 ? 12 : 0,
              }}
              onSwiper={setThumbsSwiper}
              spaceBetween={SpaceBetweenThumb}
              slidesPerView={getSlidePerView()}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className={classNames(styles['swiper'], styles['thumb-swiper'])}
            >
              {contentList.map((content, index) => (
                <SwiperSlide
                  className={styles['swiper-slide']}
                  key={`${content.fid}_${index}}`}
                >
                  {content.status === 'uploading' && (
                    <div className={styles['loading-box-thumb']}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        Uploading...
                      </Typography>
                      <Loading
                        className={styles['loading-thumb']}
                        color="#fff"
                      />
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

                  {content.fileType.includes('image/') && (
                    <img src={content.fileThumbnailUrl || content.fileUrl} />
                  )}

                  {content.fileType === 'video/mp4' && (
                    <div className={styles['slide-video-content']}>
                      <video>
                        <source
                          src={content.fileThumbnailUrl || content.fileUrl}
                        />
                      </video>

                      {content.status === 'success' && <PlaySVG />}
                    </div>
                  )}

                  {canDelete && content.status !== 'uploading' && (
                    <IconButton
                      classes={{
                        root: styles['remove-btn'],
                      }}
                      size="small"
                      onClick={() => {
                        const list = contentList.filter(
                          (_, _index) => _index != index,
                        );

                        onDelete?.(list, content);

                        if (!list.length) {
                          setThumbsSwiper(null);
                        }
                      }}
                    >
                      <img src={RemoveSVG} alt="remove" />
                    </IconButton>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaSwiper;
