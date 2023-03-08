import React from 'react';
import styles from './index.less';
import { IFile } from '@/types';

import MediaItem from '../SwiperMediaItem/index';
import { IconButton } from '@mui/material';
import { Pagination, Navigation } from 'swiper';
import {
  Swiper,
  SwiperProps,
  SwiperSlide,
  useSwiper,
} from 'swiper/react/swiper-react';

import ArrawSVG from '../../assets/arrow.svg';
// import SwiperMediaItem from '../SwiperMediaItem/index';
import { uid } from 'react-uid';

export type IPosterSwiperProps = {
  index: number; // 当前选中Item
  onChange?: (index: number) => void; // 变更Item
  items: IFile[]; // 集合
};

interface ISwiperControlProps {
  total: number;
}

const SwiperController: React.FC<ISwiperControlProps> = ({ total }) => {
  const swiper = useSwiper();

  return (
    <>
      <div className={styles['swiper-controllers']}>
        {swiper.activeIndex > 0 && (
          <IconButton
            classes={{ root: styles['next-btn'] }}
            sx={{ marginRight: 'auto' }}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              swiper.slidePrev();
            }}
          >
            <img src={ArrawSVG} alt="ArrawSVG" />
          </IconButton>
        )}

        {swiper.activeIndex + 1 < total && (
          <IconButton
            classes={{ root: styles['next-btn'] }}
            size="small"
            sx={{ marginLeft: 'auto' }}
            onClick={(e) => {
              e.stopPropagation();
              swiper.slideNext();
            }}
          >
            <img
              src={ArrawSVG}
              alt="ArrawSVG"
              style={{ transform: 'rotate(180deg)' }}
            />
          </IconButton>
        )}
      </div>
      <div className={styles['pager']}>
        <div className="swiper-pagination" />
      </div>
    </>
  );
};
const PosterSwiper: React.FC<IPosterSwiperProps> = ({
  index,
  onChange,
  items,
}) => {
  // const swiperID = `swiper_${uid(items)}`;
  // const [active, setActive] = useState<boolean>(false);
  const swiperConfig: SwiperProps = {
    modules: [Pagination, Navigation],
    onSlideChange: (slide) => {
      onChange?.(slide.activeIndex);
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };
  // const handleHover = () => {
  //   if (!active) {
  //     setActive(true);
  //   }
  // };

  // const handleUnActive = () => {};

  // const defFile = useMemo(() => {
  //   return items[index];
  // }, [index]);

  return (
    <div className={styles['swiper-box']}>
      {/* {!active ? (
        <SwiperMediaItem item={defFile} index={index} />
      ) : ( */}
      <Swiper {...swiperConfig}>
        {items.map((v, k) => (
          <SwiperSlide key={uid(k)}>
            <MediaItem item={v} index={index} />
          </SwiperSlide>
        ))}
        {items.length > 1 ? <SwiperController total={items.length} /> : null}
      </Swiper>
      {/* )} */}
    </div>
  );
};

export default PosterSwiper;
