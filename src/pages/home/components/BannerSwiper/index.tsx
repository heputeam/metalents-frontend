import styles from './index.less';
import 'swiper/swiper.min.css';
import { Pagination, Navigation, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import classNames from 'classnames';
import { useRequest } from 'ahooks';
import { Toast } from '@/components/Toast';
import { getBanners } from '@/service/general';
import NavLink from '@/components/NavLink';

// install Swiper modules
// SwiperCore.use([Pagination, Navigation]);

const index = () => {
  const { data } = useRequest(() => getBanners(1), {
    onSuccess: (data: any) => {
      const { code } = data;
      if (code !== 200) {
        Toast.error('Unknown system failure: Please try');
      }
    },
  });

  return (
    <>
      <Swiper
        slidesPerView={1}
        speed={500}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
          el: '.customPagination',
          type: 'bullets',
          renderBullet: (index, classname) => {
            return `<li key={${index}} class='${classname}'></li>`;
          },
          bulletActiveClass: styles['current-pagination'],
        }}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className={styles['mySwiper']}
      >
        {data?.data?.list?.map((item: any) => {
          return (
            <SwiperSlide
              className={styles['swiperSlide']}
              key={item.background}
            >
              {/* <p className={styles['banner-title']}>{item?.title}</p> */}
              {item?.url ? (
                <NavLink path={item?.url}>
                  <img src={item?.background} alt="" />
                </NavLink>
              ) : (
                <img src={item?.background} alt="" />
              )}
              {item?.url ? (
                <NavLink path={item?.url}>
                  <div className={styles['mask']}></div>
                  <p className={styles['banner-title']}>{item?.title}</p>
                </NavLink>
              ) : (
                <>
                  <div className={styles['mask']}></div>
                  <p className={styles['banner-title']}>{item?.title}</p>
                </>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
      <ul
        className={classNames('customPagination', styles['customPagination'])}
      ></ul>
    </>
  );
};

export default index;
