import { PAGE_SIZE } from '@/pages/request/_define';
import {
  getBanners,
  postSearchRequests,
  searchServices,
} from '@/service/general';
import { IBanner, ISearchRequests, IService } from '@/service/general/types';
import { IPagerData } from '@/service/types';
import { usePagination } from 'ahooks';
import { Params } from 'ahooks/lib/usePagination/types';
import { useEffect, useState } from 'react';
import { IUserState, useSelector } from 'umi';

export const useSearchServices = (params: any, userId: number) => {
  const { uid: id } = useSelector<any, IUserState>((state) => state.user);
  const [uid, setUid] = useState<number>(0);
  useEffect(() => {
    if (userId) {
      setUid(userId);
    } else {
      id && setUid(id);
    }
  }, [id, userId]);
  return usePagination<IPagerData<IService>, Params>(
    async ({ current, pageSize }) => {
      if (!uid) return Promise.reject();

      const resp = await searchServices({
        offset: (current - 1) * 9,
        pageSize,
        userId: uid,
        ...params,
      });

      return {
        total: resp.data.total,
        list: resp.data.list ?? [],
      };
    },
    {
      refreshDeps: [uid],
      defaultPageSize: 9,
      ready: !!uid,
      onSuccess: (response) => {
        console.log('get_user_posts resp: ', response);
      },
    },
  );
};

export const useBanner = (type: number) => {
  const [bannerData, setBannerData] = useState<IBanner | null>(null);
  const getBanner = async () => {
    try {
      const { data } = await getBanners(type);
      setBannerData(data);
    } catch (error) {
      console.log('banner--err', error);
    }
  };
  useEffect(() => {
    getBanner();
  }, []);
  return {
    bannerData,
  };
};

export const userSearchRequests = ({ filters, sortBy, status }: any) => {
  return usePagination<IPagerData<ISearchRequests>, Params>(
    async ({ current }) => {
      const response = await postSearchRequests({
        category: filters.category,
        offset: (current - 1) * PAGE_SIZE,
        pageSize: PAGE_SIZE,
        sortType: sortBy,
        status: status,
      });
      return {
        total: response.data.total,
        list: response.data.list ?? [],
      };
    },
    {
      refreshDeps: [filters, sortBy, status],
    },
  );
};
