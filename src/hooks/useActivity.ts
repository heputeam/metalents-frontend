import {
  getActivityConfig,
  getActivityList,
  getActivityReweetStatus,
} from '@/service/invite';
import {
  IActivityConfig,
  IActivityConfigItem,
  IActivityList,
  IActivityListParams,
  IActivityParams,
} from '@/service/invite/type';
import { useEffect, useState } from 'react';
import { IUserState, useSelector } from 'umi';

// 获取活动列表信息
export const useGetActivity = (params: IActivityListParams) => {
  const [activityData, setActivityData] = useState<IActivityList | null>(null);

  const getList = async () => {
    try {
      const { data } = await getActivityList(params);
      setActivityData(data);
    } catch (error) {
      console.log('activity--err', error);
    }
  };
  useEffect(() => {
    getList();
  }, []);
  return {
    activityData,
  };
};

// 获取活动配置信息
export const useGetActivityConfig = (activityId: number | undefined) => {
  const [configData, setConfigData] = useState<IActivityConfig | null>(null);
  const [initConfigData, setInitConfigData] = useState<IActivityConfig | null>(
    null,
  );

  const getList = async () => {
    try {
      const { data } = await getActivityConfig({ activityId: activityId });
      setInitConfigData(data);
    } catch (error) {
      console.log('activity--err', error);
    }
  };
  useEffect(() => {
    // if (activityId) {
    getList();
    // }
  }, []);

  useEffect(() => {
    const temp = initConfigData?.list?.filter(
      (item) => item?.activityId === activityId && item?.status === 'enable',
    );
    const sellerOrderDone = initConfigData?.list?.filter(
      (item) => item?.cfgName === 'SellerOrderDone',
    );
    const result = temp?.concat(sellerOrderDone);
    setConfigData(result);
  }, [activityId, initConfigData]);
  return {
    configData,
    // updateConfigData,
  };
};

// 检查是否转推成功
export const userCheckRetweetStatus = () => {
  const { token } = useSelector<any, IUserState>((state) => state.user);
  const [isRetweet, setIsRetweet] = useState<boolean>(false);
  const getRetweetStatus = async () => {
    try {
      const res = await getActivityReweetStatus();
      res?.data?.success && setIsRetweet(true);
    } catch (error) {
      console.log('retweetStatus--err', error);
    }
  };
  useEffect(() => {
    if (!token) return;
    getRetweetStatus();
  }, [token]);
  return {
    isRetweet,
  };
};
