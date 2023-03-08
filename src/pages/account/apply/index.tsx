import Button from '@/components/Button';
import TextAreaFormItem from '@/components/ProfileFormItem/TextAreaFormItem';
import MyStepper, { stepValueType } from '@/pages/seller/components/Stepper';
import {
  Box,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useSelector, history } from 'umi';
import styles from './index.less';
import ThumbSwiper from '@/components/ThumbSwiper';
import SelectFormItem from '@/components/ProfileFormItem/SelectFormItem';
import { IOptionList } from '@/pages/seller/services/basic';
import { IMenuState } from '@/models/menu';
import { getCategorySelect, getSubcategorySelect } from '@/utils/menuOptions';
import * as yup from 'yup';
import PriceInput from '@/pages/seller/services/components/PriceInput';
import {
  acceptFileType,
  getFileMaxSize,
  getTokenSysDecimals,
  numberDecimal,
  toThousands,
} from '@/utils';
import Toast from '@/components/Toast';
import { useRequest } from 'ahooks';
import { IResponse } from '@/service/types';
import { postRequestsCreate } from '@/service/requests';
import { useSwiperContent } from '@/hooks/useSwiperContent';
import { EPostType } from '@/service/user/types';
import { FileWithFid, IFileWithFid } from '@/components/Uploader';
import { useUploadFile } from '@/hooks/useUploadFile';
import { Errors } from '@/service/errors';

const steps: stepValueType[] = [
  {
    label: 'Submit new request',
  },
  {
    label: 'Seller makes an offer',
  },
  {
    label: 'Communicate and select',
  },
  {
    label: 'Confirm the order in 15D',
  },
];

export interface IdeliverDays {
  label: string;
  value: string;
}

const deliverDays: IdeliverDays[] = [
  {
    label: '24Hours',
    value: '1',
  },
  {
    label: '3Days',
    value: '3',
  },
  {
    label: '7Days',
    value: '7',
  },
];

