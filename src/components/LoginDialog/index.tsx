import { InputBase } from '@mui/material';
import React, { useState } from 'react';
import styles from './index.less';
import { useDispatch, useSelector } from 'umi';
import Dialog from '../Dialog';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FormItem from '../FormItem';
import Button from '../Button';
import { Encrypt } from '@/service/rsa';

export type ILoginDialogProps = {};

interface ILoginDialogState {
  dialogState: {
    visible: boolean;
    backKey?: string;
  };
  userState: {
    email: string;
  };
}
const validationSchema = yup.object({
  email: yup
    .string()
    .required('Please enter your email address')
    .test('EMAIL', 'Incorrect email address', function (val) {
      if (val && /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val)) {
        return true;
      }
      return false;
    }),
  password: yup
    .string()
    .required('Please enter your password')
    .test(
      'PASSWORD',
      'Password should contain 8-16 characters',
      function (val) {
        if (val && val.length >= 8 && val.length <= 16) {
          return true;
        }
        return false;
      },
    ),
});

const dialog_key = 'loginDialog'; // dialog 唯一值
const LoginDialog: React.FC<ILoginDialogProps> = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  // 提取dialog 状态
  const { dialogState, userState }: ILoginDialogState = useSelector<any, any>(
    ({ dialog, user }) => ({
      dialogState: { visible: false, ...dialog?.[dialog_key] },
      userState: { email: user.email },
    }),
  );
  // 关闭 dialog
  const handleClose = () => {
    formik.resetForm();
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };

  const formik = useFormik({
    initialValues: {
      email: userState?.email || '',
      password: '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      const { email, password } = values;
      setLoading(true);
      dispatch({
        type: 'user/login',
        payload: {
          callback: ({ code }: any) => {
            setLoading(false);
            if (code === 200) {
              handleClose();
            }
          },
          params: {
            accessToken: '',
            email,
            loginType: 1,
            message: '',
            password: Encrypt(password),
            signature: '',
            userAddress: '',
          },
        },
      });
    },
  });
  return (
    <Dialog
      visible={dialogState.visible}
      title="Sign In"
      onClose={handleClose}
      onBack={() => {
        handleClose();
        dispatch({
          type: 'dialog/show',
          payload: {
            key: 'loginChooseDialog',
          },
        });
      }}
    >
      <form onSubmit={formik.handleSubmit} className={styles['form']}>
        <FormItem label="Email address" name="email" formik={formik}>
          <InputBase
            name="email"
            placeholder="Enter..."
            autoComplete="off"
            defaultValue={formik.initialValues.email}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </FormItem>
        <FormItem
          label="Password"
          name="password"
          formik={formik}
          validSuccess={false}
        >
          <InputBase
            name="password"
            type="password"
            placeholder="Enter..."
            autoComplete="off"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </FormItem>
        <div className={styles['form-button']}>
          <Button
            loading={loading}
            variant="contained"
            type="submit"
            size="large"
            style={{
              width: '240px',
              height: '48px',
            }}
          >
            Confirm
          </Button>
        </div>
        <div className={styles['tips']}>
          Not got an account?&nbsp;
          <span
            onClick={() => {
              handleClose();
              dispatch({
                type: 'dialog/show',
                payload: {
                  key: 'registerChooseDialog',
                },
              });
            }}
          >
            Sign up
          </span>
        </div>
        <div className={`${styles['tips']} ${styles['mag-top']}`}>
          Can not sign in?&nbsp;
          <span
            onClick={() => {
              handleClose();
              dispatch({
                type: 'dialog/show',
                payload: {
                  key: 'forgetDialog',
                },
              });
            }}
          >
            Forgot Password
          </span>
        </div>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
