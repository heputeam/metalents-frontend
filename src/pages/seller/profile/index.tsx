import NavLink from '@/components/NavLink';
import { Box, Typography, Grid, Tooltip } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './index.less';

import { IUserState, useSelector, useLocation, useHistory } from 'umi';
import { useRequest } from 'ahooks';
import moment from 'moment';
import Banner from '@/components/BannerUploader';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Toast from '@/components/Toast';
import MediaSwiper from '@/components/MediaSwiper';
import { Tabs, TabPanel } from '@/components/Tabs';
import ExperenceInputBlock from './components/ExperienceInputBlock';
import { IListItemType } from '../apply';
import PosterCard, { ICardItem } from '@/components/PosterCard';
import Pagination from '@/components/Pagination';
import { IMenuState } from '@/models/menu';
import { getExperience, IResponse } from '@/service/types';
import Loading from '@/components/Loading';
import { useSearchServices } from '@/hooks/useGeneral';
import { getUserPosts, postCreateOrUpdate } from '@/service/public';
import {
  EPostType,
  ExperienceType,
  IClearPostParams,
  IExperience,
  IUpdatePostParams,
  IUpdatePostRespData,
} from '@/service/user/types';
import { IMenuInfo } from '@/service/public/types';

import IconButton from '@mui/material/IconButton';
import WebsiteSVG from '@/assets/imgs/account/profile/website.svg';
import TwitterSVG from '@/assets/imgs/account/profile/twitter.svg';
import InstagramSVG from '@/assets/imgs/account/profile/instagram.svg';
import ShareSVG from '@/assets/imgs/account/profile/share.svg';
import PersonSVG from '@/assets/imgs/seller/profile/person.svg';
import VerifiedSVG from '@/assets/imgs/home/verified.svg';
import Button from '@/components/Button';
import { IFileWithStatus, useSwiperContent } from '@/hooks/useSwiperContent';
import { Errors } from '@/service/errors';
import { useGetVisitor, useToolsVisitor, useUserOrders } from '@/hooks/useUser';
import { IDENTITY_TYPE, USER_TYPE } from '@/define';
import { FileWithFid, IFileWithFid } from '@/components/Uploader';
import { useUploadFile } from '@/hooks/useUploadFile';
import { PAGE_SIZE } from '@/pages/request/_define';
import HomeTransaction from '@/components/HomeTransaction';
import { ORDER_STATUS } from '@/service/orders/types';
import { acceptFileType, getFileMaxSize } from '@/utils';
import { ESortBy } from '@/pages/home/components/SelectOptions/config';

export type IProfileProps = {};
export interface ITagData {
  label: string;
  color: string;
}

const experiencePlaceholder: IListItemType = {
  id: Date.now(),
  industry: '',
  industryPlaceHolder: 'Enter your title... ps.UI Designer',
  location: '',
  locationPlaceHolder: 'Enter company',
  description: '',
  descriptionPlaceHolder: 'Enter description',
  start_time: '',
  end_time: '',
  type: 2,
};

const educationPlaceholder: IListItemType = {
  id: Date.now(),
  industry: '',
  industryPlaceHolder: 'Enter major or degree',
  location: '',
  locationPlaceHolder: 'Enter university',
  description: '',
  descriptionPlaceHolder: 'Enter description',
  start_time: '',
  end_time: '',
  type: 1,
};

const toListItem = (
  data: IExperience[] | undefined,
  type: ExperienceType,
): IListItemType[] => {
  if (!data || data.length === 0) {
    switch (type) {
      case ExperienceType.WORK:
        return [{ ...experiencePlaceholder }];

      case ExperienceType.EDUCATION:
        return [{ ...educationPlaceholder }];

      default:
        return [];
    }
  }

  return data.map(
    (item) =>
      ({
        id: item.id,
        industry: item.industry,
        location: item.location,
        description: item.description,
        start_time: moment(Number(item.startTime) * 1000).format('YYYY'),
        end_time:
          Number(item.endTime) === -1
            ? 'Now'
            : moment(Number(item.endTime) * 1000).format('YYYY'),
        industryPlaceHolder:
          type === ExperienceType.EDUCATION
            ? 'Enter major or degree'
            : 'Enter your title... ps.UI Designer',
        locationPlaceHolder:
          type === ExperienceType.EDUCATION
            ? 'Enter university'
            : 'Enter company',
        descriptionPlaceHolder: 'Enter description',
        type,
      } as any),
  );
};

