import React from 'react';
import styles from './index.less';

export interface ILevel {
  level: number;
  className?: string;
}

const Level: React.FC<ILevel> = ({ level, className }) => {
  return <div className={`${styles['level']} ${className}`}>Lv.{level}</div>;
};

export default Level;
