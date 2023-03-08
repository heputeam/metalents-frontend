import React, { useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { IConfigStateType, useLocation, useSelector, history } from 'umi';
import ConversationList from './components/ConversationList';
import ChatRoom from './components/ChatRoom';
import styles from './index.less';
import { IImState } from '@/models/im';

export type IImProps = {};

const Im: React.FC<IImProps> = ({}) => {
  const {
    query: { targetId },
  } = useLocation() as any;

  useEffect(() => {
    if (targetId) {
      history.replace('/im');
    }
  }, [targetId]);
  const { imRoot } = useSelector<any, IImState>(
    (state: { im: any }) => state.im,
  );
  const { config } = useSelector<any, IConfigStateType>(
    (state) => state.config,
  );
  useEffect(() => {
    if (targetId && imRoot) {
      const isOfficial =
        Number(targetId) === Number(config?.IM_SYSTEM_ID?.cfgVal);
      const type = isOfficial ? 6 : 1;
      imRoot.changeConversation({ targetId, type });
    }
  }, [targetId, imRoot?.im]);
  return (
    <>
      <Container
        className={styles['im-container']}
        maxWidth="lg"
        disableGutters
      >
        <Box className={styles['inner-container']}>
          <ConversationList {...imRoot} />
          <ChatRoom {...imRoot} />
        </Box>
      </Container>
    </>
  );
};
export default Im;
