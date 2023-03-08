import * as RongIMLib from '@rongcloud/imlib-v4';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'umi';
import { IImState, ImCacheKeys } from '@/models/im';
import moment from 'moment';
import { useGetState } from 'ahooks';
import { useLocation } from 'umi';
// import _ from 'lodash';

let im: RongIMLib.IMClient;
const url = window.location?.host;
const isTest =
  url?.includes('test') || url?.includes('localhost') || url?.includes('192');
// console.log(isTest, 'isTest');
const IM_APP_KEY = isTest ? '82hegw5u8ehcx' : 'e0x9wycfe9x6q';
// console.log(IM_APP_KEY, 'IM_APP_KEY');

export enum LoadingStatus {
  AWAIT = -1,
  LOADING = 0,
  OK = 1,
}

export enum ConversationType {
  PRIVATE = 1,
  SYSTEM = 6,
}

const defaultFetchConversationMessageListOption = {
  // 获取历史消息的时间戳，默认为 0，表示从当前时间获取
  timestamp: 0,
  // 获取条数，有效值 1-20，默认为 20
  count: 20,
};
const showScrollView = (
  options?: boolean | ScrollIntoViewOptions | undefined,
) => {
  document.getElementById('scrollView')?.scrollIntoView(options);
};

export type IImRoot = ReturnType<typeof useImList>;

export const useImList = ({ token }: { token?: string }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState<{ id: string }>();
  const [conversationList, setConversationList] =
    useState<RongIMLib.IAReceivedConversation[]>();
  let [conversation, setConversation, getConversation] =
    useGetState<ReturnType<typeof im.Conversation.get>>();
  let [conversationMessageList, setConversationMessageList] = useState<
    RongIMLib.IAReceivedMessage[]
  >([]);
  const [random, setRandom] = useState(0);
  const [conversationMessageListHasMore, setConversationMessageListHasMore] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<LoadingStatus>(LoadingStatus.AWAIT);
  const fetchConversationList = async (token: string) => {
    try {
      const userInfo = await im.connect({ token });
      // console.log('userInfo---->', userInfo);
      setUser(userInfo);
      const conversations = await im.Conversation.getList({});
      // console.log('conversationList----->', conversations);
      setConversationList(conversations);
      setTimeout(() => setRandom(Math.random()), 100);
    } catch (error: any) {
      const { code } = error;
      if (code === 31004) {
        // token失效
        dispatch({
          type: 'im/queryImtoken',
          payload: {},
        });
      }
      console.log('链接失败: ', error);
    }
  };
  const updateNewMessage = (_message: RongIMLib.IAReceivedMessage) => {
    // 获取最新的coversation
    const conversation = getConversation();
    // console.log(
    //   'update new message->',
    //   _message,
    //   _.cloneDeepWith(conversationMessageList),
    //   conversation
    // );
    if (_message.targetId === conversation?.targetId) {
      setConversationMessageList((list) => {
        return [...list, _message];
      });
      conversation.read();
      setTimeout(() => {
        showScrollView({ behavior: 'smooth', block: 'center' });
      }, 1e3);
    }
    setTimeout(() => setRandom(Math.random()), 100);
  };
  const updateNewConversationList = async (
    _updatedConversationList: RongIMLib.IReceivedUpdateConversation[],
  ) => {
    const preConversationList = await im.Conversation.getList({});
    // console.log(preConversationList, 'preConversationList');
    // console.log(conversationList, 'conversationList');
    // console.log(_updatedConversationList, '_updatedConversationList');
    const latestConversationList = im.Conversation.merge({
      conversationList: preConversationList ?? [],
      updatedConversationList: _updatedConversationList,
    });
    // console.log('latestConversationList----->', latestConversationList);
    setConversationList(latestConversationList);
    token && fetchConversationList(token);
  };
  const init = async () => {
    if (!im) {
      im = RongIMLib.init({ appkey: IM_APP_KEY });
      setTimeout(() => setRandom(Math.random()), 100);
    }
    if (!token) {
      return;
    }
    setLoading(LoadingStatus.LOADING);
    fetchConversationList(token);
    setLoading(LoadingStatus.OK);
    im.watch({
      conversation(event) {
        const updatedConversationList = event.updatedConversationList;
        updateNewConversationList(updatedConversationList);
      },
      message: (event) => {
        const message = event.message;
        updateNewMessage(message);
      },
      status(event) {
        console.log('IM connection status:', event.status);
      },
    });
  };
  const fetchTargetConversationMessageList = async (option?: {
    timestamp: number;
    count: number;
  }) => {
    const mergeOption = option ?? defaultFetchConversationMessageListOption;
    if (!conversation) {
      return console.error('not conversation');
    }
    try {
      setLoading(LoadingStatus.LOADING);
      const result = await conversation.getMessages(mergeOption);
      setLoading(LoadingStatus.OK);
      const list = result.list; // 获取到的消息列表
      const hasMore = result.hasMore; // 是否还有历史消息可获取
      // console.log('获取历史消息成功', list, hasMore);
      // console.log(conversationMessageList, "conversationMessageList++++++++");
      if (mergeOption.timestamp === 0) {
        setConversationMessageList((conversationMessageList = list));
      } else {
        // console.log('conversationMessageList-----------', conversationMessageList);
        setConversationMessageList(
          (conversationMessageList = [...list, ...conversationMessageList]),
        );
      }
      setConversationMessageListHasMore(hasMore);
      // console.log(mergeOption, 'mergeOption');
      mergeOption.timestamp === 0 &&
        setTimeout(() => {
          showScrollView(true);
        }, 1e3);
      setTimeout(() => setRandom(Math.random()), 100);
    } catch (error) {
      // console.log('获取历史消息失败', error);
    }
  };
  const changeConversation = async ({
    targetId,
    type,
  }: {
    targetId: string;
    type: number;
  }) => {
    // console.log('changeConversation--------------', changeConversation);
    const _conversation = im.Conversation.get({
      targetId,
      type,
    });
    setConversation((conversation = _conversation));
    // console.log(_conversation, '_conversation');
    try {
      await _conversation.read();
    } catch (error) {
      console.log('read error::', error);
    }
    token && fetchConversationList(token);
    // console.log('conversation---->', conversation);
  };

  const deleteTargetConversation = ({
    targetId,
    type,
  }: {
    targetId: string;
    type: number;
  }) => {
    const _conversation = im.Conversation.get({
      targetId,
      type,
    });
    _conversation.destory().then(() => {
      // console.log('delete conversation successful');
      changeConversation({
        targetId,
        type,
      });
      setConversation(undefined);
      token && fetchConversationList(token);
    });
  };

  useEffect(() => {
    conversation && fetchTargetConversationMessageList();
    setTimeout(() => setRandom(Math.random()), 100);
  }, [conversation]);

  useEffect(() => {
    init();
  }, [token]);

  const {
    query: { targetId },
  } = useLocation() as any;
  useEffect(() => {
    if (!targetId) {
      setConversation(undefined);
      setConversationMessageList([]);
    }
  }, [targetId]);

  // 过滤掉targetId非数字的数据
  const conversationListTemp = conversationList?.filter(
    (v) => typeof Number(v.targetId) === 'number' && !isNaN(Number(v.targetId)),
  );
  return {
    loading,
    user,
    random,
    conversationList: conversationListTemp,
    im,
    conversation,
    changeConversation,
    conversationMessageListHasMore,
    conversationMessageList,
    fetchTargetConversationMessageList,
    deleteTargetConversation,
  };
};

