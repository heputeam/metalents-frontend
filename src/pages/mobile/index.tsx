import { Container } from '@mui/material';
import React, { useState } from 'react';
import styles from './index.less';
import MobilePNG from '@/assets/imgs/home/mobile.png';
import Button from '@/components/Button';
import { useLocation, history } from 'umi';

const MobilePage: React.FC = () => {
  const [clickNum, setClickNum] = useState<number>(0);
  const { state } = useLocation() as any;
  const handleClick = () => {
    setClickNum(clickNum + 1);
    sessionStorage.setItem('mobile', '1');
    history.push(state?.url || '/');
  };

  return (
    <div className={styles['mobile-page']}>
      <div className={styles['info']}>
        <div className={styles['content']}>
          <img src={MobilePNG} />
          <div className={styles['text']}>
            Mobile version is coming soon, please use the desktop version for
            now.
          </div>
        </div>
        <Button
          variant="outlined"
          className={styles['btn']}
          onClick={handleClick}
        >
          Continue
        </Button>
        <div className={styles['tip']}>
          If you continue to visit, you may encounter some unknown errors
        </div>
      </div>
    </div>
  );
};

export default MobilePage;
