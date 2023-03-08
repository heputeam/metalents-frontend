import BannerSwiper from './components/BannerSwiper';
import styles from './index.less';
import incisionBgPng from './assets/incision-bg.png';
import requestCenterPng from './assets/requestCenter.png';
import { budgetMax, ISearchFilterValue } from './components/SelectOptions';
import SelectOptions from './components/SelectOptions';
import Products from './components/Products';
import {
  useSelector,
  history,
  useLocation,
  IMenuState,
  useDispatch,
} from 'umi';
import Toast from '@/components/Toast';
import { useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import Button from '@/components/Button';
import { getCanCreate } from '@/service/requests';
import { Container, Grid, Typography } from '@mui/material';
import { IUserInfo } from '@/service/user/types';
import { ESortBy } from './components/SelectOptions/config';

const HomePage = () => {
  const { query, search }: any = useLocation();

  const [showBanner, setShowBanner] = useState<boolean>(true);

  useEffect(() => {
    if (!search) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [search]);

  const { menus: menuData } = useSelector<any, IMenuState>(
    (state) => state.menus,
  );
  const { uid } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const { config } = useSelector((state: any) => state.config);

  const { run: checkCreate } = useRequest(() => getCanCreate(), {
    manual: true,
    onSuccess: (res: any) => {
      const { code } = res;
      if (code === 200) {
        history.push('/account/apply');
      } else if (code === 30032) {
        // 三个等待着
        return Toast.error(
          `Oops! You already have ${config?.REQ_WAITING_COUNT?.cfgVal} requests in waiting.`,
        );
      } else if (code === 30031) {
        //  账户禁用
        return Toast.error(
          'Your account is disabled. Please contact Metalents Customer Service.',
        );
      } else if (code === 403) {
        dispatch({
          type: 'dialog/show',
          payload: {
            key: 'loginChooseDialog',
          },
        });
      } else {
        return Toast.error('Unknown system failure: Please try');
      }
    },
  });

  const [filterValue, setFilterValue] = useState<ISearchFilterValue>({
    budget_max: budgetMax,
    budget_min: 10,
    deliver_dayValue: 30,
    coinId: [],
    optionIds: [],
    services_3star: false,
    sortBy: ESortBy?.sellerRecommendFirst,
  });

  const handleRequest = () => {
    if (!uid) {
      dispatch({
        type: 'dialog/show',
        payload: {
          key: 'loginChooseDialog',
        },
      });
    } else {
      history.push('/account/apply');
    }
  };

  return (
    <div className={styles['home-page']}>
      {showBanner && (
        <div className={styles['banner-container']}>
          <Container maxWidth="lg" className={styles['banner-box']}>
            <div className={styles['banner-left']}>
              <BannerSwiper />
            </div>

            <div className={styles['banner-right']}>
              <div className={styles['right-title']}>
                Metalents Popular Functions
              </div>
              <Grid container spacing={20} sx={{ boxSizing: 'border-box' }}>
                <Grid item xs={6} className={styles['grid-box']}>
                  <div
                    className={styles['reward-center']}
                    onClick={() => history.push('/invite')}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Reward Center
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6} className={styles['grid-box']}>
                  <div
                    className={styles['open-jobs']}
                    onClick={() => history.push('/request/market')}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Browse Open Jobs
                    </Typography>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={6}
                  className={styles['grid-box']}
                  sx={{ mt: 20 }}
                >
                  <div
                    className={styles['request-job']}
                    onClick={handleRequest}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Request a Job
                    </Typography>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={6}
                  className={styles['grid-box']}
                  sx={{ mt: 20 }}
                >
                  <div
                    className={styles['become-seller']}
                    onClick={() => history.push('/selling')}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Become a Seller
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
      )}

      <Container maxWidth="lg" sx={{ mt: showBanner ? 0 : 80 }}>
        <div className={styles['homepage-container']}>
          {/* Poster List 部分 */}
          <div className={styles['poster-container']}>
            <div className={styles['poster-header']}>
              {query?.search ? (
                <h1
                  className={styles['category']}
                >{`Search for "${query.search}"`}</h1>
              ) : (
                <h1 className={styles['category']}>
                  {`${query?.tab || 'All services'} ${
                    query?.type ? ` / ${query?.type}` : ''
                  }`}
                </h1>
              )}

              <div className={styles['poster-options']}>
                <SelectOptions value={filterValue} onChange={setFilterValue} />
                <Products filterValue={filterValue} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
