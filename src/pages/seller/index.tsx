import React from 'react';
import { Redirect } from 'umi';

export type ISellerProps = {};

const Seller: React.FC<ISellerProps> = ({}) => {
  return <Redirect to="/seller/profile" />;
};

export default Seller;
