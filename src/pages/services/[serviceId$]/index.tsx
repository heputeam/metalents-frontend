import { ReactChild, useEffect, useState } from 'react';
import {
  IMenuState,
  IUserState,
  useHistory,
  useLocation,
  useRouteMatch,
  useSelector,
} from 'umi';
import styles from './index.less';
import Comments from '../components/comments';
import Description, { IMenuOptionItem } from '../components/description';
import Transaction from '../components/transaction';
import { AboutSeller } from './components/AboutSeller';
import { ComparePackage } from './components/ComparePackage';
import { IResDetail, IResMainService, ISellerInfo, ServiceTabs } from './type';
import { Tabs } from '@/components/Tabs';
import MediaSwiper from '@/components/MediaSwiper';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import MyRating from '@/components/Rating';
import Avatar from '@/components/Avatar';
import classNames from 'classnames';
import ShareSVG from '@/assets/imgs/services/share.svg';
import { useRequest, useUpdateEffect } from 'ahooks';
import ServiceSubmit from './components/ServiceSubmit';
import { IResponse } from '@/service/types';
import LikeService from '@/components/LikeService';
import Toast from '@/components/Toast';
import { getOptionSelect } from '@/utils/menuOptions';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getServiceByMain, getServiceDetail } from '@/service/services';
import NoServicesPackage from './components/NoServicesPackage';
import { IFileWithStatus } from '@/hooks/useSwiperContent';
import Loading from '@/components/Loading';
import ServiceDisabledPage from '@/pages/seller/services/disabled';
import VerifiedSVG from '@/assets/imgs/home/verified.svg';

interface IServices {
  children: ReactChild;
}

