import Button from '@/components/Button';
import { ISubServiceInfo, ServiceStatus } from '@/service/services/types';
// import { ISubServiceInfo } from '@/service/services/types';
import { getCurrentToken, toThousands } from '@/utils';
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { uid as reactUid } from 'react-uid';
import { useDispatch, useSelector } from 'umi';
import { IResDetail, ISellerInfo } from '../../type';
import styles from './index.less';
import { IUserState } from '@/models/user';
import { UserStatus } from '@/service/user/types';
import Toast from '@/components/Toast';
import RequestOrderDialog from '../RequestOrderDialog';

interface IServiceSubmitProps {
  detailData: IResDetail | undefined;
  sellerInfo: ISellerInfo | undefined;
}

export interface ICusSubService extends ISubServiceInfo {
  USDPrice?: string;
}

const ServiceSubmit = ({ detailData, sellerInfo }: IServiceSubmitProps) => {
  const [initSubServices, setInitSubServices] = useState<ISubServiceInfo[]>([]);
  const [status, setStatus] = useState<ServiceStatus>();
  const [sellerId, setSellerId] = useState<number>();

  useEffect(() => {
    setInitSubServices(detailData?.subservices || []);
    setStatus(detailData?.status);
    setSellerId(detailData?.userId);
  }, [detailData]);

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [subservices, setSubservices] =
    useState<ICusSubService[]>(initSubServices);
  const [levelArray, setLevelArray] = useState<string[]>([]);
  const { tokens } = useSelector((state: any) => state.coins);
  const { uid, userInfo } = useSelector<any, IUserState>((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setSubservices(
      initSubServices
        ?.filter((key) => key?.status === 1)
        ?.map((item) => {
          let tempToken = getCurrentToken(item?.coinId, tokens);
          return {
            ...item,
            USDPrice: tokens
              ? new BigNumber(tempToken?.price || 0)
                  .times(item.budgetAmount)
                  .dp(2)
                  .toString()
              : '0',
          };
        }),
    );
    const validSubServices = initSubServices?.filter(
      (item) => item?.status === 1,
    );
    let tempArray: string[] = [];
    validSubServices?.map((item) => {
      if (item?.level === 1) {
        tempArray.push('Basic');
      } else if (item?.level === 2) {
        tempArray.push('Standard');
      } else if (item?.level === 3) {
        tempArray.push('Premium');
      }
    });
    setLevelArray(tempArray);
  }, [initSubServices, tokens]);

  const handleContinue = () => {
    if (!uid) {
      return dispatch({
        type: 'dialog/show',
        payload: {
          key: 'loginChooseDialog',
        },
      });
    }
    if (sellerId === uid) {
      return Toast.error(`You can't place orders to your own service.`);
    }
    if (
      userInfo?.status === UserStatus?.DISABLE_BUYER ||
      userInfo?.status === UserStatus?.DISABLE
    ) {
      return Toast.error(
        `Your account is disabled. Please contact Metalents Customer Service.`,
      );
    }
    dispatch({
      type: 'dialog/show',
      payload: {
        key: 'requestOrderDialog',
        serviceDetail: subservices[currentLevelIndex],
        // sellerId: sellerId
        detailData: detailData,
      },
    });
  };

  return (
    <div className={styles['serviceSubmit-container']}>
      <Typography classes={{ root: styles['str-service-packages'] }}>
        Service Packages
      </Typography>

      <div className={styles['level-btn-group']}>
        {levelArray.map((item, index) => {
          return (
            <Button
              key={reactUid(item)}
              rounded
              sx={{ minWidth: 100 }}
              variant={currentLevelIndex === index ? 'contained' : 'outlined'}
              onClick={() => {
                setCurrentLevelIndex(index);
              }}
            >
              {item}
            </Button>
          );
        })}
      </div>

      <div className={styles['delivery-time-box']}>
        <Typography classes={{ root: styles['str-delivery-time'] }}>
          Delivery time:
        </Typography>
        <Typography classes={{ root: styles['delivery-time'] }} variant="h3">
          {subservices[currentLevelIndex]?.deliverTime}{' '}
          {subservices[currentLevelIndex]?.deliverTime > 1 ? 'Days' : 'Day'}
        </Typography>
      </div>

      <div className={styles['final-documents-box']}>
        <Typography classes={{ root: styles['str-final-documents'] }}>
          Final Documents:
        </Typography>
        <Typography classes={{ root: styles['final-documents'] }} variant="h3">
          {subservices[currentLevelIndex]?.revisions === -1
            ? 'Unlimited'
            : subservices[currentLevelIndex]?.revisions}{' '}
          Revisions
        </Typography>
      </div>

      <div className={styles['final-description-box']}>
        <Typography classes={{ root: styles['description'] }}>
          {subservices[currentLevelIndex]?.finalDocs}
        </Typography>
      </div>

      <div className={styles['price-box']}>
        <Typography classes={{ root: styles['str-price'] }}>Price:</Typography>
        <Typography classes={{ root: styles['price'] }} variant="h2">
          {toThousands(subservices[currentLevelIndex]?.budgetAmount)}{' '}
          {getCurrentToken(
            subservices[currentLevelIndex]?.coinId,
            tokens,
          )?.name?.toLocaleUpperCase()}
        </Typography>
      </div>

      <Typography
        classes={{ root: styles['legal-currency-price'] }}
        variant="h3"
      >
        {`= $ ${toThousands(subservices[currentLevelIndex]?.USDPrice || '0')}`}
      </Typography>

      <Button
        variant="contained"
        classes={{
          root: classNames(
            styles['submit-btn'],
            status !== ServiceStatus.LIVE && styles['submit-btn-disabled'],
          ),
        }}
        disabled={
          status !== ServiceStatus.LIVE ||
          sellerInfo?.status === UserStatus?.DISABLE_SELLER ||
          sellerInfo?.status === UserStatus?.DISABLE
        }
        onClick={handleContinue}
      >
        {status !== ServiceStatus.LIVE ||
        sellerInfo?.status === UserStatus?.DISABLE_SELLER ||
        sellerInfo?.status === UserStatus?.DISABLE
          ? 'Not available now'
          : 'Continue'}
      </Button>
      <RequestOrderDialog />
    </div>
  );
};

export default ServiceSubmit;
