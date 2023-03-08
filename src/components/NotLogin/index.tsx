import React from 'react';
import styles from './index.less';
import NotLoginPNG from '@/assets/imgs/login/not-login.png';
import { Container } from '@mui/material';
import Button from '@/components/Button';
import { useDispatch } from 'umi';

export type INotLoginProps = {};

const NotLogin: React.FC<INotLoginProps> = ({}) => {
  const dispatch = useDispatch();
  return (
    <Container disableGutters maxWidth="lg">
      <div className={styles['not-login-page']}>
        <div className={styles['img-box']}>
          <img src={NotLoginPNG} alt="" />
        </div>
        <div className={styles['title']}>You need to login first!</div>
        <p>
          This feature is only accessible for specified users. Please login to
          check if you have permission.
        </p>
        <div className={styles['button-box']}>
          <Button
            onClick={() => {
              dispatch({
                type: 'dialog/show',
                payload: {
                  key: 'loginChooseDialog',
                },
              });
            }}
            variant="contained"
            size="large"
            sx={{ width: '240px', height: '48px' }}
          >
            Login
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default NotLogin;
