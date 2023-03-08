import { Container } from '@mui/material';
import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import ServiceHeader from '../components/ServiceHeader';
import ServicePackage from '../components/ServicePackage';
import styles from './index.less';
import Button from '@/components/Button';
import * as yup from 'yup';
import { useLocation, useSelector } from 'umi';
import { useRequest } from 'ahooks';
import {
  IMainServiceOrderProps,
  ISubServiceInfo,
  ISubServiceStatus,
} from '@/service/services/types';
import { IResponse } from '@/service/types';
import Toast from '@/components/Toast';
import { history } from 'umi';
import { getTokenSysDecimals, numberDecimal } from '@/utils';
import {
  getServiceByMain,
  getServiceDetail,
  postServiceSubCreateOrUpdate,
} from '@/service/services';

export interface IPackDisable {
  basic: {
    disable: boolean;
    order: number;
  };
  standard: {
    disable: boolean;
    order: number;
  };
  premium: {
    disable: boolean;
    order: number;
  };
}

export interface IServicePackages {}

const openIsRequired = {
  is: (status: ISubServiceStatus) => status === 1,
  then: yup.string().required(''),
};

const ServicePackages: React.FC<IServicePackages> = ({}) => {
  const { query } = useLocation() as any;
  const serviceId = Number(query?.id);
  const [initSubServiceInfo, setInitSubServiceInfo] = useState<
    ISubServiceInfo[]
  >([]);
  const [packDisable, setPackDisable] = useState<IPackDisable>({
    basic: {
      disable: false,
      order: 0,
    },
    standard: {
      disable: false,
      order: 0,
    },
    premium: {
      disable: false,
      order: 0,
    },
  });
  const { tokens } = useSelector((state: any) => state.coins);

  const [serviceOrder, setServiceOrder] = useState<IMainServiceOrderProps>({
    total: 0,
    list: null,
  });

  // 获取服务信息，用于编辑
  const { data: initServiceInfo } = useRequest<any, any>(() => {
    return getServiceDetail(serviceId);
  });

  // 获取服务下各种状态订单的数量
  const { data: mainServiceOrder, run: getServiceOrder } = useRequest<
    IResponse<IMainServiceOrderProps>,
    any
  >(
    () => {
      return getServiceByMain(serviceId);
    },
    {
      manual: true,
    },
  );

  const { currency } = useSelector((state: any) => state.coins);
  const ValidationSchema = yup.object().shape({
    subServices: yup.array().of(
      yup.object({
        budgetAmount: yup
          .string()
          .trim()
          .when('status', openIsRequired)
          .test('AMOUNT', 'Please enter in 0.00 format.', (val) => {
            if (val) {
              if (/^\.\d+$/.test(val)) {
                return false;
              }
            }
            return true;
          })
          .matches(
            /(^[1-9](\d+)?(\.\d+)?$)|(^\d\.\d+$)/,
            'Must be > 0 integral numbers.',
          )
          .test('AMOUNT-TOKEN', 'Must be greater than $10', function (val) {
            if (val) {
              const { coinId } = this.parent;
              const sysDecimals = getTokenSysDecimals(coinId, tokens) || 0;
              if (
                numberDecimal(val, sysDecimals) * currency?.[coinId]?.price >
                10
              ) {
                return true;
              }
              return false;
            }
            return true;
          }),
        deliverTime: yup
          .string()
          .trim()
          .when('status', openIsRequired)
          .matches(/^\+?[1-9]\d*$/, 'Must be > 0 integral numbers.'),
        finalDocs: yup.string().trim().when('status', openIsRequired),
        coinId: yup
          .number()
          .test('COINID', 'Must be greater than $10', function (val) {
            if (val) {
              const { budgetAmount } = this.parent;
              if (budgetAmount) {
                const sysDecimals = getTokenSysDecimals(val, tokens) || 0;
                if (
                  numberDecimal(budgetAmount, sysDecimals) *
                    currency?.[val]?.price >
                  10
                ) {
                  return true;
                }
                return false;
              }
              return true;
            }
            return true;
          }),
      }),
    ),
  });

  const { loading: submitLoading, run: submitSubServices } = useRequest(
    (dataParams: any): Promise<IResponse<any>> => {
      return postServiceSubCreateOrUpdate(dataParams);
    },
    {
      manual: true,
      onSuccess: (res: any) => {
        const { code } = res;

        if (code === 30030) {
          return Toast.error(
            'Your account is disabled. Please contact Metalents Customer Service.',
          );
        }
        if (code !== 200) {
          return Toast.error('Unknown system failure: Please try');
        }
        if (code === 200) {
          Toast.success('Successfully saved!');
          history.replace('/seller/services?sidebar');
        }
      },
    },
  );

  // 修改服务时，请求主服务的状态订单数量,新建时不请求
  useEffect(() => {
    if (initServiceInfo?.data?.subservices?.length > 0) {
      const { subservices } = initServiceInfo?.data;
      subservices?.map((item: any) => {
        item.deliverTime = item?.deliverTime
          ? item?.deliverTime?.toString()
          : '';
      });
      setInitSubServiceInfo(subservices);
      getServiceOrder();
    }
  }, [initServiceInfo]);

  useEffect(() => {
    if (initSubServiceInfo?.length > 0) {
      formik.setFieldValue('serviceId', serviceId);
      formik.setFieldValue('subServices', initSubServiceInfo);
    }
  }, [initSubServiceInfo]);

  // 赋值订单数量
  useEffect(() => {
    if (mainServiceOrder) {
      setServiceOrder(mainServiceOrder?.data);
    }
  }, [mainServiceOrder]);

  useEffect(() => {
    setInitSubServiceInfo(initServiceInfo?.data?.subservices);
  }, [initServiceInfo]);

  useEffect(() => {
    if (initSubServiceInfo?.length === 0) {
      // 新创建的服务
    }
  }, [initSubServiceInfo]);

  // interface IFormData = ISubServiceInfo
  const formik = useFormik({
    initialValues: {
      serviceId,
      subServices: [
        {
          budgetAmount: '',
          coinId: 1,
          deliverTime: '',
          finalDocs: '',
          level: 1,
          revisions: -1,
          status: 1,
        },
        {
          budgetAmount: '',
          coinId: 1,
          deliverTime: '',
          finalDocs: '',
          revisions: -1,
          level: 2,
          status: 2,
        },
        {
          budgetAmount: '',
          coinId: 1,
          deliverTime: '',
          finalDocs: '',
          level: 3,
          revisions: -1,
          status: 2,
        },
      ],
    },
    validationSchema: ValidationSchema,
    onSubmit: (values: any, formikHelpers) => {
      // 有Schema 需要验证完Schema
      const tempVal = values;
      tempVal?.subServices?.map((item: ISubServiceInfo) => {
        item.deliverTime = Number(item?.deliverTime);
        let sysDecimals = getTokenSysDecimals(item?.coinId, tokens) || 0;
        item.budgetAmount = item?.budgetAmount
          ? numberDecimal(item?.budgetAmount, sysDecimals).toString()
          : '';
      });
      submitSubServices(tempVal);
    },
  });

  // 判断每个模块是否禁用
  useEffect(() => {
    if (initSubServiceInfo?.length > 0 && serviceOrder?.total > 0) {
      let tempPack = packDisable;
      initSubServiceInfo?.map((item, index) => {
        const orderMap = serviceOrder?.list?.filter(
          (order) => order.id === item?.id,
        );
        if (orderMap && orderMap?.[0]?.inQueue > 0) {
          let temp = '';
          let temporder = 0;
          switch (item?.level) {
            case 1:
              temp = 'basic';
              break;
            case 2:
              temp = 'standard';
              break;
            case 3:
              temp = 'premium';
              break;
            default:
              temp = '';
          }
          temporder = orderMap?.[0]?.inQueue;
          if (temp) {
            tempPack = {
              ...tempPack,
              [temp]: {
                disable: true,
                order: temporder,
              },
            };
          }
        }
      });
      setPackDisable(tempPack);
    }
  }, [serviceOrder, initSubServiceInfo]);

  const lists = [
    {
      title: '1.Basic package',
      queueOrder: packDisable?.basic?.order,
      disabled: packDisable?.basic?.disable,
    },
    {
      title: '2.Standard package',
      queueOrder: packDisable?.standard?.order,
      showSwitch: true,
      disabled: packDisable?.standard?.disable,
    },
    {
      title: '3.Premium package',
      queueOrder: packDisable?.premium?.order,
      showSwitch: true,
      disabled: packDisable?.premium?.disable,
    },
  ];

  const checkValueName = (label: string): string => {
    switch (label) {
      case 'deliverTime':
        return 'Delivery time';
      case 'budgetAmount':
      case 'coinId':
        return 'Price';
      default:
        return '';
    }
  };

  const handleSubmit = () => {
    console.log('submit', formik.errors);
    let errorList: string[] = [];
    if (formik.errors?.subServices) {
      formik.errors?.subServices?.map((item: any) => {
        if (item) {
          Object.keys(item)?.map((v) => {
            if (item[v]) {
              const labelVal =
                item[v].slice(0, 1).toLowerCase() + item[v].slice(1);
              errorList.push(`${checkValueName(v)} ${labelVal}`);
            }
          });
        }
      });
    }
    if (errorList.length > 0) {
      return Toast.error(errorList[0]);
    }

    if (!formik?.isValid) {
      return Toast.error(`Input box can't be blank`); // 有未填
    } else if (formik?.isValid && !formik?.dirty) {
      return Toast.error(`Input box can't be blank`); // 创建时
    }
    formik?.handleSubmit();
  };

  return (
    <section className={styles['service-packages']}>
      <Container maxWidth="lg" disableGutters>
        <ServiceHeader tab={1} />
        <div className={styles['content']}>
          <form onSubmit={formik.handleSubmit}>
            {lists.map((v: any, key) => (
              <ServicePackage
                {...v}
                name="subServices"
                index={key}
                key={key}
                formik={formik}
              />
            ))}
            <div style={{ textAlign: 'center' }}>
              <Button
                // type="submit"
                variant="contained"
                loading={submitLoading}
                size="large"
                className={styles['save-btn']}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default ServicePackages;
