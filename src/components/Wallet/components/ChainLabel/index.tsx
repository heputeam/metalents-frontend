import React from 'react';
import styles from './index.less';
import BNBNetworkSVG from '@/assets/imgs/selling/BNBNetwork.svg';
import ETHNetworkSVG from '@/assets/imgs/selling/ETHNetwork.svg';

export type IChainLabelProps = {
  value: number;
  label: string;
  type?: string;
};

const ChainLabel: React.FC<IChainLabelProps> = ({
  value,
  label,
  type = 'chain',
}) => {
  return (
    <div className={styles['chain-info']}>
      {type === 'chain' && (
        <img src={value === 1 || value === 4 ? ETHNetworkSVG : BNBNetworkSVG} />
      )}
      <span>{label}</span>
    </div>
  );
};

export default ChainLabel;
