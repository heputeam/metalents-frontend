import React, { useEffect } from 'react';
import { Stack, Typography, Button as MuiButton } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import styles from './index.less';
import InputFormItem from '@/components/ProfileFormItem/InputFormItem';
import SelectFormItem from '@/components/ProfileFormItem/SelectFormItem';
import TextAreaFormItem from '@/components/ProfileFormItem/TextAreaFormItem';
import SocialFormItem from '@/components/ProfileFormItem/SocialFormItem';
import { countries as shortCountries } from 'country-flag-icons';
import Flags from 'country-flag-icons/react/3x2';
import countries from 'i18n-iso-countries';
import english from 'i18n-iso-countries/langs/en.json';
import { useRequest } from 'ahooks';
import Button from '@/components/Button';
import { IMenuState, IUserState, useDispatch, useSelector } from 'umi';
import { IResponse, postUserUpdate } from '@/service/types';
import Toast from '@/components/Toast';
import { Errors } from '@/service/errors';
import AvatarUploader from '@/components/AvatarUploader';
import { getShopnameCheck, getUserNameCheck } from '@/service/public';
import { IUpdateUserInfoParams, IUserInfo } from '@/service/user/types';

countries.registerLocale(english);

type ICountryType = keyof typeof Flags;
const date = new Date();
const timezone = date.getTimezoneOffset() / -60;

const locationOptions = shortCountries
  .filter((country) => !!countries.getName(country, 'en'))
  .map((country) => {
    return {
      longCountry: countries.getName(country, 'en'),
      shortCountry: country,
    };
  })
  .sort((a, b) => (a.longCountry > b.longCountry ? 1 : -1))
  .map((country) => {
    const Flag = Flags[country.shortCountry as ICountryType];
    return {
      value: country.shortCountry,
      label: (
        <>
          <Flag
            title={country.shortCountry}
            className={styles['country-flag']}
          />
          <Typography className={styles['country-name']}>
            {country.longCountry}
          </Typography>
        </>
      ),
    };
  });

export type IStep1Props = {
  setActiveStep: (index: number) => void;
};

