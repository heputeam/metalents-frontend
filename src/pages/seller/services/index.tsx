import { Container, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import EmptyService from './components/EmptyService';
import ServicesList from './components/ServicesList';
import styles from './index.less';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { history, useSelector } from 'umi';
import { useRequest } from 'ahooks';
import { IUserServiceInfo, ServiceStatus } from '@/service/services/types';
import { IUserState } from '@/models/user';
import { IResponse } from '@/service/types';
import Loading from '@/components/Loading';

import { postUserServices } from '@/service/user';
import { UserStatus } from '@/service/user/types';

const MyServices: React.FC = () => {
  const uid = useSelector<any, IUserState>((state) => state.user.uid);
  const [page, setPage] = useState<number>(1);
  const { userInfo } = useSelector<any, IUserState>((state) => state.user);

  const pageSize = 10;
  const [serviceData, setServiceData] = useState<IUserServiceInfo | undefined>({
    total: 0,
    list: null,
    overview: {
      total: 0,
      pause: 0,
      close: 0,
      delete: 0,
      live: 0,
    },
  });

  const [status, setStatus] = useState<ServiceStatus[]>([]);

  const {
    data: userServiceInfo,
    loading,
    run: getUserService,
  } = useRequest<IResponse<IUserServiceInfo>, any>(
    () =>
      postUserServices({
        offset: (page - 1) * pageSize,
        pageSize: pageSize,
        status: status,
        userId: uid,
      }),
    {
      manual: true,
    },
  );

  useEffect(() => {
    getUserService();
  }, [page, pageSize, uid, status]);

  useEffect(() => {
    setServiceData(userServiceInfo?.data);
  }, [userServiceInfo]);

  const handleCreate = () => {
    if (
      userInfo?.status === UserStatus.DISABLE ||
      userInfo?.status === UserStatus.DISABLE_SELLER
    ) {
      Toast.error(
        'Your account is disabled. Please contact Metalents Customer Service.',
      );
    } else {
      history.push('/seller/services/basic');
    }
  };

  const handlePage = (event: object, page: number) => {
    setPage(page);
  };

  const includeStatus = (itemStatus: ServiceStatus[]) => {
    return itemStatus?.every((item) => status?.includes(item));
  };
  const { config } = useSelector((state: any) => state.config);

  return (
    <section className={styles['my-services']}>
      <Container disableGutters>
        <Stack direction="row" justifyContent="space-between" mt={18}>
          <Typography variant="h2" className={styles['header-title']}>
            My Services
          </Typography>
          {Number(userInfo?.bond) >= Number(config?.BOND_AMOUNT?.cfgVal) && (
            <Button variant="contained" onClick={handleCreate}>
              Create New Service
            </Button>
          )}
        </Stack>
        <Grid container columnSpacing={31} mt={25}>
          <Grid item xs={3}>
            <Button
              size="large"
              variant={status?.length === 0 ? 'contained' : 'outlined'}
              className={`${styles['init-btn']} ${
                status?.length === 0 ? styles['active'] : ''
              }`}
              onClick={() => setStatus([])}
            >
              All Status&nbsp;
              <span className={styles['overview-num']}>{`(${
                serviceData?.overview?.total || 0
              })`}</span>
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              size="large"
              variant={
                includeStatus([ServiceStatus.LIVE, ServiceStatus.PAUSE])
                  ? 'contained'
                  : 'outlined'
              }
              className={`${styles['init-btn']} ${
                status === [ServiceStatus.LIVE, ServiceStatus.PAUSE] &&
                styles['status-btn']
              } ${
                includeStatus([ServiceStatus.LIVE, ServiceStatus.PAUSE])
                  ? styles['active']
                  : ''
              }`}
              onClick={() =>
                setStatus([ServiceStatus.LIVE, ServiceStatus.PAUSE])
              }
            >
              Live Services&nbsp;
              <span className={styles['overview-num']}>{`(${
                Number(serviceData?.overview?.live) +
                  Number(serviceData?.overview?.pause) || 0
              })`}</span>
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              size="large"
              variant={
                includeStatus([ServiceStatus.CLOSE]) ? 'contained' : 'outlined'
              }
              className={`${styles['init-btn']} ${
                includeStatus([ServiceStatus.CLOSE]) ? styles['active'] : ''
              }`}
              onClick={() => setStatus([ServiceStatus.CLOSE])}
            >
              Closed Services&nbsp;
              <span className={styles['overview-num']}>{`(${
                serviceData?.overview?.close || 0
              })`}</span>
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              size="large"
              variant={
                includeStatus([ServiceStatus.DELETE]) ? 'contained' : 'outlined'
              }
              className={`${styles['init-btn']} ${
                includeStatus([ServiceStatus.DELETE]) ? styles['active'] : ''
              }`}
              onClick={() => setStatus([ServiceStatus.DELETE])}
            >
              Disabled Services&nbsp;
              <span className={styles['overview-num']}>{`(${
                serviceData?.overview?.delete || 0
              })`}</span>
            </Button>
          </Grid>
        </Grid>
        <div className={styles['content-box']}>
          {loading ? (
            <Loading className={styles['service-loading']} />
          ) : !serviceData?.overview?.total ? (
            <EmptyService depositStatus={config?.BOND_AMOUNT?.cfgName} />
          ) : (
            <ServicesList
              depositStatus={config?.BOND_AMOUNT?.cfgName}
              serviceData={serviceData}
              pageSize={pageSize}
              page={page}
              handlePage={handlePage}
              updateUserService={getUserService}
            />
          )}
        </div>
      </Container>
    </section>
  );
};

export default MyServices;