const ValidationSchema = yup.object({
  description: yup.string().required(''),
  category: yup.string().required(''),
  subcategory: yup.string().required(''),
  deliverTime: yup
    .string()
    .required('')
    .matches(/^\+?[1-9]\d*$/, 'Must be > 0 integral numbers.'),
  budgetAmount: yup
    .string()
    .required('')
    .test('AMOUNT', 'Please enter in 0.00 format.', (val) => {
      if (val) {
        if (/^\.\d+$/.test(val)) {
          return false;
        }
      }
      return true;
    })
    .test('BUDGETAMOUNT', 'Must be > 0 numbers.', function (val) {
      if (val) {
        if (
          Number(val) > 0 &&
          /(^[1-9](\d+)?(\.\d+)?$)|(^\d\.\d+$)/.test(val)
        ) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }),
});

const RequestApply: React.FC = () => {
  const {
    contentList,
    setContentList,
    checkFile,
    batchBeforeUpload,
    batchAfterSuccess,
    batchAfterError,
    batchAfterRetry,
  } = useSwiperContent();

  const [categoryList, setCategoryList] = useState<IOptionList[]>([]);
  const [subcategoryList, setSubcategoryList] = useState<IOptionList[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [notice, setNotice] = useState<string>('default');
  const { tokens, currency } = useSelector((state: any) => state.coins);
  const { uid } = useSelector((state: any) => state.user);
  const { fileConfig } = useSelector((state: any) => state.fileConfig);

  const { menus: menuData } = useSelector<any, IMenuState>(
    (state) => state.menus,
  );
  const { config } = useSelector((state: any) => state.config);
  const { coinBalance } = useSelector((state: any) => state.wallet);

  const { loading, run: submitRequest } = useRequest<IResponse<any>, any>(
    (params) => postRequestsCreate({ ...params }),
    {
      manual: true,
      onSuccess: (res: any) => {
        const { code, data } = res;
        if (code === 30032) {
          // 三个等待着
          return Toast.error(
            `Oops! You already have ${config?.REQ_WAITING_COUNT?.cfgVal} requests in waiting.`,
          );
        }
        if (code === 30031) {
          //  账户禁用
          return Toast.error(
            'Your account is disabled. Please contact Metalents Customer Service.',
          );
        }
        if (code !== 200) {
          return Toast.error('Unknown system failure: Please try');
        } else {
          Toast.success('Successfully submitted!');
          history.push(`/request/details?requestId=${data?.id}`);
        }
      },
    },
  );

  // 一级菜单下拉列表
  useEffect(() => {
    const firstMenus: IOptionList[] = getCategorySelect(menuData);
    setCategoryList(firstMenus);
  }, [menuData]);

  const formik = useFormik({
    initialValues: {
      budgetAmount: '',
      coinId: 1,
      category: '',
      deliverTime: '',
      description: '',
      posts: [],
      subcategory: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      let sysDecimals = getTokenSysDecimals(values?.coinId, tokens) || 0;
      const tempValue = {
        ...values,
        deliverTime: Number(values?.deliverTime),
        budgetAmount: values?.budgetAmount
          ? numberDecimal(values?.budgetAmount, sysDecimals).toString()
          : '',
      };
      submitRequest(tempValue);
    },
  });

  useEffect(() => {
    let posts = contentList
      .filter((item) => item.status === 'success')
      .map((item) => ({
        ...item,
        fileThumbnailUrl: item.fileUrl,
        id: 0,
        type: fileConfig?.requests?.postType || EPostType.request,
        userId: uid,
      }));

    formik.setFieldValue('posts', posts);
  }, [contentList, uid]);

  // 修改一级菜单时，重置二级菜单和二级菜单选中
  const changeCategory = (event: any) => {
    formik.setFieldValue('subcategory', '');
    const { subserviceObj } = getSubcategorySelect(
      menuData,
      event?.target?.value,
    );
    setSubcategoryList(subserviceObj);
  };

  const handleDays = (item: IdeliverDays) => {
    formik.setFieldValue('deliverTime', item?.value);
  };

  const handleSubmit = () => {
    if (!formik?.isValid) {
      return Toast.error(`Input box can't be blank`); // 有未填
    }
    formik?.handleSubmit();
  };

  const handleLeave = () => {
    setNotice('default');
  };

  const { run: uploadFile } = useUploadFile({
    manual: true,
    onSuccess: (resp: any, params: any) => {
      if (resp.code === 200) {
        // ↓  error code for test
        // if (resp.code !== 200) {
        batchAfterSuccess(params[0].fid, resp?.data.path);
        Toast.success('Successfully uploaded!');
      } else {
        batchAfterError(params[0].fid);
        Toast.error(Errors[resp.code] || Errors['*']);
      }
    },
    onError: (resp: any, params: any) => {
      batchAfterError(params[0].fid);
      Toast.error(Errors[resp.code] || Errors['*']);
    },
  });

  const beforeUpload = useCallback(
    (file: FileWithFid): void => {
      const errors = checkFile({
        file,
        limitSize: getFileMaxSize(fileConfig?.requests?.fileMaxSize),
      });

      if (errors.length > 0) {
        return;
      }

      batchBeforeUpload(file);
    },
    [batchBeforeUpload],
  );

  const onError = useCallback(
    (_, file) => {
      if (file) {
        batchAfterError(file?.fid);
      }
    },
    [batchAfterError],
  );

  const onRetry = useCallback(
    (file) => {
      if (file?.originFileObj) {
        uploadFile(file.originFileObj);
        batchAfterRetry(file.fid);
      }
    },
    [uploadFile, batchAfterRetry],
  );

  const onSuccess = useCallback(
    (file: IFileWithFid): void => {
      batchAfterSuccess(file.fid, file.fileUrl);
    },
    [batchAfterSuccess],
  );

  useEffect(() => {
    if (formik?.values?.coinId && coinBalance) {
      setBalance(coinBalance[formik?.values?.coinId] || 0);
    }
  }, [formik?.values?.coinId, coinBalance]);

  return (
    <section className={styles['request-apply']}>
      <div className={styles['left-content']}>
        <MyStepper value={steps} activeStep={0} />
        <div className={styles['content']}>
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h2" className={styles['header']}>
              Describe the service you are looking for
            </Typography>
            <div
              className={styles['item-box']}
              onMouseEnter={() => setNotice('description')}
              onMouseLeave={handleLeave}
            >
              <TextAreaFormItem
                label="1.Descrlbe the service you're looking to purchase - please be as detailed as possible"
                required
                placeholder={'My request is...'}
                formik={formik}
                name="description"
                minHeight="175px"
                maxLength={350}
                className={styles['text-area']}
              />

              <ThumbSwiper
                spaceBetween={36}
                slidesPerView={contentList.length < 6 ? contentList.length : 6}
                contentList={contentList}
                limitSize={getFileMaxSize(fileConfig?.requests?.fileMaxSize)}
                countLimit={fileConfig?.requests?.fileCount || 1}
                beforeUpload={beforeUpload}
                onUploadSuccess={onSuccess}
                onError={onError}
                onRetry={onRetry}
                onDelete={setContentList}
                buttonLabel={`File size < ${getFileMaxSize(
                  fileConfig?.requests?.fileMaxSize,
                )}MB`}
                accept={
                  fileConfig?.requests?.fileExt
                    ? acceptFileType(fileConfig?.requests?.fileExt)
                    : undefined
                }
              />

              {notice === 'description' && (
                <div
                  className={`${styles['right-content']} ${styles['description-notice']}`}
                >
                  <Typography variant="h3">1.Define in detail:</Typography>
                  <Typography variant="body2">
                    A user can only have max{' '}
                    {config?.['REQ_WAITING_COUNT']?.cfgVal} requests in waiting
                    at the same time.
                  </Typography>
                  <Typography variant="h3" sx={{ mt: 30 }}>
                    For example:
                  </Typography>
                  <Typography variant="body2">
                    If you are looking for a logo , you can specify your company
                    name , business type , preferred color etc.
                  </Typography>
                </div>
              )}
            </div>
            <div
              className={styles['item-box']}
              onMouseEnter={() => setNotice('menu')}
              onMouseLeave={handleLeave}
            >
              <Stack direction="row" spacing={80} mt={34}>
                <SelectFormItem
                  label="2.Choose a category"
                  required
                  formik={formik}
                  name="category"
                  placeholder="Select category..."
                  options={categoryList}
                  onChange={(event: any) => changeCategory(event)}
                />
                <SelectFormItem
                  label=" "
                  required
                  formik={formik}
                  name="subcategory"
                  placeholder="Select subcategory..."
                  options={subcategoryList}
                  className={styles['subcategory-select']}
                />
              </Stack>
              {notice === 'menu' && (
                <div
                  className={`${styles['right-content']} ${styles['menu-notice']}`}
                >
                  <Typography variant="h3">2. Refine your Request:</Typography>
                  <Typography variant="body2">
                    Choose the category and subcategory that best fits your
                    request.
                  </Typography>
                  <Typography variant="h3" sx={{ mt: 30 }}>
                    For example:
                  </Typography>
                  <Typography variant="body2">
                    If you are looking for a logo , you should choose "Logo
                    Design” within the "Graphics Design” category.
                  </Typography>
                </div>
              )}
            </div>
            <div
              className={styles['item-box']}
              onMouseEnter={() => setNotice('days')}
              onMouseLeave={handleLeave}
            >
              <Typography component="div" className={styles['label']}>
                3.Once you place your order, when would you like your service
                delivered?
                <Typography component="span" className={styles['mark']}>
                  &nbsp;*
                </Typography>
              </Typography>
              <Stack direction="row" spacing={44}>
                {deliverDays?.map((item: IdeliverDays, index: number) => {
                  return (
                    <div
                      key={item?.value}
                      className={`${styles['days']} ${
                        formik?.values?.deliverTime === item?.value &&
                        styles['active-days']
                      }`}
                      onClick={() => handleDays(item)}
                    >
                      {item?.label}
                    </div>
                  );
                })}
                <FormControl
                  error={
                    !!formik?.touched?.deliverTime &&
                    !!formik?.errors?.deliverTime
                  }
                  className={styles['input-form-control']}
                  sx={{ width: 243 }}
                >
                  <OutlinedInput
                    classes={{
                      root: styles['input-box'],
                      focused: styles['input-focused'],
                      notchedOutline: styles['notchedOutline'],
                      disabled: styles['disable-input'],
                    }}
                    placeholder="Enter..."
                    fullWidth
                    value={formik?.values?.deliverTime}
                    onBlur={() => {
                      formik.setFieldTouched('deliverTime', true);
                      formik.handleBlur;
                    }}
                    onChange={(ev) =>
                      formik.setFieldValue(
                        'deliverTime',
                        ev.target.value.trim(),
                      )
                    }
                    endAdornment={
                      <span style={{ color: 'rgba(17, 17, 17, 0.3)' }}>
                        Day(s)
                      </span>
                    }
                  />
                  <FormHelperText className={styles['helper-text']}>
                    {formik?.touched?.deliverTime &&
                      formik?.errors?.deliverTime}
                  </FormHelperText>
                </FormControl>
              </Stack>
              {notice === 'days' && (
                <div
                  className={`${styles['right-content']} ${styles['day-notice']}`}
                >
                  <Typography variant="h3">3. Set a Delivery Time:</Typography>
                  <Typography variant="body2">
                    This is the amount of time the seller has to work on your
                    order . Please note that our quest for faster delivery may
                    impact the price.
                  </Typography>
                </div>
              )}
            </div>
            <div
              className={styles['item-box']}
              onMouseEnter={() => setNotice('price')}
              onMouseLeave={handleLeave}
            >
              <Typography
                component="div"
                className={styles['label']}
                sx={{ mt: 32 }}
              >
                4.What is your budget for this service?
                <Typography component="span" className={styles['mark']}>
                  &nbsp;*
                </Typography>
              </Typography>
              <Stack direction="row" spacing={16}>
                <FormControl
                  error={
                    !!formik?.touched?.budgetAmount &&
                    !!formik?.errors?.budgetAmount
                  }
                  className={styles['input-form-control']}
                >
                  <PriceInput
                    menuValue={formik?.values?.coinId}
                    inputValue={formik?.values?.budgetAmount}
                    onInputChange={(value) => {
                      formik.setFieldValue('budgetAmount', value.trim());
                    }}
                    onMenuChange={(value) => {
                      formik.setFieldValue('coinId', value);
                    }}
                    placeholder="Amount..."
                    onBlurFun={(e) => {
                      formik?.setFieldTouched('budgetAmount', true);
                      formik?.handleBlur(e);
                    }}
                  />
                  <FormHelperText className={styles['helper-text']}>
                    {formik?.touched?.budgetAmount &&
                      formik?.errors?.budgetAmount}
                  </FormHelperText>
                </FormControl>
                <Typography
                  variant="body1"
                  sx={{
                    ml: 16,
                    lineHeight: '48px',
                    color: 'rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {`Balance : ${toThousands(
                    balance,
                    currency?.[formik?.values?.coinId]?.sysDecimals,
                  )} ${currency?.[formik?.values?.coinId]?.name}`}
                </Typography>
              </Stack>
              {notice === 'price' && (
                <div
                  className={`${styles['right-content']} ${styles['price-notice']}`}
                >
                  <Typography variant="h3">4. Set Your Budget:</Typography>
                  <Typography variant="body2">
                    Enter an amount you are willing to spend for this service.
                    (The 5% processing Fee is not included)
                  </Typography>
                </div>
              )}
            </div>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                loading={loading}
                size="large"
                className={styles['save-btn']}
                onClick={handleSubmit}
              >
                Submit Request
              </Button>
            </Box>
          </form>
        </div>
      </div>
      <Stack spacing={12}>
        {notice === 'default' && (
          <div className={styles['right-content']}>
            <Typography variant="body2">
              Fill in your requirements and submit a{' '}
              {config?.['REQ_NOOFFER_15_DAYS']?.cfgVal}-day request into the
              market.
            </Typography>
            <Typography variant="body2" sx={{ mt: 30 }}>
              A user can only have max {config?.['REQ_WAITING_COUNT']?.cfgVal}{' '}
              requests in waiting at the same time.
            </Typography>
            <Typography variant="body2" sx={{ mt: 30 }}>
              *Please double check your request.
              <br />
              It will not be able to be modified after release, but can only be
              closed.
            </Typography>
          </div>
        )}
      </Stack>
    </section>
  );
};

export default RequestApply;
