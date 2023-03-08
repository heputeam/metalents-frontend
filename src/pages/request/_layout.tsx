import React from 'react';
import styles from './index.less';
import { Box, Container } from '@mui/material';
// import Sidebar from './components/Sidebar';
import { useLocation } from 'umi';
import Sidebar from '../seller/components/Sidebar';
import { useBanner } from '@/hooks/useGeneral';
import NavLink from '@/components/NavLink';

export type IReqeustLayoutProps = {};

const ReqeustLayout: React.FC<IReqeustLayoutProps> = ({ children }) => {
  const { query, pathname } = useLocation() as any;
  const showSidebar = query.sidebar !== undefined;
  const { bannerData } = useBanner(2);
  const bannerShow: boolean = ['/request/market'].includes(pathname);
  return (
    <div>
      {bannerShow &&
        bannerData?.list?.map((item: any) => {
          return (
            <Box
              component={item?.url && item?.url !== 'string' ? NavLink : Box}
              path={item?.url}
              key={item?.id}
            >
              <div
                className={styles['market-banner']}
                style={{ backgroundImage: `url(${item?.background})` }}
              ></div>
            </Box>
          );
        })}
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
    </div>
  );
};

export default ReqeustLayout;
