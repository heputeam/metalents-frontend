import { IServicesOrders } from '@/pages/services/components/transaction/type';
import { getServiceOrders } from '@/service/services';
import { usePagination } from 'ahooks';
import { Params } from 'ahooks/lib/usePagination/types';

export const useServicesOrders = (params: any) => {
  return usePagination<IServicesOrders, Params>(
    async ({ current }) => {
      const response = await getServiceOrders({
        offset: (current - 1) * params?.pageSize,
        pageSize: params?.pageSize,
        serviceId: params?.serviceId,
        status: params?.status,
      });
      return {
        list: response.data.list ?? [],
        total: response.data.total || 0,
      };
    },
    {
      ready: params?.serviceId,
      refreshDeps: [params],
    },
  );
};
