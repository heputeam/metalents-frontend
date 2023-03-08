import { Typography } from '@mui/material';
import React from 'react';
import { ICardInfo } from '../..';
import Tooltip from '../Tooltip';
import styles from './index.less';
import { ReactComponent as QuoteSVG } from '../../assets/quote.svg';

export interface IInviteInfoCard {
  height: number;
  data: ICardInfo;
}

const InviteInfoCard: React.FC<IInviteInfoCard> = ({ height, data }) => {
  return (
    <div className={styles['info-card']} style={{ height: height }}>
      <div className={styles['header']}>
        <Typography variant="body1">{data?.title}</Typography>
        {data?.extra}
      </div>
      <div className={styles['footer']}>
        {data?.value}
        {data?.tooltip && (
          <Tooltip
            title={
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {data?.tooltip}
              </Typography>
            }
            arrow
            placement="top"
            className={styles['tooltip-content']}
          >
            <QuoteSVG style={{ minHeight: 32 }} />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default InviteInfoCard;
