import Toast from '@/components/Toast';
import { IDENTITY_TYPE } from '@/define';
import { Errors } from '@/service/errors';
import {
  IPageParams,
  IPagerData,
  IPageResponse,
  IPagerRequest,
  IResponse,
} from '@/service/types';
import {
  getUserFinalPosts,
  getUserOffers,
  getUserOrders,
  getUserProfile,
  getUserRequestsOffers,
  postUserOrders,
} from '@/service/user';
import {
  IGetUserFinalpostsData,
  IGetUserFinalpostsParams,
  IGetUserOrdersData,
  IGetUserOrdersOptionParams,
  IGetUserOrdersParams,
  IOtherOffers,
  IUserInfo,
  IUserOffers,
  IUserOrderData,
} from '@/service/user/types';
import { usePagination, useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { IUserState, useSelector } from 'umi';
import { Options, Result } from 'ahooks/lib/useRequest/src/types';
import { Params } from 'ahooks/lib/usePagination/types';

interface IOffersParams {
  offset: number;
  pageSize: number;
  requestId: number;
  status: number;
}

export const useToolsVisitor = (
  queryUid: number,
  userProfile?: IUserInfo | null,
) => {
  const [userType, setUserType] = useState<number>(IDENTITY_TYPE.Owner);
  const { userInfo: info, uid } = useSelector<any, IUserState>(
    (state) => state.user,
  );
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    if (queryUid) {
      userProfile && setUserInfo(userProfile);
      Number(queryUid) !== uid && setUserType(IDENTITY_TYPE.Other);
      setUserId(Number(queryUid));
    } else {
      info && setUserInfo(info);
      setUserType(IDENTITY_TYPE.Owner);
      setUserId(uid || 0);
    }
  }, [queryUid, uid, userProfile, info]);

  return {
    userType,
    userInfo,
    userId,
  };
};

export const useGetVisitor = (uid: number) => {
  const [userProfile, setUserProfile] = useState<IUserInfo | null>(null);
  const { run: getUserInfo } = useRequest(() => getUserProfile(uid), {
    manual: true,
    onSuccess: (res: any) => {
      const { data, code } = res;
      if (code !== 200) {
        return Toast.error(Errors[code]);
      }
      setUserProfile(data);
    },
  });
  useEffect(() => {
    if (!uid) return;
    getUserInfo();
  }, [uid]);
  return {
    userProfile,
    getUserInfo,
  };
};

export const useOwnerOffers = (par: IOffersParams) => {
  const { token } = useSelector<any, IUserState>((state) => state?.user);
  const [myOfferData, setMyOfferData] = useState<IUserOffers>({
    list: [],
    total: 0,
  });
  const { params, run: getOwnerOffer } = useRequest(
    (par) => getUserOffers(par),
    {
      manual: true,
      onSuccess: (response: IResponse<IUserOffers>) => {
        const { code, data } = response;
        if (code === 200) {
          setMyOfferData(data);
        }
      },
    },
  );
  useEffect(() => {
    if (!token || !par?.requestId) return;
    getOwnerOffer(par);
  }, [par?.requestId, token]);
  return {
    params,
    myOfferData,
    getOwnerOffer,
  };
};

export const useOtherOffers = (params: IOffersParams) => {
  const [otherOffers, setOtherOffers] = useState<IOtherOffers>({
    list: [],
    total: 0,
  });
  const { loading, run: getOtherOffers } = useRequest(
    (params) => getUserRequestsOffers(params),
    {
      manual: true,
      onSuccess: (response: IResponse<IOtherOffers>) => {
        const { code, data } = response;
        if (code === 200) {
          setOtherOffers(data);
        }
      },
    },
  );
  useEffect(() => {
    if (!params?.requestId) return;
    getOtherOffers(params);
  }, [params?.requestId, params?.offset]);
  return { otherOffers, loading, getOtherOffers };
};

export const useGetOrders = (
  options?: Options<IGetUserOrdersData, [IPageParams<IGetUserOrdersParams>]>,
) =>
  usePagination<IGetUserOrdersData, [IPageParams<IGetUserOrdersOptionParams>]>(
    async (params) => {
      const resp = await getUserOrders({
        startTime: params?.startTime,
        endTime: params?.endTime,
        pageSize: params.pageSize,
        seller: params.seller,
        sortBy: params.sortBy,
        status: params.status?.val,
        offset: (params.current - 1) * params.pageSize,
      });

      let overviewTotal = 0;
      Object.values(resp.data.overview).forEach(
        (value) => (overviewTotal = overviewTotal + value),
      );

      const overview = { ...resp.data.overview, '': overviewTotal };

      return {
        ...resp.data,
        overview,
        total: overview[params.status?.valLabel],
      };
    },
    {
      defaultPageSize: 5,
      ...options,
    },
  );

export const useGetFinalPost = (
  orderId: number,
  options?: Options<
    IGetUserFinalpostsData,
    [IPageParams<IGetUserFinalpostsParams>]
  >,
) =>
  usePagination<
    IGetUserFinalpostsData,
    [IPageParams<IGetUserFinalpostsParams>]
  >(
    async ({ current, pageSize }) => {
      const params: IGetUserFinalpostsParams = {
        offset: (current - 1) * pageSize,
        pageSize,
        orderId,
      };

      const resp = await getUserFinalPosts(params);

      console.log('/user/final_posts resp: ', resp);

      return resp.data;
    },
    {
      defaultPageSize: 10,
      onSuccess: (data) => {
        console.log('/user/final_posts data: ', data);
      },
      ...options,
    },
  );

export const useUserOrders = (filterParam: any) => {
  return usePagination<IUserOrderData, Params>(
    async ({ current }) => {
      const response = await postUserOrders({
        startTime: filterParam?.startTime,
        endTime: filterParam?.endTime,
        offset: (current - 1) * filterParam?.pageSize,
        pageSize: filterParam?.pageSize,
        seller: filterParam?.seller,
        sortBy: filterParam?.sortBy,
        status: filterParam?.status,
        userId: filterParam?.userId,
      });
      return {
        total: response.data.total || 0,
        list: response.data.list ?? [],
        overview: response.data.overview || 0,
      };
    },
    {
      ready: filterParam.userId,
      refreshDeps: [filterParam],
    },
  );
};
