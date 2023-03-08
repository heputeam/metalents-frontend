import { Box, Container, Stack } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './index.less';
import ServiceHeader from '../components/ServiceHeader';
import InputFormItem from '@/components/ProfileFormItem/InputFormItem';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@/components/Button';
import SelectFormItem from '@/components/ProfileFormItem/SelectFormItem';
import { useRequest } from 'ahooks';
import FormCheckbox from '@/components/FormCheckbox';
import { ICheckboxItem } from '@/components/CheckBoxGroup';
import TextAreaFormItem from '@/components/ProfileFormItem/TextAreaFormItem';
import ThumbSwiper from '@/components/ThumbSwiper';
import { history, useLocation, useSelector } from 'umi';
import { IMenuState } from '@/models/menu';
import { IResponse } from '@/service/types';
import { IMainServiceRes } from '@/service/services/types';
import Toast from '@/components/Toast';
import { Errors } from '@/service/errors';
import {
  getCategorySelect,
  getOptionSelect,
  getSubcategorySelect,
} from '@/utils/menuOptions';
import {
  getServiceDetail,
  postServiceMainCreateOrUpdate,
} from '@/service/services';
import { IMenuOptions } from '@/service/public/types';
import { useSwiperContent } from '@/hooks/useSwiperContent';
import { FileWithFid, IFileWithFid } from '@/components/Uploader';
import { useUploadFile } from '@/hooks/useUploadFile';
import { acceptFileType, getFileMaxSize } from '@/utils';
import { EPostType } from '@/service/user/types';

export interface IServiceInfo {
  title: string;
  category: string;
  subcategory: string;
  description: string;
  optionIds: number[];
}
export interface IOptionList {
  label: any;
  value: string | number;
}

export interface IOptionData {
  [key: string]: IMenuOptions[];
}

export interface IServiceBasic {}

