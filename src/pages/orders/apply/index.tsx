import Button from '@/components/Button';
import BackIcon from '@/components/ProfileFormItem/BackIcon';
import MyStepper, { stepValueType } from '@/pages/seller/components/Stepper';
import { Container, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { history, useDispatch, useLocation, useSelector } from 'umi';
import { ICusSubService } from '@/pages/services/[serviceId$]/components/ServiceSubmit';
import { useGetVisitor } from '@/hooks/useUser';
import {
  IResDetail,
  ServiceLevelType,
} from '@/pages/services/[serviceId$]/type';
import MyAvatar from '@/components/Avatar';
import { IFile } from '@/types';
import ViewFiles from '@/pages/request/components/ViewFiles';
import {
  getCurrentToken,
  getTokenSysDecimals,
  numberDecimal,
  toThousands,
} from '@/utils';
import BigNumber from 'bignumber.js';
import { ITokensItem } from '@/service/services/types';
import InitServicePNG from '@/assets/imgs/orders/init-service.png';
import OrderStatusComponent from '../components/OrderStatusComponent';
import { IOrderConfirmCheck, OrderCreateType } from '@/service/orders/types';
import { useRequest } from 'ahooks';
import { getOrderConfirmCheck, postOrderCreate } from '@/service/orders';
import Toast from '@/components/Toast';
import PaymentDialog from '@/components/Wallet/components/PaymentDialog';
import VerifiedSVG from '@/assets/imgs/home/verified.svg';
import SelectAddFundsDialog from '@/components/Wallet/components/SelectAddFundsDialog';
import WalletAddfundsDialog from '@/components/Wallet/components/WalletAddFundsDialog';
import TransferAddFundsDialog from '@/components/Wallet/components/TransferAddFundsDialog';
import AddFundsSuccess from '@/components/Wallet/components/AddFundsSuccess';
import { IResponse } from '@/service/types';

export interface IInitInfo {
  requestId?: Number;
  serviceId?: Number;
  sellerId: Number;
  orderType: OrderCreateType;
  service?: {
    title: string;
    posts?: IFile[];
    level: number;
    category: string;
    subcategory: string;
    budgetAmount: string;
    coinId: number;
    deliverTime: number;
  };
  request?: {
    description: string;
    posts: IFile[];
    deliverTime: string;
    budgetAmount: string;
    coinId: number;
    category: string;
    subcategory: string;
  };
}

const OrdersApply: React.FC = () => {
  const steps: stepValueType[] = [
    {
      label: 'Confirm order & Pay',
      description: 'Freeze the funds',
    },
    {
      label: 'Order in progress',
      description: 'Complete the agreed work',
    },
    {
      label: 'Review the service',
      description: 'Wait for review',
    },
    {
      label: 'Confirm & Close order',
      description: 'Package and evaluate orders',
    },
  ];

  const { state } = useLocation() as any;
  const [initInfo, setInitInfo] = useState<IInitInfo>();

  const [currentToken, setCurrentToken] = useState<ITokensItem | undefined>(
    undefined,
  );
  const { tokens } = useSelector((state: any) => state.coins);
  const { config } = useSelector((state: any) => state.config);
  const { uid } = useSelector((state: any) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    setInitInfo(state?.initInfo);
  }, [state]);

  useEffect(() => {
    if (initInfo && tokens) {
      let tempToken = getCurrentToken(
        Number(initInfo?.service?.coinId) || Number(initInfo?.request?.coinId),
        tokens,
      );
      setCurrentToken(tempToken);
    }
  }, [initInfo, tokens]);

  const { userProfile } = useGetVisitor(initInfo?.sellerId);
  const { currency } = useSelector((state: any) => state.coins);

  const goBack = () => {
    history.goBack();
  };
  const {
    data,
    loading: confirmLoading,
    run: confirmCheck,
  } = useRequest<IResponse<IOrderConfirmCheck>, any>(
    (params: any) => getOrderConfirmCheck(params),
    {
      manual: true,
      onSuccess: (res: any) => {
        const { code, data } = res;
        if (!data?.success) {
          return Toast.error(
            'Order price has changed, please repurchase and pay.',
          );
        }
        const tempFile: IFile[] = [];
        initInfo?.request?.posts?.map((item) => {
          tempFile.push({
            ...item,
            userId: uid,
          });
        });
        const tempVal = {
          description: initInfo?.request?.description,
          fiels: initInfo?.request?.posts,
          proId:
            initInfo?.orderType === OrderCreateType.service
              ? initInfo?.serviceId
              : initInfo?.requestId,
          proType: initInfo?.orderType,
          budgetAmount:
            initInfo?.orderType === OrderCreateType.service
              ? initInfo?.service?.budgetAmount
              : initInfo?.request?.budgetAmount,
          coinId:
            initInfo?.orderType === OrderCreateType.service
              ? initInfo?.service?.coinId
              : initInfo?.request?.coinId,
        };

        dispatch({
          type: 'dialog/show',
          payload: {
            key: 'paymentDialog',
            params: tempVal,
            payCallback: () => {},
          },
        });
      },
    },
  );

  const handleConfirm = () => {
    confirmCheck({
      proId:
        initInfo?.orderType === OrderCreateType.service
          ? initInfo?.serviceId
          : initInfo?.requestId,
      proType: initInfo?.orderType,
      currentPrice:
        initInfo?.orderType === OrderCreateType.service
          ? initInfo?.service?.budgetAmount
          : initInfo?.request?.budgetAmount,
    });
  };

  return (
    <section className={styles['orders-apply']}>
      <Container disableGutters maxWidth="lg" sx={{ mt: 20 }}>
        <MyStepper value={steps} activeStep={0} />
        <div className={styles['content']}>
          <Button
            classes={{ root: styles['back-btn'] }}
            startIcon={<BackIcon />}
            onClick={goBack}
          >
            Back
          </Button>

          <Typography variant="h2" classes={{ root: styles['title'] }}>
            Create A New Order
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            className={styles['content-header']}
          >
            <Stack direction="row" alignItems="center">
              <Typography variant="body1" fontWeight={500}>
                Seller: &nbsp;
              </Typography>
              <Typography variant="body1" className={styles['shop-name']}>
                {userProfile?.shopname}
              </Typography>
              {userProfile?.isVerify === 'verified' && (
                <img
                  src={VerifiedSVG}
                  alt=""
                  width={16}
                  style={{ marginLeft: 6, marginRight: 12 }}
                />
              )}
            </Stack>
            <OrderStatusComponent status={0} />
          </Stack>
          <div className={styles['service']}>
            {initInfo?.orderType === OrderCreateType.service ? (
              <>
                {initInfo?.service?.posts?.[0]?.fileType?.includes(
                  'audio/mp4',
                ) ||
                initInfo?.service?.posts?.[0]?.fileType?.includes(
                  'video/mp4',
                ) ? (
                  <video
                    width="128px"
                    height="96px"
                    // onClick={goDetail}
                    style={{ cursor: 'pointer', borderRadius: '8px' }}
                  >
                    <source
                      src={
                        initInfo?.service?.posts?.[0]?.fileThumbnailUrl ||
                        initInfo?.service?.posts?.[0]?.fileUrl
                      }
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <MyAvatar
                    src={
                      initInfo?.service?.posts?.[0]?.fileThumbnailUrl ||
                      initInfo?.service?.posts?.[0]?.fileUrl
                    }
                    variant="square"
                    size={128}
                    height={96}
                    sx={{ borderRadius: '8px', cursor: 'pointer' }}
                  />
                )}
              </>
            ) : (
              <img src={InitServicePNG} className={styles['init-post']} />
            )}
            <Stack ml={10}>
              <div className={styles['service-title']}>
                {initInfo?.service?.title ||
                  `It's a customized service of ${initInfo?.request?.category} / ${initInfo?.request?.subcategory}`}
              </div>
              <div className={styles['service-type']}>
                {initInfo?.service
                  ? `${ServiceLevelType[initInfo?.service?.level]} service x 1`
                  : `Customized service x 1`}
              </div>
            </Stack>
          </div>
          <div className={styles['request']}>
            <Typography variant="body1" fontWeight={500}>
              Request Description:
            </Typography>
            <Typography
              variant="body2"
              mt={10}
              color="#444444"
              sx={{ lineHeight: '24px' }}
            >
              {initInfo?.request?.description}
            </Typography>
            <Typography variant="body1" mt={20} mb={20}>
              <span style={{ fontWeight: 500 }}>Delivery time: &nbsp;</span>
              {initInfo?.orderType === OrderCreateType?.service ? (
                <span>{`${initInfo?.service?.deliverTime} ${
                  Number(initInfo?.service?.deliverTime) > 1 ? 'Days' : 'Day'
                }`}</span>
              ) : (
                <span>{`${initInfo?.request?.deliverTime} ${
                  Number(initInfo?.request?.deliverTime) > 1 ? 'Days' : 'Day'
                }`}</span>
              )}
            </Typography>
            <ViewFiles posts={initInfo?.request?.posts || []} disabledPreview />
          </div>

          <div className={styles['price']}>
            {initInfo && (
              <Typography variant="h2">
                Total:&nbsp;
                {initInfo?.orderType === OrderCreateType.service ? (
                  <span>
                    {toThousands(initInfo?.service?.budgetAmount || 0)}{' '}
                    {currentToken?.name?.toLocaleUpperCase()}
                  </span>
                ) : (
                  <span>
                    {toThousands(initInfo?.request?.budgetAmount || 0)}{' '}
                    {currentToken?.name?.toLocaleUpperCase()}
                  </span>
                )}
              </Typography>
            )}
            {initInfo?.orderType === OrderCreateType.service ? (
              <Typography className={styles['fee']}>
                {`(including
              ${toThousands(
                new BigNumber(initInfo?.service?.budgetAmount || 0)
                  .times(Number(config?.PLATFORM_FEE?.cfgVal) / 100)
                  .toString(),
                currency?.[initInfo?.service?.coinId || 1]?.sysDecimals,
              )} ${currentToken?.name?.toLocaleUpperCase()} Fee)`}
              </Typography>
            ) : (
              <Typography className={styles['fee']}>
                {`(including
              ${toThousands(
                new BigNumber(initInfo?.request?.budgetAmount || 0)
                  .times(Number(config?.PLATFORM_FEE?.cfgVal) / 100)
                  .toString(),
                currency?.[initInfo?.service?.coinId || 1]?.sysDecimals,
              )} ${currentToken?.name?.toLocaleUpperCase()} Fee)`}
              </Typography>
            )}
          </div>
          <div className={styles['confirm-btn']}>
            {/* TODO 按钮颜色换成钱包封装的支付按钮 */}
            <Button
              variant="contained"
              size="large"
              onClick={handleConfirm}
              loading={confirmLoading}
            >
              Confirm &Pay
            </Button>
          </div>
        </div>
      </Container>
      <PaymentDialog />
      <SelectAddFundsDialog />
      <WalletAddfundsDialog />
      <TransferAddFundsDialog />
      <AddFundsSuccess />
    </section>
  );
};

export default OrdersApply;
