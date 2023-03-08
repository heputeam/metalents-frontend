import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '@fontsource/roboto-condensed/400.css';
import '@fontsource/roboto-condensed/700.css';

import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from '@mui/material/styles';
import themes, { lightTheme } from './themes';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegisterDialog from '@/components/RegisterDialog';
import RegisterChooseDialog from '@/components/RegisterChooseDialog';
import LoginChooseDialog from '@/components/LoginChooseDialog';
import ForgetDialog from '@/components/ForgetDialog';
import LoginDialog from '@/components/LoginDialog';
import BindEmailDialog from '@/components/BindEmailDialog';
import ResetSuccessDialog from '@/components/ResetSuccessDialog';
import { useInitWeb3, useWalletConnection } from '@/web3/hooks';
import { useDispatch, history, IUserState, useSelector } from 'umi';
import MobileDialog from '@/components/MobileDialog';
import { useImAsyncRedux } from '@/hooks/useIm';
import { hasMobile } from '@/utils';
import NotLogin from '@/components/NotLogin';

const DialogRoot: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <RegisterChooseDialog />
      <RegisterDialog />
      <LoginChooseDialog />
      <LoginDialog />
      <BindEmailDialog />
      <ForgetDialog />
      <MobileDialog />
      <ResetSuccessDialog />
    </>
  );
};
const AuthPages = ['/orders/details'];
const LayoutBody: React.FC<ILayoutProps> = ({ children, location }) => {
  const { pathname, search } = location;
  const { token } = useSelector<any, IUserState>((state) => state.user);
  const hasAuth = AuthPages.some((item: string) => pathname === item);
  const isMobile = hasMobile();
  const dispatch = useDispatch();
  useImAsyncRedux();
  useWalletConnection();
  useInitWeb3();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (isMobile && sessionStorage.getItem('mobile') !== '1') {
      history.push('/mobile', {
        url: `${pathname}${search}`,
      });
    } else {
      dispatch({
        type: 'dialog/hide',
        payload: {
          key: 'mobileDialog',
        },
      });
    }
  }, []);

  if (pathname === '/mobile') {
    return (
      <section className="layout">
        <section className="container">{children}</section>
      </section>
    );
  }

  return (
    <section className="layout">
      <Header />
      <section className="container">
        {hasAuth && !token ? <NotLogin /> : children}
      </section>
      <Footer />
    </section>
  );
};
interface ILayoutProps {
  children: React.ReactNode;
  location: Location;
}

const Layout: React.FC<ILayoutProps> = (props) => {
  return (
    <Web3ReactProvider getLibrary={(provider: any) => new Web3(provider)}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={createTheme({ ...themes, ...lightTheme })}>
          <LayoutBody {...props} />
          {/* <InjectAuth /> */}
          <DialogRoot />
        </ThemeProvider>
      </StyledEngineProvider>
    </Web3ReactProvider>
  );
};

export default Layout;
