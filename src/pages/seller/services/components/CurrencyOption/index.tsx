import React from 'react';
import styles from './index.less';

export type ICurrencyOptionProps = {
  iconPath: string;
  currencyName: string;
  className?: string;
};

export type ICurrencyList = (ICurrencyOptionProps & { value: string })[];

const CurrencyOption: React.FC<ICurrencyOptionProps> = ({
  iconPath,
  currencyName,
  className,
}) => {
  return (
    <div className={`${styles['menu-item-content']} ${className}`}>
      <img
        src={iconPath}
        className={styles['icon-img']}
        alt={`${currencyName} Icon`}
        style={{ marginRight: 9 }}
      />

      {currencyName}
    </div>
  );
};

export default CurrencyOption;
