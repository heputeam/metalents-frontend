import { IconButton, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { IMenuItem } from '@/pages/account/components/Sidebar';
import { history, useDispatch, useSelector } from 'umi';
import MyAvatar from '@/components/Avatar';
import Level from '@/components/Level';
import { IUserState } from '@/models/user';
import StarIcon from '@mui/icons-material/Star';
import { IUserInfo } from '@/service/user/types';

export interface IUserInfoTooltip {
  setOpen: (open: boolean) => void;
  userInfo: IUserInfo | undefined;
}

const UserInfoTooltip: React.FC<IUserInfoTooltip> = ({ setOpen, userInfo }) => {
  const dispatch = useDispatch();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [userName, setUserName] = useState<string>('U');
  const { uid } = useSelector<any, IUserState>((state) => state.user);

  useEffect(() => {
    if (userInfo) {
      const { avatar, userName, googleInfo, instagramInfo, twitterInfo } =
        userInfo;
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

  const accountMenu: IMenuItem[] = [
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
  ];

  const sellerMenu: IMenuItem[] = [
    {
      label: 'Home & Profile',
      path: '/seller/profile',
      hasSideBar: true,
    },
    {
      label: 'My Services',
      path: '/seller/services',
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
  ];

  const optionMenu: IMenuItem[] = [
    {
      label: 'Account Settings',
      path: '/account/settings',
      hasSideBar: true,
    },
    {
      label: 'Help & Support',
      path: 'https://docs.metalents.com/introduction/what-is-metalents',
      hasSideBar: true,
      disabled: false,
      externalLink: true,
    },
    {
      label: 'Log out',
      path: '',
      hasSideBar: false,
    },
  ];

  const handleClick = (item: IMenuItem) => {
    if (!item?.disabled && item?.path) {
      setOpen(false);
      if (item.externalLink) {
        window.open(item.path, '_blank');
      } else {
        if (item.path === '/account/profile') {
          return history.push(
            `${item.path}${item.hasSideBar ? `?sidebar&userId=${uid}` : ''}`,
          );
        }
        return history.push(`${item.path}${item.hasSideBar ? '?sidebar' : ''}`);
      }
    } else if (item.label === 'Log out') {
      setOpen(false);
      // 退出登录
      dispatch({ type: 'user/logout' });
      dispatch({
        type: 'im/setSession',
        payload: {
          imToken: null,
        },
      });
      history.push('/');
      window.location.reload();
    }
  };

  return (
    <div className={styles['info-tooltip']}>
      <div className={styles['user-info']}>
        <MyAvatar
          sx={{
            marginTop: '6px',
          }}
          size={44}
          src={avatarUrl}
        >
          {userName?.slice(0, 1)?.toLocaleUpperCase()}
        </MyAvatar>

        <div className={styles['info-right']}>
          <Typography
            variant="body1"
            component="div"
            className={styles['user-name']}
          >
            {userName}
          </Typography>
          <div className={styles['personal-level']}>
            <Level level={userInfo?.levels || 0} />
            {userInfo?.userType === 2 && (
              <>
                {Number(userInfo?.scope) > 0 ? (
                  <div className={styles['rating']}>
                    <StarIcon className={styles['star']} />
                    <Typography
                      className={styles['scope']}
                      style={{ color: '#FAC917' }}
                    >
                      {userInfo?.scope || 0}
                    </Typography>
                  </div>
                ) : (
                  <div className={styles['rating']}>
                    <StarIcon className={styles['empty-star']} />
                    <Typography
                      className={styles['scope']}
                      style={{ color: '#dddddd' }}
                    >
                      -
                    </Typography>
                  </div>
                )}
              </>
            )}
          </div>
          <Typography
            variant="caption"
            component="div"
            className={styles['email']}
          >
            {userInfo?.email}
          </Typography>
        </div>
      </div>
      <div className={styles['menus']}>
        <Typography
          variant="caption"
          component="div"
          className={styles['my-account']}
        >
          My Account
        </Typography>
        <div>
          {accountMenu.map((item, index) => {
            return (
              <div
                className={styles['menu-item']}
                key={item?.label}
                onClick={() => handleClick(item)}
              >
                <div>{item.label}</div>
              </div>
            );
          })}
        </div>
        {userInfo?.userType === 2 && (
          <>
            <Typography
              variant="caption"
              component="div"
              className={styles['my-account']}
            >
              Seller Center
            </Typography>
            <div>
              {sellerMenu.map((item, index) => {
                return (
                  <div
                    className={styles['menu-item']}
                    key={item?.label}
                    onClick={() => handleClick(item)}
                  >
                    <div>{item.label}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <Typography
          variant="caption"
          component="div"
          className={styles['my-account']}
        >
          More options
        </Typography>
        <div>
          {optionMenu.map((item, index) => {
            return (
              <div
                className={styles['menu-item']}
                key={item?.label}
                onClick={() => handleClick(item)}
              >
                <div>{item.label}</div>
                {item.extra}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export interface IUserInfoProps {}
const UserInfo: React.FC<IUserInfoProps> = () => {
  const { userInfo } = useSelector<any, IUserState>((state) => state.user);
  const [open, setOpen] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [userName, setUserName] = useState<string>('U');

  useEffect(() => {
    if (userInfo) {
      const { avatar, userName, googleInfo, instagramInfo, twitterInfo } =
        userInfo;
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

  const handleTooltipClose = () => {
    setOpen(false);
  };

  return (
    <Tooltip
      PopperProps={{
        disablePortal: true,
      }}
      onClose={handleTooltipClose}
      open={open}
      disableFocusListener
      // disableHoverListener
      disableTouchListener
      title={<UserInfoTooltip setOpen={setOpen} userInfo={userInfo} />}
      classes={{ tooltip: styles['tooltip-box'] }}
      placement="bottom-start"
    >
      <IconButton
        classes={{ root: styles['icon-btn'] }}
        onMouseEnter={() => setOpen(true)}
      >
        <MyAvatar size={44} src={avatarUrl}>
          {userName?.slice(0, 1)?.toLocaleUpperCase()}
        </MyAvatar>
      </IconButton>
    </Tooltip>
  );
};

export default UserInfo;
