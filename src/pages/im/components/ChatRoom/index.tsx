import { Box, Typography } from '@mui/material';
import styles from './index.less';
import emojSvg from '../../assets/emoj.svg';
import imgSvg from '../../assets/img.svg';
import fileSvg from '../../assets/file.svg';
import topSvg from '../../assets/top.svg';
import topActiveSvg from '../../assets/top-active.svg';
import verifySvg from '../../assets/verify.svg';
import timeSvg from '../../assets/time.svg';
import TopSellerSVG from '../../assets/top-seller.svg';
import TopAccountSVG from '../../assets/top-account.svg';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { IImRoot, useScroll, useSortMessageByData } from '@/hooks/useIm';
import { MESSAGE_TYPE } from '@rongcloud/imlib-v4';
import classNames from 'classnames';
import Uploader, { FileWithFid, IFileWithFid } from '@/components/Uploader';
import { IMAGE_FILES_MIMES } from '@/components/Uploader/mimeTypes';
import Message from '../Message';
import Emoji from '../Emoji';
import { IConfigStateType, useSelector, history } from 'umi';
import { IUserState } from '@/models/user';
import { useRequest } from 'ahooks';
import { IResponse } from '@/service/types';
import { ICloumnInfo } from '@/service/im/type';
import { getCloumnInfo } from '@/service/im';
import { IFile } from '@/types';
import { USER_TYPE } from '@/define';
import { getCursorForTextArea } from '@/utils';
import countries from 'i18n-iso-countries';
import english from 'i18n-iso-countries/langs/en.json';
import Loading from '@/components/Loading';
import Toast from '@/components/Toast';

countries.registerLocale(english);

export type ItargetInfoObjProps = {
  avatar?: IFile;
  id?: number;
  isVerify?: string;
  userName?: string;
  userType?: number;
  location?: string;
  timezone?: string;
};

interface IavatarItemPorps {
  type: string;
  userType?: number;
  isOfficial?: boolean;
  targetId?: string | undefined;
}

const userTimezone = new Date().getTimezoneOffset() / -60;

const noMessageTip =
  'Sorry, Inbox is inaccessible now. We are upgrading the IM system to provide better service.';
// 'Please be careful what you share while chatting here: Do not send any passwords, private keys or personal information etc.';

