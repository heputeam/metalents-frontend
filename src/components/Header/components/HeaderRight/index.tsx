import NavLink from '@/components/NavLink';
import { IconButton, Stack } from '@mui/material';
import Button from '@/components/Button';
import React, { useEffect } from 'react';
import styles from './index.less';

import UserInfo from '../UserInfo';
import { useDispatch, useSelector, history } from 'umi';
import SellerCenterInfo from '../SellerCenterInfo';
import { IUserState } from '@/models/user';
import FavouriteInfo from '../FavouriteInfo';
import { useRequest } from 'ahooks';
import Toast from '@/components/Toast';

import EmailSVG from '@/assets/imgs/header/email.svg';
import { getCanCreate } from '@/service/requests';
import { useTotalUnreadCount } from '@/hooks/useIm';
import Badge from '@/components/Badge';

// 已登录
const LoginedHeader: React.FC = () => {
  const { userInfo } = useSelector<any, IUserState>((state) => state.user);
  const dispatch = useDispatch();
  const { config } = useSelector((state: any) => state.config);
  const { run: checkCreate } = useRequest(() => getCanCreate(), {
    manual: true,
    onSuccess: (res: any) => {
      const { code } = res;
      if (code === 200) {
        history.push('/account/apply');
      } else if (code === 30032) {
        // 三个等待着
        return Toast.error(
          `Oops! You already have ${config?.REQ_WAITING_COUNT?.cfgVal} requests in waiting.`,
        );
      } else if (code === 30031) {
        //  账户禁用
        return Toast.error(
          'Your account is disabled. Please contact Metalents Customer Service.',
        );
      } else if (code === 403) {
        dispatch({
          type: 'dialog/show',
          payload: {
            key: 'loginChooseDialog',
          },
        });
      } else {
        return Toast.error('Unknown system failure: Please try');
      }
    },
  });

  const handleRequest = () => {
    checkCreate();
  };

  const badgeContent = useTotalUnreadCount();
  const openIm = () => {
    history.push('/im');
  };

  return (
    <Stack direction="row" alignItems="center" spacing={8}>
      {userInfo?.userType === 2 ? (
        <NavLink path="/request/market" className={styles['seller-link']}>
          <Button>Browse Open Jobs</Button>
        </NavLink>
      ) : (
        <NavLink path="/selling" className={styles['seller-link']}>
          <Button>Become a Seller</Button>
        </NavLink>
      )}
      <Button className={styles['request-link']} onClick={handleRequest}>
        New Requests
      </Button>
      <FavouriteInfo />
      {/* <Tooltip title="">
        <IconButton classes={{ root: styles['icon-btn'] }}>
          <img src={OrderBookSVG} />
        </IconButton>
      </Tooltip>*/}
      <IconButton onClick={openIm}>
        <Badge content={badgeContent}>
          <img src={EmailSVG} />
        </Badge>
      </IconButton>
      <UserInfo />
    </Stack>
  );
};

// 未登录
const CustomerHeader: React.FC = () => {
  const dispatch = useDispatch();
  const handleSignIn = () => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'loginChooseDialog',
      },
    });
  };
  const handleSignUp = () => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'registerChooseDialog',
      },
    });
  };

  const handleRequest = () => {
    handleSignIn();
  };

  return (
    <Stack direction="row" alignItems="center" spacing={8}>
      <Button>
        <NavLink path="/selling" className={styles['seller-link']}>
          Become a Seller
        </NavLink>
      </Button>
      <Button className={styles['request-link']} onClick={handleRequest}>
        New Requests
      </Button>
      <Button className={styles['sign-up']} onClick={handleSignUp}>
        Sign Up
      </Button>
      <Button variant="contained" size="medium" rounded onClick={handleSignIn}>
        Sign In
      </Button>
    </Stack>
  );
};

const HeaderRight: React.FC = () => {
  const uid = useSelector<any, IUserState>((state) => state.user.uid);
  const dispatch = useDispatch();

  useEffect(() => {
    if (uid) {
      dispatch({
        type: 'user/queryUser',
      });
      dispatch({
        type: 'user/queryFavouriteServices',
      });
      dispatch({
        type: 'user/queryFavouriteSellers',
      });
    }
  }, [uid]);

  return (
    <div className={styles['header-right']}>
      {!!uid ? <LoginedHeader /> : <CustomerHeader />}
    </div>
  );
};

export default HeaderRight;
