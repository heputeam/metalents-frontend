import React, { ReactChild } from 'react';
import styles from './index.less';

interface IOptionItem {
  children?: ReactChild[] | ReactChild;
  label: string;
  className?: string;
}

const OptionItem = ({ children, label, className }: IOptionItem) => {
  return (
    <div className={`${styles['OptionItem-container']} ${className}`}>
      <p>{label}</p>
      <div className={styles['wrapperOption']}>{children}</div>
    </div>
  );
};

export default OptionItem;
