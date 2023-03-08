import Button from '@/components/Button';
import { Box, InputBase } from '@mui/material';
import React from 'react';
import ShowItem from './components/ShowItem';
import LoginOptions from './components/LoginOptions';
import styled from './index.less';
import { IDialogState, IUserState, useDispatch, useSelector } from 'umi';
import Dialog from '@/components/Dialog';
import { useFormik } from 'formik';
import FormItem from '@/components/FormItem';
import * as yup from 'yup';
import styles from './index.less';
import SendCountDown from '@/components/SendCountDown';
import Toast from '@/components/Toast';
import { Encrypt } from '@/service/rsa';
import { useRequest, useUpdateEffect } from 'ahooks';
import { postChangePwd } from '@/service/public';

export type ISettingsProps = {};

interface IAccountSettingDialogState {
  visible: boolean;
}

interface IChangePasswordParams {
  email: string;
  password: string;
  verifyCode: string;
}

const dialog_key = 'accountSettingDialog'; // dialog 唯一值

const Settings: React.FC<ISettingsProps> = ({}) => {
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: IAccountSettingDialogState = useSelector<
    any,
    IDialogState
  >(({ dialog }) => ({
    visible: false,
    ...dialog?.[dialog_key],
  }));

  // 关闭 dialog
  const handleClose = () => {
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });

    formik.resetForm();
  };

  const { userInfo } = useSelector<any, IUserState>((state) => state.user);

  interface IResponse {
    code: number;
    message: string;
  }

  // 修改密码操作
  const {
    run: runChangePassword,
    loading,
    data,
  } = useRequest(
    (params: IChangePasswordParams): Promise<IResponse> => {
      return postChangePwd(params);
    },
    {
      manual: true,
    },
  );

  useUpdateEffect(() => {
    if (data?.code === 200) {
      handleClose();
      Toast.success('Password change successful');

      dispatch({
        type: 'user/queryUser',
      });
    } else if (data?.code === 10306) {
      Toast.error('Incorrect verification code');
    } else {
      Toast.error('Password change error');
    }
  }, [data]);

  const validationSchema = yup.object({
    newPassword: yup
      .string()
      .required('Please enter your password')
      .min(8, 'Passsword should contain 8-16 characters')
      .max(16, 'Passsword should contain 8-16 characters'),
    code: yup
      .string()
      .required('Please enter your verification code')
      .test('CODE', 'Incorrect verification code', function (val) {
        if (val && /^[0-9]{6}$/.test(val)) {
          return true;
        }
        return false;
      }),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      code: '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      const params: IChangePasswordParams = {
        password: Encrypt(values.newPassword) as string,
        verifyCode: values.code,
        email: userInfo?.email || '',
      };
      runChangePassword(params);
    },
  });

  return (
    <div className={`paper-container ${styled['x-container']}`}>
      <div className={styled['title-box']}>
        <h1>Account Settings</h1>
      </div>

      <div>
        {/* Email */}
        <ShowItem label={'Email'} context={userInfo?.email} require />

        {/* Your Password  */}
        <ShowItem
          label={'Your Password'}
          context={userInfo?.passwordSet ? 'Already set' : 'Not set'}
          require
          after={
            <Button
              variant="contained"
              rounded
              style={{
                width: 130,
                height: 30,
              }}
              onClick={() => {
                // 状态控制开启
                dispatch({
                  type: 'dialog/show',
                  payload: {
                    key: 'accountSettingDialog',
                  },
                });
              }}
            >
              Edit
            </Button>
          }
        />

        {/* Other Login Options */}
        <LoginOptions />
      </div>

      <Dialog
        visible={dialogState.visible}
        title="Edit Password"
        onClose={handleClose}
        backBtn={<div />}
      >
        <div className={styles['form-container']}>
          <form onSubmit={formik.handleSubmit} className={styles['form']}>
            <FormItem label="New password" name="newPassword" formik={formik}>
              <InputBase
                type="password"
                placeholder="Contains 8-16 characters "
                autoComplete="off"
                {...formik.getFieldProps('newPassword')}
              />
            </FormItem>
            <div className={styles['form-item-code']}>
              <FormItem
                label="Email verification code"
                name="code"
                formik={formik}
                validSuccess={false}
              >
                <InputBase
                  placeholder="Enter..."
                  autoComplete="off"
                  {...formik.getFieldProps('code')}
                />
              </FormItem>
              <SendCountDown email={userInfo?.email || ''} />
            </div>
            <div className={styles['form-button']}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  handleClose();
                  Toast.removeAll();
                  formik.resetForm();
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                type="submit"
                size="large"
                loading={loading}
              >
                Confirm
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default Settings;
