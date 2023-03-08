import React from 'react';
import styles from './index.less';
import PersonSVG from '@/assets/imgs/request/person.svg';

export type INoOfferProps = {};

const NoOffer: React.FC<INoOfferProps> = ({}) => {
  return (
    <div className={styles['no-offer-wrap']}>
      <img src={PersonSVG} alt="" />
      <span>Sorry! No offers found.</span>
    </div>
  );
};

export default NoOffer;
