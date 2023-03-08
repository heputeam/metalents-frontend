import React, { useEffect, useMemo, useRef, useState } from 'react';

import { IFile } from '@/types';
import LoadImg from '@/components/LoadImg';
import styles from './index.less';

import { ReactComponent as PlaySVG } from '../../assets/play.svg';
import { ReactComponent as PauseSVG } from '../../assets/pause.svg';
import { IconButton } from '@mui/material';
import { useSwiper } from 'swiper/react/swiper-react';
export type IMediaItemProps = {
  item: IFile;
  index: number;
};
export type IVideoControlProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
  index: number;
  paused: boolean;
  setPaused: (paused: boolean) => void;
};
const VideoControl: React.FC<IVideoControlProps> = ({
  videoRef,
  index,
  paused,
  setPaused,
}) => {
  const handlePlay = () => {
    const videoDom = videoRef.current;
    if (videoDom) {
      // videoDom.currentTime = 0;
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
        // className={`animate__animated ${
        //   paused ? ' animate__fadeIn' : ' animate__rotateOut'
        // }`}
        onClick={(ev) => {
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
      <VideoControl
        videoRef={videoRef}
        index={index}
        paused={paused}
        setPaused={setPaused}
      />
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
        <source src={item.fileUrl} type={item.fileType} />
        Sorry, your browser doesn't support embedded videos.
      </video>
    </div>
  );
};
const MediaItem: React.FC<IMediaItemProps> = ({ item, index }) => {
  // 图片 & 视频 需要显示不同的 Controller
  // if (item.fileType.search('image/') > -1) {}
  // if (item.fileType.search('video/') > -1) {}
  const isVideo = item?.fileType.search('video/') > -1;
  const url = item.fileThumbnailUrl || item.fileUrl || '';
  if (isVideo && url) {
    return (
      <div className={styles['swiper-media-item']}>
        <VideoItem item={item} index={index} />
      </div>
    );
  }
  return (
    <div className={styles['swiper-media-item']}>
      <LoadImg url={url} />
    </div>
  );
};

export default MediaItem;
