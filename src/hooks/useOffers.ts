import { getOffersCanCreate } from '@/service/offers';
import { IResponse } from '@/service/types';
import { useEffect, useState } from 'react';

export const userCanCreateData = (requestId: number) => {
  const [canCreateData, setCanCreateData] = useState<IResponse<null> | null>(
    null,
  );
  const getCanCreate = async () => {
    try {
      const response = await getOffersCanCreate(requestId);
      setCanCreateData(response);
    } catch (error) {
      console.log('canCreate--error', error);
    }
  };
  useEffect(() => {
    if (!requestId) return;
    getCanCreate();
  }, [requestId]);
  return {
    getCanCreate,
    canCreateData,
  };
};
