import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import styles from './index.less';
import docSvg from '@/assets/imgs/swiper/doc.svg';
import audioSvg from '@/assets/imgs/swiper/audio.svg';
import { getfilesize } from '@/utils';
import { VIDEO_FILES_MIMES } from '@/components/Uploader/mimeTypes';
import moment from 'moment';

type IFileMessageProps = {
  messageItem: object;
};

const FileMessage: React.FC<IFileMessageProps> = ({ messageItem = {} }) => {
  const { content, senderUserId, targetId, sentTime } = messageItem as any;
  const isMy: boolean = senderUserId !== targetId;
  const fileNameRef = useRef(null);
  const [isOmit, setIsOmit] = useState<boolean>(false);
  const { type, fileUrl, name, size } = content;
  const isVideo = [...VIDEO_FILES_MIMES].includes(type);
  const fileSvg = isVideo ? audioSvg : docSvg;
  const fileBase =
    name && isOmit && name.substring(0, name.lastIndexOf('.') + 7);
  const fileExtension =
    name && isOmit && name.substring(name.lastIndexOf('.') - 7);
  const time: string = moment(sentTime).format('HH:mm');

  useEffect(() => {
    if (fileNameRef.current) {
      const dom = fileNameRef.current as HTMLElement;
      dom.scrollWidth > dom.offsetWidth && setIsOmit(true);
    }
  });

  return (
    <Box
      className={styles[isMy ? 'my-file-message' : 'notmy-file-message']}
      onClick={() => {
        window.location.href = fileUrl ?? '';
      }}
    >
      <img className={styles['doc-icon']} alt="doc" src={fileSvg} />
      <div className={styles['doc-info']}>
        <div className={styles['name']} ref={fileNameRef}>
          {!isOmit && (name.toString() ?? '')}
          {isOmit && (
            <div className={styles['omitName']}>
              <span className={styles['fileBase']}>{fileBase}</span>
              <span className={styles['fileExtension']}>{fileExtension}</span>
            </div>
          )}
        </div>
        <div className={styles['other-info']}>
          <span className={styles['size']}>{`${getfilesize(
            Number(size ?? 0),
          )}`}</span>
          <span className={styles['time']}>{time}</span>
        </div>
      </div>
    </Box>
  );
};

export default FileMessage;
