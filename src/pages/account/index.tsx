import React from 'react';
import { Redirect } from 'umi';

export type IAccountProps = {};

const Account: React.FC<IAccountProps> = ({}) => (
  <Redirect to="/account/profile" />
);

export default Account;