export const useImAsyncRedux = () => {
  const { imToken: _token } = useSelector<any, IImState>(
    (state: { im: any }) => state.im,
  );
  const token =
    _token ?? JSON.parse(localStorage.getItem(ImCacheKeys.imToken) as string);
  const dispatch = useDispatch();
  const im = useImList({
    token: token || '',
  });
  const { random, user } = im;
  useEffect(() => {
    if (token && user) {
      dispatch({
        type: 'im/saveImRoot',
        payload: {
          imRoot: im,
        },
      });
    }
  }, [random, token]);
  useEffect(() => {
    if (token) {
      dispatch({
        type: 'im/saveImRoot',
        payload: {
          imRoot: null,
        },
      });
    }
  }, [token]);
};

export const useTotalUnreadCount = () => {
  const { imRoot } = useSelector<any, IImState>((state) => state.im);
  let [totalUnreadCount, setTotalUnreadCount] = useState(0);
  useEffect(() => {
    imRoot?.im?.Conversation?.getTotalUnreadCount(false, [
      RongIMLib.CONVERSATION_TYPE.PRIVATE,
      RongIMLib.CONVERSATION_TYPE.SYSTEM,
    ]).then((totalUnreadCount) => {
      setTotalUnreadCount(totalUnreadCount);
    });
  });
  return totalUnreadCount;
};

export const useScroll = (scrollRef: any) => {
  const { imRoot } = useSelector<any, IImState>((state) => state.im);
  useEffect(() => {
    if (scrollRef.current) {
      const scrollDom = scrollRef.current as HTMLElement;
      const handleScroll = (e: any) => {
        // console.log(e.target.scrollTop);
        // console.log(imRoot?.conversationMessageListHasMore, 'conversationMessageListHasMore');
        if (e.target.scrollTop < 10 && imRoot?.conversationMessageListHasMore) {
          // console.log('滚到顶了,该加载消息了');
          const timestamp = imRoot?.conversationMessageList?.[0]?.sentTime;
          imRoot?.fetchTargetConversationMessageList({
            timestamp,
            count: 20,
          });
        }
      };
      scrollDom?.addEventListener('scroll', handleScroll);
      return () => {
        scrollDom!.removeEventListener('scroll', handleScroll);
      };
    }
  });
};

interface newArrItem {
  id: number;
  sentTime: string;
  sentTimeFormat: string;
  subList: RongIMLib.IAReceivedMessage[];
}
export const useSortMessageByData = (arr: RongIMLib.IAReceivedMessage[]) => {
  const [newArr, setNewArr] = useState<newArrItem[]>([]);
  useEffect(() => {
    const msgs: any = [];
    arr?.map((v, i) => {
      let index = -1;
      let isExists = msgs.some((newV: { sentTime: string }, newI: number) => {
        if (
          moment(v.sentTime).format('YYYY/MM/DD') ===
          moment(newV.sentTime).format('YYYY/MM/DD')
        ) {
          index = newI;
          return true;
        }
      });
      if (!isExists) {
        const obj = {
          id: i,
          sentTimeFormat: moment(v.sentTime).format('YYYY MMM DD'),
          sentTime: v.sentTime,
          subList: [v],
        };
        msgs.push(obj);
      } else {
        const has = msgs[index].subList.findIndex(
          (i: { messageUId: string }) => {
            return i?.messageUId === v.messageUId;
          },
        );
        has === -1 && msgs[index].subList.push(v);
      }
      msgs.sort((a: { sentTime: number }, b: { sentTime: number }) => {
        return b.sentTime < a.sentTime ? 1 : -1;
      });
      msgs.map((v: { id: any }, i: any) => (v.id = i));
    });
    setNewArr([...msgs]);
  }, [arr]);
  return {
    msgs: newArr,
  };
};
