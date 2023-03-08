import React, { useState } from 'react';
import styles from './index.less';
import Dialog from '../Dialog';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FormItem from '../FormItem';
import Button from '../Button';
import { IDialogState, useDispatch, useSelector } from 'umi';
import { InputBase } from '@mui/material';
import SendCountDown from '../SendCountDown';
import { useRequest } from 'ahooks';
import { IResponse } from '@/service/types';
import { Encrypt } from '@/service/rsa';
import { Errors } from '@/service/errors';
import { Toast } from '../Toast';
import { postChangePwd } from '@/service/public';
import { IUserInfo } from '@/service/user/types';

const ForgetContentStep1: React.FC<{ formik1: any }> = ({ formik1 }) => {
  return (
    <div className={styles['forget-content']}>
      <div className={styles['sub-title']}>
        <p>To reset your password, please enter your email address below.</p>
        <p>Enter your verification code to reset your password.</p>
      </div>
      <form onSubmit={formik1.handleSubmit} className={styles['form']}>
        <FormItem label="Email address" name="email" formik={formik1}>
          <InputBase
            name="email"
            placeholder="Enter..."
            autoComplete="off"
            onBlur={formik1.handleBlur}
            onChange={formik1.handleChange}
          />
        </FormItem>
        <div className={styles['form-item-code']}>
          <FormItem
            label="Email verification code"
            name="code"
            formik={formik1}
            validSuccess={false}
          >
            <InputBase
              name="code"
              placeholder="Enter..."
              autoComplete="off"
              onBlur={formik1.handleBlur}
              onChange={formik1.handleChange}
            />
          </FormItem>
          <SendCountDown email={formik1.values.email} />
        </div>
        <div className={styles['form-button']}>
          <Button
            variant="contained"
            type="submit"
            size="large"
            style={{
              width: '240px',
              height: '48px',
            }}
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};
const ForgetContentStep2: React.FC<{ formik2: any; loading: boolean }> = ({
  formik2,
  loading,
}) => {
  return (
    <div className={styles['forget-content']}>
      <form onSubmit={formik2.handleSubmit} className={styles['form']}>
        <FormItem label="New password" name="newPassword" formik={formik2}>
          <InputBase
            name="newPassword"
            type="password"
            placeholder="Contains 8-16 characters"
            autoComplete="off"
            onBlur={formik2.handleBlur}
            onChange={formik2.handleChange}
          />
        </FormItem>
        <FormItem
          label="Confirm your password"
          name="confirmPassword"
          formik={formik2}
        >
          <InputBase
            name="confirmPassword"
            type="password"
            placeholder="Enter your password..."
            autoComplete="off"
            onBlur={formik2.handleBlur}
            onChange={formik2.handleChange}
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
      </form>
    </div>
  );
};

const validationSchema1 = yup.object({
  email: yup
    .string()
    .required('Please enter your email address')
    .test('EMAIL', 'Incorrect email address', function (val) {
      if (val && /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val)) {
        return true;
      }
      return false;
    }),
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
const validationSchema2 = yup.object({
  newPassword: yup
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
  confirmPassword: yup
    .string()
    .required('Please enter your password')
    .test('CONFIRMPASSWORD', 'Please enter the same password', function (val) {
      const { newPassword } = this.parent;
      if (newPassword === val) {
        return true;
      }
      return false;
    }),
});

export type IForgetDialogProps = {};
export const dialog_key = 'forgetDialog'; // dialog 唯一值
interface IForgetDialogState {
  visible: boolean;
  backKey?: string;
}
const ForgetDialog: React.FC<IForgetDialogProps> = ({}) => {
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: IForgetDialogState = useSelector<any, IDialogState>(
    ({ dialog }) => ({
      visible: false,
      ...dialog?.[dialog_key],
    }),
  );
  const [stepIndex, setStepIndex] = useState<number>(0);
  // 关闭 dialog
  const handleClose = () => {
    formik1.resetForm();
    formik2.resetForm();
    setStepIndex(0);
    dispatch({
      type: 'dialog/hide',
      payload: {
        key: dialog_key,
      },
    });
  };
  const { loading, run: resetPwd } = useRequest<IResponse<IUserInfo>, any>(
    (params) => postChangePwd(params),
    {
      manual: true,
      onSuccess: (data) => {
        const { code } = data;
        if (code === 200) {
          handleClose();
          dispatch({
            type: 'dialog/show',
            payload: {
              key: 'resetSuccessDialog',
            },
          });
        } else {
          Toast.error(Errors[code]);
        }
      },
    },
  );
  const formik1 = useFormik({
    initialValues: {
      email: '',
      code: '',
    },
    validationSchema: validationSchema1,
    validateOnChange: false,
    onSubmit: (values) => {
      setStepIndex(1);
    },
  });
  const formik2 = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema2,
    validateOnChange: false,
    onSubmit: (values) => {
      const { email, code } = formik1.values;
      const { newPassword } = values;
      const params = {
        email,
        password: Encrypt(newPassword),
        verifyCode: code,
      };
      resetPwd(params);
    },
  });
  return (
    <Dialog
      visible={dialogState.visible}
      title="Reset Passward"
      onClose={handleClose}
      backBtn={stepIndex === 1 ? <div /> : ''}
      onBack={() => {
        handleClose();
        dispatch({
          type: 'dialog/show',
          payload: {
            key: 'loginDialog',
          },
        });
      }}
    >
      {stepIndex === 0 && <ForgetContentStep1 formik1={formik1} />}
      {stepIndex === 1 && (
        <ForgetContentStep2 formik2={formik2} loading={loading} />
      )}
    </Dialog>
  );
};

export default ForgetDialog;
