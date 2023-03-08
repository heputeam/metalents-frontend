import React from 'react';
import bg404PNG from '@/assets/imgs/404/404-bg.png';
import { Container } from '@mui/material';
import styles from './404.less';

export type IError404Props = {};

const Error404: React.FC<IError404Props> = ({}) => (
  <Container maxWidth="lg" className={styles['page-404']}>
    <div className={styles['content']}>
      <img src={bg404PNG} alt="" />
    </div>
  </Container>
);

export default Error404;
