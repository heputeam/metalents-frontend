import NavLink from '@/components/NavLink';
import { Box, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import IconButton from '@mui/material/IconButton';
import WebsiteSVG from '@/assets/imgs/account/profile/website.svg';
import TwitterSVG from '@/assets/imgs/account/profile/twitter.svg';
import InstagramSVG from '@/assets/imgs/account/profile/instagram.svg';
import ShareSVG from '@/assets/imgs/account/profile/share.svg';
import { IMenuState, useLocation, useSelector } from 'umi';
import moment from 'moment';
import Banner from '@/components/BannerUploader';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Toast from '@/components/Toast';
import { IMenuInfo } from '@/service/public/types';
import Button from '@/components/Button';
import { useGetVisitor, useToolsVisitor, useUserOrders } from '@/hooks/useUser';
import { IDENTITY_TYPE, USER_TYPE } from '@/define';
import { Tabs, TabPanel } from '@/components/Tabs';

import VerifiedSVG from '@/assets/imgs/home/verified.svg';
import HomeTransaction from '@/components/HomeTransaction';
import { PAGE_SIZE } from '@/pages/request/_define';
import { ORDER_STATUS } from '@/service/orders/types';

export type IProfileProps = {};

export interface ITagData {
  label: string;
  color: string;
}

const Profile: React.FC<IProfileProps> = ({}) => {
  const { query } = useLocation() as any;
  const [userName, setUserName] = useState<string>('U');
  const { menus: menuData } = useSelector<any, IMenuState>(
    (state) => state.menus,
  );
  const [tagData, setTagData] = useState<ITagData[]>([]);
  const [bannerSrc, setBannerSrc] = useState('');
  const { userProfile } = useGetVisitor(query?.userId);
  const { userType, userInfo, userId } = useToolsVisitor(
    query?.userId,
    userProfile,
  );
  const [status, setStatus] = useState<string[]>([
    ORDER_STATUS.Complete,
    ORDER_STATUS.Autocomplete,
    ORDER_STATUS.Cancel,
  ]);
  const [filterParam, setFilterParam] = useState({
    startTime: 0,
    endTime: 0,
    pageSize: PAGE_SIZE,
    seller: false,
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
      userId,
    });
  }, [status, userId]);

  useEffect(() => {
    if (userInfo) {
      const { userName, googleInfo, instagramInfo, twitterInfo } = userInfo;
      const name =
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
            rounded
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
                    &nbsp;·&nbsp;{userInfo?.company}
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
              <NavLink path="/account/profile/edit">
                <Button variant="contained" rounded>
                  Edit Profile
                </Button>
              </NavLink>
            )}
          </div>
        </div>
      </div>
      <Tabs
        sx={{ mt: 40 }}
        value={'Transactions'}
        onChange={(_, value) => {}}
        tabs={[
          {
            label: `Transactions(${userOrders?.total ?? 0})`,
            value: 'Transactions',
          },
        ]}
      />
      <TabPanel panelValue="transactions" tabValue={'transactions'}>
        {userOrders && (
          <HomeTransaction
            name="Seller"
            loading={loading}
            pagination={transactionPagination}
            userType={USER_TYPE.Buyer}
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
