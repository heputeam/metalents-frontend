import { IFile } from '@/types';
import { Card } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useHistory } from 'umi';
import PosterDetail from './components/PosterDetail';
import PosterSwiper from './components/PosterSwiper';
import styles from './index.less';
import StarSVG from './assets/star.svg';
import { ISubServiceInfo } from '@/service/services/types';

export interface ICardItem {
  seller: {
    avatar: IFile; // 头像
    nick: string;
    shopName: string;
    level: number;
    id: number;
    sellerIsVerify: 'verified' | string;
  };
  service: {
    title: string;
    serviceId: number;
    level: number;
    rating: number;
    isFollowing: boolean;
    brochures: IFile[]; // 宣传册
    packages: ISubServiceInfo[];
  };
}

// const Background: React.FC<{ src: string }> = ({ src }) => {
//   return (
//     <div className={styles['card-bg']}>
//       <div>
//         <img src={src} alt="bg" draggable={false} />
//       </div>
//     </div>
//   );
// };

const RatingBox: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className={styles['rating-box']}>
      <img src={StarSVG} alt="star" />
      <span className={styles['rating']}>{rating.toFixed(1)}</span>
    </div>
  );
};

export type IPosterCardProps = {
  item: ICardItem;
  size?: 'small';
};

const PosterCard: React.FC<IPosterCardProps> = ({ item, size }) => {
  const history = useHistory();

  const [index, setIndex] = useState<number>(0);

  // const viewMedia = useMemo(() => {
  //   return item?.service?.brochures?.[index] || {};
  // }, [index]);

  return (
    <Card
      className={styles['card-box']}
      onClick={(ev) => {
        history.push(`/services/${item.service.serviceId}`);
      }}
    >
      <PosterSwiper
        onChange={setIndex}
        index={index}
        items={item.service.brochures}
      />

      <RatingBox rating={item.service.rating || 0} />

      <PosterDetail item={item} size={size} />

      {/* <Background src={viewMedia.fileThumbnailUrl || viewMedia.fileUrl || ''} /> */}
    </Card>
  );
};

export default PosterCard;
