import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { IUserState, useLocation, useSelector } from 'umi';
import classnames from 'classnames';
import NavLink from '@/components/NavLink';
import AvatarAndInfo from '@/components/AvatarAndInfo';
import Button from '@/components/Button';
import { IUserInfo } from '@/service/user/types';
import { useGetVisitor } from '@/hooks/useUser';
import { IDENTITY_TYPE, USER_TYPE } from '@/define';
import messageSVG from '@/assets/imgs/request/message.svg';
import SendMessage from '@/components/SendMessage';

export type ISidebarProps = {};

export interface IMenuItem {
  label: string;
  path: string;
  hasSideBar: boolean;
  extra?: React.ReactNode;
  disabled?: boolean;
  externalLink?: boolean;
}

const menu: IMenuItem[] = [
  {
    label: 'Home & Profile',
    path: '/account/profile',
    hasSideBar: true,
  },
  {
    label: 'My Orders',
    path: '/account/orders',
    hasSideBar: true,
    disabled: false,
  },
  {
    label: 'My Requests',
    path: '/account/requests',
    hasSideBar: true,
    disabled: false,
  },
  {
    label: 'My Wallet',
    path: '/account/wallet',
    hasSideBar: true,
    disabled: false,
  },
  {
    label: 'Message Inbox',
    path: '/im',
    hasSideBar: true,
    disabled: false,
  },
  {
    label: 'Account Settings',
    path: '/account/settings',
    hasSideBar: true,
  },
];

const Sidebar: React.FC<ISidebarProps> = ({}) => {
  const { pathname, query } = useLocation() as any;
  const { userInfo: info, uid } = useSelector<any, IUserState>(
    (state) => state.user,
  );
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [userName, setUserName] = useState<string>('U');
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [userType, setUserType] = useState<number>(IDENTITY_TYPE.Owner);
  const { userProfile } = useGetVisitor(query?.userId);

  useEffect(() => {
    if (query?.userId) {
      setUserInfo(userProfile);
      Number(query.userId) !== uid && setUserType(IDENTITY_TYPE.Other);
    } else {
      setUserInfo(info);
      setUserType(IDENTITY_TYPE.Owner);
    }
  }, [query?.userId, info, userProfile]);

  useEffect(() => {
    if (userInfo) {
      const {
        avatar,
        userName,
        googleInfo,
        instagramInfo,
        twitterInfo,
        location: _location,
      } = userInfo;
      const avatarImg =
        avatar?.fileUrl ||
        googleInfo?.avatar ||
        instagramInfo?.avatar ||
        twitterInfo?.avatar ||
        '';
      const name =
        userName ||
        googleInfo?.name ||
        instagramInfo?.name ||
        twitterInfo?.name ||
        'U';
      setAvatarUrl(avatarImg);
      setUserName(name);
    }
  }, [userInfo]);

  const getLinkUrl = (item: IMenuItem) => {
    if (item.path === '/account/profile') {
      return `${item.path}${item.hasSideBar ? `?sidebar&userId=${uid}` : ''}`;
    }
    return `${item.path}${item.hasSideBar ? '?sidebar' : ''}`;
  };

  return (
    <div className={styles['side-bar']}>
      <div className={styles['side-content']}>
        <div style={{ height: '160px' }}>
          <AvatarAndInfo
            location={userInfo?.location}
            level={userInfo?.levels}
            avatar={avatarUrl}
            userName={userName}
            timezone={userInfo?.timezone}
            isRatingVisible={false}
          />
        </div>
        {userType === IDENTITY_TYPE.Owner ? (
          <div className={styles['menu']}>
            <Typography
              variant="body1"
              component="div"
              className={styles['menu-title']}
            >
              My Account
            </Typography>

            <div className={styles['link-btn-group']}>
              {menu.map((item) => (
                <NavLink
                  key={item.path}
                  disabled={item?.disabled}
                  path={getLinkUrl(item)}
                >
                  <Button
                    className={classnames(
                      styles['link-btn'],
                      pathname?.includes(item.path) && styles['active'],
                    )}
                    disabled={item?.disabled}
                  >
                    {item.label}
                    {/* {data.hasAmount && <div className={styles['balance']}>500</div>} */}
                  </Button>
                </NavLink>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles['send-message-box']}>
            <SendMessage
              targetId={(userInfo?.id || '')?.toString()}
              svg={messageSVG}
              text="Send Message"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
