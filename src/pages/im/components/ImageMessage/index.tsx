import React from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import styles from './index.less';
import moment from 'moment';
import { Box } from '@mui/material';

type IImageMessageProps = {
  messageItem: object;
};

const ImageMessage: React.FC<IImageMessageProps> = ({ messageItem = {} }) => {
  const { content, senderUserId, targetId, sentTime } = messageItem as any;
  const isMy: boolean = senderUserId !== targetId;
  const imageUrl: string =
    (content?.imageUri?.toString() || content?.fileUrl?.toString()) ?? '';
  const time: string = moment(sentTime).format('HH:mm');
  return (
    <Box className={styles[isMy ? 'my-image-box' : 'notmy-image-box']}>
      <PhotoProvider>
        <PhotoView src={imageUrl}>
          <img className={styles['image-message']} src={imageUrl} alt="image" />
        </PhotoView>
      </PhotoProvider>
      <Box className={styles['time']}>{time}</Box>
    </Box>
  );
};

export default ImageMessage;
