import React, { useEffect, useState } from 'react';
import Likes from '@/components/Likes';
import { useRequest } from 'ahooks';
import { IResponse, postUserFollowUser } from '@/service/types';
import Toast from '../Toast';
import { IUserState, useDispatch, useSelector } from 'umi';

export type ILikeSellerProps = {
  sellerID: number;
  onChange?: (isFollow?: boolean) => void;
  size?: number;
  className?: string;
  icon?: string;
  [key: string]: any;
};

const LikeSeller: React.FC<ILikeSellerProps> = ({
  onChange,
  sellerID,
  size,
  className,
  icon,
  ...rest
}) => {
  const dispatch = useDispatch();

  const handleSignIn = () => {
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'loginChooseDialog',
      },
    });
  };

  const { favSellers, uid } = useSelector<any, IUserState>(
    (state) => state.user,
  );

  const [currentLike, setCurrentLike] = useState<boolean>(false);

  useEffect(() => {
    const initialFollowing =
      !!favSellers?.length &&
      favSellers?.some((seller) => seller.sellerID === sellerID);
    setCurrentLike(initialFollowing);
    // onChange?.();
  }, [favSellers, sellerID]);

  const { data, run: followSeller } = useRequest<IResponse<any>, any>(
    () => postUserFollowUser(!currentLike, sellerID),
    {
      manual: true,
      ready: typeof uid === 'number',
      onSuccess: (res: any) => {
        const { code, data } = res;
        if (code === 200) {
          if (data?.success) {
            setCurrentLike(!currentLike);

            dispatch({
              type: 'setFavouriteSellers',
              payload: {
                favSellers: favSellers?.filter(
                  (seller) => seller.sellerID !== sellerID,
                ),
              },
            });

            dispatch({
              type: 'user/queryFavouriteSellers',
            });

            onChange?.(currentLike);
          }
        } else {
          Toast.error('Unknown system failure: Please try');
        }
      },
    },
  );

  const isSeller = uid === sellerID;

  const handleUpdate = () => {
    if (!(typeof uid === 'number')) {
      return handleSignIn();
    }

    if (isSeller) {
      return Toast.error(`Sorry! You Can't favorite yourself.`);
    }

    if (sellerID !== undefined) {
      followSeller();
    }
  };
  return (
    <>
      <Likes
        value={currentLike}
        size={size}
        onChange={handleUpdate}
        className={className}
        icon={icon}
        {...rest}
      />
    </>
  );
};

export default LikeSeller;
