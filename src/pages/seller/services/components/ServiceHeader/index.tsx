import BackIcon from '@/components/ProfileFormItem/BackIcon';
import {
  Stack,
  Button as MuiButton,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import React, { useState } from 'react';
import { history, useLocation } from 'umi';
import styles from './index.less';

export interface IServiceHeader {
  tab: number;
}

const ServiceHeader: React.FC<IServiceHeader> = ({ tab }) => {
  const { query } = useLocation() as any;
  const serviceId = query?.id;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    history.replace(
      `/seller/services/${newValue ? 'pack' : 'basic'}?id=${serviceId}`,
    );
  };

  const [value, setValue] = useState<number>(tab);

  const goBack = () => {
    history.goBack();
  };

  return (
    <div>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ height: 80 }}
      >
        <MuiButton
          className={styles['back-btn']}
          startIcon={<BackIcon />}
          onClick={goBack}
        >
          Back
        </MuiButton>

        <Typography variant="h2" className={styles['title']}>
          {serviceId ? 'Edit my service' : 'Create a service'}
        </Typography>
        <Box sx={{ width: 82, height: '100%' }} />
      </Stack>
      {serviceId && (
        <div className={styles['header-tabs']}>
          <Tabs
            value={value}
            onChange={handleChange}
            classes={{
              root: styles['tabs-root'],
              indicator: styles['tabs-indicator'],
              flexContainer: styles['tabs-container'],
            }}
          >
            <Tab
              label="Basic Information"
              classes={{
                root: styles['tab-root'],
                selected: styles['tab-selected'],
              }}
            />
            <Tab
              label="Service Packages"
              classes={{
                root: styles['tab-root'],
                selected: styles['tab-selected'],
              }}
            />
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ServiceHeader;
