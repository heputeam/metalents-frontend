import React from 'react';
import styles from './index.less';
import Dialog from '@/components/Dialog';
import EmailPNG from '@/assets/imgs/login/email.png';
import MetamaskPNG from '@/assets/imgs/login/metamask.png';
import GmailSVG from '@/assets/imgs/login/gmail.svg';
import Twitter from '@/assets/imgs/login/twitter.svg';
import Instagram from '@/assets/imgs/login/instagram.svg';
import { IDialogState, IOAuthResponse, useDispatch, useSelector } from 'umi';
import { IOAuth, SIGNATURE_MSG } from '@/define';
import { useWalletConnection } from '@/web3/hooks';
import { useWeb3React } from '@web3-react/core';
import Toast from '../Toast';

interface IRegisterChooseDialogState {
  visible: boolean;
}
export const dialog_key = 'registerChooseDialog'; // dialog 唯一值
export type IRegisterChooseDialogProps = {};
const RegisterChooseDialog: React.FC<IRegisterChooseDialogProps> = ({}) => {
  const { active, account, chainId, library } = useWeb3React();
  const { connect } = useWalletConnection();
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: IRegisterChooseDialogState = useSelector<
    any,
    IDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[dialog_key],
  }));
  // 关闭 dialog
  const handleClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };

  const handleEmail = () => {
    handleClose();
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'registerDialog',
      },
    });
  };
  const handleMetaMask = async () => {
    if (!active) {
      return connect();
    }

    const signature = await library?.eth.personal.sign(
      SIGNATURE_MSG,
      account!,
      SIGNATURE_MSG,
    );
    if (signature) {
      handleClose();
      dispatch({
        type: 'dialog/show',
        payload: {
          key: 'bindEmailDialog',
          registerType: 5,
          userAddress: account,
          message: SIGNATURE_MSG,
          signature,
        },
      });
    }
  };
  const handleOAuthLogin = async (authName: IOAuth, type: number) => {
    if (type === 4) {
      return Toast.warn('New features coming soon');
    }
    dispatch({
      type: 'user/loginOAuth',
      payload: {
        authName,
      },
      callback: async (res: IOAuthResponse) => {
        handleClose();
        dispatch({
          type: 'dialog/show',
          payload: {
            key: 'bindEmailDialog',
            registerType: type,
            assessToken: res.accessToken || '',
          },
        });
      },
    });
  };
  return (
    <Dialog
      visible={dialogState.visible}
      title="Create an account"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['account-content']}>
        <div className={styles['sub-title']}>
          <p>
            Use your crypto wallet or a social account to sign in. No funds or
          </p>
          <p>security checks are necessary.</p>
        </div>
        <div className={styles['account-box']}>
          <div className={styles['email-box']} onClick={handleEmail}>
            <span>Email</span>
            <div className={styles['icon-box']}>
              <img src={EmailPNG} width={171} />
            </div>
          </div>
          <div className={styles['social-box']}>
            <span>Social</span>
            <div className={styles['social-content']}>
              <div
                className={styles['social-item']}
                onClick={() => handleOAuthLogin('google', 2)}
              >
                <img src={GmailSVG} alt="" />
                <div className={styles['item-txt']}>
                  <span>Continue with</span>
                  <span>Google</span>
                </div>
              </div>
              <div
                className={styles['social-item']}
                onClick={() => handleOAuthLogin('twitter', 3)}
              >
                <img src={Twitter} alt="" />
                <div className={styles['item-txt']}>
                  <span>Continue with</span>
                  <span>Twitter</span>
                </div>
              </div>
              <div
                className={styles['social-item']}
                onClick={() => handleOAuthLogin('instagram', 4)}
              >
                <img src={Instagram} alt="" />
                <div className={styles['item-txt']}>
                  <span>Continue with</span>
                  <span>Instagram</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['web3-box']} onClick={handleMetaMask}>
            <span>Web3</span>
            <div className={styles['icon-box']}>
              <img src={MetamaskPNG} width={171} />
            </div>
          </div>
        </div>
        <div className={styles['sign-up-tip']}>
          Already have an account?&nbsp;
          <span
            onClick={() => {
              handleClose();
              dispatch({
                type: 'dialog/show',
                payload: {
                  key: 'loginChooseDialog',
                },
              });
            }}
          >
            Sign in
          </span>
        </div>
      </div>
    </Dialog>
  );
};
export default RegisterChooseDialog;
