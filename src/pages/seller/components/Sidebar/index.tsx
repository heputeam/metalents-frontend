import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useLocation } from 'umi';
import classnames from 'classnames';
import NavLink from '@/components/NavLink';
import AvatarAndInfo from '@/components/AvatarAndInfo';
import Button from '@/components/Button';
import { useGetVisitor, useToolsVisitor } from '@/hooks/useUser';
import messageSVG from '@/assets/imgs/request/message.svg';
import UnLikeSVG from '@/assets/imgs/seller/sidebar/unlike.svg';
import { IDENTITY_TYPE } from '@/define';
import { toDigitalFormat } from '@/utils';
import LikeSeller from '@/components/LikeSeller';
import { IUserState, useSelector } from 'umi';
import SendMessage from '@/components/SendMessage';

export type ISidebarProps = {};

export interface IMenuItem {
  label: string;
  path: string;
  hasSideBar: boolean;
  extra?: React.ReactNode;
  disabled?: boolean;
}

const menu: IMenuItem[] = [
  {
    label: 'Home & Profile',
    path: '/seller/profile',
    hasSideBar: true,
  },
  {
    label: 'Browse Open Jobs',
    path: '/request/market',
    hasSideBar: false,
    disabled: false,
  },
  {
    label: 'My Services',
    path: '/seller/services',
    hasSideBar: true,
    disabled: false,
  },
  {
    label: 'My Wallet',
    path: '/seller/wallet',
    hasSideBar: true,
    disabled: false,
  },
  {
    label: 'My Orders',
    path: '/seller/orders',
    hasSideBar: true,
    disabled: false,
  },
  {
    label: 'My Offers',
    path: '/seller/offers',
    hasSideBar: true,
    disabled: false,
  },
  {
    label: 'Message Inbox',
    path: '/im',
    hasSideBar: true,
    disabled: false,
  },
];

const Sidebar: React.FC<ISidebarProps> = ({}) => {
  const { pathname, query } = useLocation() as any;
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [userName, setUserName] = useState<string>('U');
  const { userProfile, getUserInfo } = useGetVisitor(query?.userId);
  const { userType, userInfo } = useToolsVisitor(query?.userId, userProfile);
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const [followCount, setFollowCount] = useState(0);

  const { favSellers, uid } = useSelector<any, IUserState>(
    (state) => state.user,
  );

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
      setFollowCount(0);
    }
  }, [userInfo]);

  useEffect(() => {
    const initialFollowing =
      !!favSellers?.length &&
      favSellers?.some((seller) => seller.sellerID === userInfo?.id);
    setIsFollow(!initialFollowing);
    Number(query?.userId) && getUserInfo();
  }, [favSellers, userInfo?.id]);

  const getLinkUrl = (item: IMenuItem) => {
    if (item.path === '/seller/profile') {
      return `${item.path}${item.hasSideBar ? `?sidebar&userId=${uid}` : ''}`;
    }
    return `${item.path}${item.hasSideBar ? '?sidebar' : ''}`;
  };

  return (
    <div className={styles['side-bar']}>
      <div className={styles['side-content']}>
        <div>
          <AvatarAndInfo
            location={userInfo?.location}
            level={userInfo?.levels}
            avatar={avatarUrl}
            userName={userName}
            timezone={userInfo?.timezone}
            rating={userInfo?.scope}
            orderCount={userInfo?.orderCount}
          />
        </div>
        {userType === IDENTITY_TYPE.Owner ? (
          <div className={styles['menu']}>
            <Typography
              variant="body1"
              component="div"
              className={styles['menu-title']}
            >
              My Seller Center
            </Typography>

            <div className={styles['link-btn-group']}>
              {menu.map((item) => (
                <NavLink
                  key={item?.path}
                  path={getLinkUrl(item)}
                  disabled={item?.disabled}
                >
                  <Button
                    key={item.path}
                    className={classnames(
                      styles['link-btn'],
                      pathname?.includes(item.path) && styles['active'],
                    )}
                    disabled={item?.disabled}
                  >
                    {item.label}
                  </Button>
                </NavLink>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles['send-message-box']}>
            <SendMessage
              sx={{ mb: 10, p: 0, width: 152 }}
              targetId={(userInfo?.id || '')?.toString()}
              svg={messageSVG}
              text="Send Message"
            />
            <Button
              sx={{ mb: 10, p: 0, width: 152 }}
              className={`${styles['follow-btn']} ${
                !isFollow ? styles['followed-btn'] : ''
              }`}
              startIcon={
                <LikeSeller
                  id="like_seller"
                  sellerID={userInfo?.id || 0}
                  size={19}
                  icon={UnLikeSVG}
                  onChange={(isFollow) => {
                    isFollow && setIsFollow(isFollow);
                    Number(query?.userId) && getUserInfo();
                    if (isFollow) {
                      setFollowCount(followCount - 1);
                    } else {
                      setFollowCount(followCount + 1);
                    }
                  }}
                />
              }
            >
              <label
                htmlFor="like_seller"
                className={styles['lable-like']}
              ></label>
              <span className={styles['follow']}>
                {isFollow ? 'Follow' : 'Following'}
              </span>
              &nbsp;
              <span className={styles['count']}>
                {toDigitalFormat(
                  Number(userInfo?.followerCount) + followCount,
                ) || 0}
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
