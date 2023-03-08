import React from 'react';
import styles from './index.less';
import BasicBar from './components/BasicBar';
import TabBar from './components/TabBar';
import { useLocation } from 'umi';

export type IHeaderProps = {};

const Header: React.FC<IHeaderProps> = ({}) => {
  const { pathname } = useLocation() as any;

  return (
    <header className={styles['header']}>
      <BasicBar />
      {pathname === '/' && <TabBar />}
    </header>
  );
};

export default Header;
