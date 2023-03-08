import React from 'react';
import { Box } from '@mui/material';
import styles from './index.less';
import moment from 'moment';

export type ITextMessageProps = {
  messageItem: object;
};

const TextMessage: React.FC<ITextMessageProps> = ({ messageItem = {} }) => {
  const { content, senderUserId, targetId, sentTime } = messageItem as any;
  const isMy: boolean = senderUserId !== targetId;
  const message: string = content?.content?.toString() ?? '';
  const time: string = moment(sentTime).format('HH:mm');
  return (
    <Box className={styles[isMy ? 'my-text-message' : 'notmy-text-message']}>
      <div className={styles['text']}>{message}</div>
      <div className={styles['time']}>{time}</div>
    </Box>
  );
};

export default TextMessage;