const Profile: React.FC<IProfileProps> = ({}) => {
  const { query } = useLocation() as any;
  const tabValue = query.tab || 'portfolio';
  const history = useHistory();

  const {
    contentList,
    getContentList,
    setContentList,
    checkFile,
    batchBeforeUpload,
    batchAfterSuccess,
    batchAfterError,
    batchAfterRetry,
  } = useSwiperContent();

  const [userName, setUserName] = useState<string>('U');
  const [tagData, setTagData] = useState<ITagData[]>([]);
  const [bannerSrc, setBannerSrc] = useState('');
  const [modifyLeftTimes, setModifyLeftTimes] = useState({
    work: 0,
    education: 0,
  });
  const { fileConfig } = useSelector((state: any) => state.fileConfig);

  let initialEducation: IListItemType[] = [];
  let initialExperience: IListItemType[] = [];

  const { menus: menuData } = useSelector<any, IMenuState>(
    (state) => state.menus,
  );

  const {
    data: userServices,
    pagination,
    loading: loadingUserService,
  } = useSearchServices(
    { sortType: ESortBy.serviceStarsHighToLow },
    Number(query?.userId),
  );
  const { userProfile } = useGetVisitor(query?.userId);
  const {
    userId: uid,
    userType,
    userInfo,
  } = useToolsVisitor(query?.userId, userProfile);

  const [status, setStatus] = useState<string[]>([
    ORDER_STATUS.Complete,
    ORDER_STATUS.Autocomplete,
    ORDER_STATUS.Cancel,
  ]);
  const [filterParam, setFilterParam] = useState({
    startTime: 0,
    endTime: 0,
    pageSize: PAGE_SIZE,
    seller: true,
    sortBy: 1,
    status,
    userId: 0,
  });
  const {
    loading,
    pagination: transactionPagination,
    data: userOrders,
  } = useUserOrders(filterParam);
  useEffect(() => {
    setFilterParam({
      ...filterParam,
      status,
      userId: uid,
    });
  }, [status, uid]);

  const { loading: postLoading } = useRequest<
    IResponse<IUpdatePostRespData>,
    []
  >(
    () =>
      getUserPosts({
        offset: 0,
        pageSize: 9,
        type: 2,
        userId: uid,
      }),
    {
      onSuccess: (resp) => {
        console.log('get_user_posts resp: ', resp);

        if (resp.code === 200) {
          setContentList(
            resp?.data?.list?.map((post, index) => ({
              ...post,
              fid:
                String(post.id) || `${post.fileName}_${post.fileSize}_${index}`,
              status: 'success',
            })) ?? [],
          );
        } else {
          Toast.error(Errors['*']);
        }
      },
      ready: !!uid,
      refreshDeps: [uid],
    },
  );

  const { data: experienceData, refresh: refreshGetExperience } = useRequest<
    IResponse<any>,
    [ExperienceType]
  >((type) => getExperience({ userId: uid as any, type }), {
    ready: !!uid,
    refreshDeps: [uid],
    defaultParams: [ExperienceType.ALL],
    onSuccess: (response) => {
      console.log('/user/experience resp: ', response);

      const workLeftTimes =
        response?.data.list?.find(
          (data: any) => data.type === ExperienceType.WORK,
        )?.modifyLeftTimes || 0;

      const educationLeftTimes =
        response?.data.list?.find(
          (data: any) => data.type === ExperienceType.EDUCATION,
        )?.modifyLeftTimes || 0;

      console.log('workLeftTimes: ', workLeftTimes);
      console.log('educationLeftTimes: ', educationLeftTimes);

      setModifyLeftTimes({
        work: workLeftTimes,
        education: educationLeftTimes,
      });
    },
  });

  const { run: updatePost } = useRequest<
    IResponse<IUpdatePostRespData>,
    [IUpdatePostParams | IClearPostParams]
  >((params) => postCreateOrUpdate(params), {
    manual: true,
    onBefore: (params) => console.log('>>> params: ', params),
    onSuccess: () => {
      Toast.success('Successfully uploaded!');
    },
    onError: (e, p) => {
      console.log('>>> error req Prarms: ', p);
    },
  });

  const [experienceList, setExperienceList] = useState<IListItemType[]>([
    { ...experiencePlaceholder, end_time: 'Now' },
  ]);
  const [educationList, setEducationList] = useState<IListItemType[]>([
    { ...educationPlaceholder, end_time: 'Now' },
  ]);

  useEffect(() => {
    initialExperience = toListItem(
      experienceData?.data?.list?.filter(
        (data: any) => data.type === ExperienceType.WORK,
      ),
      ExperienceType.WORK,
    );
    initialEducation = toListItem(
      experienceData?.data?.list?.filter(
        (data: any) => data.type === ExperienceType.EDUCATION,
      ),
      ExperienceType.EDUCATION,
    );

    setExperienceList(initialExperience);
    setEducationList(initialEducation);
  }, [experienceData]);

  useEffect(() => {
    if (userInfo) {
      const { userName, googleInfo, instagramInfo, twitterInfo, shopname } =
        userInfo;
      const name =
        shopname ||
        userName ||
        googleInfo?.name ||
        instagramInfo?.name ||
        twitterInfo?.name ||
        'U';

      setUserName(name);

      if (userInfo?.focused?.length > 0) {
        const tagMenu = menuData?.filter((item: IMenuInfo) =>
          userInfo?.focused?.includes(item.id),
        );
        let tagList: ITagData[] = [];
        tagMenu?.map((item: IMenuInfo) => {
          let temp = {
            label: item?.serviceName,
            color: item?.serviceColor,
          };
          tagList.push(temp);
        });
        setTagData(tagList);
      }
      setBannerSrc(
        userInfo.banner ? userInfo.banner : '/imgs/account/banner.png',
      );
    }
  }, [userInfo, menuData]);

  const handleCopy = () => {
    Toast.success('Homepage link copied!');
  };

  const { run: uploadFile } = useUploadFile({
    manual: true,
    onSuccess: (resp: any, params: any) => {
      if (resp.code === 200) {
        // ↓  error code for test
        // if (resp.code !== 200) {
        batchAfterSuccess(params[0].fid, resp?.data.path);
      } else {
        batchAfterError(params[0].fid);
        Toast.error(Errors[resp.code] || Errors['*']);
      }
    },
    onError: (resp: any, params: any) => {
      console.log('onError >>> params: ', params);
      batchAfterError(params[0].fid);
      Toast.error(Errors[resp.code] || Errors['*']);
    },
  });

  const acceptedFileType = useMemo(() => {
    return fileConfig?.user_posts?.fileExt
      ? acceptFileType(fileConfig?.user_posts?.fileExt)
      : undefined;
  }, [fileConfig]);

  const beforeUpload = useCallback(
    (file: FileWithFid): void => {
      const errors = checkFile({
        file,
        accept: acceptedFileType,
        limitSize: getFileMaxSize(fileConfig?.user_posts?.fileMaxSize),
      });

      if (errors.length > 0) {
        return;
      }

      batchBeforeUpload(file);
    },
    [batchBeforeUpload, acceptedFileType],
  );

  const onSuccess = useCallback(
    (file: IFileWithFid) => {
      batchAfterSuccess(file.fid, file.fileUrl);

      let posts = getContentList()
        .filter((item) => item.status === 'success')
        .map((item) => ({
          ...item,
          fileThumbnailUrl: item.fileUrl,
          id: 0,
          type: fileConfig?.user_posts?.postType || EPostType.portfolio,
          userId: uid,
        }));

      console.log('>>> posts: ', posts);

      updatePost({
        posts,
      });
    },
    [batchAfterSuccess, getContentList, updatePost],
  );

  const onError = useCallback(
    (_, file) => {
      if (file) {
        batchAfterError(file?.fid);
      }
    },
    [batchAfterError],
  );

  const onDelete = useCallback(
    (fileList: IFileWithStatus[], file?: IFileWithStatus) => {
      console.log('删除文件', fileList);
      setContentList(fileList);

      if (file?.status === 'success') {
        if (fileList.length === 0) {
          updatePost({
            posts: [{ id: -1, type: EPostType.portfolio }],
          });
        } else {
          updatePost({
            posts: fileList,
          });
        }
      }
    },
    [setContentList, updatePost],
  );

  const onRetry = useCallback(
    (file) => {
      if (file?.originFileObj) {
        uploadFile(file.originFileObj);
        batchAfterRetry(file.fid);
      }
    },
    [uploadFile, batchAfterRetry],
  );

  return (
    <section className={styles['profile-page']}>
      <div className={styles['banner-box']}>
        <Banner
          bannerSrc={bannerSrc}
          enable={userType === IDENTITY_TYPE.Owner}
        />

        <CopyToClipboard
          text={
            window.location.href.indexOf('userId') > -1
              ? window.location.href
              : `${window.location.href}&userId=${userInfo?.id}`
          }
          onCopy={handleCopy}
        >
          <Button
            className={styles['share-btn']}
            variant="contained"
            startIcon={<img src={ShareSVG} alt="share" />}
          >
            Share
          </Button>
        </CopyToClipboard>
      </div>

      <div className={styles['profile-box']}>
        <div>
          <div className={styles['first-line']}>
            <div className={styles['first-line-left']}>
              <div className={styles['name-and-links']}>
                <div className={styles['user-name-box']}>
                  <Typography className={styles['user-name']} variant="h2">
                    {userName}
                  </Typography>

                  {userInfo?.isVerify === 'verified' && (
                    <img src={VerifiedSVG} alt="" />
                  )}
                </div>

                <div className={styles['social-link-group']}>
                  {userInfo?.twitterLink && (
                    <NavLink path={userInfo?.twitterLink}>
                      <IconButton className={styles['twitter-btn']}>
                        <img src={TwitterSVG} alt="twitter" />
                      </IconButton>
                    </NavLink>
                  )}

                  {userInfo?.instagramLink && (
                    <NavLink path={userInfo?.instagramLink}>
                      <IconButton className={styles['instagram-btn']}>
                        <img src={InstagramSVG} alt="Instagram" />
                      </IconButton>
                    </NavLink>
                  )}

                  {userInfo?.website && (
                    <NavLink
                      path={
                        /^http.*/.test(userInfo?.website)
                          ? userInfo?.website
                          : `http://${userInfo?.website}`
                      }
                    >
                      <IconButton className={styles['website-btn']}>
                        <img src={WebsiteSVG} alt="website" />
                      </IconButton>
                    </NavLink>
                  )}
                </div>
              </div>

              <div className={styles['career-and-company']}>
                {userInfo?.career && (
                  <Typography variant="body1" className={styles['career']}>
                    {userInfo?.career}
                  </Typography>
                )}
                {userInfo?.company && (
                  <Typography variant="body1" className={styles['company']}>
                    &nbsp;{`· ${userInfo?.company}`}
                  </Typography>
                )}
              </div>
            </div>

            <div className={styles['join-date']}>
              <Typography
                variant="caption"
                className={styles['str-menber-since']}
              >
                Member since&nbsp;
              </Typography>

              <Typography variant="caption" className={styles['date']}>
                {userInfo?.createdAt
                  ? moment(Number(userInfo.createdAt) * 1000).format('MMM YYYY')
                  : '-'}
              </Typography>
            </div>
          </div>

          {userInfo?.description && userInfo.description.length > 350 ? (
            <Tooltip
              arrow
              placement="top"
              title={userInfo.description}
              classes={{
                tooltip: styles['tooltip'],
                arrow: styles['tooltip-arrow'],
              }}
            >
              <Typography variant="body2" className={styles['description']}>
                {userInfo?.description ||
                  "This user hasn't filled out profile yet..."}
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="body2" className={styles['description']}>
              {userInfo?.description ||
                "This user hasn't filled out profile yet..."}
            </Typography>
          )}

          <div className={styles['last-line']}>
            <div className={styles['tag-group']}>
              {tagData.map((tag, index) => (
                <Box
                  key={index}
                  className={styles['job-tag']}
                  sx={{ background: tag.color }}
                >
                  <Typography variant="body2">{tag.label}</Typography>
                </Box>
              ))}
            </div>
            {userType === IDENTITY_TYPE.Owner && (
              <NavLink path="/seller/profile/edit">
                <Button variant="contained" rounded>
                  Edit Profile
                </Button>
              </NavLink>
            )}
          </div>
        </div>
      </div>

      <Tabs
        value={tabValue}
        onChange={(_, value) => {
          if (query?.userId) {
            history.push(
              `/seller/profile?sidebar&tab=${value}&userId=${query?.userId}`,
            );
          } else {
            history.push(`/seller/profile?sidebar&tab=${value}`);
          }
        }}
        tabs={[
          { label: `Services(${userServices?.total || 0})`, value: 'services' },
          { label: 'Portfolio', value: 'portfolio' },
          {
            label: `Transactions(${userOrders?.total || 0})`,
            value: 'transactions',
          },
        ]}
      />

      <TabPanel panelValue={`services`} tabValue={tabValue}>
        {loadingUserService && (
          <div className={styles['loading-box']}>
            <Loading className={styles['loading']} />
          </div>
        )}

        {!loadingUserService &&
          (!userServices || userServices.list?.length === 0) && (
            <div className={styles['no-service-block']}>
              <img src={PersonSVG} />
              <Typography
                className={styles['str-no-service']}
              >{`Sorry! No service is available now.`}</Typography>
            </div>
          )}

        {userServices && userServices.list?.length > 0 && (
          <>
            <Grid container spacing={30}>
              {userServices?.list.map((serviceInfo, index) => {
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
                    isFollowing: false,
                    brochures: serviceInfo.posts,
                    packages: serviceInfo.subServices,
                    rating: serviceInfo.scope,
                  },
                };

                return (
                  <Grid item xs={4} key={index}>
                    <PosterCard item={cardData} size="small" />
                  </Grid>
                );
              })}
            </Grid>

            {userServices.total > 9 && (
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
      </TabPanel>

      <TabPanel panelValue="portfolio" tabValue={tabValue}>
        {!postLoading ? (
          <MediaSwiper
            contentList={contentList}
            canUpload={userType === IDENTITY_TYPE.Owner}
            canDelete={userType === IDENTITY_TYPE.Owner}
            countLimit={fileConfig?.user_posts?.fileCount}
            limitSize={getFileMaxSize(fileConfig?.user_posts?.fileMaxSize)}
            beforeUpload={beforeUpload}
            onUploadSuccess={onSuccess}
            onError={onError}
            onDelete={onDelete}
            onRetry={onRetry}
            accept={
              fileConfig?.user_posts?.fileExt
                ? acceptFileType(fileConfig?.user_posts?.fileExt)
                : undefined
            }
            labelText={`Only ${fileConfig?.user_posts?.fileExt?.toUpperCase()} format, <${getFileMaxSize(
              fileConfig?.user_posts?.fileMaxSize,
            )}MB`}
          />
        ) : (
          <div className={styles['loading-container']}>
            <Loading />
          </div>
        )}

        <ExperenceInputBlock
          experiencePlaceholder={experiencePlaceholder}
          educationPlaceholder={educationPlaceholder}
          experienceList={experienceList}
          initialExperience={initialExperience}
          educationList={educationList}
          initialEducation={initialEducation}
          setExperienceList={setExperienceList}
          setEducationList={setEducationList}
          modifyLeftTimes={modifyLeftTimes}
          afterUpload={refreshGetExperience}
          canEdit={userType === IDENTITY_TYPE.Owner}
        />
      </TabPanel>

      <TabPanel panelValue="transactions" tabValue={tabValue}>
        {userOrders && (
          <HomeTransaction
            name="Buyer"
            loading={loading}
            pagination={transactionPagination}
            userType={USER_TYPE.Seller}
            userOrders={userOrders}
            identityType={userType}
            onChange={setStatus}
          />
        )}
      </TabPanel>
    </section>
  );
};

export default Profile;
