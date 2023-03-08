import Button from '@/components/Button';
import React, { useState } from 'react';
import styles from './index.less';
import BscExplorerIconSVG from '@/assets/imgs/seller/apply/bscExplorerIcon.svg';
import ApplySuccessSVG from '@/assets/imgs/seller/apply/applySuccess.svg';
import { history } from 'umi';

export type IStep3Props = {};

const Step3: React.FC<IStep3Props> = ({}) => {
  const [isNext, setIsNext] = useState<boolean>(false);
  return (
    <div className={styles['step3-wrap']}>
      <div className={styles['header']}>
        <h5>Congratulations</h5>
      </div>
      {!isNext ? (
        <div className={styles['pay-before-box']}>
          <div className={styles['tips']}>
            Congratulations! You have filled in all the required information and
            you are now a new seller!
          </div>
          <div className={styles['sub-tips']}>
            You are just two steps away to providing your own services.
          </div>
          <div className={styles['icon-box']}>
            <img src={ApplySuccessSVG} alt="" />
          </div>
          <div className={styles['pay-tips']}>
            For each successful completion of an order, the Metalents service
            provider will
            <br /> receive a FREE <span>Metalents NFT Transaction</span> card.
          </div>
          <div className={styles['button-box']}>
            <Button
              onClick={() => setIsNext(true)}
              variant="contained"
              size="large"
              sx={{ width: '240px', height: '48px' }}
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles['pay-after-box']}>
          <div className={styles['tips']}>
            The NFT card will be sent to the seller's in-platform wallet. You
            can click on the blockchain browser icon{' '}
            <img src={BscExplorerIconSVG} /> on each order to view it.
          </div>
          <div className={styles['sub-tips']}>
            Later Metalents will support sellers to withdraw the NFT to your own
            wallet.
          </div>
          <div className={styles['icon-box']}>
            <img src="/imgs/seller/nft.gif" alt="" />
          </div>
          <div className={styles['server-tip']}>
            Create your first service and then start to provide services.
          </div>
          <div className={styles['button-box']}>
            <Button
              variant="outlined"
              size="large"
              sx={{ width: '240px' }}
              onClick={() => history.replace('/invite')}
            >
              To Early Bird
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{ width: '240px', ml: 20 }}
              onClick={() => history.replace('/seller/services/basic')}
            >
              Create a service
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3;
