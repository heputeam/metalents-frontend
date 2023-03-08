import { Tooltip, Typography } from '@mui/material';
import React from 'react';
import styles from './index.less';
import Flags from 'country-flag-icons/react/3x2';
import ClockSVG from '@/assets/imgs/account/sidebar/clock.svg';
import StarSVG from '@/assets/imgs/seller/sidebar/star.svg';
import Avatar from '../Avatar';
import { toThousands } from '@/utils';

export type IAvatarAndInfoProps = {
  location?: string;
  avatar?: string;
  userName?: string;
  timezone?: string;
  level?: number;
  rating?: number;
  orderCount?: number;
  isRatingVisible?: boolean;
};

type ICountryType = keyof typeof Flags;

const userTimezone = new Date().getTimezoneOffset() / -60;

const AvatarAndInfo: React.FC<IAvatarAndInfoProps> = ({
  location,
  avatar,
  userName,
  timezone,
  level = 0,
  rating = 0,
  orderCount = 0,
  isRatingVisible = true,
}) => {
  const Flag = location ? Flags[location as ICountryType] : null;
  return (
    <div className={styles['avatar-and-info']}>
      <Avatar
        size={107}
        sx={{
          width: 107,
          height: 107,
          margin: '0 auto',
          fontSize: '60px',
        }}
        src={avatar}
      >
        {userName?.slice(0, 1)?.toLocaleUpperCase()}
      </Avatar>

      <div className={styles['level']}>
        <Typography variant="caption">{`Lv.${level}`}</Typography>
      </div>

      <div className={styles['user-name-container']}>
        {userName && (
          <Typography
            variant="body1"
            // component="div"
            sx={{ fontSize: 18 }}
            className={styles['user-name']}
          >
            {userName}
          </Typography>
        )}
      </div>

      {location && timezone && (
        <div className={styles['country-and-time']}>
          {Flag ? <Flag title={location} className={styles['flag']} /> : <></>}

          <Typography
            variant="caption"
            component="span"
            className={styles['country-name']}
          >
            {location}
          </Typography>

          <Typography
            variant="caption"
            component="span"
            className={styles['time']}
          >
            (
          </Typography>

          <img src={ClockSVG} alt="clock" />

          <Typography
            variant="caption"
            component="span"
            className={styles['time']}
          >
            {`${new Date().getHours() + Number(timezone) - userTimezone}:${(
              Array(2).join('0') + new Date().getMinutes()
            ).slice(-2)})`}
          </Typography>
        </div>
      )}

      {isRatingVisible && (
        <div className={styles['rating-and-orders-count']}>
          <img src={StarSVG} alt="star" className={styles['star-img']} />

          <Typography
            variant="caption"
            component="span"
            className={styles['rating']}
          >
            {rating || '-'}
          </Typography>

          <Typography
            variant="caption"
            component="span"
            className={styles['orders-count']}
          >
            {`(${toThousands(orderCount)} ${
              Number(orderCount) > 2 ? 'Orders' : 'Order'
            })`}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default AvatarAndInfo;
