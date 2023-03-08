import { IImRoot } from '@/hooks/useIm';
import { Box, Typography } from '@mui/material';
import styles from './index.less';
import Avatar from '@/components/Avatar';
import verifySvg from '../../assets/verify.svg';
import arrowSvg from '../../assets/arrow.svg';
import { getCloumnInfo } from '@/service/im';
import { useRequest } from 'ahooks';
import { IResponse } from '@/service/types';
import { ICloumnInfo } from '@/service/im/type';
import { useEffect } from 'react';
import { IFile } from '@/types';
import moment from 'moment';
import { USER_TYPE } from '@/define';
import { IConfigStateType, useSelector, history } from 'umi';
import { IUserState } from '@/models/user';
import Badge from '@/components/Badge';

export type ConversationItemProps = {
  latestMessageText: string;
  targetId: string;
  unreadMessageCount: number | string;
  senderUserId: number;
  isTop: boolean;
  sentTime: number | string;
  type: number;
  avatar?: IFile;
  id?: number;
  isVerify?: string;
  userName?: string;
  userType?: number;
};

const ConversationList = ({
  conversationList,
  changeConversation,
  conversation,
  deleteTargetConversation,
}: IImRoot) => {
  const { uid } = useSelector<any, IUserState>((state) => state.user);
  const { config } = useSelector<any, IConfigStateType>(
    (state) => state.config,
  );
  let totalUnreadCount: number = 0;
  // console.log(conversationList, 'conversationList+++++++++++++++++++++++');
  const ids: Array<number> = conversationList?.length
    ? conversationList
        ?.filter(
          (v) =>
            Number(v?.latestMessage?.senderUserId) !==
            Number(config?.IM_SYSTEM_ID?.cfgVal),
        )
        ?.map((v) => Number(v.targetId))
    : [];
  const { data: cloumnInfoList, run: getcloumnInfoList } = useRequest<
    IResponse<ICloumnInfo>,
    any
  >((params) => getCloumnInfo(params), {
    manual: true,
  });
  useEffect(() => {
    if (conversationList?.length) {
      getcloumnInfoList({
        ids,
      });
    }
  }, [conversationList?.length]);
  // console.log(cloumnInfoList, 'cloumnInfoList');
  const cloumnInfoListTemp = cloumnInfoList?.data?.list ?? [];
  const conversationListView: ConversationItemProps[] =
    conversationList?.map((i) => {
      // 系统消息type:6
      const isOfficial =
        [6].includes(Number(i.type)) &&
        Number(i?.latestMessage?.senderUserId) ===
          Number(config?.IM_SYSTEM_ID?.cfgVal);
      let cloumnInfoItem = {};
      if (isOfficial) {
        cloumnInfoItem = {
          avatar: { fileUrl: require('../../assets/official.svg') },
          userName: 'Metalents',
          userType: 3,
        };
      } else {
        cloumnInfoListTemp?.map((v) => {
          if (Number(i.targetId) === Number(v.id)) {
            cloumnInfoItem = { ...v };
          }
        });
      }
      totalUnreadCount = Number(
        Number(totalUnreadCount) + (i.unreadMessageCount ?? 0),
      );
      const { messageType, content, senderUserId } = i?.latestMessage as any;
      let latestMessageText: string;
      switch (messageType) {
        case 'RC:ImgMsg':
          latestMessageText = '[image]';
          break;
        case 'RC:FileMsg':
          latestMessageText = '[file]';
          break;
        default:
          latestMessageText = content?.content ?? '';
          break;
      }
      return {
        ...cloumnInfoItem,
        targetId: i.targetId ?? '',
        latestMessageText,
        unreadMessageCount: Number(i.unreadMessageCount ?? 0),
        isTop: i?.isTop ?? false,
        sentTime: moment(i?.latestMessage?.sentTime).format('HH:mm'),
        senderUserId: Number(senderUserId),
        type: i.type,
      };
    }) ?? [];
  // console.log(conversationListView, 'conversationListView');
  return (
    <div className={styles['inbox-container']}>
      <div className={styles['inbox']}>
        <Badge
          content={Number(totalUnreadCount)}
          classes={{ badge: styles['custom-muiBadge-badge'] }}
        >
          Inbox
        </Badge>
      </div>
      <ul className={styles['root']}>
        {[]?.map((item: any) => {
          return (
            <li
              onClick={() => {
                changeConversation({
                  targetId: item.targetId,
                  type: item.type,
                });
                history.replace(`/im?targetId=${item.targetId}`);
              }}
              key={item.targetId}
              className={
                styles[item.targetId === conversation?.targetId ? 'select' : '']
              }
            >
              {/* <a onClick={() => deleteTargetConversation({ targetId: item.targetId, type: item.type })}>delete</a> */}
              {item.isTop && <div className={styles['top']}></div>}
              <div className={styles['item-img-Box']}>
                <Badge content={Number(item.unreadMessageCount)}>
                  <Avatar
                    size={44}
                    src={
                      item?.avatar?.fileUrl || item?.avatar?.fileThumbnailUrl
                    }
                  >
                    {item?.userName?.[0]?.toLocaleUpperCase() || 'U'}
                  </Avatar>
                </Badge>
              </div>
              <Box className={styles['item-info-box']}>
                <div className={styles['item-info-box-inner']}>
                  <Box display={'flex'}>
                    <h2 className={styles['info-title']}>{item.userName}</h2>
                    {['verified'].includes(item?.isVerify as string) && (
                      <img className={styles['isVerify']} src={verifySvg} />
                    )}
                    {[USER_TYPE.Official].includes(
                      item?.userType as number,
                    ) && (
                      <span className={styles['identity-type']}>
                        {USER_TYPE[item?.userType as number]}
                      </span>
                    )}
                  </Box>
                  <Box className={styles['time']}>{item.sentTime}</Box>
                </div>
                <div className={styles['latest-message-text']}>
                  {uid === item.senderUserId && (
                    <img className={styles['arrow']} src={arrowSvg} />
                  )}
                  <span>{`${item.latestMessageText}`}</span>
                </div>
              </Box>
            </li>
          );
        })}
        {conversationListView.length === 0 && (
          <>
            <Typography sx={{ opacity: 0.5, paddingLeft: 24 }}>
              No message now.
            </Typography>
          </>
        )}
      </ul>
    </div>
  );
};

export default ConversationList;
