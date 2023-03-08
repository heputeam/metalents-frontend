import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useRequest } from 'ahooks';
import React from 'react';
import { getServices } from '@/service/public';

export type IRequestProps = {};

const Request: React.FC<IRequestProps> = ({}) => {
  const { data, error, loading, refresh } = useRequest(() => getServices(1));
  if (data || error) {
    console.log('test Request:', data, error, loading);
  }

  return (
    <Stack direction="row" spacing={10}>
      <LoadingButton
        variant="contained"
        loading={loading}
        onClick={() => {
          refresh();
        }}
      >
        接口调用(F12-Network查看)
      </LoadingButton>
    </Stack>
  );
};

export default Request;
