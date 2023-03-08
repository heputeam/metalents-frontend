import React, { useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import { useFormik, FormikProps } from 'formik';
import * as yup from 'yup';
import styles from './index.less';
import BackIcon from '@/components/ProfileFormItem/BackIcon';
import InputFormItem from '@/components/ProfileFormItem/InputFormItem';
import SelectFormItem from '@/components/ProfileFormItem/SelectFormItem';
import TextAreaFormItem from '@/components/ProfileFormItem/TextAreaFormItem';
import SocialFormItem from '@/components/ProfileFormItem/SocialFormItem';
import { countries as shortCountries } from 'country-flag-icons';
import Flags from 'country-flag-icons/react/3x2';
import countries from 'i18n-iso-countries';
import english from 'i18n-iso-countries/langs/en.json';
import AvatarUploader from '@/components/AvatarUploader';
import { useRequest } from 'ahooks';
import Button from '@/components/Button';
import { IUserState, useDispatch, useSelector, useHistory } from 'umi';
import { IResponse, postUserUpdate } from '@/service/types';
import Toast from '@/components/Toast';
import { Errors } from '@/service/errors';
import { IMenuState } from '@/models/menu';
import { getUserNameCheck } from '@/service/public';
import { IUpdateUserInfoParams, IUserInfo } from '@/service/user/types';

countries.registerLocale(english);

type ICountryType = keyof typeof Flags;

export interface IEditProfileProps {}

export interface IFormItemProps {
  formik: FormikProps<IUpdateUserInfoParams>;
  label: string;
  required?: boolean;
  name: string;
}

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

const EditProfile: React.FC<IEditProfileProps> = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userInfo, uid } = useSelector<any, IUserState>((state) => state.user);

  const canModify = !!(
    userInfo &&
    userInfo.modifyLeftTimes &&
    userInfo.modifyLeftTimes > 0
  );

  const { menus: menuData } = useSelector<any, IMenuState>(
    (state) => state.menus,
  );

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

        setTimeout(() => {
          Toast.success('Successfully saved!');
        }, 500);

        setTimeout(() => {
          history.push(`/account/profile?sidebar&userId=${uid}`);
        }, 1000);
      },
      onError: (err) => {
        Toast.error('Unknown system failure: Please try');
        console.log('update userinfo err: ', err);
      },
    },
  );

  const validationSchema = yup.object({
    userName: yup
      .string()
      .max(50, 'Allow only no more than 50 numbers, letters')
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
        if ((userInfo && userName === userInfo.userName) || !userName) {
          return true;
        }

        const res: any = await getUserNameCheck(userName?.trim());

        if (res?.code === 200 && res?.data?.exist) {
          return false;
        } else {
          return true;
        }
      })
      .required('Please enter your username'),
    location: yup.string().required('Please select your location'),
    career: yup
      .string()
      .max(50, 'Allow only no more than 50 characters')
      .test('notEmptyCareer', 'Please enter your title', (career) => {
        if (!career) {
          return false;
        }

        if (career.match(/^\s*$/)) {
          return false;
        }

        return true;
      })
      .required('Please enter your title'),
    company: yup
      .string()
      .test('notEmptyCareer', 'Please enter valid company', (company) => {
        if (!company || company.length === 0) {
          return true;
        }

        if (company.match(/^\s*$/)) {
          return false;
        }

        return true;
      })
      .max(50, 'Allow only no more than 50 characters'),
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

  const formik = useFormik({
    initialValues: {
      avatar:
        userInfo?.avatar?.fileUrl ||
        userInfo?.googleInfo?.avatar ||
        userInfo?.twitterInfo?.avatar ||
        userInfo?.instagramInfo?.avatar ||
        '',
      userName: userInfo?.userName || '',
      location: userInfo?.location || '',
      career: userInfo?.career || '',
      company: userInfo?.company || '',
      description: userInfo?.description || '',
      focused: userInfo?.focused || [],
      twitterLink: userInfo?.twitterLink || '',
      instagramLink: userInfo?.instagramLink || '',
      website: userInfo?.website || '',
      timezone: timezone.toString(),
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      submitUpdateInfoRun({
        ...values,
        userName: values.userName.trim(),
        career: values.career.trim(),
        company: values.company.trim(),
        description: values.description.trim(),
      });
    },
  });

  useEffect(() => {
    console.log('formik: ', formik);
  }, [formik]);

  useEffect(() => {
    const alertUser = (e: any) => {
      if (formik.dirty) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', alertUser);

    return () => {
      window.removeEventListener('beforeunload', alertUser);
    };
  }, [formik.dirty]);

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className={styles['edit-profile-page']}>
      <Button
        classes={{ root: styles['back-btn'] }}
        startIcon={<BackIcon />}
        onClick={goBack}
      >
        Back
      </Button>

      <Typography variant="h2" classes={{ root: styles['title'] }}>
        Complete your profile
      </Typography>

      <div className={styles['form-block']}>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles['first-line']}>
            <div className={styles['left-block']}>
              <InputFormItem
                label="UserName"
                disabled={!canModify}
                required
                formik={formik}
                name="userName"
                width={417}
                placeholder="Enter..."
                maxLength={50}
              />

              <SelectFormItem
                label="Location(Time zone)"
                required
                formik={formik}
                name="location"
                placeholder="Select..."
                options={locationOptions}
                width={417}
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
                  onSuccess={(res: string) => {
                    const path = res || null;
                    if (path) {
                      formik.setFieldValue('avatar', path);
                    }
                  }}
                  sx={{
                    // marginLeft: 118,
                    fontSize: 100,
                    boxShadow: '4px 4px 13px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'cyan',
                  }}
                  bgcolor={formik.values.avatar ? '#FFFFFF' : '#AAE5FF'}
                  size={180}
                  src={formik.values.avatar}
                  className={styles['avatar']}
                >
                  {userInfo?.userName?.slice(0, 1)?.toLocaleUpperCase() ||
                    userInfo?.googleInfo?.name
                      ?.slice(0, 1)
                      ?.toLocaleUpperCase() ||
                    userInfo?.instagramInfo?.name
                      ?.slice(0, 1)
                      ?.toLocaleUpperCase() ||
                    userInfo?.twitterInfo?.name
                      ?.slice(0, 1)
                      ?.toLocaleUpperCase()}
                </AvatarUploader>
              </div>
            </div>
          </div>

          <Stack direction="row" spacing={80}>
            <InputFormItem
              label="Title"
              required
              disabled={!canModify}
              formik={formik}
              name="career"
              maxLength={50}
              placeholder="Enter your title... ps.UI Designer"
            />

            <InputFormItem
              label="Company"
              formik={formik}
              name="company"
              maxLength={50}
              disabled={!canModify}
              placeholder="Enter..."
            />
          </Stack>

          <SelectFormItem
            label="Specialist categories"
            required
            disabled={!canModify}
            formik={formik}
            name="focused"
            placeholder="Select 1-3 categories..."
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
            placeholder={
              'Introduce yourself, your experiences, and your highlights. ....'
            }
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
              Save
            </Typography>
          </Button>
        </form>
      </div>

      <Stack className={styles.notice} spacing={20}>
        <Typography>
          Basic personal profile (Username/Title/Company/Category) can be
          modified a limited number of times per month.
        </Typography>

        {userInfo &&
        typeof userInfo.modifyLeftTimes === 'number' &&
        userInfo.modifyLeftTimes > 0 ? (
          <Typography className={styles['correct']}>
            {`${userInfo.modifyLeftTimes} ${
              userInfo.modifyLeftTimes > 1 ? 'modifications' : 'modification'
            } left`}
          </Typography>
        ) : (
          <Typography className={styles['error']}>
            0 modification left
          </Typography>
        )}
      </Stack>
    </div>
  );
};

export default EditProfile;
