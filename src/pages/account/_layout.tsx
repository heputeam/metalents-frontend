import React from 'react';
import styles from './index.less';
import { Container } from '@mui/material';
import Sidebar from './components/Sidebar';
import { useLocation } from 'umi';

export type IAccountLayoutProps = {};

const AccountLayout: React.FC<IAccountLayoutProps> = ({ children }) => {
  const { query } = useLocation() as any;
  const showSidebar = query.sidebar !== undefined;
  return (
    <Container
      maxWidth="lg"
      className={styles['layout-container']}
      disableGutters
    >
      {showSidebar && <Sidebar />}

      <div
        className={`${styles['layout-body']} ${
          styles[showSidebar ? 'small-page' : 'full-page']
        }`}
      >
        {children}
      </div>
    </Container>
  );
};

export default AccountLayout;
