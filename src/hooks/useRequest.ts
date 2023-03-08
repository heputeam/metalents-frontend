import { getRequestsDetail } from '@/service/requests';
import { IRequestDetails } from '@/service/requests/types';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';

export const useRequestDetails = (requestId: number, offerId: number) => {
  const [details, setDetails] = useState<IRequestDetails | null>(null);
  const [detailsCode, setDetailsCode] = useState<number>(0);
  const { loading: detailsLoading, run: getRequestDetails } = useRequest(
    (requestId, offerId) => getRequestsDetail({ requestId, offerId }),
    {
      manual: true,
      refreshDeps: [requestId, offerId],
      onSuccess: (response: any) => {
        const { code, data } = response;
        setDetailsCode(code);
        if (code === 200) {
          setDetails(data);
        }
      },
    },
  );
  useEffect(() => {
    getRequestDetails(requestId, offerId);
  }, [requestId, offerId]);
  return {
    details,
    detailsCode,
    detailsLoading,
    getRequestDetails,
  };
};
