import React from 'react';
import styles from './index.less';
import NavLink from '@/components/NavLink';
import LogoSVG from '@/assets/imgs/header/logo.svg';

export type ILogoProps = {};

const Logo: React.FC<ILogoProps> = ({}) => {
  return (
    <div className={styles['logo']}>
      <h1 className={styles['title']}>
        <NavLink path="/">
          <img src={LogoSVG} />
        </NavLink>
      </h1>
    </div>
  );
};

export default Logo;
