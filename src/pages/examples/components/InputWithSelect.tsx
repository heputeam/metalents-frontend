import InputWithSelect from '@/components/InputWithSelect';
import React, { useEffect, useState } from 'react';
import ETHIconSVG from '@/assets/imgs/selling/ETHIcon.svg';
import USDTIconSVG from '@/assets/imgs/selling/USDTIcon.svg';
import BNBIconSVG from '@/assets/imgs/selling/BNBIcon.svg';
import styles from './options.less';

const options = [
  {
    label: (
      <div className={styles['menu-item-content']}>
        <img
          src={ETHIconSVG}
          className={styles['icon-img']}
          alt="ETH Icon"
          style={{ marginRight: 9 }}
        />
        ETH
      </div>
    ),
    value: 'eth',
  },
  {
    label: (
      <div className={styles['menu-item-content']}>
        <img
          src={USDTIconSVG}
          className={styles['icon-img']}
          alt="USDT Icon"
          style={{ marginRight: 9 }}
        />
        USDT(ETH)
      </div>
    ),
    value: 'usdt',
  },
  {
    label: (
      <div className={styles['menu-item-content']}>
        <img
          src={BNBIconSVG}
          className={styles['icon-img']}
          alt="BNB Icon"
          style={{ marginRight: 9 }}
        />
        BNB
      </div>
    ),
    value: 'bnb',
  },
];

const InputWithSelectExample: React.FC = () => {
  const [inputValue, setInputValue] = useState('1698981987465');
  const [menuValue, setMenuValue] = useState<string | number>('eth');

  useEffect(() => {
    console.log(`inputValue: ${inputValue}, menuValue: ${menuValue}`);
  }, [inputValue, menuValue]);

  return (
    <InputWithSelect
      options={options}
      placeholder={'Enter...'}
      // disabled={true}
      // error={true}
      inputValue={inputValue}
      onInputChange={setInputValue}
      menuValue={menuValue}
      onMenuChange={setMenuValue}
    />
  );
};

export default InputWithSelectExample;
