import Pagination from '@/components/Pagination';
import PosterCard, { ICardItem } from '@/components/PosterCard';
import { Grid, Theme, Typography, useMediaQuery } from '@mui/material';
import { usePagination } from 'ahooks';
import styles from './index.less';
import NoServiceSVG from '@/assets/imgs/home/noService.svg';
import { ISearchFilterValue } from '../SelectOptions';
import { IMenuState, IUserState, useLocation, useSelector } from 'umi';
import Loading from '@/components/Loading';
import { postSearchServices } from '@/service/general';
import { ISearchServiceParams } from '@/service/general/types';

export interface IProductsProps {
  filterValue: ISearchFilterValue;
}

const Products: React.FC<IProductsProps> = ({ filterValue }) => {
  const { query }: any = useLocation();

  const { menus: menuData } = useSelector<any, IMenuState>(
    (state) => state.menus,
  );

  const { uid } = useSelector<any, IUserState>((state) => state.user);

  const {
    data: userServices,
    pagination,
    loading,
  } = usePagination<
    any,
    [Omit<ISearchServiceParams, 'offset'> & { current: number }]
  >(
    async ({ current, pageSize }) => {
      const params: ISearchServiceParams = {
        offset: (current - 1) * 15,
        pageSize,
        sortType: filterValue.sortBy,
        budgetMax: String(filterValue.budget_max),
        budgetMin: String(filterValue.budget_min),
        coinId: filterValue.coinId,
        optionIds: filterValue.optionIds,
        deliverTime: filterValue.deliver_dayValue,
        avgScope: filterValue.services_3star ? '3' : undefined,
        keyword: query?.search,
        category: query?.tab,
        subcategory: query?.type,
      };
      // ISearchServiceResp
      const resp = await postSearchServices(params);

      return {
        total: resp.data.total,
        list: resp.data.list ?? [],
      };
    },
    {
      // ready: !!uid && !!menuData?.[0],
      defaultPageSize: 15,
      refreshDeps: [filterValue],
      onSuccess: (response) => {
        console.log('get_user_posts resp: ', response);
      },
    },
  );

  const isMD = useMediaQuery((theme: Theme) => {
    return theme.breakpoints.down('md');
  });

  return (
    <>
      {loading && (
        <div className={styles['loading-box']}>
          <Loading className={styles['loading']} />
        </div>
      )}

      {!loading && (!userServices || userServices.list?.length === 0) && (
        <div className={styles['no-service-box']}>
          <div className={styles['no-service']}>
            <img src={NoServiceSVG} />
            <Typography
              className={styles['str-no-service']}
            >{`Sorry! No related services now.`}</Typography>
          </div>
        </div>
      )}

      {!loading && userServices && userServices.list?.length > 0 && (
        <>
          <Grid container spacing={22}>
            {userServices?.list.map((serviceInfo: any, index: number) => {
              const cardData: ICardItem = {
                seller: {
                  avatar: serviceInfo.userAvatar,
                  nick: serviceInfo.shopname,
                  shopName: serviceInfo.shopname,
                  level: serviceInfo.sellerLevels,
                  id: serviceInfo.userId,
                  sellerIsVerify: serviceInfo.sellerIsVerify,
                },
                service: {
                  title: serviceInfo.title,
                  level: serviceInfo.scope,
                  serviceId: serviceInfo.id,
                  isFollowing: serviceInfo.isFollowing,
                  brochures: serviceInfo.posts,
                  packages: serviceInfo.subServices,
                  rating: serviceInfo.scope,
                },
              };

              return (
                <Grid
                  item
                  xs={4}
                  // md={6}
                  // lg={4}
                  key={index}
                  // sx={{ width: isMD ? '100vw' : '' }}
                >
                  <PosterCard item={cardData} />
                </Grid>
              );
            })}
          </Grid>
          {userServices.total > 0 && (
            <p className={styles['total-count']}>
              Total <span>{userServices.total}</span> services found
            </p>
          )}
          {userServices.total > 15 && (
            <Pagination
              classes={{ ul: styles['pagination-ul'] }}
              total={userServices.total}
              size={pagination.pageSize}
              current={pagination.current}
              onChange={(_, targetPage) => {
                pagination.changeCurrent(targetPage);
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default Products;
