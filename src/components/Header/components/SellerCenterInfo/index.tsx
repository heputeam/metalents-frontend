import {
  Button,
  ClickAwayListener,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowSVG from '@/assets/imgs/header/arrow.svg';
import styles from './index.less';
import { IMenuItem } from '@/pages/account/components/Sidebar';
import { history, IUserState, useSelector } from 'umi';
import MyAvatar from '@/components/Avatar';
import Level from '@/components/Level';
import MyRating from '@/components/Rating';
import VerifiedSVG from '@/assets/imgs/home/verified.svg';

export interface ISellerCenterInfoTooltip {
  setOpen: (open: boolean) => void;
}

const SellerCenterInfoTooltip: React.FC<ISellerCenterInfoTooltip> = ({
  setOpen,
}) => {
  const { userInfo, uid } = useSelector<any, IUserState>((state) => state.user);

  const sellerMenu: IMenuItem[] = [
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
      label: 'My Wallet',
      path: '/seller/wallet',
      hasSideBar: true,
      disabled: false,
    },
    {
      label: 'My WORK Rewards',
      path: '/invite',
      hasSideBar: false,
      disabled: false,
    },
  ];

  const handleClick = (item: IMenuItem) => {
    if (!item?.disabled && item?.path) {
      setOpen(false);
      if (item.path === '/seller/profile') {
        return history.push(
          `${item.path}${item.hasSideBar ? `?sidebar&userId=${uid}` : ''}`,
        );
      }
      return history.push(`${item.path}${item.hasSideBar ? '?sidebar' : ''}`);
    }
  };

  return (
    <div className={styles['info-tooltip']}>
      <div className={styles['user-info']}>
        <MyAvatar
          sx={{
            width: 44,
            height: 44,
            marginTop: '6px',
          }}
          src={userInfo?.avatar?.fileUrl || userInfo?.avatar?.fileThumbnailUrl}
        >
          {userInfo?.shopname?.slice(0, 1)?.toLocaleUpperCase()}
        </MyAvatar>

        <div className={styles['info-right']}>
          <Typography
            variant="body1"
            component="div"
            className={styles['shop-name']}
          >
            {userInfo?.shopname}
          </Typography>
          <Stack direction="row" alignItems="center">
            <Typography
              variant="caption"
              component="span"
              className={styles['seller']}
            >
              Seller
            </Typography>
            {userInfo?.isVerify === 'verified' && (
              <img
                src={VerifiedSVG}
                alt=""
                width={16}
                style={{ marginLeft: 6 }}
              />
            )}
            <Level level={userInfo?.levels || 0} className={styles['level']} />
          </Stack>
          <MyRating
            value={userInfo?.scope || 0}
            size={18}
            precision={0.1}
            readOnly
            className={styles['rating-box']}
          />
        </div>
      </div>
      <Stack
        direction="row"
        alignItems="center"
        className={styles['operate-btns']}
        flex={1}
        spacing={6}
      >
        <Button
          variant="contained"
          disableElevation
          classes={{ root: styles['order-btn'] }}
          onClick={() => history.push(`/seller/orders?sidebar`)}
        >
          My orders
          <div className={styles['btn-num']}>{userInfo?.orderCount || 0}</div>
        </Button>
        <Button
          variant="contained"
          disableElevation
          classes={{ root: styles['order-btn'] }}
          onClick={() => history.push(`/seller/offers?sidebar`)}
        >
          My offers
          <div className={styles['btn-num']}>{userInfo?.offerCount || 0}</div>
        </Button>
      </Stack>
      <div className={styles['menus']}>
        <Typography
          variant="caption"
          component="div"
          className={styles['menu-label']}
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
                {item.extra}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SellerCenterInfo: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Tooltip
      open={open}
      disableFocusListener
      // disableHoverListener
      disableTouchListener
      title={<SellerCenterInfoTooltip setOpen={setOpen} />}
      placement="bottom"
      onClose={() => setOpen(false)}
      classes={{ tooltip: styles['tooltip-box'] }}
    >
      <Button
        variant="text"
        disableElevation
        classes={{ root: styles['seller-btn'] }}
        onMouseEnter={() => setOpen(true)}
      >
        Seller Center
        <img src={ArrowSVG} style={{ marginLeft: '7px' }} />
      </Button>
    </Tooltip>
  );
};

export default SellerCenterInfo;
