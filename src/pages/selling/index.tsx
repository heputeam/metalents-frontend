import React, { useState } from 'react';
import styles from './index.less';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
} from '@mui/material';
import { IUserState, useSelector, history, useDispatch } from 'umi';
import Toast from '@/components/Toast';
import Button from '@/components/Button';
import { USER_TYPE } from '@/define';

const qaList = [
  {
    panel: 'panel1',
    title: 'Difference between metalents and other platforms',
    desc: 'You can find blockchain-related services and talents more conveniently and get the NFT you want faster.',
  },
  // {
  //   panel: 'panel2',
  //   title: 'How much does It cost?',
  //   desc: `It's free to join Metalents. A 50 USDT deposit is required before listing your service. You can keep 98% of each transaction.`,
  // },
  {
    panel: 'panel3',
    title: 'Can I be both a Buyer and a Seller?',
    desc: 'Yes. You can provide services as a seller and seek services as a buyer at the same time.',
  },
  {
    panel: 'panel4',
    title: 'What currencies are used?',
    desc: `Transactions on the platform are paid in currencies such as ETH, BNB, and USDT, which need to be deposited in to your wallet on the platform in advance to reduce gas fees.`,
  },
  {
    panel: 'panel5',
    title: 'How do I price my service?',
    desc: `You can literally price your services how you like - from a minimum of $10 up until whatever sum you feel is fair for the service you provide!`,
  },
  {
    panel: 'panel6',
    title: 'What can I sell?',
    desc: `Be creative! You can offer any service you wish as long as it's legal and complies with our terms. There are other service categories you can browse to get ideas.`,
  },
  {
    panel: 'panel7',
    title: 'How do I get paid?',
    desc: `Once the buyer has confirmed that you have completed your service, money will be transferred to your account. No need to chase clients for payments and you will receive your money in a maximum of 10 days.`,
  },
];
export type ISellingProps = {};

const Selling: React.FC<ISellingProps> = ({}) => {
  const dispatch = useDispatch();
  const { token, userInfo } = useSelector<any, IUserState>(
    (state) => state?.user,
  );
  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  const handleBecomeSeller = () => {
    if (token) {
      if (userInfo?.userType === USER_TYPE.Seller) {
        return Toast.warn('You are already a Seller');
      }
      history.push('/seller/apply');
    } else {
      dispatch({
        type: 'dialog/show',
        payload: {
          key: 'loginChooseDialog',
        },
      });
    }
  };
  return (
    <div className={styles['selling-page']}>
      <div className={styles['seller-wrap']}>
        <Container maxWidth="lg">
          <div className={styles['seller-box']}>
            <h5>Register to be a Metalents Service Provider </h5>
            <p className={styles['text-tip']}>
              Please fill in your information and we will recommend the best
              suitable
              <br /> starting method for you!
            </p>
            <Button
              variant="contained"
              className={styles['become-btn']}
              onClick={handleBecomeSeller}
            >
              Become a Seller
            </Button>
            <div className={styles['tit']}>How It Works?</div>
          </div>
        </Container>
        <div className={styles['how-work-wrap']}>
          <Container maxWidth="lg">
            <div className={styles['how-work-content']}>
              <div className={`${styles['step-item']} ${styles['arrow']}`}>
                <div className={styles['tit']}>01 Create a service</div>
                <div className={styles['desc']}>
                  Sign up for free, set up your Service
                  <br /> and offer your work to our global
                  <br /> audience.
                </div>
              </div>

              <div className={`${styles['step-item']} ${styles['arrow']}`}>
                <div className={styles['tit']}>02 Deliver great work</div>
                <div className={styles['desc']}>
                  Get notified when you receive an order and <br />
                  use our IM system to discuss details with <br />
                  customers.
                </div>
              </div>

              <div className={styles['step-item']}>
                <div className={styles['tit']}>03 Get paid</div>
                <div className={styles['desc']}>
                  Get paid on time , every time. Payment
                  <br /> is transferred to you upon order
                  <br /> completion.
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
      <div className={styles['selling-content']}>
        <div className={styles['qa-wrap']}>
          <h5>Q&A</h5>
          <div className={styles['qa-content']}>
            {qaList.map((v, i) => {
              return (
                <Accordion
                  key={i}
                  expanded={expanded === v.panel}
                  onChange={handleChange(v.panel)}
                  classes={{
                    root: styles['accordion-root'],
                    expanded: styles['accordion-expanded'],
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id={v.panel}
                    classes={{
                      root: styles['sumary-root'],
                      content: styles['sumary-content'],
                    }}
                  >
                    <div className={styles['accordion-title']}>{v.title}</div>
                  </AccordionSummary>
                  <AccordionDetails
                    classes={{ root: styles['accordionDetails-root'] }}
                  >
                    <div className={styles['accordion-desc']}>{v.desc}</div>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selling;