const ChatRoom = ({
  conversation,
  conversationMessageList,
  conversationList,
  fetchTargetConversationMessageList,
  loading: imLoading,
}: IImRoot) => {
  const { userInfo, uid } = useSelector<any, IUserState>((state) => state.user);
  const { config } = useSelector<any, IConfigStateType>(
    (state) => state.config,
  );

  let [message, setMessage] = useState('');
  let [loading, setLoading] = useState<boolean>(false);
  let [isTop, setIsTop] = useState<boolean>(false);
  let [targetInfo, setTargetInfo] = useState<ItargetInfoObjProps>({});

  const textAreaRef = useRef(null);

  const onSend = async (data: { res?: IFileWithFid; type: string }) => {
    try {
      const { res, type } = data;
      let content = null;
      switch (type) {
        case 'IMAGE':
          content = { content: 'bhZPzJXimRwrtvc=', imageUri: res?.fileUrl };
          break;
        case 'FILE':
          const {
            fileName: name,
            fileSize: size,
            fileType: type,
            fileUrl,
          } = res as any;
          content = { name, size, type, fileUrl };
          break;
        default:
          setLoading(true);
          content = { content: message };
          break;
      }
      await conversation?.send({
        messageType: MESSAGE_TYPE[type],
        content,
      });
      await new Promise((ok) => setTimeout(ok, 500));
      setLoading(false);
      fetchTargetConversationMessageList();
      setMessage('');
      const dom = textAreaRef.current as unknown as HTMLTextAreaElement;
      setTimeout(() => {
        dom.focus();
      }, 100);
    } catch (error) {
      console.log('error---->', error);
    }
  };

  // 回车提交
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && (e.target as HTMLTextAreaElement).value) {
      onSend({ type: 'TEXT' });
    }
  };

  // 滚动加载更多历史消息
  const scrollRef = useRef(null);
  useScroll(scrollRef);

  const onTop = async () => {
    setLoading(true);
    const _isTop = !isTop;
    await new Promise((ok) => setTimeout(ok, 500));
    try {
      await conversation?.setStatus({ isTop: _isTop });
    } catch (error) {
      console.log('error---->', error);
    }
    setIsTop(_isTop);
    setLoading(false);
  };

  // 按日期进行分类
  const { msgs } = useSortMessageByData(conversationMessageList);
  // console.log(msgs, '==============sortConversationMessageList');
  // console.log(conversationMessageList, 'conversationMessageList');

  const { run: getcloumnInfoList } = useRequest<IResponse<ICloumnInfo>, any>(
    (params) => getCloumnInfo(params),
    {
      manual: true,
      onSuccess: (res) => {
        const targetInfoList = res?.data?.list ?? [];
        let obj = targetInfoList.length ? targetInfoList[0] : {};
        if (Object.keys(obj).length) {
          // @ts-ignore
          obj.location = obj.location && countries.getName(obj.location, 'en');
        }
        if (isOfficial) {
          obj = {
            // @ts-ignore
            avatar: { fileUrl: require('../../assets/official.svg') },
            userName: 'Metalents',
            userType: 3,
            timezone: '-5',
          };
        }
        setTargetInfo(obj);
      },
    },
  );

  const isOfficial =
    [6].includes(Number(conversation?.type)) &&
    Number(conversation?.targetId) === Number(config?.IM_SYSTEM_ID?.cfgVal);
  useEffect(() => {
    conversationList?.map((v) => {
      v.targetId === conversation?.targetId && setIsTop(v?.isTop as boolean);
    });
    // conversation?.targetId &&
    //   getcloumnInfoList({
    //     ids: [Number(conversation?.targetId)],
    //   });
    setTimeout(() => {
      const dom = textAreaRef.current as unknown as HTMLTextAreaElement;
      // console.log(conversation);
      // console.log(dom, 'dom');
      conversation?.targetId && dom && dom.focus();
    }, 200);
  }, [conversation?.targetId]);

  const selectEmoji = (res: {}) => {
    const dom = textAreaRef.current as unknown as HTMLTextAreaElement;
    const position = getCursorForTextArea(dom);
    const preMgs = message.substring(0, position.start);
    const lateMsg = message.substring(position.start);
    const newMsg = `${preMgs}${(res as any)?.emoji}${lateMsg}`;
    dom.value = newMsg;
    dom.focus();
    setMessage(newMsg);
  };

  const avatarClick = ({
    type,
    userType,
    isOfficial,
    targetId,
  }: IavatarItemPorps) => {
    switch (type) {
      case 'MY':
        history.push(`/account/profile?sidebar&userId=${uid}`);
        break;
      case 'NOTMY':
        if (isOfficial) {
          return;
        }
        const obj = {
          1: 'account',
          2: 'seller',
        };
        targetId &&
          userType &&
          history.push(`/${obj[userType]}/profile?sidebar&userId=${targetId}`);
        break;
      default:
        break;
    }
  };

  const handleBefore = (filelist: FileWithFid[]) => {
    setLoading(true);
    return new Promise<FileWithFid[]>((resolve) => {
      if (filelist.length > 0) {
        resolve(filelist);
      }
    });
  };

  return (
    <div className={styles['root']}>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems="center"
        className={styles['info']}
      >
        {conversation && Object.keys(targetInfo).length ? (
          <>
            <Box display={'flex'}>
              <Avatar
                size={44}
                src={
                  targetInfo?.avatar?.fileUrl ||
                  targetInfo?.avatar?.fileThumbnailUrl
                }
                className={styles['other-avatar']}
              >
                {targetInfo?.userName?.[0]?.toLocaleUpperCase() || 'U'}
              </Avatar>
              <Box className={styles['base-info']}>
                <Box display={'flex'}>
                  <h2 className={styles['info-title']}>
                    {targetInfo?.userName}
                  </h2>
                  {['verified'].includes(targetInfo?.isVerify as string) && (
                    <img className={styles['isVerify']} src={verifySvg} />
                  )}
                  {[USER_TYPE.Official].includes(
                    targetInfo?.userType as number,
                  ) && (
                    <span className={styles['identity-type']}>
                      {USER_TYPE[targetInfo?.userType as number]}
                    </span>
                  )}
                </Box>
                <Box className={styles['sub-info']}>
                  <Typography className={styles['country']}>
                    {targetInfo?.location}
                  </Typography>
                  <div className={styles['time']}>
                    (
                    <img className={styles['img']} src={timeSvg} />
                    <span>
                      {`${
                        new Date().getHours() +
                        Number(targetInfo?.timezone) -
                        userTimezone
                      }:${(Array(2).join('0') + new Date().getMinutes()).slice(
                        -2,
                      )}`}
                    </span>
                    )
                  </div>
                  {[USER_TYPE.Seller].includes(
                    targetInfo?.userType as number,
                  ) && (
                    <Button
                      className={styles['top-btn']}
                      onClick={() => {
                        avatarClick({
                          type: 'NOTMY',
                          userType: targetInfo?.userType,
                          isOfficial,
                          targetId: conversation?.targetId,
                        });
                      }}
                    >
                      <img src={TopSellerSVG} />
                      <span>Seller</span>
                    </Button>
                  )}

                  <Button
                    className={styles['top-btn']}
                    onClick={() => {
                      history.push(
                        `/account/profile?sidebar&userId=${conversation?.targetId}`,
                      );
                    }}
                  >
                    <img src={TopAccountSVG} />
                    <span>Personal</span>
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box>
              <img
                onClick={onTop}
                className={styles['top-icon']}
                alt="top"
                src={isTop ? topActiveSvg : topSvg}
              />
            </Box>
          </>
        ) : (
          <div className={styles['not-select-conversation']}></div>
        )}
      </Box>
      <Box className={styles['inner']}>
        {conversation && Object.keys(targetInfo).length && msgs?.length ? (
          <>
            {loading && (
              <div className={styles['loading-container']}>
                <Loading className={styles['loading']} />
              </div>
            )}
            <Box className={styles['scrollable']} ref={scrollRef}>
              {msgs?.map((v, i) => {
                return (
                  <div key={`${v.id}_${i}`}>
                    <Box className={styles['date-time']}>
                      {v.sentTimeFormat}
                    </Box>
                    {v?.subList?.map((e) => {
                      if (e.senderUserId !== conversation?.targetId) {
                        return (
                          <div
                            key={e.messageUId}
                            className={classNames(
                              styles['myBox'],
                              styles['messageItemBox'],
                            )}
                          >
                            <Message
                              messageItem={
                                { ...e, targetId: conversation?.targetId } ?? {}
                              }
                            />
                            <Avatar
                              size={44}
                              src={
                                userInfo?.avatar?.fileUrl ||
                                userInfo?.avatar?.fileThumbnailUrl
                              }
                              onClick={() => {
                                avatarClick({
                                  type: 'MY',
                                });
                              }}
                              sx={{ cursor: 'pointer' }}
                            >
                              {userInfo?.userName?.[0]?.toLocaleUpperCase() ||
                                'U'}
                            </Avatar>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={e.messageUId}
                          className={classNames(
                            styles['noMyBox'],
                            styles['messageItemBox'],
                          )}
                        >
                          <Avatar
                            size={44}
                            src={
                              targetInfo?.avatar?.fileUrl ||
                              targetInfo?.avatar?.fileThumbnailUrl
                            }
                            className={styles['other-avatar']}
                          >
                            {targetInfo?.userName?.[0]?.toLocaleUpperCase() ||
                              'U'}
                          </Avatar>
                          <Message
                            messageItem={
                              { ...e, targetId: conversation?.targetId } ?? {}
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              <div id="scrollView"></div>
            </Box>
          </>
        ) : (
          <div className={styles['no-message-tip']}>
            <Typography>{noMessageTip}</Typography>
          </div>
        )}
      </Box>
      <Box className={styles['footer']}>
        <Box className={styles['actions']}>
          {isOfficial || !(conversation && Object.keys(targetInfo).length) ? (
            <>
              <img src={emojSvg} alt="" />
              <img src={imgSvg} alt="" />
              <img src={fileSvg} alt="" />
            </>
          ) : (
            <>
              <Emoji onSelect={selectEmoji} />
              <Uploader
                icon={null}
                limitSize={100}
                accept={IMAGE_FILES_MIMES}
                onBefore={handleBefore}
                onSuccess={(res) => {
                  onSend({ res, type: 'IMAGE' });
                }}
                onError={() => {
                  setLoading(false);
                  Toast.error('File upload failed. ');
                }}
              >
                <img src={imgSvg} alt="img" />
              </Uploader>
              <Uploader
                icon={null}
                limitSize={100}
                onBefore={handleBefore}
                onSuccess={(res) => {
                  onSend({ res, type: 'FILE' });
                }}
                onError={() => {
                  setLoading(false);
                  Toast.error('File upload failed. ');
                }}
              >
                <img src={fileSvg} alt="file" />
              </Uploader>
            </>
          )}
        </Box>
        <textarea
          ref={textAreaRef}
          disabled={
            loading ||
            isOfficial ||
            !(conversation && Object.keys(targetInfo).length)
          }
          value={message}
          placeholder="Enter..."
          onInput={(e) => {
            setMessage((e.target as HTMLInputElement).value);
          }}
          onKeyDown={(e) => handleKeyDown(e)}
          className={styles['textarea']}
        ></textarea>
        <Box className={styles['sendBox']}>
          <Button
            onClick={() => {
              onSend({ type: 'TEXT' });
            }}
            loading={loading}
            disabled={
              !message ||
              isOfficial ||
              !(conversation && Object.keys(targetInfo).length)
            }
            variant={'contained'}
            className={styles['send']}
          >
            Send
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default ChatRoom;
