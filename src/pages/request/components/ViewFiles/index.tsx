import { IFile } from '@/types';
import React from 'react';
import styles from './index.less';
import DocSVG from '@/assets/imgs/request/doc.svg';
import Mp3SVG from '@/assets/imgs/request/mp3.svg';
import PlaySVG from '@/assets/imgs/request/play.svg';
import { useDispatch } from 'umi';

export interface IViewFiles {
  posts: IFile[];
  disabledPreview?: boolean;
  className?: string;
}

const ViewFiles: React.FC<IViewFiles> = ({
  posts,
  disabledPreview,
  className,
}) => {
  const dispatch = useDispatch();

  const handlePreview = (index: number) => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'previewDialog',
        previewIndex: index,
        posts: posts,
      },
    });
  };

  return (
    <div className={`${styles['portfolio']} ${className}`}>
      {posts?.map((item, index) => {
        if (item?.fileType?.includes('audio/mpeg')) {
          return (
            <div
              className={`${styles['file-item']} ${styles['active']}`}
              key={item?.fileName}
              onClick={() => !disabledPreview && handlePreview(index)}
            >
              <img src={Mp3SVG} alt="" />
              <span>{`${item?.fileName?.slice(
                0,
                5,
              )}...${item?.fileName?.substring(
                item?.fileName?.lastIndexOf('.') + 1,
              )}`}</span>
            </div>
          );
        }

        if (item?.fileType?.includes('image/')) {
          return (
            <div
              className={`${styles['img-item']} ${styles['active']}`}
              key={item?.fileName}
              onClick={() => !disabledPreview && handlePreview(index)}
            >
              <img src={item?.fileUrl} alt="" />
            </div>
          );
        }

        if (
          item?.fileType?.includes('audio/mp4') ||
          item?.fileType.includes('video/mp4')
        ) {
          return (
            <div
              className={`${styles['vidio-item']} ${styles['active']}`}
              key={item?.fileName}
              onClick={() => !disabledPreview && handlePreview(index)}
            >
              <video width="100%" height="100%">
                <source src={item?.fileUrl} type="video/mp4" />
              </video>
              <img src={PlaySVG} alt="" className={styles['play-icon']} />
            </div>
          );
        }
        return (
          <div
            className={`${styles['file-item']} ${styles['active']}`}
            key={item?.fileName}
            onClick={() => !disabledPreview && handlePreview(index)}
          >
            <img src={DocSVG} alt="" />
            <span>{`${item?.fileName?.slice(
              0,
              5,
            )}...${item?.fileName?.substring(
              item?.fileName?.lastIndexOf('.') + 1,
            )}`}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ViewFiles;
