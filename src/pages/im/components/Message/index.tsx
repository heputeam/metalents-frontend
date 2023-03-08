import React from 'react';
import ImageMessage from '../ImageMessage';
import FileMessage from '../FileMessage';
import TextMessage from '../TextMessage';
import { IMAGE_FILES_MIMES } from '@/components/Uploader/mimeTypes';

export type IMessageProps = {
  messageItem: object;
};

const Message: React.FC<IMessageProps> = ({ messageItem = {} }) => {
  const { messageType, content } = messageItem as any;
  const { type } = content;
  // console.log(content, 'content');
  // console.log(type, 'type');
  // console.log(['RC:FileMsg'].includes(messageType));
  return (
    <>
      {(() => {
        if (
          ['RC:ImgMsg'].includes(messageType) ||
          (['RC:FileMsg'].includes(messageType) &&
            [...IMAGE_FILES_MIMES].includes(type))
        ) {
          return <ImageMessage messageItem={messageItem ?? {}} />;
        } else if (['RC:FileMsg'].includes(messageType)) {
          return <FileMessage messageItem={messageItem ?? {}} />;
        } else {
          return <TextMessage messageItem={messageItem ?? {}} />;
        }
      })()}
    </>
  );
};

export default Message;
