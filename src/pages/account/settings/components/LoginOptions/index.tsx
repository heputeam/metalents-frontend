// import { Box } from '@mui/material';
// import styles from './index.less';
import { uid } from 'react-uid';
import styled from './index.less';

import GoogleSVG from '@/assets/imgs/login/gmail.svg';
import TwitterSVG from '@/assets/imgs/login/twitter.svg';
import InstagramSVG from '@/assets/imgs/login/instagram.svg';
import MetamaskSVG from '@/assets/imgs/login/metamask-notext.svg';
import Button from '@/components/Button';
import { IOAuth, SIGNATURE_MSG } from '@/define';
import { useRequest } from 'ahooks';
import Toast from '@/components/Toast';
import { IOAuthResponse, IUserState, useDispatch, useSelector } from 'umi';
import { useWalletConnection } from '@/web3/hooks';

import { toOmitAccount } from '@/utils';
import { NetworkChain } from '@/web3/define';
import { postUpdateThirdpart } from '@/service/public';
import { useWeb3React } from '@web3-react/core';

const LoginOptions = () => {
  const { connect } = useWalletConnection();
  const { userInfo } = useSelector<any, IUserState>((state) => state?.user);
  const { account, library, active } = useWeb3React();

  const dispatch = useDispatch();
  const { run: runThirdpart } = useRequest(
    (params) => postUpdateThirdpart(params),
    {
      manual: true,
      onSuccess: (data: any) => {
        const { code } = data;
        if (code === 200) {
          Toast.success('Successfully set!');
          dispatch({
            type: 'user/queryUser',
          });
        } else if (
          code === 30042 ||
          code === 30026 ||
          code === 30025 ||
          code === 30027
        ) {
          Toast.error(
            'Your social accounts have been used, please bind the other one.',
          );
        } else {
          Toast.error('Unknown system failure: Please try');
        }
      },
    },
  );
  const handleOAuthBind = async (authName: IOAuth, type: number) => {
    if (type === 4) {
      return Toast.warn('New features coming soon');
    }
    dispatch({
      type: 'user/loginOAuth',
      payload: {
        authName,
      },
      callback: async (res: IOAuthResponse) => {
        const accessToken = res.accessToken || '';
        const params = {
          accessToken,
          message: '',
          signature: '',
          thirdpartType: type,
          userAddress: '',
        };
        runThirdpart(params);
      },
    });
  };

  const handleMetaMaskBind = async () => {
    if (!active) {
      return connect();
    }
    const signature = await library.eth.personal.sign(
      SIGNATURE_MSG,
      account!,
      SIGNATURE_MSG,
    );
    if (signature) {
      const params = {
        accessToken: '',
        message: SIGNATURE_MSG,
        signature,
        thirdpartType: 5,
        userAddress: account,
      };
      runThirdpart(params);
    }
  };
  const loginOptionsConfig = [
    {
      name: 'Google',
      iconPath: GoogleSVG,
      context: userInfo?.googleInfo?.name || '',
      isBind: Boolean(userInfo?.googleInfo?.name),
      handleBind: () => handleOAuthBind('google', 2),
    },
    {
      name: 'Twitter',
      iconPath: TwitterSVG,
      context: userInfo?.twitterInfo?.name,
      isBind: Boolean(userInfo?.twitterInfo?.name),
      handleBind: () => handleOAuthBind('twitter', 3),
    },
    {
      name: 'Instagram',
      iconPath: InstagramSVG,
      context: userInfo?.instagramInfo?.name,
      isBind: Boolean(userInfo?.instagramInfo?.name),
      handleBind: () => handleOAuthBind('instagram', 4),
    },
    {
      name: 'Metamask',
      iconPath: MetamaskSVG,
      context: toOmitAccount(userInfo?.walletAddress || ''),
      isBind: Boolean(userInfo?.walletAddress),
      handleBind: handleMetaMaskBind,
    },
  ];
  return (
    <div className={styled['loginOptions-container']}>
      <h4>
        Other Login Options <span>*</span>
      </h4>

      <ul className={styled['loginItem']}>
        {loginOptionsConfig.map((item) => (
          <li key={uid(item)}>
            <div className={styled['loginType']}>
              <img src={item.iconPath} alt="" />
              <span className={styled['grey']}>{item.name}</span>
            </div>

            <div className={styled['context']}>
              <p className={styled['grey']}>{item.context}</p>
            </div>

            <div>
              {item.isBind ? (
                <Button
                  variant="outlined"
                  rounded
                  className={styled['already-set']}
                  disabled
                >
                  √ Already set
                </Button>
              ) : (
                <Button variant="contained" rounded onClick={item.handleBind}>
                  Bind
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoginOptions;
