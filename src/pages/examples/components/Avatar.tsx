import { Stack } from '@mui/material';
import React from 'react';
import Avatar from '@/components/Avatar';

export type IAvatarProps = {};

const ExamAvatar: React.FC<IAvatarProps> = ({}) => {
  return (
    <>
      <Stack direction="row" spacing={10}>
        <Avatar bgcolor="red">T</Avatar>
        <Avatar
          size={100}
          src="https://img2.baidu.com/it/u=2090606195,1473750087&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
        />
      </Stack>
    </>
  );
};

export default ExamAvatar;
