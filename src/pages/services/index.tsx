import React from 'react';
import { Redirect, useLocation } from 'umi';

const Services = () => {
  const { query } = useLocation() as any;

  return (
    // TODO 没有 Service ID 的情况下应该跳转值缺省页
    <Redirect to="/services/0"></Redirect>
  );
};

export default Services;
