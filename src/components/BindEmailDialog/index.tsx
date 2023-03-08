import React, { useState } from 'react';
import styles from './index.less';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FormItem from '../FormItem';
import { InputBase } from '@mui/material';
import SendCountDown from '../SendCountDown';
import Dialog from '../Dialog';
import { IDialogState, useDispatch, useLocation, useSelector } from 'umi';
import { useRequest } from 'ahooks';
import Button from '../Button';
import { Toast } from '../Toast';
import { Errors } from '@/service/errors';
import { emailCheck, postRegister } from '@/service/public';
export type IBindEmailDialogProps = {};

interface IBindEmailDialogState {
  visible: boolean;
  registerType: number;
  assessToken: string;
  message: string;
  signature: string;
  userAddress: string;
}
const dialog_key = 'bindEmailDialog'; // dialog 唯一值

const BindEmailDialog: React.FC<IBindEmailDialogProps> = ({}) => {
  const { query } = useLocation() as any;
  const dispatch = useDispatch();
  // 提取dialog 状态
  const dialogState: IBindEmailDialogState = useSelector<any, IDialogState>(
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
  } = useRequest((params) => postRegister(params), {
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
        return !(res?.code === 200 && res?.data?.exist);
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
  const formik = useFormik({
    initialValues: {
      email: '',
      code: '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      const { email, code } = values;
      const params = {
        accessToken: dialogState.assessToken || '',
        message: dialogState.message || '',
        signature: dialogState.signature || '',
        email,
        password: '',
        confirmPassword: '',
        verifyCode: code,
        userAddress: dialogState.userAddress || '',
        registerType: dialogState.registerType,
        referralCode: query?.referralCode || '',
      };
      runRegister(params);
    },
  });
  return (
    <Dialog
      visible={dialogState.visible}
      title="Bind the email"
      onClose={handleClose}
      backBtn={<div />}
    >
      <div className={styles['bind-emial-content']}>
        <div className={styles['sub-title']}>
          <p>You will need to bind an email address to your account that</p>
          <p>can receive the code for security verification later.</p>
          <p>(One email address for one account)</p>
        </div>
        <form onSubmit={formik.handleSubmit} className={styles['form']}>
          <FormItem label="Email" name="email" formik={formik}>
            <InputBase
              name="email"
              placeholder="Enter..."
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
          <div className={styles['tips']}>
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
      </div>
    </Dialog>
  );
};

export default BindEmailDialog;
