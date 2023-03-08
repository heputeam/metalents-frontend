import React from 'react';
import styles from './index.less';

import { CardContent, CardHeader, Tooltip, Typography } from '@mui/material';
import Avatar from '@/components/Avatar';
import { ICardItem } from '@/components/PosterCard';
import LikeService from '@/components/LikeService';
import { useHistory, useSelector } from 'umi';
import { lowPriceToken, numberDecimal, toThousands } from '@/utils';
import classNames from 'classnames';
import VerifiedSVG from '@/assets/imgs/home/verified.svg';

export type IPosterDetailProps = {
  item: ICardItem;
  size?: 'small';
};

const PosterDetail: React.FC<IPosterDetailProps> = ({ item, size }) => {
  const history = useHistory();
  const seller = item.seller || {};
  const service = item.service || {};

  const { tokens } = useSelector((state: any) => state.coins);

  const price = lowPriceToken(service.packages, tokens);

  return (
    <div
      className={classNames(
        styles['poster-detail'],
        size === 'small' && styles['poster-detail-small'],
      )}
    >
      <CardHeader
        classes={{
          root: styles['card-root'],
          avatar: styles['card-avatar'],
          // subheader: styles['card-subheader'],
          action: styles['card-action'],
        }}
        avatar={
          <div
            className={styles['avatar-container']}
            onClick={(e) => {
              e.stopPropagation();
              history.push(
                `/seller/profile?sidebar&tab=services&userId=${item.seller.id}`,
              );
            }}
          >
            <Tooltip
              title={seller.shopName}
              arrow
              placement="top-start"
              classes={{
                tooltip: styles['tooltip'],
                arrow: styles['tooltip-arrow'],
              }}
            >
              <div>
                <Avatar
                  size={30}
                  src={
                    seller.avatar?.fileThumbnailUrl || seller.avatar?.fileUrl
                  }
                >
                  {seller?.nick?.[0]?.toLocaleUpperCase() || 'U'}
                </Avatar>
              </div>
            </Tooltip>
            <Tooltip
              title={seller.shopName}
              arrow
              placement="top"
              classes={{
                tooltip: styles['tooltip'],
                arrow: styles['tooltip-arrow'],
              }}
            >
              <div className={styles['avatar-info']}>
                <div
                  className={styles['card-shopname']}
                  style={{ maxWidth: size === 'small' ? '70px' : '130px' }}
                >
                  <Typography>{seller.shopName}</Typography>
                  {seller.sellerIsVerify === 'verified' && (
                    <img src={VerifiedSVG} alt="" />
                  )}
                </div>
                <span>{`Level ${seller.level || 0} seller`}</span>
              </div>
            </Tooltip>
          </div>
        }
        action={
          price?.budgetToken ? (
            <p>
              <strong>{price && toThousands(price?.budgetAmount)}</strong>
              {price?.budgetToken}
              <span>
                /$
                {toThousands(numberDecimal(price?.totalPrice, 2))}
              </span>
            </p>
          ) : (
            <div className={styles['not-service']}>Not in service</div>
          )
        }
      />
      <CardContent className={styles['card-content']}>
        <a data-underline>{service.title}</a>
        {typeof service?.serviceId === 'number' && (
          <LikeService
            size={26}
            serviceID={service.serviceId}
            sellerID={seller.id}
          />
        )}
      </CardContent>
    </div>
  );
};

export default PosterDetail;
