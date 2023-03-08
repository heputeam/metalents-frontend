import React from 'react';
import styles from './index.less';
import { Container, Stack } from '@mui/material';
import Sidebar from './components/Sidebar';
import { useLocation } from 'umi';

export type ISellerLayoutProps = {};

const SellerLayout: React.FC<ISellerLayoutProps> = ({ children }) => {
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

export default SellerLayout;