const Services = ({}: IServices) => {
  const { query, pathname, state } = useLocation() as any;
  // query?.tab
  const { params } = useRouteMatch() as any;
  // params?.serviceId
  const history = useHistory();
  const [tabValue, setTabValue] = useState(
    // query?.tab ? query?.tab : 'description',
    'description',
  );

  useEffect(() => {
    if (query.tab && query.tab !== tabValue) {
      setTabValue(query.tab);
    }
  }, [query]);
  const [sellerInfo, setSellerInfo] = useState<ISellerInfo>();

  const [swiperContent, setSwiperContent] = useState<IFileWithStatus[]>([]);
  // Request 请求主体信息
  const {
    data: detailData,
    loading: detailLoading,
    run: updateDetail,
  } = useRequest<IResponse<IResDetail>, any>(
    () => {
      return getServiceDetail(params.serviceId, state?.subServerId);
    },
    {
      manual: true,
    },
  );

  useEffect(() => {
    updateDetail(params.serviceId, state?.subServerId);
  }, [params.serviceId]);

  useEffect(() => {
    setUserId(detailData?.data?.userId);
  }, [detailData]);

  const [menuColor, setMenuColor] = useState<string>('');

  const [userId, setUserId] = useState<number>();

  const { favServices } = useSelector<any, IUserState>((state) => state.user);

  const initialFollowing =
    !!favServices?.length &&
    favServices?.some(
      (service) => String(service.service_id) === params.serviceId,
    );

  // 动态菜单
  const { menus: menuData } = useSelector<any, IMenuState>(
    (state) => state.menus,
  );
  const [menu, setMenu] = useState<IMenuOptionItem[]>([]);

  useUpdateEffect(() => {
    if (detailData?.code === 200) {
      setSwiperContent(
        detailData?.data.posts.map((item) => ({
          ...item,
          fid: String(item.id || Date.now()),
          status: 'success',
        })) || [],
      );
    }

    if (detailData?.code === 200 && menuData) {
      const menuOption = getOptionSelect(
        menuData,
        detailData.data.category,
        detailData.data.subcategory,
      );
      // console.log('getOptionSelect', menuOption)
      const menuArr = [];
      for (const key in menuOption) {
        if (Object.prototype.hasOwnProperty.call(menuOption, key)) {
          const element = menuOption[key];
          menuArr.push({
            key: key,
            value: (element as any[]).map((item) => item.valueName).join(','),
          });
        }
      }
      setMenu(menuArr as IMenuOptionItem[]);

      const tempCategory = menuData?.filter(
        (item) => item?.serviceName === detailData.data.category,
      );
      const tempColor = tempCategory?.[0]?.serviceColor;
      setMenuColor(tempColor);
    }
  }, [detailData, menuData]);

  // Request 请求顶部两个计数信息
  const { data: mainServiceData, run: runGetSubServer } = useRequest<
    IResponse<IResMainService>,
    any
  >(
    (serviceId: number) => {
      return getServiceByMain(serviceId);
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (state?.subServerId) {
      return runGetSubServer(detailData?.data?.id);
    } else {
      runGetSubServer(params.serviceId);
    }
  }, [detailData]);

  return (
    <>
      {detailLoading ? (
        <div className={styles['loading-box']}>
          <Loading className={styles['loading']} />
        </div>
      ) : (
        <>
          {
            // 服务被禁用，跳转禁用页面
            detailData?.code === 20328 ? (
              <ServiceDisabledPage />
            ) : (
              <div className={styles['service-container']}>
                <div className={styles['header-container']}>
                  <div className={styles['header-left']}>
                    <Box
                      className={styles['type-tag']}
                      sx={{ background: menuColor }}
                    >
                      <Typography variant="body2">{`${detailData?.data?.category} / ${detailData?.data?.subcategory}`}</Typography>
                    </Box>
                    <div className={styles['service-title']}>
                      {detailData?.data?.title}
                    </div>

                    <div className={styles['shop-info']}>
                      <Avatar
                        size={40}
                        src={sellerInfo?.avatar}
                        className={styles['avatar']}
                        onClick={() =>
                          history.push(
                            `/seller/profile?sidebar&userId=${sellerInfo?.userId}`,
                          )
                        }
                      >
                        {sellerInfo?.shopname?.slice(0, 1)?.toLocaleUpperCase()}
                      </Avatar>

                      <Stack
                        className={styles['rest-shop-info']}
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={15}
                      >
                        <div className={styles['stack-item-1']}>
                          <Typography
                            variant="h2"
                            classes={{ root: styles['shop-name'] }}
                            onClick={() =>
                              history.push(
                                `/seller/profile?sidebar&userId=${sellerInfo?.userId}`,
                              )
                            }
                          >
                            {sellerInfo?.shopname}
                          </Typography>
                          {sellerInfo?.isVerify === 'verified' && (
                            <img
                              src={VerifiedSVG}
                              alt=""
                              width={22}
                              style={{ marginLeft: 10 }}
                            />
                          )}
                        </div>

                        <div className={styles['stack-item-2']}>
                          <MyRating
                            value={Number(detailData?.data?.scope || 0)}
                            size={18}
                            className={styles['rating']}
                            precision={0.1}
                            readOnly
                          />

                          <Typography classes={{ root: styles['rated-count'] }}>
                            ({detailData?.data?.totalComments})
                          </Typography>
                        </div>

                        <Typography
                          classes={{ root: styles['orders-in-queue'] }}
                        >
                          {detailData?.data?.inqueueOrder || 0} orders in queue
                        </Typography>
                        {/* <Button variant="contained" onClick={handleDownload}>下载</Button> */}
                      </Stack>

                      <Stack className={styles['actions']} direction="row">
                        <div
                          className={classNames(
                            styles['likes-container'],
                            initialFollowing &&
                              styles['likes-container-active'],
                          )}
                        >
                          <LikeService
                            serviceID={Number(params.serviceId)}
                            sellerID={detailData?.data?.userId}
                            size={25}
                          />
                        </div>

                        <CopyToClipboard
                          text={`${location.origin}${location.pathname}?tab=description`}
                          onCopy={() => {
                            Toast.success('Service link copied!');
                          }}
                        >
                          <IconButton
                            classes={{ root: styles['share-btn'] }}
                            size="small"
                            disableFocusRipple
                          >
                            <img src={ShareSVG} />
                          </IconButton>
                        </CopyToClipboard>
                      </Stack>
                    </div>

                    <MediaSwiper
                      size="medium"
                      canDelete={false}
                      canUpload={false}
                      contentList={swiperContent}
                    />
                  </div>
                  {Number(detailData?.data?.subservices?.length) > 0 ? (
                    <ServiceSubmit
                      detailData={detailData?.data}
                      sellerInfo={sellerInfo}
                    />
                  ) : (
                    <NoServicesPackage />
                  )}
                </div>

                <div className={styles['tab-options-container']}>
                  <Tabs
                    value={tabValue}
                    onChange={(_, value) => {
                      setTabValue(value);
                      // history.replace(`${pathname}?tab=${value}`);
                    }}
                    tabs={[
                      { label: 'Description', value: 'description' },
                      {
                        label: `Comments(${detailData?.data?.totalComments})`,
                        value: 'comments',
                      },
                      {
                        label: `Transactions(${detailData?.data?.totalOrders})`,
                        value: 'transactions',
                      },
                    ]}
                  />
                  {tabValue === ServiceTabs.comments ? (
                    <Comments serviceId={detailData?.data?.id || 0} />
                  ) : tabValue === ServiceTabs.transactions ? (
                    <Transaction serviceId={detailData?.data?.id || 0} />
                  ) : (
                    <>
                      <Description
                        content={
                          detailData?.data?.description || 'No item description'
                        }
                        menuOptions={menu}
                      />
                      {userId && (
                        <AboutSeller userId={userId} callBack={setSellerInfo} />
                      )}
                      <ComparePackage
                        subservices={detailData?.data?.subservices || []}
                      />
                    </>
                  )}
                </div>
              </div>
            )
          }
        </>
      )}
    </>
  );
};

export default Services;
