import React, { useEffect, useState } from 'react';
import Likes, { ILikesProps } from '@/components/Likes';
import { useRequest } from 'ahooks';
import { IResponse, postUserFollowService } from '@/service/types';
import { Toast } from '../Toast';
import { IUserState, useDispatch, useSelector } from 'umi';

export type ILikeServiceProps = ILikesProps & {
  onChange?: () => void;
  size?: number;
  className?: string;
  serviceID: number;
  sellerID?: number | undefined | null;
};

const LikeService: React.FC<ILikeServiceProps> = ({
  onChange,
  serviceID,
  sellerID,
  ...rest
}) => {
  const dispatch = useDispatch();

  const { favServices, uid } = useSelector<any, IUserState>(
    (state) => state.user,
  );

  const [currentLike, setCurrentLike] = useState<boolean>(false);

  // 从favourite接口返回的数据没有sellerID，则其中的服务不是用户创建的
  const isSeller = sellerID ? uid === sellerID : false;

  useEffect(() => {
    const initialFollowing =
      !!favServices?.length &&
      favServices?.some((service) => service.service_id === serviceID);

    setCurrentLike(initialFollowing);
  }, [favServices]);

  const { run: followService } = useRequest<IResponse<any>, any>(
    () => postUserFollowService(!currentLike, serviceID),
    {
      manual: true,
      onSuccess: (res: any) => {
        const { code, data } = res;
        if (code === 200) {
          if (data?.success) {
            setCurrentLike(!currentLike);

            dispatch({
              type: 'setFavouriteServices',
              payload: {
                favServices: favServices?.filter(
                  (service) => service.service_id !== serviceID,
                ),
              },
            });

            dispatch({
              type: 'user/queryFavouriteServices',
            });

            onChange?.();
          }
        } else {
          Toast.error('Unknown system failure: Please try');
        }
      },
    },
  );

  const handleUpdate = () => {
    if (!uid) {
      return dispatch({
        type: 'dialog/show',
        payload: {
          key: 'loginChooseDialog',
        },
      });
    }

    if (isSeller) {
      return Toast.error(`Sorry! You Can't favorite your own service.`);
    }

    if (serviceID !== undefined && serviceID !== null) {
      followService();
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Likes value={currentLike} onChange={handleUpdate} {...rest} />
    </div>
  );
};

export default LikeService;
