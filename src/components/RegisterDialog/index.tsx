import React, { useState } from 'react';
import styles from './index.less';
import Dialog from '@/components/Dialog';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FormItem from '../FormItem';
import { InputBase } from '@mui/material';
import SendCountDown from '../SendCountDown';
import { IDialogState, useDispatch, useLocation, useSelector } from 'umi';
import { useRequest } from 'ahooks';
import Button from '../Button';
import { Encrypt } from '@/service/rsa';
import { Toast } from '../Toast';
import { Errors } from '@/service/errors';
import { emailCheck, postRegister } from '@/service/public';

interface IRegisterDialogState {
  visible: boolean;
  backKey?: string;
}
const dialog_key = 'registerDialog'; // dialog 唯一值
export type IRegisterDialogProps = {};
const RegisterDialog: React.FC<IRegisterDialogProps> = ({}) => {
  const { query } = useLocation() as any;
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: IRegisterDialogState = useSelector<any, IDialogState>(
    ({ dialog }) => ({
      visible: false,
      ...dialog?.[dialog_key],
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
  const [isEmailExist, setIsEmailExist] = useState<boolean>(false);
  const [isIncorrectEmail, setIsIncorrectEmail] = useState<boolean>(false);
  const {
    loading,
    params: par,
    run: runRegister,
  } = useRequest((params) => postRegister({ ...params }), {
    manual: true,
    onSuccess: (data: any) => {
      const {
        accessToken,
        email,
        message,
        password,
        registerType,
        signature,
        userAddress,
      } = par[0];
      const { code } = data;
      if (code === 10306) {
        return Toast.error(Errors[code]);
      }
      if (code !== 200) {
        return Toast.error('Unknown system failure: Please try');
      }
      dispatch({
        type: 'user/login',
        payload: {
          callback: () => {
            handleClose();
          },
          params: {
            accessToken,
            email,
            loginType: registerType,
            message,
            password,
            signature,
            userAddress,
          },
        },
      });
    },
  });
  const validationSchema = yup.object({
    email: yup
      .string()
      .required('Please enter your email address')
      .test('EMAIL', 'Incorrect email address', function (val) {
        if (val && /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val)) {
          setIsIncorrectEmail(false);
          return true;
        }
        setIsIncorrectEmail(true);
        return false;
      })
      .test('EMAILVALIDATION', 'This email is registered', async (val) => {
        const res: any = await emailCheck(val || '');
        setIsEmailExist(res?.data?.exist);
        if (res?.code === 200 && res?.data?.exist) {
          return false;
        } else {
          return true;
        }
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
    confirmPassword: yup
      .string()
      .required('Please enter your password')
      .test(
        'CONFIRMPASSWORD',
        'Please enter the same password',
        function (val) {
          const { password } = this.parent;
          if (password === val) {
            return true;
          }
          return false;
        },
      ),
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
      email: '',
      password: '',
      confirmPassword: '',
      code: '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      const { email, password, confirmPassword, code } = values;
      const params = {
        accessToken: '',
        message: '',
        signature: '',
        email,
        password: Encrypt(password),
        confirmPassword: Encrypt(password),
        verifyCode: code,
        userAddress: '',
        registerType: 1,
        referralCode: query?.referralCode || '',
      };
      runRegister(params);
    },
  });

  return (
    <Dialog
      visible={dialogState.visible}
      title="Create an account"
      onClose={handleClose}
      onBack={() => {
        handleClose();
        dispatch({
          type: 'dialog/show',
          payload: {
            key: 'registerChooseDialog',
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
            placeholder="Contains 8-16 characters"
            autoComplete="off"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </FormItem>
        <FormItem
          label="Confirm your password"
          name="confirmPassword"
          formik={formik}
          validSuccess={false}
        >
          <InputBase
            name="confirmPassword"
            type="password"
            placeholder="Enter your password..."
            autoComplete="off"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
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
              name="code"
              placeholder="Enter..."
              autoComplete="off"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </FormItem>
          <SendCountDown
            email={formik.values.email}
            disable={isEmailExist || isIncorrectEmail}
          />
        </div>
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

        <div className={`${styles['tips']}`}>
          Already have an account?&nbsp;
          <span
            onClick={() => {
              handleClose();
              dispatch({
                type: 'dialog/show',
                payload: {
                  key: 'loginChooseDialog',
                },
              });
            }}
          >
            Sign in
          </span>
        </div>
      </form>
    </Dialog>
  );
};
export default RegisterDialog;
