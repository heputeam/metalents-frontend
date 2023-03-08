import React, { ReactChild } from 'react';
import { useLocation } from 'umi';
import styles from './index.less';
import Comments from '../components/comments';
import Description from '../components/description';
import Transaction from '../components/transaction';
import { Container } from '@mui/material';

interface IServicesLayout {
  children: ReactChild;
}

const ServicesLayout = ({ children }: IServicesLayout) => {
  return (
    <Container className={styles['layout-container']} maxWidth="lg">
      {children}
    </Container>
  );
};

export default ServicesLayout;
