import React from 'react';
import { Redirect } from 'umi';

export type IRequestProps = {};

const Request: React.FC<IRequestProps> = ({}) => (
  <Redirect to="/request/market" />
);

export default Request;
