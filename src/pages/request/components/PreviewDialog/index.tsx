import Dialog from '@/components/Dialog';
import React from 'react';
import { IDialogState, useDispatch, useSelector } from 'umi';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import styles from './index.less';

import PreviousSVG from '@/assets/imgs/request/previous.svg';
import NextSVG from '@/assets/imgs/request/next.svg';
import DownloadSVG from '@/assets/imgs/request/download.svg';
import DocSVG from '@/assets/imgs/request/doc.svg';
import Mp3SVG from '@/assets/imgs/request/mp3.svg';
import { IconButton, Link } from '@mui/material';
import { Navigation } from 'swiper';

import { IFile } from '@/types';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { VideoItem } from '@/components/MediaSwiper';
interface IPreviewProps {
  previewIndex: number;
  posts: IFile[];
  disableDownload?: boolean;
}
interface IPreviewDialogState {
  visible: boolean;
  previewIndex: number;
  posts: IFile[];
  disableDownload?: boolean;
}

const dialog_key = 'previewDialog'; // dialog 唯一值
export type IPreviewDiialogProps = {};

const PreviewDialog: React.FC<IPreviewDiialogProps> = ({}) => {
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: IPreviewDialogState = useSelector<
    any,
    IDialogState & IPreviewProps
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[dialog_key],
  }));
  // 关闭 dialog
  const handleClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };

  return (
    <Dialog
      visible={dialogState.visible}
      title="View the files"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['preview-content']}>
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: `.${styles['previous-btn']}`,
            nextEl: `.${styles['next-btn']}`,
          }}
          loop={true}
          initialSlide={dialogState?.previewIndex}
          spaceBetween={30}
          className={`${styles['preview-swiper']} ${styles['swiper']}`}
        >
          {dialogState?.posts?.map((item, index) => {
            if (
              item?.fileType?.includes('audio/mp4') ||
              item?.fileType?.includes('video/mp4')
            ) {
              return (
                <SwiperSlide
                  className={styles['swiper-slide']}
                  key={item?.fileName}
                >
                  <div className={styles['slider-img-box']}>
                    <VideoItem item={item} index={index} ready={true} />
                  </div>
                  {dialogState.disableDownload ? (
                    <div className={styles['file-name']}>
                      <span>{item?.fileName}</span>
                    </div>
                  ) : (
                    <Link
                      href={item?.fileUrl}
                      target="_blank"
                      download={item?.fileUrl}
                      className={styles['download']}
                    >
                      <div className={styles['down-box']}>
                        <img src={DownloadSVG} />
                        <span>{item?.fileName}</span>
                      </div>
                    </Link>
                  )}
                </SwiperSlide>
              );
            }
            if (item?.fileType?.includes('image/')) {
              return (
                <SwiperSlide
                  className={styles['swiper-slide']}
                  key={item?.fileName}
                >
                  <div className={styles['slider-img-box']}>
                    <PhotoProvider maskClosable>
                      <PhotoView src={item?.fileUrl}>
                        <img src={item?.fileUrl} alt="" />
                      </PhotoView>
                    </PhotoProvider>
                  </div>
                  {dialogState.disableDownload ? (
                    <div className={styles['file-name']}>
                      <span>{item?.fileName}</span>
                    </div>
                  ) : (
                    <Link
                      href={item?.fileUrl}
                      target="_blank"
                      className={styles['download']}
                    >
                      <div className={styles['down-box']}>
                        <img src={DownloadSVG} />
                        <span>{item?.fileName}</span>
                      </div>
                    </Link>
                  )}
                </SwiperSlide>
              );
            }

            return (
              <SwiperSlide
                className={styles['swiper-slide']}
                key={item?.fileName}
              >
                <div className={styles['slider-file-box']}>
                  {item?.fileType?.includes('audio/mpeg') ? (
                    <img src={Mp3SVG} alt="" />
                  ) : (
                    <img src={DocSVG} alt="" />
                  )}
                </div>
                {dialogState.disableDownload ? (
                  <div className={styles['file-name']}>
                    <span>{item?.fileName}</span>
                  </div>
                ) : (
                  <Link
                    href={item?.fileUrl}
                    target="_blank"
                    className={styles['download']}
                  >
                    <div className={styles['down-box']}>
                      <img src={DownloadSVG} />
                      <span>{item?.fileName}</span>
                    </div>
                  </Link>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>

        <IconButton size="small" className={styles['previous-btn']}>
          <img src={PreviousSVG} alt="previous" />
        </IconButton>

        <IconButton size="small" className={styles['next-btn']}>
          <img src={NextSVG} alt="next" />
        </IconButton>
      </div>
    </Dialog>
  );
};

export default PreviewDialog;
