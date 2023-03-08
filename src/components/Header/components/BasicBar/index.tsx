import { Container, Stack } from '@mui/material';
import React from 'react';
import HeaderLeft from '../HeaderLeft';
import HeaderRight from '../HeaderRight';
import styles from './index.less';

export type IBasicBarProps = {};

const BasicBar: React.FC<IBasicBarProps> = ({}) => {
  return (
    <div className={styles['basic-bar']}>
      <Container maxWidth="lg" disableGutters>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <HeaderLeft />
          <HeaderRight />
        </Stack>
      </Container>
    </div>
  );
};

export default BasicBar;
