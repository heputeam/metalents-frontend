import styles from './index.less';
import messageSvg from './assets/message.svg';
import starSvg from './assets/star.svg';
import { Box, Typography } from '@mui/material';
import AvatarAndInfo from '@/components/AvatarAndInfo';
import { IMenuState, useRouteMatch, useSelector } from 'umi';
import { useRequest, useSetState, useUpdateEffect } from 'ahooks';
import { IProfileInfo, IResUserProfile } from './type';
import { getUserProfile, IResponse } from '@/service/types';
import { ISellerInfo } from '../../type';
import { useEffect } from 'react';
import SendMessage from '@/components/SendMessage';

interface IAboutSellerProps {
  userId?: number;
  callBack?: (info: ISellerInfo) => void;
}

export const AboutSeller = ({ userId, callBack }: IAboutSellerProps) => {
  const { menus } = useSelector<any, IMenuState>((state) => state.menus);
  const { params } = useRouteMatch() as any;
  const { data: profileData, run: updateProfileData } = useRequest<
    IResponse<IResUserProfile>,
    any
  >(() => {
    return getUserProfile(userId || '');
  });

  useEffect(() => {
    updateProfileData();
  }, [params, userId]);

  const [profileInfo, setProfileInfo] = useSetState<IProfileInfo>({
    userInfo: {
      userName: '',
      location: '',
      avatar: '',
      timezone: '',
      targetId: '',
      levels: 0,
    },

    career: '',
    company: '',
    description: '',
    scope: 0,
    orderCount: 0,
    focused: [],
  });

  useUpdateEffect(() => {
    if (profileData?.code === 200 && menus) {
      const profileInfo = {
        userInfo: {
          userName: profileData.data.userName,
          location: profileData.data.location,
          avatar: profileData.data.avatar.fileThumbnailUrl,
          timezone: profileData.data.timezone,
          targetId: profileData.data.id.toString(),
          levels: profileData.data.levels,
        },

        career: profileData.data.career,
        company: profileData.data.company,
        description: profileData.data.description,
        scope: profileData.data.scope,
        orderCount: profileData.data.orderCount,
        focused: profileData.data.focused?.map((item) => {
          return menus.find((menu) => item === menu.id);
        }),
      };
      setProfileInfo(profileInfo as IProfileInfo);

      callBack &&
        callBack({
          avatar:
            profileData.data.avatar.fileThumbnailUrl ||
            profileData.data.avatar.fileUrl ||
            '',
          userName: profileData.data.userName,
          userId: userId || 0,
          shopname: profileData.data?.shopname,
          isVerify: profileData?.data?.isVerify,
          status: profileData?.data?.status,
        });
    }
  }, [profileData, menus, params]);

  return (
    <div className={styles['aboutSeller-container']}>
      <div className={styles['about-header']}>
        <p>About This Seller</p>
        <SendMessage
          targetId={profileInfo.userInfo.targetId}
          svg={messageSvg}
          text="Send Message"
        />
      </div>

      <div className={styles['about-body']}>
        <div className={styles['about-avatar']}>
          <AvatarAndInfo
            location={profileInfo.userInfo.location}
            avatar={profileInfo.userInfo.avatar}
            timezone={profileInfo.userInfo.timezone}
            level={profileInfo.userInfo.levels}
            isRatingVisible={false}
          />
        </div>

        <div className={styles['about-content']}>
          <div className={styles['row-1']}>
            <Typography className={styles['user-name']}>
              {profileInfo.userInfo.userName}
            </Typography>

            <div className={styles['star']}>
              <img src={starSvg} alt="" />
              <Typography className={styles['order-count']}>
                {profileInfo.scope ? Number(profileInfo.scope).toFixed(1) : '-'}
                &nbsp; ({profileInfo.orderCount} Orders)
              </Typography>
            </div>

            <div className={styles['career-and-company']}>
              {profileInfo?.career && (
                <Typography variant="body1" className={styles['career']}>
                  {profileInfo.career}
                </Typography>
              )}

              {profileInfo?.company && (
                <Typography variant="body1" className={styles['company']}>
                  &nbsp;·&nbsp;{profileInfo.company}
                </Typography>
              )}
            </div>
          </div>

          <div className={styles['desc']}>
            <p>
              {profileInfo.description ||
                `This user hasn't filled out profile yet...`}
            </p>
          </div>

          <div className={styles['tag-group']}>
            {(profileInfo.focused || []).map((tag, index) => (
              <Box
                key={index}
                className={styles['job-tag']}
                sx={{
                  background: tag?.serviceColor || 'rgba(170, 229, 255, 0.9)',
                }}
              >
                <Typography variant="body2">{tag?.serviceName}</Typography>
              </Box>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
