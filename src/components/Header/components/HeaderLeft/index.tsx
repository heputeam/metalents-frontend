import React from 'react';
import { DotLinks } from '../DotLinks';
import Logo from '../Logo';
import Search from '../Search';
import styles from './index.less';

const HeaderLeft: React.FC = () => {
  return (
    <div className={styles['header-left']}>
      <Logo />
      <DotLinks className={styles['dots']} />
      <Search />
    </div>
  );
};

export default HeaderLeft;
