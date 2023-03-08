import React from 'react';
import styles from './index.less';
import { ReactComponent as LoadingSVG } from '@/assets/imgs/header/loading.svg';

const Loading: React.FC<{ className?: string; color?: string }> = ({
  className,
  color,
}) => {
  return (
    <div className={`${styles['loading']} ${className}`}>
      <LoadingSVG fill={color || 'currentColor'} />
    </div>
  );
};

export default Loading;