const Step1: React.FC<IStep1Props> = ({ setActiveStep }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector<any, IUserState>((state) => state.user);
  const { menus: menuData } = useSelector<any, IMenuState>(
    (state) => state.menus,
  );
  useEffect(() => {
    if (!userInfo) {
      return;
    }
    formik.setValues({
      avatar: userInfo.avatar?.fileUrl,
      userName: userInfo.userName,
      email: userInfo.email,
      shopname: userInfo.shopname,
      career: userInfo.career,
      location: userInfo.location,
      company: userInfo.company,
      description: userInfo.description,
      focused: userInfo.focused,
      twitterLink: userInfo.twitterLink,
      instagramLink: userInfo.instagramLink,
      timezone: timezone.toString(),
      website: userInfo.website,
    });
  }, [userInfo]);

  const { run: submitUpdateInfoRun, loading } = useRequest<
    IResponse<IUserInfo>,
    [IUpdateUserInfoParams]
  >(
    (params) => {
      return postUserUpdate(params);
    },
    {
      manual: true,
      onSuccess: (resp) => {
        if (resp.code === 30101) {
          return Toast.error(Errors[resp.code]);
        }

        if (resp.code !== 200) {
          return Toast.error('Unknown system failure: Please try');
        }

        dispatch({
          type: 'user/setUser',
          payload: {
            userInfo: resp.data,
          },
        });
        setActiveStep(1);
      },
      onError: (err) => {
        Toast.error('Unknown system failure: Please try');
      },
    },
  );

  const validationSchema = yup.object({
    userName: yup
      .string()
      .max(50, 'Allow only no more than 50 characters')
      .matches(/^[A-Za-z0-9 ]+$/, 'Allow only numbers, letters')
      .test('notEmptyUserName', 'Please enter your username', (userName) => {
        if (!userName) {
          return false;
        }
        if (userName.match(/^\s*$/)) {
          return false;
        }
        return true;
      })
      .test('uniqueUserName', 'Username has been used', async (userName) => {
        if (userName === userInfo?.userName) {
          return true;
        }
        const res = await getUserNameCheck(userName || '');
        if (res.code === 200 && res?.data?.exist) {
          return false;
        } else {
          return true;
        }
      })
      .required('Please enter your username'),
    shopname: yup
      .string()
      .max(50, 'Allow only no more than 50 characters')
      .matches(/^[a-zA-Z0-9 ]+$/, 'Allow only numbers, letters')
      .test('notEmptyShopName', 'Please enter your Shop Name', (shopname) => {
        if (!shopname) {
          return false;
        }
        if (shopname.match(/^\s*$/)) {
          return false;
        }
        return true;
      })
      .required('Please enter your Shop Name')
      .test('SHOPNAME', 'Shop Name has been used', async (val) => {
        if (val && val === userInfo?.shopname) {
          return true;
        }
        if (!val) return true;
        const res: any = await getShopnameCheck(val || '');
        if (res?.code === 200 && res?.data?.exist) {
          return false;
        } else {
          return true;
        }
      }),
    location: yup.string().required('Please select your location'),
    description: yup
      .string()
      .max(600, 'Allow only no more than 600 characters')
      .test(
        'notEmptyDescription',
        'Please enter your description',
        (description) => {
          if (!description) {
            return false;
          }

          if (description.match(/^\s*$/)) {
            return false;
          }

          return true;
        },
      )
      .required('Please enter your description'),
    focused: yup
      .array()
      .of(yup.number())
      .required('Please select your specialist categories')
      .min(1, 'Please select your specialist categories')
      .max(3, 'Allow only no more than 3 focused categories'),
    twitterLink: yup.string().url('Please enter a valid URL'),
    instagramLink: yup.string().url('Please enter a valid URL'),
    website: yup.string().url('Please enter a valid URL'),
    avatar: yup.string(),
  });

  const formik = useFormik<IUpdateUserInfoParams>({
    initialValues: {
      avatar: '',
      userName: '',
      email: '',
      shopname: '',
      location: '',
      career: '',
      company: '',
      description: '',
      focused: [],
      twitterLink: '',
      instagramLink: '',
      timezone: '',
      website: '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      submitUpdateInfoRun(values);
    },
  });

  return (
    <div className={styles['step1-wrap']}>
      <div className={styles['form-block']}>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles['first-line']}>
            <div className={styles['left-block']}>
              <InputFormItem
                label="Username"
                required
                disabled={!userInfo?.modifyLeftTimes}
                formik={formik}
                name="userName"
                width={417}
                placeholder="Enter..."
                maxLength={50}
              />

              <InputFormItem
                label="Email"
                required
                disabled
                formik={formik}
                name="email"
                width={417}
              />
            </div>

            <div className={styles['avatar-form-item']}>
              <label className={styles['form-label']}>
                Photo
                <Typography
                  component="span"
                  className={styles['required-mark']}
                >
                  &nbsp;*
                </Typography>
              </label>

              <div className={styles['avatar-uploader-container']}>
                <AvatarUploader
                  onSuccess={(path: string) => {
                    if (path) {
                      formik.setFieldValue('avatar', path);
                    }
                  }}
                  sx={{
                    fontSize: 100,
                  }}
                  bgcolor={formik.values.avatar ? 'transparent' : '#AAE5FF'}
                  size={180}
                  src={formik.values.avatar}
                  className={styles['avatar']}
                >
                  {userInfo?.userName?.slice(0, 1)?.toLocaleUpperCase()}
                </AvatarUploader>
              </div>
            </div>
          </div>

          <Stack direction="row" spacing={80}>
            <InputFormItem
              label="Shop Name"
              required
              formik={formik}
              name="shopname"
              placeholder="Enter..."
              maxLength={50}
            />

            <SelectFormItem
              label="Location(Time zone)"
              placeholder="Select..."
              required
              formik={formik}
              name="location"
              options={locationOptions}
              renderValue={(value) => {
                const Flag = Flags[value as ICountryType];
                const label = countries.getName(value, 'en');
                return (
                  <div className={styles['select-render-value']}>
                    <Flag className={styles['country-flag']} />

                    <Typography
                      className={styles['country-name']}
                      component="span"
                    >
                      {label.length < 25 ? label : `${label.slice(0, 25)}...`}
                      &nbsp;(UTC
                      {`${timezone > 0 && '+'}${
                        timezone < 10 && '0'
                      }${timezone}`}
                      :00)
                    </Typography>
                  </div>
                );
              }}
            />
          </Stack>

          <SelectFormItem
            label="Specialist categories"
            placeholder="Select 1-3 categories..."
            required
            disabled={!userInfo?.modifyLeftTimes}
            formik={formik}
            name="focused"
            multiple
            maxCount={3}
            width={417}
            options={menuData?.map((data: any) => {
              return { value: data.id, label: data.serviceName };
            })}
          />

          <TextAreaFormItem
            label="Description"
            required
            placeholder={`I'm a UI designer from HK.`}
            formik={formik}
            name="description"
          />

          <SocialFormItem formik={formik} />

          <Button
            className={styles['save-btn']}
            color="primary"
            variant="contained"
            type="submit"
            loading={loading}
          >
            <Typography variant="h3" className={styles['btn-label']}>
              Next
            </Typography>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Step1;