const ServiceBasic: React.FC<IServiceBasic> = ({}) => {
  const [serviceInfo, setServiceInfo] = useState<IServiceInfo | null>(null);
  const [categoryList, setCategoryList] = useState<IOptionList[]>([]);
  const [subcategoryList, setSubcategoryList] = useState<IOptionList[]>([]);

  const [optionData, setOptionData] = useState<IOptionData>({});
  const [initOptionCheck, setInitOptionCheck] = useState<IMenuOptions[]>([]);

  const [allOption, setAllOption] = useState<any>({});

  const {
    contentList,
    setContentList,
    checkFile,
    batchBeforeUpload,
    batchAfterSuccess,
    batchAfterError,
    batchAfterRetry,
  } = useSwiperContent();

  const { menus: menuData } = useSelector<any, IMenuState>(
    (state) => state.menus,
  );

  const { uid } = useSelector((state: any) => state.user);
  const { fileConfig } = useSelector((state: any) => state.fileConfig);

  const { query } = useLocation() as any;
  const serviceId = query?.id; // 路由参数，区分是创建还是修改

  // 获取服务信息
  const { run: getInitServiceInfo } = useRequest<any, any>(
    () => getServiceDetail(serviceId),
    {
      manual: true,
      onSuccess: (res) => {
        setServiceInfo(res?.data);
        const initData = res?.data;
        formik.setFieldValue('title', initData?.title);
        formik.setFieldValue('category', initData?.category);
        formik.setFieldValue('subcategory', initData?.subcategory);
        formik.setFieldValue('description', initData?.description);
        formik.setFieldValue('category', initData?.category);

        setContentList(
          initData?.posts
            ? initData.posts.map((post: any) => ({
                ...post,
                status: 'success',
              }))
            : [],
        );
        setInitOptionCheck(initData?.options || []);
      },
    },
  );

  useEffect(() => {
    if (serviceId !== undefined) {
      getInitServiceInfo();
    }
  }, [serviceId]);

  // 提交主服务
  const { loading: submitLoading, run: submitService } = useRequest<
    IResponse<IMainServiceRes>,
    any
  >(
    (params) => {
      return postServiceMainCreateOrUpdate(params);
    },
    {
      manual: true,
      onSuccess: (resp) => {
        if (resp.code === 30101) {
          return Toast.error(Errors[resp.code]);
        }
        if (resp.code === 30030) {
          return Toast.error(
            'Your account is disabled. Please contact Metalents Customer Service.',
          );
        }

        if (resp.code !== 200) {
          return Toast.error('Unknown system failure: Please try');
        }
        if (resp.code === 200) {
          Toast.success(
            `${serviceId ? 'Successfully saved!' : 'Successfully created!'}`,
          );
          history.replace(`/seller/services/pack?id=${resp?.data?.id}`);
        }
      },
      onError: (err) => {
        Toast.error('Unknown system failure: Please try');
      },
    },
  );

  // 一级菜单下拉列表
  useEffect(() => {
    const firstMenus: IOptionList[] = getCategorySelect(menuData);
    setCategoryList(firstMenus);
  }, [menuData]);

  // 表单验证
  const validationSchema = yup.object({
    title: yup.string().trim().required(''),
    category: yup.string().required(''),
    subcategory: yup.string().required(''),
    description: yup
      .string()
      .trim()
      .required('')
      .max(1200, 'No more than 1200 characters'),
  });

  const formik = useFormik({
    initialValues: {
      title: serviceInfo?.title || '',
      category: serviceInfo?.category || '',
      subcategory: serviceInfo?.subcategory || '',
      description: serviceInfo?.description || '',
      optionIds: serviceInfo?.optionIds || [],
      id: serviceId ? Number(serviceId) : 0,
      posts: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let optionIds: string[] = [];
      Object.keys(allOption)?.map((item: string) => {
        optionIds?.push(...allOption[item]);
      });
      const optionIdsNum = optionIds?.map((item) => Number(item));

      values.optionIds = optionIdsNum;
      values.title = values?.title?.trim();
      values.description = values?.description?.trim();
      submitService(values);
    },
  });

  // 修改一级菜单时，重置二级菜单选中和option
  const changeCategory = (event: any) => {
    formik.setFieldValue('subcategory', '');
    const { subserviceObj } = getSubcategorySelect(
      menuData,
      formik.values.category,
    );
    setSubcategoryList(subserviceObj);
  };

  // 修改服务时，默认生成二级菜单下拉
  useEffect(() => {
    const { subserviceObj } = getSubcategorySelect(
      menuData,
      formik.values.category,
    );
    setSubcategoryList(subserviceObj);
  }, [formik?.values?.category, menuData]);

  // 修改二级菜单时，重置option
  const changeSubcategory = (event: any) => {
    const tempOptionsObj = getOptionSelect(
      menuData,
      formik.values.category,
      formik.values.subcategory,
    );
    setOptionData(tempOptionsObj);
  };

  useEffect(() => {
    const tempOptionsObj = getOptionSelect(
      menuData,
      formik.values.category,
      formik.values.subcategory,
    );
    setOptionData(tempOptionsObj);
  }, [menuData, formik?.values?.category, formik.values.subcategory]);

  // 去除option中属性名的空格，并赋初始值
  useEffect(() => {
    let tempAll = {};
    Object.keys(optionData)?.map((item: string, index) => {
      const name = item.replace(' ', '');
      // formik.setFieldValue(name, []);
      const checkedItems = initOptionCheck?.filter(
        (v) => v.optionName === item,
      );
      if (checkedItems?.length > 0) {
        tempAll[name] = checkedItems?.map((k) => k?.optionId?.toString());
      } else {
        tempAll[name] = [];
      }
    });

    setAllOption(tempAll);
  }, [optionData, initOptionCheck]);

  const handleChange = (name: string, value: string[]) => {
    setAllOption({
      ...allOption,
      [name]: value,
    });
  };

  useEffect(() => {
    let posts = contentList
      .filter((item) => item.status === 'success')
      .map((item) => ({
        ...item,
        fileThumbnailUrl: item.fileUrl,
        id: 0,
        type: fileConfig?.services?.postType || EPostType.service,
        userId: uid,
      }));

    formik.setFieldValue('posts', posts);
  }, [contentList, uid]);

  const handleSubmit = () => {
    if (!formik?.isValid) {
      return Toast.error(`Input box can't be blank`);
    }
    if (formik?.values?.posts?.length === 0) {
      return Toast.error(`Cover files can't be blank.`);
    }
    formik?.handleSubmit();
  };

  const { run: uploadFile } = useUploadFile({
    manual: true,
    onSuccess: (resp: any, params: any) => {
      if (resp.code === 200) {
        // ↓ error code for test
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

  const acceptedFileType = useMemo(() => {
    return fileConfig?.services?.fileExt
      ? acceptFileType(fileConfig?.services?.fileExt)
      : undefined;
  }, [fileConfig]);

  const beforeUpload = useCallback(
    (file: FileWithFid): void => {
      const errors = checkFile({
        file,
        accept: acceptedFileType,
        limitSize: getFileMaxSize(fileConfig?.services?.fileMaxSize),
      });

      if (errors.length > 0) {
        return;
      }

      batchBeforeUpload(file);
    },
    [batchBeforeUpload, acceptedFileType],
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

  return (
    <section className={styles['service-basic']}>
      <Container maxWidth="lg" disableGutters>
        <ServiceHeader tab={0} />

        <div className={styles['content']}>
          <form onSubmit={formik.handleSubmit}>
            <InputFormItem
              label="Title of the service"
              required
              formik={formik}
              name="title"
              placeholder="Enter..."
              // maxLength={45}
              onBlurFun={() => {
                formik?.setFieldTouched('title', true);
              }}
            />
            <div>
              <Box sx={{ mb: 10, fontWeight: 500 }}>
                Upload Files
                <span style={{ color: '#E03A3A' }}>
                  &nbsp;&nbsp;
                  {Number(fileConfig?.services?.fileCount) > 1
                    ? `*1-${fileConfig?.services?.fileCount} items`
                    : `*1 item`}
                </span>
              </Box>
              <ThumbSwiper
                spaceBetween={36}
                slidesPerView={contentList.length < 6 ? contentList.length : 6}
                contentList={contentList}
                limitSize={getFileMaxSize(fileConfig?.services?.fileMaxSize)}
                countLimit={fileConfig?.services?.fileCount}
                beforeUpload={beforeUpload}
                onUploadSuccess={onSuccess}
                onDelete={setContentList}
                onError={onError}
                onRetry={onRetry}
                accept={acceptedFileType}
                buttonLabel={`File size < ${getFileMaxSize(
                  fileConfig?.services?.fileMaxSize,
                )}MB`}
              />
            </div>
            <Stack direction="row" spacing={80} mt={34}>
              <SelectFormItem
                label="Service category"
                required
                formik={formik}
                name="category"
                placeholder="Select..."
                options={categoryList}
                onChange={(event: any) => changeCategory(event)}
              />
              <SelectFormItem
                label="Subcategory "
                required
                formik={formik}
                name="subcategory"
                placeholder="Select..."
                options={subcategoryList}
                onChange={(event: any) => changeSubcategory(event)}
              />
            </Stack>
            <TextAreaFormItem
              label="Description"
              required
              placeholder="Introduce your service...."
              formik={formik}
              name="description"
              maxLength={1200}
              minHeight="255px"
            />
            {Object.keys(optionData)?.map((item: string, index: number) => {
              let checkboxData: ICheckboxItem[] = [];
              optionData[item]?.map((item, index) => {
                let temp = {
                  name: item?.valueName,
                  value: item?.optionId?.toString(),
                };
                checkboxData?.push(temp);
              });
              const name = item.replace(' ', '');
              return (
                <FormCheckbox
                  key={item}
                  name={name}
                  data={checkboxData}
                  value={allOption[name]}
                  label={<div style={{ minWidth: 132 }}>{item}</div>}
                  onChange={(name: string, value: string[]) =>
                    handleChange(name, value)
                  }
                  className={styles['option-checkbox']}
                />
              );
            })}
            <div style={{ textAlign: 'center' }}>
              <Button
                // type="submit"
                variant="contained"
                loading={submitLoading}
                size="large"
                className={styles['save-btn']}
                onClick={handleSubmit}
              >
                {serviceId ? 'Save' : 'Submit Service'}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default ServiceBasic;
